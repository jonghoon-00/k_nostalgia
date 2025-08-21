// 환불 + db update (optimistic update)
import { toast } from '@/components/ui/use-toast';

import { queryKeys } from '@/constants/queryKeys';
import { Tables } from '@/types/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type OrderList  = Tables<'ordered_list'>;
interface MutationParams   {
  payment_id: string;
  patch: Partial<OrderList>;
}

// 환불 요청
async function cancelPayment( payment_id: string): Promise<void> {
  const res = await fetch('/api/payment/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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
//db 업데이트
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

export const usePaymentCancellation = (userId: string) => {
  const queryClient = useQueryClient();
const listKey = queryKeys.payHistoryList(userId);

  //query를 사용한 optimistic update
  const mutation = useMutation({
    mutationFn: async ({ payment_id, patch }: MutationParams ) => {
      await cancelPayment(payment_id);
      return updateOrderListDB(patch);
    },

    //optimistic update
    onMutate: async ({ payment_id, patch }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<OrderList[]>(listKey);

      queryClient.setQueryData<OrderList[]>(listKey, (old = []) =>
        old.map((item) =>
          item.payment_id === payment_id ? { ...item, ...patch } : item
        )
      );

      return { previous };
    },

    onError: (err, variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }
      toast({ variant: 'destructive', description: '잠시 후 다시 시도해주세요.' });
      console.error(err);
    },

    onSuccess: (updated) => {
      // 서버 결과를 리스트에 반영(불필요한 전체 invalidation 최소화)
      queryClient.setQueryData<OrderList[]>(listKey, (old = []) =>
        old.map((item) => (item.payment_id === updated.payment_id ? updated : item))
      );
      toast({ description: '주문이 취소되었습니다.' });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    }
  });
  return mutation;
};
