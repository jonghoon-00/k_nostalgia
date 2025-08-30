import { queryKeys } from '@/constants/keys';

import { PortOnePayment } from '@/types/portone';
import { Tables } from '@/types/supabase';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';


async function fetchPayHistoryItem(paymentId: string, signal?: AbortSignal): Promise<PortOnePayment> {
  const res = await fetch(`/api/payment/transaction?paymentId=${paymentId}`, { signal });
  if (!res.ok) throw new Error('Failed to fetch payment history');
  return res.json();
};
async function fetchPayHistoryPage(
  userId: string,
  page: number,
  signal?: AbortSignal
): Promise<OrderedList[]>{
  const url = `/api/payment/pay-supabase?${new URLSearchParams({ user_id: userId, page: String(page) })}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Failed to fetch payment history list');
  return res.json();
};

// 주문 내역 단건 조회
export const useGetPayHistory = ({ paymentId }: { paymentId: string }) => {
  const { data: payment, isPending: paymentIsPending } = useQuery<
    PortOnePayment,
    Error,
    PortOnePayment
  >({
    queryKey: queryKeys.payHistory(paymentId),
    enabled: !!paymentId,
    queryFn: ({ signal }) => fetchPayHistoryItem(paymentId, signal),
    staleTime: 1000 * 60 * 10 // 10분
  });

  return { payment, paymentIsPending };
};

type OrderedList = Tables<'ordered_list'>

// 주문 내역 무한 스크롤 조회
export const usePayHistoryInfinite = (
  userId: string | undefined
) => {
  const {
    data: payHistoryList,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<Tables<'ordered_list'>[], Error, Tables<'ordered_list'>[]>(
    {
      queryKey: queryKeys.payHistoryList(userId!),
      enabled: !!userId,
      initialPageParam: 1,
      queryFn: ({ pageParam = 1, signal }) =>
        fetchPayHistoryPage(userId!, pageParam as number, signal),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
      select: ({ pages }) => pages.flat(),
      gcTime: 1000 * 60 * 10, // 10분
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
