import { getAddressesInServerComponent } from '@/hooks/deliveryAddress/getAddresses';

import { AllAddresses } from '@/types/deliveryAddress';

import NoList from '@/components/common/NoList';
import AddNewAddressButton from './_components/AddNewAddressButton';
import AddressesList from './_components/AddressesList';

const DeliveryAddressManagement = async () => {
  const allAddresses: AllAddresses = await getAddressesInServerComponent();
  const { defaultAddress, addresses } = allAddresses;

  const hasNoDefaultAddress: boolean = defaultAddress === null;
  const hasNoAddresses: boolean = hasNoDefaultAddress && addresses === null;

  //TODO defaultAddress, addresses를 하나의 배열로 prop 넘기기
  console.log(allAddresses);
  return (
    <>
      {hasNoAddresses ? (
        <NoList
          message={['등록된 배송지가 없어요', '새 배송지를 추가해 주세요.']}
        />
      ) : (
        <div className="max-w-md mx-auto flex flex-col p-4 bg-normal">
          <AddressesList initialData={allAddresses} />
        </div>
      )}
      <AddNewAddressButton />
    </>
  );
};

export default DeliveryAddressManagement;
