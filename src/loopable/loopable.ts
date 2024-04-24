export abstract class Loopable {
  private loopInterval: NodeJS.Timeout | null = null;

  constructor(private loopMs: number) {}

  public start() {
    if (this.loopInterval !== null) {
      this.stop();
    }
    this.loopInterval = setInterval(() => this.loop(), this.loopMs);
  }

  public stop() {
    if (this.loopInterval !== null) {
      clearInterval(this.loopInterval);
    }
    this.loopInterval = null;
  }

  protected abstract loop(): Promise<void> | void;
}
