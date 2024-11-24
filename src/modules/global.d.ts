// global.d.ts
import * as PIXI from "pixi.js";

declare global {
  interface Window {
    __PIXI_APP__: PIXI.Application;
    __MAIN_CONTAINER__: PIXI.Container;
  }
}

declare module "@pixi/text" {
  interface DropShadow {
    alpha?: number;
    angle?: number;
    blur?: number;
    color?: string;
    distance?: number;
  }

  interface TextStyle {
    dropShadowDistance?: number;
    dropShadow?: DropShadow; // Dodajte DropShadow kao interfejs
  }
}
