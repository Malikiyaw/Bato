// Fixed main.js with proper named imports and full config
 import Phaser from 'phaser';
import { BootScene, MenuScene, PlayScene, EndScene } from './scenes.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { 
    default: 'arcade', 
    arcade: { 
      gravity: { y: 0 },
      debug: false 
    } 
  },
  scene: [BootScene, MenuScene, PlayScene, EndScene],
  backgroundColor: '#111111',
  parent: 'game'
};

const game = new Phaser.Game(config);

export default game;
