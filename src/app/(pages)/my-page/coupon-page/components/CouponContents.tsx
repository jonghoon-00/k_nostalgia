'use client';

import NoList from '@/components/common/NoList';
import React, { useState } from 'react';
import CouponItem from './CouponItem';

interface Props {
  imageUrlList: string[];
  hasNoList?: boolean;
}

const CouponContents: React.FC<Props> = ({ imageUrlList, hasNoList }) => {
  const [activeTab, setActiveTab] = useState('coupons');

  let couponListContent: JSX.Element | JSX.Element[];

  if (hasNoList) {
    couponListContent = <NoList message="사용 가능한 쿠폰이 없어요" />;
  } else {
    couponListContent = imageUrlList.map((imageUrl) => (
      <CouponItem imageUrl={imageUrl} key={imageUrl} />
    ));
  }

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
      <>
        {activeTab === 'coupons' && (
          <div className="p-4 md:p-8">{couponListContent}</div>
        )}

        {/* 다운로드 가능한 쿠폰 */}
        <div className="flex justify-center items-center">
          {activeTab === 'download' && (
            <NoList message="다운로드 가능한 쿠폰이 없어요" />
          )}
        </div>
      </>
    </>
  );
};

export default CouponContents;
