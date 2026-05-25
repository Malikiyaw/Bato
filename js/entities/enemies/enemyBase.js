// js/entities/enemies/enemyBase.js – Base enemy class
export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, config = {}) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;
    this.setCollideWorldBounds(true);
    this.health = config.health || 3;
    this.speed = config.speed || 80;
    this.damage = config.damage || 1;
    this.target = config.target || scene.player; // default target is player
    this.state = 'idle';
    this.setOrigin(0.5, 0.5);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.updateAI(delta);
  }

  updateAI(delta) {
    if (!this.target) return;
    // Simple chase AI
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const angle = Math.atan2(dy, dx);
    this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
  }

  takeDamage(amount) {
    this.health -= amount;
    this.scene.events.emit('enemy-health-changed', this, this.health);
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.scene.events.emit('enemy-died', this);
    this.destroy();
  }
}
