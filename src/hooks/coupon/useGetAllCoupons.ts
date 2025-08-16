import { getCouponList } from '@/app/api/coupon/getCouponForClient';
import { Tables } from '@/types/supabase';
import { useEffect, useState } from 'react';

// 모듈 레벨 캐시
let _cachedCoupons: Tables<'coupons'>[] | null = null;
let _inflight: Promise<Tables<'coupons'>[] | null> | null = null;

export function useGetAllCoupons(): Tables<'coupons'>[] {
  const [coupons, setCoupons] = useState<Tables<'coupons'>[]>(_cachedCoupons ?? []);

  useEffect(() => {
    let mounted = true;

    // 캐시가 있으면 재요청 x
    if (_cachedCoupons) {
      setCoupons(_cachedCoupons);
      return () => { mounted = false; }; // 클린업
    }

    const run = async () => {
      try {
        if (_inflight) {
          const list = await _inflight;
          if (mounted && list) setCoupons(list);
          return;
        }
        _inflight = getCouponList();
        const list = await _inflight;
        _cachedCoupons = list ?? [];
        if (mounted) setCoupons(_cachedCoupons);
      } catch (error) {
        console.error('useGetAllCoupons error:', error);
        if (mounted) setCoupons([]);
      } finally {
        _inflight = null;
      }
    };
    void run(); // 실행 후 반환된 Promise는 무시
    return () => { mounted = false; };
  }, []);

  return coupons;
}
