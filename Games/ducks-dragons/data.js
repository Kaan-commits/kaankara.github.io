/* =========================================================
   Ducks & Dragons — oyun verisi
   Sınıflar, yetenekler, düşmanlar, haritalar ve hikâye.
   Metinler { tr, en } çiftleri olarak tutulur.
   ========================================================= */
"use strict";

const STATS = ["str", "dex", "con", "int", "wis", "cha"];
const STAT_NAME = {
  str: { tr: "GÜÇ", en: "STR" },
  dex: { tr: "ÇEV", en: "DEX" },
  con: { tr: "DAY", en: "CON" },
  int: { tr: "ZEK", en: "INT" },
  wis: { tr: "BİL", en: "WIS" },
  cha: { tr: "KAR", en: "CHA" },
};
const STAT_LONG = {
  str: { tr: "Güç", en: "Strength" },
  dex: { tr: "Çeviklik", en: "Dexterity" },
  con: { tr: "Dayanıklılık", en: "Constitution" },
  int: { tr: "Zeka", en: "Intelligence" },
  wis: { tr: "Bilgelik", en: "Wisdom" },
  cha: { tr: "Karizma", en: "Charisma" },
};
const PROF = 2;

/* ---------------- Sınıflar ---------------- */
const CLASSES = {
  fighter: {
    color: "#ff6b5e",
    name: { tr: "Savaşçı", en: "Fighter" },
    hero: { tr: "Demirgaga", en: "Ironbeak" },
    role: { tr: "Tank", en: "Tank" },
    desc: {
      tr: "Kalın zırhlı, dayanıklı ön saf. Düşmanı üstüne çeker, kalkanıyla sersemletir.",
      en: "A heavily armored, tough frontliner. Draws foes in and stuns them with a shield bash.",
    },
    st: { str: 16, dex: 12, con: 15, int: 8, wis: 10, cha: 10 },
    hd: 10,
    ac: 17,
    speed: 5,
    skills: ["str", "con"],
    saves: ["str", "con"],
    abil: ["sword", "javelin", "secondWind", "shieldBash"],
  },
  wizard: {
    color: "#a98bff",
    name: { tr: "Büyücü", en: "Wizard" },
    hero: { tr: "Yıldızkanat", en: "Starwing" },
    role: { tr: "Büyü hasarı", en: "Spell damage" },
    desc: {
      tr: "Kırılgan ama yıkıcı. Şaşmaz sihirli füzeler ve bir Ateş Topu (dostlarına dikkat!).",
      en: "Fragile but devastating. Unerring magic missiles and a Fireball (mind your friends!).",
    },
    st: { str: 8, dex: 14, con: 14, int: 16, wis: 12, cha: 10 },
    hd: 6,
    ac: 12,
    speed: 5,
    skills: ["int", "wis"],
    saves: ["int", "wis"],
    abil: ["firebolt", "magicMissile", "fireball"],
  },
  rogue: {
    color: "#9aa3c7",
    name: { tr: "Hırsız", en: "Rogue" },
    hero: { tr: "Gölgetüy", en: "Shadowfeather" },
    role: { tr: "Sinsi hasar", en: "Sneak damage" },
    desc: {
      tr: "Bir dostu hedefin yanındayken ya da saklanıp vurduğunda Sinsi Saldırı yapar. Kilit ve tuzak uzmanı.",
      en: "Lands a Sneak Attack when an ally flanks the target or when striking from hiding. Expert at locks and traps.",
    },
    st: { str: 10, dex: 16, con: 12, int: 12, wis: 12, cha: 14 },
    hd: 8,
    ac: 14,
    speed: 6,
    skills: ["dex", "cha"],
    expert: "dex",
    saves: ["dex", "int"],
    sneak: [1, 1, 2],
    abil: ["dagger", "shortbow", "hide", "cunningDash"],
  },
  cleric: {
    color: "#ffd23f",
    name: { tr: "Rahip", en: "Cleric" },
    hero: { tr: "Nurgaga", en: "Dawnbeak" },
    role: { tr: "Şifacı", en: "Healer" },
    desc: {
      tr: "Şifacı ve koruyucu. Uzaktan yara sarar, baygın dostları kaldırır, Kutsal Alev ile düşmanı yakar.",
      en: "Healer and protector. Mends wounds from afar, revives fallen allies, scorches foes with Sacred Flame.",
    },
    st: { str: 14, dex: 10, con: 14, int: 10, wis: 16, cha: 12 },
    hd: 8,
    ac: 16,
    speed: 5,
    skills: ["wis", "cha"],
    saves: ["wis", "cha"],
    abil: ["mace", "sacredFlame", "healingWord", "bless"],
  },
  ranger: {
    color: "#48e0a0",
    name: { tr: "Korucu", en: "Ranger" },
    hero: { tr: "Sazkanat", en: "Reedwing" },
    role: { tr: "Okçu", en: "Archer" },
    desc: {
      tr: "Uzak menzilin kralı. Avcı İşareti koyduğu hedefe fazladan hasar verir. Doğa ve hayvan uzmanı.",
      en: "King of range. Deals extra damage to the target of their Hunter's Mark. Expert in nature and beasts.",
    },
    st: { str: 12, dex: 16, con: 13, int: 10, wis: 14, cha: 8 },
    hd: 10,
    ac: 14,
    speed: 6,
    skills: ["dex", "wis"],
    saves: ["str", "dex"],
    abil: ["longbow", "shortsword", "huntersMark", "volley"],
  },
  bard: {
    color: "#ff6fae",
    name: { tr: "Ozan", en: "Bard" },
    hero: { tr: "Cıvıltı", en: "Trill" },
    role: { tr: "Destek", en: "Support" },
    desc: {
      tr: "Sözüyle yaralar, şarkısıyla ilham verir. İkna ve kandırmada üstüne yok; düşmanları uyutabilir.",
      en: "Wounds with words, inspires with song. Unmatched at persuasion and trickery; can put foes to sleep.",
    },
    st: { str: 8, dex: 14, con: 13, int: 12, wis: 10, cha: 16 },
    hd: 8,
    ac: 13,
    speed: 5,
    skills: ["cha", "dex"],
    expert: "cha",
    saves: ["dex", "cha"],
    abil: ["rapier", "viciousMockery", "inspire", "sleep"],
  },
};
const CLASS_ORDER = ["fighter", "wizard", "rogue", "cleric", "ranger", "bard"];

/* ---------------- Yetenekler ----------------
   cost: a = eylem, b = ek eylem
   tgt: foe | ally | self | area | allies
   roll: atk (saldırı zarı) | save (hedef kurtarma zarı) | auto (şaşmaz)
   dmg: [zar sayısı, zar yüzü, ek] — ek bir özellik adı, sayı ya da "lvl" olabilir
   uses: seviye 1/2/3 için savaş başına kullanım (yoksa sınırsız) */
const ABIL = {
  sword: {
    icon: "⚔️", cost: "a", tgt: "foe", range: 1, roll: "atk", stat: "str", dmg: [1, 8, "str"], anim: "slash", attacks: [1, 1, 2],
    name: { tr: "Uzun Kılıç", en: "Longsword" },
    desc: { tr: "Yakın dövüş. 3. seviyede iki kez vurur.", en: "Melee. Strikes twice at level 3." },
  },
  javelin: {
    icon: "🔱", cost: "a", tgt: "foe", range: 6, roll: "atk", stat: "str", dmg: [1, 6, "str"], anim: "spear",
    name: { tr: "Cirit", en: "Javelin" },
    desc: { tr: "6 kare menzilli atış.", en: "Thrown, 6 tiles." },
  },
  secondWind: {
    icon: "💨", cost: "b", tgt: "self", heal: [1, 10, "lvl"], uses: [1, 1, 1], anim: "heal",
    name: { tr: "İkinci Nefes", en: "Second Wind" },
    desc: { tr: "Ek eylem: kendini 1d10 + seviye iyileştirir.", en: "Bonus action: heal yourself 1d10 + level." },
  },
  shieldBash: {
    icon: "💥", lvl: 2, cost: "a", tgt: "foe", range: 1, roll: "atk", stat: "str", dmg: [1, 6, "str"], uses: [0, 1, 2], anim: "slash",
    onHit: { save: "con", cond: "stun", t: 1 },
    name: { tr: "Kalkan Darbesi", en: "Shield Bash" },
    desc: { tr: "İsabet ederse hedef DAY kurtarmasını geçemezse bir tur sersemler.", en: "On a hit the target must pass a CON save or be stunned for a turn." },
  },
  firebolt: {
    icon: "🔥", cost: "a", tgt: "foe", range: 8, roll: "atk", stat: "int", dmg: [1, 10, 0], dtype: "fire", anim: "bolt",
    name: { tr: "Ateş Oku", en: "Fire Bolt" },
    desc: { tr: "8 kare menzil, 1d10 ateş hasarı.", en: "8 tiles, 1d10 fire damage." },
  },
  magicMissile: {
    icon: "✨", cost: "a", tgt: "foe", range: 8, roll: "auto", dmg: [3, 4, 3], dtype: "force", uses: [2, 2, 3], anim: "missile",
    name: { tr: "Sihirli Füze", en: "Magic Missile" },
    desc: { tr: "Asla ıskalamaz: 3d4 + 3 hasar.", en: "Never misses: 3d4 + 3 damage." },
  },
  fireball: {
    icon: "☄️", lvl: 2, cost: "a", tgt: "area", radius: 1, range: 8, roll: "save", save: "dex", stat: "int", dmg: [3, 6, 0], half: true, dtype: "fire", uses: [0, 1, 2], friendly: true, anim: "fireball",
    name: { tr: "Ateş Topu", en: "Fireball" },
    desc: { tr: "3x3 alan, 3d6 ateş (ÇEV kurtarması yarıya indirir). Dostları da yakar!", en: "3x3 area, 3d6 fire (DEX save halves). Burns allies too!" },
  },
  dagger: {
    icon: "🗡️", cost: "a", tgt: "foe", range: 1, roll: "atk", stat: "dex", dmg: [1, 6, "dex"], sneak: true, anim: "slash",
    name: { tr: "Hançer", en: "Dagger" },
    desc: { tr: "Yakın dövüş, Sinsi Saldırı yapabilir.", en: "Melee, can Sneak Attack." },
  },
  shortbow: {
    icon: "🏹", cost: "a", tgt: "foe", range: 8, roll: "atk", stat: "dex", dmg: [1, 6, "dex"], sneak: true, anim: "arrow",
    name: { tr: "Kısa Yay", en: "Shortbow" },
    desc: { tr: "8 kare menzil, Sinsi Saldırı yapabilir.", en: "8 tiles, can Sneak Attack." },
  },
  hide: {
    icon: "🌑", cost: "b", tgt: "self", cond: "hidden", noAdjFoe: true, anim: "hide",
    name: { tr: "Gölgelere Karış", en: "Hide" },
    desc: { tr: "Ek eylem: sonraki saldırın avantajlı, sana saldıranlar dezavantajlı. Yanında düşman varken olmaz.", en: "Bonus action: your next attack has advantage and attacks against you have disadvantage. Not while a foe is adjacent." },
  },
  cunningDash: {
    icon: "👟", lvl: 2, cost: "b", tgt: "self", dash: true,
    name: { tr: "Sinsi Hamle", en: "Cunning Dash" },
    desc: { tr: "Ek eylem: hareketin iki katına çıkar.", en: "Bonus action: double your movement." },
  },
  mace: {
    icon: "🔨", cost: "a", tgt: "foe", range: 1, roll: "atk", stat: "str", dmg: [1, 6, "str"], anim: "slash",
    name: { tr: "Topuz", en: "Mace" },
    desc: { tr: "Yakın dövüş.", en: "Melee." },
  },
  sacredFlame: {
    icon: "🕯️", cost: "a", tgt: "foe", range: 6, roll: "save", save: "dex", stat: "wis", dmg: [1, 8, 0], dtype: "radiant", anim: "holy",
    name: { tr: "Kutsal Alev", en: "Sacred Flame" },
    desc: { tr: "6 kare. Hedef ÇEV kurtarmasını geçemezse 1d8 ışık hasarı.", en: "6 tiles. 1d8 radiant damage unless the target passes a DEX save." },
  },
  healingWord: {
    icon: "💚", cost: "b", tgt: "ally", range: 6, heal: [1, 8, "wis"], uses: [2, 2, 3], anim: "heal",
    name: { tr: "Şifa Sözü", en: "Healing Word" },
    desc: { tr: "Ek eylem, 6 kare: 1d8 + 3 iyileştirir. Baygın dostu kaldırır.", en: "Bonus action, 6 tiles: heals 1d8 + 3. Revives a fallen ally." },
  },
  bless: {
    icon: "🙏", lvl: 2, cost: "a", tgt: "allies", range: 6, cond: "bless", uses: [0, 1, 1], anim: "bless",
    name: { tr: "Kutsama", en: "Bless" },
    desc: { tr: "6 kare içindeki bütün dostlar savaş boyunca saldırı ve kurtarma zarlarına +1d4 ekler.", en: "All allies within 6 tiles add +1d4 to attack rolls and saves for the fight." },
  },
  longbow: {
    icon: "🏹", cost: "a", tgt: "foe", range: 10, roll: "atk", stat: "dex", dmg: [1, 8, "dex"], anim: "arrow",
    name: { tr: "Uzun Yay", en: "Longbow" },
    desc: { tr: "10 kare menzil.", en: "10 tiles." },
  },
  shortsword: {
    icon: "🗡️", cost: "a", tgt: "foe", range: 1, roll: "atk", stat: "dex", dmg: [1, 6, "dex"], anim: "slash",
    name: { tr: "Kısa Kılıç", en: "Shortsword" },
    desc: { tr: "Yakın dövüş.", en: "Melee." },
  },
  huntersMark: {
    icon: "🎯", cost: "b", tgt: "foe", range: 10, cond: "marked", uses: [1, 1, 2], anim: "mark",
    name: { tr: "Avcı İşareti", en: "Hunter's Mark" },
    desc: { tr: "Ek eylem: işaretlediğin hedefe her isabette +1d6 hasar.", en: "Bonus action: +1d6 damage on every hit against the marked target." },
  },
  volley: {
    icon: "🌧️", lvl: 2, cost: "a", tgt: "area", radius: 1, range: 10, roll: "atkEach", stat: "dex", dmg: [1, 8, "dex"], uses: [0, 1, 1], anim: "volley",
    name: { tr: "Ok Yağmuru", en: "Volley" },
    desc: { tr: "3x3 alandaki her düşmana ayrı ok atar. Dostlara isabet etmez.", en: "Shoots every foe in a 3x3 area. Never hits allies." },
  },
  rapier: {
    icon: "🤺", cost: "a", tgt: "foe", range: 1, roll: "atk", stat: "dex", dmg: [1, 8, "dex"], anim: "slash",
    name: { tr: "Meç", en: "Rapier" },
    desc: { tr: "Yakın dövüş.", en: "Melee." },
  },
  viciousMockery: {
    icon: "🤪", cost: "a", tgt: "foe", range: 6, roll: "save", save: "wis", stat: "cha", dmg: [1, 4, 0], dtype: "psychic", onFail: { cond: "mocked", t: 1 }, anim: "mock",
    name: { tr: "Alaycı Söz", en: "Vicious Mockery" },
    desc: { tr: "6 kare. BİL kurtarmasını geçemeyen hedef 1d4 hasar alır ve sonraki saldırısı dezavantajlı olur.", en: "6 tiles. On a failed WIS save: 1d4 damage and disadvantage on its next attack." },
  },
  inspire: {
    icon: "🎵", cost: "b", tgt: "ally", noSelf: true, range: 6, cond: "inspired", uses: [2, 2, 3], anim: "inspire",
    name: { tr: "İlham", en: "Inspiration" },
    desc: { tr: "Ek eylem: bir dost bir sonraki zarına +1d6 ekler (savaş dışında da geçerli).", en: "Bonus action: an ally adds +1d6 to their next roll (lasts outside combat too)." },
  },
  sleep: {
    icon: "💤", lvl: 2, cost: "a", tgt: "area", radius: 1, range: 8, sleepPool: [5, 8], uses: [0, 1, 1], anim: "sleep",
    name: { tr: "Uyku", en: "Sleep" },
    desc: { tr: "5d8 atar; 3x3 alandaki düşmanlar en zayıftan başlayarak bu kadar canı tükenene dek uyur.", en: "Roll 5d8; foes in a 3x3 area fall asleep, weakest first, until the pool runs out." },
  },
  // herkesin kullanabildikleri
  dash: {
    icon: "🏃", cost: "a", tgt: "self", dash: true,
    name: { tr: "Koş", en: "Dash" },
    desc: { tr: "Eylemini harcayıp bir kez daha hareket et.", en: "Spend your action to move again." },
  },
  dodge: {
    icon: "🛡️", cost: "a", tgt: "self", cond: "dodge", anim: "hide",
    name: { tr: "Savun", en: "Dodge" },
    desc: { tr: "Sıran gelene kadar sana yapılan saldırılar dezavantajlı.", en: "Attacks against you have disadvantage until your next turn." },
  },
  potion: {
    icon: "🧪", cost: "b", tgt: "ally", range: 1, item: "potion", heal: [2, 4, 2], anim: "heal",
    name: { tr: "Şifa İksiri", en: "Healing Potion" },
    desc: { tr: "Ek eylem: kendine ya da yanındaki dosta 2d4 + 2. Baygın dostu kaldırır.", en: "Bonus action: 2d4 + 2 to you or an adjacent ally. Revives a fallen ally." },
  },
};
const GENERIC_ABIL = ["dash", "dodge", "potion"];

const CONDS = {
  stun: { icon: "💫", name: { tr: "Sersem", en: "Stunned" } },
  sleep: { icon: "💤", name: { tr: "Uyuyor", en: "Asleep" } },
  mocked: { icon: "🤪", name: { tr: "Alay edildi", en: "Mocked" }, end: true },
  marked: { icon: "🎯", name: { tr: "İşaretli", en: "Marked" } },
  bless: { icon: "🙏", name: { tr: "Kutsanmış", en: "Blessed" } },
  inspired: { icon: "🎵", name: { tr: "İlhamlı", en: "Inspired" } },
  hidden: { icon: "🌑", name: { tr: "Gizli", en: "Hidden" } },
  dodge: { icon: "🛡️", name: { tr: "Savunmada", en: "Dodging" } },
  poisoned: { icon: "🤢", name: { tr: "Zehirli", en: "Poisoned" }, end: true },
  fireRes: { icon: "🧯", name: { tr: "Ateşe dirençli", en: "Fire resistant" } },
};

/* ---------------- Düşmanlar ---------------- */
const FOES = {
  goblin: {
    name: { tr: "Goblin", en: "Goblin" }, sp: "foe:goblin", hp: "2d6", ac: 13, speed: 6,
    mods: { str: -1, dex: 2, con: 0, int: 0, wis: -1, cha: -1 },
    atk: [{ n: { tr: "Pala", en: "Scimitar" }, r: 1, hit: 4, dmg: "1d6+2" }],
  },
  goblinArcher: {
    name: { tr: "Goblin Okçu", en: "Goblin Archer" }, sp: "foe:goblinArcher", hp: "2d6", ac: 12, speed: 6, ai: "ranged",
    mods: { str: -1, dex: 2, con: 0, int: 0, wis: -1, cha: -1 },
    atk: [
      { n: { tr: "Kısa yay", en: "Shortbow" }, r: 8, hit: 4, dmg: "1d6+2", anim: "arrow" },
      { n: { tr: "Hançer", en: "Dagger" }, r: 1, hit: 4, dmg: "1d4+2" },
    ],
  },
  goblinBoss: {
    name: { tr: "Goblin Elebaşı", en: "Goblin Boss" }, sp: "foe:goblinBoss", hp: "4d6+4", ac: 15, speed: 6, multi: 2,
    mods: { str: 0, dex: 2, con: 1, int: 0, wis: -1, cha: 0 },
    atk: [{ n: { tr: "Satır", en: "Cleaver" }, r: 1, hit: 4, dmg: "1d6+2" }],
  },
  kobold: {
    name: { tr: "Kobold", en: "Kobold" }, sp: "foe:kobold", hp: "2d6", ac: 12, speed: 6, pack: true,
    mods: { str: -2, dex: 2, con: -1, int: -1, wis: -2, cha: -1 },
    atk: [{ n: { tr: "Mızrak", en: "Spear" }, r: 1, hit: 4, dmg: "1d6+2" }],
  },
  koboldSlinger: {
    name: { tr: "Kobold Sapancı", en: "Kobold Slinger" }, sp: "foe:koboldSlinger", hp: "2d6", ac: 12, speed: 6, pack: true, ai: "ranged",
    mods: { str: -2, dex: 2, con: -1, int: -1, wis: -2, cha: -1 },
    atk: [
      { n: { tr: "Sapan", en: "Sling" }, r: 6, hit: 4, dmg: "1d4+2", anim: "stone" },
      { n: { tr: "Hançer", en: "Dagger" }, r: 1, hit: 4, dmg: "1d4+2" },
    ],
  },
  koboldSpy: {
    name: { tr: "Kobold Casus", en: "Kobold Spy" }, sp: "foe:koboldSpy", hp: "3d6", ac: 13, speed: 6,
    mods: { str: -2, dex: 3, con: 0, int: 1, wis: 0, cha: 0 },
    atk: [{ n: { tr: "Hançer", en: "Dagger" }, r: 1, hit: 4, dmg: "1d4+2" }],
  },
  koboldChief: {
    name: { tr: "Şef Kırçık", en: "Chief Grizzik" }, sp: "foe:koboldChief", hp: "5d8+5", ac: 14, speed: 6, multiAt: 4,
    mods: { str: 2, dex: 1, con: 2, int: 0, wis: 0, cha: 1 },
    atk: [{ n: { tr: "Savaş baltası", en: "War axe" }, r: 1, hit: 5, dmg: "1d8+3" }],
  },
  spider: {
    name: { tr: "Mağara Örümceği", en: "Cave Spider" }, sp: "foe:spider", hp: "3d8", ac: 13, speed: 6,
    mods: { str: 1, dex: 3, con: 1, int: -4, wis: 0, cha: -4 },
    atk: [{ n: { tr: "Zehirli ısırık", en: "Venom bite" }, r: 1, hit: 4, dmg: "1d6+2", extra: "1d4", poison: true }],
  },
  wolf: {
    name: { tr: "Kurt", en: "Wolf" }, sp: "ally:wolf", hp: "2d8+2", ac: 13, speed: 8, pack: true,
    mods: { str: 1, dex: 2, con: 1, int: -4, wis: 1, cha: -2 },
    atk: [{ n: { tr: "Isırık", en: "Bite" }, r: 1, hit: 4, dmg: "2d4+2" }],
  },
  dragon: {
    name: { tr: "Kızılpençe", en: "Redclaw" }, sp: "foe:dragon", hp: "dragon", ac: 15, speed: 6, sz: 2, multiAt: 3, resist: ["fire"],
    mods: { str: 4, dex: 0, con: 3, int: 1, wis: 0, cha: 2 },
    atk: [
      { n: { tr: "Isırık", en: "Bite" }, r: 1, hit: 5, dmg: "1d10+3" },
      { n: { tr: "Pençe", en: "Claw" }, r: 1, hit: 5, dmg: "1d6+3" },
    ],
    breath: { range: 5, radius: 1, dc: 13, save: "dex", dmg: ["3d6", "3d6", "3d6", "4d6", "4d6", "4d6"] },
    trait: { tr: "Ateşe dirençli", en: "Resists fire" },
  },
};

/* ---------------- Karolar ---------------- */
const BLOCK_TILES = new Set(["T", "B", "o", "f", "R", "W", "N", "D", "c", "#", "t", "k", "L", "~", "b"]);
const OPAQUE_TILES = new Set(["T", "R", "W", "N", "D", "#", "t", "k"]);

/* =========================================================
   Hikâye
   Seçenek: { label, req, once, check:{s, dc, group}, cost, disc, ok, no, out }
   Sonuç: { text, fx, end, next }
   Etkiler (fx): flag · gold · item · dmg · heal · combat · tiles · hide · show ·
   open · ally · level · goto · end · cond · move · dialog
   ========================================================= */
const SCENES = {
  /* ===================== 1. SAZLIKÖY ===================== */
  village: {
    name: { tr: "Sazlıköy", en: "Reedmere" },
    theme: "village",
    dark: 0,
    map: [
      "TTTTTTTTTTTTTTTTTTTTTTTTTT",
      "TT.RRRRR...,...RRRRRR..TTT",
      "T..WNDNW.......WNWDNW...TT",
      "T....:............:.....,T",
      "T,...:............:......T",
      "T;~~;:::::::::::::::.....T",
      "T~~~~:.....,.........;...T",
      "T~~~~:::::::::::::::::::::",
      "T;~~;:....................",
      "T.;;.:............cc....,T",
      "T....:...............ffffT",
      "TRRRR:.......RRRR....f..fT",
      "TWDNW:.......WNDW....f..fT",
      "T.::::::::::::::...,.ffffT",
      "T,....,.......,.......,..T",
      "TTTTTTTTTTTTTTTTTTTTTTTTTT",
    ],
    spawn: [[7, 7], [8, 7], [7, 8], [8, 8], [6, 8], [9, 8]],
    intro: "intro",
    ents: [
      { id: "elder", sp: "npc:goose", x: 12, y: 8, ev: "elder", face: -1 },
      { id: "well", sp: "obj:well", x: 10, y: 9, ev: "well" },
      { id: "stall", sp: "obj:stall", x: 16, y: 9 },
      { id: "merchant", sp: "npc:merchant", x: 17, y: 9, ev: "merchant", face: -1 },
      { id: "innSign", sp: "obj:sign", x: 21, y: 2 },
      { id: "stranger", sp: "npc:stranger", x: 20, y: 3, ev: "stranger", foe: "koboldSpy", face: -1 },
    ],
    groups: {
      spy: { ents: ["stranger"], win: [["dialog", "spyWin"]] },
    },
    exit: {
      x: 25, y: 7, w: 1, h: 2, to: "forest",
      req: [["flag", "quest"]],
      msg: { tr: "Önce Kaz Nine ile konuşmalısınız.", en: "You should talk to Granny Goose first." },
      text: { tr: "Doğu yolu Fısıltı Ormanı'na uzanıyor. Yola çıkılsın mı? (Bütün grup birlikte gider.)", en: "The east road winds toward the Whispering Woods. Set out? (The whole party travels together.)" },
    },
    ev: {
      intro: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: {
          tr: "Sazlıköy'ün altın sazlıkları üç gecedir yanıyor. Her gece aynı kızıl gölge gökyüzünü yırtıyor: ejder Kızılpençe. Köylüler son umutlarını meydana çağırdı: bir avuç maceraperest ördek. Yani sizi.",
          en: "For three nights the golden reeds of Reedmere have burned. Each night the same crimson shadow tears across the sky: the dragon Redclaw. The villagers have called their last hope to the square: a handful of adventuring ducks. You.",
        },
        opts: [{ label: { tr: "Maceraya başla", en: "Begin the adventure" }, out: { end: true, fx: [["toast", "hintTalk"]] } }],
      },
      elder: {
        sp: "npc:goose",
        who: { tr: "Kaz Nine", en: "Granny Goose" },
        text: {
          tr: "Hoş geldiniz yavrularım. Kızılpençe tarlalarımızı yakıyor; sıradaki evlerimiz. Ejderi durdurun, köy kasasındaki 100 altın sizin olsun.",
          en: "Welcome, little ones. Redclaw is burning our fields, and our homes are next. Stop the dragon and the 100 gold in the village chest is yours.",
        },
        opts: [
          {
            label: { tr: "Ejder hakkında ne biliyorsun?", en: "What do you know about the dragon?" },
            once: true,
            out: {
              text: {
                tr: "Doğudaki ormanın ardında, eski madenin yanındaki dağda yaşar. Yıllarca kimseye dokunmadı. Saldırılar ancak bu ay başladı.",
                en: "It lives in the mountain past the eastern woods, beside the old mine. For years it harmed no one. The attacks only began this month.",
              },
            },
          },
          {
            label: { tr: "Peşin ödeme istiyoruz.", en: "We want payment up front." },
            once: true,
            check: { s: "cha", dc: 12 },
            ok: { text: { tr: "Kaz Nine iç çekip kesesini açtı: 'Peki peki, 50 altın şimdi.'", en: "Granny Goose sighs and opens her purse: 'Fine, fine. 50 gold now.'" }, fx: [["gold", 50]] },
            no: { text: { tr: "'Önce iş, sonra para!' diye gagasını şaklattı.", en: "'Work first, gold later!' she snaps her beak." } },
          },
          {
            label: { tr: "Bize bir şey söylemiyorsun.", en: "You're not telling us something." },
            once: true,
            check: { s: "wis", dc: 13 },
            ok: {
              text: {
                tr: "Gözlerini kaçırdı: 'Saldırılar, kobold madencilerin eski madene yerleşmesinden hemen sonra başladı. Tesadüf olmalı... değil mi?'",
                en: "She looks away: 'The attacks began right after kobold miners moved into the old mine. Must be a coincidence... right?'",
              },
              fx: [["flag", "clue"]],
            },
            no: { text: { tr: "'Bildiğim her şeyi anlattım,' diyor ama sesi titriyor.", en: "'I've told you all I know,' she says, but her voice wavers." } },
          },
          {
            label: { tr: "Görevi kabul ediyoruz.", en: "We accept the quest." },
            req: [["!flag", "quest"]],
            out: { text: { tr: "'Tanrılar yolunuzu açık etsin! Doğu yolu ormana çıkar.'", en: "'May the gods guide you! The east road leads to the woods.'" }, fx: [["flag", "quest"]], end: true },
          },
          { label: { tr: "Görüşürüz.", en: "Goodbye." }, req: [["flag", "quest"]], out: { end: true } },
        ],
      },
      merchant: {
        sp: "npc:merchant",
        who: { tr: "Gezgin Tüccar Pıtpıt", en: "Pip the Peddler" },
        text: {
          tr: "Pıtpıt hizmetinizde! Şifa iksiri mi lazım? Yoksa bir ejderle tanışmaya mı gidiyorsunuz? O zaman şu ejderotu merhemine bir bakın...",
          en: "Pip at your service! Need a healing potion? Or are you off to meet a dragon? Then take a look at this dragonweed salve...",
        },
        opts: [
          {
            label: { tr: "Şifa iksiri al ({cost} altın)", en: "Buy a healing potion ({cost} gold)" },
            cost: 25,
            disc: ["discount", 15],
            out: { text: { tr: "Bir şişe kırmızı iksir çantaya girdi.", en: "A bottle of red potion goes into the bag." }, fx: [["item", "potion", 1]] },
          },
          {
            label: { tr: "Ejderotu merhemi al ({cost} altın)", en: "Buy dragonweed salve ({cost} gold)" },
            req: [["!flag", "salve"]],
            cost: 40,
            disc: ["discount", 30],
            out: {
              text: { tr: "'Ejder ateşine birebir! Ejderle savaşırken ateş hasarınız yarıya iner.'", en: "'Works wonders against dragonfire! It halves fire damage when you fight a dragon.'" },
              fx: [["flag", "salve"]],
            },
          },
          {
            label: { tr: "Pazarlık et", en: "Haggle" },
            once: true,
            check: { s: "cha", dc: 13 },
            ok: { text: { tr: "'Of, beni soydunuz! Peki, her şey indirimli.'", en: "'Oof, you're robbing me! Fine, everything's discounted.'" }, fx: [["flag", "discount"]] },
            no: { text: { tr: "'Fiyatlar sabit, dostum.'", en: "'Prices are fixed, friend.'" } },
          },
          { label: { tr: "Hoşça kal", en: "Farewell" }, out: { end: true } },
        ],
      },
      stranger: {
        sp: "npc:stranger",
        who: { tr: "Kukuletalı Yabancı", en: "Hooded Stranger" },
        text: {
          tr: "Hanın kapısında kukuletalı biri oturuyor. Çorbasına hiç dokunmamış. 'Doğu yolu tehlikeli,' diye fısıldıyor. 'Geri dönün.'",
          en: "A hooded figure sits by the inn door, soup untouched. 'The east road is dangerous,' it whispers. 'Turn back.'",
        },
        opts: [
          {
            label: { tr: "Dikkatle incele", en: "Look closer" },
            once: true,
            check: { s: "wis", dc: 13 },
            ok: { text: { tr: "Kukuletanın altında kırmızı pullar ve yılan gibi sarı gözler parlıyor. Bu bir kobold!", en: "Beneath the hood: red scales and slitted yellow eyes. A kobold!" }, next: "stranger2" },
            no: { text: { tr: "Yabancı kukuletasını daha da indiriyor. Hiçbir şey seçemiyorsun.", en: "The stranger pulls the hood lower. You can't make anything out." } },
          },
          {
            label: { tr: "Saldır!", en: "Attack!" },
            out: { text: { tr: "Yabancı pelerinini savurup bir hançer çekiyor!", en: "The stranger flings back its cloak and draws a dagger!" }, fx: [["combat", "spy"]] },
          },
          { label: { tr: "Kendi işine bak", en: "Leave it be" }, out: { end: true } },
        ],
      },
      stranger2: {
        sp: "foe:koboldSpy",
        who: { tr: "Kobold Çıtır", en: "Snik the Kobold" },
        text: {
          tr: "Kobold tıslıyor: 'Bağırmayın! Ben sadece izliyordum. Şef Kırçık köylülerin ne yapacağını öğrenmek istedi.'",
          en: "The kobold hisses: 'Don't shout! I was only watching. Chief Grizzik wanted to know what the villagers would do.'",
        },
        opts: [
          {
            label: { tr: "Konuş, yoksa muhafızları çağırırız!", en: "Talk, or we call the guards!" },
            once: true,
            check: { s: "cha", dc: 12 },
            ok: {
              text: {
                tr: "'Tamam, tamam! Şef, ejderin yuvasından parlak bir şey çaldı: kırmızı, sıcak bir yumurta! Ejder bu yüzden öfkeli. Madenin parolası Kor. Lütfen bırakın beni!' Kobold koşarak gözden kayboluyor.",
                en: "'Okay, okay! The chief stole something shiny from the dragon's nest: a red, warm egg! That's why the dragon is angry. The mine's password is Ember. Please let me go!' The kobold scurries off.",
              },
              fx: [["flag", "eggClue"], ["flag", "password"], ["hide", "stranger"]],
              end: true,
            },
            no: { text: { tr: "'Hiçbir şey söylemem!' Kobold masayı devirip karanlığa fırlıyor.", en: "'I'll tell you nothing!' The kobold flips the table and bolts into the dark." }, fx: [["hide", "stranger"]], end: true },
          },
          { label: { tr: "Saldır!", en: "Attack!" }, out: { text: { tr: "Kobold bir hançer çekiyor!", en: "The kobold draws a dagger!" }, fx: [["combat", "spy"]] } },
          { label: { tr: "Git, bir daha görmeyelim seni.", en: "Go, and don't come back." }, out: { text: { tr: "Kobold minnetle eğilip gölgelere karışıyor.", en: "The kobold bows gratefully and melts into the shadows." }, fx: [["hide", "stranger"]], end: true } },
        ],
      },
      spyWin: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: {
          tr: "Koboldun cebinden buruşuk bir not düştü: 'Parola: Kor. Yumurtayı kimse görmesin. — Ş.K.' Yanında da {n} altın vardı.",
          en: "A crumpled note falls from the kobold's pocket: 'Password: Ember. Let no one see the egg. — G.' There were also {n} gold coins.",
        },
        fx: [["flag", "password"], ["flag", "eggClue"], ["gold", "2d6"]],
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      well: {
        sp: "obj:well",
        who: { tr: "Dilek Kuyusu", en: "Wishing Well" },
        text: { tr: "Köyün eski dilek kuyusu. Dibinde sayısız bakır para parlıyor.", en: "The village's old wishing well. Countless copper coins glint at the bottom." },
        opts: [
          {
            label: { tr: "Bir altın at, dilek tut", en: "Toss a coin and make a wish" },
            once: true,
            cost: 1,
            check: { s: null, dc: 13 },
            ok: { text: { tr: "Kuyudan hafif bir ışık yükseldi. Hepinizin içini cesaret kapladı! (Herkes İlhamlı)", en: "A faint light rises from the well. Courage fills you all! (Everyone is Inspired)" }, fx: [["cond", "all", "inspired"]] },
            no: { text: { tr: "Para dibe gömüldü. Hiçbir şey olmadı... belki de dilekler böyle çalışmıyordur.", en: "The coin sinks. Nothing happens... maybe wishes don't work like that." } },
          },
          {
            label: { tr: "Paraları kovayla topla", en: "Fish the coins out with the bucket" },
            once: true,
            check: { s: "dex", dc: 13 },
            ok: { text: { tr: "Kimse görmeden {n} altın çıkardın. Utanmaz!", en: "Unseen, you fish out {n} gold. Shameless!" }, fx: [["gold", "2d6"]] },
            no: { text: { tr: "Kovanın ipi koptu; {hero} kuyuya düşmemek için zor tutundu ve elini sıyırdı.", en: "The rope snaps; {hero} barely avoids falling in and scrapes a wing." }, fx: [["dmg", "1d4", "hero"]] },
          },
          { label: { tr: "Uzaklaş", en: "Walk away" }, out: { end: true } },
        ],
      },
    },
  },

  /* ===================== 2. FISILTI ORMANI ===================== */
  forest: {
    name: { tr: "Fısıltı Ormanı", en: "Whispering Woods" },
    theme: "forest",
    dark: 0.12,
    map: [
      "TTTTTTTTTTTTT~~TTTTTTTTTTTTT",
      "TTTTT..TTTTTT~~TTTTTTTTTTTTT",
      "TTT.,....TTTT~~T..TTTTT..TTT",
      "TT.......,TTT~~...BTTT....TT",
      "TTT...;...TT.~~.....B..B...T",
      "TTTTT.:.TTT..~~..........B.T",
      "TTTTTT:BTT...~~.B.....B.....",
      ":::::::::::::bb:::::::::::::",
      ".....T.:.BT..~~...B......B..",
      "TT.TTT.:.TT..~~.....B.......",
      "TTTT...:..T..~~..B....B..B.T",
      "TTT.,......;.~~T......,...TT",
      "TTT.........;~~T..,......TTT",
      "TTTT..,....;.~~..TT...TTTTTT",
      "TTTTTTTT..TTT~~TTTTTTTTTTTTT",
      "TTTTTTTTTTTTT~~TTTTTTTTTTTTT",
    ],
    spawn: [[1, 7], [2, 7], [1, 8], [2, 8], [3, 8], [0, 8]],
    intro: "intro",
    ents: [
      { id: "bridge", sp: null, x: 13, y: 7, ev: "bridge" },
      { id: "wolf", sp: "npc:wolfTrap", x: 5, y: 3, ev: "wolf" },
      { id: "shrine", sp: "obj:shrine", x: 5, y: 11, ev: "shrine" },
      { id: "camp", sp: "fire", x: 25, y: 11, ev: "camp", light: 4 },
      { id: "g1", sp: "foe:goblin", x: 21, y: 6, foe: "goblin", hidden: true },
      { id: "g2", sp: "foe:goblinArcher", x: 22, y: 4, foe: "goblinArcher", hidden: true, n: 2 },
      { id: "g3", sp: "foe:goblin", x: 21, y: 9, foe: "goblin", hidden: true, n: 3 },
      { id: "g4", sp: "foe:goblin", x: 24, y: 8, foe: "goblin", hidden: true, n: 4 },
      { id: "g5", sp: "foe:goblinBoss", x: 21, y: 10, foe: "goblinBoss", hidden: true, n: 5 },
      { id: "g6", sp: "foe:goblinArcher", x: 24, y: 5, foe: "goblinArcher", hidden: true, n: 6 },
    ],
    zones: [{ x: 17, y: 2, w: 2, h: 12, ev: "ambush", until: "ambushDone" }],
    groups: {
      ambush: { ents: ["g1", "g2", "g3", "g4", "g5", "g6"], win: [["flag", "ambushDone"], ["dialog", "ambushWin"]] },
    },
    exit: {
      x: 27, y: 6, w: 1, h: 3, to: "cave",
      req: [["flag", "ambushDone"]],
      msg: { tr: "Önce yolu tutan tehlikeyle yüzleşmelisiniz.", en: "You must deal with what's lurking on the road first." },
      text: { tr: "Ağaçlar seyreliyor; ileride dağın eteğinde eski maden görünüyor. Devam edilsin mi?", en: "The trees thin out; ahead, the old mine sits at the foot of the mountain. Continue?" },
      fx: [["level", 2]],
    },
    ev: {
      intro: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: {
          tr: "Fısıltı Ormanı'nda ağaçlar kendi aralarında konuşuyormuş gibi hışırdıyor. Yol, köpüklü bir derenin kıyısında aniden bitiyor: köprü yıkılmış.",
          en: "In the Whispering Woods the trees rustle as if gossiping. The path ends abruptly at a foaming stream: the bridge has collapsed.",
        },
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      bridge: {
        sp: "ui:scroll",
        who: { tr: "Yıkık Köprü", en: "Broken Bridge" },
        text: { tr: "Köprünün tahtaları dereye savrulmuş. Su soğuk ve hızlı akıyor. Kıyıda devrilmiş kocaman bir kütük yatıyor.", en: "The bridge planks have been swept away. The water runs cold and fast. A huge fallen log lies on the bank." },
        opts: [
          {
            label: { tr: "Kütüğü itip derenin üstüne devir", en: "Heave the log across the stream" },
            once: true,
            check: { s: "str", dc: 14 },
            ok: { text: { tr: "{hero} homurdanarak kütüğü derenin üstüne devirdi. Sağlam bir köprü!", en: "With a grunt, {hero} topples the log across the stream. A sturdy bridge!" }, fx: [["tiles", [[13, 7, "="], [14, 7, "="]]], ["hide", "bridge"], ["flag", "crossed"]], end: true },
            no: { text: { tr: "Kütük kıpırdamadı bile. {hero} sırtını incitti.", en: "The log won't budge. {hero} strains their back." }, fx: [["dmg", "1d4", "hero"]] },
          },
          {
            label: { tr: "Taştan taşa atla, karşıya ip bağla", en: "Hop across the stones and tie a rope" },
            once: true,
            check: { s: "dex", dc: 12 },
            ok: { text: { tr: "{hero} taştan taşa sekip karşıya geçti ve ipi bir ağaca bağladı. Herkes ipe tutunarak geçebilir.", en: "{hero} skips from stone to stone, crosses and ties the rope to a tree. Everyone can cross holding on." }, fx: [["tiles", [[13, 7, "="], [14, 7, "="]]], ["hide", "bridge"], ["flag", "crossed"]], end: true },
            no: { text: { tr: "{hero} yosunlu bir taşta kaydı ve buz gibi suya düştü!", en: "{hero} slips on a mossy stone and plunges into the icy water!" }, fx: [["dmg", "1d6", "hero"]] },
          },
          {
            label: { tr: "Derenin aşağısında sığ bir yer ara", en: "Search downstream for a shallow ford" },
            once: true,
            check: { s: "int", dc: 12 },
            ok: { text: { tr: "{hero} akıntının yavaşladığı yeri buldu: güneyde, taşlarla dolu sığ bir geçit!", en: "{hero} reads the current and finds where it slows: a shallow, stony ford to the south!" }, fx: [["tiles", [[13, 13, "v"], [14, 13, "v"]]], ["flag", "crossed"]], end: true },
            no: { text: { tr: "Akıntıyı inceledin ama derenin her yeri derin görünüyor.", en: "You study the current, but the whole stream looks deep." } },
          },
          {
            label: { tr: "Yüzerek geç (herkes 1d4 hasar alır)", en: "Swim across (everyone takes 1d4)" },
            out: { text: { tr: "Dişlerinizi sıkıp buz gibi suya daldınız. Karşıya geçtiniz ama hepiniz tir tir titriyorsunuz.", en: "You grit your beaks and dive into the icy water. You make it across, shivering." }, fx: [["dmg", "1d4", "all"], ["move", 16, 7], ["flag", "crossed"]], end: true },
          },
          { label: { tr: "Şimdilik bırak", en: "Leave it for now" }, out: { end: true } },
        ],
      },
      wolf: {
        sp: "npc:wolfTrap",
        who: { tr: "Kapana Kısılmış Kurt", en: "Trapped Wolf" },
        text: { tr: "Bir kurt paslı bir ayı kapanına sıkışmış. Hırlıyor ama gözlerinde korku var.", en: "A wolf is caught in a rusty bear trap. It snarls, but there's fear in its eyes." },
        opts: [
          {
            label: { tr: "Sakinleştir ve kapanı aç", en: "Calm it and open the trap" },
            once: true,
            check: { s: "wis", dc: 13 },
            ok: { text: { tr: "{hero} yumuşak bir sesle konuşup kapanı açtı. Kurt elini kokladı... ve yanınızdan ayrılmadı. Yeni bir yol arkadaşı! (Savaşlarda sizinle dövüşecek.)", en: "{hero} speaks softly and opens the trap. The wolf sniffs their wing... and stays. A new companion! (It will fight by your side.)" }, fx: [["ally", "wolf"]], end: true },
            no: { text: { tr: "Panikleyen kurt, {hero} yaklaşınca ısırdı; kapanı koparıp ormana kaçtı.", en: "The panicked wolf bites {hero}, tears free and flees into the woods." }, fx: [["dmg", "1d6", "hero"], ["hide", "wolf"]], end: true },
          },
          {
            label: { tr: "Bir dalla kapanı uzaktan kanırt", en: "Pry the trap open with a branch" },
            once: true,
            check: { s: "str", dc: 12 },
            ok: { text: { tr: "Kapan açıldı. Kurt bir an duraksadı, sonra bir uluma bırakıp ağaçların arasında kayboldu.", en: "The trap springs open. The wolf pauses, howls once, and vanishes among the trees." }, fx: [["hide", "wolf"]], end: true },
            no: { text: { tr: "Dal kırıldı, kapan kıpırdamadı.", en: "The branch snaps; the trap won't move." } },
          },
          { label: { tr: "Kendi haline bırak", en: "Leave it" }, out: { end: true } },
        ],
      },
      shrine: {
        sp: "obj:shrine",
        who: { tr: "Ay Sunağı", en: "Moon Shrine" },
        text: { tr: "Yosun tutmuş taş bir sunak. Üstüne hilal biçiminde rünler kazınmış.", en: "A moss-covered stone shrine carved with crescent-shaped runes." },
        opts: [
          {
            label: { tr: "Rünleri oku", en: "Read the runes" },
            once: true,
            check: { s: "int", dc: 13 },
            ok: {
              text: {
                tr: "Eski bir efsane: 'Ejder, yuvası bozulmadıkça uyur; öfkesi ancak çalınan geri dönünce diner.' Sunak hafifçe parladı, hepinizin içi ilhamla doldu.",
                en: "An old legend: 'A dragon sleeps while its nest is undisturbed; its fury fades only when what was stolen returns.' The shrine glows; you all feel inspired.",
              },
              fx: [["flag", "lore"], ["cond", "all", "inspired"]],
            },
            no: { text: { tr: "Rünler çok eski. Anlamlarını çıkaramadın.", en: "The runes are ancient. You can't make sense of them." } },
          },
          {
            label: { tr: "Dua et", en: "Pray" },
            once: true,
            check: { s: null, dc: 10 },
            ok: { text: { tr: "Ay ışığı kadar serin bir esinti yaralarınızı sardı.", en: "A breeze as cool as moonlight soothes your wounds." }, fx: [["heal", "1d8", "all"]] },
            no: { text: { tr: "Sunak sessiz kaldı.", en: "The shrine stays silent." } },
          },
          { label: { tr: "Devam et", en: "Move on" }, out: { end: true } },
        ],
      },
      ambush: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: { tr: "Çalılar kıpırdıyor... Yolun iki yanında bir şeyler sinsice bekliyor.", en: "The bushes stir... Something lurks on both sides of the path." },
        opts: [
          {
            label: { tr: "Etrafı dikkatle kolla", en: "Keep a careful watch" },
            check: { s: "wis", dc: 13 },
            ok: { text: { tr: "{hero} çalıların arasında parlayan gözleri fark etti: goblinler! Onlar davranmadan siz davrandınız.", en: "{hero} spots glinting eyes in the bushes: goblins! You strike before they can." }, fx: [["combat", "ambush", { surprise: "foes" }]] },
            no: { text: { tr: "Hiçbir şey göremedin... ta ki oklar vızıldayana kadar! Goblin pususu!", en: "You see nothing... until arrows whistle past! A goblin ambush!" }, fx: [["combat", "ambush", { surprise: "heroes" }]] },
          },
          { label: { tr: "Seslen: 'Kim var orada?'", en: "Call out: 'Who's there?'" }, out: { next: "ambushTalk" } },
          { label: { tr: "Çalılara dal, saldır!", en: "Charge the bushes!" }, out: { text: { tr: "Silahlarınızı çekip çalılara daldınız. Goblinler!", en: "You draw your weapons and charge the bushes. Goblins!" }, fx: [["combat", "ambush"]] } },
        ],
      },
      ambushTalk: {
        sp: "foe:goblin",
        who: { tr: "Goblin", en: "Goblin" },
        text: { tr: "Çalılardan sırıtan bir goblin çıkıyor: 'Bu yol Goblin Yolu! Geçiş ücreti 20 altın! Yoksa...'", en: "A grinning goblin pops out of the bushes: 'This is Goblin Road! Toll is 20 gold! Or else...'" },
        opts: [
          {
            label: { tr: "Öde ({cost} altın)", en: "Pay ({cost} gold)" },
            cost: 20,
            out: { text: { tr: "Goblinler altınları kapıp kıkırdayarak ormana dağıldı.", en: "The goblins snatch the gold and scatter into the woods, giggling." }, fx: [["flag", "ambushDone"]], end: true },
          },
          {
            label: { tr: "Gözdağı ver", en: "Intimidate them" },
            once: true,
            check: { s: "str", dc: 14 },
            ok: { text: { tr: "{hero} silahını kaldırıp öyle bir kükredi ki goblinler çığlık çığlığa kaçıştı!", en: "{hero} raises a weapon and roars so loud the goblins flee shrieking!" }, fx: [["flag", "ambushDone"]], end: true },
            no: { text: { tr: "Goblinler kahkahayı bastı: 'Saldırın!'", en: "The goblins burst out laughing: 'Get them!'" }, fx: [["combat", "ambush"]] },
          },
          {
            label: { tr: "Kandır: 'Arkamızda bir ejder var!'", en: "Bluff: 'There's a dragon behind us!'" },
            once: true,
            check: { s: "cha", dc: 13 },
            ok: { text: { tr: "Goblinler gökyüzüne bakıp panikle kaçtı. Ejder adı her kapıyı açıyor!", en: "The goblins glance at the sky and flee in panic. A dragon's name opens every door!" }, fx: [["flag", "ambushDone"]], end: true },
            no: { text: { tr: "'Ejder mi? Hah! Yakalayın şunları!'", en: "'A dragon? Hah! Get them!'" }, fx: [["combat", "ambush"]] },
          },
          { label: { tr: "Saldır!", en: "Attack!" }, out: { fx: [["combat", "ambush"]] } },
        ],
      },
      ambushWin: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: { tr: "Son goblin de devrildi. Ceplerinden {n} altın ve bir şifa iksiri çıktı.", en: "The last goblin falls. Their pockets hold {n} gold and a healing potion." },
        fx: [["gold", "3d6"], ["item", "potion", 1]],
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      camp: {
        sp: "fire",
        who: { tr: "Terk Edilmiş Kamp", en: "Abandoned Camp" },
        text: { tr: "Terk edilmiş bir kamp ateşi. Közler hâlâ sıcak. Burada dinlenebilirsiniz.", en: "An abandoned campfire with embers still warm. You could rest here." },
        opts: [
          { label: { tr: "Dinlen (herkes tamamen iyileşir)", en: "Rest (everyone fully heals)" }, once: true, out: { text: { tr: "Bir süre dinlendiniz. Yaralarınız kapandı, güçleriniz yerine geldi.", en: "You rest a while. Your wounds close and your strength returns." }, fx: [["heal", "full", "all"]] } },
          { label: { tr: "Yola devam", en: "Move on" }, out: { end: true } },
        ],
      },
    },
  },

  /* ===================== 3. KOBOLD MADENİ ===================== */
  cave: {
    name: { tr: "Kobold Madeni", en: "Kobold Mine" },
    theme: "cave",
    dark: 0.72,
    map: [
      "#######################t##t###",
      "########.%..k..x..###.g....g.#",
      "########..x.....%.###........#",
      "########....x................#",
      "########.k......x.###..g.....#",
      "########..%...x...###........#",
      "##########........###.......g#",
      "######t#####t##...###........#",
      "####..............###.........",
      "####..rrrrrrrrrr..###.........",
      "####..#########.#####........#",
      "####..######ppppppp###########",
      "####..######p......###########",
      "..........##.......###########",
      "..o.......##.......###########",
      ".........o##ppppppp###########",
      ",.........####################",
      "..o...,...####################",
    ],
    lights: [[4, 16, 8], [8, 14, 5], [1, 13, 5]],
    spawn: [[1, 16], [2, 16], [1, 17], [3, 16], [3, 17], [0, 16]],
    intro: "intro",
    ents: [
      { id: "kg1", sp: "foe:kobold", x: 3, y: 13, foe: "kobold", face: 1 },
      { id: "kg2", sp: "foe:kobold", x: 6, y: 13, foe: "kobold", face: -1, n: 2 },
      { id: "kg3", sp: "foe:koboldSlinger", x: 8, y: 13, foe: "koboldSlinger", n: 3, face: -1 },
      { id: "kg4", sp: "foe:kobold", x: 1, y: 13, foe: "kobold", n: 5 },
      { id: "s1", sp: "foe:spider", x: 12, y: 3, foe: "spider", hidden: true },
      { id: "s2", sp: "foe:spider", x: 10, y: 5, foe: "spider", hidden: true, n: 2 },
      { id: "s3", sp: "foe:spider", x: 14, y: 2, foe: "spider", hidden: true, n: 4 },
      { id: "s4", sp: "foe:spider", x: 16, y: 2, foe: "spider", hidden: true, n: 6 },
      { id: "door", sp: "obj:door", x: 18, y: 3, ev: "door" },
      { id: "camp", sp: "fire", x: 14, y: 13, ev: "camp", light: 4 },
      { id: "chest1", sp: "obj:chest", x: 17, y: 12, ev: "chest1" },
      { id: "throne", sp: "obj:throne", x: 25, y: 2 },
      { id: "chief", sp: "foe:koboldChief", x: 25, y: 3, foe: "koboldChief", face: -1 },
      { id: "k1", sp: "foe:kobold", x: 23, y: 5, foe: "kobold", n: 2, face: -1 },
      { id: "k2", sp: "foe:koboldSlinger", x: 27, y: 6, foe: "koboldSlinger", n: 3, face: -1 },
      { id: "k3", sp: "foe:kobold", x: 24, y: 8, foe: "kobold", n: 4, face: -1 },
      { id: "k4", sp: "foe:koboldSlinger", x: 27, y: 4, foe: "koboldSlinger", n: 5, face: -1 },
      { id: "k5", sp: "foe:kobold", x: 26, y: 9, foe: "kobold", n: 6, face: -1 },
      { id: "k6", sp: "foe:kobold", x: 22, y: 7, foe: "kobold", hidden: true, reserve: true, face: -1 },
      { id: "k7", sp: "foe:kobold", x: 23, y: 1, foe: "kobold", hidden: true, reserve: true, n: 3, face: -1 },
      { id: "chest2", sp: "obj:chest", x: 27, y: 2, ev: "chest2" },
    ],
    zones: [
      { x: 0, y: 13, w: 10, h: 1, ev: "guards", until: "guardsDone" },
      { x: 9, y: 8, w: 1, h: 2, ev: "trap", until: "trapDone" },
      { x: 15, y: 7, w: 3, h: 1, ev: "spiders", until: "spidersDone" },
      { x: 21, y: 2, w: 1, h: 3, ev: "chief", until: "chiefDone" },
    ],
    groups: {
      guards: { ents: ["kg1", "kg2", "kg3", "kg4"], win: [["flag", "guardsDone"], ["dialog", "guardsWin"]] },
      spiders: { ents: ["s1", "s2", "s3", "s4"], win: [["flag", "spidersDone"], ["dialog", "spidersWin"]] },
      chief: { ents: ["chief", "k1", "k2", "k3", "k4", "k5", "k6", "k7"], win: [["flag", "chiefDone"], ["dialog", "chiefWin"]] },
    },
    exit: {
      x: 29, y: 8, w: 1, h: 2, to: "lair",
      req: [["flag", "chiefDone"]],
      msg: { tr: "Kobold şefi tüneli tutuyor.", en: "The kobold chief holds the tunnel." },
      text: { tr: "Tünel yukarı, sıcak ve kükürt kokan bir mağaraya çıkıyor. Kızılpençe'nin ini... Hazır mısınız?", en: "The tunnel climbs toward a hot cave that reeks of sulfur. Redclaw's lair... Are you ready?" },
      fx: [["level", 3]],
    },
    ev: {
      intro: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: {
          tr: "Maden girişi dağın yamacında bir yara gibi açılıyor. İçeriden kazma sesleri ve kobold kıkırtıları geliyor. Girişte nöbetçiler bekliyor. (Seviye 2: yeni yetenekler açıldı!)",
          en: "The mine entrance gapes in the mountainside like a wound. Pickaxes clink and kobolds cackle within. Guards stand at the entrance. (Level 2: new abilities unlocked!)",
        },
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      guards: {
        sp: "foe:kobold",
        who: { tr: "Kobold Nöbetçiler", en: "Kobold Guards" },
        text: { tr: "'Dur! Kim var orada?' Mızraklı koboldlar yolunuzu kesiyor.", en: "'Halt! Who goes there?' Spear-wielding kobolds block your way." },
        opts: [
          {
            label: { tr: "Parolayı söyle: 'Kor'", en: "Say the password: 'Ember'" },
            req: [["flag", "password"]],
            out: { text: { tr: "Koboldlar birbirine baktı, omuz silkti ve kenara çekildi. 'Geç bakalım.'", en: "The kobolds exchange a glance, shrug, and step aside. 'Go on then.'" }, fx: [["flag", "guardsDone"]], end: true },
          },
          {
            label: { tr: "Kandır: 'Tüccarız, şef bizi bekliyor.'", en: "Bluff: 'We're merchants; the chief expects us.'" },
            once: true,
            check: { s: "cha", dc: 14 },
            ok: { text: { tr: "'Tüccar mı? Şef parlak şeylere bayılır. Geçin!'", en: "'Merchants? The chief loves shiny things. Go in!'" }, fx: [["flag", "guardsDone"]], end: true },
            no: { text: { tr: "'Yalancılar! Alarm!'", en: "'Liars! Alarm!'" }, fx: [["combat", "guards"]] },
          },
          {
            label: { tr: "Gizlice yanlarından süzül", en: "Sneak past them" },
            once: true,
            check: { s: "dex", dc: 12, group: true },
            ok: { text: { tr: "Gölgeden gölgeye süzüldünüz. Nöbetçiler esnemekle meşguldü.", en: "You slip from shadow to shadow. The guards are busy yawning." }, fx: [["flag", "guardsDone"]], end: true },
            no: { text: { tr: "Bir çakıl taşı tıngırdadı. 'Davetsiz misafirler!'", en: "A pebble clatters. 'Intruders!'" }, fx: [["combat", "guards"]] },
          },
          { label: { tr: "Saldır!", en: "Attack!" }, out: { fx: [["combat", "guards"]] } },
          { label: { tr: "Geri çekil", en: "Back off" }, out: { end: true } },
        ],
      },
      guardsWin: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: { tr: "Nöbetçiler yere serildi. Üstlerinden {n} altın çıktı. Madenin karanlığı sizi bekliyor.", en: "The guards are down. They carried {n} gold. The darkness of the mine awaits." },
        fx: [["gold", "2d6"]],
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      trap: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: { tr: "Koridor fazlasıyla temiz... Duvarlarda küçük delikler var.", en: "The corridor is suspiciously clean... There are small holes in the walls." },
        opts: [
          {
            label: { tr: "Tuzak ara", en: "Search for traps" },
            once: true,
            check: { s: "wis", dc: 13 },
            ok: { text: { tr: "{hero} yerde, ayak bileği hizasında gerilmiş incecik bir tel buldu!", en: "{hero} finds a thin wire stretched at ankle height!" }, next: "trap2" },
            no: { text: { tr: "Hiçbir şey göremedin. Belki de evhamdır...", en: "You don't see anything. Maybe it's just nerves..." } },
          },
          {
            label: { tr: "Dikkatle yürü", en: "Walk carefully" },
            out: { text: { tr: "Klik! Duvardaki deliklerden oklar fırladı! (Herkes ÇEV kurtarması yapar)", en: "Click! Darts shoot from the holes! (Everyone makes a DEX save)" }, fx: [["dmg", "2d4", "all", "dex", 12], ["flag", "trapDone"]], end: true },
          },
          {
            label: { tr: "Koşarak geç", en: "Run through" },
            check: { s: "dex", dc: 13, group: true },
            ok: { text: { tr: "Oklar arkanızda duvara saplandı. Hepiniz zamanında geçtiniz!", en: "The darts thud into the wall behind you. You all made it!" }, fx: [["flag", "trapDone"]], end: true },
            no: { text: { tr: "Oklar yağmur gibi yağdı!", en: "Darts rain down on you!" }, fx: [["dmg", "1d6", "all"], ["flag", "trapDone"]], end: true },
          },
          { label: { tr: "Geri çekil", en: "Back off" }, out: { end: true } },
        ],
      },
      trap2: {
        sp: "ui:scroll",
        who: { tr: "Tuzak Teli", en: "Tripwire" },
        text: { tr: "Tel, duvardaki bir ok mekanizmasına bağlı.", en: "The wire is linked to a dart launcher in the wall." },
        opts: [
          {
            label: { tr: "Tuzağı etkisiz hale getir", en: "Disarm the trap" },
            check: { s: "dex", dc: 12 },
            ok: { text: { tr: "{hero} teli ustaca kesip mekanizmadan sağlam bir parça söktü. Satsan {n} altın eder!", en: "{hero} deftly cuts the wire and salvages a part worth {n} gold!" }, fx: [["gold", 15], ["flag", "trapDone"]], end: true },
            no: { text: { tr: "Tel koptu! Oklar {hero} üstüne fırladı.", en: "The wire snaps! Darts fly at {hero}." }, fx: [["dmg", "2d4", "hero"], ["flag", "trapDone"]], end: true },
          },
          { label: { tr: "Telin üstünden atla", en: "Step over the wire" }, out: { text: { tr: "Herkes teli dikkatle atladı.", en: "Everyone carefully steps over." }, fx: [["flag", "trapDone"]], end: true } },
        ],
      },
      spiders: {
        sp: "foe:spider",
        who: { tr: "Ağlarla Dolu Mağara", en: "Webbed Cavern" },
        text: { tr: "Tavandan kalın ağlar sarkıyor. Karanlıkta düzinelerce göz parlıyor... Dev mağara örümcekleri!", en: "Thick webs hang from the ceiling. Dozens of eyes gleam in the dark... Giant cave spiders!" },
        opts: [
          {
            label: { tr: "Ağları ateşe ver", en: "Set the webs on fire" },
            once: true,
            check: { s: "int", dc: 12 },
            ok: { text: { tr: "{hero} bir meşaleyle ağları tutuşturdu! Alevler örümcekleri kavurdu.", en: "{hero} sets the webs alight with a torch! The flames scorch the spiders." }, fx: [["combat", "spiders", { burn: "2d6" }]] },
            no: { text: { tr: "Ağlar nemli, tutuşmadı. Örümcekler saldırıyor!", en: "The webs are damp and won't catch. The spiders attack!" }, fx: [["combat", "spiders"]] },
          },
          { label: { tr: "Saldır!", en: "Attack!" }, out: { fx: [["combat", "spiders"]] } },
          { label: { tr: "Geri çekil", en: "Back off" }, out: { end: true } },
        ],
      },
      spidersWin: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: { tr: "Son örümcek de kıvrılıp kaldı. Ağların arasında eski bir madencinin kesesi var: {n} altın.", en: "The last spider curls up. Among the webs: an old miner's purse with {n} gold." },
        fx: [["gold", "2d10"]],
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      door: {
        sp: "obj:door",
        who: { tr: "Rünlü Kapı", en: "Rune Door" },
        text: { tr: "Mavi rünlerle parlayan taş bir kapı. Kilit yerinde ejder pençesi şeklinde bir oyuk var.", en: "A stone door glowing with blue runes. Where a lock should be, there's a hollow shaped like a dragon's claw." },
        opts: [
          {
            label: { tr: "Rünleri çöz", en: "Decipher the runes" },
            once: true,
            check: { s: "int", dc: 13 },
            ok: { text: { tr: "{hero} rünlerin sırasını çözüp doğru sırayla dokundu. Kapı gürleyerek açıldı!", en: "{hero} works out the order and touches the runes in turn. The door rumbles open!" }, fx: [["hide", "door"]], end: true },
            no: { text: { tr: "Rünler bir an kızıl parladı; {hero} çarpıldı!", en: "The runes flash red; {hero} gets zapped!" }, fx: [["dmg", "1d6", "hero"]] },
          },
          {
            label: { tr: "Kilidi aç", en: "Pick the lock" },
            once: true,
            check: { s: "dex", dc: 15 },
            ok: { text: { tr: "{hero} oyuğun içindeki gizli mekanizmayı buldu. Klik!", en: "{hero} finds the hidden mechanism inside the hollow. Click!" }, fx: [["hide", "door"]], end: true },
            no: { text: { tr: "Maymuncuk kırıldı.", en: "The lockpick snaps." } },
          },
          {
            label: { tr: "Kapıyı zorla", en: "Force the door" },
            check: { s: "str", dc: 13 },
            ok: {
              text: { tr: "{hero} omuz attı; kapı çatırdayarak açıldı. Gürültü bütün madende yankılandı! (Şefin salonunda fazladan kobold olacak.)", en: "{hero} rams it; the door cracks open. The noise echoes through the whole mine! (More kobolds will be waiting in the chief's hall.)" },
              fx: [["hide", "door"], ["flag", "alarm"], ["show", "k6"], ["show", "k7"]],
              end: true,
            },
            no: { text: { tr: "Kapı sarsıldı ama açılmadı. {hero} omzunu incitti.", en: "The door shudders but holds. {hero} hurts a shoulder." }, fx: [["dmg", "1d4", "hero"]] },
          },
          { label: { tr: "Bırak", en: "Leave it" }, out: { end: true } },
        ],
      },
      camp: {
        sp: "fire",
        who: { tr: "Madenci Kampı", en: "Miners' Camp" },
        text: { tr: "Eski madencilerin kampı. Ateş hâlâ yanıyor; burada dinlenebilirsiniz.", en: "An old miners' camp. The fire is still burning; you can rest here." },
        opts: [
          { label: { tr: "Dinlen (herkes tamamen iyileşir)", en: "Rest (everyone fully heals)" }, once: true, out: { text: { tr: "Ateşin başında dinlendiniz. Güçleriniz yerine geldi.", en: "You rest by the fire. Your strength returns." }, fx: [["heal", "full", "all"]] } },
          { label: { tr: "Yola devam", en: "Move on" }, out: { end: true } },
        ],
      },
      chest1: {
        sp: "obj:chest",
        who: { tr: "Madenci Sandığı", en: "Miner's Chest" },
        text: { tr: "Paslı kilitli eski bir madenci sandığı.", en: "An old miner's chest with a rusty lock." },
        opts: [
          {
            label: { tr: "Kilidi aç", en: "Pick the lock" },
            once: true,
            check: { s: "dex", dc: 12 },
            ok: { text: { tr: "İçinde {n} altın ve bir kavanoz ejderotu merhemi var! (Ejder ateşi yarı hasar verir.)", en: "Inside: {n} gold and a jar of dragonweed salve! (Dragonfire deals half damage.)" }, fx: [["gold", "3d6"], ["flag", "salve"], ["open", "chest1"]], end: true },
            no: { text: { tr: "Kilit sıkıştı, açılmıyor.", en: "The lock is jammed." } },
          },
          {
            label: { tr: "Kırıp aç", en: "Smash it open" },
            once: true,
            check: { s: "str", dc: 12 },
            ok: { text: { tr: "Sandık parçalandı! {n} altın buldun ama içindeki kavanoz kırıldı; yeşil bir merhem yere aktı.", en: "The chest shatters! You find {n} gold, but a jar inside breaks and green salve oozes out." }, fx: [["gold", "3d6"], ["open", "chest1"]], end: true },
            no: { text: { tr: "Sandık dayanıklı çıktı. {hero} parmaklarını ezdi.", en: "The chest holds firm. {hero} bruises their wing." }, fx: [["dmg", "1d4", "hero"]] },
          },
          { label: { tr: "Bırak", en: "Leave it" }, out: { end: true } },
        ],
      },
      chief: {
        sp: "foe:koboldChief",
        who: { tr: "Şef Kırçık", en: "Chief Grizzik" },
        text: {
          tr: "Altın ve hurdalarla dolu bir salon. Hurdadan yapılmış bir tahtta, başında teneke taç, Şef Kırçık oturuyor. 'Kim izin verdi size?!'",
          en: "A hall heaped with gold and scrap. On a throne of junk, wearing a tin crown, sits Chief Grizzik. 'Who gave you permission?!'",
        },
        opts: [
          {
            label: { tr: "'Ejderin yumurtasını verin, yoksa hepinizi yakacak!'", en: "'Hand over the dragon's egg, or it'll burn you all!'" },
            req: [["any", [["flag", "eggClue"], ["flag", "lore"], ["flag", "clue"]]]],
            once: true,
            check: { s: "cha", dc: 13 },
            ok: {
              text: { tr: "Şefin pulları soldu. 'O... o yumurta zaten lanetli! Alın, alın!' Koboldlar titreyerek önünüze sıcak, kırmızı benekli kocaman bir yumurta yuvarladı.", en: "The chief's scales go pale. 'That... that egg is cursed anyway! Take it!' Trembling kobolds roll a huge, warm, red-speckled egg to your feet." },
              fx: [["flag", "chiefDone"], ["flag", "egg"]],
              end: true,
            },
            no: { text: { tr: "'Hah! Yumurta benim! Saldırın!'", en: "'Hah! The egg is mine! Attack!'" }, fx: [["combat", "chief"]] },
          },
          {
            label: { tr: "Gözdağı ver", en: "Intimidate" },
            once: true,
            check: { s: "str", dc: 15 },
            ok: { text: { tr: "{hero} tahtın yanındaki kalkanı tek darbede ikiye böldü. Kırçık ağlamaklı: 'Tamam! Ne isterseniz alın, yeter ki gidin!' ({n} altın)", en: "{hero} splits the shield beside the throne in one blow. Grizzik whimpers: 'Fine! Take what you want, just go!' ({n} gold)" }, fx: [["flag", "chiefDone"], ["gold", 30]], end: true },
            no: { text: { tr: "Kırçık güldü: 'Bu mu sizin gücünüz? Kesin şunları!'", en: "Grizzik laughs: 'That's all you've got? Cut them down!'" }, fx: [["combat", "chief"]] },
          },
          { label: { tr: "Saldır!", en: "Attack!" }, out: { fx: [["combat", "chief"]] } },
        ],
      },
      chiefWin: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: { tr: "Şef Kırçık yere yığıldı; kalan koboldlar tüneller boyunca kaçıştı. Tahtın yanında süslü bir sandık duruyor.", en: "Chief Grizzik collapses; the remaining kobolds flee down the tunnels. An ornate chest sits beside the throne." },
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      chest2: {
        sp: "obj:chest",
        who: { tr: "Şefin Sandığı", en: "The Chief's Chest" },
        text: { tr: "Altın süslemeli, şişkin bir sandık.", en: "A bulging chest with gold trim." },
        opts: [
          {
            label: { tr: "Aç", en: "Open it" },
            req: [["!flag", "egg"]],
            out: { text: { tr: "İçinde {n} altın ve... sıcak, kırmızı benekli kocaman bir yumurta! İçinden hafif bir kalp atışı geliyor.", en: "Inside: {n} gold and... a huge, warm, red-speckled egg! You can hear a faint heartbeat." }, fx: [["gold", "4d6"], ["flag", "egg"], ["open", "chest2"]], end: true },
          },
          {
            label: { tr: "Aç", en: "Open it" },
            req: [["flag", "egg"]],
            out: { text: { tr: "İçinde {n} altın var.", en: "Inside: {n} gold." }, fx: [["gold", "4d6"], ["open", "chest2"]], end: true },
          },
          { label: { tr: "Bırak", en: "Leave it" }, out: { end: true } },
        ],
      },
    },
  },

  /* ===================== 4. KIZILPENÇE'NİN İNİ ===================== */
  lair: {
    name: { tr: "Kızılpençe'nin İni", en: "Redclaw's Lair" },
    theme: "lair",
    dark: 0.45,
    map: [
      "#####t########t#######",
      "#LLL..gggggggggg..LLL#",
      "#LLL.gggggggggggg.LLL#",
      "#LLL..gggggggggg..LLL#",
      "#LLL....gggggg....LLL#",
      "##LL..............LL##",
      "##LL...o......o...LL##",
      "#LLL..............LLL#",
      "#LL................LL#",
      "#LL..o..........o..LL#",
      "##LL..............LL##",
      "###L..............L###",
      "####..............####",
      "##########..##########",
    ],
    lights: [[10, 2, 4]],
    spawn: [[10, 12], [11, 12], [9, 12], [12, 12], [10, 13], [11, 13]],
    intro: "intro",
    ents: [
      { id: "dragon", sp: "npc:dragonSleep", x: 10, y: 2, sz: 2, foe: "dragon", fsp: "foe:dragon" },
      { id: "camp", sp: "fire", x: 5, y: 11, ev: "camp", light: 3 },
    ],
    zones: [{ x: 3, y: 8, w: 16, h: 1, ev: "dragon", until: "dragonMet" }],
    groups: {
      dragon: { ents: ["dragon"], win: [["end", "slayer"]] },
    },
    ev: {
      intro: {
        sp: "ui:scroll",
        who: { tr: "Anlatıcı", en: "Narrator" },
        text: {
          tr: "Hava ağır ve sıcak. Lav ırmaklarının kızıl ışığında devasa bir hazine yığını parlıyor. Yığının tepesinde, kanatlarını gövdesine sarmış Kızılpençe uyuyor. (Seviye 3!)",
          en: "The air is heavy and hot. A vast hoard glitters in the red light of lava rivers. Atop the pile, wings wrapped around itself, Redclaw sleeps. (Level 3!)",
        },
        opts: [{ label: { tr: "Devam", en: "Continue" }, out: { end: true } }],
      },
      camp: {
        sp: "fire",
        who: { tr: "Son Kamp", en: "Last Camp" },
        text: { tr: "Eski bir maceracının bıraktığı köz. Ejderle yüzleşmeden önce son bir nefes.", en: "Embers left by some earlier adventurer. One last breath before facing the dragon." },
        opts: [
          { label: { tr: "Dinlen (herkes tamamen iyileşir)", en: "Rest (everyone fully heals)" }, once: true, out: { text: { tr: "Kısa ama derin bir uyku. Hazırsınız.", en: "A short but deep sleep. You're ready." }, fx: [["heal", "full", "all"]] } },
          { label: { tr: "Yola devam", en: "Move on" }, out: { end: true } },
        ],
      },
      dragon: {
        sp: "foe:dragon",
        who: { tr: "Kızılpençe", en: "Redclaw" },
        text: {
          tr: "Kızılpençe'nin gözleri açılıyor. Burnundan duman tütüyor. 'Hırsızlar... Yuvamı soyanların kokusu üstünüzde!'",
          en: "Redclaw's eyes snap open. Smoke curls from its nostrils. 'Thieves... You reek of those who robbed my nest!'",
        },
        fx: [["flag", "dragonMet"], ["wake", "dragon"]],
        opts: [
          { label: { tr: "'Yumurtanı geri getirdik.'", en: "'We brought your egg back.'" }, req: [["flag", "egg"]], out: { next: "dragonEgg" } },
          {
            label: { tr: "Yumurtayı rehin al: 'Köyü rahat bırak, yoksa...'", en: "Hold the egg hostage: 'Leave the village alone, or else...'" },
            req: [["flag", "egg"]],
            once: true,
            check: { s: "str", dc: 14 },
            ok: { fx: [["end", "threat"]] },
            no: { text: { tr: "'Buna cüret mi ediyorsun?!' Ejderin öfkesi mağarayı sarsıyor!", en: "'You DARE?!' The dragon's fury shakes the cavern!" }, fx: [["combat", "dragon"]] },
          },
          {
            label: { tr: "'Köy masum! Yumurtanı koboldlar çaldı.'", en: "'The village is innocent! Kobolds stole your egg.'" },
            req: [["!flag", "egg"], ["any", [["flag", "eggClue"], ["flag", "lore"]]]],
            once: true,
            check: { s: "cha", dc: 15 },
            ok: { fx: [["end", "misdirect"]] },
            no: { text: { tr: "'Yalan! Hepiniz aynısınız!'", en: "'Lies! You're all the same!'" }, fx: [["combat", "dragon"]] },
          },
          { label: { tr: "Savaş!", en: "Fight!" }, out: { text: { tr: "Kızılpençe kükreyerek kanatlarını açıyor!", en: "Redclaw spreads its wings with a roar!" }, fx: [["combat", "dragon"]] } },
        ],
      },
      dragonEgg: {
        sp: "obj:egg",
        who: { tr: "Kızılpençe", en: "Redclaw" },
        text: { tr: "Yumurtayı yavaşça yere bırakıyorsunuz. Ejder bir an donup kalıyor; dumanı kesiliyor.", en: "You gently set the egg down. The dragon freezes; the smoke stops." },
        opts: [
          {
            label: { tr: "'Barış istiyoruz. Köy suçsuz.'", en: "'We want peace. The village is innocent.'" },
            check: { s: "cha", dc: 12 },
            ok: { fx: [["end", "friend"]] },
            no: { fx: [["end", "peace"]] },
          },
          {
            label: { tr: "Ejderin önünde saygıyla diz çök", en: "Kneel respectfully before the dragon" },
            check: { s: "wis", dc: 12 },
            ok: { fx: [["end", "friend"]] },
            no: { fx: [["end", "peace"]] },
          },
          { label: { tr: "Sessizce geri çekil", en: "Quietly step back" }, out: { fx: [["end", "peace"]] } },
        ],
      },
    },
  },
};
const SCENE_ORDER = ["village", "forest", "cave", "lair"];

/* ---------------- Sonlar ---------------- */
const ENDINGS = {
  friend: {
    icon: "obj:egg",
    gold: 300,
    title: { tr: "Ejder Dostu", en: "Dragonfriend" },
    text: {
      tr: "Kızılpençe yumurtasını kanatlarının altına alıyor. 'Hırsızların siz olduğunu sandım. Yanılmışım.' Hazinesinden bir avuç altın ve parlayan bir pul hediye ediyor. Sazlıköy'e döndüğünüzde gökyüzünde artık bir tehdit değil, bir koruyucu süzülüyor.",
      en: "Redclaw gathers the egg beneath its wings. 'I thought you were the thieves. I was wrong.' It gifts you a handful of gold and a shining scale. When you return to Reedmere, what circles the sky is no longer a threat but a guardian.",
    },
  },
  peace: {
    icon: "obj:egg",
    gold: 100,
    title: { tr: "Huzurlu Veda", en: "A Quiet Farewell" },
    text: {
      tr: "Ejder yumurtasını alıp tek söz etmeden göğe yükseliyor ve bir daha Sazlıköy'e uğramıyor. Köy kurtuldu. Belki bir gün o yumurtadan çıkacak yavru sizi hatırlar.",
      en: "The dragon takes its egg and rises into the sky without a word, never to return to Reedmere. The village is saved. Perhaps one day the hatchling will remember you.",
    },
  },
  threat: {
    icon: "foe:dragon",
    gold: 100,
    title: { tr: "Gözdağı", en: "The Threat" },
    text: {
      tr: "Kızılpençe dişlerini sıkıyor. 'Peki. Köyünüze dokunmayacağım.' Yumurtasını alıp gidiyor. Köy kurtuldu ama ejderlerin hafızası uzundur... Geceleri gökyüzüne bakarken içinizi bir ürperti kaplıyor.",
      en: "Redclaw grinds its teeth. 'Very well. I will not touch your village.' It takes the egg and leaves. The village is saved, but dragons have long memories... A chill runs through you whenever you look up at night.",
    },
  },
  misdirect: {
    icon: "foe:koboldChief",
    gold: 100,
    title: { tr: "Doğru Hedef", en: "The Right Target" },
    text: {
      tr: "Kızılpençe uzun uzun size bakıyor. 'Koboldlar... Demek öyle.' Kanatlarını açıp madene doğru uçuyor. Sazlıköy kurtuldu; madenden yükselen çığlıklar ise günlerce sürdü.",
      en: "Redclaw studies you for a long time. 'Kobolds... So that's how it is.' It spreads its wings and flies toward the mine. Reedmere is saved; the screams from the mine went on for days.",
    },
  },
  slayer: {
    icon: "foe:dragon",
    gold: 250,
    title: { tr: "Ejderavcısı", en: "Dragonslayer" },
    text: {
      tr: "Kızılpençe son bir kükremeyle hazinesinin üstüne yığılıyor. Sazlıköy'de günlerce şenlik yapıldı ve adlarınız şarkılara girdi. Ama Ay Sunağı'nın rünlerini okuyabilen herkes, bu hikâyenin başka türlü de bitebileceğini biliyordu.",
      en: "With a final roar, Redclaw collapses onto its hoard. Reedmere celebrated for days and your names entered its songs. Yet anyone who could read the Moon Shrine's runes knew this story could have ended another way.",
    },
  },
  slayerEgg: {
    icon: "obj:egg",
    gold: 250,
    title: { tr: "Ejderavcısı... ve Ebeveyn", en: "Dragonslayer... and Parent" },
    text: {
      tr: "Kızılpençe düştü. Tam o anda çantadaki yumurta çatırdadı: minicik bir ejder yavrusu kafasını çıkarıp size baktı ve 'Vak?' dedi. Görünüşe göre artık bir aileniz var.",
      en: "Redclaw has fallen. At that very moment the egg in your bag cracks: a tiny dragon pokes its head out, looks at you and says 'Quack?' Looks like you have a family now.",
    },
  },
};
