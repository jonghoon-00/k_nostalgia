import InfoIcon from '@/components/icons/InfoIcon';

const DesktopOrderHeader = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src="/image/payment_tiger.png"
        alt="주문/결제 페이지 아이콘"
        width={135}
        height={88}
        className="py-8"
      />
      <div className="bg-gray-90 flex py-3 px-4 w-full md:max-w-[1080px] md:mb-4">
        <InfoIcon width="20" height="20" />
        <p className="text-[15px] text-label-assistive">
          해당 결제는 가결제입니다. 결제 당일 23시-0시 이내 자동 환불됩니다.
          직접 환불을 원할 시 주문 내역에서 주문 취소 버튼을 통해 환불
          가능합니다.
        </p>
      </div>
    </div>
  );
};

export default DesktopOrderHeader;
