// spin.ts
import type { SlotSymbol } from "./symbols";
import { slot, symbol1, symbol9, symbolChances, countSymbols } from "./symbols";
import { forcedCharacterCombinations } from "./reelAnimation";

let spinCounter: number = 0;

export interface Spin {
  spinResult: SlotSymbol[][];
  winningLines: number[];
  totalWin: number;
  symbolsOnWinning: number[];
  winCalc: () => void;
  drawSymbols: () => SlotSymbol[][];
  checkLines: () => void;
  winOnLine: (line: SlotSymbol[], paylineNumber: number) => void;
  logs: () => void;
}

const symbolsAmount = countSymbols();

export const createSpin = (bet: number, logs?: boolean): Spin => {
  let spinResult: SlotSymbol[][] = drawSymbols();
  let winningLines: number[] = [];
  let totalWin = 0;
  let symbolsOnWinning: number[] = [];

  checkLines();
  winCalc();
  if (logs) logsOutput();

  function winCalc() {
    for (let win of winningLines) {
      if (win > 0) totalWin += win;
    }
  }

  function drawSymbols(): SlotSymbol[][] {
    spinCounter++;

    let result: SlotSymbol[][] = [];

    // Every 5 spins we use defined combiation for reel animation
    if (spinCounter % 5 === 0) {
      const randomIndex = randomInt(0, forcedCharacterCombinations.length - 1);
      let chosenCombination: SlotSymbol[][] =
        forcedCharacterCombinations[randomIndex];

      for (let row = 0; row < slot.rows; row++) {
        result[row] = [...chosenCombination[row]];
      }
    }
    // Standard radnom generating of symbols
    else {
      for (let ro = 0; ro < slot.rows; ro++) {
        result[ro] = [];
        for (let re = 0; re < slot.reels; re++) {
          let temp = randomInt(1, symbolsAmount);
          let res = symbolChances.numberToSymbol(temp);
          if (res !== undefined) {
            result[ro][re] = res;
          } else {
            throw new Error(`Error drawing value res (${res}) is undefined`);
          }
        }
      }
    }
    return result;
  }

  function checkLines() {
    for (let i = 0; i < slot.paylines.length; i++) {
      let nowChecking: SlotSymbol[] = [];
      for (let j = 0; j < slot.paylines[i].length; j++) {
        nowChecking[j] = spinResult[slot.paylines[i][j]][j];
      }
      winOnLine(nowChecking, i);
    }
  }

  function winOnLine(line: SlotSymbol[], paylineNumber: number) {
    let noWilds = line.filter((item) => item !== symbol9);
    if (noWilds.length === 0) {
      winningLines[paylineNumber] = bet * symbol9.payouts[5][1];
      symbolsOnWinning[paylineNumber] = 5;
    } else {
      let result: SlotSymbol[] = [];
      for (let el of line) {
        if (el !== noWilds[0] && el !== symbol9) break;
        result.push(el);
      }
      if (noWilds[0] === symbol1 && result.length >= 2) {
        winningLines[paylineNumber] = bet * symbol1.payouts[result.length][1];
        symbolsOnWinning[paylineNumber] = result.length;
      } else if (result.length >= 3) {
        winningLines[paylineNumber] =
          bet * noWilds[0].payouts[result.length][1];
        symbolsOnWinning[paylineNumber] = result.length;
      }
    }
  }

  function logsOutput() {
    let r = "";
    for (let ro = 0; ro < slot.rows; ro++) {
      for (let re = 0; re < slot.reels; re++) {
        r += spinResult[ro][re].name + " ";
      }
      r += "\n";
    }
    console.log(spinResult);
    console.log(r);
    console.log(winningLines);
  }

  return {
    spinResult,
    winningLines,
    totalWin,
    symbolsOnWinning,
    winCalc,
    drawSymbols,
    checkLines,
    winOnLine,
    logs: logsOutput,
  };
};

export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// export function RTPcalc(nrSpins: number) {
//   let spins: number = 0;
//   let hw: number = 0;
//   let highestWin: string = "";
//   let balance: number = 1000000;
//   let bet: number = 10;
//   for (let i = 1; i <= nrSpins; i++) {
//     if (i % (nrSpins / 100) == 0) {
//       // console.clear();
//       console.log(`${((i / nrSpins) * 100).toFixed(2)}%`);
//     }
//     let temp = createSpin(bet, false);
//     balance = balance - bet;
//     if (temp.totalWin > hw) {
//       highestWin = `Highest win was ${
//         temp.totalWin / bet
//       }x at spin number ${i}.`;
//       hw = temp.totalWin;
//     }
//     if (temp.totalWin > 0) {
//       balance = balance + temp.totalWin;
//     }
//     spins++;
//   }
//   console.log(
//     `Done ${spins} spins with bet ${bet}. \n${highestWin} \nBalance at end is ${balance}.\nThat means RTP is ${
//       balance / 10000
//     }%`
//   );
// }

export function RTPcalc(nrSpins: number) {
  let spins: number = 0;
  let hw: number = 0;
  let highestWin: string = "";
  let balance: number = 1000000;
  let bet: number = 10;
  let totalBets: number = 0; // Track total amount bet
  let totalPayouts: number = 0; // Track total payouts

  for (let i = 1; i <= nrSpins; i++) {
    if (i % (nrSpins / 100) == 0) {
      console.log(`${((i / nrSpins) * 100).toFixed(2)}%`);
    }
    let temp = createSpin(bet, false);
    totalBets += bet; // Add bet to total bets
    balance = balance - bet;
    if (temp.totalWin > hw) {
      highestWin = `Highest win was ${
        temp.totalWin / bet
      }x at spin number ${i}.`;
      hw = temp.totalWin;
    }
    if (temp.totalWin > 0) {
      totalPayouts += temp.totalWin; // Add payout to total payouts
      balance = balance + temp.totalWin;
    }
    spins++;
  }

  // Calculate RTP as (totalPayouts / totalBets) * 100
  let rtp = (totalPayouts / totalBets) * 100;

  console.log(
    `Done ${spins} spins with bet ${bet}. \n${highestWin} \nBalance at end is ${balance}.\nThat means RTP is ${rtp.toFixed(
      2
    )}%`
  );
}
