import { Tables } from '@/types/supabase';
import { useEffect, useState } from 'react';

interface OrderProps {
  data: Tables<'local_food'>;
  count: number | null;
}
const DELIVERY_FEE = 2500;
const COUPON = 2000;

export const TotalPriceList = ({ data, count }: OrderProps) => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (data && data.price && count) {
      const discountRate = (data.discountRate ?? 0) / 100;
      const discountAmount = data.price - data.price * discountRate;
      setTotalAmount(discountAmount * count);
    }
  }, [data, count]);

  const totalPrice = totalAmount + DELIVERY_FEE - COUPON;

  return (
    <div className="bg-normal mt-2 pt-6 pb-20 ">
      <ul className="flex flex-col gap-2 px-4">
        <li className="flex justify-between">
          <p>총 상품 금액</p>
          <p>{`${totalAmount.toLocaleString()} 원`}</p>
        </li>
        <li className="flex justify-between">
          <p>배송비</p>
          <p>{`${DELIVERY_FEE.toLocaleString()} 원`}</p>
        </li>
        <li className="flex justify-between mb-4">
          <p>상품 할인 금액</p>
          <p>{`-${COUPON.toLocaleString()} 원`}</p>
        </li>
        <li className="flex justify-between text-lg text-label-strong font-semibold border-t-2 border-[#F2F2F2] pt-4">
          <p>결제 예정 금액</p>
          <p>{`${totalPrice.toLocaleString()} 원`}</p>
        </li>
      </ul>
    </div>
  );
};
