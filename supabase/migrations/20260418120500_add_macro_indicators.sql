CREATE TABLE IF NOT EXISTS macro_indicators (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  delta TEXT,
  direction SMALLINT DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE macro_indicators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read macro_indicators" ON macro_indicators;
CREATE POLICY "Public read macro_indicators" ON macro_indicators FOR SELECT USING (true);
