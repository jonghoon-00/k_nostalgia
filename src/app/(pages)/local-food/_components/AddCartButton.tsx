import { Tables } from '@/types/supabase';
import supabase from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

type AddCartType = {
  food: Tables<'local_food'>;
  count: number | null;
  handleCartModalOpen: () => void;
};

export const AddCartButton = ({
  food,
  count,
  handleCartModalOpen
}: AddCartType) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const { data, error } = await supabase.from('cart').insert({
        product_id: food.product_id,
        count,
        image: food.title_image ? food.title_image[0] : null,
        product_name: food.food_name,
        product_price: food.price,
        user_id: user?.id,
        discountRate: food.discountRate,
        description: food.description
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onMutate: async (newCartItem) => {
      await queryClient.cancelQueries({
        queryKey: ['cart']
      });

      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], (oldData: any) => [
        ...oldData,
        newCartItem
      ]);

      return { previousCart };
    },
    onError: (err, newCartItem, context) => {
      queryClient.setQueryData(['cart'], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart']
      });
    }
  });

  const onAddCart = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (!user) {
      Swal.fire({
        title: '로그인 후 이용해주세요',
        html: `
        <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">로그인 페이지로 이동할까요?</div>
      `,
        showCancelButton: true,
        cancelButtonColor: '#9C6D2E',
        confirmButtonColor: '#f2f2f2',
        cancelButtonText: '취소하기',
        confirmButtonText: '이동하기',
        customClass: {
          title: 'text-xl mt-10 md:mb-[8px]',
          popup: 'rounded-[16px]',
          actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
          confirmButton:
            'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
          cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/log-in');
        }
      });
      return;
    }

    if (userError) {
      console.error('사용자 정보를 가져오지 못했습니다.', userError.message);
    }

    try {
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('*')
        .eq('product_id', food.product_id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (cartError) {
        alert('장바구니에 담기 중 에러가 발생했습니다.');
        return;
      }

      if (!cartData) {
        mutation.mutate();
      } else {
        Swal.fire({
          title: '이미 담긴 상품입니다',
          text: `장바구니로 이동하시겠습니까?`,
          showCancelButton: true,
          cancelButtonColor: '#f2f2f2',
          confirmButtonColor: '#9C6D2E',
          cancelButtonText: '취소하기',
          confirmButtonText: '이동하기',
          customClass: {
            title: 'text-xl mt-10',
            popup: 'rounded-[16px]',
            actions: 'flex gap-3 mt-8',
            confirmButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0',
            cancelButton:
              'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/cart');
          }
        });
        return;
      }
    } catch (error) {
      console.error('장바구니 담기 중 오류가 발생했습니다.', error);
    }
    handleCartModalOpen();
  };
  return (
    <button
      onClick={onAddCart}
      className="min-w-[165px] text-primary-strong font-semibold border-2 border-primary-strong py-3 px-4 rounded-xl flex-1"
    >
      장바구니에 담기
    </button>
  );
};
