'use client';

import DefaultAppLayout from '@/components/common/DefaultAppLayout';
import DefaultWebLayout from '@/components/common/DefaultWebLayout';

import useDeviceSize from '@/hooks/useDeviceSize';

import FirstLoading from '@/components/common/FirstLoading';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useDeviceSize();
  const pathName = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const guestCookie = Cookies.get('guest') === 'true';
    setIsGuest(guestCookie);
  }, []);

  if (!isClient) {
    return <FirstLoading />;
  }

  /* 모바일 레이아웃 */
  let showHeader: boolean = true;
  let showLogo: boolean = false;
  let showBackButton: boolean = true;
  let headerTitle: string = '';
  let showSearch: boolean = true;
  let showCart: boolean = true;
  let showChat: boolean = true;
  let showTopButton: boolean = false;
  let showNavigation: boolean = true;
  let showComplete: boolean = false;
  let onCompleteClick: () => void;

  // 홈
  if (pathName === '/') {
    showLogo = true;
    showBackButton = false;
    showTopButton = true;
  }
  // 전통시장
  else if (pathName === '/market') {
    showBackButton = false;
    headerTitle = '전통시장';
    showTopButton = true;
  } else if (pathName.startsWith('/market/')) {
    showTopButton = true;
    showNavigation = false;
  }
  // 특산물
  else if (pathName === '/local-food') {
    showBackButton = false;
    headerTitle = '특산물';
    showTopButton = true;
  } else if (pathName.startsWith('/local-food/')) {
    showTopButton = true;
    showNavigation = false;
  }
  // 마이페이지
  else if (pathName === '/my-page') {
    showBackButton = false;
    headerTitle = '내 프로필';
    showSearch = false;
  }

  // 프로필 수정은 UX를 위해 페이지 내에서 처리
  // 마이페이지 - 쿠폰
  else if (pathName === '/my-page/coupon-page') {
    headerTitle = '할인쿠폰';
    showSearch = false;
    showChat = false;
    showCart = false;
  }
  // 회원가입
  else if (pathName === '/sign-up') {
    showHeader = false;
    showSearch = false;
    showCart = false;
    showNavigation = false;
    showChat = false;
  }
  // 로그인 페이지 쿠키에 따라 다르게 처리
  else if (pathName === '/log-in') {
    showHeader = isGuest;
    showNavigation = isGuest;
    headerTitle = isGuest ? '로그인' : '';
    showChat = false;
  }
  // 설정 페이지
  else if (pathName === '/my-page/setting') {
    headerTitle = '설정';
    showHeader = true;
    showSearch = false;
    showCart = false;
    // showNavigation = false;
  }
  //배송지 관련 페이지
  else if (pathName.includes('delivery-address')) {
    showHeader = true;
    showSearch = false;
    showCart = false;
    showNavigation = false;
    if (pathName.endsWith('add-new')) {
      headerTitle = '새 배송지 추가';
    } else {
      headerTitle = '배송지 관리';
    }
  }
  // 장바구니
  else if (pathName.includes('cart')) {
    headerTitle = '장바구니';
    showSearch = false;
    showCart = false;
    showChat = false;
    showNavigation = false;
  }
  // 주문 내역
  else if (pathName === '/pay-history') {
    showHeader = true;
    headerTitle = '주문 내역';
    showSearch = false;
    showChat = false;
    showNavigation = true;
  }
  // 결제 페이지
  else if (pathName === '/payment') {
    showHeader = false;
    showSearch = false;
    showCart = false;
    showNavigation = false;
    showChat = false;
  }
  // 결제 완료 페이지
  else if (pathName === '/complete-payment') {
    showHeader = true;
    headerTitle = '주문 완료';
    showSearch = false;
    showCart = false;
    showNavigation = false;
  }
  // 결제 확인
  else if (pathName === '/check-payment') {
    showHeader = false;
    showSearch = false;
    showCart = false;
    showNavigation = false;
    showChat = false;
  } else if (pathName === '/my-page/likemarket-page') {
    showHeader = true;
    headerTitle = '관심 전통마켓';
    showSearch = false;
    showCart = false;
    showNavigation = true;
    showChat = false;
    showTopButton = true;
  }

  // 고객센터
  else if (pathName === '/customer-service') {
    showBackButton = true;
    headerTitle = '고객센터';
    showSearch = false;
    showCart = false;
  }

  // 고객센터-공지
  else if (pathName === '/customer-service/announcement') {
    showBackButton = true;
    headerTitle = '공지사항';
    showSearch = false;
    showCart = false;
  }

  // 고객센터 - 자주 묻는 질문
  else if (pathName === '/customer-service/faq-page') {
    showBackButton = true;
    headerTitle = '자주 묻는 질문';
    showSearch = false;
    showCart = false;
  }

  /* 모바일 레이아웃 끝 */

  /* 데스크탑 레이아웃 */
  let showWebHeader: boolean = true;
  let showFooter: boolean = true;
  let showWebChat: boolean = true;
  let showWebTopButton: boolean = true;

  // 회원가입, 로그인
  if (pathName === '/log-in' || pathName === '/sign-up') {
    showWebHeader = false;
    showFooter = false;
    showWebChat = false;
    showWebTopButton = false;
  }
  // 결제 확인
  else if (pathName === '/check-payment') {
    showWebHeader = false;
    showFooter = false;
    showWebChat = false;
    showWebTopButton = false;
  }
  // 프로필 에딧
  else if (pathName === '/profile-edit') {
    showFooter = false;
  }
  /* 데스크탑 레이아웃 끝*/

  return isDesktop ? (
    <DefaultWebLayout
      showWebHeader={showWebHeader}
      showFooter={showFooter}
      showWebChat={showWebChat}
      showWebTopButton={showWebTopButton}
    >
      {children}
    </DefaultWebLayout>
  ) : (
    <DefaultAppLayout
      showHeader={showHeader}
      showLogo={showLogo}
      showBackButton={showBackButton}
      headerTitle={headerTitle}
      showSearch={showSearch}
      showCart={showCart}
      showChat={showChat}
      showTopButton={showTopButton}
      showNavigation={showNavigation}
    >
      {children}
    </DefaultAppLayout>
  );
}
