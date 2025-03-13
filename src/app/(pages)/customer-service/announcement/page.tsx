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
      <div className="px-4 py-6 border-b border-[#E0E0E0] md:max-w-[999px] mx-auto">
        <div className="hidden md:flex md:mt-14 text-label-strong font-semibold text-2xl mb-7">
          {' '}
          공지사항{' '}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center md:gap-6">
              <span className="text-primary-20 mr-2 text-base font-normal">
                [ 공지 ]
              </span>
              <span className="text-label-strong font-normal text-base">
                회원가입 시 할인 쿠폰 발급 안내
              </span>
            </div>

            <div className="text-label-assistive text-sm font-normal md:flex md:mt-0 hidden ml-auto">
              24.09.04
            </div>

            <button className="cursor-pointer md:ml-6" onClick={toggleDropdown}>
              {isOpen ? <UpButton /> : <DownButton />}
            </button>
          </div>

          <div className="text-label-assistive text-sm font-normal mt-1 md:hidden">
            24.09.04
          </div>

          {isOpen && (
            <div className="mt-3 text-label-strong text-sm font-normal space-y-5">
              <p>
                향그리움 회원가입 시 첫 구매 할인 쿠폰을 발급해 드리고 있습니다.
              </p>
              <p>
                해당 쿠폰은 특산물 첫 구매 시 1회에 거쳐 사용할 수 있으며, 상품
                구매 취소/환불 시 이용된 할인 쿠폰이 함께 복구 됩니다.
              </p>
              <p>
                관련하여 궁금하신 사항은 1:1 문의를 남겨주시면 최대한 빠르게
                답변드리겠습니다.
              </p>
              <p>감사합니다.</p>
            </div>
          )}
        </div>
      </div>
      <CustomerEmail />
    </div>
  );
};

export default Announcement;
