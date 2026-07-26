-- =======================================================
-- JALEELO PORTFOLIO PREMIUM GUESTBOOK DATABASE SCHEMA
-- PENDING APPROVAL & ADMIN MODERATION SYSTEM
-- =======================================================

-- 1. Create guestbook_entries table with approved column defaulting to false
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL,
  company VARCHAR(100),
  linkedin VARCHAR(255),
  country VARCHAR(50) DEFAULT 'Unknown',
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure approved column exists if table was created previously
ALTER TABLE public.guestbook_entries ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies if re-applying
DROP POLICY IF EXISTS "Allow public insert pending guestbook" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Allow public read approved guestbook" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Allow select all guestbook entries" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Allow insert pending guestbook entries" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Allow update guestbook entries" ON public.guestbook_entries;
DROP POLICY IF EXISTS "Allow delete guestbook entries" ON public.guestbook_entries;

-- 3. RLS Policy: Allow Public to submit entries with approved = false
CREATE POLICY "Allow insert pending guestbook entries" ON public.guestbook_entries
  FOR INSERT WITH CHECK (approved = false OR status = 'pending');

-- 4. RLS Policy: Allow Reading all entries (including approved = false for pending moderation list)
CREATE POLICY "Allow select all guestbook entries" ON public.guestbook_entries
  FOR SELECT USING (true);

-- 5. RLS Policy: Allow Updating entries (for admin approval & editing)
CREATE POLICY "Allow update guestbook entries" ON public.guestbook_entries
  FOR UPDATE USING (true);

-- 6. RLS Policy: Allow Deleting entries (for admin moderation)
CREATE POLICY "Allow delete guestbook entries" ON public.guestbook_entries
  FOR DELETE USING (true);

-- 7. Enable Realtime Subscriptions for immediate admin dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook_entries;
