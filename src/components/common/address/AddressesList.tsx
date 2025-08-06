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
  isSelecting?: boolean; // 배송지 선택 모드 여부 (default: false)
}

/**
 * 배송지 목록 컴포넌트
 * @param {Address[]} initialData - 초기 배송지 목록 데이터
 * @param {boolean} [isSelecting=false] - 배송지 선택 모드 여부
 * @returns {JSX.Element}
 */
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

  // Zustand - 배송지
  const selectedAddressId = useDeliveryStore(
    (state) => state.selectedAddressId
  );
  const setSelectedAddressId = useDeliveryStore(
    (state) => state.setSelectedAddressId
  );
  // Zustand - 모달
  const closeModal = useModalStore((state) => state.close);

  useEffect(() => {
    setAddressesState(initialData);
  }, [initialData]);

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
          toast({ description: '배송지가 삭제되었습니다.' });
        } catch (err) {
          console.error(err);
          toast({
            description: '배송지 삭제에 실패했습니다.'
          });
        }
      }
    });
  };

  //---------------for ui rendering----------------

  const defaultAddress = addressesState.find((a) => a.isDefault);
  const otherAddresses = addressesState.filter((a) => !a.isDefault);

  const handleRadioChange = (id: string) => {
    setSelectedAddressId(id);
    closeModal();
  };

  const radioOptions = addressesState.map((a) => ({
    value: a.id,
    label: (
      <div className="flex flex-col">
        <span className="font-semibold">{a.addressName}</span>
        <span className="text-xs">
          {a.receiverName} / {a.phoneNumber}
        </span>
        <span className="text-xs">
          {a.baseAddress}
          {a.detailAddress && `, ${a.detailAddress}`}
        </span>
        {a.isDefault && (
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-gray-100 rounded">
            기본 배송지
          </span>
        )}
      </div>
    )
  }));

  if (isSelecting) {
    return (
      <main className={clsx('flex flex-col gap-4')}>
        <RadioGroup
          name="deliveryAddress"
          options={radioOptions}
          selectedValue={selectedAddressId}
          onChange={handleRadioChange}
          labelTextSize="15px"
        />
      </main>
    );
  }
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
                isSelecting={isSelecting}
              />
            )}
          </label>
        </div>
      )}

      {/* 기타 배송지 */}
      {otherAddresses.map((address) => (
        <div key={address.id} className={'flex gap-2'}>
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
                isSelecting={isSelecting}
              />
            )}
          </label>
        </div>
      ))}
    </main>
  );
};

export default AddressesList;
