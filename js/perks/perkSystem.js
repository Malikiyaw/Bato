var BATO = window.BATO || {};

/**
 * PerkSystem - manages perk definitions, cooldowns and activation.
 * Perks are defined in `js/perks/perkData.js` as an array of objects:
 * { id, name, description, icon, cooldown, effect }
 * Effect is a function receiving the player object.
 */
BATO.Perks = {
  _perks: [],
  _cooldowns: {},
  _player: null,

  /** Initialize with player reference and load perk data */
  init(player) {
    this._player = player;
    // Dynamically import perk data (ES module) – using script tag fallback.
    const data = BATO.PerkData || [];
    this._perks = data.map(p => Object.assign({ active: false }, p));
    // Initialize cooldowns
    this._perks.forEach(p => { this._cooldowns[p.id] = 0; });
  },

  /** Returns the list of perk definitions */
  getPerks() {
    return this._perks;
  },

  /** Checks if a perk is on cooldown */
  isOnCooldown(id) {
    const now = Date.now();
    return now < this._cooldowns[id];
  },

  /** Activate a perk by id */
  activate(id) {
    const perk = this._perks.find(p => p.id === id);
    if (!perk) { console.warn('Perk not found:', id); return; }
    if (this.isOnCooldown(id)) { console.warn('Perk on cooldown:', id); return; }
    // Execute effect – effect receives player and BATO utilities
    try {
      perk.effect && perk.effect(this._player, BATO);
    } catch (e) { console.error('Perk effect error:', e); }
    // Set cooldown timestamp
    this._cooldowns[id] = Date.now() + perk.cooldown * 1000;
    // Emit event for UI update
    if (this._player && this._player.scene) {
      this._player.scene.events.emit('perk-activated', id);
    }
  }
};
