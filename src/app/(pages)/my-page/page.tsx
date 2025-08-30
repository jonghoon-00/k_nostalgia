'use client';
import { getCouponList } from '@/app/api/coupon/getCouponForClient';
import Loading from '@/components/common/Loading';
import NoList from '@/components/common/NoList';
import useDeviceSize from '@/hooks/useDeviceSize';
import { useUser } from '@/hooks/useUser';
import { Tables } from '@/types/supabase';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import PayHistoryList from '../pay-history/_components/PayHistoryList';
import CancelUser from './_components/CancelUser';
import Coupon_mypage from './_components/Coupon_mypage';
import GotoCustomer from './_components/GotoCustomer';
import LikeMarket from './_components/LikeMarket';
import Logout from './_components/Logout';
import OrderList_mypage from './_components/OrderList_mypage';
import Profile from './_components/Profile';
import CouponItem from './coupon-page/components/CouponItem';

const Mypage = () => {
  const { data: user, isLoading, error } = useUser();

  const router = useRouter();
  const { isDesktop } = useDeviceSize();

  const [couponList, setCouponList] = useState<Tables<'coupons'>[]>([]);
  // 쿠폰 리스트 가져오기
  useEffect(() => {
    (async () => {
      const result = await getCouponList();

      if (!result || result.length === 0) {
        console.warn('No coupons available');
        setCouponList([]);
        return;
      }
      setCouponList(result);
    })();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/log-in');
      }
    }
  }, [isLoading, user, router]);

  if (isLoading) return <Loading />;
  if (error) return <div> 로딩 에러 </div>;

  const handleGoCoupon = () => {
    router.push('/my-page/coupon-page');
  };

  const handleGoMarket = () => {
    router.push('/my-page/likemarket-page');
  };

  return (
    <div className="md:flex md:flex-row md:max-w-[1280px]">
      {/* 오른쪽 사이드 */}
      {isDesktop ? (
        <div className="flex w-full flex-col">
          <div className="w-full flex justify-between items-end mt-10">
            <Image
              src="/image/LikeMarket.png"
              alt="관심전통시장 "
              width={141}
              height={88}
              className="mt-10"
            />
            <div
              className="items-center flex p-3 gap-1 cursor-pointer"
              onClick={handleGoMarket}
            >
              <span className="underline text-sm"> 더보기 </span>
              <BsChevronRight className=" w-4 h-4 text-[#545454] cursor-pointer" />
            </div>
          </div>
          <LikeMarket />
          <div className="border-4 border-[#F2F2F2] mt-4 w-full" />

          <div className="flex flex-col w-full">
            <div className="w-full flex justify-between items-end">
              <Image
                src="/image/Coupon_Tiger2.png"
                alt="마이페이지 쿠폰호랑이 "
                width={141}
                height={88}
                className="mt-10"
              />
              <div
                className="flex items-center p-3 gap-1 cursor-pointer"
                onClick={handleGoCoupon}
              >
                <span className="underline text-sm"> 더보기 </span>
                <BsChevronRight className=" w-4 h-4 text-[#545454] cursor-pointer" />
              </div>
            </div>

            {/* 쿠폰 */}
            <div className={clsx('p-4')}>
              {couponList.length === 0 ? (
                <NoList message={'사용 가능 쿠폰이 없어요'} />
              ) : (
                couponList.map((coupon) => (
                  <CouponItem
                    imageUrl={coupon.image_url as string}
                    key={coupon.image_url}
                  />
                ))
              )}
            </div>

            <div className="border-4  border-[#F2F2F2] mt-10" />
          </div>
          <div>
            <PayHistoryList />
          </div>
          <div>
            <CancelUser />
          </div>
        </div>
      ) : (
        // 앱버전
        <div className="">
          <Profile />
          <div className="border-4 border-[#F2F2F2]" />
          <LikeMarket />
          <div className="border-4 border-[#F2F2F2]" />
          <OrderList_mypage />
          <div className="border border-[#F2F2F2]" />
          <Coupon_mypage />
          <div className="border-4 border-[#F2F2F2]" />
          {/* <CancelUser /> */}
          <GotoCustomer />
          <div className="border border-[#F2F2F2]" />
          <Logout />
        </div>
      )}
    </div>
  );
};
export default Mypage;
