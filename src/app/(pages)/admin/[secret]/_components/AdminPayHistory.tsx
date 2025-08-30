'use client';

import { usePaymentCancellation } from '@/hooks/payment/canclePayWithDbUpdate';
import { PayHistory, PayHistoryList, Product } from '@/types/payHistory';
import type { Tables } from '@/types/supabase';
import { useEffect, useState } from 'react';

type OrderList = Tables<'ordered_list'>;

// undefined 키 자동 제거
function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

// Product[] -> Json (jsonb 컬럼에 넣기 위해 undefined를 null로 정규화)
function toJsonProducts(products: Product[] | null | undefined) {
  if (!products) return null;
  return products.map((p) => ({
    amount: p.amount,
    id: p.id,
    name: p.name,
    quantity: p.quantity,
    user_id: p.user_id,
    hasReview: p.hasReview ?? null,
    rating: p.rating ?? null
  }));
}

const AdminPayHistory = () => {
  const [data, setData] = useState<PayHistoryList | null>(null);

  const getAllPay = async () => {
    const res = await fetch('/api/payment/admin');
    const json = await res.json();
    setData(json as PayHistoryList);
  };

  useEffect(() => {
    getAllPay();
  }, []);

  const cancelPaymentMutation = usePaymentCancellation();

  const cancelPaymentInAdminPage = async (row: PayHistory) => {
    const { payment_id, user_id } = row;

    if (!payment_id || !user_id) {
      alert('payment_id 또는 user_id가 없습니다.');
      return;
    }

    const patch: Partial<OrderList> = stripUndefined({
      payment_id,
      status: 'CANCELLED',
      products: toJsonProducts(row.products) // jsonb 호환
    });

    try {
      await cancelPaymentMutation.mutateAsync({
        payment_id, // string
        user_id, // string
        patch // Partial<OrderList>
      });

      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('환불 처리 실패');
    }
  };

  if (!data) return <div>로딩</div>;

  return (
    <div>
      <p className="font-semibold text-[2rem]">
        환불 버튼 누르기 전에. 반드시. 새로고침. 하고. 환불하기.
      </p>
      <div>
        {data.map((row) => {
          const {
            payment_id,
            payment_date,
            price,
            status,
            user_name,
            user_id
          } = row;
          return (
            <div
              key={payment_id}
              className="flex gap-[12px] border-b-2 border-black p-4"
            >
              <div>payment_id(주문번호): {payment_id} |</div>
              <div>payment_date: {payment_date} |</div>
              <div>price: {price} |</div>
              <div>status: {status} |</div>
              <div>user_name: {user_name} |</div>
              <div>user_id: {user_id} |</div>
              <button
                className="border-2 p-4"
                onClick={() => cancelPaymentInAdminPage(row)}
              >
                환불
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPayHistory;
