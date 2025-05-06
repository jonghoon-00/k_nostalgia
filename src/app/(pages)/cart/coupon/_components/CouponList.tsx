'use client';

import SignupCoupon from '@/app/(pages)/my-page/coupon-page/components/CouponItem';
import ChevronRightIcon from '@/components/icons/ChevronRightIcon';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import { useEffect, useState } from 'react';

interface CouponListProps {
  couponList: string[];
}

const CouponList = ({ couponList }: CouponListProps) => {
  const { setCoupon } = useCouponStore();
  const [isSelectingProduct, setIsSelectingProduct] = useState(false);

  useEffect(() => {
    if (coupon) {
      setCoupon(coupon);
    }
  }, []);

  return (
    <>
      {/* TODO 쿠폰 - 상품 리스트에서 적용하는 부분 삭제됨 */}
      {/* 쿠폰 리스트 띄우고, 거기에서 클릭 시 전에 금액에 적용 */}
      {/* 쿠폰이 있을 경우 기본값 : 적용 상태 + 적용 취소 가능해야함 */}
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
