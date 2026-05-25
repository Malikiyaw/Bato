// HUD system for Bato game
// Displays health (Longanisa segments), prayer meter, media heat, coin counter, zone label

class HUD {
  constructor(scene) {
    this.scene = scene;
    // Health bar using 10 segments
    this.healthSegments = [];
    const startX = 20;
    const startY = 20;
    const segWidth = 12;
    const segHeight = 24;
    for (let i = 0; i < 10; i++) {
      const seg = this.scene.add.rectangle(startX + i * (segWidth + 2), startY, segWidth, segHeight, 0xff0000).setOrigin(0, 0.5);
      this.healthSegments.push(seg);
    }
    // Prayer meter (simple bar)
    this.prayerBar = this.scene.add.rectangle(20, 50, 120, 12, 0x0088ff).setOrigin(0, 0.5);
    // Media heat (bar)
    this.mediaBar = this.scene.add.rectangle(20, 70, 120, 12, 0xff8800).setOrigin(0, 0.5);
    // Coin counter (text)
    this.coinText = this.scene.add.text(20, 90, 'Coins: 0', {fontFamily: 'Arial', fontSize: '14px', color: '#fff'});
    // Zone label
    this.zoneText = this.scene.add.text(this.scene.cameras.main.width - 150, 20, 'Zone: 1', {fontFamily: 'Arial', fontSize: '16px', color: '#fff'}).setOrigin(1, 0.5);
  }

  updateHealth(current, max) {
    const percent = Phaser.Math.Clamp(current / max, 0, 1);
    const filled = Math.round(percent * this.healthSegments.length);
    for (let i = 0; i < this.healthSegments.length; i++) {
      this.healthSegments[i].setFillStyle(i < filled ? 0xff0000 : 0x555555);
    }
  }

  updatePrayer(value) {
    this.prayerBar.scaleX = Phaser.Math.Clamp(value / 100, 0, 1);
  }

  updateMediaHeat(value) {
    this.mediaBar.scaleX = Phaser.Math.Clamp(value / 100, 0, 1);
  }

  updateCoins(count) {
    this.coinText.setText('Coins: ' + count);
  }

  updateZone(zone) {
    this.zoneText.setText('Zone: ' + zone);
  }
}

// Export for module use
if (typeof module !== 'undefined') { module.exports = HUD; }
