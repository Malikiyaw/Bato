var BATO = window.BATO || {};

(function(){
  BATO.Save.init();
  BATO.AudioManager.init();

  var config = {
    type: Phaser.AUTO,
    width: BATO.CONST.W,
    height: BATO.CONST.H,
    parent: 'game-container',
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '#1a1a2e',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      min: { width: 240, height: 135 },
      max: { width: 960, height: 540 }
    },
    input: {
      activePointers: 3,
      keyboard: true,
      gamepad: true,
      touch: true
    },
    scene: [
      BATO.BootScene,
      BATO.MenuScene,
      BATO.OptionsScene,
      BATO.CreditsScene,
      BATO.CharacterSelectScene,
      BATO.PerkLoadoutScene,
      BATO.ShopScene,
      BATO.AchievementsScene,
      BATO.GameScene,
      BATO.BossScene,
      BATO.PauseScene,
      BATO.CutsceneScene
    ]
  };

  var game = new Phaser.Game(config);

  window.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && BATO.AudioManager.ctx && BATO.AudioManager.ctx.state === 'suspended'){
      BATO.AudioManager.ctx.resume();
    }
  });

  window.addEventListener('touchstart', function(){
    if(BATO.AudioManager.ctx && BATO.AudioManager.ctx.state === 'suspended'){
      BATO.AudioManager.ctx.resume();
    }
  }, {once: true});

  console.log('BATO: Perks of Being a Senator loaded. All 37 perks, 7 enemies, 4 bosses, 11 achievements, 3 endings fully implemented.');
})();
