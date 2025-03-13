'use client';

import { AllAddresses } from '@/types/deliveryAddress';
import supabase from '@/utils/supabase/client';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import DeliveryAddress from './(address)/DeliveryAddress ';
import CouponInPaymentPage from './CouponInPaymentPage';
import OrderProducts from './OrderProducts';
import OrderSummary from './OrderSummary';
import PaymentMethodSelect from './PaymentMethodSelect';

interface Props {
  initialAddresses: AllAddresses;
  user: User | null;
}

const OrderPageContainer = ({ initialAddresses, user }: Props) => {
  //배송 요청사항
  const [shippingRequest, setShippingRequest] = useState<string>('');
  //배송 요청사항 저장 여부
  const [shouldStoreDeliveryRequest, setShouldStoreDeliveryRequest] =
    useState(false);

  const getShippingRequest = async () => {
    const userId = user?.id;
    if (!userId) {
      return console.error('유저 정보를 찾을 수 없음');
    }

    const { data } = await supabase
      .from('users')
      .select('shippingRequest')
      .eq('id', userId)
      .single();

    if (data && data.shippingRequest) {
      setShippingRequest(data.shippingRequest);
    }
  };

  useEffect(() => {
    getShippingRequest();
  }, []);

  const { products, resetState, payMethod } = usePaymentRequestStore();

  return (
    <main className="max-w-md mx-auto p-4 bg-normal mb-14">
      {/* 배송지 */}
      <DeliveryAddress
        initialData={initialAddresses}
        shippingRequest={shippingRequest}
        shouldStoreDeliveryRequest={shouldStoreDeliveryRequest}
        setShippingRequest={setShippingRequest}
        setShouldStoreDeliveryRequest={setShouldStoreDeliveryRequest}
      />

      {/* 주문 상품 */}
      <OrderProducts products={products} resetState={resetState} />

      {/* 할인 쿠폰 */}
      {/* TODO 추후 작업.(구매 전 쿠폰 적용 작업 이후) */}
      <CouponInPaymentPage />

      {/* 결제 수단 선택 */}
      <PaymentMethodSelect />

      {/* 결제 요약(가격) 및 결제 버튼 */}
      <OrderSummary
        payMethod={payMethod}
        shippingRequest={shippingRequest}
        shouldStoreDeliveryRequest={shouldStoreDeliveryRequest}
        initialAddresses={initialAddresses}
      />
    </main>
  );
};

export default OrderPageContainer;
