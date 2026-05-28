// Full upgraded player.js with animations, attack, etc.
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.health = 100;
    this.speed = 300;
    this.isAttacking = false;

    // Animations
    scene.anims.create({ key: 'idle', frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'run', frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 8 }), frameRate: 15, repeat: -1 });
    scene.anims.create({ key: 'attack', frames: scene.anims.generateFrameNumbers('player', { start: 9, end: 12 }), frameRate: 20, repeat: 0 });
    scene.anims.create({ key: 'hurt', frames: scene.anims.generateFrameNumbers('player', { start: 13, end: 15 }), frameRate: 10, repeat: 0 });
    scene.anims.create({ key: 'death', frames: scene.anims.generateFrameNumbers('player', { start: 16, end: 20 }), frameRate: 8, repeat: 0 });

    this.play('idle');
  }

  update(cursors, pointer, attackKey) {
    this.setVelocity(0);

    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.flipX = true;
      if (!this.isAttacking) this.play('run', true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.flipX = false;
      if (!this.isAttacking) this.play('run', true);
    } else if (!this.isAttacking) {
      this.play('idle', true);
    }

    if (cursors.up.isDown) this.setVelocityY(-this.speed);
    if (cursors.down.isDown) this.setVelocityY(this.speed);

    if (attackKey && Phaser.Input.Keyboard.JustDown(attackKey) && !this.isAttacking) {
      this.attack();
    }
  }

  attack() {
    this.isAttacking = true;
    this.play('attack');
    // Add attack hitbox logic here
    this.scene.time.delayedCall(500, () => { this.isAttacking = false; });
  }

  takeDamage(amount) {
    this.health -= amount;
    this.play('hurt');
    if (this.health <= 0) this.die();
  }

  die() {
    this.play('death');
    this.scene.gameOver();
  }
}

export default Player;