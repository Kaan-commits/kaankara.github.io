/* =========================================================
   Togy — tişört sayfası
   - Renk filtresi, Izgara / Liste görünümü, listede önizleme
   - Togy işareti: büyük başlar, kaydırdıkça üst şeride küçülür
   - Giriş: tişörtler ekranın ortasında uzaktan gelip tek tek
     yaklaşır; sonunda beyaz bir kare ekranı kapatır ve düz,
     efektsiz bir mağaza ızgarası başlar
   - Cam mercek (yalnız girişte): görseller sabit bir WebGL tuvaline çizilir;
     ekranın üst ve alt kenarındaki şeritte kavisli bir camın
     içinden bakılıyormuş gibi bükülüp yana açılır. Ortası düz.
   - Fare tekerleğinde yumuşak kaydırma, altta saat ve x/y
   ========================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  let dirty = true, lastY = -1;
  function invalidate() { dirty = true; }

  /* ---------- Filtre ---------- */
  const tees = $$(".tee");
  $$("[data-filter]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = b.dataset.filter;
      $$("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      tees.forEach((t) => (t.hidden = !(f === "all" || t.dataset.color === f)));
      invalidate();
    })
  );

  /* ---------- Izgara / Liste ---------- */
  const setView = (v) => {
    root.classList.toggle("view-list", v === "list");
    $$("[data-view]").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.view === v)));
    try { localStorage.setItem("togy-view", v); } catch (e) {}
    invalidate();
  };
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => {
    setView(b.dataset.view);
    const w = $("#works");
    if (scrollY > w.offsetTop) jump(w.offsetTop - 60);
  }));
  try { if (localStorage.getItem("togy-view") === "list") setView("list"); } catch (e) {}

  // Listede satıra gelince tişört imlecin yanında belirir; tıklayınca ızgarada o tişörte gider
  const peek = document.createElement("div");
  peek.className = "peek";
  peek.setAttribute("aria-hidden", "true");
  peek.innerHTML = "<img alt=''>";
  document.body.appendChild(peek);
  tees.forEach((t) => {
    const src = $(".m-tee img", t).getAttribute("src");
    t.addEventListener("pointerenter", () => {
      if (!root.classList.contains("view-list")) return;
      $("img", peek).src = src;
      peek.classList.add("on");
    });
    t.addEventListener("pointerleave", () => peek.classList.remove("on"));
    $(".row", t).addEventListener("click", () => {
      if (!root.classList.contains("view-list")) return;
      peek.classList.remove("on");
      setView("grid");
      requestAnimationFrame(() => jump(t.getBoundingClientRect().top + scrollY - 70));
    });
  });

  /* ---------- Alt satır: saat ve imleç ---------- */
  const clock = $("#clock");
  const tick = () => {
    if (clock) clock.textContent = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour12: false });
  };
  tick();
  setInterval(tick, 1000);
  const xy = $("#xy");
  addEventListener("pointermove", (e) => {
    if (xy) xy.textContent = `x${Math.round(e.clientX)} y${Math.round(e.clientY)}`;
    peek.style.setProperty("--px", `${e.clientX + 24}px`);
    peek.style.setProperty("--py", `${e.clientY - 110}px`);
  }, { passive: true });

  /* ---------- Yumuşak kaydırma (yalnız fare / dokunmatik yüzey) ---------- */
  let sTarget = scrollY, sCur = scrollY, sRun = false;
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const sStep = () => {
    sCur += (sTarget - sCur) * 0.11;
    if (Math.abs(sTarget - sCur) < 0.4) sCur = sTarget;
    scrollTo(0, sCur);
    sRun = sCur !== sTarget;
    if (sRun) requestAnimationFrame(sStep);
  };
  const jump = (y) => { sTarget = sCur = clamp(y, 0, maxScroll()); sRun = false; scrollTo(0, sCur); };
  if (fine && !reduce) {
    addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const v = $(".viewer");
      if (v && !v.hidden) return;
      e.preventDefault();
      if (!sRun) sCur = scrollY;
      const d = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      sTarget = clamp(sTarget + d, 0, maxScroll());
      if (!sRun) { sRun = true; requestAnimationFrame(sStep); }
    }, { passive: false });
    // Klavye, kaydırma çubuğu, bağlantı: hedef yerinde kalsın
    addEventListener("scroll", () => { if (!sRun) sTarget = sCur = scrollY; }, { passive: true });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href="#top"]');
    if (!a) return;
    e.preventDefault();
    if (fine && !reduce) { sCur = scrollY; sTarget = 0; if (!sRun) { sRun = true; requestAnimationFrame(sStep); } }
    else scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- Togy işareti ---------- */
  const mark = $("#mark");
  const space = $(".mark-space");
  let markH = 0, markTop = 90, markEnd = 12, markSmall = 0.1, markDist = 1;
  const measureMark = () => {
    mark.style.setProperty("--mark-s", 1);
    const r = mark.getBoundingClientRect();
    markH = r.height;
    const mobile = innerWidth <= 760;
    markTop = mobile ? 70 : 84;
    markEnd = mobile ? 6 : 10;
    markSmall = clamp((mobile ? 26 : 34) / markH, 0.02, 1);
    markDist = Math.max(1, markTop + markH * 0.75);
    // Rock Salt'ın kuyrukları satır kutusundan taşar: altına pay bırak
    space.style.height = `${markH * 1.12 + markTop + 8}px`;
  };
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const drawMark = () => {
    if (reduce) return;
    const p = ease(clamp(scrollY / markDist));
    // Başta sayfayla birlikte yukarı kayar, sonra şeride yapışır
    const y = Math.max(markEnd, markTop - scrollY) * (1 - p) + markEnd * p;
    mark.style.setProperty("--mark-y", `${y}px`);
    mark.style.setProperty("--mark-s", (1 + (markSmall - 1) * p).toFixed(4));
  };
  if (!reduce) root.classList.add("mark-fixed");

  /* ---------- Giriş: uzaktan gelen tişörtler ----------
     Boylar errormade'deki gibi her adımda belli değerlerden geçen
     yumuşak bir eğri (Hermite). Her tişört bir öncekinden INTERVAL
     adım sonra ortada doğar ve onun üstünde büyür. 1080 piksellik
     ekrana göre yazılmış boylar ekran yüksekliğine ölçeklenir. */
  const entry = $("#entry");
  const fly = $$(".fly img");
  const portal = $(".fly .portal");
  const flyTees = fly.filter((x) => x !== portal);
  const hintEl = $(".entry-hint");
  const START = -1.0, INTERVAL = 1.6;  // ilk tişört açılışta ortada küçük durur
  const FIRST = [0, 201, 1081, 1937, 3425, 5159];
  const OTHER = [0, 176, 758, 1341, 2019, 3425];
  const PORTAL_AT = START + (flyTees.length - 1) * INTERVAL + 3.2;
  const STEPS = PORTAL_AT + 3;
  const tangent = (k, i) => {
    if (i === 0) return 0;
    if (i === k.length - 1) return k[i] - k[i - 1];
    const a = k[i] - k[i - 1], b = k[i + 1] - k[i];
    return (2 * a * b) / (a + b);
  };
  const heightAt = (i, pos) => {
    const k = i === 0 ? FIRST : OTHER;
    const l = pos - (START + i * INTERVAL);
    if (l <= 0) return 0;
    const last = k.length - 1;
    if (l >= last) return k[last] + (l - last) * tangent(k, last);
    const g = Math.floor(l), t = l - g, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * k[g] + (t3 - 2 * t2 + t) * tangent(k, g)
      + (-2 * t3 + 3 * t2) * k[g + 1] + (t3 - t2) * tangent(k, g + 1);
  };
  const portalAt = (pos) => {
    const stops = [0, 184 / 1920, 1426 / 1920, 1];
    const v = clamp(pos - PORTAL_AT, 0, 3);
    const i = Math.min(2, Math.floor(v));
    return stops[i] + (stops[i + 1] - stops[i]) * (v - i);
  };
  const entryOn = !reduce && !!entry;
  let stepPx = 1;
  if (entryOn) root.classList.add("entry-on");
  const measureEntry = () => {
    if (!entryOn) return;
    stepPx = Math.max(360, innerHeight * 0.65);
    entry.style.height = `${STEPS * stepPx + innerHeight}px`;
  };
  const place = (el, w, h) => {
    if (w < 0.5 || h < 0.5) { el.style.width = el.style.height = "0px"; return; }
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    el.style.left = `${(innerWidth - w) / 2}px`;
    el.style.top = `${(innerHeight - h) / 2}px`;
  };
  const drawEntry = () => {
    if (!entryOn) return;
    const pos = clamp((scrollY - entry.offsetTop) / stepPx, 0, STEPS);
    const W = innerWidth, H = innerHeight, k = H / 1080;
    const cover = (h) => h >= W && h >= H;
    const hs = flyTees.map((_, i) => heightAt(i, pos) * k);
    const ps = portalAt(pos);
    flyTees.forEach((el, i) => {
      // Üstündeki tişört (ya da beyaz kare) ekranı tamamen kapladıysa bunu çizme.
      // Böylece sahne bırakılınca dev tişörtler ızgaranın üstüne taşmaz.
      const hidden = ps >= 1 || hs.slice(i + 1).some(cover);
      place(el, hidden ? 0 : hs[i], hidden ? 0 : hs[i]);
    });
    place(portal, W * ps, H * ps);
    if (hintEl) hintEl.style.setProperty("--hint", clamp(1 - pos * 2).toFixed(3));
  };

  /* ---------- Cam mercek (WebGL) ---------- */
  const glass = reduce ? null : createGlass();
  if (glass) root.classList.add("glass");

  function createGlass() {
    const canvas = document.createElement("canvas");
    canvas.className = "glass-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const opts = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false };
    let gl = canvas.getContext("webgl2", opts);
    const gl2 = !!gl;
    gl = gl || canvas.getContext("webgl", opts);
    if (!gl) return null;

    const vert = `attribute vec2 p;
      uniform vec4 rect; uniform vec2 view;
      varying vec2 uv;
      void main(){
        uv = p;
        vec2 px = rect.xy + p * rect.zw;
        vec2 c = px / view * 2.0 - 1.0;
        gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
      }`;
    const sceneFrag = `precision highp float;
      uniform sampler2D img; varying vec2 uv;
      void main(){ gl_FragColor = texture2D(img, uv); }`;
    // Mercek: ortada sıfır kayma; kenar şeridinde dairesel bir profil.
    // Yukarıda içeri doğru, aşağıda yukarı doğru örnekler, yatayda ortaya çeker.
    const lensFrag = `precision highp float;
      uniform sampler2D scene; uniform vec2 view; uniform vec2 bands; uniform float dpr;
      uniform vec4 lens; // güç, renk ayrışması, yayılma, kavis
      vec4 at(vec2 s){
        vec2 uv = clamp(s / view, vec2(0.5) / (view * dpr), vec2(1.0) - vec2(0.5) / (view * dpr));
        return texture2D(scene, vec2(uv.x, 1.0 - uv.y));
      }
      void main(){
        vec2 s = vec2(gl_FragCoord.x, view.y * dpr - gl_FragCoord.y) / dpr;
        float t = 0.0, shift = 0.0;
        if (bands.x > 0.0 && s.y < bands.x) { t = 1.0 - s.y / bands.x; shift = bands.x * 0.539; }
        else if (bands.y > 0.0 && s.y > view.y - bands.y) { t = (s.y - view.y + bands.y) / bands.y; shift = -bands.y * 0.7; }
        t = clamp(t, 0.0, 1.0);
        if (t <= 0.0) { gl_FragColor = at(s); return; }
        float c = pow(t, lens.w);
        float k = (1.0 - sqrt(max(0.0, 1.0 - c * c))) * smoothstep(0.0, 0.75, t);
        vec2 off = vec2(-(s.x / view.x - 0.5) * min(view.x, 804.0) * lens.z, shift) * k * lens.x;
        vec2 q = s + off;
        vec4 v = at(q);
        if (lens.y > 0.0) {
          vec2 sp = normalize(off + vec2(0.001)) * lens.y * k * lens.x;
          vec4 r = at(q + sp), b = at(q - sp);
          v = vec4(r.r, v.g, b.b, max(v.a, max(r.a, b.a)));
        }
        gl_FragColor = v;
      }`;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };
    const program = (fs, names) => {
      const pr = gl.createProgram();
      gl.attachShader(pr, compile(gl.VERTEX_SHADER, vert));
      gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, fs));
      gl.bindAttribLocation(pr, 0, "p");
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
      const u = {};
      names.forEach((n) => (u[n] = gl.getUniformLocation(pr, n)));
      return { pr, u };
    };
    let sceneP, lensP;
    try {
      sceneP = program(sceneFrag, ["rect", "view", "img"]);
      lensP = program(lensFrag, ["rect", "view", "scene", "bands", "dpr", "lens"]);
    } catch (err) {
      console.warn("Togy cam:", err);
      return null;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const tex = (w, h) => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (w) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      return t;
    };
    const surface = tex();
    const fb = gl.createFramebuffer();
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth;
      H = innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.bindTexture(gl.TEXTURE_2D, surface);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, surface, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    // Doku görsel adresine göre tutulur: girişteki ve ızgaradaki aynı tişört tek doku
    const textures = new Map();
    const upload = (img, key) => {
      const t = tex();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      if (gl2) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      }
      textures.set(key, t);
      return t;
    };

    let lost = false;
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      lost = true;
      $$("img.gl-on").forEach((img) => img.classList.remove("gl-on"));
      textures.clear();
      root.classList.remove("glass");
      canvas.remove();
    });

    document.body.appendChild(canvas);
    resize();

    let last = "";
    const render = (force) => {
      if (lost) return false;
      const imgs = $$("img.gl");
      let uploaded = false, sig = `${W}x${H}`;
      const live = [];
      for (const img of imgs) {
        const r = img.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const key = img.currentSrc || img.src;
        let t = textures.get(key);
        const near = r.bottom > -H * 1.5 && r.top < H * 2.5;
        if (!t && near && !uploaded && img.complete && img.naturalWidth) {
          t = upload(img, key);   // karede en fazla bir yükleme: takılma olmasın
          uploaded = true;
        }
        if (!t) continue;
        img.classList.add("gl-on");
        if (r.bottom > 0 && r.top < H && r.right > 0 && r.left < W) {
          live.push([t, r]);
          sig += `|${r.left.toFixed(1)},${r.top.toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)}`;
        }
      }
      if (!force && !uploaded && sig === last) return uploaded;
      last = sig;

      // 1) sahne: görseller düz hâlleriyle dokuya
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(sceneP.pr);
      gl.uniform2f(sceneP.u.view, W, H);
      gl.uniform1i(sceneP.u.img, 0);
      gl.activeTexture(gl.TEXTURE0);
      for (const [t, r] of live) {
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.uniform4f(sceneP.u.rect, r.left, r.top, r.width, r.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      // 2) mercek: sahneyi kenar şeritlerinde bükerek ekrana
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(lensP.pr);
      gl.bindTexture(gl.TEXTURE_2D, surface);
      gl.uniform1i(lensP.u.scene, 0);
      gl.uniform4f(lensP.u.rect, 0, 0, W, H);
      gl.uniform2f(lensP.u.view, W, H);
      gl.uniform1f(lensP.u.dpr, dpr);
      const band = Math.min(H / 2, W <= 760 ? Math.max(150, H * 0.26) : 251);
      gl.uniform2f(lensP.u.bands, band, Math.min(H / 2, band * 0.968));
      gl.uniform4f(lensP.u.lens, 1.0, 0.0, 0.44, 1.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return uploaded;
    };
    return { render, resize };
  }

  /* ---------- Kare döngüsü ---------- */
  const frame = () => {
    const y = scrollY;
    if (y !== lastY || dirty) { drawMark(); drawEntry(); lastY = y; }
    if (glass) {
      // Yeni yüklenen doku varsa bir sonraki karede de bak (sıradaki yüklensin)
      if (glass.render(dirty)) dirty = true;
      else dirty = false;
    } else dirty = false;
    requestAnimationFrame(frame);
  };

  const layout = () => {
    measureMark();
    measureEntry();
    if (glass) glass.resize();
    invalidate();
  };
  addEventListener("resize", layout);
  document.addEventListener("langchange", invalidate);
  $$("img.gl").forEach((img) => img.addEventListener("load", invalidate));
  if (document.fonts) document.fonts.ready.then(layout);
  layout();
  drawMark();
  drawEntry();
  requestAnimationFrame(frame);
})();
