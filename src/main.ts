import { GameRenderer } from './renderers/game-renderer';

import { NHLGame } from './game';
import { bootstrap } from './bootstrap';

import { getScores } from './nhl-api/nhl-api';
import { LogoStore } from './logo/logo-store';

const teamToFind = 'TOR';

const main = async () => {
  const { matrix, logos } = await bootstrap();

  matrix.brightness(50);

  let lastPull = new Date().getTime();
  let lastNHLData = await getScores('2023-12-11');

  let gameStats = lastNHLData.games.find((game) => {
    return (
      game.awayTeam.abbrev === teamToFind || game.homeTeam.abbrev === teamToFind
    );
  });

  if (!gameStats) {
    throw new Error(`Could not find game for ${teamToFind}`);
  }

  const logoStore = new LogoStore(logos);

  const game = new NHLGame(
    gameStats.homeTeam.name.default,
    gameStats.awayTeam.name.default,
    gameStats.homeTeam.score || 0,
    gameStats.awayTeam.score || 0,
    gameStats.clock?.timeRemaining || '20:00',
    gameStats.period || 1,
  );

  const homeLogo = logoStore.getLogoBuffer(gameStats.homeTeam.abbrev);
  const awayLogo = logoStore.getLogoBuffer(gameStats.awayTeam.abbrev);

  if (!homeLogo || !awayLogo) {
    throw new Error('Could not find logo');
  }

  const gameRenderer = new GameRenderer(matrix, game, homeLogo, awayLogo);

  const loop = async () => {
    gameStats = lastNHLData.games.find((game) => {
      return (
        game.awayTeam.abbrev === teamToFind ||
        game.homeTeam.abbrev === teamToFind
      );
    });

    if (!gameStats) {
      throw new Error(`Could not find game for ${teamToFind}`);
    }

    // re-fetch nhl data every second
    const now = new Date().getTime();
    if (now - lastPull > 1000) {
      lastPull = now;
      const nhlData = await getScores('2023-12-11');
      lastNHLData = nhlData;
    }

    game.updatePeriod(gameStats.period || 1);
    game.updateTime(gameStats.clock?.timeRemaining || '20:00');
    game.updateScore(
      gameStats.homeTeam.score || 0,
      gameStats.awayTeam.score || 0,
    );

    gameRenderer.update();

    matrix.sync();
  };

  setInterval(loop, 100);
};

main();
