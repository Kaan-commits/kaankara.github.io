/* =========================================================
   Ducks & Dragons — istemci
   Ağ, zar animasyonları, harita çizimi, kontroller ve arayüz.
   Frozen Duck Games
   ========================================================= */
"use strict";

/* ---------------- Metinler (TR / EN) ---------------- */
i18n.extend({
  tr: {
    "dd.defaultName": "Ördek",
    "dd.endings": "Bulunan sonlar: {n}/{m}",
    "dd.players": "Oyuncular",
    "dd.lobby.solo": "Grubunu kur",
    "dd.lobby.online": "Kahramanını seç",
    "dd.lobby.soloHint": "1-6 kahraman seç; hepsini sen yönetirsin. 3-4 kahraman önerilir.",
    "dd.lobby.onlineHint": "Her sınıfı yalnızca bir oyuncu seçebilir. Kodu arkadaşlarına gönder.",
    "dd.start": "Maceraya başla",
    "dd.startN": "Maceraya başla ({n} kahraman)",
    "dd.waitHost": "Ev sahibinin başlatması bekleniyor…",
    "dd.pickFirst": "Önce bir sınıf seç.",
    "dd.copied": "Link kopyalandı!",
    "dd.you": "sen",
    "dd.host": "ev sahibi",
    "dd.takenBy": "{name} seçti",
    "dd.yours": "Senin",
    "dd.noPick": "seçmedi",
    "dd.hp": "Can",
    "dd.ac": "ZS",
    "dd.speedL": "Hız",
    "dd.lvl": "Sv {n}",
    "dd.profs": "uzman",
    "dd.room": "ODA",
    "dd.soloLabel": "TEK KİŞİLİK",
    "dd.round": "Tur {n}",
    "dd.yourTurn": "Sıra sende: {name}",
    "dd.turnOf": "Sıra: {name}",
    "dd.moveLeft": "👟 {n} kare",
    "dd.actionTag": "Eylem",
    "dd.bonusTag": "Ek",
    "dd.endTurn": "Turu bitir",
    "dd.deathSave": "Ölüm kurtarma zarı at",
    "dd.dsHint": "Baygınsın! 10+ başarı, 1-9 başarısızlık. 3 başarı: dengelenirsin. 3 başarısızlık: ölüm. Doğal 20: ayağa kalkarsın!",
    "dd.down": "Baygın",
    "dd.dead": "Öldü",
    "dd.stable": "Dengede",
    "dd.skipTurn": "Sırayı geç",
    "dd.waiting": "{name} düşünüyor…",
    "dd.enemyTurn": "{name} hamle yapıyor…",
    "dd.rolling": "Zarlar dönüyor…",
    "dd.pickTarget": "Hedef seç · Esc: iptal",
    "dd.pickArea": "Alan seç · Esc: iptal",
    "dd.cancel": "İptal",
    "dd.why.used": "Bu tur zaten kullandın.",
    "dd.why.nouses": "Bu savaşta hakkın bitti.",
    "dd.why.noitem": "İksir kalmadı.",
    "dd.why.adjfoe": "Yanında düşman varken olmaz.",
    "dd.why.notarget": "Menzilde hedef yok.",
    "dd.badTarget": "Geçersiz hedef.",
    "dd.hintExplore": "Bir kareye tıkla: yürü · ❗ işaretlilere tıkla: konuş",
    "dd.hintTouch": "Bir kareye dokun: yürü · ❗ işaretlilere dokun: konuş",
    "dd.hintCombat": "Mavi karelere tıkla: yürü · düşmana tıkla: saldır",
    "dd.potionBtn": "İksir ({n})",
    "dd.potionPick": "İksiri kim içsin? Bir kahramana tıkla.",
    "dd.fullHp": "Canı zaten dolu.",
    "dd.lead": "Önde: {name}",
    "dd.hit": "İSABET!",
    "dd.miss": "ISKA",
    "dd.crit": "KRİTİK!",
    "dd.fumble": "KRİTİK ISKA!",
    "dd.ok": "BAŞARILI",
    "dd.fail": "BAŞARISIZ",
    "dd.missShort": "ıska",
    "dd.fumbleShort": "ıska!",
    "dd.resisted": "direndi",
    "dd.vsAC": "ZS {n}",
    "dd.dc": "ZD {n}",
    "dd.dmgL": "Hasar",
    "dd.healL": "İyileşme",
    "dd.check": "{stat} zarı",
    "dd.save": "{stat} kurtarması",
    "dd.luck": "Şans",
    "dd.luckRoll": "Şans zarı",
    "dd.group": "Grup",
    "dd.groupT": "Grup zarı · {stat}",
    "dd.groupRes": "{ok}/{n} başarılı",
    "dd.init": "İnisiyatif",
    "dd.adv": "avantaj",
    "dd.dis": "dezavantaj",
    "dd.k.bless": "Kutsama",
    "dd.k.insp": "İlham",
    "dd.k.sneak": "Sinsi",
    "dd.k.mark": "İşaret",
    "dd.k.poison": "Zehir",
    "dd.half": "yarısı",
    "dd.resist": "dirençli",
    "dd.ds": "Ölüm kurtarma zarı",
    "dd.ds.ok": "Başarı",
    "dd.ds.fail": "Başarısızlık",
    "dd.ds.fail2": "Doğal 1: iki başarısızlık!",
    "dd.ds.revive": "DOĞAL 20! Ayağa kalktı!",
    "dd.ds.stable": "Dengelendi",
    "dd.ds.dead": "Öldü…",
    "dd.asleep": "Uyuyanlar: {names}",
    "dd.nobodySleeps": "Kimse uyumadı.",
    "dd.breath": "Ateş Nefesi",
    "dd.burn": "Yanan ağlar",
    "dd.pool": "Uyku havuzu",
    "dd.whoRolls": "Zarı kim atsın?",
    "dd.cont": "Devam ▸",
    "dd.chance": "%{n}",
    "dd.notEnough": "Yetersiz altın",
    "dd.b.combat": "SAVAŞ!",
    "dd.b.surpriseFoes": "Düşman gafil avlandı!",
    "dd.b.surpriseHeroes": "Gafil avlandınız!",
    "dd.b.victory": "ZAFER!",
    "dd.b.defeat": "YENİLDİNİZ",
    "dd.b.level": "SEVİYE {n}!",
    "dd.b.levelSub": "Canınız arttı · Yeni yetenekler açıldı",
    "dd.b.chapter": "{n}. Bölüm",
    "dd.defeatT": "Grup yenildi",
    "dd.defeatP": "Hepiniz yere serildiniz. Ama her macera bir zar atımı daha hak eder.",
    "dd.retry": "Bölüm başından tekrar dene",
    "dd.waitRetry": "Ev sahibinin kararı bekleniyor…",
    "dd.toMenu": "Ana menü",
    "dd.endT": "SON",
    "dd.endGold": "Toplam altın: {n}",
    "dd.statCrit": "Doğal 20",
    "dd.statOnes": "Doğal 1",
    "dd.statDmg": "Hasar",
    "dd.statHeal": "Şifa",
    "dd.statKills": "Devirdiği",
    "dd.mvp": "Grubun yıldızı",
    "dd.playAgain": "Yeniden oyna",
    "dd.endingsHint": "Başka seçimler, başka sonlar: {n}/{m} sonu buldun.",
    "dd.claimT": "Kahramanını seç",
    "dd.claimP": "Oyun sürüyor. Boştaki bir kahramanı devral ya da yeni bir sınıfla katıl.",
    "dd.claimTake": "Devral",
    "dd.claimNew": "Katıl",
    "dd.claimCombat": "Yeni sınıfla katılmak için savaşın bitmesini bekle.",
    "dd.spectate": "Sadece izle",
    "dd.fast": "Hızlı zar: {s}",
    "dd.on": "açık",
    "dd.off": "kapalı",
    "dd.leaveQ": "Oyundan çıkılsın mı? Tek kişilik oyun her bölüm başında kaydedilir.",
    "dd.log.salve": "Ejderotu merhemi sürüldü: ateş hasarı yarıya iner.",
    "dd.log.breathReady": "{n} derin bir nefes alıyor… 🔥",
    "dd.log.allyLeft": "{n} ağır yaralandı ve ormana çekildi.",
    "dd.l.down": "{t} baygın düştü!",
    "dd.l.dead": "{t} öldü…",
    "dd.l.kill": "{a}, {t} rakibini devirdi!",
    "dd.l.killNoA": "{t} devrildi!",
    "dd.l.skip.stun": "{t} sersem, sırasını kaçırdı.",
    "dd.l.skip.sleep": "{t} uyuyor, sırasını kaçırdı.",
    "dd.l.skip.surprise": "{t} gafil avlandı, sırasını kaçırdı.",
    "dd.l.lvl": "Grup {n}. seviyeye ulaştı!",
    "dd.l.ds.ok": "başarı",
    "dd.l.ds.fail": "başarısızlık",
    "dd.l.ds.fail2": "iki başarısızlık",
    "dd.l.ds.revive": "ayağa kalktı!",
    "dd.l.ds.stable": "dengelendi",
    "dd.l.ds.dead": "öldü",
    "dd.hintTalk": "İpucu: ❗ işaretli karakterlere tıklayarak konuş.",
    "dd.joined": "{name} katıldı",
    "dd.left": "{name} ayrıldı; kahramanını ev sahibi yönetiyor.",
    "dd.claimed": "{name} artık {cls}!",
    "dd.rotate": "Daha iyi görüş için telefonu yan çevir",
    "dd.creating": "Oda oluşturuluyor…",
    "dd.connecting": "Odaya bağlanılıyor…",
    "dd.err.notfound": "Oda bulunamadı. Kodu kontrol et.",
    "dd.err.full": "Oda dolu (en fazla 6 oyuncu).",
    "dd.err.net": "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.",
    "dd.err.closed": "Oda kapandı.",
    "dd.err.lost": "Bağlantı koptu.",
    "dd.err.code": "5 karakterlik oda kodunu yaz.",
    "dd.err.nopeer": "Online sistem yüklenemedi. Tek kişilik modu deneyebilirsin.",
    "dd.saveFound": "Kayıt: {scene} · Sv {lvl}",
    "dd.fireRes": "Ateşe dirençli",
  },
  en: {
    "dd.tag": "Roll the dice, make your choice, face the dragon.",
    "dd.solo": "Play solo",
    "dd.solo.sub": "Build a party and control them all",
    "dd.create": "Create room",
    "dd.create.sub": "Friends join with the code",
    "dd.code": "Room code",
    "dd.join": "Join",
    "dd.continue": "Continue adventure",
    "dd.name": "Your name",
    "dd.how": "How to play",
    "dd.how1": "Every duck in your party has a class and six stats (STR, DEX, CON, INT, WIS, CHA).",
    "dd.how2": "Choices are settled with a d20: roll + modifier must reach the Difficulty Class (DC). A natural 20 always succeeds, a natural 1 always fails.",
    "dd.how3": "Combat is turn-based: on your turn, move, take one action and one bonus action. An attack hits if it reaches the target's Armor Class (AC).",
    "dd.how4": "A hero at 0 HP falls unconscious and rolls death saves. Your choices change how the story ends.",
    "dd.back": "Back",
    "dd.copy": "Copy link",
    "dd.players": "Players",
    "dd.log": "Dice log",
    "dd.tray": "Free dice",
    "dd.trayHint": "Roll a die everyone can see.",
    "dd.chatPh": "Message the party…",
    "dd.menu": "Menu",
    "dd.resume": "Resume",
    "dd.leave": "Leave game",
    "dd.cancelBtn": "Cancel",
    "dd.defaultName": "Duck",
    "dd.endings": "Endings found: {n}/{m}",
    "dd.lobby.solo": "Build your party",
    "dd.lobby.online": "Choose your hero",
    "dd.lobby.soloHint": "Pick 1-6 heroes; you control them all. 3-4 heroes recommended.",
    "dd.lobby.onlineHint": "Each class can be taken by only one player. Send the code to your friends.",
    "dd.start": "Start the adventure",
    "dd.startN": "Start the adventure ({n} heroes)",
    "dd.waitHost": "Waiting for the host to start…",
    "dd.pickFirst": "Pick a class first.",
    "dd.copied": "Link copied!",
    "dd.you": "you",
    "dd.host": "host",
    "dd.takenBy": "Taken by {name}",
    "dd.yours": "Yours",
    "dd.noPick": "no pick",
    "dd.hp": "HP",
    "dd.ac": "AC",
    "dd.speedL": "Speed",
    "dd.lvl": "Lv {n}",
    "dd.profs": "proficient",
    "dd.room": "ROOM",
    "dd.soloLabel": "SOLO",
    "dd.round": "Round {n}",
    "dd.yourTurn": "Your turn: {name}",
    "dd.turnOf": "Turn: {name}",
    "dd.moveLeft": "👟 {n} tiles",
    "dd.actionTag": "Action",
    "dd.bonusTag": "Bonus",
    "dd.endTurn": "End turn",
    "dd.deathSave": "Roll a death save",
    "dd.dsHint": "You're down! 10+ succeeds, 1-9 fails. 3 successes: stable. 3 failures: death. Natural 20: back on your feet!",
    "dd.down": "Down",
    "dd.dead": "Dead",
    "dd.stable": "Stable",
    "dd.skipTurn": "Skip turn",
    "dd.waiting": "{name} is thinking…",
    "dd.enemyTurn": "{name} is acting…",
    "dd.rolling": "Dice are rolling…",
    "dd.pickTarget": "Choose a target · Esc: cancel",
    "dd.pickArea": "Choose an area · Esc: cancel",
    "dd.cancel": "Cancel",
    "dd.why.used": "Already used this turn.",
    "dd.why.nouses": "No uses left this fight.",
    "dd.why.noitem": "No potions left.",
    "dd.why.adjfoe": "Not with a foe next to you.",
    "dd.why.notarget": "No target in range.",
    "dd.badTarget": "Invalid target.",
    "dd.hintExplore": "Click a tile to walk · click ❗ to talk",
    "dd.hintTouch": "Tap a tile to walk · tap ❗ to talk",
    "dd.hintCombat": "Click blue tiles to move · click a foe to attack",
    "dd.potionBtn": "Potion ({n})",
    "dd.potionPick": "Who drinks the potion? Click a hero.",
    "dd.fullHp": "Already at full HP.",
    "dd.lead": "Leading: {name}",
    "dd.hit": "HIT!",
    "dd.miss": "MISS",
    "dd.crit": "CRITICAL!",
    "dd.fumble": "CRITICAL MISS!",
    "dd.ok": "SUCCESS",
    "dd.fail": "FAILURE",
    "dd.missShort": "miss",
    "dd.fumbleShort": "fumble!",
    "dd.resisted": "resisted",
    "dd.vsAC": "AC {n}",
    "dd.dc": "DC {n}",
    "dd.dmgL": "Damage",
    "dd.healL": "Healing",
    "dd.check": "{stat} check",
    "dd.save": "{stat} save",
    "dd.luck": "Luck",
    "dd.luckRoll": "Luck roll",
    "dd.group": "Group",
    "dd.groupT": "Group check · {stat}",
    "dd.groupRes": "{ok}/{n} succeeded",
    "dd.init": "Initiative",
    "dd.adv": "advantage",
    "dd.dis": "disadvantage",
    "dd.k.bless": "Bless",
    "dd.k.insp": "Inspiration",
    "dd.k.sneak": "Sneak",
    "dd.k.mark": "Mark",
    "dd.k.poison": "Poison",
    "dd.half": "half",
    "dd.resist": "resistant",
    "dd.ds": "Death save",
    "dd.ds.ok": "Success",
    "dd.ds.fail": "Failure",
    "dd.ds.fail2": "Natural 1: two failures!",
    "dd.ds.revive": "NATURAL 20! Back up!",
    "dd.ds.stable": "Stabilized",
    "dd.ds.dead": "Died…",
    "dd.asleep": "Asleep: {names}",
    "dd.nobodySleeps": "Nobody fell asleep.",
    "dd.breath": "Fire Breath",
    "dd.burn": "Burning webs",
    "dd.pool": "Sleep pool",
    "dd.whoRolls": "Who rolls?",
    "dd.cont": "Continue ▸",
    "dd.chance": "{n}%",
    "dd.notEnough": "Not enough gold",
    "dd.b.combat": "COMBAT!",
    "dd.b.surpriseFoes": "The enemy is caught off guard!",
    "dd.b.surpriseHeroes": "You're caught off guard!",
    "dd.b.victory": "VICTORY!",
    "dd.b.defeat": "DEFEATED",
    "dd.b.level": "LEVEL {n}!",
    "dd.b.levelSub": "More HP · New abilities unlocked",
    "dd.b.chapter": "Chapter {n}",
    "dd.defeatT": "The party has fallen",
    "dd.defeatP": "Every one of you is down. But every adventure deserves one more roll.",
    "dd.retry": "Retry from the chapter start",
    "dd.waitRetry": "Waiting for the host…",
    "dd.toMenu": "Main menu",
    "dd.endT": "THE END",
    "dd.endGold": "Total gold: {n}",
    "dd.statCrit": "Nat 20",
    "dd.statOnes": "Nat 1",
    "dd.statDmg": "Damage",
    "dd.statHeal": "Healing",
    "dd.statKills": "Takedowns",
    "dd.mvp": "Party MVP",
    "dd.playAgain": "Play again",
    "dd.endingsHint": "Different choices, different endings: you've found {n}/{m}.",
    "dd.claimT": "Pick your hero",
    "dd.claimP": "The game is on. Take over a free hero or join with a new class.",
    "dd.claimTake": "Take over",
    "dd.claimNew": "Join",
    "dd.claimCombat": "Wait for the fight to end to join with a new class.",
    "dd.spectate": "Just watch",
    "dd.fast": "Fast dice: {s}",
    "dd.on": "on",
    "dd.off": "off",
    "dd.leaveQ": "Leave the game? Solo games are saved at the start of each chapter.",
    "dd.log.salve": "Dragonweed salve applied: fire damage is halved.",
    "dd.log.breathReady": "{n} draws a deep breath… 🔥",
    "dd.log.allyLeft": "{n} is badly hurt and slinks back into the woods.",
    "dd.l.down": "{t} falls unconscious!",
    "dd.l.dead": "{t} has died…",
    "dd.l.kill": "{a} takes down {t}!",
    "dd.l.killNoA": "{t} goes down!",
    "dd.l.skip.stun": "{t} is stunned and loses the turn.",
    "dd.l.skip.sleep": "{t} is asleep and loses the turn.",
    "dd.l.skip.surprise": "{t} is caught off guard and loses the turn.",
    "dd.l.lvl": "The party reached level {n}!",
    "dd.l.ds.ok": "success",
    "dd.l.ds.fail": "failure",
    "dd.l.ds.fail2": "two failures",
    "dd.l.ds.revive": "back on their feet!",
    "dd.l.ds.stable": "stabilized",
    "dd.l.ds.dead": "died",
    "dd.hintTalk": "Tip: click characters marked ❗ to talk.",
    "dd.joined": "{name} joined",
    "dd.left": "{name} left; the host now controls their hero.",
    "dd.claimed": "{name} is now the {cls}!",
    "dd.rotate": "Turn your phone sideways for a better view",
    "dd.creating": "Creating room…",
    "dd.connecting": "Joining room…",
    "dd.err.notfound": "Room not found. Check the code.",
    "dd.err.full": "The room is full (max 6 players).",
    "dd.err.net": "Couldn't connect. Check your internet and try again.",
    "dd.err.closed": "The room was closed.",
    "dd.err.lost": "Connection lost.",
    "dd.err.code": "Enter the 5-character room code.",
    "dd.err.nopeer": "The online system couldn't load. You can still play solo.",
    "dd.saveFound": "Save: {scene} · Lv {lvl}",
    "dd.fireRes": "Fire resistant",
  },
});
i18n.apply();

/* ---------------- Ayarlar, profil, kayıt ---------------- */
const store = {
  get(k, def) {
    try {
      const v = localStorage.getItem(k);
      return v === null ? def : JSON.parse(v);
    } catch (e) {
      return def;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  },
};
const settings = Object.assign({ muted: false, fast: false }, store.get("ducksdragons-settings", {}));
const saveSettings = () => store.set("ducksdragons-settings", settings);
const profile = (() => {
  const p = store.get("ducksdragons-profile", {}) || {};
  return {
    name: cleanName(p.name) || `${T("dd.defaultName")}${100 + Math.floor(Math.random() * 900)}`,
    endings: Array.isArray(p.endings) ? p.endings.filter((e) => ENDINGS[e]) : [],
    solo: Array.isArray(p.solo) && p.solo.length ? p.solo.filter((c) => CLASSES[c]) : ["fighter", "wizard", "cleric"],
  };
})();
const saveProfile = () => store.set("ducksdragons-profile", profile);
const SAVE_KEY = "ducksdragons-save";
function saveGame() {
  if (host.checkpoint) store.set(SAVE_KEY, { v: 1, s: host.checkpoint });
}
function clearSave() {
  store.del(SAVE_KEY);
}
function loadSave() {
  const s = store.get(SAVE_KEY, null);
  return s && s.v === 1 && s.s && SCENES[s.s.scene] ? s.s : null;
}

/* ---------------- Ses (WebAudio ile üretilir) ---------------- */
const sfx = {
  ctx: null,
  noise: null,
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  },
  env(vol, dur, t0) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    g.connect(this.ctx.destination);
    return g;
  },
  tone(type, f1, f2, dur, vol, delay = 0) {
    const t0 = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f1, t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
    o.connect(this.env(vol, dur, t0));
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  },
  hiss(freq, q, dur, vol, delay = 0, type = "bandpass") {
    const t0 = this.ctx.currentTime + delay;
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    s.connect(f).connect(this.env(vol, dur, t0));
    s.start(t0, Math.random() * 0.5);
    s.stop(t0 + dur + 0.02);
  },
  play(name) {
    if (!this.ctx || settings.muted) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const arp = (type, fs, d, v, gap) => fs.forEach((f, i) => this.tone(type, f, f, d, v, i * gap));
    switch (name) {
      case "dice":
        for (let i = 0; i < 6; i++) this.hiss(2000 + Math.random() * 2500, 5, 0.035, 0.22, i * 0.07 + Math.random() * 0.02);
        break;
      case "land":
        this.tone("triangle", 240, 110, 0.12, 0.22);
        this.hiss(900, 1, 0.05, 0.16);
        break;
      case "hit":
        this.tone("square", 320, 90, 0.12, 0.14);
        this.hiss(1200, 1, 0.08, 0.22);
        break;
      case "crit":
        arp("square", [523, 659, 784, 1047], 0.1, 0.09, 0.07);
        break;
      case "miss":
        this.hiss(3200, 0.8, 0.16, 0.12, 0, "highpass");
        break;
      case "heal":
        arp("sine", [660, 880, 1320], 0.2, 0.12, 0.08);
        break;
      case "magic":
        this.tone("sine", 420, 1500, 0.3, 0.1);
        this.tone("triangle", 800, 2100, 0.25, 0.05, 0.05);
        break;
      case "fire":
        this.hiss(500, 0.6, 0.55, 0.32, 0, "lowpass");
        this.tone("sawtooth", 130, 60, 0.4, 0.07);
        break;
      case "hurt":
        this.tone("sawtooth", 300, 110, 0.15, 0.13);
        break;
      case "down":
        this.tone("square", 420, 70, 0.55, 0.13);
        break;
      case "kill":
        this.tone("square", 620, 200, 0.18, 0.11);
        this.tone("square", 300, 90, 0.25, 0.09, 0.1);
        break;
      case "coin":
        this.tone("square", 988, 988, 0.06, 0.07);
        this.tone("square", 1319, 1319, 0.14, 0.07, 0.06);
        break;
      case "door":
        this.hiss(320, 0.8, 0.35, 0.26, 0, "lowpass");
        break;
      case "roar":
        this.tone("sawtooth", 170, 45, 1, 0.2);
        this.hiss(420, 0.5, 0.9, 0.28, 0, "lowpass");
        break;
      case "level":
        arp("square", [523, 659, 784, 1047, 1319], 0.12, 0.08, 0.09);
        break;
      case "victory":
        arp("square", [392, 523, 659, 784], 0.16, 0.09, 0.13);
        this.tone("square", 1047, 1047, 0.45, 0.08, 0.55);
        break;
      case "defeat":
        [392, 330, 262, 196].forEach((f, i) => this.tone("triangle", f, f * 0.97, 0.32, 0.14, i * 0.22));
        break;
      case "combat":
        this.tone("sawtooth", 110, 110, 0.16, 0.13);
        this.tone("sawtooth", 147, 147, 0.28, 0.13, 0.16);
        this.hiss(220, 1, 0.35, 0.2, 0, "lowpass");
        break;
      case "step":
        this.hiss(1700, 2, 0.025, 0.05);
        break;
      case "click":
        this.tone("square", 1200, 1200, 0.025, 0.045);
        break;
      case "page":
        this.hiss(4200, 1, 0.07, 0.06, 0, "highpass");
        break;
    }
  },
};

/* ---------------- Ağ (PeerJS, sunucusuz) ---------------- */
const PEER_PREFIX = "ducksdragons-kk-";
const MAX_PLAYERS = 6;
const net = {
  mode: null, // solo | host | client
  myId: "me",
  peer: null,
  conns: new Map(),
  conn: null,
  code: null,
  lastHost: 0,
  lastSeen: new Map(),
  broadcast(msg) {
    if (this.mode !== "host") return;
    for (const c of this.conns.values())
      if (c.open)
        try {
          c.send(msg);
        } catch (e) {}
  },
  send(m) {
    if (this.mode === "client") {
      if (this.conn && this.conn.open) this.conn.send({ t: "i", m });
    } else if (host.on) hostIntent(this.myId, m);
  },
};
const makeCode = () => {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
};
function netAvailable() {
  if (typeof Peer === "undefined") {
    toast(T("dd.err.nopeer"), 4000);
    return false;
  }
  return true;
}

function createRoom(attempt = 0) {
  if (!netAvailable()) return;
  showLoading(T("dd.creating"));
  const code = makeCode();
  const peer = new Peer(PEER_PREFIX + code, { debug: 0 });
  net.peer = peer;
  peer.on("open", (id) => {
    if (net.peer !== peer) return;
    hideLoading();
    net.mode = "host";
    net.myId = id;
    net.code = code;
    host.on = true;
    logs = [];
    st = newState("host");
    st.code = code;
    st.players[id] = { name: profile.name };
    history.replaceState(null, "", `?oda=${code}`);
    sync();
  });
  peer.on("connection", (conn) => setupHostConn(conn));
  peer.on("disconnected", () => {
    if (net.peer === peer && !peer.destroyed) peer.reconnect();
  });
  peer.on("error", (err) => {
    if (net.peer !== peer) return;
    if (err.type === "unavailable-id" && attempt < 3) {
      peer.destroy();
      createRoom(attempt + 1);
      return;
    }
    if (!st) failToMenu(T("dd.err.net"));
  });
}

function setupHostConn(conn) {
  conn.on("data", (msg) => {
    if (!msg || typeof msg !== "object" || !st || !host.on) return;
    net.lastSeen.set(conn.peer, now());
    if (msg.t === "hello") {
      const known = !!st.players[conn.peer];
      if (!known && Object.keys(st.players).length >= MAX_PLAYERS) {
        conn.send({ t: "full" });
        setTimeout(() => conn.close(), 300);
        return;
      }
      net.conns.set(conn.peer, conn);
      st.players[conn.peer] = { name: cleanName(msg.name) || T("dd.defaultName") };
      conn.send({ t: "welcome", id: conn.peer, code: net.code, s: st, log: logs.slice(-60) });
      if (!known) fx({ k: "toast", key: "dd.joined", v: { name: st.players[conn.peer].name } });
      sync();
      return;
    }
    if (!st.players[conn.peer]) return;
    if (msg.t === "i") hostIntent(conn.peer, msg.m);
  });
  const gone = () => {
    if (net.conns.get(conn.peer) !== conn) return;
    net.conns.delete(conn.peer);
    if (st && host.on) playerLeft(conn.peer);
  };
  conn.on("close", gone);
  conn.on("error", gone);
}

function joinRoom(code) {
  if (!netAvailable()) return;
  code = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length !== 5) {
    toast(T("dd.err.code"));
    return;
  }
  showLoading(T("dd.connecting"));
  const peer = new Peer({ debug: 0 });
  net.peer = peer;
  const timer = setTimeout(() => {
    if (net.peer === peer && !st) failToMenu(T("dd.err.net"));
  }, 15000);
  peer.on("open", () => {
    const conn = peer.connect(PEER_PREFIX + code, { serialization: "json", reliable: true });
    net.conn = conn;
    conn.on("open", () => conn.send({ t: "hello", name: profile.name }));
    conn.on("data", (msg) => {
      if (!msg || typeof msg !== "object" || net.conn !== conn) return;
      net.lastHost = now();
      if (msg.t === "welcome") {
        clearTimeout(timer);
        hideLoading();
        net.mode = "client";
        net.myId = msg.id;
        net.code = msg.code;
        logs = Array.isArray(msg.log) ? msg.log : [];
        st = msg.s;
        history.replaceState(null, "", `?oda=${msg.code}`);
        renderLog(true);
        onState();
      } else if (msg.t === "full") {
        clearTimeout(timer);
        failToMenu(T("dd.err.full"));
      } else if (msg.t === "st") {
        st = msg.s;
        onState();
      } else if (msg.t === "fx") handleFx(msg.e);
      else if (msg.t === "mv" && st) {
        const c = cr(msg.id);
        if (c) {
          c.x = msg.x;
          c.y = msg.y;
          c.face = msg.f;
        }
      }
    });
    conn.on("close", () => {
      if (net.conn === conn) failToMenu(T("dd.err.closed"));
    });
  });
  peer.on("disconnected", () => {
    if (net.peer === peer && !peer.destroyed) peer.reconnect();
  });
  peer.on("error", (err) => {
    if (net.peer !== peer) return;
    clearTimeout(timer);
    failToMenu(err.type === "peer-unavailable" ? T("dd.err.notfound") : T("dd.err.net"));
  });
}

function heartbeat() {
  if (net.mode === "host" && st) {
    net.broadcast({ t: "ping" });
    const t = now();
    for (const [id, c] of net.conns) {
      if (t - (net.lastSeen.get(id) || t) > 12000) {
        net.conns.delete(id);
        try {
          c.close();
        } catch (e) {}
        playerLeft(id);
      }
    }
  } else if (net.mode === "client" && net.conn) {
    if (net.conn.open) net.conn.send({ t: "ping" });
    if (st && now() - net.lastHost > 15000) failToMenu(T("dd.err.lost"));
  }
}
setInterval(heartbeat, 3000);
setInterval(() => exploreTick(), 150);

/* ---------------- Oyuna başla / çık ---------------- */
function startSolo(picks) {
  net.mode = "solo";
  net.myId = "me";
  host.on = true;
  logs = [];
  renderLog(true);
  st = newState("solo");
  st.players.me = { name: profile.name };
  profile.solo = picks.slice();
  saveProfile();
  const list = CLASS_ORDER.filter((c) => picks.includes(c)).map((c) => ({ cls: c, owner: "me", pname: null }));
  run(() => hostNewGame(list));
  sfx.play("page");
}
function continueSolo() {
  const s = loadSave();
  if (!s) return;
  net.mode = "solo";
  net.myId = "me";
  host.on = true;
  logs = [];
  renderLog(true);
  st = s;
  st.hostId = "me";
  st.speed = settings.fast ? 0.55 : 1;
  st.busy = false;
  st.players = { me: { name: profile.name } };
  st.heroes.forEach((h) => (h.owner = "me"));
  host.checkpoint = clone(st);
  host.paths.clear();
  buildGrid();
  sync();
  fx({ k: "banner", t: "scene", s: st.scene });
}
function leaveGame() {
  host.on = false;
  host.paths.clear();
  if (net.peer) {
    const p = net.peer;
    net.peer = null;
    try {
      p.destroy();
    } catch (e) {}
  }
  net.conn = null;
  net.conns.clear();
  net.mode = null;
  net.myId = "me";
  st = null;
  grid = null;
  view = null;
  ui.sel = null;
  ui.potion = false;
  ui.spectate = false;
  vis.clear();
  ["pause", "defeat", "ending", "claim", "dialog", "dice", "logPanel", "tray", "banner"].forEach((id) => ($(id).hidden = true));
  history.replaceState(null, "", location.pathname);
  showScreen("menu");
  renderMenu();
}
function failToMenu(msg) {
  hideLoading();
  leaveGame();
  toast(msg, 4000);
}

/* =========================================================
   İstemci görünümü
   ========================================================= */
const ui = {
  screen: "menu",
  lead: null,
  sel: null,
  potion: false,
  hover: null,
  mouse: null,
  reach: null,
  reachKey: "",
  dlgHero: null,
  dlgSig: "",
  hudSig: "",
  zoom: 0,
  lastActor: null,
  spectate: false,
  soloPicks: new Set(profile.solo),
  floats: [],
  parts: [],
  anims: [],
  bubbles: [],
  flash: {},
  deathT: {},
  clickFx: null,
  tipUntil: 0,
};
const vis = new Map();
let logs = [];

const myHeroes = () => (st ? st.heroes.filter((h) => h.owner === net.myId) : []);
const isMine = (c) => !!(c && c.hero && c.owner === net.myId);
function isMyTurn() {
  if (!st || st.phase !== "combat" || !st.combat) return false;
  return isMine(cur());
}
function spriteKey(c) {
  if (!c) return null;
  if (c.hero) return `hero:${c.cls}`;
  if (c.sp === "fire") return Math.floor(now() / 180) % 2 ? "obj:fire1" : "obj:fire0";
  return c.sp;
}
const portrait = (c) => ART.spriteURL(c && c.hero ? `hero:${c.cls}` : c && c.sp === "fire" ? "obj:fire0" : c ? c.sp : "ui:scroll");

function onState() {
  if (!st) return;
  if (st.scene && (!grid || grid.key !== `${st.scene}|${st.tmods.length}`)) buildGrid();
  ensureView();
  showScreen(st.phase === "lobby" ? "lobby" : "game");
  const mine = myHeroes();
  if (!mine.find((h) => h.id === ui.lead)) ui.lead = mine.length ? mine[0].id : null;
  const c = st.combat ? cur() : null;
  const actor = c ? c.id : null;
  if (actor !== ui.lastActor) {
    ui.lastActor = actor;
    ui.sel = null;
    cam.manual = 0;
    if (isMine(c)) sfx.play("click");
  }
  if (!isMyTurn() || st.busy) ui.sel = null;
  if (st.phase !== "explore") ui.potion = false;
  computeReach();
  if (st.phase === "lobby") renderLobby();
  else {
    renderHud();
    renderDialog();
    renderOverlays();
  }
  if (st.phase === "end" && st.ending && !profile.endings.includes(st.ending)) {
    profile.endings.push(st.ending);
    saveProfile();
  }
}

function computeReach() {
  if (!isMyTurn() || st.busy) {
    ui.reach = null;
    ui.reachKey = "";
    return;
  }
  const c = cur();
  if (c.down || st.combat.move <= 0) {
    ui.reach = null;
    ui.reachKey = "";
    return;
  }
  const key = `${c.id}|${c.x},${c.y}|${st.combat.move}|${combatants().map((o) => `${o.x},${o.y}`).join(";")}`;
  if (key === ui.reachKey) return;
  ui.reachKey = key;
  ui.reach = bfs(c, st.combat.move);
}

/* ---------------- Görsel efekt olayları ---------------- */
function handleFx(e) {
  if (!e) return;
  switch (e.k) {
    case "roll":
      showRoll(e);
      break;
    case "float":
      addFloat(e);
      break;
    case "anim":
      addAnim(e);
      break;
    case "banner":
      showBanner(e);
      break;
    case "toast":
      toast(e.key ? T(e.key, mapVars(e.v)) : L(e.m), 3000);
      break;
    case "log":
      addLog(e.e);
      break;
    case "sfx":
      sfx.play(e.s);
      break;
    case "chat":
      addLog({ k: "chat", n: e.n, txt: e.txt });
      if (e.id) ui.bubbles.push({ id: e.id, txt: e.txt, t: now() });
      if (ui.bubbles.length > 6) ui.bubbles.shift();
      sfx.play("click");
      break;
  }
}
function mapVars(v) {
  const o = {};
  for (const k in v || {}) o[k] = esc(L(v[k]));
  return o;
}

/* ---------------- Zar kutusu ---------------- */
const DIE_SHAPES = {
  4: { p: "20,4 37,35 3,35", l: "" },
  6: { p: "5,5 35,5 35,35 5,35", l: "" },
  8: { p: "20,2 37,20 20,38 3,20", l: "M3,20 L37,20" },
  10: { p: "20,2 37,16 20,38 3,16", l: "M3,16 L20,24 L37,16 M20,24 L20,38" },
  12: { p: "20,2 37,14 31,36 9,36 3,14", l: "M20,9 L30,16 L26,28 L14,28 L10,16 Z" },
  20: { p: "20,2 36,11 36,29 20,38 4,29 4,11", l: "M20,9 L31,27 L9,27 Z M20,9 L20,2 M20,9 L4,11 M20,9 L36,11 M31,27 L36,11 M31,27 L36,29 M31,27 L20,38 M9,27 L4,11 M9,27 L4,29 M9,27 L20,38" },
};
DIE_SHAPES[100] = DIE_SHAPES[10];
function dieHTML(sides, val, o = {}) {
  const sh = DIE_SHAPES[sides] || DIE_SHAPES[6];
  const cls = `die d${sides}${o.big ? " big" : ""}${o.drop ? " drop" : ""}${o.k ? " k-" + o.k : ""}`;
  return `<span class="${cls}" data-s="${sides}" data-f="${val}"><svg viewBox="0 0 40 40" aria-hidden="true"><polygon points="${sh.p}"/>${sh.l ? `<path d="${sh.l}"/>` : ""}</svg><b>${val}</b></span>`;
}
const statN = (s) => (s ? L(STAT_NAME[s]) : T("dd.luck"));
const abN = (id) => (id === "breath" ? T("dd.breath") : id === "burn" ? T("dd.burn") : id && ABIL[id] ? L(ABIL[id].name) : "");
function toneOf(id, foe) {
  const c = id && st ? cr(id) : null;
  if (c && c.hero) return CLASSES[c.cls].color;
  if (c && c.ally) return "#c8a070";
  return foe || (c && c.side === "foe") ? "#ff4d5e" : "#ffd23f";
}
function exHTML(ex) {
  return (ex || []).map((x) => ` <i class="ex">+${x.r}<small>${T("dd.k." + x.k)}</small></i>`).join("");
}
function d20Row(e) {
  const d = e.d || [];
  return d
    .map((v, i) => {
      const drop = d.length > 1 && ((e.adv > 0 && v < Math.max(...d)) || (e.adv < 0 && v > Math.min(...d)) || (v === d[0] && i === 1 && d[0] === d[1]));
      return dieHTML(20, v, { big: true, drop });
    })
    .join("");
}
function dmgLine(dm, label) {
  if (!dm) return "";
  const dice = dm.parts.map((p) => dieHTML(p.d, p.r, { k: p.k })).join("");
  const notes = (dm.notes || []).includes("half") ? ` <small>(${T("dd.resist")})</small>` : "";
  return `<div class="ddmg rv2"><span class="lbl">${label}</span>${dice}${dm.mod ? `<i>${fmtMod(dm.mod)}</i>` : ""}<span class="eq">=</span><b>${dm.tot}</b>${notes}</div>`;
}
function rowsHTML(rows, kind) {
  return `<ul class="drows">${rows
    .map((r) => {
      const c = st && cr(r.id);
      const img = c ? `<img src="${portrait(c)}" alt="">` : "";
      let rs = "";
      if (kind === "init") rs = "";
      else if (kind === "saves") rs = `${r.ok ? "✔" : "✖"} <b>${r.amt}</b>`;
      else if (kind === "volley") rs = r.ok ? `✔ <b>${r.amt}</b>` : "✖";
      else rs = r.ok ? "✔" : "✖";
      const mod = r.mod !== undefined ? `<i>${fmtMod(r.mod)}</i>` : "";
      return `<li class="${kind === "init" ? "" : r.ok ? "ok" : "no"}">${img}<span class="nm">${esc(L(r.n))}</span>${dieHTML(20, r.used !== undefined ? r.used : r.d, {})}${mod}${exHTML(r.ex)}<span class="tot">= ${r.tot}</span><span class="rs rv">${rs}</span></li>`;
    })
    .join("")}</ul>`;
}
function verdict(res) {
  const map = { hit: ["hit", "dd.hit"], crit: ["crit", "dd.crit"], miss: ["miss", "dd.miss"], fumble: ["fumble", "dd.fumble"], ok: ["hit", "dd.ok"], fail: ["miss", "dd.fail"] };
  const m = map[res];
  return m ? `<div class="dver rv ${m[0]}">${T(m[1])}</div>` : "";
}

function rollHTML(e) {
  const who = e.wn ? esc(L(e.wn)) : "";
  let title = "";
  let body = "";
  switch (e.kind) {
    case "atk":
      title = `${who} → ${esc(L(e.tn))} · ${esc(L(e.name))}`;
      body = `<div class="ddice">${d20Row(e)}</div>
        ${e.adv ? `<div class="dadv">${T(e.adv > 0 ? "dd.adv" : "dd.dis")}</div>` : ""}
        <div class="dsum rv"><span class="nat">${e.used}</span> <i>${fmtMod(e.mod)}</i>${exHTML(e.ex)} = <b>${e.tot}</b> <span class="vs">${T("dd.vsAC", { n: e.vs })}</span></div>
        ${verdict(e.res)}${dmgLine(e.dmg, T("dd.dmgL"))}`;
      break;
    case "chk":
      title = `${who} · ${e.s ? T("dd.check", { stat: L(STAT_LONG[e.s]) }) : T("dd.luckRoll")}`;
      body = `<div class="ddice">${d20Row(e)}</div>
        <div class="dsum rv"><span class="nat">${e.used}</span> <i>${fmtMod(e.mod)}</i>${exHTML(e.ex)} = <b>${e.tot}</b> <span class="vs">${T("dd.dc", { n: e.vs })}</span></div>
        ${verdict(e.res)}`;
      break;
    case "group":
      title = `${T("dd.groupT", { stat: statN(e.s) })} · ${T("dd.dc", { n: e.dc })}`;
      body = `${rowsHTML(e.rows, "group")}<div class="dver rv ${e.ok ? "hit" : "miss"}">${T("dd.groupRes", { ok: e.good, n: e.rows.length })} · ${T(e.ok ? "dd.ok" : "dd.fail")}</div>`;
      break;
    case "saves":
      title = `${who ? who + " · " : ""}${abN(e.ab) ? abN(e.ab) + " · " : ""}${T("dd.save", { stat: statN(e.s) })} ${T("dd.dc", { n: e.dc })}`;
      body = `${dmgLine(e.dmg, T("dd.dmgL")).replace("rv2", "")}${rowsHTML(e.rows, "saves")}`;
      break;
    case "volley":
      title = `${who} · ${abN(e.ab)}`;
      body = rowsHTML(e.rows, "volley");
      break;
    case "init":
      title = T("dd.init");
      body = rowsHTML(e.rows, "init");
      break;
    case "heal":
      title = `${who ? who + " → " : ""}${esc(L(e.tn))} · ${abN(e.ab)}`;
      body = `<div class="ddmg heal">${e.parts.map((p) => dieHTML(p.d, p.r)).join("")}${e.mod ? `<i>${fmtMod(e.mod)}</i>` : ""}<span class="eq">=</span><b>+${e.tot}</b></div>`;
      break;
    case "dmg":
      title = `${who ? who + " → " : ""}${e.tn ? esc(L(e.tn)) + " · " : ""}${abN(e.ab)}`;
      body = `<div class="ddmg">${e.parts.map((p) => dieHTML(p.d, p.r)).join("")}${e.mod ? `<i>${fmtMod(e.mod)}</i>` : ""}<span class="eq">=</span><b>${e.tot}</b></div>`;
      break;
    case "ds": {
      title = `${who} · ${T("dd.ds")}`;
      const pip = (n, ch, cls) => Array.from({ length: 3 }, (_, i) => `<span class="pip ${i < n ? cls : ""}">${ch}</span>`).join("");
      body = `<div class="ddice">${d20Row(e)}</div><div class="dver rv ${["ok", "stable", "revive"].includes(e.res) ? (e.res === "revive" ? "crit" : "hit") : "fumble"}">${T("dd.ds." + e.res)}</div>
        <div class="dpips rv">${pip(e.ds[0], "✔", "s")}<span class="sep"></span>${pip(e.ds[1], "✖", "f")}</div>`;
      break;
    }
    case "sleep":
      title = `${who} · ${abN(e.ab)}`;
      body = `<div class="ddmg"><span class="lbl">${T("dd.pool")}</span>${e.parts.map((p) => dieHTML(p.d, p.r)).join("")}<span class="eq">=</span><b>${e.tot}</b></div>
        <div class="dver rv ${e.names.length ? "hit" : "miss"}">${e.names.length ? T("dd.asleep", { names: e.names.map((n) => esc(L(n))).join(", ") }) : T("dd.nobodySleeps")}</div>`;
      break;
    case "free":
      title = `${who} · d${e.die}`;
      body = `<div class="ddice">${dieHTML(e.die, e.used, { big: true })}</div>`;
      break;
  }
  const tone = toneOf(e.who, e.foe);
  const crit = e.res === "crit" || e.res === "revive";
  return `<div class="dcard${crit ? " is-crit" : ""}${e.foe ? " is-foe" : ""}" style="--dc:${tone}"><div class="dt">${title}</div>${body}</div>`;
}

let rollTimers = [];
function rollDuration(e) {
  if (e.kind === "init") return D.init + e.rows.length * 60;
  if (["group", "saves", "volley"].includes(e.kind)) return D.group + e.rows.length * 130;
  if (["heal", "dmg"].includes(e.kind)) return D.rollShort;
  if (e.kind === "free") return 1600;
  return D.roll + (e.dmg ? 250 : 0);
}
function showRoll(e) {
  rollTimers.forEach((t) => clearTimeout(t));
  rollTimers = [];
  const box = $("dice");
  box.innerHTML = rollHTML(e);
  box.hidden = false;
  const card = box.firstElementChild;
  const sp = st ? st.speed : 1;
  const spin = (e.kind === "init" ? 700 : 620) * sp;
  sfx.play("dice");
  const dice = [...card.querySelectorAll(".die")];
  const iv = setInterval(() => dice.forEach((d) => (d.lastElementChild.textContent = 1 + Math.floor(Math.random() * +d.dataset.s))), 55);
  rollTimers.push(iv);
  rollTimers.push(
    setTimeout(() => {
      clearInterval(iv);
      dice.forEach((d) => (d.lastElementChild.textContent = d.dataset.f));
      card.classList.add("done");
      sfx.play("land");
      if (e.res === "crit" || e.res === "revive") sfx.play("crit");
      if (e.res === "fumble") sfx.play("down");
    }, spin)
  );
  rollTimers.push(setTimeout(() => (box.hidden = true), rollDuration(e) * sp + 450));
}

/* ---------------- Afiş ---------------- */
let bannerTimer = 0;
function showBanner(e) {
  const el = $("banner");
  let title = "";
  let sub = "";
  let cls = "";
  if (e.t === "scene") {
    title = L(SCENES[e.s].name);
    sub = T("dd.b.chapter", { n: SCENE_ORDER.indexOf(e.s) + 1 });
    cls = "scene";
    sfx.play("page");
  } else if (e.t === "combat") {
    title = T("dd.b.combat");
    sub = e.sp === "foes" ? T("dd.b.surpriseFoes") : e.sp === "heroes" ? T("dd.b.surpriseHeroes") : "";
    cls = "combat";
  } else if (e.t === "victory") {
    title = T("dd.b.victory");
    cls = "victory";
  } else if (e.t === "defeat") {
    title = T("dd.b.defeat");
    cls = "defeat";
  } else if (e.t === "level") {
    title = T("dd.b.level", { n: e.n });
    sub = T("dd.b.levelSub");
    cls = "level";
  }
  el.className = `banner ${cls}`;
  el.innerHTML = `<strong>${esc(title)}</strong>${sub ? `<span>${esc(sub)}</span>` : ""}`;
  el.hidden = false;
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "";
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => (el.hidden = true), 1900);
}

/* ---------------- Kayıt defteri ---------------- */
function addLog(e) {
  logs.push(e);
  if (logs.length > 200) logs.splice(0, logs.length - 200);
  if (!$("logPanel").hidden) {
    const li = document.createElement("li");
    li.innerHTML = logLine(e);
    $("logList").appendChild(li);
    $("logList").scrollTop = 1e9;
  } else if (e.k === "chat") $("btnLog").classList.add("ping");
}
function logLine(e) {
  const n = (x) => `<b>${esc(L(x))}</b>`;
  const sumS = (e) => `${e.used}${fmtMod(e.mod)}${e.ex ? fmtMod(e.ex) : ""}=${e.tot}`;
  switch (e.k) {
    case "atk": {
      const rs = { hit: T("dd.hit"), crit: T("dd.crit"), miss: T("dd.miss"), fumble: T("dd.fumble") }[e.r];
      return `⚔️ ${n(e.a)} → ${n(e.t)} <small>${esc(L(e.n))}</small> · 🎲${sumS(e)} vs ${T("dd.vsAC", { n: e.ac })} · <em class="${e.r}">${rs}</em>${e.dmg ? ` <span class="dm">-${e.dmg}</span>` : ""}`;
    }
    case "chk":
      return `🎲 ${n(e.h)} ${statN(e.s)} · ${sumS(e)} vs ${T("dd.dc", { n: e.dc })} · <em class="${e.ok ? "hit" : "miss"}">${T(e.ok ? "dd.ok" : "dd.fail")}</em>`;
    case "grp":
      return `👥 ${T("dd.groupT", { stat: statN(e.s) })} vs ${T("dd.dc", { n: e.dc })} · ${T("dd.groupRes", { ok: e.good, n: e.of })} · <em class="${e.ok ? "hit" : "miss"}">${T(e.ok ? "dd.ok" : "dd.fail")}</em>`;
    case "save":
      return `🛡️ ${n(e.t)} ${T("dd.save", { stat: statN(e.s) })}${e.ab ? ` <small>(${abN(e.ab)})</small>` : ""} · ${e.used}→${e.tot} vs ${T("dd.dc", { n: e.dc })} · <em class="${e.ok ? "hit" : "miss"}">${e.ok ? "✔" : "✖"}</em>${e.dmg ? ` <span class="dm">-${e.dmg}</span>` : ""}`;
    case "auto":
      return `✨ ${n(e.a)} → ${n(e.t)} <small>${abN(e.ab)}</small> <span class="dm">-${e.dmg}</span>`;
    case "heal":
      return `💚 ${e.a ? n(e.a) + " → " : ""}${n(e.t)} <small>${abN(e.ab)}</small> <span class="hl">+${e.amt}</span>`;
    case "use":
      return `${ABIL[e.ab] ? ABIL[e.ab].icon : "✨"} ${n(e.a)}: ${abN(e.ab)}${e.t ? " → " + n(e.t) : ""}`;
    case "sleep":
      return `💤 ${n(e.a)} · ${e.n} · ${e.names.length ? e.names.map((x) => esc(L(x))).join(", ") : "—"}`;
    case "ds":
      return `💀 ${n(e.h)} ${T("dd.ds")}: 🎲${e.used} · ${T("dd.l.ds." + e.res)}`;
    case "down":
      return `🩸 ${T("dd.l.down", { t: n(e.t) })}`;
    case "dead":
      return `☠️ ${T("dd.l.dead", { t: n(e.t) })}`;
    case "kill":
      return `💥 ${e.a ? T("dd.l.kill", { a: n(e.a), t: n(e.t) }) : T("dd.l.killNoA", { t: n(e.t) })}`;
    case "init":
      return `⏱️ ${T("dd.init")}: ${e.rows.map(([x, t]) => `${esc(L(x))} ${t}`).join(" · ")}`;
    case "skip":
      return `💫 ${T("dd.l.skip." + e.why, { t: n(e.t) })}`;
    case "lvl":
      return `⭐ ${T("dd.l.lvl", { n: e.n })}`;
    case "txt":
      return `📜 ${T(e.m, mapVars(e.v))}`;
    case "opt":
      return `➤ ${n(e.h)}: “${esc(L(e.l))}”`;
    case "free":
      return `🎲 ${n(e.n)} d${e.d} → <b>${e.r}</b>`;
    case "chat":
      return `💬 ${n(e.n)}: ${esc(e.txt)}`;
  }
  return "";
}
function renderLog(reset) {
  const list = $("logList");
  if (reset || !$("logPanel").hidden) {
    list.innerHTML = logs.map((e) => `<li>${logLine(e)}</li>`).join("");
    list.scrollTop = 1e9;
  }
}

/* =========================================================
   Çizim
   ========================================================= */
const canvas = $("game");
const ctx = canvas.getContext("2d");
let dpr = 1;
let S = 3;
let OX = 0;
let OY = 0;
const isTouch = matchMedia("(pointer: coarse)").matches;
if (isTouch) document.body.classList.add("touch");
const cam = { x: 200, y: 120, manual: 0, init: false };

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  const fit = Math.floor(Math.min(canvas.width / (22 * 16), canvas.height / (13 * 16)));
  const minS = Math.ceil(((isTouch ? 26 : 20) * dpr) / 16);
  S = Math.max(1, Math.max(fit, minS) + ui.zoom);
}
window.addEventListener("resize", resize);
resize();

let view = null;
let lightCv = null;
function ensureView() {
  const playing = st && st.scene && grid;
  const key = playing ? grid.key : "menu";
  if (view && view.key === key) return;
  const sceneId = playing ? st.scene : "village";
  const sc = SCENES[sceneId];
  const rows = playing ? grid.t.map((r) => r.join("")) : sc.map;
  const W = rows[0].length;
  const H = rows.length;
  const water = [];
  const lava = [];
  const torch = [];
  const crystal = [];
  rows.forEach((r, y) =>
    [...r].forEach((ch, x) => {
      if (ch === "~") water.push([x, y]);
      else if (ch === "L") lava.push([x, y]);
      else if (ch === "t") torch.push([x, y]);
      else if (ch === "k") crystal.push([x, y]);
    })
  );
  view = { key, scene: sceneId, W, H, canvas: ART.paintMap(rows, sc.theme, SCENE_ORDER.indexOf(sceneId) + 1), water, lava, torch, crystal, dark: sc.dark || 0, light: null };
  if (view.dark) {
    const LS = 4;
    const c = document.createElement("canvas");
    c.width = W * LS;
    c.height = H * LS;
    const g = c.getContext("2d");
    g.fillStyle = `rgba(6,4,14,${view.dark})`;
    g.fillRect(0, 0, c.width, c.height);
    g.globalCompositeOperation = "destination-out";
    for (const [x, y] of torch) cutLight(g, (x + 0.5) * LS, (y + 0.9) * LS, 3.4 * LS, 0.95);
    for (const [x, y] of crystal) cutLight(g, (x + 0.5) * LS, (y + 0.5) * LS, 2.6 * LS, 0.75);
    for (const [x, y] of lava) cutLight(g, (x + 0.5) * LS, (y + 0.5) * LS, 1.8 * LS, 0.8);
    for (const [x, y, r] of sc.lights || []) cutLight(g, (x + 0.5) * LS, (y + 0.5) * LS, r * LS, 1);
    view.light = { base: c, LS };
    lightCv = document.createElement("canvas");
    lightCv.width = c.width;
    lightCv.height = c.height;
  }
  if (!cam.init || !playing) {
    cam.x = (W * 16) / 2;
    cam.y = (H * 16) / 2;
    cam.init = !!playing;
  }
}
function cutLight(g, x, y, r, a) {
  const grd = g.createRadialGradient(x, y, 0, x, y, r);
  grd.addColorStop(0, `rgba(0,0,0,${a})`);
  grd.addColorStop(0.55, `rgba(0,0,0,${a * 0.7})`);
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(x - r, y - r, r * 2, r * 2);
}

function visOf(c) {
  let v = vis.get(c.id);
  if (!v) {
    v = { x: c.x, y: c.y, moving: false };
    vis.set(c.id, v);
  }
  return v;
}
function drawables() {
  if (!st) return [];
  const t = now();
  const out = [];
  for (const e of st.ents) {
    if (e.hidden) continue;
    if (e.dead && !(ui.deathT[e.id] && t - ui.deathT[e.id] < 650)) continue;
    out.push(e);
  }
  for (const a of st.allies) if (!a.dead) out.push(a);
  for (const h of st.heroes) out.push(h);
  return out;
}
function updateVis(dt) {
  if (!st) return;
  const speed = 8 / (st.speed || 1);
  for (const c of drawables()) {
    const v = visOf(c);
    const dx = c.x - v.x;
    const dy = c.y - v.y;
    const d = Math.hypot(dx, dy);
    if (d > 4) {
      v.x = c.x;
      v.y = c.y;
      v.moving = false;
    } else if (d > 0.001) {
      const s = speed * dt;
      if (d <= s) {
        v.x = c.x;
        v.y = c.y;
      } else {
        v.x += (dx / d) * s;
        v.y += (dy / d) * s;
      }
      v.moving = true;
    } else v.moving = false;
  }
}
const ctr = (c) => {
  const v = vis.get(c.id) || c;
  const sz = c.sz || 1;
  return { x: (v.x + sz / 2) * 16, y: (v.y + sz / 2) * 16 };
};

function camTarget(t) {
  if (!st || !st.scene) {
    return { x: view.W * 8 + Math.sin(t / 6000) * view.W * 4, y: view.H * 8 + Math.cos(t / 8000) * view.H * 3 };
  }
  let c = null;
  if (st.phase === "combat") c = cur();
  if (!c) c = (ui.lead && heroById(ui.lead)) || st.heroes.find((h) => !h.dead);
  if (!c) return { x: cam.x, y: cam.y };
  return ctr(c);
}

function render(t, dt) {
  const W = canvas.width;
  const H = canvas.height;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#0b0810";
  ctx.fillRect(0, 0, W, H);
  ensureView();
  const vw = W / S;
  const vh = H / S;
  const mw = view.W * 16;
  const mh = view.H * 16;
  if (now() > cam.manual) {
    const tg = camTarget(t);
    const k = 1 - Math.exp(-dt * 5);
    cam.x += (tg.x - cam.x) * k;
    cam.y += (tg.y - cam.y) * k;
  }
  // harita sığıyorsa ortala; sığmıyorsa kenarlarda biraz pay bırak (arayüzün altında kalmasın)
  const M = st && st.scene ? 40 : 0;
  cam.x = vw >= mw ? mw / 2 : clamp(cam.x, vw / 2 - M, mw - vw / 2 + M);
  cam.y = vh >= mh ? mh / 2 : clamp(cam.y, vh / 2 - M, mh - vh / 2 + M);
  OX = Math.round(W / 2 - cam.x * S);
  OY = Math.round(H / 2 - cam.y * S);
  ctx.setTransform(S, 0, 0, S, OX, OY);
  ctx.drawImage(view.canvas, 0, 0);
  drawAnimTiles(t);
  if (st && st.scene) {
    drawOverlays(t);
    drawEntities(t);
    drawWorldFx(t);
    if (view.light) drawLight(t);
    drawScreenUI(t);
  } else drawMenuScene(t);
}

function drawAnimTiles(t) {
  const f = Math.floor(t / 420);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  for (let i = 0; i < view.water.length; i++) {
    const [x, y] = view.water[i];
    const h = (x * 73 + y * 151 + f * 37) % 97;
    if (h < 30) ctx.fillRect(x * 16 + (h % 13) + 1, y * 16 + ((h * 7) % 12) + 2, 3, 1);
  }
  for (let i = 0; i < view.lava.length; i++) {
    const [x, y] = view.lava[i];
    const h = (x * 31 + y * 17 + Math.floor(t / 300) * 13) % 53;
    ctx.fillStyle = h < 18 ? "#ffd27a" : "#ff8a3d";
    ctx.fillRect(x * 16 + (h % 12) + 2, y * 16 + ((h * 5) % 11) + 2, 2, 2);
  }
  for (const [x, y] of view.torch) {
    const fl = Math.floor(t / 110 + x * 3) % 3;
    const X = x * 16 + 7;
    const Y = y * 16 + 4;
    ctx.fillStyle = "#ff7a1f";
    ctx.fillRect(X - 1, Y + 1 + (fl === 1 ? 1 : 0), 4, 4 - (fl === 1 ? 1 : 0));
    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(X, Y + 2 + fl % 2, 2, 3 - (fl % 2));
    ctx.fillStyle = "#fff3c0";
    ctx.fillRect(X, Y + 4, 2, 1);
  }
}

function drawOverlays(t) {
  const sc = SCENES[st.scene];
  // çıkış oku
  if (sc.exit && condsOk(sc.exit.req) && st.phase === "explore") {
    const ex = sc.exit;
    const a = 0.5 + 0.5 * Math.sin(t / 250);
    ctx.fillStyle = `rgba(255,210,63,${0.35 + a * 0.5})`;
    for (let y = ex.y; y < ex.y + ex.h; y++)
      for (let x = ex.x; x < ex.x + ex.w; x++) {
        const X = x * 16;
        const Y = y * 16;
        const right = ex.x >= view.W - 1;
        const off = Math.round(a * 2);
        for (let i = 0; i < 4; i++) {
          if (right) {
            ctx.fillRect(X + 5 + i + off, Y + 4 + i, 2, 1);
            ctx.fillRect(X + 5 + i + off, Y + 11 - i, 2, 1);
          } else {
            ctx.fillRect(X + 4 + i, Y + 5 + i + off, 1, 2);
            ctx.fillRect(X + 11 - i, Y + 5 + i + off, 1, 2);
          }
        }
      }
  }
  // tıklama işareti
  if (ui.clickFx && t - ui.clickFx.t < 400) {
    const k = (t - ui.clickFx.t) / 400;
    ctx.strokeStyle = `rgba(255,255,255,${1 - k})`;
    ctx.lineWidth = 1;
    const r = 3 + k * 5;
    ctx.strokeRect(ui.clickFx.x * 16 + 8 - r, ui.clickFx.y * 16 + 8 - r, r * 2, r * 2);
  }
  if (st.phase === "combat" && isMyTurn() && !st.busy) {
    const c = cur();
    if (!ui.sel && ui.reach) {
      const pulse = 0.16 + 0.05 * Math.sin(t / 300);
      for (const [k, d] of ui.reach.dist) {
        if (d === 0) continue;
        const x = k % 1000;
        const y = Math.floor(k / 1000);
        if (!ui.reach.canEnd(x, y)) continue;
        ctx.fillStyle = `rgba(90,215,255,${pulse})`;
        ctx.fillRect(x * 16 + 1, y * 16 + 1, 14, 14);
      }
      if (ui.hover) {
        const hk = K(ui.hover[0], ui.hover[1]);
        if (ui.reach.dist.has(hk) && ui.reach.canEnd(ui.hover[0], ui.hover[1]) && hk !== ui.reach.start) {
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          for (const [px, py] of pathFrom(ui.reach, hk)) ctx.fillRect(px * 16 + 7, py * 16 + 7, 2, 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(ui.hover[0] * 16 + 0.5, ui.hover[1] * 16 + 0.5, 15, 15);
        }
      }
    }
    if (ui.sel) {
      const ab = ABIL[ui.sel];
      if (ab.tgt === "area") {
        // menzil sınırı
        ctx.fillStyle = "rgba(255,210,63,0.07)";
        for (let y = 0; y < view.H; y++) for (let x = 0; x < view.W; x++) if (gapPt(c, x, y) <= ab.range && !tileOpaque(x, y)) ctx.fillRect(x * 16, y * 16, 16, 16);
        if (ui.hover) {
          const ok = areaOk(c, ui.sel, ui.hover[0], ui.hover[1]);
          ctx.fillStyle = ok ? "rgba(255,138,61,0.38)" : "rgba(255,77,94,0.25)";
          const r = ab.radius;
          ctx.fillRect((ui.hover[0] - r) * 16, (ui.hover[1] - r) * 16, (r * 2 + 1) * 16, (r * 2 + 1) * 16);
          if (ok)
            for (const v of inArea(ui.hover[0], ui.hover[1], r)) {
              ctx.strokeStyle = isParty(v) ? "#ff4d5e" : "#ffd23f";
              ctx.lineWidth = 1;
              ctx.strokeRect(v.x * 16 + 0.5, v.y * 16 + 0.5, (v.sz || 1) * 16 - 1, (v.sz || 1) * 16 - 1);
            }
        }
      } else {
        const list = abilTargets(c, ui.sel);
        const a = 0.6 + 0.4 * Math.sin(t / 150);
        for (const v of list) {
          const p = vis.get(v.id) || v;
          ctx.strokeStyle = opposed(c, v) ? `rgba(255,77,94,${a})` : `rgba(72,224,160,${a})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(p.x * 16 + 0.75, p.y * 16 + 0.75, (v.sz || 1) * 16 - 1.5, (v.sz || 1) * 16 - 1.5);
        }
      }
    }
  }
  if (st.phase === "explore" && ui.hover && !isTouch) {
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(ui.hover[0] * 16 + 0.5, ui.hover[1] * 16 + 0.5, 15, 15);
  }
}

function drawEntities(t) {
  const list = drawables().sort((a, b) => {
    const va = vis.get(a.id) || a;
    const vb = vis.get(b.id) || b;
    return va.y + (a.sz || 1) - (vb.y + (b.sz || 1)) || (a.hero ? 1 : 0) - (b.hero ? 1 : 0);
  });
  const actor = st.combat ? cur() : null;
  for (const c of list) {
    const v = visOf(c);
    const sz = c.sz || 1;
    const key = spriteKey(c);
    const spr = key ? ART.sprite(key) : null;
    const baseX = v.x * 16;
    const baseY = v.y * 16;
    const isC = isCreature(c) || c.sp === "npc:stranger";
    // gölge
    if (spr && isC) {
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.ellipse(baseX + sz * 8, baseY + sz * 16 - 1.5, sz * 5.5, sz * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // sıra halkası / lider halkası
    if (actor === c) {
      const a = 0.6 + 0.4 * Math.sin(t / 160);
      ctx.strokeStyle = `rgba(255,210,63,${a})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(baseX + sz * 8, baseY + sz * 16 - 1.5, sz * 7, sz * 2.8, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (st.phase !== "combat" && c.hero && c.id === ui.lead) {
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(baseX + 8, baseY + 14.5, 6.5, 2.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (!spr) continue;
    let ox = 0;
    let oy = 0;
    if (v.moving) oy = Math.floor(t / 110) % 2 ? -1 : 0;
    else if (actor === c) oy = Math.floor(t / 380) % 2 ? -1 : 0;
    const fl = ui.flash[c.id];
    if (fl && t - fl < 220) ox = (Math.floor(t / 40) % 2 ? 1 : -1);
    const dx = Math.round(baseX + (sz * 16 - spr.width) / 2 + ox);
    const dy = Math.round(baseY + sz * 16 - spr.height + oy);
    let alpha = 1;
    if (c.dead && ui.deathT[c.id]) alpha = clamp(1 - (t - ui.deathT[c.id]) / 650, 0, 1);
    if (c.hero && c.dead) alpha = 0.35;
    ctx.globalAlpha = alpha;
    if (c.hero && (c.down || c.dead)) {
      ctx.save();
      ctx.translate(dx + 8, dy + 12);
      ctx.rotate(c.face === -1 ? -Math.PI / 2 : Math.PI / 2);
      ctx.drawImage(spr, -8, -8);
      ctx.restore();
    } else if (c.face === -1) {
      ctx.save();
      ctx.translate(dx + spr.width, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(spr, 0, 0);
      ctx.restore();
    } else ctx.drawImage(spr, dx, dy);
    ctx.globalAlpha = 1;
    if (c.cond && c.cond.sleep) {
      ctx.fillStyle = "#c8f4ff";
      const zz = Math.floor(t / 300) % 3;
      ctx.fillRect(dx + spr.width - 3 + zz, dy - 2 - zz * 2, 3, 1);
      ctx.fillRect(dx + spr.width - 1 + zz, dy - 1 - zz * 2, 1, 1);
      ctx.fillRect(dx + spr.width - 3 + zz, dy - zz * 2, 3, 1);
    }
  }
  // konuşma işaretleri
  if (st.phase === "explore" || st.phase === "dialog") {
    for (const e of st.ents) {
      if (e.hidden || !e.ev || e.side) continue;
      if (st.dialog && st.dialog.ent === e.id) continue;
      const v = visOf(e);
      const spr = e.sp ? ART.sprite(spriteKey(e)) : null;
      const top = spr ? v.y * 16 + (e.sz || 1) * 16 - spr.height : v.y * 16 + 4;
      const bob = Math.floor(t / 300) % 2;
      const X = Math.round(v.x * 16 + (e.sz || 1) * 8 - 3);
      const Y = Math.round(top - 9 - bob);
      ctx.fillStyle = "#1a1220";
      ctx.fillRect(X - 1, Y - 1, 7, 9);
      ctx.fillStyle = "#ffd23f";
      ctx.fillRect(X, Y, 5, 7);
      ctx.fillStyle = "#1a1220";
      ctx.fillRect(X + 2, Y + 1, 1, 3);
      ctx.fillRect(X + 2, Y + 5, 1, 1);
    }
  }
}

function drawLight(t) {
  const L2 = view.light;
  const g = lightCv.getContext("2d");
  g.globalCompositeOperation = "copy";
  g.drawImage(L2.base, 0, 0);
  g.globalCompositeOperation = "destination-out";
  const LS = L2.LS;
  const flick = 1 + Math.sin(t / 90) * 0.04 + Math.sin(t / 37) * 0.03;
  for (const h of st.heroes) {
    if (h.dead) continue;
    const p = ctr(h);
    cutLight(g, (p.x / 16) * LS, (p.y / 16) * LS, 4.6 * LS * flick, 0.95);
  }
  for (const a of st.allies) if (!a.dead) {
    const p = ctr(a);
    cutLight(g, (p.x / 16) * LS, (p.y / 16) * LS, 2.2 * LS, 0.7);
  }
  for (const e of st.ents) {
    if (e.hidden || !e.light) continue;
    cutLight(g, (e.x + 0.5) * LS, (e.y + 0.6) * LS, e.light * LS * flick, 1);
  }
  for (const a of ui.anims) {
    if (!["bolt", "fireball", "breath", "fire", "holy"].includes(a.type)) continue;
    const k = clamp((t - a.t0) / a.dur, 0, 1);
    const x = a.x0 + (a.x1 - a.x0) * Math.min(1, k * 1.5);
    const y = a.y0 + (a.y1 - a.y0) * Math.min(1, k * 1.5);
    cutLight(g, (x / 16) * LS, (y / 16) * LS, 3 * LS, 0.9 * (1 - k * 0.6));
  }
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(lightCv, 0, 0, view.W * 16, view.H * 16);
  ctx.imageSmoothingEnabled = false;
}

/* ---- Efektler: süzülen yazılar, mermiler, parçacıklar ---- */
function addFloat(e) {
  const c = e.id && st ? cr(e.id) : null;
  const p = c ? ctr(c) : { x: (e.x + 0.5) * 16, y: (e.y + 0.5) * 16 };
  const stack = ui.floats.filter((f) => now() - f.t0 < 400 && Math.abs(f.x - p.x) < 8).length;
  ui.floats.push({ x: p.x, y: p.y - 10 - stack * 7, txt: e.txt, col: e.col || "#fff", big: !!e.big, t0: now() });
}
function burst(x, y, n, cols, sp = 40, life = 0.6, size = 1, up = 0) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = sp * (0.3 + Math.random() * 0.7);
    ui.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - up, life: life * (0.5 + Math.random() * 0.5), max: life, col: cols[Math.floor(Math.random() * cols.length)], size });
  }
  if (ui.parts.length > 500) ui.parts.splice(0, ui.parts.length - 500);
}
function addAnim(e) {
  if (!st) return;
  const t = now();
  const from = e.from ? cr(e.from) : null;
  const to = e.to ? cr(e.to) : null;
  const p0 = from ? ctr(from) : null;
  const p1 = to ? ctr(to) : e.x !== undefined ? { x: (e.x + 0.5) * 16, y: (e.y + 0.5) * 16 } : p0;
  if (!p1) return;
  const A = (type, dur, extra = {}) => ui.anims.push({ type, t0: t, dur, x0: p0 ? p0.x : p1.x, y0: p0 ? p0.y - 3 : p1.y, x1: p1.x, y1: p1.y - 3, ...extra });
  switch (e.type) {
    case "hurt":
      if (to) ui.flash[to.id] = t;
      if (p1) burst(p1.x, p1.y - 2, 6, ["#ff4d5e", "#ffffff"], 45, 0.4);
      break;
    case "die":
      if (to) ui.deathT[to.id] = t;
      burst(p1.x, p1.y, 18, ["#cfc8bb", "#8d8f9c", "#ffffff"], 35, 0.8);
      break;
    case "slash":
      A("slash", 200);
      break;
    case "arrow":
    case "spear":
    case "stone":
    case "bolt":
      A(e.type, e.type === "bolt" ? 260 : 220, { hit: e.hit });
      break;
    case "missile":
      for (let i = 0; i < 3; i++) ui.anims.push({ type: "missile", t0: t + i * 70, dur: 300, x0: p0.x, y0: p0.y - 3, x1: p1.x, y1: p1.y - 3, bend: (i - 1) * 14 });
      break;
    case "holy":
      A("holy", 520);
      burst(p1.x, p1.y, 14, ["#fff3a8", "#ffd23f", "#ffffff"], 30, 0.7, 1, 30);
      break;
    case "mock":
      A("mock", 700);
      burst(p1.x, p1.y - 8, 8, ["#ff6fae", "#a98bff"], 30, 0.5);
      break;
    case "heal":
      burst(p1.x, p1.y, 14, ["#48e0a0", "#b8ffd8", "#ffffff"], 18, 0.9, 1, 28);
      break;
    case "bless":
      burst(p1.x, p1.y, 14, ["#ffd23f", "#fff3a8"], 20, 0.9, 1, 26);
      break;
    case "inspire":
      A("note", 900);
      burst(p1.x, p1.y, 8, ["#ff6fae", "#ffd23f"], 20, 0.7, 1, 22);
      break;
    case "mark":
      A("mark", 700);
      break;
    case "hide":
      burst(p1.x, p1.y, 14, ["#3b3a4a", "#22202c", "#6b6f80"], 26, 0.7);
      break;
    case "fireball":
      A("fireball", 300);
      setTimeout(() => {
        for (let i = 0; i < 4; i++) burst(p1.x + (Math.random() - 0.5) * 30, p1.y + (Math.random() - 0.5) * 30, 14, ["#ff5a1f", "#ffd23f", "#ff8a3d", "#fff3c0"], 55, 0.7);
        ui.anims.push({ type: "boom", t0: now(), dur: 450, x0: p1.x, y0: p1.y, x1: p1.x, y1: p1.y });
      }, 300 * (st ? st.speed : 1));
      break;
    case "volley":
      for (let i = 0; i < 9; i++) {
        const tx = p1.x + (Math.random() - 0.5) * 40;
        const ty = p1.y + (Math.random() - 0.5) * 40;
        ui.anims.push({ type: "rain", t0: t + i * 45, dur: 260, x0: tx - 14, y0: ty - 40, x1: tx, y1: ty });
      }
      break;
    case "sleep":
      burst(p1.x, p1.y, 26, ["#a98bff", "#c8f4ff", "#5ad7ff"], 30, 1.1, 1, 12);
      break;
    case "breath": {
      const head = from ? { x: (from.x + (from.face === -1 ? 0 : 2)) * 16, y: from.y * 16 + 8 } : p0;
      for (let i = 0; i < 26; i++) {
        ui.anims.push({ type: "flame", t0: t + i * 22, dur: 420, x0: head.x, y0: head.y, x1: p1.x + (Math.random() - 0.5) * 40, y1: p1.y + (Math.random() - 0.5) * 40 });
      }
      break;
    }
    case "fire":
      burst(p1.x, p1.y, 16, ["#ff5a1f", "#ffd23f", "#ff8a3d"], 30, 0.8, 1, 25);
      break;
  }
  if (ui.anims.length > 200) ui.anims.splice(0, ui.anims.length - 200);
}
function updateFx(dt, t) {
  for (const p of ui.parts) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.life -= dt;
  }
  ui.parts = ui.parts.filter((p) => p.life > 0);
  ui.anims = ui.anims.filter((a) => {
    const done = t - a.t0 > a.dur;
    if (done && !a.ended) {
      a.ended = true;
      if (["arrow", "spear", "stone"].includes(a.type) && a.hit) burst(a.x1, a.y1, 5, ["#ffffff", "#cfc8bb"], 30, 0.3);
      if (a.type === "bolt") burst(a.x1, a.y1, 12, ["#ff5a1f", "#ffd23f"], 40, 0.5);
      if (a.type === "missile") burst(a.x1, a.y1, 6, ["#c8a8ff", "#ffffff"], 35, 0.4);
      if (a.type === "flame") burst(a.x1, a.y1, 2, ["#ff5a1f", "#ffd23f"], 20, 0.5);
    }
    return !done;
  });
  ui.floats = ui.floats.filter((f) => t - f.t0 < 1200);
  ui.bubbles = ui.bubbles.filter((b) => t - b.t < 4500);
}
function drawWorldFx(t) {
  for (const a of ui.anims) {
    const k = (t - a.t0) / a.dur;
    if (k < 0 || k > 1) continue;
    const x = a.x0 + (a.x1 - a.x0) * k;
    const y = a.y0 + (a.y1 - a.y0) * k;
    switch (a.type) {
      case "slash": {
        ctx.strokeStyle = `rgba(255,255,255,${1 - k})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const ang = Math.atan2(a.y1 - a.y0, a.x1 - a.x0);
        ctx.arc(a.x1, a.y1, 7, ang - 1.2 + k * 1.6, ang + 0.2 + k * 1.6);
        ctx.stroke();
        break;
      }
      case "arrow":
      case "spear":
      case "rain": {
        const ang = Math.atan2(a.y1 - a.y0, a.x1 - a.x0);
        const len = a.type === "spear" ? 8 : 5;
        ctx.strokeStyle = a.type === "spear" ? "#c08a4e" : "#e8e0c8";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(ang) * len, y - Math.sin(ang) * len);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = "#dfe5ee";
        ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        break;
      }
      case "stone":
        ctx.fillStyle = "#8d8f9c";
        ctx.fillRect(Math.round(x) - 1, Math.round(y - Math.sin(k * Math.PI) * 10) - 1, 3, 3);
        break;
      case "bolt":
      case "fireball":
        ctx.fillStyle = "#ff5a1f";
        ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 5, 5);
        ctx.fillStyle = "#ffd23f";
        ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
        if (Math.random() < 0.6) burst(x, y, 1, ["#ff8a3d", "#ffd23f"], 10, 0.3);
        break;
      case "missile": {
        const bx = x + Math.sin(k * Math.PI) * a.bend;
        const by = y - Math.sin(k * Math.PI) * Math.abs(a.bend) * 0.5;
        ctx.fillStyle = "#c8a8ff";
        ctx.fillRect(Math.round(bx) - 1, Math.round(by) - 1, 3, 3);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(Math.round(bx), Math.round(by), 1, 1);
        break;
      }
      case "flame": {
        const s = 2 + k * 3;
        ctx.fillStyle = k < 0.5 ? "#ffd23f" : "#ff5a1f";
        ctx.globalAlpha = 1 - k * 0.6;
        ctx.fillRect(Math.round(x - s / 2), Math.round(y - s / 2), Math.ceil(s), Math.ceil(s));
        ctx.globalAlpha = 1;
        break;
      }
      case "boom":
        ctx.strokeStyle = `rgba(255,210,63,${1 - k})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(a.x1 - 24 * k - 2, a.y1 - 24 * k - 2, 48 * k + 4, 48 * k + 4);
        break;
      case "holy":
        ctx.fillStyle = `rgba(255,243,168,${0.55 * (1 - k)})`;
        ctx.fillRect(a.x1 - 4, a.y1 - 40, 8, 44);
        break;
      case "mark":
        ctx.strokeStyle = `rgba(255,77,94,${1 - k})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(a.x1 - 6 - (1 - k) * 4, a.y1 - 6 - (1 - k) * 4, 12 + (1 - k) * 8, 12 + (1 - k) * 8);
        ctx.fillStyle = `rgba(255,77,94,${1 - k})`;
        ctx.fillRect(a.x1 - 0.5, a.y1 - 9, 1, 4);
        ctx.fillRect(a.x1 - 0.5, a.y1 + 5, 1, 4);
        ctx.fillRect(a.x1 - 9, a.y1 - 0.5, 4, 1);
        ctx.fillRect(a.x1 + 5, a.y1 - 0.5, 4, 1);
        break;
    }
  }
  for (const p of ui.parts) {
    ctx.globalAlpha = clamp((p.life / p.max) * 1.6, 0, 1);
    ctx.fillStyle = p.col;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

/* Ekran çözünürlüğünde çizilenler: can çubukları, yazılar */
function w2s(x, y) {
  return [x * S + OX, y * S + OY];
}
function pixText(txt, x, y, size, col, align = "center") {
  ctx.font = `700 ${Math.round(size * dpr)}px "Pixelify Sans", monospace`;
  ctx.textAlign = align;
  ctx.fillStyle = "rgba(10,6,16,0.85)";
  const o = Math.max(1, Math.round(dpr * 1.2));
  ctx.fillText(txt, x + o, y + o);
  ctx.fillText(txt, x - o, y + o);
  ctx.fillStyle = col;
  ctx.fillText(txt, x, y);
}
function drawScreenUI(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const inCombat = st.phase === "combat";
  for (const c of drawables()) {
    if (!isCreature(c) || c.dead) continue;
    if (!inCombat && !c.hero && !c.ally) continue;
    const v = visOf(c);
    const sz = c.sz || 1;
    const spr = ART.sprite(spriteKey(c));
    const topY = v.y * 16 + sz * 16 - (spr ? spr.height : 16) - 3;
    const [sx, sy] = w2s(v.x * 16 + sz * 8, topY);
    if (inCombat || (c.hero && c.hp < c.maxHp)) {
      const bw = Math.round(Math.max(14, sz * 14) * S * 0.9);
      const bh = Math.max(3, Math.round(S * 0.9));
      const ratio = clamp(c.hp / c.maxHp, 0, 1);
      ctx.fillStyle = "rgba(10,6,16,0.75)";
      ctx.fillRect(Math.round(sx - bw / 2) - 1, Math.round(sy) - 1, bw + 2, bh + 2);
      ctx.fillStyle = c.hero && c.down ? "#8d8f9c" : ratio > 0.5 ? "#48e0a0" : ratio > 0.25 ? "#ffd23f" : "#ff4d5e";
      ctx.fillRect(Math.round(sx - bw / 2), Math.round(sy), Math.round(bw * ratio), bh);
      if (c.hero && c.down) pixText(c.stable ? T("dd.stable") : T("dd.down"), sx, sy - 4 * dpr, 10, "#ff8aa8");
    }
  }
  // isimler (fare üstündeyken)
  if (ui.hover && !isTouch) {
    const c = creatureAt(ui.hover[0], ui.hover[1]);
    if (c && isCreature(c)) {
      const v = visOf(c);
      const spr = ART.sprite(spriteKey(c));
      const [sx, sy] = w2s(v.x * 16 + (c.sz || 1) * 8, v.y * 16 + (c.sz || 1) * 16 - (spr ? spr.height : 16) - 6);
      pixText(nameOf(c), sx, sy, 11, c.hero ? CLASSES[c.cls].color : c.ally ? "#e8d0a8" : "#ff8a8a");
    }
  }
  for (const b of ui.bubbles) {
    const c = cr(b.id);
    if (!c) continue;
    const v = visOf(c);
    const [sx, sy] = w2s(v.x * 16 + 8, v.y * 16 - 4);
    const txt = b.txt.length > 34 ? b.txt.slice(0, 33) + "…" : b.txt;
    ctx.font = `600 ${Math.round(11 * dpr)}px "Pixelify Sans", monospace`;
    const w = ctx.measureText(txt).width + 12 * dpr;
    const h = 18 * dpr;
    ctx.fillStyle = "rgba(244,241,232,0.95)";
    ctx.fillRect(Math.round(sx - w / 2), Math.round(sy - h), Math.round(w), Math.round(h));
    ctx.fillRect(Math.round(sx - 2 * dpr), Math.round(sy), Math.round(4 * dpr), Math.round(3 * dpr));
    ctx.fillStyle = "#1a1220";
    ctx.textAlign = "center";
    ctx.fillText(txt, sx, sy - 5 * dpr);
  }
  for (const f of ui.floats) {
    const k = (t - f.t0) / 1200;
    const [sx, sy] = w2s(f.x, f.y - k * 14);
    ctx.globalAlpha = clamp(1.6 - k * 1.6, 0, 1);
    pixText(f.txt, sx, sy, f.big ? 18 : 13, f.col);
  }
  ctx.globalAlpha = 1;
}

function drawMenuScene(t) {
  const sc = SCENES.village;
  for (const e of sc.ents) {
    const spr = ART.sprite(e.sp);
    if (!spr) continue;
    const dx = e.x * 16 + (16 - spr.width) / 2;
    const dy = e.y * 16 + 16 - spr.height;
    if ((e.face || 1) === -1) {
      ctx.save();
      ctx.translate(dx + spr.width, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(spr, 0, 0);
      ctx.restore();
    } else ctx.drawImage(spr, dx, dy);
  }
  const heroes = CLASS_ORDER;
  heroes.forEach((cls, i) => {
    const [x, y] = sc.spawn[i];
    const spr = ART.sprite(`hero:${cls}`);
    const bob = Math.floor(t / 400 + i) % 2 ? -1 : 0;
    ctx.drawImage(spr, x * 16, y * 16 + bob);
  });
}

/* ---------------- Ana döngü ---------------- */
let last = now();
function frame() {
  const t = now();
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;
  updateVis(dt);
  updateFx(dt, t);
  render(t, dt);
  requestAnimationFrame(frame);
}

/* =========================================================
   Girdi
   ========================================================= */
function screenToTile(cx, cy) {
  const wx = (cx * dpr - OX) / S;
  const wy = (cy * dpr - OY) / S;
  return [Math.floor(wx / 16), Math.floor(wy / 16)];
}
function creatureAt(x, y) {
  if (!st) return null;
  let best = null;
  for (const c of drawables()) {
    if (c.dead) continue;
    const sz = c.sz || 1;
    if (x >= c.x && y >= c.y && x < c.x + sz && y < c.y + sz) {
      if (!best || (isCreature(c) && !isCreature(best))) best = c;
    }
  }
  return best;
}

let ptr = null;
canvas.addEventListener("pointerdown", (e) => {
  sfx.init();
  ptr = { id: e.pointerId, x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, drag: false, btn: e.button, type: e.pointerType };
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch (err) {}
});
canvas.addEventListener("pointermove", (e) => {
  ui.mouse = { x: e.clientX, y: e.clientY };
  if (st && grid) ui.hover = screenToTile(e.clientX, e.clientY);
  if (ptr && ptr.id === e.pointerId) {
    const dx = e.clientX - ptr.x;
    const dy = e.clientY - ptr.y;
    if (!ptr.drag && Math.hypot(dx, dy) > (ptr.type === "mouse" ? 6 : 12)) ptr.drag = true;
    if (ptr.drag && st && st.scene) {
      cam.x = ptr.cx - (dx * dpr) / S;
      cam.y = ptr.cy - (dy * dpr) / S;
      cam.manual = now() + 6000;
    }
  }
  if (!isTouch) updateTip();
});
canvas.addEventListener("pointerup", (e) => {
  if (!ptr || ptr.id !== e.pointerId) return;
  const p = ptr;
  ptr = null;
  if (!p.drag && p.btn === 0) onTileClick(screenToTile(e.clientX, e.clientY), e.pointerType);
});
canvas.addEventListener("pointercancel", () => (ptr = null));
canvas.addEventListener("pointerleave", () => {
  if (!ptr) {
    ui.hover = null;
    $("tip").hidden = true;
  }
});
canvas.addEventListener(
  "wheel",
  (e) => {
    if (!st || !st.scene) return;
    e.preventDefault();
    ui.zoom = clamp(ui.zoom + (e.deltaY < 0 ? 1 : -1), -2, 3);
    resize();
  },
  { passive: false }
);
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

function onTileClick(tile, ptype) {
  if (!st || !grid || !tile) return;
  const [x, y] = tile;
  if (st.phase === "explore") {
    if (ui.potion) {
      const t = creatureAt(x, y);
      if (t && isParty(t)) usePotionOn(t);
      else {
        ui.potion = false;
        renderHud(true);
      }
      return;
    }
    if (!ui.lead) {
      if (ptype !== "mouse") showTipFor(creatureAt(x, y));
      return;
    }
    if (!inMap(x, y)) return;
    net.send({ a: "go", h: ui.lead, x, y });
    ui.clickFx = { x, y, t: now() };
    cam.manual = 0;
    return;
  }
  if (st.phase !== "combat") return;
  const t = creatureAt(x, y);
  if (!isMyTurn() || st.busy) {
    if (t) showTipFor(t);
    return;
  }
  const c = cur();
  if (c.down) return;
  if (ui.sel) {
    const ab = ABIL[ui.sel];
    if (ab.tgt === "area") {
      if (areaOk(c, ui.sel, x, y)) {
        net.send({ a: "act", ab: ui.sel, x, y });
        ui.sel = null;
      } else toast(T("dd.badTarget"));
      return;
    }
    if (t && abilTargets(c, ui.sel).includes(t)) {
      net.send({ a: "act", ab: ui.sel, t: t.id });
      ui.sel = null;
      renderHud(true);
      return;
    }
    toast(T("dd.badTarget"));
    return;
  }
  if (t && isCreature(t) && opposed(c, t)) {
    const cands = heroAbils(c).filter((id) => {
      const ab = ABIL[id];
      return ab.tgt === "foe" && ab.roll === "atk" && !abilBlock(c, id) && abilTargets(c, id).includes(t);
    });
    const melee = cands.find((id) => ABIL[id].range === 1);
    const pick = gap(c, t) <= 1 && melee ? melee : cands[0];
    if (pick) {
      net.send({ a: "act", ab: pick, t: t.id });
      return;
    }
    showTipFor(t);
    return;
  }
  if (ui.reach && ui.reach.dist.has(K(x, y)) && ui.reach.canEnd(x, y) && K(x, y) !== ui.reach.start) {
    net.send({ a: "cmove", x, y });
    return;
  }
  if (t) showTipFor(t);
}
function usePotionOn(t) {
  ui.potion = false;
  if (t.hp >= t.maxHp) {
    toast(T("dd.fullHp"));
    renderHud(true);
    return;
  }
  net.send({ a: "potion", t: t.id });
  renderHud(true);
}

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") {
    if (e.key === "Escape") e.target.blur();
    return;
  }
  if (!st || ui.screen !== "game") return;
  if (e.key === "Escape") {
    if (ui.sel || ui.potion) {
      ui.sel = null;
      ui.potion = false;
      renderHud(true);
    } else if (!$("logPanel").hidden) toggleLog(false);
    else if (!$("tray").hidden) $("tray").hidden = true;
    else togglePause();
    return;
  }
  if (!$("pause").hidden) return;
  if (st.phase === "dialog" && st.dialog && st.dialog.step === "res" && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    net.send({ a: "cont" });
    return;
  }
  if (st.phase === "dialog" && st.dialog && st.dialog.step === "opts" && /^[1-9]$/.test(e.key)) {
    const b = $("dlgOpts").querySelectorAll("button.opt")[+e.key - 1];
    if (b) b.click();
    return;
  }
  if (e.key === "l" || e.key === "L") {
    toggleLog();
    return;
  }
  if (st.phase === "combat" && isMyTurn()) {
    if (e.key === "e" || e.key === "E" || e.key === "Enter") {
      $("actions").querySelector("[data-end]") && $("actions").querySelector("[data-end]").click();
      return;
    }
    if (/^[1-9]$/.test(e.key)) {
      const b = $("actions").querySelectorAll("button[data-ab]")[+e.key - 1];
      if (b) b.click();
      return;
    }
  }
  if (st.phase === "explore" && ui.lead) {
    const h = heroById(ui.lead);
    const dir = { KeyW: [0, -1], ArrowUp: [0, -1], KeyS: [0, 1], ArrowDown: [0, 1], KeyA: [-1, 0], ArrowLeft: [-1, 0], KeyD: [1, 0], ArrowRight: [1, 0] }[e.code];
    if (h && dir) {
      e.preventDefault();
      net.send({ a: "go", h: h.id, x: h.x + dir[0], y: h.y + dir[1] });
      cam.manual = 0;
    }
  }
});

/* Bilgi kutusu */
function tipHTML(c) {
  if (!c) return "";
  if (!isCreature(c)) {
    return "";
  }
  const conds = Object.keys(c.cond || {})
    .map((k) => (CONDS[k] ? `${CONDS[k].icon} ${L(CONDS[k].name)}` : ""))
    .join(" · ");
  if (c.hero) {
    const cl = CLASSES[c.cls];
    return `<b style="color:${cl.color}">${esc(nameOf(c))}</b><small>${L(cl.name)} · ${T("dd.lvl", { n: st.lvl })}</small><span>❤ ${c.hp}/${c.maxHp} · 🛡 ${cl.ac}</span>${conds ? `<span>${conds}</span>` : ""}`;
  }
  const F = FOES[c.kind];
  return `<b>${esc(nameOf(c))}</b><span>❤ ${c.hp !== undefined ? `${Math.max(0, c.hp)}/${c.maxHp}` : "?"} · 🛡 ${F.ac}</span>${F.trait ? `<small>${L(F.trait)}</small>` : ""}${conds ? `<span>${conds}</span>` : ""}`;
}
function updateTip() {
  const tip = $("tip");
  if (!st || !ui.hover || ptr) {
    if (now() > ui.tipUntil) tip.hidden = true;
    return;
  }
  const c = creatureAt(ui.hover[0], ui.hover[1]);
  const html = c && isCreature(c) && c.hp !== undefined ? tipHTML(c) : "";
  if (!html) {
    if (now() > ui.tipUntil) tip.hidden = true;
    return;
  }
  tip.innerHTML = html;
  tip.hidden = false;
  const r = tip.getBoundingClientRect();
  tip.style.left = `${clamp(ui.mouse.x + 16, 8, innerWidth - r.width - 8)}px`;
  tip.style.top = `${clamp(ui.mouse.y + 16, 8, innerHeight - r.height - 8)}px`;
}
function showTipFor(c) {
  if (!c || !isCreature(c)) return;
  const tip = $("tip");
  tip.innerHTML = tipHTML(c);
  tip.hidden = false;
  const v = visOf(c);
  const [sx, sy] = w2s(v.x * 16 + 8, v.y * 16);
  const r = tip.getBoundingClientRect();
  tip.style.left = `${clamp(sx / dpr - r.width / 2, 8, innerWidth - r.width - 8)}px`;
  tip.style.top = `${clamp(sy / dpr - r.height - 12, 8, innerHeight - r.height - 8)}px`;
  ui.tipUntil = now() + 2500;
  setTimeout(() => {
    if (now() >= ui.tipUntil) tip.hidden = true;
  }, 2600);
}

/* =========================================================
   Arayüz (DOM)
   ========================================================= */
let toastTimer = 0;
function toast(msg, ms = 2200) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), ms);
}
function showLoading(msg) {
  $("loadingTxt").textContent = msg;
  $("loading").hidden = false;
}
function hideLoading() {
  $("loading").hidden = true;
}
function showScreen(name) {
  if (ui.screen === name) return;
  ui.screen = name;
  $("menu").hidden = name !== "menu";
  $("lobby").hidden = name !== "lobby";
  $("hud").hidden = name !== "game";
  document.body.classList.toggle("playing", name === "game");
  document.body.classList.toggle("solo", net.mode === "solo");
  if (name === "game") {
    ui.hudSig = "";
    ui.dlgSig = "";
    if (isTouch && innerHeight > innerWidth) toast(T("dd.rotate"), 3500);
  }
}

/* ---- Grup paneli ---- */
function condIcons(c) {
  return Object.keys(c.cond || {})
    .map((k) => (CONDS[k] ? `<span title="${esc(L(CONDS[k].name))}">${CONDS[k].icon}</span>` : ""))
    .join("");
}
function renderParty() {
  const actor = st.combat ? cur() : null;
  const html = [...st.heroes, ...st.allies]
    .map((c) => {
      const isH = !!c.hero;
      const cl = isH ? CLASSES[c.cls] : null;
      const ratio = clamp(c.hp / c.maxHp, 0, 1);
      const state = isH && c.dead ? T("dd.dead") : isH && c.down ? (c.stable ? T("dd.stable") : T("dd.down")) : "";
      const cls = ["pcard", actor === c ? "turn" : "", isMine(c) ? "mine" : "", c.id === ui.lead && st.phase !== "combat" ? "lead" : "", isH && (c.down || c.dead) ? "down" : "", !isH ? "ally" : ""].join(" ");
      const owner = isH && c.proxy ? `<i class="own">🤖 ${T("dd.host")}</i>` : "";
      const ds = isH && c.down && !c.dead && !c.stable ? `<span class="dsp">${"✔".repeat(c.ds[0])}${"✖".repeat(c.ds[1])}</span>` : "";
      return `<button class="${cls}" type="button" data-id="${c.id}" style="--cc:${isH ? cl.color : "#c8a070"};--hp:${Math.round(ratio * 100)}%">
        <img src="${portrait(c)}" alt="">
        <span class="pi"><b>${esc(nameOf(c))}</b><small>${isH ? `${L(cl.name)} · ${T("dd.lvl", { n: st.lvl })}` : ""}${owner}</small>
        <span class="hpb"><i style="width:${ratio * 100}%"></i><em>${state || `${c.hp}/${c.maxHp}`}</em></span>
        <span class="cds">${condIcons(c)}${ds}</span></span>
        ${isH ? `<span class="ac">🛡${cl.ac}</span>` : ""}
      </button>`;
    })
    .join("");
  if ($("party").innerHTML !== html) $("party").innerHTML = html;
}

function renderInit() {
  const el = $("initBar");
  if (!st.combat) {
    el.innerHTML = "";
    el.hidden = true;
    return;
  }
  el.hidden = false;
  const cb = st.combat;
  const html = cb.order
    .map((id, i) => {
      const c = cr(id);
      if (!c || (c.dead && !c.hero)) return "";
      const ratio = clamp(c.hp / c.maxHp, 0, 1);
      return `<span class="ini${i === cb.idx ? " now" : ""}${isParty(c) ? " pty" : " foe"}${c.hero && (c.down || c.dead) ? " out" : ""}"><img src="${portrait(c)}" alt=""><i style="width:${ratio * 100}%"></i></span>`;
    })
    .join("");
  if (el.innerHTML !== html) el.innerHTML = html;
}

function renderActions() {
  const el = $("actions");
  const info = $("turnInfo");
  let html = "";
  let inf = "";
  if (st.phase === "combat" && st.combat) {
    const c = cur();
    if (!c) {
      el.innerHTML = "";
      info.innerHTML = "";
      return;
    }
    if (isMyTurn()) {
      const cb = st.combat;
      if (c.down && !c.stable) {
        inf = `<span>${esc(T("dd.dsHint"))}</span>`;
        html = `<button class="pbtn primary big" type="button" data-ds ${st.busy ? "disabled" : ""}>🎲 ${T("dd.deathSave")}</button>`;
      } else {
        const sel = ui.sel ? ABIL[ui.sel] : null;
        inf = sel
          ? `<span class="selinfo">${sel.icon} <b>${esc(L(sel.name))}</b> — ${esc(L(sel.desc))} · <em>${T(sel.tgt === "area" ? "dd.pickArea" : "dd.pickTarget")}</em></span>`
          : `<span><b style="color:${CLASSES[c.cls].color}">${esc(T("dd.yourTurn", { name: nameOf(c) }))}</b></span><span class="${cb.move ? "" : "off"}">${T("dd.moveLeft", { n: cb.move })}</span><span class="${cb.act ? "off" : "on"}">● ${T("dd.actionTag")}</span><span class="${cb.bonus ? "off" : "on"}">● ${T("dd.bonusTag")}</span>`;
        const ids = [...heroAbils(c), ...GENERIC_ABIL];
        html = ids
          .map((id, i) => {
            const ab = ABIL[id];
            const why = abilBlock(c, id);
            const left = usesLeft(c, id);
            const cnt = id === "potion" ? st.party.potion || 0 : left !== Infinity ? left : null;
            return `<button class="abtn${ui.sel === id ? " sel" : ""}${why || st.busy ? " off" : ""}" type="button" data-ab="${id}" data-why="${why || ""}" title="${esc(L(ab.name))} — ${esc(L(ab.desc))}">
              <span class="ic">${ab.icon}</span><span class="nm">${esc(L(ab.name))}</span><small class="${ab.cost === "a" ? "ta" : "tb"}">${i < 9 ? `<kbd>${i + 1}</kbd>` : ""}${ab.cost === "a" ? T("dd.actionTag") : T("dd.bonusTag")}</small>${cnt !== null ? `<em>${cnt}</em>` : ""}</button>`;
          })
          .join("");
        html += `<button class="abtn end" type="button" data-end ${st.busy ? "disabled" : ""}><span class="ic">⏭️</span><span class="nm">${T("dd.endTurn")}</span><small><kbd>E</kbd></small></button>`;
      }
    } else {
      const nm = esc(nameOf(c));
      inf = st.busy && isParty(c) ? `<span>${T("dd.rolling")}</span>` : `<span>${c.hero ? T("dd.waiting", { name: nm }) : T("dd.enemyTurn", { name: nm })}</span>`;
      if (net.mode === "host" && c.hero && !isMine(c) && !st.busy) html = `<button class="pbtn small" type="button" data-skip>${T("dd.skipTurn")}</button>`;
    }
  } else if (st.phase === "explore") {
    const n = st.party.potion || 0;
    if (ui.potion) inf = `<span class="selinfo">🧪 ${T("dd.potionPick")}</span>`;
    else inf = `<span class="hint">${T(isTouch ? "dd.hintTouch" : "dd.hintExplore")}</span>`;
    if (myHeroes().length && n > 0) html = `<button class="abtn${ui.potion ? " sel" : ""}" type="button" data-potion><span class="ic">🧪</span><span class="nm">${T("dd.potionBtn", { n })}</span></button>`;
  }
  if (el.innerHTML !== html) el.innerHTML = html;
  if (info.innerHTML !== inf) info.innerHTML = inf;
}

function renderHud(force) {
  if (!st || st.phase === "lobby") return;
  $("roomChip").innerHTML = net.mode === "solo" ? `<b>${T("dd.soloLabel")}</b>` : `${T("dd.room")}: <b>${esc(net.code || "")}</b>`;
  $("btnCopy").hidden = net.mode === "solo";
  $("sceneName").textContent = st.scene ? L(SCENES[st.scene].name) + (st.combat ? ` · ${T("dd.round", { n: st.combat.round })}` : "") : "";
  $("goldChip").textContent = `🪙 ${st.party.gold}`;
  $("potChip").textContent = `🧪 ${st.party.potion || 0}`;
  renderParty();
  renderInit();
  renderActions();
  $("bottom").classList.toggle("combat", st.phase === "combat");
  if (force) ui.hudSig = "";
}

/* ---- Diyalog ---- */
function chanceOf(dc, bonus) {
  const need = dc - bonus;
  return Math.round(clamp((21 - need) / 20, 0.05, 0.95) * 100);
}
function optBadge(o, h) {
  const out = [];
  const cost = optCost(o);
  if (cost) out.push(`<span class="b cost">🪙 ${cost}</span>`);
  if (o.check) {
    const c = o.check;
    if (c.group) out.push(`<span class="b grp">👥 ${T("dd.group")} ${statN(c.s)} · ${T("dd.dc", { n: c.dc })}</span>`);
    else if (!c.s) out.push(`<span class="b luck">🍀 ${T("dd.luck")} · ${T("dd.dc", { n: c.dc })} · ${T("dd.chance", { n: chanceOf(c.dc, 0) })}</span>`);
    else {
      const b = h ? checkBonus(h, c.s) : 0;
      out.push(`<span class="b chk">🎲 ${statN(c.s)} ${fmtMod(b)} · ${T("dd.dc", { n: c.dc })} · ${T("dd.chance", { n: chanceOf(c.dc, b) })}</span>`);
    }
  }
  return out.join("");
}
function renderDialog() {
  const box = $("dialog");
  const d = st && st.dialog;
  if (!d || st.phase !== "dialog") {
    box.hidden = true;
    ui.dlgSig = "";
    return;
  }
  const ev = getEv(d.ev);
  if (!ev) {
    box.hidden = true;
    return;
  }
  const mine = myHeroes().filter((h) => !h.dead);
  if (!mine.find((h) => h.id === ui.dlgHero)) ui.dlgHero = mine.find((h) => h.id === d.hero) ? d.hero : mine.length ? mine[0].id : null;
  const sig = JSON.stringify([d.ev, d.step, d.res && d.res.i, d.res && d.res.k, st.busy, st.party.gold, i18n.lang, ui.dlgHero, st.flags, (st.used[usedKey(d.ev)] || []).length]);
  if (sig === ui.dlgSig) return;
  const fresh = !ui.dlgSig || JSON.parse(ui.dlgSig)[0] !== d.ev || JSON.parse(ui.dlgSig)[1] !== d.step;
  ui.dlgSig = sig;
  box.hidden = false;
  $("dlgImg").src = ART.spriteURL(ev.sp === "fire" ? "obj:fire0" : ev.sp || "ui:scroll");
  $("dlgWho").textContent = L(ev.who);
  const hero = heroById(ui.dlgHero);
  let text;
  let optsHTML = "";
  let heroesHTML = "";
  if (d.step === "res" && d.res) {
    const o = ev.opts[d.res.i];
    const out = d.res.k === "ok" ? o.ok : d.res.k === "no" ? o.no : o.out;
    const rh = heroById(d.res.hero);
    text = L(out.text, { hero: rh ? nameOf(rh) : "", n: d.res.vars.n, cost: d.res.vars.cost });
    const badge = d.res.k === "ok" ? `<span class="res ok">✔ ${T("dd.ok")}</span>` : d.res.k === "no" ? `<span class="res no">✖ ${T("dd.fail")}</span>` : "";
    optsHTML = `<div class="dlg-res">${badge}<span class="chose">➤ ${esc(L(o.label, { cost: d.res.vars.cost || "" }))}</span></div><button class="pbtn primary cont" type="button" data-cont ${st.busy ? "disabled" : ""}>${T("dd.cont")}</button>`;
  } else {
    text = L(ev.text, { n: d.vars && d.vars.n, hero: hero ? nameOf(hero) : "" });
    const needsRoller = ev.opts.some((o, i) => o.check && !o.check.group && optVisible(d.ev, o, i));
    if (mine.length > 1 && needsRoller) {
      heroesHTML = `<span class="lbl">${T("dd.whoRolls")}</span>${mine
        .map((h) => `<button type="button" class="hchip${h.id === ui.dlgHero ? " on" : ""}" data-h="${h.id}" style="--cc:${CLASSES[h.cls].color}"><img src="${portrait(h)}" alt="">${esc(nameOf(h))}</button>`)
        .join("")}`;
    }
    const canAct = mine.length > 0 && !st.busy;
    optsHTML = ev.opts
      .map((o, i) => {
        if (!optVisible(d.ev, o, i)) return "";
        const cost = optCost(o);
        const poor = cost > st.party.gold;
        return `<button type="button" class="opt" data-i="${i}" ${!canAct || poor ? "disabled" : ""}><span class="ol">${esc(L(o.label, { cost }))}</span>${optBadge(o, hero)}${poor ? `<span class="b poor">${T("dd.notEnough")}</span>` : ""}</button>`;
      })
      .join("");
  }
  const tx = $("dlgText");
  tx.textContent = text;
  if (fresh) {
    tx.classList.remove("type");
    void tx.offsetWidth;
    tx.classList.add("type");
    sfx.play("page");
  }
  $("dlgHeroes").innerHTML = heroesHTML;
  $("dlgHeroes").hidden = !heroesHTML;
  $("dlgOpts").innerHTML = optsHTML;
}

/* ---- Yenilgi, son ve katılma ekranları ---- */
function renderOverlays() {
  // yenilgi
  const df = $("defeat");
  df.hidden = st.phase !== "defeat";
  if (!df.hidden) {
    $("btnRetry").hidden = net.myId !== st.hostId;
    $("defeatWait").hidden = net.myId === st.hostId;
  }
  // son
  const en = $("ending");
  en.hidden = st.phase !== "end";
  if (!en.hidden && en.dataset.e !== st.ending + i18n.lang) {
    en.dataset.e = st.ending + i18n.lang;
    const E = ENDINGS[st.ending];
    $("endIcon").src = ART.spriteURL(E.icon);
    $("endTitle").textContent = `${T("dd.endT")}: ${L(E.title)}`;
    $("endText").textContent = L(E.text);
    $("endGold").textContent = T("dd.endGold", { n: st.party.gold });
    let mvp = null;
    let best = -1;
    const rows = st.heroes
      .map((h) => {
        const s = st.stats[h.id] || {};
        const score = (s.dmg || 0) + (s.heal || 0) * 1.2 + (s.kills || 0) * 5 + (s.crit || 0) * 3;
        if (score > best) {
          best = score;
          mvp = h;
        }
        return `<tr><td><img src="${portrait(h)}" alt=""> ${esc(nameOf(h))}</td><td>${s.dmg || 0}</td><td>${s.heal || 0}</td><td>${s.kills || 0}</td><td>${s.crit || 0}</td><td>${s.ones || 0}</td></tr>`;
      })
      .join("");
    $("endStats").innerHTML = `<thead><tr><th></th><th>${T("dd.statDmg")}</th><th>${T("dd.statHeal")}</th><th>${T("dd.statKills")}</th><th>${T("dd.statCrit")}</th><th>${T("dd.statOnes")}</th></tr></thead><tbody>${rows}</tbody>`;
    $("endMvp").innerHTML = mvp ? `⭐ ${T("dd.mvp")}: <b style="color:${CLASSES[mvp.cls].color}">${esc(nameOf(mvp))}</b>` : "";
    const found = new Set([...profile.endings, st.ending]).size;
    $("endHint").textContent = T("dd.endingsHint", { n: found, m: Object.keys(ENDINGS).length });
    $("btnPlayAgain").hidden = net.myId !== st.hostId;
  }
  // sonradan katılan oyuncu
  const cl = $("claim");
  const need = net.mode === "client" && !ui.spectate && ["explore", "dialog", "combat"].includes(st.phase) && !st.heroes.some((h) => h.owner === net.myId && !h.proxy);
  cl.hidden = !need;
  if (need) {
    const proxies = st.heroes.filter((h) => h.proxy && !h.dead);
    const free = CLASS_ORDER.filter((c) => !heroById(c));
    const html =
      proxies.map((h) => `<button class="pbtn" type="button" data-claim="${h.id}"><img src="${portrait(h)}" alt=""> ${T("dd.claimTake")}: ${esc(L(CLASSES[h.cls].name))}</button>`).join("") +
      free
        .map((c) => `<button class="pbtn ghost" type="button" data-claim="${c}" ${st.phase === "combat" ? "disabled" : ""}><img src="${ART.spriteURL(`hero:${c}`)}" alt=""> ${T("dd.claimNew")}: ${esc(L(CLASSES[c].name))}</button>`)
        .join("") +
      (st.phase === "combat" && free.length ? `<p class="note">${T("dd.claimCombat")}</p>` : "");
    if ($("claimList").innerHTML !== html) $("claimList").innerHTML = html;
  }
}

/* ---- Menü ---- */
function renderMenu() {
  $("nameInput").value = profile.name;
  const s = loadSave();
  $("btnContinue").hidden = !s;
  if (s) $("continueSub").textContent = T("dd.saveFound", { scene: L(SCENES[s.scene].name), lvl: s.lvl });
  $("endingsCount").textContent = T("dd.endings", { n: profile.endings.length, m: Object.keys(ENDINGS).length });
}

/* ---- Lobi: sınıf seçimi ---- */
function classCard(cls, state) {
  const c = CLASSES[cls];
  const hp = maxHpFor(cls, 1);
  const attrs = STATS.map((s) => `<span class="${c.skills.includes(s) ? "pro" : ""}${c.expert === s ? " exp" : ""}"><small>${L(STAT_NAME[s])}</small><b>${c.st[s]}</b><i>${fmtMod(modOf(c.st[s]))}</i></span>`).join("");
  const abil = c.abil
    .map((id) => {
      const ab = ABIL[id];
      return `<li title="${esc(L(ab.desc))}"><span>${ab.icon}</span>${esc(L(ab.name))}${ab.lvl ? ` <em>${T("dd.lvl", { n: ab.lvl })}</em>` : ""}</li>`;
    })
    .join("");
  return `<button class="ccard${state.sel ? " sel" : ""}${state.taken ? " taken" : ""}" type="button" data-cls="${cls}" style="--cc:${c.color}" ${state.taken ? "disabled" : ""}>
    <span class="chead"><img src="${ART.spriteURL(`hero:${cls}`)}" alt=""><span><b>${esc(L(c.name))}</b><small>${esc(L(c.role))}</small></span>${state.badge ? `<span class="badge">${state.badge}</span>` : ""}</span>
    <span class="cnums"><span>❤ ${hp} <small>${T("dd.hp")}</small></span><span>🛡 ${c.ac} <small>${T("dd.ac")}</small></span><span>👟 ${c.speed} <small>${T("dd.speedL")}</small></span></span>
    <span class="cattrs">${attrs}</span>
    <span class="cdesc">${esc(L(c.desc))}</span>
    <ul class="cabil">${abil}</ul>
  </button>`;
}
function renderLobby() {
  const online = net.mode === "host" || net.mode === "client";
  $("lobbyTitle").textContent = T(online ? "dd.lobby.online" : "dd.lobby.solo");
  $("lobbyHint").textContent = T(online ? "dd.lobby.onlineHint" : "dd.lobby.soloHint");
  $("lobbyRoom").hidden = !online;
  $("lobbyPlayers").hidden = !online;
  let cards = "";
  let status = "";
  let canStart = false;
  if (online && st) {
    $("lobbyCode").textContent = net.code || "";
    const players = Object.entries(st.players)
      .map(([id, p]) => {
        const pick = Object.keys(st.picks).find((k) => st.picks[k] === id);
        return `<li class="${id === net.myId ? "me" : ""}">${pick ? `<img src="${ART.spriteURL(`hero:${pick}`)}" alt="">` : `<span class="ph">?</span>`}<b>${esc(p.name)}</b>${id === st.hostId ? ` <small>(${T("dd.host")})</small>` : ""}${id === net.myId ? ` <small>(${T("dd.you")})</small>` : ""}<em>${pick ? esc(L(CLASSES[pick].name)) : T("dd.noPick")}</em></li>`;
      })
      .join("");
    $("lobbyPlayers").innerHTML = `<strong>${T("dd.players")} (${Object.keys(st.players).length}/${MAX_PLAYERS})</strong><ul>${players}</ul>`;
    cards = CLASS_ORDER.map((cls) => {
      const owner = st.picks[cls];
      const mine = owner === net.myId;
      const taken = owner && !mine;
      return classCard(cls, { sel: mine, taken, badge: mine ? T("dd.yours") : taken ? esc(T("dd.takenBy", { name: st.players[owner] ? st.players[owner].name : "?" })) : "" });
    }).join("");
    const n = Object.keys(st.picks).length;
    if (net.myId === st.hostId) {
      canStart = n > 0;
      status = n ? "" : T("dd.pickFirst");
      $("btnStart").textContent = T("dd.startN", { n });
      $("btnStart").hidden = false;
    } else {
      status = T("dd.waitHost");
      $("btnStart").hidden = true;
    }
  } else {
    cards = CLASS_ORDER.map((cls) => classCard(cls, { sel: ui.soloPicks.has(cls), badge: ui.soloPicks.has(cls) ? "✔" : "" })).join("");
    const n = ui.soloPicks.size;
    canStart = n > 0;
    status = n ? "" : T("dd.pickFirst");
    $("btnStart").hidden = false;
    $("btnStart").textContent = T("dd.startN", { n });
  }
  if ($("classGrid").innerHTML !== cards) $("classGrid").innerHTML = cards;
  $("btnStart").disabled = !canStart;
  $("lobbyStatus").textContent = status;
}
function openSoloLobby() {
  net.mode = "solo";
  st = null;
  ui.screen = "";
  showScreen("lobby");
  renderLobby();
}

/* ---- Kayıt paneli, zar tepsisi, duraklatma ---- */
function toggleLog(force) {
  const p = $("logPanel");
  const on = force !== undefined ? force : p.hidden;
  p.hidden = !on;
  $("btnLog").classList.remove("ping");
  $("chatForm").hidden = net.mode === "solo";
  if (on) renderLog(true);
}
function togglePause(force) {
  const on = force !== undefined ? force : $("pause").hidden;
  $("pause").hidden = !on;
  if (on) {
    $("btnFast").hidden = !(st && net.myId === st.hostId);
    if (st) $("btnFast").textContent = T("dd.fast", { s: T(st.speed < 1 ? "dd.on" : "dd.off") });
  }
}

/* =========================================================
   Olay bağlantıları
   ========================================================= */
$("party").addEventListener("click", (e) => {
  const b = e.target.closest(".pcard");
  if (!b || !st) return;
  const c = cr(b.dataset.id);
  if (!c) return;
  if (ui.potion) {
    usePotionOn(c);
    return;
  }
  if (isMine(c) && st.phase !== "combat") {
    ui.lead = c.id;
    cam.manual = 0;
    renderHud(true);
    sfx.play("click");
    return;
  }
  const v = visOf(c);
  cam.x = (v.x + 0.5) * 16;
  cam.y = (v.y + 0.5) * 16;
  cam.manual = now() + 2500;
});
$("actions").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b || !st) return;
  sfx.init();
  if (b.dataset.ds !== undefined) {
    net.send({ a: "ds" });
    return;
  }
  if (b.dataset.end !== undefined) {
    ui.sel = null;
    net.send({ a: "end" });
    return;
  }
  if (b.dataset.skip !== undefined) {
    net.send({ a: "skip" });
    return;
  }
  if (b.dataset.potion !== undefined) {
    ui.potion = !ui.potion;
    renderHud(true);
    return;
  }
  const id = b.dataset.ab;
  if (!id || !isMyTurn() || st.busy) return;
  if (b.dataset.why) {
    toast(T(`dd.why.${b.dataset.why}`));
    return;
  }
  const ab = ABIL[id];
  if (ab.tgt === "self" || ab.tgt === "allies") {
    ui.sel = null;
    net.send({ a: "act", ab: id });
    return;
  }
  ui.sel = ui.sel === id ? null : id;
  sfx.play("click");
  renderHud(true);
});
$("dlgOpts").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b || b.disabled || !st) return;
  sfx.init();
  if (b.dataset.cont !== undefined) {
    net.send({ a: "cont" });
    return;
  }
  if (b.dataset.i !== undefined) {
    net.send({ a: "opt", i: +b.dataset.i, h: ui.dlgHero });
    sfx.play("click");
  }
});
$("dlgHeroes").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-h]");
  if (!b) return;
  ui.dlgHero = b.dataset.h;
  ui.dlgSig = "";
  renderDialog();
});
$("dlgText").addEventListener("click", () => $("dlgText").classList.remove("type"));
$("dice").addEventListener("click", () => ($("dice").hidden = true));
$("claimList").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-claim]");
  if (b && !b.disabled) net.send({ a: "claim", cls: b.dataset.claim });
});
$("btnSpectate").addEventListener("click", () => {
  ui.spectate = true;
  $("claim").hidden = true;
});

$("classGrid").addEventListener("click", (e) => {
  const b = e.target.closest(".ccard");
  if (!b || b.disabled) return;
  sfx.init();
  sfx.play("click");
  const cls = b.dataset.cls;
  if (net.mode === "solo") {
    if (ui.soloPicks.has(cls)) ui.soloPicks.delete(cls);
    else ui.soloPicks.add(cls);
    renderLobby();
  } else net.send({ a: "pick", cls });
});
$("btnStart").addEventListener("click", () => {
  sfx.init();
  if (net.mode === "solo") {
    if (!ui.soloPicks.size) return;
    startSolo([...ui.soloPicks]);
  } else net.send({ a: "start" });
});
$("btnLobbyBack").addEventListener("click", () => leaveGame());
const copyLink = () => {
  const url = `${location.origin}${location.pathname}?oda=${net.code}`;
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
    .then(() => toast(T("dd.copied")))
    .catch(() => prompt("Link", url));
};
$("btnLobbyCopy").addEventListener("click", copyLink);
$("btnCopy").addEventListener("click", copyLink);

$("btnSolo").addEventListener("click", () => {
  sfx.init();
  openSoloLobby();
});
$("btnContinue").addEventListener("click", () => {
  sfx.init();
  continueSolo();
});
$("btnCreate").addEventListener("click", () => {
  sfx.init();
  createRoom();
});
$("joinForm").addEventListener("submit", (e) => {
  e.preventDefault();
  sfx.init();
  joinRoom($("joinCode").value);
});
$("joinCode").addEventListener("input", (e) => (e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")));
$("nameInput").addEventListener("change", () => {
  const n = cleanName($("nameInput").value);
  if (n) {
    profile.name = n;
    saveProfile();
  }
  $("nameInput").value = profile.name;
});
$("btnCancel").addEventListener("click", () => {
  hideLoading();
  leaveGame();
});

$("btnLog").addEventListener("click", () => toggleLog());
$("btnLogClose").addEventListener("click", () => toggleLog(false));
$("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("chatInput").value.trim();
  if (v) net.send({ a: "chat", txt: v });
  $("chatInput").value = "";
});
$("btnTray").addEventListener("click", () => ($("tray").hidden = !$("tray").hidden));
$("tray").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-d]");
  if (!b) return;
  sfx.init();
  net.send({ a: "free", d: +b.dataset.d });
});
const updateMuteBtn = () => ($("btnMute").textContent = settings.muted ? "🔇" : "🔊");
$("btnMute").addEventListener("click", () => {
  settings.muted = !settings.muted;
  saveSettings();
  updateMuteBtn();
  sfx.init();
});
updateMuteBtn();
$("btnPause").addEventListener("click", () => togglePause(true));
$("btnResume").addEventListener("click", () => togglePause(false));
$("btnFast").addEventListener("click", () => {
  settings.fast = !(st && st.speed < 1);
  saveSettings();
  net.send({ a: "speed" });
  setTimeout(() => togglePause(true), 50);
});
$("btnLeave").addEventListener("click", () => {
  if (!confirm(T("dd.leaveQ"))) return;
  togglePause(false);
  leaveGame();
});
$("btnZoomIn").addEventListener("click", () => {
  ui.zoom = clamp(ui.zoom + 1, -2, 3);
  resize();
});
$("btnZoomOut").addEventListener("click", () => {
  ui.zoom = clamp(ui.zoom - 1, -2, 3);
  resize();
});
$("btnRetry").addEventListener("click", () => net.send({ a: "retry" }));
document.querySelectorAll("[data-tomenu]").forEach((b) => b.addEventListener("click", () => leaveGame()));
$("btnPlayAgain").addEventListener("click", () => {
  if (!st || net.myId !== st.hostId) return;
  if (net.mode === "solo") {
    leaveGame();
    openSoloLobby();
    return;
  }
  // aynı oyuncularla lobiye dön
  const players = st.players;
  const picks = {};
  st.heroes.forEach((h) => {
    if (!h.proxy && players[h.owner]) picks[h.id] = h.owner;
  });
  st = newState("host");
  st.code = net.code;
  st.players = players;
  st.picks = picks;
  logs = [];
  renderLog(true);
  sync();
});

document.addEventListener("langchange", () => {
  ui.dlgSig = "";
  ui.hudSig = "";
  const en = $("ending");
  if (en) en.dataset.e = "";
  if (st && st.phase !== "lobby") {
    renderHud(true);
    renderDialog();
    renderOverlays();
  }
  if (ui.screen === "lobby") renderLobby();
  if (ui.screen === "menu") renderMenu();
  renderLog(true);
});
window.addEventListener("beforeunload", () => {
  if (net.peer) net.peer.destroy();
});

/* ---------------- Açılış ---------------- */
const urlCode = new URLSearchParams(location.search).get("oda");
if (urlCode) $("joinCode").value = urlCode.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
renderMenu();
ensureView();
requestAnimationFrame(frame);

// Test ve hata ayıklama için
window.ducksDragons = { get st() { return st; }, host, net, ui, startSolo, hostIntent };
