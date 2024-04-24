import { Loopable } from '@/loopable/loopable';
import type { App } from '@/main';

export class DataLoop extends Loopable {
  constructor(private app: App) {
    super(100);
  }

  async loop() {
    this.app.gameUpdater.update();
    this.app.boxscoreUpdater.update();
  }
}
