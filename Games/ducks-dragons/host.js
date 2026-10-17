/* =========================================================
   Ducks & Dragons — oyunu yöneten taraf (host)
   Odayı kuran oyuncu (ya da tek kişilik oyunda oyuncunun kendisi)
   bütün zarları atar, kuralları uygular ve durumu herkese yollar.
   İstemciler yalnızca niyet gönderir: "şuraya yürü", "şu seçeneği seç".
   ========================================================= */
"use strict";

const host = {
  on: false,
  paths: new Map(),
  leadId: null,
  trail: [],
  checkpoint: null,
};

const D = { roll: 1550, rollShort: 1100, after: 380, step: 150, short: 700, init: 2300, banner: 1400, group: 1900 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const hw = (k, extra = 0) => wait((D[k] + extra) * (st ? st.speed : 1));

/* ---------------- Yayın ---------------- */
let syncQueued = false;
function sync() {
  if (!host.on || !st) return;
  if (syncQueued) return;
  syncQueued = true;
  queueMicrotask(() => {
    syncQueued = false;
    if (!st || !host.on) return;
    net.broadcast({ t: "st", s: st });
    onState();
  });
}
function fx(e) {
  handleFx(e);
  net.broadcast({ t: "fx", e });
}
const log = (e) => fx({ k: "log", e });

/* Hataya düşen bir işlem oyunu kilitli bırakmasın */
function run(fn) {
  Promise.resolve()
    .then(fn)
    .catch((err) => {
      console.error(err);
      if (st) {
        st.busy = false;
        sync();
      }
    });
}

/* ---------------- Yeni oyun ---------------- */
function newState(mode) {
  return {
    mode,
    phase: "lobby",
    scene: null,
    lvl: 1,
    heroes: [],
    allies: [],
    ents: [],
    tmods: [],
    flags: {},
    used: {},
    party: { gold: 30, potion: 2 },
    dialog: null,
    combat: null,
    ending: null,
    busy: false,
    players: {},
    picks: {},
    stats: {},
    speed: settings.fast ? 0.55 : 1,
    hostId: net.myId,
  };
}
function makeHero(cls, owner, pname) {
  const hp = maxHpFor(cls, st.lvl);
  return { id: cls, cls, hero: true, owner, pname: pname || null, proxy: false, x: 0, y: 0, hp, maxHp: hp, cond: {}, uses: {}, down: false, dead: false, stable: false, ds: [0, 0], face: 1, sz: 1 };
}
const newStats = () => ({ crit: 0, ones: 0, dmg: 0, heal: 0, kills: 0 });

async function hostNewGame(list) {
  st.heroes = list.map((p) => makeHero(p.cls, p.owner, p.pname));
  st.stats = {};
  st.heroes.forEach((h) => (st.stats[h.id] = newStats()));
  await enterScene("village");
}

const firstHeroId = () => (st.heroes.find((h) => !h.dead) || st.heroes[0]).id;

function freeNear(x, y, sz = 1) {
  const occ = occMap();
  const seen = new Set([K(x, y)]);
  const q = [[x, y]];
  for (let i = 0; i < q.length; i++) {
    const [cx, cy] = q[i];
    if (footFree(cx, cy, sz, occ, null, false)) return [cx, cy];
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (!inMap(nx, ny) || seen.has(K(nx, ny)) || !tileWalk(nx, ny)) continue;
      seen.add(K(nx, ny));
      q.push([nx, ny]);
    }
  }
  return [x, y];
}

async function enterScene(id) {
  const sc = SCENES[id];
  host.paths.clear();
  host.trail = [];
  host.leadId = null;
  st.scene = id;
  st.tmods = [];
  st.dialog = null;
  st.combat = null;
  st.phase = "explore";
  st.busy = false;
  const n = st.heroes.length;
  st.ents = sc.ents.filter((e) => !e.n || e.n <= n).map((e) => ({ ...clone(e), face: e.face || 1, sz: e.sz || 1 }));
  buildGrid();
  st.heroes.forEach((h) => {
    h.x = -50;
    h.y = -50;
  });
  st.heroes.forEach((h, i) => {
    const [x, y] = sc.spawn[i % sc.spawn.length];
    h.x = x;
    h.y = y;
    h.face = 1;
    h.cond = h.cond && h.cond.inspired ? { inspired: h.cond.inspired } : {};
  });
  for (const a of st.allies) {
    a.x = -50;
    a.y = -50;
  }
  for (const a of st.allies) {
    const [x, y] = freeNear(sc.spawn[0][0], sc.spawn[0][1]);
    a.x = x;
    a.y = y;
    a.cond = {};
  }
  host.checkpoint = clone(st);
  if (st.mode === "solo") saveGame();
  st.busy = true;
  sync();
  fx({ k: "banner", t: "scene", s: id });
  await hw("banner");
  st.busy = false;
  if (sc.intro && st.phase === "explore") await openDialog(sc.intro, firstHeroId());
  else sync();
}

/* ---------------- Keşif: yürüme ---------------- */
function stepTo(c, x, y) {
  if (x !== c.x) c.face = x > c.x ? 1 : -1;
  c.x = x;
  c.y = y;
  net.broadcast({ t: "mv", id: c.id, x, y, f: c.face });
}
function faceTo(c, t) {
  if (t.x + (t.sz || 1) / 2 !== c.x + 0.5) c.face = t.x + (t.sz || 1) / 2 > c.x + 0.5 ? 1 : -1;
}

function intentGo(from, hid, x, y) {
  if (st.phase !== "explore" || st.busy) return;
  const h = heroById(hid);
  if (!h || h.owner !== from || h.dead || h.down || !inMap(x, y)) return;
  if (host.leadId !== h.id) {
    host.leadId = h.id;
    host.trail = [];
  }
  const target = st.ents.find((e) => !e.hidden && e.ev && cellsOf(e).some(([cx, cy]) => cx === x && cy === y));
  const res = bfs(h, 999);
  let goal = null;
  if (target) {
    if (gap(h, target) <= 1) {
      host.paths.delete(h.id);
      faceTo(h, target);
      run(() => openDialog(target.ev, h.id, target.id));
      return;
    }
    let best = 1e9;
    for (const [k, d] of res.dist) {
      const tx = k % 1000;
      const ty = Math.floor(k / 1000);
      if (d < best && gapRect(tx, ty, 1, target.x, target.y, target.sz || 1) === 1 && res.canEnd(tx, ty)) {
        best = d;
        goal = k;
      }
    }
  } else {
    const k = K(x, y);
    if (res.dist.has(k) && res.canEnd(x, y)) goal = k;
    else {
      let best = 1e9;
      for (const [kk, d] of res.dist) {
        const tx = kk % 1000;
        const ty = Math.floor(kk / 1000);
        const score = Math.max(Math.abs(tx - x), Math.abs(ty - y)) * 100 + d;
        if (score < best && res.canEnd(tx, ty)) {
          best = score;
          goal = kk;
        }
      }
    }
  }
  if (goal === null || goal === res.start) {
    host.paths.delete(h.id);
    return;
  }
  host.paths.set(h.id, { path: pathFrom(res, goal), interact: target ? target.id : null, wait: 0 });
}

function exploreTick() {
  if (!host.on || !st || st.phase !== "explore" || st.busy) return;
  for (const h of st.heroes) {
    const p = host.paths.get(h.id);
    if (!p) continue;
    if (!p.path.length) {
      host.paths.delete(h.id);
      arrive(h, p);
      if (st.phase !== "explore") return;
      continue;
    }
    const [nx, ny] = p.path[0];
    const o = occMap().get(K(nx, ny));
    if (o && o !== h && (p.path.length === 1 || !(isCreature(o) && !opposed(o, h)))) {
      if (++p.wait > 4) {
        host.paths.delete(h.id);
        arrive(h, p);
        if (st.phase !== "explore") return;
      }
      continue;
    }
    p.path.shift();
    p.wait = 0;
    const ox = h.x;
    const oy = h.y;
    stepTo(h, nx, ny);
    followStep(h, ox, oy);
    if (checkTriggers(h, ox, oy)) return;
    if (!p.path.length) {
      host.paths.delete(h.id);
      arrive(h, p);
      if (st.phase !== "explore") return;
    }
  }
}

function arrive(h, p) {
  if (!p.interact) return;
  const e = entById(p.interact);
  if (e && !e.hidden && e.ev && gap(h, e) <= 1) {
    faceTo(h, e);
    run(() => openDialog(e.ev, h.id, e.id));
  }
}

/* Tek kişilik oyunda diğer kahramanlar ve yoldaşlar lideri sırayla izler */
function followStep(lead, ox, oy) {
  const followers = [...st.heroes.filter((h) => h !== lead && h.owner === lead.owner && !h.dead && !host.paths.has(h.id)), ...st.allies.filter((a) => !a.dead)];
  if (!followers.length) return;
  if (host.leadId !== lead.id) {
    host.leadId = lead.id;
    host.trail = [];
  }
  host.trail.unshift([ox, oy]);
  if (host.trail.length > 10) host.trail.length = 10;
  followers.forEach((f, i) => {
    const t = host.trail[i];
    if (!t || (f.x === t[0] && f.y === t[1])) return;
    const res = bfs(f, 16);
    const k = K(t[0], t[1]);
    if (!res.dist.has(k)) return;
    const path = pathFrom(res, k);
    if (!path.length) return;
    const o = occMap().get(K(path[0][0], path[0][1]));
    if (o && o !== f) return;
    stepTo(f, path[0][0], path[0][1]);
  });
}

const inRect = (r, x, y) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
function checkTriggers(h, ox, oy) {
  const sc = SCENES[st.scene];
  for (const z of sc.zones || []) {
    if (z.until && st.flags[z.until]) continue;
    if (inRect(z, h.x, h.y) && !inRect(z, ox, oy)) {
      host.paths.clear();
      run(() => openDialog(z.ev, h.id));
      return true;
    }
  }
  const ex = sc.exit;
  if (ex && inRect(ex, h.x, h.y) && !inRect(ex, ox, oy)) {
    host.paths.clear();
    if (condsOk(ex.req)) {
      run(() => openDialog("@travel", h.id));
      return true;
    }
    fx({ k: "toast", m: ex.msg });
  }
  return false;
}

/* ---------------- Diyaloglar ---------------- */
async function openDialog(key, heroId, entId) {
  host.paths.clear();
  const ev = getEv(key);
  if (!ev) return;
  st.phase = "dialog";
  st.dialog = { ev: key, hero: heroId || firstHeroId(), step: "opts", res: null, ent: entId || null, vars: {} };
  const e = entId && entById(entId);
  const h = heroById(st.dialog.hero);
  if (e && h && e.sp && e.sp.startsWith("npc:")) e.face = h.x >= e.x ? 1 : -1;
  if (ev.fx) {
    const deferred = [];
    await applyFx(ev.fx, st.dialog.hero, st.dialog.vars, deferred);
  }
  sync();
}
function closeDialog() {
  st.dialog = null;
  if (st.phase === "dialog") st.phase = "explore";
  sync();
}

async function intentOpt(from, i, hid) {
  if (st.phase !== "dialog" || !st.dialog || st.dialog.step !== "opts" || st.busy) return;
  const key = st.dialog.ev;
  const ev = getEv(key);
  const o = ev.opts[i];
  if (!o || !optVisible(key, o, i)) return;
  const h = heroById(hid);
  if (!h || h.owner !== from || h.dead) return;
  const cost = optCost(o);
  if (cost && st.party.gold < cost) return;
  st.busy = true;
  const dlg = st.dialog;
  dlg.hero = h.id;
  sync();
  let outcome;
  let kind;
  try {
    if (cost) st.party.gold -= cost;
    if (o.check) {
      const ok = await doCheck(o.check, h);
      outcome = ok ? o.ok : o.no;
      kind = ok ? "ok" : "no";
    } else {
      outcome = o.out;
      kind = "out";
    }
    if (o.once) {
      const uk = usedKey(key);
      st.used[uk] = st.used[uk] || [];
      st.used[uk].push(i);
    }
    const vars = { cost };
    const deferred = [];
    await applyFx(outcome.fx || [], h.id, vars, deferred);
    log({ k: "opt", h: nameRef(h), l: o.label, r: kind });
    // zar atılırken diyalog değiştiyse sonucu başka bir diyaloğa yazma
    if (st.dialog !== dlg) return;
    dlg.step = "res";
    dlg.res = { i, k: kind, vars, hero: h.id, deferred };
  } finally {
    st.busy = false;
  }
  if (!outcome.text) {
    await intentCont(from, true);
    return;
  }
  sync();
}

async function intentCont(from, auto) {
  if (st.phase !== "dialog" || !st.dialog || st.dialog.step !== "res" || (st.busy && !auto)) return;
  const { res, ev: key, ent } = st.dialog;
  const o = getEv(key).opts[res.i];
  const outcome = o && (res.k === "ok" ? o.ok : res.k === "no" ? o.no : o.out);
  if (!outcome) {
    closeDialog();
    return;
  }
  const deferred = res.deferred || [];
  if (deferred.length) {
    closeDialog();
    for (const f of deferred) await runDeferred(f, res.hero);
    return;
  }
  if (outcome.next) {
    await openDialog(outcome.next, res.hero, ent);
    return;
  }
  if (outcome.end) {
    closeDialog();
    return;
  }
  st.dialog.step = "opts";
  st.dialog.res = null;
  sync();
}

async function runDeferred(f, heroId) {
  const [k, a, b] = f;
  if (k === "combat") await startCombat(a, b || {});
  else if (k === "goto") await enterScene(a);
  else if (k === "end") finish(a);
  else if (k === "dialog") await openDialog(a, heroId || firstHeroId());
}

/* İlham ve Kutsama zarları; ilham kullanılınca biter */
function extraDice(c, kind) {
  const ex = [];
  if (!c || !c.cond) return ex;
  if (c.cond.bless && (kind === "atk" || kind === "save")) ex.push({ d: 4, r: rnd(4), k: "bless" });
  if (c.cond.inspired) {
    ex.push({ d: 6, r: rnd(6), k: "insp" });
    delete c.cond.inspired;
  }
  return ex;
}
const exSum = (ex) => sum(ex.map((e) => e.r));
function countD20(c, used) {
  const s = c && c.hero && st.stats[c.id];
  if (!s) return;
  if (used === 20) s.crit++;
  if (used === 1) s.ones++;
}

async function doCheck(chk, h) {
  if (chk.group) {
    const heroes = st.heroes.filter((x) => !x.dead);
    const rows = heroes.map((x) => {
      const r = rollD20();
      const ex = extraDice(x, "chk");
      const mod = checkBonus(x, chk.s);
      const tot = r.used + mod + exSum(ex);
      countD20(x, r.used);
      const ok = r.used === 20 || (r.used !== 1 && tot >= chk.dc);
      return { id: x.id, n: nameRef(x), d: r.d, used: r.used, mod, ex, tot, ok };
    });
    const good = rows.filter((r) => r.ok).length;
    const ok = good >= Math.ceil(rows.length / 2);
    fx({ k: "roll", kind: "group", s: chk.s, dc: chk.dc, rows, ok, good });
    log({ k: "grp", s: chk.s, dc: chk.dc, ok, good, of: rows.length });
    await hw("group", rows.length * 120);
    return ok;
  }
  const r = rollD20();
  const ex = extraDice(h, "chk");
  const mod = checkBonus(h, chk.s);
  const tot = r.used + mod + exSum(ex);
  const ok = r.used === 20 || (r.used !== 1 && tot >= chk.dc);
  countD20(h, r.used);
  fx({ k: "roll", kind: "chk", who: h.id, wn: nameRef(h), s: chk.s, d: r.d, used: r.used, mod, ex, tot, vs: chk.dc, res: ok ? "ok" : "fail" });
  log({ k: "chk", h: nameRef(h), s: chk.s, used: r.used, mod, ex: exSum(ex), tot, dc: chk.dc, ok });
  await hw("roll");
  return ok;
}

/* ---------------- Etkiler ---------------- */
async function applyFx(list, heroId, vars, deferred) {
  for (const f of list) {
    const [k, a, b, c, d] = f;
    switch (k) {
      case "flag":
        st.flags[a] = b === undefined ? true : b;
        break;
      case "gold": {
        const amt = typeof a === "number" ? a : rollExpr(a).total;
        st.party.gold = Math.max(0, st.party.gold + amt);
        vars.n = Math.abs(amt);
        fx({ k: "float", id: heroId, txt: `${amt >= 0 ? "+" : ""}${amt} 🪙`, col: "#ffd23f" });
        fx({ k: "sfx", s: "coin" });
        break;
      }
      case "item":
        st.party[a] = (st.party[a] || 0) + b;
        fx({ k: "float", id: heroId, txt: `+${b} 🧪`, col: "#ff8aa8" });
        fx({ k: "sfx", s: "coin" });
        break;
      case "dmg":
        await outsideDamage(a, b, c, d, heroId);
        break;
      case "heal":
        outsideHeal(a, b, heroId);
        break;
      case "cond": {
        const ts = a === "all" ? st.heroes.filter((h) => !h.dead) : [heroById(heroId)];
        for (const t of ts) if (t) t.cond[b] = { t: 99 };
        for (const t of ts) if (t) fx({ k: "anim", type: "inspire", to: t.id });
        fx({ k: "sfx", s: "magic" });
        break;
      }
      case "tiles":
        for (const [x, y, ch] of a) st.tmods.push([x, y, ch]);
        buildGrid();
        fx({ k: "sfx", s: "door" });
        break;
      case "hide": {
        const e = entById(a);
        if (e) e.hidden = true;
        break;
      }
      case "show": {
        const e = entById(a);
        if (e) e.hidden = false;
        break;
      }
      case "open": {
        const e = entById(a);
        if (e) {
          e.sp = "obj:chestOpen";
          e.ev = null;
        }
        fx({ k: "sfx", s: "door" });
        break;
      }
      case "wake": {
        const e = entById(a);
        if (e && e.fsp) e.sp = e.fsp;
        fx({ k: "sfx", s: "roar" });
        break;
      }
      case "ally":
        makeAlly(a);
        break;
      case "level":
        levelUp(a);
        break;
      case "move":
        moveParty(a, b);
        break;
      case "toast":
        fx({ k: "toast", key: `dd.${a}` });
        break;
      case "combat":
      case "goto":
      case "end":
      case "dialog":
        deferred.push(f);
        break;
    }
  }
  sync();
}

async function outsideDamage(dice, who, save, dc, heroId) {
  const targets = who === "all" ? st.heroes.filter((h) => !h.dead) : [heroById(heroId)].filter(Boolean);
  if (save) {
    const base = rollExpr(dice);
    const rows = targets.map((t) => {
      const r = rollD20();
      const ex = extraDice(t, "save");
      const mod = saveBonus(t, save);
      const tot = r.used + mod + exSum(ex);
      const ok = tot >= dc;
      countD20(t, r.used);
      return { id: t.id, n: nameRef(t), d: r.d, used: r.used, mod, ex, tot, ok, amt: ok ? Math.floor(base.total / 2) : base.total };
    });
    fx({ k: "roll", kind: "saves", s: save, dc, dmg: { parts: base.rolls.map((r) => ({ d: base.d, r })), mod: base.mod, tot: base.total }, rows });
    await hw("group", rows.length * 120);
    for (const row of rows) hurtOutside(heroById(row.id), row.amt);
  } else {
    for (const t of targets) hurtOutside(t, rollExpr(dice).total);
  }
  sync();
}
/* Savaş dışında kimse bayılmaz: en fazla 1 cana iner */
function hurtOutside(h, amt) {
  if (!h || amt <= 0) return;
  h.hp = Math.max(1, h.hp - amt);
  fx({ k: "float", id: h.id, txt: `-${amt}`, col: "#ff4d5e" });
  fx({ k: "anim", type: "hurt", to: h.id });
  fx({ k: "sfx", s: "hurt" });
}
function outsideHeal(dice, who, heroId) {
  const targets = who === "all" ? [...st.heroes, ...st.allies].filter((h) => !h.dead) : [heroById(heroId)].filter(Boolean);
  for (const t of targets) {
    const before = t.hp;
    t.hp = dice === "full" ? t.maxHp : Math.min(t.maxHp, t.hp + rollExpr(dice).total);
    if (t.hp > before) fx({ k: "float", id: t.id, txt: `+${t.hp - before}`, col: "#48e0a0" });
    fx({ k: "anim", type: "heal", to: t.id });
  }
  fx({ k: "sfx", s: "heal" });
}
function makeAlly(entId) {
  const e = entById(entId);
  if (!e) return;
  st.ents = st.ents.filter((x) => x !== e);
  const hp = rollExpr(FOES.wolf.hp).total;
  st.allies.push({ id: "wolf", kind: "wolf", ally: true, sp: "ally:wolf", x: e.x, y: e.y, hp, maxHp: hp, cond: {}, face: 1, sz: 1, dead: false });
  fx({ k: "anim", type: "heal", to: "wolf" });
  fx({ k: "sfx", s: "level" });
}
function levelUp(n) {
  if (n <= st.lvl) return;
  st.lvl = n;
  for (const h of st.heroes) {
    h.maxHp = maxHpFor(h.cls, n);
    h.hp = h.maxHp;
  }
  fx({ k: "banner", t: "level", n });
  fx({ k: "sfx", s: "level" });
  log({ k: "lvl", n });
}
function moveParty(x, y) {
  for (const c of [...st.heroes, ...st.allies]) {
    c.x = -50;
    c.y = -50;
  }
  for (const c of [...st.heroes, ...st.allies]) {
    if (c.dead) continue;
    const [nx, ny] = freeNear(x, y);
    c.x = nx;
    c.y = ny;
  }
  host.trail = [];
}

function finish(id) {
  if (id === "slayer" && st.flags.egg) id = "slayerEgg";
  host.paths.clear();
  st.phase = "end";
  st.ending = id;
  st.combat = null;
  st.dialog = null;
  st.busy = false;
  st.party.gold += ENDINGS[id].gold;
  if (st.mode === "solo") clearSave();
  fx({ k: "sfx", s: "victory" });
  sync();
}

/* ---------------- Savaş ---------------- */
function foeHp(F) {
  if (F.hp === "dragon") return 20 + 14 * st.heroes.length;
  return Math.max(3, rollExpr(F.hp).total);
}

async function startCombat(gid, opts) {
  const g = SCENES[st.scene].groups[gid];
  host.paths.clear();
  const foes = [];
  for (const id of g.ents) {
    const e = entById(id);
    if (!e || e.dead || !e.foe || (e.hidden && e.reserve)) continue;
    const F = FOES[e.foe];
    e.hidden = false;
    e.side = "foe";
    e.kind = e.foe;
    e.sp = e.fsp || F.sp;
    e.ev = null;
    e.maxHp = e.hp = foeHp(F);
    e.ac = F.ac;
    e.cond = {};
    e.sz = F.sz || 1;
    e.dead = false;
    e.breathReady = !!F.breath;
    foes.push(e);
  }
  for (const h of st.heroes) {
    h.uses = {};
    h.ds = [0, 0];
    h.stable = false;
  }
  st.phase = "combat";
  st.dialog = null;
  st.busy = true;
  const list = [...st.heroes.filter((h) => !h.dead), ...st.allies.filter((a) => !a.dead), ...foes];
  const rows = list.map((c) => {
    const d = rnd(20);
    const mod = creatureMod(c, "dex");
    return { id: c.id, n: nameRef(c), d, mod, tot: d + mod, p: isParty(c) ? 1 : 0 };
  });
  rows.sort((a, b) => b.tot - a.tot || b.p - a.p);
  let surprised = [];
  if (opts.surprise === "foes") surprised = foes.map((f) => f.id);
  if (opts.surprise === "heroes") surprised = [...st.heroes, ...st.allies].map((c) => c.id);
  st.combat = { gid, round: 1, order: rows.map((r) => r.id), idx: 0, move: 0, act: false, bonus: false, sneak: false, surprised, over: false, waiting: null };
  fx({ k: "banner", t: "combat", sp: opts.surprise || "" });
  fx({ k: "sfx", s: "combat" });
  sync();
  await hw("banner", -500);
  fx({ k: "roll", kind: "init", rows });
  log({ k: "init", rows: rows.map((r) => [r.n, r.tot]) });
  if (st.scene === "lair" && st.flags.salve) {
    for (const h of st.heroes) h.cond.fireRes = { t: 99 };
    log({ k: "txt", m: "dd.log.salve" });
  }
  await hw("init", rows.length * 60);
  if (opts.burn) {
    const r = rollExpr(opts.burn);
    fx({ k: "roll", kind: "dmg", ab: "burn", parts: r.rolls.map((x) => ({ d: r.d, r: x })), mod: 0, tot: r.total });
    for (const f of foes) fx({ k: "anim", type: "fire", to: f.id });
    fx({ k: "sfx", s: "fire" });
    await hw("rollShort");
    for (const f of foes) applyDamage(f, r.total, null, false, "fire");
    sync();
    await hw("after");
    if (checkCombatEnd()) return;
  }
  st.busy = false;
  await startTurn(0);
}

const cur = () => st.combat && cr(st.combat.order[st.combat.idx]);

function checkCombatEnd() {
  const cb = st.combat;
  if (!cb || cb.over) return true;
  if (!liveFoes().length) {
    cb.over = true;
    run(() => endCombat(true));
    return true;
  }
  if (!st.heroes.some((h) => isUp(h))) {
    cb.over = true;
    run(() => endCombat(false));
    return true;
  }
  return false;
}

function tickConds(c, phase) {
  for (const k of Object.keys(c.cond || {})) {
    const cd = c.cond[k];
    if (cd.t >= 99) continue;
    const atEnd = !!(CONDS[k] && CONDS[k].end);
    if ((phase === "end") !== atEnd) continue;
    cd.t--;
    if (cd.t <= 0) delete c.cond[k];
  }
}

async function startTurn(guard) {
  const cb = st.combat;
  if (!cb || cb.over || guard > 80) return;
  if (checkCombatEnd()) return;
  const c = cur();
  if (!c || c.dead || (c.side === "foe" && c.hp <= 0) || (c.hero && (c.stable || c.dead))) return advance(guard);
  cb.move = c.hero ? CLASSES[c.cls].speed : FOES[c.kind].speed;
  cb.act = false;
  cb.bonus = false;
  cb.sneak = false;
  cb.waiting = null;
  if (cb.round === 1 && cb.surprised.includes(c.id)) {
    fx({ k: "float", id: c.id, txt: "!?", col: "#ffd23f" });
    log({ k: "skip", t: nameRef(c), why: "surprise" });
    sync();
    await hw("short");
    return advance(guard);
  }
  const skip = c.cond.stun ? "stun" : c.cond.sleep ? "sleep" : null;
  tickConds(c, "start");
  if (skip) {
    fx({ k: "float", id: c.id, txt: CONDS[skip].icon, col: "#ffffff" });
    log({ k: "skip", t: nameRef(c), why: skip });
    sync();
    await hw("short");
    tickConds(c, "end");
    return advance(guard);
  }
  if (c.hero) {
    if (c.down) {
      cb.move = 0;
      cb.waiting = "ds";
    }
    sync();
    return;
  }
  st.busy = true;
  sync();
  await hw("short", -250);
  try {
    await aiTurn(c);
  } finally {
    if (st) st.busy = false;
  }
  if (!st.combat || st.combat.over) return;
  tickConds(c, "end");
  return advance(guard);
}

async function advance(guard) {
  const cb = st.combat;
  if (!cb || cb.over) return;
  if (checkCombatEnd()) return;
  cb.idx++;
  if (cb.idx >= cb.order.length) {
    cb.idx = 0;
    cb.round++;
  }
  return startTurn(guard + 1);
}

function turnHero(from) {
  const cb = st.combat;
  if (!cb || cb.over || st.busy || st.phase !== "combat") return null;
  const c = cur();
  return c && c.hero && c.owner === from ? c : null;
}

async function intentCMove(from, x, y) {
  const h = turnHero(from);
  const cb = st.combat;
  if (!h || h.down || cb.move <= 0) return;
  const res = bfs(h, cb.move);
  const k = K(x, y);
  if (!res.dist.has(k) || !res.canEnd(x, y) || k === res.start) return;
  const path = pathFrom(res, k);
  st.busy = true;
  sync();
  try {
    for (const [nx, ny] of path) {
      stepTo(h, nx, ny);
      cb.move--;
      fx({ k: "sfx", s: "step" });
      await hw("step");
    }
  } finally {
    st.busy = false;
  }
  sync();
}

async function intentAct(from, id, tid, x, y) {
  const h = turnHero(from);
  if (!h || h.down) return;
  const ab = ABIL[id];
  if (!ab) return;
  if (!heroAbils(h).includes(id) && !GENERIC_ABIL.includes(id)) return;
  if (abilBlock(h, id)) return;
  let target = null;
  let area = null;
  if (ab.tgt === "foe" || ab.tgt === "ally") {
    target = abilTargets(h, id).find((t) => t.id === tid);
    if (!target) return;
  }
  if (ab.tgt === "area") {
    if (!areaOk(h, id, x | 0, y | 0)) return;
    area = { x: x | 0, y: y | 0 };
  }
  const cb = st.combat;
  if (ab.cost === "a") cb.act = true;
  else cb.bonus = true;
  if (ab.uses) h.uses[id] = (h.uses[id] || 0) + 1;
  if (ab.item) st.party[ab.item]--;
  if (target) faceTo(h, target);
  else if (area && area.x !== h.x) h.face = area.x > h.x ? 1 : -1;
  st.busy = true;
  sync();
  try {
    await resolveAbility(h, id, target, area);
  } finally {
    st.busy = false;
  }
  if (!checkCombatEnd()) sync();
}

async function intentEnd(from) {
  const h = turnHero(from);
  if (!h) return;
  if (h.down && !h.stable && !h.dead) return;
  tickConds(h, "end");
  await advance(0);
}

async function intentDS(from) {
  const h = turnHero(from);
  if (!h || !h.down || h.stable || h.dead) return;
  st.busy = true;
  sync();
  const r = rnd(20);
  let res;
  if (r === 20) {
    h.down = false;
    h.hp = 1;
    h.ds = [0, 0];
    res = "revive";
  } else if (r === 1) {
    h.ds[1] += 2;
    res = "fail2";
  } else if (r >= 10) {
    h.ds[0]++;
    res = "ok";
  } else {
    h.ds[1]++;
    res = "fail";
  }
  if (h.ds[1] >= 3) {
    h.dead = true;
    res = "dead";
  } else if (h.ds[0] >= 3) {
    h.stable = true;
    res = "stable";
  }
  countD20(h, r);
  fx({ k: "roll", kind: "ds", who: h.id, wn: nameRef(h), d: [r], used: r, res, ds: h.ds.slice() });
  log({ k: "ds", h: nameRef(h), used: r, res });
  await hw("roll");
  st.busy = false;
  if (res === "dead") fx({ k: "sfx", s: "defeat" });
  if (checkCombatEnd()) return;
  if (res === "revive") {
    st.combat.move = CLASSES[h.cls].speed;
    st.combat.waiting = null;
    fx({ k: "anim", type: "heal", to: h.id });
    sync();
    return;
  }
  tickConds(h, "end");
  await advance(0);
}

/* Ev sahibi, takılan bir oyuncunun sırasını geçebilir */
async function hostSkip(from) {
  if (from !== st.hostId || !st.combat || st.busy) return;
  const c = cur();
  if (!c || !c.hero) return;
  if (c.down && !c.stable && !c.dead) {
    const owner = c.owner;
    c.owner = from;
    await intentDS(from);
    if (heroById(c.id)) heroById(c.id).owner = owner;
    sync();
    return;
  }
  tickConds(c, "end");
  await advance(0);
}

async function resolveAbility(c, id, target, area) {
  const ab = ABIL[id];
  const cb = st.combat;
  if (ab.dash) {
    cb.move += CLASSES[c.cls].speed;
    fx({ k: "float", id: c.id, txt: "👟", col: "#ffffff" });
    log({ k: "use", a: nameRef(c), ab: id });
    fx({ k: "sfx", s: "step" });
    return;
  }
  if (ab.tgt === "self" && ab.cond) {
    c.cond[ab.cond] = { t: 1 };
    fx({ k: "anim", type: ab.anim || "hide", to: c.id });
    fx({ k: "float", id: c.id, txt: CONDS[ab.cond].icon, col: "#ffffff" });
    log({ k: "use", a: nameRef(c), ab: id });
    fx({ k: "sfx", s: "magic" });
    return;
  }
  if (ab.heal) {
    await doHeal(c, target || c, id);
    return;
  }
  if (ab.tgt === "ally" && ab.cond) {
    target.cond[ab.cond] = { t: 99 };
    fx({ k: "anim", type: ab.anim, from: c.id, to: target.id });
    fx({ k: "float", id: target.id, txt: CONDS[ab.cond].icon, col: "#ffffff" });
    log({ k: "use", a: nameRef(c), ab: id, t: nameRef(target) });
    fx({ k: "sfx", s: "magic" });
    return;
  }
  if (ab.tgt === "allies") {
    for (const t of partyCreatures()) if (!t.dead && gap(c, t) <= ab.range) {
      t.cond[ab.cond] = { t: 99 };
      fx({ k: "anim", type: ab.anim, to: t.id });
    }
    log({ k: "use", a: nameRef(c), ab: id });
    fx({ k: "sfx", s: "heal" });
    return;
  }
  if (ab.tgt === "foe" && ab.cond) {
    target.cond[ab.cond] = { t: 99, by: c.id };
    fx({ k: "anim", type: ab.anim, from: c.id, to: target.id });
    fx({ k: "float", id: target.id, txt: CONDS[ab.cond].icon, col: "#ffffff" });
    log({ k: "use", a: nameRef(c), ab: id, t: nameRef(target) });
    fx({ k: "sfx", s: "magic" });
    return;
  }
  if (ab.tgt === "foe") {
    if (ab.roll === "atk") {
      const n = ab.attacks ? ab.attacks[st.lvl - 1] : 1;
      for (let i = 0; i < n; i++) {
        if (!isUp(target)) break;
        await doAttack(c, target, heroProfile(c, id));
        if (!st.combat || st.combat.over) return;
      }
    } else if (ab.roll === "auto") await doAuto(c, target, id);
    else if (ab.roll === "save") await doSaveSpell(c, [target], id);
    return;
  }
  if (ab.tgt === "area") {
    const inside = inArea(area.x, area.y, ab.radius).filter((t) => !t.dead && t !== c && t.hp > 0);
    if (ab.roll === "save") {
      const victims = ab.friendly ? inArea(area.x, area.y, ab.radius).filter((t) => !t.dead && (t.hp > 0 || (t.hero && t.down))) : inside.filter((t) => opposed(c, t));
      await doSaveSpell(c, victims, id, area);
    } else if (ab.roll === "atkEach") {
      await doVolley(c, inside.filter((t) => opposed(c, t)), id, area);
    } else if (ab.sleepPool) {
      await doSleep(c, inside.filter((t) => opposed(c, t)), id, area);
    }
  }
}

function rollDamage(a, t, prof, crit, adv) {
  const parts = [];
  const [n, d, mod] = prof.dmg;
  const mult = crit ? 2 : 1;
  for (let i = 0; i < n * mult; i++) parts.push({ d, r: rnd(d) });
  if (prof.extra) {
    const p = parseDice(prof.extra);
    for (let i = 0; i < p.n * mult; i++) parts.push({ d: p.d, r: rnd(p.d), k: "poison" });
  }
  if (prof.sneak && a.hero && st.combat && !st.combat.sneak && (adv > 0 || flanked(t, a))) {
    const sn = CLASSES[a.cls].sneak[st.lvl - 1];
    for (let i = 0; i < sn * mult; i++) parts.push({ d: 6, r: rnd(6), k: "sneak" });
    st.combat.sneak = true;
  }
  if (t.cond.marked && t.cond.marked.by === a.id) for (let i = 0; i < mult; i++) parts.push({ d: 6, r: rnd(6), k: "mark" });
  let tot = Math.max(1, sum(parts.map((p) => p.r)) + mod);
  const notes = [];
  if (resists(t, prof.dtype)) {
    tot = Math.floor(tot / 2);
    notes.push("half");
  }
  return { parts, mod, tot, type: prof.dtype, notes };
}
function resists(t, type) {
  if (type === "fire" && t.cond && t.cond.fireRes) return true;
  return !t.hero && !t.ally && !!(FOES[t.kind].resist && FOES[t.kind].resist.includes(type));
}

async function doAttack(a, t, prof) {
  let adv = false;
  let dis = false;
  if (a.cond.hidden) {
    adv = true;
    delete a.cond.hidden;
  }
  if (t.cond.stun || t.cond.sleep) adv = true;
  if (t.cond.hidden || t.cond.dodge) dis = true;
  if (a.cond.mocked) {
    dis = true;
    delete a.cond.mocked;
  }
  if (a.cond.poisoned) dis = true;
  if (prof.ranged && adjacentFoe(a)) dis = true;
  if (!a.hero && FOES[a.kind].pack && flanked(t, a)) adv = true;
  const r = rollD20(adv, dis);
  const ex = extraDice(a, "atk");
  const tot = r.used + prof.hit + exSum(ex);
  const crit = r.used === 20;
  const fumble = r.used === 1;
  const ac = t.hero ? CLASSES[t.cls].ac : t.ac;
  const hit = crit || (!fumble && tot >= ac);
  const dmg = hit ? rollDamage(a, t, prof, crit, r.adv) : null;
  countD20(a, r.used);
  const res = crit ? "crit" : fumble ? "fumble" : hit ? "hit" : "miss";
  fx({ k: "roll", kind: "atk", who: a.id, wn: nameRef(a), tgt: t.id, tn: nameRef(t), name: prof.name, d: r.d, used: r.used, adv: r.adv, mod: prof.hit, ex, tot, vs: ac, res, dmg, foe: !isParty(a) });
  await hw("roll", dmg ? 250 : 0);
  fx({ k: "anim", type: prof.anim || "slash", from: a.id, to: t.id, hit });
  fx({ k: "sfx", s: hit ? (crit ? "crit" : "hit") : "miss" });
  log({ k: "atk", a: nameRef(a), t: nameRef(t), n: prof.name, used: r.used, mod: prof.hit, ex: exSum(ex), tot, ac, r: res, dmg: dmg ? dmg.tot : 0 });
  if (hit) {
    applyDamage(t, dmg.tot, a, crit, dmg.type);
    if (prof.poison && isUp(t)) t.cond.poisoned = { t: 1 };
    if (prof.onHit && isUp(t)) {
      const o = prof.onHit;
      const dc = spellDC(a, "str");
      const sr = rollD20();
      const sv = sr.used + saveBonus(t, o.save);
      const ok = sv >= dc;
      log({ k: "save", t: nameRef(t), s: o.save, used: sr.used, tot: sv, dc, ok });
      if (!ok) {
        t.cond[o.cond] = { t: o.t };
        fx({ k: "float", id: t.id, txt: CONDS[o.cond].icon, col: "#ffd23f" });
      } else fx({ k: "float", id: t.id, txt: T("dd.resisted"), col: "#a9a3bd" });
    }
  } else fx({ k: "float", id: t.id, txt: T(fumble ? "dd.fumbleShort" : "dd.missShort"), col: "#a9a3bd" });
  sync();
  await hw("after");
}

function applyDamage(t, amt, src, crit, type) {
  if (!t || t.dead || amt <= 0) return;
  if (t.cond.sleep) delete t.cond.sleep;
  if (src && src.hero && st.stats[src.id]) st.stats[src.id].dmg += Math.min(amt, Math.max(0, t.hp));
  fx({ k: "anim", type: "hurt", to: t.id });
  if (t.hero) {
    if (t.down) {
      t.ds[1] += crit ? 2 : 1;
      fx({ k: "float", id: t.id, txt: "💀", col: "#ff4d5e" });
      if (t.ds[1] >= 3) {
        t.dead = true;
        log({ k: "dead", t: nameRef(t) });
      }
      return;
    }
    t.hp -= amt;
    fx({ k: "float", id: t.id, txt: `-${amt}`, col: crit ? "#ffd23f" : "#ff4d5e", big: crit });
    if (t.hp <= 0) {
      t.hp = 0;
      t.down = true;
      t.ds = [0, 0];
      t.stable = false;
      t.cond = t.cond.inspired ? { inspired: t.cond.inspired } : {};
      log({ k: "down", t: nameRef(t) });
      fx({ k: "sfx", s: "down" });
    }
    return;
  }
  t.hp -= amt;
  fx({ k: "float", id: t.id, txt: `-${amt}`, col: crit ? "#ffd23f" : "#ffffff", big: crit });
  if (t.hp <= 0) {
    t.hp = 0;
    t.dead = true;
    if (src && src.hero && st.stats[src.id]) st.stats[src.id].kills++;
    log({ k: "kill", a: src ? nameRef(src) : null, t: nameRef(t) });
    fx({ k: "anim", type: "die", to: t.id });
    fx({ k: "sfx", s: "kill" });
  }
}

async function doAuto(c, t, id) {
  const ab = ABIL[id];
  const [n, d, m] = ab.dmg;
  const parts = rollDice(n, d).map((r) => ({ d, r }));
  let tot = sum(parts.map((p) => p.r)) + dmgModVal(c, m);
  if (resists(t, ab.dtype)) tot = Math.floor(tot / 2);
  fx({ k: "anim", type: ab.anim, from: c.id, to: t.id, hit: true });
  fx({ k: "roll", kind: "dmg", who: c.id, wn: nameRef(c), tn: nameRef(t), ab: id, parts, mod: dmgModVal(c, m), tot });
  fx({ k: "sfx", s: "magic" });
  await hw("rollShort");
  log({ k: "auto", a: nameRef(c), t: nameRef(t), ab: id, dmg: tot });
  applyDamage(t, tot, c, false, ab.dtype);
  sync();
  await hw("after");
}

async function doSaveSpell(c, targets, id, area) {
  const ab = ABIL[id];
  const dc = spellDC(c, ab.stat);
  const [n, d, m] = ab.dmg;
  const parts = rollDice(n, d).map((r) => ({ d, r }));
  const base = sum(parts.map((p) => p.r)) + dmgModVal(c, m);
  const rows = targets.map((t) => {
    const r = rollD20();
    const ex = extraDice(t, "save");
    const mod = saveBonus(t, ab.save);
    const tot = r.used + mod + exSum(ex);
    const ok = tot >= dc;
    let amt = ok ? (ab.half ? Math.floor(base / 2) : 0) : base;
    if (amt && resists(t, ab.dtype)) amt = Math.floor(amt / 2);
    return { id: t.id, n: nameRef(t), d: r.d, used: r.used, mod, ex, tot, ok, amt, party: isParty(t) };
  });
  if (area) fx({ k: "anim", type: ab.anim, from: c.id, x: area.x, y: area.y });
  else if (targets[0]) fx({ k: "anim", type: ab.anim, from: c.id, to: targets[0].id });
  fx({ k: "sfx", s: ab.dtype === "fire" ? "fire" : "magic" });
  fx({ k: "roll", kind: "saves", who: c.id, wn: nameRef(c), ab: id, s: ab.save, dc, dmg: { parts, mod: dmgModVal(c, m), tot: base }, rows });
  await hw("group", rows.length * 140);
  for (const row of rows) {
    const t = cr(row.id);
    log({ k: "save", a: nameRef(c), ab: id, t: row.n, s: ab.save, used: row.used, tot: row.tot, dc, ok: row.ok, dmg: row.amt });
    if (row.amt) applyDamage(t, row.amt, c, false, ab.dtype);
    else fx({ k: "float", id: row.id, txt: T("dd.resisted"), col: "#a9a3bd" });
    if (!row.ok && ab.onFail && isUp(t)) {
      t.cond[ab.onFail.cond] = { t: ab.onFail.t };
      fx({ k: "float", id: t.id, txt: CONDS[ab.onFail.cond].icon, col: "#ffd23f" });
    }
  }
  sync();
  await hw("after");
}

async function doVolley(c, targets, id, area) {
  const prof = heroProfile(c, id);
  fx({ k: "anim", type: "volley", from: c.id, x: area.x, y: area.y });
  fx({ k: "sfx", s: "miss" });
  const rows = targets.map((t) => {
    const r = rollD20(false, adjacentFoe(c));
    const ex = extraDice(c, "atk");
    const tot = r.used + prof.hit + exSum(ex);
    const crit = r.used === 20;
    const hit = crit || (r.used !== 1 && tot >= t.ac);
    const dmg = hit ? rollDamage(c, t, prof, crit, r.adv) : null;
    countD20(c, r.used);
    return { id: t.id, n: nameRef(t), d: r.d, used: r.used, mod: prof.hit, ex, tot, ok: hit, crit, amt: dmg ? dmg.tot : 0, vs: t.ac };
  });
  fx({ k: "roll", kind: "volley", who: c.id, wn: nameRef(c), ab: id, rows });
  await hw("group", rows.length * 140);
  for (const row of rows) {
    const t = cr(row.id);
    log({ k: "atk", a: nameRef(c), t: row.n, n: ABIL[id].name, used: row.used, mod: row.mod, ex: exSum(row.ex), tot: row.tot, ac: row.vs, r: row.crit ? "crit" : row.ok ? "hit" : "miss", dmg: row.amt });
    if (row.ok) applyDamage(t, row.amt, c, row.crit, "phys");
    else fx({ k: "float", id: row.id, txt: T("dd.missShort"), col: "#a9a3bd" });
  }
  sync();
  await hw("after");
}

async function doSleep(c, targets, id, area) {
  const ab = ABIL[id];
  const parts = rollDice(ab.sleepPool[0], ab.sleepPool[1]).map((r) => ({ d: ab.sleepPool[1], r }));
  let pool = sum(parts.map((p) => p.r));
  const total = pool;
  const slept = [];
  for (const t of targets.slice().sort((a, b) => a.hp - b.hp)) {
    if (t.hp > pool) break;
    pool -= t.hp;
    slept.push(t);
  }
  fx({ k: "anim", type: "sleep", from: c.id, x: area.x, y: area.y });
  fx({ k: "roll", kind: "sleep", who: c.id, wn: nameRef(c), ab: id, parts, tot: total, names: slept.map(nameRef) });
  fx({ k: "sfx", s: "magic" });
  await hw("roll");
  for (const t of slept) {
    t.cond.sleep = { t: 2 };
    fx({ k: "float", id: t.id, txt: "💤", col: "#ffffff" });
  }
  log({ k: "sleep", a: nameRef(c), n: total, names: slept.map(nameRef) });
  sync();
  await hw("after");
}

async function doHeal(c, t, id) {
  const ab = ABIL[id];
  const [n, d, m] = ab.heal;
  const parts = rollDice(n, d).map((r) => ({ d, r }));
  const mod = dmgModVal(c || t, m);
  const amt = Math.max(1, sum(parts.map((p) => p.r)) + mod);
  fx({ k: "anim", type: "heal", from: c ? c.id : null, to: t.id });
  fx({ k: "roll", kind: "heal", who: c ? c.id : t.id, wn: c ? nameRef(c) : null, tn: nameRef(t), ab: id, parts, mod, tot: amt });
  fx({ k: "sfx", s: "heal" });
  await hw("rollShort");
  if (t.dead) return;
  if (t.hero && t.down) {
    t.down = false;
    t.hp = 0;
    t.ds = [0, 0];
    t.stable = false;
  }
  const before = t.hp;
  t.hp = Math.min(t.maxHp, t.hp + amt);
  fx({ k: "float", id: t.id, txt: `+${t.hp - before}`, col: "#48e0a0" });
  if (c && c.hero && st.stats[c.id]) st.stats[c.id].heal += t.hp - before;
  log({ k: "heal", a: c ? nameRef(c) : null, t: nameRef(t), ab: id, amt: t.hp - before });
  sync();
  await hw("after");
}

async function intentPotion(from, tid) {
  if (st.phase !== "explore" || st.busy || !(st.party.potion > 0)) return;
  if (!st.heroes.some((h) => h.owner === from)) return;
  const t = cr(tid);
  if (!t || !isParty(t) || t.dead || t.hp >= t.maxHp) return;
  st.party.potion--;
  st.busy = true;
  sync();
  try {
    await doHeal(null, t, "potion");
  } finally {
    st.busy = false;
  }
  sync();
}

async function endCombat(win) {
  const cb = st.combat;
  st.combat = null;
  st.busy = false;
  host.paths.clear();
  if (!win) {
    st.phase = "defeat";
    fx({ k: "banner", t: "defeat" });
    fx({ k: "sfx", s: "defeat" });
    sync();
    return;
  }
  st.phase = "explore";
  for (const h of st.heroes) {
    if (h.down || h.dead || h.hp <= 0) {
      h.down = false;
      h.dead = false;
      h.hp = Math.max(1, h.hp);
    }
    h.stable = false;
    h.ds = [0, 0];
    h.cond = h.cond.inspired ? { inspired: h.cond.inspired } : {};
  }
  for (const a of st.allies) if (a.dead) log({ k: "txt", m: "dd.log.allyLeft", v: { n: nameRef(a) } });
  st.allies = st.allies.filter((a) => !a.dead);
  for (const a of st.allies) a.cond = {};
  st.ents = st.ents.filter((e) => !(e.side === "foe" && e.dead));
  fx({ k: "banner", t: "victory" });
  fx({ k: "sfx", s: "victory" });
  st.busy = true;
  sync();
  await hw("banner");
  st.busy = false;
  const g = SCENES[st.scene].groups[cb.gid];
  const deferred = [];
  await applyFx(g.win || [], firstHeroId(), {}, deferred);
  for (const f of deferred) await runDeferred(f, firstHeroId());
}

/* ---------------- Düşman yapay zekâsı ---------------- */
function pickTarget(c, list) {
  let best = null;
  let bs = 1e9;
  for (const t of list) {
    const s = gap(c, t) * 1.5 + (t.hp / t.maxHp) * 3 + Math.random() * 2.5 + (t.ally ? 1.5 : 0);
    if (s < bs) {
      bs = s;
      best = t;
    }
  }
  return best;
}

async function aiMove(c, goal, targets) {
  const speed = FOES[c.kind].speed;
  const res = bfs(c, 80);
  let bestK = null;
  let bestD = 1e9;
  for (const [k, d] of res.dist) {
    const x = k % 1000;
    const y = Math.floor(k / 1000);
    if (k !== res.start && !res.canEnd(x, y)) continue;
    if (goal(x, y) && d < bestD) {
      bestD = d;
      bestK = k;
    }
  }
  if (bestK === null) {
    // hedefe ulaşılamıyor: en azından yaklaş
    let bs = 1e9;
    for (const [k, d] of res.dist) {
      if (d > speed) continue;
      const x = k % 1000;
      const y = Math.floor(k / 1000);
      if (k !== res.start && !res.canEnd(x, y)) continue;
      const s = Math.min(...targets.map((t) => gapRect(x, y, c.sz || 1, t.x, t.y, t.sz || 1)));
      if (s < bs) {
        bs = s;
        bestK = k;
      }
    }
  }
  if (bestK === null || bestK === res.start) return;
  const path = pathFrom(res, bestK);
  let n = Math.min(speed, path.length);
  while (n > 0 && !res.canEnd(path[n - 1][0], path[n - 1][1])) n--;
  for (let i = 0; i < n; i++) {
    stepTo(c, path[i][0], path[i][1]);
    await hw("step");
    if (!st.combat) return;
  }
}

function bestBreath(c, B) {
  let best = null;
  for (let y = c.y - B.range - 1; y <= c.y + B.range + 2; y++)
    for (let x = c.x - B.range - 1; x <= c.x + B.range + 2; x++) {
      if (!inMap(x, y) || gapPt(c, x, y) > B.range || tileOpaque(x, y) || !losPt(c, x, y)) continue;
      if (gapRect(x - 1, y - 1, 3, c.x, c.y, c.sz || 1) === 0) continue;
      const vs = inArea(x, y, B.radius).filter((t) => isParty(t) && isUp(t));
      const n = vs.filter((t) => t.hero).length * 1.1 + vs.filter((t) => t.ally).length;
      if (n > 0 && (!best || n > best.n)) best = { x, y, n };
    }
  return best;
}

async function doBreath(c, F, x, y) {
  const B = F.breath;
  const dice = B.dmg[Math.min(st.heroes.length, 6) - 1];
  const base = rollExpr(dice);
  const victims = inArea(x, y, B.radius).filter((t) => t !== c && isParty(t) && !t.dead);
  c.face = x + 0.5 > c.x + 1 ? 1 : -1;
  fx({ k: "anim", type: "breath", from: c.id, x, y });
  fx({ k: "sfx", s: "roar" });
  const rows = victims.map((t) => {
    const r = rollD20();
    const ex = extraDice(t, "save");
    const mod = saveBonus(t, B.save);
    const tot = r.used + mod + exSum(ex);
    const ok = tot >= B.dc;
    let amt = ok ? Math.floor(base.total / 2) : base.total;
    if (resists(t, "fire")) amt = Math.floor(amt / 2);
    countD20(t, r.used);
    return { id: t.id, n: nameRef(t), d: r.d, used: r.used, mod, ex, tot, ok, amt, party: true };
  });
  fx({ k: "roll", kind: "saves", who: c.id, wn: nameRef(c), ab: "breath", s: B.save, dc: B.dc, dmg: { parts: base.rolls.map((r) => ({ d: base.d, r })), mod: 0, tot: base.total }, rows, foe: true });
  await hw("group", rows.length * 140);
  for (const row of rows) {
    log({ k: "save", a: nameRef(c), ab: "breath", t: row.n, s: B.save, used: row.used, tot: row.tot, dc: B.dc, ok: row.ok, dmg: row.amt });
    applyDamage(cr(row.id), row.amt, c, false, "fire");
  }
  sync();
  await hw("after");
}

async function aiTurn(c) {
  const F = FOES[c.kind];
  const targets = () => combatants().filter((t) => opposed(c, t) && isUp(t));
  if (F.breath && !c.breathReady) {
    if (rnd(6) >= 5) {
      c.breathReady = true;
      log({ k: "txt", m: "dd.log.breathReady", v: { n: nameRef(c) } });
      fx({ k: "float", id: c.id, txt: "🔥", col: "#ff8a3d" });
    }
  }
  if (!targets().length) return;
  if (F.breath && c.breathReady) {
    const best = bestBreath(c, F.breath);
    const need = st.heroes.filter(isUp).length >= 2 ? 2 : 1;
    if (best && best.n >= need) {
      await doBreath(c, F, best.x, best.y);
      c.breathReady = false;
      return;
    }
  }
  if (F.ai === "ranged") {
    const shot = foeProfile(F.atk[0]);
    const stab = foeProfile(F.atk[1] || F.atk[0]);
    let adj = targets().filter((t) => gap(c, t) <= 1);
    if (adj.length) {
      await doAttack(c, pickTarget(c, adj), stab);
      return;
    }
    let can = targets().filter((t) => gap(c, t) <= shot.range && los(c, t));
    if (!can.length) {
      const ts = targets();
      await aiMove(c, (x, y) => ts.some((t) => { const g = gapRect(x, y, c.sz || 1, t.x, t.y, t.sz || 1); return g > 1 && g <= shot.range && losPts(x, y, t.x, t.y); }), ts);
      if (!st.combat) return;
      can = targets().filter((t) => gap(c, t) <= shot.range && los(c, t));
      adj = targets().filter((t) => gap(c, t) <= 1);
      if (adj.length) {
        await doAttack(c, pickTarget(c, adj), stab);
        return;
      }
    }
    if (can.length) await doAttack(c, pickTarget(c, can), shot);
    return;
  }
  let adj = targets().filter((t) => gap(c, t) <= 1);
  if (!adj.length) {
    const ts = targets();
    await aiMove(c, (x, y) => ts.some((t) => gapRect(x, y, c.sz || 1, t.x, t.y, t.sz || 1) <= 1), ts);
    if (!st.combat) return;
  }
  const n = F.multi || (F.multiAt && st.heroes.length >= F.multiAt ? 2 : 1);
  for (let i = 0; i < n; i++) {
    adj = targets().filter((t) => gap(c, t) <= 1);
    if (!adj.length) break;
    const atk = F.atk[F.multi ? 0 : Math.min(i, F.atk.length - 1)];
    await doAttack(c, pickTarget(c, adj), foeProfile(atk));
    if (!st.combat || checkCombatEnd()) return;
  }
}

/* ---------------- Lobi ve oyuncular ---------------- */
function lobbyPick(from, cls) {
  if (st.phase !== "lobby" || !CLASSES[cls]) return;
  const curOwner = st.picks[cls];
  if (curOwner && curOwner !== from) return;
  for (const k of Object.keys(st.picks)) if (st.picks[k] === from) delete st.picks[k];
  if (curOwner !== from) st.picks[cls] = from;
  sync();
}
function lobbyStart(from) {
  if (from !== st.hostId || st.phase !== "lobby") return;
  const list = CLASS_ORDER.filter((c) => st.picks[c] && st.players[st.picks[c]]).map((c) => ({ cls: c, owner: st.picks[c], pname: st.players[st.picks[c]].name }));
  if (!list.length) return;
  run(() => hostNewGame(list));
}
function claimHero(from, cls) {
  if (st.phase === "lobby" || st.phase === "end") return;
  if (st.heroes.some((h) => h.owner === from && !h.proxy)) return;
  const p = st.players[from];
  if (!p) return;
  let h = heroById(cls);
  if (h) {
    if (!h.proxy) return;
    h.owner = from;
    h.proxy = false;
    h.pname = p.name;
  } else {
    if (!CLASSES[cls] || st.phase === "combat" || st.busy) return;
    h = makeHero(cls, from, p.name);
    const lead = st.heroes.find((x) => !x.dead) || { x: SCENES[st.scene].spawn[0][0], y: SCENES[st.scene].spawn[0][1] };
    const [x, y] = freeNear(lead.x, lead.y);
    h.x = x;
    h.y = y;
    st.heroes.push(h);
    st.stats[h.id] = newStats();
  }
  fx({ k: "toast", key: "dd.claimed", v: { name: p.name, cls: CLASSES[cls].name } });
  sync();
}
function playerLeft(id) {
  const p = st.players[id];
  if (!p) return;
  delete st.players[id];
  for (const k of Object.keys(st.picks)) if (st.picks[k] === id) delete st.picks[k];
  for (const h of st.heroes)
    if (h.owner === id) {
      h.owner = st.hostId;
      h.proxy = true;
    }
  fx({ k: "toast", key: "dd.left", v: { name: p.name } });
  sync();
}
function hostRetry(from) {
  if (from !== st.hostId || st.phase !== "defeat" || !host.checkpoint) return;
  const players = st.players;
  const speed = st.speed;
  const owners = {};
  st.heroes.forEach((h) => (owners[h.id] = { owner: h.owner, pname: h.pname, proxy: h.proxy }));
  st = clone(host.checkpoint);
  st.players = players;
  st.speed = speed;
  for (const h of st.heroes) if (owners[h.id]) Object.assign(h, owners[h.id]);
  host.paths.clear();
  host.trail = [];
  buildGrid();
  sync();
  fx({ k: "banner", t: "scene", s: st.scene });
}
function playerNameOf(from) {
  const h = st.heroes.find((x) => x.owner === from && !x.proxy);
  if (h) return nameRef(h);
  return (st.players[from] && st.players[from].name) || "?";
}

/* ---------------- Niyetleri dağıt ---------------- */
function hostIntent(from, m) {
  if (!st || !m || typeof m !== "object") return;
  switch (m.a) {
    case "go":
      intentGo(from, m.h, m.x | 0, m.y | 0);
      break;
    case "opt":
      run(() => intentOpt(from, m.i | 0, m.h));
      break;
    case "cont":
      run(() => intentCont(from));
      break;
    case "cmove":
      run(() => intentCMove(from, m.x | 0, m.y | 0));
      break;
    case "act":
      run(() => intentAct(from, m.ab, m.t, m.x, m.y));
      break;
    case "end":
      run(() => intentEnd(from));
      break;
    case "ds":
      run(() => intentDS(from));
      break;
    case "skip":
      run(() => hostSkip(from));
      break;
    case "potion":
      run(() => intentPotion(from, m.t));
      break;
    case "free": {
      const d = m.d | 0;
      if (![4, 6, 8, 10, 12, 20, 100].includes(d)) break;
      const r = rnd(d);
      const n = playerNameOf(from);
      fx({ k: "roll", kind: "free", wn: n, die: d, d: [r], used: r });
      log({ k: "free", n, d, r });
      break;
    }
    case "chat": {
      const txt = String(m.txt || "").replace(/[<>]/g, "").trim().slice(0, 140);
      if (!txt) break;
      const h = st.heroes.find((x) => x.owner === from && !x.proxy);
      fx({ k: "chat", n: playerNameOf(from), id: h ? h.id : null, txt });
      break;
    }
    case "pick":
      lobbyPick(from, m.cls);
      break;
    case "start":
      lobbyStart(from);
      break;
    case "claim":
      claimHero(from, m.cls);
      break;
    case "retry":
      hostRetry(from);
      break;
    case "speed":
      if (from === st.hostId) {
        st.speed = st.speed < 1 ? 1 : 0.55;
        sync();
      }
      break;
  }
}
