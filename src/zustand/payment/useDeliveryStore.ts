import { Address } from '@/types/deliveryAddress';
import { create } from 'zustand';

type State = {
  selectedAddressId: string | null;
  shippingRequest: string | null;
  address: Address[] | null;
  shouldStoreDeliveryRequest: boolean;
};

type Actions = {
  setSelectedAddressId: (id: string | null) => void;
  setShippingRequest: (req: string | null) => void;
  setAddress: (addresses: Address[]) => void;
  addAddress: (address: Address | { status: number; address: Address }) => void; // ← 래핑 허용
  removeAddress: (id: string) => void;
  setShouldStoreDeliveryRequest: (shouldStore: boolean) => void;
  resetAddressStore: () => void;
};

export const useDeliveryStore = create<State & Actions>((set, get) => ({
  selectedAddressId: null,
  shippingRequest: null,
  address: null,
  shouldStoreDeliveryRequest: false,

  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
  setShippingRequest: (req) => set({ shippingRequest: req }),

  setAddress: (addresses) =>
    set((s) => {
      const next = addresses.map((a: any) =>
        'address' in a ? ({ ...(a.address as Address) }) : ({ ...(a as Address) })
      );
      const hasSelected =
        s.selectedAddressId != null && next.some((a) => a.id === s.selectedAddressId);

      return {
        address: next,
        selectedAddressId: hasSelected ? s.selectedAddressId : next[0]?.id ?? null,
      };
    }),

  addAddress: (payload) => {
    const item =
      payload && typeof payload === 'object' && 'address' in (payload as any)
        ? (payload as any).address as Address
        : (payload as Address);

    set((s) => {
      const base = (s.address ?? []).map((a) => ({ ...a }));
      const idx = base.findIndex((a) => a.id === item.id);
      const next = idx >= 0
        ? base.map((a) => (a.id === item.id ? { ...item } : a))
        : [...base, { ...item }];

      const nextSelectedId = s.selectedAddressId ?? item.id ?? next[0]?.id ?? null;

      return { address: next, selectedAddressId: nextSelectedId };
    });
  },

  removeAddress: (id) =>
    set((s) => {
      const base = (s.address ?? []).map((a) => ({ ...a }));
      const next = base.filter((a) => a.id !== id);
      const nextSelected =
        s.selectedAddressId === id ? next[0]?.id ?? null : s.selectedAddressId;
      return { address: next, selectedAddressId: nextSelected };
    }),

  setShouldStoreDeliveryRequest: (shouldStore) =>
    set({ shouldStoreDeliveryRequest: shouldStore }),

  resetAddressStore: () =>
    set({
      selectedAddressId: null,
      shippingRequest: null,
      address: null,
      shouldStoreDeliveryRequest: false,
  }),
}));

export default useDeliveryStore;
