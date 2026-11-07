# Shardfall: Ember Protocol

A browser monster-collecting RPG in the style of a GBA classic, with an original world and original creatures.

Calderra is freezing. The Heartforge under Mt. Cinder, the reactor that powers every **shardbot** on the peninsula, is failing. You set out to collect the Wardens' Prime Shards before it goes dark, while the Hollow Choir works to silence it for good.

**Play:** https://z0rug1.github.io/ShardFall/
On phones the game runs fullscreen in landscape. On iPhone, use Share → Add to Home Screen and launch it from there.

## What makes Shardfall different
- **The Thaw:** Calderra starts frozen. Beating Wardens and repairing Relay Pylons thaws regions for good: the palette warms, snow melts, sealed paths open and new bots appear.
- **Heat, not PP:** moves build Heat. Overheat and your bot is forced to vent. Frost moves cool you down, Flame runs hot, and weather changes the rate.
- **Visible ferals:** no random encounters. Ferals roam the grass. Some flee, some hunt you, Alphas carry bounties. Hit one from behind for a sneak attack, or get ambushed.
- **Your lead bot follows you** and its type does the field work: Flame melts black ice, Brawl smashes cracked rock, Volt powers pylons, Gale glides over water, Tide surfs.
- **Modular bodies:** fit ARM / CORE / LEG parts that change how your bot looks and add stats or moves.
- **Link battles:** Rival, Choir and Warden duos fight with a partner who assists every turn, and matching shards unlock a Link Strike.
- **Scan & research:** scan bots in battle to reveal weaknesses, traits and evolution trees.
- **Choices:** your answers build Warden or Choir reputation and shape Kael's attitude, with shop discounts and a Choir defector already in Chapter 1.
- **Ashgrove Workshop:** display pedestals, a training rig, Forge upgrades, decorations.
- **Maker Vault:** endless randomly generated floors with no free healing. Escape to keep your loot, black out and lose it. Leaderboard of your deepest runs.

## Chapter 1: The Relay Road
- 36 alien shardbots with core traits, socket evolution (Lv 16) and Overdrive
- The Forge, Refined shards, modules, 3 side quests, glitched variants, rematch board, Bestiary rewards
- Puzzles, weather, minimap and world map, quest log, type chart, autosave, save codes, phone fullscreen mode

## Chapter 2: The Rustworks
Talk to Vesna in Brasston after Chapter 1 to open Voltmere's east road.
- Route 3 to the Rustworks: a Choir-held factory full of conveyor belts and lever-switched routes, a fight beside (or against) Kael depending on how you treated him, and a Maker archive you can hand to Vesna, hand to the Choir, or keep
- Ferrow and Warden Hask (Iron Prime): push crates onto moving belts to open the gym
- Route 4's geyser fields and Kilnhaven's Warden Sora (Flame Prime): time your crossing between steam vents
- 6 new shardbots (Frostling, Cogwyrm and Kilnfly lines), 3 new traits, collectible Maker Logs, and a Choir signal that sets up Chapter 3
- Thawed regions now look like early thaw, with muted greens, leftover snow and light flurries, and night towns stay dark

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
