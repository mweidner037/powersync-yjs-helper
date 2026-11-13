import { column, RowType, Table } from '@powersync/web';

export const YJS_OPERATIONS_TABLE_NAME = 'yjs_operations';
export const YJS_SNAPSHOTS_TABLE_NAME = 'yjs_snapshots';

/**
 * Local PowerSync tables for the Yjs helper package.
 *
 * Add them to your Schema:
 * ```ts
 * export const AppSchema = new Schema({
 *   // Your other tables...
 *
 *   ...yjsLocalTables()
 * })
 * ```
 */
export function yjsLocalTables() {
  return {
    [YJS_OPERATIONS_TABLE_NAME]: new Table({
      document_id: column.text,
      operation_id: column.text,
      fragment_b64: column.text,
      fragment_index: column.integer,
      fragment_count: column.integer
    }),
    [YJS_SNAPSHOTS_TABLE_NAME]: new Table({
      document_id: column.text,
      snapshot_id: column.text,
      fragment_b64: column.text,
      fragment_index: column.integer,
      fragment_count: column.integer
    })
  };
}

// TODO: Wrap in NonNullable
export type YjsOperationsTableRow = RowType<ReturnType<typeof yjsLocalTables>[typeof YJS_OPERATIONS_TABLE_NAME]>;
export type YjsSnapshotsTableRow = RowType<ReturnType<typeof yjsLocalTables>[typeof YJS_SNAPSHOTS_TABLE_NAME]>;
