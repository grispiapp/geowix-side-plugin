import { RootStore } from "./root-store";
import { makeAutoObservable } from "mobx";

export type ScreenType = "orders" | "order-detail" | "search-order" | "splash";

export class ScreenStore {
  rootStore: RootStore;
  screen: ScreenType = "splash";
  previousScreen: ScreenType | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  setScreen = (screen: ScreenType) => {
    this.previousScreen = this.screen;
    this.screen = screen;
  };
}
