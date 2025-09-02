// 환불 + DB 업데이트 (optimistic update)
import { toast } from '@/components/ui/use-toast';
import { mutationKeys, queryKeys } from '@/constants/keys';
import { PayHistoryCache, Product } from '@/types/payHistory'; // [FIX] 캐시 타입만 사용
import { Tables } from '@/types/supabase';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

type OrderRow = Tables<'ordered_list'>;

interface MutationParams {
  payment_id: string;
  user_id: string;
  uiPatch: Partial<PayHistoryCache>; //캐시용
  dbPatch: Partial<OrderRow>; //db 업데이트용
}

/* ---------------- API ---------------- */

// 1) 결제 환불 요청
async function cancelPayment(payment_id: string): Promise<void> {
  const res = await fetch('/api/payment/transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId: payment_id })
  });

  if (!res.ok) {
    let msg = '결제 취소 실패';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
}

// 2) DB 업데이트 (서버가 갱신된 단일 row를 돌려준다는 전제)
async function updateOrderListDB(patch: Partial<OrderRow>): Promise<OrderRow> {
  const res = await fetch('/api/payment/pay-supabase', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });

  if (!res.ok) {
    let msg = '주문 내역 업데이트 실패';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

/* -------------- 캐시 유틸 -------------- */

// DB row(OrderRow)의 products(Json)를 캐시 타입(PayHistoryCache)의 products(Product[] | null)로 정규화
function toCache(row: OrderRow): PayHistoryCache {
  const raw = (row as any).products;
  let products: Product[] | null = null;
  try {
    products = Array.isArray(raw)
      ? (raw as Product[])
      : typeof raw === 'string'
      ? (JSON.parse(raw) as Product[])
      : raw && typeof raw === 'object'
      ? (raw as Product[])
      : null;
  } catch {
    products = null;
  }
  const { products: _omit, ...rest } = row as any;
  return { ...(rest as Omit<PayHistoryCache, 'products'>), products };
}

// 페이지형(InfiniteData) 캐시에서 대상 payment_id에 대해 patch 적용
function patchInInfinite(
  old: InfiniteData<PayHistoryCache[]> | undefined,
  paymentId: string,
  patch: Partial<PayHistoryCache>
): InfiniteData<PayHistoryCache[]> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) =>
      page.map((item) =>
        item.payment_id === paymentId ? { ...item, ...patch } : item
      )
    )
  };
}

function replaceInInfinite(
  old: InfiniteData<PayHistoryCache[]> | undefined,
  updated: OrderRow
): InfiniteData<PayHistoryCache[]> | undefined {
  if (!old) return old;
  const normalized = toCache(updated);
  return {
    ...old,
    pages: old.pages.map((page) =>
      page.map((item) =>
        item.payment_id === normalized.payment_id ? normalized : item
      )
    )
  };
}

type Ctx = {
  previous: InfiniteData<PayHistoryCache[]> | undefined;
};

export const usePaymentCancellation = (userId: string) => {
  const queryClient = useQueryClient();
  const listKey = queryKeys.payHistoryList(userId);

  return useMutation<OrderRow, Error, MutationParams, Ctx>({
    mutationKey: (mutationKeys as any)?.cancelPayment?.() ?? ['cancelPayment'],
    mutationFn: async ({ payment_id, dbPatch }) => {
      await cancelPayment(payment_id);
      return updateOrderListDB(dbPatch);
    },

    // 낙관적 업데이트: 페이지 캐시에서 해당 row만 patch(캐시 타입으로!)
    onMutate: async ({ payment_id, uiPatch }) => {
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });

      const previous =
        queryClient.getQueryData<InfiniteData<PayHistoryCache[]>>(listKey);

      queryClient.setQueryData<InfiniteData<PayHistoryCache[]> | undefined>(
        listKey,
        (old) => patchInInfinite(old, payment_id, uiPatch)
      );

      return { previous };
    },

    // 실패: 롤백
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(listKey, ctx.previous);
      }
      console.error('[refund] onError:', err);
      toast({
        variant: 'destructive',
        description:
          err?.message || '환불에 실패했습니다. 잠시 후 다시 시도해주세요.'
      });
    },

    // 성공: 서버 row로 확정 반영(교체) — DB row를 캐시 타입으로 정규화해서 교체
    onSuccess: (updated) => {
      queryClient.setQueryData<InfiniteData<PayHistoryCache[]> | undefined>(
        listKey,
        (old) => replaceInInfinite(old, updated)
      );
      toast({ description: '주문이 취소(환불)되었습니다.' });
    },

    // 후처리: 신선도 보장
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey, exact: true });
    }
  });
};
