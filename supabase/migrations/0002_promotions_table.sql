-- CREATE PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  discount_value NUMERIC NOT NULL,
  discount_type TEXT DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'expired')),
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Public Read Promotions" ON public.promotions;
CREATE POLICY "Allow Public Read Promotions" ON public.promotions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow Admin All Promotions" ON public.promotions;
CREATE POLICY "Allow Admin All Promotions" ON public.promotions FOR ALL USING (true);
