import { Address } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import React, { useEffect } from 'react';

interface Props {
  selectedAddress: Address | null;
}

const AddressSummaryCard: React.FC<Props> = ({}) => {
  // 파생값을 한 번에 계산
  const snap = useDeliveryStore((s) => {
    const list = s.address ?? [];
    const selectedId = s.selectedAddressId ?? null; // undefined도 null 취급
    const fallbackId = list[0]?.id ?? null;
    const effectiveId = selectedId ?? fallbackId; // 보정된 ID
    const selected = effectiveId
      ? list.find((a) => a.id === effectiveId) ?? null
      : null;

    return { list, selected, effectiveId, rawSelectedId: s.selectedAddressId };
  });

  useEffect(() => {
    if (!snap.rawSelectedId && snap.effectiveId) {
      // selectedAddressId가 null/undefined라면 보정 ID로 설정
      useDeliveryStore.getState().setSelectedAddressId(snap.effectiveId);
    }
  }, [snap.rawSelectedId, snap.effectiveId]);

  if (!snap.selected) return null;

  const {
    addressName = '',
    receiverName = '',
    phoneNumber = '',
    baseAddress = '',
    detailAddress = ''
  } = snap.selected;
  const zipCode = baseAddress.match(/\((\d+)\)/)?.[1] ?? '';
  const baseAddressWithoutZipCode = baseAddress
    ? baseAddress.split('(')[0]
    : '';

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
        {zipCode && <p>({zipCode})</p>}
      </div>
    </div>
  );
};

export default AddressSummaryCard;
