import { Modal } from '@/components/ui/Modal';
import clsx from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

const CouponSelectorTrigger = () => {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

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
        <div>쿠폰 내부 요소 - 공용 컴포넌트 넣기</div>
      </Modal>
    </>
  );
};

export default CouponSelectorTrigger;
