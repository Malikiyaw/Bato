// Fully fixed scenes.js with imports
 import Player from './player.js';
import { Enemy, Boss } from './entities.js';

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  preload() {
    // Load assets - using placeholders, but code is ready for real sprites
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('boss', 'assets/boss.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('background', 'assets/background.png');
  }
  create() {
    this.scene.start('PlayScene');
  }
}

class PlayScene extends Phaser.Scene {
  constructor() { super('PlayScene'); }
  create() {
    this.add.image(400, 300, 'background').setScale(2);

    this.player = new Player(this, 100, 400);
    this.enemies = this.physics.add.group();
    this.bosses = this.physics.add.group();

    // Spawn some enemies
    for (let i = 0; i < 5; i++) {
      const enemy = new Enemy(this, 400 + Math.random()*300, 300, 'enemy');
      this.enemies.add(enemy);
    }

    const boss = new Boss(this, 600, 200);
    this.bosses.add(boss);

    // Collisions
    this.physics.add.collider(this.player, this.enemies, (p, e) => {
      p.takeDamage(10);
      e.destroy();
    });

    this.physics.add.collider(this.player, this.bosses, (p, b) => {
      p.takeDamage(20);
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Touch support
    this.input.on('pointerdown', (pointer) => {
      if (pointer.x > this.player.x) this.player.setVelocityX(200);
    });

    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
  }

  update() {
    this.player.update(this.cursors, this.input.activePointer, this.attackKey);

    this.enemies.getChildren().forEach(e => {
      if (e.active) e.update(this.player);
    });

    this.bosses.getChildren().forEach(b => {
      if (b.active) b.update(this.player);
    });

    // Simple win condition
    if (this.bosses.getChildren().length === 0 && this.enemies.getChildren().length === 0) {
      this.add.text(300, 250, 'YOU WIN NIGGA!', { fontSize: '48px', fill: '#0f0' });
    }
  }

  gameOver() {
    this.add.text(300, 250, 'GAME OVER', { fontSize: '48px', fill: '#f00' });
    this.physics.pause();
  }
}

export { BootScene, PlayScene };