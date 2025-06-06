import RadioGroup from '@/components/ui/RadioGroup';
import { Tables } from '@/types/supabase';
import { calculateDiscount } from '@/utils/coupons';
import clsx from 'clsx';
import React from 'react';

interface Props {
  coupon: Tables<'coupons'>;
  isSelected: boolean;
  onChange: (apply: boolean) => void;
}

export const CouponItem: React.FC<Props> = ({
  coupon,
  isSelected,
  onChange
}) => {
  const discount = calculateDiscount([coupon]);

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
        'bg-white',
        'space-y-2'
      )}
    >
      <img
        src={coupon.image_url}
        alt="쿠폰 이미지"
        className={clsx('w-[640px]', 'h-auto', 'rounded')}
      />

      <div className={clsx('flex flex-col gap-2', 'text-sm')}>
        <RadioGroup
          name={`coupon-${coupon.id}`}
          options={options}
          selectedValue={isSelected}
          onChange={(value: boolean) => onChange(value)}
          withDivider={false}
          labelTextSize="15px"
        />
      </div>
    </div>
  );
};
