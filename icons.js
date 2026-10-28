/* ===========================================================
   PIP — cartoon icons
   Every icon in the game is drawn here as SVG on a 64 x 64 grid,
   in the same chunky style as the rooms: thick dark outline,
   bold colours, a little white shine. Use icon('name') in game.js.
   To restyle one, edit its SVG below.
   =========================================================== */
(() => {
  const INK = '#2b2140';
  const O = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;
  const L = (w = 3.5) => `stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const SHINE = (d) => `<path d="${d}" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".75"/>`;

  const ICONS = {
    // ---------- food ----------
    fish: `<path d="M22 22 Q30 12 40 20" fill="#3f86e0" ${O}/>
      <path d="M46 32 L60 21 Q56 32 60 43Z" fill="#3f86e0" ${O}/>
      <path d="M6 32 C14 16 38 14 48 32 C38 50 14 48 6 32Z" fill="#6fb7ff" ${O}/>
      <path d="M28 24 Q33 32 28 40" ${L(2.8)}/>
      <circle cx="16" cy="29" r="3.4" fill="${INK}"/><circle cx="15" cy="28" r="1.2" fill="#fff"/>
      <path d="M10 36 Q13 38 16 37" ${L(2.5)}/>
      ${SHINE('M14 24 Q22 19 32 20')}`,
    shrimp: `<path d="M16 44 L4 38 L7 50 L18 53Z" fill="#ff7a59" ${O}/>
      <path d="M42 12 C60 18 60 46 40 52 C30 55 20 52 15 45 L25 38 C29 44 37 44 41 38 C47 30 43 22 35 20Z" fill="#ff9a76" ${O}/>
      <path d="M41 38 L50 44 M44 30 L54 31 M41 21 L49 15" ${L(2.6)}/>
      <path d="M42 12 Q48 2 60 4 M42 12 Q54 8 61 14" ${L(2.4)}/>
      <circle cx="41" cy="17" r="2.6" fill="${INK}"/>
      ${SHINE('M47 22 Q52 30 49 38')}`,
    apple: `<path d="M32 18 C22 10 7 16 7 32 C7 48 20 59 32 55 C44 59 57 48 57 32 C57 16 42 10 32 18Z" fill="#ff5a5f" ${O}/>
      <path d="M32 18 Q31 10 35 5" ${L(4)}/>
      <path d="M35 12 Q45 3 52 9 Q43 19 35 12Z" fill="#5cd07a" ${O}/>
      ${SHINE('M15 30 Q16 22 24 19')}`,
    banana: `<path d="M9 18 C10 44 32 58 55 46 C57 43 56 39 52 39 C34 46 20 36 18 17 C18 12 9 12 9 18Z" fill="#ffd34d" ${O}/>
      <path d="M9 18 L7 11" ${L(4.5)}/><path d="M54 45 L59 46" ${L(4.5)}/>
      <path d="M17 24 C21 38 33 45 46 44" stroke="#e6a800" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,
    carrot: `<path d="M44 14 Q40 3 47 4 Q51 8 49 13Z" fill="#5cd07a" ${O}/>
      <path d="M50 16 Q59 9 61 16 Q56 20 51 18Z" fill="#5cd07a" ${O}/>
      <path d="M44 12 L54 21 L20 55 Q12 59 9 55 Q5 52 9 44Z" fill="#ff8a3d" ${O}/>
      <path d="M27 31 L33 35 M19 41 L25 45 M35 23 L40 27" ${L(2.6)}/>
      ${SHINE('M14 46 L36 24')}`,
    milk: `<path d="M17 23 L25 9 L39 9 L47 23Z" fill="#dfeaff" ${O}/>
      <rect x="25" y="3" width="14" height="7" rx="2" fill="#6fa8ff" ${O}/>
      <rect x="17" y="23" width="30" height="35" rx="4" fill="#fff" ${O}/>
      <rect x="21" y="31" width="22" height="16" rx="4" fill="#6fa8ff" stroke="${INK}" stroke-width="2.8"/>
      <path d="M32 34 Q27 40 32 44 Q37 40 32 34Z" fill="#fff"/>`,
    cookie: `<circle cx="32" cy="32" r="25" fill="#e5a35f" ${O}/>
      <ellipse cx="22" cy="24" rx="4" ry="3.2" fill="#6b3e1e"/><ellipse cx="38" cy="20" rx="3.4" ry="2.8" fill="#6b3e1e"/>
      <ellipse cx="42" cy="36" rx="4" ry="3.2" fill="#6b3e1e"/><ellipse cx="27" cy="41" rx="3.6" ry="3" fill="#6b3e1e"/>
      <ellipse cx="33" cy="30" rx="2.6" ry="2.2" fill="#6b3e1e"/>
      ${SHINE('M14 26 Q17 16 26 12')}`,
    sandwich: `<path d="M8 30 Q8 13 32 13 Q56 13 56 30Z" fill="#f6b25a" ${O}/>
      <path d="M6 35 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0 q5 -6 10 0 q4 -5 6 0" stroke="#5cd07a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M8 31 L56 31 L51 39 L46 34 L13 34Z" fill="#ffd34d" ${O}/>
      <rect x="9" y="38" width="46" height="6" rx="3" fill="#ff5a5f" ${O}/>
      <path d="M8 44 L56 44 Q56 53 47 53 L17 53 Q8 53 8 44Z" fill="#f6b25a" ${O}/>
      <ellipse cx="24" cy="21" rx="2" ry="1.3" fill="#fff6dc"/><ellipse cx="34" cy="18" rx="2" ry="1.3" fill="#fff6dc"/><ellipse cx="42" cy="23" rx="2" ry="1.3" fill="#fff6dc"/>`,
    pizza: `<path d="M32 59 L8 15 Q32 3 56 15Z" fill="#ffd34d" ${O}/>
      <path d="M8 15 Q32 3 56 15 Q59 21 54 22 Q32 11 10 22 Q5 21 8 15Z" fill="#e39a52" ${O}/>
      <circle cx="27" cy="28" r="5" fill="#ff5a5f" stroke="${INK}" stroke-width="2.6"/>
      <circle cx="39" cy="34" r="4.4" fill="#ff5a5f" stroke="${INK}" stroke-width="2.6"/>
      <circle cx="31" cy="44" r="4" fill="#ff5a5f" stroke="${INK}" stroke-width="2.6"/>`,
    sushi: `<rect x="9" y="30" width="46" height="23" rx="10" fill="#fff" ${O}/>
      <path d="M7 32 Q11 17 32 17 Q53 17 57 32 Q50 37 32 35 Q14 37 7 32Z" fill="#ff8a65" ${O}/>
      <path d="M19 23 L23 32 M30 20 L34 32 M41 21 L45 32" stroke="#ffd0bf" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M27 21 L37 21 L37 53 L27 53Z" fill="#2f4a3e" ${O}/>`,
    icecream: `<path d="M19 31 L32 61 L45 31Z" fill="#f6b25a" ${O}/>
      <path d="M24 35 L37 49 M32 32 L41 41 M22 41 L31 53" ${L(2.4)}/>
      <path d="M15 32 Q11 13 32 11 Q53 13 49 32 Q45 37 40 32 Q36 37 32 32 Q28 37 24 32 Q20 37 15 32Z" fill="#ffb3d1" ${O}/>
      <circle cx="35" cy="9" r="5" fill="#ff5a5f" ${O}/>
      ${SHINE('M20 24 Q22 17 29 15')}`,
    cake: `<path d="M10 29 L54 29 L54 53 L10 53Z" fill="#ffe2b3" ${O}/>
      <path d="M10 42 H54" stroke="#ff8fb8" stroke-width="5"/>
      <path d="M8 29 Q8 18 19 18 L45 18 Q56 18 56 29 L56 32 Q52 37 48 32 Q44 38 40 32 Q36 37 32 32 Q28 38 24 32 Q20 37 16 32 Q12 37 8 32Z" fill="#ff8fb8" ${O}/>
      <circle cx="32" cy="12" r="6" fill="#ff5a5f" ${O}/>
      <path d="M32 6 Q34 2 38 3" ${L(2.4)}/>`,

    // ---------- needs ----------
    hunger: `<path d="M27 40 L15 52" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M27 40 L15 52" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <circle cx="11" cy="50" r="4.5" fill="#fff" ${O}/><circle cx="17" cy="57" r="4.5" fill="#fff" ${O}/>
      <path d="M28 12 C45 4 60 18 53 35 C48 46 35 48 26 41 C18 34 18 18 28 12Z" fill="#c8702e" ${O}/>
      ${SHINE('M33 15 Q44 12 49 20')}`,
    clean: `<rect x="8" y="27" width="42" height="27" rx="10" fill="#ff9fc4" ${O}/>
      <path d="M14 34 H36" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>
      <circle cx="46" cy="18" r="8" fill="#e6f6ff" ${O}/><circle cx="56" cy="31" r="5" fill="#e6f6ff" ${O}/><circle cx="30" cy="15" r="5" fill="#e6f6ff" ${O}/>
      <path d="M43 15 Q45 13 47 13" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>`,
    energy: `<path d="M37 3 L13 36 L29 36 L23 61 L51 24 L35 24 L42 3Z" fill="#ffd34d" ${O}/>
      ${SHINE('M33 10 L22 28')}`,
    fun: `<circle cx="32" cy="32" r="25" fill="#ffd34d" ${O}/>
      <path d="M20 26 Q23 21 26 26 M38 26 Q41 21 44 26" ${L(3.5)}/>
      <path d="M18 34 Q32 52 46 34Z" fill="#fff" ${O}/>
      <ellipse cx="15" cy="36" rx="4" ry="2.6" fill="#ff8fa3" opacity=".8"/><ellipse cx="49" cy="36" rx="4" ry="2.6" fill="#ff8fa3" opacity=".8"/>
      ${SHINE('M14 24 Q18 14 28 11')}`,

    // ---------- ui ----------
    coin: `<circle cx="32" cy="32" r="25" fill="#ffd34d" ${O}/>
      <circle cx="32" cy="32" r="17" fill="none" stroke="#e6a800" stroke-width="3.5"/>
      <path d="M32 21 L35 28 L42 28.6 L36.6 33.2 L38.4 40.4 L32 36.5 L25.6 40.4 L27.4 33.2 L22 28.6 L29 28Z" fill="#e6a800"/>
      ${SHINE('M15 26 Q18 17 26 13')}`,
    star: `<path d="M32 4 L40 22 L59 24 L44 37 L49 57 L32 46 L15 57 L20 37 L5 24 L24 22Z" fill="#ffd34d" ${O}/>
      ${SHINE('M26 24 L30 15')}`,
    cart: `<path d="M5 13 L15 13 L22 43 L50 43" ${L(4.5)}/>
      <path d="M17 20 L57 20 L51 40 L22 40Z" fill="#6fa8ff" ${O}/>
      <path d="M30 20 L32 40 M43 20 L41 40 M19 30 H55" stroke="${INK}" stroke-width="2.4" opacity=".55"/>
      <circle cx="25" cy="52" r="5" fill="#fff" ${O}/><circle cx="47" cy="52" r="5" fill="#fff" ${O}/>`,
    soundOn: `<path d="M7 24 L18 24 L32 11 L32 53 L18 40 L7 40Z" fill="#6fa8ff" ${O}/>
      <path d="M40 24 Q46 32 40 40 M46 17 Q57 32 46 47" ${L(4.5)}/>`,
    soundOff: `<path d="M7 24 L18 24 L32 11 L32 53 L18 40 L7 40Z" fill="#c9c2d9" ${O}/>
      <path d="M40 24 L55 40 M55 24 L40 40" stroke="#ff5d6c" stroke-width="6" stroke-linecap="round"/>`,
    close: `<path d="M17 17 L47 47 M47 17 L17 47" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`,
    soap: `<rect x="7" y="22" width="50" height="30" rx="12" fill="#ff9fc4" ${O}/>
      <path d="M14 30 H40" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".85"/>
      <circle cx="48" cy="14" r="6" fill="#e6f6ff" ${O}/><circle cx="57" cy="24" r="4" fill="#e6f6ff" ${O}/>`,
    shower: `<path d="M32 14 V7 H48" ${L(4.5)}/>
      <path d="M13 29 Q13 13 32 13 Q51 13 51 29Z" fill="#bfe6ff" ${O}/>
      <path d="M20 36 L18 44 M32 36 L32 46 M44 36 L46 44 M26 41 L24 52 M38 41 L40 52" stroke="#3f9be0" stroke-width="4" stroke-linecap="round"/>`,
    bulb: `<path d="M32 5 C18 5 11 17 15 28 C18 35 24 38 24 45 L40 45 C40 38 46 35 49 28 C53 17 46 5 32 5Z" fill="#ffe680" ${O}/>
      <rect x="24" y="45" width="16" height="11" rx="3" fill="#c0c6d0" ${O}/>
      <path d="M24 50 H40" stroke="${INK}" stroke-width="2.4"/>
      <path d="M28 34 Q32 26 36 34" ${L(2.6)}/>
      ${SHINE('M21 20 Q23 13 30 11')}`,
    moon: `<path d="M38 6 A26 26 0 1 0 58 42 A20 20 0 1 1 38 6Z" fill="#ffe680" ${O}/>
      <path d="M48 12 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z" fill="#fff" stroke="${INK}" stroke-width="2"/>
      <circle cx="24" cy="38" r="3" fill="#f2cd4a"/><circle cx="20" cy="26" r="2" fill="#f2cd4a"/>`,
    gamepad: `<path d="M14 21 L50 21 Q60 21 61 36 Q61 53 50 51 Q44 49 40 42 L24 42 Q20 49 14 51 Q3 53 3 36 Q4 21 14 21Z" fill="#8b7bff" ${O}/>
      <path d="M15 32 H27 M21 26 V38" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="44" cy="29" r="4" fill="#ff5c8a" stroke="${INK}" stroke-width="2.4"/><circle cx="51" cy="36" r="4" fill="#ffd34d" stroke="${INK}" stroke-width="2.4"/>`,
    shirt: `<path d="M22 8 L11 12 L3 25 L14 31 L18 27 L18 58 L46 58 L46 27 L50 31 L61 25 L53 12 L42 8 Q32 18 22 8Z" fill="#ff6fa8" ${O}/>
      <path d="M18 40 H46" stroke="#fff" stroke-width="4" opacity=".7"/>`,
    gift: `<rect x="9" y="29" width="46" height="28" rx="4" fill="#ff6fa8" ${O}/>
      <rect x="5" y="20" width="54" height="12" rx="4" fill="#ff8fb8" ${O}/>
      <rect x="28" y="20" width="8" height="37" fill="#ffd34d" stroke="${INK}" stroke-width="3"/>
      <path d="M32 20 Q19 5 14 13 Q14 22 32 20 Q50 22 50 13 Q45 5 32 20Z" fill="#ffd34d" ${O}/>`,
    trophy: `<path d="M18 13 Q5 13 8 24 Q11 33 21 31 M46 13 Q59 13 56 24 Q53 33 43 31" ${L(4)}/>
      <path d="M17 7 H47 V22 Q47 39 32 41 Q17 39 17 22Z" fill="#ffd34d" ${O}/>
      <rect x="28" y="41" width="8" height="8" fill="#f0b400" ${O}/>
      <rect x="17" y="49" width="30" height="9" rx="3" fill="#a46a3f" ${O}/>
      ${SHINE('M23 14 V24')}`,
    heart: `<path d="M32 55 C10 41 3 29 7 18 C11 7 26 7 32 18 C38 7 53 7 57 18 C61 29 54 41 32 55Z" fill="#ff5c8a" ${O}/>
      ${SHINE('M15 18 Q19 13 24 14')}`,
    heartEmpty: `<path d="M32 55 C10 41 3 29 7 18 C11 7 26 7 32 18 C38 7 53 7 57 18 C61 29 54 41 32 55Z" fill="#fff" ${O}/>`,
    sparkle: `<path d="M32 3 Q36 28 61 32 Q36 36 32 61 Q28 36 3 32 Q28 28 32 3Z" fill="#ffe680" ${O}/>`,
    sun: `<path d="M32 3 V11 M32 53 V61 M3 32 H11 M53 32 H61 M11 11 L17 17 M47 47 L53 53 M53 11 L47 17 M17 47 L11 53" stroke="#f0b400" stroke-width="5" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="16" fill="#ffd34d" ${O}/>`,
    sleepy: `<circle cx="32" cy="32" r="25" fill="#c6b8ff" ${O}/>
      <path d="M19 29 Q23 33 27 29 M37 29 Q41 33 45 29" ${L(3.2)}/>
      <ellipse cx="32" cy="42" rx="4" ry="5" fill="${INK}"/>
      <path d="M46 8 H56 L46 18 H56" ${L(3)}/>`,
    nope: `<circle cx="32" cy="32" r="23" fill="#fff" ${O}/>
      <path d="M16 48 L48 16" stroke="#ff5d6c" stroke-width="6" stroke-linecap="round"/>`,
    bubble: `<circle cx="32" cy="32" r="25" fill="#cdeeff" ${O}/>
      <path d="M18 26 Q21 17 30 14" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>`,
  };

  window.ICONS = ICONS;
  window.icon = (name, cls = '') =>
    `<svg class="ic ${cls}" viewBox="0 0 64 64" aria-hidden="true">${ICONS[name] || ''}</svg>`;
})();
