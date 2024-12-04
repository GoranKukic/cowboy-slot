import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "../modules/gameLogic";

export const store = configureStore({
  reducer: {
    game: gameReducer, // Glavni reducer za stanje igre
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
