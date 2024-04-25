import { Loopable } from '@/loopable/loopable';
import type { App } from '@/main';

export class DataLoop extends Loopable {
  constructor(private app: App) {
    super(100);
  }

  async loop() {
    await this.app.gameUpdater.update();
    await this.app.boxscoreUpdater.update();
    await this.app.uiDataUpdater.update();
  }
}
