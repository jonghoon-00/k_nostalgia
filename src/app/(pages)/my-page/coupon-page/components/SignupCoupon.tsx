'use client';

import { Skeleton } from '@/components/ui/skeleton';
import useDeviceSize from '@/hooks/useDeviceSize';
import useCouponStore from '@/zustand/coupon/useCouponStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const SignupCoupon = () => {
  const [isLoading, setIsLoading] = useState(true);

  const { coupon } = useCouponStore();
  const { isMobile } = useDeviceSize();

  useEffect(() => {
    if (!coupon) {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!coupon && !isLoading) return null;
  return (
    <>
      {isLoading ? (
        <Skeleton className="w-[311px] h-[161px] md:w-[640px] md:h-[280px] bg-label-disable rounded-xl" />
      ) : (
        <Image
          src={coupon ? coupon : ''}
          alt="profile"
          width={isMobile ? 311 : 640}
          height={161}
          priority
          className="w-auto h-[161px] md:w-[640px] md:h-[280px]"
        />
      )}
    </>
  );
};

export default SignupCoupon;
