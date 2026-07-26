-- =======================================================
-- JALEELO PORTFOLIO REALTIME ANALYTICS DATABASE SCHEMA
-- PRIVACY-FIRST TELEMETRY SCHEMA (NO RAW PII / NO IP ADDR)
-- =======================================================

-- 1. Create page_views table
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID NOT NULL,
  is_returning BOOLEAN DEFAULT false,
  country VARCHAR(50) DEFAULT 'Unknown',
  referrer TEXT DEFAULT 'Direct',
  session_duration INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create project_views table
CREATE TABLE IF NOT EXISTS public.project_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_title VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Allow Anonymous Insert
CREATE POLICY "Allow public insert page_views" ON public.page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select page_views" ON public.page_views
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert project_views" ON public.project_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select project_views" ON public.project_views
  FOR SELECT USING (true);

-- 5. Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_views;
