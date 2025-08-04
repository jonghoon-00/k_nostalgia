// 배송지 변경 버튼

// 모바일 사이즈 : 배송지 변경 페이지로 이동
// 데스크탑 사이즈 : 배송지 변경 모달

//TODO : 데스크탑 사이즈에서 모달 띄우기(컴포넌트들 가져오기)

'use client';

import { AddressesList } from '@/components/common/address';
import { Modal } from '@/components/ui/Modal';
import { MODAL_IDS } from '@/constants';
import { Address } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import { useModalStore } from '@/zustand/useModalStore';
import React from 'react';

interface Props {
  selectedAddressId: string;
}

const AddressChangeButton: React.FC<Props> = ({ selectedAddressId }) => {
  const openModal = useModalStore((state) => state.open);
  const address = useDeliveryStore((s) => s.address);

  return (
    <>
      <button
        className="text-xs font-normal text-[#79746D] border-[1px] border-[#959595] rounded-[6px] py-1 px-2"
        onClick={() => openModal(MODAL_IDS.ADDRESS)}
      >
        변경
      </button>
      <Modal
        modalId={MODAL_IDS.ADDRESS}
        headerTitle="배송지 변경"
        isFullOnMobile
      >
        <AddressesList initialData={address as Address[]} isSelecting />
      </Modal>
    </>
  );
};

export default AddressChangeButton;
