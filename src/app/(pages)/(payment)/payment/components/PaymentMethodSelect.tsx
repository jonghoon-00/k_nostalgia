'use client';

import RadioGroup from '@/components/ui/RadioGroup';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import clsx from 'clsx';
import Image from 'next/image';

const PaymentMethodSelect = () => {
  const payMethod = usePaymentRequestStore((state) => state.payMethod);
  const setPayMethod = usePaymentRequestStore((state) => state.setPayMethod);

  const paymentOptions = [
    { value: 'toss', label: '토스페이', icon: '/image/tossIcon.png' },
    { value: 'kakao', label: '카카오페이', icon: '/image/kakaoPayIcon.png' },
    { value: 'normal', label: '일반결제' }
  ];

  return (
    <div
      className={clsx(
        'bg-white',
        'p-4',
        'flex flex-col gap-2',
        'rounded-[12px]',
        'border border-[#E0E0E0]',
        'mb-4'
      )}
    >
      <h2 className={clsx('text-label-strong', 'text-[18px]', 'font-semibold')}>
        결제 수단
      </h2>

      <RadioGroup
        name="payMethod"
        options={paymentOptions.map((option) => ({
          value: option.value,
          label: (
            <div className={clsx('flex items-center', 'gap-2')}>
              <Image
                src={option.icon ?? '/image/Tigernew.png'}
                alt={option.label}
                width={17}
                height={17}
              />
              <span>{option.label}</span>
            </div>
          )
        }))}
        selectedValue={payMethod}
        onChange={setPayMethod}
        withDivider
      />
    </div>
  );
};

export default PaymentMethodSelect;
