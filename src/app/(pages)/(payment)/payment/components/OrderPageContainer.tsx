'use client';

//역할 분리 필요
// 상태 관리가 집중돼 있음, 렌더링 조건 분기까지 직접 처리, 모든 주요 UI를 직접 포함
// OrderPageContainer : 레이아웃 및 상위 상태만 담당 (순수 컨테이너 역할)
// OrderPageMain : 실제 UI 렌더링 (main 내부 렌더링 분리)
// useOrderPageState.ts : 로컬 상태를 하나의 커스텀 훅으로 묶어서 로직 분리

import { fetchCouponsByIds } from '@/app/api/coupon/getCouponForClient';
import { AllAddresses } from '@/types/deliveryAddress';
import { Tables } from '@/types/supabase';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import { useEffect, useState } from 'react';
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
  const selectedIds = useCouponStore((state) => state.selectedCouponIds);
  const [coupons, setCoupons] = useState<Tables<'coupons'>[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(
    coupons.reduce((acc, coupon) => acc + (coupon.amount ?? 0), 0)
  );

  useEffect(() => {
    const loadCoupons = async () => {
      if (selectedIds.length === 0) {
        setCoupons([]);
        setDiscountAmount(0);
        return;
      }

      const result = await fetchCouponsByIds(selectedIds);
      const list = result ?? [];
      setCoupons(list);

      // 할인액 합산
      const total = list.reduce((sum, c) => sum + (c.amount ?? 0), 0);
      setDiscountAmount(total);
    };

    loadCoupons();
  }, [selectedIds]);

  //배송 요청사항
  const [shippingRequest, setShippingRequest] = useState<string>(
    initialShippingRequest
  );
  //배송 요청사항 저장 여부
  const [shouldStoreDeliveryRequest, setShouldStoreDeliveryRequest] =
    useState(false);

  const products = usePaymentRequestStore((state) => state.products);
  const { resetState, setIsCouponApplied } = usePaymentRequestStore(
    (state) => ({
      resetState: state.resetState,
      setIsCouponApplied: state.setIsCouponApplied
    })
  );

  return (
    <>
      (
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
            setIsCouponApplied={setIsCouponApplied}
            discountAmount={discountAmount}
            setDiscountAmount={setDiscountAmount}
          />

          {/* 결제 수단 선택 */}
          <PaymentMethodSelect />
        </div>

        {/* 결제 요약(가격) 및 결제 버튼 */}
        <div className="md:w-[375px] md:shrink-0">
          <OrderSummary
            totalDiscountAmount={discountAmount}
            shippingRequest={shippingRequest}
            shouldStoreDeliveryRequest={shouldStoreDeliveryRequest}
          />
        </div>
      </main>
      )
    </>
  );
};

export default OrderPageContainer;
