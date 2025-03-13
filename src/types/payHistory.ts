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

export interface Order extends Omit<Tables<'orderd_list'>, 'products'> {
  products: Product[] | null;
}

export type NullablePropertiesExcept<T, K extends keyof T = never> = {
  [P in keyof T]: P extends K ? T[P] : T[P] | null
};

export type BaseOrderInPayHistory = {
  payment_id: string;
  status: string | null;
  order_name: string | null;
  amount: number | null;
  price: number | null;
  user_id: string | null;
  payment_date: string | null;
  id: string;
  pay_provider: string | null;
  user_name: string | null;
  phone_number: string | null;
  products: any;
  created_at: string | null;
  user_email: string | null;
}

export type OrderInPayHistory = NullablePropertiesExcept<BaseOrderInPayHistory>;
export type OrderListInPayHistory = Record<string,BaseOrderInPayHistory[]>

export interface PayHistory  {
  status: string;
  id: string;
  transactionId: string;
  merchantId: string;
  storeId: string;
  method?: {
    type: string;
    card?: {
      publisher?: string;
      issuer?: string;
      brand?: string;
      type?: string;
      ownerType?: string;
      bin?: string;
      name?: string;
      number?: string;
    };
    approvalNumber?: string;
    installment?: {
      month: number;
      isInterestFree: boolean;
    };
    pointUsed?: boolean;
  };
  channel: {
    type: string;
    id?: string;
    key?: string;
    name?: string;
    pgProvider: string;
    pgMerchantId: string;
  };
  version: string;
  scheduleId?: string;
  billingKey?: string;
  requestedAt: string;
  updatedAt: string;
  statusChangedAt: string;
  orderName: string;
  amount: {
    total: number;
    taxFree: number;
    vat?: number;
    supply?: number;
    discount: number;
    paid: number;
    cancelled: number;
    cancelledTaxFree: number;
  };
  currency: string;
  customer: {
    id?: string;
    birthYear?: string;
    gender?: string;
    email?: string;
    phoneNumber?: string;
    address?: {
      type?: string;
      oneLine?: string;
    };
    zipcode?: string;
  };
  promotionId?: string;
  isCulturalExpense?: boolean;
  escrow?: {
    status?: string;
  };
  products?: {
    id: string;
    name: string;
    tag?: string;
    code?: string;
    amount: number;
    quantity: number;
  }[];
  productCount?: number;
  customData?: string;
  country?: string;
  paidAt?: string;
  pgTxId?: string;
  cashReceipt?: {
    status?: string;
    type?: string;
    pgReceiptId?: string;
    issueNumber: string;
    totalAmount: number;
    taxFreeAmount?: number;
    currency: string;
    url?: string;
    issuedAt: string;
    cancelledAt: string;
  };
  receiptUrl?: string;
  cancellations?: {
    status: string;
    id: string;
    pgCancellationId?: string;
    totalAmount: number;
    taxFreeAmount: number;
    vatAmount: number;
    easyPayDiscountAmount?: number;
    reason: string;
    cancelledAt?: string;
    requestedAt: string;
  }[];
  cancelledAt: string;
};