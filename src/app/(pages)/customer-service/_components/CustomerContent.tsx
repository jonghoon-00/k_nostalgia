import TalkingIcon from '@/components/icons/TalkingIcon';
import React from 'react';
import CustomerCard from './CustomerCard';
import CancelUser from '../../my-page/_components/CancelUser';

const CustomerContent = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-6">
      <div className="flex items-center justify-between border border-primary-20 bg-primary-20 rounded-[6px] w-[343px] py-3 px-4">
        <div className="flex items-center">
          <TalkingIcon />
          <span className="ml-2 text-label-light text-base font-normal">
            회원가입 시 할인 쿠폰 발급 안내
          </span>
        </div>

        <span className="underline text-label-light font-normal">전체</span>
      </div>

      <CustomerCard />
      <CancelUser />
    </div>
  );
};

export default CustomerContent;
