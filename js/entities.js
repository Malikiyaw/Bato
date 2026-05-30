import Phaser from 'phaser';

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'enemy', opts = {}) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = opts.maxHp ?? 30;
    this.hp = this.maxHp;
    this.speed = opts.speed ?? 120;
    this.damage = opts.damage ?? 10;

    this.setCollideWorldBounds(true);
    this.setImmovable(false);
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) this.die();
  }

  die() {
    if (!this.active) return;
    this.destroy();
  }

  update(player) {
    if (!player?.active) return;
    this.scene.physics.moveToObject(this, player, this.speed);
  }
}

class Boss extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, 'boss', { maxHp: 150, speed: 90, damage: 20 });
    this.phase = 1;
  }

  update(player) {
    super.update(player);
    if (this.hp < this.maxHp * 0.5 && this.phase === 1) this.phase = 2;
  }
}

export { Enemy, Boss };
