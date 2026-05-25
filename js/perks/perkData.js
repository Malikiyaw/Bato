// js/perks/perkData.js
// Perk definitions – simple placeholder effects
// Icon files are located in assets/perks/
export const PERK_DEFINITIONS = [
  {
    id: "speed_boost",
    name: "Speed Boost",
    description: "Increase player speed by 50% for 8 seconds.",
    icon: "assets/perks/speedboost_icon.png",
    cooldown: 12,
    effect: (player) => {
      const original = player.speed;
      player.speed *= 1.5;
      setTimeout(() => (player.speed = original), 8000);
    }
  },
  {
    id: "shield",
    name: "Shield",
    description: "Gain a protective shield for 6 seconds.",
    icon: "assets/perks/shield_icon.png",
    cooldown: 20,
    effect: (player) => {
      player.hasShield = true;
      setTimeout(() => (player.hasShield = false), 6000);
    }
  },
  {
    id: "double_jump",
    name: "Double Jump",
    description: "Allow a second jump while airborne for 10 seconds.",
    icon: "assets/perks/doublejump_icon.png",
    cooldown: 18,
    effect: (player) => {
      player.canDoubleJump = true;
      setTimeout(() => (player.canDoubleJump = false), 10000);
    }
  },
  {
    id: "coin_rain",
    name: "Coin Rain",
    description: "Spawn 20 coins around the player instantly.",
    icon: "assets/perks/coinrain_icon.png",
    cooldown: 25,
    effect: (player, scene) => {
      for (let i = 0; i < 20; i++) {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const dist = Phaser.Math.Between(30, 80);
        const x = player.x + Math.cos(angle) * dist;
        const y = player.y + Math.sin(angle) * dist;
        const coin = scene.physics.add.image(x, y, "coin");
        coin.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-100, -50));
        scene.time.delayedCall(3000, () => coin.destroy());
      }
    }
  },
  {
    id: "media_cooldown",
    name: "Media Cooldown",
    description: "Temporarily halve media‑heat accumulation.",
    icon: "assets/perks/media_cooldown_icon.png",
    cooldown: 20,
    effect: (player) => {
      player.mediaHeatMultiplier = 0.5;
      setTimeout(() => (player.mediaHeatMultiplier = 1), 12000);
    }
  },
  {
    id: "invincibility",
    name: "Invincibility Flash",
    description: "Become fully invulnerable for 3 seconds with a flash effect.",
    icon: "assets/perks/invincibility_icon.png",
    cooldown: 30,
    effect: (player, scene) => {
      player.isInvincible = true;
      const flash = scene.cameras.main.flash(3000, 255, 255, 255);
      setTimeout(() => (player.isInvincible = false), 3000);
    }
  },
  {
    id: "attack_boost",
    name: "Attack Boost",
    description: "Increase damage by 40% for 8 seconds.",
    icon: "assets/perks/attackboost_icon.png",
    cooldown: 22,
    effect: (player) => {
      player.damageMultiplier = 1.4;
      setTimeout(() => (player.damageMultiplier = 1), 8000);
    }
  },
  {
    id: "dash_recharge",
    name: "Dash Recharge",
    description: "Halve dash cooldown for 6 seconds.",
    icon: "assets/perks/dashrecharge_icon.png",
    cooldown: 18,
    effect: (player) => {
      player.dashCooldownMultiplier = 0.5;
      setTimeout(() => (player.dashCooldownMultiplier = 1), 6000);
    }
  },
  {
    id: "health_regen",
    name: "Health Regen",
    description: "Regenerate 1 HP per second for 6 seconds.",
    icon: "assets/perks/healthregen_icon.png",
    cooldown: 20,
    effect: (player) => {
      const interval = setInterval(() => player.heal(1), 1000);
      setTimeout(() => clearInterval(interval), 6000);
    }
  }
];
