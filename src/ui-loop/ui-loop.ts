import { LiveGameScene } from '@/scenes/live-game.scene';
import { LoggerService } from '@/logger/logger.service';
import { Loopable } from '@/loopable/loopable';
import { App } from '@/main';
import { PreGameScene } from '@/scenes/pre-game.scene';
import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Logger } from 'pino';
import { PostGameScene } from '@/scenes/post-game.scene';
import { UiData } from '@/ui-data/ui-data.schema';

export class UiLoop extends Loopable {
  private logger: Logger;

  private scene: LiveGameScene | PostGameScene | PreGameScene | null = null;

  constructor(
    private app: App,
    private matrix: LedMatrixInstance,
    loggerService: LoggerService,
  ) {
    super(250);
    this.logger = loggerService.child('ui-loop');
  }

  private getScene(uiData: UiData) {
    switch (uiData.boxscore.status) {
      case 'LIVE': {
        if (!(this.scene instanceof LiveGameScene)) {
          return new LiveGameScene(this.matrix, uiData);
        }
        break;
      }
      case 'UPCOMING': {
        if (!(this.scene instanceof PreGameScene)) {
          return new PreGameScene(this.matrix, uiData);
        }
        break;
      }
      case 'FINAL': {
        if (!(this.scene instanceof PostGameScene)) {
          return new PostGameScene(this.matrix, uiData);
        }
        break;
      }
    }
  }

  loop() {
    const uiData = this.app.uiDataService.getFromCache();
    if (!uiData) {
      this.logger.debug('No UI data found');
      return;
    }

    this.matrix.brightness(uiData.brightness);

    const newScene = this.getScene(uiData);

    if (newScene) {
      this.scene = newScene;
    } else if (this.scene) {
      this.scene?.update(uiData);
    }

    if (this.scene) {
      this.scene.render();
    } else {
      this.logger.debug('No scene to render');
    }

    this.matrix.sync();
  }
}
