'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import MarketLikes from '../../_components/MarketLikes';
import Link from 'next/link';
import { MarketType } from '@/types/Market';
import { useUser } from '@/hooks/useUser';
import MarketImage from '../../_components/MarketImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import useDeviceSize from '@/hooks/useDeviceSize';

interface MarketRecommendPropsType {
  region: string;
}

const MarketRecommend = ({ region }: MarketRecommendPropsType) => {
  const { data: user, isLoading, error } = useUser();
  const [markets, setMarkets] = useState<MarketType[]>([]);
  const [loading, setLoading] = useState();
  const { isMobile } = useDeviceSize();

  const getRecommend = async () => {
    try {
      const response = await fetch(`/api/market/recommend?region=${region}`);
      const data = await response.json();
      setMarkets(data);
    } catch (error) {
      console.error('추천 시장 불러오는 중 오류발생', error);
    }
  };

  useEffect(() => {
    getRecommend();
  }, [region]);

  if (loading) return <p>로딩중...</p>;

  return (
    <div className="pb-8 md:mt-20 md:mb-10">
      <div className="px-4 py-8 text-center">
        <p className="text-xl font-semibold text-secondary-10 relative md:text-2xl">
          주변 추천 전통시장
          <span
            className="absolute left-[50%] translate-x-[-50%] bottom-0 w-[9rem] h-[10px] "
            style={{ backgroundColor: 'rgba(183, 203, 174, 0.40)' }}
          ></span>
        </p>
      </div>
      {isMobile ? (
        <div className="ml-4 overflow-x-hidden scrollbar-hide">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.1}
            className="w-full max-w-[768px]"
          >
            {markets.map((market, index) => (
              <SwiperSlide key={market.id || index}>
                <div
                  className="py-3 px-3 rounded-xl border border-solid border-secondary-50
              bg-white"
                >
                  <Link href={`/market/${market.id}`}>
                    <div className="flex flex-col mb-2">
                      <div className="flex justify-between">
                        <div className="pl-1">
                          <p className="text-base font-semibold text-label-strong">
                            {market.시장명}
                          </p>
                          <p className="max-w-[250px] text-sm text-label-normal font-normal text-ellipsis overflow-hidden whitespace-nowrap">
                            {market.도로명주소}
                          </p>
                        </div>
                        <div
                          className="flex justify-end w-9 h-9 rounded-full bg-white md:bg-black md:bg-opacity-40 md:justify-center md:items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <MarketLikes
                            pixel={5}
                            userId={user?.id}
                            marketId={market.id}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {market.이미지 ? (
                    <div className="relative flex gap-2">
                      {market.이미지.slice(0, 2).map((imgSrc, index) => (
                        <div
                          key={index}
                          className={`rounded-[8px] relative w-full h-[130px] ${
                            index === 0
                              ? 'rounded-l-[8px] rounded-r-none'
                              : 'rounded-r-[8px] rounded-l-none'
                          }`}
                        >
                          <MarketImage
                            src={imgSrc}
                            alt={`${market.시장명} - 이미지 ${index + 1}`}
                            sizes="(max-width: 768px) 100vw, 343px"
                            className={`absolute w-full h-full ${
                              index === 0
                                ? 'rounded-l-[8px] rounded-r-none'
                                : 'rounded-r-[8px] rounded-l-none'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'red' }}>Error: {market.error}</p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="flex flex-col pl-4 space-x-4 overflow-x-scroll scrollbar-hide ">
          <Swiper
            spaceBetween={25}
            slidesPerView={3.1}
            className="w-full max-w-[1280px] ml-auto"
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2.5, spaceBetween: 22 },
              1024: { slidesPerView: 3.1, spaceBetween: 25 }
            }}
          >
            {markets.map((market, index) => (
              <SwiperSlide key={market.id || index}>
                <div
                  className="min-w-[328px] max-w-[410px] max-h-[265px] py-3 px-3 rounded-xl border border-solid border-secondary-50
    bg-white"
                >
                  <Link href={`/market/${market.id}`}>
                    <div className="flex flex-col mb-2">
                      <div className="flex justify-between">
                        <div className="pl-1">
                          <p className="text-base font-semibold text-label-strong">
                            {market.시장명}
                          </p>
                          <p className="max-w-[250px] text-sm text-label-normal font-normal text-ellipsis overflow-hidden whitespace-nowrap">
                            {market.도로명주소}
                          </p>
                        </div>
                        <div
                          className="flex justify-end w-9 h-9 rounded-full bg-white md:bg-black md:bg-opacity-40 md:justify-center md:items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <MarketLikes
                            pixel={5}
                            userId={user?.id}
                            marketId={market.id}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {market.이미지 ? (
                    <div className="relative flex gap-2">
                      {market.이미지.slice(0, 2).map((imgSrc, index) => (
                        <div
                          key={index}
                          className={`rounded-[8px] relative w-[185px] h-[175px]  ${
                            index === 0
                              ? 'rounded-l-[8px] rounded-r-none'
                              : 'rounded-r-[8px] rounded-l-none'
                          }`}
                        >
                          <MarketImage
                            src={imgSrc}
                            alt={`${market.시장명} - 이미지 ${index + 1}`}
                            sizes="(max-width: 768px) 100vw, 343px"
                            className={`absolute w-full h-full ${
                              index === 0
                                ? 'rounded-l-[8px] rounded-r-none'
                                : 'rounded-r-[8px] rounded-l-none'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'red' }}>Error: {market.error}</p>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default MarketRecommend;
