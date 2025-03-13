'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GoSearch } from 'react-icons/go';
import { PiShoppingCartSimple } from 'react-icons/pi';
import SearchBar from './SearchBar';
import { useUserCartData } from '@/hooks/cart/useUserCartData';
import { CartIcon } from '@/components/icons/CartIcon';

interface ShowSearchCartProps {
  showSearch: boolean;
  showCart: boolean;
}

const ShowSearchCart = ({ showSearch, showCart }: ShowSearchCartProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { cartData } = useUserCartData(); //해당 유저 카트 데이터

  const handleSearchToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // 검색, 카트 있다 = 기본 / 검색만 있음 / 검색, 카트 둘 다 없음 = false
  if (showSearch && showCart) {
    return (
      <div className="flex p-1 gap-3 w-[76px] h-9">
        <SearchBar isOpen={isOpen} setIsOpen={setIsOpen} />
        <GoSearch
          className="cursor-pointer w-7 h-7"
          onClick={handleSearchToggle}
        />
        <div
          className="relative cursor-pointer"
          onClick={() => router.push('/cart')}
        >
          <CartIcon />
          <span className="absolute top-[-5px] right-[-10px] w-[18px] h-[18px] flex items-center font-normal justify-center text-xs bg-primary-strong text-label-light rounded-full">
            {cartData?.length}
          </span>
        </div>
      </div>
    );
  } else if (showSearch && !showCart) {
    return (
      <div className="flex p-1 gap-3 w-[76px] h-9">
        <div className="invisible w-7 h-7" />
        <SearchBar isOpen={isOpen} setIsOpen={setIsOpen} />
        <GoSearch
          className="cursor-pointer w-7 h-7"
          onClick={handleSearchToggle}
        />
      </div>
    );
  } else if (!showSearch && showCart) {
    return (
      <div className="flex p-1 gap-3 w-[76px] h-9">
        <div className="invisible w-7 h-7" />
        <div
          className="relative cursor-pointer"
          onClick={() => router.push('/cart')}
        >
          <CartIcon />
          <span className="absolute top-[-5px] right-[-10px] w-[18px] h-[18px] flex items-center font-normal justify-center text-xs bg-primary-strong text-label-light rounded-full">
            {cartData?.length}
          </span>
        </div>
      </div>
    );
  }
};

export default ShowSearchCart;
