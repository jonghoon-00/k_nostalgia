import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import KNostalgiaIcon2 from '../icons/KNostalgiaIcon2';

const Footer = () => {
  return (
    <div className="h-[108px] bg-normal border-t border-[#C8C8C8] z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center mt-[22px] md:px-3 xl:px-0">
        <div className="cursor-pointer">
          <Link
            href="https://github.com/Chasyuss/K-nostalgia"
            target="_blank"
            className="flex"
          >
            <Image
              src="/image/GitHub.png"
              alt="깃허브"
              width={36}
              height={36}
              className="h-9 w-9 p-[2px]"
            />
            <div className="text-base font-medium leading-[25.6px] flex items-center justify-center ml-2 text-label-normal">
              A05_GitHub
            </div>
          </Link>
        </div>
        <div className="w-[59px] h-[64px]">
          <KNostalgiaIcon2 width={58.182} height={64} />
        </div>
        <div className="text-base font-medium leading-[25.6px] text-label-normal text-nowrap">
          ⓒ 이혜원. All rights reserved
        </div>
      </div>
    </div>
  );
};

export default Footer;
