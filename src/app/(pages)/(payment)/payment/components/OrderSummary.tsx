'use client';

import { toast } from '@/components/ui/use-toast';
import supabase from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import requestPayment from '@/app/api/payment/requestPayment';
import { useCouponDiscount } from '@/hooks/coupon/useCouponDiscount';
import { useUser } from '@/hooks/useUser';

import Accordion from '@/components/ui/Accordion';
import { ACCORDION_IDS, DELIVERY_FEE } from '@/constants';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';

const OrderSummary = () => {
  const router = useRouter();
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const address = useDeliveryStore((state) => state.address);
  const shippingRequest = useDeliveryStore((state) => state.shippingRequest);
  const shouldStoreDeliveryRequest = useDeliveryStore(
    (s) => s.shouldStoreDeliveryRequest
  );

  const {
    products,
    orderName,
    totalAmount,
    isCouponApplied,
    payMethod,
    getTotalQuantity
  } = usePaymentRequestStore(
    useShallow((s) => ({
      products: s.products,
      orderName: s.orderName,
      totalAmount: s.totalAmount,
      isCouponApplied: s.isCouponApplied,
      payMethod: s.payMethod,
      getTotalQuantity: s.getTotalQuantity
    }))
  );
  const totalQuantity = useMemo(() => getTotalQuantity(), [getTotalQuantity]);

  // 쿠폰 할인 금액
  const discountAmount = useCouponDiscount();

  const { data: user, isPending: isUserLoading } = useUser();

  const payRequest = async () => {
    if (isUserLoading) {
      return toast({
        description: '사용자 정보 확인중. 잠시 후 다시 시도해주세요'
      });
    }
    if (!user) {
      console.error('Get user failed');
      router.push('/login');
      return toast({
        description: '로그인이 필요합니다. 로그인 후 다시 시도해주세요'
      });
    }
    if (!address) {
      return toast({ description: '배송지 추가 혹은 선택 해주세요' });
    }

    const response = await requestPayment({
      payMethod,
      user,
      totalAmount,
      products,
      orderName
    });

    // response.code가 있는 경우 결제 실패
    if (response?.code != null) {
      console.log(response.code);
      return toast({
        variant: 'destructive',
        description: '결제에 실패했습니다 다시 시도해주세요'
      });
    }

    if (shouldStoreDeliveryRequest && shippingRequest !== '') {
      await supabase
        .from('users')
        .update({ shippingRequest })
        .eq('id', user.id);
    }

    //TODO 결제 성공시 RESPONSE 처리 재확인
    if (response?.code) {
      router.push(
        `/check-payment?paymentId=${response?.paymentId}&totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`
      );
    }
  };

  return (
    <>
      <Accordion
        id={ACCORDION_IDS.ORDER_SUMMARY}
        title={
          <div className="flex w-full justify-between text-gray-700 font-bold">
            <span>결제 금액</span>
            <span className="text-primary-20">
              {totalAmount.toLocaleString('ko-KR')}원
            </span>
          </div>
        }
        isOpen={isAccordionOpen}
        onToggle={setIsAccordionOpen}
        containerClassName="bg-white w-full flex flex-col gap-2 border border-[#E0E0E0] p-4"
      >
        <div className="text-label-strong text-[16px] flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <span>상품 금액</span>
            <span>{totalAmount.toLocaleString('ko-KR')}원</span>
          </div>
          <div className="flex justify-between">
            <span>배송비</span>
            <span>{DELIVERY_FEE.toLocaleString('ko-KR')}원</span>
          </div>
          <div className="flex justify-between text-primary-20">
            <span>할인</span>
            <span>-{discountAmount.toLocaleString('ko-KR')}원</span>
          </div>
        </div>
      </Accordion>

      {/* 결제 버튼 */}
      <div className="bg-normal w-full fixed md:relative flex justify-center bottom-0 left-0 pt-3 pb-6 md:p-0 shadow-custom md:shadow-none">
        <button
          onClick={payRequest}
          className="w-[90%] md:w-full md:mt-4 max-w-[420px] bg-primary-20 text-white py-3 rounded-[12px] font-bold"
          disabled={products.length === 0 || isUserLoading}
        >
          {totalAmount.toLocaleString('ko-KR')}원 결제하기
        </button>
      </div>
    </>
  );
};

export default OrderSummary;
