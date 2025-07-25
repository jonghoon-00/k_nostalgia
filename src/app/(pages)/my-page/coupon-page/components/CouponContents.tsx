'use client';

import NoList from '@/components/common/NoList';
import clsx from 'clsx';
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
      <div
        className={clsx(
          'flex w-[50vw] min-w-[375px] md:w-full justify-between md:justify-center items-center gap-4 mt-[15px]',
          'mx-auto mt-[15px]'
        )}
      >
        {['coupons', 'download'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'px-6 py-2 border-b-4 text-[16px]',
              activeTab === tab
                ? 'text-primary-20 border-primary-20'
                : 'text-label-assistive border-transparent'
            )}
          >
            {tab === 'coupons' ? '사용 가능 쿠폰' : '쿠폰 다운로드'}
          </button>
        ))}
      </div>

      <div className="border border-[#F2F2F2]" />

      {/* 쿠폰 콘텐츠 */}
      <div className={clsx('flex justify-center items-center')}>
        {activeTab === 'coupons' && (
          <div className={clsx('w-[90%] md:w-full', 'p-4 md:p-8')}>
            {couponListContent}
          </div>
        )}

        {activeTab === 'download' && (
          <NoList message="다운로드 가능한 쿠폰이 없어요" />
        )}
      </div>
    </>
  );
};

export default CouponContents;
