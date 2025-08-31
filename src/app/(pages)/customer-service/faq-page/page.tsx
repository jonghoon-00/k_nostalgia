'use client';
import DownButton from '@/components/icons/DownButton';
import UpButton from '@/components/icons/UpButton';
import React, { useState } from 'react';
import CustomerEmail from '../_components/CustomerEmail';

const Announcement: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="border-b border-[#E0E0E0]">
        <div className="md:mb-7 md:text-label-strong md:text-2xl md:font-semibold mt-10 md:mt-14 md:flex hidden">
          {' '}
          자주 묻는 질문{' '}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-primary-10 font-semibold text-xl"> Q </span>
            <span className="text-primary-20 text-base font-normal">
              [ 판매 등록 ]
            </span>
            <span className="text-label-strong font-normal text-base">
              특산물 판매자 등록 요청은 어떻게 할 수 있나요?
            </span>
          </div>

          <button className="cursor-pointer" onClick={toggleDropdown}>
            {isOpen ? <UpButton /> : <DownButton />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-3 md:mt-8 text-label-strong text-sm font-normal space-y-5 md:flex md:flex-col md:px-11 md:justify-center md:items-start md:w-full">
            <p>
              특산물 판매자 요청은 고객센터 메뉴 판매자 등록 요청을 눌러
              구글폼을 제출해 주시면 됩니다.
            </p>
            <p>
              해당 폼 제출 후 영업일 기존 3-5일 이내로 향그리움 팀에서 작성된
              메일로 답변 드리겠습니다.
            </p>
            <p>
              빠른 확인을 원하신다면 특산물 담당 관리자 이메일로 문의주시면
              빠르게 도와드리겠습니다.
            </p>

            <br />
            <p className="text-primary-20 font-normal underline">
              {' '}
              특산물 담당 관리자 이메일 (클릭){' '}
            </p>
          </div>
        )}
      </div>
      <CustomerEmail />
    </div>
  );
};

export default Announcement;
