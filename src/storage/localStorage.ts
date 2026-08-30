import type { MatchRecord, SavedGame, StorageProvider, StoredSettings } from './provider';

const RECORDS_KEY = 'hkk:records:v1';
const SETTINGS_KEY = 'hkk:settings:v1';
const GAME_KEY = 'hkk:game:v1';
const MAX_RECORDS = 500;

/** localStorage 實作（私密模式等失敗情況靜默降級） */
export class LocalStorageProvider implements StorageProvider {
  private readonly storage: Storage | null;

  constructor(storage?: Storage) {
    this.storage = storage ?? safeLocalStorage();
  }

  async getMatches(): Promise<MatchRecord[]> {
    const parsed = this.read<MatchRecord[]>(RECORDS_KEY);
    return Array.isArray(parsed) ? parsed : [];
  }

  async addMatch(record: MatchRecord): Promise<void> {
    const records = await this.getMatches();
    records.push(record);
    if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS);
    this.write(RECORDS_KEY, records);
  }

  async getSettings(): Promise<StoredSettings | null> {
    return this.read<StoredSettings>(SETTINGS_KEY);
  }

  async saveSettings(settings: StoredSettings): Promise<void> {
    this.write(SETTINGS_KEY, settings);
  }

  async getSavedGame(): Promise<SavedGame | null> {
    const saved = this.read<SavedGame>(GAME_KEY);
    return saved && saved.schemaVersion === 1 && saved.state ? saved : null;
  }

  async saveGame(saved: SavedGame): Promise<void> {
    this.write(GAME_KEY, saved);
  }

  async clearSavedGame(): Promise<void> {
    try {
      this.storage?.removeItem(GAME_KEY);
    } catch { /* 忽略 */ }
  }

  async clearMatches(): Promise<void> {
    try {
      this.storage?.removeItem(RECORDS_KEY);
    } catch { /* 忽略 */ }
  }

  async clear(): Promise<void> {
    try {
      this.storage?.removeItem(RECORDS_KEY);
      this.storage?.removeItem(SETTINGS_KEY);
      this.storage?.removeItem(GAME_KEY);
    } catch { /* 忽略 */ }
  }

  private read<T>(key: string): T | null {
    try {
      const raw = this.storage?.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  private write(key: string, value: unknown): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch { /* 容量滿或私密模式：靜默略過 */ }
  }
}

function safeLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
