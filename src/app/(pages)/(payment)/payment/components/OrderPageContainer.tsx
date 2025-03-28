'use client';

import { AllAddresses } from '@/types/deliveryAddress';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import { useState } from 'react';
import DeliveryAddress from './(address)/DeliveryAddress ';
import CouponInPaymentPage from './CouponInPaymentPage';
import OrderProducts from './OrderProducts';
import OrderSummary from './OrderSummary';
import PaymentMethodSelect from './PaymentMethodSelect';

interface Props {
  initialAddresses: AllAddresses;
  initialShippingRequest: string;
}

const OrderPageContainer = ({
  initialAddresses,
  initialShippingRequest
}: Props) => {
  //배송 요청사항
  const [shippingRequest, setShippingRequest] = useState<string>(
    initialShippingRequest
  );
  //배송 요청사항 저장 여부
  const [shouldStoreDeliveryRequest, setShouldStoreDeliveryRequest] =
    useState(false);

  const { products, resetState, payMethod, isCouponApplied } =
    usePaymentRequestStore();

  // TODO 데스크탑에서만 주문/결제 이미지 표시 (png 파일 있는지 확인 후 없으면 추가)
  return (
    <main className="max-w-md mx-auto p-4 bg-normal mb-14 mt-16">
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
      <CouponInPaymentPage isCouponApplied={isCouponApplied} />

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
