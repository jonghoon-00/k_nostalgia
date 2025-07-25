'use client';

import DownButton from '@/components/icons/DownButton';
import UpButton from '@/components/icons/UpButton';
import { AllAddresses } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import AddAddressButton from './AddAddressButton';
import AddressSummaryCard from './AddressSummaryCard';

interface Props {
  initialAddress: AllAddresses;
  initialShippingRequest: string;
}

export default function DeliveryAddressClient({
  initialAddress,
  initialShippingRequest
}: Props) {
  const { defaultAddress, addresses } = initialAddress;

  // Zustand store
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

  // Local state for dropdown and custom input
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Determine selected address
  const selectedAddress = selectedAddressId
    ? [defaultAddress, ...addresses].find((a) => a.id === selectedAddressId) ||
      defaultAddress
    : defaultAddress;

  // Initialize store from props
  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress, setAddress]);
  useEffect(() => {
    setShippingRequest(initialShippingRequest);
  }, [initialShippingRequest, setShippingRequest]);

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
