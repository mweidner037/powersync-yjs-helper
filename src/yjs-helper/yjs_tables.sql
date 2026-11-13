CREATE TABLE yjs_updates(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID,
  update_data BYTEA,
  -- For updates that are too large to fit in one row. Usually just 0/1.
  fragment_index INTEGER,
  fragment_count INTEGER
  -- TODO: columns to help us figure out if we’re missing a snapshot
  -- and need to fetch it?
  -- I don’t think we need metadata about initiating user, creation time,
  -- etc. given that these updates are ephemeral anyway.
);
ALTER PUBLICATION powersync ADD TABLE yjs_updates;

CREATE TABLE yjs_snapshots(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID,
  snapshot_data BYTEA,
  -- For snapshots that are too large to fit in one row.
  fragment_index INTEGER,
  fragment_count INTEGER
  -- TODO: columns with info about which updates are included?
  -- Order/timing info?
);
ALTER PUBLICATION powersync ADD TABLE yjs_snapshots;