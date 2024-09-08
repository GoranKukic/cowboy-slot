// main.ts
import "./style.css";
import { initGame } from "./modules/gameCore";
import { loadTextures } from "./modules/textures";

const startApp = async () => {
  try {
    const app = await initGame("#app");
    await loadTextures(app);
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  startApp();
});
