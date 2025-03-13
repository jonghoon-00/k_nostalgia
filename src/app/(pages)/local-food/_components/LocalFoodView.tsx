'use client';

import { DefaultImage } from '@/components/common/DefaultImage';
import Loading from '@/components/common/Loading';
import FilterButton from '@/components/ui/FilterButton';
import useDeviceSize from '@/hooks/useDeviceSize';
import { Tables } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useDebugValue, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { SkeletonCard } from '../../(home)/_components/LoadingSkeleton';
import { DiscountAmount } from '../[id]/_components/DiscountAmount';

type LocalFood = Tables<'local_food'>;

const LocalFoodView = () => {
  const categoryList = ['전체', '과일', '야채', '고기', '곡물', '공예품'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const { isDesktop } = useDeviceSize();

  const fetchLocalFoodData = async (category: string) => {
    try {
      const response = await fetch(`/api/localfood?category=${category}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('데이터를 가져오지 못했습니다.', error);
    }
  };

  const {
    data: localFoodData,
    error,
    isPending
  } = useQuery<LocalFood[]>({
    queryKey: ['localfood', selectedCategory],
    queryFn: () => fetchLocalFoodData(selectedCategory)
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (error) return <div>오류 {error.message}</div>;

  const filteredFoodData = localFoodData?.filter((food) =>
    selectedCategory === '전체' ? true : food.category === selectedCategory
  );

  return (
    <div className="mt-[11%] max-w-screen-xl mx-auto md:mt-0 ">
      {/* PC */}
      {isDesktop && (
        <div className="mt-20 mb-10">
          <Image
            src={
              'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/local-food/webLocal.png'
            }
            width={1280}
            height={280}
            priority
            alt="배너이미지"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      <div className="flex gap-2 items-center py-3 px-4 fixed md:static md:py-0 md:p-0 top-[52px] bg-normal overflow-x-auto w-full whitespace-nowrap filter-button-container ">
        {categoryList.map((category) => (
          <FilterButton
            key={category}
            onClick={() => handleCategoryChange(category)}
            isActive={selectedCategory === category}
          >
            {category}
          </FilterButton>
        ))}
      </div>
      <div className="m-4 mt-[6.8rem] md:hidden">
        <Image
          src={
            'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/local-food/banner.png'
          }
          width={343}
          height={80}
          priority
          alt="배너이미지"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            margin: '0 auto'
          }}
        />
      </div>

      {isPending ? (
        <div className="mt-4">
          {isDesktop ? (
            <SkeletonCard columns={4} count={8} />
          ) : (
            <SkeletonCard columns={2} count={4} />
          )}
        </div>
      ) : (
        <div className="mx-4 mt-9 md:mx-0">
          {filteredFoodData?.length === 0 ? (
            <div className="md:h-[60vh] flex justify-center items-center">
              {isDesktop ? (
                <div className="flex flex-col text-center">
                  <Image
                    src={'/image/readytoTiger.png'}
                    width={208}
                    height={226}
                    alt="준비중입니다."
                  />
                  <p className="text-label-assistive text-lg font-medium">
                    특산물을 준비하고 있어요
                  </p>
                </div>
              ) : (
                <div className="flex flex-col text-center  absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]">
                  <Image
                    src={'/image/readytoTiger.png'}
                    width={208}
                    height={226}
                    alt="준비중입니다."
                  />
                  <p className="text-label-assistive text-lg font-medium">
                    특산물을 준비하고 있어요
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`${
                isDesktop
                  ? 'h-auto overflow-hidden'
                  : 'max-h-[400px] overflow-y-scroll'
              }`}
            >
              <ul
                className={`grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 pb-32`}
              >
                {filteredFoodData?.map((food) => (
                  <li
                    key={food.product_id}
                    className="rounded-[12px] flex flex-col md:rounded-[4px] mx-auto w-full border border-secondary-50"
                  >
                    <Link href={`/local-food/${food.product_id}`}>
                      <div className="flex justify-center items-center w-auto h-[120px] sm:h-[205px] overflow-hidden rounded-tl-[12px] rounded-tr-[12px] md:rounded-tl-[4px] md:rounded-tr-[4px]">
                        {food.title_image && (
                          <Image
                            src={food.title_image[0]}
                            width={164}
                            height={120}
                            alt="특산물 이미지"
                            priority
                            style={{
                              borderRadius: '4px',
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%'
                            }}
                            className="object-cover w-full h-auto"
                          />
                        )}
                      </div>
                      <div className="bg-normal py-2 px-3 text-[#403D3A] rounded-bl-[12px] rounded-br-[12px]">
                        <h2 className="text-base font-semibold">
                          {food.food_name}
                        </h2>
                        <p className="text-xs text-label-assistive mb-2">
                          {food.description}
                        </p>
                        <DiscountAmount food={food} totalSize="base" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocalFoodView;
