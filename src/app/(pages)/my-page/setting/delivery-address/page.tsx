import NoList from '@/components/common/NoList';
import { getAddressesInServerComponent } from '@/hooks/deliveryAddress/useAddressesServer';
import AddNewAddressButton from './_components/AddNewAddressButton';
import AddressesList from './_components/AddressesList';

const DeliveryAddressManagement = async () => {
  const { addresses } = await getAddressesInServerComponent();
  const hasNoAddresses: boolean = addresses === null || addresses.length === 0;

  return (
    <>
      {hasNoAddresses ? (
        <NoList
          message={['등록된 배송지가 없어요', '새 배송지를 추가해 주세요.']}
        />
      ) : (
        <div className="max-w-md mx-auto flex flex-col p-4 bg-normal">
          <AddressesList initialData={addresses} />
        </div>
      )}
      <AddNewAddressButton />
    </>
  );
};

export default DeliveryAddressManagement;
