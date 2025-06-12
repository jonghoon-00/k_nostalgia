'use client';

import useDeviceSize from '@/hooks/useDeviceSize';

interface CouponLayoutProps {
  children: React.ReactNode;
  couponModal: React.ReactNode;
}

/**
 * Renders either the coupon modal or the provided children based on device type.
 *
 * Displays the {@link couponModal} content on desktop devices, and the {@link children} content on non-desktop devices.
 *
 * @param children - Content to display on non-desktop devices.
 * @param couponModal - Content to display on desktop devices.
 */
export default function CouponLayout({
  children,
  couponModal
}: CouponLayoutProps) {
  const { isDesktop } = useDeviceSize();

  return <>{isDesktop ? <div>{couponModal}</div> : <div>{children}</div>}</>;
}
