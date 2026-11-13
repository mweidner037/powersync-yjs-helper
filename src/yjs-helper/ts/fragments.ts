import { YjsUpdatesTableRow } from './yjs-local-tables';

// TODO: reuse update_id/snapshot_id name so we can input both rows here?
// TODO: Need to store incomplete parts for the next onDiff call.

/**
 * Returns the binary Yjs updates encoded in the given rows.
 */
export function updatesFromFragments(rows: YjsUpdatesTableRow[]): Uint8Array[] {}
