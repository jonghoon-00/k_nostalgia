import { createClient } from '@/utils/supabase/server';
import CouponList from './_components/CouponList';

const CouponPageInCart = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const { data: coupon, error } = await supabase
    .from('users')
    .select('coupon')
    .eq('id', data.user?.id as string)
    .single();

  if (error) {
    console.log(error);
  }

  return (
    <div className="mt-20">
      <CouponList coupon={coupon?.coupon as string} />
    </div>
  );
};

export default CouponPageInCart;
