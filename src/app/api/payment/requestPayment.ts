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
  payMethod: string;
  user: Tables<'users'>;
  totalAmount: number;
  orderName: string;
  products: Products
}

export default async function requestPayment({
  payMethod,
  user,
  totalAmount,
  orderName,
  products
}: PayRequestParameters) {
  const totalQuantity = products.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

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

  if (payMethod === '토스페이') {
    response = await requestTossPayment(
      user,
      orderName,
      products,
      totalAmount,
      totalQuantity
    );
  }
  if (payMethod === '카카오페이') {
    response = await requestKakaoPayment(
      user,
      orderName,
      products,
      totalAmount,
      totalQuantity
    );
  }
  if (payMethod === '일반결제') {
    response = await requestInicisPayment(
      user,
      orderName,
      products,
      totalAmount,
      totalQuantity
    );
  }
  return response;
}

const date = dayjs(new Date(Date.now())).locale('ko').format('YYMMDD');
const isCouponApplied = false; //TODO 추후 수정

//이니시스 일반 결제
async function requestInicisPayment(
  user: Tables<'users'>,
  orderName: string,
  products: Products,
  totalAmount: number,
  totalQuantity: number
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
        ? `https://https://k-nostalgia-one.vercel.app/check-payment?totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`
        : `http://localhost:3000/check-payment?totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`,
    appScheme:
      process.env.NODE_ENV === 'production'
        ? `https://https://k-nostalgia-one.vercel.app/check-payment?totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`
        : `http://localhost:3000/check-payment?totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`,
    noticeUrls: [
      //webhook url
      `https://k-nostalgia-one.vercel.app/api/payment/webhook`, //실 배포 url
      'https://k-nostalgia-vdpl.vercel.app/api/payment/webhook', //테스트용 배포 url
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
  user: Tables<'users'>,
  orderName: string,
  products: Products,
  totalAmount: number,
  totalQuantity: number
) {
  const response = await PortOne.requestPayment({
    storeId: process.env.NEXT_PUBLIC_STORE_ID as string,
    channelKey: process.env.NEXT_PUBLIC_TOSS_CHANNEL_KEY,
    paymentId: `${date}-${uuidv4().slice(0, 13)}`,
    orderName,
    totalAmount,
    currency: 'CURRENCY_KRW',
    payMethod: 'EASY_PAY',
    easyPay:{
      easyPayProvider: 'EASY_PAY_PROVIDER_TOSSPAY'
    },
  //   products: products,
    redirectUrl:
      process.env.NODE_ENV === 'production'
        ? `https://https://k-nostalgia-one.vercel.app/check-payment?totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`
        : `http://localhost:3000/check-payment?totalQuantity=${totalQuantity}&isCouponApplied=${isCouponApplied}`,
    // noticeUrls: [
    //   //webhook url
    //   `https://k-nostalgia-one.vercel.app/api/payment/webhook`, //실 배포 url
    //   'https://k-nostalgia-vdpl.vercel.app/api/payment/webhook', //테스트용 배포 url
    //   'https://7ac2-121-163-241-29.ngrok-free.app/api/payment/webhook' //테스트용 ngrok 서버
    // ],
    // customer: {
      
    //   customerId: user.id,
    //   email: user.email as string,
    //   phoneNumber: '01000000000',
    //   fullName: user.name as string
    // },
  //   windowType: {
  //     pc: 'IFRAME',
  //     mobile: 'REDIRECTION'
  //   },
  });
  return response;
}

async function requestKakaoPayment(
  user: Tables<'users'>,
  orderName: string,
  products: Products,
  totalAmount: number,
  totalQuantity: number
) {
  const response = await PortOne.requestPayment({
    storeId: process.env.NEXT_PUBLIC_STORE_ID as string,
    channelKey: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_KEY,
    paymentId: `${date}-${uuidv4().slice(0, 13)}`,
    orderName,
    totalAmount,
    currency: 'CURRENCY_KRW',
    payMethod: 'EASY_PAY',
    easyPay:{
      easyPayProvider: 'EASY_PAY_PROVIDER_KAKAOPAY'
    },
  });
  return response;
}
