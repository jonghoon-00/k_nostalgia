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
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const discountAmount =
    (price ?? 0) - ((price ?? 0) * (discountRate ?? 0)) / 100;

  return (
    <>
      <li
        className={`
        ${index === 2 ? 'row-start-2 row-end-3 col-start-2 col-end-4' : ''}
        ${index === 1 ? 'row-start-1 row-end-2 col-start-2 col-end-4' : ''}
        ${index === 0 ? 'row-start-1 row-end-3 col-start-1 col-end-2' : ''}
        ${index === 3 ? 'row-start-1 row-end-3 col-start-4 col-end-5' : ''} `}
      >
        <Link
          href={`/local-food/${item.product_id}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative"
        >
          {title_image ? (
            <Image
              src={title_image[0]}
              width={index === 1 || index === 2 ? 636 : 282}
              height={index === 1 || index === 2 ? 221 : 482}
              alt={`${food_name}이미지`}
              priority
              style={{
                width: '100%',
                height: index === 1 || index === 2 ? 221 : 482,
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1px solid #FFF3E3'
              }}
            />
          ) : (
            <DefaultImage text={'상품이미지가 없습니다'} />
          )}
          {isHovered && (
            <div
              className={`flex flex-col justify-center items-start absolute 
              ${
                index === 0 || index === 3
                  ? 'bottom-0 left-0 right-0 rounded-b-[12px] border-t-0'
                  : ''
              }
              ${
                index === 1 || index === 2
                  ? 'right-0 bottom-0 top-0 rounded-tr-[12px] rounded-br-[12px] border-l-0'
                  : ''
              }  bg-[rgba(0,0,0,.56)] border-b-primary-80 border text-label-light bg-opacity-80 px-12 py-[61px]`}
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
    </>
  );
};
