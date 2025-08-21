'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Loading from '@/components/common/Loading';
import TopIconInDesktop from './TopIconInDesktop';

import { usePayHistoryInfinite } from '@/hooks/payment/useGetPaymentHistory';
import { useUser } from '@/hooks/useUser';

import {
  BaseOrderInPayHistory,
  OrderListInPayHistory
} from '@/types/payHistory';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import NoPayHistory from './NoPayHistory';
import PayHistoryItem from './PayHistoryItem';

const PayHistoryList = () => {
  const pathName = usePathname();

  const { data: user } = useUser();
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

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!payHistoryList || isPending) {
    return <Loading />;
  }

  //list 기존 형식 : array
  //[{date : []}] 형식으로 변환 - 날짜별로 묶기
  const orderList = payHistoryList.reduce<OrderListInPayHistory>(
    (acc, order: BaseOrderInPayHistory) => {
      const date = dayjs(order.payment_date).format('YYYY. MM. DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(order);
      return acc;
    },
    {}
  );

  //날짜 최신순 정렬
  const sortedDates = Object.keys(orderList).sort(
    (a, b) => Date.parse(b) - Date.parse(a)
  );

  //마이페이지에선 가장 최근 날짜의 내역만 렌더링
  const datesToRender =
    pathName === '/my-page' ? [sortedDates[0]] : sortedDates;

  return (
    <>
      {Object.keys(orderList).length === 0 ? (
        <NoPayHistory />
      ) : (
        <main
          className={`min-w-[375px] mb-[80px] mx-auto bg-normal max-w-[737px] md:w-full md:p-0 overflow-y-auto  ${
            pathName === '/pay-history' && 'pt-[16px] mt-[3.25rem]'
          }`}
        >
          <TopIconInDesktop />
          {datesToRender.map((date) => (
            <div
              key={date}
              className={`${
                pathName === '/pay-history' && 'pt-4 md:pt-7 md:pb-9'
              }`}
            >
              <div className="flex gap-[8px] ml-[4px] px-[16px] md:p-0 md:text-[18px]">
                <p className="font-medium">{date}</p>
                <p className="font-medium">주문</p>
              </div>
              <PayHistoryItem orderList={orderList} date={date} />
              <hr className="border-2 border-[#F2F2F2]" />
            </div>
          ))}
          {isFetchingNextPage ? <Loading /> : hasNextPage && <div ref={ref} />}
        </main>
      )}
    </>
  );
};

export default PayHistoryList;
