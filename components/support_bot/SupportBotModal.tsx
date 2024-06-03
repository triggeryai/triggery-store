"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSession } from 'next-auth/react';
import './SupportBotModal.css';
import { FaTimes, FaSync } from 'react-icons/fa';

const SupportBotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: string, message: string }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      fetchChatHistory();
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(() => {
        fetchChatHistory();
      }, 60000); // Refresh every 60 seconds
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const fetchChatHistory = async () => {
    if (!session) return;
    const response = await fetch(`/api/get-messages?user=${session.user.name}`);
    if (response.ok) {
      const data = await response.json();
      setChatHistory(data.data);
      scrollToBottom();
    }
  };

  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;
    const newChatHistory = [...chatHistory, { sender: session?.user.name || 'user', message: userMessage }];
    setChatHistory(newChatHistory);
    setUserMessage('');
    setIsTyping(true);

    const response = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient: 'admin', message: userMessage }),
    });

    if (response.ok) {
      setChatHistory([...newChatHistory, { sender: session.user.name, message: userMessage }]);
      await fetchChatHistory(); // Fetch updated chat history including admin replies
      scrollToBottom();
    } else {
      setChatHistory([...newChatHistory, { sender: 'bot', message: 'Failed to send your message. Please try again later.' }]);
      scrollToBottom();
    }
    setIsTyping(false);
  };

  const handleUserMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchChatHistory();
    setIsRefreshing(false);
    scrollToBottom();
  };

  return (
    <CSSTransition in={showModal} timeout={300} classNames="modal" unmountOnExit>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto z-10 flex flex-col" style={{ maxHeight: '80vh' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Support Bot</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <FaTimes size={20} />
            </button>
          </div>
          {session ? (
            <>
              <div className="flex justify-end mb-2">
                <button 
                  onClick={handleRefresh} 
                  className={`text-blue-500 hover:text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <FaSync />
                </button>
              </div>
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto mt-4 mb-4 chat-container">
                {chatHistory.slice().reverse().map((chat, index) => (
                  <div key={index} className={`message ${chat.sender === 'admin' ? 'admin' : 'user'}`}>
                    <div className="message-content">
                      <p>{chat.message}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message typing">
                    <div className="message-content">
                      <p>...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="text"
                  value={userMessage}
                  onChange={handleUserMessageChange}
                  className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                  placeholder="Type your message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">Please log in to chat with the support bot.</p>
          )}
          <button onClick={onClose} className="mt-4 w-full text-center py-2 bg-red-500 text-white rounded-lg">Close</button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SupportBotModal;
