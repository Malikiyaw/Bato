// js/perkOverlay.js – UI overlay for perks (minimal implementation)
// This file is imported for its side‑effects; it registers the class on the global BATO namespace.

// Ensure the global BATO object exists
var BATO = window.BATO || {};

/**
 * Simple PerkOverlay that displays perk icons and reacts to activation events.
 * For now it logs activations and shows placeholder icons.
 */
class PerkOverlay {
  /**
   * @param {Phaser.Scene} scene – the scene where the overlay is shown
   */
  constructor(scene) {
    this.scene = scene;
    this.icons = [];
    this._setup();
    // Listen for perk activation events from the PerkSystem
    scene.events.on('perk-activated', this._onPerkActivated, this);
  }

  _setup() {
    const perks = (BATO.Perks && BATO.Perks.getPerks && BATO.Perks.getPerks()) || [];
    const { width, height } = this.scene.scale;
    const startX = 10;
    const startY = 10;
    const spacing = 40;
    // Load icons if they are not already loaded
    perks.forEach(p => {
      if (!this.scene.textures.exists(p.icon)) {
        this.scene.load.image(p.icon, p.icon);
      }
    });
    this.scene.load.once('complete', () => {
      perks.forEach((p, i) => {
        const img = this.scene.add
          .image(startX + i * spacing, startY, p.icon)
          .setScrollFactor(0)
          .setScale(0.5)
          .setAlpha(0.5);
        this.icons.push({ id: p.id, image: img });
      });
    });
    this.scene.load.start();
  }

  _onPerkActivated(id) {
    // Highlight the corresponding icon briefly
    const entry = this.icons.find(o => o.id === id);
    if (entry) {
      entry.image.setTint(0x00ff00);
      this.scene.time.delayedCall(500, () => entry.image.clearTint());
    }
    console.log('Perk activated:', id);
  }
}

// Expose on the global BATO namespace for other modules to use
BATO.PerkOverlay = PerkOverlay;
