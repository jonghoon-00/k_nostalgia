import { CouponSelection } from '@/components/common/coupon/CouponSelection';
import { Modal } from '@/components/ui/Modal';
import { MODAL_IDS } from '@/constants';
import { useCouponDiscount } from '@/hooks/coupon/useCouponDiscount';
import { useModalStore } from '@/zustand/useModalStore';
import clsx from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import React from 'react';

const CouponSelectorTrigger: React.FC = () => {
  const { open } = useModalStore();
  const discountAmount = useCouponDiscount();

  return (
    <>
      <button
        type="button"
        className={clsx(
          'flex items-center justify-between gap-1',
          'w-full',
          'cursor-pointer'
        )}
        onClick={() => open(MODAL_IDS.COUPON)}
      >
        <div className="flex">
          <p>쿠폰 할인</p>
          <ChevronRightIcon />
        </div>
        <p>{discountAmount} 원</p>
      </button>
      <Modal modalId={MODAL_IDS.COUPON} headerTitle="할인 쿠폰" isFullOnMobile>
        <CouponSelection />
      </Modal>
    </>
  );
};

export default CouponSelectorTrigger;
