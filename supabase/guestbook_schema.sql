-- =======================================================
-- JALEELO PORTFOLIO PREMIUM GUESTBOOK DATABASE SCHEMA
-- PENDING APPROVAL & ADMIN MODERATION SYSTEM
-- =======================================================

-- 1. Create guestbook_entries table
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  linkedin VARCHAR(255),
  country VARCHAR(50) DEFAULT 'Unknown',
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: Allow Public to submit entries with 'pending' status
CREATE POLICY "Allow public insert pending guestbook" ON public.guestbook_entries
  FOR INSERT WITH CHECK (status = 'pending');

-- 4. RLS Policy: Allow Public to view 'approved' entries
CREATE POLICY "Allow public read approved guestbook" ON public.guestbook_entries
  FOR SELECT USING (status = 'approved');

-- 5. Enable Realtime Subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook_entries;
