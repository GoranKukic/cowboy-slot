// gameCore.ts
import * as PIXI from "pixi.js";
import { addTextureToSymbols } from "./symbols";

let assets = [
  "slot_bg_textures",
  "ui_texture",
  "symbol_texture",
  "tile_texture",
];
let fonts = ["Durango Western Eroded"];

let animateLoading = true;

export const initGame = async (
  containerId: string
): Promise<PIXI.Application> => {
  const app = new PIXI.Application();

  await app.init({
    resizeTo: window,
    background: "#000",
    resolution: window.devicePixelRatio,
    autoDensity: true,
    clearBeforeRender: true,
  });

  // Enable PixiJS inspector in Chrome Dev tools
  window.__PIXI_APP__ = app;

  // Append the canvas to the container
  const pixiStage = document.querySelector<HTMLDivElement>(containerId);
  if (pixiStage) {
    pixiStage.appendChild(app.canvas);
    app.stage.label = "app.stage";
  } else {
    console.error(`${containerId} container not found.`);
  }

  loadingGunAnim();
  await loadAssets();
  // console.log("Assets loaded");
  addTextureToSymbols();
  animateLoading = false;

  return app;
};

export const loadAssets = async (): Promise<void> => {
  try {
    // Load all assets
    const assetPromises = assets.map((asset) =>
      PIXI.Assets.load(`/assets/sprites/${asset}.json`)
    );

    // Load fonts
    const fontPromises = fonts.map((font) =>
      PIXI.Assets.load(`/fonts/${font}.ttf`)
    );

    await Promise.all([...assetPromises, ...fontPromises]);
  } catch (error) {
    console.error("Error loading assets:", error);
  }
};

function loadingGunAnim(): void {
  const svgObject = document.getElementById("loading-gun") as HTMLObjectElement;

  if (svgObject && svgObject.contentDocument) {
    const svgDoc = svgObject.contentDocument;

    const bulletIds = [
      "gun_bullet_1",
      "gun_bullet_2",
      "gun_bullet_3",
      "gun_bullet_4",
      "gun_bullet_5",
      "gun_bullet_6",
    ];

    if (animateLoading) {
      setTimeout(() => {
        bulletIds.forEach((id, index) => {
          const bullet = svgDoc.getElementById(id);
          if (bullet) {
            setTimeout(() => {
              bullet.setAttribute("fill", "#000000");
            }, index * 200);
          }
        });

        setTimeout(() => {
          bulletIds.forEach((id) => {
            const bullet = svgDoc.getElementById(id);
            if (bullet) {
              bullet.setAttribute("fill", "#D2D2D2");
            }
          });

          loadingGunAnim();
        }, bulletIds.length * 200 + 100);
      }, 300);
    } else {
      return;
    }
  }
}
