"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback
import { CSSTransition } from 'react-transition-group';
import { useSession } from 'next-auth/react';
import Fuse from 'fuse.js';
import { FaTimes, FaSync } from 'react-icons/fa';
import './SupportBotModal.css';

const SupportBotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ sender: string, message: string }[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLiveSupport, setShowLiveSupport] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [isSupportOff, setIsSupportOff] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const questions = [
    { question: 'Jak kupić?', answer: 'Aby kupić produkt, kliknij przycisk "Kup" i postępuj zgodnie z instrukcjami.' },
    { question: 'Jak śledzić moje zamówienie?', answer: 'Możesz śledzić swoje zamówienie, logując się na swoje konto i sprawdzając sekcję "Zamówienia".' },
    { question: 'Jakie są opcje płatności?', answer: 'Akceptujemy karty kredytowe, PayPal i przelewy bankowe.' },
    { question: 'Jak zwrócić produkt?', answer: 'Aby zwrócić produkt, przejdź do sekcji "Zwroty" i postępuj zgodnie z instrukcjami.' },
    { question: 'Jak skontaktować się z pomocą techniczną?', answer: 'Możesz skontaktować się z pomocą techniczną, klikając przycisk "Kontakt z pomocą" i wypełniając formularz.' },
    { question: 'Jaki jest czas dostawy?', answer: 'Czas dostawy wynosi zazwyczaj od 3 do 5 dni roboczych.' },
    { question: 'Jak zmienić dane mojego konta?', answer: 'Możesz zmienić dane swojego konta w sekcji "Ustawienia konta".' },
    { question: 'Jakie są koszty wysyłki?', answer: 'Koszty wysyłki zależą od wagi i miejsca docelowego paczki.' },
    { question: 'Jak użyć kodu rabatowego?', answer: 'Możesz użyć kodu rabatowego podczas realizacji zamówienia, wpisując go w pole "Kod rabatowy".' },
    { question: 'Jaka jest wasza polityka prywatności?', answer: 'Naszą politykę prywatności możesz przeczytać w sekcji "Polityka prywatności" na naszej stronie internetowej.' }
  ];

  const fuse = new Fuse(questions, { keys: ['question'] });

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      checkSupportStatus();
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  const checkSupportStatus = async () => {
    try {
      const response = await fetch('/api/support-status');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setIsSupportOff(data.isOff);
    } catch (error) {
      console.error('Failed to fetch support status:', error);
      setIsSupportOff(true);  // Assuming default to off if there's an error
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const fetchChatHistory = useCallback(async () => {
    if (!session) return;
    const response = await fetch(`/api/get-messages?user=${session.user.name}`);
    if (response.ok) {
      const data = await response.json();
      setChatHistory(data.data);
      scrollToBottom();
    }
  }, [session]); // Memoized with session as a dependency

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      interval = setInterval(() => {
        fetchChatHistory();
      }, 60000); // Refresh every 60 seconds
    }
    return () => clearInterval(interval);
  }, [isOpen, fetchChatHistory]); // Added fetchChatHistory to the dependency array

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
      setChatHistory([...newChatHistory, { sender: 'bot', message: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.' }]);
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

  if (isSupportOff) {
    return (
      <CSSTransition in={showModal} timeout={300} classNames="modal" unmountOnExit>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
          <div className="bg-white dark:bg-gray-800 text-black rounded-lg shadow-lg p-6 max-w-md w-full mx-auto z-10 flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black">Bot Wsparcia</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <FaTimes size={20} />
              </button>
            </div>
            <p className="text-center text-gray-600">Bot wsparcia jest obecnie wyłączony. Spróbuj ponownie później.</p>
            <button onClick={onClose} className="mt-4 w-full text-center py-2 bg-red-500 text-white rounded-lg">Zamknij</button>
          </div>
        </div>
      </CSSTransition>
    );
  }

  return (
    <CSSTransition in={showModal} timeout={300} classNames="modal" unmountOnExit>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white dark:bg-gray-800 text-black rounded-lg shadow-lg p-6 max-w-md w-full mx-auto z-10 flex flex-col" style={{ maxHeight: '80vh' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Bot Wsparcia</h2>
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
                        <div className="message-content text-black">
                          <p>{chat.message}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="message typing">
                        <div className="message-content text-black">
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
                      className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 text-black"
                      placeholder="Wpisz swoją wiadomość..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                    />
                    <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Wyślij</button>
                  </div>
                  <button onClick={() => setShowLiveSupport(false)} className="mt-4 w-full text-center py-2 bg-gray-500 text-white rounded-lg">Powrót do pytań</button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap overflow-y-auto" style={{ maxHeight: '50vh' }}>
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 p-2 m-1 cursor-pointer rounded-lg flex-shrink-0 text-black"
                        onClick={() => handleQuestionClick(q.question)}
                      >
                        #{q.question}
                      </div>
                    ))}
                  </div>
                  {selectedQuestion && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-y-auto" style={{ maxHeight: '30vh' }}>
                      <p className="text-black">{selectedQuestion}</p>
                    </div>
                  )}
                  <button onClick={() => setShowLiveSupport(true)} className="mt-4 w-full text-center py-2 bg-blue-500 text-white rounded-lg">Kontakt z pomocą na żywo</button>
                </>
              )}
            </>
          ) : (
            <p className="text-center text-gray-600">Zaloguj się, aby rozmawiać z botem wsparcia.</p>
          )}
          <button onClick={onClose} className="mt-4 w-full text-center py-2 bg-red-500 text-white rounded-lg">Zamknij</button>
        </div>
      </div>
    </CSSTransition>
  );
};

export default SupportBotModal;
