'use client';

import supabase from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useUserCartData = () => {
  const {
    data: cartData,
    isPending,
    error
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (!user) return [];
      if (userError) console.error(userError.message);

      const { data: productData, error } = await supabase
        .from('cart')
        .select('*, cart:product_id(*)') //product_id 필드를 기준으로 cart 테이블의 모든 정보 가져오기
        .eq('user_id', user.id);

      if (error) throw new Error(error.message);

      return productData.sort((a, b) => {
        const idA = a.product_id ?? '';
        const idB = b.product_id ?? '';
        return idA.localeCompare(idB);
      });
    }
  });
  return { cartData, isPending, error };
};
