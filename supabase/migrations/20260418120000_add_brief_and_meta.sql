-- Brief data + post meta for simulator_type, key_stat, framework
ALTER TABLE posts ADD COLUMN IF NOT EXISTS brief_data JSONB;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS posts_brief_data_idx ON posts USING gin (brief_data);
CREATE INDEX IF NOT EXISTS posts_meta_idx ON posts USING gin (meta);
