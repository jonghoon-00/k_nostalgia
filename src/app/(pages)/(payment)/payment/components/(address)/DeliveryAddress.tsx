'use client';

import DownButton from '@/components/icons/DownButton';
import UpButton from '@/components/icons/UpButton';
import { Address } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import {
  DropdownMenu,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import AddAddressButton from './AddAddressButton';
import AddressChangeButton from './AddressChangeButton';
import AddressSummaryCard from './AddressSummaryCard';

interface Props {
  initialAddresses: Address[];
  initialShippingRequest: string;
}

export const DeliveryAddress = ({
  initialAddresses,
  initialShippingRequest
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const addresses = useDeliveryStore((s) => s.address);
  const selectedAddressId = useDeliveryStore((s) => s.selectedAddressId);
  const shippingRequest = useDeliveryStore((s) => s.shippingRequest);
  const shouldStoreDeliveryRequest = useDeliveryStore(
    (s) => s.shouldStoreDeliveryRequest
  );

  const {
    setAddress,
    setShippingRequest,
    setShouldStoreDeliveryRequest,
    setSelectedAddressId
  } = useDeliveryStore((s) => ({
    setAddress: s.setAddress,
    setShippingRequest: s.setShippingRequest,
    setShouldStoreDeliveryRequest: s.setShouldStoreDeliveryRequest,
    setSelectedAddressId: s.setSelectedAddressId
  }));

  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      setAddress(initialAddresses.map((a) => ({ ...a })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShippingRequest(initialShippingRequest ?? '');
  }, [initialShippingRequest, setShippingRequest]);

  const selectedAddress = useMemo(() => {
    if (!addresses || addresses.length === 0) return null;

    if (selectedAddressId) {
      const hit = addresses.find((a) => a.id === selectedAddressId);
      if (hit) return hit;
    }
    return addresses.find((a) => a.isDefault) ?? addresses[0];
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      if (selectedAddressId) setSelectedAddressId(null);
      return;
    }
    if (!selectedAddress) {
      const pick = addresses.find((a) => a.isDefault)?.id ?? addresses[0].id;
      setSelectedAddressId(pick);
    }
  }, [addresses, selectedAddress, selectedAddressId, setSelectedAddressId]);

  return (
    <div
      className={clsx(
        'bg-white p-4 mb-4 flex flex-col gap-2',
        'border border-[#E0E0E0] rounded-[12px]'
      )}
    >
      <h2 className="w-full text-label-strong text-[18px] font-semibold">
        배송지
      </h2>

      {!selectedAddress ? (
        <AddAddressButton />
      ) : (
        <div className="flex justify-between items-start">
          <AddressSummaryCard
            key={selectedAddress.id}
            selectedAddress={selectedAddress}
          />
          <AddressChangeButton />
        </div>
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
            onClick={() => setIsDropdownOpen((p) => !p)}
          >
            {'직접 입력하기'}
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
};

export default DeliveryAddress;
