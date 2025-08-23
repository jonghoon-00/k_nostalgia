'use client';

import React, { useEffect, useState } from 'react';

import useThrottle from '@/hooks/useThrottle';
import { useUser } from '@/hooks/useUser';
import api from '@/service/service';
import { AddAddressPayload } from '@/types/deliveryAddress';
import { formatPhoneNumber } from '@/utils/format';
import { hasValidationError, validateAddressFields } from '@/utils/validate';

import { toast } from '@/components/ui/use-toast';
import useDaumPostcode from '@/hooks/deliveryAddress/daumPostCode/usePopup';
import clsx from 'clsx';

type FieldKey = 'addressName' | 'receiverName' | 'phoneNumber' | 'baseAddress';

interface AddAddressFormProps {
  onSuccess?: () => void; // 등록 성공 시
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({ onSuccess }) => {
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [baseAddressWithZoneCode, setBaseAddressWithZoneCode] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  // form 필드 상태
  const [form, setForm] = useState({
    addressName: '',
    receiverName: '',
    detailAddress: ''
  });

  // 유효성/터치 상태
  const [validationErrors, setValidationErrors] = useState<
    Record<FieldKey, boolean>
  >({
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

  const { data } = useUser();
  const userId = data?.id;

  // 개별 필드 검증 helper
  const validateSingleField = (key: FieldKey, value?: string) => {
    const snapshot = {
      addressName: form.addressName,
      receiverName: form.receiverName,
      phoneNumber: formattedPhoneNumber,
      baseAddress: baseAddressWithZoneCode
    };

    // 전달된 value가 있으면 해당 필드만 최신값으로 대체
    if (typeof value === 'string') {
      if (key === 'phoneNumber') snapshot.phoneNumber = value;
      else if (key === 'baseAddress') snapshot.baseAddress = value;
      else (snapshot as any)[key] = value;
    }

    const all = validateAddressFields(snapshot);
    setValidationErrors((prev) => ({ ...prev, [key]: all[key] }));
  };

  //주소 검색 - react-daum-postcode (선택 시 baseAddress touched + 검증)
  const { daumPostcodeClickHandler } = useDaumPostcode(
    setBaseAddressWithZoneCode
  );

  // input 실시간 유효성 검사 및 상태 업데이트 (텍스트 필드 공통)
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') return; // 휴대폰은 별도 handler
    if (name === 'baseAddress') return; // baseAddress는 우편번호 선택으로만 변경

    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name as FieldKey]: true }));
    validateSingleField(name as FieldKey, value);
  };

  // blur 시 touched 활성화 (에러 표시 트리거)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const key = e.target.name as FieldKey;
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  //휴대폰 번호 포맷팅 + 개별 검증
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const next = formatPhoneNumber({
      value: currentValue,
      prevValue: formattedPhoneNumber
    });
    setFormattedPhoneNumber(next);
    setTouched((prev) => ({ ...prev, phoneNumber: true }));
    validateSingleField('phoneNumber', next);
  };

  //배송지 등록
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      console.error('유저 정보 찾을 수 없음');
      return;
    }

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const fields = {
      addressName: (fd.get('addressName') ?? '').toString(),
      receiverName: (fd.get('receiverName') ?? '').toString(),
      phoneNumber: formattedPhoneNumber.replace(/[^\d]/g, ''),
      baseAddress: baseAddressWithZoneCode
    };

    // 전체 검증
    const errors = validateAddressFields(fields);
    setValidationErrors((prev) => ({ ...prev, ...errors }));

    if (hasValidationError(errors)) {
      // 모든 필드를 touched로 바꿔 에러를 보여줌
      setTouched({
        addressName: true,
        receiverName: true,
        phoneNumber: true,
        baseAddress: true
      });
      toast({ description: '모든 정보를 바르게 입력해주세요' });
      return;
    }

    const payload: AddAddressPayload = {
      userId,
      addressName: fields.addressName,
      receiverName: fields.receiverName,
      phoneNumber: fields.phoneNumber,
      baseAddress: fields.baseAddress,
      detailAddress: (fd.get('detailAddress') ?? '').toString(),
      isDefault: isDefaultAddress
    };

    try {
      await api.address.addNewAddress(payload);
    } catch (error) {
      console.error('배송지 업데이트 중 에러:', error);
      toast({ description: '잠시 후 다시 시도해주세요' });
      return;
    }

    toast({ description: '배송지 등록 완료' });

    //초기화
    setFormattedPhoneNumber('');
    setBaseAddressWithZoneCode('');
    setIsDefaultAddress(false);
    setForm({ addressName: '', receiverName: '', detailAddress: '' });
    setValidationErrors({
      addressName: false,
      receiverName: false,
      phoneNumber: false,
      baseAddress: false
    });
    setTouched({
      addressName: false,
      receiverName: false,
      phoneNumber: false,
      baseAddress: false
    });
    e.currentTarget.reset();

    onSuccess?.();
  };

  //throttling
  const { throttleButtonClick: submitWithThrottling, isDelay } = useThrottle({
    fn: handleSubmit,
    delay: 2000
  });

  useEffect(() => {
    if (isDelay) {
      toast({ description: '주소지 저장 중입니다' });
    }
  }, [isDelay]);

  const ERROR_MESSAGE_STYLE = 'text-red-500 text-sm mt-1 ml-1';
  const inputBaseClass =
    'w-full p-3 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-gray-400';
  const labelClass = 'text-base font-medium text-[#1F1E1E]';
  const requiredMark = <span className="text-red-500">*</span>;

  return (
    <form onSubmit={submitWithThrottling}>
      <div className={clsx('flex flex-col gap-6')}>
        {/* 배송지명 */}
        <div>
          <div className={clsx('flex flex-col gap-2')}>
            <label className={clsx('block', labelClass)}>
              배송지명 {requiredMark}
            </label>
            <input
              type="text"
              name="addressName"
              maxLength={10}
              minLength={1}
              placeholder="최대 10자 이내로 작성해 주세요"
              className={clsx(
                inputBaseClass,
                touched.addressName && validationErrors.addressName
                  ? 'border border-red-700'
                  : 'border'
              )}
              onChange={handleInput}
              onBlur={handleBlur}
              defaultValue={form.addressName}
            />
          </div>
          {touched.addressName && validationErrors.addressName && (
            <p className={ERROR_MESSAGE_STYLE}>
              배송지명을 정확하게 입력해 주세요
            </p>
          )}
        </div>

        {/* 수령인 */}
        <div>
          <div className={clsx('flex flex-col gap-2')}>
            <label className={clsx('block', labelClass)}>
              수령인 {requiredMark}
            </label>
            <input
              type="text"
              name="receiverName"
              maxLength={10}
              minLength={2}
              placeholder="최대 10자 이내로 작성해 주세요"
              className={clsx(
                inputBaseClass,
                touched.receiverName && validationErrors.receiverName
                  ? 'border border-red-700'
                  : 'border'
              )}
              onChange={handleInput}
              onBlur={handleBlur}
              defaultValue={form.receiverName}
            />
          </div>
          {touched.receiverName && validationErrors.receiverName && (
            <p className={ERROR_MESSAGE_STYLE}>
              수령인 이름을 정확하게 입력해 주세요
            </p>
          )}
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <div className={clsx('flex flex-col gap-2')}>
            <label className={clsx('block', labelClass)}>
              휴대폰 번호 {requiredMark}
            </label>
            <input
              value={formattedPhoneNumber}
              onChange={handlePhoneNumberChange}
              onBlur={handleBlur}
              name="phoneNumber"
              type="text"
              placeholder="010-0000-0000"
              className={clsx(
                inputBaseClass,
                touched.phoneNumber && validationErrors.phoneNumber
                  ? 'border border-red-700'
                  : 'border'
              )}
            />
          </div>
          {touched.phoneNumber && validationErrors.phoneNumber && (
            <p className={ERROR_MESSAGE_STYLE}>
              ‘010’을 포함한 숫자만 입력해 주세요
            </p>
          )}
        </div>

        {/* 주소 */}
        <div className={clsx('flex flex-col gap-2')}>
          <label className={clsx('block', labelClass)}>
            주소 {requiredMark}
          </label>
          <div className={clsx('flex space-x-2')}>
            <input
              disabled
              readOnly
              name="baseAddress"
              type="text"
              placeholder="주소 찾기로 입력해 주세요"
              className={clsx(
                'w-full p-3 border rounded-[8px] select-none',
                touched.baseAddress && validationErrors.baseAddress
                  ? 'border-red-700'
                  : undefined
              )}
              value={baseAddressWithZoneCode}
            />
            <button
              type="button"
              onClick={daumPostcodeClickHandler}
              className={clsx(
                'bg-primary-20 text-white px-4 rounded',
                'flex justify-center items-center whitespace-nowrap'
              )}
            >
              주소 찾기
            </button>
          </div>
          {touched.baseAddress && validationErrors.baseAddress && (
            <p className={ERROR_MESSAGE_STYLE}>주소를 선택해 주세요</p>
          )}
          <input
            name="detailAddress"
            type="text"
            placeholder="상세 주소를 입력해 주세요"
            className={clsx(inputBaseClass, 'border')}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, detailAddress: e.target.value }))
            }
          />
        </div>
      </div>

      {/* 기본 배송지 설정 */}
      <div className={clsx('flex items-center my-2')}>
        <input
          type="checkbox"
          id="defaultAddress"
          checked={isDefaultAddress}
          onChange={() => setIsDefaultAddress(!isDefaultAddress)}
          className={clsx(
            'w-4 h-4 rounded border-gray-300',
            'text-[#A1734C] focus:ring-[#A1734C]'
          )}
        />
        <label
          htmlFor="defaultAddress"
          className={clsx(
            'ml-2 text-label-strong text-[14px] font-medium leading-5'
          )}
        >
          기본 배송지로 설정
        </label>
      </div>

      {/* 등록 버튼 */}
      <div
        className={clsx(
          'fixed inset-x-0 bottom-0 w-full pt-6 pb-6',
          'shadow-[0_-4px_10px_rgba(0,0,0,0.1)]',
          'md:static md:bg-normal md:shadow-none'
        )}
      >
        <button
          type="submit"
          disabled={isDelay}
          className={clsx(
            'w-full py-3 rounded-[8px] text-center',
            'bg-primary-20 text-white',
            isDelay && 'opacity-60 cursor-not-allowed'
          )}
        >
          등록하기
        </button>
      </div>
    </form>
  );
};

export default AddAddressForm;
