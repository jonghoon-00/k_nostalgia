'use client';
import { useUser } from '@/hooks/useUser';
import supabase from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface likeProps {
  marketId: number;
  userId: string;
  className?: string;
  isBlack?: boolean;
}

export const LikeButton = ({
  marketId,
  userId,
  className = '',
  isBlack = false
}: likeProps) => {
  const queryClient = useQueryClient();
  const { data: userData } = useUser();
  const router = useRouter();
  const guestCookie = Cookies.get('guest') === 'true';

  const {
    data: likeData,
    isPending,
    error
  } = useQuery({
    queryKey: ['likes', marketId, userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      //현재 사용자 좋아요 상태
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('market_id', marketId)
        .eq('user_id', userId);

      if (error) throw new Error(error.message);
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!likeData?.length) {
        await supabase
          .from('likes')
          .insert([{ market_id: marketId, user_id: userId }]);
        return true;
      } else {
        await supabase
          .from('likes')
          .delete()
          .eq('market_id', marketId)
          .eq('user_id', userId);
        return false;
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['likes', marketId, userId]
      });

      const previousLikes = queryClient.getQueryData([
        'likes',
        marketId,
        userId
      ]);

      queryClient.setQueryData(['likes', marketId, userId], (oldData: any) => {
        return oldData?.length
          ? []
          : [{ market_id: marketId, user_id: userId }];
      });

      return { previousLikes };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ['likes', marketId, userId],
        context?.previousLikes
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['likes', userId]
      });
    }
  });

  const handleLikeToggle = () => {
    if (!userData) {
      if (guestCookie) {
        Swal.fire({
          title: '비회원입니다',
          html: `
          <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">좋아요 기능을 사용하시려면 로그인해주세요</div>
        `,
          showCancelButton: true,
          cancelButtonColor: '#9C6D2E',
          confirmButtonColor: '#f2f2f2',
          cancelButtonText: '취소하기',
          confirmButtonText: '입장하기',
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
      Swal.fire({
        title: '로그인 후 이용해주세요',
        text: '로그인 페이지로 이동할까요?',
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
          router.push('/log-in');
        }
      });
      return;
    }
    mutation.mutate();
  };

  if (isPending) return <button disabled>guestCookie</button>;
  if (error) return <button disabled>오류</button>;

  return (
    <button onClick={handleLikeToggle}>
      {likeData && likeData.length > 0 ? (
        <GoHeartFill
          style={{ color: '#DB3B3B' }}
          className={` transition-transform duration-300 ease-in-out hover:scale-110 ${
            className ? className : 'w-[22px] h-[22px]'
          }`}
        />
      ) : (
        <GoHeart
          style={{ color: `${isBlack ? '#403D3A' : '#F6F5F3'}` }}
          className={` transition-transform duration-300 ease-in-out hover:scale-110 ${
            className ? className : 'w-[22px] h-[22px]'
          }`}
        />
      )}
    </button>
  );
};
