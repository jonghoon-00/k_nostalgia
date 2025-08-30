// PortOne V2 GET /payments/{paymentId} 응답용 타입

export type PortOnePaymentStatus =
  | 'READY'
  | 'PAY_PENDING'
  | 'PAID'
  | 'PARTIAL_CANCELLED'
  | 'CANCELLED'
  | 'FAILED'
  | 'VIRTUAL_ACCOUNT_ISSUED';

export type Products = Array<{
  id: string;
  name: string;
  amount: number;
  quantity: number;
}>;
export type Customer = {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
};

// 간편결제 제공사 (공식 문서/릴리즈 노트에 자주 등장하는 주요 케이스 위주)
export type EasyPayProvider =
  | 'KAKAOPAY'
  | 'NAVERPAY'
  | 'PAYCO'
  | 'SAMSUNGPAY'
  | 'TOSSPAY';

// 결제수단 타입(필요 시 확장)
export type PortOneMethodType =
  | 'CARD'
  | 'EASY_PAY'
  | 'TRANSFER'
  | 'VIRTUAL_ACCOUNT'
  | 'MOBILE'
  | 'GIFT_CERTIFICATE'
  | 'CONVENIENCE_STORE';

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
  customer?: Customer;
  products?: Products;
  // 타임스탬프류
  approvedAt?: string;
  paidAt?: string;
  cancelledAt?: string;

  // 결과/영수증/실패정보 등
  receiptUrl?: string | null;
  failure?: { code?: string; message?: string } | null;

  // 결제수단 등 (필요 시 점진적으로 확장)
  method?: {
    type?: PortOneMethodType;

    // EASY_PAY일 때에만 채워지는 간편결제 제공사 식별자
    provider?: EasyPayProvider;

    // 카드 결제 상세
    card?: {
      name?: string; 
      issuer?: string;
      installmentMonth?: number;
      isInterestFree?: boolean;
      approvalNumber?: string;
    };

    // 가상계좌 결제 상세
    virtualAccount?: {
      accountNumber?: string;
      bank?: string;
      dueDate?: string;
    };

    // 필요 시 다른 수단(계좌이체, 휴대폰결제 등)도 점진 확장
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
