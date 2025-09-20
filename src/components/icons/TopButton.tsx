'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

const TopButton = () => {
  const [show, setShow] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setShow(y > 0); // 최상단(0)이면 숨김
    };
    // 초기 상태 반영 + 이벤트 등록
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      className={clsx(
        'whitespace-nowrap rounded-md',
        'text-sm font-medium text-primary-foreground',
        'h-10 w-10',
        'flex justify-center items-center',
        'transition-all duration-200 ease-in-out',
        show
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      onClick={scrollToTop}
    >
      <div className="flex items-center justify-center rounded-full bg-secondary-60 shadow w-10 h-10 p-[6px] cursor-pointer z-50 hover:bg-secondary-40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.4707 2.40014C11.7731 2.1333 12.2268 2.1333 12.5293 2.40014L21.0293 9.90014C21.3606 10.1925 21.3922 10.698 21.0998 11.0293C20.8075 11.3606 20.302 11.3922 19.9707 11.0999L12.8 4.77279V21C12.8 21.4418 12.4418 21.8 12 21.8C11.5581 21.8 11.2 21.4418 11.2 21V4.77279L4.02926 11.0999C3.69796 11.3922 3.19241 11.3606 2.90009 11.0293C2.60777 10.698 2.63936 10.1924 2.97066 9.90012L11.4707 2.40014Z"
            fill="#545454"
          />
        </svg>
      </div>
    </button>
  );
};

export default TopButton;
