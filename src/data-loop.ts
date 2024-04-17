import type { App } from './main';

export const dataLoop = async (app: App) => {
  const game = await app.gameService.getActiveGame();
  if (!game) {
    return;
  }

  await app.boxscoreService.fetchBoxscore(game.id);
};
