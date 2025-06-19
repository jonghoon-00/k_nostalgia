'use client';
import { CouponSelection } from '@/components/common/coupon/CouponSelection';
import { Modal } from '@/components/ui/Modal';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import { useModalStore } from '@/zustand/useModalStore';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
  setIsCouponApplied: (aplied: boolean) => void;
  discountAmount?: number;
  setDiscountAmount: Dispatch<SetStateAction<number>>;
}

const CouponInPaymentPage: React.FC<Props> = ({
  setIsCouponApplied,
  discountAmount,
  setDiscountAmount
}) => {
  const { open } = useModalStore((state) => ({
    open: state.open
  }));

  const setSelectedCouponIds = useCouponStore((s) => s.setSelectedCouponIds);

  const handleCouponChange = (amount: number, selectedIds: string[]) => {
    setDiscountAmount(amount);
    setSelectedCouponIds(selectedIds);
  };
  useEffect(() => {
    setIsCouponApplied(discountAmount !== undefined && discountAmount > 0);
    return () => {
      setIsCouponApplied(false);
    };
    // eslint-disable-next-line
  }, [discountAmount]);

  return (
    <div className="bg-white p-4 flex flex-col gap-2 rounded-[12px] border-2 border-[#E0E0E0] mb-4">
      <div className="flex justify-between">
        <h2 className="text-gray-600 font-bold">할인/쿠폰</h2>
        <button
          type="button"
          className="text-xs font-normal text-[#79746D] border-[1px] border-[#959595] rounded-[6px] py-1 px-2"
          onClick={open}
        >
          변경
        </button>
        <Modal headerTitle="할인 쿠폰" isFullOnMobile>
          <CouponSelection handleCouponChange={handleCouponChange} />
        </Modal>
      </div>
      <div className="flex justify-between">
        <p>할인 금액</p>
        <p className="text-gray-700 mt-2">{`${discountAmount}원`}</p>
      </div>
    </div>
  );
};

export default CouponInPaymentPage;
