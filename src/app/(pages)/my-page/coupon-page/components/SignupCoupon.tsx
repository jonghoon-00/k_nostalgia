'use client';

import useCouponStore from '@/zustand/coupon/useCouponStore';
import Image from 'next/image';

const SignupCoupon = () => {
  const { coupon } = useCouponStore();

  if (!coupon) return null;

  return (
    <Image
      src={coupon as string}
      alt="profile"
      width={640}
      height={161}
      priority
      className="w-auto h-[161px] md:w-[640px] md:h-[280px]"
    />
  );
};

export default SignupCoupon;
