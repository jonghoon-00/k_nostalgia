'use client';
import { CouponSelection } from '@/components/common/coupon/CouponSelection';
import { Modal } from '@/components/ui/Modal';
import { MODAL_IDS } from '@/constants';
import { useCouponDiscount } from '@/hooks/coupon/useCouponDiscount';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import { useModalStore } from '@/zustand/useModalStore';
import clsx from 'clsx';
import { useEffect } from 'react';

export const CouponInPaymentPage = () => {
  const discount = useCouponDiscount(); //hook
  const setIsCouponApplied = usePaymentRequestStore(
    (state) => state.setIsCouponApplied
  );

  const { open } = useModalStore((state) => ({
    open: state.open
  }));

  useEffect(() => {
    if (discount > 0) {
      setIsCouponApplied(true);
    } else {
      setIsCouponApplied(false);
    }
  }, [discount, setIsCouponApplied]);
  return (
    <div
      className={clsx(
        'bg-white',
        'p-4',
        'flex flex-col gap-2',
        'rounded-[12px]',
        'border border-[#E0E0E0]',
        'mb-4'
      )}
    >
      <div className="flex justify-between">
        <h2 className="text-gray-600 font-bold">할인/쿠폰</h2>
        <button
          type="button"
          className={clsx(
            'text-xs text-gray-500',
            'border rounded',
            'px-2 py-1'
          )}
          onClick={() => open(MODAL_IDS.COUPON)}
        >
          변경
        </button>
      </div>
      <Modal modalId={MODAL_IDS.COUPON} headerTitle="할인 쿠폰" isFullOnMobile>
        <CouponSelection />
      </Modal>
      <div className="flex justify-between">
        <span>할인 금액</span>
        <span>{discount.toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default CouponInPaymentPage;
