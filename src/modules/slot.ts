// slot.ts
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { soundEffects } from "./gameCore";
import { playSoundEffect } from "./sound";
import { symbolChances, slot } from "./symbols";
import { createSpin, Spin, randomInt } from "./spin";
import {
  findMatchingReel,
  createReelAnimation,
  clearCharacterReels,
} from "./reelAnimation";
import {
  createContainer,
  createSprite,
  setTransform,
  createText,
  primaryTextStyle,
  winingTextStyle,
} from "./pixiSetup";
import {
  spinBtnContainer,
  spinBtnIcon,
  spinBtnCollectIcon,
  coinValueText,
  betValueText,
  betValueIncreaseText,
  betValueDecreaseText,
  maxBetBtnContainer,
  maxBetText,
  autoplayBtnContainer,
  autoplayBtnText,
} from "./ui";

// Setting variables
let startingY: number = 0;
let symbolWidth: number = 0;
const speed: number = 70;
const maxIt: number = 150;
export let stake: number = 50;
export let bal: number = 250000;
const bets: number[] = [1, 5, 10, 20, 40, 50, 100, 500, 1000];
let reels: PIXI.Container[];
let sp: Spin;
let tWin: number = 0;
let showLines: PIXI.Ticker;
export const reelWidth: number = 224.1;
export let reelHeight: number = 630;
const initialX: number = -560.5;
const initialY: number = -315;
let winningLineText: PIXI.Text;
let winningAmountText: PIXI.Text;
let isAutoPlay: boolean = false;

// Filters
export const desaturateEffect = new PIXI.ColorMatrixFilter();
desaturateEffect.desaturate();
const greenTintEffect = new PIXI.ColorMatrixFilter();
greenTintEffect.tint(0x71b443);
const grayTintEffect = new PIXI.ColorMatrixFilter();
grayTintEffect.tint(0x808080);

// States of spin
enum States {
  idle, // Nothing is happening
  spinning, // Reels are spinning
  resultWaiting, // Witing for result
  resultDone, // Result is done
  stopping, // We want to stop spinning
}
let state: States = States.idle;

let characterReel1: PIXI.Container;
let characterReel2: PIXI.Container;
let characterReel3: PIXI.Container;
let characterReel4: PIXI.Container;
let characterReel5: PIXI.Container;
let characterReels: PIXI.Container[] = [];

export const initSlot = function () {
  let s = createSpin(10, false);
  let spritesNow: PIXI.Container[][] = [];

  const slotContainer: PIXI.Container = createContainer(
    window.__MAIN_CONTAINER__
  );
  slotContainer.label = "slotContainer";
  window.__SLOT_CONTAINER__ = slotContainer;
  setTransform(
    slotContainer,
    window.__PIXI_APP__.screen.width / 2,
    window.__PIXI_APP__.screen.height / 2.4,
    1.1,
    1.1,
    undefined,
    0.5,
    0.5
  );

  // Styling slot background
  const slotBgSprite: PIXI.Sprite = createSprite(
    slotContainer,
    "slot_base.png"
  );
  slotBgSprite.label = "slotBgSprite";
  const slotBgShadows: PIXI.Sprite = createSprite(
    slotContainer,
    "slot_lighten.png"
  );
  slotBgShadows.label = "slotBgShadows";
  const slotBgLines: PIXI.Sprite = createSprite(
    slotContainer,
    "slot_lines.png"
  );
  slotBgLines.label = "slotBgLines";

  // Create reels
  let reel1: PIXI.Container = createContainer(slotContainer);
  reel1.label = "reel 1";
  let reel2: PIXI.Container = createContainer(slotContainer);
  reel2.label = "reel 2";
  let reel3: PIXI.Container = createContainer(slotContainer);
  reel3.label = "reel 3";
  let reel4: PIXI.Container = createContainer(slotContainer);
  reel4.label = "reel 4";
  let reel5: PIXI.Container = createContainer(slotContainer);
  reel5.label = "reel 5";

  reels = [reel1, reel2, reel3, reel4, reel5];

  symbolWidth = reelWidth;

  reels.forEach((reel, index) => {
    reel.position.y = initialY;
    reel.position.x = initialX + reelWidth * index;
  });

  // Create Symbols & Mask
  for (let i = -1; i < 4; i++) {
    spritesNow[i + 1] = [];

    // Mask
    const mask = new PIXI.Graphics()
      .rect(initialX + (i + 1) * reelWidth, initialY, reelWidth, reelHeight)
      .fill(0xff0000);
    mask.label = `mask ${i + 2}`;
    slotContainer.addChild(mask);

    // Symbols for start screen
    for (let j in reels) {
      // Adding first and last symbols to reels (1, 5)
      if (i == -1 || i == 3) {
        let sprite = PIXI.Sprite.from(
          symbolChances.symbols[randomInt(0, 8)].texture
        );
        sprite.label = "symbolSprite";
        sprite.height = sprite.width = symbolWidth;

        if (window.innerWidth > window.innerHeight) {
          sprite.position.y = symbolWidth * i;
        } else {
          sprite.position.y = startingY + symbolWidth * i;
        }

        spritesNow[i + 1][j] = sprite;
        reels[j].addChild(sprite);
      }
      // Adding central symbols to reels (2, 3, 4)
      else {
        const symbolContainer = new PIXI.Container();
        symbolContainer.label = "symbolContainer";

        symbolContainer.width = reelWidth;
        symbolContainer.height = reelHeight / 3;

        const symbolTranspBg: PIXI.Sprite = createSprite(
          symbolContainer,
          "tile.png"
        );
        symbolTranspBg.label = "symbolTranspBg";
        symbolTranspBg.width = reelWidth;
        symbolTranspBg.height = reelHeight / 3;
        symbolTranspBg.anchor.set(0.5);
        symbolTranspBg.x = symbolContainer.width / 2;
        symbolTranspBg.y = symbolContainer.height / 2;
        symbolTranspBg.alpha = 0;

        const texture = s.spinResult[i][j].texture as PIXI.Texture;
        let symbolSprite = new PIXI.Sprite(texture);
        symbolSprite.label = "symbolSprite2";

        const originalWidth = texture.width;
        const originalHeight = texture.height;

        const scaleX = symbolContainer.width / originalWidth;
        const scaleY = symbolContainer.height / originalHeight;
        const scale = Math.min(scaleX, scaleY);

        symbolSprite.width = originalWidth * scale;
        symbolSprite.height = originalHeight * scale;
        symbolSprite.x = (symbolContainer.width - symbolSprite.width) / 2;
        symbolSprite.y = (symbolContainer.height - symbolSprite.height) / 2;

        symbolContainer.addChild(symbolTranspBg);
        symbolContainer.addChild(symbolSprite);

        if (window.innerWidth > window.innerHeight) {
          symbolContainer.position.y = (reelHeight / 3) * i;
        } else {
          symbolContainer.position.y = startingY + (reelHeight / 3) * i;
        }

        spritesNow[i + 1][j] = symbolContainer;
        reels[j].addChild(symbolContainer);
      }
    }
    // Mask first and last symbol
    reels[i + 1].mask = mask;
  }

  // Character reels
  characterReel1 = createContainer(slotContainer);
  characterReel1.label = "characterReel 1";
  characterReel2 = createContainer(slotContainer);
  characterReel2.label = "characterReel 2";
  characterReel3 = createContainer(slotContainer);
  characterReel3.label = "characterReel 3";
  characterReel4 = createContainer(slotContainer);
  characterReel4.label = "characterReel 4";
  characterReel5 = createContainer(slotContainer);
  characterReel5.label = "characterReel 5";

  characterReels = [
    characterReel1,
    characterReel2,
    characterReel3,
    characterReel4,
    characterReel5,
  ];

  symbolWidth = reelWidth;

  characterReels.forEach(async (chatReel, index) => {
    const westgirlBgTex = await PIXI.Assets.load(
      "/assets/images/westgirl_bg.png"
    );
    const westmanBgTex = await PIXI.Assets.load(
      "/assets/images/westman_bg.png"
    );
    const westgirlBg: PIXI.Sprite = new PIXI.Sprite(westgirlBgTex);
    const westmanBg: PIXI.Sprite = new PIXI.Sprite(westmanBgTex);

    [westgirlBg, westmanBg].forEach((bg, i) => {
      bg.width = reelWidth;
      bg.height = reelHeight;
      bg.label = chatReel.label + (i === 0 ? "_westgirl_bg" : "_westman_bg");
      bg.visible = false;
      chatReel.addChild(bg);
    });

    chatReel.position.y = initialY;
    chatReel.position.x = initialX + reelWidth * index;
  });

  const slotLogo: PIXI.Sprite = createSprite(slotContainer, "slot_logo.png");
  slotLogo.label = "slotLogo";
  setTransform(slotLogo, 0, -348, 0.5, 0.5);

  const winingLineInfoContainer = createContainer(slotContainer);
  winingLineInfoContainer.label = "winingLineInfoContainer";
  setTransform(winingLineInfoContainer, 0, 344, 0.6, 0.6);
  winningLineText = createText(winingLineInfoContainer, "", primaryTextStyle);

  const winingAmountContainer = createContainer(slotContainer);
  winingAmountContainer.label = "winingAmountContainer";
  setTransform(winingAmountContainer, 0, 0, 1, 1);
  winningAmountText = createText(winingAmountContainer, "", winingTextStyle);

  // Events for buttons
  spinBtnContainer.on("pointerdown", function () {
    triggerSpinAction();
  });

  // Increase Bet
  betValueIncreaseText.on("pointerdown", function () {
    playSoundEffect("btn_click");
    betValueDecreaseText.filters = [];

    if (betValueText.text == bets[bets.length - 1].toString()) {
      return;
    } else {
      let temp: number = bets.indexOf(parseFloat(betValueText.text));
      let temp2: number = bets[temp + 1];
      betValueText.text = temp2.toString();
      stake = temp2;
      if (temp2 == bets[bets.length - 1]) {
        betValueIncreaseText.filters = [grayTintEffect];
        maxBetText.filters = [greenTintEffect];
      }
    }
  });

  // Decrease Bet
  betValueDecreaseText.on("pointerdown", function () {
    playSoundEffect("btn_click");
    maxBetText.filters = [];
    betValueIncreaseText.filters = [];

    if (betValueText.text == bets[0].toString()) {
      return;
    } else {
      let temp: number = bets.indexOf(parseFloat(betValueText.text));
      let temp2: number = bets[temp - 1];
      betValueText.text = temp2.toString();
      stake = temp2;
      if (temp2 == bets[0]) {
        betValueDecreaseText.filters = [grayTintEffect];
      }
    }
  });

  maxBetBtnContainer.on("pointerdown", function () {
    playSoundEffect("btn_click");
    const maxBet = bets[bets.length - 1];
    betValueText.text = maxBet.toString();
    stake = maxBet;

    betValueDecreaseText.filters = [];
    maxBetText.filters = [greenTintEffect];
    betValueIncreaseText.filters = [grayTintEffect];
  });

  autoplayBtnContainer.on("pointerdown", function () {
    playSoundEffect("btn_click");
    isAutoPlay = !isAutoPlay;

    if (isAutoPlay === true) {
      autoplayBtnText.filters = [greenTintEffect];
      triggerSpinAction();
    } else {
      autoplayBtnText.filters = [];
    }
  });
};

function triggerSpinAction() {
  winningAmountText.text = "";
  winningLineText.text = "";
  clearCharacterReels(characterReels);
  if (bal - stake < 0) {
    return;
  }

  if (state == States.idle) {
    playSoundEffect("spin_btn");

    gsap.to(spinBtnIcon, {
      rotation: "+=60",
      duration: 2,
      ease: "power1.in",
      onComplete: function () {
        gsap.to(spinBtnIcon, {
          rotation: "+=300",
          duration: 1,
          ease: "none",
          repeat: -1,
        });
      },
    });

    changeBalance(-stake);
    spin();
  } else if (state == States.spinning) {
    state = States.stopping;
  } else if (state == States.resultDone) {
    spinBtnIcon.alpha = 1;
    spinBtnCollectIcon.alpha = 0;
    if (tWin > 0) changeBalance(tWin);

    reels.forEach((reel) => {
      reel.children.forEach((ch) => {
        ch.filters = [];
        toggleGoldTile(ch, false);
      });
    });
    showLines.stop();
    state = States.idle;

    if (isAutoPlay === true) {
      isAutoPlay = false;
      autoplayBtnContainer.interactive = true;
      autoplayBtnContainer.filters = [];
      autoplayBtnText.filters = [];
    }
  }
}

export function spin() {
  if (state == States.idle) {
    sp = createSpin(stake, false);
    spinAnimation(sp);
    state = States.spinning;
  }
}

function spinAnimation(res: Spin) {
  let timeout = 0;
  playSoundEffect("reel_spin");
  reels.forEach((reel) => {
    timeout++;
    setTimeout(() => {
      animateReel(reel, reels.indexOf(reel), res);
    }, 200 * timeout);
  });
}

function animateReel(reel: PIXI.Container, reelNumber: number, res: Spin) {
  let it: number = 1;
  if (state == States.spinning) {
    it = 1;
  } else if (state == States.stopping || state == States.resultWaiting) {
    it = maxIt;
  }

  let spinDone: boolean = false;
  let addNext = Math.round(symbolWidth / speed);
  let ticker = new PIXI.Ticker();
  let sR = [...res.spinResult];

  const blurReel = new PIXI.BlurFilter();
  blurReel.strengthY = speed / 4;
  blurReel.strengthX = 0;

  // Adding symbol at top of reel
  function addSymbolAtTop() {
    let temp = randomInt(0, 8);
    let symbolSprite = PIXI.Sprite.from(symbolChances.symbols[temp].texture);
    symbolSprite.width = reelWidth - 5;
    symbolSprite.height = reelHeight / 3 - 5;

    const symbolContainer = new PIXI.Container();
    symbolContainer.label = "symbolContainer";
    symbolContainer.width = reelWidth;
    symbolContainer.height = reelHeight / 3;
    symbolContainer.addChild(symbolSprite);

    reel.removeChildAt(reel.children.length - 1);

    for (let m = reel.children.length - 1; m <= 0; m--) {
      reel.setChildIndex(reel.children[m], m + 1);
    }
    reel.addChildAt(symbolContainer, 0).position.y = 0 - reelHeight / 3;
  }

  // Fix position of result symbols
  function fixPosition() {
    for (let p = 0; p < reel.children.length; p++) {
      if (window.innerWidth > window.innerHeight) {
        reel.children[p].position.y = (reelHeight / 3) * (p - 1);
      } else {
        reel.children[p].position.y = startingY + (reelHeight / 3) * (p - 1);
      }
    }
  }

  ticker.start();
  ticker.add(() => {
    if (state == States.stopping) {
      it = maxIt;
    }
    if (it % addNext === 0 && it > 30) {
      if (it >= maxIt) {
        if (sR.length != 0) {
          const symbolContainer = new PIXI.Container();
          symbolContainer.label = "symbolContainer";
          symbolContainer.width = reelWidth;
          symbolContainer.height = reelHeight / 3;

          const symbolGoldTile = PIXI.Sprite.from("gold_tile.png");
          symbolGoldTile.label = "symbolGoldTile";
          symbolGoldTile.width = reelWidth - 5;
          symbolGoldTile.height = reelHeight / 3 - 5;
          symbolGoldTile.anchor.set(0.5);
          symbolGoldTile.x = reelWidth / 2;
          symbolGoldTile.y = reelHeight / 3 / 2;
          symbolGoldTile.visible = false;

          const texture = sR[sR.length - 1][reelNumber].texture as PIXI.Texture;
          const symbolSprite = new PIXI.Sprite(texture);
          symbolSprite.label = "symbolSprite";

          const originalWidth = texture.width;
          const originalHeight = texture.height;

          const targetWidth = reelWidth - 5;
          const targetHeight = reelHeight / 3 - 5;

          const scaleX = targetWidth / originalWidth;
          const scaleY = targetHeight / originalHeight;
          const scale = Math.min(scaleX, scaleY);

          symbolSprite.width = originalWidth * scale;
          symbolSprite.height = originalHeight * scale;
          symbolSprite.anchor.set(0.5);
          symbolSprite.x = reelWidth / 2;
          symbolSprite.y = 210 / 2;

          symbolContainer.addChild(symbolGoldTile);
          symbolContainer.addChild(symbolSprite);

          // Removing last symbol form array and reel
          sR.splice(sR.length - 1, 1);
          if (reel.children.length > 0) {
            reel.removeChildAt(reel.children.length - 1);
          }

          // Moving all symbols to down
          for (let m = reel.children.length - 1; m >= 0; m--) {
            reel.children[m].position.y += reelHeight / 3;
          }

          // Adding new container at top of column
          symbolContainer.position.y = -(reelHeight / 3);
          reel.addChildAt(symbolContainer, 0);
        } else {
          reel.filters = [];

          ticker.stop();
          state = States.resultWaiting;

          it = 0;

          addSymbolAtTop();
          fixPosition();

          spinDone = true;
          soundEffects["reel_stop"].volume(0.3);
          playSoundEffect("reel_stop");

          if (reelNumber == 0) {
            soundEffects["reel_spin"].fade(0.5, 0, 900);
          }

          if (reelNumber == 4) {
            gsap.killTweensOf(spinBtnIcon);
            gsap.to(spinBtnIcon, {
              rotation: spinBtnIcon.rotation + 360,
              duration: 0,
              ease: "power1.out",
            });
            soundEffects["reel_spin"].stop();
            soundEffects["reel_spin"].volume(0.5);

            showResults(res);
          }
        }
      } else {
        addSymbolAtTop();
      }
    }
    reel.children.forEach((element) => {
      if (it < 25 && it < maxIt) {
        element.position.y -= (speed / 100) * it;
      } else {
        if (!spinDone) {
          element.position.y += speed;
          reel.filters = [blurReel];
        }
      }
    });
    it++;
  });

  spin();
}

function showResults(result: Spin) {
  showLines = new PIXI.Ticker();
  tWin = result.totalWin;
  state = States.resultDone;

  let copySOWf = [...result.symbolsOnWinning]; // Copy
  let winC = result.winningLines.filter((el) => {
    return el != null;
  });
  copySOWf = copySOWf.filter((el) => {
    // Delete empty elements
    return el != null;
  });

  let symbolsToHighlight: PIXI.Container[][] = [];
  let winningMessage: string[] = [];

  let start: number = 0;
  let time: number = 0;
  let ln: number = 0;
  let w: number = 0;

  // We have win
  if (copySOWf.length > 0) {
    if (isAutoPlay === true) {
      autoplayBtnContainer.interactive = false;
      autoplayBtnContainer.filters = [grayTintEffect];
    }
    isAutoPlay = false;
    playSoundEffect("win_sound");

    for (let i = 0; i < copySOWf.length; i++) {
      symbolsToHighlight[i] = [];
      inner: for (let j = start; j < 5; j++) {
        if (result.symbolsOnWinning[j] != null) {
          for (let q = 0; q < result.symbolsOnWinning[j]; q++) {
            let symbolContainer = reels[q].children[
              slot.paylines[j][q] + 1
            ] as PIXI.Container;
            symbolsToHighlight[i].push(symbolContainer);
            toggleGoldTile(symbolContainer, true);
          }

          winningMessage.push(`Line ${j + 1} pays ${result.winningLines[j]}`);
          start = j + 1;
          isAutoPlay = !isAutoPlay;
          autoplayBtnText.filters = [];

          break inner;
        }
      }
    }

    w = winC.reduce((sum, value) => sum + value, 0);

    winningAmountText.text = `${Math.floor(
      Number(winningAmountText.text)
    )} coins`;

    winningAmountText.alpha = 0;

    gsap.to(winningAmountText, {
      alpha: 1,
      duration: 0.5,
      ease: "power2.inOut",
      onStart: () => {
        let tempValue = { value: 0 };

        gsap.to(tempValue, {
          duration: 1,
          value: w,
          ease: "power2.out",
          onUpdate: function () {
            winningAmountText.text = `${Math.round(tempValue.value)} coins`;
          },
        });
      },
    });

    if (winningMessage.length === 1) {
      winningLineText.text = winningMessage[0];
    }

    showLines.start();
    spinBtnIcon.alpha = 0;
    spinBtnCollectIcon.alpha = 1;
  }
  // There is no win
  else {
    const matchingReels = findMatchingReel(result.spinResult);

    if (matchingReels.length !== 0) {
      matchingReels.forEach(({ index, symbol }) => {
        let assetKey = "";

        if (symbol === "symbol3") {
          assetKey = "westman";
        } else if (symbol === "symbol4") {
          assetKey = "westwoman";
        }

        const reelContainer = characterReels[index];

        if (reelContainer && assetKey && !isAutoPlay) {
          createReelAnimation(reelContainer, assetKey);
        }
      });
    }

    state = States.idle;

    if (isAutoPlay === true) {
      triggerSpinAction();
    }
  }

  showLines.add(() => {
    if (time < 30) {
      // First 30 frames: Highlight all symbols from all winning lines
      reels.forEach((reel) => {
        reel.children.forEach((ch) => {
          if (symbolsToHighlight.some((line) => line.includes(ch))) {
            ch.filters = [];
            toggleGoldTile(ch, true);
          } else {
            ch.filters = [desaturateEffect];
            toggleGoldTile(ch, false);
          }
        });
      });
    } else {
      // After 30 frames, animation per winning line
      if (time % 120 == 0) {
        winningLineText.text = winningMessage[ln];

        reels.forEach((reel) => {
          reel.children.forEach((ch) => {
            if (ch == symbolsToHighlight[ln][reels.indexOf(reel)]) {
              ch.filters = [];
              toggleGoldTile(ch, true);
            } else {
              ch.filters = [desaturateEffect];
              toggleGoldTile(ch, false);
            }
          });
        });

        ln = (ln + 1) % symbolsToHighlight.length;
      }
    }
    time++;
  });
}

function changeBalance(changeBy: number) {
  bal = bal + changeBy;
  let balS: string = bal.toFixed(2);
  let balInt: string = bal.toFixed(0);
  let output: string = "";
  output = `.${balS[balS.length - 2]}${balS[balS.length - 1]}`;
  let j = 0;
  for (let i = balInt.length - 1; i >= 0; i--) {
    if (j % 3 == 0 && j != 0) {
      output = `${balInt[i]},${output}`;
    } else {
      output = `${balInt[i]}${output}`;
    }
    j++;
  }

  coinValueText.text = bal;

  if (changeBy > 0) {
    playSoundEffect("collect");
    
  }
}

function toggleGoldTile(container: PIXI.Container, shouldShow: boolean) {
  const goldTile = container.children.find(
    (child) => child.label === "symbolGoldTile"
  );
  if (goldTile) {
    goldTile.visible = shouldShow;
  }
}
