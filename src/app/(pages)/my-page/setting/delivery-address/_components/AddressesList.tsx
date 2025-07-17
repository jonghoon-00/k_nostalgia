'use client';

import { showCustomAlert } from '@/components/ui/SweetAlertComponent';
import { toast } from '@/components/ui/use-toast';
import {
  useDeleteAddress,
  useUpdateAddress
} from '@/hooks/deliveryAddress/useAddressesClient';
import { useUser } from '@/hooks/useUser';
import { Address } from '@/types/deliveryAddress';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';
import { useState } from 'react';
import AddressItem from './AddressItem';

interface Props {
  initialData: Address[];
}

const AddressesList = ({ initialData = [] }: Props) => {
  const user = useUser();
  const userId = user.data?.id;

  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [addressesState, setAddressesState] = useState<Address[]>(initialData);

  const { selectedAddressId } = useDeliveryStore((state) => ({
    selectedAddressId: state.selectedAddressId
  }));

  // 기본 배송지 / 일반 배송지 분리
  const defaultAddress = addressesState.find((a) => a.isDefault);
  const otherAddresses = addressesState.filter((a) => !a.isDefault);

  //TODO 배송지 수정
  const handleUpdate = async (
    addressId: string,
    changes: Partial<Omit<Address, 'id'>>
  ) => {
    try {
      await updateAddress(addressId, userId as string, changes);
      setAddressesState((prev) => {
        let updated = prev.map((a) =>
          a.id === addressId ? { ...a, ...changes } : a
        );
        if (changes.isDefault) {
          updated = updated.map((a) => ({
            ...a,
            isDefault: a.id === addressId
          }));
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
      toast({
        description: '배송지 수정에 실패했습니다.'
      });
    }
  };

  //TODO 배송지 삭제
  const handleDelete = async (addressId: string) => {
    showCustomAlert({
      title: '배송지 삭제',
      message: '정말 이 배송지를 삭제하시겠습니까?',
      confirmButtonText: '삭제하기',
      cancelButtonText: '취소',
      onConfirm: async () => {
        try {
          await deleteAddress(addressId, userId as string);
          setAddressesState((prev) => {
            const filtered = prev.filter((a) => a.id !== addressId);
            if (!filtered.some((a) => a.isDefault) && filtered.length > 0) {
              filtered[0].isDefault = true;
            }
            return filtered;
          });
        } catch (err) {
          console.error(err);
          toast({
            description: '배송지 삭제에 실패했습니다.'
          });
        }
      }
    });
  };

  return (
    <>
      <main className="mt-14 mb-16 overflow-auto flex flex-col gap-4">
        <div className="flex cursor-pointer gap-2">
          <label htmlFor={`address-${defaultAddress?.id}`} className="flex-1">
            <AddressItem
              key={defaultAddress?.id}
              address={defaultAddress as Address}
              isDefaultAddress={true}
              updateDeliveryAddress={(e) => {
                e.stopPropagation();
                handleUpdate(defaultAddress?.id as string, { isDefault: true });
              }}
              deleteDeliveryAddress={(e) => {
                e.stopPropagation();
                handleDelete(defaultAddress?.id as string);
              }}
              selectedAddressId={selectedAddressId}
            />
          </label>
        </div>

        {otherAddresses.map((address) => (
          <div key={address.id} className="flex cursor-pointer gap-2">
            <label htmlFor={`address-${address.id}`} className="flex-1">
              <AddressItem
                address={address}
                isDefaultAddress={false}
                updateDeliveryAddress={(e) => {
                  e.stopPropagation();
                  handleUpdate(address?.id as string, {
                    isDefault: true
                  });
                }}
                deleteDeliveryAddress={(e) => {
                  e.stopPropagation();
                  handleDelete(address?.id as string);
                }}
                selectedAddressId={selectedAddressId}
              />
            </label>
          </div>
        ))}
      </main>
    </>
  );
};

export default AddressesList;
