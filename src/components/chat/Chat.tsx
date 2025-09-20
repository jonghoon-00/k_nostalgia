'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tables } from '@/types/supabase';
import { useScrollTopStore } from '@/zustand/useScrollTopStore';
import clsx from 'clsx';
import { useState } from 'react';
import { ChatIcon } from '../icons/ChatIcon';
import ChatList from './_component/ChatList';
import SendChat from './_component/SendChat';

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] =
    useState<Tables<'rooms'> | null>(null);

  const isAtTop = useScrollTopStore((s) => s.isAtTop);

  const handleDialogStateChange = (open: boolean) => {
    setIsOpen(open);
    setSelectedChatRoom(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogStateChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          onClick={() => setIsOpen(true)}
          className={clsx(
            'flex justify-center items-center',
            'transition-all duration-300 ease-in-out',
            // 최상단이면 살짝 아래로 내리면서(fade-out), 아니면 제자리(fade-in)
            isAtTop
              ? 'opacity-100 translate-y-9 pointer-events-none'
              : 'opacity-100 translate-y-0 pointer-events-auto'
          )}
        >
          <ChatIcon />
        </Button>
      </DialogTrigger>
      {!selectedChatRoom ? (
        <ChatList setSelectedChatRoom={setSelectedChatRoom} />
      ) : (
        <SendChat
          selectedChatRoom={selectedChatRoom}
          setSelectedChatRoom={setSelectedChatRoom}
          isOpen={isOpen}
        />
      )}
    </Dialog>
  );
}
