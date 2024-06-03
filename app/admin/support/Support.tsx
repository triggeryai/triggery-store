// app/admin/support/Support.tsx
"use client";
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { FaSync } from 'react-icons/fa';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const AdminSupport = () => {
  const { data: session } = useSession();
  const { data, error, mutate } = useSWR('/api/get-messages', fetcher);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string, message: string }[]>([]);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (data && !error) {
      const uniqueSenders = Array.from(new Set(data.data.map((msg: any) => msg.sender !== 'admin' ? msg.sender : msg.recipient)));
      if (uniqueSenders.length > 0) {
        setSelectedSender(uniqueSenders[0]);
        const userMessages = data.data.filter((msg: any) => msg.sender === uniqueSenders[0] || msg.recipient === uniqueSenders[0]);
        setMessages(userMessages);
      }
    }
  }, [data, error]);

  const handleSenderClick = (sender: string) => {
    setSelectedSender(sender);
    const userMessages = data.data.filter((msg: any) => msg.sender === sender || msg.recipient === sender);
    setMessages(userMessages);
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyMessage(e.target.value);
  };

  const handleSendReply = async () => {
    if (!selectedSender || replyMessage.trim() === '') return;

    const response = await fetch('/api/reply-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient: selectedSender, message: replyMessage }),
    });

    if (response.ok) {
      const updatedMessages = [...messages, { sender: 'admin', message: replyMessage }];
      setMessages(updatedMessages);
      setReplyMessage('');
    } else {
      console.error('Failed to send reply');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  if (!session?.user.isAdmin) {
    return <p className="text-center text-gray-600">You do not have access to this page.</p>;
  }

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const uniqueSenders = Array.from(new Set(data.data.map((msg: any) => msg.sender !== 'admin' ? msg.sender : msg.recipient)));

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          Support Inbox
          <button 
            onClick={handleRefresh} 
            className={`text-blue-500 hover:text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <FaSync />
          </button>
        </h2>
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
          <div key={index} className={`mb-2 p-2 rounded ${msg.sender === 'admin' ? 'bg-green-100' : 'bg-blue-100'}`}>
            <p className="font-semibold">{msg.sender}</p>
            <p>{msg.message}</p>
          </div>
        ))}
        <div className="mt-4">
          <input
            type="text"
            value={replyMessage}
            onChange={handleReplyChange}
            className="border border-gray-300 rounded-lg p-2 mr-2 w-full"
            placeholder="Type your reply..."
          />
          <button onClick={handleSendReply} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">Send Reply</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
