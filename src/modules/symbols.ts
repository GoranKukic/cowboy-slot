// symbols.ts
import * as PIXI from "pixi.js";

export const slot = {
  reels: 5,
  rows: 3,
  paylines: [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
  ],
  RTP: "95.46%", // RTP tested on 100.000.000 spins
};

export type SlotSymbol = {
  name: string;
  texture: PIXI.Texture;
  payouts: number[][];
};

const createSlotSymbol = (
  name: string,
  texture: PIXI.Texture,
  payouts: number[][]
): SlotSymbol => {
  return {
    name,
    texture,
    payouts,
  };
};

const symPlaceholderTx = PIXI.Texture.WHITE;

// Snake
export const symbol1 = createSlotSymbol("symbol1", symPlaceholderTx, [
  [], // 0 symbols - no payout
  [], // 1 symbol - no payout
  [2, 0.5], // 2 symbols - payout: stake x 0.5
  [3, 1], // 3 symbols - payout: stake x 1
  [4, 2.5], // 4 symbols - payout: stake x 2.5
  [5, 5], // 5 symbols - payout: stake x 5
]);

// Barrels
export const symbol2 = createSlotSymbol("symbol2", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 1],
  [4, 2.5],
  [5, 5],
]);

// Male
export const symbol3 = createSlotSymbol("symbol3", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 2],
  [4, 3],
  [5, 10],
]);

// Female
export const symbol4 = createSlotSymbol("symbol4", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 5],
  [4, 10],
  [5, 28.5],
]);

// Dynamite crate
export const symbol5 = createSlotSymbol("symbol5", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 10],
  [4, 22.5],
  [5, 65],
]);

// Trolley
export const symbol6 = createSlotSymbol("symbol6", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 25],
  [4, 50],
  [5, 125],
]);

// Gas Lamp
export const symbol7 = createSlotSymbol("symbol7", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 3],
  [4, 7],
  [5, 20],
]);

// Pile of gold
export const symbol8 = createSlotSymbol("symbol8", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 5],
  [4, 15],
  [5, 30],
]);

// Wild
export const symbol9 = createSlotSymbol("symbol9", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 10],
  [4, 25],
  [5, 75],
]);

export async function addTextureToSymbols() {
  symbol1.texture = PIXI.Texture.from("snake2.png");
  symbol2.texture = PIXI.Texture.from("barrels.png");
  symbol3.texture = PIXI.Texture.from("male_cut_transp3.png");
  symbol4.texture = PIXI.Texture.from("female_cut_transp3.png");
  symbol5.texture = PIXI.Texture.from("dynamite_crate2.png");
  symbol6.texture = PIXI.Texture.from("gas_lamp.png");
  symbol7.texture = PIXI.Texture.from("pile_of_gold.png");
  symbol8.texture = PIXI.Texture.from("trolley.png");
  symbol9.texture = PIXI.Texture.from("wild3.png");
}

export const symbolChances = {
  //Chances = number of each symbol in draw
  symbols: [
    symbol1,
    symbol2,
    symbol3,
    symbol4,
    symbol5,
    symbol6,
    symbol7,
    symbol8,
    symbol9,
  ],
  chances: [330, 290, 250, 180, 140, 110, 85, 60, 60],

  numberToSymbol(nr: number) {
    let temp: number = 1;

    for (let i = 0; i < this.chances.length; i++) {
      if (nr >= temp && nr < temp + this.chances[i]) {
        return this.symbols[i];
      } else {
        temp += this.chances[i];
      }
    }
  },
};

export function countSymbols(): number {
  let r: number = 0;
  for (let i = 0; i < symbolChances.chances.length; i++) {
    r += symbolChances.chances[i];
  }
  return r;
}
