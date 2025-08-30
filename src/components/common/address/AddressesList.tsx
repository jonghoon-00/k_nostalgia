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
//components
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
  const userId = user.data?.id ?? null;

  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [addressesState, setAddressesState] = useState<Address[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedAddressId = useDeliveryStore((s) => s.selectedAddressId);
  const setSelectedAddressId = useDeliveryStore((s) => s.setSelectedAddressId);

  const closeModal = useModalStore((s) => s.close);

  useEffect(() => {
    setAddressesState(initialData);
    // 편집 중 대상이 새 데이터에 없으면 편집 종료
    if (editingId && !initialData.some((a) => a.id === editingId)) {
      setEditingId(null);
    }
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const startEdit = (id: string) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);

  const handleUpdate = async (
    addressId: string,
    changes: Partial<Omit<Address, 'id'>>
  ) => {
    if (!userId) {
      toast({ description: '로그인 후 이용해 주세요.' });
      return;
    }
    try {
      await updateAddress(addressId, userId, changes);
      setAddressesState((prev) => {
        // 값 갱신
        const updated = prev.map((a) =>
          a.id === addressId ? { ...a, ...changes } : a
        );
        // 기본 배송지 변경을 요청한 경우 반영(하나만 true)
        if (changes.isDefault) {
          return updated.map((a) => ({
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

  const saveEdit = async (
    id: string,
    changes: Partial<Omit<Address, 'id'>>
  ) => {
    await handleUpdate(id, changes);
    setEditingId(null);
  };

  const handleDelete = async (addressId: string) => {
    if (!userId) {
      toast({ description: '로그인 후 이용해 주세요.' });
      return;
    }
    showCustomAlert({
      title: '배송지 삭제',
      message: '정말 이 배송지를 삭제하시겠습니까?',
      confirmButtonText: '삭제하기',
      cancelButtonText: '취소',
      onConfirm: async () => {
        try {
          await deleteAddress(addressId, userId);
          setAddressesState((prev) => {
            const filtered = prev.filter((a) => a.id !== addressId);
            // 기본 배송지가 없으면 맨 앞 항목을 기본으로(불변성 유지)
            if (!filtered.some((a) => a.isDefault) && filtered.length > 0) {
              return filtered.map((a, i) => ({ ...a, isDefault: i === 0 }));
            }
            return filtered;
          });
          // 삭제 대상이 편집 중이었으면 편집 종료
          if (editingId === addressId) setEditingId(null);
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

  //선택 모드 (라디오 선택 + 편집 스왑)
  if (isSelecting) {
    const options = addressesState.map((a) => ({
      value: a.id,
      label:
        editingId === a.id ? (
          // 라디오 토글과의 이벤트 충돌 방지
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            key={`edit-${a.id}`}
          >
            <AddressEditItem
              address={a}
              onCancel={cancelEdit}
              onSave={saveEdit}
            />
          </div>
        ) : (
          <AddressItem
            key={a.id}
            address={a}
            isDefaultAddress={a.isDefault}
            updateDeliveryAddress={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startEdit(a.id);
            }}
            deleteDeliveryAddress={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // 선택 모드에서 삭제를 허용하려면 아래 주석 해제
              // handleDelete(a.id);
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

  //일반 모드
  return (
    <main className={clsx('flex flex-col gap-4', 'w-full', 'mt-14')}>
      {defaultAddress && (
        <div key={defaultAddress.id} className="w-full">
          {editingId === defaultAddress.id ? (
            <AddressEditItem
              key={`edit-${defaultAddress.id}`}
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
                e.preventDefault();
                e.stopPropagation();
                startEdit(defaultAddress.id);
              }}
              deleteDeliveryAddress={(e) => {
                e.preventDefault();
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
              key={`edit-${addr.id}`}
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
                e.preventDefault();
                e.stopPropagation();
                startEdit(addr.id);
              }}
              deleteDeliveryAddress={(e) => {
                e.preventDefault();
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
