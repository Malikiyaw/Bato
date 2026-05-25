var BATO = window.BATO || {};

BATO.PERKS = [
  { id:'getaway_suv', name:"Robin's Getaway SUV", tier:1, desc:"Summon SUV (8s ram)", type:'active', cost:30, cd:20, effect:'summon_suv', unlocked:true },
  { id:'prayer_shield', name:"Prayer Shield", tier:1, desc:"Block 1 hit, 20s CD", type:'passive', cost:0, cd:20, effect:'prayer_shield', unlocked:true },
  { id:'fake_mustache', name:"Fake Mustache Disguise", tier:1, desc:"10s invisibility", type:'active', cost:15, cd:25, effect:'invis', unlocked:true },
  { id:'balikbayan_box', name:"Balikbayan Box Drop", tier:1, desc:"Wall 10s", type:'active', cost:20, cd:30, effect:'wall', unlocked:true },
  { id:'utang_loob', name:"Utang na Loob", tier:1, desc:"Convert 1 NBI agent 20s", type:'active', cost:25, cd:35, effect:'convert', unlocked:true },
  { id:'coffin_dance', name:"Coffin Dance", tier:1, desc:"Revive at 1 HP once per run", type:'passive', cost:0, cd:999, effect:'revive', unlocked:true },
  { id:'senate_privilege', name:"Senate Privilege", tier:1, desc:"Invincibility 3s", type:'active', cost:20, cd:30, effect:'invincible', unlocked:true },
  { id:'bato_blast', name:"Bato Blast", tier:1, desc:"Tokhang wave knockback 15 dmg", type:'active', cost:30, cd:15, effect:'tokhang', unlocked:true },
  { id:'blue_ribbon', name:"Blue Ribbon Blocker", tier:1, desc:"Committee table barrier 8s", type:'active', cost:25, cd:35, effect:'barrier', unlocked:true },
  { id:'badge_honor', name:"Badge of Honor", tier:1, desc:"Flash badge, convert cop", type:'active', cost:20, cd:25, effect:'convert_cop', unlocked:true },
  { id:'tear_gas', name:"Tear Gas Tears", tier:1, desc:"Slow cloud 4s", type:'active', cost:15, cd:20, effect:'slow_cloud', unlocked:true },
  { id:'sana_all', name:"Sana All Shield", tier:2, desc:"Reflect damage 10s", type:'active', cost:25, cd:30, effect:'reflect', unlocked:false },
  { id:'pa_victim', name:"Pa-Victim Card", tier:2, desc:"Reduce aggro 10s", type:'active', cost:15, cd:25, effect:'reduce_aggro', unlocked:false },
  { id:'edi_wow', name:"Edi Wow!", tier:2, desc:"Stun 1 enemy 5s, raises Heat", type:'active', cost:10, cd:8, effect:'stun', unlocked:false },
  { id:'palit_ulo', name:"Palit-Ulo (Head Swap)", tier:2, desc:"Swap HP with enemy 10s", type:'active', cost:35, cd:40, effect:'swap_hp', unlocked:false },
  { id:'duterte_ghost', name:"Duterte's Ghost", tier:2, desc:"Spectral curse, stumble 3s", type:'active', cost:20, cd:25, effect:'curse', unlocked:false },
  { id:'mocha_blast', name:"Mocha Blast", tier:2, desc:"Misinformation cloud stun 5s", type:'active', cost:20, cd:30, effect:'misinfo', unlocked:false },
  { id:'dswd_4ps', name:"DSWD 4Ps", tier:2, desc:"Cash rain, distract 10s", type:'active', cost:25, cd:35, effect:'cash_rain', unlocked:false },
  { id:'go_bato_go', name:"Go Bato Go (Bong Go Airdrop)", tier:2, desc:"Basketballs fall 10 dmg", type:'active', cost:30, cd:25, effect:'basketball', unlocked:false },
  { id:'tulfo_intervention', name:"Tulfo Intervention", tier:2, desc:"Dialogue wheel neutralize group", type:'active', cost:20, cd:40, effect:'tulfo', unlocked:false },
  { id:'bato_currency', name:"Bato Currency", tier:3, desc:"Coins become pebbles 5 dmg", type:'active', cost:10, cd:5, effect:'coin_pebble', unlocked:false },
  { id:'dds_invocation', name:"DDS Invocation", tier:3, desc:"Mob tramples 20 dmg all", type:'active', cost:40, cd:50, effect:'dds_mob', unlocked:false },
  { id:'great_resignation', name:"The Great Resignation", tier:3, desc:"All enemies quit (once per run)", type:'active', cost:50, cd:999, effect:'resign', unlocked:false },
  { id:'icc_antivenom', name:"ICC Anti-Venom", tier:3, desc:"Immune to lawyer projectiles 15s", type:'active', cost:15, cd:30, effect:'antivenom', unlocked:false },
  { id:'karaoke_heal', name:"Karaoke Heal", tier:3, desc:"Full heal but attract all enemies", type:'active', cost:0, cd:60, effect:'karaoke', unlocked:false },
  { id:'tsinelas_mode', name:"Tsinelas Mode", tier:3, desc:"Slipper throw always active, stun 2s", type:'passive', cost:0, cd:0, effect:'tsinelas_mode', unlocked:false },
  { id:'carabao_resilience', name:"Carabao's Resilience", tier:3, desc:"Armor after big hit 10s", type:'passive', cost:0, cd:30, effect:'carabao_armor', unlocked:false },
  { id:'panata_shield', name:"Panata Shield", tier:3, desc:"Auto-block fatal hit (once/run)", type:'passive', cost:0, cd:999, effect:'panata', unlocked:false },
  { id:'moral_ascendancy', name:"Moral Ascendancy", tier:3, desc:"+5% def after ultimate (San Bato)", type:'passive', cost:0, cd:0, effect:'moral_def', unlocked:false },
  { id:'doble_kara', name:"Doble Kara", tier:3, desc:"Echo attack hits twice", type:'active', cost:20, cd:20, effect:'echo', unlocked:false },
  { id:'sakdal_charge', name:"Sakdal Charge", tier:3, desc:"Tackle through enemies 15 dmg", type:'active', cost:20, cd:15, effect:'charge', unlocked:false },
  { id:'laglag_bala', name:"Laglag Bala", tier:3, desc:"Plant evidence, enemy jailed 10s", type:'active', cost:15, cd:25, effect:'plant_evidence', unlocked:false },
  { id:'epal_ka', name:"Epal Ka!", tier:3, desc:"Nameplate distracts enemies 5s", type:'active', cost:10, cd:15, effect:'nameplate', unlocked:false },
  { id:'martial_law', name:"Martial Law", tier:3, desc:"Freeze all enemies 5s", type:'active', cost:40, cd:60, effect:'freeze', unlocked:false },
  { id:'media_blackout', name:"Media Blackout", tier:3, desc:"Instantly reduce Heat to 0", type:'active', cost:0, cd:90, effect:'blackout', unlocked:false },
  { id:'bayaran_media', name:"Bayaran Media", tier:3, desc:"Pay off journalists, lower Heat 50%", type:'active', cost:20, cd:40, effect:'pay_media', unlocked:false },
  { id:'ninong_system', name:"Ninong System", tier:3, desc:"Enemy drops double coins 30s", type:'active', cost:15, cd:40, effect:'double_coins', unlocked:false }
];

BATO.ENEMIES = [
  { id:'nbi', name:"NBI Plainclothes", hp:25, dmg:8, speed:1, type:'ranged', behavior:'patrol_fire', interval:3000, drop_min:10, drop_max:20, color:0x334466, atkType:'subpoena' },
  { id:'icc_lawyer', name:"ICC Lawyer", hp:30, dmg:10, speed:0.8, type:'ranged', behavior:'float_fire', interval:2500, drop_min:15, drop_max:15, dropPerk:0.05, color:0x664433, atkType:'homing_scroll' },
  { id:'snatcher', name:"Snatcher", hp:15, dmg:5, speed:2.5, type:'melee', behavior:'dash_steal', interval:2000, drop_min:0, drop_max:0, color:0x886644, atkType:'melee' },
  { id:'viral_journalist', name:"Viral Journalist Drone", hp:20, dmg:0, speed:1.5, type:'special', behavior:'hover_flash', interval:3000, drop_min:5, drop_max:5, addHeat:1, color:0x44aa66, atkType:'blind' },
  { id:'possessed_devotee', name:"Possessed Devotee", hp:40, dmg:12, speed:0.5, type:'ranged', behavior:'slow_throw', interval:2000, drop_min:10, drop_max:10, rosaryChance:0.01, color:0x884488, atkType:'fireball' },
  { id:'shadow_hooded', name:"Shadow Hooded", hp:20, dmg:6, speed:2, type:'melee', behavior:'swarm', interval:1500, drop_min:5, drop_max:5, color:0x222222, atkType:'melee' },
  { id:'shredder_drone', name:"Paper Shredder Drone", hp:15, dmg:5, speed:2.5, type:'melee', behavior:'fly_swarm', interval:1000, drop_min:5, drop_max:5, color:0xaaaaaa, atkType:'contact' }
];

BATO.BOSSES = [
  {
    id:'carroza', name:"Possessed Carroza", zone:1, totalHp:500,
    phases:[
      { hp:300, name:"Push & Pull", weakpoints:[{name:"Golden Wheel",hp:50},{name:"Golden Wheel",hp:50},{name:"Golden Wheel",hp:50},{name:"Golden Wheel",hp:50}],
        attacks:[{name:"Slam",dmg:20,type:'shockwave'},{name:"Charge",dmg:30,type:'charge'},{name:"Spawn Devotee",dmg:0,type:'spawn'}] },
      { hp:200, name:"Corrupted Sermon", weakpoints:[{name:"Red Eye",hp:70}],
        attacks:[{name:"Sermon of Lies",dmg:10,type:'projectile'},{name:"Guilt Trip Laser",dmg:15,type:'laser_slow'},{name:"Pork Barrel Rain",dmg:20,type:'barrel_rain'}] }
    ],
    interlude:{hpTrigger:50, text:"Anak, pananampalataya ang kailangan, hindi dahas.", heal:true, buff:'damage', buffDur:15},
    unlockPerk:'panata_shield'
  },
  {
    id:'mecha_nbi', name:"Mecha-NBI Director", zone:2, totalHp:800,
    phases:[
      { hp:400, name:"Harvest of Steel", weakpoints:[{name:"Exhaust Pipe",hp:100},{name:"Exhaust Pipe",hp:100}],
        attacks:[{name:"Banana Slamma",dmg:25,type:'throw'},{name:"Carabao Charge",dmg:30,type:'charge_gore'},{name:"Pesticide Spray",dmg:5,type:'toxic_cloud'}] },
      { hp:400, name:"Warrant of the Machine", weakpoints:[{name:"Power Core",hp:200}],
        attacks:[{name:"Gavel Gatling",dmg:8,type:'rapid'},{name:"Shield Wall Push",dmg:50,type:'push_crush'},{name:"Aerial Siren Strike",dmg:15,type:'stun_grenade'}] }
    ],
    interlude:{hpTrigger:30, text:"Tropang Tricycle! Sakay na!", heal:false, buff:'distract', buffDur:15},
    unlockPerk:'carabao_resilience'
  },
  {
    id:'icc_judge', name:"ICC Judge Monster", zone:3, totalHp:1200,
    phases:[
      { hp:400, name:"Preliminary Examination", weakpoints:[{name:"Scale Face",hp:400,openWindow:3}],
        attacks:[{name:"Objection Overruled",dmg:15,type:'wave'},{name:"Jury Summon",dmg:20,type:'homing_verdict'},{name:"Subpoena Whip",dmg:25,type:'grab'}] },
      { hp:400, name:"The Trial", weakpoints:[{name:"Gavel Arm",hp:150},{name:"Gavel Arm",hp:150}],
        attacks:[{name:"Witness Testimony",dmg:20,type:'light_beam'},{name:"Exhibit A",dmg:0,type:'spawn_drones'},{name:"Adjournment Gavel",dmg:25,type:'shockwave_combo'}] },
      { hp:400, name:"Sentencing", weakpoints:[{name:"All-Seeing Eye",hp:300}],
        attacks:[{name:"Life Sentence",dmg:999,type:'instant_ko'},{name:"Double Jeopardy",dmg:30,type:'cross_laser'},{name:"Final Judgment",dmg:999,type:'screen_slam'}] }
    ],
    interlude:null,
    unlockPerk:null
  },
  {
    id:'diktador', name:"Ang Multong Diktador", zone:'secret', totalHp:2000,
    phases:[
      { hp:1000, name:"Iron Fist", weakpoints:[],
        attacks:[{name:"Dekada '70",dmg:15,type:'march_skeletons'},{name:"Salvage Squad",dmg:30,type:'ghost_grab'},{name:"Curse of Impunity",dmg:0,type:'damage_curse'}] },
      { hp:1000, name:"EDSA Spirit", weakpoints:[{name:"Throne",hp:500}],
        attacks:[{name:"People Power",dmg:0,type:'infinite_prayer'},{name:"Final Stand",dmg:20,type:'desperation'}] }
    ],
    interlude:null,
    unlockPerk:null
  }
];

BATO.DIALOGUE = {
  intro:[
    {speaker:"Robin", text:"Bato, delikado na. May warrant na galing ICC. Kailangan na nating umalis!", side:'left'},
    {speaker:"Bato", text:"Saan tayo pupunta? Nasa loob tayo ng Senado, napapaligiran ng... mga trapo.", side:'right'},
    {speaker:"Narrator", text:"[Gunshots, chaos, quick-time run to SUV]", side:'center'},
    {speaker:"Bato V.O.", text:"Ang simula pa lang ito. Gaano ako katagal tatakbo?", side:'center'}
  ],
  boss1_intro:[
    {speaker:"Bato", text:"Ano 'to? Hindi ito ang prusisyon na naaalala ko...", side:'right'},
    {speaker:"Carroza", text:"DELA ROSA... DALA MO ANG KASALANAN NG LANSANGAN. MAGSISI KA!", side:'left'}
  ],
  boss1_intro_san:[
    {speaker:"San Bato", text:"Karumihan! Makakamit mo ang hustisya ng langit.", side:'right'}
  ],
  boss2_intro:[
    {speaker:"Director", text:"DELA ROSA! ITO NA ANG HULING HATOL MO.", side:'left'},
    {speaker:"Bato", text:"Saan mo nakuha budget n'yan? Sa PDAF?", side:'right'}
  ],
  boss2_intro_san:[
    {speaker:"San Bato", text:"Kahit bakal ay walang laban sa banal na apoy.", side:'right'}
  ],
  boss3_intro:[
    {speaker:"Judge", text:"This court finds you... INTERRUPTIBLE.", side:'left'},
    {speaker:"Bato", text:"Handa na akong manindigan.", side:'right'}
  ],
  boss3_intro_san:[
    {speaker:"San Bato", text:"Ang tunay na hukom ay nasa itaas.", side:'right'}
  ],
  boss4_intro_san:[
    {speaker:"San Bato", text:"Ang tunay na hukom ay nasa itaas.", side:'right'}
  ],
  secret_boss_intro:[
    {speaker:"Dictator", text:"Akala mo ba tapos na? Wala nang takas... kahit sa kabilang buhay.", side:'left'},
    {speaker:"Bato", text:"Hindi na kita dapat kinakatakutan.", side:'right'}
  ],
  secret_boss_intro_san:[
    {speaker:"San Bato", text:"Oras na upang linisin ang pinakamadilim na kasalanan.", side:'right'}
  ],
  karaoke_prompt:{text:"Pumili ng kanta:", options:["My Way","Bawal Lumabas"], success:"Perfect! Parang si Regine."},
  mocha_radio:{text:"...ang ICC ay... BZZT... peke!", response:"Papatayin ko na lang."},
  endings:{
    normal:[
      {speaker:"TV", text:"BREAKING: BATO DELA ROSA WANTED - ICC ISSUES ARREST WARRANT", side:'center'},
      {speaker:"Bato", text:"Tuloy ang laban.", side:'right'},
      {speaker:"Narrator", text:"THE SURVIVOR", side:'center'}
    ],
    secret:[
      {speaker:"Narrator", text:"Ascends stairs, receives golden gavel from heavenly figure.", side:'center'},
      {speaker:"Narrator", text:"THE MORAL ASCENDANCY", side:'center'}
    ],
    true:[
      {speaker:"Narrator", text:"ANG PERKS NG PAGIGING SENADOR AY RESPONSABILIDAD, HINDI PRIBILIHIYO.", side:'center'},
      {speaker:"TV", text:"BATO DELA ROSA CLEARED?", side:'center'}
    ]
  }
};

BATO.ACHIEVEMENTS = [
  { id:'takbong_senador', name:"Takbong Senador", desc:"Complete one run.", icon:'flag' },
  { id:'edi_wow_50', name:"Edi Wow!", desc:"Use Edi Wow! perk 50 times.", icon:'star' },
  { id:'bardagulan_expert', name:"Bardagulan Expert", desc:"Win 10 Tulfo Interventions.", icon:'sword' },
  { id:'nasaan_bato', name:"Nasaan ang Bato?", desc:"Survive after using Palit-Ulo.", icon:'mask' },
  { id:'pacquiao_jab', name:"Pacquiao Jab", desc:"Land 1000 punches.", icon:'fist' },
  { id:'divine_comedy', name:"Divine Comedy", desc:"Unlock San Bato.", icon:'halo' },
  { id:'walang_takot', name:"Walang Takot", desc:"Defeat Ghost Dictator.", icon:'skull' },
  { id:'tropang_tricycle', name:"Tropang Tricycle", desc:"Get rescued by tricycle drivers.", icon:'bike' },
  { id:'videoke_king', name:"Videoke King", desc:"Perfect 10 karaoke heals.", icon:'mic' },
  { id:'rosary_collector', name:"Rosary Collector", desc:"Find all 7 Rosary Beads in one run.", icon:'cross' },
  { id:'media_blackout', name:"Media Blackout", desc:"Complete a run with 0 Media Heat.", icon:'tv' }
];
