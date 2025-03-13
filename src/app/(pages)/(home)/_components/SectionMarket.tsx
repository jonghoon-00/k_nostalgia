'use client';

import { HashLoader } from 'react-spinners';
import { SlideBanner } from './SlideBanner';
import { useQuery } from '@tanstack/react-query';
import { DefaultImage } from '@/components/common/DefaultImage';
import { SkeletonCard } from './LoadingSkeleton';

export type MainMarket = {
  id: number;
  시장명: string;
  도로명주소: string;
  이미지: string | null;
}[];

export const SectionMarket = () => {
  const {
    data: mainMarket,
    isPending,
    error: mainMarketError
  } = useQuery({
    queryKey: ['market'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/market/list');
        const { data } = await response.json();
        return data;
      } catch (error) {
        console.error('메인에 시장 데이터를 가져오지 못했습니다', error);
      }
      if (mainMarketError) {
        console.error('서버 오류', mainMarketError.message);
        return null;
      }
    }
  });

  const fetchMarketImages = async () => {
    const results: MainMarket = [];

    for (const market of mainMarket) {
      try {
        const response = await fetch(
          `/api/market/marketImage?query=${encodeURIComponent(
            market.시장명
          )}&display=1`
        );
        const data = await response.json();
        results.push({
          id: market.id,
          시장명: market.시장명,
          도로명주소: market.도로명주소,
          이미지: data
        });
      } catch (error: any) {
        results.push({
          id: market.id,
          시장명: market.시장명,
          도로명주소: market.도로명주소,
          이미지: null
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    return results;
  };

  const { data: marketImages } = useQuery<MainMarket | null | undefined>({
    queryKey: ['marketImg'],
    queryFn: fetchMarketImages
  });

  return (
    <div className="bg-[#FFF8EF] pb-40 md:pb-20">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl text-primary-heavy mt-20 mb-10 mx-10 font-custom">
          유명 전통시장
        </h2>

        {isPending ? (
          <SkeletonCard columns={1} count={1} />
        ) : marketImages && marketImages.length > 0 ? (
          <SlideBanner images={marketImages} />
        ) : (
          <SkeletonCard columns={1} count={1} />
        )}
      </div>
    </div>
  );
};
