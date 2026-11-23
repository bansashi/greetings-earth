# greetings, earth!

*a tidepool of small things*

A single-page personal blog by "minnow", built like a 2007 Blogger/WordPress template crossed with a neocities shrine site: posts about niche 90s and 00s games, manga, ambient records and field recordings, plus pixel art, web toys, a shoutbox, a guestbook and shrines. As you scroll, the template stays exactly as it is, and what minnow puts inside it comes apart.

Open `index.html` in a browser, or serve the folder (`python3 -m http.server`). There is no build step. Everything except the Google Fonts is drawn or synthesized in the browser.

## How it works

- **A fixed frame.** The header, the welcome marquee, the nav bar, the sidebar layout and the colours never change. The only frame-level changes are ones minnow would make by hand: edited text, a new nav link, new entries in the site updates log, and the banner. In the banner the water level creeps up, and very late the sun gets "fixed", which the updates log mentions.
- **The arc.** 30 authored posts in five stages, loaded two at a time as you scroll (`js/posts.js`). Then `js/endless.js` generates posts forever: transmissions, HolyC-style listings, corrupted reruns of early posts, removed posts, auto-saved drafts, dead image links, and normal-looking posts that aren't normal.
- **Derangement ratchets.** `GE.D` tracks how far down you've read, and it only goes up. Older posts keep mutating when you aren't looking. The sidebar keeps being edited too: status, to-do list, updates log, blog list, stamps.
- **Social features** (`js/social.js`):
  - Blogger-style comments with word verification. You can post, minnow replies, and later your comments get removed or rewritten.
  - Reactions checkboxes.
  - A shoutbox where friends chat, worry, and eventually go quiet, and where shouts start appearing under your name.
  - A recent comments widget.
  - A full guestbook page.
- **Subpages** (`js/pages.js`): about me, shrines, links (with "link to me" code), guestbook, 404 pages for friends' dead sites, and a hidden directory listing reachable from the footer.
- **Toys** (`js/toys.js`): aquarium, ambient mixer, Bloop the axolotl, pixel painter, omikuji machine, creek ripple, air meter, the tide oracle, and the LAGOON/OS terminal.
- **Personalization.** Your guestbook, comment or shoutbox name, local time and timezone, window size and minutes on the page are used in the text. All of this stays in your own browser (`localStorage`). Nothing is sent anywhere.

## Notes

- Sound only starts when you touch a mixer slider, the frog, or the tidepool button. **hush** always really stops everything.
- No flashing. `prefers-reduced-motion` turns off the jitter, the blinkies and the cursor bubbles.
- `?depth=0.8` previews the site at a given derangement (0–1.5). It also works with page hashes, e.g. `?depth=0.9#shrines`.
- Content: a slow-burn horror piece about someone losing their grip. No gore, nothing graphic.

## Files

```
index.html        template: splash, header, nav, sidebar widgets, footer
css/style.css     the template + how late posts render inside it
js/util.js        helpers, storage, colour, 3x5 pixel font, animation loop
js/corrupt.js     text corruption + the tide's vocabulary
js/sprites.js     pixel sprites and their rot
js/audio.js       Web Audio ambient engine
js/scenes.js      header lagoon, the café, minnow's room
js/toys.js        the toys
js/posts.js       the 30 authored posts
js/endless.js     what comes after
js/social.js      comments, reactions, word verification, shoutbox, guestbook
js/widgets.js     sidebar + header text minnow keeps editing
js/pages.js       subpages and the router
js/main.js        feed, ratchet, splash, sidebar behaviour
```
