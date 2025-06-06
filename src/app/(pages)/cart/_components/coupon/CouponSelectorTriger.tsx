import { CouponSelection } from '@/components/common/coupon/CouponSelection';
import { Modal } from '@/components/ui/Modal';
import clsx from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

const CouponSelectorTrigger = () => {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  // const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [selectedCouponIds, setSelectedCouponIds] = useState<string[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const handleCouponChange = (amount: number, selectedIds: string[]) => {
    setDiscountAmount(amount);
    setSelectedCouponIds(selectedIds);
  };

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between gap-1',
          'cursor-pointer'
        )}
        onClick={() => setIsCouponModalOpen(true)}
      >
        <div className="flex">
          <p>쿠폰 할인</p>
          <ChevronRightIcon />
        </div>
        {/* TODO 모달에서 리턴된 할인 금액으로 변경 */}
        <p>원</p>
      </div>
      <Modal
        isModalOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        headerTitle="할인 쿠폰"
        isFullOnMobile
        className=""
      >
        <CouponSelection onChange={handleCouponChange} />
      </Modal>
    </>
  );
};

export default CouponSelectorTrigger;
