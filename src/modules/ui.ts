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
import { bal } from "./slot";
import { gsap } from "gsap";

export let spinBtnContainer: PIXI.Container;
export let spinBtnIcon: PIXI.Sprite;
export let spinBtnCollectIcon: PIXI.Sprite;
export let coinValueText: PIXI.Text;
export let betValueText: PIXI.Text;
export let betValueIncreaseText: PIXI.Text;
export let betValueDecreaseText: PIXI.Text;
export let maxBetBtnContainer: PIXI.Container;

export function createButton(
  parent: PIXI.Container,
  textureName: string
): PIXI.Sprite {
  // Create the button sprite using the utility function
  const button = createSprite(parent, textureName, {
    // Apply the default transformations
    x: parent.width / 2,
    y: parent.height / 2,
    scaleX: 0.5,
    scaleY: 0.5,
    // rotation: number;
    anchorX: 0.5, // Center the anchor
    anchorY: 0.5, // Center the anchor
  });

  console.log("parent.width: ", parent.width);
  console.log("parent.height: ", parent.height);

  // Set interactive property
  button.interactive = true;

  return button;
}

export const initLandscapeUI = function () {
  const landscapeUIContainer = createContainer(window.__MAIN_CONTAINER__);
  landscapeUIContainer.label = "landscapeUIContainer";
  window.__LANDSCAPE_UI_CONTAINER__ = landscapeUIContainer;

  setTransform(
    landscapeUIContainer,
    window.__PIXI_APP__.screen.width / 2,
    window.__PIXI_APP__.screen.height * 0.91,
    1,
    1,
    0,
    0.5,
    0.5
  );

  const landscapeUIBase2Sprite = createSprite(
    landscapeUIContainer,
    "base_ui_2.png"
  );
  landscapeUIBase2Sprite.label = "landscapeUIBase2Sprite";
  landscapeUIBase2Sprite.y = -436;

  const landscapeUIBase1Sprite = createSprite(
    landscapeUIContainer,
    "base_ui_1.png"
  );
  landscapeUIBase1Sprite.label = "landscapeUIBase1Sprite";
  landscapeUIBase1Sprite.y = 60;

  // Spin Btn
  spinBtnContainer = createContainer(landscapeUIContainer);
  spinBtnContainer.label = "spinBtnContainer";

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

  spinBtnCollectIcon = createSprite(spinBtnContainer, "bag_of_gold.png");
  spinBtnCollectIcon.label = "spinBtnCollectIcon";
  setTransform(spinBtnCollectIcon, 0, 0, 0.25, 0.25);
  spinBtnCollectIcon.anchor.set(0.5, 0.5);
  spinBtnCollectIcon.alpha = 0;

  spinBtnContainer.interactive = true;
  spinBtnContainer.cursor = "pointer";

  spinBtnContainer.on("pointerover", () => {
    spinBtn.scale.set(0.49);
    spinBtnHover.scale.set(0.49);
    spinBtnIcon.scale.set(0.49);
    spinBtnCollectIcon.scale.set(0.245);
  });

  spinBtnContainer.on("pointerout", () => {
    spinBtn.scale.set(0.5);
    spinBtnHover.scale.set(0.5);
    spinBtnIcon.scale.set(0.5);
    spinBtnCollectIcon.scale.set(0.25);
  });

  spinBtnContainer.on("pointerdown", () => {
    // console.log("spin");
    // spin();
    // gsap.to(spinBtnIcon, {
    //   rotation: "+=70", // number of rotating circles
    //   duration: 7,
    //   ease: "power4.out",
    // });
  });

  // Autoplay Btn
  const autoplayBtnContainer = createContainer(landscapeUIContainer);
  autoplayBtnContainer.label = "autoplayBtnContainer";
  setTransform(autoplayBtnContainer, -230, 25, 1, 1);
  let autoplayBtnBg = createSprite(autoplayBtnContainer, "autoplay_btn.png");
  autoplayBtnBg.label = "autoplayBtnBg";
  const autoplayBtnText = createText(
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
    });
    console.log("autoplay");
  });

  // max Bet Btn
  maxBetBtnContainer = createContainer(landscapeUIContainer);
  maxBetBtnContainer.label = "maxBetBtnContainer";
  setTransform(maxBetBtnContainer, 230, 25, 1, 1);
  let maxBetBtnBg = createSprite(maxBetBtnContainer, "max_bet_btn.png");
  maxBetBtnBg.label = "autoplayBtnBg";
  const maxBetText = createText(
    maxBetBtnContainer,
    "MAX\nBET",
    primaryTextStyle
  );
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
    });
    console.log("max bet");
  });

  // Bet Container
  const betContainer = createContainer(landscapeUIContainer);
  betContainer.label = "betContainer";
  betContainer.position.x = -500;

  const betTitleContainer = createContainer(betContainer);
  betTitleContainer.label = "betTitleContainer";
  betTitleContainer.position.y = 0;
  const betTitleText = createText(betTitleContainer, "BET", primaryTextStyle);
  betTitleText.label = "betTitleText";
  betTitleText.position.x = 5;

  const betValueContainer = createContainer(betContainer);
  betValueContainer.label = "betValueContainer";
  betValueContainer.position.y = 60;
  // betValueContainer.position.x = 10;
  betValueText = createText(betValueContainer, "100", primaryTextStyle);
  betValueText.label = "betTitleText";

  // invrease bet
  betValueIncreaseText = createText(betValueContainer, ">", secondaryTextStyle);
  betValueIncreaseText.label = "betValueIncreaseText";
  betValueIncreaseText.position.x = 95;

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
    });
    console.log("increase bet");
  });

  // decrease bet
  betValueDecreaseText = createText(betValueContainer, "<", secondaryTextStyle);
  betValueDecreaseText.label = "betValueDecreaseText";
  betValueDecreaseText.position.x = -95;

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
    });
    console.log("decrease bet");
  });

  // Coin Container
  const coinContainer = createContainer(landscapeUIContainer);
  coinContainer.label = "coinContainer";
  coinContainer.position.x = 500;

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
};
