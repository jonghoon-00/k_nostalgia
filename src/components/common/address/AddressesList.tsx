// AddressesList.tsx
'use client';

import { toast } from '@/components/ui/use-toast';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useUser } from '@/hooks/useUser';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';

import { Address } from '@/types/deliveryAddress';

import RadioGroup from '@/components/ui/RadioGroup';
import { showCustomAlert } from '@/components/ui/SweetAlertComponent';
import {
  useDeleteAddress,
  useUpdateAddress
} from '@/hooks/deliveryAddress/useAddressesClient';
import { useModalStore } from '@/zustand/useModalStore';
import AddressEditItem from './AddressEditItem';
import AddressItem from './AddressItem';

interface AddressListProps {
  initialData: Address[];
  isSelecting?: boolean;
}

const AddressesList: React.FC<AddressListProps> = ({
  initialData = [],
  isSelecting = false
}) => {
  const user = useUser();
  const userId = user.data?.id;

  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [addressesState, setAddressesState] = useState<Address[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedAddressId = useDeliveryStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useDeliveryStore((s) => s.setSelectedAddressId);

  const closeModal = useModalStore((s) => s.close);

  useEffect(() => {
    setAddressesState(initialData);
  }, [initialData]);

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
      toast({ description: '배송지 수정에 실패했습니다.' });
    }
  };

  const startEdit = (id: string) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (
    id: string,
    changes: Partial<Omit<Address, 'id'>>
  ) => {
    await handleUpdate(id, changes);
    setEditingId(null);
  };

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
          toast({ description: '배송지가 삭제되었습니다.' });
        } catch (err) {
          console.error(err);
          toast({ description: '배송지 삭제에 실패했습니다.' });
        }
      }
    });
  };

  const defaultAddress = addressesState.find((a) => a.isDefault);
  const otherAddresses = addressesState.filter((a) => !a.isDefault);

  // 선택 모드
  if (isSelecting) {
    const options = addressesState.map((a) => ({
      value: a.id,
      label: (
        <AddressItem
          address={a}
          isDefaultAddress={a.isDefault}
          updateDeliveryAddress={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          deleteDeliveryAddress={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          selectedAddressId={selectedAddressId}
          isSelecting
        />
      )
    }));

    return (
      <main className={clsx('flex flex-col gap-4', 'w-full')}>
        <RadioGroup
          name="deliveryAddress"
          options={options}
          selectedValue={selectedAddressId}
          onChange={(id) => {
            setSelectedAddressId(id);
            closeModal();
          }}
        />
      </main>
    );
  }

  // 일반 모드
  return (
    <main className={clsx('flex flex-col gap-4', 'w-full', 'mt-14')}>
      {defaultAddress && (
        <div className="w-full">
          {editingId === defaultAddress.id ? (
            <AddressEditItem
              address={defaultAddress}
              onCancel={cancelEdit}
              onSave={saveEdit}
            />
          ) : (
            <AddressItem
              key={defaultAddress.id}
              address={defaultAddress}
              isDefaultAddress
              updateDeliveryAddress={(e) => {
                e.stopPropagation();
                startEdit(defaultAddress.id);
              }}
              deleteDeliveryAddress={(e) => {
                e.stopPropagation();
                handleDelete(defaultAddress.id);
              }}
              selectedAddressId={selectedAddressId}
            />
          )}
        </div>
      )}

      {otherAddresses.map((addr) => (
        <div key={addr.id} className="w-full">
          {editingId === addr.id ? (
            <AddressEditItem
              address={addr}
              onCancel={cancelEdit}
              onSave={saveEdit}
            />
          ) : (
            <AddressItem
              key={addr.id}
              address={addr}
              isDefaultAddress={false}
              updateDeliveryAddress={(e) => {
                e.stopPropagation();
                startEdit(addr.id);
              }}
              deleteDeliveryAddress={(e) => {
                e.stopPropagation();
                handleDelete(addr.id);
              }}
              selectedAddressId={selectedAddressId}
            />
          )}
        </div>
      ))}
    </main>
  );
};

export default AddressesList;
