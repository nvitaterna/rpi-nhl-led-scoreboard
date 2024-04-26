import { LiveGameScene } from '@/live-game.scene';
import { LoggerService } from '@/logger/logger.service';
import { Loopable } from '@/loopable/loopable';
import { App } from '@/main';
import { PreGameScene } from '@/pre-game.scene';
import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Logger } from 'pino';

export class UiLoop extends Loopable {
  private logger: Logger;

  private scene: any = null;

  private liveGameScene: LiveGameScene | null = null;

  constructor(
    private app: App,
    private matrix: LedMatrixInstance,
    loggerService: LoggerService,
  ) {
    super(250);
    this.logger = loggerService.child('ui-loop');
  }

  loop() {
    const uiData = this.app.uiDataService.getFromCache();
    if (!uiData) {
      this.logger.debug('No UI data found');
      return;
    }

    if (!this.scene) {
      this.scene = new PreGameScene(this.matrix, uiData);
    }

    this.scene.render();

    this.matrix.sync();
  }
}
