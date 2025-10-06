'use client';

import AddAddressForm from '@/components/common/address/AddAddressForm';
import PlusIcon from '@/components/icons/PlusIcon';
import { Modal } from '@/components/ui/Modal';
import { MODAL_IDS } from '@/constants';
import { useModalStore } from '@/zustand/useModalStore';
import clsx from 'clsx';

const AddAddressButton = () => {
  const open = useModalStore((state) => state.open);
  const closeModal = useModalStore((s) => s.close);

  const onSuccess = () => {
    closeModal();
    window.location.reload();
  };

  return (
    <>
      <button
        type="button"
        className={clsx(
          'w-full h-10',
          'flex justify-center items-center gap-2',
          'px-4 py-3',
          'border-[1px] border-primary-20 rounded-[8px]',
          'text-primary-20'
        )}
        onClick={() => open(MODAL_IDS.ADDRESS)}
      >
        <PlusIcon color={'#9C6D2E'} />
        <p className="font-semibold">배송지 추가하기</p>
      </button>

      <Modal
        headerTitle="배송지 추가하기"
        isFullOnMobile
        modalId={MODAL_IDS.ADDRESS}
      >
        <AddAddressForm onSuccess={onSuccess} />
      </Modal>
    </>
  );
};

export default AddAddressButton;
