'use client';
import { Address } from '@/types/deliveryAddress';
import clsx from 'clsx';

interface Props {
  address: Address | Address[];
  isDefaultAddress: boolean;
  updateDeliveryAddress: (e: React.MouseEvent<HTMLButtonElement>) => void;
  deleteDeliveryAddress: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedAddressId: string | null;
  isSelecting?: boolean; // 배송지 선택 모드 여부
}

const AddressItem = ({
  address,
  isDefaultAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  selectedAddressId,
  isSelecting = false
}: Props) => {
  const {
    id,
    addressName,
    receiverName,
    phoneNumber,
    baseAddress,
    detailAddress
  } = address as Address;

  const zipCode = baseAddress.match(/\((\d+)\)/)?.[1];
  const baseAddressWithoutZipCode = baseAddress.split('(')[0];

  return (
    <div
      className={clsx(
        'bg-white w-full',
        'flex flex-col',
        isSelecting ? 'gap-0' : 'gap-3',
        'p-4',
        'border rounded-xl',
        'shadow-sm',
        selectedAddressId === id ? 'border-primary-20' : 'border-[#E0E0E0]'
      )}
    >
      <div
        className={clsx('flex items-center gap-2', isSelecting && 'text-xs')}
      >
        <p
          className={`font-semibold text-[16px] ${
            selectedAddressId === id ? 'text-primary-20' : 'text-label-strong'
          } `}
        >
          {addressName}
        </p>
        {isDefaultAddress && (
          <span className="px-2 py-1 text-xs bg-[#F2F2F2] text-label-strong rounded-[6px]">
            기본 배송지
          </span>
        )}
      </div>

      <div className="space-y-1 font-medium text-[14px]">
        <p
          className={`${
            selectedAddressId === id ? 'text-primary-20' : 'text-label-strong'
          } `}
        >
          {receiverName}
        </p>
        <p className="text-label-alternative">{phoneNumber}</p>
        <div className="text-label-strong">
          <div className="flex">
            {baseAddressWithoutZipCode}
            {detailAddress !== '' && <p>, {detailAddress}</p>}
          </div>
          <p>({zipCode})</p>
        </div>
      </div>

      <div
        className={clsx(
          'flex items-center gap-2',
          'font-normal text-label-normal text-[14px]',
          'pt-2 border-t border-gray-100'
        )}
      >
        <button
          onClick={updateDeliveryAddress}
          className="hover:text-primary-20 transition-colors"
        >
          수정
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={deleteDeliveryAddress}
          className="hover:text-red-500 transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default AddressItem;
