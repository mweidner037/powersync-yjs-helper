import { yjsLocalTables } from '@/yjs-helper/ts';
import { column, Schema, Table } from '@powersync/web';

const documents = new Table({
  title: column.text,
  created_at: column.text
});

export const AppSchema = new Schema({
  documents,
  ...yjsLocalTables()
});

export type Database = (typeof AppSchema)['types'];
export type Documents = Database['documents'];
