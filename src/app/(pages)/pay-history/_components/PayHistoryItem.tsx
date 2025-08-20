'use client';
//feat : 주문 내역 삭제(db), 주문 취소(환불)

import { toast } from '@/components/ui/use-toast';
import { usePaymentCancellation } from '@/hooks/payment/canclePayWithDbUpdate';
import { productImgObject } from '@/hooks/payment/getProductImage';
import useDeletePayHistory from '@/hooks/payment/useDeletePayHistory';
import {
  BaseOrderInPayHistory,
  Order,
  OrderListInPayHistory,
  Product
} from '@/types/payHistory';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { CgClose } from 'react-icons/cg';
import Swal from 'sweetalert2';
import ReviewProductDetail from './ReviewProductDetail';

interface Props {
  orderList: OrderListInPayHistory;
  date: string;
}
const PayHistoryItem = ({ orderList, date }: Props) => {
  const route = useRouter();
  const deletePayHistory = useDeletePayHistory();

  //내역 삭제
  const deletePayment = async (order: Order) => {
    const { payment_id } = order;
    Swal.fire({
      title: '주문 내역을 삭제하시겠어요?',
      html: `
      <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">내역 삭제시에는 복구 및 주문 취소가 불가해요.</div>
    `,
      showCancelButton: true,
      cancelButtonColor: '#9C6D2E',
      confirmButtonColor: '#f2f2f2',
      cancelButtonText: '취소하기',
      confirmButtonText: '삭제하기',
      customClass: {
        title: 'text-xl mt-10 md:mb-[8px]',
        popup: 'rounded-[16px]',
        actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
        confirmButton:
          'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
        cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deletePayHistory.mutate(payment_id);
      }
    });
  };

  //환불
  const cancelPaymentMutation = usePaymentCancellation();

  const cancelPayment = async (order: BaseOrderInPayHistory) => {
    Swal.fire({
      title: '구매 상품을 환불하시겠어요?',
      html: `
        <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">환불 후에는 리뷰 작성 및 환불 취소가 불가해요</div>
      `,
      showCancelButton: true,
      cancelButtonColor: '#9C6D2E',
      confirmButtonColor: '#f2f2f2',
      cancelButtonText: '취소',
      confirmButtonText: '환불',
      customClass: {
        title: 'text-xl mt-10 md:mb-[8px]',
        popup: 'rounded-[16px]',
        actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
        confirmButton:
          'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
        cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { status, payment_id, ...rest } = order;
        const newHistory = {
          status: 'CANCELLED',
          payment_id,
          ...rest
        };
        try {
          await cancelPaymentMutation.mutate({ payment_id, newHistory });
        } catch (error) {
          console.error('주문 취소 중 오류 발생:', error);
        }
      }
      return;
    });
  };

  return (
    <div className="px-[16px] md:p-0">
      {orderList[date].map((order: any) => (
        <div key={order.id}>
          <div className="border rounded-[12px] p-[16px] mt-[8px] mb-[16px] bg-white">
            <div className="flex justify-between items-center">
              <div className="flex gap-[4px] items-center md:text-[18px]">
                <p className="font-medium">
                  {order.status === 'CANCELLED' ? '주문취소완료' : '결제 완료'}
                </p>
                <p className="text-[#AFAFAF]">
                  {order.status === 'CANCELLED' ? null : '·'}
                </p>
                <div className="flex">
                  {order.status === 'PAID' && (
                    <p className="text-[#9C6D2E] font-normal">
                      {dayjs(order.payment_date)
                        .locale('ko')
                        .format('MM/DD (ddd)')}{' '}
                      도착 예정
                    </p>
                  )}
                </div>
              </div>
              <CgClose
                onClick={() => deletePayment(order)}
                className="text-[#959595] w-7 h-7 p-1 cursor-pointer"
              />
            </div>

            {order.products?.map((product: Product, index: number) => (
              <div
                className="cursor-pointer"
                key={product.id}
                onClick={() => route.push(`local-food/${product.id}`)}
              >
                <div
                  className={`flex gap-[12px] mt-[12px] ${
                    index !== order.products.length - 1
                      ? 'border-b-2 pb-[12px]'
                      : ''
                  }`}
                >
                  <img
                    src={productImgObject[product.name]}
                    className="w-[64px] h-[64px] object-cover rounded-[8px] xs:w-[100px] xs:h-[100px]"
                    alt={`${product.name}`}
                  />

                  <div className="flex flex-col justify-center gap-[8px]">
                    <p className="font-medium text-[16px] md:text-[20px]">
                      {product.name}
                    </p>
                    <div className="flex text-[#79746D] gap-[4px] md:gap-2">
                      <p>{product.amount.toLocaleString()}원</p>
                      <p>·</p>
                      <p>{product.quantity}개</p>
                    </div>
                  </div>
                  {index !== order.products.length - 1 && <hr />}
                </div>
              </div>
            ))}

            <div
              className={`flex justify-center gap-[8px] text-[14px] font-semibold pt-[12px] ${
                order.status !== 'CANCELLED' ? 'flex' : 'hidden'
              } self-stretch`}
            >
              <button
                className="flex flex-1 justify-center items-center py-[10px] px-[16px] border-[1px] border-[#AFAFAF] text-[#79746D] h-[40px] rounded-[10px]"
                onClick={() => cancelPayment(order)}
              >
                주문취소
              </button>
              <button
                className="flex flex-1 justify-center items-center py-[10px] px-[16px] border-[1px] border-[#9C6D2E] text-[#9C6D2E] h-[40px] rounded-[10px]"
                onClick={() => {
                  toast({
                    variant: 'destructive',
                    description: '서비스 준비 중이에요.'
                  });
                }}
              >
                배송조회
              </button>
            </div>
          </div>
          <div className="w-full mb-4 bg-slate-200">
            <ReviewProductDetail order={order} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PayHistoryItem;
