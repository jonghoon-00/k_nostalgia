'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import useThrottle from '@/hooks/useThrottle';
import { useUser } from '@/hooks/useUser';
import api from '@/service/service';
import { AddAddressPayload } from '@/types/deliveryAddress';
import { formatPhoneNumber } from '@/utils/format';
import { validateName, validatePhoneNumber } from '@/utils/validate';

import { toast } from '@/components/ui/use-toast';
import useDaumPostcode from '@/hooks/deliveryAddress/daumPostCode/usePopup';
import clsx from 'clsx';

const AddAddressForm = () => {
  const router = useRouter();
  //formattedPhoneNumber: 휴대폰 번호 포맷팅을 위한 useState
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  //baseAddressWithZoneCode: 주소검색 api로 받아온 주소, 우편번호
  const [baseAddressWithZoneCode, setBaseAddressWithZoneCode] = useState('');
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});

  const { data } = useUser();
  const userId = data?.id;

  //input 실시간 유효성 검사
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'addressName' || name === 'receiverName') {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: !validateName(value)
      }));
    }
    if (name === 'phoneNumber') {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: !validatePhoneNumber(value)
      }));
    }
    if (name === 'baseAddress') {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: baseAddressWithZoneCode !== ''
      }));
    }
  };

  //휴대폰 번호 포맷팅 -> useState에 set
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setFormattedPhoneNumber(
      //010-????-???? 형식으로 포맷팅
      formatPhoneNumber({
        value: currentValue,
        prevValue: formattedPhoneNumber
      })
    );
  };

  //주소지 검색 - react-daum-postcode
  const { daumPostcodeClickHandler } = useDaumPostcode(
    setBaseAddressWithZoneCode
  );

  //배송지 등록
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      return console.error('유저 정보 찾을 수 없음');
    }

    //유효성검사 - validation error 확인
    const requiredFields = {
      addressName: '배송지명',
      receiverName: '수령인',
      phoneNumber: '휴대폰 번호',
      baseAddress: '주소'
    };
    const missingFields = Object.keys(requiredFields).filter(
      (key) => !e.currentTarget[key]?.value || validationErrors[key]
    );
    if (missingFields.length > 0) {
      return toast({
        description: `모든 정보를 바르게 입력해주세요`
      });
    }

    //formData 유효성 검사 + 값 반환
    const formData = new FormData(e.currentTarget);
    const addressName = formData.get('addressName')!.toString();
    const receiverName = formData.get('receiverName')!.toString();
    const detailAddress = formData.get('detailAddress')?.toString() ?? '';
    const phoneNumber = formattedPhoneNumber.replace(/[^\d]/g, '');

    const payload: AddAddressPayload = {
      userId,
      addressName,
      receiverName,
      phoneNumber,
      baseAddress: baseAddressWithZoneCode,
      detailAddress,
      isDefault: isDefaultAddress
    };

    try {
      api.address.addNewAddress(payload);
    } catch (error) {
      console.error('배송지 업데이트 중 에러:', error);
      return toast({
        description: '잠시 후 다시 시도해주세요'
      });
    }

    toast({
      description: '배송지 등록 완료'
    });

    //초기화
    setFormattedPhoneNumber('');
    setBaseAddressWithZoneCode('');
    setIsDefaultAddress(false);
    e.currentTarget.reset();
    setValidationErrors({});

    router.back();
  };

  //throttling 적용
  const { throttleButtonClick: submitWithThrottling, isDelay } = useThrottle({
    fn: handleSubmit,
    delay: 2000
  });

  useEffect(() => {
    if (isDelay) {
      toast({
        description: '주소지 저장 중입니다'
      });
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
                validationErrors.addressName
                  ? 'border border-red-700'
                  : 'border'
              )}
              onInput={handleInput}
            />
          </div>
          {validationErrors.addressName && (
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
                validationErrors.receiverName
                  ? 'border border-red-700'
                  : 'border'
              )}
              onInput={handleInput}
            />
          </div>
          {validationErrors.receiverName && (
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
              onInput={handleInput}
              name="phoneNumber"
              type="text"
              placeholder="010-0000-0000"
              className={clsx(
                inputBaseClass,
                validationErrors.phoneNumber
                  ? 'border border-red-700'
                  : 'border'
              )}
            />
          </div>
          {validationErrors.phoneNumber && (
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
              className={clsx('w-full p-3 border rounded-[8px] select-none')}
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
          <input
            name="detailAddress"
            type="text"
            placeholder="상세 주소를 입력해 주세요"
            className={clsx(inputBaseClass, 'border')}
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
          className={clsx(
            'w-full py-3 rounded-[8px] text-center',
            'bg-primary-20 text-white'
          )}
        >
          등록하기
        </button>
      </div>
    </form>
  );
};

export default AddAddressForm;
