'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { ChatIcon } from '../icons/ChatIcon';
import ChatList from './_component/ChatList';
import { Tables } from '@/types/supabase';
import SendChat from './_component/SendChat';

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChatRoom, setSelectedChatRoom] =
    useState<Tables<'rooms'> | null>(null);

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
          className="flex justify-center items-center"
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
