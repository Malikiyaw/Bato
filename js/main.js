// main.js – Phaser entry point

import "./data.js";
import "./audio.js";
import "./systems.js";
import "./entities.js";
import "./ui.js";
import "./perkOverlay.js";
// No import for BootScene; it will be available globally via window.BootScene


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
  console.log('Phaser game initialized');
});
