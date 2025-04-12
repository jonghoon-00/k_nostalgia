// children 형태로 감싸서 사용 (<Modal>{내부 요소}</Modal>)

import React from 'react';

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalHeader: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onClose,
  children,
  className,
  modalHeader,
  width,
  height
}) => {
  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl ${className}`}
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto', // 외부에서 높이 조정 가능하도록 추가
          maxHeight: 'calc(100vh - 40px)' // 화면을 넘지 않도록 제한
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {modalHeader}
        <div>{children}</div>
      </div>
    </div>
  );
};
