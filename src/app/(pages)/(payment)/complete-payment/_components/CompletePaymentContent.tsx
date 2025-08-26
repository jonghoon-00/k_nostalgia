'use client';

import Loading from '@/components/common/Loading';
import { toast } from '@/components/ui/use-toast';
import { productImgObject } from '@/hooks/payment/getProductImage';
import { useGetPayHistory } from '@/hooks/payment/useGetPaymentHistory';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const formatKR = (num: number) => num.toLocaleString('ko-KR');

const CompletePaymentContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  //paymentId 없을 경우
  const paymentId = searchParams.get('paymentId');
  useEffect(() => {
    if (!paymentId) {
      toast({
        description: '일시적인 오류로 인해 내역 페이지로 이동합니다.'
      });
      router.push('/pay-history');
    }
  }, [paymentId, router]);

  //store reset
  const resetState = usePaymentRequestStore((state) => state.resetState);
  const clearCouponIds = useCouponStore((state) => state.clearCouponIds);
  useEffect(() => {
    return () => {
      resetState();
      clearCouponIds();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = usePaymentRequestStore((state) => state.products);

  const { payment, paymentIsPending } = useGetPayHistory({
    paymentId: paymentId || ''
  });

  if (paymentIsPending || !payment || !paymentId) {
    return <Loading />;
  }

  const paidAt = payment.paidAt ?? new Date().toISOString();
  const total = Number(payment.amount?.total ?? 0);

  const PAYMENT_COMPLETE_IMAGE =
    'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/images/Tiger_congrats.png';
  return (
    <main className={clsx('bg-normal pt-10', 'md:w-[860px] md:mx-auto')}>
      <section className="m-auto mb-[104px] md:mb-6">
        <div
          className={clsx(
            'flex flex-col items-center',
            'px-[46.5px] pt-[8px] pb-[15px]',
            'md:pt-10'
          )}
        >
          <Image
            src={PAYMENT_COMPLETE_IMAGE}
            alt="결제 완료 이미지"
            width={300}
            height={300}
            style={{ width: '282', height: '175' }}
            priority
          />
          <p className="text-[20px] text-primary-20 font-medium leading-7">
            결제가 완료됐어요!
          </p>
        </div>

        <section
          className={clsx(
            'flex flex-col gap-[8px] leading-[160%] rounded-xl',
            'p-[16px] sm:my-9 sm:bg-white sm:border-[1px] sm:border-gray-80'
          )}
        >
          <div className="flex flex-row justify-between">
            <p className="text-label-alternative font-medium">주문번호</p>
            <p className="font-semibold text-[#1F1E1E]">{paymentId}</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-label-alternative font-medium">결제일자</p>
            <p className="font-semibold text-[#1F1E1E]">
              {dayjs(paidAt).locale('ko').format('YYYY. MM. DD HH:MM')}
            </p>
          </div>
        </section>

        <section>
          <div className="pb-3">
            <h3 className="hidden text-[20px] font-medium leading-7 sm:block">
              주문상품
            </h3>
          </div>

          <div
            className={clsx(
              'rounded-xl',
              'sm:bg-white sm:border-[1px] sm:border-gray-80'
            )}
          >
            <div
              className={clsx(
                'border-t-4 border-gray-90 pt-[20px] pb-[16px]',
                'sm:border-none'
              )}
            >
              <div className="flex flex-col gap-[16px]">
                {products?.map((product: any) => {
                  const { id, name, amount, quantity } = product;
                  return (
                    <div
                      key={id}
                      className={clsx(
                        'flex gap-[12px] border-b-2 border-gray-90',
                        'pb-[16px] mx-[16px]'
                      )}
                    >
                      <Image
                        src={productImgObject[name]}
                        width={64}
                        height={64}
                        alt={name}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                      <div className="flex flex-col justify-center gap-[8px]">
                        <p className="text-[16px] font-medium">{name}</p>
                        <div className="flex flex-row gap-[4px] text-label-alternative">
                          <p>{amount.toLocaleString('ko-KR')}원</p>
                          <p>·</p>
                          <p>{quantity}개</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-[16px] flex flex-col gap-[8px]">
              <div className="flex justify-between">
                <p className="font-normal">총 상품금액</p>
                <p className="font-semibold">{total.toLocaleString('ko-KR')}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-normal">배송비</p>
                <p className="font-semibold">2,500원</p>
              </div>
              <div className="flex justify-between">
                <p className="font-normal">쿠폰 할인 금액</p>
                <p className="font-semibold">-2,000원</p>
              </div>
            </div>

            <div
              className={clsx(
                'flex justify-between mx-[16px] mt-[16px]',
                'pt-[16px] pb-[16px] border-t-2 border-gray-90'
              )}
            >
              <p className="font-semibold text-[18px]">총 결제 금액</p>
              <p className="font-semibold text-[20px] md:text-primary-20">
                {total.toLocaleString('ko-KR')}원
              </p>
            </div>
          </div>
        </section>
      </section>

      <div
        className={clsx(
          'bg-[#FAF8F5]',
          'fixed bottom-0 w-screen justify-center font-semibold flex gap-2',
          'mb-[16px] px-4 py-[12px] md:px-20',
          'shadow-[rgba(31,30,30,0.08)_0px_-2px_8px_0px]',
          'md:relative md:w-full md:mb-[80px] md:shadow-none md:bg-none'
        )}
      >
        <button
          onClick={() => router.replace('/pay-history')}
          type="button"
          className={clsx(
            'w-full h-[48px] px-[12px] border-[1px]',
            'border-primary-20 text-primary-20 rounded-[12px]',
            'md:flex md:flex-1  justify-center items-center'
          )}
        >
          주문 내역 보기
        </button>

        <button
          onClick={() => router.replace('/local-food')}
          type="button"
          className={clsx(
            'bg-primary-20 text-white',
            // 166
            'w-full h-[48px] px-[12px] rounded-[12px]',
            'md:flex md:flex-1 justify-center items-center'
          )}
        >
          계속 쇼핑하기
        </button>
      </div>
    </main>
  );
};

export default CompletePaymentContent;
