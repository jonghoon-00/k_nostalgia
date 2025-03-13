'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { BsListUl } from 'react-icons/bs';

const OrderList_mypage = () => {
  const route = useRouter();

  const gotoOrderlist = () => {
    route.push('/payment');
  };
  return (
    <div className="p-4">
      <div
        className="flex items-center py-[3px] cursor-pointer"
        onClick={gotoOrderlist}
      >
        <BsListUl className="mr-[8px] text-label-normal text-[20px]" />
        <span className="text-[16px]"> 주문 내역</span>
        <BsChevronRight className="ml-auto text-[#545454] cursor-pointer" />
      </div>
    </div>
  );
};

export default OrderList_mypage;
