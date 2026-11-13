# Yjs Helper

Usage instructions:

## 1. Create Tables

In your backend DB, create the two tables in `yjs_tables.sql`, alongside your other tables. You'll need your own (PowerSync-enabled) table for the document metadata, with one row per document.

Optional: add a foreign key to both `document_id` columns.

## 2. Create Sync Streams

In your PowerSync Sync Streams config, add the two streams in `yjs_sync_streams.yaml`, alongside your other sync streams. Fill in both TODOs with the _same_ query for document_ids to subscribe; we give an example assuming you have a `documents` table with an ID column.

## 3. Register Local Tables

Add our local PowerSync table definitions to your Schema:

```ts
import { yjsLocalTables } from '@/yjs-helper/ts';
import { Schema } from '@powersync/web';

export const AppSchema = new Schema({
  // Your other tables...

  ...yjsLocalTables()
});
```

## 4. Configure uploadData Helper

In your PowerSyncBackendConnector's `uploadData` function, before uploading `CrudEntry`s, process them with `batchYjsUpdates`. For example:

```ts
const batch = await database.getCrudBatch(200);
if (!batch) {
  return;
}
const crud = batchYjsUpdates(batch.crud);

// Now upload crud normally.
```

## 5. Create PowerSyncYjsProvider and Connect

TODO

- Create the PowerSyncYjsProvider with your document id
- If your sync rules use the `yjs_document_id` connection parameter like our sample, set it
