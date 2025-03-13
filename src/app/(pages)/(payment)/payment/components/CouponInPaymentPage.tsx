'use client';

const CouponInPaymentPage = () => {
  return (
    <div className="bg-white p-4 flex flex-col gap-2 rounded-[12px] border-2 border-[#E0E0E0] mb-4">
      <div className="flex justify-between">
        <h2 className="text-gray-600 font-bold">할인/쿠폰</h2>
        <button
          className="text-xs font-normal text-[#79746D] border-[1px] border-[#959595] rounded-[6px] py-1 px-2"
          onClick={() => alert('준비중')}
        >
          변경
        </button>
      </div>
      <p className="text-gray-700 mt-2">0원</p>
    </div>
  );
};

export default CouponInPaymentPage;
