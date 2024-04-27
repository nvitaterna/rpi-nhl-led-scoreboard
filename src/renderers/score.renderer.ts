import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix/dist/types';
import { Renderer } from './renderer';
import { TextRenderer } from './text.renderer';
import { UiData } from '@/ui-data/ui-data.schema';
import { scoreFont } from '@/font/fonts';

const DASH_WIDTH = 4;
const SCORE_OFFSET = 15;

export class ScoreRenderer extends Renderer {
  private homeScoreRenderer: TextRenderer;
  private awayScoreRenderer: TextRenderer;
  private dashRenderer: TextRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);

    const homeScore = (uiData.boxscore.homeScore ?? 0).toString();
    const awayScore = (uiData.boxscore.awayScore ?? 0).toString();

    // center is 32
    // home score needs to be 32 - dash width - 1px spacing - home score width
    // away score needs to be 32 + dash width + 1px spacing

    const homeScoreX = 32 - DASH_WIDTH - 1 - scoreFont.stringWidth(homeScore);
    const awayScoreX = 32 + DASH_WIDTH + 1;

    this.homeScoreRenderer = new TextRenderer(
      this.matrix,
      homeScoreX,
      0 + SCORE_OFFSET,
      scoreFont,
      homeScore,
    );

    this.awayScoreRenderer = new TextRenderer(
      this.matrix,
      awayScoreX,
      0 + SCORE_OFFSET,
      scoreFont,
      awayScore,
    );

    const dashCenterX = TextRenderer.getCenteredX(this.matrix, '-', scoreFont);

    this.dashRenderer = new TextRenderer(
      this.matrix,
      dashCenterX,
      0 + SCORE_OFFSET,
      scoreFont,
      '-',
    );
  }

  render() {
    this.homeScoreRenderer.render();
    this.dashRenderer.render();
    this.awayScoreRenderer.render();
  }
}
