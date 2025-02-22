// textures.ts
import * as PIXI from "pixi.js";
import { createContainer } from "./pixiSetup";
import { initSlot } from "./slot";
import { initLandscapeUI, landscapeUIContainer, initPortraitUI } from "./ui";
import { setTransform } from "./pixiSetup";

declare global {
  interface Window {
    __RATIO_SCALE__: number;
  }
}

export const loadTextures = async (app: PIXI.Application): Promise<void> => {
  const mainContainer = createContainer(app.stage);
  mainContainer.label = "mainContainer";
  mainContainer.width = app.screen.width;
  mainContainer.height = app.screen.height;

  app.stage.addChild(mainContainer);

  window.__MAIN_CONTAINER__ = mainContainer;

  try {
    const texture = await PIXI.Assets.load("/assets/images/bg_landscape.jpg");

    const backgroundContainer = createContainer(mainContainer);
    backgroundContainer.label = "backgroundContainer";
    const bgLandscapeSprite = new PIXI.Sprite(texture);
    bgLandscapeSprite.label = "bgLandscapeSprite";
    bgLandscapeSprite.anchor.set(0.5); // Center anchor point
    bgLandscapeSprite.x = app.screen.width / 2;
    bgLandscapeSprite.y = app.screen.height / 2;
    backgroundContainer.addChild(bgLandscapeSprite);

    mainContainer.addChild(backgroundContainer);

    initLandscapeUI();
    initSlot();

    // Handle resize
    window.addEventListener("resize", () => {
      resizeTextures();
    });

    // Initial resize
    resizeTextures();
  } catch (error) {
    console.error("Failed to load texture:", error);
  }
};

export const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.style.display = "none";
  }
};

const resizeTextures = () => {
  const mainContainer = window.__MAIN_CONTAINER__ as PIXI.Container;
  const slotContainer = window.__SLOT_CONTAINER__ as PIXI.Container;

  const maxAspectRatio = 2.8;
  const minAspectRatio = 1 / maxAspectRatio;

  // Adjusted width and height of screen
  const adjustedWidth =
    window.innerWidth / window.innerHeight > maxAspectRatio
      ? window.innerHeight * maxAspectRatio
      : window.innerWidth;
  const adjustedHeight =
    window.innerWidth / window.innerHeight < minAspectRatio
      ? window.innerWidth / minAspectRatio
      : window.innerHeight;

  // Calculate aspect ratio
  const aspectRatio = adjustedWidth / adjustedHeight;
  const desktopConstant = 1.77; // 16:9

  // Ste global ratioScale
  window.__RATIO_SCALE__ =
    adjustedHeight > adjustedWidth
      ? adjustedWidth / 1080
      : adjustedHeight / 1080;

  // Resize PIXI renderer to new dimensions
  window.__PIXI_APP__.renderer.resize(adjustedWidth, adjustedHeight);

  // Reset Portrait UI
  if (aspectRatio > 0.6) {
    initPortraitUI(false);
  }

  // Sacling and positioning of background
  const background = mainContainer.getChildByName(
    "backgroundContainer"
  ) as PIXI.Container;
  if (background) {
    const bgSprite = background.getChildByName(
      "bgLandscapeSprite"
    ) as PIXI.Sprite;
    if (bgSprite) {
      const scaleFactor = Math.max(
        adjustedWidth / bgSprite.texture.width,
        adjustedHeight / bgSprite.texture.height
      );
      setTransform(
        bgSprite,
        adjustedWidth / 2,
        adjustedHeight / 2,
        scaleFactor,
        scaleFactor
      );
    }
  }

  // Sacling and positioning Slot and UI containers
  if (aspectRatio >= desktopConstant) {
    // console.log(`${aspectRatio} >= desktopConstant (1.77)`);

    setTransform(
      slotContainer,
      adjustedWidth / 2,
      adjustedHeight / 2.4,
      1.1 * window.__RATIO_SCALE__,
      1.1 * window.__RATIO_SCALE__
    );

    setTransform(
      landscapeUIContainer,
      adjustedWidth / 2,
      adjustedHeight - 110 * window.__RATIO_SCALE__,
      1.2 * window.__RATIO_SCALE__,
      1.2 * window.__RATIO_SCALE__
    );
  } else if (aspectRatio < 0.6) {
    // console.log(`${aspectRatio} < 0.6`);

    setTransform(
      slotContainer,
      adjustedWidth / 2,
      adjustedHeight / 2.4,
      0.92 * window.__RATIO_SCALE__,
      0.92 * window.__RATIO_SCALE__
    );

    const scaledUIHeight = 160 * window.__RATIO_SCALE__;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = adjustedHeight - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      adjustedWidth / 2,
      positionY,
      0.85 * window.__RATIO_SCALE__,
      0.85 * window.__RATIO_SCALE__
    );

    initPortraitUI(true);
  } else if (aspectRatio < 1.1) {
    // console.log(`${aspectRatio}  < 1.1`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.9 * window.__RATIO_SCALE__,
      0.9 * window.__RATIO_SCALE__
    );

    const scaledUIHeight = 170 * window.__RATIO_SCALE__;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      0.9 * window.__RATIO_SCALE__,
      0.9 * window.__RATIO_SCALE__
    );
  } else if (aspectRatio < 1.2) {
    // console.log(`${aspectRatio}  < 1.2`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );

    const scaledUIHeight = 190 * window.__RATIO_SCALE__;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );
  } else if (aspectRatio < 1.3) {
    // console.log(`${aspectRatio}  < 1.3`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );

    const scaledUIHeight = 190 * window.__RATIO_SCALE__;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );
  } else if (aspectRatio < 1.4) {
    // console.log(`${aspectRatio}  < 1.4`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );

    const scaledUIHeight = 190 * window.__RATIO_SCALE__;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );
  } else if (aspectRatio < 1.55) {
    // console.log(`${aspectRatio} < 1.55`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );

    const scaledUIHeight = 110 * aspectRatio;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );
  } else {
    // console.log(`${aspectRatio} > 1.55`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * window.__RATIO_SCALE__,
      1 * window.__RATIO_SCALE__
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 94,
      1,
      1
    );
  }
};
