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
import { DataLoop } from './data-loop';
import { BoxscoreUpdater } from './boxscore/boxscore.updater';
import { GameUpdater } from './game/game.updater';

export type App = {
  configService: ConfigService;
  teamService: TeamService;
  gameService: GameService;
  logoService: LogoService;
  prefsService: PrefsService;
  boxscoreService: BoxscoreService;
  loggerService: LoggerService;
  boxscoreUpdater: BoxscoreUpdater;
  gameUpdater: GameUpdater;
};

export const main = async (requireBootstrap = false) => {
  await migrate();

  const storage = await initStorage();

  const configService = new ConfigService();
  const loggerService = new LoggerService(configService);

  const logger = loggerService.child('main');

  const nhlApi = new NhlApi(loggerService);

  const teamRepository = new TeamRepository(db);
  const gameRepository = new GameRepository(db);
  const logoRepository = new LogoRepository(db);
  const prefsRepository = new PrefsRepository(storage);
  const boxscoreRepository = new BoxscoreRepository();

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

  const boxscoreUpdater = new BoxscoreUpdater(
    boxscoreService,
    gameService,
    loggerService,
  );

  const gameUpdater = new GameUpdater(gameService, teamService, prefsService);

  const app: App = {
    configService,
    teamService,
    gameService,
    logoService,
    prefsService,
    boxscoreService,
    loggerService,
    boxscoreUpdater,
    gameUpdater,
  };

  if (requireBootstrap) {
    logger.info('bootstrapping application data');
    await bootstrap(app);
  }

  logger.info(configService.appConfig);

  const timezone = await prefsService.getTimezone();
  logger.info(`timezone: ${timezone}`);

  const team = await prefsService.getTeam();
  logger.info(`team: ${team}`);

  const dataLoop = new DataLoop(app);

  dataLoop.start();

  return app;
};

main();
