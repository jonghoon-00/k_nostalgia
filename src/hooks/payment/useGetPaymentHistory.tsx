// feat: 주문 내역 단건 조회, 주문 내역 리스트 불러오기(무한스크롤 적용)
// update : 24.9.19

import { PayHistory } from '@/types/payHistory';
import { Tables } from '@/types/supabase';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

interface Props {
  paymentId: string | null;
}

//주문 내역 조회(단건)
//주문 완료 페이지에서 사용 - CompletePaymentContent.tsx
export const useGetPaymentHistory = ({ paymentId }: Props) => {
  const { data: payHistory, isPending: payHistoryIsPending } = useQuery<
    PayHistory,
    Error,
    PayHistory
  >({
    queryKey: ['payHistory', paymentId],
    queryFn: async () => {
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }
      const response = await fetch(
        `/api/payment/transaction?paymentId=${paymentId}`
      );
      return response.json();
    }
  });
  return { payHistory, payHistoryIsPending };
};

//supabase 주문내역 리스트 불러오기
//useInfiniteQuery 사용 (무한 스크롤 구현)
interface OrderedList extends Tables<'orderd_list'> {}

const fetchPaymentHistory = async (
  userId: string,
  page: number
): Promise<OrderedList[]> => {
  const response = await fetch(
    `/api/payment/pay-supabase?user_id=${userId}&page=${page}`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useGetPaymentHistoryWithSupabase = (
  userId: string | undefined
) => {
  const {
    data: payHistoryList,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<Tables<'orderd_list'>[], Error, Tables<'orderd_list'>[]>(
    {
      queryKey: ['payHistoryList', userId],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        fetchPaymentHistory(userId!, pageParam as number),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
      select: ({ pages }) => pages.flat()
    }
  );

  return {
    payHistoryList,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};
