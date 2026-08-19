/**
 * A single localStorage key holding the whole persisted workspace, read-modify-written
 * so independent hooks (palette, preview settings) never clobber each other's fields.
 * All access is wrapped in try/catch — localStorage can throw in private browsing,
 * with storage disabled, or over quota, and that must never crash the app.
 */
const STORAGE_KEY = 'ratio:workspace:v1';

export interface PersistedWorkspaceState {
  dominant?: string;
  secondary?: string;
  accent?: string;
  text?: string;
  template?: string;
  viewport?: string;
  visionMode?: string;
  usageContext?: string;
}

function isStorageAvailable(): boolean {
  try {
    const probeKey = '__ratio_storage_probe__';
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
}

export function loadPersistedState(): PersistedWorkspaceState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? (parsed as PersistedWorkspaceState) : {};
  } catch {
    return {};
  }
}

export function patchPersistedState(patch: PersistedWorkspaceState): void {
  try {
    const current = loadPersistedState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    // Storage unavailable or full — the workspace still works, it just won't persist.
  }
}

export function clearPersistedState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export { isStorageAvailable };
