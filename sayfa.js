/* =========================================================
   Duck OS — tek başına açılan sayfalar için küçük yardımcılar
   - Masaüstündeki Ördek Gezgini'nin içindeysek (html.in-frame)
     data-desk bağlantıları masaüstünün kendi penceresini açar.
   - data-gallery bağlantıları resim görüntüleyicide açılır.
   - data-year öğelerine yıl yazılır.
   ========================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const t = (key, fb) => {
    if (!window.i18n) return fb;
    const v = window.i18n.t(key);
    return v && v !== key ? v : fb;
  };

  let desk = null;
  try {
    if (window.top !== window.self && window.parent.document.getElementById("windows")) desk = window.parent;
  } catch (e) { desk = null; }
  if (desk) document.documentElement.classList.add("in-frame");

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Masaüstü bağlantıları: pencere içindeyken sayfayı yeniden yükleme, pencereyi aç
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-desk]");
    if (!a || !desk) return;
    e.preventDefault();
    desk.location.hash = "#/" + a.dataset.desk;
  });

  /* ---------- Resim görüntüleyici ---------- */
  const shots = $$("a[data-gallery]");
  if (!shots.length) return;

  const box = document.createElement("div");
  box.className = "viewer";
  box.hidden = true;
  box.innerHTML =
    '<div class="viewer-win" role="dialog" aria-modal="true" aria-labelledby="viewerTitle">' +
    '<div class="dp-title"><svg class="ic"><use href="#i-photos"/></svg><strong id="viewerTitle"></strong>' +
    '<a class="dp-close" href="#" data-close aria-label="Kapat">×</a></div>' +
    '<div class="viewer-stage"><img alt=""></div>' +
    '<div class="viewer-bar"><button class="btn" type="button" data-step="-1">◀</button><span></span>' +
    '<button class="btn" type="button" data-step="1">▶</button></div></div>';
  document.body.appendChild(box);

  const img = $("img", box);
  const count = $(".viewer-bar span", box);
  const title = $("#viewerTitle", box);
  let list = [], i = 0, back = null;

  const draw = () => {
    const a = list[i];
    img.src = a.getAttribute("href");
    const inner = $("img", a);
    img.alt = inner ? inner.alt : "";
    const cap = $(".cap", a);
    title.textContent = (cap ? cap.textContent.trim() + " — " : "") + t("os.photos", "Resim görüntüleyici");
    count.textContent = `${i + 1} / ${list.length}`;
  };
  const show = (a) => {
    list = shots.filter((s) => s.dataset.gallery === a.dataset.gallery);
    i = Math.max(0, list.indexOf(a));
    back = a;
    draw();
    box.hidden = false;
    $("[data-close]", box).focus();
  };
  const hide = () => {
    box.hidden = true;
    img.removeAttribute("src");
    if (back) back.focus();
  };
  const step = (d) => { i = (i + d + list.length) % list.length; draw(); };

  shots.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); show(a); }));
  box.addEventListener("click", (e) => {
    const s = e.target.closest("[data-step]");
    if (s) return step(Number(s.dataset.step));
    if (e.target.closest("[data-close]") || e.target === box) { e.preventDefault(); hide(); }
  });
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
