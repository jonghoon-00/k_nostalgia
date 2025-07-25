'use client';

import { toast } from '@/components/ui/use-toast';
import clsx from 'clsx';
import React, { useState } from 'react';

import { useUser } from '@/hooks/useUser';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';

import { Address } from '@/types/deliveryAddress';

import { showCustomAlert } from '@/components/ui/SweetAlertComponent';
import {
  useDeleteAddress,
  useUpdateAddress
} from '@/hooks/deliveryAddress/useAddressesClient';
import AddressEditItem from './AddressEditItem';
import AddressItem from './AddressItem';

interface AddressListProps {
  initialData: Address[];
}

const AddressesList: React.FC<AddressListProps> = ({ initialData = [] }) => {
  const user = useUser();
  const userId = user.data?.id;

  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [addressesState, setAddressesState] = useState<Address[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { selectedAddressId } = useDeliveryStore((state) => ({
    selectedAddressId: state.selectedAddressId
  }));

  // 기본 배송지 / 일반 배송지 분리
  const defaultAddress = addressesState.find((a) => a.isDefault);
  const otherAddresses = addressesState.filter((a) => !a.isDefault);

  // 수정
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
  // 수정 상태 관리
  const startEdit = (id: string) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);
  const saveEdit = async (
    id: string,
    changes: Partial<Omit<Address, 'id'>>
  ) => {
    await handleUpdate(id, changes);
    setEditingId(null);
  };

  // 삭제
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
    <main
      className={clsx('mt-14 mb-16', 'overflow-auto', 'flex flex-col gap-4')}
    >
      {/* 기본 배송지 */}
      {defaultAddress && (
        <div className="flex cursor-pointer gap-2">
          <label htmlFor={`address-${defaultAddress.id}`} className="flex-1">
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
                isDefaultAddress={true}
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
          </label>
        </div>
      )}

      {/* 기타 배송지 */}
      {otherAddresses.map((address) => (
        <div key={address.id} className="flex cursor-pointer gap-2">
          <label htmlFor={`address-${address.id}`} className="flex-1">
            {editingId === address.id ? (
              <AddressEditItem
                address={address}
                onCancel={cancelEdit}
                onSave={saveEdit}
              />
            ) : (
              <AddressItem
                key={address.id}
                address={address}
                isDefaultAddress={false}
                updateDeliveryAddress={(e) => {
                  e.stopPropagation();
                  startEdit(address.id);
                }}
                deleteDeliveryAddress={(e) => {
                  e.stopPropagation();
                  handleDelete(address.id);
                }}
                selectedAddressId={selectedAddressId}
              />
            )}
          </label>
        </div>
      ))}
    </main>
  );
};

export default AddressesList;
