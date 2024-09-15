// global.d.ts
import * as PIXI from "pixi.js";

declare global {
  interface Window {
    __PIXI_APP__: PIXI.Application;
    __MAIN_CONTAINER__: PIXI.Container;
  }
}
