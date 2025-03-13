'use client';

import useDeviceSize from '@/hooks/useDeviceSize';
import Image from 'next/image';
import React from 'react';
import { BsCheck2 } from 'react-icons/bs';

const WarningChat = ({
  setShowWarning
}: {
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isDesktop } = useDeviceSize();
  return (
    <div className="fixed inset-0 z-50 bg-normal rounded-2xl px-4 py-6  md:pt-16 md:px-10 md:pb-10 md:gap-5 md:justify-center md:flex md:flex-col md:items-center">
      <div className="flex px-4 flex-col justify-center items-center gap-8 self-stretch md-2 mt-5 mb-6 md:mb-10 md:mt-0">
        <Image
          src="/image/WargingTiger.png"
          width={isDesktop ? 216 : 72}
          height={isDesktop ? 166 : 60}
          alt="경고 호랑이"
          className="w-[216] h-[166]"
        />
        <div className="text-[#ED1B18] text-ceter text-nowrap text-xl font-semibold leading-7">
          채팅방 이용시 주의사항
        </div>
      </div>
      <ul
        className="text-label-strong text-sm font-normal mb-13 flex flex-col leading-[29.12px] mb:leading-[31.36px]"
        style={{ marginBottom: '60px' }}
      >
        <li>· 개인정보를 함부로 유출하지 않도록 주의해야 합니다.</li>
        <li>· 허위 정보를 기재해 다른 사용자에게 혼란을 주지 않아야 합니다.</li>
        <li>
          · 사생활 침해 또는 명예훼손, 저작권 침해 등 다른 이용자의 권리를
          침해하는 행위 또는 정보를 게재하지 않아야 합니다.
        </li>
        <li>· 다른 사용자를 비방하거나 욕설하는 행위는 금지됩니다.</li>
        <li>
          · 사용자 신고시, 신고 처리를 위해 대화 내용의 일부가 향그리움팀에
          전송됨에 동의하는 것으로 간주합니다.
        </li>
      </ul>
      <button
        className="w-full h-12 flex justify-center items-center py-3 px-4 gap-1 bg-primary-20 rounded-xl"
        onClick={() => setShowWarning(false)}
      >
        <div className="text-nowrap text-base font-semibold leading-[22.4px] text-label-light ml-1">
          확인했어요
        </div>
        <BsCheck2 className="w-6 h-6 shrink text-[#F2F2F2]" />
      </button>
    </div>
  );
};

export default WarningChat;
