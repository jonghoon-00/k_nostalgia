import { HashLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="bg-normal w-full h-[100vh] z-[9999]">
      <div className="flex justify-center flex-col items-center text-label-assistive text-sm absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]">
        <HashLoader color="#A87939" />
        <p className="my-5">데이터를 불러오고 있어요!</p>
      </div>
    </div>
  );
};

export default Loading;
