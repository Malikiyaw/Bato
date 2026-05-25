var BATO = window.BATO || {};

BATO.Perks = {
  activeSlots:[null,null,null], passiveSlot:null,
  cooldowns:{}, activeEffects:{}, runPerks:[],

  init(loadout){
    this.activeSlots = [null,null,null];
    this.passiveSlot = null;
    this.cooldowns = {};
    this.activeEffects = {};
    this.runPerks = [];
    if(!loadout) return;
    for(let i=0;i<3 && i<loadout.active.length;i++){
      let p = BATO.PERKS.find(x=>x.id===loadout.active[i]);
      if(p && p.type==='active') this.activeSlots[i]=p;
    }
    if(loadout.passive){
      let p = BATO.PERKS.find(x=>x.id===loadout.passive);
      if(p && p.type==='passive') this.passiveSlot=p;
    }
  },

  isOnCooldown(id){ return this.cooldowns[id] && this.cooldowns[id] > Date.now(); },
  getCooldownRemaining(id){ let c=this.cooldowns[id]; return c?Math.max(0,c-Date.now()):0; },
  startCooldown(id, durMs){
    this.cooldowns[id] = Date.now() + durMs*1000;
  },

  activateSlot(slotIdx, player, scene){
    let p = this.activeSlots[slotIdx];
    if(!p || this.isOnCooldown(p.id)) return false;
    let cost = p.cost || 0;
    if(cost > 0 && BATO.Prayer && BATO.Prayer.current < cost) return false;
    if(cost > 0 && BATO.Prayer) BATO.Prayer.use(cost);
    this.applyEffect(p.id, player, scene);
    if(p.cd > 0) this.startCooldown(p.id, p.cd);
    BATO.AudioManager.playSfx('perk');
    return true;
  },

  applyEffect(perkId, player, scene){
    if(!player) return;
    switch(perkId){
      case 'prayer_shield': player.setData('prayerShield', true); break;
      case 'fake_mustache': player.setData('invisible', true);
        scene.time.delayedCall(10000,()=>{if(player && player.active) player.setData('invisible',false);}); break;
      case 'senate_privilege': player.setData('invincible', true);
        scene.time.delayedCall(3000,()=>{if(player && player.active) player.setData('invincible',false);}); break;
      case 'bato_blast':
        if(scene.enemies){
          scene.enemies.getChildren().forEach(e=>{
            if(e.active && e.hp>0){
              let kbDir = e.x>player.x?1:-1;
              e.hp -= 15;
              e.body.setVelocityX(kbDir*300);
              e.setData('stunned', true);
              scene.time.delayedCall(500,()=>{if(e&&e.active){e.body.setVelocityX(0);e.setData('stunned',false);}});
            }
          });
        }
        if(scene.boss && scene.boss.active) scene.boss.hp -= 15; break;
      case 'tokhang': this.applyEffect('bato_blast',player,scene); break;
      case 'edi_wow':
        let tgt = scene.enemies?scene.enemies.getChildren().find(e=>e.active && BATO.Utils.distance(player.x,player.y,e.x,e.y)<100):null;
        if(tgt){ tgt.setData('stunned',true); scene.time.delayedCall(5000,()=>{if(tgt&&tgt.active)tgt.setData('stunned',false);}); }
        if(BATO.Heat) BATO.Heat.add(10); break;
      case 'carabao_armor': player.setData('carabaoArmor', true);
        scene.time.delayedCall(10000,()=>{if(player&&player.active) player.setData('carabaoArmor',false);}); break;
      case 'panata': player.setData('panataUsed', false); break;
      case 'tsinelas_mode': player.setData('tsinelasMode', true); break;
      case 'coin_pebble': player.setData('coinPebble', true);
        scene.time.delayedCall(15000,()=>{if(player&&player.active) player.setData('coinPebble',false);}); break;
      case 'reflect': player.setData('reflect', true);
        scene.time.delayedCall(10000,()=>{if(player&&player.active) player.setData('reflect',false);}); break;
      case 'stun': this.applyEffect('edi_wow',player,scene); break;
      case 'invincible': this.applyEffect('senate_privilege',player,scene); break;
      case 'heal': if(scene.playerHp!==undefined) scene.playerHp = Math.min((scene.playerMaxHp||100), (scene.playerHp||100)+30); break;
      case 'summon_suv':
        if(scene) scene.usedVehiclePerks = true;
        if(scene && scene.spawnTempPlatform){
          scene.spawnTempPlatform(player.x+(player.flipX?-80:80), player.y-20, 80, 32, 8000);
          BATO.AudioManager.playMelody([523,440,349,440,523,659,784],'square',0.08,150);
        } break;
      case 'wall':
        if(scene && scene.spawnTempPlatform)
          scene.spawnTempPlatform(player.x+(player.flipX?-24:24), player.y, 16, 64, 10000); break;
      case 'stun_cloud':
      case 'slow_cloud':
        let cloud = scene.add.circle(player.x, player.y, 40, 0x88ff88, 0.3);
        scene.time.delayedCall(4000,()=>{if(cloud)cloud.destroy();});
        scene.enemies.getChildren().forEach(e=>{if(e.active && BATO.Utils.distance(player.x,player.y,e.x,e.y)<50) e.setData('slowed',true);}); break;
      case 'cash_rain':
        for(let i=0;i<10;i++){
          scene.time.delayedCall(i*200,()=>{
            if(!scene) return;
            let c = scene.add.circle(player.x+BATO.Utils.rand(-80,80), player.y-100, 4, 0xffcc00);
            scene.tweens.add({targets:c,y:player.y+100,alpha:0,duration:1000,onComplete:()=>c.destroy()});
          });
        } break;
      case 'basketball':
        for(let i=0;i<5;i++){
          scene.time.delayedCall(i*300,()=>{
            if(!scene) return;
            let bx = player.x+BATO.Utils.rand(-50,50);
            let ball = scene.add.circle(bx, -20, 8, 0xff8800);
            scene.tweens.add({targets:ball,y:300,duration:800,onComplete:()=>{ball.destroy();}});
          });
        } break;
      case 'freeze':
        scene.enemies.getChildren().forEach(e=>{
          if(e.active) e.setData('frozen',true);
        });
        scene.time.delayedCall(5000,()=>{
          scene.enemies.getChildren().forEach(e=>{if(e.active) e.setData('frozen',false);});
        }); break;
      case 'blackout': if(BATO.Heat) BATO.Heat.set(0); break;
      case 'pay_media': if(BATO.Heat) BATO.Heat.set(Math.max(0,BATO.Heat.current-50)); break;
      case 'double_coins': player.setData('doubleCoins', true);
        scene.time.delayedCall(30000,()=>{if(player&&player.active) player.setData('doubleCoins',false);}); break;
      case 'convert_cop':
        scene.enemies.getChildren().forEach(e=>{
          if(e.active && e.enemyType==='nbi'){
            e.setData('converted', true);
            e.setTint(0x88ff88);
            scene.time.delayedCall(20000,()=>{if(e&&e.active){e.setData('converted',false);e.clearTint();}});
          }
        }); break;
      default: break;
    }
  }
};

BATO.Prayer = {
  current:0, max:100,
  init(){ this.current=0; },
  add(amt){ this.current = Math.min(this.max, this.current+amt); },
  use(amt){ if(this.current>=amt){ this.current-=amt; return true; } return false; },
  reset(){ this.current=0; }
};

BATO.Heat = {
  current:0, max:100,
  init(){ this.current=0; },
  add(amt){ this.current = Math.min(this.max, this.current+amt); if(this.current>=this.max&&BATO.AudioManager) BATO.AudioManager.playSfx('heat_up'); },
  reduce(amt){ this.current = Math.max(0, this.current-amt); },
  set(v){ this.current=Math.max(0,Math.min(this.max,v)); },
  reset(){ this.current=0; }
};

BATO.Save = {
  data:null, key:'bato_save',

  init(){
    try{
      let raw = localStorage.getItem(this.key);
      this.data = raw ? JSON.parse(raw) : this.defaults();
    }catch(e){ this.data = this.defaults(); }
  },

  defaults(){
    return {
      unlockedPerks:[], coins:0, achievements:[],
      sanBatoUnlocked:false, totalPunches:0, ediWowUses:0,
      tulfoWins:0, karaokeHeals:0, rosaryBeads:0,
      perkUses:{}, runsCompleted:0, heatZeroRuns:0,
      options:{volume:0.7,sfxVol:0.7,musicVol:0.4,leftHand:false,touchOpacity:0.4}
    };
  },

  save(){
    try{ localStorage.setItem(this.key, JSON.stringify(this.data)); }catch(e){}
  },

  load(){ return this.data; },

  unlockPerk(id){
    if(!this.data.unlockedPerks.includes(id)){
      this.data.unlockedPerks.push(id);
      let p = BATO.PERKS.find(x=>x.id===id);
      if(p) p.unlocked = true;
      this.save();
    }
  },

  unlockAchievement(id){
    if(!this.data.achievements.includes(id)){
      this.data.achievements.push(id);
      this.save();
      return true;
    }
    return false;
  },

  addCoins(amt){ this.data.coins += amt; this.save(); },
  spendCoins(amt){ if(this.data.coins>=amt){ this.data.coins-=amt; this.save(); return true; } return false; },
  getCoins(){ return this.data.coins; },

  getStats(){ return this.data; },

  hasPerk(id){ return this.data.unlockedPerks.includes(id); },
  hasAchievement(id){ return this.data.achievements.includes(id); },

  clear(){
    localStorage.removeItem(this.key);
    this.data = this.defaults();
  }
};

BATO.Achievements = {
  check(id, game){
    let sv = BATO.Save.data;
    let achieved = BATO.Save.unlockAchievement(id);
    if(achieved && game && game.scene){
      let scene = game.scene.getScene('GameScene');
      if(scene && scene.showAchievement) scene.showAchievement(id);
    }
    return achieved;
  },

  checkAll(game){
    let sv = BATO.Save.data;
    if(sv.runsCompleted>=1) this.check('takbong_senador',game);
    if(sv.ediWowUses>=50) this.check('edi_wow_50',game);
    if(sv.tulfoWins>=10) this.check('bardagulan_expert',game);
    if(sv.totalPunches>=1000) this.check('pacquiao_jab',game);
    if(sv.karaokeHeals>=10) this.check('videoke_king',game);
    if(sv.rosaryBeads>=7) this.check('rosary_collector',game);
    if(sv.heatZeroRuns>=1) this.check('media_blackout',game);
  }
};
