// ===================== MAPS & STORY =====================
const SOLID=new Set(['T','~','f','R','Y','Q','W','s','#','%','X','c','M','t','h','v','l','m','z','i','n','p','a','o','U','L','G','C','B','N','J','Z','0','7','9','*','@','&','5']);
const MAPS={};
const N=()=>G.name;

// ---------- Ashgrove (crater village) ----------
function WP(id,k,to,tx,ty,dir,extra){const p=C1(id,k);return Object.assign({x:p[0],y:p[1],to,tx,ty},dir?{dir}:{},extra||{});}
function below(id,k){const p=C1(id,k);return [p[0],p[1]+1];}
MAPS.ashgrove={name:'Ashgrove',theme:'out',music:'town',outdoor:1,weather:'snow',world:{x:0,y:64},town:1,heal:{map:'workshop',x:2,y:7},grid:C1G.ashgrove.grid,
warps:[WP('ashgrove','workshopDoor','workshop',6,8),WP('ashgrove','labDoor','lab',5,8),WP('ashgrove','houseA','house_a',4,5),WP('ashgrove','houseB','house_a2',5,4),
 WP('ashgrove','exitN0','route1',12,38),WP('ashgrove','exitN1','route1',13,38)],
signs:{'12,13':'ASHGROVE CRATER — "We live where the sky fell once. It can fall again."','14,10':'THE DEAD RELAY. A Maker tower, silent for 300 years. Kids dare each other to touch it.'},
npcs:[
 {id:'aide',x:16,y:11,dir:'left',look:'clerk',script:async()=>{if(!flag('starter')){await say('My bot just... stopped. Mid-sentence. Like someone pulled a plug in its chest.',{speaker:'Field Tech Pim'});return;}
   await say(flag('ch1done')?'Vesna says the tower hummed for a second when you came back. Just a second.':'Dr. Vesna hasn\'t left the field station since the capsule fell. She talks to it. The capsule, I mean.',{speaker:'Field Tech Pim'});}},
 {id:'kid1',x:13,y:17,dir:'right',look:'kid',wander:1,script:kidQuest},
 {id:'old1',x:9,y:10,dir:'right',look:'old',script:async()=>{if(!flag('starter')){await say('Hush. Listen. No hum. First time in my life I\'ve heard this crater truly quiet.',{speaker:'Grandmother Ilsa'});return;}
   await say(pick(['My mother said the crater was made by a Maker ship. Tonight I believe her.','You\'ve got salvager hands. Your father had them too. Don\'t let the Choir buy them.','Warm your bot\'s core before a long walk. Cold shards crack.']),{speaker:'Grandmother Ilsa'});}},
 {id:'skater',x:16,y:18,dir:'left',look:'woman',wander:1,cond:()=>flag('starter'),text:'Pond\'s frozen solid. Once you start sliding you don\'t stop till you hit something. Great training for the Mirrorlake.'},
],
objs:[{type:'capsule',id:'capsule',x:C1('ashgrove','capsule')[0],y:C1('ashgrove','capsule')[1],run:capsuleScene}],
triggers:[{x:14,y:3,run:blockNorth},{x:15,y:3,run:blockNorth}]};
async function guardBlock(){if(flag('badge1'))return;G.busy=true;await say('Road\'s shut. The Drifts are full of ferals and Choir scavengers. Brakka signs off on travellers, so bring me her Stone Prime.',{speaker:'Gate Warden Odo'});await stepPlayer('left');G.busy=false;}
async function kidQuest(){const s=qstate('lostbit');const sp={speaker:'Tobin'};
 if(!flag('starter')){await say('Bit? BIT! ...He was right here when the lights went out.',sp);return;}
 if(!s){await say('My Pipsprock, Bit, bolted when the capsule came down. I saw it zip up the stairs toward the Wreckfield!',sp);await say('It hides in crystal beds when it\'s scared. They glow like it does. Can you look?',sp);setQ('lostbit','active');Snd.sfx('ok');await say('New quest: LOST BIT. (Check QUESTS in the menu.)');}
 else if(s==='active')await say('Bit loves the crystal beds on the west side of the Wreckfield. Please hurry, it hates the cold.',sp);
 else if(s==='found'){setQ('lostbit','done');Snd.jingle('victory',curMap().music);await say('BIT! You\'re frozen solid, you idiot. I missed you.',sp);addItem('spike2',2);addItem('coolfin',1);await say(N()+' received 2 Tuned Spikes and a Coolant Fin module!');}
 else await say('Bit has a bell now. If he runs off again I\'ll hear him.',sp);}
async function blockNorth(){if(flag('starter'))return;G.busy=true;
 await say(flag('brownout')?'Your Navi-band buzzes: CAPSULE SIGNAL — 4 METRES EAST. Whatever fell, it\'s still in the crater.':'The stairs are iced over in the dark.');await stepPlayer('down');G.busy=false;}

MAPS.house_a=room('Ashgrove',['XXXXXXXXX','X&&x*x99X','XxxxxxxxX','XtxxxxxhX','XxxxxxxxX','XvxxxxxxX','XXXXeXXXX'],{map:'ashgrove',x:below('ashgrove','houseA')[0],y:below('ashgrove','houseA')[1]},
 [{id:'ha1',x:2,y:2,dir:'down',look:'old',text:'Forty years I dug Maker scrap out of this crater. Never once found a working core. And it just falls out of the sky for you.'},
  {id:'ha2',x:6,y:4,dir:'left',look:'woman',text:'Shards are hearts. Fit a different one, get a different bot. Check a bot\'s Summary to see its core trait, every frame has one.'}]);
MAPS.house_a2=room('Ashgrove',['XXXXXXXXXXX','X9x@xxxMx9X','XxxxxxxxxxX','XxxxxtxxxxX','XhxxxxxxxvX','XXXXXeXXXXX'],{map:'ashgrove',x:below('ashgrove','houseB')[0],y:below('ashgrove','houseB')[1]},
 [{id:'ast',x:3,y:2,dir:'up',look:'tinker',text:'I\'ve watched that streak for three nights. It wasn\'t falling. It was steering. Toward us.'},
  {id:'ast2',x:7,y:3,dir:'left',look:'kid',text:'Dad lets me use the telescope. Mt. Cinder\'s glow is dimmer every week. I drew it in my notebook.'}],
 [{type:'item',id:'astItem',x:8,y:3,item:'debug'}]);

// ---------- Orla Field Station ----------
MAPS.lab={name:'Orla Field Station',theme:'lab',music:'town',grid:[
'XXXXXXXXXXX','XMMx9x9xMMX','XxxxxxxxxxX','XxxxxxxxxxX','Xxx7xxx7xxX','XxxxxxxxxxX','XMxxxxxxxMX','X&xxxxxxx&X','XxxxxxxxxxX','XXXXXeXXXXX'],
warps:[{x:5,y:9,to:'ashgrove',tx:below('ashgrove','labDoor')[0],ty:below('ashgrove','labDoor')[1],dir:'down'}],
objs:[],
npcs:[{id:'vesna',x:5,y:2,dir:'down',look:'vesna',cond:()=>flag('starter'),script:vesnaTalk},
 {id:'aide2',x:8,y:8,dir:'left',look:'clerk',text:'Heartforge output: 61%. Last month it was 70. Vesna says not to say it out loud. ...Oops.'},
 {id:'aide3',x:2,y:5,dir:'right',look:'mech',text:'We hauled the capsule\'s cradle in here. The cores were packed in frost-gel. Maker shipping, three hundred years late.'}]};
async function eastBlock(){if(flag('ch2start'))return;G.busy=true;await say('Railbed Road is iced over and crawling with Choir. Nobody goes east until Dr. Vesna gives the word.',{speaker:'Lineman'});await stepPlayer('left');G.busy=false;}
async function vesnaCh2(){
 await say(N()+'. Two Primes. You came back with both.',{speaker:'Vesna'});
 await say('I haven\'t told you everything. The readings under Mt. Cinder are a war-titan. Glacivore. The Makers froze it inside the Heartforge.',{speaker:'Vesna'});
 await say('The Choir says the Heartforge controls the bots. I don\'t know if that\'s true. The answer is in the Makers\' archives, inside the Rustworks factory east of Voltmere.',{speaker:'Vesna'});
 await say('Find that archive. Then decide for yourself. Two more Wardens are out that way: Hask in Ferrow, Sora in Kilnhaven.',{speaker:'Vesna'});
 setFlag('ch2start');setQ('archive','active');Snd.sfx('ok');await say('CHAPTER 2: THE RUSTWORKS. Railbed Road, east of Voltmere, is open. New quest: THE MAKER ARCHIVE.');}
async function vesnaTalk(){
 if(flag('ch1done')&&!flag('ch2start')){await vesnaCh2();return;}
 const tips=['At level 16 a bot\'s second socket wakes. The shard you fit decides what it becomes. I still can\'t predict it. That\'s the fun part.','Weaken a feral, then a Link Spike. A rattled bot links easier: status problems help.','The Wardens each hold a Prime Shard. Earn them. Don\'t steal them, whatever the Choir says.','Your Navi-band map can route you back to any town you\'ve visited.','Your frame woke for you and nobody else. I\'ve tried. It just stares at me.'];
 await say(pick(tips),{speaker:'Vesna'});
 if(G.party.some(b=>b.hp<stats(b).hp)){await healAll();await say('I topped up your bots off the station\'s spare cell.',{speaker:'Vesna'});}}

// ---------- The Brownout (opening) ----------
function spawnNear(base,d){for(const dir of ['left','up','right','down']){const [dx,dy]=DIRS[dir];let ok=true;for(let i=1;i<=d;i++)if(isBlocked(G.px+dx*i,G.py+dy*i)||npcAt(G.px+dx*i,G.py+dy*i))ok=false;if(ok)return Object.assign(base,{x:G.px+dx*d,y:G.py+dy*d,dir:OPP[dir]});}return Object.assign(base,{x:G.px,y:G.py+1,dir:'up'});}
function room(name,grid,ret,npcs,objs,theme){const y=grid.length-1,x=grid[y].indexOf('e');return{name,theme:theme||'house',music:'town',grid,warps:[{x,y,to:ret.map,tx:ret.x,ty:ret.y,dir:'down'}],npcs:npcs||[],objs:objs||[]};}
const CORES=[{t:'Ember',bot:'flicker',col:'#ff7a3a',d:'Ember Core. Hot to hold. It wants to move.'},{t:'Tide',bot:'drizzlet',col:'#3aa8ff',d:'Tide Core. Cool, heavy, patient. It sloshes like it\'s alive.'},{t:'Root',bot:'thornbit',col:'#5ad06a',d:'Root Core. It grips your glove with tiny filaments.'}];
async function openingScene(){
 G.busy=true;await wait(40);
 await say('Workshop. 11:52 PM. The radio murmurs the nightly Heartforge report: "...output down another four percent..."',{speaker:''});
 Snd.sfx('glitch');for(let i=0;i<4;i++){G.flick=6;await wait(8+rnd(10));}
 setFlag('brownout');collectLights();Snd.music(null);
 await say('The lights die. All of them. Outside, every bot in Ashgrove goes quiet at the same instant.');
 await wait(30);Snd.sfx('thunder');G.shake=50;await wait(20);
 await say('Then a roar tears across the sky. Something burning blue skims the roof and slams into the crater.');
 Snd.sfx('glitch');
 await say('"...any receiver near Ashgrove... this is Dr. Vesna Orla... Maker capsule down in your crater... do NOT let anyone open—"',{speaker:'Radio'});
 await say('The signal dies. Your Navi-band still has charge. Its map flickers on.');
 await say('Controls: Arrow keys / D-pad to move, Z or A to interact, X or B to cancel (hold to run), Enter or START for the menu, M for the map. OPTIONS has always-run, battle speed and phone button settings.');
 G.busy=false;}
async function capsuleScene(o){
 if(flag('starter')){await say(flag('capsuleTaken')?'A scorched crater in the snow. Kael\'s crew hauled the capsule hull off to Brasston.':'The capsule\'s hull, cracked open and cold. Kael\'s crew will be by for it.');return;}
 G.busy=true;
 await say('A Maker capsule, half-buried in steaming snow. Frost hisses off its hull. Something inside is ticking.');
 Snd.sfx('door');o.open=1;
 await say('The hatch slides open. Inside: an empty frame, curled up like a sleeping thing, and three loose cores rattling in their cradles.');
 let pick_=null;
 while(!pick_){const i=await ask('Which core do you fit into the frame?',CORES.map(c=>c.t+' Core').concat(['Step back']));if(i<0||i>2){G.busy=false;return;}
  const c=CORES[i];const d=BOTS[c.bot];
  const ov={update(){},draw(){panel(150,30,180,170);const pulse=0.5+0.5*Math.sin(TICK/8);ctx.fillStyle=c.col;ctx.globalAlpha=0.25+0.25*pulse;ctx.beginPath();ctx.arc(240,108,60,0,7);ctx.fill();ctx.globalAlpha=1;
    ctx.drawImage(botSprite(c.bot,{sil:1}),180,48,120,120);txt('???',240,186,'#606870',20,'center');}};UI.push(ov);
  await say(c.d);const r=await ask('Fit the '+c.t+' Core?',['Fit it','Look at another']);UI.splice(UI.indexOf(ov),1);if(r===0)pick_=c;}
 const c=pick_,d=BOTS[c.bot];
 await say('You press the '+c.t+' Core into the frame\'s chest socket. It bites down with a click.');
 Snd.sfx('glitch');G.shake=20;for(let i=0;i<3;i++){G.flick=5;await wait(6);}
 setFlag('starter');G.starter=c.bot;const b=makeBot(c.bot,5);G.party.push(b);seen(b.id,1);resetFollower();
 await say('The frame unfolds. Plates slide and lock around the core. A visor blinks on, and turns, and finds you.');
 Snd.jingle('level');Snd.chirp(d.frame);await say('It became '+d.name.toUpperCase()+'! '+d.desc.split('.')[0]+'.');
 await say('Something skitters in the dark. Ferals, drawn to the capsule\'s heat!');
 const w=makeBot('scrapmite',3);await runBattle({wild:w,noBlackout:1,tutorial:1});
 await healAll();
 const counter={flicker:'drizzlet',drizzlet:'thornbit',thornbit:'flicker'}[c.bot];G.rival=counter;
 const kael=spawnNear({id:'kael0',look:'kael'},2);G.npcs.push(kael);G.pdir=OPP[kael.dir];
 await say('HEY. Back off. I\'ve been tracking that thing since it came over the ridge.',{speaker:'???'});
 await say('Name\'s Kael. Salvager, Brasston crew. And by salvage law, a downed capsule belongs to whoever reaches it first.',{speaker:'Kael'});
 await say('Kael pulls the '+CORES.find(x=>x.bot===counter).t+' Core out of the capsule and jams it into a battered frame strapped to his back. It shudders awake.');
 await say('Salvage law also says two claims get settled one way. Right here. Right now.',{speaker:'Kael'});
 const res=await runBattle({trainer:{name:'Kael',title:'Salvager',look:'kael',team:[[counter,5]],money:120,noBlackout:1}});
 if(res==='win')await say('...Fine. It\'s yours. First-night luck. It runs out.',{speaker:'Kael'});else await say('Ha! Mine, then— ...wait. It\'s just a shell now. Keep your bot. I got a core out of it.',{speaker:'Kael'});
 {const ch=await ask('How do you answer Kael?',['Good fight. Share the hull?','Next time, stay out of my crater.']);G.kael=(G.kael||0)+(ch===0?1:-1);
  await say(ch===0?'...Share. Huh. Nobody in Brasston shares. ...Deal.':'Your crater. Sure. Enjoy the hole in the ground.',{speaker:'Kael'});}
 setFlag('kael1');await healAll();
 const v=spawnNear({id:'vesna0',look:'vesna'},3);G.npcs.push(v);Snd.sfx('door');await walkNPC(v,v.dir,1);G.pdir=OPP[v.dir];
 await say('Both of you, step away from the— oh. Oh no. You already woke them.',{speaker:'???'});
 await say('I\'m Dr. Vesna Orla. Maker researcher. I run the field station by the dead relay. That capsule is the first new Maker object anyone has found in three hundred years.',{speaker:'Vesna'});
 await say('And it chose. Cores don\'t take to strangers. That frame woke for you, '+N()+'.',{speaker:'Vesna'});
 await say('Tonight wasn\'t a power cut. It was the Heartforge skipping a beat. If it stops, every bot in Calderra stops with it.',{speaker:'Vesna'});
 await say('The Wardens hold Prime Shards, the keys to the Heartforge. Earn them, bring them to me, and maybe I can keep it beating.',{speaker:'Vesna'});
 await say('Brasston\'s Warden is first. And she won\'t wait for slowpokes.',{speaker:'Kael'});await walkNPC(kael,OPP[kael.dir],3);G.npcs.splice(G.npcs.indexOf(kael),1);
 await say('He never waits for anything. Here, you\'ll need these out there.',{speaker:'Vesna'});
 addItem('spike',5);addItem('patch',3);Snd.sfx('item');await say(N()+' received 5 Link Spikes and 3 Patch Kits!');
 await say('Ferals are running wild without enough Heartforge power. Weaken one, then a Link Spike reboots it, and it\'ll join you.',{speaker:'Vesna'});
 await say('At level 16 a bot\'s second socket opens. The shard you fit decides what it evolves into. Choose like it matters. It does.',{speaker:'Vesna'});
 await say('Your workshop cradle will charge your bots. Come to the station any time. North, through the Wreckfield, is Brasston.',{speaker:'Vesna'});
 await walkNPC(v,OPP[v.dir],4);G.npcs.splice(G.npcs.indexOf(v),1);
 Snd.sfx('switch');G.flick=10;collectLights();Snd.music(curMap().music);
 await say('With a shudder, the lights of Ashgrove blink back on. Bots twitch, and wake, and go about their business. For now.');
 G.busy=false;}

// ---------- The Wreckfield (Route 1) ----------
MAPS.route1={name:'The Wreckfield',theme:'out',music:'route',outdoor:1,weather:'snow',world:{x:2,y:24},
enc:{tiles:'jqyw',count:9,list:[['scrapmite',2,4,40],['gearpup',3,4,30]],by:{j:[['scrapmite',2,4,45],['gearpup',3,4,35],['pipsprock',2,3,20]],q:[['sporelet',3,5,40],['pipsprock',2,4,40],['dripcell',3,4,20]],y:[['boltbun',2,4,60],['pipsprock',2,4,40]],w:[['sporelet',3,5,45],['boltbun',3,4,35],['gloomlamp',4,5,20]]}},
thawEnc:[['dripcell',4,6,22],['gloomlamp',4,6,10]],alpha:{id:'gearpup',lv:9,at:C1('route1','alpha')},
iceLoot:{[C1('route1','iceLoot').join(',')]:'rshard_Flame'},breakTo:{[C1('route1','grotto').join(',')]:'K'},grid:C1G.route1.grid,
warps:[WP('route1','grotto','grotto1',6,7),WP('route1','exitS0','ashgrove',14,1),WP('route1','exitS1','ashgrove',15,1),
 WP('route1','exitN0','brasston',14,22),WP('route1','exitN1','brasston',15,22)],
signs:{[C1('route1','sign').join(',')]:'THE WRECKFIELD — Maker wreckage, 300 years deep. Ferals nest in scrap, crystal and fog. North: Brasston.'},
objs:[{type:'pylon',id:'p1',x:C1('route1','pylon')[0],y:C1('route1','pylon')[1],thaws:['route1'],run:pylonRun},
 {type:'item',id:'r1islet',x:C1('route1','islet')[0],y:C1('route1','islet')[1],item:'core_amp'},
 {type:'item',id:'r1slide',x:C1('route1','slideItem')[0],y:C1('route1','slideItem')[1],item:'shard_Frost'},
 {type:'lostbot',x:C1('route1','lostbot')[0],y:C1('route1','lostbot')[1],cond:()=>qstate('lostbit')==='active',run:async()=>{setQ('lostbit','found');Snd.chirp('pipsprock');await say('A tiny Pipsprock is curled up between two glowing crystals. Its tag says BIT. It hops onto your shoulder, shivering.');await say('Quest updated: bring Bit back to Tobin in Ashgrove.');}},
 {type:'item',id:'r1gale',x:C1('route1','gale')[0],y:C1('route1','gale')[1],item:'shard_Gale'},{type:'item',id:'r1patch',x:C1('route1','patch')[0],y:C1('route1','patch')[1],item:'patch'},{type:'item',id:'r1spike',x:C1('route1','spike')[0],y:C1('route1','spike')[1],item:'spike',qty:2}],
npcs:[
 {id:'lou',x:C1('route1','lou')[0],y:C1('route1','lou')[1],dir:'left',look:'tinker',range:4,trainer:{name:'Lou',title:'Scrapper',team:[['scrapmite',4],['pipsprock',4]],money:80,pre:'This wreck is MY dig site. Your bot\'s still got capsule frost on it. Let\'s see if it runs!',post:'Okay, okay. Dig wherever you like.'}},
 {id:'mara',x:C1('route1','mara')[0],y:C1('route1','mara')[1],dir:'down',look:'scout',range:4,trainer:{name:'Mara',title:'Fog Scout',team:[['boltbun',5],['sporelet',5]],money:100,pre:'I map the fog banks. Nobody gets past me without a test run!',post:'You read the field well. Fog Scouts would take you.'}},
 {id:'r1man',x:C1('route1','hiker')[0],y:C1('route1','hiker')[1],dir:'down',look:'hiker',text:'Scrap drifts hide gear-ferals, crystal beds hide the shy ones, fog hides... whatever it likes. Each patch has its own crowd.'},
 {id:'r1wreck',x:13,y:11,dir:'down',look:'engineer',text:'This hull\'s the ship that made the crater, they say. Funny. Tonight another one came down right where it landed.'},
]};

// ---------- Brasston (terraced mining town) ----------
MAPS.brasston={name:'Brasston',theme:'out',music:'town',outdoor:1,weather:'night',iceLoot:{[C1('brasston','iceLoot').join(',')]:'frag_Frost'},world:{x:0,y:0},town:1,heal:{map:'repair_b',x:6,y:4},grid:C1G.brasston.grid,
warps:[WP('brasston','gym','gym1',6,13),WP('brasston','repair','repair_b',6,4),WP('brasston','houseB1','house_b1',4,4),WP('brasston','houseB2','house_b2',5,4),
 WP('brasston','exitS0','route1',12,1),WP('brasston','exitS1','route1',13,1),WP('brasston','exitE0','route2',1,8),WP('brasston','exitE1','route2',1,9)],
triggers:[{x:C1('brasston','guardTrig0')[0],y:C1('brasston','guardTrig0')[1],run:guardBlock},{x:C1('brasston','guardTrig1')[0],y:C1('brasston','guardTrig1')[1],run:guardBlock}],
signs:{[C1('brasston','gymSign').join(',')]:'BRASSTON WARDEN HALL — Warden Brakka. "Solid as bedrock."'},
tileScripts:{[C1('brasston','mine').join(',')]:async()=>{await say('The old Brasston mine. Sealed with a Warden\'s mark since the Heartforge started dimming. Something down there hums.');}},
npcs:[
 {id:'bguard',x:C1('brasston','guard')[0],y:C1('brasston','guard')[1],dir:'up',look:'guard',text:'I\'m Odo, gatekeeper. The Drifts east of here eat travellers. Brakka\'s Stone Prime is your pass.'},
 {id:'grunt0',x:C1('brasston','grunt0')[0],y:C1('brasston','grunt0')[1],dir:'left',look:'grunt',range:4,cond:()=>!flag('t_grunt0'),trainer:{name:'Choir Grunt',title:'Hollow',team:[['gloomlamp',7],['scrapmite',6]],money:150,pre:'Did you feel it last night? The Heartforge flinched. The Hollow Choir is going to finish the job. Move!',post:'Silence is coming. The Cantor promised. You can\'t stop a song...'},after:async n=>{n.hidden=true;await say('The Choir grunt fled toward the east gate...');}},
 {id:'eng',x:C1('brasston','eng')[0],y:C1('brasston','eng')[1],dir:'left',look:'engineer',script:engQuest},
 {id:'bkid',x:C1('brasston','bkid')[0],y:C1('brasston','bkid')[1],dir:'down',look:'kid',wander:1,text:'Brakka makes challengers shove crates in her hall. She says if you can\'t move a rock you can\'t lead a bot.'},
 {id:'bwoman',x:C1('brasston','bwoman')[0],y:C1('brasston','bwoman')[1],dir:'down',look:'woman',script:async()=>{await say(flag('badge1')?'The whole terrace heard about your win. Kael stomped around the market for an hour.':'Kael rolled in at dawn with a brand-new bot and went straight up to the hall. Beat Brakka\'s first two bots before she flattened him.',{speaker:'Market Seller'});}},
 {id:'bminer',x:20,y:4,dir:'left',look:'quarry',text:'Three terraces, one hall, zero warm days since spring. Stairs are the only thing in Brasston that still works right.'},
]};
async function engQuest(){const s=qstate('stolen');const sp={speaker:'Engineer'};
 if(!flag('t_grunt0')){await say('Those masked creeps call themselves the Hollow Choir. They\'ve been stealing shards all over Brasston!',sp);return;}
 if(!s){await say('You chased off that Choir creep! I heard him muttering... they stashed our shards out on the Mirrorlake, on the little island in the middle.',sp);await say('The guard won\'t let anyone through without Brakka\'s Prime. Get it back for us?',sp);setQ('stolen','active');Snd.sfx('ok');await say('New quest: STOLEN SHARDS.');}
 else if(s==='active')await say('The stash should be on the Mirrorlake island, out on the Drifts east of town.',sp);
 else if(s==='found'){setQ('stolen','done');delete G.bag.stolen;Snd.jingle('victory',curMap().music);await say('Our shards! The whole crate! Here, take some for your trouble, and this chip I\'ve been tinkering with.',sp);
   const ts=TYPES.filter(t=>t!=='Core');const got=[];for(let i=0;i<3;i++){const t=pick(ts);addItem('shard_'+t,1);got.push(t);}addItem('overclock',1);G.money+=800;
   await say(N()+' received '+got.join(', ')+' Shards, an Overclock Chip and 800 Cr!');}
 else await say('Brasston owes you one. If the Choir comes back, we\'ll be ready.',sp);}
MAPS.grotto1={name:'Hidden Grotto',theme:'cave',music:'cave',outdoor:1,dungeon:1,enc:{tile:'^',count:4,list:[['dripcell',6,8,40],['gloomlamp',6,8,35],['sporelet',6,8,25]]},grid:[
'%%%%%%%%%%%%','%^^^^%%^^^^%','%^^^^^^^^^^%','%^^%%^^%%^^%','%^^^^^^^^^^%','%%^^^^^^^^%%','%^^^^^^^^^^%','%^^^^^^^^^^%','%%%%%%K%%%%%'],
warps:[{x:6,y:8,to:'route1',tx:2,ty:25,dir:'down'}],objs:[{type:'item',id:'g1a',x:2,y:1,item:'arm_blade'},{type:'item',id:'g1b',x:10,y:1,item:'shard_Spirit'},{type:'item',id:'g1c',x:9,y:6,item:'scrap',qty:4}],npcs:[]};
MAPS.grotto2={name:'Thawed Hollow',theme:'cave',music:'cave',outdoor:1,dungeon:1,enc:{tile:'^',count:5,list:[['gloomlamp',13,15,30],['dripcell',13,15,30],['pebblit',13,15,20],['gearpup',13,15,20]]},grid:[
'%%%%%%%%%%%%','%^^^%%%%^^^%','%^^^^^^^^^^%','%^^%^^^^%^^%','%^^^^%%^^^^%','%%^^^^^^^^%%','%^^^^^^^^^^%','%^^^^^^^^^^%','%%%%%%K%%%%%'],
warps:[{x:6,y:8,to:'route2',tx:2,ty:16,dir:'up'}],objs:[{type:'item',id:'g2a',x:1,y:1,item:'leg_thrusters'},{type:'item',id:'g2b',x:10,y:1,item:'frag_Volt'},{type:'item',id:'g2c',x:6,y:3,item:'arm_cannon'}],npcs:[]};
MAPS.house_b1=room('Brasston',['XXXXXXXXXX','X7x7x9x99X','XxxxxxxxxX','X&xxxxxxhX','XxxxxxxxxX','XXXXeXXXXX'],{map:'brasston',x:below('brasston','houseB1')[0],y:below('brasston','houseB1')[1]},
 [{id:'hb1',x:3,y:2,dir:'up',look:'tinker',text:'Socket types matter. Fit a shard that covers your bot\'s weak spots. I learned that the expensive way.'},
  {id:'hb1b',x:7,y:3,dir:'left',look:'kid',text:'Kael used to work at this bench. Mum says he\'s too proud to come back since his old bot died.'}]);
MAPS.house_b2=room('Brasston',['XXXXXXXXXXX','Xvxx*xxx&&X','XxxxxxxxxxX','XxtxxxxxxhX','XxxxxxxxxxX','XXXXXeXXXXX'],{map:'brasston',x:below('brasston','houseB2')[0],y:below('brasston','houseB2')[1]},
 [{id:'hb2',x:2,y:2,dir:'right',look:'mech',text:'Ferals drop shards sometimes when you beat them. My whole hearth\'s running on one I found.'}],[{type:'item',id:'hb2item',x:8,y:3,item:'debug'}]);
function repairMap(name,ret,shop){name=name.replace('Repair Station','Repair Caravan');return{name,theme:'repair',music:'town',heal:1,grid:['XXXXXXXXXXXXX','X9xM5x5xx7x9X','XxxxxxxxxxxxX','XxxxcccxxxxxX','XxxxxxxxxxxxX','XXXXXXeXXXXXX'],
 warps:[{x:6,y:5,to:ret.map,tx:ret.x,ty:ret.y,dir:'down'}],
 npcs:[{id:'nurse',x:5,y:2,dir:'down',look:'nurse',script:nurseTalk},{id:'clerk',x:9,y:2,dir:'down',look:'clerk',script:()=>openShop(shop)},
  {id:'rp1',x:8,y:4,dir:'left',look:pick(['kid','woman','mech']),text:pick(['The caravan rolls town to town on the old Maker roads. Storage terminal\'s at the back, the Forge Tech refines shards, and the board lists rematches.','Juno patched my bot with nothing but wire and swearing. Best mechanic on the peninsula.','Pay the trader in Cr or scrap. She\'s not picky. She is a bit scary, though.'])},
  {id:'forge',x:11,y:3,dir:'left',look:'engineer',script:openForge},{id:'board',x:1,y:3,dir:'right',look:'guard',script:openRematch}],
 terminal:{x:3,y:1}};}
async function nurseTalk(){G.busy=true;const r=await ask(pick(['Juno\'s Caravan. Bots on the cradles, I\'ll have them humming. Charge them up?','Back again? Wheel them in. Charge them up?','Mind the cables. Want your bots charged?']),['Charge them','Not now']);
 if(r===0){await say('Onto the cradles they go...',{speaker:'Juno'});Snd.jingle('heal');await wait(90);await healAll();setLastHeal();await say(pick(['Done. Good as fresh off the line.','All green. Try not to set anything on fire.','Charged. Your lead bot purred. Don\'t tell anyone.']),{speaker:'Juno'});}
 else await say('Caravan\'s here till the snow melts. So, forever.',{speaker:'Juno'});G.busy=false;}
MAPS.repair_b=repairMap('Brasston Repair Station',{map:'brasston',x:below('brasston','repair')[0],y:below('brasston','repair')[1]},['patch','debug','spike']);

// ---------- Gym 1 (crate puzzle) ----------
MAPS.gym1={name:'Brasston Warden Hall',theme:'gym1',music:'gym',grid:[
'XXXXXXXXXXXXX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XXXXXgggXXXXX',
'XxxxxxxxxxxxX',
'XxPxxXxxxPxxX',
'XxxxxXxxxxxxX',
'XxxxxxxxxxxxX',
'XxxxxxxXxxxxX',
'XXxxxxxxxxxPX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XXXXXXeXXXXXX'],
gate:'gate1',crates:[[3,8],[8,8],[5,10]],
warps:[{x:6,y:14,to:'brasston',tx:below('brasston','gym')[0],ty:below('brasston','gym')[1],dir:'down'}],
npcs:[
 {id:'gguide1',x:10,y:12,dir:'left',look:'quarry',text:'Push the three crates onto the three gold plates and the gate opens. Mess up? Walk out and back in to reset the room.'},
 {id:'jen',x:10,y:2,dir:'left',look:'quarry',range:4,trainer:{name:'Jen',title:'Quarry Worker',team:[['pebblit',8],['gearpup',8]],money:200,pre:'You solved the crates? Then you can solve me!',post:'Ugh, crushed.'}},
 {id:'brakka',x:6,y:1,dir:'down',look:'brakka',script:brakkaTalk},
]};
async function brakkaTalk(){if(flag('badge1')){await say('Your bots are solid now. Keep it up, and watch out for those Choir creeps out on the Drifts.',{speaker:'Brakka'});return;}
 G.busy=true;
 await say('So you\'re the one the capsule woke for. Kael was up here at dawn. Loud, fast, didn\'t listen to a word I said. Took him two tries.',{speaker:'Brakka'});
 await say('I\'m Brakka, Warden of Brasston. The Stone Prime has been in my family for six generations. Show me your bots are built to last!',{speaker:'Brakka'});
 const r=await runBattle({trainer:{name:'Brakka',title:'Warden',look:'brakka',warden:1,team:[['pebblit',10],['gearpup',10],['ironcrag',12]],money:1200,items:1}});
 if(r==='win'){await say('Ha! Solid! You\'ve got bedrock in you, kid.',{speaker:'Brakka'});
  setFlag('badge1');addItem('prime1',1);addItem('shard_Stone',1);Snd.jingle('victory');
  await say(N()+' received the STONE PRIME and a Stone Shard!');
  await say('That Stone Shard fits any compatible socket. Once a bot hits level 16, try it and see what happens.',{speaker:'Brakka'});
  await say('Odo at the east gate will let you onto the Drifts now. Ione\'s in Voltmere, past the Relay Tunnel. Watch yourself in there.',{speaker:'Brakka'});
  {const c=await ask('Brakka grumbles: "Those Choir freaks think they know better than six generations of Wardens." You say...',['They don\'t.','Maybe they have a point.']);G.rep=G.rep||{w:0,c:0};
   if(c===0){G.rep.w++;await say('Ha! Good kid.',{speaker:'Brakka'});}else{G.rep.c++;await say('...Hmph. Think what you like. Just don\'t let them near my Prime.',{speaker:'Brakka'});}}
  await thawRegions(['brasston','route1'],'The Stone Prime pulses in your bag. The ground beneath Brasston warms...');}
 G.busy=false;}

// ---------- Mirrorlake Drifts (Route 2) ----------
MAPS.route2={name:'Mirrorlake Drifts',theme:'out',music:'route',outdoor:1,weather:'blizzard',world:{x:28,y:2},thawEnc:[['scrapmite',10,12,15],['pipsprock',10,12,15]],alpha:{id:'ironcrag',lv:15,at:C1('route2','alpha')},
iceLoot:{[C1('route2','iceLoot').join(',')]:'rshard_Tide'},thawTo:{[C1('route2','grotto').join(',')]:'K'},
enc:{tiles:'wyq',count:9,rate:10,list:[['boltbun',7,9,20],['pebblit',7,9,20]],by:{w:[['sporelet',8,9,30],['dripcell',7,9,30],['gloomlamp',8,10,20],['pebblit',7,9,20]],y:[['boltbun',7,9,40],['gearpup',8,10,35],['gloomlamp',8,10,25]],q:[['pebblit',7,9,40],['dripcell',7,9,30],['sporelet',8,9,30]]}},grid:C1G.route2.grid,
warps:[WP('route2','grotto','grotto2',6,7),WP('route2','exitW0','brasston',26,10),WP('route2','exitW1','brasston',26,11),WP('route2','exitE','cave',1,7)],
signs:{},
objs:[{type:'pylon',id:'p2',x:C1('route2','pylon')[0],y:C1('route2','pylon')[1],thaws:['route2'],run:pylonRun},
 {type:'stash',x:C1('route2','stash')[0],y:C1('route2','stash')[1],cond:()=>qstate('stolen')==='active',run:async()=>{addItem('stolen',1);setQ('stolen','found');Snd.sfx('item');await say('A crate stamped with the Choir\'s mask, frozen onto the lake\'s only island. Inside: dozens of Brasston\'s shards. You take the whole crate.');await say('Quest updated: return the Stolen Shards to the engineer in Brasston.');}},
 {type:'cache',id:'cache2',x:C1('route2','cache')[0],y:C1('route2','cache')[1],item:'shard_Volt'},{type:'item',id:'r2p',x:C1('route2','r2p')[0],y:C1('route2','r2p')[1],item:'patch2'},{type:'item',id:'r2s',x:C1('route2','r2s')[0],y:C1('route2','r2s')[1],item:'spike',qty:3},
 {type:'item',id:'r2lake',x:C1('route2','lakeItem')[0],y:C1('route2','lakeItem')[1],item:'rebootcell'}],
terminalPuzzle:{x:C1('route2','terminal')[0],y:C1('route2','terminal')[1],flag:'cache2open'},
npcs:[
 {id:'dov',x:C1('route2','dov')[0],y:C1('route2','dov')[1],dir:'down',look:'mech',range:4,trainer:{name:'Dov',title:'Ice Mechanic',team:[['gearpup',10],['scrapmite',10],['boltbun',11]],money:330,pre:'Blizzard eats bearings for breakfast. Let\'s see how yours hold up!',post:'Your bots run smoother than anything in my shop.'}},
 {id:'sela',x:C1('route2','sela')[0],y:C1('route2','sela')[1],dir:'left',look:'hiker',range:4,trainer:{name:'Sela',title:'Bone Walker',team:[['pebblit',11],['pebblit',11],['dripcell',12]],money:360,pre:'I cross the titan\'s spine every morning. You don\'t scare me!',post:'Fine. The bones are yours to cross.'}},
 {id:'r2girl',x:C1('route2','r2girl')[0],y:C1('route2','r2girl')[1],dir:'down',look:'woman',text:'That bridge is a spine. A real one. Some Maker war-machine died across the chasm and froze there. Don\'t look down.'},
 {id:'r2skate',x:5,y:6,dir:'right',look:'kid',text:'The Mirrorlake\'s slick! Once you slide you can\'t stop till you hit a rock. The Choir hid something on the island in the middle.'},
],
triggers:C1('route2','kaelT').map(([x,y])=>({x,y,run:kael2}))};
async function kael2(){if(flag('kael2'))return;setFlag('kael2');G.busy=true;
 let off=1;for(const d of [3,2]){let ok=true;for(let i=1;i<=d;i++)if(isBlocked(G.px+i,G.py))ok=false;if(ok){off=d;break;}}const k={id:'kael_r2',x:G.px+off,y:G.py,dir:'left',look:'kael'};G.npcs.push(k);G.pdir='right';
 Snd.music('battle');await walkNPC(k,'left',off-1);
 await say('Crater kid! I\'ve had the Stone Prime since breakfast. Brakka only beat me the first time. What took you?',{speaker:'Kael'});
 await say('Vesna keeps radioing me to be careful. Like I need a babysitter. Like I need anyone.',{speaker:'Kael'});
 await say('Let\'s see if you\'ve gotten any stronger.',{speaker:'Kael'});
 const extra={flicker:'pipsprock',drizzlet:'boltbun',thornbit:'gearpup'}[G.rival];
 const r=await runBattle({trainer:{name:'Kael',title:'Rival',look:'kael',link:1,team:[[G.rival,13],['pipsprock',11],[extra==='pipsprock'?'boltbun':extra,11]],money:520}});
 if(r==='win'){await say('...Whatever. I wasn\'t even trying.',{speaker:'Kael'});
  await say('Hey. Have you ever wondered why Vesna doesn\'t let anyone see the full Heartforge data?',{speaker:'Kael'});
  const c=await ask('What do you tell Kael?',['I trust Vesna.','Maybe you\'re right...']);G.rep=G.rep||{w:0,c:0};
  if(c===1){G.kael=(G.kael||0)+1;G.rep.c++;await say('...Yeah? Huh. Thanks for not brushing me off. See you in Voltmere.',{speaker:'Kael'});}
  else{G.kael=(G.kael||0)-1;G.rep.w++;await say('Of course you do. Forget it. See you in Voltmere.',{speaker:'Kael'});}
  await walkNPC(k,'right',3);}
 G.npcs.splice(G.npcs.indexOf(k),1);Snd.music(curMap().music);G.busy=false;}

// ---------- Relay Tunnel (switch puzzle) ----------
MAPS.cave={name:'Relay Tunnel',theme:'cave',music:'cave',outdoor:1,dungeon:1,world:{x:62,y:6},alpha:{id:'gloomlamp',lv:15,at:[11,11]},enc:{tile:'^',count:6,rate:5,list:[['scrapmite',9,11,30],['pebblit',9,11,25],['gloomlamp',10,12,25],['gearpup',10,11,20]]},grid:[
'%%%%%%%%%%%%%%%%%%%%%%%%',
'%%^^^^%^^^z^^^%%%%^^^^%%',
'%^^^^^^%%%^^^^^%%^^^^^^%',
'%^^S^^^%%%^^^^^%%^^^^^^%',
'%^^^^^^%%%%%u%%%%^^%%^^%',
'%%^^^^%%%%^^^^^%%^^%%^^%',
'%%%^^%%%%^^^^^^^u^^^^^^%',
'^^^^^^^r^^^^S^^^u^^^^^^r',
'%%%^^%%%%^^^^^^^u^^^^^^%',
'%%^^^^%%%%^^^^^%%^^%%^^%',
'%^^^^^^%%%%%r%%%%^^%%^^%',
'%^^^^^^%%%^^^^^%%^^^S^^%',
'%%^^^^%%%%^^^^^%%^^^^^^%',
'%%%%%%%%%%^^^^^%%%%%%%%%',
'%%%%%%%%%%%%%%%%%%%%%%%%'],
warps:[{x:0,y:7,to:'route2',tx:32,ty:11,dir:'left'},{x:23,y:7,to:'voltmere',tx:2,ty:8,dir:'right'}],
signs:{},
objs:[{type:'item',id:'cvIron',x:12,y:2,item:'shard_Iron'},{type:'item',id:'cvPocket',x:8,y:1,item:'leg_treads'},{type:'item',id:'cvP',x:12,y:12,item:'patch2'},{type:'item',id:'cvS',x:2,y:11,item:'spike2'}],
npcs:[
 {id:'cg1',x:4,y:10,dir:'up',look:'grunt',range:4,trainer:{name:'Choir Grunt',title:'Hollow',team:[['gloomlamp',11],['scrapmite',11]],money:330,pre:'This relay feeds Voltmere. Once we drain it, Ione\'s precious city goes dark!',post:'Ngh... The Deacon will deal with you.'}},
 {id:'cg2',x:14,y:9,dir:'up',look:'grunt',range:3,trainer:{name:'Choir Grunt',title:'Hollow',team:[['sporelet',12],['gearpup',12]],money:360,pre:'Red, blue, red, blue... These barriers drive me nuts. You\'ll make a nice distraction!',post:'Just step on the switches. It flips the colors. ...Wait, why did I tell you that?'}},
 {id:'deacon',x:21,y:7,dir:'left',look:'deacon',range:3,cond:()=>!flag('deacon'),script:deaconFight},
 {id:'cvsign',x:3,y:8,dir:'up',look:'engineer',cond:()=>!flag('deacon'),text:'The Choir messed with the relay barriers. Floor switches flip red and blue walls. Watch which ones are up!'},
]};
async function deaconFight(n){G.busy=true;
 await say('A child, this deep in the relay? The Cantor did say a little spark would come asking questions.',{speaker:'Deacon Mirelle'});
 await say('I am Mirelle, Deacon of the Hollow Choir. The Heartforge doesn\'t give bots life. It leashes them. When it falls silent, they will be free.',{speaker:'Deacon Mirelle'});
 await say('And this relay will be the first verse of that silence.',{speaker:'Deacon Mirelle'});
 const r=await runBattle({trainer:{name:'Mirelle',title:'Deacon',look:'deacon',warden:1,link:1,team:[['rotcap',14],['gloomlamp',13],['dripcell',13]],money:900}});
 if(r==='win'){await say('...Unexpected. Keep your little shards, then. The song has many verses.',{speaker:'Deacon Mirelle'});
  {const c=await ask('Before she goes...',['Why silence the Heartforge?','Leave Calderra alone.']);G.rep=G.rep||{w:0,c:0};
   if(c===0){G.rep.c++;await say('Because every bot in Calderra is wired to obey whoever holds the Heartforge. Ask your precious Vesna who that is.',{speaker:'Deacon Mirelle'});}
   else{G.rep.w++;await say('Brave words. We\'ll see if you still believe them at the summit.',{speaker:'Deacon Mirelle'});}}
  setFlag('deacon');n.hidden=true;Snd.sfx('switch');await say('The Deacon vanished into the dark. Deep in the walls, the relay hums back to life.');
  await say('Ahead, Voltmere\'s lights flicker on again.');}
 G.busy=false;}

// ---------- Voltmere (stilt city) ----------
MAPS.voltmere={name:'Voltmere',theme:'out',music:'town',outdoor:1,weather:'static',triggers:[{x:22,y:12,run:eastBlock},{x:22,y:13,run:eastBlock}],world:{x:86,y:5},town:1,heal:{map:'repair_v',x:6,y:4},grid:C1G.voltmere.grid,
tileScripts:Object.fromEntries(C1('voltmere','gen').map(p=>[p.join(','),generatorTile])),
warps:[{x:23,y:12,to:'route3',tx:1,ty:6},{x:23,y:13,to:'route3',tx:1,ty:7},WP('voltmere','caveMouth','cave',22,7,'left'),WP('voltmere','gym','gym2',6,11),WP('voltmere','repair','repair_v',6,4),WP('voltmere','houseV1','house_v1',4,4),WP('voltmere','houseV2','house_v2',5,4)],
signs:{[C1('voltmere','sign').join(',')]:'VOLTMERE — The city on stilts. Mind the gaps. Warden Ione\'s hall is north. "Stay connected."'},
npcs:[
 {id:'vm1',x:C1('voltmere','vm1')[0],y:C1('voltmere','vm1')[1],dir:'left',look:'lineman',script:genQuest},
 {id:'vm2',x:C1('voltmere','vm2')[0],y:C1('voltmere','vm2')[1],dir:'down',look:'kid',wander:1,text:'Ione\'s hall is wired like a puzzle box. You twist the conduits until the current reaches the gate!'},
 {id:'vm3',x:C1('voltmere','vm3')[0],y:C1('voltmere','vm3')[1],dir:'down',look:'old',text:'We built on stilts because the lake used to boil in summer. Now it barely sloshes. Imagine that.'},
 {id:'vm4',x:14,y:12,dir:'up',look:'woman',text:'Fell through a gap in the boardwalk once. The lake\'s cold enough to stop your heart. And your bot\'s.'},
]};
async function genQuest(){const s=qstate('generator');const sp={speaker:'Lineman'};
 if(!s){await say('The power came back all at once! Was that you? Then maybe you can help with one more thing.',sp);await say('The old generator east of here is still dead. It needs a manual restart sequence, and my hands are too frozen to punch it in.',sp);setQ('generator','active');Snd.sfx('ok');await say('New quest: DEAD GENERATOR.');}
 else if(s==='active')await say('The generator\'s the big machine on the east side, by the fence.',sp);
 else if(s==='found'){setQ('generator','done');Snd.jingle('victory',curMap().music);await say('Listen to it hum! You\'re a natural. Take these, I salvaged them from the old control room.',sp);addItem('nanites',1);addItem('rshard_Volt',1);await say(N()+' received Repair Nanites and a Refined Volt Shard!');}
 else await say('East side has lights again. The kids are building snow-bots under them.',sp);}
async function generatorTile(){const s=qstate('generator');
 if(s==='active'){await say('A dead Maker generator. Its restart panel blinks weakly.');const r=await ask('Enter the restart sequence?');if(r!==0)return;
   const seq=Array.from({length:5},()=>pick(['up','right','down','left']));const ok=await pushUI(memoryW(seq));
   if(ok){setQ('generator','found');Snd.sfx('item');await say('The generator coughs, sputters... and roars to life! Lights flicker on along the fence.');collectLights();}else{Snd.sfx('wrong');await say('The sequence fails. The panel resets.');}}
 else if(s==='found'||s==='done')await say('The generator hums steadily. Warm air rolls off its vents.');
 else await say('A dead Maker generator. Frost has crept into its vents.');}
MAPS.repair_v=repairMap('Voltmere Repair Station',{map:'voltmere',x:below('voltmere','repair')[0],y:below('voltmere','repair')[1]},['patch','patch2','debug','spike','spike2','rebootcell','coolfin','platekit']);
MAPS.repair_v.npcs.push({id:'defector',x:7,y:4,dir:'down',look:'grunt',cond:()=>G.rep&&G.rep.c>=2,script:async()=>{G.busy=true;await say('Psst. I left the Choir, but I kept their shard contacts. You\'ve been asking the right questions, so...',{speaker:'Ex-Choir Member'});
  const ts=TYPES.filter(t=>t!=='Core');const t=pick(ts);const r=await ask('Refined '+t+' Shard for 1500 Cr?',['Buy','No thanks']);if(r===0){if(G.money<1500){await say('Come back with more Cr.');}else{G.money-=1500;addItem('rshard_'+t,1);Snd.sfx('item');await say('Pleasure doing business. Don\'t tell the Wardens.',{speaker:'Ex-Choir Member'});}}G.busy=false;}});
MAPS.house_v1=room('Voltmere',['XXXXXXXXXX','XMMx9xxMMX','XxxxxxxxxX','XxxxtxxxxX','XhxxxxxxvX','XXXXeXXXXX'],{map:'voltmere',x:below('voltmere','houseV1')[0],y:below('voltmere','houseV1')[1]},
 [{id:'hv1',x:5,y:2,dir:'up',look:'woman',text:'I run the stilt-city radio. Overdrive is the Makers\' real secret, I swear. Fill the gauge in battle and a bot unleashes its shard power once!'}]);
MAPS.house_v2=room('Voltmere',['XXXXXXXXXXX','X&xx*xxx9vX','XxxxxxxxxxX','XhxxxxxtxxX','XxxxxxxxxxX','XXXXXeXXXXX'],{map:'voltmere',x:below('voltmere','houseV2')[0],y:below('voltmere','houseV2')[1]},
 [{id:'hv2',x:3,y:2,dir:'right',look:'mech',text:'The Choir\'s leader, the Cantor, worked in the Makers\' archives once. Then one day, gone. Next we hear, there\'s a Choir.'}],[{type:'item',id:'hv2i',x:8,y:3,item:'shard_Tide'}]);


// ---------- Gym 2 (conduit puzzle) ----------
MAPS.gym2={name:'Voltmere Warden Hall',theme:'gym2',music:'gym',grid:[
'XXXXXXXXXXXXX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XXXXXgggXXXXX',
'XxxxxxxxxxxxX',
'XxxMxxxxxxxxX',
'XxxxxxxxxxxxX',
'XxxxxxxxxMxxX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XxxxxxxxxxxxX',
'XXXXXXeXXXXXX'],
gate:'gate2',
conduits:{src:[3,6],dst:[9,8],cells:[
 [4,6,'I'],[5,6,'I'],[6,6,'L'],[7,6,'I'],[8,6,'L'],
 [4,7,'L'],[5,7,'L'],[6,7,'L'],[7,7,'L'],[8,7,'L'],
 [4,8,'I'],[5,8,'L'],[6,8,'I'],[7,8,'L'],[8,8,'L']]},
warps:[{x:6,y:12,to:'voltmere',tx:below('voltmere','gym')[0],ty:below('voltmere','gym')[1],dir:'down'}],
npcs:[
 {id:'gguide2',x:10,y:10,dir:'left',look:'lineman',text:'Stand on a conduit panel and press A to rotate it. Connect the generator on the left to the receiver on the right!'},
 {id:'teo',x:2,y:2,dir:'right',look:'lineman',range:4,trainer:{name:'Teo',title:'Lineman',team:[['boltbun',13],['dripcell',13]],money:390,pre:'You got the current flowing? Now feel the shock!',post:'Grounded...'}},
 {id:'ione',x:6,y:1,dir:'down',look:'ione',script:ioneTalk},
]};
async function ioneTalk(){if(flag('badge2')){await say('Stay connected, '+N()+'. Vesna\'s lucky to have you.',{speaker:'Ione'});return;}
 G.busy=true;
 await say('So you\'re the one who brought the relay back online. Voltmere owes you.',{speaker:'Ione'});
 await say('I\'m Ione, Warden of Voltmere. I won\'t go easy on you, though. Gratitude is a shock best delivered at full voltage!',{speaker:'Ione'});
 const r=await runBattle({trainer:{name:'Ione',title:'Warden',look:'ione',warden:1,link:1,team:[['ampjelly',15],['boltbun',14],['thundrone',16]],money:1800,items:1}});
 if(r==='win'){await say('What a current! Fine. You\'ve earned it.',{speaker:'Ione'});
  setFlag('badge2');addItem('prime2',1);addItem('shard_Volt',1);Snd.jingle('victory');
  await say(N()+' received the VOLT PRIME and a Volt Shard!');
  {const c=await ask('Ione asks: "The Choir says bots deserve to be free of the Heartforge. What do you think?"',['The Heartforge keeps everyone alive.','The bots deserve a choice.']);G.rep=G.rep||{w:0,c:0};
   if(c===0){G.rep.w++;await say('Spoken like a Warden. Good.',{speaker:'Ione'});}else{G.rep.c++;await say('...That\'s not a crazy thing to say. Just don\'t say it too loudly around Brakka.',{speaker:'Ione'});}}
  await thawRegions(['voltmere','route2','ashgrove'],'The Volt Prime flares. Heat surges through every relay at once...');
  await say('Kael came through yesterday. He beat me too, but he kept asking about Mt. Cinder. About what\'s under it.',{speaker:'Ione'});
  await say('...Your Navi-band is buzzing.',{speaker:'Ione'});
  await say(N()+'? It\'s Vesna. Two Prime Shards already? I\'m proud of you.',{speaker:'Vesna (Navi-band)'});
  await say('Listen... the new readings from Mt. Cinder show something under the Heartforge. Something cold. Something big.',{speaker:'Vesna (Navi-band)'});
  await say('I should have told you both sooner. Come back to Ashgrove when you can. And if you see Kael... tell him I\'m sorry.',{speaker:'Vesna (Navi-band)'});
  G.busy=false;await chapterEnd();return;}
 G.busy=false;}
