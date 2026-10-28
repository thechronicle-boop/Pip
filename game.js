/* ===========================================================
   PIP — a fluffy baby penguin virtual pet
   Everything is saved in the browser (localStorage).

   Easy things to change:
   - FOODS   : foods in the shop/fridge (how much they fill, price);
               each food's picture is the icon with the same name in icons.js
   - HATS    : accessories in the closet (SVG drawn over Pip's picture,
               which is 792 x 893: eyes at ~294,237 and ~505,236,
               top of the head at ~396,14)
   - RATES   : how fast stats go down
   Pip's picture is pip.webp. Swap it for another of the same size to restyle.
   ROOMS   : the order you walk through with the arrows
   =========================================================== */
(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const SAVE_KEY = 'pip-save-v1';
  const PIP_W = 792, PIP_H = 893;

  // ---------- content ----------
  const FOODS = {
    fish:     { n: 'Fish',      h: 22, f: 4, price: 14 },
    shrimp:   { n: 'Shrimp',    h: 10, f: 6, price: 9 },
    apple:    { n: 'Apple',     h: 14, price: 10 },
    banana:   { n: 'Banana',    h: 12, price: 8 },
    carrot:   { n: 'Carrot',    h: 10, price: 6 },
    milk:     { n: 'Milk',      h: 8,  en: 6, price: 10 },
    cookie:   { n: 'Cookie',    h: 8,  f: 8, price: 12 },
    sandwich: { n: 'Sandwich',  h: 28, price: 24 },
    pizza:    { n: 'Pizza',     h: 34, f: 6, price: 30 },
    sushi:    { n: 'Sushi',     h: 26, f: 4, price: 28 },
    icecream: { n: 'Ice cream', h: 12, f: 14, price: 20 },
    cake:     { n: 'Cake',      h: 20, f: 18, price: 40 },
  };

  // Each accessory is SVG in Pip's picture coordinates (792 x 893).
  // `box` is the area shown as the little preview in the wardrobe.
  const HATS = {
    none:   { n: 'None', price: 0, svg: '', box: '0 0 10 10' },
    party:  { n: 'Party hat', price: 60, box: '300 -110 192 220', svg:
      '<polygon points="326,104 466,104 396,-84" fill="#ff6fa8" stroke="#2b2140" stroke-width="7" stroke-linejoin="round"/><path d="M346 56 L446 56 M366 6 L426 6" stroke="#fff" stroke-width="13"/><circle cx="396" cy="-84" r="22" fill="#ffd34d" stroke="#2b2140" stroke-width="6"/>' },
    bow:    { n: 'Bow', price: 80, box: '470 40 190 160', svg:
      '<g transform="translate(566 118) rotate(18)"><path d="M0 0 L-80 -46 Q-92 0 -80 46Z" fill="#ff5c8a" stroke="#2b2140" stroke-width="6" stroke-linejoin="round"/><path d="M0 0 L80 -46 Q92 0 80 46Z" fill="#ff5c8a" stroke="#2b2140" stroke-width="6" stroke-linejoin="round"/><circle r="20" fill="#ff8fb0" stroke="#2b2140" stroke-width="6"/></g>' },
    flower: { n: 'Flower', price: 90, box: '150 50 150 150', svg:
      '<g transform="translate(226 126)" stroke="#2b2140" stroke-width="5"><circle cx="0" cy="-34" r="26" fill="#ffb3d1"/><circle cx="32" cy="-10" r="26" fill="#ffb3d1"/><circle cx="20" cy="28" r="26" fill="#ffb3d1"/><circle cx="-20" cy="28" r="26" fill="#ffb3d1"/><circle cx="-32" cy="-10" r="26" fill="#ffb3d1"/><circle r="20" fill="#ffc93d"/></g>' },
    beanie: { n: 'Beanie', price: 140, box: '180 -100 432 280', svg:
      '<g stroke="#2b2140" stroke-width="7" stroke-linejoin="round"><path d="M206 146 Q198 -44 396 -48 Q594 -44 586 146Z" fill="#ff7a59"/><path d="M276 30 Q276 -10 316 -26 M356 -40 V100 M436 -40 V100 M516 30 Q516 -10 476 -26" fill="none" stroke="#e85d3f" stroke-width="11" stroke-linecap="round"/><rect x="190" y="112" width="412" height="58" rx="29" fill="#e85d3f"/><circle cx="396" cy="-60" r="40" fill="#fff"/></g>' },
    cap:    { n: 'Cap', price: 160, box: '180 -60 432 240', svg:
      '<g stroke="#2b2140" stroke-width="7" stroke-linejoin="round"><path d="M214 140 Q210 -30 396 -34 Q582 -30 578 140Z" fill="#4f7cff"/><path d="M396 -34 V140" fill="none" stroke="#3a5fd6" stroke-width="6"/><ellipse cx="396" cy="146" rx="230" ry="34" fill="#3a5fd6"/><circle cx="396" cy="-34" r="15" fill="#3a5fd6"/></g>' },
    shades: { n: 'Shades', price: 220, box: '226 170 346 130', svg:
      '<g stroke="#2b2140" stroke-width="6"><rect x="236" y="180" width="112" height="108" rx="40" fill="#1f1a2e"/><rect x="450" y="180" width="112" height="108" rx="40" fill="#1f1a2e"/><path d="M348 214 Q396 194 450 214" fill="none" stroke-width="12"/></g><path d="M258 208 L298 198 M472 208 L512 198" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".55"/>' },
    headphones: { n: 'Headphones', price: 260, box: '130 -80 532 430', svg:
      '<path d="M186 262 Q150 -64 396 -60 Q642 -64 606 262" stroke="#2b2140" stroke-width="30" fill="none" stroke-linecap="round"/><g stroke="#2b2140" stroke-width="7"><rect x="140" y="206" width="78" height="138" rx="32" fill="#ff5c8a"/><rect x="574" y="206" width="78" height="138" rx="32" fill="#ff5c8a"/></g>' },
    crown:  { n: 'Crown', price: 500, box: '280 -80 232 200', svg:
      '<path d="M300 100 L310 -16 L354 36 L396 -52 L438 36 L482 -16 L492 100Z" fill="#ffd34d" stroke="#2b2140" stroke-width="8" stroke-linejoin="round"/><circle cx="396" cy="66" r="15" fill="#ff5c8a" stroke="#2b2140" stroke-width="5"/><circle cx="342" cy="74" r="10" fill="#4f7cff" stroke="#2b2140" stroke-width="4"/><circle cx="450" cy="74" r="10" fill="#4f7cff" stroke="#2b2140" stroke-width="4"/>' },
  };

  // per-minute change while the game is open
  const RATES = { hunger: -0.8, clean: -0.5, energy: -0.6, fun: -0.7, sleepEnergy: 20 };
  // per-hour change while the game is closed
  const OFFLINE = { hunger: -6, clean: -4, energy: -5, fun: -5, sleepEnergy: 40 };

  const STAT_ICON = { hunger: 'hunger', clean: 'soap', energy: 'moon', fun: 'gamepad' };
  const ROOMS = ['kitchen', 'bath', 'bed', 'play', 'closet'];
  const ROOM_NAMES = { kitchen: 'Kitchen', bath: 'Bathroom', bed: 'Bedroom', play: 'Games', closet: 'Wardrobe' };
  const ROOM_TINT = { kitchen: '#ffd9a0', bath: '#cdeefd', bed: '#d8c8ff', play: '#c6f0bd', closet: '#ffd2e6' };

  // ---------- save / load ----------
  const fresh = () => ({
    stats: { hunger: 70, clean: 80, energy: 85, fun: 75 },
    coins: 120, xp: 0, level: 1,
    food: { fish: 3, shrimp: 2, apple: 2, cookie: 1 },
    hat: 'none', ownedHats: ['none'],
    asleep: false, last: Date.now(), lastDaily: '',
    best: { catch: 0, bounce: 0 }, muted: false,
  });

  let S;
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      S = raw ? Object.assign(fresh(), JSON.parse(raw)) : fresh();
    } catch (e) { S = fresh(); }
    S.stats = Object.assign(fresh().stats, S.stats);
    S.best = Object.assign(fresh().best, S.best);
  }
  function save() {
    S.last = Date.now();
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* private mode etc. */ }
  }
  function clampStats() { for (const k in S.stats) S.stats[k] = clamp(S.stats[k], 0, 100); }

  function applyOffline() {
    const now = Date.now();
    const hrs = Math.min(Math.max(0, (now - (S.last || now)) / 3.6e6), 48);
    if (hrs > 0.01) {
      const s = S.stats, slow = S.asleep ? 0.5 : 1;
      s.hunger += OFFLINE.hunger * hrs * slow;
      s.clean += OFFLINE.clean * hrs * slow;
      s.fun += OFFLINE.fun * hrs * slow;
      s.energy += (S.asleep ? OFFLINE.sleepEnergy : OFFLINE.energy) * hrs;
      clampStats();
    }
    S.last = now;
  }

  // ---------- sound (tiny Web Audio synth, no files needed) ----------
  let actx;
  function ac() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, dur = 0.12, type = 'sine', slide = null, vol = 0.18, delay = 0) {
    if (S && S.muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur = 0.15, vol = 0.15, freq = 1200, delay = 0) {
    if (S && S.muted) return;
    const a = ac(); if (!a) return;
    const t = a.currentTime + delay;
    const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
    const g = a.createGain(); g.gain.value = vol;
    src.connect(f).connect(g).connect(a.destination); src.start(t);
  }
  const SFX = {
    pop: () => tone(520, 0.09, 'sine', 900, 0.2),
    tap: () => tone(700, 0.05, 'triangle', null, 0.12),
    coin: () => { tone(988, 0.08, 'square', null, 0.08); tone(1319, 0.16, 'square', null, 0.08, 0.07); },
    chomp: () => { noise(0.08, 0.25, 700); noise(0.08, 0.25, 600, 0.16); noise(0.08, 0.25, 650, 0.32); },
    giggle: () => { tone(660, 0.07, 'sine', 880, 0.15); tone(740, 0.07, 'sine', 990, 0.15, 0.08); tone(830, 0.1, 'sine', 1100, 0.15, 0.16); },
    nope: () => { tone(300, 0.12, 'sawtooth', 220, 0.08); tone(260, 0.16, 'sawtooth', 180, 0.08, 0.13); },
    scrub: () => noise(0.06, 0.08, 2600),
    splash: () => { noise(0.5, 0.18, 1800); noise(0.4, 0.1, 900, 0.1); },
    bubble: () => tone(rnd(700, 1100), 0.06, 'sine', rnd(1200, 1600), 0.08),
    lightsOff: () => tone(440, 0.3, 'sine', 220, 0.12),
    lightsOn: () => tone(330, 0.25, 'sine', 660, 0.12),
    level: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', null, 0.12, i * 0.09)),
    hit: () => tone(200, 0.25, 'square', 80, 0.1),
    star: () => tone(1046, 0.08, 'triangle', 1568, 0.1),
    boing: () => tone(260, 0.18, 'sine', 620, 0.18),
  };

  // ---------- helpers ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = msg; t.hidden = false;
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 1900);
  }
  function modal(html, buttons) {
    const m = $('#modal'), c = $('#modalCard');
    c.innerHTML = html + '<div class="row"></div>';
    const row = c.querySelector('.row');
    buttons.forEach(([label, fn, ghost]) => {
      const b = document.createElement('button');
      b.className = 'btn' + (ghost ? ' ghost' : '');
      b.textContent = label;
      b.onclick = () => { SFX.tap(); m.hidden = true; fn && fn(); };
      row.append(b);
    });
    m.hidden = false;
  }
  function petClass(cls, ms) {
    const p = $('#pet');
    p.classList.remove(cls); void p.getBoundingClientRect(); p.classList.add(cls);
    setTimeout(() => p.classList.remove(cls), ms);
  }
  function floatIcon(name, x, y) {
    const h = document.createElement('div');
    h.className = 'heart'; h.innerHTML = icon(name);
    h.style.left = x + 'px'; h.style.top = y + 'px';
    document.body.append(h);
    setTimeout(() => h.remove(), 1000);
  }
  function addCoins(n) { S.coins += n; renderHud(); }
  function addXp(n) {
    S.xp += n;
    let need = xpNeed();
    while (S.xp >= need) {
      S.xp -= need; S.level++;
      const bonus = 20 + S.level * 10;
      S.coins += bonus;
      SFX.level();
      setTimeout(() => toast(`Level ${S.level}! +${bonus} coins`), 200);
      need = xpNeed();
    }
    renderHud();
  }
  const xpNeed = () => 60 + S.level * 40;

  // ---------- pet look ----------
  function applyLook() {
    const hat = HATS[S.hat] || HATS.none;
    $('#hat').innerHTML = hat.svg;
  }

  function lowestStat() {
    let k = 'hunger';
    for (const s in S.stats) if (S.stats[s] < S.stats[k]) k = s;
    return k;
  }
  function renderFace() {
    const pet = $('#pet');
    pet.classList.toggle('sleeping', S.asleep);
    const low = lowestStat(), v = S.stats[low];
    pet.classList.toggle('sad', !S.asleep && v < 25);
    const th = $('#thought');
    if (!S.asleep && v < 30) { if (th.dataset.k !== low) { th.innerHTML = icon(STAT_ICON[low]); th.dataset.k = low; } th.hidden = false; }
    else th.hidden = true;
    $('#zzz').hidden = !S.asleep;
    $('#dirt').style.opacity = clamp((65 - S.stats.clean) / 50, 0, 0.9);
  }

  function renderHud() {
    for (const el of $$('.need')) {
      const v = Math.round(S.stats[el.dataset.stat]);
      el.style.setProperty('--v', v);
      el.style.setProperty('--c', v > 50 ? 'var(--good)' : v > 25 ? 'var(--ok)' : 'var(--bad)');
      el.classList.toggle('low', v <= 20);
      el.title = `${el.title.split(':')[0]}: ${v}%`;
    }
    $('#sheetCoins').textContent = Math.floor(S.coins);
    $('#coinNum').textContent = Math.floor(S.coins);
    $('#levelNum').textContent = S.level;
    $('#xpFill').style.width = (S.xp / xpNeed()) * 100 + '%';
    $('#muteBtn').innerHTML = icon(S.muted ? 'soundOff' : 'soundOn');
  }

  // Pip's own eyes: everything inside each eye's outline turns toward your
  // cursor or finger. EYE_SOLO sets how much each eye aims on its own
  // (0 = both move as a pair, 1 = fully separate). The head leans gently toward you, turning from the neck with the scarf. With a mouse they keep watching while it's in the
  // window; with touch they follow your finger, then relax back.
  // EYE_MAX = how far the pupils travel; HEAD_MAX = how far the head leans.
  const EYE_MAX = { x: 7, y: 5 };
  const EYE_SOLO = 0.5; // 0 = eyes move as a pair, 1 = each aims fully on its own
  const HEAD_MAX = { rot: 3, x: 3, y: 2 };
  const EYES = [
    { el: null, id: '#pupilL', x: 288.4, y: 233.9, cx: 0, cy: 0 },
    { el: null, id: '#pupilR', x: 502.7, y: 233.8, cx: 0, cy: 0 },
  ];
  const HEAD = { x: 396, y: 220, rot: 0, tx: 0, ty: 0 };
  let lookTarget = null, lastLook = 0, mouseIn = false;
  const setLook = (e) => {
    lookTarget = [e.clientX, e.clientY]; lastLook = performance.now();
    mouseIn = e.pointerType === 'mouse';
  };
  document.addEventListener('pointermove', setLook);
  document.addEventListener('pointerdown', setLook);
  document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) { mouseIn = false; lastLook = 0; } });
  function updateEyes(now) {
    const r = $('#petTilt').getBoundingClientRect();
    if (!r.width) return;
    const sc = r.width / PIP_W;
    const following = !S.asleep && lookTarget && (mouseIn || now - lastLook < 2500);
    // head lean
    let hr = 0, hx = 0, hy = 0;
    if (following && !scrubbing) {
      const dx = lookTarget[0] - (r.left + HEAD.x * sc), dy = lookTarget[1] - (r.top + HEAD.y * sc);
      const d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 260);
      hr = (dx / d) * m * HEAD_MAX.rot; hx = (dx / d) * m * HEAD_MAX.x; hy = (dy / d) * m * HEAD_MAX.y;
    }
    const kh = following ? 0.09 : 0.05;
    HEAD.rot += (hr - HEAD.rot) * kh; HEAD.tx += (hx - HEAD.tx) * kh; HEAD.ty += (hy - HEAD.ty) * kh;
    $('#petHead').style.transform = `translate(${(HEAD.tx * sc).toFixed(2)}px, ${(HEAD.ty * sc).toFixed(2)}px) rotate(${HEAD.rot.toFixed(2)}deg)`;
    // where a point sits relative to Pip's face, as a gentle 0..1 look vector
    const lookFrom = (px, py) => {
      const dx = lookTarget[0] - (r.left + (px + HEAD.tx) * sc), dy = lookTarget[1] - (r.top + (py + HEAD.ty) * sc);
      const d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 150);
      return [(dx / d) * m, (dy / d) * m];
    };
    const shared = following ? lookFrom(396, 234) : [0, 0];
    for (const eye of EYES) {
      eye.el = eye.el || $(eye.id);
      let tx = 0, ty = 0;
      if (following) {
        const own = lookFrom(eye.x, eye.y);
        tx = (shared[0] * (1 - EYE_SOLO) + own[0] * EYE_SOLO) * EYE_MAX.x;
        ty = (shared[1] * (1 - EYE_SOLO) + own[1] * EYE_SOLO) * EYE_MAX.y;
      }
      const k = following ? 0.18 : 0.08;
      eye.cx += (tx - eye.cx) * k; eye.cy += (ty - eye.cy) * k;
      eye.el.setAttribute('transform', `translate(${eye.cx.toFixed(2)} ${eye.cy.toFixed(2)})`);
    }
  }
  function blinkLoop() {
    setTimeout(() => {
      if (!S.asleep) {
        $('#pet').classList.add('blink');
        setTimeout(() => $('#pet').classList.remove('blink'), 140);
      }
      blinkLoop();
    }, rnd(2500, 5500));
  }

  // ---------- rooms ----------
  let room = 'kitchen';
  let bathTool = 'soap';
  let foodIdx = 0;
  let sheet = null; // 'shop' | 'closet' | 'games' | null
  const CHEV_L = '<svg viewBox="0 0 24 24"><path d="M15 4 L7 12 L15 20"/></svg>';
  const CHEV_R = '<svg viewBox="0 0 24 24"><path d="M9 4 L17 12 L9 20"/></svg>';

  function setRoom(r) {
    if (room === 'bed' && r !== 'bed' && S.asleep) wake(true);
    room = r;
    $('#room').dataset.room = r;
    $('#roomTitle').textContent = ROOM_NAMES[r];
    $('#room').classList.toggle('dark', r === 'bed' && S.asleep);
    $('#sponge').hidden = true;
    $('meta[name="theme-color"]').setAttribute('content', ROOM_TINT[r]);
    renderPanel();
  }
  function stepRoom(dir) {
    const i = ROOMS.indexOf(room);
    SFX.tap();
    setRoom(ROOMS[(i + dir + ROOMS.length) % ROOMS.length]);
  }
  const ownedFoods = () => Object.keys(FOODS).filter((k) => S.food[k] > 0);

  // the round buttons in the middle of the bottom bar
  function renderControls() {
    const c = $('#controls');
    if (room === 'kitchen') {
      const owned = ownedFoods();
      if (!owned.length) {
        c.innerHTML = `<button class="act yellow" data-sheet="shop">${icon('cart')}<small>Buy food</small></button>`;
        return;
      }
      foodIdx = ((foodIdx % owned.length) + owned.length) % owned.length;
      const k = owned[foodIdx];
      c.innerHTML = `<button class="mini" data-fprev aria-label="Previous food">${CHEV_L}</button>
        <button class="act food-big" data-feed="${k}" aria-label="${FOODS[k].n}"><span class="e">${icon(k)}</span><span class="count">${S.food[k]}</span><small>${FOODS[k].n}</small></button>
        <button class="mini" data-fnext aria-label="Next food">${CHEV_R}</button>`;
    } else if (room === 'bath') {
      c.innerHTML = `<button class="act ${bathTool === 'soap' ? 'on' : ''}" data-tool>${icon('soap')}<small>Soap</small></button>
        <button class="act" data-shower>${icon('shower')}<small>Rinse</small></button>`;
    } else if (room === 'bed') {
      c.innerHTML = `<button class="act ${S.asleep ? '' : 'yellow'}" data-lamp>${icon(S.asleep ? 'moon' : 'bulb')}<small>${S.asleep ? 'Wake up' : 'Lights off'}</small></button>`;
    } else if (room === 'play') {
      c.innerHTML = `<button class="act pink" data-sheet="games">${icon('gamepad')}<small>Play</small></button>`;
    } else if (room === 'closet') {
      c.innerHTML = `<button class="act pink" data-sheet="closet">${icon('shirt')}<small>Dress up</small></button>`;
    }
  }

  function openSheet(kind) { sheet = kind; SFX.pop(); renderSheet(); $('#sheet').hidden = false; }
  function closeSheet() { sheet = null; $('#sheet').hidden = true; }
  function renderSheet() {
    if (!sheet) return;
    const body = $('#sheetBody');
    $('#sheetCoins').textContent = Math.floor(S.coins);
    if (sheet === 'shop') {
      $('#sheetTitle').textContent = 'Food shop';
      body.innerHTML = '<div class="grid">' + Object.entries(FOODS).map(([k, f]) =>
        `<button class="item" data-buyfood="${k}"><span class="e">${icon(k)}</span><span class="name">${f.n}</span><span class="price">${icon('coin')} ${f.price}</span><span class="owned">have ${S.food[k] || 0}</span></button>`).join('') + '</div>';
    } else if (sheet === 'closet') {
      $('#sheetTitle').textContent = 'Wardrobe';
      body.innerHTML = '<div class="grid">' + Object.entries(HATS).map(([k, h]) => {
        const own = S.ownedHats.includes(k);
        const prev = k === 'none' ? `<span class="e">${icon('nope')}</span>` : `<svg viewBox="${h.box}">${h.svg}</svg>`;
        return `<button class="item ${S.hat === k ? 'on' : ''}" data-hat="${k}">${prev}<span class="name">${h.n}</span>${own ? `<span class="owned">${S.hat === k ? 'wearing' : 'owned'}</span>` : `<span class="price">${icon('coin')} ${h.price}</span>`}</button>`;
      }).join('') + '</div>';
    } else if (sheet === 'games') {
      $('#sheetTitle').textContent = 'Games';
      body.innerHTML = `<div class="games">
        <button class="game-card catch" data-game="catch"><span class="e">${icon('star')}</span><b>Star Catch</b><small>Best ${S.best.catch} · dodge the storm clouds</small></button>
        <button class="game-card bounce" data-game="bounce"><span class="e"><img class="ic-img" src="pip.webp" alt=""></span><b>Bounce</b><small>Best ${S.best.bounce} · keep Pip in the air</small></button>
      </div>`;
    }
  }
  function renderPanel() { renderControls(); renderSheet(); }

  // ---------- actions ----------
  function feed(key, chip, fromXY) {
    if (S.asleep) return toast('Shh… Pip is asleep');
    if (!S.food[key]) return;
    if (S.stats.hunger >= 97) { SFX.nope(); petClass('shake', 500); return toast("I'm full!"); }
    S.food[key]--;
    const f = FOODS[key];
    const a = chip ? chip.getBoundingClientRect() : { left: fromXY[0], top: fromXY[1], width: 0, height: 0 };
    const m = $('#beakPt').getBoundingClientRect();
    const tx = m.left + m.width / 2, ty = m.top + m.height / 2;
    const fly = document.createElement('div');
    fly.className = 'fly'; fly.innerHTML = icon(key);
    const sx = a.left + a.width / 2, sy = a.top + a.height / 2;
    fly.style.left = sx + 'px'; fly.style.top = sy + 'px';
    document.body.append(fly);
    SFX.pop();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fly.style.transform = `translate(${tx - sx}px, ${ty - sy}px) scale(.45)`;
    }));
    setTimeout(() => $('#pet').classList.add('eating'), 300);
    setTimeout(() => {
      fly.remove();
      SFX.chomp();
      setTimeout(() => { $('#pet').classList.remove('eating'); petClass('squish', 450); }, 520);
      S.stats.hunger += f.h; S.stats.fun += f.f || 0; S.stats.energy += f.en || 0;
      clampStats(); addXp(3); renderFace(); renderHud(); renderPanel(); save();
    }, 520);
  }

  function buyFood(k) {
    const f = FOODS[k];
    if (S.coins < f.price) { SFX.nope(); return toast('Not enough coins. Play a game!'); }
    S.coins -= f.price; S.food[k] = (S.food[k] || 0) + 1;
    SFX.coin(); renderHud(); renderPanel(); save();
  }

  function pickHat(k) {
    const h = HATS[k];
    if (!S.ownedHats.includes(k)) {
      if (S.coins < h.price) { SFX.nope(); return toast(`Need ${h.price} coins`); }
      S.coins -= h.price; S.ownedHats.push(k); SFX.coin();
      toast(`${h.n} unlocked!`);
    } else SFX.tap();
    S.hat = S.hat === k && k !== 'none' ? 'none' : k;
    applyLook(); petClass('happyjump', 700);
    renderHud(); renderPanel(); save();
  }

  function toggleLamp() {
    if (S.asleep) return wake(false);
    if (S.stats.energy >= 98) { SFX.nope(); petClass('shake', 500); return toast("I'm not sleepy!"); }
    S.asleep = true; SFX.lightsOff();
    $('#room').classList.add('dark');
    renderFace(); renderPanel(); save();
  }
  function wake(silent) {
    S.asleep = false;
    if (!silent) SFX.lightsOn();
    $('#room').classList.remove('dark');
    renderFace(); renderPanel(); save();
    if (!silent) petClass('happyjump', 700);
  }

  // tickle / scrub on the pet
  let lastTickle = 0, scrubbing = false, lastBubble = 0;
  function petPoint(e) {
    const r = $('#petFx').getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * PIP_W, ((e.clientY - r.top) / r.height) * PIP_H];
  }
  // reads Pip's outline from the picture so taps and scrubbing only count on Pip
  let alphaMap = null;
  function buildAlphaMap() {
    try {
      const c = document.createElement('canvas'); c.width = PIP_W; c.height = PIP_H;
      const g = c.getContext('2d'); g.drawImage(PIP, 0, 0, PIP_W, PIP_H);
      const d = g.getImageData(0, 0, PIP_W, PIP_H).data;
      alphaMap = new Uint8Array(PIP_W * PIP_H);
      for (let i = 0; i < alphaMap.length; i++) alphaMap[i] = d[i * 4 + 3];
    } catch (err) { alphaMap = null; } // e.g. opened straight from a file: fall back to an oval
  }
  function onBody(x, y) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= PIP_W || y >= PIP_H) return false;
    if (alphaMap) return alphaMap[y * PIP_W + x] > 120;
    return ((x - 396) / 380) ** 2 + ((y - 450) / 440) ** 2 < 1;
  }
  function addBubble(x, y) {
    const g = $('#bubbles');
    if (g.childElementCount > 70) g.firstElementChild.remove();
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x + rnd(-22, 22)); c.setAttribute('cy', y + rnd(-22, 22));
    c.setAttribute('r', rnd(18, 40).toFixed(1));
    c.setAttribute('fill', 'rgba(255,255,255,.88)');
    c.setAttribute('stroke', '#9fd6f5'); c.setAttribute('stroke-width', '4');
    g.append(c);
  }
  function scrubAt(e) {
    const [x, y] = petPoint(e);
    if (!onBody(x, y)) return;
    const now = performance.now();
    if (now - lastBubble < 45) return;
    lastBubble = now;
    addBubble(x, y);
    if (Math.random() < 0.35) SFX.bubble(); else if (Math.random() < 0.3) SFX.scrub();
    S.stats.clean = clamp(S.stats.clean + 0.7, 0, 100);
    if (Math.random() < 0.08) SFX.giggle();
    renderFace(); renderHud();
  }
  function rinse() {
    if (S.asleep) return;
    const sh = $('#shower');
    sh.innerHTML = Array.from({ length: 36 }, () => `<i style="left:${rnd(4, 96)}%;animation-delay:${rnd(0, 0.6).toFixed(2)}s;animation-duration:${rnd(0.45, 0.75).toFixed(2)}s"></i>`).join('');
    sh.hidden = false; SFX.splash();
    const bubbles = [...$('#bubbles').children];
    const gain = 4 + Math.min(10, bubbles.length * 0.15);
    bubbles.forEach((b, i) => setTimeout(() => b.remove(), 100 + i * 18));
    setTimeout(() => {
      sh.hidden = true; sh.innerHTML = '';
      S.stats.clean = clamp(S.stats.clean + gain, 0, 100);
      if (S.stats.clean >= 95) { toast('Squeaky clean! ' + icon('sparkle')); addXp(4); }
      petClass('squish', 450); renderFace(); renderHud(); save();
    }, 1300);
  }

  function bindPet() {
    const pet = $('#pet');
    const sponge = $('#sponge');
    pet.addEventListener('pointerdown', (e) => {
      ac();
      if (room === 'bath' && bathTool === 'soap' && !S.asleep) {
        scrubbing = true; pet.setPointerCapture(e.pointerId);
        sponge.hidden = false; sponge.style.left = e.clientX + 'px'; sponge.style.top = e.clientY + 'px';
        scrubAt(e); return;
      }
      if (S.asleep) { toast('Zzz… let Pip sleep'); return; }
      const [x, y] = petPoint(e);
      if (!onBody(x, y)) return;
      const now = performance.now();
      if (now - lastTickle < 350) return;
      lastTickle = now;
      petClass('squish', 450); SFX.giggle();
      floatIcon(Math.random() < 0.7 ? 'heart' : 'sparkle', e.clientX, e.clientY - 10);
      S.stats.fun = clamp(S.stats.fun + 1.5, 0, 100);
      addXp(1); renderFace(); renderHud();
    });
    pet.addEventListener('pointermove', (e) => {
      if (!scrubbing) return;
      sponge.style.left = e.clientX + 'px'; sponge.style.top = e.clientY + 'px';
      scrubAt(e);
    });
    const end = () => { if (scrubbing) { scrubbing = false; sponge.hidden = true; save(); } };
    pet.addEventListener('pointerup', end);
    pet.addEventListener('pointercancel', end);
  }

  // drag food from the bottom bar onto Pip (a plain tap feeds too)
  function bindFoodDrag() {
    const ghost = $('#dragFood');
    let drag = null;
    $('#controls').addEventListener('pointerdown', (e) => {
      const b = e.target.closest('.food-big'); if (!b) return;
      ac();
      drag = { key: b.dataset.feed, el: b, x0: e.clientX, y0: e.clientY, moved: false };
      b.setPointerCapture(e.pointerId);
    });
    $('#controls').addEventListener('pointermove', (e) => {
      if (!drag) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 10) {
        drag.moved = true; ghost.innerHTML = icon(drag.key); ghost.hidden = false; drag.el.classList.add('dragging');
      }
      if (drag.moved) {
        ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
        const r = $('#pet').getBoundingClientRect();
        $('#pet').classList.toggle('target', e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom);
      }
    });
    const end = (e) => {
      if (!drag) return;
      const d = drag; drag = null;
      ghost.hidden = true; d.el.classList.remove('dragging'); $('#pet').classList.remove('target');
      if (!d.moved) return feed(d.key, d.el);
      const r = $('#pet').getBoundingClientRect();
      if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) feed(d.key, null, [e.clientX, e.clientY]);
      else SFX.tap();
    };
    $('#controls').addEventListener('pointerup', end);
    $('#controls').addEventListener('pointercancel', end);
  }

  function handleButton(t) {
    ac();
    const d = t.dataset;
    if (d.feed) return; // handled by the drag code
    if ('fprev' in d) { foodIdx--; SFX.tap(); renderControls(); }
    else if ('fnext' in d) { foodIdx++; SFX.tap(); renderControls(); }
    else if (d.sheet) openSheet(d.sheet);
    else if (d.buyfood) buyFood(d.buyfood);
    else if ('tool' in d) { bathTool = bathTool === 'soap' ? 'none' : 'soap'; SFX.tap(); renderControls(); }
    else if ('shower' in d) rinse();
    else if ('lamp' in d) toggleLamp();
    else if (d.game) { closeSheet(); startGame(d.game); }
    else if (d.hat) pickHat(d.hat);
  }
  function bindPanel() {
    $('#controls').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) handleButton(t); });
    $('#sheetBody').addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) handleButton(t); });
    $('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') { SFX.tap(); closeSheet(); } });
    $('#sheetClose').addEventListener('click', () => { SFX.tap(); closeSheet(); });
    $('#prevRoom').addEventListener('click', () => { ac(); stepRoom(-1); });
    $('#nextRoom').addEventListener('click', () => { ac(); stepRoom(1); });
    $('#shopBtn').addEventListener('click', () => { ac(); openSheet('shop'); });
    $('#muteBtn').addEventListener('click', () => { S.muted = !S.muted; renderHud(); save(); if (!S.muted) SFX.tap(); });
    window.addEventListener('keydown', (e) => {
      if (G.running || !$('#modal').hidden) return;
      if (e.key === 'Escape') closeSheet();
      if (sheet) return;
      if (e.key === 'ArrowLeft') stepRoom(-1);
      if (e.key === 'ArrowRight') stepRoom(1);
    });
    // swipe left / right on the room to walk between rooms
    let sw = null;
    $('#room').addEventListener('pointerdown', (e) => {
      if (e.target.closest('#pet, .bottombar, .hud, button')) return;
      sw = [e.clientX, e.clientY];
    });
    $('#room').addEventListener('pointerup', (e) => {
      if (!sw) return;
      const dx = e.clientX - sw[0], dy = e.clientY - sw[1]; sw = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepRoom(dx < 0 ? 1 : -1);
    });
  }

  // ---------- game loop for stats ----------
  let tickCount = 0;
  function tick() {
    const s = S.stats, m = 1 / 60;
    const slow = S.asleep ? 0.4 : 1;
    s.hunger += RATES.hunger * m * slow;
    s.clean += RATES.clean * m * slow;
    s.fun += RATES.fun * m * slow;
    s.energy += (S.asleep ? RATES.sleepEnergy : RATES.energy) * m;
    clampStats();
    if (S.asleep && s.energy >= 100 && room === 'bed') { wake(false); toast('Pip woke up refreshed! ' + icon('sun')); }
    renderHud(); renderFace();
    if (++tickCount % 5 === 0) save();
  }

  function dailyGift() {
    const today = new Date().toDateString();
    if (S.lastDaily === today) return;
    S.lastDaily = today;
    const gift = 40 + Math.min(60, S.level * 5);
    S.coins += gift; save(); renderHud();
    setTimeout(() => { SFX.coin(); modal(`<div class="big-e">${icon('gift')}</div><h2>Daily gift</h2><p>Pip found <b>${gift} coins</b> for you today.</p>`, [['Yay!']]); }, 600);
  }

  // =================================================================
  //   MINI-GAMES
  // =================================================================
  const G = { running: false, raf: 0 };
  const cv = $('#gameCanvas'), cx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  function sizeCanvas() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', () => { if (G.running) sizeCanvas(); });

  const PIP = new Image();
  PIP.src = 'pip.webp';
  function drawPet(x, y, r, squash = 0, look = 0) {
    const w = r * 2.3, h = w * (PIP_H / PIP_W);
    cx.save(); cx.translate(x, y + h * 0.42);
    cx.rotate(look * 0.03); cx.scale(1 + squash, 1 - squash);
    if (PIP.complete && PIP.naturalWidth) cx.drawImage(PIP, -w / 2, -h, w, h);
    else { cx.fillStyle = '#3d4a78'; cx.beginPath(); cx.arc(0, -h / 2, r, 0, 7); cx.fill(); }
    cx.restore();
  }
  function drawStar(x, y, r, color, rot) {
    cx.save(); cx.translate(x, y); cx.rotate(rot);
    cx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
      cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    cx.closePath(); cx.fillStyle = color; cx.fill();
    cx.lineWidth = Math.max(2.5, r * 0.16); cx.lineJoin = 'round'; cx.strokeStyle = '#2b2140'; cx.stroke();
    cx.restore();
  }
  function drawCloud(x, y, r) {
    const blob = () => { cx.beginPath(); cx.arc(x - r * 0.5, y, r * 0.55, 0, 7); cx.moveTo(x + r * 1.05, y); cx.arc(x + r * 0.5, y, r * 0.55, 0, 7); cx.moveTo(x + r * 0.7, y - r * 0.35); cx.arc(x, y - r * 0.35, r * 0.7, 0, 7); };
    cx.strokeStyle = '#2b2140'; cx.lineWidth = 7; blob(); cx.stroke();
    cx.fillStyle = '#6c6688'; blob(); cx.fill();
    cx.strokeStyle = '#2b2140'; cx.lineWidth = 8; cx.lineJoin = 'round'; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(x + 2, y + r * 0.4); cx.lineTo(x - 8, y + r * 0.95); cx.lineTo(x + 4, y + r * 0.95); cx.lineTo(x - 6, y + r * 1.5); cx.stroke();
    cx.strokeStyle = '#ffd34d'; cx.lineWidth = 4; cx.stroke();
  }
  function bgStars(t) {
    for (let i = 0; i < 40; i++) {
      const x = (i * 97.3) % W, y = (i * 53.7 + t * (8 + (i % 4) * 6)) % H;
      cx.fillStyle = `rgba(255,255,255,${0.25 + (i % 3) * 0.2})`;
      cx.fillRect(x, y, 2, 2);
    }
  }

  function startGame(type) {
    if (S.asleep) return toast('Pip is asleep');
    if (S.stats.energy < 12) { SFX.nope(); petClass('shake', 500); return toast('Too sleepy to play… ' + icon('sleepy')); }
    sizeCanvas();
    $('#game').hidden = false;
    G.type = type; G.running = true; G.score = 0; G.t = 0; G.last = performance.now();
    G.over = false; G.parts = [];
    if (type === 'catch') {
      G.lives = 3; G.items = []; G.spawn = 0; G.px = W / 2; G.tx = W / 2; G.squash = 0;
      $('#gameHint').textContent = 'Drag to catch the stars!';
    } else {
      G.ball = { x: W / 2, y: H * 0.35, vx: 0, vy: 0, r: Math.min(52, W * 0.12), sq: 0 };
      G.started = false;
      $('#gameHint').textContent = 'Tap Pip to bounce!';
    }
    $('#gameHint').style.opacity = 1;
    updateGameHud();
    cancelAnimationFrame(G.raf);
    G.raf = requestAnimationFrame(gameFrame);
  }
  function updateGameHud() {
    $('#gameScore').innerHTML = icon(G.type === 'catch' ? 'star' : 'bubble') + ' ' + G.score;
    $('#gameLives').innerHTML = G.type === 'catch' ? icon('heart').repeat(G.lives) + icon('heartEmpty').repeat(3 - G.lives) : `Best ${S.best.bounce}`;
  }
  function burst(x, y, color, n = 10) {
    for (let i = 0; i < n; i++) G.parts.push({ x, y, vx: rnd(-160, 160), vy: rnd(-220, 40), life: 0.6, color });
  }
  function gameFrame(now) {
    if (!G.running) return;
    const dt = Math.min(0.033, (now - G.last) / 1000); G.last = now; G.t += dt;
    if (G.type === 'catch') frameCatch(dt); else frameBounce(dt);
    // particles
    for (const p of G.parts) { p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
    G.parts = G.parts.filter((p) => p.life > 0);
    for (const p of G.parts) { cx.globalAlpha = Math.max(0, p.life / 0.6); cx.fillStyle = p.color; cx.fillRect(p.x - 3, p.y - 3, 6, 6); }
    cx.globalAlpha = 1;
    G.raf = requestAnimationFrame(gameFrame);
  }

  function frameCatch(dt) {
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1d1838'); g.addColorStop(1, '#4a3f8f');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    bgStars(G.t);
    if (G.over) return;
    const speed = 1 + G.t * 0.035;
    G.spawn -= dt;
    if (G.spawn <= 0) {
      G.spawn = Math.max(0.32, 0.85 - G.t * 0.012);
      const roll = Math.random();
      const kind = roll < 0.07 ? 'gold' : roll < 0.07 + Math.min(0.38, 0.18 + G.t * 0.004) ? 'cloud' : 'star';
      G.items.push({ x: rnd(30, W - 30), y: -40, vy: (H * 0.26 + rnd(0, 60)) * speed, kind, rot: rnd(0, 6), spin: rnd(-3, 3) });
    }
    G.px += (G.tx - G.px) * Math.min(1, dt * 14);
    const pr = Math.min(40, W * 0.09), py = H - pr - 70;
    G.squash *= 0.86;
    for (const it of G.items) {
      it.y += it.vy * dt; it.rot += it.spin * dt;
      const hitR = it.kind === 'cloud' ? 30 : 18;
      if (!it.dead && Math.hypot(it.x - G.px, it.y - py) < pr + hitR - 6) {
        it.dead = true;
        if (it.kind === 'cloud') { G.lives--; SFX.hit(); burst(it.x, it.y, '#9a93b8'); navigator.vibrate && navigator.vibrate(60); }
        else { const v = it.kind === 'gold' ? 5 : 1; G.score += v; G.squash = 0.18; it.kind === 'gold' ? SFX.coin() : SFX.star(); burst(it.x, it.y, it.kind === 'gold' ? '#ffd34d' : '#fff7b0', it.kind === 'gold' ? 16 : 8); }
        updateGameHud();
        if (G.lives <= 0) return endGame();
      }
    }
    G.items = G.items.filter((it) => !it.dead && it.y < H + 60);
    for (const it of G.items) {
      if (it.kind === 'cloud') drawCloud(it.x, it.y, 30);
      else if (it.kind === 'gold') { drawStar(it.x, it.y, 22, '#ffc93d', it.rot); drawStar(it.x, it.y, 10, '#fff1a8', it.rot); }
      else drawStar(it.x, it.y, 17, '#fff3a0', it.rot);
    }
    drawPet(G.px, py, pr, G.squash, clamp((G.tx - G.px) / 30, -3, 3));
    if (G.t > 2.2) $('#gameHint').style.opacity = 0;
  }

  function frameBounce(dt) {
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#ffd6c2'); g.addColorStop(1, '#ff9fb8');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) {
      cx.fillStyle = 'rgba(255,255,255,.35)';
      const x = ((i * 173 + G.t * 20 * (1 + i % 3)) % (W + 160)) - 80, y = 90 + i * 70;
      cx.beginPath(); cx.arc(x, y, 26, 0, 7); cx.arc(x + 28, y + 6, 20, 0, 7); cx.arc(x - 26, y + 8, 18, 0, 7); cx.fill();
    }
    cx.fillStyle = 'rgba(255,255,255,.4)'; cx.fillRect(0, H - 30, W, 30);
    if (G.over) return;
    const b = G.ball;
    if (G.started) {
      const grav = 1500 + Math.min(900, G.score * 25);
      b.vy += grav * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.9; SFX.tap(); }
      if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * 0.9; SFX.tap(); }
      if (b.y - b.r > H) return endGame();
    } else {
      b.y = H * 0.35 + Math.sin(G.t * 3) * 10;
    }
    b.sq *= 0.85;
    cx.fillStyle = 'rgba(43,33,64,.12)';
    const sh = clamp(1 - (H - 30 - b.y) / H, 0.2, 1);
    cx.beginPath(); cx.ellipse(b.x, H - 22, b.r * sh, 6 * sh, 0, 0, 7); cx.fill();
    drawPet(b.x, b.y, b.r, b.sq, clamp(b.vx / 200, -3, 3));
  }

  function gamePointer(e) {
    if (!G.running || G.over) return;
    if (G.type === 'catch') { G.tx = clamp(e.clientX, 30, W - 30); return; }
    if (e.type !== 'pointerdown') return;
    const b = G.ball;
    if (Math.hypot(e.clientX - b.x, e.clientY - b.y) < b.r * 1.8) {
      G.started = true;
      b.vy = -Math.min(1250, 780 + G.score * 14);
      b.vx = clamp((b.x - e.clientX) * 9 + rnd(-80, 80), -420, 420);
      b.sq = 0.22; G.score++;
      SFX.boing(); burst(e.clientX, e.clientY, '#fff', 6);
      updateGameHud();
      $('#gameHint').style.opacity = 0;
    }
  }
  cv.addEventListener('pointerdown', (e) => { ac(); gamePointer(e); });
  cv.addEventListener('pointermove', gamePointer);
  window.addEventListener('keydown', (e) => {
    if (!G.running || G.type !== 'catch') return;
    if (e.key === 'ArrowLeft') G.tx = clamp(G.tx - 60, 30, W - 30);
    if (e.key === 'ArrowRight') G.tx = clamp(G.tx + 60, 30, W - 30);
  });
  $('#gameClose').addEventListener('click', () => { SFX.tap(); endGame(true); });

  function endGame(quit) {
    if (G.over) return;
    G.over = true;
    const type = G.type, score = G.score;
    const coins = type === 'catch' ? score : score * 2;
    const isBest = score > S.best[type];
    if (isBest) S.best[type] = score;
    if (score > 0 || !quit) {
      S.stats.fun += Math.min(25, 8 + score);
      S.stats.energy -= 8; S.stats.hunger -= 4;
      clampStats();
    }
    S.coins += coins;
    addXp(Math.min(30, 2 + Math.floor(score / 2)));
    save();
    const close = () => {
      G.running = false; cancelAnimationFrame(G.raf);
      $('#game').hidden = true;
      renderHud(); renderFace(); renderPanel();
    };
    if (quit && score === 0) return close();
    SFX.coin();
    setTimeout(() => modal(
      `<div class="big-e">${icon(isBest ? 'trophy' : type === 'catch' ? 'star' : 'bubble')}</div><h2>${isBest ? 'New best!' : 'Nice one!'}</h2><p>Score <b>${score}</b> · you earned <b>${icon('coin')} ${coins}</b></p>`,
      [['Play again', () => { close(); startGame(type); }], ['Back', close, true]]
    ), 250);
  }

  // =================================================================
  //   LOADING SCREEN + START
  // =================================================================
  const LINES = ['Fluffing feathers…', 'Knitting the scarf…', 'Catching fresh fish…', 'Warming the igloo…'];
  function runLoader() {
    let p = 0, i = 0;
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    let fontsDone = false;
    const pipReady = PIP.decode ? PIP.decode().catch(() => {}) : Promise.resolve();
    Promise.all([fontsReady, pipReady]).then(() => { fontsDone = true; buildAlphaMap(); });
    const iv = setInterval(() => {
      p = Math.min(fontsDone ? 100 : 92, p + rnd(3, 9));
      $('#barFill').style.width = p + '%';
      if (p > (i + 1) * 25 && i < LINES.length - 1) { i++; $('#loadingText').textContent = LINES[i]; }
      if (p >= 100) {
        clearInterval(iv);
        $('#loadingText').textContent = 'Pip is ready!';
        $('#playBtn').hidden = false;
      }
    }, 70);
    $('#playBtn').addEventListener('click', () => {
      ac(); SFX.pop();
      $('#loader').hidden = true;
      $('#app').hidden = false;
      setRoom(S.asleep ? 'bed' : 'kitchen');
      petClass('happyjump', 700);
      dailyGift();
    });
  }

  function init() {
    $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
    load(); applyOffline(); save();
    applyLook(); renderHud(); renderFace();
    bindPet(); bindPanel(); bindFoodDrag();
    blinkLoop();
    setInterval(tick, 1000);
    (function eyeLoop(t) { updateEyes(t || performance.now()); requestAnimationFrame(eyeLoop); })();
    document.addEventListener('visibilitychange', () => { if (document.hidden) save(); else { applyOffline(); renderHud(); renderFace(); } });
    window.addEventListener('pagehide', save);
    runLoader();
  }
  init();
})();
