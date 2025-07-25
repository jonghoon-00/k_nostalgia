import { Address } from '@/types/deliveryAddress';
import React from 'react';
import AddressChangeButton from './AddressChangeButton';

interface Props {
  selectedAddress: Address;
}

const AddressSummaryCard: React.FC<Props> = ({ selectedAddress }) => {
  //TODO Address prop의 유효성 검사 추가 (undefined나 null일 경우)
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
  return (
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
          {detailAddress && detailAddress.trim() && <p>, {detailAddress}</p>}
        </div>
        <p>({zipCode})</p>
      </div>
    </div>
  );
};

export default AddressSummaryCard;
