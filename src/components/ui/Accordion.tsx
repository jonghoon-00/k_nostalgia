import React, { useState } from 'react';
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

  const toggleAccordion = () => {
    const newState = !open;
    setInternalOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div
      className={
        containerClassName ?? `border rounded-lg overflow-hidden shadow-sm`
      }
    >
      {/* 아코디언 헤더 */}
      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center"
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
      {open && <div className="bg-white">{children}</div>}
    </div>
  );
};

export default Accordion;
