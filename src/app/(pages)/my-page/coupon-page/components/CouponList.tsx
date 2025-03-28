// 쿠폰 종류 추가시 리스트로 변경 필요
'use client';
import ApplyCoupon from './ApplyCoupon';
import SignupCoupon from './SignupCoupon';

const CouponList = () => {
  const mode = sessionStorage.getItem('mode');

  return (
    <>
      {/* 쿠폰 리스팅(view) */}
      <div className="px-4">{mode !== 'apply' && <SignupCoupon />}</div>
      {/* 쿠폰 적용 */}
      {mode === 'apply' && <ApplyCoupon />}
    </>
  );
};

export default CouponList;
