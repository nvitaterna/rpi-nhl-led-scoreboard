export abstract class Updateable {
  private lastUpdate: number = 0;

  constructor(protected updateInterval: number) {}

  public abstract update(): Promise<void>;

  protected async shouldUpdate(): Promise<boolean> {
    return Date.now() - this.lastUpdate > this.updateInterval;
  }

  protected afterUpdate() {
    this.lastUpdate = Date.now();
  }
}
