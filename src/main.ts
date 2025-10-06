import { config } from '@/lib/config/config.js';
import { TeamsModule } from '@/modules/teams/teams.module.js';

import { app } from './app.js';
import { getLogger } from './lib/logger/logger.js';
import { setupNhlApi } from './lib/nhl-api/nhl-api.js';
import { ActiveTeamModule } from './modules/active-team/active-team.module.js';
import { DataLoopModule } from './modules/data-loop/data-loop,module.js';
import { GamesModule } from './modules/games/games.module.js';
import { LogosModule } from './modules/logos/logos.module.js';
import { server } from './server.js';

export const main = async () => {
  const logger = getLogger('main');

  logger.info('Application starting...');

  const nhlApi = setupNhlApi();

  const gamesModule = new GamesModule(nhlApi);

  const teamsModule = new TeamsModule(nhlApi, gamesModule);

  const activeTeamModule = new ActiveTeamModule(config);

  const logosModule = new LogosModule(teamsModule);

  const activeTeam = activeTeamModule.activeTeamService.team;

  console.log('Starting application with active team: ' + activeTeam);

  const dataLoopModule = new DataLoopModule(
    nhlApi,
    teamsModule,
    logosModule,
    activeTeamModule,
  );

  dataLoopModule.dataLoopService.startLoop();

  server.on('request', app);

  logger.info(`Server running at http://localhost:${config.port}/`);

  app.get('/', (req, res) => {
    // send simple html page that auto refreshes every second with dataLoopModule.dataLoopService.boxscore displayed
    res.send(`
      <html>
        <head>
          <title>RPI NHL LED Scoreboard</title>
          <meta http-equiv="refresh" content="1">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #f4f4f4;
            }
            h1 {
              color: #333;
            }
            pre {
              background: #fff;
              padding: 15px;
              border: 1px solid #ddd;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          <h1>RPI NHL LED Scoreboard</h1>
          <h2>Active Team: ${activeTeam}</h2>
          <h2>Config:</h2>
          <pre>${JSON.stringify(config, null, 2)}</pre>
          <h2>Current Boxscore Data:</h2>
          <pre>${JSON.stringify(dataLoopModule.dataLoopService.boxscore, null, 2)}</pre>
        </body>
      </html>
    `);
  });
};
