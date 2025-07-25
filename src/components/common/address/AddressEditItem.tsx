'use client';

import { toast } from '@/components/ui/use-toast';
import { Address } from '@/types/deliveryAddress';
import { formatPhoneNumber } from '@/utils/format';
import { hasValidationError, validateAddressFields } from '@/utils/validate';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';

interface AddressEditProps {
  address: Address;
  onCancel: () => void;
  onSave: (id: string, changes: Partial<Omit<Address, 'id'>>) => void;
}

const AddressEditItem: React.FC<AddressEditProps> = ({
  address,
  onCancel,
  onSave
}) => {
  const prevAddressRef = useRef(address); // 이전 주소 상태 저장

  // 폼 상태 및 에러 상태 초기화
  const [form, setForm] = useState({
    addressName: address.addressName,
    receiverName: address.receiverName,
    phoneNumber: formatPhoneNumber({
      value: address.phoneNumber,
      prevValue: ''
    }),
    baseAddress: address.baseAddress,
    detailAddress: address.detailAddress || '',
    isDefault: address.isDefault || false
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));

    // 전체 필드값 모아서 유효성 검사
    const fields = {
      addressName: name === 'addressName' ? (val as string) : form.addressName,
      receiverName:
        name === 'receiverName' ? (val as string) : form.receiverName,
      phoneNumber: name === 'phoneNumber' ? (val as string) : form.phoneNumber,
      baseAddress: form.baseAddress
    };
    const validation = validateAddressFields(fields);
    setErrors(validation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 변경 전 데이터와 동일하면 취소 처리
    const prevAddress = prevAddressRef.current;

    const normalizedPhone = form.phoneNumber.replace(/[^0-9]/g, '');
    const isUnchanged =
      form.addressName === prevAddress.addressName &&
      form.receiverName === prevAddress.receiverName &&
      normalizedPhone === prevAddress.phoneNumber &&
      form.baseAddress === prevAddress.baseAddress &&
      form.detailAddress === (prevAddress.detailAddress || '') &&
      form.isDefault === (prevAddress.isDefault || false);

    if (isUnchanged) {
      onCancel();
      return;
    }

    const fields = {
      addressName: form.addressName,
      receiverName: form.receiverName,
      phoneNumber: form.phoneNumber.replace(/[^0-9]/g, ''),
      baseAddress: form.baseAddress
    };

    const validation = validateAddressFields(fields);
    setErrors(validation);

    if (hasValidationError(validation)) {
      return toast({
        description: '모든 필드를 올바르게 입력해 주세요.',
        variant: 'destructive'
      });
    }
    onSave(address.id, { ...form, phoneNumber: fields.phoneNumber });
  };

  const LABEL_STYLE = 'block font-semibold text-[14px] text-label-strong mb-2';
  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        'p-4',
        'bg-white',
        'w-full',
        'flex flex-col gap-2',
        'border border-primary-20 rounded-xl'
      )}
    >
      {/* 배송지명 */}
      <div>
        <label className={clsx(LABEL_STYLE)}>
          배송지명 <span className="text-red-500">*</span>
        </label>
        <input
          name="addressName"
          value={form.addressName}
          onChange={handleChange}
          className={clsx(
            'w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400',
            errors.addressName && 'border-red-500'
          )}
        />
        {errors.addressName && (
          <p className="text-red-500 text-sm mt-1">
            배송지명을 정확하게 입력해 주세요
          </p>
        )}
      </div>

      {/* 수령인 */}
      <div>
        <label className={clsx(LABEL_STYLE)}>
          수령인 <span className="text-red-500">*</span>
        </label>
        <input
          name="receiverName"
          value={form.receiverName}
          onChange={handleChange}
          className={clsx(
            'w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400',
            errors.receiverName && 'border-red-500'
          )}
        />
        {errors.receiverName && (
          <p className="text-red-500 text-sm mt-1">
            수령인 이름을 정확하게 입력해 주세요
          </p>
        )}
      </div>

      {/* 휴대폰 */}
      <div>
        <label className={clsx(LABEL_STYLE)}>
          휴대폰 번호 <span className="text-red-500">*</span>
        </label>
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          className={clsx(
            'w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400',
            errors.phoneNumber && 'border-red-500'
          )}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            휴대폰 번호를 확인해 주세요
          </p>
        )}
      </div>

      {/* 주소 */}
      <div>
        <label className={clsx(LABEL_STYLE)}>주소</label>
        <p className="text-sm text-label-normal mb-1">{form.baseAddress}</p>
        <input
          name="detailAddress"
          value={form.detailAddress}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="상세 주소"
        />
      </div>

      {/* 기본 체크 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
          id="edit-default"
        />
        <label htmlFor="edit-default" className="text-sm text-label-strong">
          기본 배송지로 설정
        </label>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-20 text-white rounded hover:opacity-90"
        >
          저장
        </button>
      </div>
    </form>
  );
};

export default AddressEditItem;
