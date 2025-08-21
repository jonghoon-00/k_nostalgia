export const queryKeys = {
  payHistory: (paymentId: string) => ['payHistory', paymentId] as const,
  payHistoryList: (userId: string) => ['payHistoryList', userId] as const,
  
};