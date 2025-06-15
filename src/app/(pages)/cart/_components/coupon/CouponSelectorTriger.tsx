import { CouponSelection } from '@/components/common/coupon/CouponSelection';
import { Modal } from '@/components/ui/Modal';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import { useModalStore } from '@/zustand/useModalStore';
import clsx from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import React, { SetStateAction } from 'react';

interface Props {
  discountAmount: number;
  setDiscountAmount: React.Dispatch<SetStateAction<number>>;
}

const CouponSelectorTrigger: React.FC<Props> = ({
  discountAmount,
  setDiscountAmount
}) => {
  const { open } = useModalStore();
  const setSelectedCouponIds = useCouponStore((s) => s.setSelectedCouponIds);

  const handleCouponChange = (amount: number, selectedIds: string[]) => {
    setDiscountAmount(amount);
    setSelectedCouponIds(selectedIds);
  };

  return (
    <>
      <button
        type="button"
        className={clsx(
          'flex items-center justify-between gap-1',
          'w-full',
          'cursor-pointer'
        )}
        onClick={open}
      >
        <div className="flex">
          <p>쿠폰 할인</p>
          <ChevronRightIcon />
        </div>
        <p>{discountAmount} 원</p>
      </button>
      <Modal headerTitle="할인 쿠폰" isFullOnMobile className="">
        <CouponSelection handleCouponChange={handleCouponChange} />
      </Modal>
    </>
  );
};

export default CouponSelectorTrigger;
