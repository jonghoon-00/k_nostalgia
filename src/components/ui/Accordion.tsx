import { ACCORDION_IDS } from '@/constants';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import DownButton from '../icons/DownButton';
import UpButton from '../icons/UpButton';

interface AccordionProps {
  id: (typeof ACCORDION_IDS)[keyof typeof ACCORDION_IDS];
  title: string | React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  containerClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  id,
  title,
  children,
  isOpen,
  onToggle,
  containerClassName
}: AccordionProps) => {
  const [internalOpen, setInternalOpen] = useState(isOpen ?? false);
  const open = isOpen ?? internalOpen;

  // isOpen 동기화
  useEffect(() => {
    if (isOpen !== undefined) setInternalOpen(isOpen);
  }, [isOpen]);

  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [maxHeight, setMaxHeight] = useState<string>(open ? 'auto' : '0px');

  // 콘텐츠 높이 추적
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      setMaxHeight(`${el.scrollHeight}px`);
    });
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [open]);

  // open 변화 시 maxHeight 업데이트
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (open) {
      // 열릴 때: 현재 콘텐츠 높이로
      setMaxHeight(`${el.scrollHeight}px`);
      const onEnd = () => setMaxHeight('auto');
      el.addEventListener('transitionend', onEnd, { once: true });
    } else {
      // 닫힐 때: auto → 픽셀로 강제, 0px로 변경
      const current = el.scrollHeight;
      setMaxHeight(`${current}px`);
      requestAnimationFrame(() => setMaxHeight('0px'));
    }
  }, [open]);

  // 스크롤 타깃 계산
  const getScrollTarget = (el: Element, desiredViewportY: number) => {
    const rect = el.getBoundingClientRect();
    const elementPageTop = window.scrollY + rect.top;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(elementPageTop - desiredViewportY, max));
  };

  const toggleAccordion = () => {
    const newState = !open;

    if (!contentRef.current || !buttonRef.current) return;

    if (isOpen === undefined) setInternalOpen(newState);
    onToggle?.(newState);

    // 스크롤은 레이아웃 확정 후 실행
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const btn = buttonRef.current;
        const panel = contentRef.current;
        if (!btn || !panel) return;

        const rect = buttonRef.current.getBoundingClientRect(); // 뷰포트 위치
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (!isVisible) {
          btn.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }

        if (newState) {
          // 열릴 때 : 중앙
          if (!isVisible) {
            window.scrollTo({
              top: getScrollTarget(panel, window.innerHeight / 2),
              behavior: 'smooth'
            });
          } else {
            // 닫힐 때 :

            if (!isVisible) {
              const y = getScrollTarget(btn, window.innerHeight / 2);
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }
        }
      });
    });
  };

  return (
    <div className={clsx(containerClassName, 'rounded-xl overflow-hidden')}>
      {/* 헤더 */}
      <button
        id={`header-${id}`}
        type="button"
        aria-expanded={open}
        onClick={toggleAccordion}
        className={clsx('w-full flex justify-between items-center')}
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

      {/* 내용 */}
      <div
        id={`content-${id}`}
        role="region"
        aria-labelledby={`header-${id}`}
        className={clsx(
          'transition-all duration-300',
          'overflow-hidden',
          'bg-white'
        )}
        style={{ maxHeight }}
        ref={contentRef}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
