'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import { usePaymentCancellation } from '@/hooks/payment/cancelPayWithDbUpdate';
import { productImgObject } from '@/hooks/payment/getProductImage';
import useDeletePayHistory from '@/hooks/payment/useDeletePayHistory';
import { useUser } from '@/hooks/useUser';

import { toast } from '@/components/ui/use-toast';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { CgClose } from 'react-icons/cg';
import Swal from 'sweetalert2';

// types, components
import { PayHistoryCache, Product } from '@/types/payHistory';
import ReviewProductDetail from './ReviewProductDetail';

dayjs.locale('ko');

type RenderPayHistoryCacheList = Record<string, PayHistoryCache[]>;

interface Props {
  orderList: RenderPayHistoryCacheList;
  date: string;
}

const PayHistoryItem: React.FC<Props> = ({ orderList, date }) => {
  const router = useRouter();
  const { data: nowUser } = useUser();
  const userId = nowUser?.id;

  const deletePayHistory = useDeletePayHistory(userId!);
  const cancelPaymentMutation = usePaymentCancellation(userId!);

  const currency = useMemo(
    () => new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }),
    []
  );

  const confirmDelete = async (paymentId?: string) => {
    if (!paymentId) {
      toast({
        variant: 'destructive',
        description: '주문 ID가 유효하지 않습니다.'
      });
      return;
    }

    const result = await Swal.fire({
      title: '주문 내역을 삭제하시겠어요?',
      html: '<div class="swal2-html-container text-base -mt-2">내역 삭제 시 복구 및 주문 취소가 불가해요.</div>',
      showCancelButton: true,
      cancelButtonColor: '#9C6D2E',
      confirmButtonColor: '#f2f2f2',
      cancelButtonText: '취소하기',
      confirmButtonText: '삭제하기',
      customClass: {
        title: 'text-xl mt-10 md:mb-2',
        popup: 'rounded-[16px]',
        actions: 'flex gap-3 mb-6 mt-9 md:mt-10 md:mb-7',
        confirmButton:
          'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
        cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
      }
    });

    if (result.isConfirmed) {
      deletePayHistory.mutate(paymentId);
    }
  };

  const confirmCancel = async (order: PayHistoryCache) => {
    if (!userId) {
      toast({ variant: 'destructive', description: '로그인 후 이용해주세요.' });
      return;
    }

    const result = await Swal.fire({
      title: '구매 상품을 환불하시겠어요?',
      html: '<div class="swal2-html-container text-base -mt-2">환불 후에는 리뷰 작성 및 환불 취소가 불가해요.</div>',
      showCancelButton: true,
      cancelButtonColor: '#9C6D2E',
      confirmButtonColor: '#f2f2f2',
      cancelButtonText: '취소',
      confirmButtonText: '환불',
      customClass: {
        title: 'text-xl mt-10 md:mb-2',
        popup: 'rounded-[16px]',
        actions: 'flex gap-3 mb-6 mt-9 md:mt-10 md:mb-7',
        confirmButton:
          'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
        cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
      }
    });

    if (!result.isConfirmed) return;

    const { payment_id } = order;
    if (!payment_id) {
      toast({
        variant: 'destructive',
        description: '주문 ID가 유효하지 않습니다.'
      });
      return;
    }

    const uiPatch: Partial<PayHistoryCache> = {
      status: 'CANCELLED'
    };

    // DB 반영 패치 — 서버 Row 기준
    const dbPatch: Partial<Pick<PayHistoryCache, 'payment_id' | 'status'>> & {
      payment_id: string;
    } = {
      payment_id,
      status: 'CANCELLED'
    };

    try {
      cancelPaymentMutation.mutate({
        payment_id,
        user_id: userId,
        uiPatch,
        dbPatch: dbPatch as any
      });
    } catch (err) {
      console.error('주문 취소 중 오류 발생:', err);
      toast({
        variant: 'destructive',
        description: '주문 취소에 실패했습니다.'
      });
    }
  };

  return (
    <div className="px-[16px] md:p-0">
      {orderList[date].map((order) => {
        const isCancelled = order.status === 'CANCELLED';
        const arrivalText =
          order.status === 'PAID'
            ? `${dayjs(order.payment_date).format('MM/DD (ddd)')} 도착 예정`
            : null;

        return (
          <div key={order.id}>
            <div
              className={clsx(
                'bg-white border rounded-[12px] p-[16px]',
                'mt-[8px] mb-[16px]'
              )}
            >
              {/* 상단 상태/닫기 */}
              <div className="flex items-center justify-between">
                <div
                  className={clsx(
                    'flex items-center gap-[4px]',
                    'md:text-[18px]'
                  )}
                >
                  <p className="font-medium">
                    {isCancelled ? '주문취소완료' : '결제 완료'}
                  </p>
                  {!isCancelled && <p className="text-[#AFAFAF]">·</p>}
                  {arrivalText && (
                    <p className="font-normal text-[#9C6D2E]">{arrivalText}</p>
                  )}
                </div>

                <button
                  type="button"
                  aria-label="주문 내역 삭제"
                  onClick={() => confirmDelete(order.payment_id)}
                  className={clsx(
                    'w-7 h-7 p-1 rounded-md text-[#959595]',
                    'hover:bg-black/5 focus:outline-none',
                    'focus-visible:ring-2 focus-visible:ring-offset-2'
                  )}
                >
                  <CgClose className="w-full h-full" />
                </button>
              </div>

              {/* 상품 목록 */}
              {order.products?.map((product: Product, index: number) => {
                const isLast = index === (order.products?.length ?? 0) - 1;
                const imgSrc =
                  productImgObject[product.name] ?? '/images/placeholder.png';

                return (
                  <button
                    type="button"
                    key={`${order.id}-${product.id}`}
                    onClick={() => router.push(`/local-food/${product.id}`)}
                    className={clsx(
                      'flex w-full cursor-pointer text-left gap-[12px] mt-[12px]',
                      !isLast && 'border-b-2 pb-[12px]'
                    )}
                  >
                    <Image
                      src={imgSrc}
                      alt={product.name}
                      width={100}
                      height={100}
                      className={clsx(
                        'object-cover rounded-[8px]',
                        'w-[64px] h-[64px] xs:w-[100px] xs:h-[100px]'
                      )}
                    />

                    <div className="flex flex-col justify-center gap-[8px]">
                      <p className="font-medium text-[16px] md:text-[20px]">
                        {product.name}
                      </p>
                      <div
                        className={clsx(
                          'flex gap-[4px] md:gap-2',
                          'text-[#79746D]'
                        )}
                      >
                        <p>{currency.format(product.amount)}원</p>
                        <p>·</p>
                        <p>{product.quantity}개</p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* 액션 버튼 */}
              <div
                className={clsx(
                  'self-stretch pt-[12px]',
                  'flex justify-center gap-[8px] text-[14px] font-semibold',
                  isCancelled && 'hidden'
                )}
              >
                <button
                  type="button"
                  onClick={() => confirmCancel(order)}
                  className={clsx(
                    'flex flex-1 h-[40px] items-center justify-center rounded-[10px]',
                    'py-[10px] px-[16px] border',
                    'border-[#AFAFAF] text-[#79746D]'
                  )}
                >
                  주문취소
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toast({
                      variant: 'destructive',
                      description: '서비스 준비 중이에요.'
                    })
                  }
                  className={clsx(
                    'flex flex-1 h-[40px] items-center justify-center rounded-[10px]',
                    'py-[10px] px-[16px] border',
                    'border-[#9C6D2E] text-[#9C6D2E]'
                  )}
                >
                  배송조회
                </button>
              </div>
            </div>

            {/* 리뷰 섹션 */}
            <div className="w-full mb-4 bg-slate-200">
              <ReviewProductDetail order={order} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PayHistoryItem;
