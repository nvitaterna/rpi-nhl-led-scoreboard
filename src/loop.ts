import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { LogoStore } from './logo/logo-store';
import { PreGameRenderer } from './renderers/pre-game-renderer';
import { Renderer } from './renderers/renderer';
import { ScheduleFetcher } from './schedule-fetcher/schedule-fetcher';
import { ScoreFetcher } from './score-fetcher/score-fetcher';
import { NhlGame } from './nhl-game/nhl-game';
import { Team } from './team/team';
import { GameRenderer } from './renderers/game-renderer';

let renderer: Renderer | null = null;
let game: NhlGame | null = null;

export const loop = (
  matrix: LedMatrixInstance,
  logoStore: LogoStore,
  scheduleFetcher: ScheduleFetcher,
  scoreFetcher: ScoreFetcher,
) => {
  scheduleFetcher.loop();

  const schedule = scheduleFetcher.getSchedule();

  if (!schedule) {
    return;
  }

  const nextGame = schedule.games[0];
  const gameId = nextGame.id;

  if (!nextGame) {
    return;
  }

  const homeTeam = new Team(
    nextGame.homeTeam.abbrev,
    nextGame.homeTeam.score || 0,
  );
  const awayTeam = new Team(
    nextGame.awayTeam.abbrev,
    nextGame.awayTeam.score || 0,
  );

  if (!game) {
    game = new NhlGame(nextGame.id, homeTeam, awayTeam);
  }

  switch (nextGame.gameState) {
    case 'FUT': {
      // check if renderer is a PreGameRenderer
      if (!(renderer instanceof PreGameRenderer)) {
        renderer = new PreGameRenderer(
          matrix,
          logoStore.getLogoBuffer(nextGame.homeTeam.abbrev),
          logoStore.getLogoBuffer(nextGame.awayTeam.abbrev),
          new Date(nextGame.gameDate),
        );
      }

      break;
    }
    case 'LIVE': {
      scoreFetcher.loop();
      const scores = scoreFetcher.getScores();
      const boxScore = scores?.games.find((game) => game.id === gameId);

      if (!boxScore) {
        return;
      }

      // check if renderer is a GameRenderer
      if (!(renderer instanceof GameRenderer)) {
        renderer = new GameRenderer(
          matrix,
          game,
          logoStore.getLogoBuffer(nextGame.homeTeam.abbrev),
          logoStore.getLogoBuffer(nextGame.awayTeam.abbrev),
        );
      }

      // update game
      game.updatePeriod(boxScore.period || 1);
      game.updateHomeScore(boxScore.homeTeam.score || 0);
      game.updateAwayScore(boxScore.awayTeam.score || 0);

      const timeRemaining = boxScore.clock?.inIntermission
        ? '00:00'
        : boxScore.clock?.timeRemaining || '20:00';

      game.updateClock(timeRemaining);
      game.updateGameStatus(boxScore.gameState);

      game.loop();

      break;
    }
    default: {
      return;
    }
  }
  renderer.update();
  matrix.sync();
};
