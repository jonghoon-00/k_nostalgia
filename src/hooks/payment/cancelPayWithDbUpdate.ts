// 환불 + db update (optimistic update)
import { toast } from '@/components/ui/use-toast';
import { queryKeys } from '@/constants/keys';
import { Tables } from '@/types/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type OrderList = Tables<'ordered_list'>;

interface MutationParams {
  payment_id: string;
  user_id: string;
  patch: Partial<OrderList>;
}

// 환불 요청
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

// DB 업데이트
async function updateOrderListDB(patch: Partial<OrderList>): Promise<OrderList> {
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

export const usePaymentCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderList, Error, MutationParams, { previous?: OrderList[]; listKey: readonly unknown[] }>({
    mutationFn: async ({ payment_id, patch }) => {
      await cancelPayment(payment_id);
      return updateOrderListDB(patch);
    },

    // optimistic update
    onMutate: async (vars) => {
      const listKey = queryKeys.payHistoryList(vars.user_id);

      await queryClient.cancelQueries({ queryKey: listKey });

      const previous = queryClient.getQueryData<OrderList[]>(listKey);

      queryClient.setQueryData<OrderList[]>(listKey, (old = []) =>
        old.map((item) =>
          item.payment_id === vars.payment_id ? { ...item, ...vars.patch } : item
        )
      );

      return { previous, listKey };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(ctx.listKey, ctx.previous);
      }
      toast({ variant: 'destructive', description: '잠시 후 다시 시도해주세요.' });
      console.error(err);
    },

    onSuccess: (updated, _vars, ctx) => {
      // 서버 결과 반영
      queryClient.setQueryData<OrderList[]>(ctx.listKey, (old = []) =>
        old.map((item) => (item.payment_id === updated.payment_id ? updated : item))
      );
      toast({ description: '주문이 취소되었습니다.' });
    },

    onSettled: (_data, _err, _vars, ctx) => {
      queryClient.invalidateQueries({ queryKey: ctx?.listKey });
    }
  });
};
