'use client';

import SignupCoupon from '@/app/(pages)/my-page/coupon-page/components/SignupCoupon';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import { useEffect, useState } from 'react';

interface CouponListProps {
  coupon: string;
}

const CouponList = ({ coupon }: CouponListProps) => {
  const { setCoupon } = useCouponStore();
  const [isSelectingProduct, setIsSelectingProduct] = useState(false);

  useEffect(() => {
    if (coupon) {
      setCoupon(coupon);
    }
  }, []);

  return (
    <>
      {!isSelectingProduct && (
        <div className="flex justify-between items-center px-4">
          <SignupCoupon />
          <div onClick={() => setIsSelectingProduct(true)}>
            <ChevronRightIcon width={28} height={28} />
          </div>
        </div>
      )}

      {isSelectingProduct && <div>d</div>}
    </>
  );
};

export default CouponList;
