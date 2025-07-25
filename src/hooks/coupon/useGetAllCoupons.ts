import { getCouponList } from '@/app/api/coupon/getCouponForClient';
import { Tables } from '@/types/supabase';
import { useEffect, useState } from 'react';

/**
 * 전체 쿠폰 목록을 서버에서 가져와 반환
 * @returns Tables<'coupons'>[] - 쿠폰 목록 배열
 */
export function useGetAllCoupons(): Tables<'coupons'>[] {
  const [coupons, setCoupons] = useState<Tables<'coupons'>[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await getCouponList();
        if (isMounted && list) {
          setCoupons(list);
        }
      } catch (error) {
        console.error('useGetAllCoupons error:', error);
        if (isMounted) setCoupons([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return coupons;
}
