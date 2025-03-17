// ui.ts
import * as PIXI from "pixi.js";
import {
  createContainer,
  createSprite,
  createText,
  setTransform,
  primaryTextStyle,
  secondaryTextStyle,
} from "./pixiSetup";
import { bal, stake } from "./slot";
import { initSound } from "./sound";
import { gsap } from "gsap";

export let spinBtnContainer: PIXI.Container;
export let spinBtnIcon: PIXI.Sprite;
export let spinBtnCollectIcon: PIXI.Sprite;
export let coinValueText: PIXI.Text;
export let betValueText: PIXI.Text;
export let betValueIncreaseText: PIXI.Text;
export let betValueDecreaseText: PIXI.Text;
export let maxBetBtnContainer: PIXI.Container;
export let maxBetText: PIXI.Text;
export let autoplayBtnContainer: PIXI.Container;
export let autoplayBtnText: PIXI.Text;
export let landscapeUIContainer: PIXI.Container;
let landscapeUIBase1Sprite: PIXI.Sprite;
let coinContainer: PIXI.Container;
let betContainer: PIXI.Container;
let soundContainer: PIXI.Container;
export let soundValueContainer: PIXI.Container;

let infoContainer: PIXI.Container;
export let infoValueContainer: PIXI.Container;

export const initLandscapeUI = function () {
  landscapeUIContainer = createContainer(window.__MAIN_CONTAINER__);
  landscapeUIContainer.label = "landscapeUIContainer";
  window.__LANDSCAPE_UI_CONTAINER__ = landscapeUIContainer;

  const landscapeUIBase2Sprite = createSprite(
    landscapeUIContainer,
    "base_ui_2.png"
  );
  landscapeUIBase2Sprite.label = "landscapeUIBase2Sprite";
  landscapeUIBase2Sprite.y = -436;

  landscapeUIBase1Sprite = createSprite(landscapeUIContainer, "base_ui_1.png");
  landscapeUIBase1Sprite.label = "landscapeUIBase1Sprite";
  landscapeUIBase1Sprite.y = 60;
  landscapeUIBase1Sprite.scale.y = 0.8;

  // Spin Btn
  spinBtnContainer = createContainer(landscapeUIContainer);
  spinBtnContainer.label = "spinBtnContainer";
  spinBtnContainer.scale.set(0.8);
  spinBtnContainer.y = 10;

  let spinBtnHover = createSprite(spinBtnContainer, "spin_btn_glow.png");
  spinBtnHover.label = "spinBtnHover";
  setTransform(spinBtnHover, 0, -4, 0.5, 0.5);

  let spinBtn = createSprite(spinBtnContainer, "spin_btn.png");
  spinBtn.label = "spinBtn";
  setTransform(spinBtn, 0, 0, 0.5, 0.5);

  spinBtnIcon = createSprite(spinBtnContainer, "spin_btn_icon.png");
  spinBtnIcon.label = "spinBtnIcon";
  setTransform(spinBtnIcon, 0, 0, 0.5, 0.5);
  spinBtnIcon.anchor.set(0.56, 0.53);

  spinBtnCollectIcon = createSprite(spinBtnContainer, "collect_icon.png");
  spinBtnCollectIcon.label = "spinBtnCollectIcon";
  setTransform(spinBtnCollectIcon, 0, -4, 0.4, 0.4);
  spinBtnCollectIcon.anchor.set(0.5, 0.5);
  spinBtnCollectIcon.alpha = 0;

  spinBtnContainer.interactive = true;
  spinBtnContainer.cursor = "pointer";

  spinBtnContainer.on("pointerover", () => {
    spinBtnContainer.scale.set(0.78);
  });

  spinBtnContainer.on("pointerout", () => {
    spinBtnContainer.scale.set(0.8);
  });

  // Autoplay Btn
  autoplayBtnContainer = createContainer(landscapeUIContainer);
  autoplayBtnContainer.label = "autoplayBtnContainer";
  setTransform(autoplayBtnContainer, -200, 35, 0.8, 0.8);
  let autoplayBtnBg = createSprite(autoplayBtnContainer, "autoplay_btn.png");
  autoplayBtnBg.label = "autoplayBtnBg";
  autoplayBtnText = createText(
    autoplayBtnContainer,
    "AUTO\nPLAY",
    primaryTextStyle
  );
  autoplayBtnText.label = "betTitleText";
  autoplayBtnText.y = 18;

  autoplayBtnContainer.interactive = true;
  autoplayBtnContainer.cursor = "pointer";

  autoplayBtnContainer.on("pointerover", () => {
    autoplayBtnBg.scale.set(0.97);
    autoplayBtnText.scale.set(0.97);
  });

  autoplayBtnContainer.on("pointerout", () => {
    autoplayBtnBg.scale.set(1);
    autoplayBtnText.scale.set(1);
  });

  autoplayBtnContainer.on("pointerdown", () => {
    gsap.to(autoplayBtnContainer, {
      alpha: 0.5,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => {
        autoplayBtnContainer.alpha = 1;
      },
    });
  });

  // max Bet Btn
  maxBetBtnContainer = createContainer(landscapeUIContainer);
  maxBetBtnContainer.label = "maxBetBtnContainer";
  setTransform(maxBetBtnContainer, 200, 35, 0.8, 0.8);
  let maxBetBtnBg = createSprite(maxBetBtnContainer, "max_bet_btn.png");
  maxBetBtnBg.label = "autoplayBtnBg";
  maxBetText = createText(maxBetBtnContainer, "MAX\nBET", primaryTextStyle);
  maxBetText.label = "maxBetText";
  maxBetText.y = 18;

  maxBetBtnContainer.interactive = true;
  maxBetBtnContainer.cursor = "pointer";

  maxBetBtnContainer.on("pointerover", () => {
    maxBetBtnBg.scale.set(0.97);
    maxBetText.scale.set(0.97);
  });

  maxBetBtnContainer.on("pointerout", () => {
    maxBetBtnBg.scale.set(1);
    maxBetText.scale.set(1);
  });

  maxBetBtnContainer.on("pointerdown", () => {
    gsap.to(maxBetBtnContainer, {
      alpha: 0.5,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => {
        maxBetBtnContainer.alpha = 1;
      },
    });
  });

  // Bet Container
  betContainer = createContainer(landscapeUIContainer);
  betContainer.label = "betContainer";
  betContainer.position.x = 0;
  betContainer.position.y = 60;
  betContainer.scale.set(0.8);

  const betTitleContainer = createContainer(betContainer);
  betTitleContainer.label = "betTitleContainer";
  betTitleContainer.position.y = 0;
  const betTitleText = createText(betTitleContainer, "BET", primaryTextStyle);
  betTitleText.label = "betTitleText";
  betTitleText.position.x = 5;

  let betValueContainer = createContainer(betContainer);
  betValueContainer.label = "betValueContainer";
  betValueContainer.position.y = 60;
  betValueText = createText(betValueContainer, stake, primaryTextStyle);
  betValueText.label = "betTitleText";

  // invrease bet
  betValueIncreaseText = createText(betValueContainer, ">", secondaryTextStyle);
  betValueIncreaseText.label = "betValueIncreaseText";
  betValueIncreaseText.style.fontSize = 48;
  betValueIncreaseText.position.x = 55;

  betValueIncreaseText.interactive = true;
  betValueIncreaseText.cursor = "pointer";

  betValueIncreaseText.on("pointerover", () => {
    betValueIncreaseText.scale.set(0.9);
  });

  betValueIncreaseText.on("pointerout", () => {
    betValueIncreaseText.scale.set(1);
  });

  betValueIncreaseText.on("pointerdown", () => {
    gsap.to(betValueIncreaseText, {
      alpha: 0.5,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => {
        betValueIncreaseText.alpha = 1;
      },
    });
  });

  // decrease bet
  betValueDecreaseText = createText(betValueContainer, "<", secondaryTextStyle);
  betValueDecreaseText.label = "betValueDecreaseText";
  betValueDecreaseText.style.fontSize = 48;
  betValueDecreaseText.position.x = -55;

  betValueDecreaseText.interactive = true;
  betValueDecreaseText.cursor = "pointer";

  betValueDecreaseText.on("pointerover", () => {
    betValueDecreaseText.scale.set(0.9);
  });

  betValueDecreaseText.on("pointerout", () => {
    betValueDecreaseText.scale.set(1);
  });

  betValueDecreaseText.on("pointerdown", () => {
    gsap.to(betValueDecreaseText, {
      alpha: 0.5,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => {
        betValueDecreaseText.alpha = 1;
      },
    });
  });

  // Coin Container
  coinContainer = createContainer(landscapeUIContainer);
  coinContainer.label = "coinContainer";
  coinContainer.position.x = 500;
  coinContainer.position.y = 10;
  coinContainer.scale.set(0.8);

  const coinTitleContainer = createContainer(coinContainer);
  coinTitleContainer.label = "coinTitleContainer";
  coinTitleContainer.position.y = 0;
  const coinTitleText = createText(
    coinTitleContainer,
    "COINS",
    primaryTextStyle
  );
  coinTitleText.label = "coinTitleText";

  const coinValueContainer = createContainer(coinContainer);
  coinValueContainer.label = "coinValueContainer";
  coinValueContainer.position.y = 60;
  coinValueText = createText(coinValueContainer, bal, primaryTextStyle);
  coinValueText.label = "coinValueText";

  // Sound container
  soundContainer = createContainer(landscapeUIContainer);
  soundContainer.label = "soundContainer";
  soundContainer.position.x = -380;
  soundContainer.position.y = 10;
  soundContainer.scale.set(0.8);

  const soundTitleContainer = createContainer(soundContainer);
  soundTitleContainer.label = "soundTitleContainer";
  soundTitleContainer.position.y = 0;
  const soundTitleText = createText(
    soundTitleContainer,
    "SOUND",
    primaryTextStyle
  );
  soundTitleText.label = "soundTitleText";

  soundValueContainer = createContainer(soundContainer);
  soundValueContainer.label = "soundValueContainer";
  soundValueContainer.position.x = 0;
  soundValueContainer.position.y = 60;
  soundValueContainer.interactive = true;

  const soundIconAllTexture = PIXI.Assets.get(
    "/assets/images/sound_icon_all.png"
  );
  const soundIconEffectsTexture = PIXI.Assets.get(
    "/assets/images/sound_icon_effects.png"
  );

  const soundIconOffTexture = PIXI.Assets.get(
    "/assets/images/sound_icon_off.png"
  );

  const soundIconAllSprite = new PIXI.Sprite(soundIconAllTexture);
  soundIconAllSprite.label = "soundIconAllSprite";
  const soundIconEffectsSprite = new PIXI.Sprite(soundIconEffectsTexture);
  soundIconEffectsSprite.label = "soundIconEffectsSprite";
  const soundIconOffSprite = new PIXI.Sprite(soundIconOffTexture);
  soundIconOffSprite.label = "soundIconOffSprite";

  function setupSprite(sprite: PIXI.Sprite) {
    sprite.anchor.set(0.5, 0.5);
    sprite.width = 256;
    sprite.height = 256;
    sprite.scale.set(0.2);
  }

  setupSprite(soundIconAllSprite);
  setupSprite(soundIconEffectsSprite);
  setupSprite(soundIconOffSprite);

  soundIconEffectsSprite.visible = false;
  soundIconOffSprite.visible = false;

  soundValueContainer.addChild(soundIconAllSprite);
  soundValueContainer.addChild(soundIconEffectsSprite);
  soundValueContainer.addChild(soundIconOffSprite);
  soundValueContainer.interactive = true;
  soundValueContainer.cursor = "pointer";
  soundValueContainer.on("pointerover", () => {
    soundValueContainer.scale.set(0.9);
  });

  soundValueContainer.on("pointerout", () => {
    soundValueContainer.scale.set(1);
  });

  initSound();

  // Info Container
  infoContainer = createContainer(landscapeUIContainer);
  infoContainer.label = "infoContainer";
  infoContainer.position.x = -500;
  infoContainer.position.y = 10;
  infoContainer.scale.set(0.8);

  const infoTitleContainer = createContainer(infoContainer);
  infoTitleContainer.label = "infoTitleContainer";
  infoTitleContainer.position.y = 0;
  const infoTitleText = createText(
    infoTitleContainer,
    "INFO",
    primaryTextStyle
  );
  infoTitleText.label = "infoTitleText";

  infoValueContainer = createContainer(infoContainer);
  infoValueContainer.label = "infoValueContainer";
  infoValueContainer.position.x = 0;
  infoValueContainer.position.y = 60;
  infoValueContainer.interactive = true;
  infoValueContainer.cursor = "pointer";
  infoValueContainer.on("pointerover", () => {
    infoValueContainer.scale.set(0.9);
  });

  infoValueContainer.on("pointerout", () => {
    infoValueContainer.scale.set(1);
  });

  const infoIconTexture = PIXI.Assets.get("/assets/images/info_icon.png");
  const infoIconSprite = new PIXI.Sprite(infoIconTexture);

  infoIconSprite.anchor.set(0.5, 0.5);
  infoIconSprite.width = 256;
  infoIconSprite.height = 256;
  infoIconSprite.scale.set(0.2);

  infoValueContainer.addChild(infoIconSprite);
};

export async function initPortraitUI(status: boolean) {
  if (status === true) {
    // Portrait
    setTransform(spinBtnContainer, 0, -280, 1.4, 1.4);
    setTransform(maxBetBtnContainer, 300, -260, 1.4, 1.4);
    setTransform(autoplayBtnContainer, -300, -260, 1.4, 1.4);
    landscapeUIBase1Sprite.scale.y = 3;
    landscapeUIBase1Sprite.scale.x = 0.7;

    setTransform(infoContainer, -500, -80, 1.5, 1.5);
    setTransform(soundContainer, -180, -80, 1.5, 1.5);
    setTransform(betContainer, 180, -80, 1.5, 1.5);
    setTransform(coinContainer, 500, -80, 1.5, 1.5);

    spinBtnContainer.on("pointerover", () => {
      spinBtnContainer.scale.set(1.38);
    });

    spinBtnContainer.on("pointerout", () => {
      spinBtnContainer.scale.set(1.4);
    });
  } else {
    // Landscape
    setTransform(spinBtnContainer, 0, 10, 0.8, 0.8);
    setTransform(maxBetBtnContainer, 200, 35, 0.8, 0.8);
    setTransform(autoplayBtnContainer, -200, 35, 0.8, 0.8);
    landscapeUIBase1Sprite.scale.y = 0.8;
    landscapeUIBase1Sprite.scale.x = 1;
    setTransform(coinContainer, 500, 10, 0.8, 0.8);
    setTransform(infoContainer, -500, 10, 0.8, 0.8);
    setTransform(betContainer, 380, 10, 0.8, 0.8);
    setTransform(soundContainer, -380, 10, 0.8, 0.8);

    spinBtnContainer.on("pointerover", () => {
      spinBtnContainer.scale.set(0.78);
    });

    spinBtnContainer.on("pointerout", () => {
      spinBtnContainer.scale.set(0.8);
    });
  }
}
