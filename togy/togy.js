/* =========================================================
   Togy — kaydırdıkça içine girilen sahneler
   Sahne i'nin ölçeği: ZOOM^(i - p). p kaydırmadan gelir; p = i iken
   sahne ekranı tam kaplar, bir sonraki sahne onun ortasında ZOOM
   kadar küçük durur. Her adımın başında kısa bir bekleme (HOLD) var:
   sahne ekranı kaplayınca yazısı okunabilsin.
   ========================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const reel = $("#reel");
  const scenes = $$(".sc", reel);
  const now = $("#tgNow");
  const prog = $("#tgProg");
  const N = scenes.length;

  const ZOOM = 0.055;  // bir sonraki sahnenin başlangıç boyu (ekrana oranla)
  const STEP = 1.05;   // sahne başına kaydırma, ekran yüksekliği cinsinden
  const HOLD = 0.3;    // adımın bu kadarında sahne tam ekranda bekler

  /* ---------- Mağaza: renk filtresi ---------- */
  const cards = $$(".card");
  $$("[data-filter]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = b.dataset.filter;
      $$("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      let n = 0;
      cards.forEach((c) => {
        const show = f === "all" || c.dataset.color === f;
        c.hidden = !show;
        if (show) n++;
      });
      $("#shopCount").textContent = n;
    })
  );

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Hareket azaltılmışsa sahneler alt alta kalır; bağlantılar sahneye kaydırır
  if (reduce || !reel) {
    $$("[data-scene]").forEach((b) => b.addEventListener("click", () => scenes[+b.dataset.scene].scrollIntoView()));
    return;
  }

  document.documentElement.classList.add("zoom");
  // Gizli sahnelerdeki görseller önceden yüklensin (büyürken boş kalmasın)
  $$("img", reel).forEach((img) => (img.loading = "eager"));

  const ins = scenes.map((s) => $(".sc-in", s));
  const caps = scenes.map((s) => $(".cap", s));
  let vh = innerHeight, vw = innerWidth, top = 0;
  let target = 0, cur = 0, shown = -1, raf = 0;

  const layout = () => {
    vh = innerHeight;
    vw = innerWidth;
    reel.style.height = `${(N - 1) * STEP * vh + vh}px`;
    top = reel.getBoundingClientRect().top + scrollY;
  };

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const progress = () => {
    const u = Math.min(N - 1, Math.max(0, (scrollY - top) / (STEP * vh)));
    const i = Math.floor(u);
    const f = u - i;
    return Math.min(N - 1, i + (f < HOLD ? 0 : ease((f - HOLD) / (1 - HOLD))));
  };

  const label = (i) => {
    const s = scenes[i];
    if (i === 0 || i === N - 1) return s.dataset.label;
    return `${String(Math.ceil(i / 2)).padStart(2, "0")} / 06 · ${s.dataset.label}`;
  };

  const render = (p) => {
    const minDim = Math.min(vw, vh);
    for (let i = 0; i < N; i++) {
      const d = i - p;                       // > 0: henüz gelmedi · < 0: geçildi
      const on = d <= 1.0001 && d >= -1;
      scenes[i].style.visibility = on ? "visible" : "hidden";
      if (!on) continue;
      const s = Math.pow(ZOOM, d);
      // Küçükken köşeleri yuvarlak bir pencere, ekranı kaplarken düz
      const r = d > 0 ? minDim * 0.16 * Math.min(1, d * 2.5) : 0;
      ins[i].style.transform = `scale(${s})`;
      ins[i].style.borderRadius = r ? `${r}px` : "0";
      const a = Math.max(0, 1 - Math.abs(d) / 0.16);
      caps[i].style.opacity = a;
      caps[i].style.pointerEvents = a > 0.6 ? "auto" : "none";
    }
    const k = Math.round(p);
    if (k !== shown && !inShop) {
      shown = k;
      if (now) now.textContent = label(k);
    }
    if (prog) prog.style.width = `${(p / (N - 1)) * 100}%`;
  };

  const tick = () => {
    cur += (target - cur) * 0.14;
    if (Math.abs(target - cur) < 0.0004) cur = target;
    render(cur);
    raf = cur === target ? 0 : requestAnimationFrame(tick);
  };
  const shopTitle = document.getElementById("shopTitle");
  let inShop = false;
  const kick = () => {
    // Zincir bitti, mağaza ızgarasındayız: alt şerit gizlenir, üstte "Tişörtler" yazar
    const nowShop = scrollY > top + (N - 1) * STEP * vh + vh * 0.5;
    if (nowShop !== inShop) {
      inShop = nowShop;
      document.documentElement.classList.toggle("in-shop", inShop);
      shown = -1;
      if (inShop && now && shopTitle) now.textContent = shopTitle.textContent;
    }
    target = progress();
    if (!raf) raf = requestAnimationFrame(tick);
  };

  // Sahneye git: o sahnenin bekleme aralığının ortası
  const goTo = (i) => {
    window.scrollTo({ top: top + (i + HOLD / 2) * STEP * vh, behavior: "instant" });
    cur = target = progress();
    render(cur);
  };
  $$("[data-scene]").forEach((b) => b.addEventListener("click", () => goTo(+b.dataset.scene)));

  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { layout(); kick(); });
  document.addEventListener("langchange", () => { shown = -1; render(cur); });

  layout();
  cur = target = progress();
  render(cur);
})();
