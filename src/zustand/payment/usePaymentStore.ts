import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

export type Products = {
  id: string;
  name: string;
  amount: number;
  quantity: number;
}[]
type Customer = {
  customerId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: object;
}

type State = {
  orderName: string;
  totalAmount: number;
  products: Products;
  customer: Customer;
  payMethod: string;
  isCouponApplied: boolean;
  totalQuantity: number;
}
type Actions = {
  setOrderName: (orderName: string) => void;
  setTotalAmount: (amount: number) => void;
  setProducts: (products: Products) => void;
  setCustomer: (customer: Customer) => void;
  setPayMethod: (method: string) => void;
  setIsCouponApplied: (isApplied: boolean) => void;
  setTotalQuantity: (quantity: number) => void;
  resetState: () => void;
}

const initialState : State = {
  orderName: '',
  totalAmount: 0,
  //TODO totalQuantity 값 제거하고, products에서 계산하도록 변경
  totalQuantity : 0,
  products:[{
    id: '',
    name: '',
    amount: 0,
    quantity: 0
  }],
  customer:{
    customerId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    address:{}
  },
  payMethod: 'toss',
  isCouponApplied: false,
}

export const usePaymentRequestStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setOrderName: (name) => set((state) => ({ ...state, orderName: name })),
      setTotalAmount: (amount) => set((state) => ({ ...state, totalAmount: amount })),
      setProducts: (products) => set((state) => ({ ...state, products })),
      setCustomer: (customer) => set((state) => ({...state, customer})),
      setPayMethod: (method) => set((state)=> ({...state, payMethod: method})),
      setIsCouponApplied: (isApplied) => set((state) => ({...state, isCouponApplied: isApplied})),
      setTotalQuantity: (quantity) => set((state) => ({...state, totalQuantity: quantity})),
      resetState: () => set(initialState),
    }),
    {
      name: "payment-request-storage", 
      storage: createJSONStorage(()=>sessionStorage),
      //스토리지 비우기 : usePaymentRequestStore.persist.clearStorage()
    }
  )
);

  // setCustomer: (customer) => set((state) => ({ ...state, customer })),