// 배송지 변경 버튼

// 모바일 사이즈 : 배송지 변경 페이지로 이동
// 데스크탑 사이즈 : 배송지 변경 모달

//TODO : 데스크탑 사이즈에서 모달 띄우기(컴포넌트들 가져오기)

'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
  selectedAddressId: string;
}

const AddressChangeButton: React.FC<Props> = ({ selectedAddressId }) => {
  //TODO selectAddressId 가 빈 문자열일 때 처리 추가
  const router = useRouter();
  const ADDRESS_LIST_PAGE = '/my-page/setting/delivery-address';

  const handleClick = () => {
    // if (isMobile) {
    router.push(
      `${ADDRESS_LIST_PAGE}?from=payment&addressId=${selectedAddressId}`
    );
    // }

    // if (isDesktop) {
    //   setIsModalOpen(true);
    // }
  };

  return (
    <>
      <button
        className="text-xs font-normal text-[#79746D] border-[1px] border-[#959595] rounded-[6px] py-1 px-2"
        onClick={handleClick}
      >
        변경
      </button>
      {/* TODO 모달 들어갈 자리 */}
    </>
  );
};

export default AddressChangeButton;
