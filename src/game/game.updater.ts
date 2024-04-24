import { PrefsService } from '@/prefs/prefs.service';
import { TeamService } from '@/team/team.service';
import { Updateable } from '@/updateable/updateable';
import { GameService } from './game.service';

// default should be 6 hours
const DEFAULT_GAME_UPDATE_INTERVAL = 6 * 60 * 60 * 1000;

export class GameUpdater extends Updateable {
  constructor(
    private gameService: GameService,
    private teamService: TeamService,
    private prefsService: PrefsService,
  ) {
    super(DEFAULT_GAME_UPDATE_INTERVAL);
  }

  public async update() {
    if (!(await this.shouldUpdate())) {
      return;
    }

    const team = await this.prefsService.getTeam();

    if (!team) {
      return;
    }

    await this.gameService.bootstrapGamesForTeam(team);

    this.afterUpdate();
  }
}
