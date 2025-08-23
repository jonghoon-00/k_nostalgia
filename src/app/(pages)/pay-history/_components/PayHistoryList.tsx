'use client';

import { usePathname } from 'next/navigation';
import { useInView } from 'react-intersection-observer';

import Loading from '@/components/common/Loading';
import TopIconInDesktop from './TopIconInDesktop';

import { usePayHistoryInfinite } from '@/hooks/payment/useGetPaymentHistory';
import { useUser } from '@/hooks/useUser';

import dayjs from 'dayjs';

//types
import { PayHistory, RenderPayHistoryList } from '@/types/payHistory';
//components
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import NoPayHistory from './NoPayHistory';
import PayHistoryItem from './PayHistoryItem';

dayjs.locale('ko');

const PayHistoryList = () => {
  const pathName = usePathname();
  const isPayHistoryPage = pathName === '/pay-history';

  const { data: user, isPending: userIsPending } = useUser();
  const userId = user?.id;

  const {
    payHistoryList,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = usePayHistoryInfinite(userId); //get list (query)

  const { ref, inView } = useInView({
    threshold: 0.1
  });
  // [{ date: [] }]로 그룹핑
  const orderList = useMemo(() => {
    if (!Array.isArray(payHistoryList)) return {} as RenderPayHistoryList;

    return payHistoryList.reduce<RenderPayHistoryList>((acc, order) => {
      // payment_date 안전 처리
      const rawDate = order?.payment_date;
      const formatted = rawDate
        ? dayjs(rawDate).format('YYYY. MM. DD')
        : '날짜 없음';

      if (!acc[formatted]) acc[formatted] = [];
      acc[formatted].push(order as PayHistory);
      return acc;
    }, {});
  }, [payHistoryList]);

  //날짜 최신순 정렬
  const sortedDates = useMemo(() => {
    const dates = Object.keys(orderList);
    return dates.sort((a, b) => Date.parse(b) - Date.parse(a));
  }, [orderList]);

  // 마이페이지: 가장 최근 날짜만
  const datesToRender = useMemo(() => {
    if (pathName === '/my-page') {
      return sortedDates.length > 0 ? [sortedDates[0]] : [];
    }
    return sortedDates;
  }, [pathName, sortedDates]);

  // 무한스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ----- jsx render -----
  if (userIsPending || isPending) {
    return <Loading />;
  }
  if (Object.keys(orderList).length === 0) {
    return (
      <>
        <NoPayHistory />
      </>
    );
  }
  return (
    <main
      className={clsx(
        'min-w-[375px]',
        'mx-auto',
        'bg-normal',
        'overflow-y-auto',
        'max-w-[737px]',
        // spacing
        'mb-[80px]',
        // md
        'md:w-full md:p-0',
        // 페이지 조건부 여백
        isPayHistoryPage && 'pt-[16px] mt-[3.25rem]'
      )}
    >
      <TopIconInDesktop />

      {datesToRender.map((date) => (
        <div
          key={date}
          className={clsx(isPayHistoryPage && 'pt-4 md:pt-7 md:pb-9')}
        >
          <div
            className={clsx(
              'flex items-center gap-[8px]',
              'ml-[4px] px-[16px]',
              'md:p-0 md:text-[18px]'
            )}
          >
            <p className="font-medium">{date}</p>
            <p className="font-medium">주문</p>
          </div>

          <PayHistoryItem orderList={orderList} date={date} />

          <hr className="border-2 border-[#F2F2F2]" />
        </div>
      ))}

      {isFetchingNextPage ? <Loading /> : hasNextPage && <div ref={ref} />}
    </main>
  );
};

export default PayHistoryList;
