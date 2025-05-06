'use client';

import useDeviceSize from '@/hooks/useDeviceSize';
import Image from 'next/image';
import React from 'react';

interface Props {
  imageUrl: string;
}

const CouponItem: React.FC<Props> = ({ imageUrl }) => {
  const { isMobile } = useDeviceSize();
  return (
    <>
      <Image
        src={imageUrl}
        alt="profile"
        width={isMobile ? 311 : 640}
        height={161}
        priority
        className="w-auto h-[161px] md:w-[640px] md:h-[280px]"
      />
    </>
  );
};

export default CouponItem;
