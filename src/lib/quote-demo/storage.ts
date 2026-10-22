import { acceptDemoQuote, addDemoComment, claimDemoJob, completeDemoJob, createInitialState, parseStoredState, QuoteDemoError, type QuoteDemoState, submitDemoQuote } from "./model";

const DATABASE = "trade-marketplace-quote-demo";
const STORE = "sample-users";
export const DEMO_STORAGE_EVENT = "trade-quote-demo-updated";

function storageError(error?: unknown): QuoteDemoError {
  if (error instanceof QuoteDemoError) return error;
  return new QuoteDemoError("storage-unavailable", "We couldn't save this demo on this device. Check browser storage, then retry. Your points have not changed.");
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(storageError());
    let request: IDBOpenDBRequest;
    try { request = indexedDB.open(DATABASE, 1); } catch (error) { reject(storageError(error)); return; }
    let rejected = false;
    request.onupgradeneeded = () => { request.result.createObjectStore(STORE, { keyPath: "userId" }); };
    request.onerror = () => reject(storageError(request.error));
    request.onblocked = () => { rejected = true; reject(new QuoteDemoError("storage-unavailable", "Another tab is updating demo storage. Close that tab, then retry.")); };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => db.close();
      if (rejected) db.close(); else resolve(db);
    };
  });
}

function announce(userId: string) {
  // Notifications are best effort. A failed notification must never turn a
  // committed write into a reported failure or invite a duplicate retry.
  try { window.dispatchEvent(new CustomEvent(DEMO_STORAGE_EVENT, { detail: userId })); } catch { /* Focus refresh remains available. */ }
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(DEMO_STORAGE_EVENT);
      channel.postMessage(userId);
      channel.close();
    }
  } catch { /* The committed transaction is still authoritative. */ }
}

/** One read/write transaction serializes read → validate → mutate → persist across tabs. */
async function update<T>(userId: string, transition: (current: QuoteDemoState) => { state: QuoteDemoState; result: T }): Promise<{ state: QuoteDemoState; result: T }> {
  const db = await openDatabase();
  try {
    const saved = await new Promise<{ state: QuoteDemoState; result: T }>((resolve, reject) => {
      let result: { state: QuoteDemoState; result: T };
      let failure: unknown;
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const request = store.get(userId);
      request.onsuccess = () => {
        try {
          const current = request.result === undefined ? createInitialState(userId) : parseStoredState(request.result, userId);
          result = transition(current);
          store.put(result.state);
        } catch (error) { failure = error; tx.abort(); }
      };
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(storageError(failure ?? tx.error));
      tx.onabort = () => reject(storageError(failure ?? tx.error));
    });
    announce(userId);
    return saved;
  } catch (error) { throw storageError(error); }
  finally { db.close(); }
}

export async function loadQuoteDemo(userId: string): Promise<QuoteDemoState> {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).get(userId);
      let state: QuoteDemoState;
      let failure: unknown;
      request.onsuccess = () => {
        try { state = request.result === undefined ? createInitialState(userId) : parseStoredState(request.result, userId); }
        catch (error) { failure = error; }
      };
      tx.oncomplete = () => failure ? reject(storageError(failure)) : resolve(state);
      tx.onerror = () => reject(storageError(tx.error));
      tx.onabort = () => reject(storageError(tx.error));
    });
  } catch (error) { throw storageError(error); }
  finally { db.close(); }
}

export async function saveDemoQuote(userId: string, jobId: string, amount: string, note: string) {
  return update(userId, (state) => { const next = submitDemoQuote(state, jobId, amount, note); return { state: next.state, result: { rewarded: next.rewarded } }; });
}

export async function saveDemoAcceptance(userId: string, jobId: string) {
  return update(userId, (state) => { const next = acceptDemoQuote(state, jobId); return { state: next.state, result: { alreadyAccepted: next.alreadyAccepted } }; });
}

export async function saveDemoComment(userId: string, jobId: string, body: string, commentId: string) {
  return update(userId, (state) => { const next = addDemoComment(state, jobId, body, commentId); return { state: next.state, result: { alreadyAdded: next.alreadyAdded } }; });
}

export async function saveDemoClaim(userId: string, jobId: string) {
  return update(userId, (state) => { const next = claimDemoJob(state, jobId); return { state: next.state, result: { alreadyClaimed: next.alreadyClaimed } }; });
}

export async function saveDemoCompletion(userId: string, jobId: string) {
  return update(userId, (state) => { const next = completeDemoJob(state, jobId); return { state: next.state, result: { alreadyCompleted: next.alreadyCompleted } }; });
}

export async function resetQuoteDemo(userId: string): Promise<QuoteDemoState> {
  const db = await openDatabase();
  try {
    const state = createInitialState(userId);
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const request = store.get(userId);
      request.onsuccess = () => {
        const revision = request.result?.revision;
        state.revision = Number.isSafeInteger(revision) && revision >= 0 && revision < Number.MAX_SAFE_INTEGER ? revision + 1 : 0;
        store.put(state);
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(storageError(tx.error));
      tx.onabort = () => reject(storageError(tx.error));
    });
    announce(userId);
    return state;
  } catch (error) { throw storageError(error); }
  finally { db.close(); }
}

export function subscribeQuoteDemo(userId: string, refresh: () => void): () => void {
  const local = (event: Event) => { if ((event as CustomEvent<string>).detail === userId) refresh(); };
  const focus = () => refresh();
  window.addEventListener(DEMO_STORAGE_EVENT, local);
  window.addEventListener("focus", focus);
  const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(DEMO_STORAGE_EVENT) : null;
  if (channel) channel.onmessage = (event: MessageEvent<unknown>) => { if (event.data === userId) refresh(); };
  return () => { window.removeEventListener(DEMO_STORAGE_EVENT, local); window.removeEventListener("focus", focus); channel?.close(); };
}
