// ===================== CHAPTER 3: THE DROWNED COAST =====================
function WP3(id,k,to,tx,ty,dir,extra){const p=C3(id,k);return Object.assign({x:p[0],y:p[1],to,tx,ty},dir?{dir}:{},extra||{});}
function below3(id,k){const p=C3(id,k);return [p[0],p[1]+1];}
const at3=(id,k)=>({x:C3(id,k)[0],y:C3(id,k)[1]});
Object.assign(LOOKS,{maren:{skin:'#c88a5a',hair:'#1a4a6a',top:'#2a6a8a',bot:'#1a2a3a',acc:'#60d0f0'},pellashe:{skin:'#f0d0b0',hair:'#e8e8f0',top:'#a8c8d8',bot:'#4a5a6a',coat:1,acc:'#ffffff'},
  yoru:{skin:'#f4dcc8',hair:'#202838',top:'#d8e8f4',bot:'#3a4a5a',robe:1,acc:'#80c0ff'},cantor:{skin:'#e8c8a8',hair:'#6a3a9a',top:'#3a2a4a',bot:'#2a1a3a',robe:1,acc:'#c060ff'},
  spiritw:{skin:'#c8d0e0',hair:'#8a96a8',top:'#5a6676',bot:'#3a4250',robe:1,mask:1,acc:'#a0f0ff'},sailor:{skin:'#d8a880',hair:'#5a3a20',top:'#e8e8f0',bot:'#2a3a5a',beanie:'#c03030',pom:'#ffffff'}});
Object.assign(QUESTS,{coast:{n:'The Drowned Coast',where:'Saltwind Shore → Saltmarrow → Galecrest',steps:{active:'Follow the coast west of Kilnhaven. Two Wardens hold the Tide and Gale Primes.',cathedral:'The Choir is gathering in the drowned Cathedral, south of the Drowned Reach. You\'ll need a boat.',done:'You faced the Cantor.'}},
  kaelbot:{n:'Kael\'s Old Frame',where:'Drowned Reach',steps:{active:'A battered bot frame with Kael\'s tag is stuck on the Drowned Reach flats.',found:'You have Kael\'s old frame. Kael is somewhere on the coast.',done:'Kael has his first bot back.'}}});
Object.assign(LOGS,{log5:'MAKER LOG 311: "The fleet is lost. We beached the Ark at Saltmarrow and sealed the Tide Prime inside its hull. The sea will keep it honest."',
  log6:'MAKER LOG 340: "Ilian says the Accord is a leash. I say it is a seatbelt. We are both tired. We are both right."',
  log7:'MAKER LOG 402: "If the Heartforge ever falls below a fifth of its strength, the titan stirs. Do not let it fall. Do not let it fall."',
  log8:'MAKER LOG 999: "To whoever holds all eight: the Accord can be rewritten. The key is in the archive. Choose better than we did."'});

// ---------- Kilnhaven west gate ----------
(function(){const m=MAPS.kilnhaven;m.grid=m.grid.map((r,y)=>(y===15||y===16)?'==='+r.slice(3):r);
  m.warps.push({x:0,y:15,to:'route5',tx:32,ty:10},{x:0,y:16,to:'route5',tx:32,ty:11});
  m.triggers=(m.triggers||[]).concat([{x:1,y:15,run:coastGate},{x:1,y:16,run:coastGate}]);})();
async function coastGate(){if(flag('ch2done'))return;G.busy=true;await say('Sea-fog rolls off the coast road. A Kilnhaven ranger waves you back: "Not until Sora says the vents are safe."');await stepPlayer('right');G.busy=false;}

// ---------- Saltwind Shore ----------
MAPS.route5={name:'Saltwind Shore',theme:'out',music:'route',outdoor:1,weather:'snow',world:{x:112,y:62},grid:C3G.route5.grid,
 enc:{tiles:'jwq',count:9,list:[['brinejaw',24,27,40]],by:{j:[['brinejaw',24,27,40],['scrapmite',24,26,30],['cogwyrm',25,27,30]],w:[['squallkite',24,27,45],['dripcell',24,26,30],['cinderwisp',25,27,25]],q:[['frostling',25,27,50],['brinejaw',24,26,50]]}},
 alpha:{id:'brinejaw',lv:31,at:[27,4]},
 warps:[WP3('route5','exitE0','kilnhaven',1,15),WP3('route5','exitE1','kilnhaven',1,16),WP3('route5','exitW0','saltmarrow',26,10),WP3('route5','exitW1','saltmarrow',26,11)],
 objs:[{type:'pylon',id:'p5',...at3('route5','pylon'),thaws:['route5'],run:pylonRun},{type:'log',log:'log5',...at3('route5','log'),run:readLog},
  {type:'item',id:'r5a',...at3('route5','item1'),item:'patch2',qty:2},{type:'item',id:'r5b',...at3('route5','item2'),item:'rshard_Gale'}],
 npcs:[{id:'r5t1',...at3('route5','t1'),dir:'down',look:'sailor',range:4,trainer:{name:'Corra',title:'Wrecker',team:[['brinejaw',26],['scrapmite',26],['cogwyrm',27]],money:1300,pre:'Everything on this beach is salvage, and so is your bot!',post:'Fine, fine. Take the beach.'}},
  {id:'r5t2',...at3('route5','t2'),dir:'left',look:'scout',range:4,trainer:{name:'Wren',title:'Kite Flyer',team:[['squallkite',27],['boltbun',27]],money:1300,pre:'Feel that wind? My kites live for it!',post:'Grounded...'}},
  {id:'r5n',...at3('route5','npc1'),dir:'down',look:'old',text:'Those gusts on the dunes push you clean off your feet. Go with them, not against them.'}]};

// ---------- Saltmarrow ----------
MAPS.saltmarrow={name:'Saltmarrow',theme:'out',music:'town',outdoor:1,weather:'snow',world:{x:84,y:58},town:1,heal:{map:'repair_s',x:6,y:4},grid:C3G.saltmarrow.grid,
 warps:[WP3('saltmarrow','gym','gym5',6,15),WP3('saltmarrow','repair','repair_s',6,4),WP3('saltmarrow','house1','house_s1',4,4),WP3('saltmarrow','house2','house_s2',5,4),
  WP3('saltmarrow','exitE0','route5',1,6),WP3('saltmarrow','exitE1','route5',1,7),WP3('saltmarrow','exitW0','route6',30,10),WP3('saltmarrow','exitW1','route6',30,11)],
 signs:{[C3('saltmarrow','sign').join(',')]:'SALTMARROW — Built in the shadow of the Ark. Warden Maren keeps the Tide Prime in its hull.'},
 triggers:[{x:20,y:10,run:saltKael},{x:20,y:11,run:saltKael}],
 npcs:[{id:'sm1',...at3('saltmarrow','npc1'),dir:'down',look:'sailor',text:'The Ark came ashore before the town did. We just built around it. Maren says it still remembers how to float.'},
  {id:'sm2',...at3('saltmarrow','npc2'),dir:'left',look:'woman',text:'The Drowned Reach west of here only shows its paths at low tide. Watch the water, not the clock.'},
  {id:'sm3',...at3('saltmarrow','npc3'),dir:'up',look:'kid',wander:1,text:'Choir boats go out to the drowned Cathedral every night. Mum says don\'t look at the lights.'},
  {id:'smDock',...at3('saltmarrow','dock'),dir:'up',look:'sailor',cond:()=>!G.bag.skiff,text:'Only a Maker skiff can cross the rough water out past the Reach. Maren keeps one in the Ark.'}]};
async function saltKael(){if(flag('saltKael'))return;setFlag('saltKael');G.busy=true;const k=spawnNear({id:'kaelS',look:'kael'},2);
 if(flag('kaelChoir')){await say('Two masked figures hurry past toward the docks.');await say('...Deacon Kael wants the Cathedral sealed before the Cantor\'s sermon. Move.',{speaker:'Choir Grunt'});await say('Deacon Kael. They really made him a Deacon.');}
 else if((G.kael||0)>=2){G.npcs.push(k);await say(N()+'! Over here. I said I\'d meet you on the coast, didn\'t I?',{speaker:'Kael'});
   await say('The Choir is holed up in a drowned Maker cathedral out past the Reach. I\'m not letting you walk in there alone.',{speaker:'Kael'});
   await say('Get your Primes from Maren and the Gale Warden. When you sail for the Cathedral, I\'ll be on the island. Deal?',{speaker:'Kael'});setFlag('kaelAlly');
   await walkNPC(k,OPP[k.dir],3);G.npcs.splice(G.npcs.indexOf(k),1);}
 else{await say('On the noticeboard by the gate, a scrawled note: "LOST: one battered bot frame, red tag, last seen on the Drowned Reach. Reward. - K"');setQ('kaelbot','active');Snd.sfx('ok');await say('New quest: KAEL\'S OLD FRAME.');}
 if(!qstate('coast'))setQ('coast','active');G.busy=false;}
MAPS.repair_s=repairMap('Saltmarrow Repair Station',{map:'saltmarrow',x:below3('saltmarrow','repair')[0],y:below3('saltmarrow','repair')[1]},['patch2','debug','spike2','rebootcell','coolfin','platekit','nanites']);
MAPS.house_s1=room('Saltmarrow',['XXXXXXXXXX','X&&x*x99xX','XxxxxxxxxX','XtxxxxxhxX','XxxxxxxxxX','XXXXeXXXXX'],{map:'saltmarrow',x:below3('saltmarrow','house1')[0],y:below3('saltmarrow','house1')[1]},
 [{id:'hs1',x:3,y:2,dir:'down',look:'old',text:'My grandfather swore the Ark sang at night when he was a boy. It stopped the year the Cantor vanished from the archives.'}]);
MAPS.house_s2=room('Saltmarrow',['XXXXXXXXXXX','XMxx9xxx&vX','XxxxxxxxxxX','XhxxxtxxxxX','XxxxxxxxxxX','XXXXXeXXXXX'],{map:'saltmarrow',x:below3('saltmarrow','house2')[0],y:below3('saltmarrow','house2')[1]},
 [{id:'hs2',x:6,y:2,dir:'left',look:'woman',text:'My son joined the Choir last winter. He writes that they\'re "freeing the bots". He never says from what.'}],[{type:'item',id:'hs2i',x:8,y:3,item:'shard_Tide'}]);

// ---------- Tide hall (Warden Maren) ----------
MAPS.gym5={name:'Ark of Saltmarrow',theme:'gym2',music:'gym',tide:300,grid:C3G.gym5.grid,
 warps:[{x:6,y:16,to:'saltmarrow',tx:below3('saltmarrow','gym')[0],ty:below3('saltmarrow','gym')[1],dir:'down'}],
 npcs:[{id:'g5guide',...at3('gym5','guide'),dir:'left',look:'sailor',text:'The Ark floods on a timer. Watch the TIDE gauge, wait on the dry spots, and dash when the water drains.'},
  {id:'g5t1',...at3('gym5','t1'),dir:'down',look:'sailor',range:3,trainer:{name:'Bosun Tam',title:'Ark Crew',team:[['brinejaw',29],['dripcell',29]],money:1500,pre:'You made it through the bilge? Then you can make it through me!',post:'Soaked.'}},
  {id:'maren',...at3('gym5','maren'),dir:'down',look:'maren',script:marenTalk}]};
async function marenTalk(){if(flag('badge5')){await say('The tide always comes back. So will you, I think.',{speaker:'Maren'});return;}G.busy=true;
 await say('Four Primes, carried all the way to the edge of the sea. I\'m Maren, Warden of the Ark.',{speaker:'Maren'});
 await say('The Choir sends a boat for my Prime every week. Every week I send it back empty. Show me you\'re not just another boat.',{speaker:'Maren'});
 const r=await runBattle({trainer:{name:'Maren',title:'Warden',look:'maren',warden:1,team:[['dripcell',30],['brinejaw',31],['stormkeel',32]],money:3200,items:1}});
 if(r==='win'){setFlag('badge5');addItem('prime5',1);addItem('shard_Tide',1);addItem('skiff',1);Snd.jingle('victory',curMap().music);
  await say('Like a wave breaking on the hull. Take it.',{speaker:'Maren'});await say(N()+' received the TIDE PRIME, a Tide Shard and the ICEBREAKER SKIFF!');
  await say('The skiff folds into your pack. Face open water, even the rough stuff, and press A to launch.',{speaker:'Maren'});
  const c=await ask('Maren asks: "The Choir says the Primes should be destroyed. Would you sink yours, if it freed every bot?"',['Maybe. If it\'s true.','No. They keep the Heartforge alive.']);G.rep=G.rep||{w:0,c:0};
  if(c===0){G.rep.c++;await say('Then go ask the Cantor yourself. Out past the Reach.',{speaker:'Maren'});}else{G.rep.w++;await say('Good. Keep it close.',{speaker:'Maren'});}
  await thawRegions(['saltmarrow','route5'],'The Tide Prime pulls at the sea. The ice in Saltmarrow harbour cracks and floats away...');
  await say('Pell-Ashe holds the Gale Prime in Galecrest, north of the Reach. Cross the flats at low tide.',{speaker:'Maren'});}
 G.busy=false;}

// ---------- Drowned Reach ----------
MAPS.route6={name:'Drowned Reach',theme:'out',music:'route',outdoor:1,weather:'blizzard',tide:900,world:{x:52,y:62},grid:C3G.route6.grid,
 enc:{tiles:'qw',count:7,list:[['brinejaw',27,30,50]],by:{q:[['frostling',27,30,40],['brinejaw',27,29,35],['cinderwisp',28,30,25]],w:[['squallkite',27,30,50],['gloomlamp',28,30,25],['dripcell',27,29,25]]}},
 alpha:{id:'squallkite',lv:33,at:C3('route6','alpha')},
 warps:[WP3('route6','exitE0','saltmarrow',1,14),WP3('route6','exitE1','saltmarrow',1,15),WP3('route6','exitN0','galecrest',10,22),WP3('route6','exitN1','galecrest',11,22),
  WP3('route6','cathedral','cathedral',10,18,'up',{req:'badge6',locked:'A wall of Choir static seals the doors. Something stronger than you, like the Gale Prime\'s wind, could blow it apart.'}),WP3('route6','exitS0','route7',10,1),WP3('route6','exitS1','route7',11,1)],
 triggers:[{...at3('route6','southT0'),run:causewayGate},{...at3('route6','southT1'),run:causewayGate}],
 objs:[{type:'item',id:'w1',...at3('route6','wreck1'),item:'rshard_Tide'},{type:'item',id:'w2',...at3('route6','wreck2'),item:'nanites'},
  {type:'lostbot',...at3('route6','wreck3'),cond:()=>qstate('kaelbot')==='active',run:async()=>{setQ('kaelbot','found');Snd.chirp(G.rival||'flicker');await say('Half-buried in the mud: a battered frame with a red tag. KAEL. Its core is cold, but it\'s intact.');await say('Quest updated: find Kael.');}},
  {type:'log',log:'log6',...at3('route6','log'),run:readLog}],
 npcs:[{id:'r6t1',...at3('route6','t1'),dir:'up',look:'sailor',range:4,trainer:{name:'Hollis',title:'Flats Runner',team:[['brinejaw',29],['squallkite',29],['dripcell',30]],money:1450,pre:'Low tide\'s my racetrack. Out of my lane!',post:'Tide\'s turning. So did that fight.'}},
  {id:'r6t2',...at3('route6','t2'),dir:'left',look:'grunt',range:4,trainer:{name:'Choir Grunt',title:'Hollow',team:[['cinderwisp',30],['gloomlamp',30]],money:1400,pre:'The Cantor speaks tonight. You\'re not invited.',post:'You\'ll hear it anyway.'}},
  {id:'r6n',...at3('route6','npc1'),dir:'down',look:'old',text:'The wrecks out on the flats are full of Maker cargo. Only at low tide, mind. The sea takes everything back.'}]};
async function causewayGate(){if(flag('ch3done'))return;G.busy=true;await say('The old causeway south is half underwater and buzzing with Choir static. It leads toward Mt. Cinder.');await stepPlayer('up');G.busy=false;}

// ---------- Galecrest ----------
MAPS.galecrest={name:'Galecrest',theme:'out',music:'town',outdoor:1,weather:'snow',world:{x:56,y:38},town:1,heal:{map:'repair_g',x:6,y:4},grid:C3G.galecrest.grid,
 warps:[WP3('galecrest','gym','gym6',7,15),WP3('galecrest','repair','repair_g',6,4),WP3('galecrest','house1','house_g1',4,4),WP3('galecrest','exitS0','route6',14,1),WP3('galecrest','exitS1','route6',15,1)],
 signs:{[C3('galecrest','sign').join(',')]:'GALECREST — Hold the rails. Warden Pell-Ashe flies above the chasm.'},
 npcs:[{id:'gc1',...at3('galecrest','npc1'),dir:'left',look:'lineman',text:'The rope bridges have held for two hundred winters. The gusts are newer. Mind them.'},
  {id:'gc2',...at3('galecrest','npc2'),dir:'down',look:'kid',script:galeKid},
  {id:'gc3',...at3('galecrest','npc3'),dir:'up',look:'woman',text:'Pell-Ashe hasn\'t lost a match since the cables went up. He says the wind tells him your moves.'}]};
async function galeKid(){if(qstate('kaelbot')==='found'){G.busy=true;await say('A red-haired guy came through asking about a lost frame! He went up to the cliffs to sulk.',{speaker:'Kid'});
   const k=spawnNear({id:'kaelG',look:'kael'},1);G.npcs.push(k);await say('...You found it. You actually went out on the flats for my junk frame.',{speaker:'Kael'});
   await say('That was my first bot. Before the capsule, before any of this. ...Thanks. I mean it.',{speaker:'Kael'});setQ('kaelbot','done');G.kael=(G.kael||0)+2;setFlag('kaelAlly');addItem('rebootcell',2);Snd.sfx('item');
   await say('Kael gives you 2 Reboot Cells. "I\'ll see you at the Cathedral. Don\'t argue."');await walkNPC(k,OPP[k.dir],3);G.npcs.splice(G.npcs.indexOf(k),1);G.busy=false;return;}
 await say('The wind up here can carry a whole bot! I saw a Squallkite sleep in the air once.',{speaker:'Kid'});}
MAPS.repair_g=repairMap('Galecrest Repair Station',{map:'galecrest',x:below3('galecrest','repair')[0],y:below3('galecrest','repair')[1]},['patch2','debug','spike2','rebootcell','overclock','nanites']);
MAPS.house_g1=room('Galecrest',['XXXXXXXXXX','X@xx9xxhvX','XxxxxxxxxX','XxtxxxxxxX','XxxxxxxxxX','XXXXeXXXXX'],{map:'galecrest',x:below3('galecrest','house1')[0],y:below3('galecrest','house1')[1]},
 [{id:'hg1',x:5,y:2,dir:'left',look:'tinker',text:'From up here you can see the Cathedral lights at night. Purple. Like the Choir\'s masks. Like the Cantor\'s eyes, they say.'}]);
MAPS.gym6={name:'Galecrest Aerie',theme:'gym2',music:'gym',grid:C3G.gym6.grid,
 warps:[{x:7,y:16,to:'galecrest',tx:below3('galecrest','gym')[0],ty:below3('galecrest','gym')[1],dir:'down'}],
 npcs:[{id:'g6guide',...at3('gym6','guide'),dir:'up',look:'lineman',text:'Every vent row blows you to its end. Pick where you jump in, and where the wind will drop you. Dead ends are real!'},
  {id:'g6t1',...at3('gym6','t1'),dir:'down',look:'scout',range:3,trainer:{name:'Skye',title:'Cable Runner',team:[['squallkite',33],['boltbun',33]],money:1600,pre:'You rode the gusts all the way up? Show-off!',post:'Blown away.'}},
  {id:'pellashe',...at3('gym6','pell'),dir:'down',look:'pellashe',script:pellTalk}]};
async function pellTalk(){if(flag('badge6')){await say('The wind carries news. All of it is about you lately.',{speaker:'Pell-Ashe'});return;}G.busy=true;
 await say('Ah. The one the capsule chose. I am Pell-Ashe. The wind told me you were coming three days ago.',{speaker:'Pell-Ashe'});
 await say('It also told me the Cantor is waiting for you. I\'d like to know if you\'re ready for him.',{speaker:'Pell-Ashe'});
 const r=await runBattle({trainer:{name:'Pell-Ashe',title:'Warden',look:'pellashe',warden:1,link:1,team:[['squallkite',33],['skyrivet',34],['tempestwing',35],['thundrone',35]],money:3500,items:1}});
 if(r==='win'){setFlag('badge6');addItem('prime6',1);addItem('shard_Gale',1);Snd.jingle('victory',curMap().music);await say('A clean wind. Take it.',{speaker:'Pell-Ashe'});await say(N()+' received the GALE PRIME and a Gale Shard!');
  const c=await ask('Pell-Ashe asks: "When the Cantor offers you the truth, will you listen?"',['I\'ll listen.','I\'ve heard enough from the Choir.']);G.rep=G.rep||{w:0,c:0};
  if(c===0){G.rep.c++;await say('Good. Listening is not agreeing.',{speaker:'Pell-Ashe'});}else{G.rep.w++;await say('Then listen to your bots instead.',{speaker:'Pell-Ashe'});}
  await thawRegions(['galecrest','route6'],'The Gale Prime tugs at the clouds. A warm wind rolls down the cliffs and over the Reach...');
  setQ('coast','cathedral');await say('The Gale Prime can blow apart the Choir\'s seal on the drowned Cathedral. Take your skiff out past the Reach.',{speaker:'Pell-Ashe'});
  await say(N()+', it\'s Vesna. The Choir is gathering in the drowned Cathedral. Whatever he tells you in there... I\'m sorry I didn\'t tell you first.',{speaker:'Vesna (Navi-band)'});}
 G.busy=false;}

// ---------- The Choir Cathedral ----------
MAPS.cathedral={name:'Drowned Cathedral',theme:'nave',music:'cave',grid:C3G.cathedral.grid,
 warps:[{x:10,y:19,to:'route6',tx:21,ty:19,dir:'down'}],
 npcs:[{id:'cg1',...at3('cathedral','g1'),dir:'right',look:'grunt',range:4,trainer:{name:'Choir Grunt',title:'Hollow',team:[['cinderwisp',33],['gloomlamp',33],['rotcap',34]],money:1600,pre:'The sermon has begun. Kneel or leave.',post:'...The song goes on without me.'}},
  {id:'cg2',...at3('cathedral','g2'),dir:'left',look:'grunt',range:4,trainer:{name:'Choir Grunt',title:'Hollow',team:[['nightglider',34],['phantide',34]],money:1650,pre:'Red gates, blue gates. Only the faithful know the order!',post:'Fine. Step on the plate by the east wall.'}},
  {id:'cg3',...at3('cathedral','g3'),dir:'down',look:'grunt',range:3,trainer:{name:'Choir Grunt',title:'Hollow',team:[['wispire',35],['frostling',35]],money:1700,pre:'The Cantor will not be interrupted!',post:'He knew you\'d come anyway.'}},
  {id:'cdeacon',...at3('cathedral','deacon'),dir:'down',look:'deacon',range:3,cond:()=>!flag('cDeacon'),script:cathedralDeacon},
  {id:'ckael',...at3('cathedral','kaelC'),dir:'up',look:'kael',cond:()=>flag('kaelAlly')&&!flag('kaelJoined'),script:async()=>{G.busy=true;await say('Told you I\'d be here. Their Deacon is right up ahead. When we reach the Cantor, my bot fights next to yours.',{speaker:'Kael'});setFlag('kaelJoined');await say('KAEL joined you! His bot will fight beside yours against the Cantor.');G.busy=false;}},
  {id:'cantor',...at3('cathedral','cantor'),dir:'down',look:'cantor',cond:()=>!flag('ch3done'),script:cantorScene}]};
async function cathedralDeacon(n){G.busy=true;
 if(flag('kaelChoir')){await say('...Of course it\'s you.',{speaker:'Deacon Kael'});await say('The Cantor showed me the logs. The Accord, the leash, all of it. Vesna lied to both of us.',{speaker:'Deacon Kael'});
   await say('I\'m not letting you hand all eight Primes to her. Not without a fight.',{speaker:'Deacon Kael'});
   const r=await runBattle({trainer:{name:'Kael',title:'Deacon',look:'kael',link:1,team:[[rivalForm(),36],['nightglider',34],['cogwyrm',35],['rotcap',35]],money:3000}});
   if(r==='win'){await say('...Still not enough. Why is it never enough?',{speaker:'Kael'});const c=await ask('What do you tell Kael?',['You don\'t have to prove anything to them.','You chose this.']);
     if(c===0){G.kael=1;clearFlag('kaelChoir');await say('...I\'ll think about it. Go. He\'s waiting for you.',{speaker:'Kael'});}else{await say('Yeah. I did.',{speaker:'Kael'});}setFlag('cDeacon');n.hidden=true;}}
 else{await say('The little spark, all grown up. Mirelle sends her regards. I\'m the one who guards the Cantor\'s door now.',{speaker:'Deacon Ostrel'});
   const r=await runBattle({trainer:{name:'Ostrel',title:'Deacon',look:'deacon',warden:1,link:1,team:[['wispire',35],['ampjelly',35],['cinderwisp',36]],money:2800}});
   if(r==='win'){await say('Go on, then. Hear the truth from the source.',{speaker:'Deacon Ostrel'});setFlag('cDeacon');n.hidden=true;}}
 G.busy=false;}
function clearFlag(f){if(G.flags)delete G.flags[f];}
async function cantorScene(){G.busy=true;
 await say('A tall figure in violet stands beneath the drowned Maker monitors. He lowers his mask.',{speaker:''});
 await say('Hello, '+N()+'. I\'ve been watching you since the night the capsule fell. I am the Cantor. My name, before all this, was Ilian Orla.',{speaker:'The Cantor'});
 await say('Yes. Orla. Vesna is my sister. We kept the Maker archive together, until I read the Accord logs and she asked me to forget them.',{speaker:'Ilian'});
 if(flag('archiveVesna'))await say('You gave her the archive. Then she\'s read it too, and she still hasn\'t told you. Ask yourself why.',{speaker:'Ilian'});
 else if(flag('archiveChoir')){await say('You gave us the archive. So you deserve this: one log the Choir never shows its own members.',{speaker:'Ilian'});await say(LOGS.log7);G.logs=G.logs||{};G.logs.log7=1;}
 else if(flag('archiveSelf'))await say('And you kept the archive for yourself. Clever. Every Deacon on the coast is looking for you. So is my sister.',{speaker:'Ilian'});
 await say('If the Heartforge falls below a fifth of its strength, the war-titan under Mt. Cinder wakes. The Accord was never about safety. It was a leash for Glacivore, and every bot wears the same collar.',{speaker:'Ilian'});
 await say('I meant to cut the leash and kill the titan in its sleep. For that I need the Primes. Yours, specifically.',{speaker:'Ilian'});
 const ally=flag('kaelJoined')?makeBot(rivalForm(),38):null;if(ally){ally.nick='Kael\'s '+BOTS[ally.id].name;await say('Kael steps up beside you. "Two against one, Orla. Your move."');}
 const r=await runBattle({ally,trainer:{name:'Cantor',title:'The',look:'cantor',warden:1,link:1,team:[['wispire',37],['nightglider',38],['phantide',38],['rimeghost',39],['pyrewraith',40]],money:5000,items:2}});
 if(r!=='win'){G.busy=false;return;}
 await say('...Well sung.',{speaker:'Ilian'});
 await say('But you misunderstand. I never needed to beat you. I only needed you here.',{speaker:'Ilian'});
 Snd.sfx('glitch');G.shake=40;await say('Far away, two Warden halls go dark. Brasston. Voltmere. The Choir has taken the Stone and Volt Primes while you were busy.');
 await say('The Heartforge is at twenty percent. The titan is stirring. Now we race, little spark: the Choir to the summit to end it, you and my sister to save it.',{speaker:'Ilian'});
 await say('Meet me on Mt. Cinder. Bring all eight. One of us will be right.',{speaker:'Ilian'});
 setFlag('ch3done');setQ('coast','done');Snd.music('title',true);
 await say('Every bot in the Cathedral flickers. Your own lead bot\'s visor glitches red for half a second... then steadies.');
 if(flag('kaelJoined'))await say('That was the Accord. Again. We\'re going up that mountain, '+N()+'. Together.',{speaker:'Kael'});
 await say(N()+'... I should have told you myself. Ilian is right about the titan. He\'s wrong about what to do. The causeway south of the Reach leads to Mt. Cinder. I\'ll meet you there.',{speaker:'Vesna (Navi-band)'});
 await pushUI({t:0,update(){this.t++;if(this.t>60&&(press('a')||press('start')))popUI(this);},draw(){ctx.fillStyle='#06080e';ctx.fillRect(0,0,W,H);ctx.globalAlpha=Math.min(1,this.t/40);
   wtxt('CHAPTER 3 COMPLETE',W/2,66,'#80d0ff',40,'center');wtxt('The Drowned Coast',W/2,100,'#a0c8ff',26,'center');
   wtxt('Time: '+fmtTime(G.time)+'    Linked bots: '+Object.keys(G.caught).length+'    Prime Shards: '+[1,2,3,4,5,6,7,8].filter(i=>G.bag['prime'+i]).length+'/8',W/2,148,'#e0d0c0',20,'center');
   G.party.slice(0,6).forEach((b,i)=>ctx.drawImage(bspr(b),W/2-150+i*50,162,48,48));wtxt('Next: Chapter 4, Heart of Cinder',W/2,250,'#ff9a5a',22,'center');if(this.t>60)wtxt('Press A',W/2,290,'#7a8aa8',18,'center');ctx.globalAlpha=1;}});
 Snd.music(curMap().music);await say('CHAPTER 4: HEART OF CINDER. The causeway south of the Drowned Reach is open.');G.busy=false;}
