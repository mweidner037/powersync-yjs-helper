import { column, RowType, Table } from '@powersync/web';

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
    yjs_updates: new Table({
      document_id: column.text,
      update_b64: column.text,
      fragment_index: column.integer,
      fragment_count: column.integer
    }),
    yjs_snapshots: new Table({
      document_id: column.text,
      snapshot_b64: column.text,
      fragment_index: column.integer,
      fragment_count: column.integer
    })
  };
}

export type YjsUpdatesTableRow = RowType<ReturnType<typeof yjsLocalTables>['yjs_updates']>;
export type YjsSnapshotsTableRow = RowType<ReturnType<typeof yjsLocalTables>['yjs_snapshots']>;
