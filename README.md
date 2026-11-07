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
- **The Brownout:** the game opens in your workshop the night the Heartforge skips a beat. A Maker capsule crashes into Ashgrove's crater, and the core you fit into its frame decides which bot it becomes.
- **Kael** is a rival salvager from Brasston who reached the capsule second. **Vesna** is a Maker researcher with a field station by the dead relay tower.
- **Ashgrove**, a village inside a crater; **the Wreckfield**, a crashed Maker ship surrounded by scrap drifts, crystal beds, fog banks, static fields and an ice-slide field; **Brasston**, a three-terrace mining town; **the Mirrorlake Drifts**, a frozen lake slide puzzle and a titan's spine bridge; **Voltmere**, a city on stilts.
- Different ferals live in each terrain. Ice slides keep you moving until you hit something, and deep snow slows you down.
- Repair Caravans run by Juno. Scrap traders accept Cr or scrap. Every house is furnished to suit whoever lives there.
- 36 alien shardbots with core traits, socket evolution (Lv 16) and Overdrive
- The Forge, Refined shards, modules, 3 side quests, glitched variants, rematch board, Bestiary rewards
- Weather, minimap and world map, quest log, type chart, autosave, save codes, phone fullscreen mode

## Chapter 2: The Rustworks
Talk to Vesna in Brasston after Chapter 1 to open Voltmere's east road.
- Route 3 to the Rustworks: a Choir-held factory full of conveyor belts and lever-switched routes, a fight beside (or against) Kael depending on how you treated him, and a Maker archive you can hand to Vesna, hand to the Choir, or keep
- Ferrow and Warden Hask (Iron Prime): push crates onto moving belts to open the gym
- Route 4's geyser fields and Kilnhaven's Warden Sora (Flame Prime): time your crossing between steam vents
- 6 new shardbots (Frostling, Cogwyrm and Kilnfly lines), 3 new traits, collectible Maker Logs, and a Choir signal that sets up Chapter 3
- Thawed regions now look like early thaw, with muted greens, leftover snow and light flurries, and night towns stay dark

## Visuals
- Soft cast shadows from trees, buildings, cliffs and wrecks. Shadow under walls and cliffs, and shadows that stretch away from street lamps.
- Water that gets darker with depth, has foam along the shore, shimmers, and reflects lamps and anyone standing at the edge. Ice that glints, with spray when you stop sliding.
- Coloured light that spills from lamps, crystals and engines, snow piled on roofs, footprints that fade, drifting fog, static sparks and passing cloud shadows.
- Soft edges between terrain types, tree tops and lamp heads you can walk behind, and interiors with shaded walls and a warm vignette.
- Battle arenas that match the terrain (scrap, crystal, static, fog, ice, shore), with bot shadows, ground glow from each bot's core, and reflections on ice.
- Reflections: lakes and ice mirror the trees, houses and cliffs along their shores, plus everyone standing on or beside them (you, your follower, ferals). Lab and gym floors are shiny. Water shows stars at night, turns violet in static storms and flashes when lightning strikes.
- Rain on thawed maps comes in showers, with streaks at different depths, splashes, puddles and ripples. Drops hit the screen like a camera lens: they show a tiny upside-down view of the world behind them, and some slide down. Voltmere gets sleet.
- Shore foam that moves, ripples when you walk beside water, heat haze over vents and furnaces, light shafts in fog.
- A day and night cycle on outdoor maps (24 minutes of play), with dusk colours, lamps that show up after dark, and lightning in static storms.
- At night, characters near lamps get a coloured outline, your follower's core lights the way, and ferals' eyes glow. Snow builds up on you in snowfall and shakes off indoors.
- Battle skies: aurora up north, factory smoke in the Rustworks, an ember sky around Kilnhaven. Every attack lights up the arena, and rain falls in battle too.
- Options → Visual effects: Low turns the per-frame effects off on slower phones.

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
