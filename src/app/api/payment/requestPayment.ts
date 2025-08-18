'use client';

import { toast } from '@/components/ui/use-toast';
import { Tables } from '@/types/supabase';
import {
  Products
} from '@/zustand/payment/usePaymentStore';
import * as PortOne from '@portone/browser-sdk/v2';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

interface PayRequestParameters {
  payMethod: string; // toss | kakao | normal
  user: Tables<'users'>;
  totalAmount: number;
  orderName: string;
  products: Products,
}

//TODO 배포 이후 URL 변경
const PRODUCTION_URL = 'https://k-nostalgia.vercel.app/'
const DEV_URL = process.env.NEXT_PUBLIC_DOMAIN;

//결제 요청 함수
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

//이니시스 일반 결제
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
