export const queryKeys = {
  payHistory: (paymentId: string) => ['payHistory', paymentId] as const,
  payHistoryList: (userId: string) => ['payHistoryList', userId] as const,
  
};

export const mutationKeys = {
  deletePayHistory: () => ['deletePayHistory'] as const,
  cancelPayment: () => ['cancelPayment'] as const
}