// AddressChangeButton.tsx
'use client';

import { AddressesList } from '@/components/common/address';
import AddAddressForm from '@/components/common/address/AddAddressForm';
import { BackButton } from '@/components/icons/BackButton';
import { XClose } from '@/components/icons/XClose';
import { Modal } from '@/components/ui/Modal';
import { MODAL_IDS } from '@/constants';
import { Address } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import { useModalStore } from '@/zustand/useModalStore';
import { useEffect, useState } from 'react';

const AddressChangeButton: React.FC = () => {
  const openModal = useModalStore((s) => s.open);
  const closeModal = useModalStore((s) => s.close);
  const openModalId = useModalStore((s) => s.openModalId);

  const address = useDeliveryStore((s) => s.address);

  const [mode, setMode] = useState<'list' | 'add'>('list');

  const handleModalClose = () => {
    setMode('list');
    closeModal();
  };

  useEffect(() => {
    if (openModalId !== MODAL_IDS.ADDRESS) setMode('list');
  }, [openModalId]);

  const listModeHeader = (
    <div className="flex justify-between items-center w-full">
      <button
        type="button"
        onClick={handleModalClose}
        className="flex items-center justify-center"
        aria-label="닫기"
      >
        <BackButton />
      </button>
      <h3 className="text-lg font-medium">배송지 변경</h3>
      <button
        type="button"
        onClick={() => setMode('add')}
        className="text-base font-medium text-primary-20"
      >
        추가
      </button>
    </div>
  );

  const addModeHeader = (
    <div className="flex justify-between items-center w-full">
      <button
        type="button"
        onClick={() => setMode('list')}
        className="w-7 h-7 flex items-center justify-center"
        aria-label="뒤로가기"
      >
        <BackButton />
      </button>
      <h3 className="text-lg font-medium">배송지 추가</h3>
      <button
        type="button"
        onClick={handleModalClose}
        className="w-7 h-7 flex items-center justify-center"
        aria-label="닫기"
      >
        <XClose />
      </button>
    </div>
  );

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
        header={mode === 'add' ? addModeHeader : listModeHeader}
        width={471}
        height={710}
        isFullOnMobile
      >
        {mode === 'add' ? (
          <AddAddressForm
            onSuccess={handleModalClose}
            onCancel={() => setMode('list')}
          />
        ) : (
          <AddressesList initialData={address as Address[]} isSelecting />
        )}
      </Modal>
    </>
  );
};

export default AddressChangeButton;
