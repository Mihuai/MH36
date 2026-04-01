"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Send, Image as ImageIcon, Smile, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeChatInfo, setActiveChatInfo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Chat List (Sessions)
  useEffect(() => {
    async function fetchChatList() {
      if (!supabase) return;
      
      // Get messages ordered by date
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching chat list:", error);
      } else {
        // Group by session_id/user_id to create a unique chat list
        const uniqueChatsMap = new Map<string, any>();
        
        data.forEach((m: any) => {
          const key = m.session_id || m.user_id;
          if (!key) return; // Skip invalid messages
          
          if (!uniqueChatsMap.has(key)) {
            uniqueChatsMap.set(key, {
              sessionId: m.session_id,
              userId: m.user_id,
              name: m.user_name || (m.user_id ? 'Người dùng hệ thống' : 'Khách vãng lai'),
              lastMessage: m.content,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: m.is_read ? 0 : 1,
              status: "online",
              createdAt: m.created_at
            });
          }
        });

        const uniqueChats = Array.from(uniqueChatsMap.values());
        
        // Fetch real names for user_id based chats
        const userIds = uniqueChats.filter(c => c.userId).map(c => c.userId);
        if (userIds.length > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, full_name, avatar_url')
            .in('id', userIds);
          
          if (usersData) {
            usersData.forEach(u => {
              uniqueChats.forEach(c => {
                if (c.userId === u.id && u.full_name) {
                  c.name = u.full_name;
                  c.avatar = u.avatar_url;
                }
              });
            });
          }
        }

        setChats(uniqueChats);
        if (uniqueChats.length > 0 && !activeSessionId) {
          setActiveSessionId(uniqueChats[0].sessionId || uniqueChats[0].userId);
          setActiveChatInfo(uniqueChats[0]);
        }
      }
      setIsLoading(false);
    }

    fetchChatList();

    // Subscribe to new messages for the chat list update
    const channel = supabase?.channel('chat-list-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        fetchChatList(); // Refresh list on new message
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel as any);
    };
  }, []);

  // 2. Fetch messages for active chat
  useEffect(() => {
    async function fetchMessages() {
      if (!activeSessionId || !supabase) return;
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`session_id.eq.${activeSessionId},user_id.eq.${activeSessionId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
    }

    fetchMessages();

    // Subscribe to messages for this active session
    const channel = supabase?.channel(`session-${activeSessionId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `session_id=eq.${activeSessionId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase?.removeChannel(channel as any);
    };
  }, [activeSessionId]);

  // 3. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeSessionId || !supabase) return;
    
    const newMsg = {
      session_id: activeChatInfo.sessionId,
      user_id: activeChatInfo.userId,
      user_name: activeChatInfo.name,
      content: message,
      sender_role: 'admin',
      is_read: true
    };

    const { error } = await supabase.from('messages').insert(newMsg);
    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessage('');
    }
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center p-20"><p className="text-muted-foreground animate-pulse">Đang tải hộp thư hỗ trợ...</p></div>;
  }

  return (
    <div className="h-[calc(100vh-80px)] flex bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
      
      {/* Sidebar: Chat List */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-muted/5">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-primary">Hỗ trợ trực tuyến</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm khách hàng..." className="pl-9 bg-background h-10 rounded-xl shadow-sm border-border/50" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Chưa có hội thoại nào.</div>
          ) : (
            chats.map((chat) => (
              <div 
                key={chat.sessionId || chat.userId} 
                onClick={() => {
                  setActiveSessionId(chat.sessionId || chat.userId);
                  setActiveChatInfo(chat);
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 border-b border-border/50 transition-colors ${activeSessionId === (chat.sessionId || chat.userId) ? 'bg-primary/10 border-r-2 border-r-primary' : ''}`}
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-sm text-sm uppercase">
                    {chat.name.charAt(0)}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold truncate text-[13px]">{chat.name}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{chat.time}</span>
                  </div>
                  <p className="text-xs truncate text-muted-foreground max-w-[140px] italic">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background/30 backdrop-blur-sm">
        {activeChatInfo ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                  {activeChatInfo.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[15px]">{activeChatInfo.name}</h3>
                  <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ĐANG TRỰC TUYẾN
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[11px] font-semibold text-primary border-primary/20 hover:bg-primary/5">ĐÓNG HỘI THOẠI</Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted rounded-full w-8 h-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              {messages.map((msg, idx) => {
                const isMe = msg.sender_role === 'admin' || msg.sender_role === 'bot';
                return (
                  <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex gap-2.5 max-w-[75%] items-end">
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                          {activeChatInfo.name.charAt(0)}
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1">
                        <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[14px] leading-relaxed relative ${
                          msg.sender_role === 'admin' ? 'bg-primary text-primary-foreground rounded-br-none' : 
                          msg.sender_role === 'bot' ? 'bg-indigo-600 text-white rounded-br-none' :
                          'bg-card border border-border rounded-bl-none text-foreground'
                        }`}>
                          {msg.sender_role === 'bot' && (
                             <span className="absolute -top-2.5 -right-2 bg-indigo-100 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md border border-indigo-200 shadow-sm">AI BOT</span>
                          )}
                          {msg.content}
                        </div>
                        <span className={`text-[9px] text-muted-foreground font-semibold px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {msg.sender_role === 'admin' ? 'Bạn (Admin) • ' : ''}{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                      placeholder="Nhập nội dung tư vấn..." 
                      className="bg-muted/30 border-border focus-visible:ring-1 focus-visible:ring-primary shadow-inner rounded-full px-5 h-11 text-sm font-medium"
                    />
                 </div>
                 <Button type="submit" disabled={!message.trim()} className="rounded-full w-11 h-11 shadow-lg shrink-0 p-0 ml-1 bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4 ml-0.5" />
                 </Button>
              </form>
              <div className="flex justify-center mt-3">
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">Kênh nội bộ • MH36 TRAVEL Support</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-10 text-center animate-in fade-in duration-500">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
               <UserIcon className="w-8 h-8 opacity-20" />
             </div>
             <p className="font-semibold text-sm">Chọn một khách hàng để bắt đầu tư vấn trực tiếp</p>
             <p className="text-xs max-w-xs mt-2 opacity-70">Toàn bộ lịch sử trao đổi giữa khách hàng và AI đều được hiển thị để bạn có thông tin đầy đủ nhất.</p>
          </div>
        )}
      </div>
    </div>
  );
}
