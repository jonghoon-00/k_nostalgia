import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import CouponContents from './components/CouponContents';

const CouponPage = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const { data: coupon } = await supabase
    .from('users')
    .select('coupon')
    .eq('id', data.user?.id as string)
    .single();

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

      <CouponContents coupon={coupon?.coupon as string} />
    </div>
  );
};

export default CouponPage;
