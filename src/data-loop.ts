import type { App } from './main';

export class DataLoop {
  private loopInterval: NodeJS.Timeout | null = null;

  constructor(private app: App) {}

  public start() {
    if (this.loopInterval !== null) {
      this.stop();
    }
    this.loopInterval = setInterval(() => this.loop(), 100);
  }

  public stop() {
    if (this.loopInterval !== null) {
      clearInterval(this.loopInterval);
    }
    this.loopInterval = null;
  }

  async loop() {
    this.app.gameUpdater.update();
    this.app.boxscoreUpdater.update();
  }
}
