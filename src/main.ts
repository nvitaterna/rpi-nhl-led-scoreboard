import { bootstrap } from '@/bootstrap';
import { db } from '@/db/database';
import { GameRepository } from '@/game/game.repository';
import { GameService } from '@/game/game.service';
import { LogoRepository } from '@/logo/logo.repository';
import { LogoService } from '@/logo/logo.service';
import { NhlApi } from '@/nhl-api/nhl-api';
import { migrate } from '@/run-migrations';
import { TeamRepository } from '@/team/team.repository';
import { TeamService } from '@/team/team.service';
import { LoggerService } from '@/logger/logger.service';
import { ConfigService } from '@/config/config.service';
import { initStorage } from '@/storage/storage';
import { PrefsRepository } from '@/prefs/prefs.repository';
import { PrefsService } from '@/prefs/prefs.service';
import { BoxscoreRepository } from '@/boxscore/boxscore.repository';
import { BoxscoreService } from '@/boxscore/boxscore.service';
import { DataLoop } from '@/data-loop/data-loop';
import { BoxscoreUpdater } from '@/boxscore/boxscore.updater';
import { GameUpdater } from '@/game/game.updater';
import { UiDataRepository } from './ui-data/ui-data.repository';
import { UiDataService } from './ui-data/ui-data.service';
import { UiDataUpdater } from './ui-data/ui-data.updater';
import { UiLoop } from './ui-loop/ui-loop';
import { Matrix } from './matrix/matrix';

export type App = {
  configService: ConfigService;
  teamService: TeamService;
  gameService: GameService;
  logoService: LogoService;
  prefsService: PrefsService;
  uiDataService: UiDataService;
  boxscoreService: BoxscoreService;
  loggerService: LoggerService;
  boxscoreUpdater: BoxscoreUpdater;
  gameUpdater: GameUpdater;
  uiDataUpdater: UiDataUpdater;
};

export const main = async () => {
  await migrate();

  const storage = await initStorage();

  const configService = new ConfigService();
  const loggerService = new LoggerService(configService);

  const appConfig = configService.appConfig;

  const logger = loggerService.child('main');

  const nhlApi = new NhlApi(loggerService);

  const teamRepository = new TeamRepository(db);
  const gameRepository = new GameRepository(db);
  const logoRepository = new LogoRepository(db);
  const prefsRepository = new PrefsRepository(storage);
  const boxscoreRepository = new BoxscoreRepository();
  const uiDataRepository = new UiDataRepository();

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

  const uiDataService = new UiDataService(uiDataRepository, logoService);

  const boxscoreUpdater = new BoxscoreUpdater(
    boxscoreService,
    gameService,
    loggerService,
  );

  const gameUpdater = new GameUpdater(gameService, teamService, prefsService);

  const uiDataUpdater = new UiDataUpdater(uiDataService, boxscoreService);

  const app: App = {
    configService,
    teamService,
    gameService,
    logoService,
    prefsService,
    uiDataService,
    boxscoreService,
    loggerService,
    boxscoreUpdater,
    gameUpdater,
    uiDataUpdater,
  };

  if (appConfig.bootstrap) {
    logger.info('bootstrapping application data');
    await bootstrap(app);
  }

  logger.info(configService.appConfig);

  const timezone = await prefsService.getTimezone();
  logger.info(`timezone: ${timezone}`);

  const team = await prefsService.getTeam();
  logger.info(`team: ${team}`);

  const matrix = Matrix(configService.matrixConfig);

  const dataLoop = new DataLoop(app);
  const uiLoop = new UiLoop(app, matrix);

  dataLoop.start();
  uiLoop.start();

  return app;
};

main();
