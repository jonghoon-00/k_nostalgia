'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { CountButton } from './CountButton';
import supabase from '@/utils/supabase/client';
import Link from 'next/link';
import { DataTable } from './DataTable';
import Loading from '@/components/common/Loading';
import { useUserCartData } from '@/hooks/cart/useUserCartData';
import { useEffect } from 'react';
import { useDeleteProduct } from '@/hooks/localFood/useDeleteProduct';
import { CgClose } from 'react-icons/cg';
import Swal from 'sweetalert2';
import { DeleteButton } from './DeleteButton';
import useDeviceSize from '@/hooks/useDeviceSize';
import { useGetProduct } from '@/hooks/localFood/useGetProduct';

export type CartItem = {
  id: string | null;
  product_id: string | null;
  image: string[] | null;
  product_price: number | 0;
  product_name: string | null;
  count: number | 0;
  discountRate: number | 0;
  description: string | null;
};

export interface TableProps {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const fetchCartItems = async () => {
  const { data: cartItems, error } = await supabase.from('cart').select('*');

  if (error) {
    console.error('장바구니 데이터를 가져오지 못했습니다.', error);
    return [];
  }

  const mappedCartItems = cartItems.map((item) => ({
    product_id: item.product_id,
    image: item.image ? item.image[0] : null,
    product_price: item.product_price,
    product_name: item.product_name,
    count: item.count,
    discountRate: item.discountRate,
    description: item.description
  }));

  return mappedCartItems;
};

export const TableDataColumns = ({
  selectedItems,
  setSelectedItems
}: TableProps) => {
  const { cartData, isPending, error } = useUserCartData();
  const mutation = useDeleteProduct();
  const { isDesktop } = useDeviceSize();

  const handleDelete = (productId: string) => {
    mutation.mutate(productId);
  };

  const openAlert = (productId: string) => {
    Swal.fire({
      title: '상품을 삭제하시겠어요?',
      showCancelButton: true,
      cancelButtonColor: '#9C6D2E',
      confirmButtonColor: '#f2f2f2',
      cancelButtonText: '취소하기',
      confirmButtonText: '삭제하기',
      customClass: {
        title: 'text-xl mt-10 md:mb-[8px]',
        popup: 'rounded-[16px]',
        actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
        confirmButton:
          'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
        cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(productId);
      }
    });
  };

  //장바구니 페이지 들어왔을 때 체크 활성화 상태
  useEffect(() => {
    if (cartData) {
      const allProductIds = cartData
        .map((item) => item.product_id)
        .filter((id): id is string => id !== null);

      setSelectedItems(allProductIds);
    }
  }, [cartData, setSelectedItems]);

  if (isPending) return <Loading />;
  if (error) return <div>오류 {error.message}</div>;

  const columns: ColumnDef<CartItem>[] = [
    {
      //전체선택
      id: 'select',
      header: ({ table }) => (
        <>
          <div className="flex items-center whitespace-nowrap md:relative md:top-[-70px] md:z-40 md:left-3">
            <Checkbox
              checked={
                selectedItems.length === cartData?.length &&
                cartData?.length > 0
              }
              onCheckedChange={(value) => {
                //console.log(value);
                const allSelectedItems = value
                  ? cartData?.map((item) => item.product_id)
                  : [];
                setSelectedItems(allSelectedItems as string[]);
                table.toggleAllPageRowsSelected(!!value);
              }}
              aria-label="Select all"
            />
            <div
              className={`text-base text-label-strong ml-4 md:ml-0 absolute left-10`}
            >
              {`전체 선택 (${selectedItems.length}/${cartData?.length || 0})`}
            </div>
          </div>
          <div
            className={`${
              isDesktop ? 'absolute top-[-3.5rem] right-0' : 'hidden'
            }`}
          >
            <DeleteButton
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
        </>
      ),
      //부분선택
      cell: ({ row }) => (
        <Checkbox
          checked={
            selectedItems.length > 0
              ? selectedItems.includes(row.getValue('product_id'))
              : false
          }
          onCheckedChange={(value) => {
            setSelectedItems((prev) => {
              if (value) {
                return [...prev, row.getValue('product_id')];
              } else {
                return prev.filter((id) => id != row.getValue('product_id'));
              }
            });
          }}
          aria-label="Select row"
          style={{ transform: 'translate(0, -180%)' }}
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'description',
      header: '',
      cell: ({ row }) => (
        <div className="hidden">{row.getValue('description')}</div>
      )
    },
    {
      //상품 이미지
      accessorKey: 'image',
      header: () => <div className="max-w-[115px]"></div>,
      cell: ({ row }) => (
        <Link href={`/local-food/${row.getValue('product_id')}`}>
          <Image
            src={row.getValue('image')}
            width={115}
            height={115}
            priority
            alt={row.getValue('product_name')}
            style={{
              borderRadius: '8px',
              width: 115,
              height: 115,
              objectFit: 'cover'
            }}
            className="md:translate-x-0"
          />
        </Link>
      )
    },
    {
      //상품 이름 => Pc: hidden / Mo : 상품이름 + 가격 + 수량버튼
      accessorKey: 'product_name',
      header: () => (
        <div className="hidden md:block absolute top-4 left-14 text-left">
          상품정보
        </div>
      ),
      cell: ({ row }) => {
        const price = row.getValue('product_price') as number;
        const count = row.getValue('count') as number;
        const discountRate = row.getValue('discountRate') as number;

        const discountAmount = price - (price * discountRate) / 100;
        const totalAmount = discountAmount * count;

        return (
          <>
            {isDesktop ? (
              <div className=" text-label-strong text-base text-left ml-4">
                {`${row.getValue('product_name')}`}
                <p className="mt-1 text-sm text-label-assistive">{`${row.getValue(
                  'description'
                )}`}</p>
              </div>
            ) : (
              <div className="ml-4 text-label-strong">
                <h2 className="text-base font-medium">{`${row.getValue(
                  'product_name'
                )}`}</h2>
                <div className="font-normal text-label-normal text-sm">
                  {`${discountRate}%`}
                  <span className="ml-1 inline-block text-base font-normal text-label-assistive line-through">
                    {`${price.toLocaleString()}원`}
                  </span>
                </div>

                <h1 className="text-lg font-semibold text-primary-20">{`${totalAmount.toLocaleString()}원`}</h1>
                <CountButton
                  product_id={row.getValue('product_id')}
                  counts={row.getValue('count')}
                  selectedItems={selectedItems}
                />
              </div>
            )}
          </>
        );
      }
    },

    {
      //수량 버튼
      accessorKey: 'count',
      header: () => <div className="hidden md:block">수량</div>,
      cell: ({ row }) => (
        <div className="hidden md:max-w-[84px] md:mx-auto md:block ">
          <CountButton
            product_id={row.getValue('product_id')}
            counts={row.getValue('count')}
            selectedItems={selectedItems}
          />
        </div>
      )
    },

    {
      accessorKey: 'product_id',
      header: '',
      cell: ({ row }) => (
        <div className="hidden">{row.getValue('product_id')}</div>
      )
    },

    {
      //할인 전 금액
      accessorKey: 'discountRate',
      header: () => <div className="hidden md:block">할인 전 금액</div>,
      cell: ({ row }) => {
        const price = row.getValue('product_price') as number;
        const isSelected = selectedItems.includes(row.getValue('product_id'));

        return (
          <div className="invisible md:visible">
            {isSelected ? `${price.toLocaleString()}원` : '0원'}
          </div>
        );
      }
    },
    {
      //상품 가격
      accessorKey: 'product_price',
      header: () => <div className="hidden md:block">주문금액</div>,
      cell: ({ row }) => {
        const price = row.getValue('product_price') as number;
        const count = row.getValue('count') as number;
        const discountRate = row.getValue('discountRate') as number;

        const discountAmount = price - (price * discountRate) / 100;
        const totalAmount = discountAmount * count;

        return (
          <div className="hidden md:block text-lg text-primary-strong font-semibold">
            <div className="font-normal text-label-normal text-sm md:hidden">
              {`${discountRate}%`}
              <span className="ml-1 inline-block text-base font-normal text-label-assistive line-through">
                {`${price.toLocaleString()}원`}
              </span>
            </div>

            {`${totalAmount.toLocaleString()}원`}
          </div>
        );
      }
    },
    {
      //삭제 버튼
      id: 'delete',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => openAlert(row.getValue('product_id'))}
          className="absolute right-4 translate-x-0 translate-y-[-3.6rem] md:translate-y-[-1rem]"
        >
          <CgClose className="text-[#959595] w-7 h-7" />
        </button>
      )
    }
  ];
  return (
    <div
      className={`max-w-screen-xl mx-auto ${
        isDesktop && 'text-center relative'
      }`}
    >
      <h1
        className={`${
          isDesktop &&
          'inline-flex relative mb-10 mt-[8rem] text-primary-10 px-4 py-3 border border-r-0 border-l-0 border-t-primary-20 border-b-primary-20'
        }`}
      >
        <Image
          src={'/image/Tiger_Cart.png'}
          width={93}
          height={47}
          alt="장바구니호랑이"
          className="absolute top-[-79%] right-[-30%]"
        />
        장바구니
      </h1>

      <div className="relative">
        <div
          className={`${
            isDesktop ? 'hidden' : 'block fixed top-[5rem] right-4 z-50'
          }`}
        >
          <DeleteButton
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
        <DataTable
          columns={columns}
          data={cartData ?? []}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
};
