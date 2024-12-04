// global.d.ts
import * as PIXI from "pixi.js";

declare global {
  interface Window {
    __PIXI_APP__: PIXI.Application;
    __MAIN_CONTAINER__: PIXI.Container;
    __LANDSCAPE_UI_CONTAINER__: PIXI.Container;
    __SLOT_CONTAINER__: PIXI.Container;
  }
}
