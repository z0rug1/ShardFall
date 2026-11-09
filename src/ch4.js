// ===================== CHAPTER 4: HEART OF CINDER =====================
const at4=at3;
Object.assign(QUESTS,{cinder:{n:'Heart of Cinder',where:'Cinder Ascent → Rimefall → Summit',steps:{active:'Climb Mt. Cinder. Two Wardens remain: Yoru in Rimefall and the Spirit Warden at the summit.',heart:'All eight Primes. Enter the Heartforge at the summit before the titan wakes.',done:'You faced Glacivore.'}}});
// ---------- Cinder Ascent ----------
MAPS.route7={name:'Cinder Ascent',theme:'out',music:'route',outdoor:1,weather:'blizzard',world:{x:45,y:84},grid:C3G.route7.grid,
 enc:{tiles:'jwqyd',count:10,list:[['glacimite',33,36,40]],by:{j:[['glacimite',33,36,35],['cogwyrm',34,36,35],['kilnfly',33,35,30]],w:[['cinderwisp',33,36,45],['squallkite',34,36,30],['gloomlamp',34,36,25]],
   q:[['frostling',34,36,45],['glacimite',33,35,35],['cinderwisp',34,36,20]],y:[['boltbun',34,36,40],['squallkite',34,36,30],['cinderwisp',35,36,30]],d:[['glacimite',34,36,60],['frostling',34,36,40]]}},
 alpha:{id:'glacimite',lv:39,at:C3('route7','alpha')},
 warps:[WP3('route7','exitN0','route6',3,20),WP3('route7','exitN1','route6',4,20),WP3('route7','exitS0','rimefall',10,1),WP3('route7','exitS1','rimefall',11,1)],
 triggers:[{x:10,y:2,run:cinderIntro},{x:11,y:2,run:cinderIntro}],
 objs:[{type:'pylon',id:'p7',...at4('route7','pylon'),thaws:['route7'],run:pylonRun},{type:'log',log:'log7',...at4('route7','log'),run:readLog},
  {type:'item',id:'r7a',...at4('route7','item1'),item:'coolfin'},{type:'item',id:'r7b',...at4('route7','item2'),item:'platekit'}],
 npcs:[{id:'r7t1',...at4('route7','t1'),dir:'right',look:'hiker',range:4,trainer:{name:'Bram',title:'Ash Climber',team:[['glacimite',36],['kilnfly',36],['pebblit',37]],money:1800,pre:'Nobody climbs Cinder without passing the old climbers first!',post:'Go on up. Mind the heat bands.'}},
  {id:'r7t2',...at4('route7','t2'),dir:'left',look:'grunt',range:4,trainer:{name:'Choir Zealot',title:'Hollow',team:[['rimeghost',37],['nightglider',37],['cinderwisp',38]],money:1900,pre:'The summit is ours. The titan sleeps forever tonight!',post:'Then hurry. We\'re already ahead of you.'}}]};
async function cinderIntro(){if(flag('cinderIntro'))return;setFlag('cinderIntro');G.busy=true;setQ('cinder','active');
 await say('The air turns from freezing to scorching and back again as you climb. Mt. Cinder breathes in bands.');
 await say('Heat bands burn bots without heat shielding, and the frost bands crack plating. A Flame or Tide lead handles the heat; a Flame or Frost lead handles the cold. Coolant Fins and Plating Kits work too.',{speaker:'Vesna (Navi-band)'});
 G.busy=false;}
// ---------- Rimefall ----------
MAPS.rimefall={name:'Rimefall',theme:'out',music:'town',outdoor:1,weather:'snow',world:{x:45,y:124},town:1,heal:{map:'repair_r',x:6,y:4},grid:C3G.rimefall.grid,
 warps:[WP3('rimefall','gym','gym7',7,15),WP3('rimefall','repair','repair_r',6,4),WP3('rimefall','house1','house_r1',4,4),WP3('rimefall','exitN0','route7',10,38),WP3('rimefall','exitN1','route7',11,38),
  WP3('rimefall','exitS0','route8',12,1),WP3('rimefall','exitS1','route8',13,1)],
 signs:{[C3('rimefall','sign').join(',')]:'RIMEFALL MONASTERY — "Be still. The ice remembers." Warden Yoru.'},
 triggers:[{x:10,y:2,run:rimeReunion},{x:11,y:2,run:rimeReunion}],
 npcs:[{id:'rf1',...at4('rimefall','npc1'),dir:'right',look:'old',text:'The monks here have watched the Heartforge glow for six hundred years. Tonight it\'s the colour of a dying coal.'},
  {id:'rf2',...at4('rimefall','npc2'),dir:'left',look:'yoru',text:'Yoru\'s hall is all ice. Slide, stop, think. The rocks are your friends.'},
  {id:'rfVesna',x:12,y:6,dir:'left',look:'vesna',cond:()=>flag('rimeReunion'),script:async()=>{await say(flag('badge7')?'One more Prime. The Spirit Warden is at the summit, past the Choir camp.':'Yoru first. Then the summit. I\'ll keep the station link open.',{speaker:'Vesna'});
    if(G.party.some(b=>b.hp<stats(b).hp)){await healAll();await say('Vesna patches your bots with her field kit.');}}}]};
async function rimeReunion(){if(flag('rimeReunion'))return;setFlag('rimeReunion');G.busy=true;
 await say(N()+'! Up here.',{speaker:'Vesna'});
 await say('I owe you the truth, so here it is. The Accord is a leash, and I knew. I kept it because without it, Glacivore wakes. I chose a collar over a war.',{speaker:'Vesna'});
 await say('Ilian chose the opposite. He wants the titan dead and every bot free, even if the Heartforge dies with it and Calderra freezes.',{speaker:'Vesna'});
 if(flag('archiveSelf'))await say('And you still have the archive. There\'s a third door in that archive, '+N()+'. A way to rewrite the Accord. I never had the nerve to try it.',{speaker:'Vesna'});
 if((G.kael||0)>=1&&!flag('kaelChoir')){await say('Kael jogs up the path behind you, out of breath. "Told you I\'d keep up."');setFlag('kaelAlly');setFlag('kaelJoined');}
 const c=await ask('Vesna asks: "Will you help me save the Heartforge?"',['I\'ll decide at the summit.','Yes. We save it.','No. Ilian might be right.']);G.rep=G.rep||{w:0,c:0};
 if(c===1)G.rep.w++;else if(c===2)G.rep.c++;
 await say('Fair. Yoru is waiting in the monastery hall. Then the summit.',{speaker:'Vesna'});G.busy=false;}
MAPS.repair_r=repairMap('Rimefall Repair Station',{map:'rimefall',x:below3('rimefall','repair')[0],y:below3('rimefall','repair')[1]},['patch2','debug','spike2','rebootcell','overclock','nanites','coolfin','platekit']);
MAPS.house_r1=room('Rimefall',['XXXXXXXXXX','X9x*xx9hvX','XxxxxxxxxX','XxxtxxxxxX','XxxxxxxxxX','XXXXeXXXXX'],{map:'rimefall',x:below3('rimefall','house1')[0],y:below3('rimefall','house1')[1]},
 [{id:'hr1',x:6,y:3,dir:'left',look:'yoru',text:'We keep a vigil for the titan. Not to worship it. To make sure someone is awake when it is.'}],[{type:'item',id:'hr1i',x:2,y:4,item:'rshard_Frost'}]);
MAPS.gym7={name:'Rimefall Ice Hall',theme:'lab',music:'gym',grid:C3G.gym7.grid,
 warps:[{x:7,y:16,to:'rimefall',tx:below3('rimefall','gym')[0],ty:below3('rimefall','gym')[1],dir:'down'}],
 npcs:[{id:'g7guide',...at4('gym7','guide'),dir:'left',look:'yoru',text:'Once you start sliding you won\'t stop until a rock, a wall, or solid floor stops you. Plan four moves ahead.'},
  {id:'g7t1',...at4('gym7','t1'),dir:'down',look:'yoru',range:3,trainer:{name:'Brother Ren',title:'Ice Monk',team:[['frostling',40],['hailguard',41]],money:2000,pre:'Stillness is strength.',post:'...And motion, apparently.'}},
  {id:'yoru',...at4('gym7','yoru'),dir:'down',look:'yoru',script:yoruTalk}]};
async function yoruTalk(){if(flag('badge7')){await say('The ice remembers your footsteps now.',{speaker:'Yoru'});return;}G.busy=true;
 await say('Seven Primes in one pack. The mountain can feel it. I am Yoru, Warden of Rimefall.',{speaker:'Yoru'});
 await say('My order has guarded the titan\'s sleep for six centuries. Prove you can stay calm when it wakes.',{speaker:'Yoru'});
 const r=await runBattle({trainer:{name:'Yoru',title:'Warden',look:'yoru',warden:1,link:1,team:[['rimeshade',42],['hailguard',43],['glacimite',43],['rimewyrm',44]],money:4200,items:2}});
 if(r==='win'){setFlag('badge7');addItem('prime7',1);addItem('shard_Frost',1);Snd.jingle('victory',curMap().music);await say('Still as ice. Take it.',{speaker:'Yoru'});await say(N()+' received the FROST PRIME and a Frost Shard!');
  const c=await ask('Yoru asks: "If the titan wakes, do we chain it again, or end it?"',['Chain it. Calderra needs the Heartforge.','End it. No more leashes.']);G.rep=G.rep||{w:0,c:0};
  if(c===0){G.rep.w++;await say('The careful answer.',{speaker:'Yoru'});}else{G.rep.c++;await say('The brave answer. I hope it is also the right one.',{speaker:'Yoru'});}
  await thawRegions(['rimefall','route7'],'The Frost Prime, of all things, warms in your hand. The ice in Rimefall\'s courtyard steams and melts...');
  await say('The Spirit Warden waits at the summit, south past the Choir camp. It has not spoken to a human in three hundred years.',{speaker:'Yoru'});}
 G.busy=false;}
// ---------- Summit Trail + Choir camp ----------
const choirFriendly=()=>{const r=G.rep||{w:0,c:0};return r.c>r.w||flag('archiveChoir');};
MAPS.route8={name:'Summit Trail',theme:'out',music:'route',outdoor:1,weather:'blizzard',world:{x:43,y:144},grid:C3G.route8.grid,
 enc:{tiles:'yw',count:8,list:[['cinderwisp',37,40,40]],by:{y:[['cinderwisp',38,40,40],['glacimite',37,40,30],['squallkite',37,39,30]],w:[['frostling',37,40,40],['cinderwisp',38,40,35],['brinejaw',37,39,25]]}},
 warps:[WP3('route8','exitN0','rimefall',10,18),WP3('route8','exitN1','rimefall',11,18),WP3('route8','spirit','gym8',6,13),WP3('route8','hfgate','hf1',10,14,'up',{req:'badge8',locked:'A vault door of black Maker steel, eight sockets in a ring. Seven glow. One is dark.'})],
 objs:[{type:'item',id:'r8a',...at4('route8','item1'),item:'nanites'},{type:'log',log:'log8',...at4('route8','log'),run:readLog}],
 npcs:[{id:'camp1',...at4('route8','choir1'),dir:'down',look:'grunt',cond:()=>choirFriendly(),script:async()=>{await say('You\'re the one who listened. Sit by the fire a moment.',{speaker:'Choir Medic'});await healAll();await say('Your bots are warm again. The Cantor is already inside the summit.',{speaker:'Choir Medic'});}},
  {id:'camp1t',...at4('route8','choir1'),dir:'down',look:'grunt',range:4,cond:()=>!choirFriendly(),trainer:{name:'Choir Zealot',title:'Hollow',team:[['pyrewraith',40],['nightglider',40]],money:2100,pre:'A Warden pet, this close to the titan? Turn around!',post:'...Go. It won\'t matter.'}},
  {id:'camp2',...at4('route8','choir2'),dir:'down',look:'grunt',range:4,cond:()=>!choirFriendly(),trainer:{name:'Choir Zealot',title:'Hollow',team:[['rimeghost',40],['phantide',40],['wispire',41]],money:2200,pre:'The Cantor said you\'d try to stop us!',post:'He also said you\'d win.'}},
  {id:'camp3',...at4('route8','choir2'),dir:'down',look:'grunt',cond:()=>choirFriendly(),text:'The Deacons say the Cantor wants to kill the titan in its sleep. Some of us just want the bots to be free. Is that the same thing?'},
  {id:'r8t1',...at4('route8','t1'),dir:'down',look:'hiker',range:4,trainer:{name:'Ida',title:'Summit Guide',team:[['glacimite',39],['squallkite',39],['frostfist',40]],money:2100,pre:'Altitude makes fighters honest. Let\'s see yours!',post:'Honest and strong.'}},
  {id:'r8t2',...at4('route8','t2'),dir:'left',look:'scout',range:4,trainer:{name:'Nils',title:'Storm Watcher',team:[['tempestwing',40],['boltbun',39],['cinderwisp',40]],money:2100,pre:'The static up here is wild tonight. So am I!',post:'Grounded again.'}}]};
// ---------- Spirit hall ----------
MAPS.gym8={name:'Spirit Shrine',theme:'gym2',music:'gym',gate:'gate8',grid:C3G.gym8.grid,
 warps:[{x:6,y:14,to:'route8',tx:below3('route8','spirit')[0],ty:below3('route8','spirit')[1],dir:'down'}],
 tileScripts:{'2,11':()=>shrineTerminal(0),'10,11':()=>shrineTerminal(1),'2,6':()=>shrineTerminal(2),'10,6':()=>shrineTerminal(3)},
 npcs:[{id:'g8guide',...at4('gym8','guide'),dir:'left',look:'spiritw',text:'The Warden only opens its doors to those who remember. Repeat the four old songs on the terminals.'},
  {id:'spiritw',...at4('gym8','warden'),dir:'down',look:'spiritw',script:spiritTalk}]};
async function shrineTerminal(i){G.shrine=G.shrine||[0,0,0,0];if(G.shrine[i]){await say('The terminal hums the song you already sang.');return;}
 if(i>=2&&!flag('gate8a')){await say('This terminal is dark. The songs below must be sung first.');return;}
 await say('A Maker terminal. A faint song plays: repeat it.');const seq=Array.from({length:4+i},()=>pick(['up','right','down','left']));const ok=await pushUI(memoryW(seq));
 if(!ok){Snd.sfx('wrong');await say('The song breaks off. Try again.');return;}G.shrine[i]=1;Snd.sfx('item');
 if(G.shrine[0]&&G.shrine[1]&&!flag('gate8a')){setFlag('gate8a');setFlag('gate8');await say('Both lower songs ring out together. The gates grind open.');}
 else if(G.shrine[2]&&G.shrine[3]&&!flag('gate8b')){setFlag('gate8b');await say('The shrine sings all four songs at once. Something at the top of the hall wakes up.');}
 else await say('The terminal remembers. Another song is still missing.');}
async function spiritTalk(){if(flag('badge8')){await say('...GO. THE TITAN IS LISTENING.',{speaker:'Spirit Warden'});return;}
 if(!flag('gate8b')){await say('...',{speaker:'Spirit Warden'});await say('The old Maker bot does not move. The two upper terminals are still silent.');return;}G.busy=true;
 await say('...SEVEN... PRIMES. ... I HAVE WAITED... THREE HUNDRED YEARS... FOR THE EIGHTH HAND.',{speaker:'Spirit Warden'});
 await say('MY MAKERS SAID: GIVE IT ONLY TO ONE WHO CAN LOSE. SHOW ME.',{speaker:'Spirit Warden'});
 const r=await runBattle({trainer:{name:'Spirit Warden',title:'Maker',look:'spiritw',warden:1,link:1,team:[['cinderwisp',46],['wispire',46],['rimeghost',47],['pyrewraith',48]],money:5000,items:2}});
 if(r==='win'){setFlag('badge8');addItem('prime8',1);addItem('shard_Spirit',1);Snd.jingle('victory',curMap().music);await say('...YES. TAKE IT. FINISH WHAT THEY STARTED.',{speaker:'Spirit Warden'});
  await say(N()+' received the SPIRIT PRIME! All eight Primes are together for the first time in a thousand years.');setQ('cinder','heart');
  await thawRegions(['route8'],'The eight Primes hum in harmony. Snow slides off the summit in sheets...');
  await say('The black door beside the shrine. The Heartforge. Ilian is already inside, and so is the Choir. Go, '+N()+'. I\'m right behind you.',{speaker:'Vesna (Navi-band)'});}
 G.busy=false;}
// ---------- The Heartforge ----------
MAPS.hf1={name:'Heartforge: Outer Ring',theme:'factory',music:'cave',accord:1,grid:C3G.hf1.grid.map((r,y)=>y===5?r.replace('u','r'):r),
 warps:[{x:10,y:15,to:'route8',tx:below3('route8','hfgate')[0],ty:below3('route8','hfgate')[1],dir:'down'},{x:10,y:1,to:'hf2',tx:10,ty:14,dir:'up'}],
 objs:[{type:'item',id:'hf1i',...at4('hf1','item1'),item:'nanites'}],
 npcs:[{id:'hf1g1',...at4('hf1','g1'),dir:'down',look:'grunt',range:4,trainer:{name:'Choir Zealot',title:'Hollow',team:[['nightglider',42],['pyrewraith',42],['rimeghost',43]],money:2400,pre:'Feel that? The Accord is screaming in here. Your bots will betray you!',post:'They... didn\'t?'}},
  {id:'hf1g2',...at4('hf1','g2'),dir:'left',look:'grunt',range:4,trainer:{name:'Choir Zealot',title:'Hollow',team:[['tempestwing',43],['stormkeel',43]],money:2400,pre:'One more step and the titan hears you!',post:'It heard that.'}}]};
MAPS.hf2={name:'Heartforge: Conveyor Spine',theme:'factory',music:'cave',accord:1,leverFlip:1,grid:C3G.hf2.grid,
 warps:[{x:10,y:15,to:'hf1',tx:10,ty:2,dir:'down'},{x:10,y:1,to:'hfcore',tx:8,ty:12,dir:'up'}],
 tileScripts:{'3,14':toggleLever,'16,9':toggleLever},objs:[{type:'item',id:'hf2i',...at4('hf2','item1'),item:'rshard_Spirit'}],
 npcs:[{id:'hf2g1',...at4('hf2','g1'),dir:'up',look:'deacon',range:3,trainer:{name:'Mirelle',title:'Deacon',team:[['rotcap',43],['wispire',44],['nightglider',44]],money:3000,pre:'The little spark. The last verse is tonight, and you have a front-row seat.',post:'...Then sing it well.'}},
  {id:'hf2g2',...at4('hf2','g2'),dir:'down',look:'grunt',range:3,trainer:{name:'Choir Zealot',title:'Hollow',team:[['avalanche',44],['rimeghost',44]],money:2500,pre:'The belts lead to the core. You won\'t ride them!',post:'...Ride them, then.'}}]};
MAPS.hfcore={name:'The Heartforge',theme:'factory',music:'boss',accord:1,grid:C3G.hfcore.grid,
 warps:[{x:8,y:13,to:'hf2',tx:9,ty:1,dir:'down'}],
 objs:[{type:'titan',...at4('hfcore','titan'),run:titanObj}],npcs:[]};
async function titanObj(){if(!flag('gameClear')){await finale();return;}
 if(G.caught&&G.caught.glacivore){await say('Glacivore\'s empty cradle. The Heartforge glows steady and warm around it.');return;}
 if((await ask('Glacivore stirs in the ruins of its cradle, watching you. Challenge it?'))!==0)return;
 const w=makeBot('glacivore',60);await runBattle({wild:w});}
if(typeof BOTS!=='undefined'&&BOTS.glacivore)BOTS.glacivore.cr=8;
function drawTitan(o,sx,sy){const awake=flag('gameClear');const sz=awake?72:96;const sp=botSprite('glacivore');ctx.save();ctx.globalAlpha=awake?0.9:1;ctx.drawImage(sp,sx+16-sz/2,sy+20-sz,sz,sz);
 if(!awake){ctx.fillStyle='rgba(160,210,255,.35)';ctx.fillRect(sx+16-sz/2,sy+20-sz,sz,sz);}ctx.restore();}
async function finale(){G.busy=true;
 await say('The Heartforge chamber. At its centre, sealed in a column of blue ice, a war-titan the size of a house: GLACIVORE.');
 const il={id:'ilian',x:4,y:8,dir:'right',look:'cantor'},ve={id:'vesnaF',x:12,y:8,dir:'left',look:'vesna'};G.npcs.push(il,ve);
 await say('You came. Good. Put the Primes in the ring, little spark, and I\'ll stop its heart while it sleeps.',{speaker:'Ilian'});
 await say('If you stop the Heartforge, Ilian, the whole peninsula freezes. Every town. Every bot that isn\'t free yet dies cold.',{speaker:'Vesna'});
 await say('Better cold and free than warm and owned.',{speaker:'Ilian'});
 if(flag('kaelJoined')){const k={id:'kaelF',x:8,y:11,dir:'up',look:'kael'};G.npcs.push(k);await say('Can you two stop arguing for ONE minute? Look at the ice.',{speaker:'Kael'});}
 Snd.sfx('thunder');G.shake=60;await say('The ice column cracks. The Heartforge flickers... fifteen percent... ten...');
 await say('GLACIVORE WAKES.',{speaker:''});Snd.sfx('glitch');
 // phase 1
 let r=await runBattle({wild:makeBot('glacivore',50),boss:1,noBlackout:0});if(r!=='win'){G.npcs=G.npcs.filter(n=>!['ilian','vesnaF','kaelF'].includes(n.id));G.busy=false;return;}
 await say('The titan staggers, shakes off the hit, and rises taller.');await healAll();
 await say('Fine. We do this together. Just this once, sister.',{speaker:'Ilian'});
 const ally=flag('kaelJoined')?makeBot(rivalForm(),52):makeBot('wispire',50);await say((flag('kaelJoined')?'Kael':'Ilian')+'\'s bot leaps in beside yours!');
 r=await runBattle({wild:makeBot('glacivore',52),boss:1,ally});if(r!=='win'){G.npcs=G.npcs.filter(n=>!['ilian','vesnaF','kaelF'].includes(n.id));G.busy=false;return;}
 await say('Vesna slams a coolant spike into the Heartforge\'s rim. "That\'s all the time I can buy! Finish it!"');await healAll();
 r=await runBattle({wild:makeBot('glacivore',55),boss:1});if(r!=='win'){G.npcs=G.npcs.filter(n=>!['ilian','vesnaF','kaelF'].includes(n.id));G.busy=false;return;}
 await say('Glacivore sinks to one knee, its eyes flickering between red and blue. It\'s waiting. For an order.');
 await say('All eight Primes burn in your pack. The Heartforge ring is in front of you. Whatever you do now, every bot in Calderra will feel it.');
 const rp=G.rep||{w:0,c:0};const opts=[],ids=[];
 if(rp.w>=rp.c||rp.w>=3){opts.push('RESTORE: reforge the Heartforge, keep the Accord');ids.push('restore');}
 if(rp.c>rp.w||rp.c>=3){opts.push('SILENCE: shut it down, free every bot');ids.push('silence');}
 if(flag('archiveSelf')&&(G.kael||0)>=2){opts.push('REWRITE: use the archive to remove the Accord');ids.push('rewrite');}
 if(!opts.length){opts.push('RESTORE: reforge the Heartforge, keep the Accord','SILENCE: shut it down, free every bot');ids.push('restore','silence');}
 const c=await ask('What do you do with the eight Primes?',opts);const end=ids[Math.max(0,c)];G.ending=end;setFlag('end_'+end);
 if(end==='restore'){await say('You seat the eight Primes in the ring. The Heartforge roars back to full strength, and blue light floods the chamber.');await say('Glacivore\'s eyes go dark. It lies down, and the ice closes over it again. Every bot in Calderra sighs back into the Accord.');
   await say('...You chose the leash. I hope you\'re a kinder hand than ours were.',{speaker:'Ilian'});await say('Thank you. I\'ll spend the rest of my life making sure it\'s never misused.',{speaker:'Vesna'});}
 else if(end==='silence'){await say('You pull the Primes from the ring one by one. With each one, the Heartforge dims.');await say('Glacivore watches the light die... then turns, and walks out through the cracked wall into the snow. Free.');
   await say('Every bot in Calderra stops, blinks, and for the first time, chooses what to do next.',{speaker:''});await say('...Thank you. Now we learn to live with what we freed.',{speaker:'Ilian'});await say('It\'ll be a long winter. We\'ll get through it. Together this time.',{speaker:'Vesna'});}
 else{await say('You slot the archive core into the Heartforge\'s heart and seat the eight Primes around it.');await say('The Maker log scrolls past: ACCORD — REWRITE. CONTROL: NONE. POWER: SHARED.');
   await say('The Heartforge stays warm. The leash dissolves. Glacivore stands, looks at you, and bows its enormous head before walking into the mountain\'s dark.');
   await say('...Both of us were wrong. And you found the third door.',{speaker:'Ilian'});await say('You did what we were too scared to do.',{speaker:'Vesna'});if(flag('kaelJoined'))await say('Told you we\'d do it together.',{speaker:'Kael'});}
 Snd.sfx('thunder');G.shake=80;await say('The chamber shakes. The Heartforge is rebuilding itself, and the old tunnels are collapsing! RUN!');
 G.npcs=G.npcs.filter(n=>!['ilian','vesnaF','kaelF'].includes(n.id));
 G.escape={t:60*60};loadMap('hfescape',34,4,'left');G.busy=false;}
if(typeof doAction==='function'){const _da2=doAction;doAction=async function(side,a){if(side==='p'&&BT&&BT.boss&&a&&(a.type==='run'||a.type==='spike')){await bsay(a.type==='run'?'There\'s nowhere to run!':'The titan\'s core rejects the Link Spike!');return;}return _da2(side,a);};}
// ---------- collapsing escape ----------
MAPS.hfescape={name:'Collapsing Tunnel',theme:'cave',music:'boss',outdoor:1,dungeon:1,grid:C3G.hfescape.grid,
 warps:[{x:0,y:4,to:'route8',tx:below3('route8','hfgate')[0],ty:below3('route8','hfgate')[1],dir:'down'}],npcs:[],objs:[]};
function escapeTick(){if(!G.escape||G.map!=='hfescape'||G.busy||UI.length||BT)return;G.escape.t--;if(TICK%30===0)G.shake=4;
 if(G.escape.t<=0){G.escape.t=60*60;(async()=>{G.busy=true;Snd.sfx('thunder');await say('The ceiling comes down! You scramble back to the start of the tunnel.');G.px=34;G.py=4;G.mv=null;resetFollower();G.busy=false;})();}}
function drawEscape(){if(!G.escape||G.map!=='hfescape')return;const s=Math.ceil(G.escape.t/60);panel(W/2-60,8,120,34);txt('ESCAPE '+s+'s',W/2,32,s<=10?'#c03030':'#303840',22,'center');
 if(TICK%7===0)OWP.push({x:(G.px+(Math.random()*12-6))*TS,y:(G.py-5)*TS,vx:0,vy:3,t:0,max:40,k:'spark',col:'#8a7a6a'});}
if(typeof loadMap==='function'){const _lm=loadMap;loadMap=function(id,x,y,dir){const was=G.map;_lm(id,x,y,dir);if(was==='hfescape'&&id==='route8'&&G.escape){G.escape=null;setTimeout(()=>{if(!flag('gameClear'))epilogue();},50);}};}
async function epilogue(){G.busy=true;setFlag('gameClear');setQ('cinder','done');const end=G.ending||'restore';
 await thawRegions(Object.keys(MAPS).filter(k=>MAPS[k].world),'Warm air pours down the mountain. All across Calderra, the snow begins to melt...');
 const lines={restore:['The Heartforge burns steady again.','Vesna rebuilt the Wardens as guardians of the Accord, not owners of it.','Ilian disbanded the Choir. Some say he sits by the Heartforge every night, listening.'],
  silence:['The Heartforge sleeps. Winter lasted another year, and Calderra survived it.','The bots, free for the first time, chose to stay. Most of them.','Glacivore was seen on the coast at dawn, watching the sea.'],
  rewrite:['The Heartforge burns, but it answers to no one.','Vesna and Ilian keep the archive together again, in a workshop in Ashgrove.','Glacivore sleeps under Mt. Cinder by choice. Sometimes, on clear nights, it hums.']}[end];
 lines.push(flag('kaelJoined')?'Kael opened a salvage shop in Brasston. The sign says KAEL & '+N().toUpperCase()+'. You never agreed to that.':'Kael left Calderra on a fishing boat. He sends postcards. They are mostly insults.');
 lines.push('And you went home to Ashgrove, to the workshop, where a capsule once fell from the sky.');
 const credits=['SHARDFALL: EMBER PROTOCOL','','Story, world and bots','designed with Claude','for '+G.name,'','Thanks for playing.'];
 await pushUI({t:0,update(){this.t++;if(this.t>(lines.length*150+credits.length*40+200)&&(press('a')||press('start')))popUI(this);},draw(){ctx.fillStyle='#05070c';ctx.fillRect(0,0,W,H);
   const t=this.t;wtxt({restore:'ENDING: RESTORE',silence:'ENDING: SILENCE',rewrite:'ENDING: REWRITE'}[end],W/2,40,'#ffd060',28,'center');
   lines.forEach((l,i)=>{const a=Math.max(0,Math.min(1,(t-i*150)/60));if(a>0){ctx.globalAlpha=a;wrap(l,420).forEach((ln,j)=>wtxt(ln,W/2,80+i*36+j*18,'#e0e8f0',18,'center'));ctx.globalAlpha=1;}});
   const ct=t-lines.length*150;if(ct>0){ctx.fillStyle='rgba(5,7,12,'+Math.min(1,ct/60)+')';ctx.fillRect(0,0,W,H);credits.forEach((c,i)=>wtxt(c,W/2,H-ct*0.6+i*30,i===0?'#80e0ff':'#c8d0e0',i===0?28:20,'center'));
     if(ct>credits.length*40+200){wtxt('THE END',W/2,H/2,'#ffd060',40,'center');wtxt('Press A',W/2,H/2+40,'#7a8aa8',18,'center');}}}});
 await say('Postgame: Glacivore waits in the Heartforge, and this time you can link with it. The Maker Vault goes as deep as you dare. Your save keeps everything.');G.busy=false;autosave();}
