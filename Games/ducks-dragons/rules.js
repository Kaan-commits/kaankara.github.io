/* =========================================================
   Ducks & Dragons — kurallar
   Zar, değiştiriciler, ızgara, yol bulma ve görüş hattı.
   Hem oyunu yöneten (host) hem de izleyen istemciler kullanır.
   ========================================================= */
"use strict";

/* ---------------- Genel yardımcılar ---------------- */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const now = () => performance.now();
const clone = (o) => JSON.parse(JSON.stringify(o));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cleanName = (s) => String(s || "").replace(/[<>]/g, "").trim().slice(0, 16);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

/* Gerçek zar: tarayıcının kriptografik rastgele sayı üreticisi */
function rnd(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return 1 + (a[0] % n);
}
function rollDice(n, d) {
  const r = [];
  for (let i = 0; i < n; i++) r.push(rnd(d));
  return r;
}
function parseDice(s) {
  if (typeof s === "number") return { n: 0, d: 0, m: s };
  const m = /^(\d+)d(\d+)([+-]\d+)?$/.exec(String(s).replace(/\s/g, ""));
  if (!m) return { n: 0, d: 0, m: parseInt(s, 10) || 0 };
  return { n: +m[1], d: +m[2], m: m[3] ? +m[3] : 0 };
}
function rollExpr(s) {
  const p = parseDice(s);
  const rolls = rollDice(p.n, p.d);
  return { rolls, d: p.d, mod: p.m, total: sum(rolls) + p.m };
}
function rollD20(adv, dis) {
  const a = rnd(20);
  if (!!adv === !!dis) return { d: [a], used: a, adv: 0 };
  const b = rnd(20);
  return { d: [a, b], used: adv ? Math.max(a, b) : Math.min(a, b), adv: adv ? 1 : -1 };
}

/* Metin: { tr, en } nesnesini seçili dilde döndürür */
function fill(s, vars) {
  s = String(s);
  if (vars) for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
  return s;
}
const L = (o, vars) => fill(o == null ? "" : typeof o === "string" ? o : o[i18n.lang] != null ? o[i18n.lang] : o.tr, vars);
const T = (key, vars) => fill(i18n.t(key), vars);

/* ---------------- Oyun durumu ----------------
   Host'ta asıl durum, istemcide host'tan gelen son kopya */
let st = null;

/* ---------------- Değiştiriciler ---------------- */
const modOf = (score) => Math.floor((score - 10) / 2);
const fmtMod = (n) => (n >= 0 ? `+${n}` : `${n}`);

function creatureMod(c, s) {
  if (!s) return 0;
  if (c.hero) return modOf(CLASSES[c.cls].st[s]);
  const F = FOES[c.kind];
  return F && F.mods ? F.mods[s] || 0 : 0;
}
function checkBonus(h, s) {
  if (!s) return 0;
  const cl = CLASSES[h.cls];
  let b = modOf(cl.st[s]);
  if (cl.skills.includes(s)) b += cl.expert === s ? PROF * 2 : PROF;
  return b;
}
function saveBonus(c, s) {
  if (c.hero) {
    const cl = CLASSES[c.cls];
    return modOf(cl.st[s]) + (cl.saves.includes(s) ? PROF : 0);
  }
  return creatureMod(c, s);
}
const spellDC = (h, stat) => 8 + PROF + creatureMod(h, stat);

function maxHpFor(cls, lvl) {
  const c = CLASSES[cls];
  const con = modOf(c.st.con);
  return c.hd + con + (lvl - 1) * (c.hd / 2 + 1 + con);
}
const abilLvlOk = (id, lvl) => (ABIL[id].lvl || 1) <= lvl;
function usesLeft(c, id) {
  const ab = ABIL[id];
  if (!ab.uses) return Infinity;
  return ab.uses[st.lvl - 1] - ((c.uses && c.uses[id]) || 0);
}
function heroAbils(h) {
  return CLASSES[h.cls].abil.filter((id) => abilLvlOk(id, st.lvl));
}
function dmgModVal(c, m) {
  if (typeof m === "number") return m;
  if (m === "lvl") return st.lvl;
  return creatureMod(c, m);
}
/* Bir kahraman yeteneğinin saldırı profili */
function heroProfile(c, id) {
  const ab = ABIL[id];
  return {
    name: ab.name,
    ab: id,
    hit: PROF + creatureMod(c, ab.stat),
    dmg: ab.dmg ? [ab.dmg[0], ab.dmg[1], dmgModVal(c, ab.dmg[2])] : null,
    dtype: ab.dtype || "phys",
    ranged: ab.range > 1,
    anim: ab.anim,
    sneak: !!ab.sneak,
    onHit: ab.onHit,
  };
}
/* Bir düşman saldırısının profili */
function foeProfile(atk) {
  const p = parseDice(atk.dmg);
  return {
    name: atk.n,
    hit: atk.hit,
    dmg: [p.n, p.d, p.m],
    dtype: "phys",
    ranged: atk.r > 1,
    range: atk.r,
    anim: atk.anim || (atk.r > 1 ? "arrow" : "slash"),
    extra: atk.extra,
    poison: atk.poison,
  };
}

/* ---------------- Yaratıklar ---------------- */
const isParty = (c) => !!(c.hero || c.ally);
const opposed = (a, b) => isParty(a) !== isParty(b);
const isCreature = (o) => !!(o.hero || o.ally || o.side === "foe");
/* Ayakta ve hedeflenebilir */
const isUp = (c) => !!c && !c.dead && c.hp > 0 && !(c.hero && c.down);

function heroById(id) {
  return st.heroes.find((h) => h.id === id);
}
function entById(id) {
  return st.ents.find((e) => e.id === id);
}
function cr(id) {
  return heroById(id) || st.allies.find((a) => a.id === id) || entById(id);
}
function liveFoes() {
  return st.ents.filter((e) => e.side === "foe" && !e.dead);
}
function partyCreatures() {
  return [...st.heroes, ...st.allies.filter((a) => !a.dead)];
}
function combatants() {
  return [...st.heroes.filter((h) => !h.dead), ...st.allies.filter((a) => !a.dead), ...liveFoes()];
}

/* Ekranda/kayıtta gösterilecek isim: { tr, en } ya da düz metin */
function nameRef(c) {
  if (!c) return "?";
  if (c.hero) return c.pname || CLASSES[c.cls].hero;
  if (c.kind && FOES[c.kind]) return FOES[c.kind].name;
  return c.id;
}
const nameOf = (c) => L(nameRef(c));

/* ---------------- Izgara ---------------- */
let grid = null;
const K = (x, y) => y * 1000 + x;

function buildGrid() {
  const sc = SCENES[st.scene];
  const t = sc.map.map((r) => [...r]);
  for (const [x, y, c] of st.tmods) t[y][x] = c;
  grid = { W: t[0].length, H: t.length, t, key: `${st.scene}|${st.tmods.length}` };
}
function tileAt(x, y) {
  return x < 0 || y < 0 || x >= grid.W || y >= grid.H ? "#" : grid.t[y][x];
}
const tileWalk = (x, y) => !BLOCK_TILES.has(tileAt(x, y));
const tileOpaque = (x, y) => OPAQUE_TILES.has(tileAt(x, y));
const inMap = (x, y) => x >= 0 && y >= 0 && x < grid.W && y < grid.H;

/* Hangi karede ne duruyor */
function occMap() {
  const occ = new Map();
  const put = (o) => {
    const sz = o.sz || 1;
    for (let dy = 0; dy < sz; dy++) for (let dx = 0; dx < sz; dx++) occ.set(K(o.x + dx, o.y + dy), o);
  };
  for (const e of st.ents) if (!e.hidden && !e.dead) put(e);
  for (const h of st.heroes) if (!h.dead) put(h);
  for (const a of st.allies) if (!a.dead) put(a);
  return occ;
}

function footFree(x, y, sz, occ, mover, pass) {
  for (let dy = 0; dy < sz; dy++)
    for (let dx = 0; dx < sz; dx++) {
      const tx = x + dx;
      const ty = y + dy;
      if (!tileWalk(tx, ty)) return false;
      const o = occ.get(K(tx, ty));
      if (o && o !== mover) {
        if (!pass) return false;
        // dost yaratıkların içinden geçilebilir ama üstlerinde durulamaz
        if (!(isCreature(o) && !opposed(o, mover) && !(o.hero && o.down))) return false;
      }
    }
  return true;
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

/* Genişlik öncelikli arama: çapraz adımlar da 1 kare sayılır (D&D ızgarası) */
function bfs(mover, maxCost = 999, occ = occMap()) {
  const sz = mover.sz || 1;
  const dist = new Map();
  const prev = new Map();
  const sk = K(mover.x, mover.y);
  dist.set(sk, 0);
  const q = [[mover.x, mover.y]];
  for (let qi = 0; qi < q.length; qi++) {
    const [x, y] = q[qi];
    const d = dist.get(K(x, y));
    if (d >= maxCost) continue;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      const nk = K(nx, ny);
      if (dist.has(nk)) continue;
      if (!footFree(nx, ny, sz, occ, mover, true)) continue;
      if (dx && dy && (!footFree(x + dx, y, sz, occ, mover, true) || !footFree(x, y + dy, sz, occ, mover, true))) continue;
      dist.set(nk, d + 1);
      prev.set(nk, K(x, y));
      q.push([nx, ny]);
    }
  }
  return {
    dist,
    prev,
    start: sk,
    canEnd: (x, y) => footFree(x, y, sz, occ, mover, false),
  };
}
function pathFrom(res, gk) {
  const p = [];
  for (let k = gk; k !== res.start; k = res.prev.get(k)) {
    if (k === undefined || p.length > 999) return [];
    p.push([k % 1000, Math.floor(k / 1000)]);
  }
  return p.reverse();
}

/* İki yaratık arasındaki kare mesafesi (büyük yaratıklar için kenardan kenara) */
function gapRect(ax, ay, as, bx, by, bs) {
  const dx = Math.max(0, bx - (ax + as - 1), ax - (bx + bs - 1));
  const dy = Math.max(0, by - (ay + as - 1), ay - (by + bs - 1));
  return Math.max(dx, dy);
}
const gap = (a, b) => gapRect(a.x, a.y, a.sz || 1, b.x, b.y, b.sz || 1);
const gapPt = (a, x, y) => gapRect(a.x, a.y, a.sz || 1, x, y, 1);

function losPts(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  for (;;) {
    if (x === x1 && y === y1) return true;
    if (!(x === x0 && y === y0) && tileOpaque(x, y)) return false;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}
function cellsOf(c) {
  const out = [];
  const sz = c.sz || 1;
  for (let dy = 0; dy < sz; dy++) for (let dx = 0; dx < sz; dx++) out.push([c.x + dx, c.y + dy]);
  return out;
}
function los(a, b) {
  for (const [ax, ay] of cellsOf(a)) for (const [bx, by] of cellsOf(b)) if (losPts(ax, ay, bx, by)) return true;
  return false;
}
function losPt(a, x, y) {
  for (const [ax, ay] of cellsOf(a)) if (losPts(ax, ay, x, y)) return true;
  return false;
}

/* Bir alandaki (merkez + yarıçap) yaratıklar */
function inArea(cx, cy, r) {
  return combatants().filter((c) => gapRect(cx - r, cy - r, r * 2 + 1, c.x, c.y, c.sz || 1) === 0);
}
function adjacentFoe(c) {
  return combatants().some((o) => opposed(o, c) && isUp(o) && gap(o, c) <= 1);
}
/* Hedefin yanında (saldıranın dışında) saldıranın tarafından ayakta biri var mı */
function flanked(t, a) {
  return combatants().some((o) => o !== a && !opposed(o, a) && isUp(o) && gap(o, t) <= 1);
}

/* ---------------- Hedef geçerliliği (arayüz ve host aynı kuralı kullanır) ---------------- */
function abilTargets(c, id) {
  const ab = ABIL[id];
  if (ab.tgt === "foe") {
    return combatants().filter((t) => opposed(c, t) && isUp(t) && gap(c, t) <= ab.range && (ab.range <= 1 || los(c, t)));
  }
  if (ab.tgt === "ally") {
    return partyCreatures().filter((t) => {
      if (t.dead || (ab.noSelf && t === c)) return false;
      if (ab.cond === "inspired" && !t.hero) return false;
      if (ab.heal && !(t.hp < t.maxHp || (t.hero && t.down))) return false;
      return gap(c, t) <= ab.range && (ab.range <= 1 || los(c, t));
    });
  }
  return [];
}
function areaOk(c, id, x, y) {
  const ab = ABIL[id];
  return inMap(x, y) && gapPt(c, x, y) <= ab.range && !tileOpaque(x, y) && losPt(c, x, y);
}

/* Kahraman bu yeteneği şu an kullanabilir mi? Kullanamıyorsa nedenini döndürür. */
function abilBlock(h, id) {
  const ab = ABIL[id];
  const cb = st.combat;
  if (!cb) return "nocombat";
  if (ab.cost === "a" && cb.act) return "used";
  if (ab.cost === "b" && cb.bonus) return "used";
  if (usesLeft(h, id) <= 0) return "nouses";
  if (ab.item && !(st.party[ab.item] > 0)) return "noitem";
  if (ab.noAdjFoe && adjacentFoe(h)) return "adjfoe";
  if ((ab.tgt === "foe" || ab.tgt === "ally") && !abilTargets(h, id).length) return "notarget";
  return null;
}

/* Koşul listesini değerlendir */
function condOk(c) {
  switch (c[0]) {
    case "flag":
      return !!st.flags[c[1]];
    case "!flag":
      return !st.flags[c[1]];
    case "gold":
      return st.party.gold >= c[1];
    case "any":
      return c[1].some(condOk);
    default:
      return true;
  }
}
const condsOk = (req) => !req || req.every(condOk);

/* ---------------- Olaylar (diyaloglar) ---------------- */
const TRAVEL_GO = { tr: "Yola çık", en: "Set out" };
const TRAVEL_STAY = { tr: "Henüz değil", en: "Not yet" };
function getEv(key) {
  if (key === "@travel") {
    const ex = SCENES[st.scene].exit;
    return {
      sp: "ui:scroll",
      who: SCENES[ex.to].name,
      text: ex.text,
      opts: [
        { label: TRAVEL_GO, out: { fx: [...(ex.fx || []), ["goto", ex.to]] } },
        { label: TRAVEL_STAY, out: { end: true } },
      ],
    };
  }
  return SCENES[st.scene].ev[key];
}
const usedKey = (key) => `${st.scene}.${key}`;
const isUsed = (key, i) => !!(st.used[usedKey(key)] && st.used[usedKey(key)].includes(i));
function optVisible(key, o, i) {
  if (o.once && isUsed(key, i)) return false;
  return condsOk(o.req);
}
function optCost(o) {
  if (!o.cost) return 0;
  if (o.disc && st.flags[o.disc[0]]) return o.disc[1];
  return o.cost;
}
