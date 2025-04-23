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
  // 쿠폰 변경 및 배송지 변경시 false로 변경
  const [isShowPaymentRender, setIsShowPaymentRender] = useState(true); //결제 페이지 렌더링 여부
  //근데 이런식으로 렌더링 전환하면 새로고침하면 되돌아가잖음;
  //새로고침해도 유지되는 페이지 전환 방식 고려
  // (ex. 세션스토리지지  )

  //배송 요청사항
  const [shippingRequest, setShippingRequest] = useState<string>(
    initialShippingRequest
  );
  //배송 요청사항 저장 여부
  const [shouldStoreDeliveryRequest, setShouldStoreDeliveryRequest] =
    useState(false);

  const { products, resetState, isCouponApplied } = usePaymentRequestStore();

  return (
    <>
      {isShowPaymentRender && (
        <main className="mx-auto md:max-w-[1080px] p-4 md:p-0 bg-normal mb-14 mt-16 md:mt-0 md:flex md:gap-6">
          <div className="md:max-w-[681px] md:flex-1">
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
            <CouponInPaymentPage
              isCouponApplied={isCouponApplied}
              setIsShowPaymentRender={setIsShowPaymentRender}
            />

            {/* 결제 수단 선택 */}
            <PaymentMethodSelect />
          </div>

          {/* 결제 요약(가격) 및 결제 버튼 */}
          <div className="md:w-[375px] md:shrink-0">
            <OrderSummary
              shippingRequest={shippingRequest}
              shouldStoreDeliveryRequest={shouldStoreDeliveryRequest}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default OrderPageContainer;
