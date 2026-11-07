// ===================== MENUS =====================
function canUse(it,b){const d=ITEMS[it];if(d.revive)return b.hp<=0;if(b.hp<=0)return false;if(d.heal)return b.hp<stats(b).hp;if(d.cure)return !!b.st;return false;}
function useItemOn(it,b){const d=ITEMS[it];G.bag[it]--;if(G.bag[it]<=0)delete G.bag[it];
  if(d.revive){b.hp=Math.floor(stats(b).hp/2);b.st=null;}if(d.heal)b.hp=Math.min(stats(b).hp,b.hp+d.heal);if(d.cure)b.st=null;}
function addItem(id,n=1){G.bag[id]=(G.bag[id]||0)+n;}
function botRow(b,x,y,w,sel,dim){panel(x,y,w,48,sel?'#fff4c8':dim?'#d8d8d8':null);ctx.drawImage(bspr(b),x+6,y+2,44,44);
  const d=BOTS[b.id],s=stats(b);txt((b.glitch?'✦':'')+d.name,x+54,y+22,b.glitch?'#a020c0':'#303840',20);txt('Lv'+b.lv,x+w-12,y+22,'#606870',18,'right');
  hpBar(x+54,y+30,w-130,b.hp,s.hp);txt(b.hp+'/'+s.hp,x+w-12,y+40,'#303840',18,'right');if(b.st)statusTag(b.st.k,x+w-100,y+8);if(b.hp<=0)txt('DOWN',x+w-70,y+22,'#e04040',18,'right');}

function openParty(o={}){let i0=0;if(o.mode==='switch'){const k=G.party.findIndex((b,i)=>b.hp>0&&!(BT&&i===BT.pi));if(k>=0)i0=k;}return pushUI({i:i0,o,update(){const n=G.party.length;if(rep('up')){this.i=(this.i+n-1)%n;Snd.sfx('blip');}if(rep('down')){this.i=(this.i+1)%n;Snd.sfx('blip');}
  if(press('b')&&!o.forced){popUI(this,-1);return;}
  if(press('a')){Snd.sfx('ok');const b=G.party[this.i];
    if(o.mode==='switch'){if(b.hp<=0){bsayQ('That bot is down!');return;}if(BT&&this.i===BT.pi){bsayQ('It\'s already out there!');return;}popUI(this,this.i);return;}
    if(o.mode==='item'){popUI(this,this.i);return;}
    partyOptions(this);}},
  draw(){ctx.fillStyle='#283850';ctx.fillRect(0,0,W,H);for(let i=0;i<20;i++){ctx.fillStyle='rgba(255,255,255,.03)';ctx.fillRect(0,i*16,W,8);}
    wtxt(o.mode==='switch'?'Choose a bot to send out':o.mode==='item'?'Use '+ITEMS[o.item].n+' on which bot?':'YOUR BOTS',16,24,'#fff',22);
    G.party.forEach((b,i)=>botRow(b,i<3?8:244,34+(i%3)*52+(i>=3?0:0),228,i===this.i,b.hp<=0));
    if(G.party.length>3){}
    const b=G.party[this.i];if(b){panel(8,192,464,124);const d=BOTS[b.id];txt(d.name,24,220,'#303840',24);typeBadges(d.types,24,228,1);
      txt('Sockets:',24,268,'#606870',20);drawSockets(b,100,252);txt(o.mode?'A: select   B: back':'A: options   B: close',24,304,'#808890',18);
      const s=stats(b);txt('ATK '+s.atk+' DEF '+s.def+' SPD '+s.spd,244,220,'#303840',19);b.moves.forEach((m,k)=>txt(MOVES[m.id].n,244+(k%2)*112,248+Math.floor(k/2)*22,TCOL[MOVES[m.id].t]==='#c8c8d4'?'#606870':shade(TCOL[MOVES[m.id].t],-0.35),19));}}});}
function drawSockets(b,x,y){const d=BOTS[b.id];for(let i=0;i<3;i++){const sx=x+i*34;const sh=b.shards[i];ctx.fillStyle='#384050';rr(sx,y,28,28,6);ctx.fill();
  if(sh){ptri(ctx,[sx+14,y+4,sx+24,y+14,sx+14,y+24,sx+4,y+14],TCOL[sh]);R(ctx,sx+11,y+9,3,3,'#fff');}
  else{const open=i===1?b.lv>=16:b.lv>=36;txt(open?'+':i===1?'16':'36',sx+14,y+20,open?'#80ff80':'#8890a0',open?24:16,'center',null);}}}
let bsayQ=t=>{UI.push({t:60,update(){if(--this.t<=0||press('a')||press('b'))popUI(this);},draw(){panel(100,140,280,50);txt(t,240,172,'#303840',20,'center');}});};

async function partyOptions(w){const b=G.party[w.i];const i=await choose(['Summary','Sockets','Module','Move','Cancel'],{x:330,y:110});
  if(i===0)await summary(w.i);
  else if(i===1){await socketMenu(b);}
  else if(i===2){await moduleMenu(b);}
  else if(i===3){const j=await pushUI(pickSlot(w.i));if(j!=null&&j>=0&&j!==w.i){const t=G.party[j];G.party[j]=G.party[w.i];G.party[w.i]=t;w.i=j;}}}
function pickSlot(from){return{i:from,update(){const n=G.party.length;if(rep('up')){this.i=(this.i+n-1)%n;}if(rep('down')){this.i=(this.i+1)%n;}if(press('a'))popUI(this,this.i);if(press('b'))popUI(this,-1);},
  draw(){panel(130,40,220,40+G.party.length*24);txt('Move to slot:',146,66);G.party.forEach((b,i)=>txt((i===this.i?'▶ ':'  ')+(i+1)+'. '+BOTS[b.id].name,150,90+i*24));}};}

function summary(idx){return pushUI({i:idx,update(){const n=G.party.length;if(rep('left')||rep('up')){this.i=(this.i+n-1)%n;Snd.sfx('blip');}if(rep('right')||rep('down')){this.i=(this.i+1)%n;Snd.sfx('blip');}if(press('a')||press('b'))popUI(this);},
  draw(){const b=G.party[this.i];const d=BOTS[b.id],s=stats(b);ctx.fillStyle='#1e2a40';ctx.fillRect(0,0,W,H);
    panel(8,8,190,200,'#e8f0f8');ctx.drawImage(bspr(b,{blink:TICK%200<6}),22,14,160,160);txt((b.glitch?'✦':'')+d.name,24,200,b.glitch?'#a020c0':'#303840',22);
    panel(206,8,266,200);txt('Lv '+b.lv,222,36,'#303840',22);typeBadges(d.types,290,20,1);
    txt('HP  '+b.hp+'/'+s.hp,222,62);txt('ATK '+s.atk,222,86);txt('DEF '+s.def,222,110);txt('SPD '+s.spd,222,134);
    txt('XP to next: '+Math.max(0,xpFor(b.lv+1)-b.xp),222,158,'#606870',20);txt('Module: '+(b.mod?ITEMS[b.mod].n:'none'),222,182,'#606870',18);
    txt('TRAIT',340,62,'#a06020',18);txt(trait(b).n,340,82,'#303840',18);wrap(trait(b).d,120,15).slice(0,4).forEach((l,i)=>txt(l,340,100+i*16,'#606870',15));
    panel(8,212,280,104);b.moves.forEach((m,k)=>{const mv=MOVES[m.id];typeBadges([mv.t],22,224+k*22,1);txt(mv.n,90,238+k*22,'#303840',20);txt(m.pp+'/'+mv.pp,276,238+k*22,'#606870',18,'right');});
    panel(292,212,180,104);txt('SOCKETS',306,236,'#303840',20);drawSockets(b,306,244);
    const br=d.stage===0&&d.branches?'Fits: '+Object.keys(d.branches).join('/'):d.shard?BOTS[d.frame].name+' + '+((b.refined||[]).includes(d.shard)?'Refined ':'')+d.shard:'';txt(br,306,288,'#606870',16);if(resonant(b))txt('RESONANCE: OD +25%',306,306,'#a040e0',14);
    wtxt('◀ ▶',W-40,20,'#fff',18);}});}

// ---------- bag ----------
const BAGCATS=[['med','MEDS'],['spike','SPIKES'],['shard','SHARDS'],['mod','MODS'],['mat','MATS'],['key','KEY']];
function openBag(inBattle){return pushUI({c:0,i:0,update(){const items=this.items();
   const NC=BAGCATS.length;if(rep('left')){this.c=(this.c+NC-1)%NC;this.i=0;Snd.sfx('blip');}if(rep('right')){this.c=(this.c+1)%NC;this.i=0;Snd.sfx('blip');}
   if(items.length){if(rep('up'))this.i=(this.i+items.length-1)%items.length;if(rep('down'))this.i=(this.i+1)%items.length;}
   if(press('b')){popUI(this,null);return;}
   if(press('a')&&items.length){const it=items[this.i];if(inBattle){popUI(this,it);return;}bagUse(it);}},
  items(){return Object.keys(G.bag).filter(k=>G.bag[k]>0&&ITEMS[k].cat===BAGCATS[this.c][0]);},
  draw(){ctx.fillStyle='#3a2a20';ctx.fillRect(0,0,W,H);BAGCATS.forEach(([k,n],i)=>{const x=6+i*78;panel(x,6,74,40,i===this.c?'#ffe8a0':'#d8d0c0');txt(n,x+37,34,'#303840',18,'center');});
   panel(8,52,464,186);const items=this.items();if(!items.length)txt('Nothing here.',30,90,'#808890');
   const off=Math.max(0,this.i-5);items.slice(off,off+7).forEach((k,j)=>{const i=j+off;const y=82+j*24;if(ITEMS[k].shard){ptri(ctx,[34,y-14,42,y-7,34,y,26,y-7],TCOL[ITEMS[k].shard]);}txt(ITEMS[k].n,52,y,'#303840');txt('x'+G.bag[k],440,y,'#606870',20,'right');if(i===this.i)ptri(ctx,[12,y-14,20,y-8,12,y-2],'#303840');});
   panel(8,242,464,74);const it=items[this.i];if(it){wrap(ITEMS[it].d,430,20).slice(0,2).forEach((l,i)=>txt(l,24,270+i*24,'#303840',20));}
   }});}
async function bagUse(it){const d=ITEMS[it];
  if(d.cat==='med'){const t=await openParty({mode:'item',item:it});if(t==null||t<0)return;const b=G.party[t];if(!canUse(it,b)){await say('It won\'t have any effect.');return;}useItemOn(it,b);Snd.sfx('item');await say(BOTS[b.id].name+' was patched up.');}
  else if(d.cat==='spike')await say('Use Link Spikes in battle against feral bots.');
  else if(d.cat==='shard')await say('Fit shards from BOTS → Sockets once a bot reaches Lv 16. Refine 3 of a kind at any Repair Station Forge.');
  else if(d.cat==='mod')await say('Equip modules from BOTS → pick a bot → Module.');
  else if(d.cat==='mat')await say(d.d);
  else await say(d.d);}

// ---------- shop ----------
async function openShop(list){G.busy=true;const r=await ask('Welcome! How can I help?',['Buy','Sell','Leave']);
  if(r===0){await pushUI({i:0,q:1,update(){const n=list.length;if(rep('up')){this.i=(this.i+n-1)%n;this.q=1;}if(rep('down')){this.i=(this.i+1)%n;this.q=1;}
      if(rep('right'))this.q=Math.min(99,this.q+1);if(rep('left'))this.q=Math.max(1,this.q-1);if(press('b'))popUI(this);
      if(press('a')){const it=list[this.i],c=ITEMS[it].price*this.q;if(G.money<c){Snd.sfx('wrong');bsayQ('Not enough Cr!');return;}G.money-=c;addItem(it,this.q);Snd.sfx('item');bsayQ('Bought '+this.q+'× '+ITEMS[it].n+'!');}},
    draw(){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);panel(20,16,440,220);txt('SHOP',40,44,'#303840',24);txt('Cr '+G.money,440,44,'#c08000',22,'right');
      list.forEach((it,i)=>{const y=76+i*26;txt(ITEMS[it].n,60,y);txt(ITEMS[it].price+' Cr',360,y,'#606870',20,'right');txt('own '+(G.bag[it]||0),440,y,'#909090',18,'right');if(i===this.i)ptri(ctx,[40,y-14,48,y-8,40,y-2],'#303840');});
      panel(20,240,440,76);const it=list[this.i];txt(ITEMS[it].d,36,268,'#303840',20);txt('◀ Qty: '+this.q+' ▶   Total: '+ITEMS[it].price*this.q+' Cr',36,296,'#c06000',20);}});}
  else if(r===1){await pushUI({i:0,update(){const ks=Object.keys(G.bag).filter(k=>ITEMS[k].price>0);const n=ks.length;if(n){if(rep('up'))this.i=(this.i+n-1)%n;if(rep('down'))this.i=(this.i+1)%n;}if(press('b'))popUI(this);
      if(press('a')&&n){const k=ks[Math.min(this.i,n-1)];G.bag[k]--;if(!G.bag[k])delete G.bag[k];G.money+=Math.floor(ITEMS[k].price/2);Snd.sfx('item');}},
    draw(){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);panel(20,16,440,290);txt('SELL (half price)',40,44,'#303840',24);txt('Cr '+G.money,440,44,'#c08000',22,'right');
      const ks=Object.keys(G.bag).filter(k=>ITEMS[k].price>0);if(!ks.length)txt('Nothing to sell.',60,80);ks.slice(0,9).forEach((k,i)=>{const y=76+i*26;txt(ITEMS[k].n+' x'+G.bag[k],60,y);txt(Math.floor(ITEMS[k].price/2)+' Cr',440,y,'#606870',20,'right');if(i===this.i)ptri(ctx,[40,y-14,48,y-8,40,y-2],'#303840');});}});}
  await say('Thanks! Come again!');G.busy=false;}

// ---------- storage ----------
async function openStorage(){G.busy=true;await say('Booted up the storage terminal.');
  while(true){const r=await ask('Storage: '+G.storage.length+' bots stored.',['Withdraw','Deposit','Log off']);
    if(r===0){if(!G.storage.length){await say('No bots in storage.');continue;}if(G.party.length>=6){await say('Your party is full.');continue;}
      const i=await ask('Withdraw which bot?',G.storage.slice(0,8).map(b=>BOTS[b.id].name+' Lv'+b.lv).concat(['Cancel']));if(i>=0&&i<Math.min(8,G.storage.length)){const b=G.storage.splice(i,1)[0];G.party.push(b);await say(BOTS[b.id].name+' joined your party.');}}
    else if(r===1){if(G.party.length<=1){await say('You can\'t deposit your last bot!');continue;}
      const i=await ask('Deposit which bot?',G.party.map(b=>BOTS[b.id].name+' Lv'+b.lv).concat(['Cancel']));if(i>=0&&i<G.party.length){const b=G.party.splice(i,1)[0];b.hp=stats(b).hp;b.st=null;b.moves.forEach(m=>m.pp=MOVES[m.id].pp);G.storage.push(b);await say(BOTS[b.id].name+' was stored and repaired.');}}
    else break;}
  G.busy=false;}

// ---------- bestiary ----------
function openDex(){return pushUI({i:0,detail:false,update(){const n=DEX_ORDER.length;
  if(this.detail){if(press('b')||press('a'))this.detail=false;if(rep('up')){this.i=(this.i+n-1)%n;}if(rep('down')){this.i=(this.i+1)%n;}return;}
  if(rep('up')){this.i=(this.i+n-1)%n;Snd.sfx('blip');}if(rep('down')){this.i=(this.i+1)%n;Snd.sfx('blip');}if(rep('left')){this.i=Math.max(0,this.i-8);}if(rep('right')){this.i=Math.min(n-1,this.i+8);}
  if(press('a')&&G.seen[DEX_ORDER[this.i]]){this.detail=true;Snd.sfx('ok');}if(press('b'))popUI(this);},
  draw(){ctx.fillStyle='#8a2020';ctx.fillRect(0,0,W,H);ctx.fillStyle='#a83030';for(let i=0;i<W;i+=24)ctx.fillRect(i,0,12,H);
    const id=DEX_ORDER[this.i];const d=BOTS[id];const sn=!!G.seen[id];
    panel(8,8,200,220,'#d8f0e0');ctx.drawImage(botSprite(id,!sn),24,20,168,168);txt(sn?d.name:'???',108,212,'#303840',22,'center');
    if(this.detail){panel(212,8,260,304);typeBadges(d.types,228,24,1);wrap(d.desc,228,20).forEach((l,i)=>txt(l,228,68+i*22,'#303840',20));
      txt('Trait: '+(TRAITS[d.frame]||{n:'?'}).n,228,180,'#a06020',18);
      if(d.branches){txt('Socket 2 branches:',228,204,'#606870',20);Object.entries(d.branches).forEach(([s,f],i)=>txt(s+' → '+(G.seen[f]?BOTS[f].name:'???'),236,226+i*22,shade(TCOL[s],-0.4),20));}
      else if(d.stage===1){txt('Frame: '+BOTS[d.frame].name,228,196,'#606870',20);txt('Shard: '+d.shard,228,218,'#606870',20);}
      return;}
    panel(212,8,260,304);const off=clamp(this.i-5,0,DEX_ORDER.length-11);
    for(let j=0;j<11;j++){const k=off+j;const id2=DEX_ORDER[k];if(!id2)break;const y=36+j*25;const s2=G.seen[id2];
      txt(String(k+1).padStart(3,'0'),232,y,'#808890',20);txt(s2?BOTS[id2].name:'-----',272,y,'#303840',20);if(G.caught[id2]){ctx.fillStyle='#e04040';ctx.beginPath();ctx.arc(444,y-6,5,0,7);ctx.fill();}
      if(k===this.i)ptri(ctx,[216,y-14,224,y-8,216,y-2],'#303840');}
    panel(8,232,200,80);const sc=Object.keys(G.seen).length,cc=Object.keys(G.caught).length;txt('SEEN   '+sc,24,258);txt('LINKED '+cc,24,280);txt('GLITCHED ✦ '+(G.glitchCaught||0),24,302,'#a020c0',18);}});}

// ---------- world map ----------
const MMCOL={',':'#4e7264','.':'#8fb0a2','=':'#c8ccd0','~':'#3a6890','b':'#7e6a5a','T':'#1c3a3c','R':'#8a4e50','Y':'#b08a48','Q':'#3c8088','W':'#dde2e8','D':'#ffd890','#':'#848c98','%':'#2c323c','^':'#6e7682','x':'#b8b4b0','X':'#4a4a52','K':'#000000','F':'#a8d8f4','f':'#8a7a70','s':'#a89078','l':'#8fb0a2','m':'#60c0ff','M':'#4a5868','r':'#c03030','u':'#3050d0','S':'#e0e040','e':'#c04040','c':'#b07a44','g':'#808080','P':'#d0a040','z':'#c07040','i':'#b8dcf0'};
function exploredArr(id){const m=MAPS[id];if(!G.explored[id])G.explored[id]=new Uint8Array(m.grid.length*m.grid[0].length);return G.explored[id];}
function openWorldMap(){const towns=Object.keys(MAPS).filter(k=>MAPS[k].town&&G.visited[k]);let ti=Math.max(0,towns.indexOf(G.map));
  return pushUI({i:ti,update(){if(towns.length){if(rep('left')||rep('up'))this.i=(this.i+towns.length-1)%towns.length;if(rep('right')||rep('down'))this.i=(this.i+1)%towns.length;}
     if(press('b')||press('map'))popUI(this,null);
     if(press('a')&&towns.length&&!BT){const t=towns[this.i];popUI(this,t);}},
   draw(){ctx.fillStyle='#0c1424';ctx.fillRect(0,0,W,H);const sc=4,ox=14,oy=24;
     for(let i=0;i<H;i+=20){ctx.fillStyle='rgba(60,100,160,.08)';ctx.fillRect(0,i,W,1);}
     let tot=0,ex=0;
     for(const id in MAPS){const m=MAPS[id];if(!m.world)continue;const e=exploredArr(id);const w=m.grid[0].length;
       for(let y=0;y<m.grid.length;y++)for(let x=0;x<w;x++){const ch=m.grid[y][x];tot++;const seen=e[y*w+x];if(seen)ex++;
         ctx.fillStyle=seen?(MMCOL[ch]||'#555'):'#141c2c';ctx.fillRect(ox+(m.world.x+x)*sc,oy+(m.world.y+y)*sc,sc,sc);}}
     for(const id in MAPS){const m=MAPS[id];if(!m.world||!G.visited[id])continue;const cx=ox+(m.world.x+m.grid[0].length/2)*sc,cy=oy+(m.world.y)*sc+10;
       wtxt(m.name,cx,cy+(m.town?0:m.grid.length*sc/2),m.town?'#ffe080':'#c0d0f0',m.town?20:16,'center');}
     const pm=G.lastOut;if(pm&&MAPS[pm.map].world&&TICK%30<20){const m=MAPS[pm.map];ctx.fillStyle='#fff';ctx.fillRect(ox+(m.world.x+pm.x)*sc-2,oy+(m.world.y+pm.y)*sc-2,sc+4,sc+4);ctx.fillStyle='#e04040';ctx.fillRect(ox+(m.world.x+pm.x)*sc,oy+(m.world.y+pm.y)*sc,sc,sc);}
     if(towns.length){const t=MAPS[towns[this.i]];ctx.strokeStyle=TICK%20<10?'#ffe080':'#fff';ctx.lineWidth=2;ctx.strokeRect(ox+t.world.x*sc-2,oy+t.world.y*sc-2,t.grid[0].length*sc+4,t.grid.length*sc+4);}
     darkPanel(0,0,W,22);wtxt('CALDERRA — '+Math.floor(ex/tot*100)+'% explored',8,17,'#fff',20);
     darkPanel(0,H-24,W,24);wtxt(BT?'B: close':towns.length?'◀ ▶ town   A: warp to '+MAPS[towns[this.i]].name+'   B: close':'B: close',8,H-7,'#c0d0f0',18);
     darkPanel(310,252,166,36);wtxt('Mt. Cinder ▲ north',320,276,'#ff9060',18);}});}

// ---------- start menu ----------
async function startMenu(){G.busy=true;
  while(true){const opts=['BOTS','BAG','PATCH ALL','BESTIARY','QUESTS','MAP','TYPES','CARD','SAVE','OPTIONS','CLOSE'];
    const i=await choose(opts,{x:356,y:4});const k=opts[i];
    if(k==='BOTS'){if(!G.party.length){await say('You don\'t have any bots yet.');continue;}await openParty({});}
    else if(k==='BAG')await openBag(false);
    else if(k==='PATCH ALL')await patchAll();
    else if(k==='BESTIARY')await openDex();
    else if(k==='QUESTS')await openQuests();
    else if(k==='MAP'){const t=await openWorldMap();if(t){await warpTown(t);break;}}
    else if(k==='TYPES')await openTypeChart();
    else if(k==='CARD')await pushUI(cardW());
    else if(k==='SAVE'){await saveMenu();}
    else if(k==='OPTIONS'){const r=await optionsMenu();if(r==='loaded')break;}
    else break;}
  G.busy=false;}
function cardW(){return{update(){if(press('a')||press('b'))popUI(this);},draw(){panel(40,30,400,260,'#e8f0ff');txt('NAVI-BAND ID',60,62,'#303840',24);
  ctx.drawImage(charSprite('player','down',0),330,50,64,72);txt('NAME   '+G.name,60,100);txt('CREDITS '+G.money+' Cr',60,128);
  txt('LINKED '+Object.keys(G.caught).length+'   SEEN '+Object.keys(G.seen).length,60,156);txt('TIME   '+fmtTime(G.time),60,184);
  txt('PRIME SHARDS',60,220,'#606870');['prime1','prime2'].forEach((p,i)=>{const has=G.bag[p];const x=200+i*40;ptri(ctx,[x,206,x+12,218,x,230,x-12,218],has?(i?TCOL.Volt:TCOL.Stone):'#a0a8b8');});
  for(let i=2;i<8;i++){const x=200+i*40;if(x>420)break;ptri(ctx,[x,206,x+12,218,x,230,x-12,218],'#c8ccd8');}
  txt('Chapter 1: The Relay Road',60,268,'#a06020',20);}};}
function fmtTime(t){const s=Math.floor(t/60);return Math.floor(s/3600)+':'+String(Math.floor(s/60)%60).padStart(2,'0');}
async function optionsMenu(){let def=0;while(true){const skins=Object.keys(G.skins||{classic:1});
  const opts=['Text speed: '+['','Slow','Normal','Fast'][TEXTSPEED],'Battle speed: '+(G.bspeed||1)+'x','Battle animations: '+(G.skipFx?'Short':'Full'),'Running: '+(G.alwaysRun?'Always (B walks)':'Hold B'),
    'Music & sound: '+(Snd.on?'On':'Off'),'Minimap: '+(G.minimap?'On':'Off'),'Band skin: '+(G.skin||'classic'),'Phone buttons: '+(G.bigBtn?'Big':'Normal'),'Button opacity: '+Math.round((G.padOp||1)*100)+'%',
    'Button layout: '+(G.lefty?'Left-handed':'Right-handed'),'Vibration: '+(G.haptic?'On':'Off'),'Export save code','Import save code','Back'];
  const i=await choose(opts,{x:150,y:2,def});def=Math.max(0,i);
  if(i===0)TEXTSPEED=TEXTSPEED%3+1;else if(i===1)G.bspeed=(G.bspeed||1)===1?2:1;else if(i===2)G.skipFx=!G.skipFx;else if(i===3)G.alwaysRun=!G.alwaysRun;
  else if(i===4)Snd.toggle();else if(i===5)G.minimap=!G.minimap;else if(i===6){const k=skins.indexOf(G.skin||'classic');G.skin=skins[(k+1)%skins.length];if(skins.length<2)await say('More skins unlock as you fill the Bestiary.');}
  else if(i===7)G.bigBtn=!G.bigBtn;else if(i===8){const v=[1,0.75,0.5,0.3];G.padOp=v[(v.indexOf(G.padOp||1)+1)%v.length];}else if(i===9)G.lefty=!G.lefty;else if(i===10)G.haptic=!G.haptic;
  else if(i===11){if(!G.started){await say('Start or load a game first.');continue;}await saveCodeOverlay('export');}
  else if(i===12){const d=await saveCodeOverlay('import');if(d){loadSave(d);savePrefs();applyPadPrefs();await say('Save code loaded!');return 'loaded';}}
  else{savePrefs();applyPadPrefs();return;}
  savePrefs();applyPadPrefs();}}

// ---------- save / load ----------
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}
function serialize(){const ex={};for(const k in G.explored)ex[k]=Array.from(G.explored[k]).join('');
  return JSON.stringify({v:1,name:G.name,map:G.map,px:G.px,py:G.py,pdir:G.pdir,party:G.party,storage:G.storage,bag:G.bag,money:G.money,flags:G.flags,seen:G.seen,caught:G.caught,explored:ex,time:G.time,lastHeal:G.lastHeal,visited:G.visited,starter:G.starter,rival:G.rival,minimap:G.minimap,ts:TEXTSPEED,lastOut:G.lastOut,quests:G.quests||{},skins:G.skins||{classic:1},glitchCaught:G.glitchCaught||0});}
function slotInfo(i){const s=lsGet('shardfall_slot'+i)||lsGet('wildbound_slot'+i);if(!s)return null;try{return JSON.parse(s);}catch(e){return null;}}
async function saveMenu(){const opts=[0,1,2].map(i=>{const s=slotInfo(i);return 'Slot '+(i+1)+': '+(s?s.name+' · '+(MAPS[s.map]?MAPS[s.map].name:'')+' · '+fmtTime(s.time):'— empty —');});opts.push('Cancel');
  const i=await choose(opts,{x:40,y:40});if(i<0||i>2)return;if(slotInfo(i)){const c=await ask('Overwrite slot '+(i+1)+'?');if(c!==0)return;}
  if(lsSet('shardfall_slot'+i,serialize())){Snd.sfx('item');await say('Game saved to slot '+(i+1)+'!');}else await say('Saving isn\'t available in this browser.');}
function loadSave(d){G.name=d.name;G.party=d.party;G.storage=d.storage||[];G.bag=d.bag;G.money=d.money;G.flags=d.flags;G.seen=d.seen;G.caught=d.caught;G.time=d.time||0;G.lastHeal=d.lastHeal;G.visited=d.visited||{};G.starter=d.starter;G.rival=d.rival;G.minimap=d.minimap!==false;TEXTSPEED=d.ts||TEXTSPEED;G.lastOut=d.lastOut;G.quests=d.quests||{};G.skins=d.skins||{classic:1};G.glitchCaught=d.glitchCaught||0;BT=null;UI.length=0;G.busy=false;
  G.explored={};for(const k in d.explored){if(!MAPS[k])continue;const a=exploredArr(k);const s=d.explored[k];for(let i=0;i<a.length&&i<s.length;i++)a[i]=s[i]==='1'?1:0;}
  loadMap(d.map,d.px,d.py,d.pdir);}

// ---------- title / intro ----------
function titleW(){return{t:0,i:0,update(){this.t++;const opts=this.opts();if(rep('up'))this.i=(this.i+opts.length-1)%opts.length;if(rep('down'))this.i=(this.i+1)%opts.length;if(press('a')||press('start')){Snd.sfx('ok');popUI(this,opts[this.i]);}},
  opts(){const o=[];if([0,1,2].some(i=>slotInfo(i))||lsGet('shardfall_auto'))o.push('Continue');o.push('New Game');return o;},
  draw(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#060a16');g.addColorStop(0.6,'#1e2e4a');g.addColorStop(1,'#4a6a8e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#141c2c';ctx.beginPath();ctx.moveTo(130,240);ctx.lineTo(240,118);ctx.lineTo(350,240);ctx.fill();ctx.fillStyle='#d8e4f0';ctx.beginPath();ctx.moveTo(214,147);ctx.lineTo(240,118);ctx.lineTo(266,147);ctx.lineTo(252,141);ctx.lineTo(240,150);ctx.lineTo(228,140);ctx.fill();const fl=0.35+0.25*Math.abs(Math.sin(this.t/23))*(Math.random()<0.95?1:0.2);ctx.fillStyle='rgba(255,140,60,'+fl+')';ctx.beginPath();ctx.arc(240,122,5,0,7);ctx.fill();ctx.fillStyle='rgba(255,140,60,'+fl*0.25+')';ctx.beginPath();ctx.arc(240,122,16,0,7);ctx.fill();
    drawSnow(0,0,0.4,0.3);
    ctx.fillStyle='#0c1220';ctx.fillRect(0,240,W,80);ctx.fillStyle='#c8d6e4';ctx.fillRect(0,240,W,3);
    const bots=['flicker','drizzlet','thornbit','boltbun','gloomlamp','pebblit'];bots.forEach((b,i)=>{const x=((i*90+this.t)%(W+80))-60;ctx.drawImage(botSprite(b),x,196+Math.abs(Math.sin((this.t+i*20)/8))*-6,60,60);});
    ctx.font='64px '+FONT;wtxt('SHARDFALL',W/2,80,'#d8ecff',64,'center');wtxt('~ Ember Protocol ~',W/2,108,'#ff9a5a',24,'center');
    this.opts().forEach((o,i)=>{wtxt((i===this.i?'▶ ':'  ')+o,W/2-50,278+i*24,i===this.i?'#fff':'#7a8aa8',24);});
    wtxt('Chapter 1: The Relay Road',W-8,H-6,'#5a6a88',16,'right');}};}
async function nameEntry(){return new Promise(res=>{const ov=document.getElementById('nameov');const inp=document.getElementById('namein');ov.style.display='flex';inp.value='';setTimeout(()=>inp.focus(),50);
  const done=()=>{const v=(inp.value||'').trim().slice(0,10)||'Rook';ov.style.display='none';document.getElementById('nameok').onclick=null;inp.onkeydown=null;inp.blur();res(v);};
  document.getElementById('nameok').onclick=done;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();done();}};});}
function storyW(lines){return{i:0,t:0,update(){this.t++;if((press('a')||press('start'))&&this.t>20){this.i++;this.t=0;Snd.sfx('blip');if(this.i>=lines.length)popUI(this);}if(press('b'))popUI(this);},
  draw(){ctx.fillStyle='#06060c';ctx.fillRect(0,0,W,H);const l=lines[Math.min(this.i,lines.length-1)];ctx.globalAlpha=Math.min(1,this.t/30);
    wrap(l,400,26).forEach((s,k,a)=>wtxt(s,W/2,H/2-((a.length-1)*16)+k*32,'#f0e0d0',26,'center'));ctx.globalAlpha=1;if(this.t>30&&TICK%40<26)wtxt('▼',W/2,H-30,'#ff9040',20,'center');}};}
async function chapterEnd(){G.busy=true;Snd.music('title',true);
  await pushUI({t:0,update(){this.t++;if(this.t>60&&(press('a')||press('start')))popUI(this);},draw(){ctx.fillStyle='#0a0610';ctx.fillRect(0,0,W,H);ctx.globalAlpha=Math.min(1,this.t/40);
    wtxt('CHAPTER 1 COMPLETE',W/2,70,'#ffd060',40,'center');wtxt('The Relay Road',W/2,104,'#ffb080',26,'center');
    wtxt('Time: '+fmtTime(G.time)+'    Linked bots: '+Object.keys(G.caught).length+'    Prime Shards: 2/8',W/2,160,'#e0d0c0',20,'center');
    G.party.slice(0,6).forEach((b,i)=>ctx.drawImage(botSprite(b.id),W/2-150+i*50,176,48,48));
    wtxt('Next: Chapter 2 — The Rustworks',W/2,260,'#9ac0ff',22,'center');wtxt('Kael. The Cantor. Whatever sleeps under Mt. Cinder.',W/2,284,'#8090a0',18,'center');
    ctx.globalAlpha=1;if(this.t>60&&TICK%40<26)wtxt('Press A to keep exploring',W/2,310,'#ff9040',16,'center');}});
  Snd.music(curMap().music,true);setFlag('ch1done');const r=await ask('Save your progress?');if(r===0)await saveMenu();G.busy=false;}

// ---------- memory terminal ----------
async function memoryTerminal(pz){G.busy=true;if(flag(pz.flag)){await say('The terminal shows: CACHE UNLOCKED.');G.busy=false;return;}
  await say('A Maker terminal. Text flickers on screen: "REPEAT THE SIGNAL TO UNSEAL THE CACHE."');
  const r=await ask('Start the sequence?');if(r!==0){G.busy=false;return;}
  for(const len of [4,6]){const seq=Array.from({length:len},()=>pick(['up','right','down','left']));const ok=await pushUI(memoryW(seq));
    if(!ok){Snd.sfx('wrong');await say('ERROR. The signal resets. Try again any time.');G.busy=false;return;}Snd.sfx('ok');}
  setFlag(pz.flag);Snd.sfx('item');await say('SIGNAL ACCEPTED. Somewhere nearby, a heavy lock clanks open.');G.busy=false;}
function memoryW(seq){return{t:0,phase:'show',k:0,lit:null,inp:0,flash:0,
  update(){this.t++;if(this.phase==='show'){const per=34;const idx=Math.floor((this.t-30)/per);if(this.t<30){this.lit=null;return;}
      if(idx>=seq.length){this.phase='input';this.lit=null;return;}const ph=(this.t-30)%per;this.lit=ph<24?seq[idx]:null;if(ph===0)Snd.tone&&Snd.ac&&Snd.tone(nfreq({up:'C5',right:'E5',down:'G5',left:'B5'}[seq[idx]]),Snd.ac.currentTime,0.2,'square',0.06);}
    else{if(this.flash>0){this.flash--;if(this.flash===0)this.lit=null;}
      for(const d of ['up','right','down','left'])if(press(d)){this.lit=d;this.flash=12;if(Snd.ac)Snd.tone(nfreq({up:'C5',right:'E5',down:'G5',left:'B5'}[d]),Snd.ac.currentTime,0.15,'square',0.06);
        if(d!==seq[this.inp]){popUI(this,false);return;}this.inp++;if(this.inp>=seq.length){this.phase='done';this.t=0;}}}
    if(this.phase==='done'&&this.t>20)popUI(this,true);},
  draw(){ctx.fillStyle='rgba(0,10,20,.85)';ctx.fillRect(0,0,W,H);panel(120,20,240,280,'#102030');
    const pos={up:[240,90],right:[310,160],down:[240,230],left:[170,160]};const col={up:'#40e0ff',right:'#ffd040',down:'#60f080',left:'#ff6080'};
    for(const d in pos){const [x,y]=pos[d];ctx.fillStyle=this.lit===d?col[d]:shade(col[d],-0.7);ctx.beginPath();ctx.arc(x,y,30,0,7);ctx.fill();
      const ar={up:[x,y-14,x+12,y+8,x-12,y+8],down:[x,y+14,x+12,y-8,x-12,y-8],left:[x-14,y,x+8,y-12,x+8,y+12],right:[x+14,y,x-8,y-12,x-8,y+12]}[d];ptri(ctx,ar,this.lit===d?'#fff':'#304050');}
    wtxt(this.phase==='show'?'WATCH...':this.phase==='input'?'REPEAT: '+this.inp+'/'+seq.length:'OK!',240,48,'#a0e0ff',22,'center');
    wtxt('Use the D-pad',240,290,'#6080a0',16,'center');}};}
