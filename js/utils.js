var BATO = window.BATO || {};

BATO.CONST = {
  W:480, H:270, TILE:16, GRAVITY:800,
  PLAYER_SPEED:120, PLAYER_RUN_SPEED:180, JUMP_VEL:-280,
  BASE_HP:100, MAX_HEAT:100, MAX_PRAYER:100,
  ZONES:[
    {name:"Quiapo Chaos", stages:2, enemies:['nbi','snatcher','possessed_devotee']},
    {name:"Davao Night Market", stages:2, enemies:['nbi','icc_lawyer','shadow_hooded']},
    {name:"ICC Headquarters", stages:2, enemies:['icc_lawyer','shredder_drone','viral_journalist']}
  ],
  COLORS:{
    bg:0x1a1a2e, ground:0x4a4a6a, platform:0x6a4a3a,
    hudBg:0x000000, hudText:'#ffffff', hudAccent:'#ffcc00',
    hpBar:0xff4444, prayerBar:0xffcc00, heatBar:0xff6600,
    batoSkin:0xc68642, batoBarong:0xffffff, batoPants:0x222222,
    sanBato:0xfffde0, sanBatoGold:0xffd700
  }
};

BATO.Utils = {
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  randf(min, max) { return Math.random() * (max - min) + min; },
  clamp(v, min, max) { return Math.max(min, Math.min(max, v)); },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  distance(x1,y1,x2,y2){return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))},

  generateBatoSprites(scene){
    if(scene.textures.exists('bato_idle')) return;
    let w=32, h=48;
    for(let state of ['idle','walk','run','jump','attack1','attack2','attack3','hurt','die']){
      let g = scene.make.graphics({add:false});
      // Idle base
      g.fillStyle(0xc68642); g.fillRect(10,20,12,10);
      g.fillStyle(0xffffff); g.fillRect(6,8,20,16);
      g.fillStyle(0x222222); g.fillRect(8,28,16,18);
      g.fillStyle(0x000000); g.fillRect(12,22,3,3); g.fillRect(19,22,3,3);
      g.lineStyle(2,0x000000); g.lineBetween(16,25,18,26);
      g.fillStyle(0x8B4513); g.fillRect(8,4,5,6); g.fillRect(19,4,5,6);
      if(state==='attack1'){
        g.fillStyle(0xffcc00); g.fillRect(22,16,11,4);
        g.fillStyle(0xff0000); g.fillRect(24,14,2,2); g.fillRect(28,16,2,2);
      } else if(state==='jump'){
        g.fillStyle(0x8B4513); g.fillRect(4,36,6,4);
        g.fillStyle(0x000000); g.fillRect(14,42,4,2);
      } else if(state==='hurt'||state==='die'){
        g.fillStyle(0xff0000); g.fillRect(8,8,20,16);
        g.fillStyle(0xff6666); g.fillRect(10,20,12,10);
      }
      g.generateTexture('bato_'+state, w, h);
      g.destroy();
    }
  },

  generateSanBatoSprites(scene){
    if(scene.textures.exists('sanbato_idle')) return;
    let w=32, h=48;
    for(let state of ['idle','walk','run','jump','attack1','attack2','attack3']){
      let g = scene.make.graphics({add:false});
      g.fillStyle(0xfffde0); g.fillRect(10,20,12,10);
      g.fillStyle(0xffffff); g.fillRect(6,8,20,16);
      g.lineStyle(2,0xffd700); g.strokeRect(6,8,20,16);
      g.fillStyle(0xffd700); g.fillRect(8,28,16,18);
      g.fillStyle(0xffd700); g.fillRect(10,2,12,8);
      g.fillStyle(0xffffff); g.fillRect(12,20,3,3); g.fillRect(19,20,3,3);
      g.lineStyle(1,0xffffff); g.lineBetween(16,10,16,6);
      g.fillStyle(0xffd700); g.fillRect(7,22,4,8);
      if(state==='attack1'){
        g.fillStyle(0xffd700); g.fillRect(22,12,10,6);
        g.fillStyle(0xffff00); g.fillRect(30,10,6,10);
      }
      g.generateTexture('sanbato_'+state, w, h);
      g.destroy();
    }
  },

  generateEnemySprites(scene){
    if(scene.textures.exists('enemy_nbi')) return;
    let colors={nbi:0x334466, icc_lawyer:0x664433, snatcher:0x886644, viral_journalist:0x44aa66, possessed_devotee:0x884488, shadow_hooded:0x333333, shredder_drone:0x999999};
    for(let [id,col] of Object.entries(colors)){
      let g=scene.make.graphics({add:false});
      g.fillStyle(col); g.fillRect(4,8,24,24);
      g.fillStyle(0xffffff); g.fillRect(7,4,18,6);
      g.fillStyle(0x000000); g.fillRect(9,12,4,4); g.fillRect(19,12,4,4);
      g.fillStyle(col+0x222222); g.fillRect(6,24,8,16); g.fillRect(18,24,8,16);
      g.generateTexture('enemy_'+id, 32, 40);
      g.destroy();
    }
  },

  generateBossSprites(scene){
    if(scene.textures.exists('boss_carroza')) return;
    let bossDefs={
      carroza:{sz:[96,64],col:0x884488,details:[{x:10,y:10,w:20,h:20,c:0xffcc00},{x:66,y:10,w:20,h:20,c:0xffcc00}]},
      mecha_nbi:{sz:[96,80],col:0x555555,details:[{x:70,y:10,w:20,h:30,c:0xff4444}]},
      icc_judge:{sz:[96,96],col:0x444488,details:[{x:30,y:10,w:36,h:36,c:0xffff88},{x:10,y:50,w:20,h:40,c:0x8888cc},{x:66,y:50,w:20,h:40,c:0x8888cc}]},
      diktador:{sz:[96,96],col:0x111111,details:[{x:20,y:10,w:56,h:56,c:0x440000},{x:10,y:60,w:76,h:30,c:0x222222}]}
    };
    for(let [id,def] of Object.entries(bossDefs)){
      let[tw,th]=def.sz;
      let g=scene.make.graphics({add:false});
      g.fillStyle(def.col); g.fillRect(0,0,tw,th);
      for(let d of def.details){ g.fillStyle(d.c); g.fillRect(d.x,d.y,d.w,d.w); }
      g.generateTexture('boss_'+id, tw, th);
      g.destroy();
    }
  },

  generateProjectileSprites(scene){
    if(scene.textures.exists('proj_slipper')) return;
    let g=scene.make.graphics({add:false});
    g.fillStyle(0x8B4513); g.fillRect(0,2,16,6);
    g.fillStyle(0x222222); g.fillRect(12,3,6,4);
    g.generateTexture('proj_slipper', 18, 10);
    g.destroy();
    let g2=scene.make.graphics({add:false});
    g2.fillStyle(0xffcc00); g2.fillRect(0,0,8,8);
    g2.generateTexture('proj_coin', 8, 8);
    g2.destroy();
    let g3=scene.make.graphics({add:false});
    g3.fillStyle(0xff4444); g3.fillRect(0,0,6,6);
    g3.generateTexture('proj_enemy', 6, 6);
    g3.destroy();
  },

  generateUISprites(scene){
    if(scene.textures.exists('icon_perk')) return;
    for(let p of BATO.PERKS){
      let g=scene.make.graphics({add:false});
      let c=0x8866cc;
      if(p.tier===1) c=0x4488cc;
      else if(p.tier===2) c=0xcc66aa;
      else if(p.tier===3) c=0xff8800;
      g.fillStyle(c); g.fillRect(0,0,24,24);
      g.lineStyle(1,0xffffff); g.strokeRect(0,0,24,24);
      g.generateTexture('icon_perk_'+p.id, 24, 24);
      g.destroy();
    }
  },

  generateBackground(scene, zone){
    if(scene.textures.exists('bg_'+zone)) return;
    let g=scene.make.graphics({add:false});
    let colors=[[0x1a1a2e,0x16213e],[0x2d1b2e,0x4a1942],[0x1a2e1a,0x162e16],[0x2e2e1a,0x4a4a2e],[0x1a1a3e,0x2e2e4e]];
    let c=colors[zone]||colors[0];
    g.fillStyle(c[0]); g.fillRect(0,0,480,270);
    g.fillStyle(c[1]); g.fillRect(0,200,480,70);
    g.fillStyle(0x333333); g.fillRect(0,210,480,4);
    g.generateTexture('bg_'+zone, 480, 270);
    g.destroy();
  }
};
