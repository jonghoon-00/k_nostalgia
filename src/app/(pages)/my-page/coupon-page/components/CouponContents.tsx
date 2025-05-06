'use client';

import { Skeleton } from '@/components/ui/skeleton';
import supabase from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';
import CouponItem from './CouponItem';
import DownloadableCoupons from './DownloadableCoupons';

interface Props {
  couponCodeList: string[];
}

const CouponContents: React.FC<Props> = ({ couponCodeList }) => {
  const [activeTab, setActiveTab] = useState('coupons');
  const [imageUrlList, setImageUrlList] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const getCouponCodeList = async (couponCodeList: string[]) => {
    // 쿠폰이 없을 때 처리는 page.tsx에 되어있음
    const { data: imageUrlListFromDB } = await supabase
      .from('coupons')
      .select('image_url')
      .in('code', couponCodeList);

    if (!imageUrlListFromDB || imageUrlListFromDB.length === 0) {
      return console.error('이미지 url get 에러');
    }

    return imageUrlListFromDB.filter((item) => item.image_url !== null) as {
      image_url: string;
    }[];
  };

  const getImageUrlArray = (imageUrlListFromDB: { image_url: string }[]) => {
    const imageUrls = imageUrlListFromDB?.map((item) => item.image_url);
    setImageUrlList(imageUrls);
  };

  useEffect(() => {
    getCouponCodeList(couponCodeList).then((imageUrlListFromDB) => {
      if (imageUrlListFromDB) {
        getImageUrlArray(imageUrlListFromDB);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {/* 쿠폰 탭 */}
      <div className="flex mt-[15px] mx-auto w-[95%] justify-between items-center md:items-center md:justify-center md:gap-4">
        <div>
          <button
            className={`px-6 py-2 border-b-4 text-[16px] ${
              activeTab === 'coupons'
                ? 'text-primary-20 border-primary-20'
                : 'text-label-assistive border-transparent'
            }`}
            onClick={() => setActiveTab('coupons')}
          >
            사용 가능 쿠폰
          </button>
        </div>
        <div>
          <button
            className={`px-6 py-2 border-b-4 text-[16px] ${
              activeTab === 'download'
                ? 'text-primary-20 border-primary-20'
                : 'text-label-assistive border-transparent'
            }`}
            onClick={() => setActiveTab('download')}
          >
            쿠폰 다운로드
          </button>
        </div>
      </div>

      <div className="border border-[#F2F2F2]" />

      {/* 쿠폰 리스트 */}
      <div>
        {activeTab === 'coupons' && (
          <div className="p-4">
            {isLoading
              ? // 로딩 스켈레톤
                Array.from({ length: 2 }, (_, index) => (
                  <Skeleton className="w-[311px] h-[161px] md:w-[640px] md:h-[280px] bg-label-disable rounded-xl mb-4" />
                ))
              : imageUrlList.map((imageUrl) => (
                  <CouponItem imageUrl={imageUrl} key={imageUrl} />
                ))}
          </div>
        )}
      </div>

      {/* 다운로드 가능한 쿠폰 */}
      <div className="flex justify-center items-center">
        {activeTab === 'download' && <DownloadableCoupons />}
      </div>
    </>
  );
};

export default CouponContents;
