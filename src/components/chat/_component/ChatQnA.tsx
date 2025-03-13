'use client';
import { BackButton } from '@/components/icons/BackButton';
import ChatSendIcon from '@/components/icons/ChatSendIcon';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';

interface ChatQnAProps {
  setShowQnA: React.Dispatch<React.SetStateAction<boolean>>;
}

const QnAarray = [{}];

const ChatQnA = ({ setShowQnA }: ChatQnAProps) => {
  const { data: user } = useUser();

  return (
    <DialogContent className="bg-normal w-[330px] h-[627px] rounded-2xl md:w-[479px] md:h-[710px]">
      <div className="border-b-2 w-[calc(100%+32px)] -mx-4">
        <DialogHeader>
          <DialogTitle className="flex pt-3 px-3 pb-2 font-semibold text-lg leading-[28.8px] justify-between">
            <button onClick={() => setShowQnA(false)}>
              <BackButton />
            </button>
            <div>QnA</div>
            <div className="invisible w-7" />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </div>

      <div className="flex flex-col mb-3 w-full">
        <div className="flex gap-2">
          <Image
            src={'/image/profile.png'}
            alt="관리자 프로필"
            height={36}
            width={36}
            className="rounded-full w-9 h-9"
          />
          <div className="flex items-center font-semibold mr-auto">
            향그리움팀
          </div>
        </div>
        <div className="border border-primary-strong rounded-xl rounded-tl-none w-fit px-3 py-2 mt-[10px] text-sm leading-[22.4px] bg-[#FEFEFE]">
          버튼 어쩌고 컴포넌트 만들기 #1
        </div>
      </div>

      {/* 내가 말할 때... */}
      <div
        className="py-4 h-[495px] flex-1 overflow-y-auto scrollbar-hide md:h-[564px] md:px-2"
        // ref={scrollDown}
      >
        <div className="flex flex-col mb-3 w-full">
          <Image
            src={user?.avatar || '/image/profile.png'}
            alt={`${user?.nickname || 'user'}의 프로필`}
            height={36}
            width={36}
            className="rounded-full ml-auto w-9 h-9"
          />
          <div className="border border-primary-strong rounded-xl rounded-tr-none ml-auto mt-[10px] text-label-light text-sm bg-primary-strong w-fit px-3 py-2 leading-[22.4px]">
            {/* {encoded(item.content)} */}
          </div>
        </div>
      </div>
      {/* 푸터 */}
      <div className="border-t-2 w-[calc(100%+32px)] -mx-4">
        <DialogFooter className="flex relative items-center">
          <form
            className="relative w-[90%] mx-auto items-center"
            // onSubmit={handleSubmitMessage}
          >
            <div className="relative">
              <Input
                // ref={messageRef}
                type="text"
                placeholder={
                  user
                    ? '메시지 보내기...'
                    : '향그리움의 가족만 이용할 수 있어요'
                }
                className="pr-12 rounded-xl border border-primary-strong placeholder:text-label-assistive mt-3 mb-1 text-base bg-[#FEFEFE] md:mt-4"
                // disabled={!user}
                aria-label="메시지 입력"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                // disabled={!user}
                aria-label="메시지 전송"
              >
                <ChatSendIcon />
              </Button>
            </div>
          </form>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

export default ChatQnA;
