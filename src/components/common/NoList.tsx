'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface Props {
  message: string | string[];
}

/**
 * @description 리스트가 없을 때 사용하는 컴포넌트
 * @param {string | string[]} message - 띄울 텍스트. 2줄 이상이라면 배열로
 */
const NoList: React.FC<Props> = ({ message }) => {
  return (
    <figure
      className={clsx(
        'w-full',
        // 부모 높이가 있을 땐 100%, 없으면 뷰포트 전체 높이
        'h-[min(100vh,100%)]',
        'flex flex-col justify-center items-center gap-4'
      )}
    >
      <Image
        src="/image/StateSad.png"
        alt="우는 호랑이"
        width={114}
        height={97}
        className="w-[114px] h-[97px]"
      />
      <figcaption
        className={clsx('text-[18px]', 'text-[#AFACA7]', 'font-medium')}
      >
        {typeof message === 'string' ? (
          <p>{message}</p>
        ) : (
          message.map((text, index) => (
            <p key={index} className="flex justify-center">
              {text}
            </p>
          ))
        )}
      </figcaption>
    </figure>
  );
};

export default NoList;
