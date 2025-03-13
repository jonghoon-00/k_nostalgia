'use client';

import { Tables } from '@/types/supabase';
import React, { useEffect, useState } from 'react';

const AdminReportChatHistory = () => {
  const [reportChat, setReportChat] = useState<Tables<'chat'>[] | null>(null);

  useEffect(() => {
    const getReportedChat = async () => {
      const response = await fetch('/api/chat/admin');
      const { data } = await response.json();
      console.log(data);
      setReportChat(data);
    };
    getReportedChat();
  }, []);

  return (
    <div className="border border-red-500 m-10">
      <h1>신고. 채팅. 내역. 심한 내용은. 그냥 바로. 삭제시킬 것임.</h1>
      <hr />
      {reportChat?.map((item, index) => (
        <div className="border p-2 gap-1" key={index}>
          <div>신고됐다! : {item.isReported ? '신고됨' : '신고되지 않음'}</div>
          <div>신고된 아이디 : {item.user_id}</div>
          <div>신고된 채팅방 : {item.room_id}</div>
          <div>신고된 내용 : {item.content}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminReportChatHistory;
