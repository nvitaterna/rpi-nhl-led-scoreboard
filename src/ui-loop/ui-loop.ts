import { LiveGameScene } from '@/live-game.scene';
import { Loopable } from '@/loopable/loopable';
import { App } from '@/main';
import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';

export class UiLoop extends Loopable {
  constructor(
    private app: App,
    private matrix: LedMatrixInstance,
  ) {
    super(250);
  }

  loop() {
    const uiData = this.app.uiDataService.getFromCache();
    if (!uiData) {
      return;
    }
    const liveGameScene = new LiveGameScene(this.matrix, uiData);

    liveGameScene.render();
  }
}
