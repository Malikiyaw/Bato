import Phaser from 'phaser';

/**
 * Generate simple placeholder textures so the game can run without external art files.
 * This runs fast and works in both dev and build outputs.
 */
export function createRuntimeTextures(scene) {
  const ensure = (key, drawFn, w, h) => {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    drawFn(g);
    g.generateTexture(key, w, h);
    g.destroy();
  };

  // 1x1 pixel to scale as background
  ensure(
    'bg',
    (g) => {
      g.fillStyle(0x111111, 1);
      g.fillRect(0, 0, 1, 1);
    },
    1,
    1
  );

  ensure(
    'player',
    (g) => {
      g.fillStyle(0x4da3ff, 1);
      g.fillRoundedRect(2, 2, 28, 44, 6);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(12, 16, 3);
      g.fillCircle(20, 16, 3);
    },
    32,
    48
  );

  ensure(
    'enemy',
    (g) => {
      g.fillStyle(0xff4d4d, 1);
      g.fillRoundedRect(2, 2, 28, 28, 6);
      g.fillStyle(0x000000, 0.25);
      g.fillRect(8, 10, 16, 4);
    },
    32,
    32
  );

  ensure(
    'boss',
    (g) => {
      g.fillStyle(0xa855f7, 1);
      g.fillRoundedRect(2, 2, 92, 60, 10);
      g.fillStyle(0x000000, 0.2);
      g.fillRect(10, 14, 76, 10);
    },
    96,
    64
  );
}

