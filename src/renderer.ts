import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';

export abstract class Renderer {
  constructor(
    protected matrix: LedMatrixInstance,
    protected x: number,
    protected y: number,
  ) {}

  public abstract render(): void;
}
