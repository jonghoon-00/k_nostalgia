import RadioGroup from '@/components/ui/RadioGroup';
import { Skeleton } from '@/components/ui/skeleton';
import useDeviceSize from '@/hooks/useDeviceSize';
import { Tables } from '@/types/supabase';
import { calculateDiscount } from '@/utils/coupons';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import clsx from 'clsx';
import React, { useState } from 'react';

interface Props {
  coupon: Tables<'coupons'>;
}

export const CouponItem: React.FC<Props> = ({ coupon }) => {
  const { isMobile } = useDeviceSize();

  const discount = calculateDiscount([coupon]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCouponIds = useCouponStore((state) => state.selectedCouponIds);
  const updateCouponSelect = useCouponStore(
    (state) => state.updateCouponSelect
  );

  const isSelected = selectedCouponIds.includes(coupon.id);
  // RadioGroup에 넘겨줄 옵션
  const options = [
    {
      value: true,
      label: `즉시 할인 -${discount.toLocaleString()}원`
    },
    {
      value: false,
      label: '적용 안 함'
    }
  ];

  return (
    <div
      className={clsx(
        'p-4 mt-4',
        'border border-gray-80 rounded-xl',
        'bg-white'
      )}
    >
      <div
        className={clsx(
          'relative overflow-hidden rounded mb-2',
          isMobile ? 'w-[98%] h-0 pb-[44%]' : 'w-[420px] h-0 pb-[45%]'
        )}
      >
        {isLoading && <Skeleton className={clsx('absolute inset-0')} />}
        <img
          src={coupon.image_url ? coupon.image_url : ''}
          alt="쿠폰 이미지"
          onLoad={() => setIsLoading(false)}
          className={clsx(
            'absolute  transition-opacity',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
        />
      </div>

      <div className={clsx('flex flex-col gap-2', 'text-sm')}>
        <RadioGroup
          name={`coupon-${coupon.id}`}
          options={options}
          selectedValue={isSelected}
          onChange={(apply: boolean) => updateCouponSelect(coupon.id, apply)}
          withDivider={false}
          labelTextSize="15px"
        />
      </div>
    </div>
  );
};
