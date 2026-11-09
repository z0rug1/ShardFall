// ===================== CHAPTER 3–4 BOTS, TRAITS, KEY ITEMS =====================
// ---- new bots ----
frame('brinejaw','Brinejaw','Tide',[52,54,58,40],'beetle','#3a8ab8',[[1,'tackle'],[1,'waterjet'],[8,'reinforce'],[14,'bubbleshot'],[22,'tidalram']],{Iron:'hullbreaker',Volt:'stormkeel'},120,'A barnacle-armoured salvage drone that grinds through ship hulls. Its jaw never stops turning.');
form('hullbreaker','Hullbreaker','brinejaw','Iron',[[0,'ironbash'],[30,'plating']],'Iron shard fitted. It drags whole wrecks off the seabed.');
form('stormkeel','Stormkeel','brinejaw','Volt',[[0,'sparkarc'],[30,'thundercoil']],'Volt shard fitted. Lightning crawls along its keel.');
frame('squallkite','Squallkite','Gale',[40,50,38,68],'bird','#b8d4e0',[[1,'gust'],[1,'tackle'],[9,'tailwind'],[15,'airslice'],[24,'boost']],{Volt:'tempestwing',Shade:'nightglider'},140,'A paper-thin wing drone that rides cliff updrafts for days without landing.');
form('tempestwing','Tempestwing','squallkite','Volt',[[0,'sparkarc'],[30,'thundercoil']],'Volt shard fitted. It flies inside thunderheads on purpose.');
form('nightglider','Nightglider','squallkite','Shade',[[0,'shadowclaw'],[30,'dreadglare']],'Shade shard fitted. Its wings drink light.');
frame('cinderwisp','Cinderwisp','Spirit',[42,56,40,58],'lantern','#c8b0ff',[[1,'wisptouch'],[1,'tackle'],[10,'hexpulse'],[17,'soulpulse'],[26,'boost']],{Flame:'pyrewraith',Frost:'rimeghost'},90,'A drifting ember that the old Makers say carries a memory. Nobody knows whose.');
form('pyrewraith','Pyrewraith','cinderwisp','Flame',[[0,'emberspit'],[32,'flamerush']],'Flame shard fitted. It burns without fuel.');
form('rimeghost','Rimeghost','cinderwisp','Frost',[[0,'frostbite'],[32,'icelance']],'Frost shard fitted. Its touch leaves frost shaped like handprints.');
frame('glacimite','Glacimite','Frost',[56,58,62,32],'golem','#9ac8e8',[[1,'tackle'],[1,'frostbite'],[11,'reinforce'],[18,'icelance'],[27,'rockslam']],{Stone:'avalanche',Brawl:'frostfist'},100,'A boulder of blue ice with a furnace heart. Mt. Cinder\'s miners swear they move at night.');
form('avalanche','Avalanche','glacimite','Stone',[[0,'rockslam'],[32,'plating']],'Stone shard fitted. When it charges, the mountain comes with it.');
form('frostfist','Frostfist','glacimite','Brawl',[[0,'jab'],[32,'ironbash']],'Brawl shard fitted. Its fists are glaciers.');
frame('glacivore','Glacivore','Frost',[110,112,104,72],'golem','#4a7aa8',[[1,'icelance'],[1,'rockslam'],[1,'plating'],[1,'dreadglare'],[50,'thundercoil']],{},3,'The Makers\' war-titan, frozen inside the Heartforge for a thousand years. It remembers every order it was ever given.');
BOTS.glacivore.types=['Frost','Iron'];
for(const id of ['brinejaw','hullbreaker','stormkeel','squallkite','tempestwing','nightglider','cinderwisp','pyrewraith','rimeghost','glacimite','avalanche','frostfist','glacivore'])if(!DEX_ORDER.includes(id))DEX_ORDER.push(id);
for(const [id,mv] of Object.entries({brinejaw:'tidalram',squallkite:'airslice',cinderwisp:'soulpulse',glacimite:'icelance'}))if(!MOVES[mv])console.warn('missing move',mv);
Object.assign(FERAL_BEH,{brinejaw:'hunt',squallkite:'flee',cinderwisp:'wander',glacimite:'hunt'});
Object.assign(TRAITS,{brinejaw:{n:'Ballast',d:'Takes 25% less damage from Volt and Gale moves.'},squallkite:{n:'Slipstream',d:'Gale moves hit 30% harder.'},cinderwisp:{n:'Afterglow',d:'Spirit moves hit 30% harder in the dark (night, caves, storms).'},glacimite:{n:'Permafrost',d:'Takes 25% less damage from Flame moves.'},glacivore:{n:'Titan Core',d:'Takes 25% less damage from everything.'}});
// ---- key items ----
Object.assign(ITEMS,{prime5:{n:'Tide Prime',d:'Prime Shard from Warden Maren. It sloshes, though it is solid.',cat:'key'},prime6:{n:'Gale Prime',d:'Prime Shard from Warden Pell-Ashe. Lighter than air.',cat:'key'},
  prime7:{n:'Frost Prime',d:'Prime Shard from Warden Yoru. It never warms in your hand.',cat:'key'},prime8:{n:'Spirit Prime',d:'Prime Shard from the Spirit Warden. It hums an old Maker song.',cat:'key'},
  skiff:{n:'Icebreaker Skiff',d:'A folding Maker boat. Use it on open water, even rough sea (face the water and press A).',cat:'key'}});
