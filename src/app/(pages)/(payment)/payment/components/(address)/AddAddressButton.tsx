import PlusIcon from '@/components/icons/PlusIcon';
import Link from 'next/link';

const AddAddressButton = () => {
  const ADD_ADDRESS_PAGE = '/my-page/setting/delivery-address/add-new';

  return (
    <Link href={`${ADD_ADDRESS_PAGE}?from=payment`} className="w-full">
      <button
        type="button"
        className="w-full flex justify-center items-center gap-2 px-4 py-3 h-10 border-[1px] border-primary-20 text-primary-20 rounded-[8px]"
      >
        <PlusIcon color={'#9C6D2E'} />
        <p className="font-semibold">배송지 추가하기</p>
      </button>
    </Link>
  );
};

export default AddAddressButton;
