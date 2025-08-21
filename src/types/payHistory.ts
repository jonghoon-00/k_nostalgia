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

export type PayHistory = Tables<'ordered_list'>;
export type PayHistoryList = PayHistory[];
export type RenderPayHistoryList = Record<string, PayHistoryList>;

export type PartialOrder = Partial<Tables<'ordered_list'>>;

export interface Order extends Omit<Tables<'ordered_list'>, 'products'> {
  products: Product[] | null;
}