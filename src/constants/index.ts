export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const ROUTES  = {
  HOME: '/' as const,
  SIGN_UP: '/sign-up' as const,
  LOG_IN: '/log-in' as const,
  MARKET: '/market' as const,
  INTERESTED_MARKET_PATH: '/my-page/likemarket-page' as const,
  LOCAL_FOOD: '/local-food' as const,
  CART: '/cart' as const,
  PAYMENT: '/payment' as const,
  PAYMENT_HISTORY: '/pay-history' as const,
  MY_PAGE: '/my-page' as const,
  COUPON: '/my-page/coupon-page' as const,
  ADDRESS: '/my-page/setting/delivery-address' as const,
  ADD_NEW_ADDRESS: '/my-page/setting/delivery-address/add-new' as const,
  NOTICE: '/customer-service/announcement' as const,
  FAQ: '/customer-service/faq-page' as const,
}

export const TEST_USER_IDS = new Set([
  '5359e616-84a1-44c7-bcd5-831d78a30292',
])

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