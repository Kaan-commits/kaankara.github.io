/* =========================================================
   Piksel oyun yardımcıları (Kayak, Ekran Koruyucu)
   · sprite(): "harf haritası"ndan küçük canvas
   · screen(): düşük çözünürlüklü canvas'ı kutuya sığdırır
   · text(): "Press Start 2P" ile piksel yazı
   · sound: WebAudio ile minik bip ve gürültüler
   · i18n(): sitenin dil seçimini (localStorage "lang") okur
   ========================================================= */
(function () {
  "use strict";
  const P = {};
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  P.clamp = clamp;
  P.rand = (a, b) => a + Math.random() * (b - a);
  P.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- sprite ---------- */
  P.sprite = (rows, pal) => {
    const h = rows.length, w = Math.max(...rows.map((r) => r.length));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const x = c.getContext("2d");
    rows.forEach((r, y) => {
      for (let i = 0; i < r.length; i++) {
        const col = pal[r[i]];
        if (col) { x.fillStyle = col; x.fillRect(i, y, 1, 1); }
      }
    });
    return c;
  };
  P.flip = (spr) => {
    const c = document.createElement("canvas");
    c.width = spr.width; c.height = spr.height;
    const x = c.getContext("2d");
    x.translate(spr.width, 0); x.scale(-1, 1); x.drawImage(spr, 0, 0);
    return c;
  };
  P.tint = (spr, color) => {
    const c = document.createElement("canvas");
    c.width = spr.width; c.height = spr.height;
    const x = c.getContext("2d");
    x.drawImage(spr, 0, 0);
    x.globalCompositeOperation = "source-in";
    x.fillStyle = color; x.fillRect(0, 0, c.width, c.height);
    return c;
  };

  /* ---------- ekran ---------- */
  // opts: w (mantıksal genişlik), h (sabit yükseklik) ya da minH/maxH (kutunun oranına göre)
  P.screen = (canvas, opts) => {
    const ctx = canvas.getContext("2d");
    const s = { W: opts.w, H: opts.h || opts.w, ctx, scale: 1 };
    function fit() {
      const box = canvas.parentElement.getBoundingClientRect();
      const bw = Math.max(1, box.width), bh = Math.max(1, box.height);
      let W = opts.w, H = opts.h;
      if (!H) H = clamp(Math.round((W * bh) / bw), opts.minH || 120, opts.maxH || 600);
      const scale = Math.min(bw / W, bh / H);
      canvas.width = W; canvas.height = H;
      canvas.style.width = Math.floor(W * scale) + "px";
      canvas.style.height = Math.floor(H * scale) + "px";
      s.W = W; s.H = H; s.scale = scale;
      ctx.imageSmoothingEnabled = false;
      if (opts.onresize) opts.onresize(s);
    }
    s.fit = fit;
    s.toLogical = (cx, cy) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((cx - r.left) / r.width) * s.W, y: ((cy - r.top) / r.height) * s.H };
    };
    addEventListener("resize", fit);
    fit();
    return s;
  };

  /* ---------- yazı ---------- */
  P.FONT = '"Press Start 2P", monospace';
  // Press Start 2P büyük İ, Ö ve Ğ'yi küçük harf gibi çiziyor: bunları I, O, G + işaret olarak elle çiz
  const FIX = { "İ": ["I", [[3, -2, 1, 1]]], "Ö": ["O", [[1, -2, 1, 1], [5, -2, 1, 1]]], "Ğ": ["G", [[2, -2, 3, 1], [1, -3, 1, 1], [5, -3, 1, 1]]] };
  const FIXRE = /[İÖĞ]/;
  function paint(ctx, str, x, y, size, color) {
    ctx.fillStyle = color;
    if (!FIXRE.test(str)) { ctx.fillText(str, x, y); return; }
    const u = size / 8;
    const chars = Array.from(str);
    const w = chars.length * size;
    let cx = ctx.textAlign === "center" ? x - w / 2 : ctx.textAlign === "right" ? x - w : x;
    const align = ctx.textAlign;
    ctx.textAlign = "left";
    for (const ch of chars) {
      const f = FIX[ch];
      ctx.fillText(f ? f[0] : ch, cx, y);
      if (f) for (const [rx, ry, rw, rh] of f[1]) ctx.fillRect(Math.round(cx + rx * u), Math.round(y + ry * u), Math.max(1, rw * u), Math.max(1, rh * u));
      cx += size;
    }
    ctx.textAlign = align;
  }
  P.text = (ctx, str, x, y, o = {}) => {
    const size = o.size || 8;
    str = String(str);
    ctx.font = `${size}px ${P.FONT}`;
    ctx.textAlign = o.align || "left";
    ctx.textBaseline = "top";
    x = Math.round(x); y = Math.round(y);
    if (o.shadow !== false) paint(ctx, str, x + 1, y + 1, size, o.shadow || "rgba(0,0,0,.75)");
    paint(ctx, str, x, y, size, o.color || "#fff");
  };
  P.wrap = (ctx, str, maxW, size = 8) => {
    ctx.font = `${size}px ${P.FONT}`;
    const out = [];
    let line = "";
    for (const w of String(str).split(" ")) {
      const t = line ? line + " " + w : w;
      if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    return out;
  };
  P.fontReady = () => {
    try { return Promise.race([document.fonts.load(`8px ${P.FONT}`), new Promise((r) => setTimeout(r, 1500))]); }
    catch (e) { return Promise.resolve(); }
  };

  /* ---------- ses ---------- */
  const A = { ctx: null, muted: false, last: {} };
  try { A.muted = localStorage.getItem("oyun-ses") === "0"; } catch (e) {}
  const unlock = () => {
    if (A.ctx) { if (A.ctx.state === "suspended") A.ctx.resume(); return; }
    try { A.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  };
  addEventListener("pointerdown", unlock, true);
  addEventListener("keydown", unlock, true);
  const ok = (key, gap) => {
    if (A.muted || !A.ctx) return false;
    const now = A.ctx.currentTime;
    if (key && A.last[key] && now - A.last[key] < gap) return false;
    if (key) A.last[key] = now;
    return true;
  };
  P.sound = {
    get muted() { return A.muted; },
    toggle() {
      A.muted = !A.muted;
      try { localStorage.setItem("oyun-ses", A.muted ? "0" : "1"); } catch (e) {}
      return A.muted;
    },
    beep(freq, dur = 0.08, o = {}) {
      if (!ok(o.key, o.gap || 0.03)) return;
      const c = A.ctx, t = c.currentTime + (o.delay || 0);
      const os = c.createOscillator(), g = c.createGain();
      os.type = o.type || "square";
      os.frequency.setValueAtTime(freq, t);
      if (o.slide) os.frequency.exponentialRampToValueAtTime(Math.max(30, o.slide), t + dur);
      g.gain.setValueAtTime(o.vol || 0.05, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      os.connect(g).connect(c.destination);
      os.start(t); os.stop(t + dur + 0.02);
    },
    noise(dur = 0.3, o = {}) {
      if (!ok(o.key, o.gap || 0.05)) return;
      const c = A.ctx, t = c.currentTime;
      const n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = o.freq || 1800;
      src.buffer = buf; g.gain.value = o.vol || 0.12;
      src.connect(f).connect(g).connect(c.destination);
      src.start(t);
    },
    tune(notes, step = 0.09, o = {}) {
      notes.forEach((f, i) => f && P.sound.beep(f, step * 0.95, Object.assign({}, o, { delay: i * step })));
    },
  };

  /* ---------- dil ---------- */
  P.i18n = (dict, onchange) => {
    let lang = "tr";
    try {
      const q = new URLSearchParams(location.search).get("lang");
      const s = localStorage.getItem("lang");
      lang = q === "en" || q === "tr" ? q : s === "en" || s === "tr" ? s : (navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en";
    } catch (e) {}
    const api = {
      get lang() { return lang; },
      t: (k) => (dict[lang] && dict[lang][k] != null ? dict[lang][k] : dict.tr[k] != null ? dict.tr[k] : k),
    };
    // masaüstü (Duck OS) dili değiştirince buradan haber verir
    window.i18n = {
      get lang() { return lang; },
      set(l) {
        lang = l === "en" ? "en" : "tr";
        try { localStorage.setItem("lang", lang); } catch (e) {}
        document.documentElement.lang = lang;
        if (onchange) onchange(lang);
      },
    };
    document.documentElement.lang = lang;
    return api;
  };

  /* ---------- rekor ---------- */
  P.best = (key, val) => {
    try {
      const cur = +localStorage.getItem(key) || 0;
      if (val != null && val > cur) { localStorage.setItem(key, String(Math.floor(val))); return Math.floor(val); }
      return cur;
    } catch (e) { return val || 0; }
  };

  /* ---------- döngü: sabit 60 adım/sn ---------- */
  P.loop = (update, draw) => {
    let last = performance.now(), acc = 0, raf = 0, on = true;
    const STEP = 1000 / 60;
    function frame(now) {
      if (!on) return;
      acc += Math.min(250, now - last);
      last = now;
      while (acc >= STEP) { update(); acc -= STEP; }
      draw();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return {
      stop() { on = false; cancelAnimationFrame(raf); },
      start() { if (on) return; on = true; last = performance.now(); raf = requestAnimationFrame(frame); },
    };
  };

  /* ---------- piksel çizgi (Bresenham) ---------- */
  P.line = (ctx, x0, y0, x1, y1, color) => {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    ctx.fillStyle = color;
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };

  window.Piksel = P;
})();
