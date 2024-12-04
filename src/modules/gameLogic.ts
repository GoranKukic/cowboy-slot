import { createSlice} from "@reduxjs/toolkit";

interface ReelState {
  reels: number[][]; // Simboli na kolutovima (5 kolutova, 3 simbola svaki)
  lastWin: "bigWin" | "regularWin" | "none"; // Tip poslednje dobitne kombinacije
  balance: number; // Trenutni balans
}

const initialState: ReelState = {
  reels: [],
  lastWin: "none",
  balance: 1000,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    spinReels(state) {
      // Generiši nove simbole za svaki kolut (5x3 matrica)
      state.reels = Array.from(
        { length: 5 },
        () => Array.from({ length: 3 }, () => Math.floor(Math.random() * 9)) // 9 simbola
      );

      // Dodeli neku dobitnu kombinaciju kao demo
      state.lastWin = Math.random() > 0.7 ? "bigWin" : "regularWin";

      // Ažuriraj balans
      state.balance += state.lastWin === "bigWin" ? 100 : 20;
    },
    resetGame(state) {
      state.reels = [];
      state.lastWin = "none";
      state.balance = 1000;
    },
  },
});

export const { spinReels, resetGame } = gameSlice.actions;

export default gameSlice.reducer;
