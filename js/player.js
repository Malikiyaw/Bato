import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.speed = 220;

    this.isAttacking = false;
    this._attackCooldownMs = 250;
    this._nextAttackAt = 0;
    this.attackRequested = false; // consumed by the scene
  }

  update(cursors, attackKey) {
    if (!this.active) return;

    this.setVelocity(0);

    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.flipX = true;
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.flipX = false;
    }

    if (cursors.up.isDown) this.setVelocityY(-this.speed);
    if (cursors.down.isDown) this.setVelocityY(this.speed);

    const now = this.scene.time.now;
    if (attackKey && Phaser.Input.Keyboard.JustDown(attackKey) && now >= this._nextAttackAt) {
      this.attack();
      this._nextAttackAt = now + this._attackCooldownMs;
    }
  }

  attack() {
    if (!this.active) return;
    this.isAttacking = true;
    this.attackRequested = true;
    this.setTint(0xffffff);
    this.scene.time.delayedCall(120, () => {
      if (!this.active) return;
      this.isAttacking = false;
      this.clearTint();
    });
  }

  takeDamage(amount) {
    if (!this.active) return;
    this.health = Math.max(0, this.health - amount);
    this.setTint(0xff4444);
    this.scene.time.delayedCall(120, () => {
      if (this.active) this.clearTint();
    });
    if (this.health <= 0) this.die();
  }

  die() {
    if (!this.active) return;
    this.setTint(0x000000);
    this.setVelocity(0);
    this.scene.gameOver();
  }
}

export default Player;
