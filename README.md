# Puddle 💧

A little jelly-drop virtual pet that lives in the browser. Feed it, bathe it, tuck it in, dress it up and play mini-games to earn coins.

Plain HTML, CSS and JavaScript. No build step, no installs. Progress saves in the browser.

## What's in it

- **Loading screen** with a Play button into the home screen
- **4 needs**: hunger, clean, energy, fun. They drop over time, even while the page is closed
- **Kitchen**: tap food from the fridge and it flies into Puddle's mouth
- **Shop**: buy food with coins
- **Bathroom**: scrub with the sponge to make bubbles, then rinse. Puddle gets grubby spots when dirty
- **Bedroom**: lights off to sleep, energy refills, Puddle wakes up when full
- **Playroom**: two mini-games, *Star Catch* (catch stars, dodge storm clouds) and *Bounce* (tap to keep Puddle in the air)
- **Closet**: 7 body colours and 8 accessories to unlock
- Tap Puddle for giggles, eyes follow your cursor or finger, levels and XP, a daily coin gift, sound effects (with mute)

## Files

| File | What it does |
| --- | --- |
| `index.html` | The page layout and Puddle's drawing (SVG) |
| `style.css` | All the looks. Main colours are at the top in `:root` |
| `game.js` | Everything that happens |

## Easy changes (all near the top of `game.js`)

- **Foods**: edit `FOODS`. `h` = hunger filled, `f` = fun, `en` = energy, `price` = coins
- **Colours**: edit `COLORS` (add one like `mint: { n: 'Mint', c: '#7fe0c3', price: 0 }`)
- **Accessories**: edit `HATS`. Each one is a bit of SVG drawn on a 200×200 canvas (Puddle's tip is at x=100, y=22)
- **How fast needs drop**: `RATES` (per minute while open) and `OFFLINE` (per hour while closed)
- **Starting coins and food**: the `fresh()` function

After changing anything, refresh the page. To reset a save, open the browser console and run `localStorage.removeItem('puddle-save-v1')`.

## Putting it online (GitHub Pages)

1. In the repo, go to **Settings → Pages**
2. Under *Build and deployment*, pick **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**
3. After a minute the game is live at `https://<your-username>.github.io/<repo-name>/`
