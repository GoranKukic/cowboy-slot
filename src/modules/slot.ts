// ui.ts
import { createContainer, createSprite, setTransform } from "./pixiSetup";

export const initSlot = function () {
  const slotContainer = createContainer(window.__MAIN_CONTAINER__);
  slotContainer.label = "slotContainer";

  setTransform(
    slotContainer,
    window.__MAIN_CONTAINER__.width / 2,
    window.__MAIN_CONTAINER__.height / 2.6,
    undefined, // scaleX: Keep the default scale
    undefined, // scaleY: Keep the default scale
    undefined, // rotation: Keep default rotation
    0.5, // anchorX: Center anchor horizontally
    0.5 // anchorY: Center anchor vertically
  );

  const slotSprite = createSprite(slotContainer, "slot_base.png");
  slotSprite.label = "landscapeUISprite";
};
