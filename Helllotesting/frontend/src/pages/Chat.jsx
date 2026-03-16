import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState(null);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.current = io(API_BASE_URL);
    socket.current.emit('register', user._id);

    socket.current.on('receiveMessage', (message) => {
      if (message.senderId === userId || message.receiverId === user._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user._id, userId]);

  useEffect(() => {
    fetchMessages();
    fetchReceiverDetails();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/api/messages/${userId}`, config);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };

  const fetchReceiverDetails = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);
      const specificUser = data.find(u => u._id === userId);
      if(specificUser) setReceiver(specificUser);
    } catch (error) {
      console.error('Error fetching user', error);
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${API_BASE_URL}/api/messages`, {
        receiverId: userId,
        text: newMessage
      }, config);

      socket.current.emit('sendMessage', {
        _id: data._id,
        sender: user._id,
        receiverId: userId,
        text: newMessage,
        createdAt: new Date().toISOString()
      });

      setMessages((prev) => [...prev, {
        _id: data._id,
        sender: user._id,
        text: newMessage,
        createdAt: new Date().toISOString()
      }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-100">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white px-4 sm:px-6 py-4 flex items-center gap-4 shadow-lg">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <img src={receiver?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiver?.name || 'user'}`} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/20 bg-white/15" />
          <div>
            <h2 className="font-bold text-lg leading-tight">{receiver ? receiver.name : 'Student'}</h2>
            {receiver?.skillsToTeach?.length > 0 && (
              <p className="text-primary-200 text-xs">Teaches: {receiver.skillsToTeach.slice(0, 3).join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No messages yet</p>
              <p className="text-slate-400 text-sm">Send the first message to start the conversation</p>
            </div>
          )}
          {messages.map((msg, idx) => {
            const isMe = msg.sender === user._id || msg.sender?._id === user._id;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] sm:max-w-[65%] px-4 py-3 rounded-2xl shadow-sm
                  ${isMe
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-md'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-md'}`}
                >
                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                  <span className={`text-[11px] mt-1.5 block ${isMe ? 'text-primary-200' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-3 rounded-xl font-semibold hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
