// 쿠폰 종류 추가시 리스트로 변경 필요
'use client';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import SignupCoupon from './SignupCoupon';

interface CouponListProps {
  // mode: 'view' | 'apply';
}

const CouponList = () => {
  const mode = sessionStorage.getItem('mode');
  const { discountAmount } = useCouponStore();
  return (
    <>
      {mode !== 'apply' && <SignupCoupon />}

      {/* TODO 구현 이후 session storage 초기화 로직 추가 */}
      {mode === 'apply' && (
        <div>
          <p>현재 적용된 할인 금액은</p>
          <p>{discountAmount}원이에요</p>
          <div className="bg-white p-4 mt-4 border-[#e0e0e0] rounded-xl border-[1px] flex justify-center items-center">
            <SignupCoupon />

            <div className="flex gap-4">
              <p>즉시 할인</p>
              <div>{/* 라디오 버튼 */}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponList;
