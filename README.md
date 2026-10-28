# Pip 🐧

A fluffy baby penguin that lives in the browser. Feed Pip, bathe Pip, tuck Pip in, dress Pip up and play mini-games to earn coins.

Plain HTML, CSS and JavaScript. No build step, no installs. Progress saves in the browser.

## What's in it

- **Loading screen** with a Play button into the home screen
- **Illustrated rooms** you walk between with the big arrows (or swipe / arrow keys): Kitchen, Bathroom, Bedroom, Games, Wardrobe
- **4 need icons** along the top (hunger, clean, energy, fun) that drain over time, even while the page is closed
- **Kitchen**: flick through the food carousel and drag food onto Pip (or tap it). Fish and shrimp are Pip's favourites
- **Shop** (cart button, top right): buy food with coins
- **Bathroom**: rub Pip with the soap to make bubbles, then rinse. Pip gets grubby spots when dirty
- **Bedroom**: lights off and Pip closes its eyes to sleep, energy refills, Pip wakes up when full
- **Games**: *Star Catch* (catch stars, dodge storm clouds) and *Bounce* (tap to keep Pip in the air)
- **Wardrobe**: 8 accessories to unlock
- Tap Pip for giggles, Pip has Pou-style cartoon eyes that each follow your cursor or finger, and the head leans toward you (`EYE_MAX`, `EYE_SOLO` and `HEAD_MAX` in `game.js` set how far), blinks, droops when a need is very low, levels and XP, a daily coin gift, sound effects (with mute)

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page layout |
| `style.css` | All the looks and animations |
| `game.js` | Everything that happens |
| `icons.js` | Every cartoon icon in the game (food, needs, buttons, coins, hearts…) drawn as SVG |
| `pip.webp` | Pip's full picture (792 × 893, transparent background), used on the loading screen and in games |
| `pip_head.webp`, `pip_body.webp` | Pip split at the top of the scarf so the head can lean on its own |
| `wrangler.jsonc`, `.assetsignore` | Tell Cloudflare to publish the site as plain files |

## Easy changes

- **Foods**: edit `FOODS` near the top of `game.js`. `h` = hunger filled, `f` = fun, `en` = energy, `price` = coins. A new food also needs an icon with the same name in `icons.js`
- **Icons**: all in `icons.js`, each drawn on a 64 × 64 grid. Edit one there and it changes everywhere
- **Accessories**: edit `HATS` in `game.js`. Each one is SVG drawn over Pip's picture in its 792 × 893 space (left eye about 294, 237; right eye about 505, 236; top of the head about 396, 14)
- **How fast needs drop**: `RATES` (per minute while open) and `OFFLINE` (per hour while closed)
- **Starting coins and food**: the `fresh()` function
- **Rooms**: each room's background is an SVG `scene` in `index.html`; the walk order is `ROOMS` in `game.js`
- **New look for Pip**: replace `pip.webp`, `pip_head.webp` and `pip_body.webp` with another 792 × 893 picture with a transparent background (ask Claude to re-split the head and body). If the eyes move, update the cartoon eyes (`#ceyes`), sleeping eyelids (`#lids`) and beak point (`#beakPt`) in `index.html`

After changing anything, refresh the page. To reset a save, open the browser console and run `localStorage.removeItem('pip-save-v1')`.

## Hosting

The repo is set up for Cloudflare (Workers & Pages) and also works on GitHub Pages as-is. Every push to `main` redeploys.
