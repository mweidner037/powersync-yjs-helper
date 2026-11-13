import { CrudEntry, UpdateType } from '@powersync/web';
import * as Y from 'yjs';
import { YJS_UPDATES_TABLE_NAME } from './yjs-local-tables';
import { b64ToUint8Array, Uint8ArrayTob64 } from './binary-utils';

/**
 * Default value of fragmentSize.
 *
 * Note that the actual row is slightly larger.
 */
const DEFAULT_FRAGMENT_SIZE = 1_000_000;

/**
 * Batches together all local Yjs updates in `crud` into a single update
 * row, returning a modified `CrudEntry[]` for you to upload.
 * The return value contains all of the non-Yjs entries unchanged,
 * followed by the batched Yjs entries.
 *
 * Apply this to `transaction.crud` at the start of your `uploadData` function.
 *
 * @param options.fragmentSize The maximum size of a fragment,
 * in bytes (technically, base64 chars). Note that max-size rows
 * will be slightly larger due to metadata. Default: 1 million.
 */
export function batchYjsUpdates(crud: CrudEntry[], options: { fragmentSize?: number } = {}): CrudEntry[] {
  const fragmentSize = options.fragmentSize ?? DEFAULT_FRAGMENT_SIZE;

  // 1. Extract all Yjs updates, grouped by document_id.

  // Maps document_id -> { first CrudEntry, all binary updates }.
  // We store the first CrudEntry so that we can reuse its metadata.
  const yjsUpdatesByDocId = new Map<string, { firstEntry: CrudEntry; updates: string[] }>();
  for (const entry of crud) {
    if (!isYjsUpdate(entry)) continue;

    const docId = entry.opData!['document_id'];
    let docUpdates = yjsUpdatesByDocId.get(docId);
    if (!docUpdates) {
      docUpdates = { firstEntry: entry, updates: [] };
      yjsUpdatesByDocId.set(docId, docUpdates);
    }

    docUpdates.updates.push(entry.opData!['fragment_b64']);
  }

  if (yjsUpdatesByDocId.size === 0) {
    // No Yjs updates. Return crud unchanged.
    return crud;
  }

  // 2. For each document, merge all of its updates, then fragment
  // the merged update if needed for size reasons.

  const batchedCrud: CrudEntry[] = [];
  for (const { firstEntry, updates } of yjsUpdatesByDocId.values()) {
    const updatesBinary = updates.map((update) => b64ToUint8Array(update));
    const mergedUpdateBinary = Y.mergeUpdates(updatesBinary);
    const mergedUpdateB64 = Uint8ArrayTob64(mergedUpdateBinary);

    // Split the update into fragments of at most 1 MB.
    // This keeps us well away from Postgres's 15 MB row limit.
    // Large updates are possible if an app (ill-advisedly) allows pasting base64
    // images/assets into the editor.
    const fragments: string[] = [];
    for (let charI = 0; charI < mergedUpdateB64.length; charI += fragmentSize) {
      fragments.push(mergedUpdateB64.slice(charI, charI + fragmentSize));
    }

    for (let i = 0; i < fragments.length; i++) {
      // TODO: We probably need to make a new CrudEntryImpl for each one
      // with a new clientId, instead of just reusing this object.
      batchedCrud.push({
        ...firstEntry,
        opData: {
          ...firstEntry.opData,
          fragment_b64: fragments[i],
          fragment_index: i,
          fragment_count: fragments.length
        }
      });
    }
  }

  // 3. Return non-Yjs entries followed by the batched entries.
  // We do non-Yjs entries first because a Yjs update is more likely
  // to causally depend on a non-Yjs change (e.g. creating the document)
  // than vice-versa.

  const otherCrud = crud.filter((entry) => !isYjsUpdate(entry));
  return [...otherCrud, ...batchedCrud];
}

function isYjsUpdate(entry: CrudEntry): boolean {
  // Our provider only submits PUT operations. Filter on that anyway
  // in case the client is up to something.
  return entry.table === YJS_UPDATES_TABLE_NAME && entry.op === UpdateType.PUT;
}
