# Pip 🐧

A fluffy baby penguin that lives in the browser. Feed Pip, bathe Pip, tuck Pip in, dress Pip up and play mini-games to earn coins.

Plain HTML, CSS and JavaScript. No build step, no installs. Progress saves in the browser.

## What's in it

- **Loading screen** with a Play button into the home screen
- **4 needs**: hunger, clean, energy, fun. They drop over time, even while the page is closed
- **Kitchen**: tap food from the fridge (fish and shrimp are Pip's favourites) and it flies to Pip's beak
- **Shop**: buy food with coins
- **Bathroom**: scrub with the sponge to make bubbles, then rinse. Pip gets grubby spots when dirty
- **Bedroom**: lights off and Pip closes its eyes to sleep, energy refills, Pip wakes up when full
- **Playroom**: two mini-games, *Star Catch* (catch stars, dodge storm clouds) and *Bounce* (tap to keep Pip in the air)
- **Closet**: 8 accessories to unlock
- Tap Pip for giggles, Pip leans toward your cursor or finger, blinks, droops when a need is very low, levels and XP, a daily coin gift, sound effects (with mute)

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page layout |
| `style.css` | All the looks and animations |
| `game.js` | Everything that happens |
| `pip.webp` | Pip's picture (551 × 669, transparent background) |
| `wrangler.jsonc`, `.assetsignore` | Tell Cloudflare to publish the site as plain files |

## Easy changes

- **Foods**: edit `FOODS` near the top of `game.js`. `h` = hunger filled, `f` = fun, `en` = energy, `price` = coins
- **Accessories**: edit `HATS` in `game.js`. Each one is SVG drawn over Pip's picture in its 551 × 669 space (left eye about 270, 219; right eye about 421, 220; top of the head about 280, 10)
- **How fast needs drop**: `RATES` (per minute while open) and `OFFLINE` (per hour while closed)
- **Starting coins and food**: the `fresh()` function
- **New look for Pip**: replace `pip.webp` with another 551 × 669 picture with a transparent background. If the eyes move, update the eyelid ellipses (`#lids`) and beak point (`#beakPt`) in `index.html`

After changing anything, refresh the page. To reset a save, open the browser console and run `localStorage.removeItem('pip-save-v1')`.

## Hosting

The repo is set up for Cloudflare (Workers & Pages) and also works on GitHub Pages as-is. Every push to `main` redeploys.
