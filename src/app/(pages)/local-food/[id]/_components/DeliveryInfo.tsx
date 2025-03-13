export const DeliveryInfo = () => {
  return (
    <table className="text-left text-sm">
      <tbody>
        <tr>
          <th className="lg:text-label-alternative align-top text-primary-heavy font-medium w-16">
            배송
          </th>
          <td>
            향신배송
            <p className="text-[#76746d]">
              23시 전 주문 시 내일 아침 8시 전 도착
              <span className="block">
                (제주도, 도서산간지역 향신배송 불가)
              </span>
            </p>
          </td>
        </tr>
        <tr>
          <th className="lg:text-label-alternative text-primary-heavy font-medium py-2">
            배송비
          </th>
          <td>2,500원</td>
        </tr>
        <tr>
          <th className="lg:text-label-alternative text-primary-heavy font-medium">
            판매자
          </th>
          <td>향그리움</td>
        </tr>
      </tbody>
    </table>
  );
};
