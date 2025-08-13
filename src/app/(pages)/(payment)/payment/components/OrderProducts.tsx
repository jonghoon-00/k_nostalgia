'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';

import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

import { productImgObject } from '@/hooks/payment/getProductImage';

import DeliveryTruck from '@/components/icons/DeliveryTruck';
import { toast } from '@/components/ui/use-toast';
import clsx from 'clsx';
import Image from 'next/image';

dayjs.locale('ko');
const formatCurrency = (number: number) =>
  new Intl.NumberFormat('ko-KR').format(number);

const OrderProducts = () => {
  const router = useRouter();
  const products = usePaymentRequestStore((state) => state.products);
  const resetState = usePaymentRequestStore((state) => state.resetState);

  const handleRef = useRef(false);

  useEffect(() => {
    if (handleRef.current) return;

    const isInvalid =
      !Array.isArray(products) ||
      products.length === 0 ||
      products.some((product) => !product || !product.id);

    if (isInvalid) {
      handleRef.current = true;
      toast({
        description: '상품 정보를 가져오는데에 실패했습니다'
      });
      setTimeout(() => {
        toast({
          description: '잠시 후 다시 시도해주세요'
        });
      }, 2000);

      resetState();
      usePaymentRequestStore.persist.clearStorage();
      router.replace('/local-food');
    }
  }, [products, resetState, router]);

  const arrivalDateText = useMemo(
    () => `${dayjs().add(1, 'day').format('MM/DD(ddd)')} 도착`,
    []
  );

  if (!products || products.length === 0) {
    // 초기 로딩/검증 단계에서 깜박임 방지
    return null;
  }

  return (
    <div
      className={clsx(
        'bg-white',
        'p-4',
        'flex flex-col gap-2',
        'rounded-[12px]',
        'border-2 border-[#E0E0E0]',
        'mb-4'
      )}
    >
      <h2 className={clsx('text-label-strong', 'text-[18px]', 'font-semibold')}>
        주문 상품
      </h2>

      <div className={clsx('flex gap-1 items-center', 'leading-5', 'mt-2')}>
        {/* 트럭 아이콘 */}
        <DeliveryTruck aria-hidden />
        <p>
          <span
            style={{ fontFamily: 'YeojuCeramic' }}
            className={clsx('text-[12px]', 'text-[#9C6D2E]')}
          >
            향리배송
          </span>
          <span className={clsx('text-sm', 'text-label-alternative', 'mx-2')}>
            18시 이전 주문시
          </span>
          <span className={clsx('text-sm', 'text-primary-20')}>
            {arrivalDateText} 도착
          </span>
        </p>
      </div>

      <ul className={clsx('flex flex-col gap-2', 'mt-1')}>
        {products.map(({ id, name, amount, quantity }) => {
          const imgSrc = productImgObject[name];
          return (
            <li key={id} className={clsx('flex')}>
              <Image
                src={imgSrc}
                alt={`${name} 이미지`}
                className={clsx(
                  'rounded',
                  'border',
                  'w-16 h-16',
                  'object-cover'
                )}
                loading="lazy"
                width={64}
                height={64}
              />
              <div className={clsx('ml-4')}>
                <p className={clsx('text-gray-700')}>{name}</p>
                <p className={clsx('text-gray-500', 'text-sm')}>
                  {formatCurrency(amount)}원 · {quantity}개
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderProducts;
