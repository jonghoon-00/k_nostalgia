// requestPayment 함수가 메인
// 토스/카카오/이니시스 결제 요청 함수 위치

// update : 25.04.08

'use client';

import { toast } from '@/components/ui/use-toast';
import { Tables } from '@/types/supabase';
import {
  Products
} from '@/zustand/payment/usePaymentStore';
import * as PortOne from '@portone/browser-sdk/v2';
import dayjs from 'dayjs';
import { uuid as uuidv4 } from 'uuidv4';

interface PayRequestParameters {
  payMethod: string; // toss | kakao | normal
  user: Tables<'users'>;
  totalAmount: number;
  orderName: string;
  products: Products,

}

const PRODUCTION_URL = 'https://k-nostalgia.vercel.app/';
const DEV_URL = 'http://localhost:3000/';

/**
 * Initiates a payment request using the specified payment method.
 *
 * Displays user notifications regarding provisional payment and refund policies, then processes the payment via Toss, Kakao, or Inicis based on {@link payMethod}.
 *
 * @param payMethod - The payment method to use ("toss", "kakao", or "normal").
 * @param user - The user initiating the payment (required for "normal" payments).
 * @param totalAmount - The total amount to be paid.
 * @param orderName - The name or description of the order.
 * @param products - The list of products included in the order.
 * @returns The response from the selected payment provider's request function.
 *
 * @remark
 * Users are notified that the payment is provisional and will be refunded by midnight, with immediate refunds available via the user dashboard.
 */
export default async function requestPayment({
  payMethod,
  user,
  totalAmount,
  orderName,
  products,

}: PayRequestParameters) {

  toast({
    variant: 'destructive',
    description: '가결제입니다, 당일 자정 전 일괄 환불됩니다'
  });
  setTimeout(() => {
    toast({
      variant: 'destructive',
      description: '즉시 환불은 마이페이지에서 가능합니다'
    });
  }, 1500);

  let response;

  if (payMethod === 'toss') {
    response = await requestTossPayment(
      orderName,
      totalAmount,
    );
  }
  if (payMethod === 'kakao') {
    response = await requestKakaoPayment(
      orderName,
      totalAmount,
    );
  }
  if (payMethod === 'normal') {
    response = await requestInicisPayment(
      user,
      orderName,
      products,
      totalAmount,
    );
  }
  return response;
}

const date = dayjs(new Date(Date.now())).locale('ko').format('YYMMDD');

/**
 * Initiates an Inicis card payment request using the PortOne SDK.
 *
 * @param user - The user making the payment.
 * @param orderName - The name or description of the order.
 * @param products - The list of products included in the order.
 * @param totalAmount - The total payment amount in KRW.
 * @returns The response from the PortOne payment request.
 *
 * @remark
 * The payment window type is set to iframe on PC and redirection on mobile. Webhook URLs are configured for both production and test environments. A custom Inicis skin is applied via the bypass option.
 */
async function requestInicisPayment(
  user: Tables<'users'>,
  orderName: string,
  products: Products,
  totalAmount: number,
) {
  const response = await PortOne.requestPayment({
    storeId: process.env.NEXT_PUBLIC_STORE_ID as string,
    channelKey: process.env.NEXT_PUBLIC_INICIS_CHANNEL_KEY,
    paymentId: `${date}-${uuidv4().slice(0, 13)}`,
    orderName,
    totalAmount,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD',
    products: products,
    redirectUrl:
      process.env.NODE_ENV === 'production'
        ? `${PRODUCTION_URL}/check-payment`
        : `${DEV_URL}/check-payment`,
    appScheme:
      process.env.NODE_ENV === 'production'
      ? `${PRODUCTION_URL}/check-payment`
      : `${DEV_URL}/check-payment`,
    noticeUrls: [
      //webhook url
      `${PRODUCTION_URL}/api/payment/webhook`, //실 배포 url
      'https://7ac2-121-163-241-29.ngrok-free.app/api/payment/webhook' //테스트용 ngrok 서버
    ],
    customer: {
      customerId: user.id,
      email: user.email as string,
      phoneNumber: '01000000000',
      fullName: user.name as string
    },
    windowType: {
      pc: 'IFRAME',
      mobile: 'REDIRECTION'
    },
    bypass: {
      inicis_v2: {
        acceptmethod: [`SKIN(#586452)`]
      }
    }
  });
  return response;
}

/**
 * Initiates a Toss payment request using the PortOne SDK.
 *
 * @param orderName - The name or description of the order.
 * @param totalAmount - The total payment amount in KRW.
 * @returns The response from the PortOne payment request.
 */
async function requestTossPayment(
  orderName: string,
  totalAmount: number,
) {
  const response = await PortOne.requestPayment({
    storeId: process.env.NEXT_PUBLIC_STORE_ID as string,
    channelKey: process.env.NEXT_PUBLIC_TOSS_CHANEL_KEY,
    paymentId: `${date}-${uuidv4().slice(0, 13)}`,
    orderName,
    totalAmount,
    currency: 'CURRENCY_KRW',
    payMethod: 'EASY_PAY',
    easyPay:{
      easyPayProvider: 'EASY_PAY_PROVIDER_TOSSPAY'
    },
    redirectUrl:
      process.env.NODE_ENV === 'production'
      ? `${PRODUCTION_URL}/check-payment`
      : `${DEV_URL}/check-payment`,
  });
  return response;
}

/**
 * Initiates a KakaoPay payment request using the PortOne SDK.
 *
 * @param orderName - The name or description of the order.
 * @param totalAmount - The total payment amount in KRW.
 * @returns The response object from the PortOne payment request.
 *
 * @remark The payment request includes a custom message indicating it is a test provisional payment.
 */
async function requestKakaoPayment(
  orderName: string,
  totalAmount: number,
) {
  const response = await PortOne.requestPayment({
    storeId: process.env.NEXT_PUBLIC_STORE_ID as string,
    channelKey: process.env.NEXT_PUBLIC_KAKAO_CHANEL_KEY,
    paymentId: `${date}-${uuidv4().slice(0, 13)}`,
    orderName,
    totalAmount,
    currency: 'CURRENCY_KRW',
    payMethod: 'EASY_PAY',
    bypass: {
      kakaopay: {
        custom_message: "테스트용 가결제입니다"
      }
    },
    redirectUrl:
    process.env.NODE_ENV === 'production'
    ? `${PRODUCTION_URL}/check-payment`
    : `${DEV_URL}/check-payment`,
  });
  return response;
}
