// ===================== SYSTEMS =====================
// ---- core traits (per frame; evolved forms inherit) ----
const TRAITS={
 flicker:{n:'Afterburn',d:'Flame moves deal 50% more damage below 1/3 HP.'},
 drizzlet:{n:'Coolant Loop',d:'Restores 1/16 HP at the end of each turn.'},
 thornbit:{n:'Crystal Plating',d:'Takes 25% less damage from super-effective hits.'},
 pipsprock:{n:'Quick Launch',d:'SPD rises one stage when it enters battle.'},
 boltbun:{n:'Static Skin',d:'30% chance to shock a foe that hits it.'},
 scrapmite:{n:'Salvager',d:'Restores 1/8 HP whenever a foe shuts down.'},
 sporelet:{n:'Spore Cloud',d:'20% chance to put a foe that hits it into sleep mode.'},
 pebblit:{n:'Bulwark',d:'Takes half damage while at full HP.'},
 gearpup:{n:'Rally Protocol',d:'ATK rises one stage the first time HP drops below half.'},
 dripcell:{n:'Volt Sink',d:'Volt moves restore 1/4 HP instead of dealing damage.'},
 gloomlamp:{n:'Dread Aura',d:'Lowers the foe\'s ATK one stage on entry.'},
 frostling:{n:'Cryo Vent',d:'Venting drops its heat all the way to zero.'},
 cogwyrm:{n:'Rail Lock',d:'DEF rises one stage when it enters battle.'},
 kilnfly:{n:'Updraft',d:'Its Gale moves deal 30% more damage.'},
 pyrakh:{n:'Heartforge',d:'Unknown.'},glacivore:{n:'Permafrost',d:'Unknown.'},
};
function traitId(b){return BOTS[b.id].frame;}
function trait(b){return TRAITS[traitId(b)]||{n:'—',d:''};}

// ---- extra items ----
Object.assign(ITEMS,{
 scrap:{n:'Scrap',d:'Salvaged plating. 5 Scrap make a random shard at the Forge.',price:40,cat:'mat'},
 stolen:{n:'Stolen Shards',d:'A crate of shards the Choir stole from Brasston.',cat:'key'},
 coolfin:{n:'Coolant Fin',d:'Module. Holder\'s SPD +10%.',price:900,cat:'mod',mod:1},
 platekit:{n:'Plating Kit',d:'Module. Holder\'s DEF +10%.',price:900,cat:'mod',mod:1},
 overclock:{n:'Overclock Chip',d:'Module. ATK +20%, but the holder takes 10% of damage dealt as recoil.',price:1400,cat:'mod',mod:1},
 nanites:{n:'Repair Nanites',d:'Module. Restores 1/16 HP at the end of each turn.',price:1400,cat:'mod',mod:1},
});
for(const t of TYPES){if(t==='Core')continue;
  ITEMS['rshard_'+t]={n:'Refined '+t,d:'Refined shard. Fits like a normal shard and boosts the holder\'s '+t+' moves by 10%.',cat:'shard',shard:t,refined:1,price:0};
  ITEMS['frag_'+t]={n:t+' Prime Fragment',d:'A sliver of Prime energy. Needed for Socket 3 later. Sells for a lot.',cat:'mat',price:3000};}
function modMult(b,stat){const m=b.mod;if(!m)return 1;if(stat==='spd'&&m==='coolfin')return 1.1;if(stat==='def'&&m==='platekit')return 1.1;if(stat==='atk'&&m==='overclock')return 1.2;return 1;}
function resonant(b){const d=BOTS[b.id];if(d.stage<1||b.shards.length<2)return false;const mt=b.moves.map(m=>MOVES[m.id].t);return b.shards.every(s=>mt.includes(s));}

// ---- Forge ----
async function openForge(){G.busy=true;await say('The Forge hums. Molten shard-light pours between the anvils.',{speaker:'Forge'});
  while(true){const ws=WS();const SC=ws.forge>=2?4:5,RN=ws.forge>=3?2:3;const i=await ask('FORGE Lv '+ws.forge+' — what do you want to forge? (Scrap: '+(G.bag.scrap||0)+')',['Salvage '+SC+' Scrap','Refine '+RN+' shards','Fuse 2 Refined','Refit a socket','Forge a part (8 Scrap)','Leave']);
    if(i===0){if((G.bag.scrap||0)<SC){await say('You need '+SC+' Scrap. Feral bots sometimes drop it.');continue;}
      G.bag.scrap-=SC;if(!G.bag.scrap)delete G.bag.scrap;const t=pick(TYPES.filter(x=>x!=='Core'));addItem('shard_'+t,1);Snd.sfx('item');await say('The scrap melts down... and cools into a '+t+' Shard!');}
    else if(i===1){const ts=TYPES.filter(t=>(G.bag['shard_'+t]||0)>=RN);if(!ts.length){await say('You need '+RN+' shards of the same type.');continue;}
      const k=await ask('Refine which type?',ts.map(t=>t+' (x'+G.bag['shard_'+t]+')').concat(['Cancel']));if(k<0||k>=ts.length)continue;const t=ts[k];
      G.bag['shard_'+t]-=RN;if(!G.bag['shard_'+t])delete G.bag['shard_'+t];addItem('rshard_'+t,1);Snd.sfx('item');await say(RN+' '+t+' Shards fuse into a Refined '+t+'!');}
    else if(i===2){const ts=TYPES.filter(t=>(G.bag['rshard_'+t]||0)>=2);if(!ts.length){await say('You need 2 Refined shards of the same type.');continue;}
      const k=await ask('Fuse which type?',ts.map(t=>t+' (x'+G.bag['rshard_'+t]+')').concat(['Cancel']));if(k<0||k>=ts.length)continue;const t=ts[k];
      G.bag['rshard_'+t]-=2;if(!G.bag['rshard_'+t])delete G.bag['rshard_'+t];addItem('frag_'+t,1);Snd.sfx('item');await say('Blinding light! You forged a '+t+' Prime Fragment.');}
    else if(i===3){const cand=G.party.filter(b=>BOTS[b.id].stage>=1&&b.shards[1]&&!(b.refined||[]).includes(b.shards[1])&&G.bag['rshard_'+b.shards[1]]);
      if(!cand.length){await say('Refitting swaps a bot\'s fitted Socket 2 shard for a Refined one of the same type. You don\'t have a match right now.');continue;}
      const k=await ask('Refit which bot?',cand.map(b=>BOTS[b.id].name+' ('+b.shards[1]+')').concat(['Cancel']));if(k<0||k>=cand.length)continue;const b=cand[k];const t=b.shards[1];
      G.bag['rshard_'+t]--;if(!G.bag['rshard_'+t])delete G.bag['rshard_'+t];addItem('shard_'+t,1);b.refined=(b.refined||[]).concat([t]);Snd.sfx('item');await say(BOTS[b.id].name+'\'s socket now holds a Refined '+t+'. Its '+t+' moves hit 10% harder. The old shard went back to your bag.');}
    else if(i===4){if((G.bag.scrap||0)<8){await say('You need 8 Scrap to forge a body part.');continue;}G.bag.scrap-=8;if(!G.bag.scrap)delete G.bag.scrap;const p=pick(Object.keys(PARTS));addItem(p,1);Snd.sfx('item');await say('Sparks fly... you forged a '+PARTS[p].n+'! ('+PARTS[p].slot.toUpperCase()+' part)');}
    else break;}
  G.busy=false;}

// ---- modules ----
async function moduleMenu(b){const mods=Object.keys(G.bag).filter(k=>ITEMS[k]&&ITEMS[k].cat==='mod'&&G.bag[k]>0);
  const cur_=b.mod?ITEMS[b.mod].n:'none';const opts=mods.map(k=>'Equip '+ITEMS[k].n);if(b.mod)opts.push('Remove '+ITEMS[b.mod].n);opts.push('Cancel');
  const i=await ask(BOTS[b.id].name+' module: '+cur_+'.',opts);if(i<0||i>=opts.length-1)return;
  if(i<mods.length){if(b.mod)addItem(b.mod,1);const k=mods[i];G.bag[k]--;if(!G.bag[k])delete G.bag[k];b.mod=k;Snd.sfx('item');await say(BOTS[b.id].name+' equipped the '+ITEMS[k].n+'.');}
  else{addItem(b.mod,1);await say('Removed the '+ITEMS[b.mod].n+'.');b.mod=null;}}

// ---- quests ----
const QUESTS={
 lostbit:{n:'Lost Bit',where:'Ashgrove / Wreckfield',steps:{active:'Tobin in Ashgrove lost his Pipsprock, Bit, in the Wreckfield crystal beds.',found:'You found Bit. Bring it back to Tobin in Ashgrove.',done:'Bit is home safe.'}},
 stolen:{n:'Stolen Shards',where:'Brasston / Mirrorlake Drifts',steps:{active:'The Brasston engineer says the Choir stashed stolen shards on the Mirrorlake island.',found:'You found the stash. Return it to the engineer in Brasston.',done:'Brasston has its shards back.'}},
 generator:{n:'Dead Generator',where:'Voltmere',steps:{active:'Restart the dead generator on the east side of Voltmere.',found:'The generator is running. Tell the lineman.',done:'Voltmere\'s east side has power again.'}},
};
function qstate(id){return (G.quests||{})[id];}
function setQ(id,s){G.quests=G.quests||{};G.quests[id]=s;}
function openQuests(){return pushUI({update(){if(press('a')||press('b'))popUI(this);},draw(){ctx.fillStyle='#14202e';ctx.fillRect(0,0,W,H);panel(8,8,464,304);txt('QUEST LOG',28,40,'#303840',26);
  const ids=Object.keys(QUESTS).filter(k=>qstate(k));if(!ids.length)txt('No quests yet. Talk to people around Calderra.',28,80,'#606870',20);
  ids.forEach((k,i)=>{const q=QUESTS[k],s=qstate(k);const y=78+i*72;txt((s==='done'?'✓ ':'• ')+q.n,28,y,s==='done'?'#4a8a4a':'#303840',22);txt(q.where,452,y,'#808890',18,'right');
    wrap(q.steps[s],420,18).slice(0,2).forEach((l,j)=>txt(l,44,y+22+j*20,'#606870',18));});}});}

// ---- rematch board ----
function rematchList(){const out=[];for(const mid in MAPS){for(const n of MAPS[mid].npcs||[]){if(n.trainer&&!n.trainer.warden&&flag('t_'+n.id))out.push({n,map:MAPS[mid].name});}}return out;}
async function openRematch(){G.busy=true;const L=rematchList();
  if(!L.length){await say('REMATCH BOARD: No trainers have signed up yet. Beat some trainers first!');G.busy=false;return;}
  const i=await ask('REMATCH BOARD — trainers looking for a stronger fight:',L.slice(0,6).map(x=>x.n.trainer.title+' '+x.n.trainer.name+' ('+x.map+')').concat(['Leave']));
  if(i<0||i>=Math.min(6,L.length)){G.busy=false;return;}
  const t=L[i].n.trainer;const pmax=Math.max(...G.party.map(b=>b.lv));
  const team=t.team.map(([id,l])=>[id,Math.min(l+14,Math.max(l+5,pmax-1))]);
  await say(t.title+' '+t.name+' accepted! "I\'ve been training. Let\'s go again!"');
  const r=await runBattle({trainer:Object.assign({},t,{look:L[i].n.look,team,money:Math.floor(t.money*1.5)})});
  if(r==='win')await say('"You\'re still stronger. I\'ll be back on the board."',{speaker:t.title+' '+t.name});
  G.busy=false;}

// ---- bestiary rewards ----
async function checkDexRewards(){const n=Object.keys(G.caught).length;const tiers=[[10,'dexr10'],[20,'dexr20'],[30,'dexr30']];
  for(const [need,f] of tiers){if(n>=need&&!flag(f)){setFlag(f);Snd.jingle('victory',curMap().music);
    await say(N()+'! You\'ve linked '+need+' different bots. Here, you\'ve earned this.',{speaker:'Vesna (Navi-band)'});
    if(need===10){addItem('spike2',3);G.skins=Object.assign(G.skins||{},{frost:1});await say('Received 3 Tuned Spikes and the FROST Navi-band skin! (OPTIONS → Band skin)');}
    if(need===20){const t=G.starter?BOTS[G.starter].types[0]:'Volt';addItem('rshard_'+t,1);await say('Received a Refined '+t+' Shard!');}
    if(need===30){G.skins=Object.assign(G.skins||{},{ember:1});addItem('overclock',1);await say('Received the EMBER Navi-band skin and an Overclock Chip!');}}}}

// ---- skins ----
const SKINS={classic:['#2a3242','#8aa0c0','#f8f6ec'],frost:['#183048','#78c0e8','#eef8ff'],ember:['#3a1a12','#e0804a','#fff3e6']};

// ---- autosave / prefs / save codes ----
let lastAuto=-999;
function autosave(){if(!G.started||BT||!G.party.length||TICK-lastAuto<120)return;lastAuto=TICK;lsSet('shardfall_auto',serialize());}
const PREF_KEYS=['ts','music','minimap','bspeed','skipFx','alwaysRun','skin','bigBtn','padOp','lefty','haptic','fxq'];
function savePrefs(){lsSet('shardfall_prefs',JSON.stringify({ts:TEXTSPEED,music:Snd.on,minimap:G.minimap,bspeed:G.bspeed,skipFx:G.skipFx,alwaysRun:G.alwaysRun,skin:G.skin,bigBtn:G.bigBtn,padOp:G.padOp,lefty:G.lefty,haptic:G.haptic,fxq:G.fxq}));}
function loadPrefs(){try{const p=JSON.parse(lsGet('shardfall_prefs')||'{}');if(p.ts)TEXTSPEED=p.ts;if(p.music===false)Snd.on=false;
  for(const k of ['minimap','bspeed','skipFx','alwaysRun','skin','bigBtn','padOp','lefty','haptic','fxq'])if(p[k]!==undefined)G[k]=p[k];}catch(e){}applyPadPrefs();}
function applyPadPrefs(){const b=document.body;if(!b)return;b.classList.toggle('big',!!G.bigBtn);b.classList.toggle('lefty',!!G.lefty);b.style.setProperty('--padop',G.padOp||1);}
function encodeSave(){return 'SF1.'+btoa(unescape(encodeURIComponent(serialize())));}
function decodeSave(s){s=(s||'').trim();if(!s.startsWith('SF1.'))throw new Error('Not a Shardfall save code');return JSON.parse(decodeURIComponent(escape(atob(s.slice(4)))));}
function saveCodeOverlay(mode){return new Promise(res=>{let ov=document.getElementById('codeov');if(!ov){ov=document.createElement('div');ov.id='codeov';document.getElementById('shell').appendChild(ov);}
  ov.innerHTML='<div class="cbox"><div class="ct"></div><textarea spellcheck="false"></textarea><div class="cb"><button class="c1"></button><button class="c2">Close</button></div><div class="cm"></div></div>';
  const ta=ov.querySelector('textarea'),b1=ov.querySelector('.c1'),msg=ov.querySelector('.cm');ov.style.display='flex';
  if(mode==='export'){ov.querySelector('.ct').textContent='Your save code. Copy it and paste it on another device (OPTIONS → Import save).';ta.value=encodeSave();ta.readOnly=true;b1.textContent='Copy';
    b1.onclick=async()=>{ta.select();try{await navigator.clipboard.writeText(ta.value);msg.textContent='Copied!';}catch(e){try{document.execCommand('copy');msg.textContent='Copied!';}catch(_){msg.textContent='Select the text and copy it manually.';}}};}
  else{ov.querySelector('.ct').textContent='Paste a save code below, then press Load. This replaces your current game.';ta.value='';ta.readOnly=false;b1.textContent='Load';
    b1.onclick=()=>{try{const d=decodeSave(ta.value);ov.style.display='none';res(d);}catch(e){msg.textContent='That code didn\'t work: '+e.message;}};setTimeout(()=>ta.focus(),50);}
  ov.querySelector('.c2').onclick=()=>{ov.style.display='none';res(null);};});}

// ---- type chart ----
function openTypeChart(){return pushUI({cx:0,cy:0,update(){if(rep('left'))this.cx=(this.cx+11)%12;if(rep('right'))this.cx=(this.cx+1)%12;if(rep('up'))this.cy=(this.cy+11)%12;if(rep('down'))this.cy=(this.cy+1)%12;if(press('a')||press('b'))popUI(this);},
  draw(){ctx.fillStyle='#101824';ctx.fillRect(0,0,W,H);const ox=92,oy=46,c=20;wtxt('TYPE CHART  (row attacks column)',8,20,'#cfe0f0',18);
    TYPES.forEach((t,i)=>{ctx.fillStyle=TCOL[t];ctx.fillRect(ox+i*c+1,oy-18,c-2,14);ctx.fillRect(ox-84,oy+i*c+3,78,c-6);txt(t.slice(0,3).toUpperCase(),ox+i*c+c/2,oy-7,'#10141c',12,'center',null);txt(t,ox-80,oy+i*c+15,'#10141c',15,'left',null);});
    TYPES.forEach((a,i)=>TYPES.forEach((d,j)=>{const e=typeEff(a,[d]);ctx.fillStyle=e>1?'#3aa858':e<1?'#a84848':'#2a3444';if(i===this.cy||j===this.cx)ctx.fillStyle=shade(ctx.fillStyle,0.25);ctx.fillRect(ox+j*c+1,oy+i*c+1,c-2,c-2);
      if(e!==1)txt(e>1?'2':'½',ox+j*c+c/2,oy+i*c+15,'#fff',15,'center',null);}));
    ctx.strokeStyle='#ffe080';ctx.lineWidth=2;ctx.strokeRect(ox+this.cx*c,oy+this.cy*c,c,c);
    const a=TYPES[this.cy],d=TYPES[this.cx],e=typeEff(a,[d]);darkPanel(ox+12*c+8,oy,W-(ox+12*c+16),110);
    wtxt(a,ox+12*c+16,oy+24,TCOL[a],20);wtxt('vs '+d,ox+12*c+16,oy+48,TCOL[d],20);wtxt(e>1?'Super effective':e<1?'Not very effective':'Normal',ox+12*c+16,oy+76,e>1?'#80ff90':e<1?'#ff9090':'#c0c8d8',16);}});}

// ---- patch all ----
async function patchAll(){let used=0;const order=['patch','patch2'];
  for(const b of G.party){if(b.hp<=0)continue;while(b.hp<stats(b).hp){const miss=stats(b).hp-b.hp;let it=miss>30&&G.bag.patch2?'patch2':G.bag.patch?'patch':G.bag.patch2?'patch2':null;if(!it)break;useItemOn(it,b);used++;}}
  await say(used?'Used '+used+' Patch Kit'+(used>1?'s':'')+'. Your team is patched up.':'Nothing to patch (or no Patch Kits left).');}
