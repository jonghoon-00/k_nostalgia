import HeaderWithInfoIcon from '@/components/common/header/_component/HeaderWithInfoIcon';
import { getAddressesInServerComponent } from '@/hooks/deliveryAddress/getAddresses';
import { AllAddresses } from '@/types/deliveryAddress';
import { createClient } from '@/utils/supabase/server';
import OrderPageContainer from './components/OrderPageContainer';

const Payment = async () => {
  //헤더 info 아이콘에 전달할 툴팁 내용
  const toolTipContentArray = [
    '해당 결제는 가결제입니다.',
    '결제 당일 23시-0시 이내 자동 환불됩니다.',
    '직접 환불을 원할 시',
    '주문 내역에서 주문 취소 버튼을 통해 환불 가능합니다.'
  ];

  const allAddresses: AllAddresses = await getAddressesInServerComponent();

  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  let shippingRequest = '';
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('shippingRequest')
      .eq('id', user.id)
      .single();

    shippingRequest = data?.shippingRequest || '';
  }

  return (
    <>
      <HeaderWithInfoIcon
        toolTipContentArray={toolTipContentArray}
        isIncludeIconHighlighting={true}
      />
      <OrderPageContainer
        initialAddresses={allAddresses}
        initialShippingRequest={shippingRequest}
      />
      ;
    </>
  );
};

export default Payment;
