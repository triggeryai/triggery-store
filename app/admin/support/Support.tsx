// app/admin/support/Support.tsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { FaSync } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const AdminSupport = () => {
  const { data: session } = useSession();
  const { data, error, mutate } = useSWR('/api/get-messages', fetcher);
  const { data: statusData, error: statusError, mutate: mutateStatus } = useSWR('/api/support-status', fetcher);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: string, message: string }[]>([]);
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBotOff, setIsBotOff] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data && !error) {
      const uniqueSenders = Array.from(new Set(data.data.map((msg: any) => msg.sender !== 'admin' ? msg.sender : msg.recipient)));
      if (uniqueSenders.length > 0) {
        setSelectedSender(uniqueSenders[0]);
        const userMessages = data.data.filter((msg: any) => msg.sender === uniqueSenders[0] || msg.recipient === uniqueSenders[0]);
        setMessages(userMessages.reverse());  // Reverse the order of messages
      }
    }
  }, [data, error]);

  useEffect(() => {
    if (statusData && !statusError) {
      setIsBotOff(statusData.isOff);
    }
  }, [statusData, statusError]);

  const handleSenderClick = (sender: string) => {
    setSelectedSender(sender);
    const userMessages = data.data.filter((msg: any) => msg.sender === sender || msg.recipient === sender);
    setMessages(userMessages.reverse());  // Reverse the order of messages
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
      scrollToBottom();
    } else {
      console.error('Failed to send reply');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    await mutateStatus();
    setIsRefreshing(false);
  };

  const handleBotToggle = async () => {
    const response = await fetch('/api/admin/support', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isOff: !isBotOff }),
    });

    if (response.ok) {
      setIsBotOff(!isBotOff);
      await mutateStatus();
      toast.success(`Chat bot ${isBotOff ? 'enabled' : 'disabled'}`);
    } else {
      console.error('Failed to toggle bot status');
      toast.error('Failed to toggle bot status');
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!session?.user.isAdmin) {
    return <p className="text-center text-gray-600">You do not have access to this page.</p>;
  }

  if (error || statusError) return <div>Failed to load</div>;
  if (!data || !statusData) return <div>Loading...</div>;

  const uniqueSenders = Array.from(new Set(data.data.map((msg: any) => msg.sender !== 'admin' ? msg.sender : msg.recipient)));

  return (
    <div className="flex h-screen">
      <Toaster />
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
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          Messages
          <div className="flex items-center">
            <label htmlFor="bot-toggle" className="mr-2">Support Bot:</label>
            <input
              type="checkbox"
              id="bot-toggle"
              checked={!isBotOff}
              onChange={handleBotToggle}
              className="cursor-pointer"
            />
          </div>
        </h2>
        <div ref={messageContainerRef} className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${msg.sender === 'admin' ? 'bg-green-100' : 'bg-blue-100'}`}>
              <p className="font-semibold">{msg.sender}</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
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
