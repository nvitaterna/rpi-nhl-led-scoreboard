import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';

export abstract class Renderer {
  constructor(protected matrix: LedMatrixInstance) {}

  public abstract render(): void;
}
