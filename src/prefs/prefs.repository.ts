import { LocalStorage } from 'node-persist';
import { PrefsData } from './prefs.schema';

export class PrefsRepository {
  constructor(private storage: LocalStorage) {}

  async getPref<T extends keyof PrefsData = keyof PrefsData>(
    key: T,
  ): Promise<PrefsData[T]> {
    return this.storage.getItem(key);
  }

  async setPref<T extends keyof PrefsData = keyof PrefsData>(
    key: T,
    value: PrefsData[T],
  ): Promise<void> {
    await this.storage.setItem(key, value);
  }
}
