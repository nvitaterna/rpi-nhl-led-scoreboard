import { LiveGameScene } from '@/live-game.scene';
import { LoggerService } from '@/logger/logger.service';
import { Loopable } from '@/loopable/loopable';
import { App } from '@/main';
import { PreGameScene } from '@/pre-game.scene';
import { Renderer } from '@/renderer';
import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Logger } from 'pino';

export class UiLoop extends Loopable {
  private logger: Logger;

  private scene: Renderer | null = null;

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

    if (uiData.boxscore.status === 'LIVE') {
      this.scene = new LiveGameScene(this.matrix, uiData);
    } else if (uiData.boxscore.status === 'UPCOMING') {
      this.scene = new PreGameScene(this.matrix, uiData);
    }

    if (!this.scene) {
      return;
    }

    this.scene.render();

    this.matrix.sync();
  }
}
