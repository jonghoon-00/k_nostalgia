'use client';

import RadioGroup from '@/components/ui/RadioGroup';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';

const PaymentMethodSelect = () => {
  const { payMethod, setPayMethod } = usePaymentRequestStore();

  const paymentOptions = [
    { value: 'toss', label: '토스페이', icon: '/image/tossIcon.png' },
    { value: 'kakao', label: '카카오페이', icon: '/image/kakaoPayIcon.png' },
    { value: 'normal', label: '일반결제' }
  ];

  return (
    <div className="bg-white p-4 flex flex-col gap-2 rounded-[12px] border-2 border-[#E0E0E0] mb-4">
      <h2 className="text-label-strong text-[18px] font-semibold">결제 수단</h2>
      <div className="">
        <RadioGroup
          name="payMethod"
          options={paymentOptions.map((option) => ({
            value: option.value,
            label: (
              <div className="flex items-center gap-2">
                {option.icon && (
                  <img
                    src={option.icon}
                    alt={option.label}
                    width={17}
                    height={17}
                  />
                )}
                <span>{option.label}</span>
              </div>
            )
          }))}
          selectedValue={payMethod}
          onChange={setPayMethod}
          withDivider
        />
      </div>
    </div>
  );
};

export default PaymentMethodSelect;
