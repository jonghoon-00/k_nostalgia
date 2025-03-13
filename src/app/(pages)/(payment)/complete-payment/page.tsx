import Loading from '@/components/common/Loading';
import { Suspense } from 'react';
import CompletePaymentContent from './_components/CompletePaymentContent';

const CompletePayment = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CompletePaymentContent />
    </Suspense>
  );
};

export default CompletePayment;
