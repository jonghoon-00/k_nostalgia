'use client';

import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';

const PaymentMethodSelect = () => {
  const paymentMethods = ['토스페이', '카카오페이', '일반결제'];
  const { payMethod, setPayMethod } = usePaymentRequestStore();

  return (
    <div className="bg-white p-4 flex flex-col gap-2 rounded-[12px] border-2 border-[#E0E0E0] mb-4">
      <h2 className="text-label-strong text-[18px] font-semibold">결제 수단</h2>
      <div className="">
        {paymentMethods.map((method) => (
          <label key={method} className="flex gap-1 items-center">
            <input
              type="radio"
              name="payment"
              value={method}
              checked={payMethod === method}
              onChange={() => setPayMethod(method)}
              className="accent-primary-20 w-5"
            />
            <span className="text-gray-700">{method}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelect;
