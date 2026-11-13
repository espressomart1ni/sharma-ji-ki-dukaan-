# Sharma Ji ki Dukaan — a first-person kirana store (c. 1998–2008)

You wear smart-glasses: you see your own hands, walk into the shop, pick things off the shelves, turn them over,
open them, take things out, talk to the shopkeeper, and borrow the old computer (with a DVD player).

## Run it
```bash
npm install
npm run dev        # http://localhost:5173
```
No Node? A pre-built copy is in `dist/`. Serve it with any static server, e.g. `cd dist && python3 -m http.server 8080`
(it will not work by double-clicking index.html: browsers block module scripts from file://).

## Deploy to GitHub Pages
1. Commit everything (including `package-lock.json` and `.github/workflows/deploy.yml`; `dist/` and `node_modules/` are git-ignored) and push to `main`.
2. Repo **Settings → Pages → Build and deployment → Source: "GitHub Actions"**. (Not "Deploy from a branch": that serves the raw source, whose `index.html`
   points at `/src/main.js`, which 404s and gives a blank page.)
3. The workflow runs the headless smoke test, builds with Vite, and publishes `dist/`. The site appears at `https://<user>.github.io/<repo>/`.
`vite.config.js` uses `base: './'`, so the build works under any repo name with no edits. If anything fails at runtime, errors and
failed asset requests now show on screen (and in the browser console) instead of a silent blank page.

> Hidden dot-files (`.github`, `.gitignore`, `public/.nojekyll`): see `deploy/README-HIDDEN-FILES.md`.

## Controls
| Desktop | |
|---|---|
| Click "put them on" | locks the mouse, starts the sound |
| W A S D / mouse / Shift | walk / look / run |
| E or click | pick up, or use what the reticle is on |
| F | bring the held item close, then move the mouse to rotate it |
| 1 / 2 | the held item's actions (open lid, take one, slide, play, spin…) |
| Q | put it back where you found it |
| Esc | pause (also leaves the computer) |
| – / = | darker / brighter (exposure) |

Touch: left joystick walks, drag to look, the bar at the bottom has Use / Inspect / actions / Put back.

## Try this
- Phantom box: `E` pick it up, `1` flip the lid, `2` take a stick.
- Pencil box (island shelf, eye level): `1` and `2` slide the two compartments; the bottom one hides a sticker and marble.
- Ask Uncle for the computer (talk to him: 1–4 choose lines), pick a DVD, walk to the computer, press `E`: it plays in the DVD Player.
- Open the counter drawer, tune the radio, press the candy-bar phone. Six small finds are counted.

## Project layout
```
index.html                 canvas + HUD + dialogue + PC overlay markup
src/main.js                renderer, input, mode switching (menu / play / talk / pc), main loop
src/config.js              PRODUCT CATALOGUE, shelf layout, colliders, light knobs  <-- edit this first
src/engine/                player.js (walk+collide) hands.js (POV hands) holder.js (pick/inspect/put back)
                           tween.js  audio.js (all sounds are synthesised, no files)
src/world/                 shell.js (street, facade, sign, interior, lights)  shelves.js (stocks shelves)
                           props.js (counter, uncle, CRT, radio…)  products.js (8 interactive item types)
src/ui/                    hud.js  dialogue.js
src/os/oldpc.js            Win98-style desktop: Snake, Notepad, Internet, DVD Player, screensaver
public/assets/             textures/ products/ dvd/  (PNG)
tools/make_assets.py       regenerates every PNG (Pillow)
tools/smoke.mjs            headless test: `npm run smoke`
```

## Add a product
1. Put `public/assets/products/<id>.png` (DVDs: `public/assets/dvd/<id>.png`).
2. Add a line to `PRODUCTS` in `src/config.js` (`type` is one of packet, box, jar, pencilbox, car, dvd, cassette, top).
It is stocked on shelves matching its `pool` automatically. A new *kind* of object = one builder function in `src/world/products.js`
returning `{ g, base, actions:[{label, fn}], update?, ensure? }`.

## Honest notes
- **Packaging art is stylised, not accurate.** The PNGs are generated look-alikes with the right names and colours, not scans.
  For historical accuracy, replace files in `public/assets/products` with real reference photos (same filenames).
  The DVD titles are fictional on purpose.
- **Models are code-built primitives**, lit with real PBR materials. The next big quality jump is real glTF models for the
  hero objects (keeper, CRT, jars) and baked lighting.
- It was verified with a headless test and a production build, but **not on a real GPU in a browser by me**. Expect to tune
  lighting (`LIGHT` in `config.js`) and walking speed (`player.js`).
- Performance: ~3,000 meshes. If it is slow, lower the pixel ratio in `main.js`, or raise the skip chance in `src/world/shelves.js`.
