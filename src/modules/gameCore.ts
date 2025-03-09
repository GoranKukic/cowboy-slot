// gameCore.ts
import * as PIXI from "pixi.js";
import { Howl } from "howler";
import { addTextureToSymbols } from "./symbols";

let assets: string[] = [
  "slot_bg_textures",
  "ui_texture",
  "symbol_texture",
  "tile_texture",
  "westwoman",
  "westman_00",
  "westman_01",
  "westman_02",
  "westman_03",
];
// let spineAssets: string[] = ["WEST-SLOTS-character-Woman"];
let pngAssets: string[] = [
  "/assets/images/sound_icon_all.png",
  "/assets/images/sound_icon_effects.png",
  "/assets/images/sound_icon_off.png",
  "/assets/images/info_icon.png",
];
let fonts: string[] = ["Durango Western Eroded"];

export let soundEffects: { [key: string]: Howl } = {};
let sounds: string[] = [
  "btn_click",
  "win_sound",
  "reel_spin",
  "reel_stop",
  "spin_btn",
  "collect",
  "westman_sound",
  "westwoman_sound",
];
export let backgroundMusic: Howl | null = null;

let animateLoading: boolean = true;

export const initGame = async (
  containerId: string
): Promise<PIXI.Application> => {
  const app = new PIXI.Application();

  await app.init({
    resizeTo: window,
    background: "#000",
    resolution: window.devicePixelRatio,
    autoDensity: true,
    clearBeforeRender: true,
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

  loadingGunAnim();
  await loadAssets();
  addTextureToSymbols();
  animateLoading = false;

  const loadingGun = document.getElementById("loading-gun");
  const loadingText = document.getElementById("loadingText");

  if (loadingGun) {
    loadingGun.style.display = "none";
  }

  if (loadingText) {
    loadingText.style.display = "none";
  }

  const hiddenStartButton = document.getElementById("hiddenStartButton");
  if (hiddenStartButton) {
    hiddenStartButton.removeAttribute("style");
  }

  hiddenStartButton?.addEventListener("click", () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }
    if (backgroundMusic) {
      backgroundMusic.play();
    }
  });

  return app;
};

export const loadAssets = async (): Promise<void> => {
  try {
    // Load all assets
    const assetPromises = assets.map((asset) =>
      PIXI.Assets.load(`/assets/sprites/${asset}.json`)
    );

    // Load PNG assets
    const pngPromises = pngAssets.map((asset) => PIXI.Assets.load(asset));

    // Load fonts
    const fontPromises = fonts.map((font) =>
      PIXI.Assets.load(`/fonts/${font}.ttf`)
    );

    // Load bacground music
    backgroundMusic = new Howl({
      src: [`/sounds/campfire_song_chris_haugen.mp3`],
      loop: true,
      volume: 0.5,
    });

    // Load sound effect
    const soundPromises = sounds.map((sound) => {
      return new Promise<void>((resolve, reject) => {
        soundEffects[sound] = new Howl({
          src: [`/sounds/${sound}.mp3`],
          volume: 0.5,
          onload: () => resolve(),
          onloaderror: (e) => reject(`Failed to load sound ${sound}: ${e}`),
        });
      });
    });

    await Promise.all([
      ...assetPromises,
      ...pngPromises,
      ...fontPromises,
      ...soundPromises,
    ]);
  } catch (error) {
    console.error("Error loading assets:", error);
  }
};

function loadingGunAnim(): void {
  const svgObject = document.getElementById("loading-gun") as HTMLObjectElement;

  if (svgObject && svgObject.contentDocument) {
    const svgDoc = svgObject.contentDocument;

    const bulletIds = [
      "gun_bullet_1",
      "gun_bullet_2",
      "gun_bullet_3",
      "gun_bullet_4",
      "gun_bullet_5",
      "gun_bullet_6",
    ];

    if (animateLoading) {
      setTimeout(() => {
        bulletIds.forEach((id, index) => {
          const bullet = svgDoc.getElementById(id);
          if (bullet) {
            setTimeout(() => {
              bullet.setAttribute("fill", "#000000");
            }, index * 200);
          }
        });

        setTimeout(() => {
          bulletIds.forEach((id) => {
            const bullet = svgDoc.getElementById(id);
            if (bullet) {
              bullet.setAttribute("fill", "#D2D2D2");
            }
          });

          loadingGunAnim();
        }, bulletIds.length * 200 + 100);
      }, 300);
    } else {
      return;
    }
  }
}
