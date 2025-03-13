'use client';

import SearchIcon from '@/components/icons/SearchIcon';

const CustomerHeader = () => {
  return (
    <header className="gap-6 flex flex-col justify-center items-center">
      <div className="bg-primary-70 w-full py-6 px-4 mt-16 md:mt-0 md:p-16 flex flex-col items-center justify-center">
        <p className="text-primary-10 text-xl md:text-3xl font-semibold md:mt-14">
          향그리움 고객센터
        </p>
        <p className="text-primary-10 text-base md:text-xl font-semibold mt-1">
          어떤 도움이 필요하신가요?
        </p>

        {/* 검색창 */}
        <div className="relative mt-6 w-full max-w-[343px] md:max-w-[813px]">
          <input
            type="text"
            placeholder="검색을 통해 원하는 정보를 찾아보세요"
            className="placeholder:text-label-assistive border border-primary-20 bg-white rounded-[6px] py-2 px-3 pr-6 md:pr-10 w-full focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <SearchIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
