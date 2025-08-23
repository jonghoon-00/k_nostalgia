// PortOne V2 GET /payments/{paymentId} 응답용 타입

export type PortOnePaymentStatus =
  | 'READY'
  | 'PAY_PENDING'
  | 'PAID'
  | 'PARTIAL_CANCELLED'
  | 'CANCELLED'
  | 'FAILED'
  | 'VIRTUAL_ACCOUNT_ISSUED';

// 공통 필드
// 개별 PG/수단별 세부 필드는 optional로
export interface PortOnePaymentBase {
  paymentId: string;            // 결제 건 아이디
  orderName?: string;           // 주문명
  status: PortOnePaymentStatus; // 상태 (Discriminant)
  currency?: string;            // 통화
  amount?: {
    total?: number;             // 총 결제금액
    // (추후 필요시 supplied, vat, taxFree, discount 등 추가 확장)
  };
  customer?: {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  products?: Array<{
    id?: string;
    name?: string;
    amount?: number;
    quantity?: number;
  }>;
  // 타임스탬프류
  approvedAt?: string;
  paidAt?: string;
  cancelledAt?: string;

  // 결과/영수증/실패정보 등
  receiptUrl?: string | null;
  failure?: { code?: string; message?: string } | null;

  // 결제수단 등 (필요 시 점진적으로 확장)
  method?: {
    type?: string; // 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | ...
    card?: {
      issuer?: string;
      installmentMonth?: number;
      isInterestFree?: boolean;
      approvalNumber?: string;
    };
    virtualAccount?: {
      accountNumber?: string;
      bank?: string;
      dueDate?: string;
    };
  };
}

// 상태별 구체 타입들
export interface ReadyPayment extends PortOnePaymentBase { status: 'READY' }
export interface PayPendingPayment extends PortOnePaymentBase { status: 'PAY_PENDING' }
export interface PaidPayment extends PortOnePaymentBase { status: 'PAID'; paidAt?: string }
export interface PartialCancelledPayment extends PortOnePaymentBase { status: 'PARTIAL_CANCELLED' }
export interface CancelledPayment extends PortOnePaymentBase { status: 'CANCELLED'; cancelledAt?: string }
export interface FailedPayment extends PortOnePaymentBase { status: 'FAILED'; failure: { code?: string; message?: string } | null }
export interface VirtualAccountIssuedPayment extends PortOnePaymentBase { status: 'VIRTUAL_ACCOUNT_ISSUED' }

export type PortOnePayment =
  | ReadyPayment
  | PayPendingPayment
  | PaidPayment
  | PartialCancelledPayment
  | CancelledPayment
  | FailedPayment
  | VirtualAccountIssuedPayment;
