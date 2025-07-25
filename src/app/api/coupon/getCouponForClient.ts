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

  let couponList: Tables<'coupons'>[] | null = [];

  if (couponCodeList?.coupons?.length) {
    const { coupons : couponCodes } = couponCodeList;

    const { data: couponListFromDb } = await supabase
      .from('coupons')
      .select('*')
      .in('code', couponCodes);

      couponList = couponListFromDb;
  }

  return couponList;
}

/**
 * 주어진 쿠폰 ID 배열과 일치하는 쿠폰 레코드를 반환
 * @param {string[]} ids - 쿠폰 ID 배열 
 */
export const fetchCouponsByIds = async (
  ids: string[]
): Promise<Tables<'coupons'>[] | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error("fetchCouponsByIds error:", error);
    return null;
  }

  return data;
}