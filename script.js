/* =========================================================
   Kaan Kara · Frozen Duck Games — ortak site scripti
   ========================================================= */

// Shopier mağazası açılınca linki buraya yapıştır, sitedeki tüm
// "Mağaza" butonları otomatik olarak aktif olur.
// Örnek: const SHOPIER_URL = "https://www.shopier.com/childishtogy";
const SHOPIER_URL = "";

document.documentElement.classList.add("js");

const tr = (key) => (window.i18n ? window.i18n.t(key) : key);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- Header: kaydırınca arka plan ---------- */
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobil menü ---------- */
const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  };
  navToggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
  document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

/* ---------- Shopier butonları ---------- */
document.querySelectorAll("[data-shopier]").forEach((el) => {
  if (SHOPIER_URL) {
    el.href = SHOPIER_URL;
    el.target = "_blank";
    el.rel = "noopener";
    el.removeAttribute("aria-disabled");
    const label = el.querySelector("[data-label] [data-i18n]");
    if (label) {
      // Dil değişince de doğru metin görünsün
      const update = () => (label.textContent = tr("shop.live"));
      label.removeAttribute("data-i18n");
      update();
      document.addEventListener("langchange", update);
    }
  }
});
document.querySelectorAll("[data-shopier-note]").forEach((el) => {
  if (SHOPIER_URL) el.hidden = true;
});

/* ---------- Footer yılı ---------- */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- Scroll ile beliren öğeler ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("in");
          io.unobserve(el);
          // Animasyon bitince öğenin kendi hover geçişleri geri gelsin
          el.addEventListener("transitionend", function done(e) {
            if (e.target !== el || e.propertyName !== "opacity") return;
            el.classList.remove("reveal");
            el.removeEventListener("transitionend", done);
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------- Daktilo efekti ---------- */
document.querySelectorAll("[data-typed]").forEach((el) => {
  if (reduceMotion) {
    const set = () => (el.textContent = el.dataset.typed.split("|")[0]);
    set();
    document.addEventListener("langchange", set);
    return;
  }
  let w = 0;
  let i = 0;
  let deleting = false;
  const tick = () => {
    // Kelimeler her turda okunur, böylece dil değişimi hemen yansır
    const words = el.dataset.typed.split("|");
    w %= words.length;
    const word = words[w];
    i = Math.min(i, deleting ? word.length : word.length - 1);
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 90;
    if (!deleting && i === word.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && i === 0) {
      deleting = false;
      w = (w + 1) % words.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  };
  tick();
});

/* ---------- Kartlarda 3D eğim + ışık ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    // .reveal geçişinin gecikmesi eğimi yavaşlatmasın
    card.addEventListener("pointerenter", () => {
      card.style.transition = "transform 0.15s ease-out, border-color 0.4s, box-shadow 0.5s";
    });
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s, box-shadow 0.5s";
      card.style.transform = "";
    });
  });
}

/* ---------- Piksel çizim yardımcısı (ikonlar, ördekler) ---------- */
const pixelSvg = (rows, palette, cls = "") => {
  let rects = "";
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (palette[ch]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${palette[ch]}"/>`;
    });
  });
  return `<svg class="${cls}" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
};

const root = document.documentElement;

/* ---------- Bildirim balonu ---------- */
const toast = (() => {
  let el = null;
  let timer = 0;
  return (html, ms = 3200) => {
    if (!el) {
      el = document.createElement("div");
      el.className = "fx-toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.innerHTML = html;
    el.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove("show"), ms);
  };
})();

/* ---------- Ses efektleri (Web Audio ile üretilir, varsayılan kapalı) ---------- */
const sfx = (() => {
  let on = false;
  try {
    on = localStorage.getItem("sound") === "on";
  } catch (e) {}
  let ac = null;
  let master = null;
  let noiseBuf = null;
  let rumble = null;

  const ensure = () => {
    if (!on) return null;
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.4;
      master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ac.state === "suspended") ac.resume();
    return ac;
  };

  // Tek bir nota: dalga tipi, frekans (kayabilir), süre, ses yüksekliği
  const tone = ({ type = "sine", f = 440, f2 = 0, t = 0.2, v = 0.2, delay = 0, filter = 0 }) => {
    const a = ensure();
    if (!a) return;
    const t0 = a.currentTime + delay;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + t);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + t);
    let node = o;
    if (filter) {
      const bp = a.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = filter;
      bp.Q.value = 2.5;
      node = o.connect(bp);
    }
    node.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + t + 0.05);
  };

  // Filtrelenmiş beyaz gürültü: vınlama, cızırtı
  const noise = ({ t = 0.5, v = 0.2, f = 800, f2 = 0, type = "bandpass", q = 1, delay = 0 }) => {
    const a = ensure();
    if (!a) return;
    const t0 = a.currentTime + delay;
    const src = a.createBufferSource();
    src.buffer = noiseBuf;
    const bf = a.createBiquadFilter();
    bf.type = type;
    bf.Q.value = q;
    bf.frequency.setValueAtTime(f, t0);
    if (f2) bf.frequency.exponentialRampToValueAtTime(f2, t0 + t);
    const g = a.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(v, t0 + t * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + t);
    src.connect(bf).connect(g).connect(master);
    src.start(t0);
    src.stop(t0 + t + 0.05);
  };

  const sounds = {
    blip: () => tone({ type: "triangle", f: 660, f2: 990, t: 0.12, v: 0.15 }),
    pew: () => tone({ type: "square", f: 1500, f2: 160, t: 0.17, v: 0.07 }),
    whoosh: () => {
      noise({ t: 1.1, v: 0.3, f: 250, f2: 3200, q: 0.7 });
      tone({ type: "sawtooth", f: 55, f2: 240, t: 1, v: 0.05 });
    },
    fanfare: () => [392, 523, 659, 784, 659, 784].forEach((f, i) => tone({ type: "square", f, t: 0.14, v: 0.06, delay: i * 0.11 })),
    quack: () => {
      tone({ type: "sawtooth", f: 560, f2: 380, t: 0.13, v: 0.22, filter: 1150 });
      tone({ type: "sawtooth", f: 500, f2: 300, t: 0.2, v: 0.2, filter: 1000, delay: 0.12 });
    },
  };

  // Basılı tutulan hiperuzay: tut bırak boyunca süren uğultu
  const hold = (start) => {
    if (start) {
      const a = ensure();
      if (!a || rumble) return;
      const t0 = a.currentTime;
      const src = a.createBufferSource();
      src.buffer = noiseBuf;
      src.loop = true;
      const lp = a.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(150, t0);
      lp.frequency.exponentialRampToValueAtTime(1400, t0 + 1.4);
      const o = a.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(40, t0);
      o.frequency.exponentialRampToValueAtTime(110, t0 + 1.4);
      const g = a.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.28, t0 + 0.5);
      src.connect(lp).connect(g);
      o.connect(lp);
      g.connect(master);
      src.start(t0);
      o.start(t0);
      rumble = { src, o, g };
    } else if (rumble) {
      const { src, o, g } = rumble;
      const t0 = ac.currentTime;
      g.gain.cancelScheduledValues(t0);
      g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
      src.stop(t0 + 0.65);
      o.stop(t0 + 0.65);
      rumble = null;
    }
  };

  // Tarayıcı sesi ancak bir dokunuştan sonra başlatır
  const unlock = () => {
    if (on) ensure();
  };
  document.addEventListener("pointerdown", unlock, { passive: true });
  document.addEventListener("keydown", unlock);

  return {
    get on() {
      return on;
    },
    set(v) {
      on = v;
      try {
        localStorage.setItem("sound", v ? "on" : "off");
      } catch (e) {}
      if (!v) hold(false);
    },
    play(name) {
      if (on && !reduceMotion) sounds[name]();
    },
    hold(start) {
      if (on && !reduceMotion) hold(start);
      else if (!start) hold(false);
    },
  };
})();

/* ---------- Ses düğmesi (sağ alt köşe) ---------- */
(() => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sound-toggle";
  const icons = {
    on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
  };
  const render = () => {
    btn.innerHTML = sfx.on ? icons.on : icons.off;
    btn.setAttribute("aria-pressed", String(sfx.on));
    const label = tr(sfx.on ? "sound.off" : "sound.on");
    btn.setAttribute("aria-label", label);
    btn.title = label;
  };
  btn.addEventListener("click", () => {
    sfx.set(!sfx.on);
    render();
    toast(tr(sfx.on ? "sound.toast.on" : "sound.toast.off"), 1600);
    sfx.play("blip");
  });
  document.addEventListener("langchange", render);
  render();
  document.body.appendChild(btn);
})();

/* ---------- Yıldız alanı: yıldızların arasından ileri uçuş ---------- */
const sky = (() => {
  const canvas = document.getElementById("stars");
  if (!canvas) return { reset() {}, burst() {}, hold() {}, boost() {}, jump() {}, arrive() {} };
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let stars = [];
  let parts = [];
  let scrollY = window.scrollY;
  let scrollV = 0;
  let warp = 0; // 0 = normal, 1 = tam hız
  let holding = false;
  let boostUntil = 0;
  let ramp = 0.05; // warp'a geçiş hızı
  let focus = null; // hiperuzayın çıktığı nokta (null = ekranın ortası)
  let px = 0; // fare paralaksı (-1..1), yumuşatılmış
  let py = 0;
  let tpx = 0;
  let tpy = 0;
  let last = performance.now();
  let running = true;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  const deepStar = (z = 1) => ({ x: rand(-1, 1), y: rand(-1, 1), z });

  const seed = () => {
    stars = Array.from({ length: Math.round(Math.min(420, (w * h) / 3800)) }, () => deepStar(rand(0.05, 1)));
  };

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };

  /* Yıldızların arasından ileri uçuş, basılı tutunca hiperuzay */
  const drawGalaxy = (dt) => {
    const cx = focus ? focus.x : w / 2 + px * 60;
    const cy = focus ? focus.y : h / 2 + py * 40;
    const f = Math.max(w, h) * 0.5;
    const speed = (0.0016 + warp * 0.03 + Math.min(Math.abs(scrollV), 60) * 0.00012) * dt;
    const tail = 1 + warp * 16;
    ctx.lineCap = "round";
    for (const s of stars) {
      s.z -= speed;
      const sx = cx + (s.x / s.z) * f;
      const sy = cy + (s.y / s.z) * f;
      if (s.z <= 0.02 || sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
        Object.assign(s, deepStar(1));
        continue;
      }
      const z0 = Math.min(1, s.z + speed * tail);
      const ox = cx + (s.x / z0) * f;
      const oy = cy + (s.y / z0) * f;
      const near = 1 - s.z;
      ctx.globalAlpha = Math.min(1, near * 1.6);
      ctx.strokeStyle = warp > 0.2 && s.z < 0.5 ? "#bfe6ff" : "#ffffff";
      ctx.lineWidth = near * 2.4 + 0.3;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(sx + 0.1, sy + 0.1);
      ctx.stroke();
    }
    // Hiperuzay anında ortada mavi bir parlama
    if (warp > 0.05) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, f * 0.6);
      g.addColorStop(0, `rgba(150, 210, 255, ${warp * 0.35})`);
      g.addColorStop(1, "rgba(150, 210, 255, 0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  };

  /* Tıklama patlamaları */
  const drawParts = (dt) => {
    parts = parts.filter((p) => p.life > 0);
    for (const p of parts) {
      p.life -= p.decay * dt;
      ctx.globalAlpha = Math.max(0, p.life);
      if (p.kind === "ring") {
        p.r += (p.vr || 4) * dt;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2 * p.life + 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
        continue;
      }
      p.vx *= Math.pow(0.95, dt);
      p.vy = p.vy * Math.pow(0.95, dt) + p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(p.x - p.vx * 3, p.y - p.vy * 3);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  };

  const burst = (x, y) => {
    if (reduceMotion) return;
    const spray = (n, kind, colors, speed, extra = {}) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = rand(speed * 0.35, speed);
        parts.push({ kind, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: rand(0.016, 0.03), size: rand(1.5, 3), color: pick(colors), g: 0.03, ...extra });
      }
    };
    parts.push({ kind: "ring", x, y, r: 2, vr: 5, life: 1, decay: 0.035, color: "#ffe81f" });
    spray(16, "streak", ["#ffe81f", "#4bd5ee", "#ffffff"], 6, { g: 0 });
  };

  const draw = (dt) => {
    ctx.clearRect(0, 0, w, h);
    const target = holding || performance.now() < boostUntil ? 1 : 0;
    warp += (target - warp) * (target ? ramp : 0.04) * dt;
    if (warp < 0.002) warp = 0;
    px += (tpx - px) * 0.05 * dt;
    py += (tpy - py) * 0.05 * dt;
    scrollV *= Math.pow(0.9, dt);
    drawGalaxy(dt);
    drawParts(dt);
    ctx.globalAlpha = 1;
  };

  const loop = (now) => {
    if (!running) return;
    const dt = Math.min(3, (now - last) / 16.67);
    last = now;
    draw(dt);
    requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw(1);
  });
  window.addEventListener(
    "scroll",
    () => {
      scrollV = window.scrollY - scrollY;
      scrollY = window.scrollY;
      if (reduceMotion) draw(0);
    },
    { passive: true }
  );
  if (finePointer) {
    window.addEventListener("pointermove", (e) => {
      tpx = (e.clientX / w - 0.5) * 2;
      tpy = (e.clientY / h - 0.5) * 2;
    });
  }

  if (reduceMotion) {
    draw(0);
  } else {
    requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      last = performance.now();
      if (running) requestAnimationFrame(loop);
    });
  }

  return {
    // Geri tuşuyla dönülünce temiz başla
    reset() {
      parts = [];
      focus = null;
      ramp = 0.05;
      boostUntil = 0;
      seed();
      if (reduceMotion) draw(0);
    },
    burst,
    hold(on) {
      holding = on && !reduceMotion;
    },
    boost(ms) {
      if (!reduceMotion) boostUntil = performance.now() + ms;
    },
    // Sayfadan çıkış: verilen noktadan hızla hiperuzaya
    jump(x, y) {
      if (reduceMotion) return;
      focus = { x, y };
      ramp = 0.14;
      boostUntil = performance.now() + 5000;
    },
    // Yeni sayfaya varış: tam hızda başla, yavaşla
    arrive() {
      if (reduceMotion) return;
      warp = 1;
      boostUntil = performance.now() + 200;
    },
  };
})();

/* ---------- Açılış efekti ---------- */
const overlay = (cls, html, ms, onSkip) => {
  const el = document.createElement("div");
  el.className = `fx-overlay ${cls}`;
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = html;
  document.body.appendChild(el);
  const skip = () => {
    clearTimeout(timer);
    done();
    if (onSkip) onSkip();
  };
  const done = () => {
    el.remove();
    document.removeEventListener("keydown", skip);
  };
  const timer = setTimeout(done, ms);
  el.addEventListener("click", skip);
  document.addEventListener("keydown", skip);
  return el;
};

const showHint = () => toast(tr("fx.hint"));

// Oturumun ilk açılışında oynar
const playIntro = (done) => {
  const finish = () => {
    delete root.dataset.intro;
    if (done) done();
  };
  // Açılış yazısı → küçülen logo → eğik düzlemde kayan hikâye → hiperuzay sıçraması
  // Süreler style.css'teki .fx-crawl animasyonlarıyla eş
  let jumped = false;
  const jump = () => {
    if (jumped) return;
    jumped = true;
    sky.boost(1200);
    sfx.play("whoosh");
    finish();
  };
  const story = ["p1", "p2", "p3"].map((k) => `<p>${tr(`fx.crawl.${k}`)}</p>`).join("");
  const el = overlay(
    "fx-crawl",
    `<p class="crawl-intro">${tr("fx.crawl")}</p>
    <div class="crawl-logo">Frozen<br>Duck Games</div>
    <div class="crawl-stage"><div class="crawl-text" lang="${root.lang}">
      <h2><small>${tr("fx.crawl.ep")}</small>${tr("fx.crawl.title")}</h2>${story}
    </div></div>
    <small class="crawl-skip">${tr("fx.skip")}</small>`,
    30000,
    jump
  );
  setTimeout(() => {
    el.classList.add("out");
    jump();
  }, 29300);
};

// Oturumun ilk açılışı: sayfa <head>'de gizlendi (data-intro="pending"), efekt onu açar
if (root.dataset.intro) {
  try {
    sessionStorage.setItem("intro", "1");
  } catch (e) {}
  if (reduceMotion) {
    delete root.dataset.intro;
  } else {
    root.dataset.intro = "playing";
    playIntro(() => setTimeout(showHint, 500));
  }
}

/* ---------- Galaksi: gezegen kaydırdıkça yükselir ---------- */
(() => {
  const glow = document.querySelector(".bg-glow");
  if (!glow || reduceMotion) return;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    glow.style.setProperty("--sp", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
  };
  const queue = () => {
    if (!queued) requestAnimationFrame(update);
    queued = true;
  };
  update();
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
})();

/* ---------- Boşluğa tıkla: patlama · basılı tut: warp ---------- */
(() => {
  const isUI = (el) => el.closest("a, button, input, textarea, select, label, iframe, video, img, .lightbox, .nav-links, .fx-overlay, .fx-duck");
  let press = null;
  const release = () => {
    if (!press) return;
    clearTimeout(press.timer);
    sky.hold(false);
    sfx.hold(false);
    document.body.classList.remove("is-warping");
  };
  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || isUI(e.target)) return;
    press = { x: e.clientX, y: e.clientY, warped: false };
    press.timer = setTimeout(() => {
      press.warped = true;
      sky.hold(true);
      sfx.hold(true);
      document.body.classList.add("is-warping");
    }, 280);
  });
  document.addEventListener("pointermove", (e) => {
    if (press && !press.warped && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 12) clearTimeout(press.timer);
  });
  ["pointerup", "pointercancel"].forEach((ev) => document.addEventListener(ev, release));
  window.addEventListener("blur", release);
  // Patlama "click" ile: dokunmatikte kaydırma sırasında tetiklenmez
  document.addEventListener("click", (e) => {
    if (isUI(e.target) || (press && press.warped) || window.getSelection().toString()) return;
    sky.burst(e.clientX, e.clientY);
    sfx.play("pew");
  });
})();

/* ---------- Gizli mod: ördek istilası (Konami kodu ya da footer ördeği) ---------- */
(() => {
  const duck = pixelSvg(
    ["....yyy.....", "...yyyyy....", "...yyyky.oo.", "...yyyyyooo.", "y..yyyyy....", "yyyyyyyyy...", "yyywwwyyyy..", ".yyywwyyyy..", "..yyyyyyy...", "....o..o...."],
    { y: "#ffd23f", w: "#fff3a8", k: "#111111", o: "#ff9a1f" }
  );
  let active = false;

  const invade = () => {
    if (active || reduceMotion) return;
    active = true;
    const total = 12;
    let hits = 0;
    let gone = 0;
    toast(tr("fx.ducks"));
    sfx.play("fanfare");
    const finish = () => {
      if (++gone < total) return;
      active = false;
      toast(`🎯 ${hits} / ${total} 🦆`);
    };
    for (let i = 0; i < total; i++) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "fx-duck";
      el.setAttribute("aria-label", "🦆");
      el.innerHTML = duck;
      const size = 40 + Math.random() * 36;
      el.style.cssText = `--s:${size}px;--top:${4 + Math.random() * 80}vh;--dur:${3.6 + Math.random() * 3.4}s;--delay:${Math.random() * 2.4}s;--bob:${0.5 + Math.random() * 0.5}s`;
      el.addEventListener("click", () => {
        if (el.classList.contains("hit")) return;
        hits++;
        sfx.play("quack");
        el.classList.add("hit");
        sky.burst(el.getBoundingClientRect().left + size / 2, el.getBoundingClientRect().top + size / 2);
        setTimeout(() => {
          el.remove();
          finish();
        }, 900);
      });
      el.addEventListener("animationend", (e) => {
        if (e.animationName !== "duckfly" || el.classList.contains("hit")) return;
        el.remove();
        finish();
      });
      document.body.appendChild(el);
    }
  };

  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let pos = 0;
  document.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === code[pos] ? pos + 1 : k === code[0] ? 1 : 0;
    if (pos === code.length) {
      pos = 0;
      invade();
    }
  });
  document.querySelectorAll(".site-footer .duck").forEach((d) => {
    d.addEventListener("click", invade);
    d.style.cursor = "pointer";
  });
})();

/* ---------- Ekran görüntüsü lightbox ---------- */
(() => {
  const triggers = Array.from(document.querySelectorAll("a.shot"));
  if (!triggers.length) return;

  const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", tr("lb.label"));
  box.innerHTML = `
    <img alt="">
    <button class="lb-btn lb-close" aria-label="${tr("lb.close")}">${icon('<path d="M18 6 6 18M6 6l12 12"/>')}</button>
    <button class="lb-btn lb-prev" aria-label="${tr("lb.prev")}">${icon('<path d="m15 18-6-6 6-6"/>')}</button>
    <button class="lb-btn lb-next" aria-label="${tr("lb.next")}">${icon('<path d="m9 18 6-6-6-6"/>')}</button>
    <div class="lb-count"></div>`;
  document.body.appendChild(box);

  const img = box.querySelector("img");
  const count = box.querySelector(".lb-count");
  let group = [];
  let index = 0;
  let lastFocus = null;

  const show = (i) => {
    index = (i + group.length) % group.length;
    const el = group[index];
    box.classList.add("switching");
    setTimeout(() => {
      img.src = el.href;
      img.alt = el.querySelector("img")?.alt || "";
      count.textContent = `${index + 1} / ${group.length}`;
      box.classList.remove("switching");
    }, img.src ? 150 : 0);
    const multi = group.length > 1;
    box.querySelector(".lb-prev").hidden = !multi;
    box.querySelector(".lb-next").hidden = !multi;
  };

  const open = (el) => {
    const name = el.dataset.gallery;
    group = triggers.filter((t) => t.dataset.gallery === name);
    lastFocus = el;
    img.removeAttribute("src");
    show(group.indexOf(el));
    box.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  };

  const close = () => {
    box.classList.remove("open");
    document.documentElement.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  triggers.forEach((t) =>
    t.addEventListener("click", (e) => {
      e.preventDefault();
      open(t);
    })
  );
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => {
    if (e.target === box) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Telefonda kaydırarak geçiş
  let startX = null;
  box.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50 && group.length > 1) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

/* ---------- Sayfa geçişleri: hiperuzay ---------- */
(() => {
  // Yeni sayfaya varış (<head> betiği data-arrive koyar)
  if (root.dataset.arrive) {
    sky.arrive();
    setTimeout(() => delete root.dataset.arrive, 900);
  }
  if (reduceMotion) return;

  let leaving = false;
  const leave = (href, x, y) => {
    if (leaving) return;
    leaving = true;
    try {
      sessionStorage.setItem("warp-in", "1");
    } catch (e) {}
    const el = document.createElement("div");
    el.className = "fx-leave";
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    sky.jump(x, y);
    sfx.play("whoosh");
    document.body.appendChild(el);
    setTimeout(() => (location.href = href), 700);
  };

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // aynı sayfada çapa
    if (!/(\/|\.html?)$/.test(url.pathname)) return; // PDF vb. dosyalar
    e.preventDefault();
    // Gezegene tıklandıysa hiperuzay gezegenin merkezinden başlar
    const r = (a.querySelector(".planet-body") || a).getBoundingClientRect();
    const fromPlanet = !!a.querySelector(".planet-body");
    const x = fromPlanet || !e.clientX ? r.left + r.width / 2 : e.clientX;
    const y = fromPlanet || !e.clientY ? r.top + r.height / 2 : e.clientY;
    leave(url.href, x, y);
  });

  // Geri tuşuyla önbellekten dönülürse perdeyi kaldır
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    document.querySelectorAll(".fx-leave").forEach((n) => n.remove());
    leaving = false;
    sky.reset();
  });
})();

/* ---------- Ana görsel: yörüngede rastgele gezen kartlar ----------
   Her kart halkada kendi hızıyla ve yönüyle döner, ara sıra hız/yön değiştirir.
   Kartlar birbirine değince boncuk gibi seker; böylece hiç üst üste binmezler. */
const chipCloud = document.querySelector(".chip-cloud");
if (chipCloud) {
  const els = [...chipCloud.querySelectorAll(".float-chip")];
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pickSpeed = () => rand(0.12, 0.4) * (Math.random() < 0.5 ? -1 : 1); // rad/sn

  const chips = els.map((el, i) => {
    const v = pickSpeed();
    return {
      el,
      a: -Math.PI / 2 + (i * TAU) / els.length + rand(-0.3, 0.3),
      v,
      target: v,
      nextTurn: rand(2, 6),
      wobble: rand(0, TAU),
      x: 0, y: 0, w: 0, h: 0,
    };
  });

  let size = 0;
  const measure = () => {
    size = chipCloud.offsetWidth;
    chips.forEach((c) => { c.w = c.el.offsetWidth; c.h = c.el.offsetHeight; });
  };

  const place = (t) => {
    const R = size / 2;
    chips.forEach((c) => {
      const r = R * (1 + 0.03 * Math.sin(t * 0.7 + c.wobble));
      c.x = R + Math.cos(c.a) * r;
      c.y = R + Math.sin(c.a) * r;
      c.el.style.transform = `translate(${c.x}px, ${c.y}px) translate(-50%, -50%)`;
    });
  };

  const overlap = (p, q, gap) =>
    Math.abs(p.x - q.x) < (p.w + q.w) / 2 + gap && Math.abs(p.y - q.y) < (p.h + q.h) / 2 + gap;

  // Açısal fark, [-π, π] aralığında
  const diff = (a, b) => {
    let d = (a - b) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return d;
  };

  measure();
  chipCloud.classList.add("live");
  place(0);

  if (!reduceMotion) {
    let last = 0;
    let time = 0;
    let visible = true;
    let raf = 0;

    const step = (now) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      time += dt;

      chips.forEach((c) => {
        c.nextTurn -= dt;
        if (c.nextTurn <= 0) { c.target = pickSpeed(); c.nextTurn = rand(2, 6); }
        c.v += (c.target - c.v) * Math.min(1, dt * 0.8);
        c.a += c.v * dt;
      });

      place(time);

      for (let i = 0; i < chips.length; i++) {
        for (let j = i + 1; j < chips.length; j++) {
          const p = chips[i], q = chips[j];
          if (!overlap(p, q, 6)) continue;
          const d = diff(p.a, q.a); // p, q'nun ne kadar önünde
          const s = Math.sign(d) || 1;
          // Birbirine yaklaşıyorlarsa hızları değiş tokuş et (esnek çarpışma)
          if ((p.v - q.v) * s < 0) {
            [p.v, q.v] = [q.v, p.v];
            p.target = Math.abs(pickSpeed()) * s;
            q.target = -Math.abs(pickSpeed()) * s;
          }
          // Hafifçe ayır
          p.a += s * 0.01;
          q.a -= s * 0.01;
        }
      }

      raf = visible ? requestAnimationFrame(step) : 0;
    };

    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(step); } };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
      }).observe(chipCloud);
    }
    start();
  }

  window.addEventListener("resize", () => { measure(); place(0); });
  // Dil değişince kart genişlikleri değişebilir
  document.addEventListener("langchange", measure);
  if (document.fonts) document.fonts.ready.then(measure);
}
