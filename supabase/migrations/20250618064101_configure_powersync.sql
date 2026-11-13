
-- demo-specific setup
CREATE TABLE documents(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  title VARCHAR(255),
  created_at timestamptz DEFAULT now()
);
DROP PUBLICATION IF EXISTS powersync;
CREATE PUBLICATION powersync FOR TABLE documents, document;

-- TODO: Also run the SQL in yjs-helper/yjs_tables.sql