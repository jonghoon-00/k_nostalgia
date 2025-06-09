import { PropsWithChildren } from 'react';
import { Chat } from '../chat/Chat';
import TopButton from '../icons/TopButton';
import Footer from './Footer';
import WebHeader from './header/WebHeader';

interface DefaultWebLayoutProps {
  showWebHeader?: boolean;
  showFooter?: boolean;
  showWebChat?: boolean;
  showWebTopButton?: boolean;
}

const DefaultWebLayout = ({
  children,
  showWebHeader = true,
  showFooter = true,
  showWebChat = true,
  showWebTopButton = true
}: PropsWithChildren<DefaultWebLayoutProps>) => {
  return (
    <div className="hidden md:block min-h-screen flex flex-col">
      {showWebHeader && <WebHeader />}
      <main className="flex-grow mx-auto">{children}</main>
      <div className="flex flex-col fixed bottom-[40px] right-[41px] z-50 gap-3">
        {showWebChat && <Chat />}
        {showWebTopButton && <TopButton />}
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default DefaultWebLayout;
