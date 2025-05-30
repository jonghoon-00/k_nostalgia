// children 형태로 감싸서 사용 (<Modal>{내부 요소}</Modal>)

import clsx from 'clsx';
import React from 'react';
import { BackButton } from '../icons/BackButton';

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;

  modalHeader?: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
  isFullOnMobile?: boolean;
}

/**
 *
 * 모바일 - isFullOnMobile=true일 경우 전체화면 대응
 *
 * @property {boolean} isModalOpen - 모달 오픈 여부 state
 * @property {() => void} onClose - 모달 닫기 function
 * @property {React.ReactNode} children
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
  modalHeader,
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
      // className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
      onClick={onClose}
    >
      <div
        className={clsx(
          'bg-white',
          isFullOnMobile
            ? 'rounded-none w-full h-full max-h-none'
            : 'md:rounded-2xl',
          className
        )}
        style={{
          width: isFullOnMobile ? undefined : width ? `${width}px` : 'auto',
          height: isFullOnMobile ? undefined : height ? `${height}px` : 'auto',
          maxHeight: isFullOnMobile ? undefined : 'calc(100vh - 40px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isFullOnMobile && (
          <div
            className={clsx(
              'md:hidden flex justify-between items-center',
              'px-4 py-3 border-b'
            )}
          >
            <button onClick={onClose}>
              <BackButton />
            </button>
            <div>{modalHeader}</div>
          </div>
        )}
        {!isFullOnMobile && <div>{modalHeader}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
