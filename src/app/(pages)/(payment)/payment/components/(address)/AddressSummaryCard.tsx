import { Address } from '@/types/deliveryAddress';
import React from 'react';

interface Props {
  selectedAddress: Address;
}

const AddressSummaryCard: React.FC<Props> = ({ selectedAddress }) => {
  const { addressName, receiverName, phoneNumber, baseAddress, detailAddress } =
    selectedAddress;

  const zipCode = baseAddress.match(/\((\d+)\)/)?.[1];
  const baseAddressWithoutZipCode = baseAddress.split('(')[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-label-strong text-[16px] font-semibold">
          {addressName}
        </p>
      </div>
      <p className="text-label-strong">{receiverName}</p>
      <p className="text-label-alternative">{phoneNumber}</p>
      <div className="text-label-strong">
        <div className="flex">
          {baseAddressWithoutZipCode}
          {detailAddress && detailAddress.trim() && <p>, {detailAddress}</p>}
        </div>
        <p>({zipCode})</p>
      </div>
    </div>
  );
};

export default AddressSummaryCard;
