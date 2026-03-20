"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const SUGGESTIONS = [
  "Tour Đà Nẵng giá bao nhiêu?",
  "Lịch trình tour Phú Quốc?",
  "Thanh toán qua VNPay thế nào?",
  "Cần hỗ trợ từ nhân viên (Admin)"
];

export default function ChatbotWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Xin chào! Tôi là AI Trợ lý du lịch của MH36 TRAVEL. Bạn cần tư vấn về điểm đến hay tour nào?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string>("");

  // Initialize Session ID and Load History
  useEffect(() => {
    let sid = localStorage.getItem("mh36_chat_session");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("mh36_chat_session", sid);
    }
    setSessionId(sid);

    // Fetch History from Supabase
    const fetchHistory = async () => {
      if (!supabase || !sid) return;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`session_id.eq.${sid}${user?.id ? `,user_id.eq.${user.id}` : ''}`)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted = data.map(m => ({
          role: m.sender_role === 'user' ? 'user' : 'assistant',
          content: m.content,
          isFromAdmin: m.sender_role === 'admin'
        }));
        setMessages([
          { role: "assistant", content: "Xin chào! Tôi là AI Trợ lý du lịch của MH36 TRAVEL. Bạn cần tư vấn về điểm đến hay tour nào?" },
          ...formatted
        ]);
      }
    };

    fetchHistory();
  }, [user]);

  // Real-time listener for Admin/Bot replies
  useEffect(() => {
    if (!supabase || !sessionId || !isOpen) return;

    const channel = supabase.channel(`customer-chat-${sessionId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        const newMsg = payload.new;
        // Only care about messages TO user (from bot or admin) for this session
        const isTarget = (newMsg.session_id === sessionId || (user?.id && newMsg.user_id === user.id));
        const isFromStaff = (newMsg.sender_role === 'bot' || newMsg.sender_role === 'admin');
        
        if (isTarget && isFromStaff) {
          setMessages(prev => {
            // Check if message ID already exists to avoid duplication
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, { 
              id: newMsg.id,
              role: 'assistant', 
              content: newMsg.content, 
              isFromAdmin: newMsg.sender_role === 'admin' 
            }];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, isOpen, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;
    
    const userMessage = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].slice(-5), 
          sessionId: sessionId,
          userId: user?.id,
          userName: user?.name
        })
      });

      if (!response.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: "Xin lỗi, hiện tại tôi đang quá tải. Bạn vui lòng liên hệ Hotline nhé!" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Hệ thống đang gặp sự cố mạng!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground flex items-center justify-center z-50 hover:scale-105 transition-transform p-0 border-none cursor-pointer"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[580px] bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground shadow-md">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <div>
                <h3 className="font-bold text-[14px]">Hỗ trợ MH36 TRAVEL</h3>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Trực tuyến 24/7
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors border-none bg-transparent cursor-pointer text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className="flex flex-col gap-1 max-w-[85%]">
                  {msg.isFromAdmin && (
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 mb-1">
                       NHÂN VIÊN HỖ TRỢ
                    </span>
                  )}
                  <div className={`rounded-2xl px-4 py-2.5 text-[14px] shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-card border border-border rounded-tl-none text-foreground'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}

            {!isLoading && messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s, idx) => (
                  <button key={idx} onClick={() => handleSend(s)} className="text-[11px] bg-background border border-primary/20 hover:border-primary px-3 py-1.5 rounded-full shadow-sm text-primary font-medium transition-colors cursor-pointer">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border bg-card">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Nhập câu hỏi..." 
                className="flex-1 bg-muted/50 rounded-full px-4 h-11 border border-transparent focus:border-primary outline-none transition-all text-sm" 
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="rounded-full h-11 w-11 bg-primary text-white flex items-center justify-center border-none cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
