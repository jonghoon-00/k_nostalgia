import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

export type Product = {
  id: string;
  name: string;
  amount: number;
  quantity: number;
}
export type Products = Product[];

type payMethod = 'toss' | 'kakao' | 'normal';

type State = {
  orderName: string;
  totalAmount: number;
  products: Products;
  payMethod: string;
  isCouponApplied: boolean;
}
type Actions = {
  setOrderName: (orderName: string) => void;
  setTotalAmount: (amount: number) => void;
  setProducts: (products: Products) => void;
  setPayMethod: (method: payMethod) => void;
  setIsCouponApplied: (isApplied: boolean) => void;

  getTotalQuantity: () => number;

  resetState: () => void;
}

const initialState : State = {
  orderName: '',
  totalAmount: 0,
  products:[],
  payMethod: 'toss',
  isCouponApplied: false,
}

const CURRENT_VERSION = 2;
export const usePaymentRequestStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      getTotalQuantity:() => 
        get().products.reduce((acc, product) => acc + (product.quantity ?? 0), 0),

      setOrderName: (name) => set((state) => ({ ...state, orderName: name })),
      setTotalAmount: (amount) => set((state) => ({ ...state, totalAmount: amount })),
      setProducts: (products) => set((state) => ({ ...state, products })),
      setPayMethod: (method) => set((state)=> ({...state, payMethod: method})),
      setIsCouponApplied: (isApplied) => set((state) => ({...state, isCouponApplied: isApplied})),
      resetState: () => set(initialState),
    }),
    {
      name: "payment-request-storage", 
      storage: createJSONStorage(()=>sessionStorage),
      //스토리지 비우기 : usePaymentRequestStore.persist.clearStorage()

      version: CURRENT_VERSION,
      // v2 마이그레이션: customer/totalQuantity/placeholder products 제거
      migrate: (persisted: any, version) => {
        if (!persisted) return persisted;
        if (version < 2) {
          if("totalQuantity" in persisted) delete persisted.totalQuantity;
          if ("customer" in persisted) delete persisted.customer;
          if(
            Array.isArray(persisted.products) &&
            persisted.products.length === 1 &&
            persisted.products[0] &&
            !persisted.products[0].id
          ) {
            persisted.products = [];
          }
        }
          return persisted;
        }
      },
  )
);