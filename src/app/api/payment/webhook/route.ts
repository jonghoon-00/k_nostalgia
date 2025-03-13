//webhook api(포트원)

//해당 파일 위치가 webhook url 입니다

//feat1) 환불 시, 'orderd_list' 테이블 status 항목 업데이트
// - 사업자 등록 안 된 가결제라 자정 전 일괄 환불됨
// - 해당 환불 로직 추적 및 db 업데이트 위해 필요

//feat2) 환불 시 users 테이블에 쿠폰 다시 추가
// - 쿠폰이 현재는 하나인데, 추가 될 경우에는 구조 변경 필요

//update: 24.10.23

import supabase from "@/utils/supabase/client";
import { NextRequest } from "next/server";

type WebhookRes = {
  type: string;
  timestamp: string;
  data:{
    transactionId: string;
    paymentId: string;
    cancellationId: string;
  }
}

//회원가입 쿠폰
const MEMBERSHIP_COUPON : string = 'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/images/Coupon.png'

export const POST = async (request: NextRequest) => {
  try {
    const response : WebhookRes = await request.json();
    const paymentId = response.data.paymentId

    if(response.type === 'Transaction.Cancelled'){
      //주문 내역 status 결제 취소로 업데이트
      const {data: newHistoryData, error : historyUpdateError} = await supabase
      .from('orderd_list')
      .update({status:'CANCELLED'})
      .eq('payment_id',paymentId)
      .select()
      .single()

      if(historyUpdateError) console.error('error_failed update order history,', historyUpdateError);

      //쿠폰 되살리기
      if(newHistoryData){
        const {error : addCouponError} = await supabase
        .from('users')
        .update({coupon: MEMBERSHIP_COUPON})
        .eq('id', newHistoryData.user_id as string)

        if(addCouponError) console.log('error_failed add again membership coupon,',addCouponError);
      }
    }

    return new Response(JSON.stringify({ message: 'success' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('webhook error:', error);
    return new Response(JSON.stringify({ message: 'error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};