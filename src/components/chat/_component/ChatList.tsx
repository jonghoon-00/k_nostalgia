'use client';

import { Tables } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import Image from 'next/image';
import { BsChevronRight } from 'react-icons/bs';
import WarningChat from './WarningChat';
import ChatQnA from './ChatQnA';

const ChatList = ({
  setSelectedChatRoom
}: {
  setSelectedChatRoom: React.Dispatch<
    React.SetStateAction<Tables<'rooms'> | null>
  >;
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [showQnA, setShowQnA] = useState(false);

  const fetchChatListData = async () => {
    const response = await fetch(`/api/chat/chat-list`);
    const { data } = await response.json();
    return data;
  };

  const { data } = useQuery<Tables<'rooms'>[]>({
    queryKey: ['chatList'],
    queryFn: fetchChatListData
  });

  const handleRoom = (item: Tables<'rooms'> | null): void => {
    setSelectedChatRoom(item);
  };

  useEffect(() => {
    const hasChater = sessionStorage.getItem('visitedChat');
    if (!hasChater) {
      setShowWarning(true);
      sessionStorage.setItem('visitedChat', 'true');
    }
  }, []);

  return (
    <DialogContent className="bg-normal rounded-2xl w-[330px] h-[627px] md:w-[479px] md:h-[710px]">
      <div className="border-b-2 w-[calc(100%+32px)] -mx-4">
        <DialogHeader>
          <DialogTitle className="flex pt-3 px-3 pb-2 font-semibold text-lg leading-[28.8px] items-center justify-center">
            실시간 채팅
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </div>

      <div className="flex flex-col pt-4 h-[509px] flex-1 gap-3 md:gap-4 md:pt-6 md:h-[585px] md:px-2">
        {data?.map((item) => (
          <div
            key={item.room_id}
            className="flex border py-4 pl-4 pr-3 rounded-xl gap-1 cursor-pointer shadow-chatCustom justify-between bg-[#FFF]"
            onClick={() => handleRoom(item)}
          >
            <div className="flex md:py-1">
              <Image
                src={item.room_img}
                width={48}
                height={48}
                alt={item.chat_name}
                className="w-12 h-12"
              />
              <div className="ml-2 flex flex-col justify-center md:ml-3">
                <div className="font-medium text-base leading-[22.4px]">
                  {item.chat_name}
                </div>
                <div className="font-normal text-sm leading-[19.6px] text-label-alternative overflow-ellipsis">
                  {item.chat_description}
                </div>
              </div>
            </div>
            <div className="flex justify-center p-3">
              <BsChevronRight className="w-[22px] h-[22px]" />
            </div>
          </div>
        ))}
        {/* 버튼 느낌 */}
        <div
          onClick={() => setShowQnA(true)}
          className="flex border py-4 pl-4 pr-3 rounded-xl gap-1 cursor-pointer shadow-chatCustom justify-between bg-[#FFF]"
        >
          <div className="flex md:py-1">
            <div
              // width={48}
              // height={48}
              // alt="QnA버튼"
              className="w-12 h-12"
            />
            <div className="ml-2 flex flex-col justify-center md:ml-3">
              <div className="font-medium text-base leading-[22.4px]">챗봇 상담</div>
              <div className="font-normal text-sm leading-[19.6px] text-label-alternative overflow-ellipsis">
                궁금한 내용이 있으신가요?
              </div>
            </div>
          </div>
          <div className="flex justify-center p-3">
            <BsChevronRight className="w-[22px] h-[22px]" />
          </div>
        </div>
        {showQnA && <ChatQnA setShowQnA={setShowQnA} />}
      </div>
      {/* 이용시 주의사항 */}
      <div
        onClick={() => setShowWarning(true)}
        className="underline text-nowrap text-center text-sm text-label-alternative font-medium leading-[19.6px] cursor-pointer pb-10 md:pb-12"
      >
        채팅방 이용시 주의사항
      </div>
      {showWarning && <WarningChat setShowWarning={setShowWarning} />}
    </DialogContent>
  );
};

export default ChatList;
