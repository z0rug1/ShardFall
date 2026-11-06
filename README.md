# Shardfall: Ember Protocol

A browser monster-collecting RPG in the style of a GBA classic, with an original world and original creatures.

Calderra is freezing. The Heartforge under Mt. Cinder, the reactor that powers every **shardbot** on the peninsula, is failing. You set out to collect the Wardens' Prime Shards before it goes dark, while the Hollow Choir works to silence it for good.

**Play:** https://z0rug1.github.io/ShardFall/
On phones the game runs fullscreen in landscape. On iPhone, use Share → Add to Home Screen and launch it from there.

## Chapter 1: The Relay Road
- 36 alien shardbots (11 base frames, 25 evolved forms), all drawn in code
- **Socket evolution:** at Lv 16 the second socket opens, and the shard you fit decides the evolution branch (one swap allowed, then it locks)
- **Overdrive:** a gauge that fills in battle and unleashes one 110-power shard move
- Puzzles: crate plates, red/blue switch barriers, a Maker memory terminal, power-conduit routing
- Minimap with fog of war, full world map with fast travel, Bestiary, shops, storage, 3 save slots

## Controls
| Keyboard | Phone | Action |
|---|---|---|
| Arrows / WASD | D-pad | Move |
| Z / Space | A | Talk / confirm |
| X (hold) | B (hold) | Back / run |
| Enter | START | Menu |
| M | MAP | World map |

## Development
Source lives in `src/` as plain JS. To rebuild the single-file game:
```
python3 build.py --pwa
```
This writes `index.html`. GitHub Pages serves it from the repo root.

Font: VT323 by Peter Hull (SIL Open Font License), embedded in the page.
