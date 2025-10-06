import type { NhlApi } from './lib/nhl-api/nhl-api.js';
import { GamesModule } from './modules/games/games.module.js';
import { LogosModule } from './modules/logos/logos.module.js';
import { TeamsModule } from './modules/teams/teams.module.js';

export const setupModules = async (nhlApi: NhlApi) => {
  const gamesModule = new GamesModule(nhlApi);
  const teamsModule = new TeamsModule(nhlApi, gamesModule);
  const logosModule = new LogosModule(teamsModule);

  return {
    gamesModule,
    teamsModule,
    logosModule,
  };
};

export type Modules = Awaited<ReturnType<typeof setupModules>>;
