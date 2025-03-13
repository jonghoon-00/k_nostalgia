'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const AddNewAddressButton = () => {
  const isFromPayment = useSearchParams().get('from');
  console.log(isFromPayment);
  return (
    <div
      className={`${
        isFromPayment && 'hidden'
      } p-4 flex justify-center bg-white shadow-md fixed bottom-0 w-full`}
    >
      <Link
        href={'/my-page/setting/delivery-address/add-new'}
        className="w-full"
      >
        <button className="w-full py-3 bg-primary-20 text-white cursor-pointer rounded-[8px]">
          새 배송지 추가
        </button>
      </Link>
    </div>
  );
};

export default AddNewAddressButton;
