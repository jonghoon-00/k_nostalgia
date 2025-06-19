'use client';

import useDeviceSize from '@/hooks/useDeviceSize';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface Props {
  imageUrl: string;
  alt?: string;
}

/**
 *
 * @param imageUrl - 쿠폰 이미지 URL(필수)
 * @param alt - 이미지 대체 텍스트(선택)
 * @returns 쿠폰 이미지지
 */
const CouponItem: React.FC<Props> = ({ imageUrl, alt }) => {
  const { isMobile } = useDeviceSize();
  return (
    <Image
      src={imageUrl}
      alt={alt ?? '쿠폰 이미지'}
      width={isMobile ? 311 : 640}
      height={161}
      priority
      className={clsx('w-full h-full md:w-[640px]')}
    />
  );
};

export default CouponItem;
