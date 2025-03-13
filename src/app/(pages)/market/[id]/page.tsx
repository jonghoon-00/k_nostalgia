// 시장명, 시장유형, 도로명주소, 휴게실여부, 주차장여부 상세페이지에서 사용할 시장 정보
'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MarketType } from '@/types/Market';
import { PiMapPin } from 'react-icons/pi';
import { LuDot } from 'react-icons/lu';
import Loading from '@/components/common/Loading';
import KaKaomap from '../_components/KaKaoMap';
import MarketComments from './_components/MarketComments';
import { useUser } from '@/hooks/useUser';

import ScrollButton from './_components/ScrollButton';
import MarketLikes from '../_components/MarketLikes';
import MarketImage from '../_components/MarketImage';
import MarketRecommend from './_components/MarketRecommend';
export type ImagesType = {
  title: string;
  link: string;
  thumbnail: string;
  sizeheight: string;
  sizewidth: string;
}[];

const MarketDetailPage = ({ params }: { params: { id: number } }) => {
  const { data: user, isLoading, error } = useUser();
  const [market, setMarket] = useState<MarketType>();
  const [loading, setLoading] = useState(false);
  const { id } = params;

  useEffect(() => {
    const fetchMarketDetail = async (id: number) => {
      try {
        const response = await fetch(`/api/market/marketDetail?id=${id}`);
        const { data } = await response.json();
        setMarket(data);
      } catch (error) {
        console.error('데이터를 가져오지 못했습니다.', error);
      }
    };
    fetchMarketDetail(id);
  }, [id]);

  useEffect(() => {
    if (id) {
      const storedMarkets = localStorage.getItem('recentMarkets');
      const recentMarkets = storedMarkets ? JSON.parse(storedMarkets) : [];

      const updatedMarkets = [
        id,
        ...recentMarkets.filter((item: number) => item !== id)
      ].slice(0, 3);

      localStorage.setItem('recentMarkets', JSON.stringify(updatedMarkets));
    }
  }, [id]);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
    };
    fetchImage();
  }, [market]);

  if (!market) return <Loading />;

  const images = market.이미지 ?? [];
  if (!images.length) {
    return <Loading />;
  }

  return (
    <section>
      <div className="w-full p-4 bg-normal flex flex-col items-center md:p-0">
        {images.length > 0 && (
          <div className="flex relative w-[343px] h-[230px] md:w-[1280px] md:h-[640px] md:mt-24 md:mb-10 mt-[72px] ">
            <Image
              src={images[0]}
              alt={market?.시장명 ?? 'market name'}
              fill
              sizes="(max-width: 768px) 100vw, 140px"
              priority
              className="absolute w-full h-full rounded-[8px]"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-xl font-semibold text-label-strong md:text-2xl md:font-semibold">
          {market?.시장명}
        </p>
        <p className="mb-4 text-sm font-normal text-label-alternative md:text-base md:mb-8">
          {market.도로명주소.split(' ').slice(0, 2).join(' ')}
        </p>
        <div className="w-full h-1 border-4 border-[#F2F2F2] md:max-w-[1280px]" />
      </div>
      <div>
        <ScrollButton />
      </div>

      <div className="mt-[1px] w-full p-4 bg-primary-20 flex flex-col items-center">
        <div
          id="photos-section"
          className="mt-4 mb-8 text-center text-xl font-semibold text-primary-90 relative md:text-2xl md:mt-20 md:mb-10"
        >
          시장 전체 이미지
          <span
            className="absolute left-[50%] translate-x-[-50%] bottom-0 w-[8rem] h-[10px] "
            style={{ backgroundColor: 'rgba(214, 164, 97, 0.40)' }}
          ></span>
        </div>

        {images.slice(0).map((image, index) => {
          if (index === 0) return null; // 0번째 인덱스는 스킵

          return (
            <div key={index}>
              <div
                className={
                  'relative w-[343px] h-[280px] border border-primary-90 rounded-xl mb-4 md:w-[1280px] md:h-[640px]'
                }
              >
                <MarketImage
                  src={image}
                  alt={market?.시장명 ?? 'market name'}
                  sizes="(max-width: 768px) 100vw, 343px"
                  className="absolute w-full h-full rounded-xl"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        id="details-section"
        className="w-full bg-primary-70 flex flex-col justify-center items-center"
      >
        <div className="mt-8 mb-8 text-center text-xl font-semibold text-primary-10 relative md:text-2xl md:mt-20 md:mb-10">
          상세정보
          <span
            className="absolute left-[50%] translate-x-[-50%] bottom-0 w-[4.5rem] h-[10px] "
            style={{ backgroundColor: 'rgba(214, 164, 97, 0.40)' }}
          ></span>
        </div>
        <div>
          <KaKaomap />
        </div>
        <div className="flex mt-2 mb-8 place-items-center text-primary-10 md:gap-1 md:mb-10">
          <PiMapPin className="w-4 h-4 md:w-5 md:h-5" />
          <p className="text-sm font-normal md:text-base ">
            {market.도로명주소}
          </p>
        </div>
        <div className="w-full h-1 border-4 border-[#D6A461] border-opacity-40 md:max-w-[1280px] " />
        <div className="mx-[60px] mt-8 mb-10 px-9 py-6 border border-secondary-20 rounded-xl bg-primary-90 md:mt-8 md:px-10 md:py-6 md:mb-20 md:w-[540px] md:h-[320px] md:flex md:flex-col md:justify-center md:items-center md:gap-2">
          <p
            className="text-base font-medium text-primary-10 text-center
    mb-3 md:mb-8 md:text-xl "
          >
            편의시설 보유 여부
          </p>
          <div className="flex justify-between md:w-[185px] text-nowrap">
            <div className="flex items-center">
              <LuDot className="text-primary-20" />
              <span className="text-sm mr-6 text-label-strong md:text-base md:mr-5">
                고객 전용 주차장
              </span>
            </div>
            <div className="text-sm text-left text-label-alternative md:text-base">
              {market.시장전용고객주차장_보유여부 === 'Y' ? '보유　' : '미보유'}
            </div>
          </div>
          <div className="flex justify-between md:w-[185px] text-nowrap">
            <div className="flex items-center">
              <LuDot className="text-primary-20" />
              <span className="text-sm mr-6 text-label-strong md:text-base">
                고객 휴게실
              </span>
            </div>
            <div className="text-sm text-left text-label-alternative md:text-base">
              {market.고객휴게실_보유여부 === 'Y' ? '보유　' : '미보유'}
            </div>
          </div>
          <div className="flex justify-between md:w-[185px]">
            <div className="flex items-center">
              <LuDot className="text-primary-20" />
              <span className="text-sm mr-6 text-label-strong md:text-base">
                물품 보관함
              </span>
            </div>
            <div className="text-sm text-left text-label-alternative md:text-base">
              {market.물품보관함_보유여부 === 'Y' ? '보유　' : '미보유'}
            </div>
          </div>
        </div>
      </div>
      <div id="recommend-section">
        <MarketRecommend region={market.소권역} />
      </div>
      <div className="w-full h-1 border-4 border-[#F2F2F2] md:max-w-[1280px] md:mx-auto" />
      <div id="comments-section">
        <MarketComments userId={user?.id} marketId={id} />
      </div>
      <div
        style={{ zIndex: 40 }} /* 맨 앞으로 나오게 */
        className="md:hidden w-full flex items-center justify-start fixed bottom-0 px-4 pt-3 pb-6 gap-3 box bg-normal shadow-custom"
        /* fixed bottom-0 바닥에서 0만큼 떨어진 곳에다가 고정 */
      >
        <MarketLikes pixel={8} userId={user?.id} marketId={id} />
        <div className="px-2 py-3 text-base font-normal text-label-alternative">
          하단에서 댓글을 작성해 주세요
        </div>
      </div>
    </section>
  );
};

export default MarketDetailPage;
