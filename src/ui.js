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

async function partyOptions(w){const b=G.party[w.i];const i=await choose(['Summary','Sockets','Parts','Module','Move','Cancel'],{x:330,y:100});
  if(i===0)await summary(w.i);
  else if(i===1){await socketMenu(b);}
  else if(i===2){await partsMenu(b);}
  else if(i===3){await moduleMenu(b);}
  else if(i===4){const j=await pushUI(pickSlot(w.i));if(j!=null&&j>=0&&j!==w.i){const t=G.party[j];G.party[j]=G.party[w.i];G.party[w.i]=t;w.i=j;}}}
function pickSlot(from){return{i:from,update(){const n=G.party.length;if(rep('up')){this.i=(this.i+n-1)%n;}if(rep('down')){this.i=(this.i+1)%n;}if(press('a'))popUI(this,this.i);if(press('b'))popUI(this,-1);},
  draw(){panel(130,40,220,40+G.party.length*24);txt('Move to slot:',146,66);G.party.forEach((b,i)=>txt((i===this.i?'▶ ':'  ')+(i+1)+'. '+BOTS[b.id].name,150,90+i*24));}};}

function summary(idx){return pushUI({i:idx,update(){const n=G.party.length;if(rep('left')||rep('up')){this.i=(this.i+n-1)%n;Snd.sfx('blip');}if(rep('right')||rep('down')){this.i=(this.i+1)%n;Snd.sfx('blip');}if(press('a')||press('b'))popUI(this);},
  draw(){const b=G.party[this.i];const d=BOTS[b.id],s=stats(b);ctx.fillStyle='#1e2a40';ctx.fillRect(0,0,W,H);
    panel(8,8,190,200,'#e8f0f8');ctx.drawImage(bspr(b,{blink:TICK%200<6}),22,14,160,160);drawParts(b,22,14,160,false);txt((b.glitch?'✦':'')+d.name,24,200,b.glitch?'#a020c0':'#303840',22);
    panel(206,8,266,200);txt('Lv '+b.lv,222,36,'#303840',22);typeBadges(d.types,290,20,1);
    txt('HP  '+b.hp+'/'+s.hp,222,62);txt('ATK '+s.atk,222,86);txt('DEF '+s.def,222,110);txt('SPD '+s.spd,222,134);
    txt('XP to next: '+Math.max(0,xpFor(b.lv+1)-b.xp),222,158,'#606870',20);txt('Module: '+(b.mod?ITEMS[b.mod].n:'none'),222,176,'#606870',16);const pp=b.parts||{};txt('Parts: '+(['arm','core','leg'].map(s=>pp[s]?PARTS[pp[s]].n:'—').join(' · ')),222,194,'#606870',14);
    txt('TRAIT',340,62,'#a06020',18);txt(trait(b).n,340,82,'#303840',18);wrap(trait(b).d,120,15).slice(0,4).forEach((l,i)=>txt(l,340,100+i*16,'#606870',15));
    panel(8,212,280,104);knownMoves(b).slice(0,4).forEach((id,k)=>{const mv=MOVES[id];typeBadges([moveType(b,id)],22,224+k*22,1);txt((partMoves(b).includes(id)?'◆':'')+mv.n,90,238+k*22,'#303840',20);txt(moveType(b,id)==='Frost'?'cool':'+'+Math.round(Math.round(mv.p?mv.p/4+4:8)*(moveType(b,id)==='Flame'?1.4:moveType(b,id)==='Tide'?0.8:1)*partHeat(b))+'°',276,238+k*22,'#c06020',16,'right');});
    panel(292,212,180,104);txt('SOCKETS',306,236,'#303840',20);drawSockets(b,306,244);
    const br=d.stage===0&&d.branches?'Fits: '+Object.keys(d.branches).join('/'):d.shard?BOTS[d.frame].name+' + '+((b.refined||[]).includes(d.shard)?'Refined ':'')+d.shard:'';txt(br,306,288,'#606870',16);if(resonant(b))txt('RESONANCE: OD +25%',306,306,'#a040e0',14);
    wtxt('◀ ▶',W-40,20,'#fff',18);}});}

// ---------- bag ----------
const BAGCATS=[['med','MEDS'],['spike','SPIKES'],['shard','SHARDS'],['part','PARTS'],['mod','MODS'],['mat','MATS'],['key','KEY']];
function openBag(inBattle){return pushUI({c:0,i:0,update(){const items=this.items();
   const NC=BAGCATS.length;if(rep('left')){this.c=(this.c+NC-1)%NC;this.i=0;Snd.sfx('blip');}if(rep('right')){this.c=(this.c+1)%NC;this.i=0;Snd.sfx('blip');}
   if(items.length){if(rep('up'))this.i=(this.i+items.length-1)%items.length;if(rep('down'))this.i=(this.i+1)%items.length;}
   if(press('b')){popUI(this,null);return;}
   if(press('a')&&items.length){const it=items[this.i];if(inBattle){popUI(this,it);return;}bagUse(it);}},
  items(){return Object.keys(G.bag).filter(k=>G.bag[k]>0&&ITEMS[k].cat===BAGCATS[this.c][0]);},
  draw(){ctx.fillStyle='#3a2a20';ctx.fillRect(0,0,W,H);BAGCATS.forEach(([k,n],i)=>{const x=4+i*67;panel(x,6,64,40,i===this.c?'#ffe8a0':'#d8d0c0');txt(n,x+32,34,'#303840',16,'center');});
   panel(8,52,464,186);const items=this.items();if(!items.length)txt('Nothing here.',30,90,'#808890');
   const off=Math.max(0,this.i-5);items.slice(off,off+7).forEach((k,j)=>{const i=j+off;const y=82+j*24;if(ITEMS[k].shard){ptri(ctx,[34,y-14,42,y-7,34,y,26,y-7],TCOL[ITEMS[k].shard]);}txt(ITEMS[k].n,52,y,'#303840');txt('x'+G.bag[k],440,y,'#606870',20,'right');if(i===this.i)ptri(ctx,[12,y-14,20,y-8,12,y-2],'#303840');});
   panel(8,242,464,74);const it=items[this.i];if(it){wrap(ITEMS[it].d,430,20).slice(0,2).forEach((l,i)=>txt(l,24,270+i*24,'#303840',20));}
   }});}
async function bagUse(it){const d=ITEMS[it];
  if(d.cat==='med'){const t=await openParty({mode:'item',item:it});if(t==null||t<0)return;const b=G.party[t];if(!canUse(it,b)){await say('It won\'t have any effect.');return;}useItemOn(it,b);Snd.sfx('item');await say(BOTS[b.id].name+' was patched up.');}
  else if(d.cat==='spike')await say('Use Link Spikes in battle against feral bots.');
  else if(d.cat==='shard')await say('Fit shards from BOTS → Sockets once a bot reaches Lv 16. Refine 3 of a kind at any Repair Caravan Forge.');
  else if(d.cat==='mod')await say('Equip modules from BOTS → pick a bot → Module.');
  else if(d.cat==='part')await say('Fit parts from BOTS → pick a bot → Parts. '+d.d);
  else if(d.cat==='mat')await say(d.d);
  else await say(d.d);}

// ---------- shop ----------
function priceOf(it){return Math.floor(ITEMS[it].price*(G.rep&&G.rep.w>=2?0.9:1));}
async function openShop(list){G.busy=true;const r=await ask(pick(['Trader Mags. Cr or scrap, I take both. What\'ll it be?','Mags\' trading post. Short on Cr? Scrap spends too.','Back for more? I\'ve got wire, cells and spikes.']),['Buy','Sell','Leave']);
  if(r===0){await pushUI({i:0,q:1,update(){const n=list.length;if(rep('up')){this.i=(this.i+n-1)%n;this.q=1;}if(rep('down')){this.i=(this.i+1)%n;this.q=1;}
      if(rep('right'))this.q=Math.min(99,this.q+1);if(rep('left'))this.q=Math.max(1,this.q-1);if(press('b'))popUI(this);
      if(press('a')){const it=list[this.i],c=priceOf(it)*this.q;if(G.money<c){const need=Math.ceil((c-G.money)/50);if((G.bag.scrap||0)>=need){G.bag.scrap-=need;if(!G.bag.scrap)delete G.bag.scrap;G.money=0;addItem(it,this.q);Snd.sfx('item');bsayQ('Bartered! Paid your Cr plus '+need+' Scrap.');return;}Snd.sfx('wrong');bsayQ('Not enough Cr or Scrap!');return;}G.money-=c;addItem(it,this.q);Snd.sfx('item');bsayQ('Bought '+this.q+'× '+ITEMS[it].n+'!');}},
    draw(){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,W,H);panel(20,16,440,220);txt('SCRAP TRADER',40,44,'#303840',24);txt('Scrap '+(G.bag.scrap||0)+' (50 Cr each)',250,44,'#707880',16);txt('Cr '+G.money,440,44,'#c08000',22,'right');
      if(G.rep&&G.rep.w>=2)txt('−10%',220,44,'#2070a0',16);list.forEach((it,i)=>{const y=76+i*26;txt(ITEMS[it].n,60,y);txt(priceOf(it)+' Cr',360,y,'#606870',20,'right');txt('own '+(G.bag[it]||0),440,y,'#909090',18,'right');if(i===this.i)ptri(ctx,[40,y-14,48,y-8,40,y-2],'#303840');});
      panel(20,240,440,76);const it=list[this.i];txt(ITEMS[it].d,36,268,'#303840',20);txt('◀ Qty: '+this.q+' ▶   Total: '+priceOf(it)*this.q+' Cr',36,296,'#c06000',20);}});}
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
      const rs=(G.scan&&G.scan[id])||0;const known=rs>=2||G.caught[id];txt('Research '+Math.min(3,rs)+'/3'+(G.caught[id]?' · linked':''),228,160,'#2070a0',16);txt('Trait: '+(known?(TRAITS[d.frame]||{n:'?'}).n:'??? (scan 2/3)'),228,180,'#a06020',18);if(rs>=3)txt('Weak to: '+TYPES.filter(t=>typeEff(t,d.types)>1).join(', '),228,300,'#c04030',15);
      if(d.branches&&(known)){txt('Socket 2 branches:',228,204,'#606870',20);Object.entries(d.branches).forEach(([s,f],i)=>txt(s+' → '+(G.seen[f]?BOTS[f].name:'???'),236,226+i*22,shade(TCOL[s],-0.4),20));}
      else if(d.stage===1){txt('Frame: '+BOTS[d.frame].name,228,196,'#606870',20);txt('Shard: '+d.shard,228,218,'#606870',20);}
      return;}
    panel(212,8,260,304);const off=clamp(this.i-5,0,DEX_ORDER.length-11);
    for(let j=0;j<11;j++){const k=off+j;const id2=DEX_ORDER[k];if(!id2)break;const y=36+j*25;const s2=G.seen[id2];
      txt(String(k+1).padStart(3,'0'),232,y,'#808890',20);txt(s2?BOTS[id2].name:'-----',272,y,'#303840',20);if(G.caught[id2]){ctx.fillStyle='#e04040';ctx.beginPath();ctx.arc(444,y-6,5,0,7);ctx.fill();}
      if(k===this.i)ptri(ctx,[216,y-14,224,y-8,216,y-2],'#303840');}
    panel(8,232,200,80);const sc=Object.keys(G.seen).length,cc=Object.keys(G.caught).length;txt('SEEN   '+sc,24,258);txt('LINKED '+cc,24,280);txt('GLITCHED ✦ '+(G.glitchCaught||0),24,302,'#a020c0',18);}});}

// ---------- world map ----------
const MMCOL={'j':'#7a7a74','q':'#5aa8c8','y':'#6a6a9a','w':'#b4c4c8','d':'#e8eef4','-':'#a8cce0','G':'#4a4650','H':'#8a8690','C':'#0c1220','B':'#c8c0b0','A':'#c8c0b0','N':'#2a3240','J':'#40c0d0','Z':'#4e5662','0':'#3a4250',',':'#4e7264','.':'#8fb0a2','=':'#c8ccd0','~':'#3a6890','b':'#7e6a5a','T':'#1c3a3c','R':'#8a4e50','Y':'#b08a48','Q':'#3c8088','W':'#dde2e8','D':'#ffd890','#':'#848c98','%':'#2c323c','^':'#6e7682','x':'#b8b4b0','X':'#4a4a52','K':'#000000','F':'#a8d8f4','f':'#8a7a70','s':'#a89078','l':'#8fb0a2','m':'#60c0ff','M':'#4a5868','r':'#c03030','u':'#3050d0','S':'#e0e040','e':'#c04040','c':'#b07a44','g':'#808080','P':'#d0a040','z':'#c07040','i':'#b8dcf0','n':'#eef4f8','E':'#40c0a0','O':'#e0a040','p':'#5a6676','a':'#e06030','o':'#ff7a30'};
function exploredArr(id){const m=MAPS[id];if(!G.explored[id])G.explored[id]=new Uint8Array(m.grid.length*m.grid[0].length);return G.explored[id];}
function openWorldMap(){const towns=Object.keys(MAPS).filter(k=>MAPS[k].town&&G.visited[k]);let ti=Math.max(0,towns.indexOf(G.map));
  return pushUI({i:ti,update(){if(towns.length){if(rep('left')||rep('up'))this.i=(this.i+towns.length-1)%towns.length;if(rep('right')||rep('down'))this.i=(this.i+1)%towns.length;}
     if(press('b')||press('map'))popUI(this,null);
     if(press('a')&&towns.length&&!BT){const t=towns[this.i];popUI(this,t);}},
   draw(){ctx.fillStyle='#0c1424';ctx.fillRect(0,0,W,H);let mxX=0,mxY=0;for(const id in MAPS){const m=MAPS[id];if(!m.world)continue;if(!G.visited[id]&&!exploredArr(id).some(v=>v))continue;mxX=Math.max(mxX,m.world.x+m.grid[0].length);mxY=Math.max(mxY,m.world.y+m.grid.length);}
     const sc=Math.max(1.6,Math.min(4,(W-28)/Math.max(60,mxX),(H-56)/Math.max(40,mxY))),ox=14,oy=26;
     for(let i=0;i<H;i+=20){ctx.fillStyle='rgba(60,100,160,.08)';ctx.fillRect(0,i,W,1);}
     let tot=0,ex=0;
     for(const id in MAPS){const m=MAPS[id];if(!m.world)continue;const e=exploredArr(id);const w=m.grid[0].length;
       for(let y=0;y<m.grid.length;y++)for(let x=0;x<w;x++){const ch=m.grid[y][x];tot++;const seen=e[y*w+x];if(seen)ex++;
         ctx.fillStyle=seen?(thawed(id)&&',.TF'.includes(ch)?{',':'#4e7a5a','.':'#7a9a74','T':'#2a4a3a','F':'#c8a070'}[ch]:(MMCOL[ch]||'#555')):'#141c2c';ctx.fillRect(ox+(m.world.x+x)*sc,oy+(m.world.y+y)*sc,sc,sc);}}
     for(const id in MAPS){const m=MAPS[id];if(!m.world||!G.visited[id])continue;const cx=ox+(m.world.x+m.grid[0].length/2)*sc,cy=oy+(m.world.y)*sc+(sc<3?6:10);
       wtxt(m.name,cx,cy+(m.town?0:m.grid.length*sc/2),m.town?'#ffe080':'#c0d0f0',m.town?20:16,'center');}
     const pm=G.lastOut;if(pm&&MAPS[pm.map].world&&TICK%30<20){const m=MAPS[pm.map];ctx.fillStyle='#fff';ctx.fillRect(ox+(m.world.x+pm.x)*sc-2,oy+(m.world.y+pm.y)*sc-2,sc+4,sc+4);ctx.fillStyle='#e04040';ctx.fillRect(ox+(m.world.x+pm.x)*sc,oy+(m.world.y+pm.y)*sc,sc,sc);}
     if(towns.length){const t=MAPS[towns[this.i]];ctx.strokeStyle=TICK%20<10?'#ffe080':'#fff';ctx.lineWidth=2;ctx.strokeRect(ox+t.world.x*sc-2,oy+t.world.y*sc-2,t.grid[0].length*sc+4,t.grid.length*sc+4);}
     darkPanel(0,0,W,22);wtxt('CALDERRA — '+Math.floor(ex/tot*100)+'% explored',8,17,'#fff',20);
     darkPanel(0,H-24,W,24);wtxt(BT?'B: close':towns.length?'◀ ▶ town   A: warp to '+MAPS[towns[this.i]].name+'   B: close':'B: close',8,H-7,'#c0d0f0',18);
     darkPanel(300,252,176,36);wtxt('Mt. Cinder ▲ far south',310,276,'#ff9060',16);}});}

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
  txt('PRIMES',60,220,'#606870');const PC=[TCOL.Stone,TCOL.Volt,TCOL.Iron,TCOL.Flame];for(let i=0;i<8;i++){const x=160+i*32;const has=i<4&&G.bag['prime'+(i+1)];ptri(ctx,[x,208,x+10,218,x,228,x-10,218],has?PC[i]:'#c8ccd8');}
  txt(flag('ch2start')?'Chapter 2: The Rustworks':'Chapter 1: The Relay Road',60,238,'#a06020',16);
  const rep=G.rep||{w:0,c:0};const lean=rep.w>rep.c?'leaning Warden':rep.c>rep.w?'leaning Choir':'undecided';const k=G.kael||0;
  txt('Allegiance: '+lean+' ('+rep.w+'W / '+rep.c+'C)',60,256,'#2a5a8a',18);txt('Kael: '+(flag('kaelChoir')?'Choir':k>=2?'friend':k>=0?'rival':'bitter rival')+'   Thaw: '+thawCount()+'/10   Vault best: B'+(G.vaultBest||0),60,276,'#606870',16);}};}
function fmtTime(t){const s=Math.floor(t/60);return Math.floor(s/3600)+':'+String(Math.floor(s/60)%60).padStart(2,'0');}
async function optionsMenu(){let def=0;while(true){const skins=Object.keys(G.skins||{classic:1});
  const opts=['Text speed: '+['','Slow','Normal','Fast'][TEXTSPEED],'Battle speed: '+(G.bspeed||1)+'x','Battle animations: '+(G.skipFx?'Short':'Full'),'Running: '+(G.alwaysRun?'Always (B walks)':'Hold B'),
    'Music & sound: '+(Snd.on?'On':'Off'),'Minimap: '+(G.minimap?'On':'Off'),'Band skin: '+(G.skin||'classic'),'Phone buttons: '+(G.bigBtn?'Big':'Normal'),'Button opacity: '+Math.round((G.padOp||1)*100)+'%',
    'Button layout: '+(G.lefty?'Left-handed':'Right-handed'),'Vibration: '+(G.haptic?'On':'Off'),'Visual effects: '+(G.fxq===0?'Low (faster)':G.fxq===1?'High':'Auto'+(G.autoLow?' (Low now)':'')),'Export save code','Import save code','Back'];
  const i=await choose(opts,{x:150,y:2,def});def=Math.max(0,i);
  if(i===0)TEXTSPEED=TEXTSPEED%3+1;else if(i===1)G.bspeed=(G.bspeed||1)===1?2:1;else if(i===2)G.skipFx=!G.skipFx;else if(i===3)G.alwaysRun=!G.alwaysRun;
  else if(i===4)Snd.toggle();else if(i===5)G.minimap=!G.minimap;else if(i===6){const k=skins.indexOf(G.skin||'classic');G.skin=skins[(k+1)%skins.length];if(skins.length<2)await say('More skins unlock as you fill the Bestiary.');}
  else if(i===7)G.bigBtn=!G.bigBtn;else if(i===8){const v=[1,0.75,0.5,0.3];G.padOp=v[(v.indexOf(G.padOp||1)+1)%v.length];}else if(i===9)G.lefty=!G.lefty;else if(i===10)G.haptic=!G.haptic;else if(i===11){G.fxq=G.fxq===1?0:G.fxq===0?2:1;G.autoLow=0;}
  else if(i===12){if(!G.started){await say('Start or load a game first.');continue;}await saveCodeOverlay('export');}
  else if(i===13){const d=await saveCodeOverlay('import');if(d){loadSave(d);savePrefs();applyPadPrefs();await say('Save code loaded!');return 'loaded';}}
  else{savePrefs();applyPadPrefs();return;}
  savePrefs();applyPadPrefs();}}

// ---------- save / load ----------
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}
function serialize(){const ex={};for(const k in G.explored)ex[k]=Array.from(G.explored[k]).join('');
  return JSON.stringify({v:1,layout:2,name:G.name,map:G.map,px:G.px,py:G.py,pdir:G.pdir,party:G.party,storage:G.storage,bag:G.bag,money:G.money,flags:G.flags,seen:G.seen,caught:G.caught,explored:ex,time:G.time,lastHeal:G.lastHeal,visited:G.visited,starter:G.starter,rival:G.rival,minimap:G.minimap,ts:TEXTSPEED,lastOut:G.lastOut,quests:G.quests||{},skins:G.skins||{classic:1},glitchCaught:G.glitchCaught||0,thaw:G.thaw||{},rep:G.rep,kael:G.kael||0,scan:G.scan||{},ws:G.ws,display:G.display,vault:G.vault,vaultRuns:G.vaultRuns||[],vaultBest:G.vaultBest||0,rigNext:G.rigNext||0});}
function slotInfo(i){const s=lsGet('shardfall_slot'+i)||lsGet('wildbound_slot'+i);if(!s)return null;try{return JSON.parse(s);}catch(e){return null;}}
async function saveMenu(){const opts=[0,1,2].map(i=>{const s=slotInfo(i);return 'Slot '+(i+1)+': '+(s?s.name+' · '+(MAPS[s.map]?MAPS[s.map].name:'')+' · '+fmtTime(s.time):'— empty —');});opts.push('Cancel');
  const i=await choose(opts,{x:40,y:40});if(i<0||i>2)return;if(slotInfo(i)){const c=await ask('Overwrite slot '+(i+1)+'?');if(c!==0)return;}
  if(lsSet('shardfall_slot'+i,serialize())){Snd.sfx('item');await say('Game saved to slot '+(i+1)+'!');}else await say('Saving isn\'t available in this browser.');}
const LAYOUT2=['ashgrove','route1','brasston','route2','voltmere','house_a','house_a2','house_b1','house_b2','house_v1','house_v2','repair_b','repair_v','repair_f','repair_k','lab','workshop'];
function loadSave(d){G.name=d.name;G.party=d.party;G.storage=d.storage||[];G.bag=d.bag;G.money=d.money;G.flags=d.flags;G.seen=d.seen;G.caught=d.caught;G.time=d.time||0;G.lastHeal=d.lastHeal;G.visited=d.visited||{};G.starter=d.starter;G.rival=d.rival;G.minimap=d.minimap!==false;TEXTSPEED=d.ts||TEXTSPEED;G.lastOut=d.lastOut;G.quests=d.quests||{};G.skins=d.skins||{classic:1};G.glitchCaught=d.glitchCaught||0;BT=null;UI.length=0;G.busy=false;
  G.thaw=d.thaw||{};G.rep=d.rep||{w:0,c:0};G.kael=d.kael||0;G.scan=d.scan||{};G.ws=d.ws;G.display=d.display;G.vault=d.vault||null;G.vaultRuns=d.vaultRuns||[];G.vaultBest=d.vaultBest||0;G.rigNext=d.rigNext||0;
  if(G.flags.badge1){G.thaw.brasston=1;G.thaw.route1=1;}if(G.flags.badge2){G.thaw.voltmere=1;G.thaw.route2=1;G.thaw.ashgrove=1;}if(G.flags.kael1)G.flags.workshop=1;
  if(d.map==='vault'){if(G.vault)MAPS.vault=genVault(G.vault.floor,G.vault.seed);else{d.map='workshop';d.px=6;d.py=8;}}
  G.explored={};for(const k in d.explored){if(!MAPS[k])continue;const a=exploredArr(k);const s=d.explored[k];for(let i=0;i<a.length&&i<s.length;i++)a[i]=s[i]==='1'?1:0;}
  {let mp=d.map,x=d.px,y=d.py;if(!MAPS[mp]||mp==='home'){mp='workshop';x=6;y=8;}
   if(G.lastHeal&&(!MAPS[G.lastHeal.map]||G.lastHeal.map==='home'))G.lastHeal={map:'workshop',x:2,y:7};
   if(d.layout!==2&&LAYOUT2.includes(mp)){const m=MAPS[mp];const g=m.grid;const ok=(a,b)=>b>=0&&b<g.length&&a>=0&&a<g[0].length&&!SOLID.has(g[b][a])&&!'~C'.includes(g[b][a]);
     if(m.town&&m.heal){const hm=m.heal.map;const w=(MAPS[hm].warps||[])[0];if(w&&w.to===mp){x=w.tx;y=w.ty;}}
     else if(!ok(x,y)){const w=(m.warps||[])[0];if(w){const nb=[[0,-1],[0,1],[1,0],[-1,0]].map(([dx,dy])=>[w.x+dx,w.y+dy]).find(([a,b])=>ok(a,b)&&!(m.warps||[]).some(q=>q.x===a&&q.y===b));if(nb){x=nb[0];y=nb[1];}}}}
   loadMap(mp,x,y,d.pdir);}}

// ---------- title / intro ----------
function titleW(){return{t:0,i:0,update(){this.t++;const opts=this.opts();if(rep('up'))this.i=(this.i+opts.length-1)%opts.length;if(rep('down'))this.i=(this.i+1)%opts.length;if(press('a')||press('start')){Snd.sfx('ok');popUI(this,opts[this.i]);}},
  opts(){const o=[];if([0,1,2].some(i=>slotInfo(i))||lsGet('shardfall_auto'))o.push('Continue');o.push('New Game');return o;},
  draw(){const t=this.t;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#03060f');g.addColorStop(0.55,'#14203a');g.addColorStop(1,'#2a3e5e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(let b=0;b<3;b++){ctx.beginPath();for(let x=0;x<=W;x+=8){const y=40+b*22+Math.sin(x/70+t/60+b)*14+Math.sin(x/23+t/40)*4;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}for(let x=W;x>=0;x-=8){const y=58+b*22+Math.sin(x/70+t/60+b)*14;ctx.lineTo(x,y);}ctx.closePath();ctx.fillStyle=['rgba(64,224,200,.10)','rgba(140,110,255,.08)','rgba(64,180,255,.07)'][b];ctx.fill();}
    for(let i=0;i<40;i++){const sx=(i*97)%W,sy=(i*53)%150;if((i+Math.floor(t/20))%7)R(ctx,sx,sy,1,1,'#c8d8ff');}
    ctx.fillStyle='#0e1626';ctx.beginPath();ctx.moveTo(60,240);ctx.lineTo(170,128);ctx.lineTo(280,240);ctx.fill();const fl=0.3+0.25*Math.abs(Math.sin(t/23));ctx.fillStyle='rgba(255,120,50,'+fl+')';ctx.beginPath();ctx.ellipse(170,132,16,6,0,0,7);ctx.fill();
    const ph=t%300;if(ph<70){const k=ph/70;const x=W+40-k*(W-120),y=-20+k*230;const gr=ctx.createLinearGradient(x,y,x+90,y-80);gr.addColorStop(0,'rgba(120,240,255,.9)');gr.addColorStop(1,'rgba(120,240,255,0)');ctx.strokeStyle=gr;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+90,y-80);ctx.stroke();ctx.fillStyle='#e8ffff';ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.fill();}
    else if(ph<92){ctx.fillStyle='rgba(160,240,255,'+(1-(ph-70)/22)*0.5+')';ctx.fillRect(0,0,W,H);}
    drawSnow(0,0,0.35,0.3);
    ctx.fillStyle='#070b14';ctx.beginPath();ctx.moveTo(0,250);ctx.quadraticCurveTo(W/2,214,W,250);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();ctx.strokeStyle='#8aa4c0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,250);ctx.quadraticCurveTo(W/2,214,W,250);ctx.stroke();
    R(ctx,96,170,10,62,'#070b14');for(let y=176;y<226;y+=12){ctx.strokeStyle='#121a28';ctx.beginPath();ctx.moveTo(96,y);ctx.lineTo(106,y+12);ctx.moveTo(106,y);ctx.lineTo(96,y+12);ctx.stroke();}R(ctx,99,166,4,4,t%60<30?'#d03838':'#5a1a1a');
    const hero=['drillwyrm','rimeshade','furnadrone'][Math.floor(t/600)%3];ctx.drawImage(botSprite(hero),W-190,96,170,170);ctx.fillStyle='rgba(7,11,20,.35)';ctx.fillRect(W-190,236,170,30);
    const gl=Math.random()<0.04;if(gl){wtxt('SHARDFALL',W/2+3,80,'#ff3a5a',64,'center');wtxt('SHARDFALL',W/2-3,80,'#3affff',64,'center');}
    wtxt('SHARDFALL',W/2,80,'#e6f2ff',64,'center');wtxt('~ Ember Protocol ~',W/2,108,'#ff9a5a',24,'center');
    this.opts().forEach((o,i)=>{wtxt((i===this.i?'▶ ':'  ')+o,60,282+i*24,i===this.i?'#fff':'#7a8aa8',24);});
    wtxt('Chapters 1–2',W-8,H-6,'#5a6a88',16,'right');wtxt('Press A',W/2,H-8,t%60<40?'#7a8aa8':'#3a4a68',16,'center');}};}
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
    const rp=G.rep||{w:0,c:0};wtxt('Allegiance: '+(rp.w>rp.c?'Wardens':rp.c>rp.w?'Hollow Choir':'undecided')+'  ·  Kael: '+((G.kael||0)>=2?'friend':(G.kael||0)>=0?'rival':'bitter'),W/2,236,'#ffd0a0',18,'center');
    wtxt('Next: Chapter 2 — The Rustworks',W/2,260,'#9ac0ff',22,'center');wtxt('Return to Vesna in Ashgrove to begin.',W/2,284,'#8090a0',18,'center');
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
