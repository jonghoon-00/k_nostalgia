export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  export function validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  }

  export function validateName(name: string): boolean {
    // 한글과 영어만 허용, 반복되는 동일 문자 3개 이상 false
    const nameRegex = /^[a-zA-Z가-힣]+$/;
    const repeatedCharRegex = /(.)\1{2,}/;
  
    // 한글과 영어만 포함
    if (!nameRegex.test(name)) {
      return false;
    }
  
    // 반복되는 동일 문자가 3개 이상 포함되는지 확인
    if (repeatedCharRegex.test(name)) {
      return false;
    }
  
    return true;
  }
  export function validateNickName(nickname: string): boolean {
    return nickname.length > 0 && nickname.length <= 12; 
  }
  
  // ------ address -----------------------

  export function validatePhoneNumber(value: string){
    //숫자만 추출
    const number = value.replace(/[^\d]/g, '');

    if(number.slice(0,3) !== '010'){
      return false
    }
    
    if(number.length < 11){
      return false
    }
    
    return true;
  }

  export interface AddressValidationFields {
  addressName: string;
  receiverName: string;
  phoneNumber: string;
  baseAddress: string;
}

/**
 * 폼 필드를 받아 각 필드별로 유효성 검사 결과를 boolean으로 반환
 * true: 오류 있음, false: 정상
 */
export function validateAddressFields(
  fields: AddressValidationFields
): Record<keyof AddressValidationFields, boolean> {
  return {
    addressName: !validateName(fields.addressName),
    receiverName: !validateName(fields.receiverName),
    phoneNumber: !validatePhoneNumber(fields.phoneNumber),
    baseAddress: fields.baseAddress.trim() === ''
  };
}

/**
 * 에러 오브젝트 중 하나라도 true면 유효성 오류가 존재함
 */
export function hasValidationError(errors: Record<string, boolean>): boolean {
  return Object.values(errors).some((v) => v === true);
}

//  -------------------------