import Phaser from 'phaser';
import Player from './player.js';
import { Enemy, Boss } from './entities.js';
import { createRuntimeTextures } from './runtimeTextures.js';

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    createRuntimeTextures(this);
    this.scene.start('MenuScene');
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(0, 0, 'bg').setOrigin(0).setDisplaySize(width, height);

    this.add
      .text(width / 2, height / 2 - 80, 'BATO', {
        fontFamily: 'monospace',
        fontSize: '64px',
        color: '#ffcc00'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, 'Arrow keys / WASD: move\nSpace: attack', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center'
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(width / 2, height / 2 + 90, 'Click or press ENTER to start', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#aaaaaa'
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.25 },
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    this.input.once('pointerdown', () => this.scene.start('PlayScene'));

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-ENTER', () => this.scene.start('PlayScene'));
      this.input.keyboard.once('keydown-SPACE', () => this.scene.start('PlayScene'));
    }
  }
}

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(0, 0, 'bg').setOrigin(0).setDisplaySize(width, height);

    this.state = 'playing';
    this.score = 0;

    this.player = new Player(this, 120, height / 2);
    this.enemies = this.physics.add.group();
    this.bosses = this.physics.add.group();

    // Spawn enemies
    for (let i = 0; i < 6; i++) {
      const enemy = new Enemy(this, 420 + Math.random() * 320, 120 + Math.random() * (height - 240), 'enemy', {
        maxHp: 30,
        speed: 110 + Math.random() * 30,
        damage: 10
      });
      this.enemies.add(enemy);
    }

    // Spawn boss
    const boss = new Boss(this, width - 140, height / 2);
    this.bosses.add(boss);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // HUD
    this.hpText = this.add
      .text(16, 16, '', { fontFamily: 'monospace', fontSize: '18px', color: '#ffffff' })
      .setScrollFactor(0);
    this.scoreText = this.add
      .text(16, 40, '', { fontFamily: 'monospace', fontSize: '18px', color: '#ffffff' })
      .setScrollFactor(0);

    // Damage handling with brief i-frames
    this.player.invulnUntil = 0;

    this.physics.add.overlap(this.player, this.enemies, this._onPlayerHitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.bosses, this._onPlayerHitBoss, undefined, this);

    // Touch: tap right/left side to move a bit; double-tap to attack
    this.lastTapAt = 0;
    this.input.on('pointerdown', (pointer) => {
      if (!this.player?.active) return;
      const now = this.time.now;
      const isDoubleTap = now - this.lastTapAt < 300;
      this.lastTapAt = now;
      if (isDoubleTap) {
        this.player.attack();
        return;
      }
      this.player.setVelocityX(pointer.x >= this.player.x ? this.player.speed : -this.player.speed);
      this.time.delayedCall(100, () => {
        if (this.player?.active) this.player.setVelocityX(0);
      });
    });

    this._updateHud();
  }

  _updateHud() {
    this.hpText.setText(`HP: ${this.player.health}/${this.player.maxHealth}`);
    this.scoreText.setText(`Score: ${this.score}`);
  }

  _onPlayerHitEnemy(player, enemy) {
    this._applyPlayerDamage(enemy.damage ?? 10);

    // Small knockback so it feels less sticky
    const dx = player.x - enemy.x;
    enemy.setVelocityX(dx >= 0 ? -200 : 200);
  }

  _onPlayerHitBoss(player, boss) {
    this._applyPlayerDamage(boss.damage ?? 20);

    const dx = player.x - boss.x;
    boss.setVelocityX(dx >= 0 ? -140 : 140);
  }

  _applyPlayerDamage(amount) {
    const now = this.time.now;
    if (now < this.player.invulnUntil) return;
    this.player.invulnUntil = now + 600;
    this.player.takeDamage(amount);
    this._updateHud();
  }

  _performAttack() {
    const dir = this.player.flipX ? -1 : 1;
    const centerX = this.player.x + dir * 26;
    const centerY = this.player.y;
    const radius = 44;

    // Visual
    const slash = this.add.circle(centerX, centerY, radius * 0.6, 0xffffff, 0.15);
    this.tweens.add({
      targets: slash,
      alpha: 0,
      scale: 1.4,
      duration: 160,
      onComplete: () => slash.destroy()
    });

    // Damage
    const hitCircle = new Phaser.Geom.Circle(centerX, centerY, radius);

    this.enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      if (Phaser.Geom.Circle.Contains(hitCircle, e.x, e.y)) {
        e.takeDamage(20);
        if (!e.active) this.score += 10;
      }
    });

    this.bosses.getChildren().forEach((b) => {
      if (!b.active) return;
      if (Phaser.Geom.Circle.Contains(hitCircle, b.x, b.y)) {
        b.takeDamage(10);
        if (!b.active) this.score += 100;
      }
    });
  }

  update() {
    if (this.state !== 'playing') return;

    this.player.update(this.cursors, this.attackKey);

    // Consume attack request
    if (this.player.attackRequested) {
      this.player.attackRequested = false;
      this._performAttack();
      this._updateHud();
    }

    this.enemies.getChildren().forEach((e) => e.update(this.player));
    this.bosses.getChildren().forEach((b) => b.update(this.player));

    // Win / Lose checks
    if (this.player.health <= 0) {
      this.state = 'ended';
      this.scene.start('EndScene', { result: 'lose', score: this.score });
      return;
    }

    if (this.enemies.countActive(true) === 0 && this.bosses.countActive(true) === 0) {
      this.state = 'ended';
      this.scene.start('EndScene', { result: 'win', score: this.score });
    }
  }

  gameOver() {
    // Called by Player.die(); keep as fallback.
    if (this.state !== 'playing') return;
    this.state = 'ended';
    this.scene.start('EndScene', { result: 'lose', score: this.score });
  }
}

class EndScene extends Phaser.Scene {
  constructor() {
    super('EndScene');
  }

  init(data) {
    this.result = data?.result ?? 'lose';
    this.score = data?.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(0, 0, 'bg').setOrigin(0).setDisplaySize(width, height);

    const title = this.result === 'win' ? 'VICTORY!' : 'GAME OVER';
    const color = this.result === 'win' ? '#22c55e' : '#ef4444';

    this.add
      .text(width / 2, height / 2 - 70, title, {
        fontFamily: 'monospace',
        fontSize: '56px',
        color
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, `Score: ${this.score}`, {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 80, 'R: Restart    M: Menu', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#aaaaaa'
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('PlayScene'));

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-R', () => this.scene.start('PlayScene'));
      this.input.keyboard.once('keydown-M', () => this.scene.start('MenuScene'));
      this.input.keyboard.once('keydown-ESC', () => this.scene.start('MenuScene'));
    }
  }
}

export { BootScene, MenuScene, PlayScene, EndScene };
