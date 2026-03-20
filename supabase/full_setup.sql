-- ========================================================
-- MH36 TRAVEL - FULL DATABASE SETUP (SUPABASE)
-- Copy toàn bộ nội dung này và dán vào SQL Editor trên Supabase
-- ========================================================

-- 1. THIẾT LẬP BẢNG NGƯỜI DÙNG (USERS)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG ĐIỂM ĐẾN (DESTINATIONS)
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG TOURS
CREATE TABLE IF NOT EXISTS public.tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'domestic',
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  price_adult NUMERIC NOT NULL,
  price_child NUMERIC,
  departure_location TEXT,
  description TEXT,
  itinerary JSONB,
  includes TEXT[],
  excludes TEXT[],
  images TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG ĐẶT TOUR (BOOKINGS)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  booking_date TIMESTAMPTZ DEFAULT NOW(),
  departure_date DATE NOT NULL,
  adult_count INTEGER NOT NULL DEFAULT 1,
  child_count INTEGER DEFAULT 0,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled', 'completed')),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'unpaid',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG TIN NHẮN (MESSAGES - CHAT SYSTEM)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT,
  user_name TEXT,
  content TEXT NOT NULL,
  sender_role TEXT CHECK (sender_role IN ('user', 'admin', 'bot')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON public.messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- 6. THIẾT LẬP STORAGE (BUCKET & POLICIES)
-- Lưu ý: Lệnh INSERT này có thể cần quyền cao hơn, nếu lỗi hãy tạo Bucket 'tours' thủ công
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tours', 'tours', true)
ON CONFLICT (id) DO NOTHING;

-- Xóa Policy cũ nếu có trước khi tạo mới để tránh lỗi
DROP POLICY IF EXISTS "Allow Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Read" ON storage.objects;

-- Policy cho phép Upload (INSERT)
CREATE POLICY "Allow Public Upload" ON storage.objects
FOR INSERT TO public WITH CHECK (bucket_id = 'tours');

-- Policy cho phép Xem ảnh (SELECT)
CREATE POLICY "Allow Public Read" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'tours');

-- 7. KÍCH HOẠT REALTIME
-- Kích hoạt Realtime cho bảng messages (Có kiểm tra trùng lặp)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;
END $$;

-- 8. KÍCH HOẠT RLS (ROW LEVEL SECURITY)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 9. QUY TẮC RLS CƠ BẢN (CHO PHÉP TRUY CẬP ĐỌC CÔNG KHAI)
DROP POLICY IF EXISTS "Allow Public Read Destinations" ON public.destinations;
DROP POLICY IF EXISTS "Allow Public Read Tours" ON public.tours;
DROP POLICY IF EXISTS "Allow Individual Insert Bookings" ON public.bookings;

CREATE POLICY "Allow Public Read Destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Allow Individual Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);
