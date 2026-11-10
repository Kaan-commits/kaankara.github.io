/* =========================================================
   Duck OS — masaüstü teması (masaustu.html)
   Pencere yöneticisi, görev çubuğu, başlat menüsü, sayfaları
   pencerede açan "Ördek Gezgini" ve resim görüntüleyici.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Dil: bu sayfanın İngilizce metinleri ---------- */
  const EN = {
    "os.desktop": "Desktop",
    "os.icons": "Desktop icons",
    "os.tasks": "Open windows",
    "os.i.about": "About me",
    "os.i.games": "My games",
    "os.i.photos": "My pictures",
    "os.i.videos": "My videos",
    "os.t.about": "About me — Kaan Kara",
    "os.t.projects": "Projects — Mobile apps",
    "os.t.shop": "Shop — Togy",
    "os.t.mail": "New message — write to Kaan",
    "os.about.lede": "Under the <strong>Frozen Duck Games</strong> name I make Unity games, mobile apps and small games you can play in the browser.",
    "os.about.now": "Live right now",
    "os.genre.cards": "Card guessing · Android, iOS",
    "os.genre.mind": "Strategy · Android, iOS",
    "os.genre.uni": "Campus app",
    "os.playnow": "Play in the browser",
    "os.hint": "Tip: double-click the icons on the desktop, drag windows by their title bars.",
    "os.addr": "Address",
    "os.details": "Details",
    "os.other": "Other places",
    "os.items3": "3 objects",
    "os.items6": "6 objects",
    "os.arc.tip": "Double-click a game to open it in a window right here.",
    "os.arc.page": "Arcade page",
    "os.arc.free": "All free",
    "os.prev": "Previous",
    "os.next": "Next",
    "os.send": "Send",
    "os.to": "To:",
    "os.subject": "Subject:",
    "os.subject.ph": "I have an idea!",
    "os.body.ph": "Hi Kaan,",
    "os.body": "Message",
    "os.back": "Back",
    "os.fwd": "Forward",
    "os.reload": "Refresh",
    "os.newtab": "New tab",
    "os.done": "Done",
    "os.start": "start",
    "os.shutdown": "Turn off",
    "os.safe": "It's now safe to turn off your computer.",
    "os.restart": "Restart",
    "os.d.open": "Open the game's page",
    "os.d.shots": "Screenshots",
  };
  const TR = {
    "os.browser": "Ördek Gezgini",
    "os.loading": "Açılıyor…",
    "os.photos": "Resimlerim",
    "os.shots": "Ekran görüntüleri",
    "os.min": "Simge durumuna küçült",
    "os.max": "Ekranı kapla",
    "os.close": "Kapat",
    "os.done": "Bitti",
  };
  const DYN_EN = {
    "os.browser": "Duck Explorer",
    "os.loading": "Opening…",
    "os.photos": "My pictures",
    "os.shots": "Screenshots",
    "os.min": "Minimize",
    "os.max": "Maximize",
    "os.close": "Close",
  };
  const i18n = window.i18n;
  i18n.extend({ en: Object.assign({}, EN, DYN_EN), tr: TR });
  const t = (k) => i18n.t(k);

  /* ---------- Yardımcılar ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const phone = matchMedia("(max-width: 720px)");
  const desktop = $("#desktop");
  const tasks = $("#tasks");
  let lastPointer = "mouse";
  addEventListener("pointerdown", (e) => { lastPointer = e.pointerType || "mouse"; }, true);

  const SVG = {
    min: '<svg viewBox="0 0 10 10"><rect x="1" y="7" width="6" height="2" fill="#fff"/></svg>',
    max: '<svg viewBox="0 0 10 10"><path d="M1 1h8v8H1z M1 1h8v2H1z" fill="none" stroke="#fff" stroke-width="1.4"/><rect x="1" y="1" width="8" height="2" fill="#fff"/></svg>',
    close: '<svg viewBox="0 0 10 10"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
  };

  /* =========================================================
     Pencere yöneticisi
     ========================================================= */
  let z = 10;
  let cascade = 0;
  const wins = new Map();

  function setup(win) {
    const id = win.id.slice(2);
    const title = $(".title", win);
    const caps = document.createElement("div");
    caps.className = "caps";
    caps.innerHTML =
      `<button class="cap min" type="button" data-cap="min">${SVG.min}</button>` +
      `<button class="cap max" type="button" data-cap="max">${SVG.max}</button>` +
      `<button class="cap close" type="button" data-cap="close">${SVG.close}</button>`;
    title.appendChild(caps);
    const grip = document.createElement("span");
    grip.className = "grip";
    win.appendChild(grip);

    const rec = { id, win, title, task: null, placed: false };
    wins.set(id, rec);

    win.addEventListener("pointerdown", () => focus(id));
    caps.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cap]");
      if (!b) return;
      e.stopPropagation();
      if (b.dataset.cap === "min") minimize(id);
      if (b.dataset.cap === "max") toggleMax(id);
      if (b.dataset.cap === "close") close(id);
    });
    title.addEventListener("dblclick", (e) => { if (!e.target.closest(".cap")) toggleMax(id); });
    drag(rec);
    resize(rec, grip);
  }

  function capLabels() {
    $$(".cap.min").forEach((b) => b.setAttribute("aria-label", t("os.min")));
    $$(".cap.max").forEach((b) => b.setAttribute("aria-label", t("os.max")));
    $$(".cap.close").forEach((b) => b.setAttribute("aria-label", t("os.close")));
  }

  function area() {
    const r = desktop.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function place(rec) {
    const { w: vw, h: vh } = area();
    const icons = $("#deskIcons").getBoundingClientRect();
    const left0 = Math.min(icons.right + 16, vw * 0.3);
    const w = Math.min(+rec.win.dataset.w || 640, vw - left0 - 16, vw - 24);
    const h = Math.min(+rec.win.dataset.h || 480, vh - 40);
    const room = vw - left0 - w;
    const step = cascade++ % 6;
    let x = left0 + Math.max(0, room / 2 - 60) + step * 28;
    let y = Math.max(12, (vh - h) / 2 - 30) + step * 26;
    x = Math.max(8, Math.min(x, vw - w - 8));
    y = Math.max(8, Math.min(y, vh - h - 8));
    Object.assign(rec.win.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    rec.placed = true;
  }

  function open(id) {
    const rec = wins.get(id);
    if (!rec) return;
    const { win } = rec;
    if (win.hidden || win.classList.contains("closing")) {
      win.classList.remove("closing");
      win.hidden = false;
      if (!rec.placed) place(rec);
      win.classList.add("opening");
      win.addEventListener("animationend", () => win.classList.remove("opening"), { once: true });
      addTask(rec);
    }
    win.classList.remove("min");
    focus(id);
  }

  function close(id) {
    const rec = wins.get(id);
    if (!rec || rec.win.hidden) return;
    const { win } = rec;
    const done = () => {
      if (!win.classList.contains("closing")) return;
      win.classList.remove("closing", "active", "max", "min");
      win.hidden = true;
      if (id === "gezgin") web.blank();
    };
    win.classList.add("closing");
    win.addEventListener("animationend", done, { once: true });
    setTimeout(done, 260);
    rec.task && rec.task.remove();
    rec.task = null;
    focusTop(id);
  }

  function minimize(id) {
    const rec = wins.get(id);
    rec.win.classList.add("min");
    rec.win.classList.remove("active");
    focusTop(id);
  }

  function toggleMax(id) {
    if (phone.matches) return;
    wins.get(id).win.classList.toggle("max");
  }

  function focus(id) {
    const rec = wins.get(id);
    if (!rec || rec.win.hidden) return;
    wins.forEach((r) => {
      const on = r === rec;
      r.win.classList.toggle("active", on);
      if (r.task) r.task.setAttribute("aria-pressed", String(on && !r.win.classList.contains("min")));
    });
    if (rec.win.style.zIndex != z) rec.win.style.zIndex = ++z;
    setHash(id);
  }

  function focusTop(except) {
    let best = null;
    wins.forEach((r) => {
      if (r.id === except || r.win.hidden || r.win.classList.contains("min")) return;
      if (!best || +r.win.style.zIndex > +best.win.style.zIndex) best = r;
    });
    if (best) focus(best.id);
    else {
      wins.forEach((r) => r.task && r.task.setAttribute("aria-pressed", "false"));
      setHash(null);
    }
  }

  function titleText(rec) {
    return $(".title h2", rec.win).textContent.trim();
  }

  function addTask(rec) {
    const b = document.createElement("button");
    b.className = "task";
    b.type = "button";
    b.innerHTML = `<svg class="ic"><use href="#${rec.win.dataset.icon}"/></svg><span></span>`;
    $("span", b).textContent = titleText(rec);
    b.title = titleText(rec);
    b.addEventListener("click", () => {
      const { win } = rec;
      if (win.classList.contains("min")) open(rec.id);
      else if (win.classList.contains("active")) minimize(rec.id);
      else focus(rec.id);
    });
    tasks.appendChild(b);
    rec.task = b;
  }

  function syncTasks() {
    wins.forEach((r) => {
      if (!r.task) return;
      $("span", r.task).textContent = titleText(r);
      r.task.title = titleText(r);
    });
  }

  function drag(rec) {
    const { win, title } = rec;
    title.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".cap") || phone.matches || win.classList.contains("max")) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY;
      const ox = win.offsetLeft, oy = win.offsetTop;
      const { w: vw, h: vh } = area();
      title.setPointerCapture(e.pointerId);
      document.body.classList.add("dragging");
      const move = (ev) => {
        const x = Math.max(80 - win.offsetWidth, Math.min(ox + ev.clientX - sx, vw - 80));
        const y = Math.max(0, Math.min(oy + ev.clientY - sy, vh - 30));
        win.style.left = x + "px";
        win.style.top = y + "px";
      };
      const up = () => {
        document.body.classList.remove("dragging");
        title.removeEventListener("pointermove", move);
        title.removeEventListener("pointerup", up);
        title.removeEventListener("pointercancel", up);
      };
      title.addEventListener("pointermove", move);
      title.addEventListener("pointerup", up);
      title.addEventListener("pointercancel", up);
    });
  }

  function resize(rec, grip) {
    const { win } = rec;
    grip.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      focus(rec.id);
      const sx = e.clientX, sy = e.clientY;
      const ow = win.offsetWidth, oh = win.offsetHeight;
      grip.setPointerCapture(e.pointerId);
      document.body.classList.add("dragging");
      const move = (ev) => {
        win.style.width = Math.max(280, ow + ev.clientX - sx) + "px";
        win.style.height = Math.max(160, oh + ev.clientY - sy) + "px";
      };
      const up = () => {
        document.body.classList.remove("dragging");
        grip.removeEventListener("pointermove", move);
        grip.removeEventListener("pointerup", up);
      };
      grip.addEventListener("pointermove", move);
      grip.addEventListener("pointerup", up);
    });
  }

  /* ---------- Adres çubuğundaki #/pencere ---------- */
  function setHash(id) {
    let h = "";
    if (id === "gezgin" && web.path) h = "#/web/" + web.path;
    else if (id) h = "#/" + id;
    if (location.hash !== h) history.replaceState(null, "", h || location.pathname + location.search);
  }

  // #/oyunlar (masaüstü) ve eski sitenin #oyunlar, #projeler… linkleri
  function fromHash(hash = location.hash) {
    const m = hash.match(/^#\/?(.+)$/);
    if (!m) return false;
    const v = decodeURIComponent(m[1]);
    if (v.startsWith("web/")) {
      const p = v.slice(4);
      if (/^[\w\-./]+$/.test(p) && !p.includes("..")) { web.go(p); return true; }
      return false;
    }
    if (wins.has(v)) { open(v); return true; }
    return false;
  }

  /* =========================================================
     Ördek Gezgini: sitenin sayfalarını pencerede açar
     ========================================================= */
  const web = (() => {
    const frame = $("#webFrame");
    const addr = $("#webAddr");
    const out = $("#webOut");
    const status = $("#webStatus");
    const h2 = $("#t-gezgin");
    const api = { path: "" };

    const label = (path) => "kaankara.com.tr/" + path.replace(/index\.html$/, "");
    const setTitle = (s) => {
      h2.textContent = s ? s + " — " + t("os.browser") : t("os.browser");
      syncTasks();
    };

    api.go = (path) => {
      api.path = path;
      addr.textContent = label(path);
      out.href = path;
      status.textContent = t("os.loading");
      setTitle("");
      // klasik sitenin oturum açılışı (intro) pencerede oynamasın
      try { sessionStorage.setItem("intro", "1"); } catch (e) {}
      frame.src = path;
      open("gezgin");
    };
    api.blank = () => {
      api.path = "";
      frame.src = "about:blank";
    };

    frame.addEventListener("load", () => {
      if (!api.path) return;
      try {
        const loc = frame.contentWindow.location;
        if (loc.href === "about:blank") return;
        const p = loc.pathname.replace(/^\//, "") + loc.search + loc.hash;
        api.path = p;
        addr.textContent = label(p);
        out.href = "/" + p;
        setTitle(frame.contentDocument.title.split("·")[0].trim());
        const inner = frame.contentWindow.i18n;
        if (inner && inner.lang !== i18n.lang) inner.set(i18n.lang);
      } catch (e) {
        setTitle("");
      }
      status.textContent = t("os.done");
      if (wins.get("gezgin").win.classList.contains("active")) setHash("gezgin");
    });

    $("#webBack").addEventListener("click", () => { try { frame.contentWindow.history.back(); } catch (e) {} });
    $("#webFwd").addEventListener("click", () => { try { frame.contentWindow.history.forward(); } catch (e) {} });
    $("#webReload").addEventListener("click", () => { try { frame.contentWindow.location.reload(); } catch (e) {} });
    api.retitle = () => {
      try { setTitle(api.path ? frame.contentDocument.title.split("·")[0].trim() : ""); } catch (e) { setTitle(""); }
    };
    return api;
  })();

  /* =========================================================
     Resim görüntüleyici
     ========================================================= */
  const SETS = {
    photos: ["ben_AVM.png", "ben_AVM1.JPG", "ben_Bodrum.png", "ben_Bodrum1.JPG", "ben_Dubai.png"].map((f) => "Assets/fotogaleri/" + f),
    komparsita: ["ana-menu", "modlar", "tam-deste", "tahmin", "acilan-kart"].map((f) => `oyunlar/komparsita/ekran-goruntuleri/${f}.jpg`),
    mindfield: ["ana-menu", "tuzak-kur", "ezberle", "kosu", "bomba", "gunun-koprusu", "market"].map((f) => `oyunlar/mindfield/ekran-goruntuleri/${f}.jpg`),
    togy: ["ana-menu", "karsilasma", "orman", "diyalog"].map((f) => `oyunlar/togy/ekran-goruntuleri/${f}.jpg`),
  };
  $$("[data-set]").forEach((box) => {
    SETS[box.dataset.set] = $$("[data-src]", box).map((b) => b.dataset.src);
  });

  const viewer = (() => {
    const img = $("#viewImg");
    const count = $("#viewCount");
    const thumbs = $("#viewThumbs");
    const h2 = $("#t-galeri");
    let list = SETS.photos, i = 0, titleKey = null, titleName = "";

    const draw = () => {
      img.src = list[i];
      count.textContent = `${i + 1} / ${list.length}`;
      $$("button", thumbs).forEach((b, n) => b.setAttribute("aria-current", String(n === i)));
      const cur = thumbs.children[i];
      if (cur) cur.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    const retitle = () => {
      h2.textContent = titleName ? `${titleName} — ${t(titleKey)}` : t("os.photos");
      syncTasks();
    };
    const load = (set, n = 0, name = "") => {
      list = SETS[set] || SETS.photos;
      i = Math.max(0, Math.min(n, list.length - 1));
      titleName = name;
      titleKey = name ? "os.shots" : "os.photos";
      thumbs.innerHTML = "";
      list.forEach((src, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
        b.addEventListener("click", () => { i = k; draw(); });
        thumbs.appendChild(b);
      });
      retitle();
      draw();
    };
    const show = (set, n, name) => { load(set, n, name); open("galeri"); };
    $("#viewPrev").addEventListener("click", () => { i = (i - 1 + list.length) % list.length; draw(); });
    $("#viewNext").addEventListener("click", () => { i = (i + 1) % list.length; draw(); });
    $("#w-galeri").addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") $("#viewPrev").click();
      if (e.key === "ArrowRight") $("#viewNext").click();
    });
    return { show, load, retitle };
  })();

  /* =========================================================
     Oyunlarım: seçilen oyunun ayrıntıları
     ========================================================= */
  const GAMES = {
    komparsita: {
      name: "Komparsita", img: "oyunlar/komparsita/ekran-goruntuleri/ana-menu.jpg", page: "oyunlar/komparsita/",
      badge: ["badge.live", "Yayında"],
      text: ["komp.short", "Desteden açılacak kartı tahmin et, çarpanlarını doğru anda kullan ve rakibini puanda geç."],
      links: [["Google Play", "https://play.google.com/store/apps/details?id=com.FrozenDuckGames.Komparsita"], ["App Store", "https://apps.apple.com/us/app/komparsita/id6751227852"], ["komparsita.com", "https://komparsita.com"]],
    },
    mindfield: {
      name: "Mindfield", img: "oyunlar/mindfield/ekran-goruntuleri/ana-menu.jpg", page: "oyunlar/mindfield/",
      badge: ["badge.live", "Yayında"],
      text: ["mind.short", "Cam köprüye gizli tuzaklar kur, rakibin haritayı bir kez görsün. Sonra sıra sende: ezberle ve koş."],
      links: [["Google Play", "https://play.google.com/store/apps/details?id=com.FrozenDuckGames.Mindfield"], ["App Store", "https://apps.apple.com/tr/app/mindfield-kur-ve-ge%C3%A7/id6821066478?l=tr"]],
    },
    togy: {
      name: "Togy", img: "oyunlar/togy/ekran-goruntuleri/karsilasma.jpg", page: "oyunlar/togy/",
      badge: ["badge.internal", "Dahili test"],
      text: ["togy.short", "Piksel sanatlı bir platform macerası: iki dünya arasında yolculuk, boss savaşları ve tarot kartları."],
      links: [],
    },
  };

  function showGame(key) {
    const g = GAMES[key];
    if (!g) return;
    const box = $("#gameDetail");
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    box.innerHTML =
      `<img class="detail-img" src="${g.img}" alt="">` +
      `<p><strong>${esc(g.name)}</strong><br><span data-i18n="${g.badge[0]}">${g.badge[1]}</span></p>` +
      `<p data-i18n="${g.text[0]}">${g.text[1]}</p>` +
      `<div class="detail-actions">` +
      `<button type="button" data-web="${g.page}"><svg class="ic"><use href="#i-web"/></svg><span data-i18n="os.d.open">Oyunun sayfasını aç</span></button>` +
      `<button type="button" data-shots="${key}"><svg class="ic"><use href="#i-photos"/></svg><span data-i18n="os.d.shots">Ekran görüntüleri</span></button>` +
      g.links.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-web"/></svg>${esc(n)}</a>`).join("") +
      `</div>`;
    i18n.apply();
  }

  /* =========================================================
     Tıklamalar: simgeler, dosyalar, düğmeler
     ========================================================= */
  function follow(el) {
    if (el.dataset.open === "galeri") return viewer.show("photos");
    if (el.dataset.open) return open(el.dataset.open);
    if (el.dataset.web) return web.go(el.dataset.web);
    if (el.dataset.shots) return viewer.show(el.dataset.shots, 0, GAMES[el.dataset.shots].name);
    if (el.tagName === "A") {
      if (el.target === "_blank") window.open(el.href, "_blank", "noopener");
      else location.href = el.href;
    }
  }

  function select(el) {
    const scope = el.closest(".desk-icons, .files");
    $$(".sel", scope).forEach((x) => x.classList.remove("sel"));
    el.classList.add("sel");
    if (el.dataset.key) showGame(el.dataset.key);
  }

  document.addEventListener("click", (e) => {
    // Masaüstü simgeleri ve gezgin dosyaları: fareyle tıkla = seç, çift tıkla = aç; dokunmatik ve klavyede tek dokunuş açar
    const item = e.target.closest(".dicon, .file");
    if (item) {
      e.preventDefault();
      select(item);
      if (e.detail === 0 || lastPointer !== "mouse") follow(item);
      return;
    }
    const btn = e.target.closest("[data-open], [data-web], [data-shots]");
    if (btn) {
      e.preventDefault();
      follow(btn);
      closeStart();
      return;
    }
    const shot = e.target.closest("[data-set] [data-src]");
    if (shot) {
      const box = shot.closest("[data-set]");
      const n = $$("[data-src]", box).indexOf(shot);
      viewer.show(box.dataset.set, n, box.dataset.set === "uni" ? "1Üni" : box.dataset.set === "tees" ? "Togy" : "");
      return;
    }
    if (e.target.closest(".start-menu a")) closeStart();
  });

  document.addEventListener("dblclick", (e) => {
    const item = e.target.closest(".dicon, .file");
    if (item && lastPointer === "mouse") follow(item);
  });

  desktop.addEventListener("pointerdown", (e) => {
    if (e.target === desktop || e.target.closest(".wallpaper")) {
      $$(".desk-icons .sel").forEach((x) => x.classList.remove("sel"));
    }
  });

  /* ---------- Başlat menüsü ---------- */
  const startBtn = $("#startBtn");
  const startMenu = $("#startMenu");
  function openStart() {
    startMenu.hidden = false;
    startBtn.setAttribute("aria-expanded", "true");
    const first = $("[role=menuitem]", startMenu);
    if (lastPointer !== "mouse" && first) first.focus();
  }
  function closeStart() {
    if (startMenu.hidden) return;
    startMenu.hidden = true;
    startBtn.setAttribute("aria-expanded", "false");
  }
  startBtn.addEventListener("click", () => (startMenu.hidden ? openStart() : closeStart()));
  document.addEventListener("pointerdown", (e) => {
    if (!startMenu.hidden && !e.target.closest("#startMenu, #startBtn")) closeStart();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !startMenu.hidden) { closeStart(); startBtn.focus(); }
    if (!startMenu.hidden && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const items = $$("[role=menuitem]", startMenu);
      const k = items.indexOf(document.activeElement);
      const n = e.key === "ArrowDown" ? (k + 1) % items.length : (k - 1 + items.length) % items.length;
      items[n].focus();
      e.preventDefault();
    }
  });

  /* ---------- Kapat / yeniden başlat ---------- */
  $("#shutBtn").addEventListener("click", () => {
    closeStart();
    $("#shutdown").hidden = false;
  });
  $("#restartBtn").addEventListener("click", () => {
    try { sessionStorage.removeItem("os-boot"); } catch (e) {}
    history.replaceState(null, "", location.pathname);
    location.reload();
  });

  /* ---------- İleti formu ---------- */
  $("#mailForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const q = new URLSearchParams();
    if (f.subject.value) q.set("subject", f.subject.value);
    if (f.body.value) q.set("body", f.body.value);
    location.href = "mailto:kaan.kara@yahoo.com" + (q.toString() ? "?" + q.toString().replace(/\+/g, "%20") : "");
  });

  /* ---------- Saat ---------- */
  const clock = $("#clock");
  function tick() {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString(i18n.lang === "en" ? "en-US" : "tr-TR", { hour: "2-digit", minute: "2-digit" });
    clock.dateTime = d.toISOString();
    clock.title = d.toLocaleDateString(i18n.lang === "en" ? "en-US" : "tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  /* ---------- Dil değişince ---------- */
  document.addEventListener("langchange", () => {
    capLabels();
    web.retitle();
    viewer.retitle();
    syncTasks();
    tick();
    $("#webStatus").textContent = t("os.done");
    try {
      const inner = $("#webFrame").contentWindow.i18n;
      if (inner && inner.lang !== i18n.lang) inner.set(i18n.lang);
    } catch (e) {}
  });

  /* =========================================================
     Başlangıç
     ========================================================= */
  $$("#windows .win").forEach(setup);
  i18n.apply();
  showGame("komparsita");
  $('.file[data-key="komparsita"]').classList.add("sel");
  viewer.load("photos");
  tick();
  setInterval(tick, 15000);

  // Gezgin penceresindeki bir sayfa ana sayfaya dönerse (index.html'nin başındaki betik çağırır)
  window.DuckOS = {
    home(hash) {
      setTimeout(() => {
        close("gezgin");
        if (!fromHash(hash || "")) open("hakkimda");
      }, 0);
    },
  };

  function firstWindow() {
    if (!fromHash()) open("hakkimda");
  }

  const root = document.documentElement;
  if (root.classList.contains("booting")) {
    const boot = $("#boot");
    let gone = false;
    const finish = () => {
      if (gone) return;
      gone = true;
      try { sessionStorage.setItem("os-boot", "1"); } catch (e) {}
      boot.classList.add("out");
      setTimeout(() => { root.classList.remove("booting"); boot.classList.remove("out"); }, 500);
      setTimeout(firstWindow, 250);
    };
    boot.addEventListener("click", finish);
    addEventListener("keydown", finish, { once: true });
    setTimeout(finish, 1900);
  } else {
    firstWindow();
  }

  addEventListener("hashchange", () => fromHash());
  phone.addEventListener("change", () => wins.forEach((r) => { if (!r.win.hidden && !phone.matches) place(r); }));
})();
