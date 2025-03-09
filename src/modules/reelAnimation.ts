import * as PIXI from "pixi.js";
// import { Assets } from "pixi.js";
// import { Spine } from "@esotericsoftware/spine-pixi-v8";
// import "@esotericsoftware/spine-pixi-v8";
import type { SlotSymbol } from "./symbols";
import { playSoundEffect } from "./sound";
import { gsap } from "gsap";
import {
  symbol1,
  symbol2,
  symbol3,
  symbol4,
  symbol5,
  symbol6,
  symbol7,
  symbol8,
  symbol9,
} from "./symbols";

export const forcedCharacterCombinations: SlotSymbol[][][] = [
  // Westgirl
  [
    [symbol4, symbol6, symbol1, symbol1, symbol8],
    [symbol4, symbol1, symbol2, symbol8, symbol7],
    [symbol4, symbol5, symbol3, symbol9, symbol4],
  ],
  [
    [symbol5, symbol4, symbol1, symbol1, symbol4],
    [symbol4, symbol4, symbol2, symbol8, symbol3],
    [symbol2, symbol4, symbol3, symbol9, symbol5],
  ],
  [
    [symbol5, symbol9, symbol4, symbol1, symbol4],
    [symbol4, symbol1, symbol4, symbol8, symbol7],
    [symbol2, symbol1, symbol4, symbol9, symbol5],
  ],
  [
    [symbol5, symbol6, symbol1, symbol4, symbol8],
    [symbol4, symbol3, symbol2, symbol4, symbol9],
    [symbol2, symbol3, symbol3, symbol4, symbol4],
  ],
  [
    [symbol5, symbol6, symbol1, symbol1, symbol4],
    [symbol4, symbol3, symbol2, symbol8, symbol4],
    [symbol2, symbol3, symbol3, symbol9, symbol4],
  ],
  // Westman
  [
    [symbol3, symbol6, symbol1, symbol1, symbol8],
    [symbol3, symbol1, symbol2, symbol8, symbol7],
    [symbol3, symbol5, symbol3, symbol9, symbol4],
  ],
  [
    [symbol5, symbol3, symbol1, symbol1, symbol4],
    [symbol4, symbol3, symbol2, symbol8, symbol3],
    [symbol2, symbol3, symbol3, symbol9, symbol5],
  ],
  [
    [symbol5, symbol9, symbol3, symbol1, symbol4],
    [symbol4, symbol1, symbol3, symbol8, symbol7],
    [symbol2, symbol1, symbol3, symbol9, symbol5],
  ],
  [
    [symbol5, symbol6, symbol1, symbol3, symbol8],
    [symbol4, symbol3, symbol2, symbol3, symbol9],
    [symbol2, symbol7, symbol7, symbol3, symbol4],
  ],
  [
    [symbol5, symbol6, symbol1, symbol1, symbol3],
    [symbol4, symbol8, symbol2, symbol8, symbol3],
    [symbol2, symbol7, symbol4, symbol9, symbol3],
  ],
];

export function findMatchingReel(
  spinResult: SlotSymbol[][]
): { symbol: string; index: number }[] {
  let matches: { symbol: string; index: number }[] = [];

  for (let reelIndex = 0; reelIndex < spinResult[0].length; reelIndex++) {
    let firstSymbol = spinResult[0][reelIndex].name;
    let secondSymbol = spinResult[1][reelIndex].name;
    let thirdSymbol = spinResult[2][reelIndex].name;

    // Proveravamo da li su svi simboli u koloni isti i da li su "symbol3" ili "symbol4"
    if (
      firstSymbol === secondSymbol &&
      secondSymbol === thirdSymbol &&
      (firstSymbol === "symbol3" || firstSymbol === "symbol4")
    ) {
      matches.push({ symbol: firstSymbol, index: reelIndex });
    }
  }

  return matches;
}

export async function createReelAnimation(
  parntContainer: PIXI.Container,
  assetKey: string
) {
  const backgroundLabel =
    assetKey === "westwoman"
      ? parntContainer.label + "_westgirl_bg"
      : parntContainer.label + "_westman_bg";

  const background: PIXI.Sprite = parntContainer.getChildByName(
    backgroundLabel
  ) as PIXI.Sprite;

  if (background) {
    background.visible = true;
    gsap.fromTo(
      background,
      { alpha: 0 },
      { alpha: 1, duration: 0.5, delay: 0.3 }
    );
  }

  // const sheet = PIXI.Assets.get(`/assets/sprites/${assetKey}.json`);

  // const frames = Object.keys(sheet.textures).map(
  //   (frame) => sheet.textures[frame]
  // );

  let frames: PIXI.Texture[] = [];

  if (assetKey === "westwoman") {
    const sheet = PIXI.Assets.get(`/assets/sprites/${assetKey}.json`);
    frames = sheet ? Object.values(sheet.textures) : [];
  } else if (assetKey === "westman") {
    const jsonFiles = [
      `/assets/sprites/westman_00.json`,
      `/assets/sprites/westman_01.json`,
      `/assets/sprites/westman_02.json`,
      `/assets/sprites/westman_03.json`,
    ];

    for (const jsonFile of jsonFiles) {
      const sheet = PIXI.Assets.get(jsonFile) as
        | { textures: Record<string, PIXI.Texture> }
        | undefined;
      if (sheet) {
        frames.push(...Object.values(sheet.textures));
      } else {
        console.warn(`Asset ${jsonFile} was not found in Cache.`);
      }
    }
  }

  if (frames.length === 0) {
    console.error(`No frames found for ${assetKey}`);
    return null;
  }

  const cowboy = new PIXI.AnimatedSprite(frames);

  if (assetKey === "westwoman") {
    cowboy.x = parntContainer.width / 2 + 57;
    cowboy.y = parntContainer.height / 2 - 13;
    cowboy.scale.set(0.235);
    playSoundEffect("westwoman_sound");
  } else if (assetKey === "westman") {
    cowboy.x = parntContainer.width / 2 - 83;
    cowboy.y = parntContainer.height / 2 - 20;
    cowboy.scale.x = 0.23;
    cowboy.scale.y = 0.23;
    playSoundEffect("westman_sound");
  }

  cowboy.animationSpeed = 0.5;
  cowboy.loop = false;
  cowboy.anchor.set(0.5);
  cowboy.label = "reelAimation";

  parntContainer.addChild(cowboy);

  gsap.fromTo(cowboy, { alpha: 0 }, { alpha: 1, duration: 0.5, delay: 0.3 });
  cowboy.play();

  return cowboy;
}

export function clearCharacterReels(characterReels: PIXI.Container[]) {
  characterReels.forEach((reel) => {
    const westgirlBg = reel.getChildByName(
      reel.label + "_westgirl_bg"
    ) as PIXI.Sprite;
    const westmanBg = reel.getChildByName(
      reel.label + "_westman_bg"
    ) as PIXI.Sprite;

    [westgirlBg, westmanBg].forEach((background) => {
      if (background) {
        gsap.to(background, {
          alpha: 0,
          duration: 0.5,
          onComplete: () => {
            background.visible = false;
          },
        });
      }
    });

    const cowboy = reel.getChildByName("reelAimation") as PIXI.AnimatedSprite;
    if (cowboy) {
      gsap.to(cowboy, {
        alpha: 0,
        duration: 0.5,
        onComplete: () => {
          cowboy.stop();
          reel.removeChild(cowboy);
        },
      });
    }
  });
}

// Spine animations are broken so we used PIXI.AnimatedSprite instead
// @esotericsoftware/spine-pixi-v8
// async function animateSpine() {
//   Assets.add({
//     alias: "spineWomanData",
//     // src: "/assets/spine/WEST-SLOTS-character-Woman.skel",
//     // src: "/assets/spine/json/WEST-SLOTS-character-Woman.json",
//     data: { binary: true },
//   });

//   Assets.add({
//     alias: "spineWomanAtlas",
//     // src: "/assets/spine/WEST-SLOTS-character-Woman.atlas",
//     // src: "/assets/spine/json/WEST-SLOTS-character-Woman.atlas",
//   });

//   await PIXI.Assets.load(["spineWomanData", "spineWomanAtlas"]);

//   const westWorld = Spine.from({
//     atlas: "spineWomanAtlas",
//     skeleton: "spineWomanData",
//     scale: 0.2,
//   });

//   westWorld.label = "spineAnimation";
//   westWorld.state.data.defaultMix = 0.2;

//   westWorld.state.clearTracks();
//   westWorld.state.setAnimation(0, "animation", true);

//   window.__SLOT_CONTAINER__.addChild(westWorld);
// }
