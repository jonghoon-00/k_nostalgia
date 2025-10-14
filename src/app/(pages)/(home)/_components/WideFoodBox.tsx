'use client';
import { DefaultImage } from '@/components/common/DefaultImage';
import { Tables } from '@/types/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface FoodProps {
  item: Tables<'local_food'>;
  index: number;
}

export const WideFoodBox = ({ item, index }: FoodProps) => {
  const { title_image, food_name, description, price, discountRate } = item;
  const [isHovered, setIsHovered] = useState(false);

  const discountAmount =
    (price ?? 0) - ((price ?? 0) * (discountRate ?? 0)) / 100;

  // 배치 규칙:
  // 4: 좌측 세로롱(2행) | 5: 우측 세로롱(2행)
  // 1: 중앙 상단-좌 | 2: 중앙 상단-우 | 3: 중앙 하단-좌 | 0: 중앙 하단-우
  const isTall = index === 5 || index === 4; // 세로롱
  const isWide = index === 1 || index === 2 || index === 3 || index === 0; // 가로형

  const positionClass =
    index === 4
      ? 'row-start-1 row-end-3 col-start-1 col-end-2' // 좌 세로롱
      : index === 1
      ? 'row-start-1 row-end-2 col-start-2 col-end-3' // 중앙 상-좌
      : index === 2
      ? 'row-start-1 row-end-2 col-start-3 col-end-4' // 중앙 상-우
      : index === 3
      ? 'row-start-2 row-end-3 col-start-2 col-end-3' // 중앙 하-좌
      : index === 0
      ? 'row-start-2 row-end-3 col-start-3 col-end-4' // 중앙 하-우
      : index === 5
      ? 'row-start-1 row-end-3 col-start-4 col-end-5'
      : ''; // 우 세로롱

  const imgHeight = isWide ? 152 : 344;
  const imgWidth = isWide ? 376 : 240;

  return (
    <li className={positionClass}>
      <Link
        href={`/local-food/${item.product_id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative block"
      >
        {title_image ? (
          <Image
            src={title_image[0]}
            width={imgWidth}
            height={imgHeight}
            alt={`${food_name}이미지`}
            priority
            style={{
              width: 'imgWidth',
              height: imgHeight,
              objectFit: 'cover',
              borderRadius: '12px',
              border: '1px solid #FFF3E3'
            }}
          />
        ) : (
          <DefaultImage text="상품이미지가 없습니다" />
        )}

        {isHovered && (
          <div
            className={[
              'absolute flex flex-col justify-center items-start',
              'bg-[rgba(0,0,0,.56)] bg-opacity-80',
              'border border-b-primary-80 text-label-light',
              'px-12 py-[61px]',
              // 세로롱은 하단 밴드, 가로형은 우측 밴드
              isTall
                ? 'bottom-0 left-0 right-0 rounded-b-[12px] border-t-0'
                : 'top-0 right-0 bottom-0 rounded-tr-[12px] rounded-br-[12px] border-l-0'
            ].join(' ')}
          >
            <h3 className="text-base font-medium text-secondary-90">
              {food_name}
            </h3>
            <p className="text-xs font-normal text-label-light mb-2">
              {description}
            </p>
            <p className="text-sm font-bold text-secondary-90">
              {discountAmount.toLocaleString()}원
              <span className="font-normal text-secondary-30 ml-2 line-through">
                {price?.toLocaleString()}원
              </span>
            </p>
          </div>
        )}
      </Link>
    </li>
  );
};
