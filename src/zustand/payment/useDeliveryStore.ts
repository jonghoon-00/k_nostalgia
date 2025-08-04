import { Address } from '@/types/deliveryAddress';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
  selectedAddressId: string | null;
  shippingRequest: string | null;
  address: Address[] | null;
  shouldStoreDeliveryRequest: boolean;
}
type Actions = {
  setSelectedAddressId: (id: string) => void;
  setShippingRequest: (req: string) => void;
  setAddress: (state: Address[]) => void;
  setShouldStoreDeliveryRequest: (shouldStore: boolean) => void;
}

//TODO "다음에도 사용할래요" 체크가 true면, 
//shippingRequest를 로컬 스토리지에 저장해두고 다음 진입 시 복원하는 
// 구조도 고려
const useDeliveryStore = create<State&Actions>()(
  persist(
  (set)=>({
  selectedAddressId: null,
  shippingRequest: null,
  address: null,
  shouldStoreDeliveryRequest: false,
  
  setSelectedAddressId:(id)=>set({selectedAddressId: id}),
  setShippingRequest: (req) => set({shippingRequest: req}),
  setAddress: (addresses) =>
    set((state) =>
      state.address !== addresses ? { address: addresses } : state
),
setShouldStoreDeliveryRequest: (shouldStore) => set({shouldStoreDeliveryRequest: shouldStore}),
  
}),{
  name: 'delivery-address-storage',
  storage: createJSONStorage(()=>sessionStorage),
  //스토리지 비우기 : useDeliveryStore.persist.clearStorage()
}))

export default useDeliveryStore;