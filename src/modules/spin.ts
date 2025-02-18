// spin.ts
import type { SlotSymbol } from "./symbols";
import { slot, symbol1, symbol8, symbolChances, countSymbols } from "./symbols";

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
    let result: SlotSymbol[][] = [];
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
    let noWilds = line.filter((item) => item !== symbol8);
    if (noWilds.length === 0) {
      winningLines[paylineNumber] = bet * symbol8.payouts[5][1];
      symbolsOnWinning[paylineNumber] = 5;
    } else {
      let result: SlotSymbol[] = [];
      for (let el of line) {
        if (el !== noWilds[0] && el !== symbol8) break;
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
