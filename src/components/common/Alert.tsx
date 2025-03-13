import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AlertProps = {
  message: string;
  title: string;
  buttonText: string; //버튼 텍스트 확인, 취소, 추가 등
  onButtonClick?: () => void; //버튼 클릭 시 실행 이벤트
  onClose?: () => void; //버튼 취소
};

export const AlertPage = ({
  message,
  title,
  buttonText,
  onButtonClick,
  onClose
}: AlertProps) => {
  return (
    <Alert className="bg-white rounded shadow-lg w-[300px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] items-center justify-center">
      <div className="px-6">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </div>
      <div className="flex items-center text-center border-t py-2 text-base">
        <button className="flex-1 border-r" onClick={onButtonClick}>
          {buttonText}
        </button>
        <button className="flex-1" onClick={onClose}>
          취소
        </button>
      </div>
    </Alert>
  );
};
