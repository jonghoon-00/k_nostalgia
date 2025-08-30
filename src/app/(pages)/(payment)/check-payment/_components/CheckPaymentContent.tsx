'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import supabase from '@/utils/supabase/client';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import Loading from '@/components/common/Loading';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/hooks/useUser';
import { PortOnePaymentBase } from '@/types/portone';
import { BeatLoader } from 'react-spinners';

async function getPayHistory({
  paymentId
}: {
  paymentId: string;
}): Promise<PortOnePaymentBase> {
  const getPayHistory = await fetch(
    `/api/payment/transaction?paymentId=${paymentId}`
  );
  return await getPayHistory.json();
}
async function cancelPayment({ paymentId }: { paymentId: string }) {
  return await fetch('/api/payment/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ paymentId })
  });
}

const CheckPaymentContent = () => {
  const router = useRouter();
  const { data: user, isPending } = useUser();

  const [isPaymentHistoryLoaded, setIsPaymentHistoryLoaded] =
    useState<boolean>(false);

  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const code = searchParams.get('code');

  const globalProducts = usePaymentRequestStore((state) => state.products);
  const isCouponApplied = usePaymentRequestStore(
    (state) => state.isCouponApplied
  );
  const getTotalQuantity = usePaymentRequestStore(
    (state) => state.getTotalQuantity
  );
  const totalQuantity = getTotalQuantity();

  useEffect(() => {
    const syncPaymentHistory = async () => {
      if (code === 'FAILURE_TYPE_PG') {
        toast({
          variant: 'destructive',
          description: '결제 실패했습니다 잠시 후 다시 시도해주세요'
        });
        return router.replace(`/cart`);
      }

      if (!paymentId || !user) return;

      const postPaymentHistory = async () => {
        //결제 내역 조회
        const payHistory = await getPayHistory({ paymentId });
        const { paidAt, status, orderName, amount, method, customer } =
          payHistory;

        const newPaidAt = dayjs(paidAt) //결제 일시 형식 변경(dayjs)
          .locale('ko')
          .format('YYYY-MM-DD HH:mm');

        //status === 'PAID' : 결제 성공
        if (status === 'PAID') {
          setIsPaymentHistoryLoaded(true);
          toast({
            variant: 'destructive',
            description: '결제 완료되었습니다'
          });
        }

        //결제 내역 supabase 저장
        //내역 저장에 실패 -> 결제 취소(환불)후 이전 페이지로 REDIRECT
        try {
          await fetch('/api/payment/pay-supabase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: uuidv4(),
              payment_date: newPaidAt,
              status,
              order_name: orderName,
              amount: totalQuantity,
              price: amount?.total,
              user_id: user?.id,
              user_name: customer?.name ? customer.name : user.name,
              payment_id: paymentId,
              pay_provider: method?.provider
                ? method.provider
                : method?.card?.name,
              phone_number: customer?.phoneNumber
                ? customer.phoneNumber
                : '01000000000',
              products: globalProducts,
              user_email: customer?.email ? customer.email : user.email,
              is_CouponApplied: isCouponApplied
            })
          });
        } catch (error) {
          console.error('failed_update pay history,', error);

          //db 저장 실패시 결제 취소
          await cancelPayment({ paymentId });
          toast({
            description: '결제 건 처리 과정에서 문제가 발생했습니다'
          });
          setTimeout(() => {
            toast({
              description: '결제 취소되었습니다, 잠시 후 다시 시도해주세요'
            });
          }, 1500);

          return router.replace(`/cart`);
        }

        //쿠폰이 추가될 경우 수정 필요
        if (isCouponApplied) {
          await supabase
            .from('users')
            .update({ coupons: null })
            .eq('id', user?.id as string);
        }
        router.replace(`complete-payment?paymentId=${paymentId}`);
      };
      postPaymentHistory();
    };
    syncPaymentHistory();
  }, [
    code,
    paymentId,
    router,
    totalQuantity,
    isCouponApplied,
    user,
    globalProducts
  ]);

  if (isPending) return <Loading />;
  if (!user) throw new Error('User not found');
  return (
    <div className="bg-normal">
      <main
        className={clsx(
          'flex justify-center flex-col items-center',
          'text-label-assistive text-sm',
          'absolute top-[50%] left-[50%]',
          'translate-x-[-50%] translate-y-[-50%] '
        )}
      >
        <BeatLoader color="#A87939" />
        <h1 className="my-5">
          {isPaymentHistoryLoaded ? '' : '결제를 확인중입니다'}
        </h1>
      </main>
    </div>
  );
};

export default CheckPaymentContent;
