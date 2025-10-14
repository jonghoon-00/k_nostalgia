'use client';

import { toast } from '@/components/ui/use-toast';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';

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

  const addresses = useDeliveryStore((s) => s.address) || [];
  const selectedAddressId = useDeliveryStore((s) => s.selectedAddressId);

  const { setSelectedAddressId, removeAddress, setAddress } = useDeliveryStore(
    (s) => ({
      setSelectedAddressId: s.setSelectedAddressId,
      removeAddress: s.removeAddress,
      setAddress: s.setAddress
    })
  );

  const closeModal = useModalStore((s) => s.close);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!addresses.length && initialData.length) {
      setAddress(initialData.map((a) => ({ ...a })));
      // 선택 보정
      const pick =
        initialData.find((a) => a.isDefault)?.id ?? initialData[0]?.id ?? null;
      setSelectedAddressId(pick ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 편집 중 대상이 사라지면 편집 종료
  useEffect(() => {
    if (editingId && !addresses.some((a) => a.id === editingId)) {
      setEditingId(null);
    }
  }, [addresses, editingId]);

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

    // 낙관적 업데이트
    const prev = addresses;
    const optimisticallyUpdated = (() => {
      let next = prev.map((a) =>
        a.id === addressId ? { ...a, ...changes } : { ...a }
      );
      if (changes.isDefault) {
        next = next.map((a) => ({ ...a, isDefault: a.id === addressId }));
      }
      return next;
    })();

    setAddress(optimisticallyUpdated);
    try {
      await updateAddress(addressId, userId, changes);
      // 기본 배송지로 바꿨으면 선택도 변경
      if (changes.isDefault) setSelectedAddressId(addressId);
      closeModal();
      toast({ description: '배송지가 수정되었습니다.' });
    } catch (err) {
      // 롤백
      setAddress(prev);
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
    closeModal();
    showCustomAlert({
      title: '배송지 삭제',
      message: '정말 이 배송지를 삭제하시겠습니까?',
      confirmButtonText: '삭제하기',
      cancelButtonText: '취소',
      onConfirm: async () => {
        const prev = addresses;

        // 낙관적 삭제 + 기본/선택 보정
        const filtered = prev
          .filter((a) => a.id !== addressId)
          .map((a) => ({ ...a }));
        let next = filtered;

        // 기본 배송지가 사라졌다면 맨 앞을 기본으로
        if (next.length && !next.some((a) => a.isDefault)) {
          next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
        }

        // 선택 주소가 삭제되면 기본 또는 첫 번째로 보정
        const nextSelected =
          (selectedAddressId && selectedAddressId !== addressId
            ? selectedAddressId
            : next.find((a) => a.isDefault)?.id ?? next[0]?.id) ?? null;

        setAddress(next);
        setSelectedAddressId(nextSelected);

        try {
          await deleteAddress(addressId, userId);
          if (editingId === addressId) setEditingId(null);
          toast({ description: '배송지가 삭제되었습니다.' });
        } catch (err) {
          // 롤백
          setAddress(prev);
          setSelectedAddressId(selectedAddressId ?? null);
          console.error(err);
          toast({ description: '배송지 삭제에 실패했습니다.' });
        }
      }
    });
  };

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) ?? null,
    [addresses]
  );
  const otherAddresses = useMemo(
    () => addresses.filter((a) => !a.isDefault),
    [addresses]
  );

  //선택 모드 (라디오 선택 + 편집 스왑)
  if (isSelecting) {
    const options = addresses.map((a) => ({
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
              handleDelete(a.id);
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
