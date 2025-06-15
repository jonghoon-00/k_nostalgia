import create from 'zustand';

interface State {
  selectedCouponIds: string[]
}
interface Actions{
  setSelectedCouponIds: (ids: string[]) => void
  updateCouponSelect: (id: string, apply: boolean) => void;
  clearCouponIds: () => void
}

export const useCouponStore = create<State & Actions>(set => ({
  selectedCouponIds: [],
  setSelectedCouponIds: ids => set({ selectedCouponIds: ids }),
  updateCouponSelect: (id, apply) =>
    set(state => ({
      selectedCouponIds: apply
        ? [...state.selectedCouponIds, id]
        : state.selectedCouponIds.filter(x => x !== id),
    })),
  clearCouponIds: () => set({ selectedCouponIds: [] }),
}));