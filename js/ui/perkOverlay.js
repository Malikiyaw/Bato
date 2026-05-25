// js/ui/perkOverlay.js – renders perk icons with cooldown masks and tooltips
var BATO = window.BATO || {};

BATO.PerkOverlay = class {
  constructor(scene) {
    this.scene = scene;
    this.iconSize = 24;
    this.icons = [];
    this.cooldowns = [];
    this.createIcons();
    // Listen for perk activation to update UI
    scene.events.on('perk-activated', this.updateIcons, this);
    // Update each frame for cooldown overlay scaling
    scene.events.on('update', this.updateIcons, this);
  }

  createIcons() {
    const startX = this.scene.scale.width - 200;
    const y = 10;
    for (let i = 0; i < 3; i++) {
      const bg = this.scene.add.rectangle(startX + i * (this.iconSize + 4), y, this.iconSize, this.iconSize, 0x444444)
        .setOrigin(0, 0)
        .setDepth(200);
      const icon = this.scene.add.image(bg.x + this.iconSize / 2, bg.y + this.iconSize / 2, 'placeholder')
        .setDisplaySize(this.iconSize, this.iconSize)
        .setDepth(201);
      const cdOverlay = this.scene.add.rectangle(bg.x, bg.y, this.iconSize, this.iconSize, 0x000000, 0.6)
        .setOrigin(0, 0)
        .setDepth(202)
        .setVisible(false);
      this.icons.push(icon);
      this.cooldowns.push(cdOverlay);
    }
    this.updateIcons();
  }

  updateIcons() {
    const activeSlots = BATO.Perks.activeSlots || [];
    for (let i = 0; i < 3; i++) {
      const perk = activeSlots[i];
      const icon = this.icons[i];
      const cd = this.cooldowns[i];
      if (perk) {
        // Load perk icon texture if not already loaded
        if (!this.scene.textures.exists(perk.id)) {
          this.scene.load.image(perk.id, perk.icon);
          this.scene.load.once('complete', () => {
            icon.setTexture(perk.id);
          });
          this.scene.load.start();
        } else {
          icon.setTexture(perk.id);
        }
        if (BATO.Perks.isOnCooldown(perk.id)) {
          cd.setVisible(true);
          const remaining = BATO.Perks.getCooldownRemaining(perk.id) / perk.cooldown;
          cd.setScale(1, remaining);
        } else {
          cd.setVisible(false);
        }
      } else {
        icon.setTexture('placeholder');
        cd.setVisible(false);
      }
    }
  }
};
