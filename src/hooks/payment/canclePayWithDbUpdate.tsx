//주문 취소(환불) 이후 db 업데이트하는 hook(optimistic update 적용)
//tanstack-query useMutation 사용

//update: 24.8.15

import { toast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  payment_id: string;
  newHistory: any;
}

export const usePaymentCancellation = () => {
  const queryClient = useQueryClient();

  //환불
  const cancelPayment = async (payment_id: string) => {
    const cancelResponse = await fetch('/api/payment/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentId: payment_id })
    });

    if (!cancelResponse.ok) {
      throw new Error('결제 취소 실패');
    }

    return cancelResponse;
  };

  //db 업데이트
  const updateOrderList = async (newHistory: any) => {
    const historyUpdate = await fetch('/api/payment/pay-supabase', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...newHistory })
    });
    return historyUpdate.json();
  };

  //query를 사용한 optimistic update
  const mutation = useMutation({
    mutationFn: async ({ payment_id, newHistory }: Props) => {
      await cancelPayment(payment_id);
      return updateOrderList(newHistory);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['payHistoryList'] });

      const previousHistory = queryClient.getQueryData(['payHistoryList']);

      queryClient.setQueryData(['payHistoryList'], (old: any[] = []) => {
        return old.map((item) =>
          item.payment_id === variables.payment_id
            ? { ...item, ...variables.newHistory }
            : item
        );
      });

      return { previousHistory };
    },
    onError: (err, variables, context: any) => {
      queryClient.setQueryData(['payHistoryList'], context.previousHistory);
      toast({
        variant: 'destructive',
        description: '주문 취소 실패. 다시 시도해주세요.'
      });
    },
    onSuccess: () => {
      toast({
        description: '주문이 성공적으로 취소되었습니다.'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['payHistoryList'] });
    }
  });

  return mutation;
};
