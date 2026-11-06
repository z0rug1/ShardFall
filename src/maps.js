// ===================== MAPS & STORY =====================
const SOLID=new Set(['T','~','f','R','Y','Q','W','s','#','%','X','c','M','t','h','v','l','m']);
const MAPS={};
const N=()=>G.name;

// ---------- Ashgrove ----------
MAPS.ashgrove={name:'Ashgrove',theme:'out',music:'town',outdoor:1,world:{x:0,y:56},town:1,heal:{map:'home',x:4,y:6},grid:[
'TTTTTTTTTT==TTTTTTTTTT',
'TTTTTTTTTT==TTTTTTTTTT',
'TT........==........TT',
'TT.RRRR...==..RRRRRR.T',
'TT.RRRR...==..RRRRRR.T',
'TT.WWDW..s==..WWWDWW.T',
'TT........==........TT',
'TT.FFF....====......TT',
'TT.FFF.......=..FFF.TT',
'TT...........=......TT',
'TT..RRRR.....=......TT',
'TT..WWDW.....=..~~~.TT',
'TT...........=..~~~.TT',
'TT....F......=......TT',
'TTfffffff....=fffffffT',
'TTTTTTTTT....=TTTTTTTT',
'TTTTTTTTT~~~~~~TTTTTTT',
'TTTTTTTTTTTTTTTTTTTTTT'],
warps:[{x:5,y:5,to:'home',tx:4,ty:6},{x:17,y:5,to:'lab',tx:5,ty:8},{x:6,y:11,to:'house_a',tx:4,ty:6},
 {x:10,y:0,to:'route1',tx:8,ty:34},{x:11,y:0,to:'route1',tx:9,ty:34}],
signs:{'9,5':'ASHGROVE — "Warm hearths, warm hearts." The lab is to the east.'},
npcs:[
 {id:'aide',x:12,y:2,dir:'down',look:'clerk',text:'The Heartforge readings were weird again last night. Dr. Vesna hasn\'t slept.'},
 {id:'kid1',x:7,y:12,dir:'right',look:'kid',wander:1,text:'My dad says bots used to glow brighter. Now some just... stop.'},
 {id:'old1',x:16,y:9,dir:'down',look:'old',text:'I remember when snow never reached Ashgrove. Mt. Cinder kept us warm. Times change.'},
],
triggers:[{x:10,y:2,run:blockNorth},{x:11,y:2,run:blockNorth}]};
async function guardBlock(){if(flag('badge1'))return;G.busy=true;await say('Hold on! Route 2 is crawling with feral bots and Choir thugs. Come back when you have Warden Brakka\'s Prime Shard.',{speaker:'Guard'});await stepPlayer('left');G.busy=false;}
async function blockNorth(){if(flag('starter'))return;G.busy=true;await say('Hey, wait! Don\'t go into the tall grass without a bot! Feral ones bite. Dr. Vesna\'s lab is just east of here.',{speaker:'Lab Aide'});await stepPlayer('down');G.busy=false;}

MAPS.home={name:'Your House',theme:'house',music:'town',grid:[
'XXXXXXXXX','XhxxMxxvX','XxxxxxxxX','XxxtxxxxX','XxxxxxxxX','XxxxxxxxX','XvxxxxxvX','XXXXeXXXX'],
warps:[{x:4,y:7,to:'ashgrove',tx:5,ty:6,dir:'down'}],
npcs:[{id:'mom',x:5,y:3,dir:'left',look:'mom',script:async()=>{
  if(!flag('starter')){await say(N()+'! Dr. Vesna came by this morning. She wants to see you at the lab, the big building on the east side.',{speaker:'Mom'});return;}
  await say('Oh, you look tired. Rest a moment.',{speaker:'Mom'});await healAll();await say('There. Your bots are good as new. Be careful out there, okay?',{speaker:'Mom'});}}]};
MAPS.house_a={name:'Ashgrove',theme:'house',music:'town',grid:['XXXXXXXXX','XvxxMxxhX','XxxxxxxxX','XxxxxtxxX','XxxxxxxxX','XxxxxxxxX','XxxxxxxvX','XXXXeXXXX'],
warps:[{x:4,y:7,to:'ashgrove',tx:6,ty:12,dir:'down'}],
npcs:[{id:'ha1',x:2,y:3,dir:'right',look:'woman',text:'The Makers built every bot you\'ve ever seen. Nobody knows where the Makers went.'},
 {id:'ha2',x:6,y:5,dir:'left',look:'old',text:'Shards are like hearts. Fit a different one, get a different bot. My old Gearpup became a Shockhound when I gave it a Volt shard!'}]};

// ---------- Lab ----------
MAPS.lab={name:'Orla Lab',theme:'lab',music:'town',grid:[
'XXXXXXXXXXX','XMMxxxxxMMX','XxxxxxxxxxX','XxxxxxxxxxX','XxxxtttxxxX','XxxxxxxxxxX','XMxxxxxxxMX','XMxxxxxxxMX','XxxxxxxxxxX','XXXXXeXXXXX'],
warps:[{x:5,y:9,to:'ashgrove',tx:17,ty:6,dir:'down'}],
objs:[{type:'pod',x:4,y:4,bot:'flicker'},{type:'pod',x:5,y:4,bot:'drizzlet'},{type:'pod',x:6,y:4,bot:'thornbit'}],
npcs:[{id:'vesna',x:5,y:2,dir:'down',look:'vesna',script:vesnaTalk},
 {id:'kael',x:5,y:7,dir:'up',look:'kael',cond:()=>flag('starter')&&!flag('kael1'),text:'...'},
 {id:'aide2',x:8,y:8,dir:'left',look:'clerk',text:'These monitors track Heartforge output. The line\'s been dropping for weeks.'}]};
async function vesnaTalk(){
 if(!flag('starter')){await say('Ah, '+N()+'. Good, you came.',{speaker:'Vesna'});
  await say('You\'ve felt the cold coming early. The Heartforge under Mt. Cinder is failing, and every bot in Calderra runs on it.',{speaker:'Vesna'});
  await say('I need someone to travel the peninsula for me. I can\'t leave the lab, and... I trust you.',{speaker:'Vesna'});
  await say('On that table are three dormant frames I restored. Each runs on a single core shard. Pick the one that speaks to you.',{speaker:'Vesna'});return;}
 if(!flag('kael1')){await say('Go on, check on your new partner!',{speaker:'Vesna'});return;}
 const tips=['Every bot has sockets. At level 16 the second socket wakes up, and the shard you fit decides what it becomes.','Weaken a feral bot first, then use a Link Spike. A status problem helps too.','The Wardens each guard a Prime Shard. Bring them back here.','Press M or MAP for the full map. You can warp to towns you\'ve visited from there.'];
 await say(pick(tips),{speaker:'Vesna'});
 if(G.party.some(b=>b.hp<stats(b).hp)){await healAll();await say('I topped up your bots while we talked.',{speaker:'Vesna'});}}
async function choosePod(o){
 if(flag('starter')){await say('An empty restoration pod.');return;}
 const d=BOTS[o.bot];G.busy=true;
 const ov={update(){},draw(){panel(160,40,160,150);ctx.drawImage(botSprite(o.bot),180,50,120,120);typeBadges(d.types,182,178);}};UI.push(ov);
 const r=await ask(d.name+' — '+d.desc.split('.')[0]+'. Choose '+d.name+'?');UI.splice(UI.indexOf(ov),1);
 if(r!==0){G.busy=false;return;}
 setFlag('starter');G.starter=o.bot;o.taken=1;const b=makeBot(o.bot,5);G.party.push(b);seen(b.id,1);
 Snd.jingle('level');await say(N()+' received '+d.name+'!');
 const kael=G.npcs.find(n=>n.id==='kael');kael.hidden=false;
 await say('Wait up! Aunt Vesna, you said I could have one too!',{speaker:'Kael'});
 const counter={flicker:'drizzlet',drizzlet:'thornbit',thornbit:'flicker'}[o.bot];G.rival=counter;
 await walkNPC(kael,'up',1);await say('...You gave one to '+N()+' first? Fine. I\'ll take this one. '+BOTS[counter].name+' beats yours anyway.',{speaker:'Kael'});
 G.objs.find(p=>p.bot===counter).taken=1;
 await say('Let\'s test them right now. Unless you\'re scared.',{speaker:'Kael'});
 const res=await runBattle({trainer:{name:'Kael',title:'Rival',look:'kael',team:[[counter,5]],money:120,noBlackout:1}});
 if(res==='win')await say('Tch. Beginner\'s luck. Don\'t get used to it.',{speaker:'Kael'});else await say('Ha! Told you. Maybe stick to watering plants.',{speaker:'Kael'});
 setFlag('kael1');await healAll();
 await say('I\'m heading out. First Warden is in Brasston. Try to keep up, '+N()+'.',{speaker:'Kael'});
 await walkNPC(kael,'down',2);kael.hidden=true;
 await say('That boy... He\'s talented, but he never listens. Here, you\'ll need these.',{speaker:'Vesna'});
 addItem('spike',5);addItem('patch',3);Snd.sfx('item');await say(N()+' received 5 Link Spikes and 3 Patch Kits!');
 await say('Feral bots have gone wild without enough Heartforge power. Weaken one, then use a Link Spike to reboot it. It\'ll join your team.',{speaker:'Vesna'});
 await say('Your Navi-band has a minimap and a full map. Press MAP to see it. The first Warden, Brakka, is north in Brasston.',{speaker:'Vesna'});
 await say('One more thing. At level 16, a bot\'s second socket opens. The shard you fit changes what it evolves into. Choose carefully.',{speaker:'Vesna'});
 G.busy=false;}

// ---------- Route 1 ----------
MAPS.route1={name:'Route 1',theme:'out',music:'route',outdoor:1,world:{x:2,y:20},enc:{tile:',',rate:10,list:[['pipsprock',2,4,35],['boltbun',2,4,25],['scrapmite',3,4,25],['sporelet',3,5,15]]},grid:[
'TTTTTTTT====TTTTTTTT',
'TTTTTTTT====TTTTTTTT',
'TT,,,,....=....,,,TT',
'TT,,,,....=....,,,TT',
'TT,,,,....=....,,,TT',
'TT........=.......TT',
'TTTTTT....=...TTTTTT',
'TTTTTT....=...TTTTTT',
'TT.....====.......TT',
'TT.,,,.=..........TT',
'TT.,,,.=..~~~~~...TT',
'TT.,,,.=..~~~~~...TT',
'TT.,,,.=..~~~~~...TT',
'TT.....=..........TT',
'TTTT...=....TTTTTTTT',
'TTTT...=....TTTTTTTT',
'TT,,,,,=,,,,,,,,,,TT',
'TT,,,,,=,,,,,,,,,,TT',
'TT,,,,,=,,,,,,,,,,TT',
'TT.....=.......s..TT',
'TT.....=========..TT',
'TTTTTTTTTTTTTT=.TTTT',
'TTTTTTTTTTTTTT=.TTTT',
'TT....,,,,,,,,=...TT',
'TT....,,,,,,,,=...TT',
'TT..FF,,,,,,,,=...TT',
'TT..FF........=...TT',
'TT.....=======....TT',
'TT.....=..........TT',
'TTTTTT.=.TTTTTTTTTTT',
'TTTTTT.=.TTTTTTTTTTT',
'TT,,,,.=.,,,,,,,..TT',
'TT,,,,.=.,,,,,,,..TT',
'TT....===.........TT',
'TTTTTTTT==TTTTTTTTTT',
'TTTTTTTT==TTTTTTTTTT'],
warps:[{x:8,y:35,to:'ashgrove',tx:10,ty:1},{x:9,y:35,to:'ashgrove',tx:11,ty:1},
 {x:8,y:0,to:'brasston',tx:10,ty:18},{x:9,y:0,to:'brasston',tx:11,ty:18},{x:10,y:0,to:'brasston',tx:12,ty:18},{x:11,y:0,to:'brasston',tx:13,ty:18}],
signs:{'15,19':'ROUTE 1 — North: Brasston. Feral bots in tall grass!'},
objs:[{type:'item',id:'r1gale',x:16,y:12,item:'shard_Gale'},{type:'item',id:'r1patch',x:3,y:26,item:'patch'},{type:'item',id:'r1spike',x:17,y:3,item:'spike',qty:2}],
npcs:[
 {id:'lou',x:12,y:9,dir:'left',look:'tinker',range:5,trainer:{name:'Lou',title:'Tinker',team:[['scrapmite',4],['pipsprock',4]],money:80,pre:'You! Your bot looks freshly booted. Let\'s see how it runs!',post:'Huh. Your bot\'s better calibrated than mine.'}},
 {id:'mara',x:16,y:24,dir:'left',look:'scout',range:5,trainer:{name:'Mara',title:'Scout',team:[['boltbun',5],['sporelet',5]],money:100,pre:'Scouts never back down from a battle!',post:'Okay, okay. You\'ve got good instincts.'}},
 {id:'r1man',x:4,y:5,dir:'down',look:'hiker',text:'Tall grass is where feral bots hide. Walk through it if you want to find new partners.'},
]};

// ---------- Brasston ----------
MAPS.brasston={name:'Brasston',theme:'out',music:'town',outdoor:1,world:{x:0,y:0},town:1,heal:{map:'repair_b',x:5,y:6},grid:[
'TTTTTTTTTTTTTTTTTTTTTTTT',
'TT....................TT',
'TT.YYYYYYY.....RRRR...TT',
'TT.YYYYYYY.....RRRR...TT',
'TT.YYYYYYY.....WWDW...TT',
'TT.WWWDWWW..s.........TT',
'TT....=...............TT',
'TT....==========......TT',
'TT..QQQQ.......=......TT',
'TT..QQQQ.......=========',
'TT..WDWW.......=========',
'TT.............=......TT',
'TT..l..........=..l...TT',
'TT....RRRR.....=......TT',
'TT....RRRR.....=..FFF.TT',
'TT....WDWW.....=..FFF.TT',
'TT.............=......TT',
'TTTTTTTTTT=====TTTTTTTTT',
'TTTTTTTTTT====TTTTTTTTTT',
'TTTTTTTTTT====TTTTTTTTTT'],
warps:[{x:6,y:5,to:'gym1',tx:6,ty:13},{x:5,y:10,to:'repair_b',tx:5,ty:6},{x:17,y:4,to:'house_b1',tx:4,ty:6},{x:7,y:15,to:'house_b2',tx:4,ty:6},
 {x:10,y:19,to:'route1',tx:8,ty:1},{x:11,y:19,to:'route1',tx:9,ty:1},{x:12,y:19,to:'route1',tx:10,ty:1},{x:13,y:19,to:'route1',tx:11,ty:1},
 {x:23,y:9,to:'route2',tx:1,ty:6},{x:23,y:10,to:'route2',tx:1,ty:7}],
triggers:[{x:22,y:9,run:guardBlock},{x:22,y:10,run:guardBlock}],
signs:{'12,5':'BRASSTON WARDEN HALL — Warden Brakka. "Solid as bedrock."'},
npcs:[
 {id:'bguard',x:21,y:11,dir:'up',look:'guard',text:'Route 2 is dangerous these days. I only let through people who have a Prime Shard from Warden Brakka.'},
 {id:'grunt0',x:17,y:12,dir:'left',look:'grunt',range:4,cond:()=>!flag('t_grunt0'),trainer:{name:'Choir Grunt',title:'Hollow',team:[['gloomlamp',7],['scrapmite',6]],money:150,pre:'The Heartforge is a chain around every bot\'s neck. The Hollow Choir will break it. Get out of my way!',post:'Silence is coming. The Cantor promised. You can\'t stop a song...'},after:async n=>{n.hidden=true;await say('The Choir grunt ran off toward Route 2...');}},
 {id:'eng',x:19,y:13,dir:'left',look:'engineer',text:'Those masked creeps call themselves the Hollow Choir. They\'ve been stealing shards all over Brasston!'},
 {id:'bkid',x:9,y:12,dir:'down',look:'kid',wander:1,text:'Warden Brakka makes you push crates around his gym. He says it builds character.'},
 {id:'bwoman',x:13,y:3,dir:'down',look:'woman',text:'Kael came through here this morning. Beat Brakka in three turns, they say. Scary kid.'},
]};
MAPS.house_b1={name:'Brasston',theme:'house',music:'town',grid:['XXXXXXXXX','XvxxMxxhX','XxxxxxxxX','XxtxxxxxX','XxxxxxxxX','XxxxxxxxX','XvxxxxxxX','XXXXeXXXX'],warps:[{x:4,y:7,to:'brasston',tx:17,ty:5,dir:'down'}],
 npcs:[{id:'hb1',x:5,y:2,dir:'down',look:'old',text:'Socket types matter. Fit a shard that covers your bot\'s weaknesses and it\'ll serve you well.'}]};
MAPS.house_b2={name:'Brasston',theme:'house',music:'town',grid:['XXXXXXXXX','XhxxxxMvX','XxxxxxxxX','XxxxtxxxX','XxxxxxxxX','XxxxxxxxX','XvxxxxxvX','XXXXeXXXX'],warps:[{x:4,y:7,to:'brasston',tx:7,ty:16,dir:'down'}],
 npcs:[{id:'hb2',x:2,y:4,dir:'right',look:'mech',text:'Feral bots sometimes drop shards when you beat them. Keep an eye out!'}],objs:[{type:'item',id:'hb2item',x:6,y:5,item:'debug'}]};

function repairMap(name,ret,shop){return{name,theme:'repair',music:'town',heal:1,grid:['XXXXXXXXXXX','XxxxxMxxxxX','XcccxxxcccX','XxxxxxxxxxX','XxxxxxxxxxX','XvxxxxxxxvX','XxxxxxxxxxX','XXXXXeXXXXX'],
 warps:[{x:5,y:7,to:ret.map,tx:ret.x,ty:ret.y,dir:'down'}],
 npcs:[{id:'nurse',x:2,y:1,dir:'down',look:'nurse',script:nurseTalk},{id:'clerk',x:8,y:1,dir:'down',look:'clerk',script:()=>openShop(shop)},
  {id:'rp1',x:8,y:5,dir:'left',look:pick(['kid','woman','mech']),text:'The terminal in the back is a storage system. Bots you catch with a full party get sent there.'}],
 terminal:{x:5,y:1}};}
MAPS.repair_b=repairMap('Brasston Repair Station',{map:'brasston',x:5,y:11},['patch','debug','spike']);
async function nurseTalk(){G.busy=true;const r=await ask('Welcome to the Repair Station! Shall I restore your bots to full power?');
 if(r===0){await say('Okay, hand them over...');Snd.jingle('heal');await wait(90);await healAll();setLastHeal();await say('All done! Your bots are fully repaired. Come back anytime!');}
 else await say('Come back anytime!');G.busy=false;}

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
warps:[{x:6,y:14,to:'brasston',tx:6,ty:6,dir:'down'}],
npcs:[
 {id:'gguide1',x:10,y:12,dir:'left',look:'quarry',text:'Push the three crates onto the three gold plates and the gate opens. Mess up? Walk out and back in to reset the room.'},
 {id:'jen',x:10,y:2,dir:'left',look:'quarry',range:4,trainer:{name:'Jen',title:'Quarry Worker',team:[['pebblit',8],['gearpup',8]],money:200,pre:'You solved the crates? Then you can solve me!',post:'Ugh, crushed.'}},
 {id:'brakka',x:6,y:1,dir:'down',look:'brakka',script:brakkaTalk},
]};
async function brakkaTalk(){if(flag('badge1')){await say('Your bots are solid now. Keep it up, and watch out for those Choir creeps on Route 2.',{speaker:'Brakka'});return;}
 G.busy=true;
 await say('So you\'re Vesna\'s other kid. Kael came through this morning. Loud, fast, didn\'t listen to a word I said.',{speaker:'Brakka'});
 await say('I\'m Brakka, Warden of Brasston. The Stone Prime has been in my family for six generations. Show me your bots are built to last!',{speaker:'Brakka'});
 const r=await runBattle({trainer:{name:'Brakka',title:'Warden',look:'brakka',warden:1,team:[['pebblit',10],['gearpup',10],['ironcrag',12]],money:1200,items:1}});
 if(r==='win'){await say('Ha! Solid! You\'ve got bedrock in you, kid.',{speaker:'Brakka'});
  setFlag('badge1');addItem('prime1',1);addItem('shard_Stone',1);Snd.jingle('victory');
  await say(N()+' received the STONE PRIME and a Stone Shard!');
  await say('That Stone Shard fits any compatible socket. Once a bot hits level 16, try it and see what happens.',{speaker:'Brakka'});
  await say('The Route 2 guard will let you through now. Ione\'s in Voltmere, past the Relay Tunnel. Watch yourself in there.',{speaker:'Brakka'});}
 G.busy=false;}

// ---------- Route 2 ----------
MAPS.route2={name:'Route 2',theme:'out',music:'route',outdoor:1,world:{x:24,y:3},enc:{tile:',',rate:10,list:[['boltbun',7,9,20],['pebblit',7,9,20],['gearpup',8,10,18],['dripcell',7,9,20],['sporelet',8,9,15],['gloomlamp',8,10,7]]},grid:[
'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
'TTTT,,,,,,TTTTTTTT......~~~~~~~~TTTTTTTT',
'TT..,,,,,,....TTTT...,,,~~~~~~~~,,,..TTT',
'TT..,,,,,,....TTTT...,,,~~~~~~~~,,,...TT',
'TT............TTTT..........m...,,,...TT',
'TT...====================.............TT',
'....==..,,,,,,.............=.....,,,..TT',
'....=...,,,,,,.............=.....,,,..TT',
'TT..=...,,,,,,....TTTT.....=.....,,,..TT',
'TT..=.........,,,,TTTT.....=.........TTT',
'TT..==========,,,,.........========..KTT',
'TT............,,,,....TTTT............TT',
'TTTTTTTTTTT...........TTTT.........TTTTT',
'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
warps:[{x:0,y:6,to:'brasston',tx:22,ty:9},{x:0,y:7,to:'brasston',tx:22,ty:10},{x:37,y:10,to:'cave',tx:1,ty:7}],
signs:{},
objs:[{type:'cache',id:'cache2',x:34,y:5,item:'shard_Volt'},{type:'item',id:'r2p',x:3,y:11,item:'patch2'},{type:'item',id:'r2s',x:9,y:1,item:'spike',qty:3}],
terminalPuzzle:{x:28,y:4,flag:'cache2open'},
npcs:[
 {id:'dov',x:12,y:9,dir:'up',look:'mech',range:4,trainer:{name:'Dov',title:'Mechanic',team:[['gearpup',10],['scrapmite',10],['boltbun',11]],money:330,pre:'Hold it! I tune bots for a living. Let\'s see how yours handle!',post:'Your bots run smoother than anything in my shop.'}},
 {id:'sela',x:30,y:9,dir:'left',look:'hiker',range:4,trainer:{name:'Sela',title:'Hiker',team:[['pebblit',11],['pebblit',11],['dripcell',12]],money:360,pre:'The mountains made me tough! Let\'s go!',post:'Rockslide... of defeat.'}},
 {id:'r2girl',x:25,y:6,dir:'down',look:'woman',text:'There\'s an old Maker terminal up north. It controls a sealed cache. You have to repeat its light pattern to open it.'},
],
triggers:[{x:15,y:4,run:kael2},{x:15,y:5,run:kael2},{x:15,y:6,run:kael2},{x:15,y:7,run:kael2},{x:15,y:8,run:kael2},{x:15,y:9,run:kael2},{x:15,y:10,run:kael2},{x:15,y:11,run:kael2}]};
async function kael2(){if(flag('kael2'))return;setFlag('kael2');G.busy=true;
 let off=1;for(const d of [3,2]){let ok=true;for(let i=1;i<=d;i++)if(isBlocked(G.px+i,G.py))ok=false;if(ok){off=d;break;}}const k={id:'kael_r2',x:G.px+off,y:G.py,dir:'left',look:'kael'};G.npcs.push(k);G.pdir='right';
 Snd.music('battle');await walkNPC(k,'left',off-1);
 await say('There you are! I already have the Stone Prime. What took you so long?',{speaker:'Kael'});
 await say('Aunt Vesna keeps sending me messages telling me to be careful. Like I\'m the one who needs babysitting.',{speaker:'Kael'});
 await say('Let\'s see if you\'ve gotten any stronger.',{speaker:'Kael'});
 const extra={flicker:'pipsprock',drizzlet:'boltbun',thornbit:'gearpup'}[G.rival];
 const r=await runBattle({trainer:{name:'Kael',title:'Rival',look:'kael',team:[['pipsprock',11],[extra==='pipsprock'?'boltbun':extra,11],[G.rival,13]],money:520}});
 if(r==='win'){await say('...Whatever. I wasn\'t even trying.',{speaker:'Kael'});
  await say('Hey. Have you ever wondered why Vesna doesn\'t let anyone see the full Heartforge data? Forget it. See you in Voltmere.',{speaker:'Kael'});
  await walkNPC(k,'right',3);}
 G.npcs.splice(G.npcs.indexOf(k),1);Snd.music(curMap().music);G.busy=false;}

// ---------- Relay Tunnel (switch puzzle) ----------
MAPS.cave={name:'Relay Tunnel',theme:'cave',music:'cave',outdoor:1,dungeon:1,world:{x:62,y:6},enc:{tile:'^',rate:5,list:[['scrapmite',9,11,30],['pebblit',9,11,25],['gloomlamp',10,12,25],['gearpup',10,11,20]]},grid:[
'%%%%%%%%%%%%%%%%%%%%%%%%',
'%%^^^^%%%%%^^^%%%%^^^^%%',
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
warps:[{x:0,y:7,to:'route2',tx:36,ty:10,dir:'left'},{x:23,y:7,to:'voltmere',tx:2,ty:8,dir:'right'}],
signs:{},
objs:[{type:'item',id:'cvIron',x:12,y:2,item:'shard_Iron'},{type:'item',id:'cvP',x:12,y:12,item:'patch2'},{type:'item',id:'cvS',x:2,y:11,item:'spike2'}],
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
 const r=await runBattle({trainer:{name:'Mirelle',title:'Deacon',look:'deacon',warden:1,team:[['gloomlamp',13],['dripcell',13],['rotcap',14]],money:900}});
 if(r==='win'){await say('...Unexpected. Keep your little shards, then. The song has many verses.',{speaker:'Deacon Mirelle'});
  setFlag('deacon');n.hidden=true;Snd.sfx('switch');await say('The Deacon vanished into the dark. Deep in the walls, the relay hums back to life.');
  await say('Ahead, Voltmere\'s lights flicker on again.');}
 G.busy=false;}

// ---------- Voltmere ----------
MAPS.voltmere={name:'Voltmere',theme:'out',music:'town',outdoor:1,world:{x:86,y:5},town:1,heal:{map:'repair_v',x:5,y:6},grid:[
'TTTTTTTTTTTTTTTTTTTTTTTT',
'T#####......MM......TTTT',
'T#####.YYYYYYYY.....l.TT',
'T#####.YYYYYYYY.......TT',
'T#####.YYYYYYYY..RRRR.TT',
'TT###..WWWDWWWW..WDWW.TT',
'TT####....=..s........TT',
'TT####....=...........TT',
'#K========...QQQQ.....TT',
'TT..........=QQQQ.....TT',
'TT..MM......=WDWW..MM.TT',
'TT..MM......==.....MM.TT',
'TT............FFF.....TT',
'TT..RRRR......FFF.....TT',
'TT..RRRR..............TT',
'TT..WDWW....l.........TT',
'TT....................TT',
'TTTTTTTTTTTTTTTTTTTTTTTT'],
warps:[{x:1,y:8,to:'cave',tx:22,ty:7,dir:'left'},{x:10,y:5,to:'gym2',tx:6,ty:11},{x:14,y:10,to:'repair_v',tx:5,ty:6},{x:18,y:5,to:'house_v1',tx:4,ty:6},{x:5,y:15,to:'house_v2',tx:4,ty:6}],
signs:{'13,6':'VOLTMERE WARDEN HALL — Warden Ione. "Stay connected."'},
npcs:[
 {id:'vm1',x:16,y:12,dir:'left',look:'lineman',text:'The power came back all at once! Somebody fixed the relay. Was it you?'},
 {id:'vm2',x:7,y:9,dir:'down',look:'kid',wander:1,text:'Ione\'s gym is full of power conduits. You have to rotate them so the current reaches the gate!'},
 {id:'vm3',x:20,y:7,dir:'down',look:'old',text:'Voltmere was built around Maker generators. Without the Heartforge, they\'d be just scrap.'},
]};
MAPS.repair_v=repairMap('Voltmere Repair Station',{map:'voltmere',x:14,y:11},['patch','patch2','debug','spike','spike2','rebootcell']);
MAPS.house_v1={name:'Voltmere',theme:'house',music:'town',grid:['XXXXXXXXX','XhxxMxxvX','XxxxxxxxX','XxxtxxxxX','XxxxxxxxX','XxxxxxxxX','XvxxxxxvX','XXXXeXXXX'],warps:[{x:4,y:7,to:'voltmere',tx:18,ty:6,dir:'down'}],
 npcs:[{id:'hv1',x:5,y:4,dir:'left',look:'woman',text:'My husband swears Overdrive is the Makers\' real secret. Fill the gauge in battle and your bot can unleash its shard power once!'}]};
MAPS.house_v2={name:'Voltmere',theme:'house',music:'town',grid:['XXXXXXXXX','XvxxxxxhX','XxxxxxxxX','XxxxxtxxX','XxxxxxxxX','XxxxxxxxX','XxxxxxxvX','XXXXeXXXX'],warps:[{x:4,y:7,to:'voltmere',tx:5,ty:16,dir:'down'}],
 npcs:[{id:'hv2',x:2,y:3,dir:'right',look:'mech',text:'Some say the Choir\'s leader, the Cantor, used to work with the Makers\' archives. Spooky, huh?'}],objs:[{type:'item',id:'hv2i',x:6,y:5,item:'shard_Tide'}]};

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
warps:[{x:6,y:12,to:'voltmere',tx:10,ty:6,dir:'down'}],
npcs:[
 {id:'gguide2',x:10,y:10,dir:'left',look:'lineman',text:'Stand on a conduit panel and press A to rotate it. Connect the generator on the left to the receiver on the right!'},
 {id:'teo',x:2,y:2,dir:'right',look:'lineman',range:4,trainer:{name:'Teo',title:'Lineman',team:[['boltbun',13],['dripcell',13]],money:390,pre:'You got the current flowing? Now feel the shock!',post:'Grounded...'}},
 {id:'ione',x:6,y:1,dir:'down',look:'ione',script:ioneTalk},
]};
async function ioneTalk(){if(flag('badge2')){await say('Stay connected, '+N()+'. Vesna\'s lucky to have you.',{speaker:'Ione'});return;}
 G.busy=true;
 await say('So you\'re the one who brought the relay back online. Voltmere owes you.',{speaker:'Ione'});
 await say('I\'m Ione, Warden of Voltmere. I won\'t go easy on you, though. Gratitude is a shock best delivered at full voltage!',{speaker:'Ione'});
 const r=await runBattle({trainer:{name:'Ione',title:'Warden',look:'ione',warden:1,team:[['boltbun',14],['ampjelly',15],['thundrone',16]],money:1800,items:1}});
 if(r==='win'){await say('What a current! Fine. You\'ve earned it.',{speaker:'Ione'});
  setFlag('badge2');addItem('prime2',1);addItem('shard_Volt',1);Snd.jingle('victory');
  await say(N()+' received the VOLT PRIME and a Volt Shard!');
  await say('Kael came through yesterday. He beat me too, but he kept asking about Mt. Cinder. About what\'s under it.',{speaker:'Ione'});
  await say('...Your Navi-band is buzzing.',{speaker:'Ione'});
  await say(N()+'? It\'s Vesna. Two Prime Shards already? I\'m proud of you.',{speaker:'Vesna (Navi-band)'});
  await say('Listen... the new readings from Mt. Cinder show something under the Heartforge. Something cold. Something big.',{speaker:'Vesna (Navi-band)'});
  await say('I should have told you both sooner. Come back to Ashgrove when you can. And if you see Kael... tell him I\'m sorry.',{speaker:'Vesna (Navi-band)'});
  G.busy=false;await chapterEnd();return;}
 G.busy=false;}
