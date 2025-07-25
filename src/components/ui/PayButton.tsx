'use client';

//장바구니, 특산물 상세 페이지에 위치하는 결제 버튼

//feat1. 결제에 필요한 정보 전역에 저장(클릭 이벤트) - zustand
//feat2. 결제 페이지로 redirect
//feat3. 스타일링 - text props 값에 따른 스타일링

//update : 24.11.20

import { useRouter } from 'next/navigation';

import { useUser } from '@/hooks/useUser';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';

import { Tables } from '@/types/supabase';
import { toast } from './use-toast';

type ProductProps = {
  id: string | null;
  name: string | null;
  amount: number;
  quantity: number;
}[];

type Props = {
  orderNameArr: string[];
  product: ProductProps;
  text: string; //버튼 텍스트 - 버튼 비활성화 및 스타일링에 사용
};

type setGlobalStateParams = {
  orderNameArr: string[];
  nowUser: Tables<'users'>;
};
type ButtonStylesObj = {
  [key: string]: string;
};

const PayButton = ({ orderNameArr, product, text }: Props) => {
  const router = useRouter();
  const { data: nowUser } = useUser(); //getUser-query

  const { setOrderName, setTotalAmount, setProducts } =
    usePaymentRequestStore(); //zustand

  //총액 계산 함수
  const calculateTotalAmount = (product: ProductProps) => {
    return product.reduce((acc, item) => acc + item.amount, 0);
  };
  const DELIVERY_FEE = 2500;

  //payRequest값 저장(zustand)
  const setPayRequestDataInGlobalState = ({
    orderNameArr
  }: setGlobalStateParams) => {
    const totalAmount = calculateTotalAmount(product);
    setTotalAmount(totalAmount + DELIVERY_FEE);
    setOrderName(orderNameArr.join(' '));
    setProducts(product as any);
  };

  //전역 관리 이후 redirect
  const setPaymentDataAndRedirect = () => {
    if (!nowUser) {
      return toast({
        description: '로그인 후 이용 가능합니다'
      });
    }
    if (product.length === 0) {
      return toast({
        description: '구매할 상품을 선택 해 주세요'
      });
    }
    setPayRequestDataInGlobalState({ orderNameArr, nowUser });
    router.push('/payment');
  };

  const ButtonStylesObj: ButtonStylesObj = {
    '바로 구매하기':
      'min-w-[165px] flex bg-primary-strong py-3 px-4 rounded-xl text-white max-w-[234px] w-full justify-center items-center leading-7',
    '선택 상품 주문하기':
      'flex flex-1 w-[336px] h-[48px] py-[12px] px-[16px] justify-center items-center rounded-xl text-[#9C6D2E] font-semibold leading-7 border-[1px] border-[#9C6D2E]',
    '전체 상품 주문하기':
      'flex flex-1 w-[336px] h-[48px] py-[12px] px-[16px] justify-center items-center rounded-xl text-white font-semibold leading-7 bg-[#9C6D2E]'
  };
  const buttonDisabled = product.length === 0;

  let PayButtonStyle = ButtonStylesObj[text];

  if (buttonDisabled) {
    switch (text) {
      case '바로 구매하기':
        PayButtonStyle =
          'min-w-[165px] max-w-[234px] w-full flex justify-center items-center bg-stone-200 py-3 px-4 rounded-xl text-white leading-7';
        break;
      case '선택 상품 주문하기':
        PayButtonStyle =
          'flex flex-1 w-[336px] h-[48px] py-[12px] px-[16px] justify-center items-center rounded-xl text-stone-300 font-semibold leading-7 border-[1px] border-stone-300';
        break;
      case '전체 상품 주문하기':
        PayButtonStyle =
          'flex flex-1 w-[336px] h-[48px] py-[12px] px-[16px] justify-center items-center rounded-xl text-white font-semibold leading-7 bg-stone-200';
        break;
      default:
        break;
    }
  }

  return (
    <button
      className={PayButtonStyle}
      onClick={setPaymentDataAndRedirect}
      disabled={buttonDisabled}
    >
      {text}
    </button>
  );
};

export default PayButton;
