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

/* ---------- Yıldızlı arka plan ---------- */
const canvas = document.getElementById("stars");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let stars = [];
  let w = 0;
  let h = 0;
  let scrollY = window.scrollY;
  let running = true;

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(260, (w * h) / 7000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2, // derinlik: yakın yıldızlar daha büyük ve hızlı
      t: Math.random() * Math.PI * 2,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.t += 0.02 * s.z;
      s.x += 0.06 * s.z;
      if (s.x > w) s.x = 0;
      const y = (((s.y - scrollY * s.z * 0.25) % h) + h) % h;
      const alpha = 0.35 + Math.sin(s.t) * 0.25 + s.z * 0.4;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.fillStyle = s.z > 0.85 ? "#bfefff" : "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, y, s.z * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const loop = () => {
    if (!running) return;
    draw();
    requestAnimationFrame(loop);
  };

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw();
  });
  window.addEventListener("scroll", () => (scrollY = window.scrollY), { passive: true });

  if (reduceMotion) {
    draw();
  } else {
    loop();
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) loop();
    });
  }
}

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
