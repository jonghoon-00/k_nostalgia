'use client';

import React from 'react';
import { CgClose } from 'react-icons/cg';


const StopReportAlert = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div className="relative w-[310px] h-[210px] bg-normal border border-[#E0E0E0] shadow-custom pt-14 px-4 pb-6 rounded-2xl md:w-[330px] md:h-[220px]">
        <button
          className="absolute top-2 right-2 text-[#959595]"
        //   onClick={cancelReport}
        >
          <CgClose className="h-7 w-7 p-1" />
        </button>
        <div className="text-label-strong text-center text-xl leading-7 font-semibold mb-1">
          신고하기를 중단하시겠어요?
        </div>
        <div className="text-label-assistive text-center text-sm font-medium leading-[25.6px] mb-8 md:text-[15px]">
          작성 중인 신고 내용은 저장되지 않아요
        </div>
        <div className="flex justify-around">
          <button
            className="bg-[#F2F2F2] rounded-xl text-status-negative text-base text-center font-semibold leading-[22.4px] px-4 py-3 text-nowrap w-[135px] md:w-[143px]"
            // onClick={handleReport}
          >
            중단하기
          </button>
          <button
            className="bg-primary-20 rounded-xl text-label-light text-base text-center font-semibold leading-[22.4px] px-4 py-3 text-nowrap w-[135px] md:w-[143px]"
            // onClick={cancelReport}
          >
            계속 작성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopReportAlert;
