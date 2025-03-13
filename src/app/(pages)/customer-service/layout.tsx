'use client';
import { PropsWithChildren, useState } from 'react';
import CustomerHeader from './_components/CustomerHeader';
import useDeviceSize from '@/hooks/useDeviceSize';
import CustomerSidebar from './_components/CustomerSidebar';
import CustomerNoContext from './_components/CustomerNoContext';

function CustomerPageLayout({ children }: PropsWithChildren) {
  const { isDesktop } = useDeviceSize();
  const [selected, setSelected] = useState(1);

  return (
    <>
      <CustomerHeader />
      <div className={`mx-auto ${isDesktop ? 'flex' : ''}`}>
        {isDesktop && (
          <aside className="flex flex-col mt-20 ml-4 mr-10">
            <CustomerSidebar selected={selected} setSelected={setSelected} />
          </aside>
        )}
        <main className={`${isDesktop ? 'w-[999px]' : 'w-full'}`}>
          {selected === 3 || selected === 4 ? <CustomerNoContext /> : children}
        </main>
      </div>
    </>
  );
}

export default CustomerPageLayout;
