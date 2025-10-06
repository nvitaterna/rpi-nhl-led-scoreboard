import ky from 'ky';

import { getLogger } from '../logger/logger.js';

import { BoxscoreApi } from './boxscore/boxscore.api.js';
import { PlayByPlayApi } from './play-by-play/play-by-play.api.js';
import { ScheduleApi } from './schedule/schedule.api.js';
import { StandingsApi } from './standings/standings.api.js';

const NHL_WEB_API_URL = 'https://api-web.nhle.com';
// const NHL_API_URL = 'https://api.nhle.com/stats/rest';

const nhlWebApi = ky.create({
  prefixUrl: NHL_WEB_API_URL,
});

// const nhlStatsApi = ky.create({
//   prefixUrl: NHL_API_URL,
// });

export const setupNhlApi = () => {
  const logger = getLogger('NhlApi');

  const standings = new StandingsApi(logger, nhlWebApi);

  const schedule = new ScheduleApi(logger, nhlWebApi);

  const boxscore = new BoxscoreApi(logger, nhlWebApi);

  const playByPlay = new PlayByPlayApi(logger, nhlWebApi);

  return {
    getStandings: standings.get.bind(standings),
    getSchedule: schedule.get.bind(schedule),
    getBoxScore: boxscore.get.bind(boxscore),
    getPlayByPlay: playByPlay.get.bind(playByPlay),
  };
};

export type NhlApi = ReturnType<typeof setupNhlApi>;
