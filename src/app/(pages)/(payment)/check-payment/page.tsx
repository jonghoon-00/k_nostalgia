//결제 확인 페이지
//앱 결제시 해당 페이지로 redirect

import Loading from '@/components/common/Loading';
import { Suspense } from 'react';
import CheckPaymentContent from './_components/CheckPaymentContent';

const CheckPayment = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CheckPaymentContent />
    </Suspense>
  );
};

export default CheckPayment;
