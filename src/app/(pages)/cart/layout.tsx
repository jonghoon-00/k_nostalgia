'use client';

import useDeviceSize from '@/hooks/useDeviceSize';

interface CartLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function CartLayout({ children, modal }: CartLayoutProps) {
  const { isDesktop } = useDeviceSize();
  // const { data: cartData } = useUserCartData();
  return (
    <>
      {children}
      {isDesktop && modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {modal}
        </div>
      )}
    </>
  );
}
