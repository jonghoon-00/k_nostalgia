'use client';

import { toast } from '@/components/ui/use-toast';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { useUser } from '@/hooks/useUser';
import useDeliveryStore from '@/zustand/payment/useDeliveryStore';

import { Address } from '@/types/deliveryAddress';

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
  // Zustand - 모달 닫기 함수
  const onClose = useModalStore((state) => state.close);

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

  // 기본 배송지 / 일반 배송지 분리
  const defaultAddress = addressesState.find((a) => a.isDefault);
  const otherAddresses = addressesState.filter((a) => !a.isDefault);

  // 라디오 선택 핸들러 (선택 모드에서만 사용)
  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
    if (onClose) onClose(); // 선택 후 모달 닫기
  };

  return (
    <main
      className={clsx('mt-14 mb-16', 'overflow-auto', 'flex flex-col gap-4')}
    >
      {/* 기본 배송지 */}
      {defaultAddress && (
        //TODO 수정 버튼 제대로 작동하게 수정
        <div className="flex cursor-pointer gap-2">
          <label htmlFor={`address-${defaultAddress.id}`} className="flex-1">
            {editingId === defaultAddress.id && !isSelecting ? (
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
                radioOnChange={() => handleSelect(defaultAddress.id)}
              />
            )}
          </label>
        </div>
      )}

      {/* 기타 배송지 */}
      {otherAddresses.map((address) => (
        <div key={address.id} className="flex cursor-pointer gap-2">
          <label htmlFor={`address-${address.id}`} className="flex-1">
            {editingId === address.id && !isSelecting ? (
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
                radioOnChange={() => handleSelect(address.id)}
              />
            )}
          </label>
        </div>
      ))}
    </main>
  );
};

export default AddressesList;
