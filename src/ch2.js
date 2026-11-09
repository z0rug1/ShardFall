// ===================== CHAPTER 2: THE RUSTWORKS =====================
Object.assign(ITEMS,{prime3:{n:'Iron Prime',d:'Prime Shard from Warden Hask. Cold, heavy, perfectly balanced.',cat:'key'},prime4:{n:'Flame Prime',d:'Prime Shard from Warden Sora. Warm to the touch, even here.',cat:'key'},
 archive:{n:'Maker Archive Core',d:'A data core from the Rustworks. It holds the truth about the Heartforge.',cat:'key'}});
Object.assign(QUESTS,{archive:{n:'The Maker Archive',where:'Railbed Road / Rustworks',steps:{active:'Find the Maker archives inside the Rustworks factory east of Voltmere.',found:'You have the Archive Core. Decide what to do with it.',done:'The Archive\'s truth is out of your hands now.'}},
 logs:{n:'Maker Logs',where:'Chapter 2 area',steps:{active:'Old Maker log terminals are scattered along Railbed Road, the Rustworks, Ferrow and the Geyser Flats.',done:'You read every Maker log.'}}});
const HOUSE_V=[['XXXXXXXXX','X7x7xx9hX','XxxxxxxxX','X&xxxxxxX','XxxxtxxxX','XxxxxxxxX','XvxxxxxvX','XXXXeXXXX'],['XXXXXXXXX','X99x*xxhX','XxxxxxxxX','XxtxxxxxX','XxxxxxxxX','X&xxxxx&X','XxxxxxxvX','XXXXeXXXX'],['XXXXXXXXX','XhxMMx@vX','XxxxxxxxX','XxxxxtxxX','XxxxxxxxX','XxxxxxxxX','X9xxxxx&X','XXXXeXXXX']];
function makeHouse(name,ret,npcs,objs){const k=((npcs&&npcs[0]&&npcs[0].id)||name).split('').reduce((a,c)=>a+c.charCodeAt(0),0)%HOUSE_V.length;return{name,theme:'house',music:'town',grid:HOUSE_V[k],warps:[{x:4,y:7,to:ret.map,tx:ret.x,ty:ret.y,dir:'down'}],npcs:npcs||[],objs:objs||[]};}
const LOGS={
 log1:'MAKER LOG 117: "The Heartforge is complete. It will keep the titan asleep for a thousand years. Longer, if the Wardens keep the Primes apart."',
 log2:'MAKER LOG 203: "Secondary function enabled: the Accord. Every shardbot now obeys whoever holds the Primes. We told ourselves this was for safety."',
 log3:'MAKER LOG 288: "Some of the bots resist the Accord. They dream, if bots can dream. We are not sure we have the right to stop them."',
 log4:'MAKER LOG 301: "We are leaving. Let the Wardens decide what the Heartforge is for. If the Primes ever come together again... may the holder choose well."'};
async function readLog(o){G.logs=G.logs||{};Snd.sfx('switch');await say(LOGS[o.log]);
  if(!G.logs[o.log]){G.logs[o.log]=1;const n=Object.keys(G.logs).length;if(!qstate('logs'))setQ('logs','active');
    await say('Maker Logs read: '+n+'/4.');if(n>=4){setQ('logs','done');addItem('core_reactor',1);addItem('frag_Spirit',1);Snd.jingle('victory',curMap().music);await say('You pieced together the Makers\' story. Vesna sent a Reactor Core and a Spirit Prime Fragment as thanks.');}}}
function drawLogObj(o,sx,sy){R(ctx,sx+8,sy+4,16,24,'#3a4250');R(ctx,sx+10,sy+6,12,8,(G.logs&&G.logs[o.log])?'#4a6a7a':(TICK%40<20?'#60e0ff':'#40b0d0'));R(ctx,sx+10,sy+18,12,2,'#20262e');}

// ---------- Route 3 ----------
MAPS.route3={name:'Railbed Road',theme:'out',music:'route',outdoor:1,weather:'snow',world:{x:110,y:11},grid:['TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','TTTTTTTTTTUUUUUUUUUUTTTTTTTTTTTTTTTT','TT.jjjjjj.UUUUUUUUUU.......jjjjj..TT','TT.jjjjjj.UUUUUUUUUU.i.~~~.jjjjj..TT','TT.jjjjjj.WWWWDWWWWW...~~~.jjjjj..TT','TT............=...................TT','====================================','====================================','TT....................jjjjjjj.....TT','TT..........jjjjjj....jjjjjjj..TT.TT','TT..........jjjjjj....jjjjjjj..TTTTT','TTT...............................TT','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
 enc:{tile:'j',count:7,list:[['boltbun',16,18,18],['scrapmite',16,18,18],['frostling',16,18,26],['pipsprock',17,19,18],['cogwyrm',17,19,14]]},thawEnc:[['kilnfly',17,19,14],['dripcell',17,19,12]],
 alpha:{id:'cogwyrm',lv:21,at:[25,9]},iceLoot:{'21,3':'core_cooler'},
 warps:[{x:0,y:6,to:'voltmere',tx:22,ty:12},{x:0,y:7,to:'voltmere',tx:22,ty:13},{x:35,y:6,to:'ferrow',tx:1,ty:12},{x:35,y:7,to:'ferrow',tx:1,ty:13},{x:14,y:4,to:'rustworks',tx:12,ty:16}],
 objs:[{type:'pylon',id:'p3',x:30,y:11,thaws:['route3'],run:pylonRun},{type:'log',log:'log1',x:5,y:11,run:readLog},{type:'item',id:'r3a',x:33,y:2,item:'spike2',qty:2},{type:'item',id:'r3b',x:2,y:8,item:'patch2',qty:2}],
 npcs:[
  {id:'pell',x:20,y:9,dir:'left',look:'engineer',range:4,trainer:{name:'Pell',title:'Engineer',team:[['cogwyrm',18],['scrapmite',18],['boltbun',19]],money:700,pre:'The Rustworks is MY job site. Choir creeps moved in last week and now you? Battle!',post:'Fine, fine. Watch the belts in there. They don\'t stop.'}},
  {id:'rhea',x:30,y:4,dir:'down',look:'scout',range:3,trainer:{name:'Rhea',title:'Scout',team:[['frostling',19],['pipsprock',18]],money:650,pre:'Frostlings only showed up after the cold got worse. Let\'s see yours handle mine!',post:'Brr. You\'re tougher than the weather.'}},
  {id:'r3old',x:7,y:5,dir:'down',look:'old',text:'That factory up north is the Rustworks. The Makers built bots there. Folks say the archives are still down in the vaults.'},
 ],
 triggers:[{x:5,y:6,run:kaelFriend},{x:5,y:7,run:kaelFriend}]};
async function kaelFriend(){if(flag('kael3')||(G.kael||0)<2)return;setFlag('kael3');G.busy=true;
 const k={id:'kael_f',x:G.px+3,y:G.py,dir:'left',look:'kael'};G.npcs.push(k);await walkNPC(k,'left',2);
 await say(N()+'! Glad I caught you. I already scouted the Rustworks. Choir everywhere, and a Deacon guarding the archive vault.',{speaker:'Kael'});
 await say('You were the only one who didn\'t brush me off. So... here. Patched your bots up, and take this. I found two.',{speaker:'Kael'});
 await healAll();const t=BOTS[G.rival||'drizzlet'].types[0];addItem('rshard_'+t,1);Snd.sfx('item');await say(N()+' received a Refined '+t+' Shard! Your bots were fully repaired.');
 await say('I\'m heading to Kilnhaven to watch the Choir from there. Find out what that archive says. Then tell me. Deal?',{speaker:'Kael'});
 await walkNPC(k,'right',4);G.npcs.splice(G.npcs.indexOf(k),1);G.busy=false;}

// ---------- Rustworks ----------
MAPS.rustworks={name:'Rustworks',theme:'factory',music:'gym',leverFlip:1,grid:['XXXXXXXXXXXXXXXXXXXXXXXXXX','XxxxxxxxMxxxxxxxxMxxxxxxxX','XxxxxxxxxxxxxxxxxxxxxxxxxX','XxxxxxxxxxxxxxxxxxxxxxxxxX','XXXXXXXXXXXXXXXXXXXXXXXXxX','Xx4444444444444444444444xX','XxxxxxxxxxXXXXXXXXXXXXXXXX','XxXXXXXXXXXXXXXXXXXXXXXXXX','Xx6666666666666666666666xX','XXXXXXXXXXXXXXXXXXXLxxxxxX','XXXXXXXXXXXXXXXXXXXXxxxxxX','Xx6666666666666666666666xX','XxXXXXXXXXXXXXXXXXXXXXXXXX','XxxxxMxxxxxxxxxxxxxxxxxxxX','XxxLxxxxxxxxxxxxxxxxxxxxxX','XxxxxxxxxxxxxxxxxxxxMxxxxX','XxxxxxxxxxxxxxxxxxxxxxxxxX','XXXXXXXXXXXXeXXXXXXXXXXXXX'],
 warps:[{x:12,y:17,to:'route3',tx:14,ty:5,dir:'down'}],
 tileScripts:{'3,14':toggleLever,'19,9':toggleLever},
 objs:[{type:'log',log:'log2',x:22,y:14,run:readLog},{type:'archive',x:20,y:2,cond:()=>flag('ostrel')&&!G.bag.archive&&!flag('archiveDone'),run:takeArchive},{type:'item',id:'rwa',x:2,y:6,item:'arm_cannon'},{type:'item',id:'rwb',x:23,y:16,item:'scrap',qty:3}],
 npcs:[
  {id:'rwguide',x:6,y:15,dir:'down',look:'engineer',text:'The conveyor lines only run one way at a time. Those levers flip every belt in the building. Ride them in the right order!'},
  {id:'rg1',x:8,y:6,dir:'left',look:'grunt',range:7,trainer:{name:'Choir Grunt',title:'Hollow',team:[['frostling',19],['scrapmite',19]],money:600,pre:'The Deacon said nobody gets near the archive. Especially not a Warden pet!',post:'The archive will open your eyes. Not that it matters now.'}},
  {id:'rg2',x:21,y:10,dir:'right',look:'grunt',range:3,trainer:{name:'Choir Grunt',title:'Hollow',team:[['cogwyrm',20],['gloomlamp',19]],money:620,pre:'You rode the belts all the way up here? Impressive. Now get ground down!',post:'Ugh. Go on then. The Deacon will deal with you.'}},
  {id:'kael_rw',x:4,y:2,dir:'right',look:'kael',range:4,cond:()=>(G.kael||0)<2&&!flag('kaelRW'),script:kaelRust},
  {id:'ostrel',x:12,y:2,dir:'down',look:'deacon',range:2,cond:()=>!flag('ostrel'),script:ostrelFight},
 ]};
function rivalForm(){const fr=BOTS[G.rival||'drizzlet'];return Object.values(fr.branches||{})[0]||G.rival;}
async function kaelRust(n){G.busy=true;const bitter=(G.kael||0)<0;
 if(bitter){await say('Took you long enough. You\'re still running errands for Vesna, huh?',{speaker:'Kael'});
   await say('The Choir showed me the truth. The Heartforge doesn\'t protect bots. It CONTROLS them. And Vesna knew.',{speaker:'Kael'});
   await say('I\'m with the Choir now. Let\'s see if your little Warden team can handle a real link!',{speaker:'Kael'});
   const r=await runBattle({trainer:{name:'Kael',title:'Choir',look:'kael',link:1,team:[[rivalForm(),23],['gloomlamp',21],['skyrivet',21]],money:1200}});
   if(r==='win')await say('...This isn\'t over. Read the archive. Then tell me I\'m wrong.',{speaker:'Kael'});setFlag('kaelChoir');}
 else{await say(N()+'? Figures. I came to find out what Vesna\'s hiding. You came to... what, help her hide it?',{speaker:'Kael'});
   await say('Doesn\'t matter. First one to the archive wins. Starting with you!',{speaker:'Kael'});
   const r=await runBattle({trainer:{name:'Kael',title:'Rival',look:'kael',team:[[rivalForm(),22],['skyrivet',20],['jabbit',20]],money:1100}});
   if(r==='win'){await say('...Fine. You win. Again. Read the stupid archive, then.',{speaker:'Kael'});const c=await ask('What do you say?',['We\'ll read it together.','Go home, Kael.']);
     if(c===0){G.kael=(G.kael||0)+1;await say('...Together? Huh. Okay. I\'ll wait outside.',{speaker:'Kael'});}else{G.kael=(G.kael||0)-1;await say('Whatever.',{speaker:'Kael'});}}}
 setFlag('kaelRW');n.hidden=true;G.busy=false;}
async function ostrelFight(n){G.busy=true;
 await say('So you are the one who silenced Mirelle\'s little verse in the relay. I am Ostrel, Deacon of the Second Verse.',{speaker:'Deacon Ostrel'});
 await say('Behind me lies what the Makers wrote about the Heartforge. The Cantor wants it heard. Vesna wants it buried. Which side are you?',{speaker:'Deacon Ostrel'});
 const r=await runBattle({trainer:{name:'Ostrel',title:'Deacon',look:'deacon',warden:1,link:1,team:[['rimeshade',23],['railwyrm',22],['rotcap',22]],money:1500,items:1}});
 if(r==='win'){await say('...Take it, then. Read it. The truth works on everyone eventually.',{speaker:'Deacon Ostrel'});setFlag('ostrel');n.hidden=true;await say('Deacon Ostrel fled. A sealed Maker vault hisses open at the far end of the room.');}
 G.busy=false;}
async function takeArchive(){Snd.sfx('item');addItem('archive',1);setQ('archive','found');
 await say('The MAKER ARCHIVE CORE. Text scrolls across its surface as you lift it...');
 await say('"The Heartforge has two purposes. One: hold the war-titan Glacivore in permanent sleep."');
 await say('"Two: broadcast the Accord, a signal that makes every shardbot obey whoever holds the gathered Primes."');
 await say('The Choir wasn\'t lying. And neither, exactly, was Vesna. Both halves are true.');
 const c=await ask('What do you do with the Archive Core?',['Send it to Vesna','Leak it to the Choir defector','Keep it secret']);G.rep=G.rep||{w:0,c:0};
 if(c===0){G.rep.w++;setFlag('archiveVesna');await say('You upload the archive to Vesna\'s lab. Her reply comes fast: "...Thank you. I should have told you myself. I\'m sorry."');}
 else if(c===1){G.rep.c++;setFlag('archiveChoir');await say('You send a copy to the ex-Choir contact. By nightfall, the whole Choir knows the Accord is real.');}
 else{setFlag('archiveSelf');await say('You keep the core to yourself. For now, you\'re the only one who knows the whole truth.');}
 setQ('archive','done');setFlag('archiveDone');await say('The Iron Warden, Hask, is in Ferrow to the east. The Primes are clearly more than trophies.');}
async function toggleLever(){const m=curMap();G.beltFlip=G.beltFlip||{};G.beltFlip[G.map]=!G.beltFlip[G.map];Snd.sfx('switch');await say('CLUNK. Every conveyor belt in the building reverses direction!');}

// ---------- Ferrow ----------
MAPS.ferrow={name:'Ferrow',theme:'out',music:'town',outdoor:1,weather:'night',world:{x:146,y:5},town:1,heal:{map:'repair_f',x:6,y:4},grid:['TTTTTTTTTTTTTTTTTTTTTTTT','TT....................TT','TT.YYYYYYY....RRRRR...TT','TT.YYYYYYY....RRRRR...TT','TT.WWWDWWW....WWDWW...TT','TT....===s==..........TT','TT.........=......FFF.TT','TT.........=====......TT','TT.RRRR....=.QQQQ.....TT','TT.RRRR.l..=.QQQQ.....TT','TT.WDWW....=.WDWW.MM..TT','TT.........=......MM..TT','=============.........TT','=============...l..MM.TT','TT.........==......MM.TT','TT........====........TT','TT........====........TT','TTTTTTTTTT====TTTTTTTTTT'],
 warps:[{x:0,y:12,to:'route3',tx:34,ty:6},{x:0,y:13,to:'route3',tx:34,ty:7},{x:6,y:4,to:'gym3',tx:6,ty:13},{x:16,y:4,to:'house_f1',tx:4,ty:6},{x:14,y:10,to:'repair_f',tx:6,ty:4},{x:4,y:10,to:'house_f2',tx:4,ty:6},
  {x:10,y:17,to:'route4',tx:8,ty:1},{x:11,y:17,to:'route4',tx:9,ty:1},{x:12,y:17,to:'route4',tx:10,ty:1},{x:13,y:17,to:'route4',tx:11,ty:1}],
 signs:{'9,5':'FERROW WARDEN HALL — Warden Hask. "Forged, not born."'},
 objs:[{type:'log',log:'log3',x:20,y:1,run:readLog}],
 npcs:[
  {id:'fe1',x:8,y:12,dir:'down',look:'mech',text:'Ferrow builds half the bot parts in Calderra. Got Scrap? Any Forge can turn it into body parts now.'},
  {id:'fe2',x:17,y:7,dir:'left',look:'woman',text:'The furnaces are running cold. Hask keeps them going with the Iron Prime\'s heat alone.'},
  {id:'fe3',x:15,y:15,dir:'up',look:'kid',wander:1,text:'Warden Hask\'s gym has conveyor belts! You push crates onto them and WHOOSH.'},
  {id:'fguard',x:12,y:15,dir:'up',look:'guard',cond:()=>!flag('badge3'),text:'The Geyser Flats start past the south gate. Hask wants challengers to prove themselves before heading south.'},
 ],
 triggers:[{x:10,y:16,run:ferrowGate},{x:11,y:16,run:ferrowGate},{x:12,y:16,run:ferrowGate},{x:13,y:16,run:ferrowGate}]};
async function ferrowGate(){if(flag('badge3'))return;G.busy=true;await say('The south road leads into the geyser fields. Beat Warden Hask first. Those vents will boil an untested bot.',{speaker:'Guard'});await stepPlayer('up');G.busy=false;}
MAPS.house_f1=makeHouse('Ferrow',{map:'ferrow',x:16,y:5},[{id:'hf1',x:5,y:3,dir:'left',look:'old',text:'My grandmother said the Makers sang to their bots. I always thought that was a fairy tale.'}]);
MAPS.house_f2=makeHouse('Ferrow',{map:'ferrow',x:4,y:11},[{id:'hf2',x:2,y:4,dir:'right',look:'mech',text:'Heat\'s the real enemy in a long fight. Vent before you overheat, or carry a Frost bot to cool off.'}],[{type:'item',id:'hf2i',x:6,y:5,item:'leg_spikes'}]);
MAPS.repair_f=repairMap('Ferrow Repair Station',{map:'ferrow',x:14,y:11},['patch','patch2','debug','spike','spike2','rebootcell','platekit','coolfin']);
MAPS.gym3={name:'Ferrow Warden Hall',theme:'factory',music:'gym',grid:['XXXXXXXXXXXXX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XXXXXgggXXXXX','XxxxxxxxxxxxX','Xxxx666666PxX','XxxxxxxxxxxxX','Xxxxx66666PxX','XMxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxMX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XXXXXXeXXXXXX'],gate:'gate3',crates:[[3,10],[6,11]],
 warps:[{x:6,y:14,to:'ferrow',tx:6,ty:5,dir:'down'}],
 npcs:[{id:'g3guide',x:10,y:12,dir:'left',look:'mech',text:'Push the crates onto the conveyor lines. The belts will carry them onto the plates. Leave and come back to reset.'},
  {id:'vos',x:10,y:2,dir:'left',look:'quarry',range:4,trainer:{name:'Vos',title:'Smelter',team:[['cogwyrm',21],['weldrake',22]],money:880,pre:'You loaded the line? Then you\'re ready for the furnace!',post:'Slagged...'}},
  {id:'hask',x:6,y:1,dir:'down',look:'brakka',script:haskTalk}]};
async function haskTalk(){if(flag('badge3')){await say('Forged, not born. Keep tempering that team.',{speaker:'Hask'});return;}G.busy=true;
 await say('I\'m Hask, Warden of Ferrow. I\'ve heard about the archive. Whatever the Makers meant the Primes for, my job is the same: test whoever comes for one.',{speaker:'Hask'});
 const r=await runBattle({trainer:{name:'Hask',title:'Warden',look:'brakka',warden:1,team:[['crushbug',23],['railwyrm',24],['ironpaw',25]],money:2400,items:1}});
 if(r==='win'){setFlag('badge3');addItem('prime3',1);addItem('shard_Iron',1);Snd.jingle('victory',curMap().music);await say('Tempered steel. You earned it.',{speaker:'Hask'});await say(N()+' received the IRON PRIME and an Iron Shard!');
   const c=await ask('Hask asks: "If you held all eight Primes and could control every bot in Calderra... would you?"',['No one should have that power.','Someone has to keep order.']);G.rep=G.rep||{w:0,c:0};
   if(c===0){G.rep.c++;await say('...An honest answer. Rare.',{speaker:'Hask'});}else{G.rep.w++;await say('Spoken like a Warden.',{speaker:'Hask'});}
   await thawRegions(['ferrow','route3'],'The Iron Prime rings like a bell. Heat floods back into Ferrow\'s furnaces...');
   await say('Sora is in Kilnhaven, south past the geyser fields. Time your steps between the vents.',{speaker:'Hask'});}
 G.busy=false;}

// ---------- Route 4 ----------
MAPS.route4={name:'Geyser Flats',theme:'out',music:'route',outdoor:1,weather:'blizzard',world:{x:148,y:23},grid:['TTTTTTTT====TTTTTTTT','TT.......==.......TT','TT.......==.......TT','TT.wwwww.==.......TT','TT.wwwww.==.......TT','TT.wwwww.==.wwwww.TT','TT.wwwww.==.wwwww.TT','TT.......==.wwwww.TT','TT.......==.wwwww.TT','TT.......==.......TT','TT.......==.......TT','TT.......==.......TT','TT.......==.......TT','TT#####VVVVVV#####TT','TT#####...==.#####TT','TT#####VVVVVV#####TT','TT#####...==.#####TT','TT#####VVVVVV#####TT','TT.......==.......TT','TT.~~~...==.......TT','TT.~~~...==.....i.TT','TT.......==.......TT','TT.wwwww.==.......TT','TT.wwwww.==.......TT','TT.wwwww.==.wwwww.TT','TT.wwwww.==.wwwww.TT','TT.wwwww.==.wwwww.TT','TT.......==.wwwww.TT','TT.......==.wwwww.TT','TT.......==.......TT','TT.......==....TTTTT','TT.......==....TTTTT','TT.......==.......TT','TTTTTTTT====TTTTTTTT'],ventReset:[9,12],
 enc:{tile:'w',count:8,list:[['kilnfly',20,23,22],['frostling',20,22,18],['cogwyrm',21,23,18],['gearpup',21,23,16],['pebblit',21,23,16]]},thawEnc:[['sporelet',21,23,12],['dripcell',21,23,12]],
 alpha:{id:'blastfan',lv:26,at:[14,26]},iceLoot:{'16,20':'arm_claws'},
 warps:[{x:8,y:0,to:'ferrow',tx:10,ty:16},{x:9,y:0,to:'ferrow',tx:11,ty:16},{x:10,y:0,to:'ferrow',tx:12,ty:16},{x:11,y:0,to:'ferrow',tx:13,ty:16},
  {x:8,y:33,to:'kilnhaven',tx:8,ty:1},{x:9,y:33,to:'kilnhaven',tx:9,ty:1},{x:10,y:33,to:'kilnhaven',tx:10,ty:1},{x:11,y:33,to:'kilnhaven',tx:11,ty:1}],
 objs:[{type:'pylon',id:'p4',x:15,y:10,thaws:['route4'],run:pylonRun},{type:'log',log:'log4',x:3,y:32,run:readLog},{type:'item',id:'r4a',x:16,y:1,item:'rebootcell'},{type:'item',id:'r4b',x:3,y:18,item:'shard_Frost'}],
 npcs:[
  {id:'dune',x:4,y:10,dir:'right',look:'hiker',range:4,trainer:{name:'Dune',title:'Hiker',team:[['pebblit',22],['magmaw',23]],money:920,pre:'The geysers fire in rhythm. Watch them a while before you run through!',post:'Boiled over...'}},
  {id:'mae',x:15,y:21,dir:'left',look:'scout',range:5,trainer:{name:'Mae',title:'Ranger',team:[['kilnfly',22],['frostling',22],['gearpup',23]],money:960,pre:'Fire and ice live side by side out here. Let\'s see if you can handle both!',post:'You read the field well.'}},
 ]};

// ---------- Kilnhaven ----------
MAPS.kilnhaven={name:'Kilnhaven',theme:'out',music:'town',outdoor:1,weather:'snow',world:{x:146,y:57},town:1,heal:{map:'repair_k',x:6,y:4},grid:['TTTTTTTT====TTTTTTTTTTTT','TTTTTTTT====TTTTTTTTTTTT','TT.......==...........TT','TT.RRRR..==..YYYYYYYY.TT','TT.RRRR..==..YYYYYYYY.TT','TT.WDWW..==s.WWWDWWWW.TT','TT.....l.==...........TT','TT.......========.....TT','TT.QQQQ..==...........TT','TT.QQQQ..==...........TT','TT.WDWW..==...........TT','TT...======...........TT','TT.......==.l.~~~~~...TT','TT.MMM........~~b~~...TT','TT.MMM........~~~~~...TT','TT....................TT','TT....................TT','TTTTTTTTTTTTTTTTTTTTTTTT'],
 warps:[{x:8,y:0,to:'route4',tx:8,ty:32},{x:9,y:0,to:'route4',tx:9,ty:32},{x:10,y:0,to:'route4',tx:10,ty:32},{x:11,y:0,to:'route4',tx:11,ty:32},
  {x:16,y:5,to:'gym4',tx:6,ty:13},{x:4,y:10,to:'repair_k',tx:6,ty:4},{x:4,y:5,to:'house_k1',tx:4,ty:6}],
 signs:{'11,5':'KILNHAVEN WARDEN HALL — Warden Sora. "Burn bright, burn steady."'},
 npcs:[
  {id:'kh1',x:13,y:15,dir:'up',look:'woman',text:'These hot springs never freeze. Kilnhaven sits right on Mt. Cinder\'s oldest vent.'},
  {id:'kh2',x:19,y:9,dir:'left',look:'old',text:'Can you feel it? The ground hums at night. Like something huge breathing below.'},
  {id:'kh3',x:7,y:15,dir:'right',look:'kid',wander:1,text:'Kilnflies keep our houses warm! They love sitting on chimneys.'},
 ]};
MAPS.repair_k=repairMap('Kilnhaven Repair Station',{map:'kilnhaven',x:4,y:11},['patch2','debug','spike2','rebootcell','overclock','nanites']);
MAPS.house_k1=makeHouse('Kilnhaven',{map:'kilnhaven',x:4,y:6},[{id:'hk1',x:5,y:2,dir:'down',look:'mech',text:'Sora\'s hall is full of steam vents. They fire in a pattern. Stand still, watch, then go.'}]);
MAPS.gym4={name:'Kilnhaven Warden Hall',theme:'kiln',music:'gym',grid:['XXXXXXXXXXXXX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XXXXXxxxXXXXX','XxxxxxxxxxxxX','XVVVVVVVVVVVX','XxxxxxxxxxxxX','XVVVVVVVVVVVX','XxxxxxxxxxxxX','XVVVVVVVVVVVX','XxxxxxxxxxxxX','XVVVVVVVVVVVX','XxxxxxxxxxxxX','XXXXXXeXXXXXX'],ventReset:[6,13],
 warps:[{x:6,y:14,to:'kilnhaven',tx:16,ty:6,dir:'down'}],
 npcs:[{id:'g4guide',x:11,y:13,dir:'left',look:'lineman',text:'Steam vents! They glow orange right before they blast. Get scalded and you\'re back at the door.'},
  {id:'brann',x:2,y:2,dir:'right',look:'hiker',range:4,trainer:{name:'Brann',title:'Stoker',team:[['kilnfly',24],['magmaw',25]],money:1000,pre:'You made it through the steam? Let\'s turn up the heat!',post:'Burned out...'}},
  {id:'sora',x:6,y:1,dir:'down',look:'ione',script:soraTalk}]};
async function soraTalk(){if(flag('badge4')){await say('Burn bright, burn steady, '+N()+'.',{speaker:'Sora'});return;}G.busy=true;
 await say('I\'m Sora, Warden of Kilnhaven. Heat is life up here. Let\'s see if you can manage yours. This is a LINK battle!',{speaker:'Sora'});
 const r=await runBattle({trainer:{name:'Sora',title:'Warden',look:'ione',warden:1,link:1,team:[['furnadrone',27],['cinderlamp',26],['magmaw',27],['blastfan',28]],money:3000,items:1}});
 if(r==='win'){setFlag('badge4');addItem('prime4',1);addItem('shard_Flame',1);Snd.jingle('victory',curMap().music);await say('Bright AND steady. Take it.',{speaker:'Sora'});await say(N()+' received the FLAME PRIME and a Flame Shard!');
   await thawRegions(['kilnhaven','route4'],'The Flame Prime blazes. The geyser fields steam, and the snow on the Geyser Flats melts away...');G.busy=false;await chapter2End();return;}
 G.busy=false;}
async function chapter2End(){G.busy=true;Snd.sfx('glitch');
 await pushUI({t:0,update(){this.t++;if(this.t>150)popUI(this);},draw(){for(let i=0;i<30;i++){ctx.fillStyle=Math.random()<0.5?'rgba(255,0,200,.25)':'rgba(0,255,220,.2)';ctx.fillRect(0,Math.random()*H,W,2+Math.random()*10);}if(this.t%20<3){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,W,H);}wtxt('— SIGNAL INTERRUPTED —',W/2,H/2,'#ff60d0',24,'center');}});
 await say('Every bot in Kilnhaven freezes mid-motion. Your Navi-band crackles with static.');
 await say('Four Primes. You carry them so carefully. Thank you for gathering them for us.',{speaker:'??? (The Cantor)'});
 await say('When all eight are together, the Accord will answer one voice. We would prefer it not be a Warden\'s.',{speaker:'The Cantor'});
 await say('The static clears. The bots shake themselves and go on as if nothing happened.');
 const k=G.kael||0;
 if(flag('kaelChoir'))await say('That was the Cantor. You felt it, right? That\'s the Accord. Still think Vesna\'s right?',{speaker:'Kael (Navi-band)'});
 else if(k>=2)await say('Did your bots just freeze too? That was the Accord. Someone\'s testing it. Meet me at the foot of Mt. Cinder. We do this together.',{speaker:'Kael (Navi-band)'});
 else await say('...My bots locked up for three seconds. Don\'t say anything. I\'m figuring this out on my own.',{speaker:'Kael (Navi-band)'});
 await say('Two Wardens left before Mt. Cinder. Stay safe. And... whatever you decided about the archive, I understand.',{speaker:'Vesna (Navi-band)'});
 Snd.music('title',true);
 await pushUI({t:0,update(){this.t++;if(this.t>60&&(press('a')||press('start')))popUI(this);},draw(){ctx.fillStyle='#0a0610';ctx.fillRect(0,0,W,H);ctx.globalAlpha=Math.min(1,this.t/40);
    wtxt('CHAPTER 2 COMPLETE',W/2,66,'#ffd060',40,'center');wtxt('The Rustworks',W/2,100,'#ffb080',26,'center');
    wtxt('Time: '+fmtTime(G.time)+'    Linked bots: '+Object.keys(G.caught).length+'    Prime Shards: 4/8',W/2,148,'#e0d0c0',20,'center');
    G.party.slice(0,6).forEach((b,i)=>ctx.drawImage(bspr(b),W/2-150+i*50,162,48,48));const rp=G.rep||{w:0,c:0};
    wtxt('Allegiance: '+(rp.w>rp.c?'Wardens':rp.c>rp.w?'Hollow Choir':'undecided')+'  ·  Kael: '+(flag('kaelChoir')?'joined the Choir':(G.kael||0)>=2?'ally':'lone wolf')+'  ·  Archive: '+(flag('archiveVesna')?'to Vesna':flag('archiveChoir')?'leaked':'kept'),W/2,232,'#ffd0a0',16,'center');
    wtxt('Next: Chapter 3 — The Frozen Foundry',W/2,262,'#9ac0ff',22,'center');wtxt('The Accord stirs. Four Primes remain.',W/2,286,'#8090a0',18,'center');
    ctx.globalAlpha=1;if(this.t>60&&TICK%40<26)wtxt('Press A to keep exploring',W/2,310,'#ff9040',16,'center');}});
 Snd.music(curMap().music,true);setFlag('ch2done');const r=await ask('Save your progress?');if(r===0)await saveMenu();G.busy=false;}
