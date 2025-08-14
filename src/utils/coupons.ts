import { Tables } from "@/types/supabase";

/**
 * 선택한 쿠폰 정보를 기반으로 할인 금액 계산
 * @param selectedCouponList - 선택된 쿠폰 [] (또는 null)
 * @returns 할인 금액 (기본값: 0)
 */
export function calculateDiscount(selectedCouponList: Tables<'coupons'>[] | null): number {
  let totalDiscount = 0;

  if (!selectedCouponList?.length) return 0;

  if(selectedCouponList.length === 1) {
    totalDiscount =  selectedCouponList[0].amount as number;
  } else{
    totalDiscount = selectedCouponList.reduce((acc, coupon) => acc + coupon.amount, 0);
  }
  return totalDiscount;
}
