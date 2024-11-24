// textures.ts
import * as PIXI from "pixi.js";
import { createContainer } from "./pixiSetup";
import { initSlot } from "./slot";
import { initLandscapeUI } from "./ui";

export const loadTextures = async (app: PIXI.Application): Promise<void> => {
  const mainContainer = createContainer(app.stage);
  mainContainer.label = "mainContainer";
  mainContainer.width = app.screen.width;
  mainContainer.height = app.renderer.height;

  app.stage.addChild(mainContainer);

  // Make mainContainer globally accessible
  window.__MAIN_CONTAINER__ = mainContainer;

  window.addEventListener("resize", () => {
    setTimeout(() => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      mainContainer.width = app.renderer.width;
      mainContainer.height = app.renderer.height;
      
    }, 350);
  });

  try {
    const texture = await PIXI.Assets.load(
      "./src/assets/images/bg_landscape.png"
    );

    const backgroundContainer = createContainer(mainContainer);
    // backgroundContainer.width = app.screen.width;
    // backgroundContainer.height = app.screen.height;
    backgroundContainer.x = 0;
    backgroundContainer.y = 0;
    backgroundContainer.label = "backgroundContainer";
    const bgLandscapeSprite = new PIXI.Sprite(texture);
    bgLandscapeSprite.label = "bgLandscapeSprite";
    bgLandscapeSprite.anchor.set(0.5); // Center the anchor point
    bgLandscapeSprite.x = app.screen.width / 2; // Center sprite horizontally
    bgLandscapeSprite.y = app.screen.height / 2; // Center sprite vertically
    bgLandscapeSprite.scale.set(1.3); // Set scale (1 means no scaling)
    bgLandscapeSprite.rotation = 0; // Set rotation (0 means no rotation)
    backgroundContainer.addChild(bgLandscapeSprite);

    console.log("mainContainer.width: ", mainContainer.width);
    console.log("mainContainer.height: ", mainContainer.height);
  } catch (error) {
    console.error("Failed to load texture:", error);
  }

  initSlot();
  initLandscapeUI();
};
