'use client';

import Link from 'next/link';
import { FoodBox } from './FoodBox';
import { useQuery } from '@tanstack/react-query';
import { Tables } from '@/types/supabase';
import { HashLoader } from 'react-spinners';
import { WideFoodBox } from './WideFoodBox';
import useDeviceSize from '@/hooks/useDeviceSize';
import { SkeletonCard } from './LoadingSkeleton';

export const SectionFood = () => {
  const { isDesktop } = useDeviceSize();
  const { data: localFood, isPending } = useQuery({
    queryKey: ['localfood'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/localfood');
        const data: Tables<'local_food'>[] = await response.json();
        return data;
      } catch (error) {
        console.error('메인에 특산물 데이터를 가져오지 못했습니다.', error);
      }
    }
  });

  return (
    <div className="bg-secondary-30">
      <div className="flex flex-col justify-center items-center pb-20">
        <h2 className="text-2xl text-label-light mt-20 lg:mb-16 font-custom">
          지역 특산물
        </h2>
        {isPending ? (
          isDesktop ? (
            <SkeletonCard columns={4} count={4} />
          ) : (
            <div className="mt-10">
              <SkeletonCard columns={2} count={4} />
            </div>
          )
        ) : isDesktop ? (
          <ul className="max-w-screen-xl grid grid-cols-4 relative gap-10">
            {localFood?.slice(0, 4).map((item, index) => {
              return (
                <WideFoodBox
                  key={item.product_id}
                  item={item}
                  index={index}
                ></WideFoodBox>
              );
            })}
          </ul>
        ) : (
          <ul className="grid grid-cols-2 gap-x-[23px] gap-y-8  relative">
            {localFood?.slice(0, 4).map((item, index) => {
              return (
                <FoodBox
                  key={item.product_id}
                  item={item}
                  index={index}
                ></FoodBox>
              );
            })}
          </ul>
        )}

        <Link
          href="/local-food"
          className="border-label-disable md:mt-16 text-label-light border rounded-[12px] w-[373px] mt-10 block transition-all duration-300 ease-in-out hover:border-primary-50 hover:text-primary-50"
        >
          <button className="w-full px-4 py-3 ">더보기</button>
        </Link>
      </div>
    </div>
  );
};
