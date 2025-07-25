import { PropsWithChildren } from 'react';
import { Chat } from '../chat/Chat';
import TopButton from '../icons/TopButton';
import AppHeader from './header/AppHeader';
import Navigation from './Navigation';

interface DefaultAppLayoutProps {
  showNavigation: boolean;
  showHeader: boolean;
  headerTitle?: string;
  showChat?: boolean;
  showTopButton?: boolean;
  showBackButton?: boolean;
  showLogo?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
  showComplete?: boolean;
  onCompleteClick?: () => void;
}

const DefaultAppLayout = ({
  children,
  showNavigation = true,
  showHeader = true,
  headerTitle = '',
  showChat = true,
  showTopButton = false,
  showBackButton = true,
  showLogo = false,
  showSearch = true,
  showCart = true,
  showComplete = false,
  onCompleteClick
}: PropsWithChildren<DefaultAppLayoutProps>) => {
  return (
    <div className="md:hidden flex flex-col min-h-screen">
      {showHeader && (
        <AppHeader
          headerTitle={headerTitle}
          showBackButton={showBackButton}
          showLogo={showLogo}
          showSearch={showSearch}
          showCart={showCart}
          showComplete={showComplete}
          onCompleteClick={onCompleteClick}
        />
      )}
      <main className="flex-grow">{children}</main>
      <div className="flex flex-col fixed bottom-[86px] right-3 z-50 gap-3 pb-4">
        {showChat && <Chat />}
        {showTopButton && <TopButton />}
      </div>
      {showNavigation && <Navigation />}
    </div>
  );
};

export default DefaultAppLayout;
