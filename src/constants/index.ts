// 사이트 URL 상수
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

// 전역 모달 ID. Modal.tsx
export const MODAL_IDS = {
  COUPON: 'coupon',
  ADDRESS: 'address',
} as const;
// 아코디언 아이디. Accordion.tsx
export const ACCORDION_IDS = {
  ORDER_SUMMARY: 'order-summary',
} as const;


// 결제 관련 상수
export const DELIVERY_FEE = 2500 as const; // 배송비(KRW)