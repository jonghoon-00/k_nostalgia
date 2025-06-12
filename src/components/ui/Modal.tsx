'use client';

import { useModalStore } from '@/zustand/useModalStore ';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { BackButton } from '../icons/BackButton';
import { XClose } from '../icons/XClose';

interface ModalProps {
  headerTitle: string;
  className?: string;
  width?: string;
  height?: string;
  isFullOnMobile?: boolean;
  children: React.ReactNode;
}

/**
 * Modal 컴포넌트 (Zustand 활용)
 * @param {string} headerTitle - 헤더 타이틀 텍스트
 * @param {string} [className] - 모달 컨테이너에 추가할 스타일(class)
 * @param {string} [width] - 데스크탑 기준 모달 너비(px)
 * @param {string} [height] - 데스크탑 기준 모달 높이(px)
 * @param {boolean} [isFullOnMobile] - 모바일에서 전체 화면 표시 여부
 */
export const Modal: React.FC<ModalProps> = ({
  headerTitle,
  className,
  width,
  height,
  isFullOnMobile,
  children
}) => {
  const pathname = usePathname();

  const isModalOpen = useModalStore((state) => state.isOpen);
  const close = useModalStore((state) => state.close);

  // 페이지 경로가 변경될 때 모달 닫기
  useEffect(() => {
    close();
  }, [pathname, close]);

  // 컴포넌트 언마운트 시 모달 닫기
  useEffect(() => {
    return () => {
      close();
    };
  }, [close]);

  if (!isModalOpen) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[9999] flex items-center justify-center',
        // isFullOnMobile인 모바일에서는 오버레이 제거, 그 외에는 오버레이 유지
        isFullOnMobile
          ? 'md:bg-black md:bg-opacity-50'
          : 'bg-black bg-opacity-50'
      )}
      onClick={close}
    >
      <div
        className={clsx(
          'bg-normal',
          // 모바일 사이즈
          isFullOnMobile
            ? 'w-full h-full rounded-none max-h-none'
            : 'w-auto h-auto rounded-2xl max-h-[calc(100vh-40px)]',
          // 데스크탑(md 이상)
          'md:w-auto md:h-auto md:rounded-2xl md:max-h-[calc(100vh-40px)]',
          className
        )}
        style={{
          // md 이상에서만 적용되는 인라인 크기
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 공통 헤더 */}
        <div
          className={clsx(
            'flex justify-between items-center',
            'py-3 pb-2 px-4',
            'border-b-2 border-gray-90'
          )}
        >
          {/* 모바일: 뒤로가기, 데스크탑: 자리 확보 */}
          <button
            onClick={close}
            className={clsx(
              'w-7 h-7 flex items-center justify-center',
              'md:hidden'
            )}
          >
            <BackButton />
          </button>
          <div className="hidden md:block w-7 h-7" />

          <h3 className={clsx('flex-1', 'text-center', 'text-lg font-medium')}>
            {headerTitle}
          </h3>

          {/* 모바일: 빈 공간, 데스크탑: 닫기 버튼 */}
          <div className="hidden md:block w-7 h-7" />
          <button
            onClick={close}
            className={clsx(
              'w-7 h-7 flex items-center justify-center text-xl font-bold',
              'hidden md:flex'
            )}
          >
            <XClose />
          </button>
        </div>

        {/* 모달 콘텐츠 */}
        <div className={clsx('overflow-auto', 'p-4')}>{children}</div>
      </div>
    </div>
  );
};
