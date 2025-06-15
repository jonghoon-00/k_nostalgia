// components/CouponSelection.tsx
'use client';

import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { getCouponList } from '@/app/api/coupon/getCouponForClient';
import useDeviceSize from '@/hooks/useDeviceSize';
import { Tables } from '@/types/supabase';
import { calculateDiscount } from '@/utils/coupons';

import RefreshIcon from '@/components/icons/RefreshIcon';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import { useModalStore } from '@/zustand/useModalStore';
import { CouponItem } from './CouponItem';

interface Props {
  handleCouponChange: (
    discountAmount: number,
    selectedCouponIds: string[]
  ) => void;
}

export const CouponSelection: React.FC<Props> = ({ handleCouponChange }) => {
  const { close } = useModalStore();

  // zustand에서 선택된 ID들
  const selectedIds = useCouponStore((s) => s.selectedCouponIds);
  const clearCouponIds = useCouponStore((s) => s.clearCouponIds);

  const [coupons, setCoupons] = useState<Tables<'coupons'>[]>([]);
  const { isMobile } = useDeviceSize();

  // 쿠폰 리스트 조회
  useEffect(() => {
    (async () => {
      const result = await getCouponList();
      if (!result || result.length === 0) {
        console.warn('No coupons available');
        setCoupons([]);
        clearCouponIds();
        handleCouponChange(0, []);
        return;
      }
      setCoupons(result);
    })();
  }, [clearCouponIds, handleCouponChange]);

  // 선택된 ID가 바뀔 때마다 할인액 계산 및 상위 콜백 호출
  useEffect(() => {
    const applied = coupons.filter((c) => selectedIds.includes(c.id));
    const amount = calculateDiscount(applied);
    handleCouponChange(amount, selectedIds);
  }, [selectedIds, coupons, handleCouponChange]);

  // 최대 할인 적용
  const applyMaxDiscount = () => {
    const allIds = coupons.map((c) => c.id);
    useCouponStore.getState().setSelectedCouponIds(allIds);
  };

  const discountAmount = calculateDiscount(
    coupons.filter((c) => selectedIds.includes(c.id))
  );

  return (
    <div className={clsx('md:pb-4', 'px-0')}>
      {/* 할인액 표시 */}
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

      {/* 쿠폰 리스트 */}
      <div className={clsx(!isMobile && 'min-h-[190px] min-w-[420px]')}>
        {coupons.map((coupon) => (
          <CouponItem key={coupon.id} coupon={coupon} />
        ))}
      </div>

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
