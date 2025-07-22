import AddAddressForm from '@/components/common/address/AddAddressForm';
import InfoIcon from '@/components/icons/InfoIcon';

const AddNewAddress = () => {
  return (
    <>
      {/* 안내 메시지 */}
      <div className="w-full flex gap-1 justify-center items-center bg-[#F2F2F2] mt-16 px-4 py-3">
        <InfoIcon color="#959595" width="16" height="16" />
        <p className="text-xs text-gray-400 ">
          배송지에 따라 상품정보 및 배송유형이 달라질 수 있습니다.
        </p>
      </div>

      <main className="max-w-md mx-auto bg-normal p-4">
        {/* 배송지 입력 폼 */}
        <AddAddressForm />
      </main>
    </>
  );
};

export default AddNewAddress;
