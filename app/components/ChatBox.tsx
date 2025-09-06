// components/Chat.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaSearch, FaUserPlus } from 'react-icons/fa';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

interface User {
  id: number;
  name: string;
  status: 'online' | 'offline';
  avatar: string;
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hey there! How are you?', sender: 'other', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, text: "I'm good, thanks! How about you?", sender: 'user', timestamp: new Date(Date.now() - 3500000) },
    { id: 3, text: "I'm doing great! Want to play some games later?", sender: 'other', timestamp: new Date(Date.now() - 3400000) },
  ]);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alex Johnson', status: 'online', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Sarah Miller', status: 'online', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Mike Thompson', status: 'offline', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Jessica Lee', status: 'online', avatar: 'https://i.pravatar.cc/150?img=4' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate reply after a short delay
    setTimeout(() => {
      const reply: Message = {
        id: messages.length + 2,
        text: "Thanks for your message! I'll get back to you soon.",
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg">
            <div className="flex items-center">
              <FaComments className="mr-2" />
              <h2 className="font-semibold">Chat</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-100 flex flex-col border-r border-gray-200">
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-2 top-2.5 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-8 pr-2 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer border-b border-gray-100"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="flex items-center justify-center p-2 text-sm text-blue-500 hover:bg-gray-200 border-t border-gray-200">
                <FaUserPlus className="mr-1" size={14} />
                Add Friend
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-3 bg-white">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-3 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-2">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 transition-colors"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <FaComments size={24} />
        </button>
      )}
    </div>
  );
}