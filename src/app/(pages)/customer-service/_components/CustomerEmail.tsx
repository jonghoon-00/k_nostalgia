import Image from 'next/image';
import React from 'react';

const CustomerEmail = () => {
  return (
    <div className="md:flex justify-center items-center flex-col hidden">
      <div className="flex flex-col justify-center items-center px-20 py-10 border rounded-xl bg-[#F2F2F2] mt-[52px] mb-20">
        <Image
          src="/image/Tiger_email.png"
          alt="이메일호랭"
          width={150}
          height={120}
          className="w-[150px] h-[120px] mb-6"
        />
        <p className="text-[18px] text-label-strong font-medium">
          원하는 문제를 해결하지 못했나요?
        </p>

        <p className="text-[14px] text-label-strong font-normal mt-2">
          향그리움팀 이메일을 통해 문의사항을 남겨주세요.
        </p>
        <p className="text-[14px] text-label-strong font-normal mt-2 mb-6">
          꼼꼼히 확인해 최대한 빠르게 답변드리겠습니다.
        </p>

        <div className="flex w-[170px] h-[40px] px-4 py-[10px] flex-col justify-center items-center border border-primary-20 rounded-[8px] text-primary-20 cursor-pointer">
          이메일로 문의하기
        </div>
      </div>
    </div>
  );
};

export default CustomerEmail;
