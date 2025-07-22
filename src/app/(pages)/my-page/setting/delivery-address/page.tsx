import { AddressesList } from '@/components/common/address';
import NoList from '@/components/common/NoList';
import { getAddressesInServerComponent } from '@/hooks/deliveryAddress/useAddressesServer';
import clsx from 'clsx';
import AddNewAddressButton from './_components/AddNewAddressButton';

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
        <div
          className={clsx(
            ' w-full',
            'mx-auto p-4',
            'flex flex-col',
            'bg-normal'
          )}
        >
          <AddressesList initialData={addresses} />
        </div>
      )}
      <AddNewAddressButton />
    </>
  );
};

export default DeliveryAddressManagement;
