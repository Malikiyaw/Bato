// Fixed main.js with proper named imports and full config
 import Phaser from 'phaser';
import { BootScene, PlayScene } from './scenes.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { 
    default: 'arcade', 
    arcade: { 
      gravity: { y: 300 }, 
      debug: false 
    } 
  },
  scene: [BootScene, PlayScene],
  backgroundColor: '#111111',
  parent: 'game'
};

const game = new Phaser.Game(config);

export default game;