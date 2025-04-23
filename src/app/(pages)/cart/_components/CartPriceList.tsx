'use client';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import { Tables } from '@/types/supabase';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import { useEffect, useState } from 'react';

interface CartProps {
  data: Tables<'cart'>[] | null;
  selectedItems: string[];
}
const DELIVERY_FEE = 2500;

export const CartPriceList = ({ data, selectedItems }: CartProps) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { discountAmount } = useCouponStore();

  useEffect(() => {
    const calculator =
      data?.reduce((acc, item) => {
        if (selectedItems.includes(item.product_id ?? '')) {
          const price = item.product_price ?? 0;
          const quantity = item.count ?? 0;
          const discountRate = (item.discountRate ?? 0) / 100;
          const discountedPrice = price - price * discountRate;
          return acc + discountedPrice * quantity;
        }
        return acc;
      }, 0) || 0;

    setTotalAmount(calculator);
  }, [data, selectedItems]);

  if (!data || (data.length === 0 && !selectedItems)) {
    return null;
  }

  const couponDiscountAmount =
    typeof discountAmount === 'number' ? discountAmount : 0;

  //총 결제금액
  const totalPrice = totalAmount + DELIVERY_FEE - couponDiscountAmount;

  return (
    <div className="bg-normal mt-2 pt-6 pb-[30%] md:pb-0">
      <ul className="flex flex-col mx-4 gap-2">
        <li className="flex justify-between">
          <p>총 상품 금액</p>
          <p>{`${totalAmount.toLocaleString()} 원`}</p>
        </li>
        <li className="flex justify-between">
          <p>배송비</p>
          <p>
            {selectedItems.length > 0
              ? `${DELIVERY_FEE.toLocaleString()} 원`
              : `0 원`}
          </p>
        </li>
        <li className="flex justify-between mb-4">
          <div className="flex items-center gap-1">
            <p>쿠폰 할인</p>
            <ChevronRightIcon />
          </div>
          <p>
            {selectedItems.length > 0
              ? `${discountAmount?.toLocaleString()} 원`
              : `0 원`}
          </p>
        </li>
        <li className="flex justify-between text-lg text-label-strong md:text-primary-20 font-semibold border-t-2 border-[#F2F2F2] pt-4">
          <p>결제 예정 금액</p>
          <p>
            {selectedItems.length > 0
              ? `${totalPrice.toLocaleString()} 원`
              : `0 원`}
          </p>
        </li>
      </ul>
    </div>
  );
};
