// Complete main.js with full Phaser config, scenes, assets
 import Phaser from 'phaser';
import BootScene from './scenes.js';
import PlayScene from './scenes.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [BootScene, PlayScene],
  backgroundColor: '#000000'
};

const game = new Phaser.Game(config);

export default game;