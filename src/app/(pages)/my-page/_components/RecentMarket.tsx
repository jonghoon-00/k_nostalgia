'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { LikeButton } from '../../(home)/_components/LikeButton';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { MarketType } from '@/types/Market';

const RecentMarket = () => {
  const [recentMarketData, setRecentMarketsData] = useState<MarketType[]>([]);
  const { data: userData } = useUser();

  useEffect(() => {
    const fetchAllRecentMarkets = async () => {
      const recentMarkets = localStorage.getItem('recentMarkets');
      const data = recentMarkets ? JSON.parse(recentMarkets) : [];
      const marketData = data.map((id: string) => fetchMarketData(id));

      try {
        const marketDataResult = await Promise.all(marketData);
        const validMarketData = marketDataResult.filter(
          (data) => data !== null
        );
        setRecentMarketsData(validMarketData);
      } catch (error) {
        console.error((error as Error).message);
      }
    };
    fetchAllRecentMarkets();
  }, []);

  const fetchMarketData = async (id: string) => {
    const response = await fetch(`/api/market/marketDetail?id=${id}`);
    if (!response.ok) {
      throw new Error('데이터를 가져오는 데 실패했습니다.');
    }

    const data = await response.json();
    return data.data;
  };

  return (
    <div>
      <h2 className="text-center text-secondary-10 mb-8">최근 본 전통 시장</h2>
      {recentMarketData && recentMarketData.length > 0 ? (
        recentMarketData.map((market, index) => (
          <div
            key={market.id || index}
            className="border border-secondary-50 bg-white rounded-xl mt-1 p-3 flex flex-col w-full h-[204px]"
            style={{
              boxShadow:
                '0px 1px 2px 0px rgba(0, 0, 0, 0.24), 0px 0px 1px 0px rgba(0, 0, 0, 0.08), 0px 0px 1px 0px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="flex justify-between">
              <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-[16px] text-label-strong">
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
                <p className="text-label-alternative text-[14px]">
                  {market.도로명주소 || '주소 없음'}
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-1 gap-2">
              {market.이미지 && market.이미지.length >= 2 ? (
                <>
                  <div className="flex-1 relative">
                    <Image
                      src={market.이미지[0]}
                      alt={`${market.시장명 || '시장'} 이미지`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Image
                      src={market.이미지[1]}
                      alt={`${market.시장명 || '시장'} 이미지`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-xl"
                    />
                  </div>
                </>
              ) : (
                <p className="text-label-alternative">이미지가 없습니다.</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-label-strong">
          최근 본 전통시장이 없습니다.
        </p>
      )}
    </div>
  );
};

export default RecentMarket;
