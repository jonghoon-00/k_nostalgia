'use client';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import React, { useState } from 'react';

const CouponPage = () => {
  const { data: user, isLoading, error } = useUser();

  const [activeTab, setActiveTab] = useState('coupons');

  return (
    <div className=" p-4 bg-normal mt-20">
      <div className="hidden md:mb-[48px] md:flex">
        <Image
          src="/image/Coupon_Tiger2.png"
          alt="마이페이지 쿠폰호랑이 "
          width={141}
          height={88}
          className="w-[141px] h-[88px]"
        />
      </div>

      <div className="border-4 border-[#F2F2F2]" />
      <div className="flex mt-[15px] mx-auto w-[95%] justify-between items-center md:items-center md:justify-center md:gap-4">
        <div>
          <button
            className={`px-6 py-2 border-b-4 text-[16px] ${
              activeTab === 'coupons'
                ? 'text-primary-20 border-primary-20'
                : 'text-label-assistive border-transparent'
            }`}
            onClick={() => setActiveTab('coupons')}
          >
            사용 가능 쿠폰
          </button>
        </div>

        <div>
          <button
            className={`px-6 py-2 border-b-4 text-[16px] ${
              activeTab === 'download'
                ? 'text-primary-20 border-primary-20'
                : 'text-label-assistive border-transparent'
            }`}
            onClick={() => setActiveTab('download')}
          >
            쿠폰 다운로드
          </button>
        </div>
      </div>

      <div className="border border-[#F2F2F2]" />

      <div>
        {activeTab === 'coupons' && user?.coupon && (
          <Image
            src={user?.coupon}
            alt="profile"
            width={640}
            height={161}
            priority
            className="w-auto h-[161px] mt-[15px] md:w-[640px] md:h-[280px]"
          />
        )}
      </div>

      <div className="flex justify-center items-center">
        {activeTab === 'download' && (
          <div className="flex-col items-center mt-[217px]">
            <Image
              src="/image/StateSad.png"
              alt="쿠폰없을때"
              width={114}
              height={97}
              className="w-[114px] h-[97px] mx-auto md:w-[114px] md:h-[97px]"
            />
            <p className="text-label-assistive mt-4">
              {' '}
              다운로드 가능한 쿠폰이 없어요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponPage;
