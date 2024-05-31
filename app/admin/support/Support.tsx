// app\admin\support\Support.tsx
"use client";
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const AdminSupport = () => {
  const { data, error } = useSWR('/api/get-messages?recipient=admin', fetcher);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string, message: string }[]>([]);

  useEffect(() => {
    if (data && !error) {
      const uniqueSenders = Array.from(new Set(data.data.map((msg: any) => msg.sender)));
      if (uniqueSenders.length > 0) {
        setSelectedSender(uniqueSenders[0]);
        setMessages(data.data.filter((msg: any) => msg.sender === uniqueSenders[0]));
      }
    }
  }, [data, error]);

  const handleSenderClick = (sender: string) => {
    setSelectedSender(sender);
    setMessages(data.data.filter((msg: any) => msg.sender === sender));
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const uniqueSenders = Array.from(new Set(data.data.map((msg: any) => msg.sender)));

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">Support Inbox</h2>
        {uniqueSenders.map(sender => (
          <div
            key={sender}
            className={`p-2 cursor-pointer ${selectedSender === sender ? 'bg-gray-300' : 'bg-gray-200'} mb-2`}
            onClick={() => handleSenderClick(sender)}
          >
            {sender}
          </div>
        ))}
      </div>
      <div className="w-3/4 bg-white p-4">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <p className="font-semibold">{msg.sender}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSupport;
