'use client';
import React from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { BsChevronRight } from 'react-icons/bs';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import { LuDot } from 'react-icons/lu';
import { LikeButton } from '../../(home)/_components/LikeButton';
import MarketImage from '../../market/_components/MarketImage';

const LikeMarket = () => {
  const router = useRouter();

  const handleLikeMarketClick = () => {
    router.push('/my-page/likemarket-page');
  };
  const { data: userData } = useUser();

  const getLikedMarkets = async () => {
    if (!userData || !userData.id) {
      throw new Error('사용자 ID를 찾을 수 없습니다.');
    }

    const response = await fetch(`/api/market/liked-markets/${userData.id}`);
    if (!response.ok) {
      throw new Error('데이터를 가져오는 데 실패했습니다.');
    }

    const data = await response.json();
    return data;
  };

  const {
    data: likedMarkets,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['likes', userData?.id],
    queryFn: getLikedMarkets,
    enabled: !!userData?.id
  });

  if (isLoading)
    return (
      <div className="flex justify-center flex-col items-center text-label-assistive text-sm mt-2">
        데이터를 불러오고 있어요!{' '}
      </div>
    );
  if (isError) return <div> 에러가 발생했습니다.</div>;

  const markets = Array.isArray(likedMarkets)
    ? likedMarkets
    : [likedMarkets].filter(Boolean);

  return (
    <div className="p-4">
      <div
        className="flex items-center mb-4 md:hidden cursor-pointer"
        onClick={handleLikeMarketClick}
      >
        <GoHeart className="mr-[8px] text-label-normal text-[20px]" />
        <span className="text-[16px]">관심 전통시장</span>
        <BsChevronRight className="ml-auto text-[#545454] cursor-pointer" />
      </div>

      {markets.length > 0 ? (
        <>
          {/* 앱버전일때 Swiper */}
          <div className="md:hidden">
            <Swiper spaceBetween={10} slidesPerView={1.1} className="w-[328px]">
              {markets.map((market, index) => (
                <SwiperSlide key={market.id || index}>
                  <div className="border border-secondary-50 rounded-xl mt-1 p-3 flex flex-col w-full h-[204px]">
                    <div className="flex justify-between">
                      <div className="flex flex-col justify-between w-full">
                        <div className="flex justify-between items-center">
                          <h3 className="text-[16px] text-label-strong font-semibold">
                            {market.시장명 || '이름 없음'}
                          </h3>
                          {userData && (
                            <LikeButton
                              marketId={market.id}
                              userId={userData?.id}
                              className="w-[20px] h-[20px] ml-auto"
                              isBlack
                            />
                          )}
                        </div>
                        <p className="text-label-normal text-[14px]">
                          {market.도로명주소 || '주소 없음'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 mb-3 flex gap-2 relative flex-1">
                      {market.이미지 ? (
                        <>
                          <div className="flex-1">
                            <MarketImage
                              src={market.이미지[1]}
                              alt={`${market.시장명 || '시장'} 이미지`}
                              width={148}
                              height={130}
                              className="w-full !h-[130px] object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <MarketImage
                              src={market.이미지[2]}
                              alt={`${market.시장명 || '시장'} 이미지`}
                              width={148}
                              height={130}
                              className="w-full !h-[130px] object-cover"
                            />
                          </div>
                        </>
                      ) : (
                        '이미지가 없습니다.'
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 웹 버전일때 */}
          <div className="hidden md:block">
            {markets.map((market, index) => (
              <div
                key={market.id || index}
                className={`py-6 items-center flex gap-[48px] ${
                  index === markets.length - 1
                    ? 'border-none'
                    : 'border-b border-primary-60'
                }`}
              >
                <div className="flex flex-row gap-4 h-[175px] w-full justify-between items-center">
                  <div className="w-[280px] mr-4">
                    <h3 className="text-[20px] text-label-strong">
                      {market.시장명 || '이름 없음'}
                    </h3>
                    <p className="text-label-normal text-[16px]">
                      {market.도로명주소 || '주소 없음'}
                    </p>

                    <div className="flex flex-col mt-11 w-[172px]">
                      <div className="flex items-center">
                        <LuDot className="text-primary-20" />
                        <div className="flex justify-between w-full">
                          <div className="text-sm text-label-normal">
                            고객 전용 주차장
                          </div>
                          <div className="text-sm text-label-strong">
                            {market.시장전용고객주차장_보유여부 === 'Y'
                              ? '보유'
                              : '미보유'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <LuDot className="text-primary-20" />
                        <div className="flex justify-between w-full">
                          <div className="text-sm text-label-normal">
                            고객 휴게실
                          </div>
                          <div className="text-sm text-label-strong">
                            {market.고객휴게실_보유여부 === 'Y'
                              ? '보유'
                              : '미보유'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <LuDot className="text-primary-20" />
                        <div className="flex justify-between w-full">
                          <div className="text-sm text-label-normal">
                            물품 보관함
                          </div>
                          <div className="text-sm text-label-strong">
                            {market.물품보관함_보유여부 === 'Y'
                              ? '보유'
                              : '미보유'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" relative flex flex-1 items-center max-w-max gap-2">
                    {market.이미지 ? (
                      <>
                        <div className="relative">
                          <MarketImage
                            src={market.이미지[1]}
                            alt={`${market.시장명 || '시장'} 이미지`}
                            width={200}
                            height={180}
                            className="w-[139px] h-[180px] rounded-l-2 object-cover"
                          />
                        </div>

                        <div className="relative">
                          <MarketImage
                            src={market.이미지[2]}
                            alt={`${market.시장명 || '시장'} 이미지`}
                            width={200}
                            height={180}
                            className="w-[139px] h-[180px] rounded-l-2 object-cover"
                          />
                        </div>

                        <div className="relative">
                          <MarketImage
                            src={market.이미지[3]}
                            alt={`${market.시장명 || '시장'} 이미지`}
                            width={200}
                            height={180}
                            className={`w-[139px] h-[180px] rounded-l-2 object-cover  `}
                          />
                          <div className="absolute top-0 right-0 m-2  bg-[rgba(0,0,0,0.40)] bg-opacity-50 rounded-full w-[32px] h-[32px] flex items-center justify-center">
                            {userData && (
                              <LikeButton
                                marketId={market.id}
                                userId={userData?.id}
                                className="w-[20px] h-[20px] ml-auto"
                                isBlack={false}
                              />
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      '아직 이미지가 없어요'
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-label-assistive flex flex-col items-center justify-center">
          <Image
            src="/image/StateSad.png"
            alt="관심전통시장 없을때"
            width={114}
            height={97}
            className="w-[114px] h-[97px] mb-4"
          />
          관심 전통시장이 없습니다.{' '}
        </div>
      )}
    </div>
  );
};

export default LikeMarket;
