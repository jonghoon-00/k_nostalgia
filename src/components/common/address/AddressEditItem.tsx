'use client';

import { toast } from '@/components/ui/use-toast';
import { Address } from '@/types/deliveryAddress';
import { formatPhoneNumber } from '@/utils/format';
import { hasValidationError, validateAddressFields } from '@/utils/validate';
import clsx from 'clsx';
import React, { useMemo, useRef, useState } from 'react';

interface AddressEditProps {
  address: Address;
  onCancel: () => void;
  onSave: (id: string, changes: Partial<Omit<Address, 'id'>>) => void;
}

type FieldKey = 'addressName' | 'receiverName' | 'phoneNumber' | 'baseAddress';

const AddressEditItem: React.FC<AddressEditProps> = ({
  address,
  onCancel,
  onSave
}) => {
  const prevAddressRef = useRef(address);

  // 초기 폰번호 포맷팅
  const initialFormattedPhone = useMemo(
    () =>
      formatPhoneNumber({
        value: address.phoneNumber ?? '',
        prevValue: ''
      }),
    [address.phoneNumber]
  );

  // 폼/에러/touched 상태
  const [form, setForm] = useState({
    addressName: address.addressName ?? '',
    receiverName: address.receiverName ?? '',
    phoneNumber: initialFormattedPhone,
    baseAddress: address.baseAddress ?? '',
    detailAddress: address.detailAddress ?? '',
    isDefault: !!address.isDefault
  });

  const [errors, setErrors] = useState<Record<FieldKey, boolean>>({
    addressName: false,
    receiverName: false,
    phoneNumber: false,
    baseAddress: false
  });

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    addressName: false,
    receiverName: false,
    phoneNumber: false,
    baseAddress: false
  });

  // 개별 필드 검증
  const validateSingleField = (key: FieldKey, value?: string) => {
    const snapshot = {
      addressName: form.addressName,
      receiverName: form.receiverName,
      phoneNumber: form.phoneNumber,
      baseAddress: form.baseAddress
    };
    if (typeof value === 'string') {
      (snapshot as any)[key] = value;
    }
    const v = validateAddressFields(snapshot);
    setErrors((prev) => ({ ...prev, [key]: v[key] }));
  };

  // 공통 변경 (휴대폰/주소 제외)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phoneNumber') return; // 별도 handler 사용
    if (name === 'baseAddress') return; // 수정 화면에선 baseAddress 비활성(읽기 전용 가정)

    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));

    // validation: addressName/receiverName만 개별 적용
    if (name === 'addressName' || name === 'receiverName') {
      setTouched((prev) => ({ ...prev, [name]: true } as any));
      validateSingleField(name as FieldKey, val as string);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const key = e.target.name as FieldKey;
    if (!key) return;
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  // 휴대폰 포맷팅 + 검증
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const next = formatPhoneNumber({
      value: currentValue,
      prevValue: form.phoneNumber
    });
    setForm((prev) => ({ ...prev, phoneNumber: next }));
    setTouched((prev) => ({ ...prev, phoneNumber: true }));
    validateSingleField('phoneNumber', next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 변경 없음 체크(저장 누를 때 서버로 보내는 normalized 값 기준)
    const prev = prevAddressRef.current;
    const normalizedPhone = form.phoneNumber.replace(/[^\d]/g, '');
    const prevPhone = (prev.phoneNumber ?? '').replace(/[^\d]/g, '');

    const isUnchanged =
      form.addressName === (prev.addressName ?? '') &&
      form.receiverName === (prev.receiverName ?? '') &&
      normalizedPhone === prevPhone &&
      form.baseAddress === (prev.baseAddress ?? '') &&
      form.detailAddress === (prev.detailAddress ?? '') &&
      form.isDefault === !!prev.isDefault;

    if (isUnchanged) {
      onCancel();
      return;
    }

    // 전체 검증
    const fields = {
      addressName: form.addressName,
      receiverName: form.receiverName,
      phoneNumber: normalizedPhone, // 서버 기준으로 숫자만
      baseAddress: form.baseAddress
    };
    const validation = validateAddressFields(fields);
    setErrors(validation);
    setTouched({
      addressName: true,
      receiverName: true,
      phoneNumber: true,
      baseAddress: true
    });

    if (hasValidationError(validation)) {
      toast({
        description: '모든 필드를 올바르게 입력해 주세요.',
        variant: 'destructive'
      });
      return;
    }

    // 저장 호출(서버에는 숫자만 전달)
    onSave(address.id, {
      addressName: form.addressName,
      receiverName: form.receiverName,
      phoneNumber: fields.phoneNumber,
      baseAddress: form.baseAddress,
      detailAddress: form.detailAddress,
      isDefault: form.isDefault
    });
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
          onBlur={handleBlur}
          className={clsx(
            'w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400',
            touched.addressName && errors.addressName && 'border-red-500'
          )}
          maxLength={10}
          placeholder="최대 10자 이내로 작성해 주세요"
        />
        {touched.addressName && errors.addressName && (
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
          onBlur={handleBlur}
          className={clsx(
            'w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400',
            touched.receiverName && errors.receiverName && 'border-red-500'
          )}
          maxLength={10}
          placeholder="최대 10자 이내로 작성해 주세요"
        />
        {touched.receiverName && errors.receiverName && (
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
          onChange={handlePhoneNumberChange}
          onBlur={handleBlur}
          className={clsx(
            'w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400',
            touched.phoneNumber && errors.phoneNumber && 'border-red-500'
          )}
          placeholder="010-0000-0000"
          inputMode="numeric"
        />
        {touched.phoneNumber && errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            ‘010’을 포함한 숫자만 입력해 주세요
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
