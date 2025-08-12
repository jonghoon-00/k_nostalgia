'use client';

import { MODAL_IDS } from '@/constants';
import { useModalStore } from '@/zustand/useModalStore';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BackButton } from '../icons/BackButton';
import { XClose } from '../icons/XClose';

export type ModalId = (typeof MODAL_IDS)[keyof typeof MODAL_IDS];

interface ModalProps {
  modalId: ModalId;
  headerTitle?: string; // 기본 헤더 제목
  header?: React.ReactNode; // 커스텀 헤더 노드
  isFullOnMobile?: boolean; // 모바일 풀스크린 여부
  width?: React.CSSProperties['width']; // 데스크탑 기준 너비
  height?: React.CSSProperties['height']; // 데스크탑 기준 높이
  className?: string; // 추가 클래스
  children: React.ReactNode;
}

/**
 * Modal 컴포넌트 (Zustand 기반 modalId 제어 + 포털/스크롤 락 적용)
 *
 * @param {ModalId} modalId - 모달 식별자 (Zustand 상태 관리용)
 * @param {string} [headerTitle] - 기본 헤더에서 표시할 타이틀 (header 미사용 시 적용)
 * @param {React.ReactNode} [header] - 커스텀 헤더 노드 (지정 시 기본 헤더 대신 사용)
 * @param {boolean} [isFullOnMobile] - 모바일 화면에서 전체 화면 표시 여부
 * @param {string|number} [width] - 데스크탑 기준 모달 너비 (px, %, auto 등)
 * @param {string|number} [height] - 데스크탑 기준 모달 높이 (px, %, auto 등)
 * @param {string} [className] - 모달 컨테이너에 추가할 클래스
 * @param {React.ReactNode} children - 모달 본문 콘텐츠
 */
export const Modal: React.FC<ModalProps> = ({
  modalId,
  headerTitle,
  header,
  isFullOnMobile,
  width,
  height,
  className,
  children
}) => {
  const pathname = usePathname();
  const openModalId = useModalStore((state) => state.openModalId);
  const close = useModalStore((state) => state.close);
  const isOpen = openModalId === modalId;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 라우트 변경시 모달 닫기
  useEffect(() => {
    close();
  }, [pathname, close]);

  // 컴포넌트 언마운트 시 모달 닫기
  useEffect(() => {
    return () => {
      close();
    };
  }, [close]);

  // 스크롤 락
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // 포커스: 모달 열릴 때 컨테이너에 포커스
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    modalRef.current?.focus();
  }, [isOpen]);

  // 키보드: ESC 닫기만 지원
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () =>
      window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [isOpen, close]);

  if (!mounted || !isOpen) return null;

  const titleId = `${String(modalId)}-title`;

  const content = (
    <div
      className={clsx(
        'fixed inset-0 z-[9999] flex',
        'items-center justify-center',
        // 모바일 풀스크린 시 오버레이 제거, md 이상에서만 오버레이 표시
        isFullOnMobile
          ? 'md:bg-black md:bg-opacity-50'
          : 'bg-black bg-opacity-50'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={header ? undefined : titleId} // 최소 라벨: 기본 헤더만 연결
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={clsx(
          'bg-normal outline-none',
          isFullOnMobile
            ? 'w-full h-full rounded-none max-h-none'
            : 'w-auto h-auto rounded-2xl max-h-[calc(100vh-40px)]',
          'md:w-auto md:h-auto md:rounded-2xl md:max-h-[calc(100vh-40px)]',
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height
        }}
      >
        <ModalHeader
          titleId={titleId}
          title={headerTitle}
          custom={header}
          onClose={close}
        />
        <div className="overflow-auto p-4">{children}</div>
      </div>
    </div>
  );

  // createPortal Docs:
  // https://react.dev/reference/react-dom/createPortal
  return createPortal(content, document.body);
};

const ModalHeader: React.FC<{
  titleId: string;
  title?: string;
  custom?: React.ReactNode;
  onClose: () => void;
}> = ({ titleId, title, custom, onClose }) => {
  if (custom) {
    return (
      <div
        className={clsx(
          'flex justify-between items-center',
          'py-3 pb-2 px-4',
          'border-b-2 border-gray-90'
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center md:hidden"
          aria-label="닫기"
        >
          <BackButton />
        </button>
        <div className="hidden md:block w-7 h-7" aria-hidden />
        <div className="flex-1">{custom}</div>
        <div className="hidden md:block w-7 h-7" aria-hidden />
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 hidden md:flex items-center justify-center"
          aria-label="닫기"
        >
          <XClose />
        </button>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex justify-between items-center',
        'py-3 pb-2 px-4',
        'border-b-2 border-gray-90'
      )}
    >
      <button
        type="button"
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center md:hidden"
        aria-label="닫기"
      >
        <BackButton />
      </button>
      <div className="hidden md:block w-7 h-7" aria-hidden />
      <h3 id={titleId} className="flex-1 text-center text-lg font-medium">
        {title}
      </h3>
      <div className="hidden md:block w-7 h-7" aria-hidden />
      <button
        type="button"
        onClick={onClose}
        className="w-7 h-7 hidden md:flex items-center justify-center"
        aria-label="닫기"
      >
        <XClose />
      </button>
    </div>
  );
};
