// ui.ts
import * as PIXI from "pixi.js";
import { createContainer, createSprite, setTransform } from "./pixiSetup";

export const initSlot = function () {
  const slotContainer = createContainer(window.__MAIN_CONTAINER__);
  slotContainer.label = "slotContainer";
  window.__SLOT_CONTAINER__ = slotContainer;

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

  // Create reels
  // Create reels
  const reelCount = 5;
  const symbolsPerReel = 3;
  const reelWidth = 199; // Width of each reel
  const reelHeight = 625; // Height of each reel
  const reelSpacing = 25; // Space between reel
  const initialX = -448; // Početna X koordinata unutar slotContainer-a
  const initialY = -210; // Početna Y koordinata unutar slotContainer-a

  for (let i = 0; i < reelCount; i++) {
    const reelContainer = createContainer(slotContainer);
    reelContainer.label = `reel_${i}`;

    reelContainer.position.set(
      initialX + i * (reelWidth + reelSpacing),
      initialY
    );
    // Add symbols to each reel
    for (let j = 0; j < symbolsPerReel; j++) {
      const symbolContainer = createContainer(reelContainer);
      symbolContainer.label = "symbolContainer";
      const symbolBg = createSprite(symbolContainer, "gold_tile.png");
      symbolBg.alpha = 0;
      symbolBg.label = `symbolBg_${i}_${j}`;

      setTransform(
        symbolContainer,
        0, // position x
        j * (reelHeight / symbolsPerReel), // position y
        0.38, // scaleX
        0.38, // scaleY
        undefined, // rotation
        0.5, // anchorX
        0.5 // anchorY
      );
    }
  }

  // const reelCount = 5;
  // const symbolsPerReel = 3;

  initializeSlotWithDefaultSymbols();
  function initializeSlotWithDefaultSymbols() {
    for (let i = 0; i < defaultSymbols.length; i++) {
      const reelSymbols = defaultSymbols[i];
      const reelContainer = slotContainer.getChildByName(
        `reel_${i}`
      ) as PIXI.Container;

      for (let j = 0; j < reelSymbols.length; j++) {
        const symbolName = reelSymbols[j];
        const symbolData = getSymbolByName(symbolName);

        if (!symbolData) continue;

        const symbolContainer = reelContainer.getChildAt(j) as PIXI.Container;

        // Kreirajte sprite za simbol
        const symbolSprite = createSprite(symbolContainer, symbolData.texture);
        symbolSprite.label = `symbol_${symbolData.name}`;
        symbolSprite.name = symbolData.name;

        // Pozicionirajte simbol unutar svog kontejnera
        setTransform(symbolSprite, 0, 0, 1, 1, undefined, 0.5, 0.5);
      }
    }
  }
};

const symbols = [
  { id: 1, name: "snake", texture: "snake.png" },
  { id: 2, name: "bag_of_gold", texture: "bag_of_gold.png" },
  { id: 3, name: "barrels", texture: "barrels.png" },
  { id: 4, name: "boots", texture: "boots.png" },
  { id: 5, name: "dynamite_crate", texture: "dynamite_crate.png" },
  { id: 6, name: "gas_lamp", texture: "gas_lamp.png" },
  { id: 7, name: "pile_of_gold", texture: "pile_of_gold.png" },
  { id: 8, name: "trolley", texture: "trolley.png" },
  { id: 9, name: "wild", texture: "wild.png" },
];
const defaultSymbols = [
  ["snake", "bag_of_gold", "barrels"], // Reel 1
  ["boots", "wild", "dynamite_crate"], // Reel 2
  ["gas_lamp", "pile_of_gold", "snake"], // Reel 3
  ["bag_of_gold", "barrels", "barrels"], // Reel 4
  ["trolley", "trolley", "wild"], // Reel 5
];

function getSymbolByName(name: string) {
  return symbols.find((symbol) => symbol.name === name);
}
