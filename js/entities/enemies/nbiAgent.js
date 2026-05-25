// js/entities/enemies/nbiAgent.js – NBI Plainclothes Agent enemy
import EnemyBase from './enemyBase.js';

export default class NBIAgent extends EnemyBase {
  constructor(scene, x, y) {
    super(scene, x, y, 'nbi_agent', {
      health: 2,
      speed: 70,
      damage: 1,
    });
    // load the sprite (placeholder generated earlier)
    this.setTexture('nbi_agent');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    // Could add custom behavior like throwing paper airplanes
    // Simple timer to fire a projectile
    if (!this.lastShot || time - this.lastShot > 2000) {
      this.throwPaperAirplane();
      this.lastShot = time;
    }
  }

  throwPaperAirplane() {
    const proj = this.scene.physics.add.sprite(this.x, this.y, 'paper_airplane');
    this.scene.physics.moveToObject(proj, this.scene.player, 150);
    proj.setCollideWorldBounds(true);
    proj.once('worldbounds', () => proj.destroy());
    this.scene.time.delayedCall(1000, () => proj.destroy());
    this.scene.events.emit('enemy-projectile', proj);
  }
}
