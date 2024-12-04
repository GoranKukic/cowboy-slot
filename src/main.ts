// main.ts
import "./style.css";
import { initGame } from "./modules/gameCore";
import { loadTextures } from "./modules/textures";
// import { store } from "./store/store";
// import { spinReels } from "./modules/gameLogic";

const startApp = async () => {
  try {
    const app = await initGame("#app");
    await loadTextures(app);
    // store.dispatch(spinReels());
    // console.log(store.getState());

    // store.dispatch(spinReels());
    // console.log(store.getState());
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  startApp();
});
