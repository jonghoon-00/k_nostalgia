export interface Address {
  id: string;
  addressName: string; // 배송지명
  receiverName: string; // 수령인 이름
  phoneNumber: string; // 휴대폰 번호
  baseAddress: string; // 기본 주소
  isDefault: boolean; // 기본 배송지 설정 여부
  detailAddress?: string; // 상세 주소
}
export interface AddAddressPayload {
  userId: string;
  addressName: string;
  receiverName: string;
  phoneNumber: string;
  baseAddress: string;
  detailAddress?: string;
  isDefault: boolean;
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