// children 형태로 감싸서 사용 (<Modal>{내부 요소}</Modal>)

import clsx from 'clsx';
import React from 'react';
import { BackButton } from '../icons/BackButton';

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;

  // modalHeader?: React.ReactNode;
  headerTitle?: string;
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
 * @property {React.ReactNode} modalHeader - 모달 헤더
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
          'bg-white',
          isFullOnMobile && 'rounded-none max-h-none w-full h-full',
          !isFullOnMobile && 'rounded-xl',
          'md:rounded-2xl md:h-auto md:w-auto',
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
        {/* 모달 헤더 */}

        <div
          className={clsx(
            'md:hidden',
            'flex justify-between items-center',
            'px-3 py-2',
            'border-b'
          )}
        >
          <button onClick={onClose}>
            <BackButton />
          </button>
          <h3>{headerTitle ? headerTitle : ''}</h3>
          <div className="w-7 h-7">{''}</div>
          {/* TODO X 버튼 추가 + 타이틀 TEXT 받아서 넣는 형식으로 추가 */}
          {/* <div>{modalHeader}</div> */}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
