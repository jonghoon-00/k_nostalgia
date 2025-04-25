'use client';

import useDeviceSize from '@/hooks/useDeviceSize';

interface CouponLayoutProps {
  children: React.ReactNode;
  couponModal: React.ReactNode;
}

export default function CouponLayout({
  children,
  couponModal
}: CouponLayoutProps) {
  const { isDesktop } = useDeviceSize();

  return <>{isDesktop ? <div>{couponModal}</div> : <div>{children}</div>}</>;
}
