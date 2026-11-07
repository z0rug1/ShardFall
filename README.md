# Shardfall: Ember Protocol

A browser monster-collecting RPG in the style of a GBA classic, with an original world and original creatures.

Calderra is freezing. The Heartforge under Mt. Cinder, the reactor that powers every **shardbot** on the peninsula, is failing. You set out to collect the Wardens' Prime Shards before it goes dark, while the Hollow Choir works to silence it for good.

**Play:** https://z0rug1.github.io/ShardFall/
On phones the game runs fullscreen in landscape. On iPhone, use Share → Add to Home Screen and launch it from there.

## Chapter 1: The Relay Road
- 36 alien shardbots (11 base frames, 25 evolved forms), drawn in code at high resolution, with idle animations
- **Socket evolution:** at Lv 16 the second socket opens, and the shard you fit decides the evolution branch (preview first; one swap allowed)
- **Core traits:** every frame has a passive ability (Afterburn, Bulwark, Volt Sink, Dread Aura…)
- **Overdrive:** fill the gauge in battle for one cinematic 110-power shard strike
- **The Forge:** salvage Scrap into shards, refine 3 shards into a Refined shard (+10% moves), fuse into Prime Fragments
- **Modules:** equippable held items (Coolant Fin, Plating Kit, Overclock Chip, Repair Nanites)
- **Weather:** snow, freezing night, blizzards and static storms change visibility and boost or weaken types
- Typed move animations, damage numbers, screen shake, smarter trainer AI that switches and times its Overdrive
- Puzzles: crate plates, red/blue switch barriers, Maker memory terminals, power-conduit routing
- 3 side quests, rare Glitched variants, Rematch Board, Bestiary rewards and Navi-band skins
- Minimap with fog of war, world map with fast travel, quest log, type chart, autosave + 3 slots, save codes to move between devices
- Phone: fullscreen landscape play, big buttons, opacity, left-handed layout, vibration

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
