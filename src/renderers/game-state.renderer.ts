import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';
import { UiData } from '@/ui-data/ui-data.schema';
import { TextRenderer } from './text.renderer';
import { smallFont } from '@/font/fonts';
import { PeriodType } from '@/boxscore/boxscore.schema';

const FINAL_TEXT = 'FINAL';
const GAME_STATE_OFFSET = 2;

export class GameStateRenderer extends Renderer {
  private finalTextRenderer: TextRenderer;
  private periodTextRenderer: TextRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);

    const finalCenterX = TextRenderer.getCenteredX(
      this.matrix,
      FINAL_TEXT,
      smallFont,
    );

    this.finalTextRenderer = new TextRenderer(
      this.matrix,
      finalCenterX,
      0 + GAME_STATE_OFFSET,
      smallFont,
      FINAL_TEXT,
    );

    const periodText = this.getPeriodText(
      uiData.boxscore.periodType ?? 'REGULAR',
      uiData.boxscore.period,
    );

    const periodCenterX = TextRenderer.getCenteredX(
      this.matrix,
      periodText,
      smallFont,
    );

    this.periodTextRenderer = new TextRenderer(
      this.matrix,
      periodCenterX,
      6 + GAME_STATE_OFFSET,
      smallFont,
      periodText,
    );
  }

  private getPeriodText(periodType: PeriodType, period?: number | null) {
    if (periodType === 'OVERTIME') {
      return `OT${period}`;
    }
    if (periodType === 'SHOOTOUT') {
      return 'SO';
    }
    return 'REG';
  }

  update(uiData: UiData) {
    this.periodTextRenderer.updateText(
      this.getPeriodText(
        uiData.boxscore.periodType ?? 'REGULAR',
        uiData.boxscore.period,
      ),
    );
  }

  render() {
    this.finalTextRenderer.render();
    this.periodTextRenderer.render();
  }
}
