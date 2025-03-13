import supabase from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('product_id', productId);

      if (error) {
        throw new Error('상품을 삭제하지 못했습니다.' + error.message);
      }
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ['cart']
    //   });
    // }
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({
        queryKey: ['cart']
      }); // 기존 쿼리 취소

      const previousCart = queryClient.getQueryData(['cart']); // 기존 데이터 저장

      // optimistic update
      queryClient.setQueryData(['cart'], (oldData: any[]) => {
        return oldData.filter((item) => item.product_id !== productId);
      });

      return { previousCart }; // 롤백을 위한 이전 데이터 반환
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cart'], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart']
      }); // 쿼리 무효화
    }
  });
};
