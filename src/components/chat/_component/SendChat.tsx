'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '@/utils/supabase/client';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Tables } from '@/types/supabase';
import { BsPersonExclamation } from 'react-icons/bs';
import { debounce } from 'lodash';
// import ReportAlert from './ReportAlert';
import { toast } from '@/components/ui/use-toast';
import { BackButton } from '@/components/icons/BackButton';
import ChatSendIcon from '@/components/icons/ChatSendIcon';
import ReportAlert2 from './ReportAlert2';

interface chatUserType {
  avatar: string;
  nickname: string;
  reportedUserId : string[] | null;
}

interface chatMessageType {
  id: number;
  created_at: string;
  room_id: string;
  user_id: string;
  content: string;
  isReported: boolean | null;
  users: chatUserType;
  reportedUserId : string[] | null;
}

interface SendChatProps {
  selectedChatRoom: Tables<'rooms'> | null;
  setSelectedChatRoom: React.Dispatch<
    React.SetStateAction<Tables<'rooms'> | null>
  >;
  isOpen: boolean;
}

interface HandleReport {
  reportedContent: string;
  reportedDetailContent: string;
}

const SendChat = ({
  selectedChatRoom,
  setSelectedChatRoom,
  isOpen
}: SendChatProps): JSX.Element => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const messageRef = useRef<HTMLInputElement>(null);
  const scrollDown = useRef<HTMLDivElement | null>(null);
  const [removeChatId, setRemoveChatId] = useState<number>(0);
0
  // xss 공격 방지
  const encoded = (str: string) => {
    if (str === null) {
      return;
    }
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // chat 가져오기
  const fetchChatData = async () => {
    const response = await fetch(`/api/chat/chat-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ room_id: selectedChatRoom?.room_id })
    });
    const { data } = await response.json();
    return data;
  };

  const { data } = useQuery<chatMessageType[], Error, chatMessageType[]>({
    queryKey: ['chatData', selectedChatRoom?.room_id],
    queryFn: fetchChatData,
    enabled: !!selectedChatRoom?.room_id
  });

  //chat 전송
  const sendMessage = async (newMessage: {
    room_id: string;
    user_id: string;
    content: string;
  }) => {
    const response = await fetch('/api/chat/chat-send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(newMessage)
    });

    return response.json();
  };

  const sendMessageMutate = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatData', selectedChatRoom?.room_id]
      });
      if (messageRef.current) {
        messageRef.current.value = '';
      }
    }
  });

  // 유효성 검사 추가하기
  const handleSendMessage = useCallback(() => {
    if (!user || !selectedChatRoom || !messageRef.current?.value.trim()) {
      return;
    }

    const newMessage = {
      room_id: selectedChatRoom.room_id,
      user_id: user.id,
      content: messageRef.current.value
    };

    sendMessageMutate.mutate(newMessage);
  }, [user, selectedChatRoom, sendMessageMutate]);

  const debounceSendMessage = useMemo(
    () => debounce(handleSendMessage, 300),
    [handleSendMessage]
  );

  const handleSubmitMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    debounceSendMessage();
  };

  useEffect(() => {
    if (!selectedChatRoom?.room_id) {
      return;
    }

    const channels = supabase
      .channel(`room_${selectedChatRoom?.room_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat',
          filter: `room_id=eq.${selectedChatRoom?.room_id}`
        },
        (payload) => {
          queryClient.invalidateQueries({
            queryKey: ['chatData', selectedChatRoom?.room_id]
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [queryClient, selectedChatRoom?.room_id]);

  // 날짜 포맷
  const formatDate = (date: string) => {
    return dayjs(date).locale('ko').format('YYYY.MM.DD HH:mm');
  };

  // 1) 모달 켰을 때, 2) 채팅 메세지 쓸 때 스크롤 하단 유지
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        if (scrollDown.current) {
          scrollDown.current.scrollTo({
            top: scrollDown.current.scrollHeight
            // behavior: 'smooth'
          });
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, data]);

  const handleBackChatRoom = () => {
    setSelectedChatRoom(null);
  };

  const cancelReport = () => {
    setRemoveChatId(0);
  };

  // 신고 알럿
  const onClickReortAlert = (itemId: number) => {
    setRemoveChatId(itemId);
  };

  const handleReport = async ({ reportedContent, reportedDetailContent } : HandleReport) => {
    if (!user?.id || !removeChatId) {
      console.error('유저 아이디가 없거나 챗 아이다가 없음');
      return;
    }

    const item = data?.find((x) => x.id === removeChatId);

    if (item) {
      const response = await fetch('/api/chat/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          id : user?.id,
          reportedUserId: item.user_id
        })
      });


      if (response.ok) { 
        const responseReport = await fetch('/api/chat/admin/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            reporterId: user?.id,
            reportedUserId: item.user_id,
            reportedContent,
            reportedDetailContent

          })
        });

        if(!response.ok) {
          throw Error('오류 발생');
        }

      queryClient.invalidateQueries({
        queryKey: ['chatData', selectedChatRoom?.room_id]
      });

      toast({
        variant: 'destructive',
        description: '사용자 신고가 접수되었습니다.'
      });
    }
    cancelReport();
  }
  };

  return (
    <DialogContent className="bg-normal w-[330px] h-[627px] rounded-2xl md:w-[479px] md:h-[710px]">
      <div className="border-b-2 w-[calc(100%+32px)] -mx-4">
        <DialogHeader>
          <DialogTitle className="flex pt-3 px-3 pb-2 font-semibold text-lg leading-[28.8px] justify-between">
            <button onClick={handleBackChatRoom}>
              <BackButton />
            </button>
            <div>{selectedChatRoom?.chat_name}</div>
            <div className="invisible w-7" />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </div>

      <div
        className="py-4 h-[495px] flex-1 overflow-y-auto scrollbar-hide md:h-[564px] md:px-2"
        ref={scrollDown}
      >
        {data
          ?.filter((item) => !item.isReported)
          .filter((item) => {
            if (user?.id) {
              return !item.users.reportedUserId?.includes(user.id);
            }
            return true;
          })
          .map((item) => {
            return item.user_id === user?.id ? (
              // 나일 경우
              <div key={item.id} className="flex flex-col mb-3 w-full">
                <Image
                  src={item.users?.avatar || '/image/profile.png'}
                  alt={`${item.users?.nickname || 'user'}의 프로필`}
                  height={36}
                  width={36}
                  className="rounded-full ml-auto w-9 h-9"
                />
                <div className="border border-primary-strong rounded-xl rounded-tr-none ml-auto mt-[10px] text-label-light text-sm bg-primary-strong w-fit px-3 py-2 leading-[22.4px]">
                  {encoded(item.content)}
                </div>
                <div className="text-xs text-label-assistive ml-auto mt-1 leading-[19.2px]">
                  {formatDate(item.created_at)}
                </div>
              </div>
            ) : (
              // 다른 사람일 경우
              <div key={item.id} className="flex flex-col mb-3 w-full">
                <div className="flex gap-2">
                  <Image
                    src={item.users.avatar || '/image/profile.png'}
                    alt={`${item.users.nickname}의 프로필` || 'User의 프로필'}
                    height={36}
                    width={36}
                    className="rounded-full w-9 h-9"
                  />
                  <div className="flex items-center font-semibold mr-auto">
                    {item.users?.nickname}
                  </div>
                </div>
                <div className="border border-primary-strong rounded-xl rounded-tl-none w-fit px-3 py-2 mt-[10px] text-sm leading-[22.4px] bg-[#FEFEFE]">
                  {encoded(item.content)}
                </div>
                <div className="text-xs text-label-assistive mt-1 leading-[19.2px] flex items-center">
                  <div>{formatDate(item.created_at)}</div>
                  <div className="w-[1px] h-[10px] rounded-[6px] border mx-[6px]" />
                  <div
                    className="flex gap-1 justify-center cursor-pointer"
                    onClick={() => {
                      onClickReortAlert(item.id);
                    }}
                  >
                    <BsPersonExclamation className="w-[16px] h-[16px] text-[#AFAFAF]" />
                    <span>신고하기</span>
                  </div>
                </div>
              </div>
            );
          })}
        {removeChatId > 0 && (
          <ReportAlert2
            handleReport={handleReport}
            cancelReport={cancelReport}
            setSelectedChatRoom={setSelectedChatRoom}
          />
        )}
      </div>
      <div className="border-t-2 w-[calc(100%+32px)] -mx-4">
        <DialogFooter className="flex relative items-center">
          <form
            className="relative w-[90%] mx-auto items-center"
            onSubmit={handleSubmitMessage}
          >
            <div className="relative">
              <Input
                ref={messageRef}
                type="text"
                placeholder={
                  user
                    ? '메시지 보내기...'
                    : '향그리움의 가족만 이용할 수 있어요'
                }
                className="pr-12 rounded-xl border border-primary-strong placeholder:text-label-assistive mt-3 mb-1 text-base bg-[#FEFEFE] md:mt-4"
                disabled={!user}
                aria-label="메시지 입력"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={!user}
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

export default SendChat;
