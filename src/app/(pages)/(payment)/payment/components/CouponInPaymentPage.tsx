'use client';
import useDeviceSize from '@/hooks/useDeviceSize';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  isCouponApplied: boolean;
  setIsShowPaymentRender: Dispatch<SetStateAction<boolean>>;
}

const CouponInPaymentPage = ({
  isCouponApplied,
  setIsShowPaymentRender
}: Props) => {
  const [isShowCouponList, setIsShowCouponList] = useState(false);

  const { discountAmount } = useCouponStore();
  const { isMobile } = useDeviceSize();

  const handleChangeCoupon = () => {
    setIsShowCouponList(!isShowCouponList);
    setIsShowPaymentRender(false);

    if (isMobile) {
      // return <CouponList />;
    }
  };

  return (
    <div className="bg-white p-4 flex flex-col gap-2 rounded-[12px] border-2 border-[#E0E0E0] mb-4">
      <div className="flex justify-between">
        <h2 className="text-gray-600 font-bold">할인/쿠폰</h2>
        <button
          className="text-xs font-normal text-[#79746D] border-[1px] border-[#959595] rounded-[6px] py-1 px-2"
          onClick={handleChangeCoupon}
          // onClick={() => {
          // router.push('/my-page/coupon-page');
          // sessionStorage.setItem('mode', 'apply');
          // }}
        >
          변경
        </button>
      </div>
      <div className="flex justify-between">
        <p>할인 금액</p>
        <p className="text-gray-700 mt-2">
          {isCouponApplied && discountAmount ? `-${discountAmount}원` : '0원'}
        </p>
      </div>
    </div>
  );
};

export default CouponInPaymentPage;
