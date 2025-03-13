'use client';
import CustomerIcon from '@/components/icons/CustomerIcon';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';

const GotoCustomer = () => {
  const router = useRouter();

  const handleCustomerClick = () => {
    router.push('/customer-service');
  };
  return (
    <div className="p-4">
      <div
        className="flex items-center py-[3px] cursor-pointer"
        onClick={handleCustomerClick}
      >
        <CustomerIcon />
        <span className="text-[16px] ml-2"> 고객센터 </span>
      </div>
    </div>
  );
};

export default GotoCustomer;
