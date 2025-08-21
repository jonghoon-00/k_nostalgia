//주문 내역 삭제 + optimistic update

import { toast } from '@/components/ui/use-toast';
import { mutationKeys, queryKeys } from '@/constants/keys';
import { PayHistory } from '@/types/payHistory';

import supabase from '@/utils/supabase/client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

async function fetchDeletePayHistory(payment_id: string){
  const { error } = await supabase
    .from('ordered_list')
    .delete()
    .eq('payment_id', payment_id);

  if (error) throw new Error(error.message)
}

const useDeletePayHistory = (userId: string) => {
  const queryClient = useQueryClient();
  const listKey = queryKeys.payHistoryList(userId);

  const mutation = useMutation({
    mutationKey: mutationKeys.deletePayHistory(),
    mutationFn: fetchDeletePayHistory,

    onMutate: async (deletedPaymentId) => {
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });
      const previousPayHistory = queryClient.getQueryData(listKey);

      queryClient.setQueryData<PayHistory[]>(listKey, (old) => {
        if (!old) return old; // 캐시가 없으면 그대로 반환
        return old.filter((item) => item.payment_id !== deletedPaymentId);
      });
      return { previousPayHistory };
    },

    onError: (err, _, context: any) => {
      if(context?.previousPayHistory){
        // 롤백
        queryClient.setQueryData(listKey, context.previousPayHistory);
      }
      toast({
        variant: 'destructive',
        description: '삭제에 실패했습니다. 새로고침 후 다시 시도해주세요.'
      });
    },

    onSuccess: () => {
      toast({
        description: '내역 삭제 완료.'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey, exact: true });
    }
  });

  return mutation;
};

export default useDeletePayHistory;
