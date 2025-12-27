type phoneNumberProps={
  value: string;
  prevValue: string;
}

export function formatPhoneNumber({ value, prevValue }: phoneNumberProps) {
  const number = value.replace(/[^\d]/g, '');
  const limited = number.slice(0, 11);

  // 백스페이스로 '-'를 삭제할 때의 처리
  if (prevValue && prevValue.endsWith('-') && !value.endsWith('-')) {
    if (prevValue.length === 4) {
      return number.slice(0, 3);
    }
    if (prevValue.length === 8) {
      return `${number.slice(0, 3)}-${number.slice(3, 7)}`;
    }
  }

  // 포맷팅
  if (limited.length <= 3) return limited;
  if (limited.length <= 7)
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
}