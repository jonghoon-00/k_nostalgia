import clsx from 'clsx';
import Link from 'next/link';

const AddNewAddressButton = () => {
  return (
    <div
      className={clsx(
        'bg-white md:bg-normal',
        'w-full',
        'p-4',
        'flex justify-center',
        'shadow-md md:shadow-none',
        'fixed bottom-0 md:static md:bottom-auto'
      )}
    >
      <Link href="/my-page/setting/delivery-address/add-new" className="w-full">
        <button
          className={clsx(
            'w-full py-3 rounded-[8px] cursor-pointer',
            // 색상 텍스트
            'bg-primary-20 text-white'
          )}
        >
          새 배송지 추가
        </button>
      </Link>
    </div>
  );
};

export default AddNewAddressButton;
