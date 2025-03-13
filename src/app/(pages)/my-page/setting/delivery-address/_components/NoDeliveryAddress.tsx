import Image from 'next/image';

const NoDeliveryAddress = () => {
  return (
    <figure className="w-full h-screen flex flex-col justify-center items-center">
      <Image
        src="/image/StateSad.png"
        alt="우는 호랑이"
        width={114}
        height={97}
        className="w-[114px] h-[97px]"
      />
      <figcaption className="text-[18px] text-[#AFACA7] font-medium">
        <p className="flex justify-center">등록된 배송지가 없어요</p>
        <p>새 배송지를 추가해 주세요 !</p>
      </figcaption>
    </figure>
  );
};

export default NoDeliveryAddress;
