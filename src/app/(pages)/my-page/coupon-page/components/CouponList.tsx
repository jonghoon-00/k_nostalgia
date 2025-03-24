// 쿠폰 종류 추가시 리스트로 변경 필요

import SignupCoupon from './SignupCoupon';

interface CouponListProps {
  mode: 'view' | 'apply';
}

const CouponList = ({ mode }: CouponListProps) => {
  return (
    <>
      {mode === 'view' && <SignupCoupon />}

      {mode === 'apply' && <div>쿠폰 적용</div>}
    </>
  );
};

export default CouponList;
