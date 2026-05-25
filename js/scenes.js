// scenes.js – core Phaser scenes with audio integration

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }
  preload() {
    // Load placeholder sprite and UI assets
    this.load.image("player", "https://via.placeholder.com/32x48.png?text=B");
    this.load.image("heart", "https://via.placeholder.com/16x16.png?text=H");
    // Preload all audio tracks
    BATO.AudioManager.preload(this);
  }
  create() {
    this.scene.start("MenuScene");
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }
  create() {
    const { width, height } = this.scale;
    const title = this.add.text(width / 2, height / 3, "BATO: PERKS OF BEING A SENATOR", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#fff",
    }).setOrigin(0.5);
    const startBtn = this.add.text(width / 2, height / 2, "START", {
      fontFamily: "Arial",
      fontSize: "14px",
      backgroundColor: "#444",
      padding: { x: 10, y: 5 },
      color: "#fff",
    })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .on("pointerup", () => {
        this.scene.start("PlayScene");
      });
    // Play menu music
    BATO.AudioManager.playMusicTrack("menu");
  }
}

class PlayScene extends Phaser.Scene {
  constructor() {
    super({ key: "PlayScene" });
    this.currentZone = null;
  }

  create() {
    // Player sprite and input
    this.player = this.physics.add.sprite(240, 135, "player");
    this.cursors = this.input.keyboard.createCursorKeys();
    // Initialize perk system with scene reference (player is part of scene)
    BATO.Perks.init(this);
    // Add perk UI overlay
    this.perkOverlay = new BATO.PerkOverlay(this);
    // Enemy spawner
    this.enemySpawner = new BATO.EnemySpawner(this);
    // Start zone music based on initial position
    this.updateZoneMusic();
  }

  update() {
    const speed = 150;
    this.player.setVelocity(0);
    if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
    if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
    // Check for zone changes and switch music accordingly
    this.updateZoneMusic();
  }

  updateZoneMusic() {
    // Simple x‑position based zones
    let zone;
    const x = this.player.x;
    if (x < 200) zone = "zone1";
    else if (x < 400) zone = "zone2";
    else zone = "zone3";
    if (zone !== this.currentZone) {
      BATO.AudioManager.stopMusicTrack();
      BATO.AudioManager.playMusicTrack(zone);
      this.currentZone = zone;
    }
  }
}

// Export scenes for main.js (or attach to window in plain script)
window.BootScene = BootScene;
window.MenuScene = MenuScene;
window.PlayScene = PlayScene;
