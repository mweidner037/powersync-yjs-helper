import { column, RowType, Table } from '@powersync/web';

export const YJS_UPDATES_TABLE_NAME = 'yjs_updates';
export const YJS_SNAPSHOTS_TABLE_NAME = 'yjs_snapshots';

/**
 * Local PowerSync tables for the Yjs helper package.
 *
 * Add them to your Schema:
 * ```ts
 * const AppSchema = new Schema({
 *   // Your other tables...
 *
 *   ...yjsLocalTables()
 * })
 * ```
 */
export function yjsLocalTables() {
  return {
    [YJS_UPDATES_TABLE_NAME]: new Table({
      document_id: column.text,
      update_b64: column.text,
      fragment_index: column.integer,
      fragment_count: column.integer
    }),
    [YJS_SNAPSHOTS_TABLE_NAME]: new Table({
      document_id: column.text,
      snapshot_b64: column.text,
      fragment_index: column.integer,
      fragment_count: column.integer
    })
  };
}

export type YjsUpdatesTableRow = RowType<ReturnType<typeof yjsLocalTables>[typeof YJS_UPDATES_TABLE_NAME]>;
export type YjsSnapshotsTableRow = RowType<ReturnType<typeof yjsLocalTables>[typeof YJS_SNAPSHOTS_TABLE_NAME]>;
