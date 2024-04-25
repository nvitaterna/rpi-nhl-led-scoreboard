import { Updateable } from '@/updateable/updateable';
import { UiDataService } from './ui-data.service';
import { BoxscoreService } from '@/boxscore/boxscore.service';

const DEFAULT_UI_DATA_UPDATE_INTERVAl = 2000;

export class UiDataUpdater extends Updateable {
  constructor(
    private uiDataService: UiDataService,
    private boxscoreService: BoxscoreService,
  ) {
    super(DEFAULT_UI_DATA_UPDATE_INTERVAl);
  }

  public async update() {
    if (!(await this.shouldUpdate())) {
      return;
    }

    this.beforeUpdate();

    const boxscore = await this.boxscoreService.get();

    await this.uiDataService.set(boxscore);

    this.afterUpdate();
  }
}
