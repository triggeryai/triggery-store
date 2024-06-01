// components\support_bot\SupportBotModal.tsx
"use client"
import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './SupportBotModal.css';
import { FaTimes } from 'react-icons/fa';
import Fuse from 'fuse.js';

const SupportBotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: string, message: string }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isContactingWorker, setIsContactingWorker] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const questionsAndAnswers = [
    { question: 'How to buy?', answer: "To buy a product, navigate to the 'Buy something' section and add items to your cart." },
    { question: 'Where is the shop?', answer: "Our shop is located at Wrocławska 29, Dzierzoniow, Poland." },
    { question: 'Contact information', answer: "You can contact us at biuro.domestico@gmail.com." },
    { question: 'What are the opening hours?', answer: "Our shop is open from 9 AM to 6 PM from Monday to Friday." },
    { question: 'Do you offer home delivery?', answer: "Yes, we offer home delivery within 50 km of our shop." },
    { question: 'Are there any discounts?', answer: "We offer seasonal discounts and promotions. Check our website for the latest offers." },
    { question: 'What brands do you carry?', answer: "We carry a variety of leading brands in cleaning products, including ABC, XYZ, and more." },
    { question: 'How can I track my order?', answer: "You can track your order status in the 'My Orders' section of your account." },
    { question: 'Can I return a product?', answer: "Yes, you can return products within 30 days of purchase. Please refer to our Return Policy for details." }
  ];

  const fuse = new Fuse(questionsAndAnswers, {
    keys: ['question'],
    includeScore: true,
    threshold: 0.4,
  });

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setChatHistory([{ sender: 'bot', message: 'Hello! What is the problem?' }]);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;
    const newChatHistory = [...chatHistory, { sender: 'user', message: userMessage }];
    setChatHistory(newChatHistory);
    setUserMessage('');
    setIsTyping(true);

    if (isContactingWorker) {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: userEmail, recipient: 'admin', message: userMessage }),
      });
      
      if (response.ok) {
        setChatHistory([...newChatHistory, { sender: 'bot', message: 'Your message has been sent to the shop worker. They will reply shortly.' }]);
      } else {
        setChatHistory([...newChatHistory, { sender: 'bot', message: 'Failed to send your message. Please try again later.' }]);
      }
      setIsTyping(false);
    } else {
      const botResponse = getBotResponse(userMessage);
      setTimeout(() => {
        setIsTyping(false);
        setChatHistory([...newChatHistory, { sender: 'bot', message: botResponse }]);
      }, 2000);
    }
  };

  const getBotResponse = (message: string) => {
    const result = fuse.search(message.toLowerCase());
    if (result.length > 0 && result[0].score !== undefined && result[0].score <= 0.4) {
      return result[0].item.answer;
    }
    return "I'm sorry, I don't understand the question.";
  };

  const handleUserMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };

  const handleToggleChatMode = () => {
    setIsContactingWorker(!isContactingWorker);
    setChatHistory([{ sender: 'bot', message: `You are now chatting with a ${!isContactingWorker ? 'shop worker' : 'support bot'}. How can we assist you today?` }]);
  };

  return (
    <CSSTransition
      in={showModal}
      timeout={300}
      classNames="modal"
      unmountOnExit
    >
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto z-10 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Support Bot</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <FaTimes size={20} />
            </button>
          </div>
          <button
            onClick={handleToggleChatMode}
            className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
          >
            {isContactingWorker ? 'Chat with Support Bot' : 'Contact Shop Worker'}
          </button>
          <div className="flex-1 overflow-y-auto mt-4 mb-4" style={{ maxHeight: '400px' }}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex ${chat.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`bg-${chat.sender === 'bot' ? 'blue-100' : 'green-100'} rounded-lg p-2 m-2 max-w-xs`}>
                  <p className="text-sm text-gray-800">{chat.message}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-blue-100 rounded-lg p-2 m-2 max-w-xs">
                  <p className="text-sm text-gray-800">...</p>
                </div>
              </div>
            )}
            <div ref={messageEndRef}></div>
          </div>
          {isContactingWorker && (
            <input
              type="email"
              value={userEmail}
              onChange={handleUserEmailChange}
              className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
              placeholder="Enter your email"
            />
          )}
          <div className="flex items-center">
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
          <button onClick={onClose} className="mt-4 w-full text-center py-2 bg-red-500 text-white rounded-lg">Close</button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SupportBotModal;
