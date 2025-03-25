// 쿠폰 종류 추가시 리스트로 변경 필요
'use client';
import RadioGroup from '@/components/ui/RadioGroup';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import { useState } from 'react';
import SignupCoupon from './SignupCoupon';

const CouponList = () => {
  const mode = sessionStorage.getItem('mode');
  const { discountAmount } = useCouponStore();

  const [isApplyDiscount, setIsApplyDiscount] = useState(false);
  console.log(isApplyDiscount);

  return (
    <>
      {/* 쿠폰 리스팅(view) */}
      {mode !== 'apply' && <SignupCoupon />}

      {/* TODO 구현 이후 session storage 초기화 로직 추가 */}
      {/* 쿠폰 적용 */}
      {mode === 'apply' && (
        <div>
          <p>현재 적용된 할인 금액은</p>
          <p>{discountAmount}원이에요</p>
          <div className="bg-white p-4 mt-4 border-[#e0e0e0] rounded-xl border-[1px] flex flex-col justify-center items-start">
            <SignupCoupon />

            <div className="flex gap-4">
              <p className="text-label-alternative">즉시 할인</p>
              <RadioGroup
                name="applyDiscount"
                options={[
                  {
                    value: true,
                    label: `-${discountAmount}원`
                  },
                  { value: false, label: '적용 안 함' }
                ]}
                selectedValue={isApplyDiscount}
                onChange={setIsApplyDiscount}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponList;
