export interface Address {
  id: string;
  addressName: string; // 배송지명
  receiverName: string; // 수령인 이름
  phoneNumber: string; // 휴대폰 번호
  baseAddress: string; // 기본 주소
  detailAddress?: string; // 상세 주소
}
export interface PatchRequest {
  addressName: string; 
  receiverName: string; 
  phoneNumber: string; 
  baseAddress: string; 
  detailAddress: string; 
  isDefaultAddress: boolean; // 기본 배송지 설정 여부
  userId?: string; //유저 id
  id: string;
}
export interface PatchResponse {
  addressName: string; 
  receiverName: string; 
  phoneNumber: string; 
  baseAddress: string; 
  detailAddress: string; 
  isDefaultAddress: boolean; 
  userId: string; 
  id: string;
}

export interface AllAddresses {
  defaultAddress: Address;
  addresses: Address[];
}