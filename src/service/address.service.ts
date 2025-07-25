import { AddAddressPayload } from "@/types/deliveryAddress";

const ADDRESS_API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/delivery-address`;

class AddressAPI {
  async getAddresses(userId: string){
    if(!userId) throw new Error('유저 ID를 찾을 수 없습니다');

    const response = await fetch(`${ADDRESS_API_URL}?userId=${userId}`,{
      cache: 'no-store',
    });
    if(!response.ok) throw new Error ('배송지 정보를 가져올 수 없습니다');

    return response.json();
  }

  async addNewAddress(newAddress : AddAddressPayload){
    const response = await fetch(`${ADDRESS_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...newAddress})
    });

    if (!response.ok) {
      throw new Error('배송지 추가 실패');
    }
    return response.json();
  }
}

export default AddressAPI;