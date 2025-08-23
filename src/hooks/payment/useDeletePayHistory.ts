import { toast } from '@/components/ui/use-toast';
import { mutationKeys, queryKeys } from '@/constants/keys';
import { PayHistory } from '@/types/payHistory';
import supabase from '@/utils/supabase/client';
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

async function fetchDeletePayHistory(payment_id: string) {
  const { error } = await supabase
    .from('ordered_list')
    .delete()
    .eq('payment_id', payment_id);

  if (error) {
    console.error('Error deleting payment history:', error);
    throw new Error(error.message);
  }
}

function removeFromInfinite(
  old: InfiniteData<PayHistory[]> | undefined,
  paymentId: string
): InfiniteData<PayHistory[]> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) =>
      page.filter((item) => item.payment_id !== paymentId)
    )
  };
}

type Context = {
  previous: InfiniteData<PayHistory[]> | undefined;
};

const useDeletePayHistory = (userId: string) => {
  const queryClient = useQueryClient();
  const listKey = queryKeys.payHistoryList(userId);

  return useMutation<void, Error, string, Context>({
    mutationKey: mutationKeys.deletePayHistory(),
    mutationFn: fetchDeletePayHistory,

    onMutate: async (deletedPaymentId) => {
      await queryClient.cancelQueries({ queryKey: listKey, exact: true });

      const prev =
        queryClient.getQueryData<InfiniteData<PayHistory[]>>(listKey);

      queryClient.setQueryData<InfiniteData<PayHistory[]> | undefined>(
        listKey,
        (old) => removeFromInfinite(old, deletedPaymentId)
      );

      return { previous: prev }; // Context 타입과 맞음
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(listKey, ctx.previous);
      }
      console.error('[delete] onError:', err);
      toast({
        variant: 'destructive',
        description:
          err?.message || '삭제에 실패했습니다. 새로고침 후 다시 시도해주세요.'
      });
    },

    onSuccess: () => {
      toast({ description: '내역 삭제 완료.' });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey, exact: true });
    }
  });
};

export default useDeletePayHistory;
