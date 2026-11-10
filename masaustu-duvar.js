/* =========================================================
   Duck OS — canlı duvar kağıdı
   · Katmanlar (data-depth) fareyle ters yöne kayar: derinlik hissi
   · Piksel kar canvas'ta yağar; imleç karı iter, hızlı fare rüzgâr yapar
   · Boş masaüstüne tıklamak kar patlatır
   · Ördek imleci gözüyle izler, tıklanınca zıplar ve "Vak!" der
   "Hareketi azalt" açıksa yalnızca durağan bir kar çizilir.
   ========================================================= */
(function () {
  "use strict";
  const desk = document.getElementById("desktop");
  const svg = document.getElementById("wallpaper");
  const cv = document.getElementById("snowfx");
  if (!desk || !svg || !cv) return;
  const ctx = cv.getContext("2d");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const PX = 2; // bir kar pikseli = 2 ekran pikseli

  const layers = Array.from(svg.querySelectorAll(".wp-layer")).map((el) => ({ el, d: +el.dataset.depth || 0 }));
  const duck = svg.querySelector(".wp-duck");
  const eye = document.getElementById("duckEye");
  const quack = document.getElementById("quack");

  let W = 0, H = 0, flakes = [], sparks = [];
  const ptr = { x: -9999, y: -9999, vx: 0, in: false };
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  let wind = 0;

  function flake(top) {
    return {
      x: Math.random() * W,
      y: top ? -Math.random() * 20 : Math.random() * H,
      vx: 0, vy: 0,
      base: 0.12 + Math.random() * 0.32,
      s: Math.random() < 0.22 ? 2 : 1,
      ph: Math.random() * 6.28,
      a: 0.55 + Math.random() * 0.45,
    };
  }

  function size() {
    const r = desk.getBoundingClientRect();
    W = Math.max(1, Math.ceil(r.width / PX));
    H = Math.max(1, Math.ceil(r.height / PX));
    cv.width = W;
    cv.height = H;
    const want = Math.round((W * H) / 1500);
    while (flakes.length < want) flakes.push(flake(false));
    flakes.length = want;
    if (still.matches) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const f of flakes) {
      ctx.globalAlpha = f.a;
      ctx.fillStyle = "#fff";
      ctx.fillRect(Math.round(f.x), Math.round(f.y), f.s, f.s);
    }
    for (const p of sparks) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    ctx.globalAlpha = 1;
  }

  let t = 0;
  function step() {
    t += 1;
    // rüzgâr: fare hızı yavaşça söner
    wind += (ptr.vx * 0.015 - wind) * 0.05;
    ptr.vx *= 0.9;
    const px = ptr.x / PX, py = ptr.y / PX, R = 34, R2 = R * R;
    for (const f of flakes) {
      f.ph += 0.02;
      if (ptr.in) {
        const dx = f.x - px, dy = f.y - py, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2), k = (1 - d / R) * 0.9;
          f.vx += (dx / d) * k;
          f.vy += (dy / d) * k;
        }
      }
      f.vx *= 0.93;
      f.vy *= 0.93;
      f.x += f.vx + Math.sin(f.ph) * 0.12 + wind;
      f.y += f.vy + f.base;
      if (f.y > H + 2) { Object.assign(f, flake(true)); }
      if (f.x < -4) f.x += W + 8;
      if (f.x > W + 4) f.x -= W + 8;
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.vx *= 0.95; p.vy = p.vy * 0.95 + 0.03;
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.016;
      if (p.life <= 0) sparks.splice(i, 1);
    }

    // paralaks
    par.x += (par.tx - par.x) * 0.06;
    par.y += (par.ty - par.y) * 0.06;
    for (const L of layers) {
      L.el.setAttribute("transform", `translate(${(-par.x * L.d * 46).toFixed(2)} ${(-par.y * L.d * 18).toFixed(2)})`);
    }
    if (t % 6 === 0) look();
    draw();
    raf = requestAnimationFrame(step);
  }

  // ördeğin gözü imlece bakar
  function look() {
    if (!eye || !duck) return;
    const r = duck.getBoundingClientRect();
    const cx = r.left + r.width * 0.65, cy = r.top + r.height * 0.3;
    let ex = 16, ey = 7;
    if (ptr.in) {
      const dx = ptr.x + desk.getBoundingClientRect().left - cx;
      const dy = ptr.y + desk.getBoundingClientRect().top - cy;
      if (Math.abs(dx) > 30) ex = dx > 0 ? 17 : 15;
      if (Math.abs(dy) > 50) ey = dy > 0 ? 8 : 6;
    }
    eye.setAttribute("x", ex);
    eye.setAttribute("y", ey);
  }

  function burst(x, y, n, colors) {
    const bx = x / PX, by = y / PX;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, v = 0.6 + Math.random() * 2.2;
      sparks.push({ x: bx, y: by, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.8, life: 0.8 + Math.random() * 0.6, s: Math.random() < 0.5 ? 2 : 1, c: colors[i % colors.length] });
    }
    for (const f of flakes) {
      const dx = f.x - bx, dy = f.y - by, d = Math.hypot(dx, dy);
      if (d < 70 && d > 0.1) { const k = (1 - d / 70) * 3; f.vx += (dx / d) * k; f.vy += (dy / d) * k; }
    }
    if (still.matches) draw();
  }

  let quackTimer = 0;
  function sayQuack() {
    const r = duck.getBoundingClientRect(), dr = desk.getBoundingClientRect();
    const lang = window.i18n && window.i18n.lang === "en" ? "en" : "tr";
    const words = lang === "en" ? ["Quack!", "Quack quack!", "Hi!", "It's cold out here!"] : ["Vak!", "Vak vak!", "Selam!", "Burası çok soğuk!"];
    quack.textContent = words[Math.floor(Math.random() * words.length)];
    quack.style.left = r.left - dr.left + r.width * 0.75 + "px";
    quack.style.top = r.top - dr.top - 8 + "px";
    quack.classList.remove("on");
    void quack.offsetWidth;
    quack.classList.add("on");
    clearTimeout(quackTimer);
    quackTimer = setTimeout(() => quack.classList.remove("on"), 1400);
    duck.classList.remove("hop");
    void duck.getBoundingClientRect();
    duck.classList.add("hop");
  }

  // ----- olaylar -----
  let lastX = null;
  addEventListener("pointermove", (e) => {
    const r = desk.getBoundingClientRect();
    ptr.x = e.clientX - r.left;
    ptr.y = e.clientY - r.top;
    ptr.in = ptr.y < r.height;
    if (lastX !== null) ptr.vx += (e.clientX - lastX) * 0.5;
    ptr.vx = Math.max(-60, Math.min(60, ptr.vx));
    lastX = e.clientX;
    par.tx = (ptr.x / r.width) * 2 - 1;
    par.ty = (ptr.y / r.height) * 2 - 1;
  }, { passive: true });
  document.addEventListener("pointerleave", () => { ptr.in = false; ptr.x = ptr.y = -9999; lastX = null; });
  addEventListener("blur", () => { ptr.in = false; });

  svg.addEventListener("click", (e) => {
    const r = desk.getBoundingClientRect();
    if (duck && e.target.closest(".wp-duck")) {
      sayQuack();
      burst(e.clientX - r.left, e.clientY - r.top, 16, ["#ffd23f", "#ff8a1f", "#fff"]);
    } else {
      burst(e.clientX - r.left, e.clientY - r.top, 40, ["#fff", "#fff", "#9fd0ff", "#5f9fdc"]);
    }
  });

  let raf = 0;
  function start() {
    cancelAnimationFrame(raf);
    if (still.matches) {
      layers.forEach((L) => L.el.removeAttribute("transform"));
      draw();
    } else {
      raf = requestAnimationFrame(step);
    }
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else start();
  });
  still.addEventListener("change", start);
  addEventListener("resize", size);
  size();
  start();
})();
