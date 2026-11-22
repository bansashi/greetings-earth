# greetings, earth!

*a tidepool of small things: old games, slow manga & sounds recorded near water*

A single-page personal blog with infinite scroll, written by "minnow": posts about niche 90s and 00s games, manga, ambient records and field recordings, with pixel art and small web toys. As you scroll, the page gets worse. Slowly at first, then all at once.

Open `index.html` in a browser, or serve the folder (`python3 -m http.server`). There is no build step and nothing to install. Everything except the Google Fonts is drawn or synthesized in the browser.

## How it works

- **The arc.** 30 authored posts in five stages, loaded two at a time (`js/posts.js`). After that, `js/endless.js` generates posts forever: tide "transmissions", HolyC-style code listings, corrupted reruns of early posts, and occasional "normal" posts in the original palette that aren't normal.
- **Derangement ratchets.** A single value, `GE.D`, tracks how far down you've read, and it only goes up. Scrolling back to the top won't restore anything. Older posts also keep mutating while you aren't looking at them.
- **What it drives:** the palette (which snaps into a 16-colour VGA "LAGOON/OS" around 80%), fonts, tilt, scanlines and vignette, the header scene (water rises, the sun opens, monoliths surface), page title, favicon, sidebar widgets, loading messages, cursor bubbles, ghost words, pop-up windows, and every toy.
- **Toys** (`js/toys.js`): Professor Gill's aquarium (click to feed), a generative ambient mixer (rain / creek / birds / pentatonic chimes, plus a fifth channel that appears later), Bloop the axolotl, a 16×16 pixel painter, an omikuji capsule machine, a guestbook, a touchable creek, an air meter, the tide oracle, and a working LAGOON/OS terminal (`help`, `ls`, `cat you.txt`…).
- **Personalization.** If you sign the guestbook, later posts, the fish, the oracle and the terminal use your name. It also uses your local time, window width and minutes on the page. All of this stays in your own browser (`localStorage`). Nothing is sent anywhere.

## Notes

- Sound only starts when you touch a mixer slider, the frog, or the tidepool button. **hush** always really stops everything, whatever its label says by then.
- No strobing. The one "subliminal" effect is a single 110 ms frame at most every ~22 s, and only near the end. `prefers-reduced-motion` turns off flashes, jitter, glitches, ghost words and the cursor trail.
- `?depth=0.8` starts the chrome at a given derangement (0–1.5), for previewing or for the impatient.
- Content: it's a slow-burn horror piece about someone losing their grip. No gore, nothing graphic.

## Files

```
index.html        page shell + sidebar
css/style.css     base look, stage styles (g0–g5 page-wide, st0–st5 per post), overlays
js/util.js        helpers, storage, colour, 3×5 pixel font, animation loop
js/corrupt.js     text corruption + the tide's vocabulary
js/sprites.js     pixel sprites (hand-placed strings + procedural), sprite rot
js/audio.js       Web Audio ambient engine
js/scenes.js      header lagoon, the café by the sea, minnow's room
js/toys.js        the toys
js/posts.js       the 30 authored posts
js/endless.js     what comes after
js/main.js        feed, derangement ratchet, chrome, ambient effects
```
