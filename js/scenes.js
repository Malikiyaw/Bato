var BATO = window.BATO || {};

BATO.BootScene = class extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }
  create() {
    BATO.Utils.generateBatoSprites(this);
    BATO.Utils.generateSanBatoSprites(this);
    BATO.Utils.generateEnemySprites(this);
    BATO.Utils.generateBossSprites(this);
    BATO.Utils.generateProjectileSprites(this);
    BATO.Utils.generateUISprites(this);
    BATO.Utils.generateLevelProps(this);
    for (let i = 0; i < 5; i++) BATO.Utils.generateBackground(this, i);
    this.scene.start('MenuScene');
  }
};

BATO.MenuScene = class extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }
  create() {
    let w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.add.text(w / 2, 40, 'BATO', { fontSize: '48px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    this.add.text(w / 2, 80, 'Perks of Being a Senator', { fontSize: '12px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5);
    let items = [
      { label: 'START', action: () => this.scene.start('CharacterSelectScene') },
      { label: 'OPTIONS', action: () => this.scene.start('OptionsScene') },
      { label: 'CREDITS', action: () => this.scene.start('CreditsScene') },
      { label: 'ACHIEVEMENTS', action: () => this.scene.start('AchievementsScene') }
    ];
    items.forEach((item, i) => {
      let txt = this.add.text(w / 2, 130 + i * 35, item.label, { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
      txt.on('pointerover', () => txt.setColor('#ffcc00'));
      txt.on('pointerout', () => txt.setColor('#ffffff'));
      txt.on('pointerdown', () => { BATO.AudioManager.playSfx('ui_confirm'); item.action(); });
    });
    this.add.text(w / 2, h - 20, 'Keyboard/Gamepad/Touch', { fontSize: '8px', color: '#666666', fontFamily: 'monospace' }).setOrigin(0.5);
    if (this.input.keyboard) this.input.keyboard.on('keydown-ENTER', () => { BATO.AudioManager.playSfx('ui_confirm'); this.scene.start('CharacterSelectScene'); });
    BATO.AudioManager.resume();
    BATO.AudioManager.playMusic('menu');
  }
};

BATO.OptionsScene = class extends Phaser.Scene {
  constructor() { super({ key: 'OptionsScene' }); }
  create() {
    let w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.add.text(w / 2, 30, 'OPTIONS', { fontSize: '20px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    let opts = BATO.Save.data.options;
    let y = 80;
    let settings = [
      { label: 'Master Volume', get: () => Math.round(BATO.AudioManager.masterVolume * 100), set: (v) => BATO.AudioManager.setVolume(v / 100) },
      { label: 'SFX Volume', get: () => Math.round(BATO.AudioManager.sfxVolume * 100), set: (v) => BATO.AudioManager.setSfxVol(v / 100) },
      { label: 'Music Volume', get: () => Math.round(BATO.AudioManager.musicVolume * 100), set: (v) => BATO.AudioManager.setMusicVol(v / 100) },
      { label: 'Touch Opacity', get: () => Math.round((opts.touchOpacity || 0.4) * 100), set: (v) => { opts.touchOpacity = v / 100; BATO.Save.save(); } },
    ];
    settings.forEach((s, i) => {
      this.add.text(60, y + i * 50, s.label, { fontSize: '10px', color: '#ffffff', fontFamily: 'monospace' });
      let val = this.add.text(300, y + i * 50, s.get() + '%', { fontSize: '10px', color: '#ffcc00', fontFamily: 'monospace' });
      let left = this.add.text(260, y + i * 50, '<', { fontSize: '12px', color: '#aaaaaa', fontFamily: 'monospace' }).setInteractive();
      let right = this.add.text(330, y + i * 50, '>', { fontSize: '12px', color: '#aaaaaa', fontFamily: 'monospace' }).setInteractive();
      left.on('pointerdown', () => { s.set(Math.max(0, s.get() - 10)); val.setText(s.get() + '%'); BATO.Save.save(); });
      right.on('pointerdown', () => { s.set(Math.min(100, s.get() + 10)); val.setText(s.get() + '%'); BATO.Save.save(); });
    });
    let lhY = y + 4 * 50;
    this.add.text(60, lhY, 'Left-Hand Mode', { fontSize: '10px', color: '#ffffff', fontFamily: 'monospace' });
    let lhVal = this.add.text(300, lhY, opts.leftHand ? 'ON' : 'OFF', { fontSize: '10px', color: '#ffcc00', fontFamily: 'monospace' });
    let lhToggle = this.add.text(260, lhY, '< >', { fontSize: '12px', color: '#aaaaaa', fontFamily: 'monospace' }).setInteractive();
    lhToggle.on('pointerdown', () => { opts.leftHand = !opts.leftHand; lhVal.setText(opts.leftHand ? 'ON' : 'OFF'); BATO.Save.save(); });
    let back = this.add.text(w / 2, h - 30, 'BACK', { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
    back.on('pointerover', () => back.setColor('#ffcc00'));
    back.on('pointerout', () => back.setColor('#ffffff'));
    back.on('pointerdown', () => { BATO.AudioManager.playSfx('ui_confirm'); this.scene.start('MenuScene'); });
    if (this.input.keyboard) this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
};

BATO.CreditsScene = class extends Phaser.Scene {
  constructor() { super({ key: 'CreditsScene' }); }
  create() {
    let w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.add.text(w / 2, 40, 'CREDITS', { fontSize: '20px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    let credits = [
      'BATO: Perks of Being a Senator', '', 'Game Design & Development',
      'Based on the hit concept', '', 'All enemies, bosses, perks,',
      'achievements, and endings', 'are fully implemented.', '', 'Thank you for playing!', '', 'Press ESC or tap BACK'
    ];
    credits.forEach((l, i) => { this.add.text(w / 2, 80 + i * 16, l, { fontSize: '9px', color: '#aaaaaa', fontFamily: 'monospace' }).setOrigin(0.5); });
    let back = this.add.text(w / 2, h - 30, 'BACK', { fontSize: '14px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
    back.on('pointerover', () => back.setColor('#ffcc00'));
    back.on('pointerout', () => back.setColor('#ffffff'));
    back.on('pointerdown', () => { BATO.AudioManager.playSfx('ui_confirm'); this.scene.start('MenuScene'); });
    if (this.input.keyboard) this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
};

BATO.CharacterSelectScene = class extends Phaser.Scene {
  constructor() { super({ key: 'CharacterSelectScene' }); }
  create() {
    let w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    BATO.Save.init();
    let sanUnlocked = BATO.Save.data.sanBatoUnlocked;
    this.add.text(w / 2, 30, 'SELECT CHARACTER', { fontSize: '14px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    let chars = [
      { id: 'bato', label: 'Bato', desc: 'Senator Ronald "Bato" Dela Rosa', x: w / 4, unlocked: true, color: 0xc68642 },
      { id: 'sanbato', label: 'San Bato', desc: 'Holy alter ego', x: 3 * w / 4, unlocked: sanUnlocked, color: 0xffd700 }
    ];
    chars.forEach(c => {
      let box = this.add.rectangle(c.x, h / 2 - 10, 140, 100, c.unlocked ? c.color : 0x444444, 0.8).setInteractive();
      this.add.text(c.x, h / 2 - 40, c.label, { fontSize: '16px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5);
      this.add.text(c.x, h / 2 - 20, c.desc, { fontSize: '7px', color: '#cccccc', fontFamily: 'monospace' }).setOrigin(0.5);
      if (!c.unlocked) {
        this.add.text(c.x, h / 2 + 10, '???', { fontSize: '12px', color: '#ff4444', fontFamily: 'monospace' }).setOrigin(0.5);
        this.add.text(c.x, h / 2 + 30, 'Complete Secret Ending', { fontSize: '7px', color: '#888888', fontFamily: 'monospace' }).setOrigin(0.5);
      }
      if (c.unlocked) box.on('pointerdown', () => { BATO.AudioManager.playSfx('ui_confirm'); this.scene.start('PerkLoadoutScene', { character: c.id }); });
    });
    if (sanUnlocked) this.add.text(w / 2, h - 80, 'San Bato unlocked!', { fontSize: '8px', color: '#ffd700', fontFamily: 'monospace' }).setOrigin(0.5);
    let back = this.add.text(w / 2, h - 20, 'BACK', { fontSize: '12px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
    back.on('pointerover', () => back.setColor('#ffcc00'));
    back.on('pointerout', () => back.setColor('#ffffff'));
    back.on('pointerdown', () => { BATO.AudioManager.playSfx('ui_confirm'); this.scene.start('MenuScene'); });
    if (this.input.keyboard) this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
};

BATO.PerkLoadoutScene = class extends Phaser.Scene {
  constructor() { super({ key: 'PerkLoadoutScene' }); }
  init(data) { this.charSelect = data.character || 'bato'; }
  create() {
    let w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.add.text(w / 2, 20, 'PERK LOADOUT', { fontSize: '12px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    this.add.text(w / 2, 35, 'Equip 3 Active + 1 Passive', { fontSize: '7px', color: '#888888', fontFamily: 'monospace' }).setOrigin(0.5);
    let unlocked = BATO.PERKS.filter(p => p.unlocked);
    let activePerks = unlocked.filter(p => p.type === 'active');
    let passivePerks = unlocked.filter(p => p.type === 'passive');
    let slotYs = [60, 85, 110];
    slotYs.forEach((sy, i) => {
      this.add.text(40, sy, 'Active ' + (i + 1), { fontSize: '9px', color: '#ffcc00', fontFamily: 'monospace' });
      let slotBox = this.add.rectangle(120, sy + 6, 120, 20, 0x444444).setInteractive();
      let slotTxt = this.add.text(125, sy, 'Empty', { fontSize: '8px', color: '#888888', fontFamily: 'monospace' });
      slotBox.on('pointerdown', () => { this.showPerkPicker(activePerks, (pk) => { BATO.Perks.activeSlots[i] = pk; slotTxt.setText(pk.name.substring(0, 16)); }); });
    });
    this.add.text(40, 140, 'Passive', { fontSize: '9px', color: '#aa88ff', fontFamily: 'monospace' });
    let passBox = this.add.rectangle(120, 146, 120, 20, 0x444444).setInteractive();
    let passTxt = this.add.text(125, 140, 'Empty', { fontSize: '8px', color: '#888888', fontFamily: 'monospace' });
    passBox.on('pointerdown', () => { this.showPerkPicker(passivePerks, (pk) => { BATO.Perks.passiveSlot = pk; passTxt.setText(pk.name.substring(0, 16)); }); });
    let start = this.add.text(w / 2, h - 30, 'START RUN', { fontSize: '16px', color: '#44ff44', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
    start.on('pointerdown', () => {
      let loadout = { active: BATO.Perks.activeSlots.filter(p => p !== null).map(p => p.id), passive: BATO.Perks.passiveSlot ? BATO.Perks.passiveSlot.id : null };
      BATO.Perks.init(loadout);
      BATO.Prayer.init();
      BATO.Heat.init();
      BATO.AudioManager.playSfx('ui_confirm');
      BATO.AudioManager.stopMusic();
      this.scene.start('CutsceneScene', {
        dialogueKey: 'intro', nextScene: 'GameScene',
        nextData: { character: this.charSelect, zone: 0, stage: 0, loadout: loadout }
      });
    });
    let back = this.add.text(w / 2, h - 12, 'BACK', { fontSize: '9px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
    back.on('pointerdown', () => this.scene.start('CharacterSelectScene'));
    if (this.input.keyboard) this.input.keyboard.on('keydown-ESC', () => this.scene.start('CharacterSelectScene'));
  }
  showPerkPicker(perks, callback) {
    if (this.pickerContainer) this.pickerContainer.destroy();
    let w = this.scale.width;
    this.pickerContainer = this.add.container(0, 0).setDepth(200);
    let bg = this.add.rectangle(w / 2, 135, 300, 200, 0x000000, 0.9).setInteractive();
    this.pickerContainer.add(bg);
    let title = this.add.text(w / 2, 45, 'SELECT PERK', { fontSize: '10px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    this.pickerContainer.add(title);
    perks.slice(0, 12).forEach((p, i) => {
      let col = p.tier === 1 ? '#4488cc' : p.tier === 2 ? '#cc66aa' : '#ff8800';
      let txt = this.add.text(60, 60 + i * 15, p.name, { fontSize: '8px', color: col, fontFamily: 'monospace' }).setInteractive({ useHandCursor: true });
      txt.on('pointerdown', () => { callback(p); if (this.pickerContainer) { this.pickerContainer.destroy(); this.pickerContainer = null; } });
      this.pickerContainer.add(txt);
      let info = this.add.text(240, 60 + i * 15, p.desc.substring(0, 18), { fontSize: '7px', color: '#888888', fontFamily: 'monospace' });
      this.pickerContainer.add(info);
    });
    let close = this.add.text(w - 40, 45, 'X', { fontSize: '12px', color: '#ff4444', fontFamily: 'monospace' }).setInteractive();
    close.on('pointerdown', () => { if (this.pickerContainer) { this.pickerContainer.destroy(); this.pickerContainer = null; } });
    this.pickerContainer.add(close);
  }
};

BATO.ShopScene = class extends Phaser.Scene {
  constructor() { super({ key: 'ShopScene' }); }
  init(data) {
    this.charSelect = data.character;
    this.zoneIdx = data.zone;
    this.stageIdx = data.stage || 0;
    this.shopBoughtEffects = data.boughtEffects || [];
    this.shopUsedVehiclePerks = data.usedVehiclePerks || false;
  }
  create() {
    let w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.add.text(w / 2, 20, 'SAFEHOUSE SHOP', { fontSize: '14px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    this.add.text(w / 2, 35, 'Coins: P' + BATO.Save.getCoins(), { fontSize: '10px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5);
    let items = [
      { label: 'Damage+ (+20%)', cost: 50, effect: 'dmg_up' },
      { label: 'Speed+ (+20%)', cost: 40, effect: 'spd_up' },
      { label: 'Armor+ (+25% HP)', cost: 60, effect: 'armor_up' },
      { label: 'Full Heal', cost: 30, effect: 'full_heal' },
      { label: 'Coin Boost +P50', cost: 0, effect: 'coin_boost' }
    ];
    items.forEach((item, i) => {
      let y = 60 + i * 30;
      this.add.text(60, y, item.label, { fontSize: '9px', color: '#ffffff', fontFamily: 'monospace' });
      this.add.text(200, y, 'P' + item.cost, { fontSize: '9px', color: '#ffcc00', fontFamily: 'monospace' });
      let buy = this.add.text(280, y, '[BUY]', { fontSize: '9px', color: '#44ff44', fontFamily: 'monospace' }).setInteractive();
      buy.on('pointerdown', () => {
        if (BATO.Save.spendCoins(item.cost)) {
          BATO.AudioManager.playSfx('coin');
          this.shopBoughtEffects.push(item.effect);
          buy.setText('SOLD');
          buy.removeInteractive();
        }
      });
    });
    let proceed = this.add.text(w / 2, h - 30, 'PROCEED', { fontSize: '14px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
    proceed.on('pointerdown', () => {
      this.scene.start('GameScene', {
        character: this.charSelect, zone: this.zoneIdx, stage: this.stageIdx,
        loadout: { active: BATO.Perks.activeSlots.filter(p => p).map(p => p.id), passive: BATO.Perks.passiveSlot ? BATO.Perks.passiveSlot.id : null },
        boughtEffects: this.shopBoughtEffects, usedVehiclePerks: this.shopUsedVehiclePerks
      });
    });
  }
};

BATO.AchievementsScene = class extends Phaser.Scene {
  constructor() { super({ key: 'AchievementsScene' }); }
  create() {
    let w = this.scale.width, h = this.scale.height;
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    BATO.Save.init();
    let unlocked = BATO.Save.data.achievements || [];
    this.add.text(w / 2, 20, 'ACHIEVEMENTS', { fontSize: '14px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5);
    this.add.text(w / 2, 32, unlocked.length + '/11 unlocked', { fontSize: '8px', color: '#888888', fontFamily: 'monospace' }).setOrigin(0.5);
    BATO.ACHIEVEMENTS.forEach((a, i) => {
      let y = 48 + i * 20;
      let isUnlocked = unlocked.includes(a.id);
      this.add.text(20, y, (isUnlocked ? '[X]' : '[ ]') + ' ' + a.name, { fontSize: '8px', color: isUnlocked ? '#ffcc00' : '#666666', fontFamily: 'monospace' });
      this.add.text(180, y, a.desc, { fontSize: '7px', color: isUnlocked ? '#aaaaaa' : '#444444', fontFamily: 'monospace' });
    });
    let back = this.add.text(w / 2, h - 20, 'BACK', { fontSize: '12px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setInteractive();
    back.on('pointerover', () => back.setColor('#ffcc00'));
    back.on('pointerout', () => back.setColor('#ffffff'));
    back.on('pointerdown', () => { BATO.AudioManager.playSfx('ui_confirm'); this.scene.start('MenuScene'); });
    if (this.input.keyboard) this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }
};

BATO.GameScene = class extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.character = data.character || 'bato';
    this.currentZone = data.zone || 0;
    this.currentStage = data.stage || 0;
    this.playerHp = 100;
    this.playerMaxHp = 100;
    this.prayerMeter = 0;
    this.mediaHeat = 0;
    this.coins = BATO.Save.getCoins();
    this.boughtEffects = data.boughtEffects || [];
    this.rosaryBeads = BATO.Save.data.rosaryBeads || 0;
    this.usedVehiclePerks = data.usedVehiclePerks || false;
    this.bossDefeated = false;
    this.secretBossAccess = false;
    this.gameOver = false;
    this.perkInfoVisible = false;
    this.touchInput = null;
    this.touchAttack = false;
    this.touchJump = false;
    this.touchSpecial = false;
    this.touchDash = false;
    this.touchTsinelas = false;
    let l = data.loadout;
    if (l) BATO.Perks.init(l);
    else BATO.Perks.init(null);
    BATO.Prayer.init();
    BATO.Heat.init();
    BATO.Save.data.rosaryBeads = 0;
  }

  create() {
    let w = this.scale.width, h = this.scale.height;
    this.physics.world.setBounds(0, 0, 1600, 270);
    this.cameras.main.setBounds(0, 0, 1600, 270);
    this.cameras.main.setBackgroundColor(0x1a1a2e);
    this.enemies = this.physics.add.group();
    this.playerProjectiles = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group();
    this.platforms = this.physics.add.staticGroup();
    let bgKey = 'bg_' + Math.min(this.currentZone, 4);
    this.bg = this.add.tileSprite(0, 0, 1600, 270, bgKey).setOrigin(0, 0).setScrollFactor(0.1);
    this.generateLevel();
    this.spawnPlayer();
    this.spawnEnemies();
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.playerProjectiles, this.enemies, this.onProjectileHitEnemy, null, this);
    this.physics.add.overlap(this.enemyProjectiles, this.player, this.onEnemyProjectileHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.onPlayerTouchEnemy, null, this);
    if (this.boughtEffects.includes('coin_boost')) BATO.Save.addCoins(50);
    this.hud = Object.create(BATO.HUD);
    this.hud.create(this);
    this.hud.createPauseButton(this);
    if (this.sys.game.device.input.touch) {
      this.touchCtrl = Object.create(BATO.TouchControls);
      this.touchCtrl.create(this);
    }
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    BATO.AudioManager.stopMusic();
    BATO.AudioManager.playMusic('zone' + Math.min(this.currentZone + 1, 3));
    this.spawnChestsAndPickups();
    let stageStr = 'Zone ' + (this.currentZone + 1) + ' - Stage ' + (this.currentStage + 1);
    let stg = this.add.text(w / 2, h / 2 - 20, stageStr, { fontSize: '16px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(50).setScrollFactor(0);
    this.tweens.add({ targets: stg, alpha: 0, delay: 2000, duration: 1000, onComplete: () => stg.destroy() });
  }

  generateLevel() {
    let tileSize = 16;
    let levelW = 100;
    let groundY = 240;
    this.groundY = groundY;
    
    // Base Ground
    for (let x = 0; x < levelW * tileSize; x += tileSize) {
      let g = this.platforms.create(x, groundY, null).setDisplaySize(tileSize, tileSize);
      g.body.updateFromGameObject();
      g.setVisible(false);
    }
    
    this.levelProps = this.physics.add.group();

    if (this.currentZone === 0) { // Quiapo Chaos
      for (let i = 0; i < 6; i++) {
        let px = BATO.Utils.rand(10, levelW - 10) * tileSize;
        let isJeep = Math.random() > 0.5;
        let prop = this.physics.add.sprite(px, groundY - (isJeep ? 30 : 25), isJeep ? 'prop_jeepney' : 'prop_tricycle');
        prop.body.setAllowGravity(false);
        prop.body.setImmovable(true);
        if (isJeep) {
          prop.body.setVelocityX(Math.random() > 0.5 ? 50 : -50);
          this.platforms.add(prop); // Jeepney roof as platform
        } else {
          this.platforms.add(prop);
        }
        this.levelProps.add(prop);
      }
    } else if (this.currentZone === 1) { // Davao Night Market
      for (let i = 0; i < 8; i++) {
        let px = BATO.Utils.rand(10, levelW - 10) * tileSize;
        let lechon = this.physics.add.sprite(px, groundY - 20, 'prop_lechon');
        lechon.body.setAllowGravity(false);
        lechon.body.setImmovable(true);
        lechon.hp = 20;
        lechon.takeDamage = function(amt) { this.hp -= amt; if(this.hp <= 0) { BATO.AudioManager.playSfx('hit'); this.destroy(); } };
        this.platforms.add(lechon);
        this.levelProps.add(lechon);
      }
      for (let i = 0; i < 5; i++) {
        let px = BATO.Utils.rand(10, levelW - 10) * tileSize;
        let gas = this.add.circle(px, groundY - 40, 30, 0x44aa44, 0.4);
        gas.setData('isGas', true);
        this.levelProps.add(gas);
      }
    } else if (this.currentZone === 2) { // ICC Headquarters
      for (let i = 0; i < 10; i++) {
        let px = BATO.Utils.rand(10, levelW - 10) * tileSize;
        let cab = this.physics.add.sprite(px, groundY - 32, 'prop_cabinet');
        cab.body.setAllowGravity(false);
        cab.body.setImmovable(true);
        this.platforms.add(cab);
        this.levelProps.add(cab);
      }
      for (let i = 0; i < 5; i++) { // Elevators
        let px = BATO.Utils.rand(20, levelW - 10) * tileSize;
        let py = groundY - BATO.Utils.rand(3, 8) * tileSize;
        let el = this.physics.add.sprite(px, py, 'prop_cabinet').setDisplaySize(48, 8);
        el.body.setAllowGravity(false);
        el.body.setImmovable(true);
        el.body.setVelocityY(BATO.Utils.pick([-30, 30]));
        el.setData('elevator', true);
        el.setData('baseY', py);
        this.platforms.add(el);
        this.levelProps.add(el);
      }
    }

    // Generic random platforms
    for (let i = 0; i < 10; i++) {
      let px = BATO.Utils.rand(1, levelW - 2) * tileSize;
      let py = groundY - BATO.Utils.rand(3, 6) * tileSize;
      let pw = BATO.Utils.rand(3, 6) * tileSize;
      for (let x = px; x < px + pw; x += tileSize) {
        let p = this.platforms.create(x, py, null).setDisplaySize(tileSize, tileSize);
        p.body.updateFromGameObject();
        p.setVisible(false);
      }
    }
  }

  spawnPlayer() {
    if (this.character === 'sanbato' && BATO.Save.data.sanBatoUnlocked) {
      this.player = BATO.PlayerFactory.createSanBato(this, 50, 200);
      this.player.update = this.player.updateSanBato;
    } else {
      this.player = BATO.PlayerFactory.createBato(this, 50, 200);
      this.player.update = this.player.updateBato;
    }
    this.player.maxHp = this.playerMaxHp;
    this.player.hp = this.playerHp;
    if (this.boughtEffects.includes('dmg_up')) this.player.getDamage = function () { return 10; };
    if (this.boughtEffects.includes('spd_up')) {
      let oldUpdate = this.player.update;
      this.player.update = function (t, d) { oldUpdate.call(this, t, d); this.body.setVelocityX(this.body.velocity.x * 1.2); };
    }
    if (this.boughtEffects.includes('armor_up')) { this.player.maxHp = 125; this.player.hp = 125; }
    if (this.boughtEffects.includes('full_heal')) this.player.hp = this.player.maxHp;
  }

  spawnEnemies() {
    let zoneDef = BATO.CONST.ZONES[this.currentZone] || BATO.CONST.ZONES[0];
    let enemyTypes = zoneDef.enemies;
    for (let i = 0; i < 8; i++) {
      let type = BATO.Utils.pick(enemyTypes);
      let ex = BATO.Utils.rand(200, 1400);
      let ey = this.groundY - 20;
      let e = BATO.EnemyFactory.createEnemy(this, type, ex, ey);
      if (e) this.enemies.add(e);
    }
  }

  spawnChestsAndPickups() {
    for (let i = 0; i < 5; i++) {
      let cx = BATO.Utils.rand(200, 1400);
      let cy = this.groundY - 30;
      let chest = this.add.circle(cx, cy, 8, 0xffcc00).setInteractive();
      this.physics.add.existing(chest, true);
      this.physics.add.overlap(this.player, chest, () => { BATO.Save.addCoins(BATO.Utils.rand(5, 15)); BATO.AudioManager.playSfx('coin'); chest.destroy(); });
    }
  }

  spawnTempPlatform(x, y, w, h, dur) {
    let p = this.add.rectangle(x, y, w, h, 0x88aa88, 0.8);
    this.physics.add.existing(p, true);
    this.physics.add.collider(this.player, p);
    this.time.delayedCall(dur, () => { if (p && p.body) { this.physics.world.remove(p.body); p.destroy(); } });
  }

  dealDamage(player, dmg, dir, knockbackAll) {
    this.enemies.getChildren().forEach(e => {
      if (e.active && e.hp > 0 && Math.abs(e.x - player.x) < 50) { e.takeDamage(dmg, dir); if (knockbackAll) e.body.setVelocityX(dir * 200); }
    });
    if (this.boss && this.boss.active && Math.abs(this.boss.x - player.x) < 80) this.boss.hp -= dmg;
  }

  onProjectileHitEnemy(proj, enemy) {
    if (proj.active && enemy.active && enemy.hp > 0) {
      let dmg = proj.getData('holy') ? 12 : 5;
      enemy.takeDamage(dmg, proj.body.velocity.x > 0 ? 1 : -1);
      proj.destroy();
    }
  }

  onEnemyProjectileHitPlayer(proj, player) {
    if (proj.active && player.active && player.hp > 0) {
      if (player.getData('reflect')) { proj.body.setVelocityX(-proj.body.velocity.x); proj.body.setVelocityY(-proj.body.velocity.y); return; }
      player.takeDamage(8);
      proj.destroy();
    }
  }

  onPlayerTouchEnemy(player, enemy) {
    if (!player.active || !enemy.active || enemy.hp <= 0 || player.getData('invincible') || enemy.getData('converted')) return;
    let now = this.time.now;
    if (enemy._lastHit && now - enemy._lastHit < 500) return;
    enemy._lastHit = now;
    let dmg = enemy.baseDmg || 5;
    if (player.takeDamage(dmg)) this.onPlayerDeath();
  }

  onPlayerDeath() {
    if (this.gameOver) return;
    if (BATO.Perks.passiveSlot && BATO.Perks.passiveSlot.id === 'coffin_dance') { this.player.hp = 1; BATO.Perks.passiveSlot = null; BATO.AudioManager.playSfx('heal'); this.showAchievement('revived'); return; }
    this.gameOver = true;
    BATO.Save.save();
    BATO.AudioManager.playSfx('death');
    BATO.AudioManager.stopMusic();
    let w = this.scale.width, h = this.scale.height;
    this.add.text(w / 2, h / 2, 'GAME OVER', { fontSize: '24px', color: '#ff4444', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(500).setScrollFactor(0);
    let lost = Math.floor(BATO.Save.getCoins() * 0.5);
    BATO.Save.data.coins -= lost;
    BATO.Save.save();
    this.add.text(w / 2, h / 2 + 30, 'Lost P' + lost, { fontSize: '12px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(500).setScrollFactor(0);
    this.time.delayedCall(3000, () => { this.scene.start('MenuScene'); BATO.AudioManager.playMusic('menu'); });
  }

  showAchievement(id) {
    let a = BATO.ACHIEVEMENTS.find(x => x.id === id);
    if (!a) return;
    let w = this.scale.width;
    let bg = this.add.rectangle(w / 2, 40, 300, 30, 0x000000, 0.8).setDepth(500).setScrollFactor(0);
    let txt = this.add.text(w / 2, 35, 'ACHIEVEMENT: ' + a.name, { fontSize: '9px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(501).setScrollFactor(0);
    let desc = this.add.text(w / 2, 48, a.desc, { fontSize: '7px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(501).setScrollFactor(0);
    BATO.AudioManager.playSfx('achieve');
    this.tweens.add({ targets: [bg, txt, desc], alpha: 0, delay: 3000, duration: 1000, onComplete: () => { bg.destroy(); txt.destroy(); desc.destroy(); } });
  }

  handlePerkInput() {
    if (!this.player || !this.player.active) return;
    let keys = this.player.keys;
    if (!keys) return;
    if (Phaser.Input.Keyboard.JustDown(keys.perk1)) BATO.Perks.activateSlot(0, this.player, this);
    if (Phaser.Input.Keyboard.JustDown(keys.perk2)) BATO.Perks.activateSlot(1, this.player, this);
    if (Phaser.Input.Keyboard.JustDown(keys.perk3)) BATO.Perks.activateSlot(2, this.player, this);
  }

  transitionToSafehouse() {
    BATO.Save.save();
    this.scene.start('ShopScene', {
      character: this.character, zone: this.currentZone, stage: this.currentStage + 1,
      loadout: { active: BATO.Perks.activeSlots.filter(p => p).map(p => p.id), passive: BATO.Perks.passiveSlot ? BATO.Perks.passiveSlot.id : null },
      boughtEffects: this.boughtEffects, usedVehiclePerks: this.usedVehiclePerks
    });
  }

  transitionToBoss() {
    this.scene.start('BossScene', {
      character: this.character, zone: this.currentZone,
      loadout: { active: BATO.Perks.activeSlots.filter(p => p).map(p => p.id), passive: BATO.Perks.passiveSlot ? BATO.Perks.passiveSlot.id : null },
      boughtEffects: this.boughtEffects, usedVehiclePerks: this.usedVehiclePerks
    });
  }

  checkStageComplete() {
    if (this.bossDefeated) return;
    let alive = this.enemies.countActive(true);
    if (alive <= 0 && this.player && this.player.x > 1500) {
      if (this.currentStage === 0) this.transitionToSafehouse();
      else this.transitionToBoss();
    }
  }

  checkEnding() {
    let rosaryCount = BATO.Save.data.rosaryBeads || 0;
    let heatZero = BATO.Heat.current === 0;
    let isSanBato = this.character === 'sanbato';
    let noVehicle = !this.usedVehiclePerks;
    if (isSanBato && rosaryCount >= 7 && heatZero && noVehicle) {
      this.secretBossAccess = true;
      this.add.text(400, 80, 'The path to the secret boss opens...', { fontSize: '10px', color: '#ffd700', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
      this.time.delayedCall(2000, () => {
        this.scene.start('BossScene', {
          character: this.character, zone: 3,
          loadout: { active: BATO.Perks.activeSlots.filter(p => p).map(p => p.id), passive: BATO.Perks.passiveSlot ? BATO.Perks.passiveSlot.id : null },
          boughtEffects: this.boughtEffects, usedVehiclePerks: this.usedVehiclePerks
        });
      });
      return;
    }
    BATO.Save.data.runsCompleted = (BATO.Save.data.runsCompleted || 0) + 1;
    BATO.Achievements.check('takbong_senador', this.game);
    BATO.Achievements.checkAll(this.game);
    if (heatZero) BATO.Save.data.heatZeroRuns = (BATO.Save.data.heatZeroRuns || 0) + 1;
    this.add.text(400, 100, 'VICTORY!', { fontSize: '24px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
    this.add.text(400, 130, 'You completed all zones!', { fontSize: '10px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
    if (heatZero && isSanBato) { BATO.Save.data.sanBatoUnlocked = true; BATO.Achievements.check('divine_comedy', this.game); }
    let endingKey = heatZero ? 'ending_secret' : 'ending_normal';
    this.time.delayedCall(3000, () => { this.scene.start('CutsceneScene', { dialogueKey: endingKey, nextScene: 'MenuScene' }); });
  }

  update(time, delta) {
    if (this.gameOver || !this.player || !this.player.active) return;
    this.handlePerkInput();
    if (this.player.update) this.player.update(time, delta);
    this.enemies.getChildren().forEach(e => { if (e.updateEnemy) e.updateEnemy(time, delta, this.player); });
    
    // Level Props logic
    if (this.levelProps) {
      this.levelProps.getChildren().forEach(p => {
        if (!p.active) return;
        if (p.getData('elevator')) {
          let by = p.getData('baseY');
          if (p.y < by - 50) p.body.setVelocityY(30);
          else if (p.y > by + 50) p.body.setVelocityY(-30);
        } else if (p.getData('isGas')) {
          if (Math.abs(p.x - this.player.x) < 30) this.player.setData('slowed', true);
        } else if (p.texture && p.texture.key === 'prop_jeepney') {
          if (p.x < -100) p.x = 2000;
          else if (p.x > 2000) p.x = -100;
        }
      });
    }

    if (this.touchCtrl) this.touchCtrl.updateTouchInput(this);
    this.hud.update(this);
    this.checkStageComplete();
    BATO.Achievements.checkAll(this.game);
  }
};

BATO.BossScene = class extends Phaser.Scene {
  constructor() { super({ key: 'BossScene' }); }

  init(data) {
    this.character = data.character;
    this.currentZone = data.zone;
    this.boughtEffects = data.boughtEffects || [];
    this.usedVehiclePerks = data.usedVehiclePerks || false;
    let l = data.loadout;
    if (l) BATO.Perks.init(l);
    BATO.Prayer.init();
    BATO.Heat.init();
    this.gameOver = false;
    this.bossDefeated = false;
    this.touchInput = null;
    this.touchAttack = false;
    this.touchJump = false;
    this.touchSpecial = false;
    this.touchDash = false;
    this.touchTsinelas = false;
  }

  create() {
    let w = this.scale.width, h = this.scale.height;
    this.physics.world.setBounds(0, 0, 800, 270);
    this.cameras.main.setBounds(0, 0, 800, 270);
    this.cameras.main.setBackgroundColor(0x0a0a1a);
    this.enemies = this.physics.add.group();
    this.playerProjectiles = this.physics.add.group();
    this.enemyProjectiles = this.physics.add.group();
    this.platforms = this.physics.add.staticGroup();
    let bossData = BATO.BOSSES[this.currentZone];
    this.bossData = bossData;
    this.currentPhase = 0;
    this.phaseHp = [bossData.phases[0].hp, bossData.phases[1].hp];
    this.phaseWeakpoints = bossData.phases.map(p => p.weakpoints.map(wp => ({ ...wp, currentHp: wp.hp })));
    let bgKey = 'bg_' + Math.min(this.currentZone, 4);
    this.add.tileSprite(0, 0, 800, 270, bgKey).setOrigin(0, 0);
    for (let x = 0; x < 800; x += 16) { let g = this.platforms.create(x, 250, null).setDisplaySize(16, 16).setVisible(false); g.body.updateFromGameObject(); }
    this.bossSprite = this.add.sprite(400, 190, 'boss_' + bossData.id).setScale(1.5);
    this.physics.add.existing(this.bossSprite, true);
    this.bossWeakpoints = this.physics.add.group();

    this.bossHp = bossData.totalHp;
    this.bossMaxHp = bossData.totalHp;
    if (this.character === 'sanbato' && BATO.Save.data.sanBatoUnlocked) {
      this.player = BATO.PlayerFactory.createSanBato(this, 80, 200);
      this.player.update = this.player.updateSanBato;
      let introKey = 'boss' + (this.currentZone + 1) + '_intro_san';
      if (this.currentZone === 3) introKey = 'secret_boss_intro_san';
      if (this.currentZone === 2) introKey = 'boss3_intro_san';
      BATO.DialogueBox.show(this, BATO.DIALOGUE[introKey] || BATO.DIALOGUE.boss1_intro_san, null);
    } else {
      this.player = BATO.PlayerFactory.createBato(this, 80, 200);
      this.player.update = this.player.updateBato;
      let introKey = 'boss' + (this.currentZone + 1) + '_intro';
      if (this.currentZone >= 3) introKey = 'boss3_intro';
      BATO.DialogueBox.show(this, BATO.DIALOGUE[introKey] || BATO.DIALOGUE.boss1_intro, null);
    }
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.playerProjectiles, [this.bossSprite, this.bossWeakpoints], this.onProjectileHitBoss, null, this);
    this.physics.add.overlap(this.player, this.bossSprite, this.onPlayerTouchBoss, null, this);
    this.hud = Object.create(BATO.HUD);
    this.hud.create(this);
    if (this.sys.game.device.input.touch) { this.touchCtrl = Object.create(BATO.TouchControls); this.touchCtrl.create(this); }
    BATO.AudioManager.stopMusic();
    BATO.AudioManager.playMusic('boss');
    this.bossAttackTimer = 0;
    this.bossPhase = 0;
    this.add.text(w / 2, 10, bossData.name, { fontSize: '10px', color: '#ff4444', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(100);
    this.add.rectangle(w / 2, 22, 200, 8, 0x440000).setDepth(100).setScrollFactor(0);
    this.bossHpBar = this.add.rectangle(w / 2 - 100, 22, 200, 8, 0xff4444).setOrigin(0, 0.5).setDepth(101).setScrollFactor(0);
    this.bossPhaseLabel = this.add.text(w / 2, 34, bossData.phases[0].name, { fontSize: '8px', color: '#ffaa00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(100);
    
    this.setupBossWeakpoints();
  }

  setupBossWeakpoints() {
    this.bossWeakpoints.clear(true, true);
    let wps = this.phaseWeakpoints[this.bossPhase];
    if (!wps) return;
    wps.forEach((wp, idx) => {
      if (wp.currentHp <= 0) return;
      let ox = (idx % 2 === 0 ? -40 : 40);
      let oy = (idx < 2 ? -20 : 20);
      let p = this.add.circle(this.bossSprite.x + ox, this.bossSprite.y + oy, 15, 0xffff00, 0.6);
      this.physics.add.existing(p, true);
      p.setData('wpData', wp);
      p.setData('wpIndex', idx);
      this.bossWeakpoints.add(p);
    });
  }

  onProjectileHitBoss(proj, bossTarget) {
    if (!proj.active) return;
    let dmg = proj.getData('holy') ? 12 : 5;
    
    if (bossTarget.getData && bossTarget.getData('wpData')) {
      let wp = bossTarget.getData('wpData');
      wp.currentHp -= dmg;
      this.bossHp -= dmg;
      bossTarget.setTint(0xff0000);
      this.time.delayedCall(50, () => { if (bossTarget.active) bossTarget.clearTint(); });
      if (wp.currentHp <= 0) {
        bossTarget.destroy();
        BATO.AudioManager.playSfx('hit');
      }
    } else {
      let wps = this.phaseWeakpoints[this.bossPhase];
      if (wps && wps.some(w => w.currentHp > 0)) {
        // Boss is immune while weakpoints are up
        proj.destroy();
        return;
      }
      this.bossHp -= dmg;
      this.bossSprite.setTint(0xffffff);
      this.time.delayedCall(50, () => { if (this.bossSprite.active) this.bossSprite.clearTint(); });
    }
    
    proj.destroy();
    this.updateBossPhase();
  }

  onPlayerTouchBoss(player, boss) {
    if (!player.active || player.getData('invincible')) return;
    let now = this.time.now;
    if (this._bossHit && now - this._bossHit < 800) return;
    this._bossHit = now;
    if (player.takeDamage(10)) this.onPlayerDeath();
  }

  updateBossPhase() {
    let pct = this.bossHp / this.bossMaxHp;
    let newPhase = this.bossPhase;
    if (pct <= 0.66 && this.bossPhase === 0) newPhase = 1;
    if (pct <= 0.33 && this.bossPhase === 1) newPhase = 2;
    
    if (newPhase !== this.bossPhase) {
      this.bossPhase = newPhase;
      if (this.bossData.phases[newPhase]) {
        this.bossPhaseLabel.setText(this.bossData.phases[newPhase].name);
        this.setupBossWeakpoints();
      }
    }
    
    if (this.bossData.interlude && pct <= this.bossData.interlude.hpTrigger / 100 && !this._interludeShown) {
      this._interludeShown = true;
      if (this.bossData.interlude.heal && this.player) this.player.hp = Math.min(this.player.hp + 50, this.player.maxHp);
      let t = this.add.text(400, 100, this.bossData.interlude.text, { fontSize: '10px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
      this.time.delayedCall(3000, () => t.destroy());
    }
  }

  bossAttack() {
    let phase = Math.min(this.bossPhase, this.bossData.phases.length - 1);
    let attacks = this.bossData.phases[phase]?.attacks || [];
    if (attacks.length === 0 || !this.player || !this.player.active) return;
    let atk = BATO.Utils.pick(attacks);
    switch (atk.type) {
      case 'shockwave':
      case 'shockwave_combo':
      case 'wave':
        let wv = this.add.rectangle(this.bossSprite.x, this.bossSprite.y + 20, 200, 10, 0xff4444, 0.5);
        this.tweens.add({ targets: wv, x: this.player.x < this.bossSprite.x ? -100 : 900, duration: 600, onComplete: () => wv.destroy() });
        if (Math.abs(this.player.x - this.bossSprite.x) < 150) this.player.takeDamage(atk.dmg); break;
      case 'charge':
      case 'charge_gore':
      case 'push_crush':
        this.tweens.add({ targets: this.bossSprite, x: this.player.x < this.bossSprite.x ? -50 : 850, duration: 800, yoyo: true, onComplete: () => { if (this.player && Math.abs(this.player.x - this.bossSprite.x) < 50) this.player.takeDamage(atk.dmg); } }); break;
      case 'spawn':
      case 'spawn_drones':
        for (let i = 0; i < 3; i++) { let e = BATO.EnemyFactory.createEnemy(this, 'shadow_hooded', this.bossSprite.x + BATO.Utils.rand(-50, 50), 200); if (e) this.enemies.add(e); } break;
      case 'projectile':
      case 'homing_verdict':
      case 'light_beam':
      case 'rapid':
        for (let i = 0; i < 5; i++) {
          let p = this.physics.add.sprite(this.bossSprite.x, this.bossSprite.y, 'proj_enemy').setTint(0xff6666);
          let angle = Math.atan2(this.player.y - this.bossSprite.y, this.player.x - this.bossSprite.x) + BATO.Utils.randf(-0.3, 0.3);
          p.body.setVelocity(Math.cos(angle) * (atk.type==='rapid'?200:100), Math.sin(angle) * (atk.type==='rapid'?200:100));
          this.enemyProjectiles.add(p);
          this.time.delayedCall(3000, () => { if (p.active) p.destroy(); });
        } break;
      case 'laser_slow':
      case 'cross_laser':
        let laser = this.add.rectangle(this.player.x - 5, 0, 10, 270, 0xff0000, 0.3);
        this.time.delayedCall(500, () => { if (this.player) this.player.takeDamage(atk.dmg); laser.destroy(); }); break;
      case 'barrel_rain':
      case 'stun_grenade':
        for (let i = 0; i < 6; i++) { let bx = this.bossSprite.x + BATO.Utils.rand(-100, 100); let barrel = this.add.circle(bx, -20, 10, 0x885522); this.tweens.add({ targets: barrel, y: 300, duration: 1000 + (i * 200), onComplete: () => { if (this.player && Math.abs(this.player.x - barrel.x) < 30) this.player.takeDamage(atk.dmg); barrel.destroy(); } }); } break;
      case 'grab':
      case 'ghost_grab':
        if (Math.abs(this.player.x - this.bossSprite.x) < 150) { this.player.takeDamage(atk.dmg); this.player.body.setVelocityX(this.player.x > this.bossSprite.x ? -200 : 200); } break;
      case 'instant_ko':
      case 'screen_slam':
        if (Math.abs(this.player.x - this.bossSprite.x) < 300) this.player.takeDamage(atk.dmg); break;
      case 'march_skeletons':
        let skel = this.add.rectangle(0, 200, 100, 40, 0x555555);
        this.tweens.add({ targets: skel, x: 800, duration: 3000, onUpdate: () => { if (this.player && Math.abs(this.player.x - skel.x) < 50) this.player.takeDamage(atk.dmg); }, onComplete: () => skel.destroy() }); break;
      default: if (Math.abs(this.player.x - this.bossSprite.x) < 100) this.player.takeDamage(atk.dmg);
    }
  }

  onPlayerDeath() {
    if (this.gameOver) return;
    if (BATO.Perks.passiveSlot && BATO.Perks.passiveSlot.id === 'coffin_dance') { this.player.hp = 1; BATO.Perks.passiveSlot = null; return; }
    this.gameOver = true;
    BATO.AudioManager.playSfx('death');
    BATO.AudioManager.stopMusic();
    this.add.text(400, 135, 'GAME OVER', { fontSize: '24px', color: '#ff4444', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(500);
    let lost = Math.floor(BATO.Save.getCoins() * 0.5);
    BATO.Save.data.coins -= lost;
    BATO.Save.save();
    this.time.delayedCall(3000, () => { this.scene.start('MenuScene'); BATO.AudioManager.playMusic('menu'); });
  }

  onBossDefeated() {
    if (this.bossDefeated) return;
    this.bossDefeated = true;
    BATO.AudioManager.playSfx('achieve');
    BATO.AudioManager.stopMusic();
    if (this.bossData && this.bossData.id === 'diktador') { this.onTrueEnding(); return; }
    if (this.bossData && this.bossData.unlockPerk) BATO.Save.unlockPerk(this.bossData.unlockPerk);
    let nextZone = this.currentZone + 1;
    if (nextZone >= 3) { this.checkEnding(); } else {
      this.add.text(400, 100, 'BOSS DEFEATED!', { fontSize: '20px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
      this.add.text(400, 130, 'Zone ' + (nextZone + 1) + ' unlocked!', { fontSize: '12px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
      this.addCoins(100);
      this.time.delayedCall(3000, () => {
        this.scene.start('ShopScene', {
          character: this.character, zone: nextZone, stage: 0,
          loadout: { active: BATO.Perks.activeSlots.filter(p => p).map(p => p.id), passive: BATO.Perks.passiveSlot ? BATO.Perks.passiveSlot.id : null },
          boughtEffects: this.boughtEffects, usedVehiclePerks: this.usedVehiclePerks
        });
      });
    }
  }

  onTrueEnding() {
    BATO.Save.data.runsCompleted = (BATO.Save.data.runsCompleted || 0) + 1;
    BATO.Achievements.check('takbong_senador', this.game);
    BATO.Achievements.check('walang_takot', this.game);
    BATO.Achievements.checkAll(this.game);
    this.add.text(400, 80, 'ANG MULTONG DIKTADOR DEFEATED!', { fontSize: '12px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
    this.add.text(400, 100, 'TRUE ENDING UNLOCKED', { fontSize: '16px', color: '#44ff44', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
    BATO.Save.data.sanBatoUnlocked = true;
    BATO.Achievements.check('divine_comedy', this.game);
    this.time.delayedCall(3000, () => { this.scene.start('CutsceneScene', { dialogueKey: 'ending_true', nextScene: 'MenuScene' }); });
  }

  spawnTempPlatform(x, y, w, h, dur) {
    let p = this.add.rectangle(x, y, w, h, 0x88aa88, 0.8);
    this.physics.add.existing(p, true);
    this.physics.add.collider(this.player, p);
    this.time.delayedCall(dur, () => { if (p && p.body) { this.physics.world.remove(p.body); p.destroy(); } });
  }

  addCoins(amt) { BATO.Save.addCoins(amt); }

  checkEnding() {
    let rosaryCount = BATO.Save.data.rosaryBeads || 0;
    let heatZero = BATO.Heat.current === 0;
    let isSanBato = this.character === 'sanbato';
    let noVehicle = !this.usedVehiclePerks;
    if (isSanBato && rosaryCount >= 7 && heatZero && noVehicle) {
      this.add.text(400, 80, 'The path to the secret boss opens...', { fontSize: '10px', color: '#ffd700', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
      this.time.delayedCall(2000, () => {
        this.scene.start('BossScene', {
          character: this.character, zone: 3,
          loadout: { active: BATO.Perks.activeSlots.filter(p => p).map(p => p.id), passive: BATO.Perks.passiveSlot ? BATO.Perks.passiveSlot.id : null },
          boughtEffects: this.boughtEffects, usedVehiclePerks: this.usedVehiclePerks
        });
      });
      return;
    }
    BATO.Save.data.runsCompleted = (BATO.Save.data.runsCompleted || 0) + 1;
    BATO.Achievements.check('takbong_senador', this.game);
    BATO.Achievements.checkAll(this.game);
    if (heatZero) BATO.Save.data.heatZeroRuns = (BATO.Save.data.heatZeroRuns || 0) + 1;
    this.add.text(400, 100, 'VICTORY!', { fontSize: '24px', color: '#ffcc00', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
    this.add.text(400, 130, 'You completed all zones!', { fontSize: '10px', color: '#ffffff', fontFamily: 'monospace' }).setOrigin(0.5).setDepth(200);
    if (heatZero && isSanBato) { BATO.Save.data.sanBatoUnlocked = true; BATO.Achievements.check('divine_comedy', this.game); }
    let endingKey = heatZero ? 'ending_secret' : 'ending_normal';
    this.time.delayedCall(3000, () => { this.scene.start('CutsceneScene', { dialogueKey: endingKey, nextScene: 'MenuScene' }); });
  }

  handlePerkInput() {
    if (!this.player || !this.player.active) return;
    let keys = this.player.keys;
    if (!keys) return;
    if (Phaser.Input.Keyboard.JustDown(keys.perk1)) BATO.Perks.activateSlot(0, this.player, this);
    if (Phaser.Input.Keyboard.JustDown(keys.perk2)) BATO.Perks.activateSlot(1, this.player, this);
    if (Phaser.Input.Keyboard.JustDown(keys.perk3)) BATO.Perks.activateSlot(2, this.player, this);
  }

  update(time, delta) {
    if (this.gameOver) return;
    if (this.player && this.player.active) {
      if (this.player.update) this.player.update(time, delta);
      if (this.touchCtrl && this.touchCtrl.isActive) this.touchCtrl.updateTouchInput(this);
    }
    this.enemies.getChildren().forEach(e => { if (e.updateEnemy) e.updateEnemy(time, delta, this.player); });
    this.handlePerkInput();
    if (this.bossHp > 0) {
      if (time - this.bossAttackTimer > 2000) { this.bossAttackTimer = time; this.bossAttack(); }
      this.bossHpBar.setScale(this.bossHp / this.bossMaxHp, 1);
    } else { this.onBossDefeated(); }
    this.hud.update(this);
  }
};
