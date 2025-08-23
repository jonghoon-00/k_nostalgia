'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';

import useDeviceSize from '@/hooks/useDeviceSize';

import RefreshIcon from '@/components/icons/RefreshIcon';
import { useCouponDiscount } from '@/hooks/coupon/useCouponDiscount';
import { useGetAllCoupons } from '@/hooks/coupon/useGetAllCoupons';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import { useModalStore } from '@/zustand/useModalStore';
import { CouponItem } from './CouponItem'; //하위 컴포넌트

export const CouponSelection: React.FC = () => {
  const { isMobile } = useDeviceSize();
  const close = useModalStore((state) => state.close);

  const setSelectedCouponIds = useCouponStore(
    (state) => state.setSelectedCouponIds
  );

  const coupons = useGetAllCoupons();
  const discountAmount = useCouponDiscount();

  const applyMaxDiscount = () => {
    setSelectedCouponIds(coupons.map((c) => c.id));
  };

  useEffect(() => {
    return () => {
      close();
    };
  }, [close]);

  const hasNoCoupons = coupons.length === 0;
  const couponList = () => {
    if (hasNoCoupons) {
      return (
        <div className="text-center text-gray-500 py-10">
          사용 가능한 쿠폰이 없어요.
        </div>
      );
    }
    return coupons.map((coupon) => (
      <CouponItem key={coupon.id} coupon={coupon} />
    ));
  };
  return (
    <div className={clsx('md:pb-4', 'px-0')}>
      {/* 할인액 표시 */}
      {!hasNoCoupons && (
        <div
          className={clsx(
            'flex flex-col items-start',
            'text-xl text-black font-medium'
          )}
        >
          현재 적용된 할인 금액은
          <div>
            <span className="text-primary-20">
              {discountAmount > 0 ? discountAmount.toLocaleString() : '0'}
            </span>
            <span>원이에요</span>
          </div>
        </div>
      )}

      {/* 쿠폰 리스트 */}
      <div className={clsx(!isMobile && 'min-w-[420px]')}>{couponList()}</div>

      {/* 버튼 영역 */}
      <div
        className={clsx(
          'gap-3',
          isMobile
            ? 'fixed bottom-0 left-0 w-full shadow-custom px-4 py-3'
            : 'mt-6',
          isMobile ? 'bg-white border-t' : '',
          'flex justify-between items-center'
        )}
      >
        <button
          onClick={applyMaxDiscount}
          className={clsx(
            'basis-1/3 flex items-center justify-center gap-1',
            'px-4 py-3',
            'text-gray-30 text-sm underline',
            'border border-gray-30 rounded-xl'
          )}
        >
          <RefreshIcon />
          최대 할인
        </button>
        <button
          className={clsx(
            'basis-2/3 flex items-center justify-center',
            'px-4 py-3',
            'bg-primary-20 text-white font-semibold',
            'rounded-xl'
          )}
          onClick={close}
        >
          {discountAmount.toLocaleString()}원 할인 적용
        </button>
      </div>
    </div>
  );
};
