var BATO = window.BATO || {};

BATO.PlayerFactory = {
  createBato(scene, x, y){
    let p = scene.physics.add.sprite(x, y, 'bato_idle', 0);
    p.setSize(20, 40).setOffset(6, 8);
    p.setCollideWorldBounds(true);
    p.body.setGravityY(800);
    p.playerType = 'bato';
    p.hp = 100; p.maxHp = 100;
    p.facingRight = true;
    p.attackTimer = 0;
    p.comboCount = 0;
    p.specialCooldown = 0;
    p.invulnTimer = 0;
    p.currAnim = 'idle';

    p.setupInput = function(){
      let keys = scene.input.keyboard.addKeys({
        up:Phaser.Input.Keyboard.KeyCodes.UP, down:Phaser.Input.Keyboard.KeyCodes.DOWN,
        left:Phaser.Input.Keyboard.KeyCodes.LEFT, right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
        a:Phaser.Input.Keyboard.KeyCodes.A, d:Phaser.Input.Keyboard.KeyCodes.D,
        w:Phaser.Input.Keyboard.KeyCodes.W, s:Phaser.Input.Keyboard.KeyCodes.S,
        jump:Phaser.Input.Keyboard.KeyCodes.L, attack:Phaser.Input.Keyboard.KeyCodes.J,
        special:Phaser.Input.Keyboard.KeyCodes.K, dash:Phaser.Input.Keyboard.KeyCodes.I,
        throwSlipper:Phaser.Input.Keyboard.KeyCodes.SPACE,
        perk1:Phaser.Input.Keyboard.KeyCodes.U, perk2:Phaser.Input.Keyboard.KeyCodes.O,
        perk3:Phaser.Input.Keyboard.KeyCodes.P
      });
      this.keys = keys;
    };

    p.updateBato = function(time, delta){
      if(this.hp<=0) return;
      let keys = this.keys;
      let onFloor = this.body.blocked.down || this.body.touching.down;
      let speed = 120;
      let vx=0;

      if(keys.left.isDown || keys.a.isDown){ vx=-speed; this.flipX=true; this.facingRight=false; }
      else if(keys.right.isDown || keys.d.isDown){ vx=speed; this.flipX=false; this.facingRight=true; }

      if(keys.down.isDown || keys.s.isDown){
        if(onFloor && this.body.blocked.down) this.body.setSize(20,28).setOffset(6,20);
        else { this.body.setSize(20,40).setOffset(6,8); this.attackTimer=0; }
      } else { this.body.setSize(20,40).setOffset(6,8); }

      if((keys.jump.isDown || Phaser.Input.Keyboard.JustDown(keys.jump)) && onFloor){
        this.body.setVelocityY(BATO.CONST.JUMP_VEL);
        BATO.AudioManager.playSfx('jump');
      }

      if(Phaser.Input.Keyboard.JustDown(keys.attack) && this.attackTimer<=0){
        this.attackTimer = 300;
        this.comboCount = (this.comboCount+1)%3;
        let dmg = 8;
        scene.dealDamage(this, dmg, this.facingRight ? 1 : -1);
        BATO.AudioManager.playSfx('hit');
        BATO.Save.data.totalPunches++;
        if(BATO.Save.data.totalPunches>=1000) BATO.Achievements.check('pacquiao_jab',scene.game);
        this.setTexture('bato_attack'+(this.comboCount+1));
        scene.time.delayedCall(100,()=>{if(this.active) this.setTexture('bato_idle');});
      }

      if(Phaser.Input.Keyboard.JustDown(keys.throwSlipper) && this.attackTimer<=0){
        this.attackTimer = 400;
        this.throwSlipper();
      }

      if(Phaser.Input.Keyboard.JustDown(keys.special) && BATO.Prayer.current>=30 && this.specialCooldown<=0){
        BATO.Prayer.use(30);
        this.specialCooldown=1000;
        scene.dealDamage(this, 15, 0, true);
        BATO.AudioManager.playSfx('special');
        let wave = scene.add.circle(this.x, this.y, 60, 0xffffff, 0.3);
        scene.tweens.add({targets:wave,scaleX:3,scaleY:3,alpha:0,duration:500,onComplete:()=>wave.destroy()});
      }

      this.body.setVelocityX(vx);

      if(this.attackTimer>0) this.attackTimer-=delta;
      if(this.specialCooldown>0) this.specialCooldown-=delta;
      if(this.invulnTimer>0) this.invulnTimer-=delta;

      if(this.getData('prayerShield') && this.body.touching.none===false) this.setData('prayerShield',false);
    };

    p.throwSlipper = function(){
      let dir = this.facingRight ? 1 : -1;
      let sx = this.x + dir*16;
      let s = scene.physics.add.sprite(sx, this.y, 'proj_slipper');
      s.body.setVelocityX(dir*300);
      s.body.setGravityY(400);
      s.setFlipX(!this.facingRight);
      scene.playerProjectiles.add(s);
      scene.time.delayedCall(1500,()=>{if(s.active) s.destroy();});
      BATO.AudioManager.playSfx('slipper');
    };

    p.takeDamage = function(amt, from){
      if(this.invulnTimer>0 || this.getData('invincible')) return;
      if(this.getData('prayerShield')){ this.setData('prayerShield',false); return; }
      if(this.getData('panataUsed')===false && this.hp-amt<=0){
        this.hp=1; this.setData('panataUsed',true);
        BATO.AudioManager.playSfx('heal');
        return;
      }
      this.hp -= amt;
      this.invulnTimer = 500;
      this.setTint(0xff0000);
      scene.time.delayedCall(100,()=>{if(this.active) this.clearTint();});
      BATO.AudioManager.playSfx('dmg');
      BATO.Prayer.add(2);
      if(this.hp<=0){
        this.hp=0;
        this.setTexture('bato_hurt');
        this.body.setVelocity(0,0);
        return true;
      }
      return false;
    };

    p.getDamage = function(){ return 8; };

    p.setupInput();
    return p;
  },

  createSanBato(scene, x, y){
    let p = scene.physics.add.sprite(x, y, 'sanbato_idle', 0);
    p.setSize(20, 40).setOffset(6, 8);
    p.setCollideWorldBounds(true);
    p.body.setGravityY(800);
    p.playerType = 'sanbato';
    p.hp = 120; p.maxHp = 120;
    p.facingRight = true;
    p.attackTimer = 0;
    p.comboCount = 0;
    p.specialCooldown = 0;
    p.invulnTimer = 0;

    p.setupInput = function(){
      let keys = scene.input.keyboard.addKeys({
        up:Phaser.Input.Keyboard.KeyCodes.UP, down:Phaser.Input.Keyboard.KeyCodes.DOWN,
        left:Phaser.Input.Keyboard.KeyCodes.LEFT, right:Phaser.Input.Keyboard.KeyCodes.RIGHT,
        a:Phaser.Input.Keyboard.KeyCodes.A, d:Phaser.Input.Keyboard.KeyCodes.D,
        w:Phaser.Input.Keyboard.KeyCodes.W, s:Phaser.Input.Keyboard.KeyCodes.S,
        jump:Phaser.Input.Keyboard.KeyCodes.L, attack:Phaser.Input.Keyboard.KeyCodes.J,
        special:Phaser.Input.Keyboard.KeyCodes.K, dash:Phaser.Input.Keyboard.KeyCodes.I,
        throwSlipper:Phaser.Input.Keyboard.KeyCodes.SPACE,
        perk1:Phaser.Input.Keyboard.KeyCodes.U, perk2:Phaser.Input.Keyboard.KeyCodes.O,
        perk3:Phaser.Input.Keyboard.KeyCodes.P
      });
      this.keys = keys;
    };

    p.updateSanBato = function(time, delta){
      if(this.hp<=0) return;
      let keys = this.keys;
      let onFloor = this.body.blocked.down || this.body.touching.down;
      let speed = 130;
      let vx=0;

      if(keys.left.isDown || keys.a.isDown){ vx=-speed; this.flipX=true; this.facingRight=false; }
      else if(keys.right.isDown || keys.d.isDown){ vx=speed; this.flipX=false; this.facingRight=true; }

      if((keys.jump.isDown || Phaser.Input.Keyboard.JustDown(keys.jump)) && onFloor){
        this.body.setVelocityY(BATO.CONST.JUMP_VEL);
        BATO.AudioManager.playSfx('jump');
      }

      if(Phaser.Input.Keyboard.JustDown(keys.attack) && this.attackTimer<=0){
        this.attackTimer = 300;
        this.comboCount = (this.comboCount+1)%3;
        let dmg = 10;
        scene.dealDamage(this, dmg, this.facingRight ? 1 : -1);
        BATO.AudioManager.playSfx('hit');
        if(this.comboCount===2){
          let shock = scene.add.rectangle(this.x+(this.facingRight?20:-20), this.y, 40, 20, 0xffd700, 0.4);
          scene.tweens.add({targets:shock,alpha:0,scaleX:2,scaleY:2,duration:300,onComplete:()=>shock.destroy()});
        }
        this.setTexture('sanbato_attack'+(this.comboCount+1));
        scene.time.delayedCall(100,()=>{if(this.active) this.setTexture('sanbato_idle');});
      }

      if(Phaser.Input.Keyboard.JustDown(keys.throwSlipper) && this.attackTimer<=0){
        this.attackTimer=400;
        let dir = this.facingRight?1:-1;
        let s = scene.physics.add.sprite(this.x+dir*16, this.y, 'proj_slipper');
        s.setTint(0xffd700);
        s.body.setVelocityX(dir*350);
        s.body.setGravityY(300);
        s.setData('holy', true);
        scene.playerProjectiles.add(s);
        scene.time.delayedCall(1500,()=>{if(s.active) s.destroy();});
        BATO.AudioManager.playSfx('slipper');
      }

      if(Phaser.Input.Keyboard.JustDown(keys.special) && BATO.Prayer.current>=40 && this.specialCooldown<=0){
        BATO.Prayer.use(40);
        this.specialCooldown=1500;
        let cone = scene.add.rectangle(this.x+(this.facingRight?30:-30), this.y, 60, 80, 0xffd700, 0.3);
        scene.tweens.add({targets:cone,alpha:0,duration:800,onComplete:()=>cone.destroy()});
        scene.enemies.getChildren().forEach(e=>{
          if(e.active && Math.abs(e.x-this.x)<100){
            e.setData('stunned',true);
            scene.time.delayedCall(5000,()=>{if(e&&e.active) e.setData('stunned',false);});
          }
        });
        BATO.AudioManager.playSfx('special');
      }

      this.body.setVelocityX(vx);
      if(this.attackTimer>0) this.attackTimer-=delta;
      if(this.specialCooldown>0) this.specialCooldown-=delta;
      if(this.invulnTimer>0) this.invulnTimer-=delta;
    };

    p.takeDamage = function(amt, from){
      if(this.invulnTimer>0 || this.getData('invincible')) return;
      this.hp -= amt;
      this.invulnTimer = 500;
      this.setTint(0xff0000);
      scene.time.delayedCall(100,()=>{if(this.active) this.clearTint();});
      BATO.AudioManager.playSfx('dmg');
      BATO.Prayer.add(2);
      if(this.hp<=0){ this.hp=0; this.body.setVelocity(0,0); return true; }
      return false;
    };

    p.getDamage = function(){ return 10; };

    p.setupInput();
    return p;
  }
};

BATO.EnemyFactory = {
  createEnemy(scene, type, x, y){
    let def = BATO.ENEMIES.find(e=>e.id===type);
    if(!def) return null;
    let e = scene.physics.add.sprite(x, y, 'enemy_'+type);
    e.enemyType = type;
    e.hp = def.hp;
    e.maxHp = def.hp;
    e.baseDmg = def.dmg;
    e.baseSpeed = def.speed;
    e.atkType = def.atkType;
    e.dropMin = def.dropMin;
    e.dropMax = def.dropMax;
    e.addHeat = def.addHeat || 0;
    e.rosaryChance = def.rosaryChance || 0;
    e.dropPerk = def.dropPerk || 0;
    e.behavior = def.behavior;
    e.attackInterval = def.interval;
    e.lastAttack = 0;
    e.patrolDir = Math.random()>0.5?1:-1;
    e.body.setGravityY(800);
    e.setSize(20, 32).setOffset(6, 8);
    e.body.setCollideWorldBounds(true);

    e.updateEnemy = function(time, delta, player){
      if(this.hp<=0 || !this.active) return;
      if(this.getData('stunned') || this.getData('frozen')){ this.body.setVelocityX(0); return; }
      let onFloor = this.body.blocked.down || this.body.touching.down;

      switch(this.behavior){
        case 'patrol_fire':
          this.body.setVelocityX(this.patrolDir*40);
          if(this.body.blocked.left || this.body.blocked.right) this.patrolDir*=-1;
          if(time-this.lastAttack>this.attackInterval && player && Math.abs(player.x-this.x)<200){
            this.lastAttack = time;
            this.fireAt(player, scene);
          }
          break;
        case 'float_fire':
          this.body.setVelocityX(Math.sin(time/500)*30);
          if(time-this.lastAttack>this.attackInterval && player){
            this.lastAttack=time;
            this.fireHoming(player, scene);
          }
          break;
        case 'dash_steal':
          if(player && Math.abs(player.x-this.x)<200 && onFloor){
            if(Math.abs(player.x-this.x)<80){
              this.body.setVelocityX(player.x>this.x?100:-100);
              if(Math.abs(player.x-this.x)<30 && time-this.lastAttack>2000){
                this.lastAttack=time;
                let stolen = Math.floor((BATO.Save.data.coins||0)*0.05);
                BATO.Save.data.coins = Math.max(0, (BATO.Save.data.coins||0)-stolen);
                this.setData('stolenCoins', stolen);
                this.body.setVelocityY(-200);
                this.dropMin = 10;
                this.dropMax = 30;
              }
            } else {
              this.body.setVelocityX(player.x>this.x?this.baseSpeed*80:-this.baseSpeed*80);
            }
          } else {
            this.body.setVelocityX(this.patrolDir*30);
            if(this.body.blocked.left||this.body.blocked.right) this.patrolDir*=-1;
          }
          break;
        case 'hover_flash':
          this.body.setVelocityX(Math.sin(time/300)*60);
          this.body.setVelocityY(Math.sin(time/400)*30);
          if(player && Math.abs(player.x-this.x)<60 && time-this.lastAttack>3000){
            this.lastAttack=time;
            if(BATO.Heat) BATO.Heat.add(1);
          }
          break;
        case 'slow_throw':
          this.body.setVelocityX(this.patrolDir*20);
          if(this.body.blocked.left||this.body.blocked.right) this.patrolDir*=-1;
          if(player && time-this.lastAttack>this.attackInterval){
            this.lastAttack=time;
            let fb = scene.physics.add.sprite(this.x, this.y, 'proj_enemy');
            fb.setTint(0xff8800);
            let angle = Math.atan2(player.y-this.y, player.x-this.x);
            fb.body.setVelocity(Math.cos(angle)*120, Math.sin(angle)*120);
            fb.body.setGravityY(200);
            scene.enemyProjectiles.add(fb);
            scene.time.delayedCall(3000,()=>{if(fb.active) fb.destroy();});
          }
          break;
        case 'swarm':
        case 'fly_swarm':
          if(player){
            let dist = BATO.Utils.distance(this.x,this.y,player.x,player.y);
            if(dist<200){
              let angle = Math.atan2(player.y-this.y, player.x-this.x);
              this.body.setVelocity(Math.cos(angle)*this.baseSpeed*50, Math.sin(angle)*this.baseSpeed*30);
            } else { this.body.setVelocityX(this.patrolDir*40); }
          } else { this.body.setVelocityX(this.patrolDir*40); }
          if(this.body.blocked.left||this.body.blocked.right) this.patrolDir*=-1;
          break;
        default:
          this.body.setVelocityX(this.patrolDir*30);
          if(this.body.blocked.left||this.body.blocked.right) this.patrolDir*=-1;
      }
    };

    e.fireAt = function(player, scene){
      let p = scene.physics.add.sprite(this.x, this.y-8, 'proj_enemy');
      p.body.setVelocity((player.x>this.x?1:-1)*150, 0);
      p.body.setGravityY(300);
      scene.enemyProjectiles.add(p);
      scene.time.delayedCall(3000,()=>{if(p.active) p.destroy();});
    };

    e.fireHoming = function(player, scene){
      let p = scene.physics.add.sprite(this.x, this.y-8, 'proj_enemy');
      p.setTint(0xff4444);
      let angle = Math.atan2(player.y-this.y, player.x-this.x);
      p.body.setVelocity(Math.cos(angle)*100, Math.sin(angle)*100);
      scene.enemyProjectiles.add(p);
      scene.time.delayedCall(4000,()=>{if(p.active) p.destroy();});
    };

    e.takeDamage = function(amt, knockbackDir){
      this.hp -= amt;
      this.setTint(0xffffff);
      scene.time.delayedCall(80,()=>{if(this.active) this.clearTint();});
      if(knockbackDir) this.body.setVelocityX(knockbackDir*100);
      if(this.hp<=0){
        this.die(scene);
        return true;
      }
      return false;
    };

    e.die = function(scene){
      let coins = this.dropMin + BATO.Utils.rand(0, Math.max(0,this.dropMax-this.dropMin));
      let stolen = this.getData('stolenCoins');
      if(stolen) coins += stolen * 2;
      if(this.getData('converted') || this.getData('blessed')) coins = Math.floor(coins*1.5);
      if(scene.player && scene.player.getData('doubleCoins')) coins *= 2;
      BATO.Save.addCoins(coins);
      if(this.addHeat && BATO.Heat) BATO.Heat.add(this.addHeat);
      if(Math.random()<this.rosaryChance && BATO.Save.data.rosaryBeads<7) BATO.Save.data.rosaryBeads++;
      if(Math.random()<this.dropPerk){
        let avail = BATO.PERKS.filter(p=>!p.unlocked);
        if(avail.length>0) BATO.Save.unlockPerk(BATO.Utils.pick(avail).id);
      }
      let coinAnim = scene.add.circle(this.x, this.y-10, 4, 0xffcc00);
      scene.tweens.add({targets:coinAnim,y:this.y-30,alpha:0,duration:500,onComplete:()=>coinAnim.destroy()});
      this.destroy();
    };

    return e;
  }
};
