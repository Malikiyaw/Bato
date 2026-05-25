var BATO = window.BATO || {};

BATO.HUD = {
  container: null, hpBar: null, prayerBar: null, heatBar: null,
  coinText: null, zoneText: null, perkIcons: [], pauseBtn: null,

  create(scene){
    let w = scene.scale.width, h = scene.scale.height;
    this.container = scene.add.container(0, 0).setDepth(100).setScrollFactor(0);

    let bg = scene.add.rectangle(0, 0, w, 28, 0x000000, 0.7).setOrigin(0,0);
    this.container.add(bg);

    this.hpBar = scene.add.rectangle(10, 10, 80, 10, 0xff4444).setOrigin(0,0.5);
    this.container.add(this.hpBar);
    let hpBg = scene.add.rectangle(10, 10, 80, 10, 0x440000).setOrigin(0,0.5);
    this.container.addAt(hpBg, 0);
    let hpLabel = scene.add.text(10, 4, 'HP', {fontSize:'8px',color:'#ffffff',fontFamily:'monospace'});
    this.container.add(hpLabel);
    this.hpSegments = [];
    for(let i=0;i<10;i++){
      let seg = scene.add.rectangle(10+i*8, 10, 6, 10, 0xff4444).setOrigin(0,0.5);
      this.hpSegments.push(seg);
      this.container.add(seg);
    }

    this.prayerBar = scene.add.rectangle(100, 10, 60, 8, 0xffcc00).setOrigin(0,0.5);
    this.container.add(this.prayerBar);
    let prBg = scene.add.rectangle(100, 10, 60, 8, 0x443300).setOrigin(0,0.5);
    this.container.addAt(prBg, 0);
    let prLabel = scene.add.text(100, 4, 'Prayer', {fontSize:'7px',color:'#ffffff',fontFamily:'monospace'});
    this.container.add(prLabel);

    this.heatBar = scene.add.rectangle(170, 10, 60, 8, 0xff6600).setOrigin(0,0.5);
    this.container.add(this.heatBar);
    let htBg = scene.add.rectangle(170, 10, 60, 8, 0x441100).setOrigin(0,0.5);
    this.container.addAt(htBg, 0);
    let htLabel = scene.add.text(170, 4, 'Heat', {fontSize:'7px',color:'#ffffff',fontFamily:'monospace'});
    this.container.add(htLabel);

    this.coinText = scene.add.text(240, 5, 'P0', {fontSize:'10px',color:'#ffcc00',fontFamily:'monospace'});
    this.container.add(this.coinText);
    let coinIcon = scene.add.circle(234, 10, 4, 0xffcc00);
    this.container.add(coinIcon);

    this.zoneText = scene.add.text(w-10, 5, 'Zone 1-1', {fontSize:'10px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(1,0);
    this.container.add(this.zoneText);

    this.perkIcons = [];
    for(let i=0;i<3;i++){
      let icon = scene.add.rectangle(280+i*28, 10, 24, 20, 0x444444).setOrigin(0,0.5);
      this.perkIcons.push(icon);
      this.container.add(icon);
      let keyLabel = scene.add.text(280+i*28+2, 14, (i+1)+'', {fontSize:'7px',color:'#aaa',fontFamily:'monospace'});
      this.container.add(keyLabel);
    }

    this.cooldownOverlays = [];
    for(let i=0;i<3;i++){
      let cd = scene.add.rectangle(280+i*28, 10, 24, 20, 0x000000, 0.6).setOrigin(0,0.5).setVisible(false);
      this.cooldownOverlays.push(cd);
      this.container.add(cd);
    }

    if(scene.input.keyboard){
      scene.input.keyboard.on('keydown-ESC',()=>{
        scene.scene.launch('PauseScene',{gameScene:scene});
        scene.scene.pause();
      });
      scene.input.keyboard.on('keydown-TAB',()=>{
        if(!scene.perkInfoVisible){
          scene.perkInfoVisible = true;
          this.showPerkInfo(scene);
        } else {
          scene.perkInfoVisible = false;
          if(this.perkInfoContainer) this.perkInfoContainer.destroy();
        }
      });
    }
  },

  update(scene){
    if(!scene.player || !scene.player.active){
      this.hpSegments.forEach(s=>s.setFillStyle(0x444444));
      return;
    }
    let p = scene.player;
    let hpRatio = p.hp/p.maxHp;
    this.hpSegments.forEach((seg,i)=>{
      seg.setFillStyle(i/10 < hpRatio ? 0xff4444 : 0x333333);
    });
    this.prayerBar.setScale(BATO.Prayer.current/BATO.Prayer.max, 1);
    this.heatBar.setScale(BATO.Heat.current/BATO.Heat.max, 1);
    this.coinText.setText('P'+BATO.Save.getCoins());
    this.zoneText.setText(scene.currentZone!==undefined?'Zone '+(scene.currentZone+1)+'-'+(scene.currentStage+1):'');
    for(let i=0;i<3;i++){
      let pDef = BATO.Perks.activeSlots[i];
      if(pDef){
        let col = pDef.tier===1?0x4488cc:pDef.tier===2?0xcc66aa:0xff8800;
        this.perkIcons[i].setFillStyle(col);
        if(BATO.Perks.isOnCooldown(pDef.id)){
          this.cooldownOverlays[i].setVisible(true);
          let remain = BATO.Perks.getCooldownRemaining(pDef.id)/1000;
          let pct = remain/(pDef.cd||1);
          this.cooldownOverlays[i].setScale(1, pct);
        } else {
          this.cooldownOverlays[i].setVisible(false);
        }
      } else {
        this.perkIcons[i].setFillStyle(0x333333);
      }
    }
  },

  showPerkInfo(scene){
    if(this.perkInfoContainer) this.perkInfoContainer.destroy();
    this.perkInfoContainer = scene.add.container(0, 0).setDepth(200).setScrollFactor(0);
    let bg = scene.add.rectangle(160, 100, 300, 80, 0x000000, 0.85).setOrigin(0,0);
    this.perkInfoContainer.add(bg);
    let y=105;
    for(let i=0;i<3;i++){
      let p=BATO.Perks.activeSlots[i];
      if(p){
        let txt = scene.add.text(170, y, (i+1)+': '+p.name+' - '+p.desc, {fontSize:'8px',color:'#ffffff',fontFamily:'monospace'});
        this.perkInfoContainer.add(txt);
        y+=15;
      }
    }
    if(BATO.Perks.passiveSlot){
      let p=BATO.Perks.passiveSlot;
      let txt = scene.add.text(170, y, 'P: '+p.name+' - '+p.desc, {fontSize:'8px',color:'#aaaaaa',fontFamily:'monospace'});
      this.perkInfoContainer.add(txt);
    }
    let close = scene.add.text(410, 105, '[X]', {fontSize:'10px',color:'#ff4444',fontFamily:'monospace'}).setInteractive();
    close.on('pointerdown',()=>{if(this.perkInfoContainer){this.perkInfoContainer.destroy();scene.perkInfoVisible=false;}});
    this.perkInfoContainer.add(close);
  },

  createPauseButton(scene){
    this.pauseBtn = scene.add.circle(scene.scale.width-16, 16, 14, 0x000000, 0.5).setDepth(100).setScrollFactor(0).setInteractive();
    let p = scene.add.text(scene.scale.width-20, 10, '| |', {fontSize:'10px',color:'#ffffff',fontFamily:'monospace'}).setDepth(101).setScrollFactor(0);
    this.pauseBtn.on('pointerdown',()=>{
      scene.scene.launch('PauseScene',{gameScene:scene});
      scene.scene.pause();
    });
  },

  destroy(){ if(this.container) this.container.destroy(); }
};

BATO.TouchControls = {
  container: null, dpad: null, btns: {},
  isActive: false,

  create(scene){
    if(!scene.sys.game.device.input.touch) { this.isActive=false; return; }
    this.isActive = true;
    let w = scene.scale.width, h = scene.scale.height;
    this.container = scene.add.container(0, 0).setDepth(200).setScrollFactor(0);

    let opts = BATO.Save.data.options;
    let alpha = opts.touchOpacity || 0.4;
    let leftHand = opts.leftHand || false;

    let dpx = leftHand ? w-150 : 60;
    let dpy = h-120;
    this.dpad = scene.add.circle(dpx, dpy, 50, 0xffffff, alpha*0.5).setInteractive();
    this.container.add(this.dpad);

    let btnDefs = [
      {id:'attack',label:'ATK',x:leftHand?60:w-60,y:h-50,color:0xff4444,size:28},
      {id:'jump',label:'JUMP',x:leftHand?120:w-110,y:h-70,color:0x4488ff,size:24},
      {id:'special',label:'SPC',x:leftHand?60:w-60,y:h-100,color:0xaa44ff,size:24},
      {id:'dash',label:'DASH',x:leftHand?110:w-105,y:h-40,color:0x44ff44,size:24},
      {id:'tsinelas',label:'T',x:leftHand?150:w-150,y:h-80,color:0xff8800,size:20}
    ];

    btnDefs.forEach(def=>{
      let btn = scene.add.circle(def.x, def.y, def.size, def.color, alpha).setInteractive();
      this.btns[def.id] = btn;
      this.container.add(btn);
      let lbl = scene.add.text(def.x-6, def.y-5, def.label, {fontSize:'8px',color:'#ffffff',fontFamily:'monospace'});
      this.container.add(lbl);
    });

    let perkX = leftHand ? 10 : w-130;
    for(let i=0;i<3;i++){
      let pk = scene.add.rectangle(perkX+i*42, 30, 38, 22, 0x444444, alpha+0.2).setInteractive();
      pk.setData('slot',i);
      this.btns['perk'+(i+1)] = pk;
      this.container.add(pk);
      let lbl = scene.add.text(perkX+i*42+6, 24, (i+1)+'', {fontSize:'9px',color:'#fff',fontFamily:'monospace'});
      this.container.add(lbl);
    }

    let pauseBtn = scene.add.circle(leftHand?w-20:20, 20, 16, 0x000000, 0.5).setInteractive();
    pauseBtn.on('pointerdown',()=>{scene.scene.launch('PauseScene',{gameScene:scene}); scene.scene.pause();});
    this.btns['pause'] = pauseBtn;
    this.container.add(pauseBtn);
    let pp = scene.add.text((leftHand?w-20:20)-6, 14, '| |', {fontSize:'10px',color:'#fff',fontFamily:'monospace'});
    this.container.add(pp);

    this.setupTouchEvents(scene);
  },

  setupTouchEvents(scene){
    let opts = BATO.Save.data.options;
    let leftHand = opts ? opts.leftHand : false;
    let dpx = leftHand ? scene.scale.width-150 : 60;
    let dpy = scene.scale.height-120;

    this.dpad.on('pointermove',(p)=>{
      let dx = p.x-dpx, dy = p.y-dpy;
      let adx = Math.abs(dx), ady = Math.abs(dy);
      if(adx<10 && ady<10) return;
      scene.touchInput = {dirX:dx>0?1:-1, dirY:dy>0?1:-1};
    });
    this.dpad.on('pointerup',()=>{ scene.touchInput = null; });
    this.dpad.on('pointerout',()=>{ scene.touchInput = null; });

    this.btns['attack'].on('pointerdown',()=>{ scene.touchAttack = true; });
    this.btns['attack'].on('pointerup',()=>{ scene.touchAttack = false; });
    this.btns['jump'].on('pointerdown',()=>{ scene.touchJump = true; });
    this.btns['jump'].on('pointerup',()=>{ scene.touchJump = false; });
    this.btns['special'].on('pointerdown',()=>{ scene.touchSpecial = true; });
    this.btns['special'].on('pointerup',()=>{ scene.touchSpecial = false; });
    this.btns['dash'].on('pointerdown',()=>{ scene.touchDash = true; });
    this.btns['dash'].on('pointerup',()=>{ scene.touchDash = false; });
    this.btns['tsinelas'].on('pointerdown',()=>{ scene.touchTsinelas = true; });
    this.btns['tsinelas'].on('pointerup',()=>{ scene.touchTsinelas = false; });

    for(let i=0;i<3;i++){
      this.btns['perk'+(i+1)].on('pointerdown',()=>{
        BATO.Perks.activateSlot(i, scene.player, scene);
      });
    }
  },

  updateTouchInput(scene){
    if(!this.isActive) return;
    if(scene.touchInput){
      let vx=0;
      if(scene.touchInput.dirX>0) vx=120;
      else if(scene.touchInput.dirX<0) vx=-120;
      if(scene.player && scene.player.active) scene.player.body.setVelocityX(vx);
    }
    if(scene.touchAttack && scene.player && scene.player.active && scene.player.attackTimer<=0){
      scene.player.attackTimer=300;
      scene.player.comboCount=(scene.player.comboCount+1)%3;
      scene.dealDamage(scene.player, scene.player.getDamage(), scene.player.facingRight?1:-1);
      BATO.AudioManager.playSfx('hit');
      BATO.Save.data.totalPunches++;
    }
    if(scene.touchJump && scene.player && scene.player.active && (scene.player.body.blocked.down||scene.player.body.touching.down)){
      scene.player.body.setVelocityY(BATO.CONST.JUMP_VEL);
      BATO.AudioManager.playSfx('jump');
      scene.touchJump=false;
    }
    if(scene.touchSpecial && scene.player && scene.player.active && BATO.Prayer.current>=30){
      BATO.Prayer.use(30);
      scene.dealDamage(scene.player, 15, 0, true);
      let wave = scene.add.circle(scene.player.x, scene.player.y, 60, 0xffffff, 0.3);
      scene.tweens.add({targets:wave,scaleX:3,scaleY:3,alpha:0,duration:500,onComplete:()=>wave.destroy()});
      scene.touchSpecial=false;
    }
    if(scene.touchTsinelas && scene.player && scene.player.active){
      if(scene.player.attackTimer<=0){
        scene.player.attackTimer=400;
        let dir=scene.player.facingRight?1:-1;
        let s=scene.physics.add.sprite(scene.player.x+dir*16, scene.player.y, 'proj_slipper');
        s.body.setVelocityX(dir*300); s.body.setGravityY(400);
        scene.playerProjectiles.add(s);
        scene.time.delayedCall(1500,()=>{if(s.active) s.destroy();});
      }
      scene.touchTsinelas=false;
    }
  },

  destroy(){ if(this.container) this.container.destroy(); }
};

BATO.DialogueBox = {
  container:null, currentLines:[],
  lineIdx:0, callback:null, isActive:false,

  show(scene, lines, callback){
    if(this.isActive) return;
    this.isActive = true;
    this.currentLines = lines;
    this.lineIdx = 0;
    this.callback = callback || null;
    this.container = scene.add.container(0,0).setDepth(300).setScrollFactor(0);

    let bg = scene.add.rectangle(40, scene.scale.height-80, 400, 60, 0x000000, 0.85).setOrigin(0,0);
    this.container.add(bg);

    let speaker = scene.add.text(50, scene.scale.height-75, '', {fontSize:'9px',color:'#ffcc00',fontFamily:'monospace',fontWeight:'bold'});
    this.container.add(speaker);

    let text = scene.add.text(50, scene.scale.height-62, '', {fontSize:'9px',color:'#ffffff',fontFamily:'monospace',wordWrap:{width:380}});
    this.container.add(text);

    this.speakerText = speaker;
    this.dialogueText = text;

    let advance = scene.add.text(390, scene.scale.height-30, '[TAP]', {fontSize:'8px',color:'#888888',fontFamily:'monospace'});
    this.container.add(advance);

    this.showLine();

    if(scene.input.keyboard){
      scene.input.keyboard.once('keydown-SPACE',()=>this.advance(scene));
      scene.input.keyboard.once('keydown-ENTER',()=>this.advance(scene));
    }
    this.container.setInteractive(new Phaser.Geom.Rectangle(40,scene.scale.height-80,400,60), Phaser.Geom.Rectangle.Contains);
    this.container.on('pointerdown',()=>this.advance(scene));
  },

  showLine(){
    if(this.lineIdx>=this.currentLines.length) return;
    let line = this.currentLines[this.lineIdx];
    if(line){
      this.speakerText.setText(line.speaker+':');
      this.dialogueText.setText(line.text);
    }
  },

  advance(scene){
    this.lineIdx++;
    if(this.lineIdx>=this.currentLines.length){
      this.hide();
      if(this.callback) this.callback();
    } else {
      this.showLine();
    }
  },

  hide(){
    if(this.container){
      this.container.destroy();
      this.container = null;
    }
    this.isActive = false;
  }
};

BATO.PauseScene = {
  key:'PauseScene',

  init(data){
    this.gameScene = data.gameScene;
  },

  create(){
    let w=this.scale.width, h=this.scale.height;
    let bg = this.add.rectangle(w/2, h/2, w, h, 0x000000, 0.7);
    let title = this.add.text(w/2, 60, 'PAUSED', {fontSize:'24px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5);

    let items = ['Resume','Perk Info','Quit to Menu'];
    let actions = [
      ()=>{
        this.scene.resume('GameScene');
        this.scene.stop();
      },
      ()=>{
        let gs = this.scene.get('GameScene');
        if(gs && gs.hud) gs.hud.showPerkInfo(gs);
        this.scene.resume('GameScene');
        this.scene.stop();
      },
      ()=>{
        this.scene.stop('GameScene');
        this.scene.stop();
        this.scene.start('MenuScene');
        BATO.AudioManager.stopMusic();
        BATO.AudioManager.playMusic('menu');
      }
    ];

    items.forEach((item,i)=>{
      let txt = this.add.text(w/2, 130+i*40, item, {fontSize:'14px',color:i===0?'#ffcc00':'#ffffff',fontFamily:'monospace'}).setOrigin(0.5).setInteractive();
      txt.on('pointerover',()=>txt.setColor('#ffcc00'));
      txt.on('pointerout',()=>txt.setColor(i===0?'#ffcc00':'#ffffff'));
      txt.on('pointerdown',()=>actions[i]());
    });

    if(this.input.keyboard){
      this.input.keyboard.on('keydown-ESC',()=>{
        this.scene.resume('GameScene');
        this.scene.stop();
      });
    }
  }
};

BATO.CutsceneScene = {
  key:'CutsceneScene',

  init(data){
    this.dialogueKey = data.dialogueKey;
    this.nextScene = data.nextScene;
    this.nextData = data.nextData;
    this.bgColor = data.bgColor || 0x000000;
  },

  create(){
    this.cameras.main.setBackgroundColor(this.bgColor);
    let w=this.scale.width, h=this.scale.height;

    this.add.text(w/2, 30, 'BATO: Perks of Being a Senator', {fontSize:'12px',color:'#ffcc00',fontFamily:'monospace'}).setOrigin(0.5);

    let lines = null;
    if(this.dialogueKey === 'intro') lines = BATO.DIALOGUE.intro;
    else if(this.dialogueKey === 'boss1_intro') lines = BATO.DIALOGUE.boss1_intro;
    else if(this.dialogueKey === 'boss1_intro_san') lines = BATO.DIALOGUE.boss1_intro_san;
    else if(this.dialogueKey === 'boss2_intro') lines = BATO.DIALOGUE.boss2_intro;
    else if(this.dialogueKey === 'boss3_intro') lines = BATO.DIALOGUE.boss3_intro;
    else if(this.dialogueKey === 'ending_normal') lines = BATO.DIALOGUE.endings.normal;
    else if(this.dialogueKey === 'ending_secret') lines = BATO.DIALOGUE.endings.secret;
    else if(this.dialogueKey === 'ending_true') lines = BATO.DIALOGUE.endings.true;

    if(this.dialogueKey === 'intro'){
      this.add.text(w/2, h/2-40, 'SENATE ESCAPE', {fontSize:'16px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5);
      this.add.text(w/2, h/2-20, 'Bato: Perks of Being a Senator', {fontSize:'10px',color:'#aaaaaa',fontFamily:'monospace'}).setOrigin(0.5);
    }

    if(lines){
      BATO.DialogueBox.show(this, lines, ()=>{
        if(this.nextScene) this.scene.start(this.nextScene, this.nextData);
        else this.scene.start('GameScene');
      });
    } else {
      this.time.delayedCall(1000,()=>{
        if(this.nextScene) this.scene.start(this.nextScene, this.nextData);
        else this.scene.start('GameScene');
      });
    }
  },

  update(){}
};
