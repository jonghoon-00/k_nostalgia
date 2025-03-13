import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: '향그리움-주문내역',
  description: '구매하신 특산품 주문 내역을 확인하실 수 있는 페이지입니다.'
};

const Profile = dynamic(() => import('../my-page/_components/Profile'), {
  ssr: true
});

function MyPageLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen max-w-[1280px] mx-auto px-4 lg:flex">
      <aside className="hidden lg:block lg:w-1/2 lg:mr-6">
        <div className="max-w-[503px] mt-20 max-h-[422px] p-10 bg-primary-70 rounded-xl">
          <Profile />
        </div>
      </aside>
      <main className="w-full lg:w-2/3">{children}</main>
    </div>
  );
}

export default MyPageLayout;
