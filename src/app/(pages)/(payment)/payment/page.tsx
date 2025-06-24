import HeaderWithInfoIcon from '@/components/common/header/_component/HeaderWithInfoIcon';
import { getAddressesInServerComponent } from '@/hooks/deliveryAddress/getAddresses';
import { AllAddresses } from '@/types/deliveryAddress';
import { createClient } from '@/utils/supabase/server';
import CouponInPaymentPage from './components/CouponInPaymentPage';
import DesktopOrderHeader from './components/DesktopOrderHeader';
import PaymentMethodSelect from './components/PaymentMethodSelect';

// TODO 1. 전체 리팩토링 이후
// TODO 2. 배송지 변경 - 반응형 대응. (풀화면 <-> 모달)
const Payment = async () => {
  //툴팁 내용
  const toolTipContentArray = [
    '해당 결제는 가결제입니다.',
    '결제 당일 23시-0시 이내 자동 환불됩니다.',
    '직접 환불을 원할 시',
    '주문 내역에서 주문 취소 버튼을 통해 환불 가능합니다.'
  ];

  // 초기 주소 및 요청 사항 가져오기
  const allAddresses: AllAddresses = await getAddressesInServerComponent();
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  let shippingRequest = '';
  if (data.user) {
    const user = data.user;

    const { data: shippingRequestObj } = await supabase
      .from('users')
      .select('shippingRequest')
      .eq('id', user.id)
      .single();

    shippingRequest = shippingRequestObj?.shippingRequest || '';
  }

  return (
    <>
      {/* 앱 헤더(툴팁포함) */}
      <HeaderWithInfoIcon
        toolTipContentArray={toolTipContentArray}
        isIncludeIconHighlighting={true}
      />
      {/* 데스크탑 헤더 */}
      <div className="hidden md:block md:mt-16">
        <DesktopOrderHeader />
      </div>
      {/* 결제 페이지 주요 컴포넌트 */}
      <main className="mx-auto md:max-w-[1080px] p-4 md:p-0 bg-normal mb-14 mt-16 md:mt-0 md:flex md:gap-6">
        {/* 좌측: 배송지, 주문상품, 쿠폰, 결제수단 */}
        <section className="md:flex-1 md:max-w-[681px] space-y-6">
          {/* <DeliveryAddress
            initialData={allAddresses}
            initialRequest={initialShippingRequest}
          />
          <OrderProducts /> */}
          <CouponInPaymentPage />
          <PaymentMethodSelect />
        </section>

        {/* 우측: 결제 요약 */}
        <aside className="md:w-[375px] md:shrink-0">
          {/* <OrderSummary /> */}
        </aside>
      </main>
      ;
    </>
  );
};

export default Payment;
