import { create } from "zustand";

type State = {
  coupon: string | null;
  discountAmount: number;
}
type Actions = {
  setCoupon: (coupon: string | null) => void;
}

const discountAmountMap:{[key: string]: number} = {
  'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/images/Coupon.png' : 2000,
};

const useCouponStore = create<State&Actions>((set) => ({
  coupon: null,
  discountAmount: 0,
  setCoupon: (coupon) => {
    const discountAmount = coupon ? discountAmountMap[coupon] || 0 : 0;
    set({ coupon, discountAmount });
  },
}));

export default useCouponStore;