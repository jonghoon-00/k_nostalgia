'use client';

import Image from 'next/image';
import React from 'react';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface LinkButton {
  href: string;
  label: string;
}
interface Props {
  message: string | string[];
  linkButton?: LinkButton;
}
function normalizeHref(href: string) {
  if (!href.startsWith('/')) return `/${href}`;
  return href;
}

/**
 * @description 리스트가 없을 때 사용하는 컴포넌트
 * @param {string | string[]} message - 띄울 텍스트. 2줄 이상이라면 배열로
 * @param {Object} linkButton - 이동 버튼 정보 ({ href, label })
 */
const NoList: React.FC<Props> = ({ message, linkButton }) => {
  const router = useRouter();
  return (
    <figure
      className={clsx(
        'w-full',
        'min-h-[calc(100vh-150px)] overflow-hidden',
        'md:min-h-[min(100vh,100%)]',
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
      {linkButton && (
        <button
          type="button"
          onClick={() => router.push(normalizeHref(linkButton.href))}
          className={clsx(
            'h-[48px]',
            'px-[32px] py-[12px] mt-[12px]',
            'rounded-[12px]',
            'text-white font-semibold leading-[140%]',
            'bg-[#9C6D2E]'
          )}
        >
          {linkButton.label}
        </button>
      )}
    </figure>
  );
};

export default NoList;
