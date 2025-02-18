// slot.ts
import * as PIXI from "pixi.js";
import {
  createContainer,
  createSprite,
  setTransform,
  createText,
  primaryTextStyle,
  winingTextStyle,
} from "./pixiSetup";
import { symbolChances, slot } from "./symbols";
import { createSpin, Spin, randomInt } from "./spin";
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
import { gsap } from "gsap";

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

// Creating reel containers
const reelWidth: number = 226;
let reelHeight: number = 625;
const reelSpacing = 25;
const initialX: number = -550;
const initialY: number = -318;
let winningLineText: PIXI.Text;
let winningAmountText: PIXI.Text;

// Filters
const desaturateEffect = new PIXI.ColorMatrixFilter();
desaturateEffect.desaturate();
const greenTintEffect = new PIXI.ColorMatrixFilter();
greenTintEffect.tint(0x71b443);
const grayTintEffect = new PIXI.ColorMatrixFilter();
grayTintEffect.tint(0x808080);

let isAutoPlay: boolean = false;

// States of spin
enum States {
  idle, // When nothing is happening
  spinning, // When reels are spinning
  resultWaiting, // When we are waiting for result
  resultDone, // When result is done and we are
  stopping, // When we want to stop spinning
}
let state: States = States.idle;

export const initSlot = function () {
  // Creating new spin
  let s = createSpin(10, false);
  let spritesNow: PIXI.Sprite[][] = [];

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

  symbolWidth = reelHeight / 3;

  reels.forEach((reel, index) => {
    reel.position.y = initialY;
    reel.position.x = initialX + reelWidth * index;
  });

  // Create Symbols & Mask
  for (let i = -1; i < 4; i++) {
    spritesNow[i + 1] = [];
    // Mask
    const mask = new PIXI.Graphics()
      .rect(
        initialX + (i + 1) * reelWidth,
        initialY,
        199 + reelSpacing,
        reelHeight
      )
      .fill(0xff0000);
    mask.label = `mask ${i + 2}`;
    slotContainer.addChild(mask);

    // Symbols
    for (let j in reels) {
      // Adding first and last symbols to reels (1, 5)
      if (i == -1 || i == 3) {
        let sprite = PIXI.Sprite.from(
          symbolChances.symbols[randomInt(0, 6)].texture
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
        let sprite = PIXI.Sprite.from(s.spinResult[i][j].texture);
        sprite.label = "symbolSprite2";
        sprite.height = sprite.width = symbolWidth;

        if (window.innerWidth > window.innerHeight) {
          sprite.position.y = symbolWidth * i;
        } else {
          sprite.position.y = startingY + symbolWidth * i;
        }

        spritesNow[i + 1][j] = sprite;
        reels[j].addChild(sprite);
      }
    }
    // Mask first and last symbol
    reels[i + 1].mask = mask;
  }

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
    console.log("increase bet");

    betValueIncreaseText.filters = [];
    betValueDecreaseText.filters = [];

    if (betValueText.text == bets[bets.length - 1].toString()) {
      return;
    } else {
      let temp: number = bets.indexOf(parseFloat(betValueText.text));
      let temp2: number = bets[temp + 1];
      betValueText.text = temp2.toString();
      stake = temp2;
      if (bets.indexOf(temp2) == bets.length - 1) {
        betValueIncreaseText.filters = [grayTintEffect];
        maxBetText.filters = [greenTintEffect];
      }
    }
  });

  // Decrease Bet
  betValueDecreaseText.on("pointerdown", function () {
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
    const maxBet = bets[bets.length - 1];
    betValueText.text = maxBet.toString();
    stake = maxBet;

    betValueDecreaseText.filters = [];
    maxBetText.filters = [greenTintEffect];
    betValueIncreaseText.filters = [grayTintEffect];
  });

  autoplayBtnContainer.on("pointerdown", function () {
    isAutoPlay = !isAutoPlay;

    if (isAutoPlay === true) {
      autoplayBtnText.filters = [greenTintEffect];
      // Simulate event
      triggerSpinAction();
    } else {
      autoplayBtnText.filters = [];
    }
  });
};

function triggerSpinAction() {
  winningAmountText.text = "";
  winningLineText.text = "";

  if (bal - stake < 0) {
    return;
  }

  if (state == States.idle) {
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

  // Function that adds symbol at top
  function addSymbolAtTop() {
    let temp = randomInt(0, 6);

    let sprite = PIXI.Sprite.from(symbolChances.symbols[temp].texture);
    sprite.height = sprite.width = symbolWidth;

    reel.removeChildAt(reel.children.length - 1);

    for (let m = reel.children.length - 1; m <= 0; m--) {
      reel.setChildIndex(reel.children[m], m + 1);
    }
    reel.addChildAt(sprite, 0).position.y = 0 - symbolWidth;
  }

  // Function to fix position of symbols
  function fixPosition() {
    for (let p = 0; p < reel.children.length; p++) {
      if (window.innerWidth > window.innerHeight) {
        reel.children[p].position.y = symbolWidth * (p - 1);
      } else {
        reel.children[p].position.y = startingY + symbolWidth * (p - 1);
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
          let sprite = PIXI.Sprite.from(sR[sR.length - 1][reelNumber].texture);
          sprite.height = sprite.width = symbolWidth;

          sR.splice(sR.length - 1, 1);
          reel.removeChildAt(reel.children.length - 1);

          for (let m = reel.children.length - 1; m <= 0; m--) {
            reel.setChildIndex(reel.children[m], m + 1);
          }

          reel.addChildAt(sprite, 0).position.y = 0 - symbolWidth;
        } else {
          reel.filters = [];

          ticker.stop();
          state = States.resultWaiting;

          it = 0;

          addSymbolAtTop();
          fixPosition();

          spinDone = true;

          if (reelNumber == 4) {
            gsap.killTweensOf(spinBtnIcon);
            gsap.to(spinBtnIcon, {
              rotation: spinBtnIcon.rotation + 360,
              duration: 0,
              ease: "power1.out",
            });

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

  if (copySOWf.length > 0) {
    if (isAutoPlay === true) {
      autoplayBtnContainer.interactive = false;
      autoplayBtnContainer.filters = [grayTintEffect];
    }
    isAutoPlay = false;

    for (let i = 0; i < copySOWf.length; i++) {
      symbolsToHighlight[i] = [];
      inner: for (let j = start; j < 5; j++) {
        if (result.symbolsOnWinning[j] != null) {
          for (let q = 0; q < result.symbolsOnWinning[j]; q++) {
            symbolsToHighlight[i].push(
              reels[q].children[slot.paylines[j][q] + 1]
            );
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
  } else {
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
          } else {
            ch.filters = [desaturateEffect];
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
            } else {
              ch.filters = [desaturateEffect];
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
}
