/* =========================================================
   EKRAN KORUYUCU — Duck OS'un piksel bullet hell'i
   Sen bir imleçsin; ekran koruyucular masaüstünü ele geçirdi.
   İmleç kendiliğinden ateş eder, yalnızca okun ucu vurulur.
   Dört patron, her biri canı yarıya inince öfkelenir:
     1 Kar Fırtınası · 2 Zıplayan Logo · 3 Hata Penceresi · 4 Dev Ördek
   Fare: imleci taşı · Dokunmatik: parmağı sürükle (imleç parmağın
   önünde kalır) · Klavye: oklar (Shift yavaş) · P duraklat · M ses
   ========================================================= */
(function () {
  "use strict";
  const P = window.Piksel;
  const { clamp, rand } = P;
  const TAU = Math.PI * 2;

  const L = P.i18n({
    tr: {
      title: "EKRAN", title2: "KORUYUCU",
      m1: "Sen bir imleçsin.", m2: "Ekran koruyucular", m3: "masaüstünü ele geçirdi!",
      m4: "Fareyle kaç, imleç kendi ateş eder.", m4t: "Parmağını sürükle, imleç kendi ateş eder.", m5: "Yalnızca okun ucu vurulur.",
      start: "Başlamak için tıkla", keys: "P: duraklat   M: ses",
      best: "Rekor", score: "Puan", stage: "Aşama",
      b1: "Kar Fırtınası", b2: "Zıplayan Logo", b3: "Hata Penceresi", b4: "Dev Ördek",
      rage: "Öfkelendi!", corner: "KÖŞE!", quack: "VAK!", graze: "Sıyırdı",
      down: "yenildi!", nohit: "Hasarsız!", heal: "+1 can", power: "Ateş gücü arttı",
      over: "Ekran karardı", again: "Tekrar için tıkla",
      win: "Masaüstü kurtuldu!", time: "Süre",
      paused: "DURAKLATILDI", resume: "Devam için tıkla", newBest: "Yeni rekor!",
      err: "Hata", errText: "Ekran koruyucu", errText2: "yanıt vermiyor", ok: "Tamam",
    },
    en: {
      title: "SCREEN", title2: "SAVER WARS",
      m1: "You are the cursor.", m2: "The screensavers", m3: "took over the desktop!",
      m4: "Dodge with the mouse, you fire on your own.", m4t: "Drag a finger, you fire on your own.", m5: "Only the arrow's tip can be hit.",
      start: "Click to start", keys: "P: pause   M: sound",
      best: "Best", score: "Score", stage: "Stage",
      b1: "Blizzard", b2: "Bouncing Logo", b3: "Error Window", b4: "Giant Duck",
      rage: "Enraged!", corner: "CORNER!", quack: "QUACK!", graze: "Graze",
      down: "defeated!", nohit: "No damage!", heal: "+1 life", power: "Fire power up",
      over: "Screen went dark", again: "Click to try again",
      win: "Desktop saved!", time: "Time",
      paused: "PAUSED", resume: "Click to resume", newBest: "New best!",
      err: "Error", errText: "Screensaver is", errText2: "not responding", ok: "OK",
    },
  }, () => { document.title = (L.lang === "en" ? "Screen Saver Wars" : "Ekran Koruyucu") + " · Kaan Kara"; });
  document.title = (L.lang === "en" ? "Screen Saver Wars" : "Ekran Koruyucu") + " · Kaan Kara";

  const canvas = document.getElementById("game");
  const W = 240, H = 320;
  const scr = P.screen(canvas, { w: W, h: H });
  const TOUCH = matchMedia("(pointer: coarse)").matches;
  const ctx = scr.ctx;

  /* ---------- sprite'lar ---------- */
  const CURSOR = P.sprite([
    "k.......",
    "kk......",
    "kwk.....",
    "kwwk....",
    "kwwwk...",
    "kwwwwk..",
    "kwwwwwk.",
    "kwwwwwwk",
    "kwwwkkkk",
    "kwkwk...",
    "kk.kwk..",
    "k...kwk.",
    ".....kk.",
  ], { k: "#000", w: "#fff" });
  const CURSOR_HIT = P.tint(CURSOR, "#ff5a4a");

  const SHAPES = {
    dot: [".X.", "XOX", ".X."],
    ball: [".XXX.", "XOOXX", "XOOXX", "XXXXX", ".XXX."],
    flake: ["X.X.X", ".XOX.", "XOOOX", ".XOX.", "X.X.X"],
    bang: ["XOX", "XOX", "XOX", "XOX", ".X.", "...", "XOX"],
    egg: [".XX.", "XOOX", "XOOX", "XOXX", ".XX."],
    feather: [".X.", "XOX", "XOX", "XOX", ".X.", ".X."],
  };
  const RAD = { dot: 1.6, ball: 2.4, flake: 2.2, bang: 1.8, egg: 2.2, feather: 1.6 };
  const bulletCache = {};
  const bulletSprite = (kind, color) => {
    const k = kind + color;
    return bulletCache[k] || (bulletCache[k] = P.sprite(SHAPES[kind], { X: color, O: "#fff" }));
  };

  // kar tanesi patron
  const FLAKE = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 33;
    const x = c.getContext("2d");
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU, ex = 16 + Math.cos(a) * 15, ey = 16 + Math.sin(a) * 15;
      P.line(x, 16, 16, ex, ey, "#dff4ff");
      for (const t of [0.45, 0.72]) {
        const bx = 16 + Math.cos(a) * 15 * t, by = 16 + Math.sin(a) * 15 * t;
        for (const s of [-1, 1]) P.line(x, bx, by, bx + Math.cos(a + s * 0.8) * 5, by + Math.sin(a + s * 0.8) * 5, "#9fd8ff");
      }
    }
    x.fillStyle = "#fff"; x.fillRect(14, 14, 5, 5);
    x.fillStyle = "#4aa8ff"; x.fillRect(15, 15, 3, 3);
    return c;
  })();

  // dev ördek (duvar kağıdındaki ördek)
  const DUCK = (() => {
    const c = document.createElement("canvas");
    c.width = 24; c.height = 20;
    const x = c.getContext("2d");
    const r = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
    r("#ffd23f", 4, 11, 13, 8); r("#ffd23f", 3, 13, 15, 5); r("#ffd23f", 12, 5, 7, 7); r("#ffd23f", 2, 11, 2, 2);
    r("#ff8a1f", 19, 8, 4, 2); r("#f2b20f", 6, 13, 7, 2);
    r("#e8483a", 11, 4, 9, 2); r("#e8483a", 13, 2, 5, 2); r("#fff", 14, 1, 3, 1);
    r("#e8483a", 10, 11, 9, 2); r("#e8483a", 6, 11, 2, 4);
    r("#111", 16, 7, 1, 1);
    return c;
  })();
  const DUCK_HIT = P.tint(DUCK, "#fff");
  const HEART = P.sprite([".RR.RR.", "RRRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."], { R: "#ff5a4a" });
  const HEART_OFF = P.sprite([".kk.kk.", "k..k..k", "k.....k", ".k...k.", "..k.k..", "...k..."], { k: "#55607a" });

  /* ---------- durum ---------- */
  const BEST_KEY = "ekran-koruyucu-rekor";
  let mode = "menu"; // menu | intro | play | clear | over | win | paused
  let prevMode = "play";
  let tick = 0;
  let pl, pb, eb, fx, texts, minions, boss, stage, timer, score, shake, frames, stageHit, newBest;

  function reset() {
    pl = { x: W / 2, y: H - 40, tx: W / 2, ty: H - 40, lives: 3, inv: 0, fire: 0, power: 1 };
    pb = []; eb = []; fx = []; texts = []; minions = [];
    boss = null; stage = 0; timer = 0; score = 0; shake = 0; frames = 0; newBest = false;
  }
  reset();

  /* ---------- yardımcılar ---------- */
  const angTo = (x, y) => Math.atan2(pl.y - y, pl.x - x);
  function fire(x, y, a, spd, kind, color, extra) {
    eb.push(Object.assign({ x, y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, kind, color, r: RAD[kind], g: false }, extra));
  }
  function ring(x, y, n, spd, kind, color, off = 0, gapAt = null, gap = 0) {
    for (let i = 0; i < n; i++) {
      const a = off + (i / n) * TAU;
      if (gapAt != null) {
        let d = Math.abs(((a - gapAt + Math.PI) % TAU + TAU) % TAU - Math.PI);
        if (d < gap) continue;
      }
      fire(x, y, a, spd, kind, color);
    }
  }
  function aimed(x, y, n, spread, spd, kind, color) {
    const a0 = angTo(x, y);
    for (let i = 0; i < n; i++) fire(x, y, a0 + (i - (n - 1) / 2) * spread, spd, kind, color);
  }
  function boom(x, y, n, colors, spd = 2) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(0.3, spd);
      fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(20, 50), c: colors[i % colors.length], s: Math.random() < 0.4 ? 2 : 1 });
    }
  }
  function say(str, x, y, color = "#fff", size = 8, life = 70) { texts.push({ str, x, y, color, size, life, max: life }); }
  const sfx = {
    hit: () => P.sound.beep(1200, 0.02, { vol: 0.015, key: "hit", gap: 0.05 }),
    shot: () => P.sound.beep(380, 0.04, { vol: 0.012, key: "shot", gap: 0.08, type: "triangle" }),
    hurt: () => { P.sound.noise(0.4, { vol: 0.2, freq: 900 }); P.sound.beep(180, 0.3, { slide: 60, vol: 0.05 }); },
    graze: () => P.sound.beep(1800, 0.02, { vol: 0.012, key: "graze", gap: 0.04 }),
    boom: () => { P.sound.noise(0.9, { vol: 0.22, freq: 700 }); P.sound.tune([392, 330, 262, 196], 0.08, { vol: 0.04 }); },
    small: () => P.sound.noise(0.2, { vol: 0.1, freq: 1500, key: "small", gap: 0.05 }),
    rage: () => P.sound.tune([196, 233, 277, 330], 0.07, { vol: 0.05, type: "sawtooth" }),
  };

  /* =========================================================
     Patronlar
     ========================================================= */
  function makeBoss(n) {
    const common = { t: 0, phase: 1, flash: 0, enter: 60 };
    if (n === 0) return Object.assign(common, {
      name: "b1", hp: 240, max: 240, x: W / 2, y: -40, ty: 64, rot: 0, dirS: 1, bg: "#050a1e",
      hit(x, y) { return Math.hypot(x - this.x, y - this.y) < 13; },
      touch(x, y) { return Math.hypot(x - this.x, y - this.y) < 11; },
      update() {
        const t = this.t;
        this.x = W / 2 + Math.sin(t / 80) * 60;
        this.y = this.ty + Math.sin(t / 50) * 8;
        this.rot += this.phase === 1 ? 0.03 : 0.05 * this.dirS;
        if (this.phase === 1) {
          if (t % 6 === 0) { const a = t * 0.11; fire(this.x, this.y, a, 1.25, "flake", "#9fd8ff"); fire(this.x, this.y, a + Math.PI, 1.25, "flake", "#9fd8ff"); sfx.shot(); }
          if (t % 80 === 40) ring(this.x, this.y, 14, 0.95, "dot", "#ffffff", t * 0.05);
        } else {
          if (t % 200 === 0) this.dirS *= -1;
          if (t % 5 === 0) { const a = t * 0.12 * this.dirS; for (let k = 0; k < 3; k++) fire(this.x, this.y, a + (k * TAU) / 3, 1.35, "flake", "#9fd8ff"); sfx.shot(); }
          if (t % 48 === 0) aimed(this.x, this.y, 3, 0.2, 2.3, "bang", "#4aa8ff");
          if (t % 120 === 60) ring(this.x, this.y, 18, 0.85, "dot", "#ffffff", t);
        }
      },
      draw() {
        ctx.save(); ctx.translate(Math.round(this.x), Math.round(this.y)); ctx.rotate(this.rot);
        if (this.flash && tick % 8 < 2) ctx.globalAlpha = 0.6;
        ctx.drawImage(FLAKE, -16, -16); ctx.restore(); ctx.globalAlpha = 1;
      },
    });
    if (n === 1) return Object.assign(common, {
      name: "b2", hp: 420, max: 420, bg: "#000000",
      logos: [{ x: 90, y: -30, vx: 1.3, vy: 1.0, c: 0, lastX: -99, lastY: -99 }],
      w: 60, h: 20,
      hit(x, y) { return this.logos.some((l) => x > l.x && x < l.x + this.w && y > l.y && y < l.y + this.h); },
      touch(x, y) { return this.hit(x, y); },
      update() {
        const t = this.t, sp = this.phase === 1 ? 1 : 1.3;
        for (const l of this.logos) {
          l.x += l.vx * sp; l.y += l.vy * sp;
          let hx = false, hy = false;
          if (l.x < 0) { l.x = 0; l.vx = Math.abs(l.vx); hx = true; }
          if (l.x > W - this.w) { l.x = W - this.w; l.vx = -Math.abs(l.vx); hx = true; }
          if (l.y < 0 && this.enter <= 0) { l.y = 0; l.vy = Math.abs(l.vy); hy = true; }
          if (l.y > 210) { l.y = 210; l.vy = -Math.abs(l.vy); hy = true; }
          if (hx) l.lastX = t;
          if (hy) l.lastY = t;
          const cx = l.x + this.w / 2, cy = l.y + this.h / 2;
          if (hx || hy) {
            l.c = (l.c + 1) % LOGO_COLORS.length;
            if (Math.abs(l.lastX - l.lastY) < 10) {
              say(L.t("corner"), cx, cy, "#ffd23f", 16, 80);
              ring(cx, cy, 36, 1.1, "ball", LOGO_COLORS[l.c]); ring(cx, cy, 24, 0.75, "dot", "#fff", 0.13);
              P.sound.tune([523, 659, 784, 1047, 1319], 0.06, { vol: 0.045 });
              l.lastX = l.lastY = -99;
            } else {
              ring(cx, cy, this.phase === 1 ? 10 : 12, 1.15, "ball", LOGO_COLORS[l.c], rand(0, 1));
              P.sound.beep(260, 0.08, { vol: 0.03 });
            }
          }
        }
        if (t % (this.phase === 1 ? 60 : 45) === 0) for (const l of this.logos) aimed(l.x + this.w / 2, l.y + this.h / 2, 3, 0.22, 1.8, "dot", "#fff");
      },
      rage() { const l = this.logos[0]; this.logos.push({ x: W - this.w - l.x, y: l.y, vx: -l.vx, vy: l.vy * 1.1, c: 3, lastX: -99, lastY: -99 }); },
      draw() {
        for (const l of this.logos) {
          const x = Math.round(l.x), y = Math.round(l.y);
          ctx.fillStyle = this.flash && tick % 8 < 2 ? "#fff" : LOGO_COLORS[l.c];
          ctx.fillRect(x, y, this.w, this.h);
          ctx.fillStyle = "#000"; ctx.fillRect(x + 2, y + 2, this.w - 4, this.h - 4);
          P.text(ctx, "DUCK", x + 6, y + 6, { color: LOGO_COLORS[l.c], shadow: false });
          P.text(ctx, "OS", x + 40, y + 6, { color: "#fff", shadow: false });
        }
      },
    });
    if (n === 2) return Object.assign(common, {
      name: "b3", hp: 520, max: 520, x: W / 2 - 72, y: -60, ty: 30, w: 144, h: 56, bg: "#06205a",
      hit(x, y) { return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h; },
      touch(x, y) { return this.hit(x, y); },
      update() {
        const t = this.t;
        this.x = W / 2 - this.w / 2 + Math.sin(t / 90) * 40;
        this.y = this.ty + Math.sin(t / 47) * 6;
        const cx = this.x + this.w / 2, cy = this.y + this.h;
        if (t % 8 === 0) {
          const base = Math.PI / 2 + Math.sin(t / 40) * 0.95;
          for (let k = -1; k <= 1; k++) fire(cx, cy, base + k * 0.22, 1.55, "bang", "#ffd23f");
          sfx.shot();
        }
        if (t % 140 === 70 && minions.length < (this.phase === 1 ? 3 : 4)) {
          minions.push({ x: rand(10, W - 40), y: -24, ty: rand(90, 150), w: 30, h: 22, hp: 10, t: 0, flash: 0 });
        }
        if (this.phase === 2 && t % 110 === 0) ring(cx, this.y + this.h / 2, 26, 1.05, "ball", "#ff6a5a", 0, angTo(cx, this.y + this.h / 2), 0.38);
      },
      draw() {
        const x = Math.round(this.x), y = Math.round(this.y), w = this.w, h = this.h;
        drawWindow(x, y, w, h, L.t("err"), this.flash && tick % 8 < 2);
        // kırmızı X simgesi
        ctx.fillStyle = "#e8483a"; ctx.fillRect(x + 8, y + 18, 12, 12);
        ctx.fillStyle = "#fff";
        for (let i = 0; i < 6; i++) { ctx.fillRect(x + 11 + i, y + 21 + i, 1, 1); ctx.fillRect(x + 16 - i, y + 21 + i, 1, 1); }
        P.text(ctx, L.t("errText"), x + 24, y + 17, { color: "#000", shadow: false, size: 8 });
        P.text(ctx, L.t("errText2"), x + 24, y + 27, { color: "#000", shadow: false, size: 8 });
        ctx.fillStyle = "#003c74"; ctx.fillRect(x + w / 2 - 24, y + h - 16, 48, 12);
        ctx.fillStyle = "#f3f2ec"; ctx.fillRect(x + w / 2 - 23, y + h - 15, 46, 10);
        P.text(ctx, L.t("ok"), x + w / 2 + 1, y + h - 14, { color: "#000", shadow: false, align: "center" });
      },
    });
    return Object.assign(common, {
      name: "b4", hp: 700, max: 700, x: W / 2, y: -50, ty: 72, bg: "#0b1630", dash: 0, dashX: 0, warn: 0,
      hit(x, y) { return Math.hypot(x - this.x, y - this.y) < 24; },
      touch(x, y) { return Math.hypot(x - this.x, y - this.y) < 20; },
      update() {
        const t = this.t;
        if (this.dash) {
          this.dash--;
          const k = this.dash > 50 ? (90 - this.dash) / 40 : this.dash / 50;
          this.x += (this.dashX - this.x) * 0.08;
          this.y = this.ty + Math.sin(Math.min(1, k) * Math.PI / 2) * 150;
          if (this.dash % 12 === 0) ring(this.x, this.y, 10, 0.9, "dot", "#ffd23f", t);
          return;
        }
        this.x = W / 2 + Math.sin(t / 70) * 70;
        this.y = this.ty + Math.sin(t / 35) * 14;
        if (t % (this.phase === 1 ? 36 : 30) === 0) aimed(this.x + 12, this.y - 4, this.phase === 1 ? 3 : 5, 0.28, 2, "egg", "#fff2c0");
        if (t % 150 === 75) {
          say(L.t("quack"), this.x, this.y - 40, "#ffd23f", 16, 50);
          ring(this.x, this.y, 22, 1.2, "dot", "#ffd23f", t);
          ring(this.x, this.y, 22, 0.9, "dot", "#ff8a1f", t + 0.14);
          P.sound.beep(520, 0.12, { slide: 300, vol: 0.06, type: "sawtooth" });
          P.sound.beep(480, 0.14, { slide: 260, vol: 0.06, type: "sawtooth", delay: 0.13 });
        }
        if (this.phase === 2) {
          if (t % 9 === 0) eb.push({ x: rand(4, W - 4), y: -4, vx: 0, vy: 1.05, kind: "feather", color: "#ffffff", r: RAD.feather, g: false, sway: rand(0, TAU) });
          if (t % 320 === 200) { this.warn = 45; P.sound.beep(880, 0.4, { vol: 0.03, type: "triangle" }); }
          if (this.warn) { this.warn--; if (!this.warn) { this.dash = 90; this.dashX = pl.x; } }
        }
      },
      draw() {
        if (this.warn && Math.floor(this.warn / 5) % 2) ctx.globalAlpha = 0.5;
        ctx.save();
        ctx.translate(Math.round(this.x), Math.round(this.y));
        if (pl.x < this.x) { ctx.scale(-1, 1); }
        ctx.drawImage(DUCK, -36, -32, 72, 60);
        if (this.flash && tick % 8 < 2) { ctx.globalAlpha = 0.45; ctx.drawImage(DUCK_HIT, -36, -32, 72, 60); }
        ctx.restore();
        ctx.globalAlpha = 1;
      },
    });
  }
  const LOGO_COLORS = ["#ff5a4a", "#ffd23f", "#4ad06a", "#4aa8ff", "#c070ff", "#ff8a1f"];

  function drawWindow(x, y, w, h, title, flash) {
    ctx.fillStyle = "#0a3fb0"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = flash ? "#fff" : "#2a7cf9"; ctx.fillRect(x + 1, y + 1, w - 2, 11);
    ctx.fillStyle = "#ece9d8"; ctx.fillRect(x + 2, y + 12, w - 4, h - 14);
    ctx.fillStyle = "#e2552f"; ctx.fillRect(x + w - 11, y + 2, 9, 9);
    ctx.fillStyle = "#fff"; ctx.fillRect(x + w - 9, y + 4, 1, 1); ctx.fillRect(x + w - 5, y + 4, 1, 1); ctx.fillRect(x + w - 8, y + 5, 3, 3); ctx.fillRect(x + w - 9, y + 8, 1, 1); ctx.fillRect(x + w - 5, y + 8, 1, 1);
    P.text(ctx, title, x + 4, y + 3, { color: "#fff", shadow: false, size: 8 });
  }

  /* =========================================================
     Girdi
     ========================================================= */
  const keys = {};
  const touch = { id: null, sx: 0, sy: 0, px: 0, py: 0 };
  let useMouse = false;
  addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) e.preventDefault();
    keys[e.key.toLowerCase()] = true;
    if (e.repeat) return;
    if (e.key === "m" || e.key === "M") P.sound.toggle();
    if (e.key === "p" || e.key === "P" || e.key === "Escape") togglePause();
    else if ((e.key === " " || e.key === "Enter") && (mode === "menu" || mode === "over" || mode === "win")) begin();
    else if ((e.key === " " || e.key === "Enter") && mode === "paused") togglePause();
    if (e.key.startsWith("Arrow")) useMouse = false;
  });
  addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });
  canvas.addEventListener("pointermove", (e) => {
    const p = scr.toLogical(e.clientX, e.clientY);
    if (e.pointerType === "mouse") { useMouse = true; pl.tx = p.x; pl.ty = p.y; }
    else if (touch.id === e.pointerId) {
      pl.tx = touch.px + (p.x - touch.sx) * 1.35;
      pl.ty = touch.py + (p.y - touch.sy) * 1.35;
    }
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (mode === "menu" || mode === "over" || mode === "win") { begin(); }
    else if (mode === "paused") { togglePause(); }
    const p = scr.toLogical(e.clientX, e.clientY);
    if (e.pointerType === "mouse") { useMouse = true; pl.tx = p.x; pl.ty = p.y; }
    else {
      useMouse = false;
      touch.id = e.pointerId; touch.sx = p.x; touch.sy = p.y; touch.px = pl.x; touch.py = pl.y;
      pl.tx = pl.x; pl.ty = pl.y;
      try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
    }
  });
  const endTouch = (e) => { if (touch.id === e.pointerId) touch.id = null; };
  canvas.addEventListener("pointerup", endTouch);
  canvas.addEventListener("pointercancel", endTouch);
  addEventListener("blur", () => { if (mode !== "menu" && mode !== "over" && mode !== "win" && mode !== "paused") togglePause(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && mode !== "paused" && ["intro", "play", "clear"].includes(mode)) togglePause(); });

  // test için: ?asama=3 doğrudan 3. patrondan başlatır
  const START_STAGE = clamp((+(new URLSearchParams(location.search).get("asama")) || 1) - 1, 0, 3);
  function begin() {
    reset();
    stage = START_STAGE; pl.power = 1 + Math.min(2, stage);
    nextStage();
    P.sound.tune([262, 330, 392, 523], 0.07, { vol: 0.04 });
  }
  function nextStage() {
    mode = "intro"; timer = 150; stageHit = false;
    eb = []; minions = [];
    boss = makeBoss(stage);
  }
  function togglePause() {
    if (mode === "paused") { mode = prevMode; return; }
    if (["intro", "play", "clear"].includes(mode)) { prevMode = mode; mode = "paused"; }
  }

  /* =========================================================
     Güncelle
     ========================================================= */
  function movePlayer() {
    if (!useMouse && touch.id == null) {
      const sp = keys.shift ? 1.1 : 2.5;
      if (keys.arrowleft || keys.a) pl.tx = pl.x - sp;
      else if (keys.arrowright || keys.d) pl.tx = pl.x + sp;
      else pl.tx = pl.x;
      if (keys.arrowup || keys.w) pl.ty = pl.y - sp;
      else if (keys.arrowdown || keys.s) pl.ty = pl.y + sp;
      else pl.ty = pl.y;
    }
    pl.tx = clamp(pl.tx, 2, W - 8); pl.ty = clamp(pl.ty, 2, H - 14);
    const dx = pl.tx - pl.x, dy = pl.ty - pl.y, d = Math.hypot(dx, dy), max = 7;
    if (d > max) { pl.x += (dx / d) * max; pl.y += (dy / d) * max; } else { pl.x = pl.tx; pl.y = pl.ty; }
  }

  function playerFire() {
    if (--pl.fire > 0) return;
    pl.fire = 5;
    const x = pl.x + 3, y = pl.y - 2;
    if (pl.power === 1) pb.push({ x, y, vx: 0, vy: -7 });
    else { pb.push({ x: x - 3, y: y + 2, vx: 0, vy: -7 }); pb.push({ x: x + 3, y: y + 2, vx: 0, vy: -7 }); }
    if (pl.power >= 3) { pb.push({ x: x - 4, y, vx: -1.2, vy: -6.6 }); pb.push({ x: x + 4, y, vx: 1.2, vy: -6.6 }); }
  }

  function hurt() {
    if (pl.inv) return;
    pl.lives--; pl.inv = 120; shake = 14; stageHit = true;
    sfx.hurt();
    boom(pl.x, pl.y, 26, ["#fff", "#ff5a4a", "#ffd23f"], 2.5);
    eb = eb.filter((b) => Math.hypot(b.x - pl.x, b.y - pl.y) > 48);
    if (pl.lives <= 0) {
      mode = "over";
      const prev = P.best(BEST_KEY); P.best(BEST_KEY, score); newBest = score > prev;
      P.sound.tune([392, 330, 262, 196, 131], 0.14, { vol: 0.045, type: "triangle" });
    }
  }

  function update() {
    tick++;
    for (const t of texts) { t.life--; t.y -= 0.3; }
    texts = texts.filter((t) => t.life > 0);
    for (const p of fx) { p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; p.life--; }
    fx = fx.filter((p) => p.life > 0);
    if (shake) shake--;
    if (mode === "menu") { menuDemo(); return; }
    if (mode === "paused" || mode === "over" || mode === "win") return;

    frames++;
    movePlayer();
    if (pl.inv) pl.inv--;
    playerFire();

    // oyuncu mermileri
    for (const b of pb) { b.x += b.vx; b.y += b.vy; }
    pb = pb.filter((b) => b.y > -6 && b.x > -6 && b.x < W + 6);

    if (mode === "intro") {
      timer--;
      boss.t++;
      if (boss.ty != null) boss.y += (boss.ty - boss.y) * 0.05;
      if (boss.logos) for (const l of boss.logos) { l.y += (40 - l.y) * 0.05; }
      if (timer <= 0) { mode = "play"; boss.enter = 0; boss.t = 0; }
      return;
    }

    if (mode === "clear") {
      timer--;
      if (timer % 8 === 0 && timer > 40) { boom(rand(40, 200), rand(30, 140), 10, ["#fff", "#ffd23f", "#ff8a1f"], 2.4); sfx.small(); }
      if (timer <= 0) {
        stage++;
        if (stage >= 4) {
          mode = "win";
          score += pl.lives * 1500;
          const prev = P.best(BEST_KEY); P.best(BEST_KEY, score); newBest = score > prev;
          P.sound.tune([523, 659, 784, 1047, 784, 1047, 1319], 0.1, { vol: 0.045 });
        } else nextStage();
      }
      return;
    }

    // patron
    boss.t++;
    if (boss.flash) boss.flash--;
    boss.update();
    if (boss.phase === 1 && boss.hp <= boss.max / 2) {
      boss.phase = 2; boss.t = 1;
      for (const b of eb) boom(b.x, b.y, 1, ["#ffd23f"], 0.6);
      score += eb.length * 2; eb = [];
      say(L.t("rage"), W / 2, 150, "#ff5a4a", 16, 90);
      shake = 10; sfx.rage();
      if (boss.rage) boss.rage();
    }
    for (const b of pb) {
      if (b.hit) continue;
      if (boss.hit(b.x, b.y)) { b.hit = true; boss.hp--; boss.flash = 3; score += 10; sfx.hit(); if (Math.random() < 0.3) fx.push({ x: b.x, y: b.y, vx: rand(-1, 1), vy: rand(-1, 0.5), life: 12, c: "#fff", s: 1 }); continue; }
      for (const m of minions) {
        if (b.x > m.x && b.x < m.x + m.w && b.y > m.y && b.y < m.y + m.h) { b.hit = true; m.hp--; m.flash = 3; sfx.hit(); break; }
      }
    }
    pb = pb.filter((b) => !b.hit);
    if (!pl.inv && boss.touch(pl.x, pl.y)) hurt();

    // küçük hata pencereleri
    for (const m of minions) {
      m.t++; if (m.flash) m.flash--;
      m.y += (m.ty - m.y) * 0.03; m.x += Math.sin(m.t / 30) * 0.4;
      if (m.t > 50 && m.t % 70 === 0) aimed(m.x + m.w / 2, m.y + m.h, boss.phase === 1 ? 1 : 3, 0.25, 1.6, "dot", "#ff5a4a");
      if (m.hp <= 0) { m.dead = true; score += 150; boom(m.x + m.w / 2, m.y + m.h / 2, 18, ["#2a7cf9", "#fff", "#ece9d8"]); sfx.small(); }
      if (!pl.inv && pl.x > m.x && pl.x < m.x + m.w && pl.y > m.y && pl.y < m.y + m.h) hurt();
    }
    minions = minions.filter((m) => !m.dead);

    // düşman mermileri
    for (const b of eb) {
      if (b.sway != null) { b.sway += 0.06; b.vx = Math.sin(b.sway) * 0.6; }
      b.x += b.vx; b.y += b.vy;
      const d = Math.hypot(b.x - pl.x, b.y - pl.y);
      if (d < b.r + 1.2) { if (!pl.inv) { hurt(); b.dead = true; } }
      else if (!b.g && d < b.r + 8 && !pl.inv) { b.g = true; score += 5; sfx.graze(); fx.push({ x: pl.x, y: pl.y, vx: rand(-1, 1), vy: rand(-1, 1), life: 14, c: "#9fe8ff", s: 1 }); }
    }
    eb = eb.filter((b) => !b.dead && b.x > -10 && b.x < W + 10 && b.y > -14 && b.y < H + 10);

    if (boss.hp <= 0) defeat();
  }

  function defeat() {
    const bx = boss.x != null ? (boss.w ? boss.x + boss.w / 2 : boss.x) : W / 2;
    const by = boss.y != null ? (boss.h ? boss.y + boss.h / 2 : boss.y) : 60;
    boom(bx, by, 60, ["#fff", "#ffd23f", "#ff8a1f", "#ff5a4a"], 3.2);
    sfx.boom(); shake = 22;
    eb = []; minions = [];
    const bonus = 1000 * (stage + 1);
    score += bonus;
    say(`${L.t(boss.name)} ${L.t("down")}`, W / 2, 130, "#ffd23f", 8, 140);
    say(`+${bonus}`, W / 2, 144, "#fff", 8, 140);
    if (!stageHit) { score += 2000; say(`${L.t("nohit")} +2000`, W / 2, 158, "#8fe07a", 8, 140); }
    if (stage < 3) {
      if (pl.power < 3) { pl.power++; say(L.t("power"), W / 2, 172, "#9fe8ff", 8, 140); }
      if (pl.lives < 3) { pl.lives++; say(L.t("heal"), W / 2, 186, "#ff5a4a", 8, 140); }
    }
    boss.dead = true;
    mode = "clear"; timer = 150;
  }

  // menüde arkada zıplayan logo
  const demo = { x: 30, y: 40, vx: 0.7, vy: 0.55, c: 0 };
  function menuDemo() {
    demo.x += demo.vx; demo.y += demo.vy;
    if (demo.x < 0 || demo.x > W - 60) { demo.vx *= -1; demo.c = (demo.c + 1) % LOGO_COLORS.length; }
    if (demo.y < 0 || demo.y > H - 20) { demo.vy *= -1; demo.c = (demo.c + 1) % LOGO_COLORS.length; }
  }

  /* =========================================================
     Çiz
     ========================================================= */
  // düz arka plan: hareketli yıldızlar mermilerle karışıyordu
  function drawBg(bg) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  }

  function drawHUD() {
    P.text(ctx, String(score), 4, 4, { color: "#fff" });
    for (let i = 0; i < 3; i++) ctx.drawImage(i < pl.lives ? HEART : HEART_OFF, W - 28 + i * 8, 4);
    if (boss && !boss.dead && mode !== "intro") {
      const w = W - 16, f = Math.max(0, boss.hp / boss.max);
      ctx.fillStyle = "#222a44"; ctx.fillRect(8, 15, w, 4);
      ctx.fillStyle = boss.phase === 1 ? "#ffd23f" : "#ff5a4a"; ctx.fillRect(8, 15, Math.round(w * f), 4);
      ctx.fillStyle = "#fff"; ctx.fillRect(8 + Math.round(w / 2), 14, 1, 6);
      P.text(ctx, L.t(boss.name), 8, 22, { color: "#c9d4ea", size: 8 });
    }
  }

  function panel(x, y, w, h) {
    ctx.fillStyle = "rgba(4,10,30,.88)"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#2a7cf9"; ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h - 1, w, 1); ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h);
  }
  function blink(str, y, color = "#ffd23f") { if (Math.floor(tick / 30) % 2 === 0) P.text(ctx, str, W / 2, y, { align: "center", color }); }

  function drawMenu() {
    const x = Math.round(demo.x), y = Math.round(demo.y), c = LOGO_COLORS[demo.c];
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = c; ctx.fillRect(x, y, 60, 20); ctx.fillStyle = "#000"; ctx.fillRect(x + 2, y + 2, 56, 16);
    P.text(ctx, "DUCK", x + 6, y + 6, { color: c, shadow: false }); P.text(ctx, "OS", x + 40, y + 6, { color: "#fff", shadow: false });
    ctx.globalAlpha = 1;
    panel(10, 54, W - 20, 196);
    P.text(ctx, L.t("title"), W / 2, 66, { size: 16, align: "center", color: "#ffd23f", shadow: "#a82a1e" });
    P.text(ctx, L.t("title2"), W / 2, 86, { size: 16, align: "center", color: "#ffd23f", shadow: "#a82a1e" });
    ctx.drawImage(CURSOR, W / 2 - 4, 110);
    const lines = [[L.t("m1"), "#fff"], [L.t("m2"), "#c9d4ea"], [L.t("m3"), "#c9d4ea"]];
    lines.forEach(([s, col], i) => P.text(ctx, s, W / 2, 130 + i * 11, { align: "center", color: col }));
    const w4 = P.wrap(ctx, L.t(TOUCH ? "m4t" : "m4"), W - 36);
    w4.forEach((s, i) => P.text(ctx, s, W / 2, 168 + i * 10, { align: "center", color: "#9fe8ff" }));
    P.wrap(ctx, L.t("m5"), W - 36).forEach((s, i) => P.text(ctx, s, W / 2, 171 + (w4.length + i) * 10, { align: "center", color: "#ff8a7a" }));
    blink(L.t("start"), 214);
    P.text(ctx, L.t("keys"), W / 2, 232, { align: "center", color: "#55607a" });
    const best = P.best(BEST_KEY);
    if (best) P.text(ctx, `${L.t("best")}: ${best}`, W / 2, 262, { align: "center", color: "#c9d4ea" });
  }

  function drawEnd(win) {
    panel(16, 92, W - 32, 128);
    P.text(ctx, win ? L.t("win") : L.t("over"), W / 2, 106, { align: "center", color: win ? "#8fe07a" : "#ff5a4a" });
    P.text(ctx, `${L.t("stage")}: ${Math.min(stage + 1, 4)}/4`, W / 2, 128, { align: "center" });
    P.text(ctx, `${L.t("score")}: ${score}`, W / 2, 142, { align: "center" });
    const sec = Math.floor(frames / 60);
    P.text(ctx, `${L.t("time")}: ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`, W / 2, 156, { align: "center", color: "#c9d4ea" });
    P.text(ctx, newBest ? L.t("newBest") : `${L.t("best")}: ${P.best(BEST_KEY)}`, W / 2, 172, { align: "center", color: newBest ? "#8fe07a" : "#c9d4ea" });
    blink(L.t("again"), 198);
  }

  function draw() {
    ctx.imageSmoothingEnabled = false;
    ctx.save();
    if (shake) ctx.translate(Math.round(rand(-shake, shake) / 4), Math.round(rand(-shake, shake) / 4));
    drawBg(boss && mode !== "menu" ? boss.bg : "#02040c");
    canvas.classList.toggle("playing", ["intro", "play", "clear"].includes(mode));

    if (mode === "menu") { drawMenu(); ctx.restore(); return; }

    // oyuncu mermileri
    ctx.fillStyle = "#9fe8ff";
    for (const b of pb) ctx.fillRect(Math.round(b.x), Math.round(b.y), 1, 4);
    if (boss && !boss.dead) boss.draw();
    for (const m of minions) {
      drawWindow(Math.round(m.x), Math.round(m.y), m.w, m.h, "!", m.flash && tick % 6 < 2);
      ctx.fillStyle = "#e8483a"; ctx.fillRect(Math.round(m.x) + 11, Math.round(m.y) + 14, 8, 6);
    }
    for (const b of eb) {
      const s = bulletSprite(b.kind, b.color);
      ctx.drawImage(s, Math.round(b.x - s.width / 2), Math.round(b.y - s.height / 2));
    }
    for (const p of fx) {
      ctx.globalAlpha = Math.min(1, p.life / 20);
      ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    ctx.globalAlpha = 1;
    // oyuncu
    if (mode !== "over" && (!pl.inv || Math.floor(pl.inv / 4) % 2 === 0)) {
      ctx.drawImage(pl.inv ? CURSOR_HIT : CURSOR, Math.round(pl.x), Math.round(pl.y));
      ctx.fillStyle = "#ff5a4a"; ctx.fillRect(Math.round(pl.x), Math.round(pl.y), 1, 1);
    }
    for (const t of texts) {
      ctx.globalAlpha = Math.min(1, t.life / 20);
      P.text(ctx, t.str, t.x, t.y, { align: "center", color: t.color, size: t.size });
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    drawHUD();
    if (mode === "intro") {
      panel(30, 120, W - 60, 48);
      P.text(ctx, `${L.t("stage")} ${stage + 1}/4`, W / 2, 130, { align: "center", color: "#c9d4ea" });
      P.text(ctx, L.t(boss.name), W / 2, 146, { align: "center", color: "#ffd23f" });
    }
    if (mode === "over") drawEnd(false);
    if (mode === "win") drawEnd(true);
    if (mode === "paused") {
      panel(40, 136, W - 80, 44);
      P.text(ctx, L.t("paused"), W / 2, 146, { align: "center", color: "#ffd23f" });
      P.text(ctx, L.t("resume"), W / 2, 162, { align: "center", color: "#c9d4ea" });
    }
  }

  P.fontReady().then(() => P.loop(update, draw));
})();
