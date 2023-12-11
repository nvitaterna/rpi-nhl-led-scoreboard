import { mapBuffers } from './logo/map-buffers';
import { GameRenderer } from './renderers/game-renderer';
import { matrix } from './matrix/matrix';
import { Game } from './game';

const main = async () => {
  // map buffers
  console.log('mapping buffers');
  const teamsWithLogoBuffers = await mapBuffers();

  const homeTeam = teamsWithLogoBuffers.find((team) => team.code === 'TOR')!;
  const awayTeam = teamsWithLogoBuffers.find((team) => team.code === 'MTL')!;

  console.log('starting game');
  const game = new Game(homeTeam?.name, awayTeam?.name, 0, 0, '20:00', 1);

  console.log('starting game renderer');
  const gameRenderer = new GameRenderer(
    matrix,
    game,
    homeTeam.logoBuffer,
    awayTeam.logoBuffer,
  );

  matrix.clear().brightness(75);

  gameRenderer.update();

  matrix.sync();

  await new Promise((resolve) => setTimeout(resolve, 10000000));
};

main();
