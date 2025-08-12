import { Address } from '@/types/deliveryAddress';
import { create } from 'zustand';

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
  resetAddressStore: () => void;
}

const eqById = (a: Address[] | null, b: Address[]) =>
  !!a && a.length === b.length && a.every((x, i) => x.id === b[i].id);

const useDeliveryStore = create<State&Actions>()(
  (set)=>({
  selectedAddressId: null,
  shippingRequest: null,
  address: null,
  shouldStoreDeliveryRequest: false,
  
  setSelectedAddressId:(id)=>set({selectedAddressId: id}),
  setShippingRequest: (req) => set({shippingRequest: req}),
  setAddress: (addresses) =>
    set((s) => (eqById(s.address, addresses) ? s : { address: addresses })),
  
  setShouldStoreDeliveryRequest: (shouldStore) => set({shouldStoreDeliveryRequest: shouldStore}),
  resetAddressStore: () => set({ selectedAddressId: null, address: null }),
}),)

export default useDeliveryStore;