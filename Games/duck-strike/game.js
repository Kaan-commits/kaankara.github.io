/* =========================================================
   Duck Strike — tarayıcıda çalışan basit online shooter
   Frozen Duck Games

   Ağ yapısı: Sunucu yok. Odayı kuran oyuncu "host" olur ve oyunu
   yönetir (hasar, ölüm, yeniden doğma, botlar). Diğer oyuncular
   PeerJS (WebRTC) ile doğrudan host'a bağlanır.
   ========================================================= */
"use strict";

/* ---------------- Metinler (TR / EN) ---------------- */
i18n.extend({
  tr: {
    "ds.creating": "Oda oluşturuluyor…",
    "ds.connecting": "Odaya bağlanılıyor…",
    "ds.err.notfound": "Oda bulunamadı. Kodu kontrol et.",
    "ds.err.full": "Oda dolu (en fazla 8 oyuncu).",
    "ds.err.net": "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene.",
    "ds.err.closed": "Oda kapandı.",
    "ds.err.lost": "Bağlantı koptu.",
    "ds.err.code": "5 karakterlik oda kodunu yaz.",
    "ds.err.nopeer": "Online sistem yüklenemedi. Antrenman modunu deneyebilirsin.",
    "ds.room": "ODA",
    "ds.practiceLabel": "ANTRENMAN",
    "ds.copied": "Link kopyalandı!",
    "ds.joined": "{name} katıldı",
    "ds.left": "{name} ayrıldı",
    "ds.killedby": "{name} seni indirdi",
    "ds.respawn": "{s} sn içinde yeniden doğuyorsun",
    "ds.saved": "Kaydedildi",
    "ds.reset.q": "İstatistikler sıfırlansın mı?",
    "ds.score": "Skor tablosu",
    "ds.rotate": "Daha iyi görüş için telefonu yan çevir",
    "ds.defaultName": "Ördek",
    "ds.you": "sen",
  },
  en: {
    "ds.tag": "Online pixel duck battles in your browser.",
    "ds.tab.play": "Play",
    "ds.tab.profile": "Profile",
    "ds.create": "Create room",
    "ds.create.sub": "Send the code to your friends",
    "ds.code": "Room code",
    "ds.join": "Join",
    "ds.practice": "Practice with bots",
    "ds.controls": "Controls",
    "ds.controls.desk": "WASD move · Mouse aim and shoot · 1-2-3 weapons · R reload · Tab scoreboard",
    "ds.controls.touch": "Left thumb moves · Right thumb aims and shoots",
    "ds.name": "Name",
    "ds.save": "Save",
    "ds.color": "Color",
    "ds.stats": "Stats",
    "ds.kills": "Kills",
    "ds.deaths": "Deaths",
    "ds.matches": "Matches",
    "ds.reset": "Reset stats",
    "ds.copy": "Copy link",
    "ds.bots": "Bots",
    "ds.w.rifle": "Rifle",
    "ds.w.pistol": "Pistol",
    "ds.w.knife": "Knife",
    "ds.reloading": "Reloading…",
    "ds.dead": "You died!",
    "ds.player": "Player",
    "ds.menu": "Menu",
    "ds.resume": "Resume",
    "ds.leave": "Leave room",
    "ds.cancel": "Cancel",
    "ds.creating": "Creating room…",
    "ds.connecting": "Joining room…",
    "ds.err.notfound": "Room not found. Check the code.",
    "ds.err.full": "The room is full (max 8 players).",
    "ds.err.net": "Couldn't connect. Check your internet and try again.",
    "ds.err.closed": "The room was closed.",
    "ds.err.lost": "Connection lost.",
    "ds.err.code": "Enter the 5-character room code.",
    "ds.err.nopeer": "The online system couldn't load. You can still try practice mode.",
    "ds.room": "ROOM",
    "ds.practiceLabel": "PRACTICE",
    "ds.copied": "Link copied!",
    "ds.joined": "{name} joined",
    "ds.left": "{name} left",
    "ds.killedby": "{name} took you down",
    "ds.respawn": "Respawning in {s}s",
    "ds.saved": "Saved",
    "ds.reset.q": "Reset your stats?",
    "ds.score": "Scoreboard",
    "ds.rotate": "Turn your phone sideways for a better view",
    "ds.defaultName": "Duck",
    "ds.you": "you",
  },
});
i18n.apply();

const T = (key, vars) => {
  let s = i18n.t(key);
  if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
  return s;
};

/* ---------------- Sabitler ---------------- */
const TILE = 16;
const RADIUS = 5; // çarpışma kutusu yarı genişliği
const HIT_RADIUS = 6; // mermi isabet yarıçapı
const SPEED = 82; // piksel / saniye
const MAX_HP = 100;
const RESPAWN_MS = 3000;
const SNAP_MS = 50;
const MAX_PLAYERS = 8;
const MAX_BOTS = 6;
const PEER_PREFIX = "duckstrike-kk-";
const COLORS = ["#ffd23f", "#5ad7ff", "#ff6fae", "#48e0a0", "#a98bff", "#ff8a3d", "#f4f1e8", "#ff4d5e"];
const BOT_NAMES = ["Vakvak", "Paytak", "Gagalı", "Pofuduk", "Zıpzıp", "Badi", "Limon", "Fıstık"];

const WEAPONS = [
  { id: "rifle", name: "ds.w.rifle", dmg: 17, rate: 0.1, mag: 30, reload: 2.0, spread: 0.025, bloom: 0.014, maxBloom: 0.13, range: 520, speed: 0.9, auto: true, icon: "🔫" },
  { id: "pistol", name: "ds.w.pistol", dmg: 28, rate: 0.22, mag: 12, reload: 1.2, spread: 0.018, bloom: 0.035, maxBloom: 0.1, range: 420, speed: 1, auto: false, icon: "🔫" },
  { id: "knife", name: "ds.w.knife", dmg: 55, rate: 0.5, melee: true, range: 22, speed: 1.12, icon: "🔪" },
];

/* Harita: sol yarı çizilir, sağ yarı aynası alınır.
   # duvar · C sandık · . kum · , taş zemin · S doğma noktası */
const MAP_HALF = [
  "########################",
  "#S.....#................",
  "#......#................",
  "#..CC..#....CC......####",
  "#..CC..#....CC......#...",
  "#......#............#...",
  "#...................#...",
  "#......#................",
  "###.####.......,,,,,,,,,",
  "#......#.......,,,,,,,,,",
  "#......#..CC...,,,######",
  "#S.....#..CC...,,,#.....",
  "#..............,,,#.....",
  "#..............,,,......",
  "####...####....,,,......",
  "#.........#....,,,..CC..",
  "#.........#....,,,..CC..",
  "#..CC.....#....,,,......",
  "#..CC...................",
  "#.........#....,,,#.....",
  "#.........#....,,,#.....",
  "####...####....,,,######",
  "#..............,,,,,,,,,",
  "#S.............,,,,,,,,,",
  "#......#..CC............",
  "#......#..CC.......#....",
  "#......#...........#....",
  "#..CC..#...........#..S.",
  "#..CC..#...........#....",
  "#......#....CC..........",
  "#S.....#....CC..........",
  "########################",
];
const MAP = MAP_HALF.map((r) => r + [...r].reverse().join(""));
const MW = MAP[0].length;
const MH = MAP.length;
const WORLD_W = MW * TILE;
const WORLD_H = MH * TILE;

const isSolidTile = (tx, ty) => !(tx >= 0 && ty >= 0 && tx < MW && ty < MH) || MAP[ty][tx] === "#" || MAP[ty][tx] === "C";
const solidAt = (x, y) => isSolidTile(Math.floor(x / TILE), Math.floor(y / TILE));

const SPAWNS = [];
const FLOOR = [];
MAP.forEach((row, y) =>
  [...row].forEach((c, x) => {
    if (c === "S") SPAWNS.push({ x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 });
    if (!isSolidTile(x, y)) FLOOR.push([x, y]);
  })
);

/* ---------------- Yardımcılar ---------------- */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angDiff = (a, b) => {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
};
const lerpAngle = (a, b, t) => a + angDiff(a, b) * t;
const now = () => performance.now();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cleanName = (s) => String(s || "").replace(/[<>]/g, "").trim().slice(0, 16);
const validColor = (c) => (COLORS.includes(c) ? c : COLORS[0]);

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function collides(x, y) {
  return solidAt(x - RADIUS, y - RADIUS) || solidAt(x + RADIUS, y - RADIUS) || solidAt(x - RADIUS, y + RADIUS) || solidAt(x + RADIUS, y + RADIUS);
}

function moveBody(p, dx, dy) {
  // Eksenleri ayrı çözerek duvarlarda kaymayı sağla
  const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 2) || 1;
  for (let i = 0; i < steps; i++) {
    const nx = p.x + dx / steps;
    if (!collides(nx, p.y)) p.x = nx;
    const ny = p.y + dy / steps;
    if (!collides(p.x, ny)) p.y = ny;
  }
}

function rayWall(x, y, a, max) {
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  for (let d = 0; d < max; d += 1.5) {
    if (solidAt(x + dx * d, y + dy * d)) return d;
  }
  return max;
}

function rayCircle(x, y, dx, dy, cx, cy, r) {
  const fx = x - cx;
  const fy = y - cy;
  const b = fx * dx + fy * dy;
  const c = fx * fx + fy * fy - r * r;
  const disc = b * b - c;
  if (disc < 0) return null;
  const t = -b - Math.sqrt(disc);
  return t >= 0 ? t : null;
}

function rayHit(x, y, a, max, ignoreId) {
  const wall = rayWall(x, y, a, max);
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  let best = null;
  let bt = wall;
  for (const p of game.players.values()) {
    if (!p.alive || p.id === ignoreId) continue;
    const t = rayCircle(x, y, dx, dy, p.x, p.y, HIT_RADIUS);
    if (t !== null && t < bt) {
      bt = t;
      best = p;
    }
  }
  return { t: bt, p: best };
}

const canSee = (a, b) => {
  const d = dist(a, b);
  return rayWall(a.x, a.y, Math.atan2(b.y - a.y, b.x - a.x), d) >= d - 1;
};

/* ---------------- Profil (tarayıcıda saklanır) ---------------- */
const PROFILE_KEY = "duckstrike-profile";
const profile = (() => {
  let p = {};
  try {
    p = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
  } catch (e) {}
  return {
    name: cleanName(p.name) || `${T("ds.defaultName")}${Math.floor(100 + Math.random() * 900)}`,
    color: validColor(p.color || COLORS[Math.floor(Math.random() * COLORS.length)]),
    kills: p.kills | 0,
    deaths: p.deaths | 0,
    matches: p.matches | 0,
  };
})();
const saveProfile = () => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {}
};
saveProfile();

/* ---------------- Ses (WebAudio ile üretilir, dosya yok) ---------------- */
const sfx = {
  ctx: null,
  muted: (() => {
    try {
      return localStorage.getItem("duckstrike-muted") === "1";
    } catch (e) {
      return false;
    }
  })(),
  noise: null,
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const len = this.ctx.sampleRate * 0.3;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  },
  env(vol, dur) {
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    g.connect(this.ctx.destination);
    return g;
  },
  shot(w, vol = 1) {
    if (!this.ctx || this.muted || vol <= 0.02) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = w === 0 ? 900 : 1500;
    src.connect(f).connect(this.env(0.35 * vol, w === 0 ? 0.09 : 0.12));
    src.start();
    src.stop(this.ctx.currentTime + 0.15);
  },
  tone(type, f1, f2, dur, vol) {
    if (!this.ctx || this.muted || vol <= 0.02) return;
    const o = this.ctx.createOscillator();
    o.type = type;
    const t = this.ctx.currentTime;
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    o.connect(this.env(vol, dur));
    o.start();
    o.stop(t + dur + 0.02);
  },
  knife(vol = 1) { this.tone("triangle", 900, 300, 0.08, 0.15 * vol); },
  hit() { this.tone("square", 1400, 1000, 0.05, 0.08); },
  hurt() { this.tone("sawtooth", 300, 120, 0.12, 0.15); },
  empty() { this.tone("square", 2000, 1800, 0.03, 0.06); },
  reload() { this.tone("square", 500, 700, 0.06, 0.06); },
  quack(vol = 1) {
    this.tone("square", 620, 280, 0.12, 0.12 * vol);
    setTimeout(() => this.tone("square", 560, 240, 0.14, 0.1 * vol), 130);
  },
};

/* ---------------- Grafik ---------------- */
const canvas = $("game");
const ctx = canvas.getContext("2d");
let dpr = 1;
let S = 3; // dünya pikseli -> ekran pikseli
let viewW = 0;
let viewH = 0;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  S = Math.max(1, Math.round(Math.min(canvas.width / 440, canvas.height / 270)));
  viewW = canvas.width / S;
  viewH = canvas.height / S;
}
window.addEventListener("resize", resize);
resize();

// Haritayı bir kere çiz, her karede tek resim olarak kullan
const mapCanvas = (() => {
  const c = document.createElement("canvas");
  c.width = WORLD_W;
  c.height = WORLD_H;
  const g = c.getContext("2d");
  const rnd = mulberry32(7);
  const px = (x, y, col) => {
    g.fillStyle = col;
    g.fillRect(x, y, 1, 1);
  };
  for (let ty = 0; ty < MH; ty++) {
    for (let tx = 0; tx < MW; tx++) {
      const c0 = MAP[ty][tx];
      const X = tx * TILE;
      const Y = ty * TILE;
      if (c0 === "#") {
        g.fillStyle = "#4a3b33";
        g.fillRect(X, Y, TILE, TILE);
        g.fillStyle = "#5c4a3f";
        for (let row = 0; row < 4; row++) {
          const y = Y + row * 4 + 1;
          if (row % 2) {
            g.fillRect(X, y, 3, 2);
            g.fillRect(X + 5, y, 6, 2);
            g.fillRect(X + 13, y, 3, 2);
          } else {
            g.fillRect(X + 1, y, 6, 2);
            g.fillRect(X + 9, y, 6, 2);
          }
        }
        if (!isSolidTile(tx, ty - 1)) {
          g.fillStyle = "#7a6455";
          g.fillRect(X, Y, TILE, 2);
        }
      } else if (c0 === "C") {
        g.fillStyle = "#9a6430";
        g.fillRect(X, Y, TILE, TILE);
        g.fillStyle = "#b97b3d";
        g.fillRect(X + 1, Y + 1, TILE - 2, TILE - 2);
        g.fillStyle = "#7a4b20";
        for (let i = 4; i < TILE; i += 5) g.fillRect(X + 1, Y + i, TILE - 2, 1);
        g.fillRect(X, Y, 1, TILE);
        g.fillRect(X + TILE - 1, Y, 1, TILE);
        g.fillRect(X, Y, TILE, 1);
        g.fillRect(X, Y + TILE - 1, TILE, 1);
      } else {
        const stone = c0 === ",";
        g.fillStyle = stone ? "#8d8173" : "#d2ae74";
        g.fillRect(X, Y, TILE, TILE);
        const specks = stone ? ["#80756a", "#9a8e80"] : ["#c49f66", "#ddbb82", "#bf985e"];
        for (let i = 0; i < 10; i++) px(X + Math.floor(rnd() * TILE), Y + Math.floor(rnd() * TILE), specks[Math.floor(rnd() * specks.length)]);
        if (stone) {
          g.fillStyle = "#7a6f63";
          g.fillRect(X, Y + TILE - 1, TILE, 1);
          g.fillRect(X + TILE - 1, Y, 1, TILE);
        }
        // Duvar gölgesi
        if (isSolidTile(tx, ty - 1)) {
          g.fillStyle = "rgba(0,0,0,0.22)";
          g.fillRect(X, Y, TILE, 4);
        }
        if (isSolidTile(tx - 1, ty)) {
          g.fillStyle = "rgba(0,0,0,0.14)";
          g.fillRect(X, Y, 3, TILE);
        }
      }
    }
  }
  return c;
})();

// Ördek sprite'ları (sağa bakan), renk + silah başına bir kere üretilir
const spriteCache = new Map();
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => clamp(Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f), 0, 255);
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}
function duckSprite(color, w) {
  const key = color + w;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const c = document.createElement("canvas");
  c.width = 24;
  c.height = 18;
  const g = c.getContext("2d");
  const fill = (x, y, col) => {
    g.fillStyle = col;
    g.fillRect(x, y, 1, 1);
  };
  const disc = (cx, cy, r, col) => {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) fill(cx + x, cy + y, col);
  };
  // gövde (merkez 8,9)
  disc(8, 9, 6, shade(color, -0.45));
  disc(8, 9, 5, color);
  disc(7, 7, 2, shade(color, 0.35));
  // kanat
  g.fillStyle = shade(color, -0.2);
  g.fillRect(5, 3, 4, 2);
  g.fillRect(5, 13, 4, 2);
  // kafa
  disc(12, 9, 3, shade(color, -0.45));
  disc(12, 9, 2, shade(color, 0.15));
  fill(13, 7, "#111");
  fill(13, 11, "#111");
  // gaga
  g.fillStyle = "#ff9a1f";
  g.fillRect(15, 8, 3, 2);
  g.fillStyle = "#c46a00";
  g.fillRect(15, 10, 2, 1);
  // silah (sağ kanatta)
  if (w === 0) {
    g.fillStyle = "#222";
    g.fillRect(9, 13, 13, 2);
    g.fillStyle = "#6b4a2b";
    g.fillRect(9, 13, 3, 3);
    g.fillStyle = "#444";
    g.fillRect(14, 15, 2, 1);
  } else if (w === 1) {
    g.fillStyle = "#2a2a2a";
    g.fillRect(11, 13, 7, 2);
    g.fillStyle = "#555";
    g.fillRect(11, 15, 2, 1);
  } else {
    g.fillStyle = "#5a3a1a";
    g.fillRect(11, 13, 2, 2);
    g.fillStyle = "#d8dde6";
    g.fillRect(13, 13, 5, 1);
    g.fillStyle = "#9aa3b0";
    g.fillRect(13, 14, 4, 1);
  }
  spriteCache.set(key, c);
  return c;
}

/* ---------------- Oyun durumu ---------------- */
const game = {
  state: "menu", // menu | playing
  mode: null, // host | client | practice
  isHost: false,
  myId: null,
  me: null,
  code: null,
  players: new Map(),
  peer: null,
  conns: new Map(), // host: id -> DataConnection
  conn: null, // client: host bağlantısı
  lastNet: 0,
  lastSnap: 0,
  lastHostMsg: 0,
  botSeq: 0,
  paused: false,
  cam: { x: WORLD_W / 2, y: WORLD_H / 2 },
  shake: 0,
};

// Oyuncunun kendi silah durumu (botlarda da aynısı kullanılır)
const newLoadout = () => ({ w: 0, ammo: [WEAPONS[0].mag, WEAPONS[1].mag, 0], nextFire: 0, reloadUntil: 0, bloom: 0, seq: -1 });
let local = newLoadout();

function makePlayer(id, name, color, bot = false) {
  return { id, name, color, x: SPAWNS[0].x, y: SPAWNS[0].y, a: 0, w: 0, hp: MAX_HP, alive: false, k: 0, d: 0, seq: 0, bot, rx: 0, ry: 0, ra: 0, respawnAt: 0, lastSeen: now(), flash: 0 };
}

/* ---------------- Efektler ---------------- */
const fx = { tracers: [], parts: [], slashes: [], decals: [], hitmarker: 0, hurt: 0 };

function addTracer(x1, y1, x2, y2) {
  fx.tracers.push({ x1, y1, x2, y2, t: now() });
}
function addFeathers(x, y, color, n = 6) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 20 + Math.random() * 50;
    fx.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.5, max: 1, color: Math.random() < 0.5 ? "#fff" : color });
  }
  if (fx.parts.length > 300) fx.parts.splice(0, fx.parts.length - 300);
}
function soundVol(x, y) {
  if (!game.me) return 1;
  return clamp(1 - Math.hypot(x - game.me.x, y - game.me.y) / 420, 0, 1);
}

/* ---------------- Ateş etme ---------------- */
function startReload(L) {
  const W = WEAPONS[L.w];
  if (W.melee || L.reloadUntil || L.ammo[L.w] >= W.mag) return false;
  L.reloadUntil = now() + W.reload * 1000;
  return true;
}

// Ateş edilebiliyorsa nihai açıyı döndürür
function tryFire(p, L, aim, moving) {
  const t = now();
  const W = WEAPONS[L.w];
  if (t < L.nextFire || L.reloadUntil) return null;
  if (!W.melee && L.ammo[L.w] <= 0) {
    if (p === game.me) sfx.empty();
    startReload(L);
    return null;
  }
  L.nextFire = t + W.rate * 1000;
  if (W.melee) return aim;
  L.ammo[L.w]--;
  const spread = W.spread + L.bloom + (moving ? 0.03 : 0);
  L.bloom = Math.min(W.maxBloom, L.bloom + W.bloom);
  if (L.ammo[L.w] === 0) startReload(L);
  return aim + (Math.random() * 2 - 1) * spread;
}

function fireLocal(aim, moving) {
  const me = game.me;
  const a = tryFire(me, local, aim, moving);
  if (a === null) return;
  const W = WEAPONS[local.w];
  me.flash = now();
  if (W.melee) {
    fx.slashes.push({ x: me.x, y: me.y, a, t: now() });
    sfx.knife();
  } else {
    // Mermi izini hemen çiz; isabet kararını host verir
    const hit = rayHit(me.x, me.y, a, W.range, me.id);
    addTracer(me.x + Math.cos(a) * 9, me.y + Math.sin(a) * 9, me.x + Math.cos(a) * hit.t, me.y + Math.sin(a) * hit.t);
    sfx.shot(local.w);
    game.shake = Math.max(game.shake, local.w === 0 ? 0.8 : 1.2);
  }
  if (game.isHost) hostFire(me.id, me.x, me.y, a, local.w);
  else send({ t: "f", x: r1(me.x), y: r1(me.y), a: r2(a), w: local.w });
}

/* ---------------- HOST mantığı ---------------- */
function emit(ev) {
  handleEvent(ev);
  if (game.mode === "host") broadcast({ t: "e", e: ev });
}

function hostFire(id, x, y, a, w) {
  const p = game.players.get(id);
  if (!p || !p.alive) return;
  // İstemcinin bildirdiği konumu, bilinen konuma yakınsa kabul et
  if (!(Math.hypot(x - p.x, y - p.y) <= 24) || collides(x, y)) {
    x = p.x;
    y = p.y;
  }
  const W = WEAPONS[w];
  if (!W) return;
  if (W.melee) {
    let target = null;
    let best = 1e9;
    for (const q of game.players.values()) {
      if (q === p || !q.alive) continue;
      const d = Math.hypot(q.x - x, q.y - y);
      const off = Math.abs(angDiff(a, Math.atan2(q.y - y, q.x - x)));
      if (d < W.range + HIT_RADIUS && off < 1.0 && d < best && canSee(p, q)) {
        best = d;
        target = q;
      }
    }
    emit({ k: "kn", s: id, x: r1(x), y: r1(y), a: r2(a), h: target ? target.id : 0 });
    if (target) damage(target, W.dmg, p, w);
    return;
  }
  const hit = rayHit(x, y, a, W.range, id);
  const ex = x + Math.cos(a) * hit.t;
  const ey = y + Math.sin(a) * hit.t;
  emit({ k: "sh", s: id, x: r1(x), y: r1(y), ex: r1(ex), ey: r1(ey), w, h: hit.p ? hit.p.id : 0 });
  if (hit.p) damage(hit.p, W.dmg, p, w);
}

function damage(v, dmg, attacker, w) {
  if (!v.alive) return;
  v.hp -= dmg;
  if (v.hp > 0) return;
  v.hp = 0;
  v.alive = false;
  v.d++;
  v.respawnAt = now() + RESPAWN_MS;
  if (attacker && attacker !== v) attacker.k++;
  emit({ k: "kill", a: attacker ? attacker.id : 0, an: attacker ? attacker.name : "", v: v.id, vn: v.name, vc: v.color, w, x: r1(v.x), y: r1(v.y) });
}

function respawn(p) {
  // Diğer oyunculardan en uzak doğma noktasını seç
  let best = SPAWNS[0];
  let bestScore = -1;
  for (const s of SPAWNS) {
    let m = 1e9;
    for (const q of game.players.values()) if (q !== p && q.alive) m = Math.min(m, Math.hypot(q.x - s.x, q.y - s.y));
    const score = m + Math.random() * 80;
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  p.x = p.rx = best.x;
  p.y = p.ry = best.y;
  p.hp = MAX_HP;
  p.alive = true;
  p.seq++;
  if (p.bot) p.L = newLoadout();
}

function hostUpdate(dt) {
  const t = now();
  for (const p of game.players.values()) {
    if (!p.alive && t >= p.respawnAt) respawn(p);
    if (p.bot) updateBot(p, dt);
    // 10 sn ses gelmeyen oyuncuyu çıkar
    if (game.mode === "host" && !p.bot && p.id !== game.myId && t - p.lastSeen > 10000) removePlayer(p.id);
  }
  if (game.mode === "host" && t - game.lastSnap > SNAP_MS) {
    game.lastSnap = t;
    broadcast({
      t: "s",
      p: [...game.players.values()].map((p) => [p.id, p.name, p.color, r1(p.x), r1(p.y), r2(p.a), p.w, p.hp, p.alive ? 1 : 0, p.k, p.d, p.seq]),
    });
  }
}

function addPlayer(p) {
  game.players.set(p.id, p);
  p.respawnAt = 0;
  respawn(p);
}

function removePlayer(id) {
  const p = game.players.get(id);
  if (!p) return;
  game.players.delete(id);
  const c = game.conns.get(id);
  if (c) {
    game.conns.delete(id);
    try {
      c.close();
    } catch (e) {}
  }
  emit({ k: "leave", n: p.name });
  updateBotUI();
}

/* ---------------- Botlar ---------------- */
function addBot() {
  const bots = [...game.players.values()].filter((p) => p.bot);
  if (bots.length >= MAX_BOTS || game.players.size >= MAX_PLAYERS) return;
  const used = new Set(bots.map((b) => b.name));
  const name = BOT_NAMES.find((n) => !used.has(`Bot ${n}`)) || "X";
  const b = makePlayer(`bot${++game.botSeq}`, `Bot ${name}`, COLORS[(game.botSeq * 3) % COLORS.length], true);
  b.L = newLoadout();
  b.ai = { path: [], think: 0, target: null, react: 0, strafe: 0, strafeT: 0, stuck: 0, lx: 0, ly: 0 };
  addPlayer(b);
  emit({ k: "join", n: b.name });
  updateBotUI();
}

function removeBot() {
  const bots = [...game.players.values()].filter((p) => p.bot);
  if (bots.length) removePlayer(bots[bots.length - 1].id);
}

function findPath(fx0, fy0, tx, ty) {
  // Karo ızgarasında genişlik öncelikli arama
  const sx = Math.floor(fx0 / TILE);
  const sy = Math.floor(fy0 / TILE);
  const prev = new Int32Array(MW * MH).fill(-1);
  const start = sy * MW + sx;
  const goal = ty * MW + tx;
  prev[start] = start;
  const q = [start];
  for (let qi = 0; qi < q.length; qi++) {
    const cur = q[qi];
    if (cur === goal) break;
    const cx = cur % MW;
    const cy = (cur / MW) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx;
      const ny = cy + dy;
      const n = ny * MW + nx;
      if (!isSolidTile(nx, ny) && prev[n] === -1) {
        prev[n] = cur;
        q.push(n);
      }
    }
  }
  if (prev[goal] === -1) return [];
  const path = [];
  for (let c = goal; c !== start; c = prev[c]) path.push({ x: (c % MW) * TILE + TILE / 2, y: ((c / MW) | 0) * TILE + TILE / 2 });
  return path.reverse();
}

function updateBot(b, dt) {
  if (!b.alive) return;
  const ai = b.ai;
  const L = b.L;
  ai.think -= dt;
  if (ai.think <= 0) {
    ai.think = 0.3;
    let best = null;
    let bd = 260;
    for (const p of game.players.values()) {
      if (p === b || !p.alive) continue;
      const d = dist(b, p);
      if (d < bd && canSee(b, p)) {
        bd = d;
        best = p;
      }
    }
    if (best !== ai.target) {
      ai.target = best;
      ai.react = 0.35 + Math.random() * 0.35;
    }
    if (!best && !ai.path.length) {
      const [tx, ty] = FLOOR[Math.floor(Math.random() * FLOOR.length)];
      ai.path = findPath(b.x, b.y, tx, ty);
    }
  }

  let mx = 0;
  let my = 0;
  const tgt = ai.target;
  if (tgt && tgt.alive) {
    const d = dist(b, tgt);
    const want = Math.atan2(tgt.y - b.y, tgt.x - b.x);
    b.a = lerpAngle(b.a, want, Math.min(1, dt * 7));
    ai.strafeT -= dt;
    if (ai.strafeT <= 0) {
      ai.strafeT = 0.5 + Math.random();
      ai.strafe = [-1, 0, 1][Math.floor(Math.random() * 3)];
    }
    mx = Math.cos(want + Math.PI / 2) * ai.strafe * 0.7;
    my = Math.sin(want + Math.PI / 2) * ai.strafe * 0.7;
    if (d > 150 || L.w === 2) {
      mx += Math.cos(want);
      my += Math.sin(want);
    }
    const wantW = d < 26 ? 2 : L.ammo[0] > 0 || L.reloadUntil ? 0 : 1;
    if (L.w !== wantW) {
      L.w = wantW;
      L.reloadUntil = 0;
      L.nextFire = now() + 250;
    }
    ai.react -= dt;
    if (ai.react <= 0 && Math.abs(angDiff(b.a, want)) < 0.2) {
      const a = tryFire(b, L, b.a + (Math.random() * 2 - 1) * 0.07, ai.strafe !== 0);
      if (a !== null) {
        b.flash = now();
        hostFire(b.id, b.x, b.y, a, L.w);
      }
    }
    ai.path = [];
  } else {
    ai.target = null;
    if (L.ammo[0] < WEAPONS[0].mag) {
      L.w = 0;
      startReload(L);
    }
    const n = ai.path[0];
    if (n) {
      const dx = n.x - b.x;
      const dy = n.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d < 3) ai.path.shift();
      else {
        mx = dx / d;
        my = dy / d;
        b.a = lerpAngle(b.a, Math.atan2(dy, dx), Math.min(1, dt * 6));
      }
    }
  }
  const len = Math.hypot(mx, my);
  if (len > 0) {
    const sp = SPEED * 0.85 * WEAPONS[L.w].speed * dt;
    moveBody(b, (mx / len) * sp, (my / len) * sp);
  }
  // Takılırsa yeni yol bul
  if (Math.hypot(b.x - ai.lx, b.y - ai.ly) < 0.2 && len > 0) {
    ai.stuck += dt;
    if (ai.stuck > 0.6) {
      ai.path = [];
      ai.stuck = 0;
      ai.strafe = -ai.strafe;
    }
  } else ai.stuck = 0;
  ai.lx = b.x;
  ai.ly = b.y;
  b.w = L.w;
  if (L.reloadUntil && now() >= L.reloadUntil) {
    L.ammo[L.w] = WEAPONS[L.w].mag;
    L.reloadUntil = 0;
  }
  L.bloom = Math.max(0, L.bloom - dt * 0.3);
}

/* ---------------- Olaylar (host + istemci) ---------------- */
function handleEvent(ev) {
  const myId = game.myId;
  const shooter = game.players.get(ev.s);
  if (ev.k === "sh") {
    if (ev.s !== myId) {
      addTracer(ev.x, ev.y, ev.ex, ev.ey);
      if (shooter) shooter.flash = now();
      sfx.shot(ev.w, soundVol(ev.x, ev.y));
    }
    if (ev.h) hitFx(ev.h, ev.ex, ev.ey, ev.s);
  } else if (ev.k === "kn") {
    if (ev.s !== myId) {
      fx.slashes.push({ x: ev.x, y: ev.y, a: ev.a, t: now() });
      sfx.knife(soundVol(ev.x, ev.y));
    }
    if (ev.h) {
      const v = game.players.get(ev.h);
      if (v) hitFx(ev.h, v.x, v.y, ev.s);
    }
  } else if (ev.k === "kill") {
    addFeathers(ev.x, ev.y, ev.vc, 18);
    fx.decals.push({ x: ev.x, y: ev.y, color: ev.vc, t: now() });
    if (fx.decals.length > 40) fx.decals.shift();
    sfx.quack(soundVol(ev.x, ev.y));
    addKillfeed(ev);
    if (ev.a === myId && ev.v !== myId) {
      profile.kills++;
      saveProfile();
    }
    if (ev.v === myId) {
      profile.deaths++;
      saveProfile();
      game.deathBy = ev.a && ev.a !== myId ? ev.an : null;
      game.deathAt = now();
    }
  } else if (ev.k === "join") {
    toast(T("ds.joined", { name: ev.n }));
  } else if (ev.k === "leave") {
    toast(T("ds.left", { name: ev.n }));
  }
}

function hitFx(victimId, x, y, shooterId) {
  const v = game.players.get(victimId);
  addFeathers(x, y, v ? v.color : "#fff", 5);
  if (victimId === game.myId) {
    fx.hurt = now();
    game.shake = 3;
    sfx.hurt();
  }
  if (shooterId === game.myId) {
    fx.hitmarker = now();
    sfx.hit();
  }
}

/* ---------------- Ağ ---------------- */
function send(msg) {
  if (game.conn && game.conn.open) game.conn.send(msg);
}
function broadcast(msg) {
  for (const c of game.conns.values()) if (c.open) c.send(msg);
}

const makeCode = () => {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
};

function netAvailable() {
  if (typeof Peer === "undefined") {
    toast(T("ds.err.nopeer"), 4000);
    return false;
  }
  return true;
}

function createRoom(attempt = 0) {
  if (!netAvailable()) return;
  showLoading(T("ds.creating"));
  const code = makeCode();
  const peer = new Peer(PEER_PREFIX + code, { debug: 0 });
  game.peer = peer;
  peer.on("open", (id) => {
    if (game.peer !== peer) return;
    game.code = code;
    startGame("host", id);
    history.replaceState(null, "", `?oda=${code}`);
  });
  peer.on("connection", (conn) => setupHostConn(conn));
  peer.on("disconnected", () => {
    // Sinyal sunucusundan kopunca tekrar bağlan (mevcut bağlantılar sürer)
    if (game.peer === peer && !peer.destroyed) peer.reconnect();
  });
  peer.on("error", (err) => {
    if (game.peer !== peer) return;
    if (err.type === "unavailable-id" && attempt < 3) {
      peer.destroy();
      createRoom(attempt + 1);
      return;
    }
    if (game.state !== "playing") failToMenu(T("ds.err.net"));
  });
}

function setupHostConn(conn) {
  conn.on("data", (msg) => {
    if (!msg || typeof msg !== "object") return;
    const p = game.players.get(conn.peer);
    if (msg.t === "join") {
      if (game.players.size >= MAX_PLAYERS) {
        conn.send({ t: "full" });
        setTimeout(() => conn.close(), 300);
        return;
      }
      const np = makePlayer(conn.peer, cleanName(msg.name) || T("ds.defaultName"), validColor(msg.color));
      game.conns.set(conn.peer, conn);
      addPlayer(np);
      conn.send({ t: "w", id: conn.peer, code: game.code });
      emit({ k: "join", n: np.name });
      return;
    }
    if (!p) return;
    p.lastSeen = now();
    if (msg.t === "st") {
      if (!p.alive || msg.s !== p.seq) return;
      const x = +msg.x;
      const y = +msg.y;
      // Işınlanma / duvar içi kontrolü
      if (Number.isFinite(x) && Number.isFinite(y) && !collides(x, y) && Math.hypot(x - p.x, y - p.y) < 60) {
        p.x = x;
        p.y = y;
      }
      p.a = +msg.a || 0;
      p.w = clamp(msg.w | 0, 0, 2);
    } else if (msg.t === "f") {
      hostFire(p.id, +msg.x, +msg.y, +msg.a || 0, clamp(msg.w | 0, 0, 2));
    } else if (msg.t === "n") {
      p.name = cleanName(msg.name) || p.name;
      p.color = validColor(msg.color);
    }
  });
  conn.on("close", () => removePlayer(conn.peer));
  conn.on("error", () => removePlayer(conn.peer));
}

function joinRoom(code) {
  if (!netAvailable()) return;
  code = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length !== 5) {
    toast(T("ds.err.code"));
    return;
  }
  showLoading(T("ds.connecting"));
  const peer = new Peer({ debug: 0 });
  game.peer = peer;
  const timer = setTimeout(() => {
    if (game.peer === peer && game.state !== "playing") failToMenu(T("ds.err.net"));
  }, 15000);
  peer.on("open", () => {
    const conn = peer.connect(PEER_PREFIX + code, { serialization: "json" });
    game.conn = conn;
    conn.on("open", () => conn.send({ t: "join", name: profile.name, color: profile.color }));
    conn.on("data", (msg) => {
      if (!msg || typeof msg !== "object") return;
      game.lastHostMsg = now();
      if (msg.t === "w") {
        clearTimeout(timer);
        game.code = msg.code;
        startGame("client", msg.id);
      } else if (msg.t === "full") {
        clearTimeout(timer);
        failToMenu(T("ds.err.full"));
      } else if (msg.t === "s") applySnap(msg);
      else if (msg.t === "e") handleEvent(msg.e);
    });
    conn.on("close", () => {
      if (game.conn === conn) failToMenu(T("ds.err.closed"));
    });
  });
  peer.on("disconnected", () => {
    if (game.peer === peer && !peer.destroyed) peer.reconnect();
  });
  peer.on("error", (err) => {
    if (game.peer !== peer) return;
    clearTimeout(timer);
    failToMenu(err.type === "peer-unavailable" ? T("ds.err.notfound") : T("ds.err.net"));
  });
}

function applySnap(msg) {
  const seen = new Set();
  for (const a of msg.p) {
    const [id, name, color, x, y, ang, w, hp, alive, k, d, seq] = a;
    seen.add(id);
    let p = game.players.get(id);
    const fresh = !p;
    if (fresh) {
      p = makePlayer(id, name, color);
      game.players.set(id, p);
    }
    p.name = name;
    p.color = color;
    p.hp = hp;
    p.alive = !!alive;
    p.k = k;
    p.d = d;
    if (id === game.myId) {
      if (p.seq !== seq) {
        // Yeniden doğduk: host'un verdiği konuma geç
        p.x = p.rx = x;
        p.y = p.ry = y;
        p.seq = seq;
      }
    } else {
      if (fresh || p.seq !== seq) {
        p.rx = x;
        p.ry = y;
        p.ra = ang;
      }
      p.x = x;
      p.y = y;
      p.a = ang;
      p.w = w;
      p.seq = seq;
    }
  }
  for (const id of [...game.players.keys()]) if (!seen.has(id)) game.players.delete(id);
  game.me = game.players.get(game.myId) || game.me;
}

/* ---------------- Oyun başlat / bitir ---------------- */
function startGame(mode, myId) {
  hideLoading();
  game.mode = mode;
  game.isHost = mode !== "client";
  game.myId = myId;
  game.players.clear();
  game.state = "playing";
  game.paused = false;
  game.lastHostMsg = now();
  game.deathBy = null;
  game.deathAt = 0;
  local = newLoadout();
  fx.tracers.length = fx.parts.length = fx.slashes.length = fx.decals.length = 0;
  $("killfeed").innerHTML = "";

  const me = makePlayer(myId, profile.name, profile.color);
  game.me = me;
  if (game.isHost) addPlayer(me);
  else game.players.set(myId, me);

  if (mode === "practice") {
    game.botSeq = 0;
    for (let i = 0; i < 3; i++) addBot();
  }

  profile.matches++;
  saveProfile();

  $("menu").hidden = true;
  $("hud").hidden = false;
  document.body.classList.add("playing");
  $("roomChip").innerHTML = mode === "practice" ? `<b>${T("ds.practiceLabel")}</b>` : `${T("ds.room")}: <b>${esc(game.code)}</b>`;
  $("btnCopy").hidden = mode === "practice";
  $("botCtrl").hidden = !game.isHost;
  updateBotUI();
  sfx.init();
  if (isTouch && innerHeight > innerWidth) toast(T("ds.rotate"), 3500);
}

function leaveGame() {
  game.conn = null;
  if (game.peer) {
    const p = game.peer;
    game.peer = null;
    try {
      p.destroy();
    } catch (e) {}
  }
  game.conn = null;
  game.conns.clear();
  game.players.clear();
  game.me = null;
  game.state = "menu";
  game.mode = null;
  game.isHost = false;
  $("hud").hidden = true;
  $("pause").hidden = true;
  $("scoreboard").hidden = true;
  $("menu").hidden = false;
  document.body.classList.remove("playing");
  history.replaceState(null, "", location.pathname);
  renderProfile();
}

function failToMenu(msg) {
  hideLoading();
  leaveGame();
  toast(msg, 4000);
}

/* ---------------- Girdi ---------------- */
const isTouch = matchMedia("(pointer: coarse)").matches;
if (isTouch) document.body.classList.add("touch");

const keys = new Set();
const mouse = { x: innerWidth / 2, y: innerHeight / 2, down: false, fresh: false };
const sticks = { L: null, R: null };
let touchAim = 0;

function selectWeapon(i) {
  if (local.w === i || !game.me) return;
  local.w = i;
  local.reloadUntil = 0;
  local.nextFire = Math.max(local.nextFire, now() + 180);
  local.bloom = 0;
}

window.addEventListener("keydown", (e) => {
  if (game.state !== "playing" || e.target.tagName === "INPUT") return;
  keys.add(e.code);
  if (e.code === "Digit1") selectWeapon(0);
  if (e.code === "Digit2") selectWeapon(1);
  if (e.code === "Digit3") selectWeapon(2);
  if (e.code === "KeyR" && startReload(local)) sfx.reload();
  if (e.code === "KeyQ") selectWeapon((local.w + 2) % 3);
  if (e.code === "Tab") {
    e.preventDefault();
    showScore(true);
  }
  if (e.code === "Escape") togglePause();
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
});
window.addEventListener("keyup", (e) => {
  keys.delete(e.code);
  if (e.code === "Tab") showScore(false);
});
window.addEventListener("blur", () => {
  keys.clear();
  mouse.down = false;
});
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
canvas.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return;
  mouse.down = true;
  mouse.fresh = true;
  sfx.init();
});
window.addEventListener("mouseup", () => (mouse.down = false));
canvas.addEventListener("contextmenu", (e) => e.preventDefault());
canvas.addEventListener(
  "wheel",
  (e) => {
    if (game.state !== "playing") return;
    selectWeapon((local.w + (e.deltaY > 0 ? 1 : 2)) % 3);
  },
  { passive: true }
);

// Dokunmatik joystickler: ekranın sol yarısı hareket, sağ yarısı nişan/ateş
const touchLayer = $("touch");
touchLayer.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse") return;
  sfx.init();
  const side = e.clientX < innerWidth / 2 ? "L" : "R";
  if (sticks[side]) return;
  sticks[side] = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0 };
  touchLayer.setPointerCapture(e.pointerId);
  const el = $(side === "L" ? "stickL" : "stickR");
  el.style.left = `${e.clientX}px`;
  el.style.top = `${e.clientY}px`;
  el.firstElementChild.style.transform = "";
  el.classList.add("on");
});
touchLayer.addEventListener("pointermove", (e) => {
  for (const side of ["L", "R"]) {
    const s = sticks[side];
    if (!s || s.id !== e.pointerId) continue;
    let dx = e.clientX - s.ox;
    let dy = e.clientY - s.oy;
    const len = Math.hypot(dx, dy);
    const max = 50;
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    s.x = dx / max;
    s.y = dy / max;
    $(side === "L" ? "stickL" : "stickR").firstElementChild.style.transform = `translate(${dx}px, ${dy}px)`;
  }
});
const endStick = (e) => {
  for (const side of ["L", "R"]) {
    if (sticks[side] && sticks[side].id === e.pointerId) {
      sticks[side] = null;
      $(side === "L" ? "stickL" : "stickR").classList.remove("on");
    }
  }
};
touchLayer.addEventListener("pointerup", endStick);
touchLayer.addEventListener("pointercancel", endStick);

/* ---------------- Ana döngü ---------------- */
let last = now();
function frame() {
  const t = now();
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;
  if (game.state === "playing" && !game.paused) update(dt, t);
  render(t);
  requestAnimationFrame(frame);
}

function update(dt, t) {
  const me = game.me;
  if (game.mode === "client" && t - game.lastHostMsg > 8000) {
    failToMenu(T("ds.err.lost"));
    return;
  }
  if (me) {
    // Yeniden doğunca şarjörleri doldur
    if (me.seq !== local.seq) {
      const w = local.w;
      local = newLoadout();
      local.w = w;
      local.seq = me.seq;
    }
    let mx = 0;
    let my = 0;
    let aim = me.a;
    let firing = false;
    const W = WEAPONS[local.w];
    if (me.alive && !game.paused) {
      if (keys.has("KeyW") || keys.has("ArrowUp")) my -= 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) my += 1;
      if (keys.has("KeyA") || keys.has("ArrowLeft")) mx -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) mx += 1;
      if (sticks.L) {
        mx += sticks.L.x;
        my += sticks.L.y;
      }
      if (isTouch) {
        const R = sticks.R;
        if (R && Math.hypot(R.x, R.y) > 0.25) {
          touchAim = Math.atan2(R.y, R.x);
          firing = Math.hypot(R.x, R.y) > 0.55;
        } else if (sticks.L && Math.hypot(sticks.L.x, sticks.L.y) > 0.3) {
          touchAim = Math.atan2(sticks.L.y, sticks.L.x);
        }
        aim = touchAim;
      }
      if (!isTouch) {
        const sx = (me.rx - game.cam.x) * S + canvas.width / 2;
        const sy = (me.ry - game.cam.y) * S + canvas.height / 2;
        aim = Math.atan2(mouse.y * dpr - sy, mouse.x * dpr - sx);
        if (mouse.down && (W.auto || W.melee || mouse.fresh)) firing = true;
      }
      const len = Math.hypot(mx, my);
      if (len > 1) {
        mx /= len;
        my /= len;
      }
      const sp = SPEED * W.speed * dt;
      moveBody(me, mx * sp, my * sp);
      me.a = aim;
      me.w = local.w;
      if (firing) {
        fireLocal(aim, len > 0.2);
        mouse.fresh = false;
      }
    }
    if (local.reloadUntil && t >= local.reloadUntil) {
      local.ammo[local.w] = WEAPONS[local.w].mag;
      local.reloadUntil = 0;
      sfx.reload();
    }
    local.bloom = Math.max(0, local.bloom - dt * 0.25);
    me.rx = me.x;
    me.ry = me.y;
    me.ra = me.a;
    if (game.mode === "client" && t - game.lastNet > SNAP_MS) {
      game.lastNet = t;
      send({ t: "st", x: r1(me.x), y: r1(me.y), a: r2(me.a), w: local.w, s: me.seq });
    }
  }
  if (game.isHost) hostUpdate(dt);

  // Diğer oyuncuları yumuşakça hedef konuma taşı
  const k = 1 - Math.exp(-dt * 16);
  for (const p of game.players.values()) {
    if (p === me) continue;
    if (game.isHost && p.bot) {
      p.rx = p.x;
      p.ry = p.y;
      p.ra = p.a;
    } else {
      p.rx += (p.x - p.rx) * k;
      p.ry += (p.y - p.ry) * k;
      p.ra = lerpAngle(p.ra, p.a, k);
    }
  }

  for (const q of fx.parts) {
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.vx *= 0.9;
    q.vy *= 0.9;
    q.life -= dt;
  }
  fx.parts = fx.parts.filter((q) => q.life > 0);
  fx.tracers = fx.tracers.filter((tr) => t - tr.t < 90);
  fx.slashes = fx.slashes.filter((s) => t - s.t < 140);
  game.shake = Math.max(0, game.shake - dt * 12);
  updateHud(t);
}

/* ---------------- Çizim ---------------- */
function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#16120f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Kamera
  const cam = game.cam;
  if (game.state === "playing" && game.me) {
    cam.x = game.me.rx;
    cam.y = game.me.ry;
  } else {
    // Menüde haritayı yavaşça gezdir
    cam.x = WORLD_W / 2 + Math.sin(t / 7000) * WORLD_W * 0.3;
    cam.y = WORLD_H / 2 + Math.cos(t / 9000) * WORLD_H * 0.25;
  }
  // Kenarda biraz boşluk bırak ki köşedeki oyuncu arayüzün altında kalmasın
  const M = game.state === "playing" ? 40 : 0;
  const cx = viewW >= WORLD_W + M * 2 ? WORLD_W / 2 : clamp(cam.x, viewW / 2 - M, WORLD_W - viewW / 2 + M);
  const cy = viewH >= WORLD_H + M * 2 ? WORLD_H / 2 : clamp(cam.y, viewH / 2 - M, WORLD_H - viewH / 2 + M);
  cam.x = cx;
  cam.y = cy;
  const sh = game.shake;
  const ox = Math.round((viewW / 2 - cx + (Math.random() - 0.5) * sh) * S);
  const oy = Math.round((viewH / 2 - cy + (Math.random() - 0.5) * sh) * S);
  ctx.setTransform(S, 0, 0, S, ox, oy);
  ctx.drawImage(mapCanvas, 0, 0);

  // Tüy yığınları
  for (const d of fx.decals) {
    const age = (t - d.t) / 1000;
    if (age > 12) continue;
    ctx.globalAlpha = clamp(1 - age / 12, 0, 0.8);
    ctx.fillStyle = d.color;
    ctx.fillRect(Math.round(d.x) - 3, Math.round(d.y) - 1, 2, 1);
    ctx.fillRect(Math.round(d.x) + 1, Math.round(d.y) + 2, 2, 1);
    ctx.fillStyle = "#fff";
    ctx.fillRect(Math.round(d.x), Math.round(d.y), 2, 1);
    ctx.fillRect(Math.round(d.x) - 2, Math.round(d.y) + 3, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Oyuncular
  for (const p of game.players.values()) {
    if (!p.alive) continue;
    const x = Math.round(p.rx);
    const y = Math.round(p.ry);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(x - 5, y + 4, 11, 3);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(p.ra);
    ctx.drawImage(duckSprite(p.color, p.w), -8, -9);
    if (t - p.flash < 50 && p.w !== 2) {
      ctx.fillStyle = "#fff6b0";
      ctx.fillRect(p.w === 0 ? 14 : 10, 3, 3, 3);
    }
    ctx.restore();
  }

  // Bıçak savuruşu
  for (const s of fx.slashes) {
    const k = (t - s.t) / 140;
    ctx.strokeStyle = `rgba(255,255,255,${1 - k})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 14, s.a - 0.9 + k * 0.6, s.a + 0.5 + k * 0.6);
    ctx.stroke();
  }

  // Mermi izleri
  ctx.lineWidth = 0.8;
  for (const tr of fx.tracers) {
    ctx.strokeStyle = `rgba(255,236,160,${1 - (t - tr.t) / 90})`;
    ctx.beginPath();
    ctx.moveTo(tr.x1, tr.y1);
    ctx.lineTo(tr.x2, tr.y2);
    ctx.stroke();
  }

  // Tüyler
  for (const q of fx.parts) {
    ctx.globalAlpha = clamp(q.life * 2, 0, 1);
    ctx.fillStyle = q.color;
    ctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1);
  }
  ctx.globalAlpha = 1;

  if (game.state !== "playing") return;

  // İsimler ve can çubukları (ekran çözünürlüğünde, net görünsün)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const fs = Math.round(11 * dpr);
  ctx.font = `600 ${fs}px "Pixelify Sans", monospace`;
  ctx.textAlign = "center";
  for (const p of game.players.values()) {
    if (!p.alive || p === game.me) continue;
    const sx = p.rx * S + ox;
    const sy = (p.ry - 11) * S + oy;
    // Pikselli fontun "fi/fl" bitişik harflerini engelle
    const label = p.name.replace(/f(?=[il])/g, "f\u200c");
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillText(label, sx + dpr, sy + dpr);
    ctx.fillStyle = "#fff";
    ctx.fillText(label, sx, sy);
    const bw = 12 * S;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(sx - bw / 2, sy + 3 * dpr, bw, 2 * dpr);
    ctx.fillStyle = p.hp > 40 ? "#48e0a0" : "#ff4d5e";
    ctx.fillRect(sx - bw / 2, sy + 3 * dpr, (bw * p.hp) / MAX_HP, 2 * dpr);
  }

  // Hasar alınca kırmızı kenar
  const hurtK = 1 - (t - fx.hurt) / 300;
  if (hurtK > 0) {
    const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.3, canvas.width / 2, canvas.height / 2, canvas.height * 0.8);
    g.addColorStop(0, "rgba(255,0,40,0)");
    g.addColorStop(1, `rgba(255,0,40,${0.45 * hurtK})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Nişangah (masaüstü)
  if (!isTouch && game.me && game.me.alive) {
    const W = WEAPONS[local.w];
    const gap = Math.round((3 + (W.melee ? 0 : (W.spread + local.bloom) * 120)) * dpr);
    const len = Math.round(6 * dpr);
    const th = Math.max(2, Math.round(2 * dpr));
    const mx = Math.round(mouse.x * dpr);
    const my = Math.round(mouse.y * dpr);
    const hm = t - fx.hitmarker < 150;
    ctx.fillStyle = hm ? "#ff4d5e" : "#7dff9a";
    ctx.fillRect(mx - gap - len, my - th / 2, len, th);
    ctx.fillRect(mx + gap, my - th / 2, len, th);
    ctx.fillRect(mx - th / 2, my - gap - len, th, len);
    ctx.fillRect(mx - th / 2, my + gap, th, len);
    ctx.fillRect(mx - th / 2, my - th / 2, th, th);
  } else if (isTouch && t - fx.hitmarker < 150 && game.me) {
    const sx = game.me.rx * S + ox;
    const sy = game.me.ry * S + oy;
    ctx.fillStyle = "#ff4d5e";
    const d = 16 * S;
    ctx.fillRect(sx + Math.cos(game.me.a) * d - 3 * dpr, sy + Math.sin(game.me.a) * d - 3 * dpr, 6 * dpr, 6 * dpr);
  }
}

/* ---------------- Arayüz ---------------- */
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

function addKillfeed(ev) {
  const li = document.createElement("li");
  const W = WEAPONS[ev.w] || WEAPONS[0];
  const killer = ev.an && ev.a !== ev.v ? `${esc(ev.an)}<span class="w">${W.icon}</span>` : `<span class="w">💀</span>`;
  li.innerHTML = `${killer}${esc(ev.vn)}`;
  if (ev.a === game.myId || ev.v === game.myId) li.classList.add("me");
  const feed = $("killfeed");
  feed.prepend(li);
  while (feed.children.length > 5) feed.lastChild.remove();
  setTimeout(() => li.classList.add("fade"), 5000);
  setTimeout(() => li.remove(), 5700);
}

let hudCache = "";
function updateHud(t) {
  const me = game.me;
  if (!me) return;
  const W = WEAPONS[local.w];
  const reloading = !!local.reloadUntil;
  const sig = [me.hp, local.w, local.ammo[local.w], reloading, me.alive, Math.ceil((me.alive ? 0 : RESPAWN_MS - (t - (game.deathAt || 0))) / 1000)].join("|");
  if (sig !== hudCache) {
    hudCache = sig;
    $("hpVal").textContent = me.hp;
    $("hpBar").style.transform = `scaleX(${me.hp / MAX_HP})`;
    $("hpVal").parentElement.classList.toggle("low", me.hp <= 30 && me.alive);
    $("ammoVal").textContent = W.melee ? "∞" : local.ammo[local.w];
    $("ammoMax").textContent = W.melee ? "" : `/ ${W.mag}`;
    $("ammoVal").parentElement.classList.toggle("empty", !W.melee && local.ammo[local.w] === 0);
    $("reloadTxt").hidden = !reloading;
    document.querySelectorAll(".slot").forEach((b) => b.classList.toggle("active", +b.dataset.slot === local.w));
    $("deathMsg").hidden = me.alive || !game.deathAt;
    if (!me.alive) {
      $("deathBy").textContent = game.deathBy ? T("ds.killedby", { name: game.deathBy }) : "";
      const s = Math.max(1, Math.ceil((RESPAWN_MS - (t - (game.deathAt || t))) / 1000));
      $("deathTimer").textContent = T("ds.respawn", { s });
    }
  }
  if (!$("scoreboard").hidden) renderScore();
}

function renderScore() {
  const rows = [...game.players.values()].sort((a, b) => b.k - a.k || a.d - b.d);
  const html = rows
    .map((p) => `<tr class="${p.id === game.myId ? "me" : ""}"><td><span class="dot" style="background:${validColor(p.color)}"></span>${esc(p.name)}${p.id === game.myId ? ` (${T("ds.you")})` : ""}</td><td>${p.k}</td><td>${p.d}</td></tr>`)
    .join("");
  if ($("sbBody").innerHTML !== html) $("sbBody").innerHTML = html;
  $("sbTitle").textContent = game.mode === "practice" ? T("ds.score") : `${T("ds.score")} · ${game.code}`;
}
function showScore(on) {
  $("scoreboard").hidden = !on;
  if (on) renderScore();
}
function togglePause(force) {
  const on = force !== undefined ? force : $("pause").hidden;
  $("pause").hidden = !on;
  game.paused = on && game.mode === "practice" ? true : false;
  if (on) {
    keys.clear();
    mouse.down = false;
  }
}

function updateBotUI() {
  $("botCount").textContent = [...game.players.values()].filter((p) => p.bot).length;
}

/* ---------------- Menü ---------------- */
function renderProfile() {
  $("nameInput").value = profile.name;
  $("stK").textContent = profile.kills;
  $("stD").textContent = profile.deaths;
  $("stKD").textContent = profile.deaths ? (profile.kills / profile.deaths).toFixed(2) : profile.kills.toFixed(2);
  $("stG").textContent = profile.matches;
  document.querySelectorAll("#swatches button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.color === profile.color)));
}

COLORS.forEach((c) => {
  const b = document.createElement("button");
  b.type = "button";
  b.style.background = c;
  b.dataset.color = c;
  b.setAttribute("aria-label", c);
  b.addEventListener("click", () => {
    profile.color = c;
    saveProfile();
    renderProfile();
  });
  $("swatches").appendChild(b);
});

document.querySelectorAll(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === tab));
    document.querySelectorAll(".panel").forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
    renderProfile();
  })
);

$("btnSaveName").addEventListener("click", () => {
  const n = cleanName($("nameInput").value);
  if (!n) return;
  profile.name = n;
  saveProfile();
  renderProfile();
  toast(T("ds.saved"));
});
$("nameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("btnSaveName").click();
});
$("btnReset").addEventListener("click", () => {
  if (!confirm(T("ds.reset.q"))) return;
  profile.kills = profile.deaths = profile.matches = 0;
  saveProfile();
  renderProfile();
});

$("btnCreate").addEventListener("click", () => createRoom());
$("joinForm").addEventListener("submit", (e) => {
  e.preventDefault();
  joinRoom($("joinCode").value);
});
$("joinCode").addEventListener("input", (e) => (e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")));
$("btnPractice").addEventListener("click", () => startGame("practice", "me"));
$("btnCancel").addEventListener("click", () => {
  hideLoading();
  leaveGame();
});

$("btnCopy").addEventListener("click", () => {
  const url = `${location.origin}${location.pathname}?oda=${game.code}`;
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
    .then(() => toast(T("ds.copied")))
    .catch(() => prompt("Link", url));
});
$("btnBotPlus").addEventListener("click", addBot);
$("btnBotMinus").addEventListener("click", removeBot);
$("btnScore").addEventListener("click", () => showScore($("scoreboard").hidden));
$("scoreboard").addEventListener("click", () => showScore(false));
$("btnPause").addEventListener("click", () => togglePause(true));
$("btnResume").addEventListener("click", () => togglePause(false));
$("btnLeave").addEventListener("click", leaveGame);
$("btnReload").addEventListener("click", () => startReload(local) && sfx.reload());
document.querySelectorAll(".slot").forEach((b) => b.addEventListener("click", () => selectWeapon(+b.dataset.slot)));

const updateMuteBtn = () => ($("btnMute").textContent = sfx.muted ? "🔇" : "🔊");
$("btnMute").addEventListener("click", () => {
  sfx.muted = !sfx.muted;
  try {
    localStorage.setItem("duckstrike-muted", sfx.muted ? "1" : "0");
  } catch (e) {}
  updateMuteBtn();
});
updateMuteBtn();

document.addEventListener("langchange", () => {
  if (game.state === "playing") {
    $("roomChip").innerHTML = game.mode === "practice" ? `<b>${T("ds.practiceLabel")}</b>` : `${T("ds.room")}: <b>${esc(game.code)}</b>`;
    hudCache = "";
  }
});

window.addEventListener("beforeunload", () => {
  if (game.peer) game.peer.destroy();
});

// Linkle gelindiyse (?oda=KOD) kodu doldur
const urlCode = new URLSearchParams(location.search).get("oda");
if (urlCode) $("joinCode").value = urlCode.toUpperCase().slice(0, 5);

renderProfile();
requestAnimationFrame(frame);

// Test ve hata ayıklama için
window.duckStrike = { game, profile, startGame, addBot };
