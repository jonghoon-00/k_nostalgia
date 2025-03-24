'use client';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import { useEffect, useState } from 'react';
import CouponList from './CouponList';
import DownloadableCoupons from './DownloadableCoupons';

interface Props {
  coupon: string;
}

const CouponContents = ({ coupon }: Props) => {
  const [activeTab, setActiveTab] = useState('coupons');

  const { setCoupon } = useCouponStore();

  useEffect(() => {
    setCoupon(coupon);
    return () => {
      setCoupon(null);
    };
  }, []);

  return (
    <>
      {/* 쿠폰 탭 */}
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

      {/* 쿠폰 리스트 */}
      <div>{activeTab === 'coupons' && coupon && <CouponList />}</div>

      {/* 다운로드 가능한 쿠폰 */}
      <div className="flex justify-center items-center">
        {activeTab === 'download' && <DownloadableCoupons />}
      </div>
    </>
  );
};

export default CouponContents;
