// coreFunctions.ts
import * as PIXI from "pixi.js";

let assets = ["slot_bg_textures", "ui_texture",];
let fonts = ["Durango-Western-Eroded-Demo"];

export const initGame = async (
  containerId: string
): Promise<PIXI.Application> => {
  const app = new PIXI.Application();

  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    resizeTo: window,
    background: "#000",
    resolution: window.devicePixelRatio,
    autoDensity: true,
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

  await loadAssets();

  return app;
};

export const loadAssets = async (): Promise<void> => {
  try {
    // Load all assets
    const assetPromises = assets.map((asset) =>
      PIXI.Assets.load(`src/assets/sprites/${asset}.json`)
    );

    // Load fonts
    const fontPromises = fonts.map((font) =>
      PIXI.Assets.load(`src/fonts/${font}.otf`)
    );

    // Wait for all assets to be loaded
    // await Promise.all(assetPromises);

    // Wait for all assets and fonts to be loaded
    await Promise.all([...assetPromises, ...fontPromises]);

    console.log("All assets loaded successfully.");
  } catch (error) {
    console.error("Error loading assets:", error);
  }
};
