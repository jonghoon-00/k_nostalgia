'use client';

//결제 완료 페이지

//update : 24.8.27

import Loading from '@/components/common/Loading';
import { productImgObject } from '@/hooks/payment/getProductImage';
import { useGetPaymentHistory } from '@/hooks/payment/useGetPaymentHistory';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const CompletePaymentContent = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId');

  const { payHistory, payHistoryIsPending } = useGetPaymentHistory({
    paymentId
  });

  if (payHistoryIsPending || !payHistory) {
    return <Loading />;
  }
  const { paidAt, products, amount } = payHistory;

  const price = products?.reduce(
    (acc: number, item: any) => acc + item.amount,
    0
  );

  return (
    <main className="bg-normal pt-10 md:w-[860px] md:mx-auto">
      <section className="m-auto mb-[104px] md:mb-6">
        <div className="flex flex-col items-center px-[46.5px] pb-[15px] pt-[8px] md:pt-10">
          <Image
            src="https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/images/Tiger_congrats.png"
            alt="결제 완료 이미지"
            width={300}
            height={300}
            style={{
              width: '282',
              height: '175'
            }}
            priority
          />
          <p className="text-[20px] text-[#9C6D2E] font-medium leading-7">
            결제가 완료됐어요!
          </p>
        </div>

        <section className="flex flex-col gap-[8px] p-[16px] leading-[160%] rounded-xl sm:bg-white sm:border-[1px] sm:border-[#E0E0E0] sm:my-9">
          <div className="flex flex-row justify-between">
            <p className="text-[#79746D] font-medium">주문번호</p>
            <p className="font-semibold text-[#1F1E1E]">{paymentId}</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-[#79746D] font-medium">결제일자</p>
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
          <div className="rounded-xl md: sm:bg-white sm:border-[1px] sm:border-[#E0E0E0]">
            <div className="border-t-4 border-[#F2F2F2] pt-[20px] pb-[16px] sm:border-none">
              <div className="flex flex-col gap-[16px]">
                {products?.map((product: any) => {
                  const { id, name, amount, quantity } = product;
                  return (
                    <div
                      key={id}
                      className="flex gap-[12px] border-b-2 border-[#F2F2F2] pb-[16px] px-[16px]"
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
                        <div className="flex flex-row gap-[4px] text-[#79746D]">
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
                <p className="font-semibold">
                  {price?.toLocaleString('ko-KR')}
                </p>
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
            <div className="flex justify-between px-[16px] pt-[16px] pb-[16px] mt-[16px] border-t-2 border-[#F2F2F2]">
              <p className="font-semibold text-[18px]">총 결제 금액</p>
              <p className="font-semibold text-[20px] md:text-[#9C6D2E]">
                {amount.total.toLocaleString('ko-KR')}원
              </p>
            </div>
          </div>
        </section>
      </section>
      <div className="font-semibold flex mb-[16px] gap-[12px] fixed bottom-0 bg-[#FAF8F5] py-[12px] shadow-[rgba(31,30,30,0.08)_0px_-2px_8px_0px] w-screen justify-center md:shadow-none md:bg-none md:relative md:w-full md:mb-[80px]">
        <Link href={'/pay-history'}>
          <button className="w-[166px] h-[48px] px-[12px] py-16px border-[1px] border-[#9C6D2E] text-[#9C6D2E] rounded-[12px] md:flex md:flex-1 md:w-[336px] justify-center items-center">
            주문 내역 보기
          </button>
        </Link>
        <Link href={'/local-food'}>
          <button className="bg-[#9C6D2E] text-white w-[166px] h-[48px] px-[12px] rounded-[12px] md:flex md:flex-1 md:w-[336px] justify-center items-center">
            계속 쇼핑하기
          </button>
        </Link>
      </div>
    </main>
  );
};

export default CompletePaymentContent;
