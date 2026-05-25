var BATO = window.BATO || {};

BATO.AudioManager = {
  ctx: null, masterVolume: 0.5, sfxVolume: 0.7, musicVolume: 0.4,
  musicPlaying: false, currentMusic: null, _initialized: false,

  init(){
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._initialized = true;
    } catch(e){}
  },

  resume(){
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } else if (!this._initialized) {
      this.init();
    }
  },

  playNote(freq, dur, type='square', vol=0.15, delay=0){
    if(!this.ctx) return;
    try {
      if(this.ctx.state === 'suspended') this.ctx.resume();
      let t = this.ctx.currentTime + delay;
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol * this.sfxVolume * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch(e){}
  },

  playMelody(notes, type='square', vol=0.12, tempo=200){
    let beat = 60/tempo;
    notes.forEach((n,i)=>{ if(n>0) this.playNote(n, beat*0.8, type, vol, i*beat); });
  },

  playSfx(name){
    if(!this.ctx) return;
    try {
      if(this.ctx.state === 'suspended') this.ctx.resume();
      switch(name){
        case 'hit': this.playNote(200,0.08,'square',0.12); this.playNote(150,0.1,'square',0.1,0.05); break;
        case 'jump': this.playNote(400,0.1,'square',0.08); this.playNote(600,0.08,'square',0.06,0.05); break;
        case 'coin': this.playNote(800,0.05,'square',0.08); this.playNote(1200,0.08,'square',0.08,0.06); break;
        case 'dmg': this.playNote(120,0.15,'sawtooth',0.1); this.playNote(80,0.2,'sawtooth',0.08,0.08); break;
        case 'special': this.playNote(300,0.3,'square',0.1); this.playNote(500,0.25,'square',0.08,0.15); this.playNote(700,0.2,'square',0.08,0.3); break;
        case 'slipper': this.playNote(500,0.06,'square',0.06); this.playNote(700,0.04,'square',0.05,0.03); break;
        case 'heal': this.playNote(523,0.15,'sine',0.12); this.playNote(659,0.15,'sine',0.1,0.15); this.playNote(784,0.2,'sine',0.1,0.3); break;
        case 'death': this.playNote(300,0.3,'sawtooth',0.15); this.playNote(200,0.4,'sawtooth',0.12,0.2); this.playNote(100,0.6,'sawtooth',0.1,0.4); break;
        case 'boss': this.playNote(100,0.4,'sawtooth',0.15); this.playNote(80,0.5,'sawtooth',0.12,0.3); this.playNote(60,0.6,'sawtooth',0.1,0.5); break;
        case 'ui_select': this.playNote(600,0.05,'square',0.06); break;
        case 'ui_confirm': this.playNote(800,0.08,'square',0.08); this.playNote(1000,0.06,'square',0.06,0.06); break;
        case 'perk': this.playNote(400,0.1,'sine',0.1); this.playNote(600,0.1,'sine',0.08,0.1); this.playNote(800,0.15,'sine',0.08,0.2); break;
        case 'achieve': this.playNote(523,0.15,'sine',0.12); this.playNote(659,0.15,'sine',0.1,0.15); this.playNote(784,0.15,'sine',0.1,0.3); this.playNote(1047,0.3,'sine',0.12,0.45); break;
        case 'heat_up': this.playNote(300,0.1,'square',0.08); this.playNote(400,0.08,'square',0.06,0.08); break;
      }
    } catch(e){}
  },

  playMusic(type='zone1'){
    if(!this.ctx) return;
    let melodies = {
      zone1:[262,330,392,523,392,330,262,330,392,330,440,392],
      zone2:[220,262,330,392,330,262,220,262,330,262,349,330],
      zone3:[196,262,311,392,311,262,196,262,311,262,349,311],
      boss:[130,155,196,262,196,155,130,155,196,155,262,196],
      menu:[262,330,392,523,659,523,392,330],
      secret_boss:[110,131,165,196,165,131,110,131,165,131,196,165]
    };
    let notes = melodies[type] || melodies.zone1;
    if(this.currentMusic) clearInterval(this.currentMusic);
    this.musicPlaying = true;
    let idx=0, self=this, tempo=200, beat=60/tempo;
    this.currentMusic = setInterval(()=>{
      if(!self.musicPlaying || !self.ctx){ clearInterval(self.currentMusic); return; }
      if(self.ctx.state==='suspended') return;
      let n=notes[idx%notes.length];
      self.playNote(n, beat*0.7, 'square', 0.06 * self.musicVolume * self.masterVolume);
      idx++;
    }, beat*1000);
  },

  stopMusic(){ this.musicPlaying = false; if(this.currentMusic){ clearInterval(this.currentMusic); this.currentMusic=null; } },
  setVolume(v){ this.masterVolume = BATO.Utils.clamp(v,0,1); },
  setSfxVol(v){ this.sfxVolume = BATO.Utils.clamp(v,0,1); },
  setMusicVol(v){ this.musicVolume = BATO.Utils.clamp(v,0,1); }
};
