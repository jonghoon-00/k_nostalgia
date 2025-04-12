'use client';

import DownButton from '@/components/icons/DownButton';
import PlusIcon from '@/components/icons/PlusIcon';
import UpButton from '@/components/icons/UpButton';
import { AllAddresses } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { SetStateAction, useEffect, useState } from 'react';
import AddressChangeButton from './AddressChangeButton';

interface Props {
  initialData: AllAddresses;
  shippingRequest: string;
  setShippingRequest: React.Dispatch<SetStateAction<string>>;
  shouldStoreDeliveryRequest: boolean;
  setShouldStoreDeliveryRequest: React.Dispatch<SetStateAction<boolean>>;
}

const DeliveryAddress = ({
  initialData,
  shippingRequest,
  setShippingRequest,
  shouldStoreDeliveryRequest,
  setShouldStoreDeliveryRequest
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { defaultAddress, addresses } = initialData;

  const { selectedAddressId, setAddress } = useDeliveryStore();

  const selectedAddress = selectedAddressId
    ? [defaultAddress, ...addresses].find(
        (address) => address.id === selectedAddressId
      ) || defaultAddress
    : defaultAddress;

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress, setAddress]);

  const {
    id,
    addressName,
    receiverName,
    phoneNumber,
    baseAddress,
    detailAddress
  } = selectedAddress;

  const zipCode = baseAddress.match(/\((\d+)\)/)?.[1];
  const baseAddressWithoutZipCode = baseAddress.split('(')[0];

  const ADD_ADDRESS_PAGE = '/my-page/setting/delivery-address/add-new';

  return (
    <div className="bg-white p-4 flex flex-col gap-2 rounded-[12px] border-2 border-[#E0E0E0] mb-4">
      <div className="flex flex-col justify-between items-center">
        <h2 className="w-full text-label-strong text-[18px] font-semibold">
          배송지
        </h2>
      </div>

      {/* 배송지 없을 경우(추가 버튼) */}
      {!defaultAddress ? (
        <Link href={`${ADD_ADDRESS_PAGE}?from=payment`} className="w-full">
          <button className="w-full flex justify-center items-center gap-2 px-4 py-3 h-10 border-[1px] border-primary-20 text-primary-20 rounded-[8px]">
            <PlusIcon color={'#9C6D2E'} />
            <p className="font-semibold">배송지 추가하기</p>
          </button>
        </Link>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-label-strong text-[16px] font-semibold">
              {addressName}
            </p>
            {/* 변경 버튼 */}
            <AddressChangeButton selectedAddressId={id} />
          </div>
          <p className="text-label-strong">{receiverName}</p>
          <p className="text-label-alternative">{phoneNumber}</p>
          <div className="text-label-strong">
            <div className="flex">
              {baseAddressWithoutZipCode}
              {detailAddress !== '' && <p>, {detailAddress}</p>}
            </div>
            <p>({zipCode})</p>
          </div>
        </div>
      )}

      {/* 구분선 */}
      <div className="w-full h-[2px] my-1 bg-[#F2F2F2]"></div>

      {/* 요청 사항 dropdown 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <button className="w-full flex justify-between items-center gap-2 px-4 py-3 h-10 border-[1px] rounded-[8px] border-gray-300 text-sm text-[#AFACA7]">
            요청사항 직접 입력하기
            <span>{isDropdownOpen ? <DownButton /> : <UpButton />}</span>
          </button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      <div>
        <textarea
          className="resize-none h-[100px] w-full border border-gray-300 rounded mt-2 p-2 text-sm"
          placeholder="요청사항을 입력해주세요 :)"
          name="shippingRequest"
          rows={2}
          value={shippingRequest}
          onChange={(e) => setShippingRequest(e.target.value)}
        ></textarea>
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            className="mr-2"
            checked={shouldStoreDeliveryRequest || shippingRequest !== ''}
            onChange={(e) => setShouldStoreDeliveryRequest(e.target.checked)}
          />
          <span className="text-gray-600 text-sm">다음에도 사용할게요</span>
        </label>
      </div>
    </div>
  );
};

export default DeliveryAddress;
