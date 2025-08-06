'use client';

import { AddressesList } from '@/components/common/address';
import AddAddressForm from '@/components/common/address/AddAddressForm';
import { Modal } from '@/components/ui/Modal';
import { MODAL_IDS } from '@/constants';
import { Address } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import { useModalStore } from '@/zustand/useModalStore';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const AddressChangeButton: React.FC = () => {
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);
  const openModalId = useModalStore((state) => state.openModalId);

  const address = useDeliveryStore((s) => s.address);

  const [mode, setMode] = useState<'list' | 'add'>('list');

  const handleModalClose = () => {
    setMode('list');
    closeModal();
  };
  useEffect(() => {
    if (openModalId !== MODAL_IDS.ADDRESS) {
      setMode('list');
    }
  }, [openModalId]);

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
        headerTitle={mode === 'add' ? '배송지 추가' : '배송지 변경'}
        isFullOnMobile
      >
        {mode === 'add' ? (
          <AddAddressForm
            // 등록 완료 시 동작
            onSuccess={() => {
              handleModalClose();
            }}
            onCancel={() => setMode('list')}
          />
        ) : (
          <>
            <AddressesList initialData={address as Address[]} isSelecting />
            <button
              className={clsx(
                'w-full py-3 rounded-[8px] cursor-pointer mt-4',
                'bg-primary-20 text-white'
              )}
              onClick={() => setMode('add')}
            >
              새 배송지 추가
            </button>
          </>
        )}
      </Modal>
    </>
  );
};

export default AddressChangeButton;
