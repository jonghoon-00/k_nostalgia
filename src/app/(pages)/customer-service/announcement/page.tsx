'use client';
import DownButton from '@/components/icons/DownButton';
import UpButton from '@/components/icons/UpButton';
import clsx from 'clsx';
import React, { useState } from 'react';
import CustomerEmail from '../_components/CustomerEmail';

const Announcement: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={clsx('flex items-center flex-col')}>
      <div className={clsx('w-full mx-auto', 'border-b border-[#E0E0E0]')}>
        <div
          className={clsx(
            'hidden md:flex',
            'text-label-strong text-2xl font-semibold',
            'mb-7'
          )}
        >
          {' '}
          공지사항{' '}
        </div>

        <div>
          <div
            className={clsx(
              'flex justify-between items-center',
              'cursor-pointer',
              'pl-6'
            )}
            onClick={toggleDropdown}
          >
            <div className={clsx('flex items-center', 'md:gap-6')}>
              <span
                className={clsx(
                  'text-primary-20 font-semibold',
                  'text-base font-normal'
                )}
              >
                [ 공지 ]
              </span>
              <span
                className={clsx(
                  'text-label-strong font-semibold',
                  'text-base font-normal'
                )}
              >
                회원가입 시 할인 쿠폰 발급 안내
              </span>
            </div>

            {/* 우측 날짜, 토글버튼 */}
            <div className={clsx('flex items-center', 'gap-6')}>
              <span
                className={clsx(
                  'hidden md:flex md:mt-0',
                  'text-label-assistive text-sm font-normal'
                )}
              >
                24.09.04
              </span>
              <button
                className={clsx(
                  'cursor-pointer rounded',
                  'border border-label-assistive',
                  'transition-transform duration-200',
                  isOpen ? 'rotate-180' : 'rotate-0 bg-primary-20'
                )}
              >
                {isOpen ? <UpButton /> : <DownButton color={'#F2F2F2'} />}
              </button>
            </div>
          </div>

          {/* 모바일에서만 보임 */}
          <div
            className={clsx(
              'md:hidden',
              'text-label-assistive text-sm font-normal mt-1'
            )}
          >
            24.09.04
          </div>

          {/* 펼친 내용 */}
          <div
            role="region"
            className={clsx(
              'space-y-5',
              'pl-[70px]',
              'text-label-strong text-sm font-normal',
              'grid transition-all duration-300 ease-in-out motion-reduce:transition-none',
              isOpen
                ? 'grid-rows-[1fr] opacity-100 pt-8'
                : 'grid-rows-[0fr] opacity-0'
            )}
          >
            <div
              className={clsx(
                'overflow-hidden space-y-5 pb-7 will-change-[grid-template-rows]'
              )}
            >
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
          </div>
        </div>
      </div>
      <CustomerEmail />
    </div>
  );
};

export default Announcement;
