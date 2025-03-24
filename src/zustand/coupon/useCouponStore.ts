import { create } from "zustand";

type State = {
  coupon: string | null;
}
type Actions = {
  setCoupon: (coupon: string | null) => void;
}

const useCouponStore = create<State&Actions>((set) => ({
  coupon: null,
  setCoupon: (coupon) => set({ coupon }),
}));

export default useCouponStore;