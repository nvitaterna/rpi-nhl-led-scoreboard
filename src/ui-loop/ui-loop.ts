import { Loopable } from '@/loopable/loopable';
import { App } from '@/main';

export class UiLoop extends Loopable {
  constructor(private app: App) {
    super(250);
  }

  async loop() {}
}
