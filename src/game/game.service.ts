import { NhlApi } from '@/nhl-api/nhl-api';
import { PrefsService } from '@/prefs/prefs.service';
import { TeamService } from '@/team/team.service';
import { GameRepository } from './game.repository';

export class GameService {
  constructor(
    private gameRepository: GameRepository,
    private teamService: TeamService,
    private nhlApi: NhlApi,
    private prefsService: PrefsService,
  ) {}

  async get(id: number) {
    return this.gameRepository.get(id);
  }

  async findByTeam(abbrev: string) {
    return this.gameRepository.findByTeam(abbrev);
  }

  async bootstrap() {
    const teams = await this.teamService.getAll();

    for (const team of teams) {
      await this.bootstrapGamesForTeam(team.abbrev);

      // wait 250ms between each team to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  async bootstrapGamesForTeam(abbrev: string) {
    const games = await this.nhlApi.fetchGames(abbrev);

    await this.gameRepository.upsertMany(games);
  }

  async getActiveGame() {
    const team = await this.prefsService.getTeam();

    if (!team) {
      return null;
    }

    const games = await this.findByTeam(team);

    // find game that started within the last 12 hours
    const now = new Date().getTime();
    const twelveHoursAgo = now - 12 * 60 * 60 * 1000;
    let liveGame = games.find(
      (game) => game.startTimeUtc > twelveHoursAgo && game.startTimeUtc < now,
    );

    if (!liveGame) {
      // find the *next* game
      liveGame = games
        .sort((a, b) => a.startTimeUtc - b.startTimeUtc)
        .find((game) => game.startTimeUtc > new Date().getTime());
    }

    liveGame = games.find((game) => game.id === 2023030122);

    return liveGame || null;
  }
}
