// CoreClass.ts
import * as PIXI from "pixi.js";

declare global {
  interface Window {
    __PIXI_APP__: PIXI.Application;
  }
}

export class CowboySlot {
  private app!: PIXI.Application;

  constructor() {
    this._initPixi();
  }

  private async _initPixi(): Promise<void> {
    // Create a new PIXI.Application instance
    this.app = new PIXI.Application();

    // Initialize the application with additional options
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      autoDensity: true,
      background: 0x000000,
    });

    // Enable PixiJS inspector in Chrome Dev tools
    window.__PIXI_APP__ = this.app;
    this.app.stage = new PIXI.Container();
    this.app.stage.label = "app.stage";

    // Append the canvas to the container
    const pixiContainer = document.querySelector<HTMLDivElement>("#app");
    if (pixiContainer) {
      pixiContainer.appendChild(this.app.canvas);
    } else {
      console.error("#app container not found.");
    }

    this.loadTextures(this);
  }

  // Implement the loadTextures method
  public async loadTextures(scope: CowboySlot): Promise<void> {
    // Use `scope` as needed
    console.log("Using scope:", scope);

    // Example usage
    const container = new PIXI.Container();
    container.label = "container";

    // Set the container dimensions to match the screen size
    container.width = scope.app.screen.width;
    container.height = scope.app.screen.height;

    // Position the container in the center of the stage
    container.x = scope.app.screen.width;
    container.y = scope.app.screen.height;

    // Center the container's pivot to make sure it's centered
    container.pivot.set(container.width / 2, container.height / 2);

    // Add the container to the stage
    scope.app.stage.addChild(container);

    // Load textures using PIXI.Assets
    try {
      const texture = await PIXI.Assets.load("./src/images/bg_landscape.png"); // Replace with your image path

      // Create a sprite from the loaded texture
      const backgroundSprite = new PIXI.Sprite(texture);
      backgroundSprite.label = "background port";

      // Set sprite properties if needed (e.g., scale, position)
      backgroundSprite.width = this.app.screen.width;
      backgroundSprite.height = this.app.screen.height;
      backgroundSprite.scale.set(1);
      backgroundSprite.anchor.set(0.5); // Optional: center the image
      backgroundSprite.pivot.set(
        backgroundSprite.width / 2,
        backgroundSprite.height / 2
      );
      backgroundSprite.x = container.width / 2;
      backgroundSprite.y = container.height / 2;

      // Add the sprite to the container
      container.addChild(backgroundSprite);
      console.log("Background image added to container.");
    } catch (error) {
      console.error("Failed to load texture:", error);
    }
  }
}
