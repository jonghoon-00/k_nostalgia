'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface MarketImageProps {
  src: string;
  alt: string;
  sizes?: string;
  width?: number;
  height?: number;
  className: string;
}

const MarketImage = ({
  src,
  alt,
  sizes,
  className,
  width,
  height
}: MarketImageProps) => {
  const [imagePath, setImagePath] = useState(
    'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/markets/market-image.svg'
  );

  useEffect(() => {
    setImagePath(src);
  }, [src]);

  return (
    <Image
      src={imagePath}
      alt={alt}
      fill={width && height ? false : true}
      width={width}
      height={height}
      sizes={sizes}
      priority
      onError={() =>
        setImagePath(
          'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/markets/market-image.svg'
        )
      }
      className={className}
      style={{
        objectFit: 'cover'
      }}
    />
  );
};

export default MarketImage;
