import { createClient } from '@/utils/supabase/server';
import CouponList from './_components/CouponList';

const CouponPageInCart = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const { data: coupons, error } = await supabase
    .from('users')
    .select('coupons')
    .eq('id', data.user?.id as string)
    .single();

  if (error) {
    console.log(error);
  }

  return (
    <div className="mt-20">
      <CouponList coupons={coupons} />
    </div>
  );
};

export default CouponPageInCart;
