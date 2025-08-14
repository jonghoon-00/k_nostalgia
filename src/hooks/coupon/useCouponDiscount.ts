import { calculateDiscount } from '@/utils/coupons';
import { useCouponStore } from '@/zustand/coupon/useCouponStore';
import { useMemo } from 'react';
import { useGetAllCoupons } from './useGetAllCoupons';

/**
 * selectedCouponIds와 전체 쿠폰 목록을 기반으로
 * 할인액을 계산하여 반환합니다.
 * @returns number - 계산된 할인액
 */
export function useCouponDiscount(): number {
  const coupons = useGetAllCoupons();
  const selectedIds = useCouponStore(state => state.selectedCouponIds);

  const discount = useMemo(() => {
    if (!coupons.length || !selectedIds.length) return 0;
    const applied = coupons.filter(c => selectedIds.includes(c.id));
    return calculateDiscount(applied);
  }, [coupons, selectedIds]);

  return discount;
}
