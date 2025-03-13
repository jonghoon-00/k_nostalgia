'use client';

import { usePaymentCancellation } from '@/hooks/payment/canclePayWithDbUpdate';
import { useEffect, useState } from 'react';

const AdminPayHistory = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getAllPay = async () => {
      const response = await fetch('/api/payment/admin');
      const data = await response.json();
      setData(data);
    };
    getAllPay();
  }, []);
  const cancelPaymentMutation = usePaymentCancellation();

  const cancelPaymentInAdminPage = async (data: any) => {
    const { status, payment_id, ...rest } = data;
    const newHistory = {
      status: 'CANCELLED',
      payment_id,
      ...rest
    };
    try {
      await cancelPaymentMutation.mutateAsync({ payment_id, newHistory });
      window.location.reload();
    } catch (error) {
      alert('실패');
    }
  };
  if (!data) {
    return <div>로딩</div>;
  }
  return (
    <div>
      <p className="font-semibold text-[2rem]">
        환불 버튼 누르기 전에. 반드시. 새로고침. 하고. 환불하기.
      </p>
      <div>
        {data.map((data) => {
          const {
            payment_id,

            payment_date,
            price,
            status,
            user_name,
            user_id
          } = data;
          return (
            <div
              key={payment_id}
              className="flex gap-[12px] border-b-2 border-black p-4"
            >
              <div>payment_id(주문번호):{payment_id} |</div>
              <div>payment_date:{payment_date} |</div>
              <div>price:{price} |</div>
              <div>status:{status} |</div>
              <div>user_name:{user_name} |</div>
              <div>user_id:{user_id} |</div>
              <button
                className="border-2 p-4"
                onClick={() => cancelPaymentInAdminPage(data)}
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
