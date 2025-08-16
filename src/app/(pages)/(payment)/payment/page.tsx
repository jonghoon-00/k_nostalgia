import { createClient } from '@/utils/supabase/server';

import { getAddressesInServerComponent } from '@/hooks/deliveryAddress/useAddressesServer';

import HeaderWithInfoIcon from '@/components/common/header/_component/HeaderWithInfoIcon';
import clsx from 'clsx';
import DeliveryAddress from './components/(address)/DeliveryAddress';
import CouponInPaymentPage from './components/CouponInPaymentPage';
import OrderPageIntro from './components/OrderPageIntro';
import OrderProducts from './components/OrderProducts';
import OrderSummary from './components/OrderSummary';
import PaymentMethodSelect from './components/PaymentMethodSelect';

const Payment = async () => {
  //툴팁 내용
  const toolTipContentArray = [
    '해당 결제는 가결제입니다.',
    '결제 당일 23시-0시 이내 자동 환불됩니다.',
    '직접 환불을 원할 시',
    '주문 내역에서 주문 취소 버튼을 통해 환불 가능합니다.'
  ];

  // 주소
  const addressData = await getAddressesInServerComponent();
  const addresses = addressData?.addresses ?? [];

  // 유저 정보
  const supabase = createClient(); //server
  const { data } = await supabase.auth.getUser();

  // 배송 요청 사항
  let shippingRequest = '';
  if (data.user) {
    const user = data.user;

    const { data: userPaymentInfo } = await supabase
      .from('users')
      .select('shippingRequest')
      .eq('id', user.id)
      .single();

    shippingRequest = userPaymentInfo?.shippingRequest || '';
  }

  return (
    <>
      {/* 앱 헤더(툴팁포함) */}
      <HeaderWithInfoIcon
        toolTipContentArray={toolTipContentArray}
        isIncludeIconHighlighting={true}
      />
      {/* 데스크탑 헤더 */}
      <div className={clsx('hidden md:block', 'md:mt-16')}>
        <OrderPageIntro />
      </div>
      {/* content */}
      <main
        className={clsx(
          'mx-auto p-4 md:p-0 mb-14 mt-16 md:mt-0',
          'md:max-w-[1080px]',
          'bg-normal',
          'md:flex md:gap-6'
        )}
      >
        {/* 좌측: 배송지, 주문상품, 쿠폰, 결제수단 */}
        <section className={clsx('space-y-6', 'md:flex-1 md:max-w-[681px]')}>
          <DeliveryAddress
            initialAddresses={addresses}
            initialShippingRequest={shippingRequest}
          />
          <OrderProducts />
          <CouponInPaymentPage />
          <PaymentMethodSelect />
        </section>

        {/* 우측: 결제 요약 */}
        <aside className="md:w-[375px] md:shrink-0">
          <OrderSummary />
        </aside>
      </main>
      ;
    </>
  );
};

export default Payment;
