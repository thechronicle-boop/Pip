/* ===========================================================
   PUDDLE — a little jelly-drop virtual pet
   Everything is saved in the browser (localStorage).

   Easy things to change:
   - FOODS   : foods in the shop/fridge (emoji, how much they fill, price)
   - COLORS  : body colours in the closet
   - HATS    : accessories in the closet (drawn as small SVG)
   - RATES   : how fast stats go down
   =========================================================== */
(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const SAVE_KEY = 'puddle-save-v1';

  // ---------- content ----------
  const FOODS = {
    apple:    { e: '🍎', n: 'Apple',     h: 14, price: 10 },
    banana:   { e: '🍌', n: 'Banana',    h: 12, price: 8 },
    carrot:   { e: '🥕', n: 'Carrot',    h: 10, price: 6 },
    milk:     { e: '🥛', n: 'Milk',      h: 8,  en: 6, price: 10 },
    cookie:   { e: '🍪', n: 'Cookie',    h: 8,  f: 8, price: 12 },
    sandwich: { e: '🥪', n: 'Sandwich',  h: 28, price: 24 },
    pizza:    { e: '🍕', n: 'Pizza',     h: 34, f: 6, price: 30 },
    sushi:    { e: '🍣', n: 'Sushi',     h: 26, f: 4, price: 28 },
    icecream: { e: '🍦', n: 'Ice cream', h: 12, f: 14, price: 20 },
    cake:     { e: '🍰', n: 'Cake',      h: 20, f: 18, price: 40 },
  };

  const COLORS = {
    mint:   { n: 'Mint',   c: '#7fe0c3', price: 0 },
    peach:  { n: 'Peach',  c: '#ffb991', price: 120 },
    sky:    { n: 'Sky',    c: '#8fd0ff', price: 150 },
    lilac:  { n: 'Lilac',  c: '#c6a8ff', price: 150 },
    lemon:  { n: 'Lemon',  c: '#ffe27a', price: 180 },
    coral:  { n: 'Coral',  c: '#ff8f9e', price: 200 },
    galaxy: { n: 'Galaxy', c: '#4b47a3', price: 400, dark: true },
  };

  const HATS = {
    none:   { n: 'Sprout', price: 0, svg: '' },
    party:  { n: 'Party hat', price: 60, svg:
      '<polygon points="80,50 120,50 100,4" fill="#ff6fa8"/><path d="M86 38 L114 38 M92 24 L108 24" stroke="#fff" stroke-width="4"/><circle cx="100" cy="5" r="7" fill="#ffd34d"/>' },
    bow:    { n: 'Bow', price: 80, svg:
      '<g transform="translate(128 64) rotate(20)"><path d="M0 0 L-20 -12 L-20 12Z" fill="#ff5c8a"/><path d="M0 0 L20 -12 L20 12Z" fill="#ff5c8a"/><circle r="6" fill="#ff8fb0"/></g>' },
    flower: { n: 'Flower', price: 90, svg:
      '<g transform="translate(130 70)"><circle cx="0" cy="-9" r="7" fill="#ffb3d1"/><circle cx="8.5" cy="-3" r="7" fill="#ffb3d1"/><circle cx="5.5" cy="7" r="7" fill="#ffb3d1"/><circle cx="-5.5" cy="7" r="7" fill="#ffb3d1"/><circle cx="-8.5" cy="-3" r="7" fill="#ffb3d1"/><circle r="5.5" fill="#ffc93d"/></g>' },
    beanie: { n: 'Beanie', price: 140, svg:
      '<path d="M72 54 Q72 16 100 16 Q128 16 128 54Z" fill="#ff7a59"/><rect x="68" y="46" width="64" height="12" rx="6" fill="#e85d3f"/><circle cx="100" cy="14" r="8" fill="#fff"/>' },
    cap:    { n: 'Cap', price: 160, svg:
      '<path d="M74 52 Q74 20 100 20 Q126 20 126 52Z" fill="#4f7cff"/><path d="M116 52 Q150 48 158 58 L116 58Z" fill="#3a5fd6"/><circle cx="100" cy="21" r="4" fill="#3a5fd6"/>' },
    shades: { n: 'Shades', price: 220, svg:
      '<rect x="56" y="110" width="40" height="26" rx="10" fill="#1f1a2e"/><rect x="104" y="110" width="40" height="26" rx="10" fill="#1f1a2e"/><path d="M96 118 L104 118" stroke="#1f1a2e" stroke-width="5"/><path d="M63 116 L74 116" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/><path d="M111 116 L122 116" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>' },
    headphones: { n: 'Headphones', price: 260, svg:
      '<path d="M40 118 Q40 40 100 40 Q160 40 160 118" stroke="#2b2140" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="25" y="102" width="22" height="36" rx="9" fill="#ff5c8a"/><rect x="153" y="102" width="22" height="36" rx="9" fill="#ff5c8a"/>' },
    crown:  { n: 'Crown', price: 500, svg:
      '<path d="M76 52 L80 22 L92 36 L100 14 L108 36 L120 22 L124 52Z" fill="#ffd34d" stroke="#e0a800" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="42" r="4" fill="#ff5c8a"/><circle cx="86" cy="44" r="3" fill="#4f7cff"/><circle cx="114" cy="44" r="3" fill="#4f7cff"/>' },
  };

  // per-minute change while the game is open
  const RATES = { hunger: -0.8, clean: -0.5, energy: -0.6, fun: -0.7, sleepEnergy: 20 };
  // per-hour change while the game is closed
  const OFFLINE = { hunger: -6, clean: -4, energy: -5, fun: -5, sleepEnergy: 40 };

  const STAT_ICON = { hunger: '🍎', clean: '🛁', energy: '🌙', fun: '🎮' };
  const ROOM_NAMES = { kitchen: 'Kitchen', bath: 'Bathroom', bed: 'Bedroom', play: 'Playroom', closet: 'Closet', shop: 'Shop' };

  // ---------- save / load ----------
  const fresh = () => ({
    stats: { hunger: 70, clean: 80, energy: 85, fun: 75 },
    coins: 120, xp: 0, level: 1,
    food: { apple: 3, banana: 2, cookie: 2, pizza: 1 },
    color: 'mint', hat: 'none',
    ownedColors: ['mint'], ownedHats: ['none'],
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
    t.textContent = msg; t.hidden = false;
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
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = clamp((n >> 16) + amt, 0, 255), g = clamp(((n >> 8) & 255) + amt, 0, 255), b = clamp((n & 255) + amt, 0, 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  function petClass(cls, ms) {
    const p = $('#pet');
    p.classList.remove(cls); void p.getBoundingClientRect(); p.classList.add(cls);
    setTimeout(() => p.classList.remove(cls), ms);
  }
  function floatEmoji(e, x, y) {
    const h = document.createElement('div');
    h.className = 'heart'; h.textContent = e;
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
    const col = COLORS[S.color] || COLORS.mint;
    const root = document.documentElement.style;
    root.setProperty('--pet', col.c);
    root.setProperty('--pet-dark', shade(col.c, -48));
    root.setProperty('--face', col.dark ? '#14112a' : '#2b2140');
    const hat = HATS[S.hat] || HATS.none;
    $('#hat').innerHTML = hat.svg;
    $('#sprout').style.display = S.hat === 'none' || S.hat === 'bow' || S.hat === 'flower' || S.hat === 'shades' ? '' : 'none';
    $('#pet').classList.toggle('shades', S.hat === 'shades');
    $('meta[name="theme-color"]').setAttribute('content', col.c);
  }

  const MOUTHS = {
    happy: 'M86 150 Q100 164 114 150',
    ok: 'M89 155 Q100 159 111 155',
    sad: 'M87 160 Q100 148 113 160',
    sleep: 'M94 156 Q100 159 106 156',
  };
  function lowestStat() {
    let k = 'hunger';
    for (const s in S.stats) if (S.stats[s] < S.stats[k]) k = s;
    return k;
  }
  function renderFace() {
    const pet = $('#pet');
    pet.classList.toggle('sleeping', S.asleep);
    const low = lowestStat(), v = S.stats[low];
    let m = 'happy';
    if (S.asleep) m = 'sleep';
    else if (v < 25) m = 'sad';
    else if (v < 50) m = 'ok';
    $('#mouth').setAttribute('d', MOUTHS[m]);
    const th = $('#thought');
    if (!S.asleep && v < 30) { th.textContent = STAT_ICON[low]; th.hidden = false; }
    else th.hidden = true;
    $('#zzz').hidden = !S.asleep;
    $('#dirt').style.opacity = clamp((65 - S.stats.clean) / 50, 0, 0.9);
  }

  function renderHud() {
    for (const el of $$('.meter')) {
      const v = Math.round(S.stats[el.dataset.stat]);
      el.style.setProperty('--v', v);
      el.style.setProperty('--c', v > 50 ? 'var(--good)' : v > 25 ? 'var(--ok)' : 'var(--bad)');
      el.classList.toggle('low', v <= 20);
      el.title = `${el.title.split(':')[0]}: ${v}%`;
    }
    $('#coinNum').textContent = Math.floor(S.coins);
    $('#levelNum').textContent = S.level;
    $('#xpFill').style.width = (S.xp / xpNeed()) * 100 + '%';
    $('#muteBtn').textContent = S.muted ? '🔇' : '🔊';
  }

  // eyes follow the pointer
  let lookTarget = null;
  document.addEventListener('pointermove', (e) => { lookTarget = [e.clientX, e.clientY]; });
  function updateEyes() {
    if (!lookTarget || S.asleep) return;
    const r = $('#pet').getBoundingClientRect();
    if (!r.width) return;
    const sc = r.width / 200;
    [['#pupilL', '#glintL', 76], ['#pupilR', '#glintR', 124]].forEach(([p, g, cx]) => {
      const ex = r.left + cx * sc, ey = r.top + 122 * sc;
      const dx = lookTarget[0] - ex, dy = lookTarget[1] - ey;
      const d = Math.hypot(dx, dy) || 1, m = Math.min(6, d / 30);
      const ox = (dx / d) * m, oy = (dy / d) * m;
      $(p).setAttribute('cx', cx + ox); $(p).setAttribute('cy', 122 + oy);
      $(g).setAttribute('cx', cx + 3 + ox); $(g).setAttribute('cy', 118 + oy);
    });
  }
  function blinkLoop() {
    setTimeout(() => {
      if (!S.asleep) {
        $('#eyes').classList.add('blink');
        setTimeout(() => $('#eyes').classList.remove('blink'), 130);
      }
      blinkLoop();
    }, rnd(2500, 5500));
  }

  // ---------- rooms ----------
  let room = 'kitchen';
  let bathTool = 'sponge';
  let closetTab = 'colors';

  function setRoom(r) {
    if (room === 'bed' && r !== 'bed' && S.asleep) wake(true);
    room = r;
    $('#room').dataset.room = r;
    $('#roomTitle').textContent = ROOM_NAMES[r];
    $$('#roomNav button').forEach((b) => b.classList.toggle('on', b.dataset.room === r));
    $('#room').classList.toggle('dark', r === 'bed' && S.asleep);
    $('#sponge').hidden = true;
    renderPanel();
  }

  function renderPanel() {
    const p = $('#panel');
    if (room === 'kitchen') {
      const owned = Object.keys(FOODS).filter((k) => S.food[k] > 0);
      p.innerHTML = `<h3>Fridge <button class="btn small" data-go="shop">🛒 Shop</button></h3>` +
        (owned.length
          ? `<div class="chips">${owned.map((k) => `<button class="chip" data-feed="${k}"><span class="e">${FOODS[k].e}</span><span class="count">×${S.food[k]}</span></button>`).join('')}</div><p class="hint">Tap a food to feed Puddle</p>`
          : `<p class="hint">The fridge is empty. Grab some food in the shop!</p>`);
    } else if (room === 'shop') {
      p.innerHTML = `<h3>Food shop <span class="pill">🪙 ${Math.floor(S.coins)}</span></h3><div class="grid">` +
        Object.entries(FOODS).map(([k, f]) => `<button class="item" data-buyfood="${k}"><span class="e">${f.e}</span><span class="name">${f.n}</span><span class="price">🪙 ${f.price}</span><span class="owned">have ${S.food[k] || 0}</span></button>`).join('') +
        `</div>`;
    } else if (room === 'bath') {
      p.innerHTML = `<div class="row"><button class="tool ${bathTool === 'sponge' ? 'on' : ''}" data-tool="sponge"><span>🧽</span>Sponge</button><button class="tool" data-shower><span>🚿</span>Rinse</button></div><p class="hint" style="margin-top:8px">${bathTool === 'sponge' ? 'Rub Puddle with the sponge, then rinse' : 'Pick the sponge to scrub'}</p>`;
    } else if (room === 'bed') {
      p.innerHTML = `<div class="row"><button class="btn ${S.asleep ? 'ghost' : ''}" data-lamp>${S.asleep ? '💡 Lights on' : '🌙 Lights off'}</button></div><p class="hint" style="margin-top:8px">${S.asleep ? 'Puddle is snoozing… energy is filling up' : 'Turn the lights off so Puddle can sleep'}</p>`;
    } else if (room === 'play') {
      p.innerHTML = `<div class="games">
        <button class="game-card catch" data-game="catch"><span class="e">⭐</span><b>Star Catch</b><small>Best ${S.best.catch} · dodge the storm clouds</small></button>
        <button class="game-card bounce" data-game="bounce"><span class="e">🫧</span><b>Bounce</b><small>Best ${S.best.bounce} · keep Puddle in the air</small></button>
      </div>`;
    } else if (room === 'closet') {
      const tabs = `<div class="tabs"><button class="tab ${closetTab === 'colors' ? 'on' : ''}" data-tab="colors">Colours</button><button class="tab ${closetTab === 'hats' ? 'on' : ''}" data-tab="hats">Accessories</button></div>`;
      let grid;
      if (closetTab === 'colors') {
        grid = Object.entries(COLORS).map(([k, c]) => {
          const own = S.ownedColors.includes(k);
          return `<button class="item ${S.color === k ? 'on' : ''}" data-color="${k}"><span class="swatch" style="background:${c.c}"></span><span class="name">${c.n}</span>${own ? `<span class="owned">${S.color === k ? 'wearing' : 'owned'}</span>` : `<span class="price">🪙 ${c.price}</span>`}</button>`;
        }).join('');
      } else {
        grid = Object.entries(HATS).map(([k, h]) => {
          const own = S.ownedHats.includes(k);
          const prev = k === 'none'
            ? '<svg viewBox="80 0 50 22"><path d="M100 22 Q97 12 101 4" stroke="#3c9a6e" stroke-width="3" fill="none"/><path d="M101 8 Q113 -3 124 5 Q113 16 101 8Z" fill="#59c48a"/></svg>'
            : `<svg viewBox="${previewBox(k)}">${h.svg}</svg>`;
          return `<button class="item ${S.hat === k ? 'on' : ''}" data-hat="${k}">${prev}<span class="name">${h.n}</span>${own ? `<span class="owned">${S.hat === k ? 'wearing' : 'owned'}</span>` : `<span class="price">🪙 ${h.price}</span>`}</button>`;
        }).join('');
      }
      p.innerHTML = `<h3>${tabs}<span class="pill">🪙 ${Math.floor(S.coins)}</span></h3><div class="grid">${grid}</div>`;
    }
  }
  function previewBox(k) {
    return { party: '70 0 60 52', bow: '104 48 48 34', flower: '114 54 32 32', beanie: '64 4 72 56', cap: '70 14 92 46',
      shades: '52 104 96 36', headphones: '22 36 156 104', crown: '72 10 56 46' }[k] || '0 0 200 200';
  }

  // ---------- actions ----------
  function feed(key, chip) {
    if (S.asleep) return toast('Shh… Puddle is asleep');
    if (!S.food[key]) return;
    if (S.stats.hunger >= 97) { SFX.nope(); petClass('shake', 500); return toast("I'm full!"); }
    S.food[key]--;
    const f = FOODS[key];
    const a = chip.getBoundingClientRect();
    const m = $('#mouthOpen').getBoundingClientRect();
    const mm = $('#mouth').getBoundingClientRect();
    const tx = (m.width ? m.left + m.width / 2 : mm.left + mm.width / 2);
    const ty = (m.height ? m.top + m.height / 2 : mm.top + mm.height / 2);
    const fly = document.createElement('div');
    fly.className = 'fly'; fly.textContent = f.e;
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
      let open = true, n = 0;
      const iv = setInterval(() => {
        open = !open; $('#pet').classList.toggle('eating', open);
        if (++n > 5) { clearInterval(iv); $('#pet').classList.remove('eating'); petClass('squish', 450); }
      }, 80);
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

  function pickColor(k) {
    const c = COLORS[k];
    if (!S.ownedColors.includes(k)) {
      if (S.coins < c.price) { SFX.nope(); return toast(`Need ${c.price} coins`); }
      S.coins -= c.price; S.ownedColors.push(k); SFX.coin();
      toast(`${c.n} unlocked!`);
    } else SFX.tap();
    S.color = k; applyLook(); petClass('happyjump', 700);
    renderHud(); renderPanel(); save();
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
    const r = $('#pet').getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 200, ((e.clientY - r.top) / r.height) * 200];
  }
  function onBody(x, y) {
    const b = $('#body');
    try { return b.isPointInFill(new DOMPoint(x, y)); } catch (err) { return Math.hypot(x - 100, y - 125) < 68; }
  }
  function addBubble(x, y) {
    const g = $('#bubbles');
    if (g.childElementCount > 70) g.firstElementChild.remove();
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x + rnd(-6, 6)); c.setAttribute('cy', y + rnd(-6, 6));
    c.setAttribute('r', rnd(5, 12).toFixed(1));
    c.setAttribute('fill', 'rgba(255,255,255,.88)');
    c.setAttribute('stroke', '#b9e6fb'); c.setAttribute('stroke-width', '1.5');
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
      if (S.stats.clean >= 95) { toast('Squeaky clean! ✨'); addXp(4); }
      petClass('squish', 450); renderFace(); renderHud(); save();
    }, 1300);
  }

  function bindPet() {
    const pet = $('#pet');
    const sponge = $('#sponge');
    pet.addEventListener('pointerdown', (e) => {
      ac();
      if (room === 'bath' && bathTool === 'sponge' && !S.asleep) {
        scrubbing = true; pet.setPointerCapture(e.pointerId);
        sponge.hidden = false; sponge.style.left = e.clientX + 'px'; sponge.style.top = e.clientY + 'px';
        scrubAt(e); return;
      }
      if (S.asleep) { toast('Zzz… let Puddle sleep'); return; }
      const [x, y] = petPoint(e);
      if (!onBody(x, y)) return;
      const now = performance.now();
      if (now - lastTickle < 350) return;
      lastTickle = now;
      petClass('squish', 450); SFX.giggle();
      floatEmoji(Math.random() < 0.7 ? '💖' : '✨', e.clientX, e.clientY - 10);
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

  function bindPanel() {
    $('#panel').addEventListener('click', (e) => {
      const t = e.target.closest('button'); if (!t) return;
      ac();
      const d = t.dataset;
      if (d.feed) feed(d.feed, t);
      else if (d.go) { SFX.tap(); setRoom(d.go); }
      else if (d.buyfood) buyFood(d.buyfood);
      else if (d.tool) { bathTool = bathTool === 'sponge' ? 'none' : 'sponge'; SFX.tap(); renderPanel(); }
      else if ('shower' in d) rinse();
      else if ('lamp' in d) toggleLamp();
      else if (d.game) startGame(d.game);
      else if (d.tab) { closetTab = d.tab; SFX.tap(); renderPanel(); }
      else if (d.color) pickColor(d.color);
      else if (d.hat) pickHat(d.hat);
    });
    $('#roomNav').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      ac(); SFX.tap(); setRoom(b.dataset.room);
    });
    $('#muteBtn').addEventListener('click', () => { S.muted = !S.muted; renderHud(); save(); if (!S.muted) SFX.tap(); });
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
    if (S.asleep && s.energy >= 100 && room === 'bed') { wake(false); toast('Puddle woke up refreshed! ☀️'); }
    renderHud(); renderFace();
    if (++tickCount % 5 === 0) save();
  }

  function dailyGift() {
    const today = new Date().toDateString();
    if (S.lastDaily === today) return;
    S.lastDaily = today;
    const gift = 40 + Math.min(60, S.level * 5);
    S.coins += gift; save(); renderHud();
    setTimeout(() => { SFX.coin(); modal(`<div class="big-e">🎁</div><h2>Daily gift</h2><p>Puddle found <b>${gift} coins</b> for you today.</p>`, [['Yay!']]); }, 600);
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

  function drawPet(x, y, r, squash = 0, look = 0) {
    const col = COLORS[S.color] || COLORS.mint;
    cx.save(); cx.translate(x, y); cx.scale(1 + squash, 1 - squash);
    cx.beginPath();
    cx.moveTo(0, -r * 1.3);
    cx.bezierCurveTo(r * 0.35, -r * 0.9, r, -r * 0.45, r, 0.05 * r);
    cx.bezierCurveTo(r, r * 0.62, r * 0.55, r * 0.95, 0, r * 0.95);
    cx.bezierCurveTo(-r * 0.55, r * 0.95, -r, r * 0.62, -r, 0.05 * r);
    cx.bezierCurveTo(-r, -r * 0.45, -r * 0.35, -r * 0.9, 0, -r * 1.3);
    cx.fillStyle = col.c; cx.fill();
    cx.lineWidth = r * 0.06; cx.strokeStyle = shade(col.c, -48); cx.stroke();
    cx.fillStyle = '#fff';
    cx.beginPath(); cx.arc(-r * 0.34, -r * 0.02, r * 0.22, 0, 7); cx.arc(r * 0.34, -r * 0.02, r * 0.22, 0, 7); cx.fill();
    cx.fillStyle = col.dark ? '#14112a' : '#2b2140';
    cx.beginPath(); cx.arc(-r * 0.32 + look, r * 0.01, r * 0.1, 0, 7); cx.arc(r * 0.36 + look, r * 0.01, r * 0.1, 0, 7); cx.fill();
    cx.strokeStyle = cx.fillStyle; cx.lineWidth = r * 0.06; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(-r * 0.2, r * 0.38); cx.quadraticCurveTo(0, r * 0.58, r * 0.2, r * 0.38); cx.stroke();
    cx.fillStyle = 'rgba(255,143,163,.55)';
    cx.beginPath(); cx.ellipse(-r * 0.6, r * 0.32, r * 0.15, r * 0.08, 0, 0, 7); cx.ellipse(r * 0.6, r * 0.32, r * 0.15, r * 0.08, 0, 0, 7); cx.fill();
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
    cx.restore();
  }
  function drawCloud(x, y, r) {
    cx.fillStyle = '#5c5675';
    cx.beginPath();
    cx.arc(x - r * 0.5, y, r * 0.55, 0, 7); cx.arc(x + r * 0.5, y, r * 0.55, 0, 7); cx.arc(x, y - r * 0.35, r * 0.7, 0, 7);
    cx.fill();
    cx.strokeStyle = '#ffd34d'; cx.lineWidth = 4; cx.lineJoin = 'round';
    cx.beginPath(); cx.moveTo(x + 2, y + r * 0.4); cx.lineTo(x - 8, y + r * 0.95); cx.lineTo(x + 4, y + r * 0.95); cx.lineTo(x - 6, y + r * 1.5); cx.stroke();
  }
  function bgStars(t) {
    for (let i = 0; i < 40; i++) {
      const x = (i * 97.3) % W, y = (i * 53.7 + t * (8 + (i % 4) * 6)) % H;
      cx.fillStyle = `rgba(255,255,255,${0.25 + (i % 3) * 0.2})`;
      cx.fillRect(x, y, 2, 2);
    }
  }

  function startGame(type) {
    if (S.asleep) return toast('Puddle is asleep');
    if (S.stats.energy < 12) { SFX.nope(); petClass('shake', 500); return toast('Too sleepy to play… 😴'); }
    sizeCanvas();
    $('#game').hidden = false;
    G.type = type; G.running = true; G.score = 0; G.t = 0; G.last = performance.now();
    G.over = false; G.parts = [];
    if (type === 'catch') {
      G.lives = 3; G.items = []; G.spawn = 0; G.px = W / 2; G.tx = W / 2; G.squash = 0;
      $('#gameHint').textContent = 'Drag to catch the stars ⭐';
    } else {
      G.ball = { x: W / 2, y: H * 0.35, vx: 0, vy: 0, r: Math.min(52, W * 0.12), sq: 0 };
      G.started = false;
      $('#gameHint').textContent = 'Tap Puddle to bounce!';
    }
    $('#gameHint').style.opacity = 1;
    updateGameHud();
    cancelAnimationFrame(G.raf);
    G.raf = requestAnimationFrame(gameFrame);
  }
  function updateGameHud() {
    $('#gameScore').textContent = (G.type === 'catch' ? '⭐ ' : '🫧 ') + G.score;
    $('#gameLives').textContent = G.type === 'catch' ? '💖'.repeat(G.lives) + '🤍'.repeat(3 - G.lives) : `Best ${S.best.bounce}`;
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
      `<div class="big-e">${isBest ? '🏆' : type === 'catch' ? '⭐' : '🫧'}</div><h2>${isBest ? 'New best!' : 'Nice one!'}</h2><p>Score <b>${score}</b> · you earned <b>🪙 ${coins}</b></p>`,
      [['Play again', () => { close(); startGame(type); }], ['Back', close, true]]
    ), 250);
  }

  // =================================================================
  //   LOADING SCREEN + START
  // =================================================================
  const LINES = ['Filling the puddle…', 'Fluffing the pillows…', 'Stocking the fridge…', 'Blowing bubbles…'];
  function runLoader() {
    let p = 0, i = 0;
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    let fontsDone = false; fontsReady.then(() => (fontsDone = true));
    const iv = setInterval(() => {
      p = Math.min(fontsDone ? 100 : 92, p + rnd(3, 9));
      $('#barFill').style.width = p + '%';
      if (p > (i + 1) * 25 && i < LINES.length - 1) { i++; $('#loadingText').textContent = LINES[i]; }
      if (p >= 100) {
        clearInterval(iv);
        $('#loadingText').textContent = 'Puddle is ready!';
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
    load(); applyOffline(); save();
    applyLook(); renderHud(); renderFace();
    bindPet(); bindPanel();
    blinkLoop();
    setInterval(tick, 1000);
    (function eyeLoop() { updateEyes(); requestAnimationFrame(eyeLoop); })();
    document.addEventListener('visibilitychange', () => { if (document.hidden) save(); else { applyOffline(); renderHud(); renderFace(); } });
    window.addEventListener('pagehide', save);
    runLoader();
  }
  init();
})();
