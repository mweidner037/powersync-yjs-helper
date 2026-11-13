# Yjs Helper

Usage instructions:

## 1. Create Tables

In your backend DB, create the two tables in `yjs_tables.sql`, alongside your other tables. You'll need your own (PowerSync-enabled) table for the document metadata, with one row per document.

Optional: add a foreign key to both `document_id` columns.

## 2. Create Sync Streams

In your PowerSync Sync Streams config, add the two streams in `yjs_sync_streams.yaml`, alongside your other sync streams. Fill in both TODOs with the _same_ query for document_ids to subscribe; we give an example assuming you have a `documents` table with an ID column.
