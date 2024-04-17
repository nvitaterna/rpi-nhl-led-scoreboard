import { App } from './main';

export const bootstrap = async (app: App) => {
  await app.teamService.bootstrap();

  await app.gameService.bootstrap();

  await app.logoService.bootstrap();
};
