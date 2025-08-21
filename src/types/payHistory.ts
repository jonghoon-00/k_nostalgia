import { Tables } from "./supabase";

export interface Product {
  amount: number;
  id: string;
  name: string;
  quantity: number;
  user_id: string;
  hasReview?: boolean;
  rating?: number | null | undefined;
}
export type ProductList = Product[];

// Supabase 원시 행 타입 (products: Json | null 일 가능성 높음)
export type PayHistoryRaw = Tables<'ordered_list'>;

// 앱에서 사용하는 정상화된 타입 (products: Product[] | null)
export type PayHistory = Omit<PayHistoryRaw, 'products'> & {
  products: Product[] | null;
};

export type PayHistoryList = PayHistory[];
export type RenderPayHistoryList = Record<string, PayHistoryList>;

// 부분 업데이트에 쓰는 타입 (정상화 기준을 따름)
export type PartialOrder = Partial<Tables<'ordered_list'>>;

// 명시적 Order 별칭 (가독성용) 
export type Order = PayHistory;