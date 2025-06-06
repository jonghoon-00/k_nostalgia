import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

// return codeList string[] 
export const getCouponCodeListForClient = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const { data: couponCodeList } = await supabase
    .from('users')
    .select('coupons')
    .eq('id', data.user?.id as string)
    .single();

  return couponCodeList;
}

export const getCouponList = async () => {
  const supabase = createClient();
  const couponCodeList = await getCouponCodeListForClient();

  let couponList : Tables<'coupons'>[] | null = [];
  if (
    couponCodeList &&
    couponCodeList.coupons &&
    couponCodeList.coupons.length > 0
  ) {
    const { coupons : couponCodes } = couponCodeList;

    const { data: couponListFromDb } = await supabase
      .from('coupons')
      .select('*')
      .in('code', couponCodes);

      couponList = couponListFromDb
  }

  return couponList;
}