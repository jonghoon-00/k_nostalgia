type phoneNumberProps={
  value: string;
  prevValue: string;
}

// 010-????-???? 형식으로 포맷팅
export function formatPhoneNumber({value, prevValue}: phoneNumberProps){
  // 숫자만 추출
  const number = value.replace(/[^\d]/g, '');

  // 백스페이스로 "-"를 삭제하려고 할 때 동작
  if (prevValue && prevValue.endsWith('-') && !value.endsWith('-')) {
    if (prevValue.length === 4) {
      return number.slice(0, 3);
    } 
    if (prevValue.length === 8) {
      return `${number.slice(0, 3)}-${number.slice(3, 7)}`;
    }
  }

    // 11자리를 넘어가면 자르기
    const limited = number.slice(0, 11);
  
    // 3-4-4 형식으로 포맷팅
    if (limited.length === 3) return `${limited}-`;
    // 3자리 초과 7자리 이하일 때
    if (limited.length > 3 && limited.length <= 7) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    // 7자리 초과시
    if (limited.length > 7) return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
      
    return limited;
}