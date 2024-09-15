// ui.ts
import { createContainer, createSprite, setTransform } from "./pixiSetup";

export const initSlot = function () {
  const slotContainer = createContainer(window.__MAIN_CONTAINER__);
  slotContainer.label = "slotContainer";

  setTransform(
    slotContainer,
    window.__PIXI_APP__.screen.width / 2,
    window.__PIXI_APP__.screen.height / 2.4,
    1.1, // scaleX: Keep the default scale
    1.1, // scaleY: Keep the default scale
    undefined, // rotation: Keep default rotation
    0.5, // anchorX: Center anchor horizontally
    0.5 // anchorY: Center anchor vertically
  );

  const slotBgSprite = createSprite(slotContainer, "slot_base.png");
  slotBgSprite.label = "slotBgSprite";

  const slotBgShadows = createSprite(slotContainer, "slot_lighten.png");
  slotBgShadows.label = "slotBgShadows";

  const slotBgLines = createSprite(slotContainer, "slot_lines.png");
  slotBgLines.label = "slotBgLines";
};
