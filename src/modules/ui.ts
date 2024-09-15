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

  setTransform(
    landscapeUIContainer,
    window.__PIXI_APP__.screen.width / 2,
    window.__PIXI_APP__.screen.height * 0.91,
    1, // scaleX: Keep the default scale
    1, // scaleY: Keep the default scale
    0, // rotation: Keep default rotation
    0.5, // anchorX: Center anchor horizontally
    0.5 // anchorY: Center anchor vertically
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
  const spinBtnContainer = createContainer(landscapeUIContainer);
  spinBtnContainer.label = "spinBtnContainer";

  let spinBtnHover = createSprite(spinBtnContainer, "spin_btn_glow.png");
  spinBtnHover.label = "spinBtnHover";
  setTransform(spinBtnHover, 0, -4, 0.5, 0.5);

  let spinBtn = createSprite(spinBtnContainer, "spin_btn.png");
  spinBtn.label = "spinBtn";
  setTransform(spinBtn, 0, 0, 0.5, 0.5);

  let spinBtnIcon = createSprite(spinBtnContainer, "spin_btn_icon.png");
  spinBtnIcon.label = "spinBtnIcon";
  setTransform(spinBtnIcon, -5, 0, 0.5, 0.5);

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

  // max Bet Btn
  const maxBetBtnContainer = createContainer(landscapeUIContainer);
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

  // Bet Container
  const betContainer = createContainer(landscapeUIContainer);
  betContainer.label = "betContainer";
  betContainer.position.x = -500;

  const betTitleContainer = createContainer(betContainer);
  betTitleContainer.label = "betTitleContainer";
  betTitleContainer.position.y = 0;
  const betTitleText = createText(betTitleContainer, "BET", secondaryTextStyle);
  betTitleText.label = "betTitleText";

  const betValueContainer = createContainer(betContainer);
  betValueContainer.label = "betValueContainer";
  betValueContainer.position.y = 60;
  // betValueContainer.position.x = 10;
  const betValueText = createText(betValueContainer, "100", primaryTextStyle);
  betValueText.label = "betTitleText";

  const betValueIncreaseText = createText(
    betValueContainer,
    ">",
    primaryTextStyle
  );
  betValueIncreaseText.label = "betValueIncreaseText";
  betValueIncreaseText.position.x = 95;

  const betValueDecreaseText = createText(
    betValueContainer,
    "<",
    primaryTextStyle
  );
  betValueDecreaseText.label = "betValueDecreaseText";
  betValueDecreaseText.position.x = -95;

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
    secondaryTextStyle
  );
  coinTitleText.label = "coinTitleText";

  const coinValueContainer = createContainer(coinContainer);
  coinValueContainer.label = "coinValueContainer";
  coinValueContainer.position.y = 60;
  const coinValueText = createText(
    coinValueContainer,
    "2500000",
    primaryTextStyle
  );
  coinValueText.label = "betTitleText";
};
