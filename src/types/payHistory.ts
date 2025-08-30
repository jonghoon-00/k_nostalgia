import { Tables } from "./supabase";

// 앱 내부 상품 타입
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

// Supabase 원시 행 타입
export type OrderedListRow = Tables<'ordered_list'>;

// 앱에서 사용하는 정상화 타입
export type PayHistory = Omit<OrderedListRow, 'products'> & {
  products: Product[] | null;
};

export type PayHistoryList = PayHistory[];
export type RenderPayHistoryList = Record<string, PayHistoryList>;

// 부분 업데이트 타입
export type PartialOrder = Partial<Tables<'ordered_list'>>;

// 가독성 별칭
export type Order = PayHistory;

export type PayHistoryCache =
  Omit<OrderedListRow, 'products'> & { products: Product[] | null };
export type PayHistoryPatch = Partial<PayHistoryCache>;
