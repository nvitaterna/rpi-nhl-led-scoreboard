import { GameRenderer } from './renderers/game-renderer';

import { bootstrap } from './bootstrap';

import { getScores } from './nhl-api/nhl-api';
import { LogoStore } from './logo/logo-store';
import { NhlGame } from './nhl-game/nhl-game';
import { Team } from './team/team';

const main = async () => {
  const { matrix, logos } = await bootstrap();

  matrix.brightness(100);

  let lastPull = new Date().getTime();
  let nhlScores = await getScores('2023-12-18');

  const nhlGames: NhlGame[] = [];

  const gameId = 2023020480;

  nhlScores.games.forEach((game) => {
    if (game.id !== gameId) {
      return;
    }
    // check if game exists
    let nhlGame = nhlGames.find((g) => g.id === game.id);

    if (!nhlGame) {
      const homeTeam = new Team(game.homeTeam.abbrev, game.homeTeam.score || 0);
      const awayTeam = new Team(game.awayTeam.abbrev, game.awayTeam.score || 0);
      nhlGame = new NhlGame(game.id, homeTeam, awayTeam);
      nhlGame.updateClock(game.clock?.timeRemaining || '20:00');
      nhlGames.push(nhlGame);
    }

    // update game
    nhlGame.updatePeriod(game.period || 1);
    nhlGame.updateHomeScore(game.homeTeam.score || 0);
    nhlGame.updateAwayScore(game.awayTeam.score || 0);
    nhlGame.updateClockRunning(
      game.clock?.running || false,
      game.clock?.timeRemaining || '20:00',
    );
    nhlGame.updateGameStatus(game.gameState);
  });

  const logoStore = new LogoStore(logos);

  const homeLogo = logoStore.getLogoBuffer(
    nhlGames.find((game) => game.id === gameId)!.homeTeam.abbrev,
  );
  const awayLogo = logoStore.getLogoBuffer(
    nhlGames.find((game) => game.id === gameId)!.awayTeam.abbrev,
  );

  if (!homeLogo || !awayLogo) {
    throw new Error('Could not find logo');
  }

  const gameRenderer = new GameRenderer(
    matrix,
    nhlGames.find((game) => game.id === gameId)!,
    homeLogo,
    awayLogo,
  );

  const loop = async () => {
    // re-fetch nhl data every second
    const now = new Date().getTime();
    if (now - lastPull > 1000) {
      lastPull = now;
      const nhlData = await getScores('2023-12-18');
      nhlScores = nhlData;
    }

    nhlScores.games.forEach((game) => {
      if (game.id !== gameId) {
        return;
      }
      // check if game exists
      let nhlGame = nhlGames.find((g) => g.id === game.id);

      if (!nhlGame) {
        const homeTeam = new Team(
          game.homeTeam.abbrev,
          game.homeTeam.score || 0,
        );
        const awayTeam = new Team(
          game.awayTeam.abbrev,
          game.awayTeam.score || 0,
        );
        nhlGame = new NhlGame(game.id, homeTeam, awayTeam);
        nhlGame.updateClock(game.clock?.timeRemaining || '20:00');
        nhlGames.push(nhlGame);
      }

      // update game
      nhlGame.updatePeriod(game.period || 1);
      nhlGame.updateHomeScore(game.homeTeam.score || 0);
      nhlGame.updateAwayScore(game.awayTeam.score || 0);

      nhlGame.updateClockRunning(
        game.clock?.running || false,
        game.clock?.timeRemaining || '20:00',
      );
      nhlGame.updateGameStatus(game.gameState);
      nhlGame.loop();
    });

    gameRenderer.update();

    matrix.sync();
  };

  setInterval(loop, 50);
};

main();
