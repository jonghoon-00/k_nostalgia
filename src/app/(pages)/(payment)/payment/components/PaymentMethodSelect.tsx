'use client';

import RadioGroup from '@/components/ui/RadioGroup';
import { toast } from '@/components/ui/use-toast';
import {
  isPayMethod,
  usePaymentRequestStore
} from '@/zustand/payment/usePaymentStore';
import clsx from 'clsx';
import Image from 'next/image';

type PaymentOption = {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
};

const PaymentMethodSelect = () => {
  const payMethod = usePaymentRequestStore((state) => state.payMethod);
  const setPayMethod = usePaymentRequestStore((state) => state.setPayMethod);

  const paymentOptions: PaymentOption[] = [
    {
      value: 'toss',
      label: '토스페이',
      icon: '/image/tossIcon.png',
      disabled: true
    },
    { value: 'kakao', label: '카카오페이', icon: '/image/kakaoPayIcon.png' },
    { value: 'normal', label: '일반결제' }
  ] as const;

  const handleChange = (value: string) => {
    if (value === 'toss') {
      toast({ description: '현재 토스페이는 일시적으로 사용할 수 없어요.' });
      return; // 상태 변경 막기
    }
    if (!isPayMethod(value)) return;
    setPayMethod(value);
  };

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
          // aria-disabled 전달(컴포넌트가 받아주지 않더라도 UI/접근성 힌트)
          'aria-disabled': option.disabled ? true : undefined,
          label: (
            <div
              className={clsx(
                'flex items-center gap-2',
                option.disabled && 'opacity-50 cursor-not-allowed select-none'
              )}
              title={option.disabled ? '현재 사용 불가' : undefined}
              // 라벨 자체 클릭 시도에도 방어(만약 RadioGroup이 라벨 클릭을 직접 처리한다면)
              onClick={(e) => {
                if (option.disabled) {
                  e.preventDefault();
                  e.stopPropagation();
                  toast({
                    description: '현재 토스페이는 일시적으로 사용할 수 없어요.'
                  });
                }
              }}
            >
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
        onChange={handleChange}
        withDivider
      />
    </div>
  );
};

export default PaymentMethodSelect;
