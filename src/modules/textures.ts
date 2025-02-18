// textures.ts
import * as PIXI from "pixi.js";
import { createContainer } from "./pixiSetup";
import { initSlot } from "./slot";
import { initLandscapeUI, landscapeUIContainer } from "./ui";
import { setTransform } from "./pixiSetup";

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

  const w = window.innerWidth;
  const h = window.innerHeight;
  const aspectRatio = w / h;
  const desktopConstant = 1.77; // 16:9

  // Scale and position background
  const background = mainContainer.getChildByName(
    "backgroundContainer"
  ) as PIXI.Container;
  if (background) {
    const bgSprite = background.getChildByName(
      "bgLandscapeSprite"
    ) as PIXI.Sprite;
    if (bgSprite) {
      const scaleFactor = Math.max(
        w / bgSprite.texture.width,
        h / bgSprite.texture.height
      );
      setTransform(bgSprite, w / 2, h / 2, scaleFactor, scaleFactor);
    }
  }

  // Scale and position Slot & UI based on screen aspect ratio
  if (aspectRatio >= desktopConstant) {
    // console.log(`${aspectRatio} >= desktopConstant (1.77)`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.48 * aspectRatio,
      0.48 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 94,
      1,
      1
    );
  } else if (aspectRatio < 0.6) {
    // console.log(`${aspectRatio}  < 0.6`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.8 * aspectRatio,
      0.8 * aspectRatio
    );

    const scaledUIHeight = 140 * aspectRatio;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      0.7 * aspectRatio,
      0.7 * aspectRatio
    );
  } else if (aspectRatio < 1.1) {
    // console.log(`${aspectRatio}  < 1.1`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.78 * aspectRatio,
      0.78 * aspectRatio
    );

    const scaledUIHeight = 148 * aspectRatio;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      0.78 * aspectRatio,
      0.78 * aspectRatio
    );
  } else if (aspectRatio < 1.2) {
    // console.log(`${aspectRatio}  < 1.2`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.8 * aspectRatio,
      0.8 * aspectRatio
    );

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.78 * aspectRatio,
      0.78 * aspectRatio
    );

    const scaledUIHeight = 135 * aspectRatio;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      0.73 * aspectRatio,
      0.73 * aspectRatio
    );
  } else if (aspectRatio < 1.3) {
    // console.log(`${aspectRatio}  < 1.3`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.7 * aspectRatio,
      0.7 * aspectRatio
    );

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.78 * aspectRatio,
      0.78 * aspectRatio
    );

    const scaledUIHeight = 130 * aspectRatio;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      0.7 * aspectRatio,
      0.7 * aspectRatio
    );
  } else if (aspectRatio < 1.4) {
    // console.log(`${aspectRatio}  < 1.4`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.7 * aspectRatio,
      0.7 * aspectRatio
    );

    const scaledUIHeight = 130 * aspectRatio;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      0.7 * aspectRatio,
      0.7 * aspectRatio
    );
  } else if (aspectRatio < 1.55) {
    // console.log(`${aspectRatio} < 1.55`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.6 * aspectRatio,
      0.6 * aspectRatio
    );

    const scaledUIHeight = 110 * aspectRatio;
    const scaledOffsetY = scaledUIHeight * 0.5;
    const positionY = window.__PIXI_APP__.screen.height - scaledOffsetY;

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      positionY,
      0.6 * aspectRatio,
      0.6 * aspectRatio
    );
  } else {
    // console.log(`${aspectRatio} > 1.55`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.6 * aspectRatio,
      0.6 * aspectRatio
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
