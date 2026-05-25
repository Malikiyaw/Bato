// main.js – Phaser entry point

import "./utils.js";
import { BootScene } from "./scenes.js";

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  pixelArt: true,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [BootScene],
};

window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
});
