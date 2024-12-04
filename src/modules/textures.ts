// textures.ts
import * as PIXI from "pixi.js";
import { createContainer } from "./pixiSetup";
import { initSlot } from "./slot";
import { initLandscapeUI } from "./ui";
import { setTransform } from "./pixiSetup";

export const loadTextures = async (app: PIXI.Application): Promise<void> => {
  const mainContainer = createContainer(app.stage);
  mainContainer.label = "mainContainer";
  mainContainer.width = app.screen.width;
  mainContainer.height = app.screen.height;

  app.stage.addChild(mainContainer);

  window.__MAIN_CONTAINER__ = mainContainer;

  try {
    const texture = await PIXI.Assets.load(
      "./src/assets/images/bg_landscape.jpg"
    );

    const backgroundContainer = createContainer(mainContainer);
    backgroundContainer.label = "backgroundContainer";
    const bgLandscapeSprite = new PIXI.Sprite(texture);
    bgLandscapeSprite.name = "bgLandscapeSprite";
    bgLandscapeSprite.anchor.set(0.5); // Center anchor point
    bgLandscapeSprite.x = app.screen.width / 2;
    bgLandscapeSprite.y = app.screen.height / 2;
    // bgLandscapeSprite.scale.set(1.3);
    backgroundContainer.addChild(bgLandscapeSprite);

    mainContainer.addChild(backgroundContainer);

    initSlot();
    initLandscapeUI();

    // Handle resize
    window.addEventListener("resize", () => {
      resizeTextures();
    });

    // Initial resize
    resizeTextures();
  } catch (error) {
    console.error("Failed to load texture:", error);
  }

  // initSlot();
  // initLandscapeUI();
};

const resizeTextures = () => {
  const mainContainer = window.__MAIN_CONTAINER__ as PIXI.Container;
  const landscapeUIContainer =
    window.__LANDSCAPE_UI_CONTAINER__ as PIXI.Container;
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

  // Adjust UI based on aspect ratio
  if (aspectRatio >= desktopConstant) {
    console.log(`${aspectRatio} >= desktopConstant (1.77)`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.5 * aspectRatio,
      0.5 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 240 / 2, //210 is height of spin btn
      0.6 * aspectRatio,
      0.6 * aspectRatio
    );
  } else if (aspectRatio < 0.6) {
    console.log(`${aspectRatio}  < 0.6`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1.2 * aspectRatio,
      1.2 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 240 / 2, //210 is height of spin btn
      1.2 * aspectRatio,
      1.2 * aspectRatio
    );
  } else if (aspectRatio < 1.1) {
    console.log(`${aspectRatio}  < 1.1`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * aspectRatio,
      1 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 240 / 2, //210 is height of spin btn
      1 * aspectRatio,
      1 * aspectRatio
    );
  } else if (aspectRatio < 1.2) {
    console.log(`${aspectRatio}  < 1.2`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1.0 * aspectRatio,
      1.0 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 240 / 2, //210 is height of spin btn
      1 * aspectRatio,
      1 * aspectRatio
    );
  } else if (aspectRatio < 1.3) {
    console.log(`${aspectRatio}  < 1.3`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      1 * aspectRatio,
      1 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 240 / 2, //210 is height of spin btn
      1 * aspectRatio,
      1 * aspectRatio
    );
  } else if (aspectRatio < 1.4) {
    console.log(`${aspectRatio}  < 1.4`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.9 * aspectRatio,
      0.9 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 240 / 2, //210 is height of spin btn
      0.9 * aspectRatio,
      0.9 * aspectRatio
    );
  } else if (aspectRatio < 1.6) {
    console.log(`${aspectRatio} < 1.6`);

    setTransform(
      slotContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height / 2.4,
      0.8 * aspectRatio,
      0.8 * aspectRatio
    );

    setTransform(
      landscapeUIContainer,
      window.__PIXI_APP__.screen.width / 2,
      window.__PIXI_APP__.screen.height - 250 / 2, //210 is height of spin btn
      0.8 * aspectRatio,
      0.8 * aspectRatio
    );
  }
};
