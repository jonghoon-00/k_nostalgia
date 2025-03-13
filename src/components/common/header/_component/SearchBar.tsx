'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import React, { act, useCallback, useEffect, useRef, useState } from 'react';
import SearchRecommendations from './SearchRecommendations';
import { GoSearch } from 'react-icons/go';
import { Tables } from '@/types/supabase';
import useDebounce from '@/hooks/useDebounce';
import HomeSearchResult from './HomeSearchResult';
import MarketSearchResult from './MarketSearchResult';
import LocalFoodSearchResult from './LocalFoodSearchResults';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface SearchBarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type Market = Tables<'markets'>;
type LocalFood = Tables<'local_food'>;

interface SearchPageResults {
  name: string | null;
  link: string;
}

const SearchBar = ({ isOpen, setIsOpen }: SearchBarProps) => {
  const pathName = usePathname();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [response, setResponse] = useState<
    (Tables<'local_food'> | Tables<'markets'>)[] | null
  >(null);
  const [results, setResults] = useState<SearchPageResults[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();

  const marketSide = pathName === '/market' || pathName.startsWith('/market');
  const localFoodSide =
    pathName === '/local-food' || pathName.startsWith('/local-food/');
  const homeSide = pathName === '/';

  const handleSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
      .normalize('NFKC')
      .toLowerCase()
      .trim();

    setSearchTerm(event.target.value);

    if (event.target.value.trim() === '') {
      setResponse(null);
      setActiveIndex(0);
    }
    // 검색어 길이 제한 및 이스터애그'-'
    if (event.target.value.length >= 20) {
      Swal.fire({
        title: '20자 미만으로 써주세어흥!',
        html: `
        <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">시장이랑 특산물은 20자 이상이 없다어흥!</div>
      `,
        confirmButtonColor: '#f2f2f2',
        confirmButtonText: '네! 알겠어흥!',
        customClass: {
          title: 'text-xl mt-10 md:mb-[8px]',
          popup: 'rounded-[16px]',
          actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
          confirmButton:
            'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0'
        }
      });
      setSearchTerm('');
      return;
    } else if (inputValue === '향그리움'.trim()) {
      Swal.fire({
        title: '향그리움에 오신 것을 환영합어흥!',
        html: `
        <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">더 많은 사랑 부탁드립어흥!</div>
      `,
        confirmButtonColor: '#f2f2f2',
        confirmButtonText: '네! 알겠어흥!',
        customClass: {
          title: 'text-xl mt-10 md:mb-[8px]',
          popup: 'rounded-[16px]',
          actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
          confirmButton:
            'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0'
        }
      });
      return;
    } else if (
      inputValue === '오조사마'.trim() ||
      inputValue === '5JOSAMA'.normalize('NFKC').toLowerCase().trim() ||
      inputValue === 'OJOSAMA'.normalize('NFKC').toLowerCase().trim()
    ) {
      Swal.fire({
        title: '오조마사를... 검색하셨나요?',
        html: `
        <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">제출은하셔야죠아가씨조🕴️🕶️ 입니다</div>
      `,
        confirmButtonColor: '#f2f2f2',
        confirmButtonText: '🕶️네! 알겠습니다!🕶️',
        customClass: {
          title: 'text-xl mt-10 md:mb-[8px]',
          popup: 'rounded-[16px]',
          actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
          confirmButton:
            'text-status-negative py-3 px-4 rounded-[12px] w-[170px] m-0'
        }
      });
      return;
    }
  };

  // 검색어 초기화
  useEffect(() => {
    setSearchTerm('');
  }, [pathName]);

  //검색어 전송 분기 처리
  const submitSearchTerm = useCallback(async () => {
    if (debounceSearchTerm.trim() === '') {
      setResponse([]);
      setActiveIndex(-1);
      return;
    }

    // 'markets' or 'local-food', home일 땐 빈 문자열
    const tableValue = marketSide
      ? 'markets'
      : localFoodSide
      ? 'local_food'
      : '';

    try {
      const response = await fetch(
        tableValue ? '/api/search' : '/api/search/home',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          // 공백 제거
          body: JSON.stringify({
            searchValue: debounceSearchTerm.replace(/\s+/g, '').trim(),
            tableValue
          })
        }
      );
      const data = await response.json();
      setResponse(data);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur();
          inputRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.log(error);
    }
  }, [debounceSearchTerm, localFoodSide, marketSide]);

  // 계속해서 작동
  useEffect(() => {
    if (debounceSearchTerm) {
      submitSearchTerm();
    }
  }, [debounceSearchTerm, submitSearchTerm]);

  // 키보드 키로 검색어 이동
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (response === null || response.length === 0) return;

    // 위 화살표
    if (event.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev <= 0 ? prev : prev - 1));
    }
    // 아래 화살표
    else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev >= response.length - 1 ? prev : prev + 1));
    }
    // 엔터
    else if (event.key === 'Enter') {
      // 방어 코딩
      if (response && response.length > 0) {
        // 0일 때 첫번째 항목 선택
        const newActiveIndex = activeIndex === -1 ? 0 : activeIndex;
        LinkToItems(response[newActiveIndex]);
      }
    }
    // 검색어 제출
    submitSearchTerm();
  };

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      setSearchTerm('');
    }
  }, [isOpen]);

  // 최근 검색어 저장- 로컬 스토리지
  const recentResults = useCallback((NewItem: SearchPageResults) => {
    //이미 저장된 검색어
    const savePageResults = localStorage.getItem('recentPageResults');
    let currentPageResults: SearchPageResults[] = [];

    if (savePageResults) {
      const updatePageResults = JSON.parse(savePageResults);

      //같은 거 삭제
      currentPageResults = updatePageResults?.filter(
        (item: SearchPageResults) => item.name !== NewItem.name
      );

      //배열 3개로 유지 + 최신 바로 앞으로 넣기
      currentPageResults = [NewItem, ...currentPageResults];

      if (currentPageResults.length > 3) {
        currentPageResults = currentPageResults.slice(0, 3);
      }
    } else {
      currentPageResults = [NewItem];
    }
    localStorage.setItem(
      'recentPageResults',
      JSON.stringify(currentPageResults)
    );
    setResults(currentPageResults);
  }, []);

  // 엔터로 이동하는 함수 + 최근 검색어 저장
  const LinkToItems = (item: Market | LocalFood) => {
    let searchResults: SearchPageResults | null = null;
    let redirectUrl: string | null = null;

    if ('시장명' in item && 'id' in item) {
      searchResults = {
        name: item.시장명,
        link: `/market/${item.id}`
      };
      redirectUrl = searchResults.link;
    } else if ('food_name' in item && 'product_id' in item) {
      searchResults = {
        name: item.food_name,
        link: `/local-food/${item.product_id}`
      };
      redirectUrl = searchResults.link;
    }

    if (searchResults) {
      recentResults(searchResults);
    }

    if (redirectUrl) {
      router.push(redirectUrl);
    }

    setIsOpen(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const savedResults = localStorage.getItem('recentPageResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="top"
        className="bg-normal rounded-b-[12px] md:w-[768px] md:mx-auto lg:w-[990px]"
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="w-full relative flex items-center">
          <Input
            ref={inputRef}
            placeholder={
              marketSide
                ? '시장을 검색해주세요'
                : localFoodSide
                ? '특산물을 검색해주세요'
                : homeSide
                ? '시장과 특산물을 검색해주세요'
                : '이 페이지 검색은 준비 중이에요'
            }
            value={searchTerm}
            onChange={handleSearchTerm}
            onKeyDown={handleKeyDown}
            disabled={!marketSide && !localFoodSide && !homeSide}
            className={`pr-10 placeholder:text-label-alternative text-base bg-[#FEFEFE] ${
              searchTerm.trim() === ''
                ? 'border-primary-30 rounded-[6px]'
                : 'border-label-assistive border-b-0 rounded-t-[6px]'
            }`}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 flex items-center h-full"
            disabled={!marketSide && !localFoodSide && !homeSide}
            aria-label="검색"
            style={{ border: 'none', background: 'none' }}
            onClick={submitSearchTerm}
          >
            <GoSearch className="w-[22px] h-[22px]" />
          </Button>
        </div>

        {/* 검색+최근 하단 둥글게, 검색되면 보이기 */}
        <div
          className={`flex flex-col border border-t-0 border-label-assistive rounded-b-[6px] bg-[#FEFEFE] ${
            searchTerm.trim() === '' ? 'hidden' : 'block'
          }`}
        >
          {/* 검색 결과 있을 경우 */}
          {response !== null && response.length > 0 && (
            <>
              {homeSide && (
                <HomeSearchResult
                  response={response}
                  setIsOpen={setIsOpen}
                  activeIndex={activeIndex}
                />
              )}
              {marketSide && (
                <MarketSearchResult
                  response={response as Market[]}
                  setIsOpen={setIsOpen}
                  activeIndex={activeIndex}
                />
              )}
              {localFoodSide && (
                <LocalFoodSearchResult
                  response={response as LocalFood[]}
                  setIsOpen={setIsOpen}
                  activeIndex={activeIndex}
                />
              )}
            </>
          )}

          <div className="px-3 py-[6px] text-xs border-t border-label-assistive">
            최근 검색어
          </div>
          {results?.map((item, index) => (
            <Link href={item?.link} key={index}>
              <div className="cursor-pointer px-3 py-[6px] text-base hover:bg-[#F2F2F2]">
                {item.name}
              </div>
            </Link>
          ))}
        </div>

        {/* 검색 결과 없을 경우 검색창에서 보이는 것 X */}
        {response !== null && response.length === 0 && (
          <div className="text-left text-md text-label-alternative pt-5 px-2">
            검색 결과가 없습니다.
            <p>
              <span className="font-semibold">
                {marketSide
                  ? '시장'
                  : localFoodSide
                  ? '특산물'
                  : '시장과 특산물'}
              </span>
              에 대해 검색해주세요!
            </p>
          </div>
        )}

        {/* 검색하지 않을 때만 보여주기 */}
        {searchTerm.trim() === '' && (
          <SearchRecommendations setIsOpen={setIsOpen} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SearchBar;
