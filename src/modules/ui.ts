// ui.ts
import { createContainer, createSprite, setTransform } from "./pixiSetup";

export const initLandscapeUI = function () {
  const landscapeUIContainer = createContainer(window.__MAIN_CONTAINER__);
  landscapeUIContainer.label = "landscapeUIContainer";

  setTransform(
    landscapeUIContainer,
    window.__MAIN_CONTAINER__.width / 2,
    window.__MAIN_CONTAINER__.height * 0.75,
    undefined, // scaleX: Keep the default scale
    undefined, // scaleY: Keep the default scale
    undefined, // rotation: Keep default rotation
    0.5, // anchorX: Center anchor horizontally
    0.5 // anchorY: Center anchor vertically
  );

  const landscapeUIBase1Sprite = createSprite(
    landscapeUIContainer,
    "base_ui_1.png"
  );
  landscapeUIBase1Sprite.label = "landscapeUISprite";

  const landscapeUIBase2Sprite = createSprite(
    landscapeUIContainer,
    "base_ui_2.png"
  );
  landscapeUIBase2Sprite.label = "landscapeUISprite";
};
