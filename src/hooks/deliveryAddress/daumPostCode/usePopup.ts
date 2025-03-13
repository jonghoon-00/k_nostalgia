import { SetStateAction } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

//주소 검색 이후 useState에 주소, 우편번호 담는 함수
//return값: daumPostcodeClickHandler 함수(버튼 onclick 핸들러)

export default function useDaumPostcode(setState: (value: SetStateAction<string>) => void){
  const open = useDaumPostcodePopup(
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  );
  const daumPostcodeCompleteHandler = (data: any) => {
    const address = data.address;
    const zoneCode = data.zonecode;
    setState(`${address} (${zoneCode})`);
  };
  const daumPostcodeClickHandler = () => {
    open({ onComplete: daumPostcodeCompleteHandler });
  };

  return {daumPostcodeClickHandler};
}