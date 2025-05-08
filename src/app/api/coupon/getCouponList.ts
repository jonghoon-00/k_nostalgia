import { createClient } from "@/utils/supabase/server";

/**
 * 
 * @description 서버 컴포넌트에서 사용.
 * 'users' Table에서 쿠폰 코드 리스트를 가져오는 함수
 * @returns couponCodeList
 */
export const getCouponCodeList = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const { data: couponCodeList } = await supabase
    .from('users')
    .select('coupons')
    .eq('id', data.user?.id as string)
    .single();

  return couponCodeList;
}

/**
 * 
 * @description 서버 컴포넌트에서 사용.
 * 'users' Table에서 쿠폰 코드 리스트 get -> 'coupons' Table에서 code 대입해 쿠폰 이미지 URL 리스트 get
 * @returns couponImageUrlList, hasNoList(boolean)
 */
export const getCouponImageUrlList = async () => {
  const supabase = createClient();
  const couponCodeList = await getCouponCodeList();

  let couponImageUrlList: string[] = [];

  if (
    // 보유한 쿠폰 코드가 있는 경우에만 DB에서 이미지 URL을 가져옴
    couponCodeList &&
    couponCodeList.coupons &&
    couponCodeList.coupons.length > 0
  ) {
    const { coupons } = couponCodeList;

    const { data: imageUrlListFromDB } = await supabase
      .from('coupons')
      .select('image_url')
      .in('code', coupons as string[]);

    if (!imageUrlListFromDB || imageUrlListFromDB.length === 0) {
      console.error('이미지 url get 에러');
    }

    couponImageUrlList = imageUrlListFromDB
      ?.filter((item) => item.image_url !== null) // null 값 필터링
      .map((item) => item.image_url) as string[]; // image_url만 추출
  }

  const hasNoList: boolean = !couponCodeList || couponImageUrlList.length === 0;

  return {couponImageUrlList, hasNoList};
}