import { UiData } from './ui-data.schema';

export class UiDataRepository {
  private uiData: UiData | null = null;

  async get() {
    return this.uiData;
  }

  async set(uiData: UiData) {
    this.uiData = uiData;
  }

  async clear() {
    this.uiData = null;
  }
}
