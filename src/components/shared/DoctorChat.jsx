import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export function DoctorChat({ patient }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Добрий день, як ваш самопочуття?', time: '10:30', isDoctor: true },
    { id: 2, text: 'Добрий день, поки що все добре, дякую', time: '10:32', isDoctor: false },
    { id: 3, text: 'Чудово, не забудьте про прийом у п\'ятницю', time: '10:33', isDoctor: true },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDoctor: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      setTimeout(() => {
        const chatContainer = document.querySelector('.messages-container');
        if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 50);
    }
  };

  return (
    <div className="flex flex-col h-full">

      <div className="messages-container flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isDoctor ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isDoctor 
                    ? 'bg-blue-100 rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs text-gray-500 text-right mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Написати повідомлення..."
            className="flex-1 border border-gray-300 bg-gray-100 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </form>
    </div>
  );
}