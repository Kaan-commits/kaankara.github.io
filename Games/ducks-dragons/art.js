/* =========================================================
   Ducks & Dragons — piksel çizimler
   Bütün karakterler, nesneler ve zemin karoları kodla çizilir;
   oyun tek bir resim dosyası bile indirmez.
   ========================================================= */
"use strict";

const ART = (() => {
  const OUT = "#1a1220";

  /* ---------------- Renk yardımcıları ---------------- */
  const rgbCache = new Map();
  function rgba(c) {
    let v = rgbCache.get(c);
    if (v) return v;
    const n = parseInt(c.slice(1, 7), 16);
    v = [n >> 16, (n >> 8) & 255, n & 255, c.length === 9 ? parseInt(c.slice(7, 9), 16) : 255];
    rgbCache.set(c, v);
    return v;
  }
  function shade(hex, f) {
    const [r, g, b] = rgba(hex);
    const ch = (v) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
    return "#" + [ch(r), ch(g), ch(b)].map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  function mulberry32(a) {
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- Piksel tuvali ----------------
     Çizimler önce bir renk dizisine yapılır; kontur gibi işlemler
     bu dizi üzerinde kolayca hesaplanır. */
  function painter(w, h) {
    const buf = new Array(w * h).fill(null);
    const P = {
      w,
      h,
      buf,
      px(x, y, c) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x >= 0 && y >= 0 && x < w && y < h) buf[y * w + x] = c;
      },
      get(x, y) {
        return x >= 0 && y >= 0 && x < w && y < h ? buf[y * w + x] : null;
      },
      rect(x, y, rw, rh, c) {
        for (let j = 0; j < rh; j++) for (let i = 0; i < rw; i++) P.px(x + i, y + j, c);
      },
      ell(cx, cy, rx, ry, c, clip) {
        for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry); y++)
          for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx); x++) {
            const dx = (x + 0.5 - cx) / rx;
            const dy = (y + 0.5 - cy) / ry;
            if (dx * dx + dy * dy <= 1 && (!clip || clip(x, y))) P.px(x, y, c);
          }
      },
      line(x0, y0, x1, y1, c) {
        x0 = Math.round(x0);
        y0 = Math.round(y0);
        x1 = Math.round(x1);
        y1 = Math.round(y1);
        const dx = Math.abs(x1 - x0);
        const dy = -Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx + dy;
        for (;;) {
          P.px(x0, y0, c);
          if (x0 === x1 && y0 === y1) break;
          const e2 = 2 * err;
          if (e2 >= dy) {
            err += dy;
            x0 += sx;
          }
          if (e2 <= dx) {
            err += dx;
            y0 += sy;
          }
        }
      },
      poly(pts, c) {
        let minY = 1e9;
        let maxY = -1e9;
        let minX = 1e9;
        let maxX = -1e9;
        for (const [x, y] of pts) {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
        for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++)
          for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
            const X = x + 0.5;
            const Y = y + 0.5;
            let inside = false;
            for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
              const [xi, yi] = pts[i];
              const [xj, yj] = pts[j];
              if (yi > Y !== yj > Y && X < ((xj - xi) * (Y - yi)) / (yj - yi) + xi) inside = !inside;
            }
            if (inside) P.px(x, y, c);
          }
      },
      outline(c = OUT) {
        const add = [];
        for (let y = 0; y < h; y++)
          for (let x = 0; x < w; x++) {
            if (buf[y * w + x]) continue;
            if (P.get(x - 1, y) || P.get(x + 1, y) || P.get(x, y - 1) || P.get(x, y + 1)) add.push(y * w + x);
          }
        for (const i of add) buf[i] = c;
      },
    };
    return P;
  }

  function toCanvas(P) {
    const c = document.createElement("canvas");
    c.width = P.w;
    c.height = P.h;
    const g = c.getContext("2d");
    const img = g.createImageData(P.w, P.h);
    for (let i = 0; i < P.buf.length; i++) if (P.buf[i]) img.data.set(rgba(P.buf[i]), i * 4);
    g.putImageData(img, 0, 0);
    return c;
  }

  /* ---------------- Ortak renkler ---------------- */
  const C = {
    beak: "#ff9a1f",
    beakD: "#c46a00",
    eye: "#16101c",
    steel: "#dfe5ee",
    steelD: "#8c95a3",
    gold: "#ffd23f",
    goldD: "#c79a12",
    wood: "#8a5a2b",
    woodD: "#5a3a1a",
    woodL: "#c08a4e",
    bone: "#f0e4c8",
  };

  const SPR = {};
  const def = (name, w, h, fn) => (SPR[name] = { w, h, fn });

  /* ---------------- Ördek kahramanlar ---------------- */
  function duckBody(P, body, wear) {
    const sh = shade(body, -0.3);
    const wc = wear || body;
    P.ell(7.5, 11.3, 5, 3.2, shade(wc, -0.32));
    P.ell(7.5, 10.8, 4.7, 2.8, wc);
    if (!wear) {
      P.px(4, 11, sh);
      P.px(5, 11, sh);
      P.px(6, 12, sh);
      P.px(7, 12, sh);
    }
    P.rect(5, 14, 2, 1, C.beak);
    P.rect(9, 14, 2, 1, C.beak);
    P.rect(4, 15, 3, 1, C.beakD);
    P.rect(9, 15, 3, 1, C.beakD);
  }
  function duckHead(P, body) {
    const li = shade(body, 0.55);
    P.ell(8.5, 6, 3.6, 3.4, body);
    P.px(6, 4, li);
    P.px(7, 3, li);
    P.px(6, 5, li);
    P.rect(12, 6, 3, 1, C.beak);
    P.rect(12, 7, 2, 1, C.beakD);
    P.px(10, 5, C.eye);
  }
  const hoodClip = (x, y) => !(x >= 9 && y >= 5);

  def("hero:fighter", 16, 16, (P) => {
    const body = "#f4f1e8";
    // kılıç (arkada)
    P.rect(2, 1, 2, 8, C.steel);
    P.rect(3, 2, 1, 7, C.steelD);
    P.px(2, 0, C.steel);
    P.rect(1, 9, 4, 1, C.gold);
    P.rect(2, 10, 2, 2, C.woodD);
    duckBody(P, body, null);
    duckHead(P, body);
    // miğfer
    P.ell(8.5, 6, 3.9, 3.7, C.steel, (x, y) => y <= 4);
    P.rect(5, 4, 7, 1, C.steelD);
    P.px(6, 3, "#ffffff");
    // sorguç
    P.rect(7, 1, 3, 1, "#e04848");
    P.rect(8, 0, 3, 1, "#e04848");
    P.rect(7, 2, 3, 1, "#b83232");
    // kalkan
    P.ell(6.5, 11.5, 2.9, 3.1, C.steelD);
    P.ell(6.5, 11.5, 2.1, 2.3, "#c0443a");
    P.rect(6, 10, 1, 3, C.gold);
    P.rect(5, 11, 3, 1, C.gold);
    P.outline();
  });

  def("hero:wizard", 16, 16, (P) => {
    const body = "#ffd23f";
    const robe = "#6a4bc4";
    P.rect(2, 4, 1, 12, C.wood);
    P.rect(1, 2, 3, 2, "#5ad7ff");
    P.px(2, 1, "#5ad7ff");
    P.px(1, 2, "#c8f4ff");
    duckBody(P, body, robe);
    P.rect(4, 13, 7, 1, C.gold);
    P.px(6, 10, C.gold);
    P.px(9, 11, "#ffffff");
    P.px(5, 12, C.gold);
    duckHead(P, body);
    const hat = robe;
    P.ell(8.5, 3.6, 4.6, 1.1, shade(hat, -0.3));
    P.rect(6, 2, 5, 1, hat);
    P.rect(7, 1, 3, 1, hat);
    P.rect(9, 0, 2, 1, hat);
    P.px(8, 2, C.gold);
    P.px(9, 1, "#ffffff");
    P.outline();
  });

  def("hero:rogue", 16, 16, (P) => {
    const body = "#a7adc6";
    const cloak = "#3b3a4a";
    duckBody(P, body, cloak);
    P.px(6, 10, shade(cloak, 0.3));
    P.px(5, 11, shade(cloak, 0.3));
    duckHead(P, body);
    P.ell(8.3, 5.8, 3.9, 3.7, cloak, hoodClip);
    P.px(4, 3, cloak);
    P.px(5, 2, cloak);
    P.px(7, 3, shade(cloak, 0.35));
    P.px(8, 2, shade(cloak, 0.35));
    P.rect(9, 5, 3, 1, "#22202c");
    P.px(10, 5, "#e8f0ff");
    P.outline();
    P.rect(13, 8, 1, 3, C.steel);
    P.rect(12, 11, 3, 1, C.steelD);
    P.px(13, 12, C.woodD);
  });

  def("hero:cleric", 16, 16, (P) => {
    const body = "#fff7e0";
    const robe = "#e9e2d0";
    // topuz
    P.rect(2, 6, 1, 8, C.wood);
    P.rect(1, 3, 3, 3, C.steelD);
    P.rect(1, 3, 2, 2, C.steel);
    P.px(2, 2, C.steelD);
    P.px(0, 4, C.steelD);
    P.px(4, 4, C.steelD);
    duckBody(P, body, robe);
    P.rect(7, 9, 3, 5, "#4a6fc8");
    P.rect(8, 9, 1, 3, C.gold);
    P.rect(7, 10, 3, 1, C.gold);
    P.rect(4, 13, 7, 1, C.gold);
    duckHead(P, body);
    P.rect(5, 4, 6, 1, C.gold);
    P.px(8, 4, "#5ad7ff");
    P.outline();
  });

  def("hero:ranger", 16, 16, (P) => {
    const body = "#c08a4e";
    const cloak = "#3f8a4a";
    duckBody(P, body, cloak);
    P.line(5, 9, 9, 13, C.woodD);
    P.px(4, 8, "#e04848");
    P.px(3, 7, "#f4f1e8");
    duckHead(P, body);
    P.ell(8.3, 5.8, 3.9, 3.7, cloak, hoodClip);
    P.px(4, 4, cloak);
    P.px(3, 5, cloak);
    P.px(6, 3, shade(cloak, 0.35));
    P.px(7, 3, shade(cloak, 0.35));
    P.outline();
    // yay (konturdan sonra, ince kalsın)
    [[2, 1], [1, 2], [1, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [1, 10], [1, 11], [2, 12]].forEach(([x, y]) => P.px(x, y, C.woodD));
    P.rect(2, 2, 1, 10, "#e8e0c8");
  });

  def("hero:bard", 16, 16, (P) => {
    const body = "#ffb0c8";
    const vest = "#2f9aa8";
    duckBody(P, body, vest);
    P.px(9, 10, C.gold);
    P.px(9, 12, C.gold);
    duckHead(P, body);
    P.ell(7.8, 3.8, 4, 1.6, "#c8324a");
    P.px(6, 2, "#e8546a");
    P.outline();
    P.line(10, 3, 13, 0, "#f4f1e8");
    P.px(13, 0, C.gold);
    // ud
    P.ell(5.5, 12, 2.6, 2.2, C.woodL);
    P.px(5, 12, "#3a2410");
    P.px(6, 11, shade(C.woodL, 0.3));
    P.line(7, 11, 12, 8, C.woodD);
    P.px(13, 7, C.gold);
  });

  /* ---------------- Düşmanlar ---------------- */
  function goblin(P, tunic, kind) {
    const G = "#7bc043";
    const GD = "#4f8a2a";
    const GL = "#a4dc6a";
    P.rect(6, 13, 1, 3, GD);
    P.rect(9, 13, 1, 3, GD);
    P.px(5, 15, GD);
    P.px(10, 15, GD);
    P.ell(7.5, 11, 3.3, 2.7, shade(tunic, -0.3));
    P.ell(7.5, 10.7, 3, 2.4, tunic);
    P.rect(5, 12, 6, 1, "#3a2410");
    P.px(4, 10, G);
    P.px(4, 11, G);
    P.px(11, 10, G);
    P.px(11, 11, G);
    P.ell(8, 6.2, 3.6, 3, G);
    P.px(6, 4, GL);
    P.px(7, 4, GL);
    P.px(4, 5, G);
    P.px(3, 4, G);
    P.px(2, 3, G);
    P.px(3, 5, G);
    P.px(12, 4, G);
    P.px(13, 3, G);
    P.px(12, 5, G);
    P.px(9, 6, "#ffe14d");
    P.px(11, 6, "#ffe14d");
    P.px(12, 7, GD);
    P.px(9, 8, "#f4f1e8");
    P.px(11, 8, "#f4f1e8");
    if (kind === "archer") {
      P.ell(7.6, 5.2, 3.7, 2.4, "#3f6a3a", (x, y) => y <= 5 && !(x >= 9 && y >= 5));
    } else if (kind === "boss") {
      P.ell(8, 5.8, 3.8, 2.8, C.steelD, (x, y) => y <= 4);
      P.rect(5, 4, 7, 1, shade(C.steelD, -0.3));
      P.px(5, 1, C.bone);
      P.px(5, 2, C.bone);
      P.px(11, 1, C.bone);
      P.px(11, 2, C.bone);
    }
    P.outline();
    if (kind === "archer") {
      [[13, 5], [14, 6], [14, 7], [14, 8], [14, 9], [14, 10], [13, 11]].forEach(([x, y]) => P.px(x, y, C.woodD));
      P.rect(13, 6, 1, 5, "#e8e0c8");
    } else if (kind === "boss") {
      P.px(12, 12, C.woodD);
      P.rect(13, 7, 2, 5, C.steel);
      P.rect(15, 7, 1, 4, C.steelD);
    } else {
      P.px(12, 11, C.woodD);
      P.line(13, 10, 14, 7, C.steel);
      P.px(15, 6, C.steel);
      P.px(13, 11, C.steelD);
    }
  }
  def("foe:goblin", 16, 16, (P) => goblin(P, "#7a4b20", "blade"));
  def("foe:goblinArcher", 16, 16, (P) => goblin(P, "#5a6a3a", "archer"));
  def("foe:goblinBoss", 16, 16, (P) => goblin(P, "#a83a32", "boss"));

  function kobold(P, kind) {
    const K = "#c8603a";
    const KD = "#8a3a22";
    const KL = "#e8885a";
    const BELLY = "#f0c08a";
    if (kind === "chief") P.ell(6.5, 10.6, 4.2, 3.8, "#6a3a8a");
    P.px(1, 13, KD);
    P.px(2, 13, K);
    P.px(3, 12, K);
    P.px(4, 12, K);
    P.rect(6, 13, 1, 3, KD);
    P.rect(9, 13, 1, 3, KD);
    P.px(5, 15, KD);
    P.px(10, 15, KD);
    P.ell(7.5, 11, 3, 2.6, KD);
    P.ell(7.5, 10.7, 2.7, 2.3, K);
    P.ell(8.3, 11.2, 1.3, 1.6, BELLY);
    P.ell(8, 6.6, 2.9, 2.5, K);
    P.rect(10, 6, 4, 2, K);
    P.rect(10, 8, 3, 1, KD);
    P.px(13, 6, KD);
    P.px(7, 5, KL);
    P.px(9, 5, "#ffe14d");
    if (kind === "chief") {
      P.rect(6, 3, 4, 1, C.gold);
      P.px(6, 2, C.gold);
      P.px(8, 2, C.gold);
      P.px(9, 2, C.goldD);
      P.px(7, 3, "#ff4d5e");
      P.rect(7, 9, 3, 1, C.bone);
    } else {
      P.px(6, 3, C.bone);
      P.px(5, 2, C.bone);
      P.px(8, 3, C.bone);
      P.px(8, 2, C.bone);
    }
    P.outline();
    if (kind === "sling") {
      P.line(11, 10, 14, 7, "#c8b090");
      P.px(14, 6, "#8d8f9c");
      P.px(15, 6, "#8d8f9c");
    } else if (kind === "chief") {
      P.rect(14, 3, 1, 12, C.woodD);
      P.rect(13, 1, 3, 3, C.steelD);
      P.px(14, 0, C.steel);
      P.px(13, 1, C.steel);
    } else {
      P.rect(14, 2, 1, 14, C.wood);
      P.px(14, 1, C.steel);
      P.px(14, 0, C.steel);
      P.px(13, 1, C.steelD);
      P.px(15, 1, C.steelD);
    }
  }
  def("foe:kobold", 16, 16, (P) => kobold(P, "spear"));
  def("foe:koboldSlinger", 16, 16, (P) => kobold(P, "sling"));
  def("foe:koboldChief", 16, 16, (P) => kobold(P, "chief"));

  function hooded(P) {
    const cl = "#3a3550";
    P.px(2, 14, "#c8603a");
    P.px(3, 14, "#c8603a");
    P.ell(8, 11, 4.6, 4.4, shade(cl, -0.25));
    P.ell(8, 10.6, 4.3, 4.1, cl);
    P.line(6, 8, 5, 14, shade(cl, -0.35));
    P.ell(8.2, 5.8, 3.8, 3.5, "#46405e");
    P.ell(9.6, 6.6, 2, 1.7, "#160f1e");
    P.px(9, 6, "#ffe14d");
    P.px(11, 6, "#ffe14d");
    P.px(12, 7, "#c8603a");
    P.px(7, 3, shade("#46405e", 0.3));
    P.outline();
  }
  def("foe:koboldSpy", 16, 16, hooded);
  def("npc:stranger", 16, 16, hooded);

  def("foe:spider", 16, 16, (P) => {
    const S = "#3a2a4a";
    const SL = "#5e4876";
    const L = "#22182c";
    const legs = [
      [4, 9, 2, 6, 0, 9],
      [4, 10, 1, 9, 0, 13],
      [5, 12, 3, 13, 2, 15],
      [7, 12, 6, 14, 5, 15],
      [11, 9, 13, 6, 15, 9],
      [12, 10, 14, 9, 15, 13],
      [11, 12, 13, 13, 14, 15],
      [9, 12, 10, 14, 11, 15],
    ];
    for (const [a, b, c, d, e, f] of legs) {
      P.line(a, b, c, d, L);
      P.line(c, d, e, f, L);
    }
    P.ell(6, 10, 3.6, 3, S);
    P.ell(5.4, 9.2, 2, 1.3, SL);
    P.px(6, 10, "#c8324a");
    P.px(6, 11, "#c8324a");
    P.px(5, 10, "#c8324a");
    P.px(7, 10, "#c8324a");
    P.ell(10.6, 10.4, 2.3, 2, SL);
    P.px(11, 9, "#ff3a4a");
    P.px(12, 9, "#ff3a4a");
    P.px(12, 10, "#ff3a4a");
    P.px(12, 12, "#f4f1e8");
    P.px(13, 11, "#f4f1e8");
    P.outline();
  });

  function wolf(P, fur, eye, scarf) {
    const F = fur;
    const FD = shade(fur, -0.3);
    const FL = shade(fur, 0.35);
    P.px(0, 6, FD);
    P.px(0, 7, F);
    P.px(1, 7, F);
    P.px(1, 8, F);
    P.px(2, 9, F);
    P.rect(3, 12, 2, 3, FD);
    P.rect(6, 12, 1, 3, F);
    P.rect(9, 12, 2, 3, FD);
    P.rect(12, 12, 1, 3, F);
    P.ell(7, 10, 5, 2.7, F);
    P.ell(6.5, 8.3, 3.5, 0.9, FD);
    P.ell(7, 11.6, 3.6, 0.9, FL);
    P.ell(12, 7.5, 2.7, 2.4, F);
    P.rect(13, 7, 3, 2, F);
    P.px(13, 9, FL);
    P.px(14, 9, FL);
    P.px(15, 7, "#111111");
    P.px(11, 4, FD);
    P.px(11, 5, F);
    P.px(13, 4, FD);
    P.px(13, 5, F);
    P.px(13, 6, eye);
    if (scarf) {
      P.rect(10, 9, 3, 1, "#e04848");
      P.px(10, 10, "#e04848");
    }
    P.outline();
  }
  def("foe:wolf", 16, 16, (P) => wolf(P, "#8d8f9c", "#ffe14d"));
  def("ally:wolf", 16, 16, (P) => wolf(P, "#a89a88", "#16101c", true));
  def("npc:wolfTrap", 16, 16, (P) => {
    wolf(P, "#8d8f9c", "#ffe14d");
    P.rect(2, 13, 5, 2, C.steelD);
    P.px(2, 12, C.steel);
    P.px(4, 12, C.steel);
    P.px(6, 12, C.steel);
    P.rect(1, 15, 7, 1, "#5a5f6a");
  });

  /* Ejder: 2x2 karo kaplar */
  function dragon(P, sleeping) {
    const R = "#c8302a";
    const RD = "#8a1c18";
    const RL = "#ee6a48";
    const BEL = "#ffb35a";
    const BELD = "#d88a3a";
    const WING = "#a8302a";
    const WINGD = "#62160f";
    const HORN = C.bone;
    // kuyruk
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const x = (1 - t) * (1 - t) * 12 + 2 * (1 - t) * t * 2 + t * t * 2;
      const y = (1 - t) * (1 - t) * 24 + 2 * (1 - t) * t * 30 + t * t * 21;
      P.ell(x, y, 2.4 - t * 1.4, 2.4 - t * 1.4, i % 3 === 0 ? RD : R);
    }
    P.px(1, 19, HORN);
    P.px(2, 18, HORN);
    // arka kanat
    P.poly([[13, 16], [4, 1], [10, 4], [15, 1], [20, 5], [23, 14]], WINGD);
    P.poly([[13.5, 15], [6, 3.5], [10, 6], [15, 3.5], [19, 7], [21.5, 14]], WING);
    P.line(13, 15, 5, 2, WINGD);
    P.line(14, 15, 15, 2, WINGD);
    P.line(15, 15, 20, 5, WINGD);
    // arka bacak
    P.ell(9.5, 23.5, 3, 3.4, RD);
    P.rect(7, 26, 5, 2, RD);
    // gövde
    P.ell(15, 20, 8.5, 5.6, RD);
    P.ell(15, 19.4, 8, 5, R);
    P.ell(13, 17, 4, 1.5, RL);
    P.ell(17, 22.6, 5.6, 2.4, BEL);
    for (let x = 13; x <= 21; x += 2) P.px(x, 22, BELD);
    // ön bacak
    P.rect(20, 22, 3, 5, RD);
    P.rect(19, 26, 5, 2, RD);
    // boyun
    for (let i = 0; i <= 5; i++) P.ell(20.5 + i * 1.05, 16 - i * 1.45, 2.9 - i * 0.12, 2.9 - i * 0.12, R);
    P.line(22, 18, 25, 12, BEL);
    P.line(23, 18, 26, 12, BELD);
    // kafa
    P.ell(26, 8, 3.8, 3, R);
    P.rect(27, 8, 5, 3, R);
    P.rect(27, 10, 4, 1, RD);
    P.px(31, 8, "#2a0a08");
    P.line(24, 5, 21, 1, HORN);
    P.line(26, 5, 26, 1, HORN);
    P.px(25, 6, RL);
    // sırt dikenleri
    for (const [x, y] of [[9, 15], [12, 14], [15, 14], [18, 14], [21, 12], [23, 9]]) P.px(x, y, HORN);
    if (sleeping) P.rect(27, 7, 2, 1, "#2a0a08");
    else {
      P.px(27, 7, "#ffe14d");
      P.px(28, 7, "#2a0a08");
    }
    P.outline();
    if (!sleeping) {
      P.px(28, 11, "#ffffff");
      P.px(30, 11, "#ffffff");
    }
    for (const x of [7, 9, 11, 19, 21, 23]) P.px(x, 28, HORN);
  }
  def("foe:dragon", 32, 32, (P) => dragon(P, false));
  def("npc:dragonSleep", 32, 32, (P) => dragon(P, true));

  /* ---------------- Köylüler ---------------- */
  def("npc:goose", 16, 16, (P) => {
    const W = "#f8f6f0";
    const WD = "#cfcabb";
    P.ell(7, 12, 4.6, 2.8, WD);
    P.ell(7, 11.6, 4.3, 2.4, W);
    P.ell(7.2, 10.2, 3.6, 1.3, "#8a4bb0");
    P.px(5, 11, "#8a4bb0");
    P.px(4, 12, "#6a3a8a");
    P.rect(9, 5, 2, 6, W);
    P.ell(10.5, 4, 2.4, 2, W);
    P.rect(12, 4, 3, 1, C.beak);
    P.rect(12, 5, 2, 1, C.beakD);
    P.px(12, 3, C.beakD);
    P.px(11, 3, C.eye);
    P.px(9, 3, shade(W, -0.1));
    P.rect(5, 14, 2, 2, C.beak);
    P.rect(8, 14, 2, 2, C.beak);
    P.outline();
    P.rect(14, 7, 1, 9, C.wood);
    P.px(13, 6, C.wood);
    P.px(14, 6, C.wood);
    P.px(12, 7, C.wood);
  });

  def("npc:merchant", 16, 16, (P) => {
    const body = "#b98552";
    P.rect(1, 7, 4, 6, "#7a4b20");
    P.rect(1, 8, 4, 1, "#5a3a1a");
    P.rect(2, 6, 2, 1, C.steelD);
    duckBody(P, body, "#3f7ac8");
    P.rect(4, 11, 7, 1, C.gold);
    duckHead(P, body);
    P.ell(8.5, 3.6, 3.9, 1.8, "#e04848");
    P.rect(6, 2, 5, 1, "#e04848");
    P.px(8, 3, C.gold);
    P.px(7, 2, "#ff8a7a");
    P.outline();
  });

  /* ---------------- Nesneler ---------------- */
  def("obj:chest", 16, 16, (P) => {
    P.rect(2, 7, 12, 8, C.wood);
    P.rect(2, 4, 12, 4, C.woodL);
    P.rect(2, 7, 12, 1, C.woodD);
    P.rect(2, 4, 1, 11, C.gold);
    P.rect(13, 4, 1, 11, C.gold);
    P.rect(7, 7, 2, 3, C.gold);
    P.px(7, 8, C.woodD);
    P.rect(2, 14, 12, 1, C.woodD);
    P.outline();
  });
  def("obj:chestOpen", 16, 16, (P) => {
    P.rect(2, 2, 12, 4, C.woodD);
    P.rect(3, 3, 10, 3, "#2a1a0e");
    P.rect(2, 7, 12, 8, C.wood);
    P.rect(3, 6, 10, 2, C.gold);
    P.px(5, 5, C.gold);
    P.px(9, 5, "#fff3a8");
    P.px(11, 6, "#fff3a8");
    P.rect(2, 4, 1, 11, C.gold);
    P.rect(13, 4, 1, 11, C.gold);
    P.rect(2, 14, 12, 1, C.woodD);
    P.outline();
  });
  function fire(P, f) {
    P.line(3, 14, 12, 11, C.woodD);
    P.line(3, 11, 12, 14, C.wood);
    P.ell(7.5, 12.5, 1.5, 1, "#3a2410");
    P.outline();
    const O = "#ff7a1f";
    const Y = "#ffd23f";
    const W = "#fff3c0";
    if (f === 0) {
      P.poly([[4, 12], [6, 5], [7.5, 8], [9, 3], [11, 12]], O);
      P.poly([[6, 12], [7, 8], [8, 9.5], [9, 6], [10, 12]], Y);
      P.rect(7, 10, 2, 2, W);
    } else {
      P.poly([[4, 12], [5.5, 7], [7, 4], [8.5, 7.5], [10, 5], [11, 12]], O);
      P.poly([[6, 12], [6.5, 9], [7.5, 7], [8.5, 9], [10, 12]], Y);
      P.rect(7, 10, 2, 2, W);
    }
  }
  def("obj:fire0", 16, 16, (P) => fire(P, 0));
  def("obj:fire1", 16, 16, (P) => fire(P, 1));
  def("obj:well", 16, 16, (P) => {
    P.rect(3, 2, 1, 9, C.woodD);
    P.rect(12, 2, 1, 9, C.woodD);
    P.rect(2, 1, 12, 2, "#a8463a");
    P.rect(4, 3, 8, 1, C.wood);
    P.rect(7, 4, 1, 3, "#c8b090");
    P.rect(6, 7, 3, 2, C.wood);
    P.ell(8, 12, 6, 3.5, "#7d8794");
    P.ell(8, 11.6, 4.4, 2.2, "#1e2a3a");
    P.ell(8, 12.2, 3, 1, "#3b86c9");
    P.px(3, 13, "#9aa3b0");
    P.px(6, 15, "#5d6573");
    P.px(11, 14, "#9aa3b0");
    P.outline();
  });
  def("obj:shrine", 16, 16, (P) => {
    P.rect(3, 13, 10, 3, "#6f7682");
    P.rect(5, 3, 6, 10, "#8d94a0");
    P.rect(6, 3, 1, 10, "#a9b0bc");
    P.rect(4, 2, 8, 2, "#6f7682");
    P.ell(8, 7.5, 2.2, 2.2, "#dff4ff");
    P.ell(9, 7, 1.8, 1.8, "#8d94a0");
    P.px(5, 11, "#4f9a43");
    P.px(10, 12, "#4f9a43");
    P.px(11, 5, "#4f9a43");
    P.outline();
  });
  def("obj:stall", 16, 16, (P) => {
    P.rect(1, 2, 14, 4, "#f4f1e8");
    for (let x = 1; x < 15; x += 4) P.rect(x, 2, 2, 4, "#e04848");
    P.rect(1, 6, 14, 1, "#b83232");
    P.rect(2, 7, 1, 8, C.woodD);
    P.rect(13, 7, 1, 8, C.woodD);
    P.rect(2, 10, 12, 5, C.wood);
    P.rect(2, 10, 12, 1, C.woodL);
    P.rect(4, 8, 2, 2, "#e04848");
    P.rect(7, 8, 2, 2, "#5ad7ff");
    P.rect(10, 8, 2, 2, "#48e0a0");
    P.outline();
  });
  def("obj:door", 16, 16, (P) => {
    P.rect(1, 0, 14, 16, "#4a4150");
    P.rect(2, 1, 12, 15, "#6a6274");
    P.rect(2, 1, 1, 15, "#7e7688");
    P.rect(7, 1, 1, 15, "#4a4150");
    const R = "#5ad7ff";
    P.px(4, 4, R);
    P.px(5, 5, R);
    P.px(4, 6, R);
    P.px(10, 3, R);
    P.px(11, 4, R);
    P.px(10, 5, R);
    P.px(12, 5, R);
    P.px(4, 10, R);
    P.px(5, 10, R);
    P.px(5, 11, R);
    P.px(10, 9, R);
    P.px(11, 10, R);
    P.px(10, 11, R);
    P.ell(8, 8, 1.4, 1.6, "#22202c");
    P.outline();
  });
  def("obj:egg", 16, 16, (P) => {
    P.ell(8, 9.5, 4, 5.2, "#c8302a");
    P.ell(7, 8, 2, 2.4, "#e85a3a");
    P.px(6, 6, "#ffb35a");
    P.px(9, 11, "#ffb35a");
    P.px(10, 8, "#ffb35a");
    P.px(6, 12, "#8a1c18");
    P.outline();
  });
  def("obj:sign", 16, 16, (P) => {
    P.rect(7, 7, 2, 9, C.woodD);
    P.rect(2, 3, 12, 5, C.wood);
    P.rect(2, 3, 12, 1, C.woodL);
    P.rect(4, 5, 7, 1, C.woodD);
    P.px(12, 5, C.woodD);
    P.outline();
  });
  def("obj:throne", 16, 16, (P) => {
    P.rect(3, 1, 10, 9, C.steelD);
    P.rect(4, 2, 8, 7, "#a07a3a");
    P.px(5, 3, C.gold);
    P.px(10, 4, C.gold);
    P.px(7, 6, "#ff4d5e");
    P.rect(2, 9, 12, 4, "#7a5a3a");
    P.rect(3, 13, 2, 3, C.woodD);
    P.rect(11, 13, 2, 3, C.woodD);
    P.outline();
  });
  def("ui:scroll", 16, 16, (P) => {
    P.rect(3, 3, 10, 10, "#f0e0b8");
    P.rect(2, 2, 12, 2, "#c8a870");
    P.rect(2, 12, 12, 2, "#c8a870");
    P.rect(5, 6, 6, 1, "#8a6a40");
    P.rect(5, 8, 5, 1, "#8a6a40");
    P.rect(5, 10, 6, 1, "#8a6a40");
    P.outline();
  });

  /* ---------------- Önbellek ---------------- */
  const cache = new Map();
  function sprite(name) {
    let c = cache.get(name);
    if (c !== undefined) return c;
    const d = SPR[name];
    if (!d) {
      cache.set(name, null);
      return null;
    }
    const P = painter(d.w, d.h);
    d.fn(P);
    c = toCanvas(P);
    cache.set(name, c);
    return c;
  }
  const urlCache = new Map();
  function spriteURL(name) {
    if (urlCache.has(name)) return urlCache.get(name);
    const s = sprite(name);
    const u = s ? s.toDataURL() : "";
    urlCache.set(name, u);
    return u;
  }

  /* =========================================================
     Harita karoları
     ========================================================= */
  const THEMES = {
    village: {
      outdoor: true,
      grass: ["#5aa84a", "#4e9a42", "#6cbc58", "#3f8a37"],
      flower: ["#ff6fae", "#ffd23f", "#f4f1e8", "#a98bff"],
      path: ["#c9a56d", "#b8925a", "#d9ba84"],
      water: ["#3b86c9", "#2f6fae", "#6ab4ea"],
      tree: ["#2f7a38", "#3f9446", "#5bb05c", "#1f5228"],
      edge: "T",
    },
    forest: {
      outdoor: true,
      grass: ["#3f8a43", "#357a3a", "#4f9c4f", "#2c6a32"],
      flower: ["#f4f1e8", "#ffd23f", "#a98bff", "#ff8a3d"],
      path: ["#a5824f", "#93723f", "#b8955e"],
      water: ["#2f7ab8", "#26639a", "#5aa6e0"],
      tree: ["#25633a", "#2f7a45", "#47995a", "#18462a"],
      edge: "T",
    },
    cave: {
      outdoor: false,
      floor: ["#5b5452", "#4f4846", "#6a6361", "#433d3b"],
      path: ["#6e6460", "#5f5652", "#7c726c"],
      wall: ["#2b2530", "#3a3240", "#4c4354", "#5e5466"],
      edge: "#",
    },
    lair: {
      outdoor: false,
      floor: ["#4a3432", "#3d2b2a", "#5a403c", "#332423"],
      path: ["#5a3e38", "#4c332f", "#6a4a42"],
      wall: ["#24181a", "#33221f", "#4a302a", "#5c3c33"],
      edge: "#",
    },
  };
  const WALLISH = new Set(["#", "t", "X"]);
  const HOUSE = new Set(["R", "W", "N", "D"]);
  const WATERISH = new Set(["~", "=", "v", "b"]);

  function paintMap(rows, themeName, seed = 1) {
    const th = THEMES[themeName];
    const H = rows.length;
    const W = rows[0].length;
    const P = painter(W * 16, H * 16);
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? th.edge : rows[y][x]);
    // her karonun kendi tohumu var: bir karo değişince diğerleri aynı kalır
    let R = mulberry32(seed);
    const seedTile = (x, y, pass) => (R = mulberry32(seed * 7919 + y * 977 + x * 131 + pass * 50021));
    const pick = (arr) => arr[Math.floor(R() * arr.length)];
    const ri = (n) => Math.floor(R() * n);

    function grass(X, Y) {
      P.rect(X, Y, 16, 16, th.grass[0]);
      for (let i = 0; i < 16; i++) P.px(X + ri(16), Y + ri(16), pick([th.grass[1], th.grass[2], th.grass[1]]));
      if (R() < 0.6) {
        const x = X + 2 + ri(11);
        const y = Y + 3 + ri(11);
        P.px(x, y, th.grass[3]);
        P.px(x + 1, y - 1, th.grass[3]);
        P.px(x + 2, y, th.grass[3]);
      }
    }
    function floor(X, Y, x, y) {
      P.rect(X, Y, 16, 16, th.floor[0]);
      for (let i = 0; i < 14; i++) P.px(X + ri(16), Y + ri(16), pick([th.floor[1], th.floor[2]]));
      if (R() < 0.35) {
        let cx = X + 2 + ri(10);
        let cy = Y + 2 + ri(10);
        for (let i = 0; i < 4; i++) {
          P.px(cx, cy, th.floor[3]);
          cx += ri(2);
          cy += 1;
        }
      }
      if (R() < 0.4) {
        const px = X + 2 + ri(12);
        const py = Y + 2 + ri(12);
        P.px(px, py, th.floor[2]);
        P.px(px + 1, py, th.floor[1]);
      }
      // duvar dibindeki gölge
      if (WALLISH.has(at(x, y - 1))) for (let j = 0; j < 3; j++) for (let i = 0; i < 16; i++) if (j < 2 || (i + j) % 2) P.px(X + i, Y + j, th.floor[3]);
    }
    function ground(X, Y, x, y) {
      if (th.outdoor) grass(X, Y);
      else floor(X, Y, x, y);
    }
    function path(X, Y, x, y) {
      P.rect(X, Y, 16, 16, th.path[0]);
      for (let i = 0; i < 14; i++) P.px(X + ri(16), Y + ri(16), pick([th.path[1], th.path[2]]));
      const base = th.outdoor ? th.grass[0] : th.floor[0];
      const isP = (c) => c === ":" || c === "=" || c === "D";
      if (!isP(at(x - 1, y))) for (let j = 0; j < 16; j++) {
        if (R() < 0.7) P.px(X, Y + j, base);
        if (R() < 0.3) P.px(X + 1, Y + j, base);
      }
      if (!isP(at(x + 1, y))) for (let j = 0; j < 16; j++) {
        if (R() < 0.7) P.px(X + 15, Y + j, base);
        if (R() < 0.3) P.px(X + 14, Y + j, base);
      }
      if (!isP(at(x, y - 1))) for (let i = 0; i < 16; i++) {
        if (R() < 0.7) P.px(X + i, Y, base);
        if (R() < 0.3) P.px(X + i, Y + 1, base);
      }
      if (!isP(at(x, y + 1))) for (let i = 0; i < 16; i++) {
        if (R() < 0.7) P.px(X + i, Y + 15, base);
        if (R() < 0.3) P.px(X + i, Y + 14, base);
      }
      if (!th.outdoor) floorShadow(X, Y, x, y);
    }
    function floorShadow(X, Y, x, y) {
      if (WALLISH.has(at(x, y - 1))) for (let j = 0; j < 3; j++) for (let i = 0; i < 16; i++) if (j < 2 || (i + j) % 2) P.px(X + i, Y + j, th.floor[3]);
    }
    function water(X, Y, x, y) {
      const wt = th.water || ["#3b86c9", "#2f6fae", "#6ab4ea"];
      P.rect(X, Y, 16, 16, wt[0]);
      for (let i = 0; i < 3; i++) {
        const wx = X + ri(11);
        const wy = Y + 3 + ri(11);
        P.rect(wx, wy, 3 + ri(3), 1, wt[1]);
      }
      if (!WATERISH.has(at(x, y - 1))) {
        P.rect(X, Y, 16, 1, th.grass ? th.grass[3] : "#2a2a2a");
        for (let i = 0; i < 16; i++) P.px(X + i, Y + 1, i % 3 ? wt[2] : "#e6f4ff");
        P.rect(X, Y + 2, 16, 1, wt[1]);
      }
      if (!WATERISH.has(at(x - 1, y))) P.rect(X, Y, 1, 16, wt[2]);
      if (!WATERISH.has(at(x + 1, y))) P.rect(X + 15, Y, 1, 16, wt[1]);
      if (!WATERISH.has(at(x, y + 1))) P.rect(X, Y + 15, 16, 1, wt[2]);
    }
    function ford(X, Y, x, y) {
      const wt = th.water;
      P.rect(X, Y, 16, 16, shade(wt[0], 0.25));
      for (let i = 0; i < 5; i++) {
        const sx = X + 1 + ri(12);
        const sy = Y + 1 + ri(12);
        P.rect(sx, sy, 3, 2, "#9aa3b0");
        P.px(sx, sy, "#c9d1dc");
        P.rect(sx, sy + 2, 3, 1, "#5d6573");
      }
      if (!WATERISH.has(at(x, y - 1))) P.rect(X, Y, 16, 1, wt[2]);
    }
    function bridge(X, Y, x, y) {
      water(X, Y, x, y);
      const horiz = !WATERISH.has(at(x - 1, y)) || at(x - 1, y) === "=" || at(x + 1, y) === "=";
      if (horiz) {
        P.rect(X, Y + 2, 16, 12, C.wood);
        for (let i = 0; i < 16; i += 4) P.rect(X + i, Y + 2, 1, 12, C.woodD);
        P.rect(X, Y + 2, 16, 1, C.woodL);
        P.rect(X, Y + 13, 16, 1, C.woodD);
        P.rect(X, Y + 1, 16, 1, "#3a2410");
        P.rect(X, Y + 14, 16, 1, "#3a2410");
      } else {
        P.rect(X + 2, Y, 12, 16, C.wood);
        for (let j = 0; j < 16; j += 4) P.rect(X + 2, Y + j, 12, 1, C.woodD);
        P.rect(X + 1, Y, 1, 16, "#3a2410");
        P.rect(X + 14, Y, 1, 16, "#3a2410");
      }
    }
    function broken(X, Y, x, y) {
      water(X, Y, x, y);
      if (!WATERISH.has(at(x - 1, y))) {
        P.rect(X, Y + 3, 5, 10, C.wood);
        P.rect(X + 5, Y + 4, 2, 3, C.woodD);
        P.rect(X + 5, Y + 9, 1, 3, C.woodD);
      }
      if (!WATERISH.has(at(x + 1, y))) {
        P.rect(X + 11, Y + 3, 5, 10, C.wood);
        P.rect(X + 9, Y + 6, 2, 4, C.woodD);
      }
      P.rect(X + 6, Y + 11, 4, 1, C.woodD);
    }
    function tree(X, Y) {
      const t = th.tree;
      const ox = ri(3) - 1;
      const big = R() < 0.5 ? 0.5 : 0;
      P.ell(X + 8, Y + 14, 6.5, 2.2, th.grass[3]);
      P.rect(X + 7, Y + 10, 3, 5, "#6b4a2b");
      P.rect(X + 9, Y + 10, 1, 5, "#4a3020");
      P.ell(X + 8 + ox, Y + 6, 7.2 + big, 6, t[3]);
      P.ell(X + 8 + ox, Y + 5.4, 6.6 + big, 5.4, t[0]);
      P.ell(X + 7 + ox, Y + 4.4, 4.6, 3.6, t[1]);
      P.ell(X + 6 + ox, Y + 3.4, 2.2, 1.5, t[2]);
      for (let i = 0; i < 6; i++) P.px(X + 3 + ri(10) + ox, Y + 2 + ri(8), pick([t[1], t[2], t[3]]));
    }
    function bush(X, Y) {
      const t = th.tree;
      P.ell(X + 8, Y + 13, 6.5, 2, th.grass[3]);
      P.ell(X + 8, Y + 9.5, 6.6, 5, t[3]);
      P.ell(X + 8, Y + 9, 6, 4.4, t[0]);
      P.ell(X + 6.5, Y + 7.5, 3, 2, t[1]);
      P.px(X + 5, Y + 6, t[2]);
      if (R() < 0.5) {
        P.px(X + 10, Y + 9, "#e04848");
        P.px(X + 6, Y + 11, "#e04848");
        P.px(X + 11, Y + 7, "#e04848");
      }
    }
    function rock(X, Y) {
      const base = th.outdoor ? ["#8d94a0", "#6f7682", "#b8bec8"] : [th.wall[3], th.wall[2], shade(th.wall[3], 0.25)];
      P.ell(X + 8, Y + 13, 6.5, 2.4, th.outdoor ? th.grass[3] : th.floor[3]);
      P.ell(X + 8, Y + 10, 6.4, 5, base[1]);
      P.ell(X + 7.5, Y + 9.3, 5.8, 4.4, base[0]);
      P.ell(X + 6, Y + 7.5, 2.6, 1.6, base[2]);
      P.line(X + 9, Y + 8, X + 11, Y + 11, base[1]);
    }
    function fence(X, Y, x, y) {
      const f = (c) => c === "f";
      const L = f(at(x - 1, y));
      const Rr = f(at(x + 1, y));
      const U = f(at(x, y - 1));
      const D = f(at(x, y + 1));
      const rail = "#b07a40";
      if (L || Rr || !(U || D)) {
        const x0 = L ? 0 : 6;
        const x1 = Rr ? 16 : 10;
        P.rect(X + x0, Y + 7, x1 - x0, 2, rail);
        P.rect(X + x0, Y + 11, x1 - x0, 2, rail);
        P.rect(X + x0, Y + 9, x1 - x0, 1, "#6b4a2b");
      }
      if (U || D) {
        const y0 = U ? 0 : 5;
        const y1 = D ? 16 : 13;
        P.rect(X + 6, Y + y0, 1, y1 - y0, rail);
        P.rect(X + 9, Y + y0, 1, y1 - y0, rail);
      }
      P.rect(X + 6, Y + 5, 4, 10, "#8a5a2b");
      P.rect(X + 6, Y + 5, 4, 1, "#c08a4e");
      P.rect(X + 9, Y + 6, 1, 9, "#5a3a1a");
    }
    function roof(X, Y, x, y) {
      const r = "#a8463a";
      P.rect(X, Y, 16, 16, r);
      for (let j = 0; j < 16; j += 4) {
        P.rect(X, Y + j + 3, 16, 1, "#7e2e26");
        for (let i = (j / 4) % 2 ? 2 : 0; i < 16; i += 4) P.px(X + i, Y + j + 1, "#c05a48");
      }
      if (!HOUSE.has(at(x, y - 1))) P.rect(X, Y, 16, 2, "#d07058");
      if (at(x, y + 1) !== "R") P.rect(X, Y + 13, 16, 3, "#5e2018");
      if (!HOUSE.has(at(x - 1, y))) P.rect(X, Y, 2, 16, "#7e2e26");
      if (!HOUSE.has(at(x + 1, y))) P.rect(X + 14, Y, 2, 16, "#6e2820");
    }
    function wallH(X, Y, x, y, kind) {
      P.rect(X, Y, 16, 16, "#eadfc4");
      for (let i = 0; i < 6; i++) P.px(X + ri(16), Y + 3 + ri(10), "#dccfae");
      P.rect(X, Y, 16, 2, "#6b4a2b");
      P.rect(X, Y + 13, 16, 3, "#8d8173");
      P.rect(X, Y + 13, 16, 1, "#a69a8a");
      if (!HOUSE.has(at(x - 1, y))) P.rect(X, Y, 2, 16, "#6b4a2b");
      if (!HOUSE.has(at(x + 1, y))) P.rect(X + 14, Y, 2, 16, "#6b4a2b");
      if (kind === "N") {
        P.rect(X + 4, Y + 4, 8, 7, "#6b4a2b");
        P.rect(X + 5, Y + 5, 6, 5, "#ffd27a");
        P.rect(X + 5, Y + 5, 6, 1, "#fff0c0");
        P.rect(X + 7, Y + 5, 1, 5, "#6b4a2b");
        P.rect(X + 5, Y + 7, 6, 1, "#6b4a2b");
      } else if (kind === "D") {
        P.rect(X + 4, Y + 3, 8, 13, "#5a3a1a");
        P.rect(X + 5, Y + 4, 6, 12, "#8a5a2b");
        P.rect(X + 7, Y + 4, 1, 12, "#6b4a2b");
        P.px(X + 9, Y + 10, C.gold);
      }
    }
    function crate(X, Y) {
      ground(X, Y);
      P.ell(X + 8, Y + 14, 6, 1.6, th.outdoor ? th.grass[3] : th.floor[3]);
      if (R() < 0.5) {
        P.rect(X + 2, Y + 3, 12, 11, "#7a4b20");
        P.rect(X + 3, Y + 4, 10, 9, "#b97b3d");
        P.line(X + 3, Y + 4, X + 12, Y + 12, "#7a4b20");
        P.line(X + 12, Y + 4, X + 3, Y + 12, "#7a4b20");
      } else {
        P.ell(X + 8, Y + 9, 5, 5.5, "#6b4420");
        P.ell(X + 8, Y + 9, 4.2, 5, "#a06a34");
        P.rect(X + 3, Y + 6, 10, 1, C.steelD);
        P.rect(X + 3, Y + 11, 10, 1, C.steelD);
        P.ell(X + 8, Y + 4.5, 3.6, 1.2, "#8a5a2b");
      }
    }
    function wallC(X, Y, x, y, torch) {
      const w = th.wall;
      P.rect(X, Y, 16, 16, w[0]);
      for (let i = 0; i < 10; i++) P.px(X + ri(16), Y + ri(16), w[1]);
      const below = at(x, y + 1);
      const face = !WALLISH.has(below);
      if (!WALLISH.has(at(x, y - 1))) P.rect(X, Y, 16, 1, w[2]);
      if (face) {
        P.rect(X, Y + 6, 16, 10, w[2]);
        P.rect(X, Y + 6, 16, 1, w[3]);
        for (let j = 9; j < 16; j += 3) for (let i = 0; i < 16; i++) if (R() < 0.6) P.px(X + i, Y + j, w[1]);
        for (let i = 0; i < 5; i++) P.px(X + ri(16), Y + 7 + ri(8), w[3]);
        P.rect(X, Y + 15, 16, 1, w[0]);
      }
      if (!WALLISH.has(at(x - 1, y)) && at(x - 1, y) !== undefined) P.rect(X, Y, 1, face ? 6 : 16, w[1]);
      if (!WALLISH.has(at(x + 1, y))) P.rect(X + 15, Y, 1, face ? 6 : 16, w[1]);
      if (torch) {
        P.rect(X + 7, Y + 9, 2, 5, "#5a3a1a");
        P.rect(X + 6, Y + 8, 4, 2, "#3a2410");
      }
    }
    function crystal(X, Y, x, y) {
      floor(X, Y, x, y);
      P.ell(X + 8, Y + 14, 6, 1.6, th.floor[3]);
      P.poly([[X + 3, Y + 14], [X + 4, Y + 6], [X + 6, Y + 4], [X + 7, Y + 14]], "#4aa8e8");
      P.poly([[X + 6, Y + 14], [X + 8, Y + 2], [X + 10, Y + 1], [X + 11, Y + 14]], "#7ad8ff");
      P.poly([[X + 10, Y + 14], [X + 12, Y + 7], [X + 14, Y + 8], [X + 14, Y + 14]], "#4aa8e8");
      P.line(X + 9, Y + 3, X + 9, Y + 12, "#c8f4ff");
      P.px(X + 5, Y + 7, "#c8f4ff");
    }
    function web(X, Y, x, y) {
      floor(X, Y, x, y);
      const c = "#cfcfda";
      const cx = X + 8;
      const cy = Y + 8;
      for (const [dx, dy] of [[-8, -8], [8, -8], [-8, 8], [8, 8], [0, -8], [0, 8], [-8, 0], [8, 0]]) P.line(cx, cy, cx + dx, cy + dy, c);
      for (const r of [3, 6]) {
        P.line(cx - r, cy, cx, cy - r, c);
        P.line(cx, cy - r, cx + r, cy, c);
        P.line(cx + r, cy, cx, cy + r, c);
        P.line(cx, cy + r, cx - r, cy, c);
      }
    }
    function bones(X, Y, x, y) {
      floor(X, Y, x, y);
      const b = C.bone;
      P.rect(X + 3, Y + 10, 6, 1, b);
      P.px(X + 2, Y + 9, b);
      P.px(X + 2, Y + 11, b);
      P.px(X + 9, Y + 9, b);
      P.px(X + 9, Y + 11, b);
      P.ell(X + 11, Y + 6, 2.2, 2, b);
      P.px(X + 10, Y + 6, "#2a2020");
      P.px(X + 12, Y + 6, "#2a2020");
      P.rect(X + 10, Y + 8, 3, 1, "#c8bca0");
    }
    function lava(X, Y, x, y) {
      P.rect(X, Y, 16, 16, "#c4301a");
      for (let i = 0; i < 4; i++) P.ell(X + 2 + ri(12), Y + 2 + ri(12), 2 + ri(2), 1.4, "#ff5a1f");
      for (let i = 0; i < 4; i++) P.px(X + ri(16), Y + ri(16), "#ffb347");
      const crust = "#3d1a12";
      if (at(x, y - 1) !== "L") {
        P.rect(X, Y, 16, 2, crust);
        for (let i = 0; i < 16; i++) if (R() < 0.5) P.px(X + i, Y + 2, crust);
      }
      if (at(x - 1, y) !== "L") P.rect(X, Y, 2, 16, crust);
      if (at(x + 1, y) !== "L") P.rect(X + 14, Y, 2, 16, crust);
      if (at(x, y + 1) !== "L") P.rect(X, Y + 14, 16, 2, crust);
    }
    function goldPile(X, Y, x, y) {
      floor(X, Y, x, y);
      const g = (c) => c === "g";
      const x0 = g(at(x - 1, y)) ? 0 : 2;
      const x1 = g(at(x + 1, y)) ? 16 : 14;
      const y0 = g(at(x, y - 1)) ? 0 : 3;
      const y1 = g(at(x, y + 1)) ? 16 : 14;
      P.rect(X + x0, Y + y0, x1 - x0, y1 - y0, C.goldD);
      P.rect(X + x0, Y + y0, x1 - x0, y1 - y0 - (y1 === 16 ? 0 : 1), C.gold);
      // köşeleri yuvarla
      const fl = th.floor[0];
      if (x0 && y0) P.px(X + x0, Y + y0, fl);
      if (x1 < 16 && y0) P.px(X + x1 - 1, Y + y0, fl);
      if (x0 && y1 < 16) P.px(X + x0, Y + y1 - 1, fl);
      if (x1 < 16 && y1 < 16) P.px(X + x1 - 1, Y + y1 - 1, fl);
      for (let i = 0; i < 12; i++) {
        const cx = X + x0 + 1 + ri(Math.max(1, x1 - x0 - 3));
        const cy = Y + y0 + 1 + ri(Math.max(1, y1 - y0 - 3));
        P.rect(cx, cy, 2, 1, "#fff3a8");
        P.px(cx, cy + 1, C.goldD);
      }
      if (R() < 0.25) {
        const gx = X + 4 + ri(8);
        const gy = Y + 4 + ri(6);
        const col = pick(["#5ad7ff", "#ff4d5e", "#48e0a0"]);
        P.rect(gx, gy, 2, 2, col);
        P.px(gx, gy, "#ffffff");
      }
      if (R() < 0.15) {
        P.rect(X + 5, Y + 6, 6, 4, "#b8902a");
        P.rect(X + 6, Y + 5, 4, 1, "#e8c050");
        P.px(X + 8, Y + 7, "#ff4d5e");
      }
    }
    function planks(X, Y, x, y) {
      P.rect(X, Y, 16, 16, "#7a5430");
      for (let j = 0; j < 16; j += 4) {
        P.rect(X, Y + j + 3, 16, 1, "#5a3a1a");
        P.px(X + ((j * 3) % 16), Y + j + 1, "#8a6038");
      }
      floorShadow(X, Y, x, y);
    }
    function rails(X, Y, x, y) {
      floor(X, Y, x, y);
      const vert = at(x, y - 1) === "r" || at(x, y + 1) === "r";
      if (vert) {
        for (let j = 1; j < 16; j += 4) P.rect(X + 3, Y + j, 10, 2, C.woodD);
        P.rect(X + 4, Y, 1, 16, C.steelD);
        P.rect(X + 11, Y, 1, 16, C.steelD);
      } else {
        for (let i = 1; i < 16; i += 4) P.rect(X + i, Y + 3, 2, 10, C.woodD);
        P.rect(X, Y + 4, 16, 1, C.steelD);
        P.rect(X, Y + 11, 16, 1, C.steelD);
      }
    }
    function flowers(X, Y, x, y) {
      if (!th.outdoor) {
        floor(X, Y, x, y);
        // parlayan mantarlar
        for (let i = 0; i < 2; i++) {
          const mx = X + 2 + ri(11);
          const my = Y + 4 + ri(9);
          const col = pick(["#5ad7ff", "#a98bff", "#48e0a0"]);
          P.rect(mx, my, 3, 1, col);
          P.px(mx + 1, my - 1, col);
          P.px(mx + 1, my + 1, "#cfc8bb");
        }
        return;
      }
      grass(X, Y);
      for (let i = 0; i < 3; i++) {
        const fx = X + 2 + ri(12);
        const fy = Y + 2 + ri(12);
        const col = pick(th.flower);
        P.px(fx, fy, col);
        P.px(fx - 1, fy, col);
        P.px(fx + 1, fy, col);
        P.px(fx, fy - 1, col);
        P.px(fx, fy, "#ffe14d");
        P.px(fx, fy + 1, th.grass[3]);
      }
    }
    function reeds(X, Y) {
      grass(X, Y);
      for (let i = 0; i < 5; i++) {
        const rx = X + 1 + ri(14);
        const h = 5 + ri(5);
        P.rect(rx, Y + 15 - h, 1, h, th.grass[3]);
        P.rect(rx, Y + 15 - h, 1, 2, "#8a5a2b");
      }
    }

    // 1. katman: zemin
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const c = rows[y][x];
        const X = x * 16;
        const Y = y * 16;
        seedTile(x, y, 1);
        switch (c) {
          case ":": path(X, Y, x, y); break;
          case ",": flowers(X, Y, x, y); break;
          case ";": reeds(X, Y, x, y); break;
          case "~": water(X, Y, x, y); break;
          case "v": ford(X, Y, x, y); break;
          case "=": bridge(X, Y, x, y); break;
          case "b": broken(X, Y, x, y); break;
          case "R": roof(X, Y, x, y); break;
          case "W": case "N": case "D": wallH(X, Y, x, y, c); break;
          case "#": wallC(X, Y, x, y, false); break;
          case "t": wallC(X, Y, x, y, true); break;
          case "k": crystal(X, Y, x, y); break;
          case "x": web(X, Y, x, y); break;
          case "%": bones(X, Y, x, y); break;
          case "L": lava(X, Y, x, y); break;
          case "g": goldPile(X, Y, x, y); break;
          case "p": planks(X, Y, x, y); break;
          case "r": rails(X, Y, x, y); break;
          case "c": crate(X, Y, x, y); break;
          default: ground(X, Y, x, y);
        }
      }
    // 2. katman: üstten taşan nesneler (ağaç, çalı, kaya, çit) — aşağıdakiler öne çıkar
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const c = rows[y][x];
        const X = x * 16;
        const Y = y * 16;
        seedTile(x, y, 2);
        if (c === "T") tree(X, Y);
        else if (c === "B") bush(X, Y);
        else if (c === "o") rock(X, Y);
        else if (c === "f") fence(X, Y, x, y);
      }
    return toCanvas(P);
  }

  return { sprite, spriteURL, paintMap, shade, THEMES, painter, toCanvas };
})();
