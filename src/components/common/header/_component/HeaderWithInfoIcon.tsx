// 백버튼, info 아이콘 + 툴팁 토글링이 들어있는 앱 헤더

'use client';

import { BackButton } from '@/components/icons/BackButton';
import InfoIcon from '@/components/icons/InfoIcon';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  //툴팁 내부 텍스트. 줄바꿈 단위로 나눠서 배열에 넣을 것
  toolTipContentArray: string[];
  //info 아이콘 하이라이팅 여부
  isIncludeIconHighlighting: boolean;
};

const HeaderWithInfoIcon = ({
  toolTipContentArray,
  isIncludeIconHighlighting
}: Props) => {
  const router = useRouter();
  const pathName = usePathname();

  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [iconHighLight, setIconHighLight] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTooltipToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isIncludeIconHighlighting) {
      localStorage.setItem(`isVisit-${pathName}`, 'true');
    }

    e.stopPropagation();

    if (intervalRef.current) {
      setIconHighLight(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTooltipVisible((prev) => !prev);
  };

  const handleClickOutsideInfoIcon = () => {
    setTooltipVisible(false);
  };

  useEffect(() => {
    if (isTooltipVisible) {
      document.addEventListener('click', handleClickOutsideInfoIcon);
    }
    return () => {
      document.removeEventListener('click', handleClickOutsideInfoIcon);
    };
  }, [isTooltipVisible]);

  // 하이라이팅 로직
  useEffect(() => {
    if (isIncludeIconHighlighting) {
      const isVisit = localStorage.getItem(`isVisit-${pathName}`);
      if (!isVisit) {
        let blinkCount = 0;
        intervalRef.current = setInterval(() => {
          blinkCount++;
          setIconHighLight((prev) => !prev);
          if (blinkCount === 10) {
            if (intervalRef.current) {
              setIconHighLight(false);
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 1000);

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
      }
    }
  }, [isIncludeIconHighlighting]);

  return (
    // 앱헤더
    <header className="flex fixed w-full justify-between items-center pt-5 pb-2 mb-4 m-1 md:hidden">
      {/* 뒤로가기 버튼 */}
      <button onClick={() => router.back()} className="p-1">
        <BackButton />
      </button>

      <h1 className="text-lg font-semibold">주문/결제</h1>

      {/* Info 아이콘 */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div
            className="text-white rounded-lg focus:outline-none cursor-pointer p-1"
            onClick={handleTooltipToggle} // 클릭 시 툴팁 상태 토글
          >
            <InfoIcon
              color={iconHighLight ? '#9C6D2E' : '#959595'}
              width="28"
              height="28"
            />
          </div>

          {/* 툴팁 */}
          {isTooltipVisible && (
            <div className="absolute top-full transform -translate-x-1/2 mt-3 right-[-9rem]">
              <div className="relative bg-[#9C6D2E] p-4 w-[274px] text-white text-sm rounded-[8px] shadow-lg select-none ">
                {toolTipContentArray.map((line, index) => (
                  <div key={index}>
                    {line} <br />
                  </div>
                ))}
                {/* 화살표 */}
                <div
                  className="absolute top-[-0.4rem] right-[2%] transform -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #9C6D2E'
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderWithInfoIcon;
