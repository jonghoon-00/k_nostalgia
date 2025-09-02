'use client';

import SearchIcon from '@/components/icons/SearchIcon';
import { XClose } from '@/components/icons/XClose';
import { ROUTES } from '@/constants';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CustomerHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 헤더 검색창에 URL의 q 값을 반영(FAQ에서 뒤로가기 동작 유지)
  const [input, setInput] = useState(searchParams.get('q') ?? '');
  useEffect(() => {
    setInput(searchParams.get('q') ?? '');
  }, [searchParams]);

  const faqPath = ROUTES.FAQ;
  const goFaq = (q: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const target = params.toString() ? `${faqPath}?${params}` : faqPath;

    // 현재 위치가 FAQ면 replace, 아니면 push
    pathname === faqPath ? router.replace(target) : router.push(target);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goFaq(input.trim());
  };

  const onReset = () => {
    setInput('');
    goFaq(''); // q search params 제거
  };

  return (
    <header
      className={clsx(
        'w-full',
        'flex flex-col items-center justify-center',
        'gap-6'
      )}
    >
      <div
        className={clsx(
          'w-full',
          'bg-primary-70',
          'py-6 px-4 md:p-16',
          'mt-16 md:mt-0',
          'flex flex-col items-center justify-center'
        )}
      >
        <p
          className={clsx(
            'text-primary-10',
            'font-semibold',
            'text-xl md:text-3xl',
            'md:mt-14'
          )}
        >
          향그리움 고객센터
        </p>
        <p
          className={clsx(
            'text-primary-10',
            'font-semibold',
            'text-base md:text-xl',
            'mt-1'
          )}
        >
          어떤 도움이 필요하신가요?
        </p>

        {/* 검색창 */}
        <form
          onSubmit={onSubmit}
          className={clsx(
            'relative',
            'mt-6',
            'w-full',
            'max-w-[343px] md:max-w-[813px]'
          )}
        >
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="검색을 통해 원하는 정보를 찾아보세요"
            className={clsx(
              'w-full',
              'border border-primary-20 bg-white rounded-[6px]',
              'py-2 px-3 pr-6',
              'placeholder:text-label-assistive',
              'focus:outline-none'
            )}
          />
          <div
            className={clsx(
              'absolute',
              'flex gap-1',
              'top-1/2 -translate-y-1/2 right-2',
              'transform'
            )}
          >
            {input.length > 0 && (
              <button type="button" onClick={onReset}>
                <XClose width={16} height={16} />
              </button>
            )}
            <button type="submit">
              <SearchIcon />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default CustomerHeader;
