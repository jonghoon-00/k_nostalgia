'use client';

import { DELIVERY_FEE } from '@/constants';
import { useUser } from '@/hooks/useUser';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { toast } from './use-toast';

type Product = {
  id: string | null;
  name: string | null;
  amount: number; // 가격
  quantity: number; // 수량
};
type ProductProps = Product[];

type Props = {
  orderNameArr: string[];
  product: ProductProps;
  variant: 'buyNow' | 'orderSelected' | 'orderAll'; // <-- text 대신 variant
};

const BUTTON_LABEL: Record<Props['variant'], string> = {
  buyNow: '바로 구매하기',
  orderSelected: '선택 상품 주문하기',
  orderAll: '전체 상품 주문하기'
};

const BUTTON_CLASS: Record<Props['variant'], string> = {
  buyNow:
    'min-w-[165px] max-w-[234px] w-full flex justify-center items-center py-3 px-4 rounded-xl leading-7 text-white bg-[#9C6D2E]',
  orderSelected:
    'flex flex-1 w-[336px] h-[48px] py-[12px] px-[16px] justify-center items-center rounded-xl font-semibold leading-7 text-[#9C6D2E] border border-[#9C6D2E]',
  orderAll:
    'flex flex-1 w-[336px] h-[48px] py-[12px] px-[16px] justify-center items-center rounded-xl font-semibold leading-7 text-white bg-[#9C6D2E]'
};

const BUTTON_CLASS_DISABLED: Record<Props['variant'], string> = {
  buyNow: 'bg-stone-200 text-white',
  orderSelected: 'text-stone-300 border border-stone-300',
  orderAll: 'bg-stone-200 text-white'
};

function calcTotalAmount(items: ProductProps) {
  return items.reduce(
    (acc, { amount, quantity }) => acc + amount * quantity,
    0
  );
}

function formatOrderName(names: string[]) {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0] ?? '';
  return `${names[0]} 외 ${names.length - 1}건`;
}

export default function PayButton({ orderNameArr, product, variant }: Props) {
  const router = useRouter();
  const { data: nowUser } = useUser();
  const { setOrderName, setTotalAmount, setProducts } =
    usePaymentRequestStore();

  const buttonDisabled = product.length === 0;

  const handleClick = () => {
    if (!nowUser) {
      toast({ description: '로그인 후 이용 가능합니다' });
      router.push('/login');
      return;
    }
    if (product.length === 0) {
      toast({ description: '구매할 상품을 선택 해 주세요' });
      return;
    }

    const total = calcTotalAmount(product) + DELIVERY_FEE;
    setTotalAmount(total);
    setOrderName(formatOrderName(orderNameArr));
    setProducts(product as any); // 스토어 타입과 Product 타입을 맞춰 any 제거

    router.push('/payment');
  };

  const className = clsx(
    BUTTON_CLASS[variant],
    buttonDisabled && BUTTON_CLASS_DISABLED[variant]
  );

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={buttonDisabled}
      aria-disabled={buttonDisabled}
    >
      {BUTTON_LABEL[variant]}
    </button>
  );
}
