// js/data/perks.js
// Placeholder perk definitions for Bato game.
// Each perk has: id, name, description, cooldown (seconds), effect function stub.
export const perks = [
  {
    id: 1,
    name: "Divine Shield",
    description: "Grants temporary invulnerability for 2 seconds.",
    cooldown: 12,
    apply: (player) => {
      player.setTint(0x00ffff);
      player.isInvulnerable = true;
      setTimeout(() => {
        player.clearTint();
        player.isInvulnerable = false;
      }, 2000);
    }
  },
  {
    id: 2,
    name: "Prayer Burst",
    description: "Restores 3 prayer points instantly.",
    cooldown: 8,
    apply: (player) => {
      player.prayer = Math.min(player.prayer + 3, 100);
      player.scene.events.emit('player-prayer-changed', player.prayer);
    }
  },
  {
    id: 3,
    name: "Media Flash",
    description: "Reduces Media Heat by 20%.",
    cooldown: 10,
    apply: (player) => {
      player.mediaHeat = Math.max(player.mediaHeat - 20, 0);
      player.scene.events.emit('player-media-changed', player.mediaHeat);
    }
  },
  // ... 34 more perk objects can be added here ...
];
