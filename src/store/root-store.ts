import { CurrentUserStore } from "./current-user-store";
import { OrderStore } from "./order-store";
import { ScreenStore } from "./screen-store";

export class RootStore {
  currentUser: CurrentUserStore;
  order: OrderStore;
  screen: ScreenStore;

  constructor() {
    this.currentUser = new CurrentUserStore(this);
    this.order = new OrderStore(this);
    this.screen = new ScreenStore(this);
  }
}
