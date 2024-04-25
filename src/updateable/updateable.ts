export abstract class Updateable {
  private lastUpdate: number = 0;

  private isUpdating: boolean = false;

  constructor(protected updateInterval: number) {}

  public abstract update(): Promise<void>;

  protected async shouldUpdate(): Promise<boolean> {
    return (
      Date.now() - this.lastUpdate > this.updateInterval && !this.isUpdating
    );
  }

  protected beforeUpdate() {
    this.isUpdating = true;
  }

  protected afterUpdate() {
    this.lastUpdate = Date.now();
  }
}
