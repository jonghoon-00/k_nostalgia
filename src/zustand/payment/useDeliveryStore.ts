import { Address } from '@/types/deliveryAddress';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
  selectedAddressId: string | null;
  shippingRequest: string | null;
  address: Address | null;
  shouldStoreDeliveryRequest: boolean;
}
type Actions = {
  //TODO setSelectedAddressId 필요할지 고려
  setSelectedAddressId: (id: string) => void;
  setShippingRequest: (req: string) => void;
  setAddress: (state: Address) => void;
  setShouldStoreDeliveryRequest: (shouldStore: boolean) => void;
}

const useDeliveryStore = create<State&Actions>()(
  persist(
  (set)=>({
  selectedAddressId: null,
  shippingRequest: null,
  address: null,
  shouldStoreDeliveryRequest: false,
  
  setSelectedAddressId:(id)=>set({selectedAddressId: id}),
  setShippingRequest: (req) => set({shippingRequest: req}),
  setAddress: (address) =>
    set((state) =>
      state.address !== address ? { address } : state
),
setShouldStoreDeliveryRequest: (shouldStore) => set({shouldStoreDeliveryRequest: shouldStore}),
  
}),{
  name: 'delivery-address-storage',
  storage: createJSONStorage(()=>sessionStorage),
  //스토리지 비우기 : useDeliveryStore.persist.clearStorage()
}))

export default useDeliveryStore;