'use client';

import Loading from '@/components/common/Loading';
import supabase from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

import PayButton from '@/components/ui/PayButton';
import { useState } from 'react';
import { AddCartButton } from '../../../_components/AddCartButton';
import { CountButton } from '../CountButton';
import { DeliveryInfo } from '../DeliveryInfo';
import { DiscountAmount } from '../DiscountAmount';

const DELIVERY = 2500;
const COUPON = 2000;

export const ProductDetail = ({
  id,
  handleCartModalOpen
}: {
  id: string;
  handleCartModalOpen: () => void;
}) => {
  const [count, setCount] = useState(1);
  const {
    data: orderData,
    isPending,
    error
  } = useQuery({
    queryKey: ['localfood', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_food')
        .select('*')
        .eq('product_id', id)
        .single();

      if (error) throw new Error(error.message);

      return data;
    }
  });

  const discountRate = (orderData?.discountRate ?? 0) / 100;
  const discountAmount =
    (orderData?.price ?? 0) - (orderData?.price ?? 0) * discountRate;

  const product = [
    {
      id: orderData?.product_id || '',
      name: orderData?.food_name || null,
      amount: discountAmount * (count ?? 0),
      quantity: count ?? 0
    }
  ];

  if (isPending) return <Loading />;
  if (error) return <div>오류 {error.message}</div>;

  return (
    <div className="w-[540px] bg-white rounded-tr-[12px] rounded-br-[12px] border border-l-0 border-[#E0E0E0]">
      <div className="flex px-8 justify-between py-10">
        <div className="flex-auto">
          <h2 className="font-semibold text-label-strong text-xl">
            {`[${orderData.location}]`} {orderData.food_name}
          </h2>
          <p className="font-normal text-label-assistive text-sm mb-3">
            {orderData.description}
          </p>

          <div className="pb-4 mb-4 border-b-4 border-[#F2F2F2]">
            <DiscountAmount food={orderData} totalSize="xl" />
          </div>

          <DeliveryInfo />
          <div className="mt-4 py-4 flex items-center justify-between border-t-2 border-b-2 border-[#f2f2f2]">
            <p>수량</p>
            <CountButton count={count} onCountChange={setCount} />
          </div>
          <div className="pt-4 pb-1 flex items-center justify-between">
            <p className="font-semibold">총 상품 금액</p>
            <h1 className="text-label-strong text-xl">
              <strong className="text-2xl font-bold ">{`${(
                discountAmount * count
              ).toLocaleString()}`}</strong>
              원
            </h1>
          </div>
          <div className="pb-4 flex items-center justify-between">
            <p className="font-semibold">쿠폰 할인 금액</p>
            <h1 className="text-primary-20 text-xl">
              <strong className="text-2xl font-bold ">{`${(
                discountAmount * count +
                DELIVERY -
                COUPON
              ).toLocaleString()}`}</strong>
              원
            </h1>
          </div>
          <div className="flex gap-2">
            <AddCartButton
              food={orderData}
              count={count}
              handleCartModalOpen={handleCartModalOpen}
            />
            <PayButton
              product={product}
              orderNameArr={[orderData.food_name]}
              text={'바로 구매하기'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
