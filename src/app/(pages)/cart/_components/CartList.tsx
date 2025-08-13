'use client';

import { DefaultImage } from '@/components/common/DefaultImage';
import Loading from '@/components/common/Loading';
import PayButton from '@/components/ui/PayButton';
import { useUserCartData } from '@/hooks/cart/useUserCartData';
import useDeviceSize from '@/hooks/useDeviceSize';
import { useState } from 'react';
import { CartFixedButtons } from './CartFixedButtons';
import { TableDataColumns } from './data-table/Data-table-column-header';

type Product = {
  id: string | null;
  name: string | null;
  amount: number;
  quantity: number;
}[];

export const CartList = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { cartData, isPending, error } = useUserCartData();
  const { isDesktop } = useDeviceSize();

  //전체 상품명
  const orderNameArr =
    cartData
      ?.map((item) => {
        return item.product_name;
      })
      .filter((name): name is string => name !== null) || [];

  //전체 상품 주문하기
  const product: Product =
    cartData
      ?.map((item) => {
        const discountAmount =
          (item.product_price ?? 0) -
          (item.product_price ?? 0) * ((item.discountRate ?? 0) / 100);

        return {
          id: item.product_id,
          name: item.product_name,
          amount: discountAmount * (item.count ?? 0),
          quantity: item.count ?? 0
        };
      })
      .filter((item): item is Product[number] => item !== null) || [];

  //선택 상품명
  const selectedOrderNameArr =
    cartData
      ?.map((item) => {
        if (selectedItems.includes(item.product_id as string)) {
          return item.product_name;
        }
        return null;
      })
      .filter((name): name is string => name !== null) || [];

  //선택 상품 주문하기
  const selectedProduct: Product =
    cartData
      ?.map((item) => {
        const discountAmount =
          (item.product_price ?? 0) -
          (item.product_price ?? 0) * ((item.discountRate ?? 0) / 100);
        if (selectedItems.includes(item.product_id as string)) {
          return {
            id: item.product_id,
            name: item.product_name,
            amount: discountAmount * (item.count ?? 0),
            quantity: item.count ?? 0
          };
        }
        return null; //장바구니 선택 상품 외 null 처리
      })
      .filter((item): item is Product[number] => item !== null) || [];

  if (isPending) return <Loading />;
  if (error) return <div>오류 {error.message}</div>;

  return (
    <div className="max-w-screen-xl mx-auto">
      {cartData && cartData.length > 0 ? (
        <TableDataColumns
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      ) : (
        //장바구니 비어있을 경우 디폴트 이미지 표시
        <div>
          {isDesktop ? (
            <TableDataColumns
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          ) : (
            <DefaultImage text={'장바구니가 비었어요'} />
          )}
        </div>
      )}

      <CartFixedButtons data={cartData ?? []} selectedItems={selectedItems} />

      <div
        className={`${
          isDesktop ? 'flex justify-center items-center gap-4 my-20' : 'hidden'
        }`}
      >
        {/* 선택 상품 주문하기 */}
        <PayButton
          product={selectedProduct}
          orderNameArr={selectedOrderNameArr}
          variant={'orderSelected'}
        />
        {/* 전체 상품 주문하기 */}
        <PayButton
          product={product}
          orderNameArr={orderNameArr}
          variant={'orderAll'}
        />
      </div>
    </div>
  );
};
