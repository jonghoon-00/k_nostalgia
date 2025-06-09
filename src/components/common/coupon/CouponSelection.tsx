'use client';

import { getCouponList } from '@/app/api/coupon/getCouponForClient';
import RefreshIcon from '@/components/icons/RefreshIcon';
import useDeviceSize from '@/hooks/useDeviceSize';
import { Tables } from '@/types/supabase';
import { calculateDiscount } from '@/utils/coupons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { CouponItem } from './CouponItem';

interface Props {
  onChange: (discountAmount: number, selectedCouponIds: string[]) => void;
}

export const CouponSelection: React.FC<Props> = ({ onChange }) => {
  const [coupons, setCoupons] = useState<Tables<'coupons'>[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { isMobile } = useDeviceSize();

  useEffect(() => {
    const fetchCoupons = async () => {
      const result = await getCouponList();

      if (!result || result.length === 0) {
        console.warn('No coupons available');
        setCoupons([]);
        setSelectedIds([]);
        onChange(0, []);
        return;
      }
      setCoupons(result);
    };

    fetchCoupons();
  }, []);

  const toggleCoupon = (id: string, apply: boolean) => {
    let updated;
    if (apply) {
      updated = [...selectedIds, id];
    } else {
      updated = selectedIds.filter((cid) => cid !== id);
    }
    setSelectedIds(updated);
    const selected = coupons.filter((c) => updated.includes(c.id));
    onChange(calculateDiscount(selected), updated);
  };

  const applyMaxDiscount = () => {
    const allIds = coupons.map((c) => c.id);
    setSelectedIds(allIds);
    onChange(calculateDiscount(coupons), allIds);
  };

  const discountAmount = calculateDiscount(
    coupons.filter((c) => selectedIds.includes(c.id))
  );

  // );
  return (
    <div className={clsx('pb-4', isMobile ? 'px-0' : 'px-0')}>
      <div
        className={clsx(
          'flex flex-col items-start',
          'text-xl text-black font-medium'
          // !isMobile && 'min-h-16'
        )}
      >
        현재 적용된 할인 금액은
        <div>
          <span className={clsx('', 'text-primary-20')}>
            {discountAmount > 0 ? `${discountAmount.toLocaleString()}` : '0'}
          </span>
          <span>원이에요</span>
        </div>
      </div>

      <div className={clsx(!isMobile && 'min-h-[190px] min-w-[420px]')}>
        {coupons.map((coupon) => (
          <CouponItem
            key={coupon.id}
            coupon={coupon}
            isSelected={selectedIds.includes(coupon.id)}
            onChange={(apply) => toggleCoupon(coupon.id, apply)}
          />
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
        >
          {discountAmount.toLocaleString()}원 할인 적용
        </button>
      </div>
    </div>
  );
};
