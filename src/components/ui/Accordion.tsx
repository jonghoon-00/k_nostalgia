import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import DownButton from '../icons/DownButton';
import UpButton from '../icons/UpButton';

interface AccordionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  containerClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
  containerClassName
}: AccordionProps) => {
  const [internalOpen, setInternalOpen] = useState(isOpen ?? false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleAccordion = () => {
    if (!contentRef.current || !buttonRef.current) return;

    // 버튼 위치 get
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const isButtonVisible =
      buttonRect.top >= 0 && buttonRect.bottom <= window.innerHeight;

    // 버튼이 화면 밖에 있으면 버튼 맨 아래로 스크롤
    if (!isButtonVisible) {
      buttonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }

    const newState = !open;
    setInternalOpen(newState);
    onToggle?.(newState);

    if (newState) {
      // 열릴 때
      setTimeout(() => {
        if (!contentRef.current) return;

        window.scrollTo({
          top: window.scrollY + buttonRect.top - window.innerHeight / 2,
          behavior: 'smooth'
        });
      }, 100);
    } else {
      // 닫힐 때
      window.scrollTo({
        top: window.scrollY + buttonRect.top - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={clsx(
        containerClassName,
        'border rounded-lg overflow-hidden shadow-sm'
      )}
    >
      {/* 아코디언 헤더 */}
      <button
        type="button"
        onClick={toggleAccordion}
        className={clsx(
          'w-full flex justify-between items-center px-4 py-3' // 패딩 추가
        )}
        ref={buttonRef}
      >
        {/* title이 string일경우 span태그로, ReactNode일경우 그대로 출력 */}
        {typeof title === 'string' ? (
          <span className="font-semibold">{title}</span>
        ) : (
          title
        )}
        {open ? <UpButton /> : <DownButton />}
      </button>

      {/* 아코디언 내용 */}
      <div
        className={clsx(
          'transition-all duration-300',
          'px-4 py-2',
          'overflow-hidden',
          'bg-white'
        )}
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px'
        }}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
