-- Bảng Messages cho Chat hệ thống
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT, -- Cho khách vãng lai (không log in)
  user_name TEXT, -- Capturing name for UI
  content TEXT NOT NULL,
  sender_role TEXT CHECK (sender_role IN ('user', 'admin', 'bot')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index nhanh cho việc load tin nhắn
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON public.messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Kích hoạt Realtime cho bảng này
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
