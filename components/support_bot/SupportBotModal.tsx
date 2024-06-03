"use client";
import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSession } from 'next-auth/react';
import Fuse from 'fuse.js';
import './SupportBotModal.css';
import { FaTimes, FaSync } from 'react-icons/fa';

const SupportBotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: string, message: string }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLiveSupport, setShowLiveSupport] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const questions = [
    { question: 'How to buy?', answer: 'To buy a product, click on the "Buy" button and follow the instructions.' },
    { question: 'How to track my order?', answer: 'You can track your order by logging into your account and checking the "Orders" section.' },
    { question: 'What are the payment options?', answer: 'We accept credit cards, PayPal, and bank transfers.' },
    { question: 'How to return a product?', answer: 'To return a product, go to the "Returns" section and follow the instructions.' },
    { question: 'How to contact support?', answer: 'You can contact support by clicking on the "Contact Support" button and filling out the form.' },
    { question: 'What is the delivery time?', answer: 'Delivery time is typically between 3-5 business days.' },
    { question: 'How to change my account details?', answer: 'You can change your account details in the "Account Settings" section.' },
    { question: 'What are the shipping costs?', answer: 'Shipping costs depend on the weight and destination of the package.' },
    { question: 'How to use a discount code?', answer: 'You can use a discount code at checkout by entering it in the "Discount Code" field.' },
    { question: 'What is your privacy policy?', answer: 'You can read our privacy policy in the "Privacy Policy" section of our website.' }
  ];

  const fuse = new Fuse(questions, { keys: ['question'] });

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

  const handleQuestionClick = (question: string) => {
    const result = questions.find(q => q.question === question);
    if (result) {
      setSelectedQuestion(result.answer);
    }
  };

  return (
    <CSSTransition in={showModal} timeout={300} classNames="modal" unmountOnExit>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-auto z-10 flex flex-col" style={{ maxHeight: '80vh' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Support Bot</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <FaTimes size={20} />
            </button>
          </div>
          {session ? (
            <>
              {showLiveSupport ? (
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
                  <button onClick={() => setShowLiveSupport(false)} className="mt-4 w-full text-center py-2 bg-gray-500 text-white rounded-lg">Back to Questions</button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap overflow-y-auto" style={{ maxHeight: '50vh' }}>
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 p-2 m-1 cursor-pointer rounded-lg flex-shrink-0"
                        onClick={() => handleQuestionClick(q.question)}
                      >
                        #{q.question}
                      </div>
                    ))}
                  </div>
                  {selectedQuestion && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-y-auto" style={{ maxHeight: '30vh' }}>
                      <p>{selectedQuestion}</p>
                    </div>
                  )}
                  <button onClick={() => setShowLiveSupport(true)} className="mt-4 w-full text-center py-2 bg-blue-500 text-white rounded-lg">Contact with live support</button>
                </>
              )}
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
