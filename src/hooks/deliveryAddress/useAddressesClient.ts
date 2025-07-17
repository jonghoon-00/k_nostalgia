import { Address } from "@/types/deliveryAddress";
import { useCallback } from "react";

const API_BASE = '/api/delivery-address';

// 배송지 수정 훅
export const useUpdateAddress = () => {
  return useCallback(async (
    addressId: string,
    userId:string,
    changes: Partial<Omit<Address, 'id'>>
  ) => {
    const response = await fetch(`${API_BASE}/${addressId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'user-id':  userId,
      },
      body: JSON.stringify(changes),
    });
    if (!response.ok) throw new Error('배송지 수정 실패');
  }, []);
}

// 배송지 삭제 훅
export function useDeleteAddress() {
  return useCallback(async (addressId: string ,userId: string) => {
    const response = await fetch(`${API_BASE}/${addressId}`, {
      method: 'DELETE',
      headers: { 'user-id': userId},
    });
    if (!response.ok) throw new Error('배송지 삭제 실패');
  }, []);
}