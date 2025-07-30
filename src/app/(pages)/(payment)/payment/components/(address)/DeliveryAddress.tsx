'use client';

import { useEffect, useState } from 'react';

import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import clsx from 'clsx';

import { Address } from '@/types/deliveryAddress';

import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';

import DownButton from '@/components/icons/DownButton';
import UpButton from '@/components/icons/UpButton';

import AddAddressButton from './AddAddressButton';
import AddressSummaryCard from './AddressSummaryCard';

interface Props {
  initialAddress: Address[];
  initialShippingRequest: string;
}

export default function DeliveryAddress({
  initialAddress,
  initialShippingRequest
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Zustand
  const addresses = useDeliveryStore((s) => s.address);
  const shippingRequest = useDeliveryStore((s) => s.shippingRequest);
  const selectedAddressId = useDeliveryStore((s) => s.selectedAddressId);
  const shouldStoreDeliveryRequest = useDeliveryStore(
    (s) => s.shouldStoreDeliveryRequest
  );
  const { setAddress, setShippingRequest, setShouldStoreDeliveryRequest } =
    useDeliveryStore((s) => ({
      setAddress: s.setAddress,
      setShippingRequest: s.setShippingRequest,
      setShouldStoreDeliveryRequest: s.setShouldStoreDeliveryRequest
    }));

  const addressList =
    addresses && addresses.length > 0 ? addresses : initialAddress;
  const hasNoAddress = !addressList || addressList.length === 0;

  const defaultAddress = addressList?.find((a) => a.isDefault) ?? null;

  // 선택된 배송지 우선 → 없으면 default → 없으면 null
  const selectedAddress = hasNoAddress
    ? null
    : selectedAddressId
    ? addressList.find((a) => a.id === selectedAddressId) || defaultAddress
    : defaultAddress;

  // Initialize store from props
  useEffect(() => {
    setAddress(initialAddress);
  }, [initialAddress]);
  useEffect(() => {
    setShippingRequest(initialShippingRequest);
  }, [initialShippingRequest, setShippingRequest]);

  //TODO 컴포넌트 언마운트 시,  ZUSTAND 초기화
  //TODO ZUSTAND 정리 (필요 요소, 불필요 요소 확인)

  return (
    <div
      className={clsx(
        'bg-white p-4 mb-4 flex flex-col gap-2',
        'border-2 border-[#E0E0E0] rounded-[12px]'
      )}
    >
      <h2 className="w-full text-label-strong text-[18px] font-semibold">
        배송지
      </h2>

      {!selectedAddress ? (
        <AddAddressButton />
      ) : (
        <AddressSummaryCard selectedAddress={selectedAddress} />
      )}

      <div className="w-full h-px bg-gray-200 my-2" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={clsx(
              'w-full flex justify-between items-center',
              'px-4 py-3 border rounded-lg text-sm text-gray-500 bg-white'
            )}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {shippingRequest || '직접 입력하기'}
            {isDropdownOpen ? <UpButton /> : <DownButton />}
          </button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      <textarea
        className={clsx(
          'mt-2 p-2 w-full h-24 border rounded-lg text-sm resize-none'
        )}
        placeholder="요청사항을 입력해주세요 :)"
        value={shippingRequest ?? ''}
        onChange={(e) => setShippingRequest(e.target.value)}
      />

      <label
        className={clsx(
          'flex items-center mt-2 text-sm text-gray-600 cursor-pointer'
        )}
      >
        <input
          type="checkbox"
          className="mr-2"
          checked={shouldStoreDeliveryRequest}
          onChange={(e) => setShouldStoreDeliveryRequest(e.target.checked)}
        />
        다음에도 사용할게요
      </label>
    </div>
  );
}
