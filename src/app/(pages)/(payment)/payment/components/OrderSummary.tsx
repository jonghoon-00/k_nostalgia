'use client';

import requestPayment from '@/app/api/payment/requestPayment';
import Accordion from '@/components/ui/Accordion';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/useUser';
import supabase from '@/utils/supabase/client';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  shippingRequest: string;
  shouldStoreDeliveryRequest: boolean;
  discountAmount: number;
}
const OrderSummary = ({
  shippingRequest,
  shouldStoreDeliveryRequest,
  discountAmount
}: Props) => {
  const router = useRouter();

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const {
    products,
    orderName,
    totalAmount,
    isCouponApplied,
    payMethod,
    totalQuantity,
    setTotalQuantity
  } = usePaymentRequestStore();
  const { address } = useDeliveryStore();

  const amount = products.reduce((acc, product) => acc + product.amount, 0);

  const { data: user } = useUser();
  const payRequest = async () => {
    if (!user) {
      return console.error('유저 정보 가져올 수 없음');
    }
    if (!address) {
      return toast({
        description: '배송지 추가 혹은 선택 해주세요'
      });
    }

    const response = await requestPayment({
      payMethod,
      user,
      totalAmount,
      products,
      orderName
    });

    //response.code가 존재 === 결제 실패
    if (response?.code != null) {
      console.log(response.code);
      return toast({
        variant: 'destructive',
        description: '결제에 실패했습니다 다시 시도해주세요'
      });
    }

    //TODO 결제 POPSTATE 제한 로직 추가(paybutton.tsx 주석 참고)

    // const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

    // useEffect(() => {
    //   //결제 창 활성화 시 PopStateEvent 제한
    //   const handlePopstate = (e: PopStateEvent) => {
    //     if (isPaymentOpen) {
    //       e.preventDefault();
    //       window.history.pushState(null, '', window.location.href);
    //       toast({
    //         description: '결제창을 먼저 종료해주세요'
    //       });
    //     }
    //   };
    //   if (isPaymentOpen) {
    //     window.history.pushState(null, '', window.location.href);
    //     window.addEventListener('popstate', handlePopstate);
    //   }
    //   return () => {
    //     window.removeEventListener('popstate', handlePopstate);
    //   };
    // }, [isPaymentOpen]);

    if (shouldStoreDeliveryRequest && shippingRequest !== '') {
      await supabase
        .from('users')
        .update({ shippingRequest: shippingRequest })
        .eq('id', user.id);
    }

    if (response?.code) {
      router.push(
        `/check-payment?paymentId=${response?.paymentId}&totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`
      );
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      setTotalQuantity(
        products.reduce((acc, product) => acc + product.quantity, 0)
      );
    }
  }, [products]);

  return (
    <>
      <Accordion
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
        containerClassName="bg-white p-4 w-full flex flex-col gap-2 rounded-[12px] border-2 border-[#E0E0E0]"
      >
        <div className="text-label-strong text-[16px] flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <span>상품 금액</span>
            <span>{amount.toLocaleString('ko-KR')}원</span>
          </div>
          <div className="flex justify-between">
            <span>배송비</span>
            <span>{discountAmount?.toLocaleString('ko-KR')}원</span>
          </div>
        </div>
      </Accordion>

      {/* 결제 버튼 */}
      <div className="bg-normal w-full fixed md:relative flex justify-center bottom-0 left-0 pt-3 pb-6 md:p-0 shadow-custom md:shadow-none">
        <button
          onClick={payRequest}
          className="w-[90%] md:w-full md:mt-4 max-w-[420px] bg-primary-20 text-white py-3 rounded-[12px] font-bold"
        >
          {discountAmount.toLocaleString('ko-KR')}원 결제하기
        </button>
      </div>
    </>
  );
};

export default OrderSummary;
