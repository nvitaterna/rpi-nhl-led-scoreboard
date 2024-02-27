import { Game } from './nhl-api/nhl-api';

/**
 * This function takes a list of games and returns the first active game. Active games are defined as games that started within the last 12 hours or the next game to be played.
 * @param schedule list of games
 * @returns the active game
 */
export const getActiveGame = (schedule: Game[]): Game | undefined => {
  // check if any games started within the last 12 hours

  let activeGame = schedule.find((game) => {
    const gameDate = new Date(game.startTimeUTC);
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    return gameDate > twelveHoursAgo;
  });

  // if no active game - fetch next game and show on screen
  if (!activeGame) {
    activeGame = schedule.find((game) => {
      const gameDate = new Date(game.gameDate);
      const now = new Date();
      return gameDate > now;
    });
  }

  return activeGame;
};
