//webhook api(포트원)
//해당 파일 위치가 webhook url 입니다

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

export const POST = async (request: NextRequest) => {
  try {
    const response : WebhookRes = await request.json();
    const paymentId = response.data.paymentId

    if(response.type === 'Transaction.Cancelled'){
      //결제때 사용한 쿠폰 코드 가져오기
      const {data : usedCouponCode , error : usedCouponCodeError} = await supabase
      .from('orderd_list')
      .select('used_coupon_code')
      .eq('payment_id', paymentId)
      .single()
      
      if(usedCouponCodeError) return console.error('error_failed get to used coupon code ,', usedCouponCode);

      //결제 status 업데이트
      const {data: newHistoryData, error : historyUpdateError} = await supabase
      .from('orderd_list')
      .update({status:'CANCELLED'})
      .eq('payment_id',paymentId)
      .select()
      .single()

      if(historyUpdateError) return console.error('error_failed update order history,', historyUpdateError);

      //사용 회원가입 쿠폰 복구
      if(newHistoryData){
        const {error : addCouponError} = await supabase
        .from('users')
        .update({coupons: usedCouponCode?.used_coupon_code})
        .eq('id', newHistoryData.user_id as string)

        if(addCouponError) return console.log('error_failed add again membership coupon,',addCouponError);
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