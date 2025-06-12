import { Tables } from "@/types/supabase";


/**
 * Calculates the total discount amount from a list of selected coupons.
 *
 * If no coupons are selected, returns 0. For a single coupon, returns its discount amount. For multiple coupons, returns the sum of their discount amounts.
 *
 * @param selectedCouponList - The list of selected coupons, or null if none are selected.
 * @returns The total discount amount.
 */
export function calculateDiscount(selectedCouponList: Tables<'coupons'>[] | null): number {
  let totalDiscount = 0;

  if (!selectedCouponList || selectedCouponList.length === 0) return 0;

  if(selectedCouponList.length === 1) {
    totalDiscount =  selectedCouponList[0].amount as number;
  } else{
    totalDiscount = selectedCouponList.reduce((acc, coupon) => acc + coupon.amount, 0);
  }
  return totalDiscount;
}
