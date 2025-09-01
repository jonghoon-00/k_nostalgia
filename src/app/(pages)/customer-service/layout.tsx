'use client';
import useDeviceSize from '@/hooks/useDeviceSize';
import clsx from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';
import CustomerHeader from './_components/CustomerHeader';
import CustomerNoContext from './_components/CustomerNoContext';
import CustomerSidebar from './_components/CustomerSidebar';

function CustomerPageLayout({ children }: PropsWithChildren) {
  const { isDesktop } = useDeviceSize();
  const [selected, setSelected] = useState(
    Number(sessionStorage.getItem('selected_customer_sidebar')) ?? 1
  );

  useEffect(() => {
    () => sessionStorage.removeItem('selected_customer_sidebar');
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <CustomerHeader />
      <div
        className={clsx(
          'w-full',
          'md:max-w-[1280px]',
          'flex justify-center gap-10 md:pt-20',
          'mx-auto'
        )}
      >
        {isDesktop && (
          <aside className="flex flex-col">
            <CustomerSidebar selected={selected} setSelected={setSelected} />
          </aside>
        )}
        <main className="w-full p-4">
          {selected === 3 || selected === 4 ? <CustomerNoContext /> : children}
        </main>
      </div>
    </div>
  );
}

export default CustomerPageLayout;
