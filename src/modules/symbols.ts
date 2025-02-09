// symbols.ts
import * as PIXI from "pixi.js";

export const slot = {
  reels: 5,
  rows: 3,
  //0 - 0 - 0 - 0 - 0
  //1 - 1 - 1 - 1 - 1
  //2 - 2 - 2 - 2 - 2
  paylines: [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
  ],
  RTP: "98,64%",
};

// Kreiranje simbola kao običnih objekata
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
  [],
  [],
  [2, 0.5],
  [3, 1],
  [4, 2.5],
  [5, 5],
]);

// Bag of gold
const symbol2 = createSlotSymbol("symbol2", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 1],
  [4, 2.5],
  [5, 5],
]);

// Barrels
const symbol3 = createSlotSymbol("symbol3", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 2],
  [4, 3],
  [5, 10],
]);

// Boots
const symbol4 = createSlotSymbol("symbol4", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 5],
  [4, 10],
  [5, 28.5],
]);

// Dynamite crate
const symbol5 = createSlotSymbol("symbol5", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 10],
  [4, 22.5],
  [5, 65],
]);

// Pile of gold
const symbol6 = createSlotSymbol("symbol6", symPlaceholderTx, [
  [],
  [],
  [],
  [3, 25],
  [4, 50],
  [5, 125],
]);

const symbol7 = createSlotSymbol("symbol7", symPlaceholderTx, [
  [], // 1 simbol - nema isplate
  [], // 2 simbola - nema isplate
  [3, 3], // 3 simbola - isplata 3x uloga
  [4, 7], // 4 simbola - isplata 7x uloga
  [5, 20], // 5 simbola - isplata 20x uloga
]);

// Wild
export const symbol8 = createSlotSymbol("symbol8", symPlaceholderTx, [
  [],
  [],
  [],
  [],
  [],
  [5, 500],
]);

export async function addTextureToSymbols() {
  symbol1.texture = PIXI.Texture.from("snake.png");
  symbol2.texture = PIXI.Texture.from("trolley.png");
  symbol3.texture = PIXI.Texture.from("barrels.png");
  symbol4.texture = PIXI.Texture.from("boots.png");
  symbol5.texture = PIXI.Texture.from("dynamite_crate.png");
  symbol6.texture = PIXI.Texture.from("pile_of_gold.png");
  symbol7.texture = PIXI.Texture.from("gas_lamp.png");
  symbol8.texture = PIXI.Texture.from("wild.png");
}

export const symbolChances = {
  //Chances = number of each symbol in draw
  symbols: [symbol1, symbol2, symbol3, symbol4, symbol5, symbol6, symbol7, symbol8],
  chances: [250, 250, 205, 125, 80, 67, 50, 33],

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
