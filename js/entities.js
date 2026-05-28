// Full entities.js with enemies, bosses, animations
class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.health = 50;
    this.speed = 150;

    // Animations for enemy
    scene.anims.create({ key: `${type}idle`, frames: scene.anims.generateFrameNumbers(type, { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.play(`${type}idle`);
  }

  update(player) {
    this.scene.physics.moveToObject(this, player, this.speed);
  }
}

class Boss extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss');
    this.health = 500;
    this.phase = 1;
  }

  update(player) {
    super.update(player);
    // Phase logic
    if (this.health < 250 && this.phase === 1) this.phase = 2;
  }
}

export { Enemy, Boss };