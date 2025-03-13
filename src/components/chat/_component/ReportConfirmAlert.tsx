'use client';

import React from 'react';
import { CgClose } from 'react-icons/cg';

interface ReportAlertProps {
  handleReport: () => void;
  // cancelReport: () => void;
}

const ReportConfirmAlert = (
  {
  handleReport,
//   cancelReport
}: ReportAlertProps
) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div className="relative w-[310px] h-[210px] bg-normal border border-[#E0E0E0] shadow-custom pt-14 px-4 pb-6 rounded-2xl md:w-[330px] md:h-[220px]">
        <button
          className="absolute top-2 right-2 text-[#959595]"
          // onClick={cancelReport}
        >
          <CgClose className="h-7 w-7 p-1" />
        </button>
        <div className="text-label-strong text-center text-xl leading-7 font-semibold mb-1">
          해당 사용자를 신고하시겠어요?
        </div>
        <div className="text-label-assistive text-center text-sm font-medium leading-[25.6px] mb-8 md:text-[15px]">
          허위 신고시 서비스 사용이 제한될 수 있습니다.
        </div>
        <div className="flex justify-around">
          <button
            className="bg-[#F2F2F2] rounded-xl text-status-negative text-base text-center font-semibold leading-[22.4px] px-4 py-3 text-nowrap w-[135px] md:w-[143px]"
            onClick={handleReport}
          >
            신고하기
          </button>
          <button
            className="bg-primary-20 rounded-xl text-label-light text-base text-center font-semibold leading-[22.4px] px-4 py-3 text-nowrap w-[135px] md:w-[143px]"
            // onClick={cancelReport}
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmAlert;
