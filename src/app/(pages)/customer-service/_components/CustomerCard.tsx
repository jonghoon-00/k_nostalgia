'use client';
import Announcement from '@/components/icons/Announcement';
import BulkOrder from '@/components/icons/BulkOrder';
import FAQ from '@/components/icons/FAQ';
import SellerRegister from '@/components/icons/SellerRegister';
import { useRouter } from 'next/navigation';
import React from 'react';

const CustomerCard = () => {
  const router = useRouter();

  const handleannounceClick = () => {
    router.push('/customer-service/announcement');
  };

  const handlefaqClick = () => {
    router.push('/customer-service/faq-page');
  };
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      {/* 공지사항 */}
      <div
        className="cursor-pointer flex flex-col items-center justify-center border border-primary-20 bg-white rounded-[6px] w-[166px] h-[140px]"
        onClick={handleannounceClick}
      >
        <Announcement />
        <span className="mt-[10px] text-primary-10 font-medium text-base">
          공지사항
        </span>
      </div>

      {/* 자주 묻는 질문 */}
      <div
        className="cursor-pointer flex flex-col items-center justify-center border border-primary-20 bg-white rounded-[6px] w-[166px] h-[140px]"
        onClick={handlefaqClick}
      >
        <FAQ />
        <span className="mt-[10px] text-primary-10 font-medium text-base">
          자주 묻는 질문
        </span>
      </div>

      {/* 대량 주문 문의 */}
      <div className="cursor-pointer flex flex-col items-center justify-center border border-primary-20 bg-white rounded-[6px] w-[166px] h-[140px]">
        <BulkOrder />
        <span className="mt-[10px] text-primary-10 font-medium text-base">
          대량 주문 문의
        </span>
      </div>

      {/* 판매자 등록 문의 */}
      <div className="cursor-pointer flex flex-col items-center justify-center border border-primary-20 bg-white rounded-[6px] w-[166px] h-[140px]">
        <SellerRegister />
        <span className="mt-[10px] text-primary-10 font-medium text-base">
          판매자 등록 문의
        </span>
      </div>
    </div>
  );
};

export default CustomerCard;
