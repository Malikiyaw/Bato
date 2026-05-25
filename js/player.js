// js/player.js – Player class definition
export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    // Player stats
    this.maxHealth = 5;
    this.health = this.maxHealth;
    this.shield = false; // perk‑activated shield flag
    this.speed = 150;
    this.coins = 0;
    // Event emitter for HUD updates
    this.events = new Phaser.Events.EventEmitter();
  }

  // Take damage – respects shield
  takeDamage(amount) {
    if (this.shield) {
      this.shield = false; // consume shield
      this.events.emit("shield-broken");
      return;
    }
    this.health = Math.max(this.health - amount, 0);
    this.events.emit("health-changed", this.health, this.maxHealth);
    if (this.health <= 0) {
      this.events.emit("player-died");
    }
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
    this.events.emit("health-changed", this.health, this.maxHealth);
  }

  addCoins(amount) {
    this.coins += amount;
    this.events.emit("coins-changed", this.coins);
  }

  // Simple helper to move based on cursors (called from PlayScene.update)
  move(cursors) {
    const speed = this.speed;
    this.setVelocity(0);
    if (cursors.left?.isDown) this.setVelocityX(-speed);
    else if (cursors.right?.isDown) this.setVelocityX(speed);
    if (cursors.up?.isDown) this.setVelocityY(-speed);
    else if (cursors.down?.isDown) this.setVelocityY(speed);
  }
}
