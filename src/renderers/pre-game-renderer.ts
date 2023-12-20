import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { LogoRenderer } from './logo-renderer';
import { Renderer } from './renderer';
import { ScheduledTimeRenderer } from './scheduled-time-renderer';
import { DateRenderer } from './date-renderer';

export class PreGameRenderer extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private scheduledTimeRenderer: ScheduledTimeRenderer;
  private dateRenderer: DateRenderer;

  constructor(
    protected matrix: LedMatrixInstance,
    homeLogo: Buffer,
    awayLogo: Buffer,
    gameTime: Date,
  ) {
    super(matrix);

    this.homeLogoRenderer = new LogoRenderer(matrix, homeLogo, true);
    this.awayLogoRenderer = new LogoRenderer(matrix, awayLogo, false);
    this.scheduledTimeRenderer = new ScheduledTimeRenderer(matrix, gameTime);
    this.dateRenderer = new DateRenderer(matrix, gameTime);
  }

  public update(): void {
    this.homeLogoRenderer.update();
    this.awayLogoRenderer.update();
    this.scheduledTimeRenderer.update();
    this.dateRenderer.update();
  }
}
