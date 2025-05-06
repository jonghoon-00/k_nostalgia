'use client';

import SignupCoupon from '@/app/(pages)/my-page/coupon-page/components/CouponItem';
import RefreshIcon from '@/components/icons/RefreshIcon';
import RadioGroup from '@/components/ui/RadioGroup';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import { usePaymentRequestStore } from '@/zustand/payment/usePaymentStore';
import { useState } from 'react';

const CouponList = () => {
  //쿠폰 불러오기(csr)
  //적용 로직(couponStore set)
  //모바일 : 적용시 화면 전환
  //데스크탑 : 모달

  const { coupon, discountAmount, setDiscountAmount, applyMaxDiscount } =
    useCouponStore();
  const { setIsCouponApplied } = usePaymentRequestStore();

  const [isApplyDiscount, setIsApplyDiscount] = useState(false); //라디오 그룹에 사용용

  // useEffect(() => {
  //   if (isApplyDiscount && coupon) {
  //     setDiscountAmount(coupon);
  //   }
  //   if (!isApplyDiscount) {
  //     setDiscountAmount(null);
  //   }
  // }, [isApplyDiscount]);

  // useEffect(() => {
  //   if (discountAmount) {
  //     setIsApplyDiscount(true);
  //   }
  // }, []);

  return (
    <>
      <div className="text-xl font-medium px-4 mt-2 md:mt-6">
        <p>현재 적용된 할인 금액은</p>
        <p>
          <span className="text-primary-20">
            {discountAmount?.toLocaleString('ko-KR')}
          </span>
          원이에요
        </p>
        <div className="bg-white md:bg-normal p-4 mt-4 border-[#e0e0e0] md:border-none rounded-xl border-[1px] flex flex-col justify-center items-start">
          <SignupCoupon />

          <div className="flex gap-4 text-base mt-[18px]">
            <p className="text-label-alternative">즉시 할인</p>
            <RadioGroup
              name="applyDiscount"
              options={[
                {
                  value: true,
                  label: `-2,000원`
                },
                { value: false, label: '적용 안 함' }
              ]}
              selectedValue={isApplyDiscount}
              onChange={setIsApplyDiscount}
            />
          </div>
        </div>
      </div>

      {/* 적용 버튼 */}
      <div className="bg-normal z-[1000] fixed md:relative w-full mx-[-1rem] pt-4 px-4 bottom-6 md:bottom-0 shadow-custom md:shadow-none md:mt-4">
        {isApplyDiscount && (
          <button
            className="w-full bg-primary-20 text-white py-4 rounded-[8px] text-base"
            onClick={() => {
              setIsCouponApplied(true);
            }}
          >
            -{discountAmount}원 할인 적용
          </button>
        )}
        {!isApplyDiscount && (
          <div className="flex gap-3">
            <button
              className="w-2/3 border-gray-30 border-[1px] py-3 flex justify-center items-center gap-1 rounded-[8px] text-label-alternative"
              onClick={() => {
                applyMaxDiscount();
                setIsApplyDiscount(true);
              }}
            >
              <RefreshIcon />
              <p>최대 할인</p>
            </button>
            <button
              className="w-full bg-primary-20 text-white py-4 rounded-[8px]"
              onClick={() => {
                setIsCouponApplied(true);
              }}
            >
              {discountAmount !== 0 && '-'}
              {discountAmount}원 할인 적용
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CouponList;
