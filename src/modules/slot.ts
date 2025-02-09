// slot.ts
import * as PIXI from "pixi.js";
import { createContainer, createSprite, setTransform } from "./pixiSetup";
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
} from "./ui";
import { gsap } from "gsap";

// Setting variables
// let reelHeight: number = 0;
// let startingX: number;
let startingY: number = 0;
let symbolWidth: number = 0;
const speed: number = 70; // Speed of spin
const maxIt: number = 150; // Max iterations in spin

let reels: PIXI.Container[];
let sp: Spin;
let stake: number = 10;
export let bal: number = 250000;
let tWin: number = 0;
let showLines: PIXI.Ticker;
const bets: number[] = [1, 5, 10, 20, 40, 50, 100];

// Creating reel containers
const reelWidth: number = 226; // Width of each reel
let reelHeight: number = 625; // Height of each reel
const reelSpacing = 25; // Space between reel
const initialX: number = -550; // Početna X koordinata unutar slotContainer-a
const initialY: number = -318; // Početna Y koordinata unutar slotContainer-a

const gray = new PIXI.ColorMatrixFilter();
gray.desaturate();

// States of spin
enum States {
  idle,
  spinning,
  resultWaiting,
  resultDone,
  stopping,
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

  let startingX: number = 0;
  console.log("startingX", startingX);

  // Landscape & portrait mode - Need more work aorund this
  if (window.innerWidth > window.innerHeight) {
    symbolWidth = reelHeight / 3;
    startingX = window.innerWidth / 2 - (symbolWidth * 5) / 2;
  } else {
    symbolWidth = window.innerWidth / 5;
    reelHeight = symbolWidth * 3;
    if (window.innerHeight / 2 - reelHeight > 0) {
      startingY = window.innerHeight / 2 - reelHeight;
    } else {
      startingY = 0;
    }
  }

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
    // Mask first and last symbols
    reels[i + 1].mask = mask;
  }

  // Events for buttons
  spinBtnContainer.on("mousedown", function () {
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
    }
    //
    else if (state == States.spinning) {
      state = States.stopping;
    } else if (state == States.resultDone) {
      spinBtnIcon.alpha = 1;
      spinBtnCollectIcon.alpha = 0;
      if (tWin > 0) changeBalance(tWin);
      //   win.text = "";
      //   winInfo.text = "";
      reels.forEach((reel) => {
        reel.children.forEach((ch) => {
          ch.filters = [];
        });
      });
      showLines.stop();
      state = States.idle;
    }
  });

  betValueIncreaseText.on("mousedown", function () {
    if (betValueText.text == bets[bets.length - 1].toString()) {
      return;
    } else {
      betValueDecreaseText.filters = [];
      let temp: number = bets.indexOf(parseFloat(betValueText.text));
      let temp2: number = bets[temp + 1];
      betValueText.text = temp2.toString();
      stake = temp2;
      // if (bets.indexOf(temp2) == bets.length - 1) {
      //   betValueIncreaseText.filters = [gray];
      // }
    }
  });

  betValueDecreaseText.on("mousedown", function () {
    if (betValueText.text == bets[0].toString()) {
      return;
    } else {
      betValueIncreaseText.filters = [];
      let temp: number = bets.indexOf(parseFloat(betValueText.text));
      let temp2: number = bets[temp - 1];
      betValueText.text = temp2.toString();
      stake = temp2;
      // if (temp2 == bets[0]) {
      //   betValueDecreaseText.filters = [gray];
      // }
    }
  });

  maxBetBtnContainer.on("mousedown", function () {
    const maxBet = bets[bets.length - 1];

    betValueText.text = maxBet.toString();
    stake = maxBet;

    // betValueIncreaseText.filters = [gray];
    // betValueDecreaseText.filters = [];
  });
};

export function spin() {
  if (state == States.idle) {
    // If is in idle
    sp = createSpin(stake, false); //Spin result

    spinAnimation(sp); // Running animation

    state = States.spinning; // Setting state to 'spinning'
  }
}

function spinAnimation(res: Spin) {
  let n = 0; // Variable to timeout each reel so they don't run at same time

  reels.forEach((element) => {
    // For each reel
    n++;
    setTimeout(() => {
      animateReel(element, reels.indexOf(element), res); // Reel animation
    }, 200 * n);
  });
}

function animateReel(reel: PIXI.Container, reelNumber: number, res: Spin) {
  let it: number = 1; // Iteration
  if (state == States.spinning) {
    it = 1;
  } else if (state == States.stopping || state == States.resultWaiting) {
    it = maxIt;
  }

  let spinDone: boolean = false;

  let addNext = Math.round(symbolWidth / speed); //When to add next symbol

  let ticker = new PIXI.Ticker(); //Ticker
  let sR = [...res.spinResult]; //Copy of array from Spin object

  const blurReel = new PIXI.BlurFilter();
  blurReel.strengthY = speed / 4;
  blurReel.strengthX = 0;

  // Function that adds symbol at top
  function addSymbolAtTop() {
    let temp = randomInt(0, 6);

    let sprite = PIXI.Sprite.from(symbolChances.symbols[temp].texture); // Takes random texture to variable
    sprite.height = sprite.width = symbolWidth; // Setting height and width

    reel.removeChildAt(reel.children.length - 1); // Removing last child of reel

    for (let m = reel.children.length - 1; m <= 0; m--) {
      // Fixing indexes (making space at index 0)
      reel.setChildIndex(reel.children[m], m + 1);
    }
    reel.addChildAt(sprite, 0).position.y = 0 - symbolWidth; // Adding child (sprite) at index 0
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

  ticker.start(); //Starting ticker...
  ticker.add(() => {
    //Ticker function
    if (state == States.stopping) {
      it = maxIt;
    }
    if (it % addNext === 0 && it > 30) {
      // Condition to add symbol on top
      if (it >= maxIt) {
        // If its after max iterations - we want to show spin result then
        if (sR.length != 0) {
          // If we still have symbols to show

          let sprite = PIXI.Sprite.from(sR[sR.length - 1][reelNumber].texture); // Taking textures from spin result
          sprite.height = sprite.width = symbolWidth; // Setting height and width

          sR.splice(sR.length - 1, 1); // Removing added symbol from array
          reel.removeChildAt(reel.children.length - 1); // Removing last child of reel

          for (let m = reel.children.length - 1; m <= 0; m--) {
            // Fixing indexes
            reel.setChildIndex(reel.children[m], m + 1);
          }

          reel.addChildAt(sprite, 0).position.y = 0 - symbolWidth; // Adding created sprite to beggining of reel
        } else {
          // If there's nothing else to add
          reel.filters = []; // Clearing filters

          ticker.stop(); // Stoping ticker
          state = States.resultWaiting; // Changing state to show result

          it = 0;

          addSymbolAtTop(); // Adding symbol at top
          fixPosition(); // Fixing position

          spinDone = true; // Saying to program that spin is done

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
        // If it's not after max iterations - random elements animation
        addSymbolAtTop(); // Adding symbol at top
      }
    }
    reel.children.forEach((element) => {
      // For each children on current reel
      if (it < 25 && it < maxIt) {
        // First symbols go backward
        element.position.y -= (speed / 100) * it;
      } else {
        if (!spinDone) {
          // If spin isn't done
          element.position.y += speed; // Moving symbols
          reel.filters = [blurReel]; //Blur to reel
        }
      }
    });
    it++; // Iteration
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

  if (copySOWf.length > 0) {
    for (let i = 0; i < copySOWf.length; i++) {
      symbolsToHighlight[i] = [];
      inner: for (let j = start; j < 5; j++) {
        if (result.symbolsOnWinning[j] != null) {
          for (let q = 0; q < result.symbolsOnWinning[j]; q++) {
            symbolsToHighlight[i].push(
              reels[q].children[slot.paylines[j][q] + 1]
            );
          }
          winningMessage.push(`Won ${result.winningLines[j]} on line ${j + 1}`);
          start = j + 1;
          break inner;
        }
      }
    }
    showLines.start();
    spinBtnIcon.alpha = 0;
    spinBtnCollectIcon.alpha = 1;

    // bttn.texture = app.loader.resources["satchel"].texture;
  } else {
    state = States.idle;
  }

  let time: number = 0;
  let ln: number = 0;
  let w: number = 0;

  showLines.add(() => {
    if (time >= 30 * copySOWf.length) {
      if (time % 120 == 0) {
        // winInfo.text = winningMessage[ln];
        reels.forEach((reel) => {
          reel.children.forEach((ch) => {
            if (ch == symbolsToHighlight[ln][reels.indexOf(reel)]) {
              ch.filters = [];
            } else {
              ch.filters = [gray];
            }
          });
        });
        if (ln == symbolsToHighlight.length - 1) {
          ln = 0;
        } else {
          ln++;
        }
      }
    } else {
      if (time % 30 == 0) {
        w = w + winC[ln];
        // win.text = w.toString();
        reels.forEach((reel) => {
          reel.children.forEach((ch) => {
            if (ch == symbolsToHighlight[ln][reels.indexOf(reel)]) {
              ch.filters = [];
            } else {
              ch.filters = [gray];
            }
          });
        });
        if (ln == symbolsToHighlight.length - 1) {
          ln = 0;
        } else {
          ln++;
        }
      }
    }
    time++;
  });
}

function changeBalance(changeBy: number) {
  console.log("changeBy", changeBy);

  bal = bal + changeBy;
  let balS: string = bal.toFixed(2); // String with 2 digits after the decimal point
  let balInt: string = bal.toFixed(0); // String with no digits after the decimal point
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
