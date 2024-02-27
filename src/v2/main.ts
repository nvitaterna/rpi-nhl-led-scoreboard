import { getActiveGame } from './get-active-game';
import { NhlAPI } from './nhl-api/nhl-api';
import { config } from './config';

const nhlApi = new NhlAPI();

const main = async () => {
  const team = config.get('teamAbbrev');
  const timezone = config.get('timezone');
  // fetch schedule for teams
  const schedule = await nhlApi.fetchSchedule('NYI');

  const activeGame = getActiveGame(schedule);

  if (!activeGame) {
    console.log('No active game');
    return;
  }

  const boxScore = await nhlApi.fetchBoxScore(activeGame.id);

  // convert game start time to local time
  const gameDate = new Date(boxScore.startTimeUTC);
  const localTime = gameDate.toLocaleString('en-US', { timeZone: timezone });

  console.log(localTime);

  if (boxScore.gameState === 'LIVE' || boxScore.gameState === 'CRIT') {
    // show live game on screen
  }

  console.log(boxScore);

  // if live - fetch live game and show on screen
  // if not live - fetch next game and show on screen
};

main();
