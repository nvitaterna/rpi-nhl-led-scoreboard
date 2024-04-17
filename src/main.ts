import { bootstrap } from './bootstrap';
import { db } from './db/database';
import { GameRepository } from './game/game.repository';
import { GameService } from './game/game.service';
import { LogoRepository } from './logo/logo.repository';
import { LogoService } from './logo/logo.service';
import { NhlApi } from './nhl-api/nhl-api';
import { migrate } from './run-migrations';
import { TeamRepository } from './team/team.repository';
import { TeamService } from './team/team.service';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from './config/config.service';
import { initStorage } from './storage/storage';
import { PrefsRepository } from './prefs/prefs.repository';
import { PrefsService } from './prefs/prefs.service';
import { BoxscoreRepository } from './boxscore/boxscore.repository';
import { BoxscoreService } from './boxscore/boxscore.service';

export type App = {
  configService: ConfigService;
  teamService: TeamService;
  gameService: GameService;
  logoService: LogoService;
  prefsService: PrefsService;
  boxscoreService: BoxscoreService;
  loggerService: LoggerService;
};

export const main = async (requireBootstrap = false) => {
  await migrate();

  const storage = await initStorage();

  const nhlApi = new NhlApi();

  const configService = new ConfigService();

  const teamRepository = new TeamRepository(db);
  const gameRepository = new GameRepository(db);
  const logoRepository = new LogoRepository(db);
  const prefsRepository = new PrefsRepository(storage);
  const boxscoreRepository = new BoxscoreRepository();

  const loggerService = new LoggerService(configService);
  const teamService = new TeamService(teamRepository, nhlApi);
  const prefsService = new PrefsService(prefsRepository, teamService);
  const gameService = new GameService(
    gameRepository,
    teamService,
    nhlApi,
    prefsService,
  );
  const logoService = new LogoService(
    logoRepository,
    teamService,
    loggerService,
  );
  const boxscoreService = new BoxscoreService(boxscoreRepository, nhlApi);

  const app: App = {
    configService,
    teamService,
    gameService,
    logoService,
    prefsService,
    boxscoreService,
    loggerService,
  };

  if (requireBootstrap) {
    loggerService.info('bootstrapping application data');
    await bootstrap(app);
  }

  loggerService.info(configService.appConfig);

  const timezone = await prefsService.getTimezone();
  loggerService.info(`timezone: ${timezone}`);

  const team = await prefsService.getTeam();
  loggerService.info(`team: ${team}`);

  const liveGame = await gameService.getActiveGame();

  if (liveGame) {
    loggerService.info(liveGame, 'live game');
    await app.boxscoreService.fetchBoxscore(liveGame.id);
    const boxscore = await app.boxscoreService.get();
    loggerService.info(boxscore, 'boxscore');
  } else {
    loggerService.info('no live game');
  }

  return app;
};

main().then((app) => app.loggerService.info('done'));
