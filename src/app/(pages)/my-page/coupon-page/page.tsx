import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import CouponContents from './components/CouponContents';

const CouponPage = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const { data: couponCodeList } = await supabase
    .from('users')
    .select('coupons')
    .eq('id', data.user?.id as string)
    .single();

  /* TODO : 쿠폰이 없을 때 처리(ui) */
  if (!couponCodeList?.coupons || couponCodeList.coupons.length === 0) {
    return <div>쿠폰 없음</div>;
  }
  const { coupons } = couponCodeList;

  return (
    <div className=" p-4 bg-normal mt-20">
      <div className="hidden md:mb-[48px] md:flex">
        <Image
          src="/image/Coupon_Tiger2.png"
          alt="마이페이지 쿠폰호랑이 "
          width={141}
          height={88}
          className="w-[141px] h-[88px]"
        />
      </div>

      <>
        <CouponContents couponCodeList={coupons} />
      </>
    </div>
  );
};

export default CouponPage;
