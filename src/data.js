// ===================== DATA =====================
const TYPES=['Core','Flame','Tide','Bloom','Volt','Stone','Gale','Frost','Shade','Spirit','Iron','Brawl'];
const TCOL={Core:'#c8c8d4',Flame:'#ff6a2a',Tide:'#3a9cff',Bloom:'#4fcf62',Volt:'#ffd43a',Stone:'#b8905a',Gale:'#7fe6d4',Frost:'#aee6ff',Shade:'#9a6ae6',Spirit:'#f39cff',Iron:'#a0aec0',Brawl:'#e8504a'};
const SE={Flame:['Bloom','Frost','Iron'],Tide:['Flame','Stone'],Bloom:['Tide','Stone'],Volt:['Tide','Gale'],Stone:['Flame','Gale','Frost'],Gale:['Bloom','Brawl'],Frost:['Bloom','Gale'],Shade:['Spirit'],Spirit:['Shade','Brawl'],Iron:['Stone','Frost'],Brawl:['Core','Stone','Iron','Frost'],Core:[]};
const RES={Flame:['Tide','Stone','Flame'],Tide:['Bloom','Tide'],Bloom:['Flame','Gale','Iron','Bloom'],Volt:['Stone','Bloom','Volt'],Stone:['Brawl','Iron'],Gale:['Volt','Stone','Iron'],Frost:['Flame','Iron','Frost'],Shade:['Shade','Brawl'],Spirit:['Iron'],Iron:['Flame','Tide','Volt','Iron'],Brawl:['Gale','Spirit'],Core:['Stone','Iron']};
function typeEff(atk,defTypes){let m=1;for(const d of defTypes){if(SE[atk].includes(d))m*=2;else if(RES[atk].includes(d))m*=0.5;}return m;}

const MOVES={
tackle:{n:'Tackle',t:'Core',p:40,a:100,pp:35},
ramjet:{n:'Ram Jet',t:'Core',p:70,a:95,pp:15},
scan:{n:'Scan',t:'Core',p:0,a:100,pp:20,e:{stat:'def',s:-1},d:'Lowers the foe\'s DEF.'},
boost:{n:'Boost',t:'Core',p:0,a:0,pp:20,e:{self:1,stat:'atk',s:1},d:'Raises own ATK.'},
reinforce:{n:'Reinforce',t:'Core',p:0,a:0,pp:20,e:{self:1,stat:'def',s:1},d:'Raises own DEF.'},
emberspit:{n:'Ember Spit',t:'Flame',p:40,a:100,pp:25,e:{st:'burn',c:10}},
flamerush:{n:'Flame Rush',t:'Flame',p:65,a:100,pp:15,e:{st:'burn',c:10}},
heatwave:{n:'Heat Wave',t:'Flame',p:85,a:90,pp:10,e:{st:'burn',c:20}},
waterjet:{n:'Water Jet',t:'Tide',p:40,a:100,pp:25},
bubbleshot:{n:'Bubble Shot',t:'Tide',p:55,a:100,pp:20,e:{stat:'spd',s:-1,c:30}},
tidalram:{n:'Tidal Ram',t:'Tide',p:80,a:90,pp:10},
acidleak:{n:'Acid Leak',t:'Tide',p:35,a:100,pp:20,e:{st:'corrode',c:30}},
vinelash:{n:'Vine Lash',t:'Bloom',p:45,a:100,pp:25},
leechroot:{n:'Leech Root',t:'Bloom',p:50,a:100,pp:15,e:{drain:.5},d:'Heals by half the damage.'},
seedbomb:{n:'Seed Bomb',t:'Bloom',p:75,a:95,pp:10},
sporepuff:{n:'Spore Puff',t:'Bloom',p:0,a:75,pp:15,e:{st:'sleep',c:100},d:'Puts the foe to sleep.'},
zap:{n:'Zap',t:'Volt',p:40,a:100,pp:25,e:{st:'shock',c:10}},
sparkarc:{n:'Spark Arc',t:'Volt',p:65,a:100,pp:15,e:{st:'shock',c:20}},
thundercoil:{n:'Thunder Coil',t:'Volt',p:90,a:85,pp:10,e:{st:'shock',c:30}},
staticfield:{n:'Static Field',t:'Volt',p:0,a:90,pp:15,e:{st:'shock',c:100},d:'Shocks the foe.'},
pebbleshot:{n:'Pebble Shot',t:'Stone',p:40,a:100,pp:25},
rockslam:{n:'Rock Slam',t:'Stone',p:70,a:90,pp:15},
harden:{n:'Harden',t:'Stone',p:0,a:0,pp:20,e:{self:1,stat:'def',s:2},d:'Sharply raises own DEF.'},
quakehammer:{n:'Quake Hammer',t:'Stone',p:90,a:85,pp:10},
gust:{n:'Gust',t:'Gale',p:40,a:100,pp:25},
airslice:{n:'Air Slice',t:'Gale',p:65,a:95,pp:15},
tailwind:{n:'Tailwind',t:'Gale',p:0,a:0,pp:15,e:{self:1,stat:'spd',s:2},d:'Sharply raises own SPD.'},
frostbite:{n:'Frost Bite',t:'Frost',p:45,a:100,pp:25,e:{st:'freeze',c:10}},
icelance:{n:'Ice Lance',t:'Frost',p:75,a:95,pp:10,e:{st:'freeze',c:10}},
shadowclaw:{n:'Shadow Claw',t:'Shade',p:60,a:100,pp:15},
hexpulse:{n:'Hex Pulse',t:'Shade',p:50,a:100,pp:15,e:{st:'glitch',c:30}},
dreadglare:{n:'Dread Glare',t:'Shade',p:0,a:100,pp:20,e:{stat:'atk',s:-1},d:'Lowers the foe\'s ATK.'},
wisptouch:{n:'Wisp Touch',t:'Spirit',p:45,a:100,pp:25},
soulpulse:{n:'Soul Pulse',t:'Spirit',p:70,a:100,pp:15},
metalclaw:{n:'Metal Claw',t:'Iron',p:50,a:95,pp:25,e:{self:1,stat:'atk',s:1,c:20}},
ironbash:{n:'Iron Bash',t:'Iron',p:75,a:95,pp:15},
plating:{n:'Plating',t:'Iron',p:0,a:0,pp:15,e:{self:1,stat:'def',s:2},d:'Sharply raises own DEF.'},
rustspray:{n:'Rust Spray',t:'Iron',p:40,a:100,pp:20,e:{st:'corrode',c:30}},
jab:{n:'Jab',t:'Brawl',p:40,a:100,pp:25},
pistonpunch:{n:'Piston Punch',t:'Brawl',p:70,a:100,pp:15},
bulkup:{n:'Bulk Up',t:'Brawl',p:0,a:0,pp:15,e:{self:1,stat:'atk',s:1,stat2:'def'},d:'Raises own ATK and DEF.'},
};
const OD_NAMES={Core:'Core Burst',Flame:'Inferno Core',Tide:'Riptide Core',Bloom:'Overgrowth',Volt:'Gigavolt',Stone:'Landslide',Gale:'Cyclone Drive',Frost:'Absolute Zero',Shade:'Eclipse',Spirit:'Soul Flare',Iron:'Steel Crash',Brawl:'Max Piston'};
const STATUS={burn:{n:'BRN',c:'#ff7040'},freeze:{n:'FRZ',c:'#9be0ff'},shock:{n:'SHK',c:'#f0d030'},corrode:{n:'COR',c:'#b060d0'},sleep:{n:'SLP',c:'#9090a0'},glitch:{n:'GLT',c:'#40e0c0'}};

const BOTS={};
const SHARD_BONUS={Flame:[0,12,0,4],Tide:[12,4,4,0],Bloom:[10,0,8,0],Volt:[0,6,0,14],Stone:[6,4,14,-4],Gale:[0,4,0,14],Frost:[4,6,8,2],Shade:[0,12,0,6],Spirit:[4,6,4,8],Iron:[4,4,16,-2],Brawl:[4,16,2,0],Core:[0,0,0,0]};
function frame(id,name,type,base,shape,col,learn,branches,cr,desc){
  BOTS[id]={id,name,types:[type],base,shape,col,learn,branches,cr,exp:62,stage:0,frame:id,desc};
}
function form(id,name,from,shard,learn,desc){
  const f=BOTS[from];const b=SHARD_BONUS[shard];
  const base=f.base.map((v,i)=>Math.round(v*1.3+b[i]));
  const types=f.types[0]===shard?[shard]:[f.types[0],shard];
  BOTS[id]={id,name,types,base,shape:f.shape,col:f.col,learn:f.learn.concat(learn),branches:null,cr:60,exp:150,stage:1,frame:from,shard,desc};
}
frame('flicker','Flicker','Flame',[39,52,43,62],'fox','#d4583a',[[1,'tackle'],[1,'emberspit'],[4,'boost'],[9,'scan'],[13,'flamerush'],[24,'heatwave']],{Volt:'arcvix',Gale:'pyrowing',Iron:'forgehound'},45,'A floating sentinel from the Maker forges. Its fins vent plasma to stay aloft.');
frame('drizzlet','Drizzlet','Tide',[44,48,56,50],'newt','#3a74c0',[[1,'tackle'],[1,'waterjet'],[4,'reinforce'],[9,'acidleak'],[13,'bubbleshot'],[24,'tidalram']],{Volt:'voltrout',Frost:'rimewyrm',Bloom:'mirelurk'},45,'An orb-hull probe ringed by a coolant band. It once mapped the flooded Maker vaults.');
frame('thornbit','Thornbit','Bloom',[48,50,60,40],'tortoise','#4a9040',[[1,'tackle'],[1,'vinelash'],[4,'reinforce'],[9,'leechroot'],[13,'sporepuff'],[24,'seedbomb']],{Stone:'bouldershell',Tide:'lotusurge',Shade:'hexbriar'},45,'A tripod spire that grows living crystal from its dome. Nobody knows what it is farming.');
frame('pipsprock','Pipsprock','Core',[36,42,36,58],'bird','#c8a46a',[[1,'tackle'],[5,'gust'],[9,'scan'],[13,'ramjet']],{Gale:'skyrivet',Volt:'thundrone'},230,'A halo drone. Swarms still trace old Maker signal routes, carrying nothing.');
frame('boltbun','Boltbun','Volt',[38,44,36,66],'rabbit','#e0b830',[[1,'tackle'],[1,'zap'],[6,'tailwind'],[10,'jab'],[14,'sparkarc']],{Gale:'zephbun',Brawl:'jabbit'},200,'A spindly walker with twin spire antennae that drink static from the air.');
frame('scrapmite','Scrapmite','Iron',[40,48,58,34],'beetle','#7c8c98',[[1,'tackle'],[4,'rustspray'],[8,'metalclaw'],[12,'plating'],[16,'ironbash']],{Stone:'crushbug',Flame:'weldrake'},200,'A hex-shelled crawler that strips scrap down to neat little bolts.');
frame('sporelet','Sporelet','Bloom',[42,40,44,42],'spore','#9cc868',[[1,'tackle'],[1,'vinelash'],[5,'sporepuff'],[10,'leechroot'],[15,'seedbomb']],{Shade:'rotcap',Gale:'pollenwing'},190,'A bloom pod. Its petal panels release spores that put other bots into sleep mode.');
frame('pebblit','Pebblit','Stone',[46,56,64,26],'golem','#8c7c6a',[[1,'tackle'],[1,'pebbleshot'],[5,'harden'],[10,'rockslam'],[18,'quakehammer']],{Iron:'ironcrag',Flame:'magmaw'},180,'A floating monolith whose fists hover beside it. Often mistaken for ruins.');
frame('gearpup','Gearpup','Brawl',[44,58,42,54],'dog','#b46440',[[1,'tackle'],[1,'jab'],[6,'boost'],[10,'bulkup'],[14,'pistonpunch']],{Iron:'ironpaw',Volt:'shockhound'},180,'A hover-frame bodyguard with detached fists. It never stops scanning.');
frame('dripcell','Dripcell','Tide',[42,40,42,52],'jelly','#58b4d8',[[1,'waterjet'],[4,'acidleak'],[8,'zap'],[12,'bubbleshot']],{Volt:'ampjelly',Spirit:'phantide'},180,'A saucer drone that trails coolant cables. It hums over ponds near old reactors.');
frame('gloomlamp','Gloomlamp','Shade',[40,52,40,50],'lantern','#4c3c70',[[1,'tackle'],[1,'dreadglare'],[6,'hexpulse'],[11,'shadowclaw'],[16,'wisptouch']],{Spirit:'wispire',Flame:'cinderlamp'},120,'An obelisk ringed by orbiting shards. Its eye holds a dark, patient glow.');

form('arcvix','Arcvix','flicker','Volt',[[0,'sparkarc'],[22,'thundercoil']],'Volt shard fitted. Arcs of plasma crackle between its fins.');
form('pyrowing','Pyrowing','flicker','Gale',[[0,'airslice'],[22,'tailwind']],'Gale shard fitted. It glides on its own heat currents.');
form('forgehound','Forgehound','flicker','Iron',[[0,'ironbash'],[22,'plating']],'Iron shard fitted. Its armour glows red after battle.');
form('voltrout','Voltrout','drizzlet','Volt',[[0,'sparkarc'],[22,'thundercoil']],'Volt shard fitted. Its ring band pulses with stunning current.');
form('rimewyrm','Rimewyrm','drizzlet','Frost',[[0,'icelance'],[22,'frostbite']],'Frost shard fitted. Its coolant runs below freezing.');
form('mirelurk','Mirelurk','drizzlet','Bloom',[[0,'leechroot'],[22,'seedbomb']],'Bloom shard fitted. Crystal reeds sprout along its orbit band.');
form('bouldershell','Bouldershell','thornbit','Stone',[[0,'rockslam'],[22,'harden']],'Stone shard fitted. Its dome is armoured in basalt plates.');
form('lotusurge','Lotusurge','thornbit','Tide',[[0,'bubbleshot'],[22,'tidalram']],'Tide shard fitted. A liquid lotus forms on its dome when it is calm.');
form('hexbriar','Hexbriar','thornbit','Shade',[[0,'hexpulse'],[22,'shadowclaw']],'Shade shard fitted. Its crystals turn black and hum quietly.');
form('skyrivet','Skyrivet','pipsprock','Gale',[[0,'airslice'],[20,'tailwind']],'Gale shard fitted. It surfs storm fronts for fun.');
form('thundrone','Thundrone','pipsprock','Volt',[[0,'sparkarc'],[22,'thundercoil']],'Volt shard fitted. Lightning seems to follow it.');
form('zephbun','Zephbun','boltbun','Gale',[[0,'airslice']],'Gale shard fitted. Its spires spin up into rotor blades.');
form('jabbit','Jabbit','boltbun','Brawl',[[0,'pistonpunch'],[20,'bulkup']],'Brawl shard fitted. Its hands became pile-driver fists.');
form('crushbug','Crushbug','scrapmite','Stone',[[0,'rockslam']],'Stone shard fitted. Its mandibles crack boulders.');
form('weldrake','Weldrake','scrapmite','Flame',[[0,'flamerush']],'Flame shard fitted. It welds its own armour shut every night.');
form('rotcap','Rotcap','sporelet','Shade',[[0,'hexpulse'],[18,'shadowclaw']],'Shade shard fitted. Its spores glow violet in the dark.');
form('pollenwing','Pollenwing','sporelet','Gale',[[0,'airslice']],'Gale shard fitted. It drifts for miles on a single breeze.');
form('ironcrag','Ironcrag','pebblit','Iron',[[0,'ironbash'],[20,'plating']],'Iron shard fitted. Steel-wrapped monolith, very hard to dent.');
form('magmaw','Magmaw','pebblit','Flame',[[0,'flamerush']],'Flame shard fitted. Magma pools in its open seams.');
form('ironpaw','Ironpaw','gearpup','Iron',[[0,'metalclaw'],[20,'ironbash']],'Iron shard fitted. Its fists are solid steel.');
form('shockhound','Shockhound','gearpup','Volt',[[0,'sparkarc']],'Volt shard fitted. Every punch discharges a bolt.');
form('ampjelly','Ampjelly','dripcell','Volt',[[0,'sparkarc'],[20,'staticfield']],'Volt shard fitted. Swimming near it is a bad idea.');
form('phantide','Phantide','dripcell','Spirit',[[0,'soulpulse']],'Spirit shard fitted. It drifts through walls like mist.');
form('wispire','Wispire','gloomlamp','Spirit',[[0,'soulpulse']],'Spirit shard fitted. Its eye now holds a tiny star.');
form('cinderlamp','Cinderlamp','gloomlamp','Flame',[[0,'flamerush']],'Flame shard fitted. Its orbiting shards burn like embers.');
BOTS.pyrakh={id:'pyrakh',name:'Pyrakh',types:['Flame','Core'],base:[100,110,100,100],shape:'lantern',col:'#ff9040',learn:[],cr:3,exp:300,stage:2,frame:'pyrakh',desc:'The guardian core of the Heartforge. Never seen.',legend:1};
BOTS.glacivore={id:'glacivore',name:'Glacivore',types:['Frost','Iron'],base:[110,120,110,70],shape:'golem',col:'#9ad8f0',learn:[],cr:3,exp:300,stage:2,frame:'glacivore',desc:'A Maker war-titan, frozen under the mountain.',legend:1};
const DEX_ORDER=['flicker','arcvix','pyrowing','forgehound','drizzlet','voltrout','rimewyrm','mirelurk','thornbit','bouldershell','lotusurge','hexbriar','pipsprock','skyrivet','thundrone','boltbun','zephbun','jabbit','scrapmite','crushbug','weldrake','sporelet','rotcap','pollenwing','pebblit','ironcrag','magmaw','gearpup','ironpaw','shockhound','dripcell','ampjelly','phantide','gloomlamp','wispire','cinderlamp','pyrakh','glacivore'];

const ITEMS={
patch:{n:'Patch Kit',d:'Restores 25 HP to one bot.',price:100,heal:25,cat:'med'},
patch2:{n:'Patch Kit+',d:'Restores 60 HP to one bot.',price:300,heal:60,cat:'med'},
debug:{n:'Debug Chip',d:'Cures any status problem.',price:150,cure:1,cat:'med'},
rebootcell:{n:'Reboot Cell',d:'Revives a downed bot to half HP.',price:800,revive:1,cat:'med'},
spike:{n:'Link Spike',d:'Reboots a weakened feral bot so it joins you.',price:200,spike:1,cat:'spike'},
spike2:{n:'Tuned Spike',d:'A better-tuned spike. Higher reboot odds.',price:600,spike:1.6,cat:'spike'},
prime1:{n:'Stone Prime',d:'Prime Shard from Warden Brakka. Part of the Heartforge core.',cat:'key'},
prime2:{n:'Volt Prime',d:'Prime Shard from Warden Ione. It pulses like a heartbeat.',cat:'key'},
};
for(const t of TYPES){if(t==='Core')continue;ITEMS['shard_'+t]={n:t+' Shard',d:'Fits a socket. Decides what a bot becomes.',cat:'shard',shard:t,price:0};}

function xpFor(l){return Math.floor(Math.pow(l,3)*0.6);}
let UIDC=1;
function makeBot(id,lv){
  const d=BOTS[id];
  const b={uid:Date.now()%100000*100+(UIDC++),id,lv,xp:xpFor(lv),st:null,moves:[],shards:[],swaps:1};
  b.shards=[d.frame==='pyrakh'||d.frame==='glacivore'?d.types[0]:BOTS[d.frame].types[0]];
  if(d.stage>=1&&d.shard)b.shards.push(d.shard);
  const learned=[];for(const [l,m] of d.learn){if(l<=lv&&!learned.includes(m))learned.push(m);}
  for(const m of learned.slice(-4))b.moves.push({id:m,pp:MOVES[m].pp});
  b.hp=stats(b).hp;return b;
}
function stats(b){const d=BOTS[b.id];const L=b.lv;const s=d.base;
  return{hp:Math.floor(s[0]*2*L/100)+L+10,atk:Math.floor(s[1]*2*L/100)+5,def:Math.floor(s[2]*2*L/100)+5,spd:Math.floor(s[3]*2*L/100)+5};}
