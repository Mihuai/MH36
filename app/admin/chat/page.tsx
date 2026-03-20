"use client";

import { useState } from 'react';
import { Search, MoreVertical, Paperclip, Send, Image as ImageIcon, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const INITIAL_CHATS = [
  {
    id: 1,
    name: "Phitb199",
    avatar: "P",
    lastMessage: "Tôi muốn đi Hà Nội mức giá 2 triệu vào...",
    time: "Vừa xong",
    unread: 1,
    status: "online"
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    avatar: "N",
    lastMessage: "Chờ xác nhận thanh toán mã booking #MH123",
    time: "10:30",
    unread: 0,
    status: "offline"
  },
  {
    id: 3,
    name: "Khách vãng lai #492",
    avatar: "K",
    lastMessage: "Giá tour đi Phú Quốc vào dịp lễ 30/4 là bao...",
    time: "Hôm qua",
    unread: 0,
    status: "offline"
  }
];

export default function AdminChatPage() {
  const [activeChat, setActiveChat] = useState(INITIAL_CHATS[0]);
  const [message, setMessage] = useState('');
  
  // Dummy messages for the active conversation
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là AI Trợ lý của MH36 TRAVEL. Bạn đang tìm điểm đến nào?", sender: "bot", time: "09:00" },
    { id: 2, text: "tôi muốn đi hà nội mức giá 2 triệu vào ngày kia", sender: "user", time: "09:05" },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      text: message, 
      sender: "admin", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
      
      {/* Sidebar: Chat List */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-muted/5">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-xl font-bold tracking-tight mb-4">Hỗ trợ khách hàng</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm tin nhắn..." className="pl-9 bg-background h-10 rounded-xl shadow-sm border-border/50" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {INITIAL_CHATS.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 border-b border-border/50 transition-colors ${activeChat.id === chat.id ? 'bg-primary/5' : ''}`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${chat.id === 1 ? 'bg-indigo-500' : chat.id === 2 ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                  {chat.avatar}
                </div>
                {chat.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold truncate text-sm">{chat.name}</span>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate max-w-[160px] ${chat.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{chat.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background/50">
        {/* Chat Header */}
        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${activeChat.id === 1 ? 'bg-indigo-500' : activeChat.id === 2 ? 'bg-emerald-500' : 'bg-slate-400'}`}>
              {activeChat.avatar}
            </div>
            <div>
              <h3 className="font-bold">{activeChat.name}</h3>
              <p className="text-xs text-green-600 font-medium">Đang nhắn tin qua AI Widget</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="bg-muted px-3 py-1 rounded-full text-[11px] font-medium text-muted-foreground">Hôm nay</span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'bot' || msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex gap-2 max-w-[70%]">
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-700 font-bold shrink-0 mt-auto">P</div>
                )}
                
                <div className="flex flex-col gap-1">
                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.sender === 'admin' ? 'bg-primary text-primary-foreground rounded-br-sm' : 
                    msg.sender === 'bot' ? 'bg-primary/10 text-primary-foreground text-foreground border border-primary/20 rounded-br-sm relative' :
                    'bg-card border border-border rounded-bl-sm'
                  }`}>
                    {msg.sender === 'bot' && (
                       <span className="absolute -top-2.5 -right-2 bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 rounded-md border border-indigo-200">AI</span>
                    )}
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-muted-foreground font-medium ${msg.sender === 'user' ? 'text-left ml-1' : 'text-right mr-1'}`}>
                    {msg.sender === 'admin' ? 'Bạn (Admin) • ' : ''}{msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-2">
             <span className="text-xs text-muted-foreground bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full border border-yellow-200">
               Khách hàng đang chờ Admin phản hồi trực tiếp
             </span>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-card border-t border-border/50">
          <form onSubmit={handleSend} className="flex gap-2 items-center">
             <div className="flex gap-1 mr-2 text-muted-foreground">
               <Button type="button" variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Paperclip className="w-4 h-4" /></Button>
               <Button type="button" variant="ghost" size="icon" className="w-9 h-9 rounded-full"><ImageIcon className="w-4 h-4" /></Button>
               <Button type="button" variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Smile className="w-4 h-4" /></Button>
             </div>
             <div className="flex-1 relative">
                <Input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhắn tin với tư cách Quản trị viên..." 
                  className="bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary shadow-inner rounded-full px-5 h-11"
                />
             </div>
             <Button type="submit" disabled={!message.trim()} className="rounded-full w-11 h-11 shadow-md shrink-0 p-0 ml-1">
                <Send className="w-4 h-4 ml-0.5" />
             </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
