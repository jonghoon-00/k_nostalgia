'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface TopRecommend {
  id: string;
  productId: string;
  productName: string;
}

const top8Market: TopRecommend[] = [
  {
    id: '1',
    productId: 'market/1260',
    productName: '재송한마음시장'
  },
  {
    id: '2',
    productId: 'market/2',
    productName: '가평잣고을시장'
  },
  {
    id: '3',
    productId: 'market/457',
    productName: '예산시장'
  },
  {
    id: '4',
    productId: 'market/1045',
    productName: '반송시장'
  },
  {
    id: '5',
    productId: 'market/1311',
    productName: '주문진종합시장'
  },
  {
    id: '6',
    productId: 'market/116',
    productName: '여주한글시장'
  },
  {
    id: '7',
    productId: 'market/165',
    productName: '수유중앙시장'
  },
  {
    id: '8',
    productId: 'market/175',
    productName: '화곡중앙시장'
  }
];

const top5LocalFood: TopRecommend[] = [
  {
    id: '1',
    productId: 'local-food/35f3bfc7-77d1-4243-b462-994b6be128f0',
    productName: '옥천 복숭아'
  },
  {
    id: '2',
    productId: 'local-food/c85e7913-8175-4d29-87d9-b04ea6334bf2',
    productName: '순천 단감'
  },
  {
    id: '3',
    productId: 'local-food/eb48589a-5b10-490d-b209-e5db9e036578',
    productName: '횡성 한우'
  },
  {
    id: '4',
    productId: 'local-food/c3f59c30-e3af-4b70-b1b0-e5de87726e6d',
    productName: '의성 마늘'
  },
  {
    id: '5',
    productId: 'local-food/6f00acf5-8df8-499a-a695-9f5bc7202e5d',
    productName: '논산 딸기'
  }
];

const SearchRecommendations = ({
  setIsOpen
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathName = usePathname();
  const marketSide = pathName === '/market' || pathName.startsWith('/market');
  const localFoodSide =
    pathName === '/local-food' || pathName.startsWith('/local-food/');
  const homeSide = pathName === '/';

  return (
    <div className="text-nowrap bg-normal">
      <div
        className={`px-2 pt-6 ${
          marketSide || localFoodSide || homeSide ? 'block' : 'hidden'
        }`}
      >
        <div className="text-base">
          향그리움이 추천하는{' '}
          <span>
            {marketSide || homeSide
              ? '전통시장'
              : pathName === '/local-food'
              ? '특산물'
              : ''}
          </span>
        </div>
        <div className="text-xs text-label-alternative pb-[17px]">
          가장 많이{' '}
          <span>
            {marketSide || homeSide
              ? '찾았던 전통시장'
              : localFoodSide
              ? '구매했던 특산물'
              : ''}
          </span>
          을 추천해 드려요
        </div>
      </div>
      <div className="grid grid-rows-4 grid-cols-2 gap-2">
        {marketSide || homeSide
          ? top8Market.map((item) => (
              <Link
                href={`/${item.productId}`}
                key={item.id}
                onClick={() => setIsOpen(false)}
              >
                <div className="gap-1">
                  <span className="inline-flex items-center justify-center p-[2px] w-6 h-6 text-primary-20 text-nowrap text-base">
                    {item.id}
                  </span>
                  <span className="text-sm">{item.productName}</span>
                </div>
              </Link>
            ))
          : localFoodSide
          ? top5LocalFood.map((item) => (
              <Link
                href={`/${item.productId}`}
                key={item.id}
                onClick={() => setIsOpen(false)}
              >
                <div className="gap-1">
                  <span className="inline-flex items-center justify-center p-[2px] w-6 h-6 text-primary-20 text-nowrap text-base">
                    {item.id}
                  </span>
                  <span className="text-sm">{item.productName}</span>
                </div>
              </Link>
            ))
          : ''}
      </div>
    </div>
  );
};

export default SearchRecommendations;
