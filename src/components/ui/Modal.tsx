'use client';

import useDeviceSize from '@/hooks/useDeviceSize';
import clsx from 'clsx';
import React from 'react';
import { BackButton } from '../icons/BackButton';
import { XClose } from '../icons/XClose';

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;

  headerTitle: string;
  className?: string;
  width?: string;
  height?: string;
  isFullOnMobile?: boolean;
}

/**
 *
 * 모바일 - isFullOnMobile=true일 경우 전체화면 대응
 *
 * @property {boolean} isModalOpen - 모달 오픈 여부 state (필수)
 * @property {() => void} onClose - 모달 닫기 function (필수)
 * @property {React.ReactNode} children (필수)
 * @property {string} headerTitle - 헤더 타이틀 텍스트
 * @property {string} [className] - 모달 컨테이너에 추가할 스타일(class)
 * @property {string} [width] - 데스크탑 기준 모달 너비(px)
 * @property {string} [height] - 데스크탑 기준 모달 높이(px)
 * @property {boolean} [isFullOnMobile] - 모바일에서 전체 화면으로 표시 여부
 *
 */
export const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onClose,
  children,
  className,
  headerTitle,
  width,
  height,
  isFullOnMobile
}) => {
  const { isMobile } = useDeviceSize();

  if (!isModalOpen) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[9999]',
        'bg-black bg-opacity-50',
        'flex items-center justify-center'
      )}
      onClick={onClose}
    >
      <div
        className={clsx(
          'bg-normal',
          isFullOnMobile
            ? 'rounded-none max-h-none w-full h-full'
            : 'rounded-xl',
          'md:rounded-2xl md:h-auto md:w-auto',
          // 추가 커스텀 클래스
          className
        )}
        style={{
          width: isFullOnMobile ? undefined : width ? `${width}px` : undefined,
          height: isFullOnMobile
            ? undefined
            : height
            ? `${height}px`
            : undefined,
          maxHeight: isFullOnMobile ? undefined : 'calc(100vh - 40px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 공통 헤더 */}
        <div
          className={clsx(
            // 레이아웃: 좌우 버튼 + 제목 중앙
            'flex justify-between items-center',
            'py-3 pb-2 px-4',
            'border-b-2 border-gray-90'
          )}
        >
          {isFullOnMobile && isMobile ? (
            // [모바일 전체화면 모드] 왼쪽 뒤로가기 버튼
            <button
              onClick={onClose}
              className={clsx('w-7 h-7', 'flex items-center justify-center')}
            >
              <BackButton />
            </button>
          ) : (
            // [데스크탑 사이즈] 왼쪽 자리 확보용 spacer
            <div className="w-7 h-7" />
          )}

          <h3 className={clsx('flex-1', 'text-center', 'text-lg font-medium')}>
            {headerTitle}
          </h3>

          {isFullOnMobile && isMobile ? (
            // [모바일 전체화면 모드] 오른쪽 spacer
            <div className="w-7 h-7" />
          ) : (
            // [데스크탑 사이즈] 오른쪽 X 버튼
            <button
              onClick={onClose}
              className={clsx(
                'w-7 h-7',
                'flex items-center justify-center',
                'text-xl font-bold'
              )}
            >
              <XClose />
            </button>
          )}
        </div>

        {/* 모달 콘텐츠 */}
        <div
          className={clsx(
            // 콘텐츠 전체 영역
            'overflow-auto',
            // 필요하다면 추가 여백/스타일
            'p-4'
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
