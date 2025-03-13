import Image from 'next/image';

const FirstLoading = () => {
  return (
    <div className="bg-normal w-full h-[100vh] z-[9999]">
      <div className="flex justify-center flex-col items-center text-label-assistive text-sm absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]">
        <Image
          src="/image/Tigernew.png"
          alt="호랑이 아이콘"
          width={200}
          height={150}
          className="w-[191px] h-[148px] mb-10"
        />
        <p className="my-5">향그리움에 어서오세요!</p>
      </div>
    </div>
  );
};

export default FirstLoading;
