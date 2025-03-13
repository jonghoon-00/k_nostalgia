'use client';

import { AllAddresses } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AddressItem from './AddressItem';

interface Props {
  initialData: AllAddresses;
}

const AddressesList = ({ initialData }: Props) => {
  const { defaultAddress, addresses } = initialData;

  const [defaultAddressState, setDefaultAddressState] =
    useState(defaultAddress);
  const [addressesState, setAddressesState] = useState(addresses);

  //배송지 변경(결제 페이지에서 넘어왔을 경우)
  const router = useRouter();

  const params = useSearchParams();
  const isFromPayment = params.get('from') === 'payment';
  const addressIdParam = params.get('addressId');

  const { selectedAddressId, setSelectedAddressId } = useDeliveryStore();

  const handleAddressChange = (id: string) => {
    if (!isFromPayment) {
      return;
    }
    setSelectedAddressId(id);
    router.push('/payment');
  };

  useEffect(() => {
    if (isFromPayment && addressIdParam) {
      setSelectedAddressId(addressIdParam);
    }
  }, []);

  //배송지 수정
  const updateDeliveryAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    //e.stopPropagation() 는 결제페이지-> 배송지 변경 때에 필요한 부분을
    //label 태그로 묶어놨더니 클릭 이벤트 충돌나서 붙여둔거에요
    //확인하신 후에 이 주석은 지워주세요
    e.stopPropagation();
    alert(
      'api/delivery-address, service/address.service.ts 파일에 필요한 로직 추가해서 작업해주시면될것같아용'
    );
  };

  //배송지 삭제
  const deleteDeliveryAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    alert(
      'DB에 defaultAddress, addresses로 항목 나눠서 들어가져있고 각각 id 포함되어있습니다'
    );
  };

  return (
    <>
      {/* 해당 페이지를 결제 진행중 배송지 변경 -> 으로 넘어왔을 때에만
      해당 추가 버튼이 추가됩니다
      레이아웃 자체 변경이 어려워서 이렇게 넣어뒀습니다.(추후개선필요) */}
      {isFromPayment && (
        <div className="md:hidden top-6 right-4 fixed z-[50] cursor-pointer h-[70px]">
          <p
            className="text-lg font-semibold text-primary-20"
            onClick={() =>
              router.push(
                `${process.env.NEXT_PUBLIC_BASE_URL}//my-page/setting/delivery-address/add-new`
              )
            }
          >
            추가
          </p>
        </div>
      )}

      <main className="mt-14 mb-16 overflow-auto flex flex-col gap-4">
        <div
          className="flex cursor-pointer gap-2"
          onClick={() => handleAddressChange(defaultAddress.id)}
        >
          {isFromPayment && (
            <input
              type="radio"
              id={`address-${defaultAddress.id}`}
              checked={defaultAddress.id === selectedAddressId}
              onChange={() => handleAddressChange(defaultAddress.id)}
              className="bg-primary-20 accent-primary-20 w-5"
            />
          )}
          <label
            htmlFor={`address-${defaultAddress.id}`}
            className={`flex-1 ${isFromPayment && 'cursor-pointer'}`}
          >
            <AddressItem
              key={defaultAddress.id}
              address={defaultAddressState}
              isDefaultAddress={true}
              updateDeliveryAddress={updateDeliveryAddress}
              deleteDeliveryAddress={deleteDeliveryAddress}
              selectedAddressId={selectedAddressId}
            />
          </label>
        </div>

        {addressesState.map((address) => (
          <div
            key={address.id}
            className="flex cursor-pointer gap-2"
            onClick={() => handleAddressChange(defaultAddress.id)}
          >
            {isFromPayment && (
              <input
                type="radio"
                id={`address-${address.id}`}
                checked={address.id === selectedAddressId}
                onChange={() => handleAddressChange(address.id)}
                className="bg-primary-20 accent-primary-20 w-5"
              />
            )}
            <label
              htmlFor={`address-${address.id}`}
              className={`flex-1 ${isFromPayment && 'cursor-pointer'}`}
            >
              <AddressItem
                address={address}
                isDefaultAddress={false}
                updateDeliveryAddress={updateDeliveryAddress}
                deleteDeliveryAddress={deleteDeliveryAddress}
                selectedAddressId={selectedAddressId}
              />
            </label>
          </div>
        ))}
      </main>
    </>
  );
};

export default AddressesList;
