import { create } from "zustand";

type State = {
  coupon: string | null;
  discountAmount: number | null;
  availableCoupons: string[];
}

type Actions = {
  setCoupon: (coupon: string | null) => void;
  setDiscountAmount: (coupon: string | null) => void;
  applyMaxDiscount: () => void;
}

const discountAmountMap: { [key: string]: number } = {
  'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/images/Coupon.png': 2000,
};

const useCouponStore = create<State & Actions>((set) => ({
  coupon: null,
  discountAmount: 0,
  availableCoupons: Object.keys(discountAmountMap),
  setCoupon: (coupon) => {
    set({ coupon });
  },
  setDiscountAmount: (coupon) => {
    if (!coupon) {
      return set({ discountAmount: 0 });
    }
    set({ discountAmount: discountAmountMap[coupon] });
  },
  applyMaxDiscount: () => {
    const { availableCoupons } = useCouponStore.getState();
    let maxDiscount = 0;
    let maxCoupon = null;

    availableCoupons.forEach((coupon) => {
      const discount = discountAmountMap[coupon];
      if (discount > maxDiscount) {
        maxDiscount = discount;
        maxCoupon = coupon;
      }
    });

    if (maxCoupon) {
      useCouponStore.getState().setCoupon(maxCoupon);
      useCouponStore.getState().setDiscountAmount(maxCoupon);
    }
  }
}));

export default useCouponStore;