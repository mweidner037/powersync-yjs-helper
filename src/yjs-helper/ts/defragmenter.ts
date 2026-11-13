import { b64ToUint8Array } from './binary-utils';

export class DeFragmenter {
  /**
   * Maps update id -> fragment index -> fragment_b64.
   */
  private readonly pendingFragments = new Map<string, Map<number, string>>();

  /**
   * Accumulates fragments and calls `onUpdate` when they are complete.
   *
   * Fragments are allowed to arrive out-of-order.
   */
  constructor(private readonly onUpdate: (update: Uint8Array) => void) {}

  addFragment(updateId: string, fragmentB64: string, fragmentIndex: number, fragmentCount: number) {
    if (fragmentCount === 1) {
      // Common case: the update is not fragmented.
      this.onUpdate(b64ToUint8Array(fragmentB64));
      return;
    }

    let pendingFragment = this.pendingFragments.get(updateId);
    if (!pendingFragment) {
      pendingFragment = new Map();
      this.pendingFragments.set(updateId, pendingFragment);
    }

    pendingFragment.set(fragmentIndex, fragmentB64);
    if (pendingFragment.size === fragmentCount) {
      // Update complete.
      let updateB64 = '';
      for (let i = 0; i < fragmentCount; i++) {
        updateB64 += pendingFragment.get(i)!;
      }
      this.pendingFragments.delete(updateId);
      this.onUpdate(b64ToUint8Array(updateB64));
    }
  }
}
