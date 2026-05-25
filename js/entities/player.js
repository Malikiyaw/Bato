// Player entity for Bato game
// Handles movement, jump, dash, attack combos, perk activation, and basic animations

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    // stats
    this.maxHealth = 10; // 10 segments
    this.health = this.maxHealth;
    this.prayer = 100;
    this.mediaHeat = 0;
    this.coins = 0;
    this.zone = 1;

    // input reference
    this.input = window.Input || require('../systems/input');

    // cooldowns
    this.attackCooldown = 0;
    this.dashCooldown = 0;
    this.perkCooldown = 0;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.handleInput(delta);
    this.updateCooldowns(delta);
  }

  handleInput(delta) {
    const speed = 180;
    const vx = (this.input.left ? -1 : 0) + (this.input.right ? 1 : 0);
    const vy = (this.input.up ? -1 : 0) + (this.input.down ? 1 : 0);
    this.setVelocity(vx * speed, vy * speed);
    if (this.input.jump && this.body.blocked.down) {
      this.setVelocityY(-350);
    }
    if (this.input.dash && this.dashCooldown <= 0) {
      this.dash();
    }
    if (this.input.attack && this.attackCooldown <= 0) {
      this.attack();
    }
    if (this.input.perk && this.perkCooldown <= 0) {
      this.activatePerk();
    }
  }

  updateCooldowns(delta) {
    const d = delta / 1000;
    if (this.attackCooldown > 0) this.attackCooldown -= d;
    if (this.dashCooldown > 0) this.dashCooldown -= d;
    if (this.perkCooldown > 0) this.perkCooldown -= d;
  }

  attack() {
    // placeholder: emit an attack event
    this.scene.events.emit('player-attack', this);
    this.attackCooldown = 0.3; // seconds
  }

  dash() {
    const dashSpeed = 400;
    const dirX = (this.input.left ? -1 : 0) + (this.input.right ? 1 : 0);
    const dirY = (this.input.up ? -1 : 0) + (this.input.down ? 1 : 0);
    if (dirX !== 0 || dirY !== 0) {
      this.setVelocity(dirX * dashSpeed, dirY * dashSpeed);
    }
    this.dashCooldown = 1.2;
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.5 },
      yoyo: true,
      duration: 150,
      repeat: 2,
    });
  }

  activatePerk() {
    // placeholder: emit perk activation event; perk logic lives in separate system
    this.scene.events.emit('player-perk', this);
    this.perkCooldown = 3; // seconds
  }

  takeDamage(amount) {
    this.health = Phaser.Math.Clamp(this.health - amount, 0, this.maxHealth);
    this.scene.events.emit('player-health-changed', this.health, this.maxHealth);
    if (this.health <= 0) {
      this.scene.events.emit('player-died', this);
    }
  }

  addCoin(value = 1) {
    this.coins += value;
    this.scene.events.emit('player-coins-changed', this.coins);
  }
}

// Export for module use
if (typeof module !== 'undefined') { module.exports = Player; }
