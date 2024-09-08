// coreFunctions.ts
import * as PIXI from "pixi.js";

let assets = ["slot_bg_textures", "ui_textures"];

export const initGame = async (
  containerId: string
): Promise<PIXI.Application> => {
  const app = new PIXI.Application();

  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    autoDensity: true,
    background: 0x000000,
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

    // Wait for all assets to be loaded
    await Promise.all(assetPromises);

    console.log("All assets loaded successfully.");
  } catch (error) {
    console.error("Error loading assets:", error);
  }
};
