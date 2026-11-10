/* =========================================================
   KAYAK — Kaan pistte
   Yokuş aşağı piksel kayak. Fare / ← → ile yön, ↓ düz in,
   ↑ fren, BOŞLUK (ya da tık) zıpla, havada BOŞLUK numara.
   Slalom kapılarından geç (kombo), ağaç, kaya ve kardan
   adamlardan kaç, rampadan uç, sıcak çikolata topla.
   ========================================================= */
(function () {
  "use strict";
  const P = window.Piksel;
  const { clamp, rand, pick } = P;

  const L = P.i18n({
    tr: {
      title: "KAYAK", sub: "Kaan pistte!",
      h1: "Fare / ← →  yön", h2: "↓ düz in   ↑ fren", h3: "BOŞLUK / tık  zıpla", h4: "Havada BOŞLUK  numara!",
      h5: "Kapılardan geç!",
      t1: "Gideceğin yere dokun", t2: "Üstüne dokun: fren", t3: "Kısa dokun: zıpla", t4: "Havada dokun: numara!",
      start: "Başlamak için tıkla", startKey: "ya da BOŞLUK",
      best: "Rekor", score: "Puan", dist: "Mesafe",
      over: "PİST BİTTİ", again: "Tekrar için tıkla",
      paused: "DURAKLATILDI", resume: "Devam için tıkla",
      gate: "KAPI", miss: "Kapı kaçtı", crash: "Ah!", trick: "NUMARA", land: "Düştün!",
      cocoa: "Sıcak çikolata!", km: "km", newBest: "YENİ REKOR!", muteOn: "M: ses açık", muteOff: "M: ses kapalı", ice: "Buz!",
    },
    en: {
      title: "DOWNHILL", sub: "Kaan hits the slopes!",
      h1: "Mouse / ← →  steer", h2: "↓ go straight   ↑ brake", h3: "SPACE / click  jump", h4: "SPACE in the air  trick!",
      h5: "Ride the gates!",
      t1: "Touch where to ski", t2: "Touch above: brake", t3: "Tap: jump", t4: "Tap in the air: trick!",
      start: "Click to start", startKey: "or press SPACE",
      best: "Best", score: "Score", dist: "Distance",
      over: "Run over!", again: "Click to ride again",
      paused: "PAUSED", resume: "Click to resume",
      gate: "GATE", miss: "Missed gate", crash: "Ouch!", trick: "TRICK", land: "Wiped out!",
      cocoa: "Hot cocoa!", km: "km", newBest: "New best!", muteOn: "M: sound on", muteOff: "M: sound off", ice: "Ice!",
    },
  }, () => { document.title = L.t("title") + " · Kaan Kara"; });
  document.title = L.t("title") + " · Kaan Kara";

  const canvas = document.getElementById("game");
  const scr = P.screen(canvas, { w: 256, minH: 200, maxH: 560 });
  const TOUCH = matchMedia("(pointer: coarse)").matches;
  const ctx = scr.ctx;

  /* ---------- sprite'lar ---------- */
  const PAL = {
    k: "#1f2a33", F: "#1f5e3a", g: "#2f8a4f", l: "#5cbf72", w: "#ffffff", W: "#c9dcee",
    t: "#7a4e2b", T: "#4a2e17", s: "#9aa4b0", S: "#626c78", R: "#e8483a", d: "#a82a1e",
    B: "#2a5cd6", b: "#8fc3ef", n: "#22305a", h: "#5a3a22", o: "#ff9a1f", c: "#7a4a2a", y: "#ffd23f",
    j: "#f3c49b",
  };
  const S = (rows) => P.sprite(rows, PAL);
  const SPR = {
    body: S([
      "....w....",
      "..RRRRR..",
      ".RRRRRRR.",
      ".hkoookh.",
      "..jjjjj..",
      ".dRRwRRd.",
      "dRRRwRRRd",
      "kRRRwRRRk",
      ".RRRRRRR.",
      "..nnnnn..",
      "..nn.nn..",
      "..nn.nn..",
      "..kk.kk..",
    ]),
    tree: S([
      "......w......",
      ".....wlw.....",
      ".....glg.....",
      "....wgggw....",
      "....gglgg....",
      "...gggggFg...",
      "...wwgggww...",
      "..gglgggggF..",
      "..gggggggFF..",
      "..wwwgggwww..",
      ".gglggggggFF.",
      ".ggggggggFFF.",
      "gggggggggFFFF",
      "wwwgggggggwww",
      ".....ttT.....",
      ".....ttT.....",
      "....WWWWW....",
    ]),
    pine: S([
      "....w....",
      "...wgw...",
      "...ggg...",
      "..wgggw..",
      "..gglgF..",
      ".gggggFF.",
      ".wwgggww.",
      "ggglgggFF",
      "wwgggggww",
      "....t....",
      "...WWW...",
    ]),
    rock: S([
      "...wwww....",
      "..wwwwssk..",
      ".ksssssSSk.",
      "kssssSSSSSk",
      "kSSSSSSSSSk",
      ".WWWWWWWWW.",
    ]),
    stump: S([
      "..wwwww..",
      ".kttttTk.",
      ".ktttTTk.",
      ".ktttTTk.",
      "kttttTTTk",
      ".WWWWWWW.",
    ]),
    snowman: S([
      "...kkkkk...",
      "...kkkkk...",
      "..kkkkkkk..",
      "...wwwwwW..",
      "..wwkwkwW..",
      "..wwwwooo..",
      "...wwwwW...",
      "..RRRRRRR..",
      ".wwwwRwwwW.",
      "Wwwwwkwwwww",
      "WwwwwwwwwwW",
      "WwwwwkwwwwW",
      ".WwwwwwwwW.",
      "..WWWWWWW..",
    ]),
    flagR: S(["kRRR.", "kRRRR", "kRRR.", "k....", "k....", "k....", "k....", "k....", "k....", "k....", "W...."]),
    flagB: S([".BBBk", "BBBBk", ".BBBk", "....k", "....k", "....k", "....k", "....k", "....k", "....k", "....W"]),
    ramp: S([
      ".bbbbbbbbbbbbbbb.",
      "bwwwwwwwwwwwwwwwb",
      "bwwBBwwwBBwwwBBwb",
      "bwwwBwwwwBwwwwBwb",
      "bbbbbbbbbbbbbbbbb",
      "BBBBBBBBBBBBBBBBB",
      ".nnnnnnnnnnnnnnn.",
    ]),
    mogul: S([
      "....WWWWW....",
      "..WwwwwwwWW..",
      ".WwwwwwwwwWW.",
      "WwwwwwwwwWWWW",
      ".WWWWWWWWWWW.",
    ]),
    cocoa: S([
      "..w.w..",
      ".w.w...",
      "kccck..",
      "kRRRkkk",
      "kRwRk.k",
      "kRRRkkk",
      "kRRRk..",
      ".kkk...",
    ]),
    heart: S([".RR.RR.", "RRRRRRR", "RRRRRRR", ".RRRRR.", "..RRR..", "...R..."]),
    heartOff: P.sprite([".kk.kk.", "kWWkWWk", "kWWWWWk", ".kWWWk.", "..kWk..", "...k..."], PAL),
  };

  /* zemin dokusu */
  const tile = document.createElement("canvas");
  tile.width = 64; tile.height = 64;
  {
    const x = tile.getContext("2d");
    x.fillStyle = "#f4f9ff"; x.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 90; i++) { x.fillStyle = Math.random() < 0.5 ? "#e6f0fa" : "#ffffff"; x.fillRect((Math.random() * 64) | 0, (Math.random() * 64) | 0, 1, 1); }
    for (let i = 0; i < 6; i++) { x.fillStyle = "#dbe8f5"; x.fillRect((Math.random() * 60) | 0, (Math.random() * 64) | 0, 3, 1); }
  }

  /* ---------- durum ---------- */
  const DIRS = [-90, -62, -32, 0, 32, 62, 90];
  const BEST_KEY = "kayak-rekor";
  let mode = "menu"; // menu | play | over | paused
  let K, items, gates, tracks, texts, flakes, cam, nextY, nextGate, tick, newBest;

  function reset() {
    K = { x: 128, y: 0, dir: 3, speed: 0, z: 0, vz: 0, air: false, trick: 0, tricks: 0, spin: 0, crash: 0, inv: 0, lives: 3, ice: 0, score: 0, combo: 0, bob: 0 };
    items = []; gates = []; tracks = []; texts = [];
    cam = -scr.H * 0.3;
    nextY = 120; nextGate = 220; tick = 0; newBest = false;
    while (nextY < cam + scr.H + 80) spawnRow();
  }
  flakes = Array.from({ length: 70 }, () => ({ x: rand(0, 256), y: rand(0, 460), v: rand(0.2, 0.6), s: Math.random() < 0.25 ? 2 : 1 }));

  const meters = () => Math.max(0, Math.floor(K.y / 10));
  const kmh = () => Math.round(K.speed * 60 / 10 * 3.6);

  /* ---------- pist üretimi ---------- */
  const TYPES = [
    ["tree", 34], ["pine", 18], ["rock", 12], ["stump", 6], ["snowman", 4], ["mogul", 9], ["ice", 4], ["ramp", 6], ["cocoa", 7],
  ];
  const TOTAL = TYPES.reduce((a, t) => a + t[1], 0);
  function pickType() {
    let r = Math.random() * TOTAL;
    for (const [n, w] of TYPES) { if ((r -= w) < 0) return n; }
    return "tree";
  }
  function blockedByGate(x, y) {
    return gates.some((g) => Math.abs(g.y - y) < 18 && x > g.x1 - 10 && x < g.x2 + 10);
  }
  function spawnRow() {
    const m = nextY / 10;
    const gap = Math.max(11, 30 - m / 70);
    if (nextY >= nextGate) {
      const w = Math.max(30, 54 - m / 90);
      const cx = rand(28 + w / 2, 228 - w / 2);
      gates.push({ x1: cx - w / 2, x2: cx + w / 2, y: nextGate, done: false });
      nextGate += rand(200, 320);
    }
    const n = Math.random() < Math.min(0.6, m / 1500) ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const type = pickType();
      const x = rand(6, 250), y = nextY + rand(-4, 4);
      if (blockedByGate(x, y)) continue;
      if (items.some((o) => Math.abs(o.y - y) < 12 && Math.abs(o.x - x) < 16)) continue;
      if (type === "mogul") {
        for (let j = 0; j < 3; j++) items.push({ type, x: x + j * 9 - 9, y: y + (j % 2) * 6 });
      } else if (type === "ice") {
        items.push({ type, x, y, w: rand(18, 30) | 0, h: rand(7, 11) | 0 });
      } else items.push({ type, x, y });
    }
    // kenarlarda orman
    if (Math.random() < 0.35) items.push({ type: Math.random() < 0.6 ? "tree" : "pine", x: Math.random() < 0.5 ? rand(-2, 10) : rand(246, 258), y: nextY + rand(0, 8) });
    nextY += rand(gap * 0.6, gap * 1.4);
  }

  /* ---------- girdi ---------- */
  const keys = {};
  const ptr = { on: false, x: 0, y: 0, down: 0, sx: 0, sy: 0, moved: false };
  addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Spacebar"].includes(e.key)) e.preventDefault();
    if (e.repeat) return;
    keys[e.key] = true;
    if (e.key === "m" || e.key === "M") P.sound.toggle();
    if (mode === "menu" || mode === "over") { if (e.key === " " || e.key === "Enter") begin(); return; }
    if (e.key === "p" || e.key === "P" || e.key === "Escape") { togglePause(); return; }
    if (mode === "paused") { if (e.key === " " || e.key === "Enter") togglePause(); return; }
    if (mode !== "play" || K.crash) return;
    ptr.on = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") K.dir = Math.max(0, K.dir - 1);
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") K.dir = Math.min(6, K.dir + 1);
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") K.dir = 3;
    if (e.key === " " || e.key === "Spacebar") jump();
  });
  addEventListener("keyup", (e) => { keys[e.key] = false; });

  canvas.addEventListener("pointermove", (e) => {
    const p = scr.toLogical(e.clientX, e.clientY);
    ptr.x = p.x; ptr.y = p.y;
    if (e.pointerType === "mouse" || ptr.down) ptr.on = true;
    if (ptr.down && Math.hypot(p.x - ptr.sx, p.y - ptr.sy) > 6) ptr.moved = true;
  });
  canvas.addEventListener("pointerdown", (e) => {
    const p = scr.toLogical(e.clientX, e.clientY);
    ptr.x = p.x; ptr.y = p.y; ptr.sx = p.x; ptr.sy = p.y; ptr.down = performance.now(); ptr.moved = false;
    if (mode === "menu" || mode === "over") { begin(); return; }
    if (mode === "paused") { togglePause(); return; }
    if (e.pointerType === "mouse") { ptr.on = true; jump(); }
    else ptr.on = true;
  });
  addEventListener("pointerup", (e) => {
    if (e.pointerType !== "mouse" && ptr.down && !ptr.moved && performance.now() - ptr.down < 220 && mode === "play") jump();
    ptr.down = 0;
    if (e.pointerType !== "mouse") ptr.on = false;
  });
  addEventListener("blur", () => { if (mode === "play") togglePause(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden && mode === "play") togglePause(); });

  function begin() {
    reset();
    mode = "play";
    K.speed = 0.6;
    P.sound.tune([523, 659, 784], 0.07, { vol: 0.04 });
  }
  function togglePause() {
    if (mode === "play") mode = "paused";
    else if (mode === "paused") mode = "play";
  }

  function steerFromPointer() {
    // skier screen position
    const sx = K.x, sy = K.y - cam;
    const dx = ptr.x - sx, dy = ptr.y - sy;
    if (dy < 4) { K.dir = dx < 0 ? 0 : 6; return; }
    const ang = (Math.atan2(dx, dy) * 180) / Math.PI;
    let best = 3, bd = 999;
    DIRS.forEach((d, i) => { if (Math.abs(d - ang) < bd) { bd = Math.abs(d - ang); best = i; } });
    K.dir = best;
  }

  function jump() {
    if (mode !== "play" || K.crash) return;
    if (!K.air) {
      K.air = true; K.vz = 1.5; K.tricks = 0;
      P.sound.beep(440, 0.08, { slide: 700, vol: 0.04 });
    } else if (!K.trick && K.z > 4) {
      K.trick = 26;
      P.sound.beep(660, 0.12, { slide: 1200, vol: 0.04, type: "triangle" });
    }
  }

  function say(str, color = "#fff", x = K.x, y = K.y - 22) { texts.push({ str, color, x, y, life: 60 }); }

  function crash() {
    if (K.inv || K.crash) return;
    K.crash = 54; K.speed = 0; K.air = false; K.z = 0; K.trick = 0; K.combo = 0;
    say(L.t("crash"), "#e8483a");
    P.sound.noise(0.35, { vol: 0.16, freq: 1200 });
    P.sound.beep(220, 0.25, { slide: 80, vol: 0.05 });
  }

  /* ---------- güncelle ---------- */
  function update() {
    tick++;
    for (const f of flakes) {
      f.y += f.v - (mode === "play" ? K.speed * 0.25 : 0);
      f.x += Math.sin((tick + f.y) / 40) * 0.15;
      if (f.y > scr.H + 2) { f.y = -2; f.x = rand(0, 256); }
      if (f.y < -3) { f.y = scr.H + 1; f.x = rand(0, 256); }
    }
    for (const t of texts) { t.y -= 0.35; t.life--; }
    texts = texts.filter((t) => t.life > 0);
    if (mode !== "play") return;

    if (K.crash) {
      K.crash--;
      if (K.crash === 0) {
        K.lives--;
        if (K.lives <= 0) return gameOver();
        K.inv = 100; K.dir = 3; K.speed = 0.4;
      }
      return;
    }
    if (K.inv) K.inv--;
    if (ptr.on && !K.air && !K.ice) steerFromPointer();

    const m = meters();
    const a = (DIRS[K.dir] * Math.PI) / 180;
    const top = 2.1 + Math.min(m / 700, 2.1);
    let target = Math.abs(DIRS[K.dir]) === 90 ? 0 : top * Math.pow(Math.cos(a), 1.2);
    if (keys.ArrowUp || keys.w || keys.W) target = 0;
    if (!K.air) K.speed += (target - K.speed) * (target > K.speed ? 0.014 : 0.05);
    if (K.ice) { K.ice--; K.speed = Math.min(top * 1.15, K.speed + 0.01); }

    let vx = K.speed * Math.sin(a), vy = K.speed * Math.cos(a);
    if (Math.abs(DIRS[K.dir]) === 90) { vx = Math.sign(DIRS[K.dir]) * Math.max(0.25, K.speed); vy = K.speed; }
    K.x = clamp(K.x + vx, 6, 250);
    K.y += vy;
    K.bob += K.speed;

    // hava
    if (K.air) {
      K.z += K.vz; K.vz -= 0.12;
      if (K.trick) { K.trick--; K.spin += (Math.PI * 2) / 26; if (K.trick === 0) { K.tricks++; K.spin = 0; } }
      if (K.z <= 0) {
        K.z = 0; K.air = false;
        if (K.trick) { K.trick = 0; K.spin = 0; say(L.t("land"), "#e8483a"); crash(); }
        else if (K.tricks) {
          const pts = 300 * K.tricks * (1 + K.combo);
          K.score += pts;
          say(`${L.t("trick")} ×${K.tricks}  +${pts}`, "#ffd23f");
          P.sound.tune([784, 988, 1175], 0.06, { vol: 0.04 });
        }
      }
    }

    // izler
    if (!K.air && K.speed > 0.15 && tick % 2 === 0) {
      tracks.push({ x: K.x, y: K.y, a });
      if (tracks.length > 500) tracks.shift();
    }

    // kapılar
    for (const g of gates) {
      if (g.done || K.y < g.y) continue;
      g.done = true;
      if (K.x > g.x1 + 1 && K.x < g.x2 - 1) {
        K.combo++;
        const pts = 100 * K.combo;
        K.score += pts;
        say(`${L.t("gate")} +${pts}${K.combo > 1 ? "  ×" + K.combo : ""}`, "#8fe07a", (g.x1 + g.x2) / 2, g.y - 16);
        P.sound.beep(880 + Math.min(K.combo, 8) * 60, 0.09, { vol: 0.04 });
      } else {
        if (K.combo > 0) say(L.t("miss"), "#c9dcee", (g.x1 + g.x2) / 2, g.y - 16);
        K.combo = 0;
      }
      // direklere çarpma
      if (K.z < 6 && (Math.abs(K.x - g.x1) < 2.5 || Math.abs(K.x - g.x2) < 2.5)) crash();
    }

    // engeller
    for (const o of items) {
      if (o.gone) continue;
      const dx = K.x - o.x, dy = K.y - o.y;
      if (Math.abs(dy) > 12 || Math.abs(dx) > 16) continue;
      switch (o.type) {
        case "tree": if (K.z < 9 && Math.abs(dx) < 3.5 && dy > -3 && dy < 2) crash(); break;
        case "pine": if (K.z < 7 && Math.abs(dx) < 3 && dy > -3 && dy < 2) crash(); break;
        case "snowman": if (K.z < 8 && Math.abs(dx) < 4.5 && dy > -4 && dy < 2) crash(); break;
        case "rock": if (K.z < 3 && Math.abs(dx) < 5 && dy > -4 && dy < 1) crash(); break;
        case "stump": if (K.z < 3 && Math.abs(dx) < 4 && dy > -4 && dy < 1) crash(); break;
        case "mogul":
          if (!K.air && Math.abs(dx) < 6 && Math.abs(dy) < 2.5 && !o.hit) {
            o.hit = true; K.speed *= 0.88; K.air = true; K.vz = 0.9; K.tricks = 0;
            P.sound.beep(300, 0.05, { vol: 0.03 });
          }
          break;
        case "ice":
          if (!K.air && Math.abs(dx) < o.w / 2 && Math.abs(dy) < o.h / 2 && !K.ice) { K.ice = 40; say(L.t("ice"), "#8fc3ef"); P.sound.beep(1400, 0.15, { slide: 2000, vol: 0.02, type: "triangle" }); }
          break;
        case "ramp":
          if (!K.air && Math.abs(dx) < 8 && dy > -3 && dy < 3) {
            K.air = true; K.vz = 2.3 + K.speed * 0.38; K.tricks = 0;
            P.sound.beep(330, 0.2, { slide: 900, vol: 0.05 });
          }
          break;
        case "cocoa":
          if (K.z < 6 && Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            o.gone = true; K.score += 50; say(`${L.t("cocoa")} +50`, "#ffd23f");
            P.sound.tune([988, 1319], 0.06, { vol: 0.035 });
          }
          break;
      }
    }

    // kamera ve temizlik
    cam += (K.y - scr.H * 0.3 - cam) * 0.2;
    items = items.filter((o) => o.y > cam - 30 && !o.gone);
    gates = gates.filter((g) => g.y > cam - 30);
    while (nextY < cam + scr.H + 80) spawnRow();

    // km işareti
    const km = Math.floor(m / 1000);
    if (km > 0 && km !== K.lastKm) { K.lastKm = km; say(`${km} ${L.t("km")}!`, "#ffd23f", 128, K.y - 40); P.sound.tune([523, 659, 784, 1047], 0.08, { vol: 0.04 }); }
  }

  function gameOver() {
    mode = "over";
    const total = K.score + meters();
    const prev = P.best(BEST_KEY);
    P.best(BEST_KEY, total);
    newBest = total > prev;
    P.sound.tune([523, 392, 330, 262], 0.12, { vol: 0.04, type: "triangle" });
  }

  /* ---------- çiz ---------- */
  const spr = (img, x, y) => ctx.drawImage(img, Math.round(x - img.width / 2), Math.round(y - img.height));

  function drawSkis(x, y, a, color = "#1f2a33") {
    const dx = Math.sin(a), dy = Math.cos(a), px = Math.cos(a), py = -Math.sin(a);
    for (const s of [-1, 1]) {
      const cx = x + px * 2 * s, cy = y + py * 2 * s;
      P.line(ctx, cx - dx * 6, cy - dy * 6, cx + dx * 6, cy + dy * 6, color);
      ctx.fillStyle = "#e8483a";
      ctx.fillRect(Math.round(cx + dx * 6), Math.round(cy + dy * 6), 1, 1);
    }
  }

  function drawSkier() {
    const sx = K.x, sy = K.y - cam;
    if (K.crash) {
      const r = (54 - K.crash) * 0.25;
      ctx.save();
      ctx.translate(Math.round(sx), Math.round(sy - 4));
      ctx.rotate(Math.min(r, Math.PI / 2 + 0.2) * (K.dir < 3 ? -1 : 1));
      ctx.drawImage(SPR.body, -4, -7);
      ctx.restore();
      drawSkis(sx - 6, sy + 2, 1.1);
      drawSkis(sx + 7, sy - 1, -0.6);
      return;
    }
    if (K.inv && Math.floor(K.inv / 4) % 2) return;
    const a = (DIRS[K.dir] * Math.PI) / 180;
    // gölge
    ctx.fillStyle = "rgba(60,90,130,.25)";
    const sw = Math.max(4, 10 - K.z * 0.25);
    ctx.fillRect(Math.round(sx - sw / 2), Math.round(sy), Math.round(sw), 2);
    const lift = Math.round(K.z);
    ctx.save();
    ctx.translate(0, -lift);
    if (K.trick) {
      ctx.translate(Math.round(sx), Math.round(sy - 6));
      ctx.rotate(K.spin);
      drawSkis(0, 6, 0);
      ctx.drawImage(SPR.body, -4, -7);
      ctx.restore();
      return;
    }
    drawSkis(sx, sy, a);
    const lean = Math.round(Math.sin(a) * 1.5);
    const bob = !K.air && K.speed > 0.4 ? Math.round(Math.sin(K.bob / 5) * 0.6) : 0;
    ctx.drawImage(SPR.body, Math.round(sx - 4 + lean), Math.round(sy - 12 + bob));
    // batonlar
    P.line(ctx, sx - 5 + lean, sy - 6, sx - 6 - Math.sin(a) * 3, sy + 1, "#626c78");
    P.line(ctx, sx + 5 + lean, sy - 6, sx + 6 - Math.sin(a) * 3, sy + 1, "#626c78");
    ctx.restore();
  }

  function drawItem(o) {
    const y = o.y - cam;
    switch (o.type) {
      case "ice": {
        ctx.fillStyle = "#bfe6fb";
        for (let r = 0; r < o.h; r++) {
          const k = 1 - Math.pow((r - o.h / 2) / (o.h / 2), 2);
          const half = Math.round((o.w / 2) * Math.sqrt(Math.max(0, k)));
          ctx.fillRect(Math.round(o.x - half), Math.round(y - o.h / 2 + r), half * 2, 1);
        }
        ctx.fillStyle = "#fff";
        ctx.fillRect(Math.round(o.x - o.w / 4), Math.round(y - 1), 3, 1);
        ctx.fillRect(Math.round(o.x + o.w / 6), Math.round(y + 1), 2, 1);
        break;
      }
      case "ramp": spr(SPR.ramp, o.x, y + 3); break;
      case "mogul": spr(SPR.mogul, o.x, y + 2); break;
      case "cocoa": spr(SPR.cocoa, o.x, y + 2 + Math.round(Math.sin(tick / 12))); break;
      default: spr(SPR[o.type], o.x, y + 1);
    }
  }

  function drawWorld() {
    // zemin
    const off = ((cam % 64) + 64) % 64;
    for (let ty = -off; ty < scr.H; ty += 64) for (let tx = 0; tx < scr.W; tx += 64) ctx.drawImage(tile, tx, Math.floor(ty));
    // izler
    ctx.fillStyle = "#d5e4f2";
    for (const t of tracks) {
      const y = t.y - cam;
      if (y < -2 || y > scr.H + 2) continue;
      const px = Math.cos(t.a) * 2, py = -Math.sin(t.a) * 2;
      ctx.fillRect(Math.round(t.x + px), Math.round(y + py), 1, 2);
      ctx.fillRect(Math.round(t.x - px), Math.round(y - py), 1, 2);
    }
    // yassı şeyler önce
    for (const o of items) if (o.type === "ice" || o.type === "mogul" || o.type === "ramp") drawItem(o);
    // kapılar arasında ince çizgi
    for (const g of gates) {
      const y = g.y - cam;
      if (y < -20 || y > scr.H + 20) continue;
      ctx.fillStyle = g.done ? "rgba(143,224,122,.0)" : "rgba(42,92,214,.18)";
      for (let x = g.x1 + 3; x < g.x2 - 2; x += 4) ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
    }
    // derinliğe göre sırala
    const list = [];
    for (const o of items) if (!(o.type === "ice" || o.type === "mogul" || o.type === "ramp")) list.push({ y: o.y, f: () => drawItem(o) });
    for (const g of gates) {
      list.push({ y: g.y, f: () => { spr(SPR.flagR, g.x1 + 2, g.y - cam + 1); spr(SPR.flagB, g.x2 - 2, g.y - cam + 1); } });
    }
    if (mode !== "menu") list.push({ y: K.y + (K.air ? 50 : 0.5), f: drawSkier });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) it.f();
  }

  function drawFlakes() {
    ctx.fillStyle = "#fff";
    for (const f of flakes) ctx.fillRect(Math.round(f.x), Math.round(f.y), f.s, f.s);
  }

  function panel(x, y, w, h) {
    ctx.fillStyle = "rgba(15,30,60,.82)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#8fc3ef";
    ctx.fillRect(x, y, w, 1); ctx.fillRect(x, y + h - 1, w, 1); ctx.fillRect(x, y, 1, h); ctx.fillRect(x + w - 1, y, 1, h);
  }

  function drawHUD() {
    const m = meters();
    P.text(ctx, `${m} m`, 6, 6, { color: "#22305a", shadow: "#fff" });
    P.text(ctx, `${K.score + m}`, scr.W - 6, 6, { color: "#22305a", shadow: "#fff", align: "right" });
    for (let i = 0; i < 3; i++) ctx.drawImage(i < K.lives ? SPR.heart : SPR.heartOff, 6 + i * 9, 17);
    P.text(ctx, `${kmh()} km/h`, 6, scr.H - 12, { color: "#22305a", shadow: "#fff" });
    if (K.combo > 1) P.text(ctx, `×${K.combo}`, scr.W - 6, 17, { color: "#2f8a4f", shadow: "#fff", align: "right" });
    for (const t of texts) {
      ctx.globalAlpha = Math.min(1, t.life / 20);
      P.text(ctx, t.str, t.x, t.y - cam, { color: t.color, align: "center", shadow: "#22305a" });
    }
    ctx.globalAlpha = 1;
  }

  function drawMenu() {
    const cx = scr.W / 2;
    const h = 150, y = Math.max(8, Math.round(scr.H / 2 - h / 2));
    panel(16, y, scr.W - 32, h);
    P.text(ctx, L.t("title"), cx, y + 10, { size: 16, align: "center", color: "#ffd23f", shadow: "#a82a1e" });
    P.text(ctx, L.t("sub"), cx, y + 32, { align: "center", color: "#fff" });
    ctx.drawImage(SPR.body, Math.round(cx - 4), y + 46);
    drawSkisAt(cx, y + 58);
    const lines = TOUCH ? [L.t("t1"), L.t("t2"), L.t("t3"), L.t("t4")] : [L.t("h1"), L.t("h2"), L.t("h3"), L.t("h4")];
    lines.forEach((s, i) => P.text(ctx, s, cx, y + 68 + i * 11, { align: "center", color: "#c9dcee" }));
    P.text(ctx, L.t("h5"), cx, y + 114, { align: "center", color: "#8fe07a" });
    if (Math.floor(tick / 30) % 2 === 0) P.text(ctx, L.t("start"), cx, y + 128, { align: "center", color: "#ffd23f" });
    const best = P.best(BEST_KEY);
    if (best) P.text(ctx, `${L.t("best")}: ${best}`, cx, y + h + 6, { align: "center", color: "#22305a", shadow: "#fff" });
  }
  function drawSkisAt(x, y) { drawSkis(x, y, 0); }

  function drawOver() {
    const cx = scr.W / 2, h = 104, y = Math.max(8, Math.round(scr.H / 2 - h / 2));
    panel(24, y, scr.W - 48, h);
    P.text(ctx, L.t("over"), cx, y + 10, { size: 16, align: "center", color: "#ffd23f", shadow: "#a82a1e" });
    P.text(ctx, `${L.t("dist")}: ${meters()} m`, cx, y + 34, { align: "center" });
    P.text(ctx, `${L.t("score")}: ${K.score + meters()}`, cx, y + 47, { align: "center" });
    P.text(ctx, newBest ? L.t("newBest") : `${L.t("best")}: ${P.best(BEST_KEY)}`, cx, y + 62, { align: "center", color: newBest ? "#8fe07a" : "#c9dcee" });
    if (Math.floor(tick / 30) % 2 === 0) P.text(ctx, L.t("again"), cx, y + 84, { align: "center", color: "#ffd23f" });
  }

  function draw() {
    ctx.imageSmoothingEnabled = false;
    drawWorld();
    drawFlakes();
    if (mode === "menu") drawMenu();
    else {
      drawHUD();
      if (mode === "over") drawOver();
      if (mode === "paused") {
        const cx = scr.W / 2, y = Math.round(scr.H / 2 - 22);
        panel(40, y, scr.W - 80, 44);
        P.text(ctx, L.t("paused"), cx, y + 10, { align: "center", color: "#ffd23f" });
        P.text(ctx, L.t("resume"), cx, y + 26, { align: "center", color: "#c9dcee" });
      }
    }
    P.text(ctx, L.t(P.sound.muted ? "muteOff" : "muteOn"), scr.W - 6, scr.H - 12, { color: "#22305a", shadow: "#fff", align: "right" });
  }

  /* ---------- başlat ---------- */
  reset();
  P.fontReady().then(() => P.loop(update, draw));
})();
