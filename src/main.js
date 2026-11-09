// ===================== GAME =====================
const G={name:'Rook',map:'home',px:2,py:2,pdir:'down',busy:false,party:[],storage:[],bag:{},money:500,flags:{},seen:{},caught:{},explored:{},time:0,
  lastHeal:{map:'workshop',x:2,y:7},visited:{},npcs:[],objs:[],crates:[],cond:null,minimap:true,fade:0,mv:null,stepN:0,banner:0,pendSock:[],sw:0,flashOW:0,lastOut:null,started:false,skin:'classic',bspeed:1,skipFx:false,alwaysRun:false,haptic:true,padOp:1,quests:{},skins:{classic:1},lights:[],thaw:{},ferals:[],fol:null,surf:null,rep:{w:0,c:0},kael:0,scan:{},tileOv:{},vault:null,vaultRuns:[],vaultBest:0};
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};const OPP={up:'down',down:'up',left:'right',right:'left'};
function flag(k){return !!G.flags[k];}function setFlag(k,v=1){G.flags[k]=v;}
function seen(id,c){G.seen[id]=1;if(c)G.caught[id]=1;}
function curMap(){return MAPS[G.map];}
async function healAll(){for(const b of G.party){b.hp=stats(b).hp;b.st=null;b.moves.forEach(m=>m.pp=MOVES[m.id].pp);}}
function setLastHeal(){G.lastHeal={map:G.map,x:G.px,y:G.py};}

function loadMap(id,x,y,dir){const m=MAPS[id];G.map=id;G.px=x;G.py=y;if(dir)G.pdir=dir;G.mv=null;
  G.npcs=(m.npcs||[]).map(n=>Object.assign({},n,{hx:n.x,hy:n.y,mv:null,hidden:false,bubble:0,wt:60+rnd(120)}));
  G.objs=(m.objs||[]).map(o=>Object.assign({},o));
  for(const o of G.objs){if(o.type==='pod'&&flag('starter')&&(o.bot===G.starter||o.bot===G.rival))o.taken=1;}
  G.crates=[];if(m.crates){const solved=flag(m.gate);const plates=[];m.grid.forEach((r,yy)=>[...r].forEach((c,xx)=>{if(c==='P')plates.push([xx,yy]);}));
    G.crates=(solved?plates:m.crates).map(([cx,cy])=>({x:cx,y:cy,ox:cx,oy:cy,p:1}));}
  G.cond=null;if(m.conduits){const c=m.conduits;G.cond={cells:c.cells.map(([cx,cy,t])=>({x:cx,y:cy,t,r:rnd(4)})),lit:new Set()};
    if(flag(m.gate)){applyCondSolution();}else{let tries=0;while(condTrace().ok&&tries++<20)G.cond.cells.forEach(cc=>cc.r=rnd(4));}condTrace();}
  if(id==='cave'||id==='vault')G.sw=0;
  G.ventSafe={map:id,x,y,dir:dir||'down'};  buildTileOv();G.surf=null;G.glide=null;resetFollower();spawnFerals();
  if(m.town)G.visited[id]=1;if(m.world)G.lastOut={map:id,x,y};
  G.banner=m.name!==G.lastBanner?150:0;G.lastBanner=m.name;
  Snd.music(m.music);markExplored();collectLights();OWP.length=0;
  const wk=weatherKey();Snd.ambience(wk==='cave'?'drips':m.outdoor?'wind':null,wk==='blizzard'?2.4:wk==='night'?0.7:wk==='static'?1:0.9);
  autosave();}
function T(x,y){const m=curMap();if(y<0||y>=m.grid.length||x<0||x>=m.grid[0].length)return null;const o=G.tileOv&&G.tileOv[x+','+y];if(o)return o;const ch=m.grid[y][x];if(ch==='n'&&thawed(G.map))return (m.thawTo&&m.thawTo[x+','+y])||'.';return ch;}
function tileSolid(ch){if(ch==null)return true;if(ch==='~'&&G.surf)return false;if(SOLID.has(ch))return true;const m=curMap();
  if(ch==='g')return !flag(m.gate);if(ch==='r')return G.sw===0;if(ch==='u')return G.sw===1;return false;}
function npcAt(x,y){return G.npcs.find(n=>npcVisible(n)&&((n.x===x&&n.y===y)||(n.mv&&n.mv.tx===x&&n.mv.ty===y)));}
function npcVisible(n){return !n.hidden&&(!n.cond||n.cond());}
function objAt(x,y){return G.objs.find(o=>o.x===x&&o.y===y&&objVisible(o));}
function objVisible(o){if(o.type==='item')return !flag('got_'+o.id);if(o.cond)return o.cond();return true;}
function crateAt(x,y){return G.crates.find(c=>c.x===x&&c.y===y);}
function isBlocked(x,y,ignorePlayer){const ch=T(x,y);if(tileSolid(ch))return true;if(npcAt(x,y))return true;const o=objAt(x,y);if(o&&o.type!=='cond')return true;if(crateAt(x,y))return true;if(!ignorePlayer&&G.px===x&&G.py===y)return true;return false;}
function warpAt(x,y){return (curMap().warps||[]).find(w=>w.x===x&&w.y===y);}

// ---------- belts & vents ----------
const BELT={'6':'right','4':'left','8':'up','2':'down'};const BFLIP={'6':'4','4':'6','8':'2','2':'8'};
function beltFlipped(){return !!(curMap().leverFlip&&G.beltFlip&&G.beltFlip[G.map]);}
function beltDir(ch){if(!BELT[ch])return null;return BELT[beltFlipped()?BFLIP[ch]:ch];}
function ventPhase(x,y){return ((TICK+(x*29+y*47))%140);}
function ventActive(x,y){return ventPhase(x,y)<55;}
function ventWarn(x,y){return ventPhase(x,y)>=118;}
async function scald(){if(G.scalding)return;G.scalding=true;G.busy=true;Snd.sfx('od');burstOW(G.px,G.py,'#ffffff');const vs=G.ventSafe&&G.ventSafe.map===G.map?G.ventSafe:null;const r=vs?[vs.x,vs.y]:curMap().ventReset;
  for(let i=0;i<=8;i++){G.fade=i/8;await wait(1);}if(r){G.px=r[0];G.py=r[1];G.pdir=vs?vs.dir:'up';resetFollower();}G.mv=null;for(let i=8;i>=0;i--){G.fade=i/8;await wait(1);}
  G.errToast={t:120,msg:'Scalded by steam! Watch for the orange glow, then run.'};G.busy=false;G.scalding=false;}
function slideCrate(c){for(let k=0;k<30;k++){const d=beltDir(T(c.x,c.y));if(!d)return;const [dx,dy]=DIRS[d];const nx=c.x+dx,ny=c.y+dy;
  if(isBlocked(nx,ny)||crateAt(nx,ny)||(G.px===nx&&G.py===ny)||T(nx,ny)==='e')return;c.x=nx;c.y=ny;}}
// ---------- movement ----------
function tryMove(dir,forced){const [dx,dy]=DIRS[dir];G.pdir=dir;const nx=G.px+dx,ny=G.py+dy;
  if(!forced){const f=feralAt(nx,ny);if(f){contactFeral(f,true);return false;}}
  const w=warpAt(nx,ny);
  const c=crateAt(nx,ny);if(c&&!forced){const bx=nx+dx,by=ny+dy;if(!isBlocked(bx,by)&&!warpAt(bx,by)&&T(bx,by)!=='e'){c.x=bx;c.y=by;c.p=0;Snd.sfx('push');startMove(nx,ny,forced);slideCrate(c);checkPlates();return true;}Snd.sfx('bump');return false;}
  if(isBlocked(nx,ny,true)&&!(w&&!tileSolid(T(nx,ny)))){if(TICK%20===0)Snd.sfx('bump');return false;}
  startMove(nx,ny,forced);return true;}
function startMove(nx,ny,forced,belt){const ox=G.px,oy=G.py;G.mv={fx:G.px,fy:G.py,tx:nx,ty:ny,p:0,forced,belt};G.px=nx;G.py=ny;G.stepN++;followerMoved(ox,oy);}
function stepPlayer(dir){return new Promise(res=>{if(!tryMove(dir,true)){res();return;}G.mv.res=res;});}
function walkNPC(n,dir,steps){return new Promise(async res=>{for(let i=0;i<steps;i++){n.dir=dir;const [dx,dy]=DIRS[dir];const nx=n.x+dx,ny=n.y+dy;
    if(tileSolid(T(nx,ny))||(G.px===nx&&G.py===ny))break;await new Promise(r=>{n.mv={fx:n.x,fy:n.y,tx:nx,ty:ny,p:0,res:r};});}res();});}
function updateMovers(){const running=G.alwaysRun?!held.b:held.b;const spd=(running&&!G.busy?1/8:1/16)*(G.fastWalk?1.5:1);
  if(G.mv){G.mv.p+=G.mv.belt==='slide'?1/5:G.mv.belt?1/7:G.mv.forced?1/14:(T(G.mv.tx,G.mv.ty)==='d'?spd*0.45:spd);if(G.mv.p>=1){const r=G.mv.res,f=G.mv.forced,bl=G.mv.belt;G.mv=null;if(r)r();if(!f||bl)onStep();}}
  for(const n of G.npcs){if(n.mv){n.mv.p+=1/14;if(n.mv.p>=1){n.x=n.mv.tx;n.y=n.mv.ty;const r=n.mv.res;n.mv=null;if(r)r();}}
    else if(n.wander&&!G.busy&&!UI.length&&npcVisible(n)){if(--n.wt<=0){n.wt=90+rnd(150);const d=pick(Object.keys(DIRS));const [dx,dy]=DIRS[d];const nx=n.x+dx,ny=n.y+dy;n.dir=d;
      if(Math.abs(nx-n.hx)<=1&&Math.abs(ny-n.hy)<=1&&!isBlocked(nx,ny)&&!warpAt(nx,ny)&&!(G.mv&&G.mv.tx===nx&&G.mv.ty===ny))n.mv={fx:n.x,fy:n.y,tx:nx,ty:ny,p:0};}}
    if(n.bubble>0)n.bubble--;}}
function markExplored(){const m=curMap();const e=exploredArr(G.map);const w=m.grid[0].length,h=m.grid.length;const r=m.world?5:20;
  for(let y=G.py-r;y<=G.py+r;y++)for(let x=G.px-r-1;x<=G.px+r+1;x++)if(x>=0&&y>=0&&x<w&&y<h)e[y*w+x]=1;}

async function onStep(){G.stepLock=true;try{await onStepInner();}finally{G.stepLock=false;}}
async function onStepInner(){markExplored();addPrint();if(typeof zoneStep==='function')zoneStep();{const h=T(G.px,G.py);if(h!=='V'&&![[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>T(G.px+dx,G.py+dy)==='V'))G.ventSafe={map:G.map,x:G.px,y:G.py,dir:G.pdir};}const m=curMap();if(m.world)G.lastOut={map:G.map,x:G.px,y:G.py};
  if(G.surf&&!'~≈'.includes(T(G.px,G.py))){G.surf=null;resetFollower();}
  const w=warpAt(G.px,G.py);if(w){if(w.req&&!flag(w.req)){G.busy=true;await say(w.locked||'It\'s locked.');await stepPlayer(OPP[G.pdir]);G.busy=false;return;}await doWarp(w);return;}
  const here=T(G.px,G.py);
  {const bd=beltDir(here);if(bd){const [dx,dy]=DIRS[bd];const nx=G.px+dx,ny=G.py+dy;if(!isBlocked(nx,ny,true)&&!crateAt(nx,ny)){startMove(nx,ny,true,true);Snd.sfx('push');return;}}}
  if(here==='-'&&!G.surf){const [dx,dy]=DIRS[G.pdir];const nx=G.px+dx,ny=G.py+dy;if(!isBlocked(nx,ny,true)&&!crateAt(nx,ny)&&!feralAt(nx,ny)&&!warpAt(nx,ny)){G.sliding=1;startMove(nx,ny,true,'slide');return;}}
  if(G.sliding){G.sliding=0;iceSpray();}
  if(here==='V'&&ventActive(G.px,G.py)){await scald();return;}
  if(G.map==='vault'&&here==='E'){G.vault.floor++;await enterVaultFloor();return;}
  if(G.map==='vault'&&here==='O'){G.busy=true;const r=await ask('Leave the Vault now and keep your loot?',['Leave','Keep exploring']);G.busy=false;if(r===0){await vaultExit();}return;}
  if(G.map==='workshop'&&here==='O'){G.busy=true;await startVault();G.busy=false;return;}
  const tr=(m.triggers||[]).find(t=>t.x===G.px&&t.y===G.py);if(tr){await tr.run();if(G.busy)return;}
  if(T(G.px,G.py)==='S'){G.sw^=1;Snd.sfx('switch');}
  if(await checkLOS())return;}
async function doWarp(w){G.busy=true;G.inWarp=true;Snd.sfx('door');for(let i=0;i<=10;i++){G.fade=i/10;await wait(1);}
  loadMap(w.to,w.tx,w.ty,w.dir||G.pdir);G.stepN=0;for(let i=10;i>=0;i--){G.fade=i/10;await wait(1);}G.inWarp=false;G.busy=false;}
async function warpTown(t){const h=MAPS[t].heal;G.busy=true;G.inWarp=true;for(let i=0;i<=10;i++){G.fade=i/10;await wait(1);}loadMap(h.map,h.x,h.y,'up');G.stepN=0;for(let i=10;i>=0;i--){G.fade=i/10;await wait(1);}G.inWarp=false;G.busy=false;}

// ---------- trainers ----------
async function checkLOS(){for(const n of G.npcs){if(!n.range||!npcVisible(n)||n.mv)continue;
    const eligible=n.trainer?!flag('t_'+n.id):!!n.script;if(!eligible)continue;
    const [dx,dy]=DIRS[n.dir];let seenP=false;
    for(let k=1;k<=n.range;k++){const x=n.x+dx*k,y=n.y+dy*k;if(x===G.px&&y===G.py){seenP=true;break;}if(tileSolid(T(x,y))||npcAt(x,y)||crateAt(x,y))break;}
    if(seenP){G.busy=true;n.bubble=45;Snd.sfx('ok');await wait(45);const dist=Math.abs(G.px-n.x)+Math.abs(G.py-n.y);await walkNPC(n,n.dir,dist-1);G.pdir=OPP[n.dir];
      if(n.trainer)await trainerTalk(n);else await n.script(n);G.busy=false;return true;}}
  return false;}
async function trainerTalk(n){const t=n.trainer;const sp=t.title+' '+t.name;
  if(flag('t_'+n.id)){await say(t.post,{speaker:sp});return;}
  G.busy=true;Snd.music('battle',true);await say(t.pre,{speaker:sp});
  const r=await runBattle({trainer:Object.assign({},t,{look:n.look})});
  if(r==='win'){setFlag('t_'+n.id);await say(t.post,{speaker:sp});if(n.after)await n.after(n);}
  G.busy=false;}

// ---------- interaction ----------
async function interact(){const m=curMap();const [dx,dy]=DIRS[G.pdir];let fx=G.px+dx,fy=G.py+dy;
  if(G.cond){const c=G.cond.cells.find(c=>c.x===G.px&&c.y===G.py);if(c){c.r=(c.r+1)%4;Snd.sfx('switch');const r=condTrace();if(r.ok&&!flag(m.gate)){setFlag(m.gate);G.busy=true;Snd.sfx('item');await wait(20);await say('The current reaches the receiver! The gate slides open with a hum.');G.busy=false;}return;}}
  if(G.fol&&G.fol.x===fx&&G.fol.y===fy&&lead()&&!npcAt(fx,fy)){const b=lead();Snd.chirp(BOTS[b.id].frame);G.busy=true;await say(pick([BOTS[b.id].name+' chirps happily.',BOTS[b.id].name+'\'s core glows warm.',BOTS[b.id].name+' scans the area for you.',BOTS[b.id].name+' bumps against your leg.']));G.busy=false;return;}
  const tch=T(fx,fy);if(['i','z','n','~'].includes(tch)&&!npcAt(fx,fy)&&!objAt(fx,fy)){G.busy=true;const h=await fieldSkill(tch,fx,fy);G.busy=false;if(h)return;}
  let n=npcAt(fx,fy);if(!n&&T(fx,fy)==='c'){n=npcAt(fx+dx,fy+dy);}
  if(n&&!n.mv){G.busy=true;n.dir=OPP[G.pdir];
    if(n.trainer)await trainerTalk(n);else if(n.script)await n.script(n);else if(n.text)await say(n.text);
    G.busy=false;return;}
  const o=objAt(fx,fy);if(o){G.busy=true;
    if(o.type==='item'){setFlag('got_'+o.id);const q=o.qty||1;addItem(o.item,q);if(G.vault&&o.vault){G.vault.loot[o.item]=(G.vault.loot[o.item]||0)+q;}Snd.sfx('item');await say(N()+' found '+(q>1?q+'× ':'a ')+ITEMS[o.item].n+'!');}
    else if(o.run){await o.run(o);}
    else if(o.type==='cache'){if(flag('got_'+o.id))await say('The cache is empty.');else if(!flag(m.terminalPuzzle.flag))await say('A sealed Maker cache. The lock is wired to a terminal somewhere nearby.');
      else{setFlag('got_'+o.id);addItem(o.item,1);Snd.sfx('item');await say('The cache opens with a hiss. '+N()+' found a '+ITEMS[o.item].n+'!');}}
    G.busy=false;return;}
  const key=fx+','+fy;if(m.signs&&m.signs[key]){G.busy=true;await say(m.signs[key]);G.busy=false;return;}
  if(m.terminalPuzzle&&m.terminalPuzzle.x===fx&&m.terminalPuzzle.y===fy){await memoryTerminal(m.terminalPuzzle);return;}
  if(m.terminal&&m.terminal.x===fx&&m.terminal.y===fy){await openStorage();return;}
  if(m.tileScripts&&m.tileScripts[key]){G.busy=true;await m.tileScripts[key]();G.busy=false;return;}
  const ch=T(fx,fy);G.busy=true;
  if(ch==='M')await say(m.conduits&&((fx===m.conduits.src[0]&&fy===m.conduits.src[1]))?'A Maker generator. Current pours out of its right side.':m.conduits?'The receiver. It needs current to open the gate.':'A Maker machine. It hums softly.');
  else if(ch==='h')await say(G.map==='home'?'Your bed. Still warm.':'A neat bed.');
  else if(ch==='g'&&!flag(m.gate))await say('A heavy gate. It won\'t budge.');
  else if(ch==='r'||ch==='u')await say((ch==='r'?'A red':'A blue')+' energy barrier. '+(tileSolid(ch)?'It\'s raised.':'It\'s lowered.'));
  G.busy=false;}
function checkPlates(){const m=curMap();if(!m.crates||flag(m.gate))return;const plates=[];m.grid.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='P')plates.push([x,y]);}));
  if(plates.every(([x,y])=>crateAt(x,y))){setFlag(m.gate);(async()=>{G.busy=true;await wait(16);Snd.sfx('item');await say('All three plates are pressed! With a grinding rumble, the gate opens.');G.busy=false;})();}}
// conduits: I r0=EW r1=NS ; L r0=NE r1=ES r2=SW r3=WN
function condConn(c){if(c.t==='I')return c.r%2===0?['E','W']:['N','S'];return [['N','E'],['E','S'],['S','W'],['W','N']][c.r];}
const DV={N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]},DO={N:'S',S:'N',E:'W',W:'E'};
function condTrace(){const C=G.cond,m=curMap().conduits;C.lit=new Set();let x=m.src[0]+1,y=m.src[1],from='W';
  for(let k=0;k<40;k++){const c=C.cells.find(c=>c.x===x&&c.y===y);if(!c){C.ok=false;return{ok:false};}const cn=condConn(c);if(!cn.includes(from)){C.ok=false;return{ok:false};}
    C.lit.add(c);const out=cn.find(d=>d!==from);const [dx,dy]=DV[out];x+=dx;y+=dy;from=DO[out];if(x===m.dst[0]&&y===m.dst[1]&&from==='W'){C.ok=true;return{ok:true};}}
  C.ok=false;return{ok:false};}
function applyCondSolution(){const sol={'4,6':0,'5,6':0,'6,6':2,'6,7':3,'5,7':1,'5,8':0,'6,8':0,'7,8':3,'7,7':1,'8,7':2,'8,8':0};for(const c of G.cond.cells){const k=c.x+','+c.y;if(k in sol)c.r=sol[k];}}

// ---------- overworld draw ----------
function camera(){const m=curMap();const mw=m.grid[0].length*TS,mh=m.grid.length*TS;let px=G.px*TS,py=G.py*TS;
  if(G.mv){px=(G.mv.fx+(G.mv.tx-G.mv.fx)*G.mv.p)*TS;py=(G.mv.fy+(G.mv.ty-G.mv.fy)*G.mv.p)*TS;}
  if(G.glide){const gl=G.glide;px=(gl.sx+(gl.lx-gl.sx)*gl.p)*TS;py=(gl.sy+(gl.ly-gl.sy)*gl.p)*TS;}
  let cx=px-W/2+TS/2,cy=py-H/2+TS/2;cx=mw<=W?(mw-W)/2:clamp(cx,0,mw-W);cy=mh<=H?(mh-H)/2:clamp(cy,0,mh-H);if(G.shake>0){G.shake--;const a=Math.min(6,G.shake/4+1);cx+=(Math.random()*2-1)*a;cy+=(Math.random()*2-1)*a;}return{cx:Math.round(cx),cy:Math.round(cy),px,py};}
function tileKey(ch,x,y){const m=curMap();if(BELT[ch]&&beltFlipped())return BFLIP[ch];
  if(ch==='g')return flag(m.gate)?'x':'gC';if(ch==='r')return G.sw===0?'rU':'rD';if(ch==='u')return G.sw===1?'uU':'uD';if(ch==='S')return 'S'+G.sw;return ch;}
function drawOverworld(){const m=curMap();const th=m.theme==='out'&&thawed(G.map)?'outw':m.theme;const {cx,cy,px,py}=camera();ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);const fr=Math.floor(TICK/40)%2;
  if(!(typeof drawGround==='function'&&drawGround(cx,cy,th,fr))){
  for(let y=y0;y<=y0+H/TS+1;y++)for(let x=x0;x<=x0+W/TS+1;x++){const ch=T(x,y);if(ch==null)continue;const sx=x*TS-cx,sy=y*TS-cy;const k=tileKey(ch,x,y);
    if(k.length===2){ctx.drawImage(tileArt(th==='cave'?'^':'x',th,(x+y)%2,0),sx,sy,TS,TS);drawSpecial(k,sx,sy);}
    else{let tf=0;if(ch==='~'||ch==='M')tf=fr;else if(ch==='T')tf=Math.floor(TICK/48+x*0.37+y*0.21)%2;else if(ch==='z'||ch==='i'||ch==='E'||ch==='O'||ch==='a'||ch==='o')tf=Math.floor(TICK/20+x)%2;else if(BELT[ch])tf=Math.floor(TICK/6)%2;else if(ch==='L')tf=beltFlipped()?1:0;ctx.drawImage(tileArt(k,th,(x*7+y*3)%4===0?0:(x+y)%2+1,tf),sx,sy,TS,TS);}}
  }
  if(m.decor)drawWorkshopDecor(cx,cy);
  drawUnderFX(cx,cy);drawWorldReflections(cx,cy);drawSurfaceFX(cx,cy);drawShoreFoam(cx,cy);if(typeof drawTideFX==='function')drawTideFX(cx,cy);
  for(let y=y0;y<=y0+H/TS+1;y++)for(let x=x0;x<=x0+W/TS+1;x++){if(T(x,y)!=='V')continue;const sx=x*TS-cx,sy=y*TS-cy;
    if(ventActive(x,y)){const ph=ventPhase(x,y);for(let i=0;i<6;i++){const t=((ph*2+i*14)%60)/60;ctx.fillStyle='rgba(245,248,252,'+(0.75*(1-t))+')';ctx.beginPath();ctx.arc(sx+16+Math.sin(i*2+ph/6)*5+t*((curWeather().wind||0)*24+6),sy+16-t*44,6+t*10,0,7);ctx.fill();}}
    else if(ventWarn(x,y)){ctx.fillStyle='rgba(255,120,40,'+(0.3+0.3*Math.sin(TICK/2))+')';ctx.fillRect(sx+4,sy+4,24,24);}}
  // conduits
  if(G.cond){const mc=m.conduits;for(const c of G.cond.cells){const sx=c.x*TS-cx,sy=c.y*TS-cy;const lit=G.cond.lit.has(c);ctx.fillStyle='#2a3240';ctx.fillRect(sx+2,sy+2,TS-4,TS-4);
      const col=lit?(TICK%10<5?'#ffe040':'#fff080'):'#6a7080';for(const d of condConn(c)){const [dx,dy]=DV[d];ctx.fillStyle=col;ctx.fillRect(sx+12+dx*8-(dx?4:0),sy+12+dy*8-(dy?4:0),dx?16:8,dy?16:8);}ctx.fillStyle=col;ctx.fillRect(sx+12,sy+12,8,8);}
    if(G.cond.ok){const [dx,dy]=mc.dst;ctx.fillStyle='rgba(255,230,60,.4)';ctx.fillRect(dx*TS-cx,dy*TS-cy,TS,TS);}}
  // objects
  for(const o of G.objs){if(!objVisible(o))continue;const sx=o.x*TS-cx,sy=o.y*TS-cy;
    if(o.type==='item'){const c=ITEMS[o.item].shard?TCOL[ITEMS[o.item].shard]:'#e04040';const bob=Math.sin(TICK/12)*2;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(sx+16,sy+26,8,3,0,0,7);ctx.fill();
      if(ITEMS[o.item].shard){ptri(ctx,[sx+16,sy+6+bob,sx+24,sy+15+bob,sx+16,sy+24+bob,sx+8,sy+15+bob],c);R(ctx,sx+13,sy+11+bob,3,3,'#fff');}
      else{const y=sy+bob;R(ctx,sx+9,y+9,14,15,'#1a202a');R(ctx,sx+10,y+10,12,13,'#5a6676');R(ctx,sx+10,y+10,12,3,'#8a96a6');R(ctx,sx+10,y+15,12,2,c==='#e04040'?'#40d0e0':c);R(ctx,sx+14,y+7,4,3,'#3a4250');if(TICK%60<30)R(ctx,sx+20,y+19,2,2,'#ffd060');}}
    if(o.type==='pod'){ctx.fillStyle='rgba(160,220,255,.6)';rr(sx+6,sy-6,20,30,8);ctx.fill();ctx.strokeStyle='#e0f4ff';ctx.lineWidth=2;rr(sx+6,sy-6,20,30,8);ctx.stroke();if(!o.taken)ctx.drawImage(botSprite(o.bot),sx+4,sy-6,24,24);}
    if(o.type==='capsule'){const op=flag('starter')||o.open;ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(sx+16,sy+28,15,5,0,0,7);ctx.fill();
      ctx.fillStyle='#2a3240';ctx.beginPath();ctx.ellipse(sx+16,sy+16,14,12,-0.3,0,7);ctx.fill();ctx.fillStyle='#4a5668';ctx.beginPath();ctx.ellipse(sx+13,sy+12,9,6,-0.3,0,7);ctx.fill();
      const p=0.5+0.5*Math.sin(TICK/7);ctx.fillStyle=op?'rgba(60,90,110,.9)':'rgba(64,224,240,'+(0.55+0.45*p)+')';ctx.fillRect(sx+10,sy+14,12,4);ctx.fillRect(sx+14,sy+10,4,12);
      if(!op&&TICK%9===0)OWP.push({x:o.x*TS+12+rnd(10),y:o.y*TS+6,vx:(Math.random()-0.5)*0.3,vy:-0.4,t:0,max:60,k:'breath'});
      if(op){ctx.strokeStyle='#101820';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx+6,sy+8);ctx.lineTo(sx+14,sy+16);ctx.lineTo(sx+10,sy+24);ctx.stroke();}}
    if(o.type==='titan')drawTitan(o,sx,sy);
    if(o.type==='oldframe'){ctx.globalAlpha=0.85;ctx.drawImage(botSprite('gearpup'),sx-2,sy-6,36,36);ctx.globalAlpha=1;if(TICK%60<30)wtxt('!',sx+26,sy-4,'#ffe080',16);}
    if(o.type==='pylon')drawPylon(o,sx,sy);
    if(o.type==='log')drawLogObj(o,sx,sy);
    if(o.type==='archive'){const p=0.6+0.4*Math.sin(TICK/8);ctx.fillStyle='#2a3242';ctx.fillRect(sx+6,sy+10,20,18);ctx.fillStyle='rgba(120,230,255,'+p+')';ctx.fillRect(sx+10,sy+4,12,14);ctx.fillStyle='#fff';ctx.fillRect(sx+14,sy+8,4,4);}
    if(o.type==='lostbot'){const bob=Math.sin(TICK/8)*2;ctx.drawImage(botSprite('pipsprock'),sx-2,sy-6+bob,36,36);if(TICK%50<25)wtxt('?',sx+26,sy-4,'#ffe080',16);}
    if(o.type==='stash'){R(ctx,sx+2,sy+6,28,22,'#3a3a48');R(ctx,sx+2,sy+6,28,4,'#5a5a6a');R(ctx,sx+12,sy+12,8,8,'#e8e8f0');R(ctx,sx+13,sy+14,2,2,'#101018');R(ctx,sx+17,sy+14,2,2,'#101018');}
    if(o.type==='cache'){const open=flag('got_'+o.id);R(ctx,sx+3,sy+8,26,20,'#506070');R(ctx,sx+3,sy+8,26,4,open?'#304050':'#7890a8');R(ctx,sx+13,sy+14,6,6,flag(curMap().terminalPuzzle.flag)?'#40e080':'#e04040');}}
  for(const c of G.crates){let x=c.x,y=c.y;const sx=x*TS-cx,sy=y*TS-cy;const on=T(c.x,c.y)==='P';R(ctx,sx+2,sy+2,28,28,'#6a4020');R(ctx,sx+4,sy+4,24,24,on?'#d0a050':'#b07838');R(ctx,sx+4,sy+15,24,2,'#6a4020');R(ctx,sx+15,sy+4,2,24,'#6a4020');}
  // entities
  const ents=[];for(const n of G.npcs)if(npcVisible(n))ents.push(n);ents.push({player:1});for(const f of G.ferals||[])ents.push({feral:f});if(G.fol&&lead()&&!G.surf)ents.push({fol:1});
  const pos=e=>{if(e.player)return[px,py];if(e.fol)return followerPos();if(e.feral){const f=e.feral;return f.mv?[(f.mv.fx+(f.mv.tx-f.mv.fx)*f.mv.p)*TS,(f.mv.fy+(f.mv.ty-f.mv.fy)*f.mv.p)*TS]:[f.x*TS,f.y*TS];}if(e.mv)return[(e.mv.fx+(e.mv.tx-e.mv.fx)*e.mv.p)*TS,(e.mv.fy+(e.mv.ty-e.mv.fy)*e.mv.p)*TS];return[e.x*TS,e.y*TS];};
  ents.sort((a,b)=>pos(a)[1]-pos(b)[1]);
  const bliz=weatherKey()==='blizzard';
  for(const e of ents){if(e.feral){drawFeral(e.feral,cx,cy);continue;}if(e.fol){drawFollower(cx,cy);continue;}const [ex,ey]=pos(e);const sx=ex-cx,sy=ey-cy;let fr2=0;
    if(e.player&&G.surf&&G.surf.skiff){drawSkiff(sx,sy);}else if(e.player&&G.surf){const b=G.surf;const bob=Math.sin(TICK/8)*2;ctx.strokeStyle='rgba(200,230,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx+16,sy+26,18+Math.sin(TICK/6)*2,6,0,0,7);ctx.stroke();ctx.drawImage(bspr(b),sx-4,sy+4+bob,40,40);}
    if(e.player&&G.glide){const gl=G.glide;const ox=(gl.sx+(gl.lx-gl.sx)*gl.p)*TS-cx,oy=(gl.sy+(gl.ly-gl.sy)*gl.p)*TS-cy-Math.sin(gl.p*Math.PI)*28;ctx.drawImage(charSprite('player',G.pdir,1),ox,oy-6,32,36);if(G.folShow)ctx.drawImage(bspr(G.folShow),ox-4,oy-30,40,40);continue;}
    if(!e.player&&bliz&&Math.hypot(ex-px,ey-py)>5*TS)continue;
    const mv=e.player?G.mv:e.mv;if(mv){fr2=mv.p<0.25||mv.p>=0.75?3:((e.player?G.stepN:(e.x+e.y))%2?1:2);}
    entShadow(sx,sy,ex,ey);{const img=charSprite(e.player?'player':e.look,e.player?G.pdir:e.dir,fr2);reflectSprite(img,sx,sy-6,32,36,ex,ey);rimLight(img,sx,sy-6,32,36,ex,ey);ctx.drawImage(img,sx,sy-6,32,36);if(e.player)snowOnPlayer(sx,sy-6);}
    if(e.bubble>0){panel(sx+4,sy-34,24,26,'#fff');txt('!',sx+16,sy-14,'#e02020',24,'center',null);}
    if(e.trainer&&!flag('t_'+e.id)&&!e.player&&TICK%60<6){}}
  drawOverFX(cx,cy);drawHeatHaze(cx,cy);owParticles(cx,cy,px,py);drawLighting(cx,cy,px,py);drawLightBleed(cx,cy);drawSkyFX(cx,cy);drawShafts(cx,cy);drawDusk();drawWeatherOverlay(cx,cy);drawRainOW(cx,cy);if(G.flick>0){G.flick--;if(G.flick%3<2){ctx.fillStyle='rgba(2,4,12,.82)';ctx.fillRect(0,0,W,H);}}if(m.outdoor&&!m.dungeon)coldGrade(0.07);
  if(G.minimap&&m.world)drawMinimap();
  if(G.banner>0){const a=Math.min(1,G.banner/20);ctx.globalAlpha=a;panel(8,8,Math.max(150,measure(m.name,24)+40),40,'#f8f0d8');txt(m.name,24,36,'#403020',24);ctx.globalAlpha=1;}}
function drawSpecial(k,sx,sy){const s=TS;
  if(k==='gC'){for(let i=0;i<4;i++)R(ctx,sx+3+i*8,sy,4,s,'#505860');R(ctx,sx,sy+4,s,4,'#404850');R(ctx,sx,sy+s-8,s,4,'#404850');}
  else if(k[0]==='r'||k[0]==='u'){const col=k[0]==='r'?'#d03838':'#3858e0';if(k[1]==='U'){ctx.fillStyle=col;ctx.fillRect(sx+2,sy+2,s-4,s-4);ctx.fillStyle=shade(col,0.35);for(let i=0;i<3;i++)ctx.fillRect(sx+4,sy+6+i*9+(TICK/4%9),s-8,2);ctx.strokeStyle=shade(col,0.5);ctx.strokeRect(sx+2,sy+2,s-4,s-4);}
    else{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.strokeRect(sx+4,sy+4,s-8,s-8);ctx.setLineDash([]);}}
  else if(k[0]==='S'){ctx.fillStyle='#303038';ctx.beginPath();ctx.ellipse(sx+16,sy+18,11,8,0,0,7);ctx.fill();ctx.fillStyle=G.sw===0?'#3858e0':'#d03838';ctx.beginPath();ctx.ellipse(sx+16,sy+15,9,6,0,0,7);ctx.fill();}}
function drawMinimap(){const m=curMap();const e=exploredArr(G.map);const w=m.grid[0].length,h=m.grid.length;const ps=3;const bz=weatherKey()==='blizzard';
  const vw=Math.min(w,bz?14:40),vh=Math.min(h,bz?10:26);const x0=clamp(G.px-Math.floor(vw/2),0,w-vw),y0=clamp(G.py-Math.floor(vh/2),0,h-vh);
  const bx=W-vw*ps-12,by=8;ctx.fillStyle='rgba(10,14,24,.8)';rr(bx-4,by-4,Math.max(vw*ps,84)+8,vh*ps+20,4);ctx.fill();
  {const key=G.map+'|'+x0+'|'+y0+'|'+vw+'|'+vh+'|'+G.stepN;const MC=drawMinimap.c||(drawMinimap.c={cv:null,key:''});
    if(MC.key!==key){MC.key=key;if(!MC.cv||MC.cv.width!==vw||MC.cv.height!==vh){MC.cv=mkCanvas(vw,vh);}const g=MC.cv.getContext('2d');const img=g.createImageData(vw,vh);
      for(let y=0;y<vh;y++)for(let x=0;x<vw;x++){const gx=x0+x,gy=y0+y;const col=e[gy*w+gx]?(MMCOL[m.grid[gy][gx]]||'#555'):'#0b0e16';const hx=col.length===4?col[1]+col[1]+col[2]+col[2]+col[3]+col[3]:col.slice(1,7);const n=parseInt(hx,16);const i=(y*vw+x)*4;img.data[i]=n>>16&255;img.data[i+1]=n>>8&255;img.data[i+2]=n&255;img.data[i+3]=255;}g.putImageData(img,0,0);}
    ctx.drawImage(MC.cv,bx,by,vw*ps,vh*ps);}
  for(const wp of m.warps||[]){if(e[wp.y*w+wp.x]&&wp.x>=x0&&wp.x<x0+vw&&wp.y>=y0&&wp.y<y0+vh){ctx.fillStyle='#ffe040';ctx.fillRect(bx+(wp.x-x0)*ps,by+(wp.y-y0)*ps,ps,ps);}}
  for(const f of G.ferals||[]){if(f.x<x0||f.x>=x0+vw||f.y<y0||f.y>=y0+vh)continue;ctx.fillStyle=f.alpha?'#ff2020':'#ffa040';ctx.fillRect(bx+(f.x-x0)*ps,by+(f.y-y0)*ps,ps,ps);}
  for(const n of G.npcs){if(!npcVisible(n)||!e[n.y*w+n.x])continue;if(n.x<x0||n.x>=x0+vw||n.y<y0||n.y>=y0+vh)continue;ctx.fillStyle=n.trainer&&!flag('t_'+n.id)?'#ff4040':'#80c0ff';ctx.fillRect(bx+(n.x-x0)*ps,by+(n.y-y0)*ps,ps,ps);}
  if(TICK%30<22){ctx.fillStyle='#fff';ctx.fillRect(bx+(G.px-x0)*ps-1,by+(G.py-y0)*ps-1,ps+2,ps+2);}
  txt(bz?m.name+' · blizzard':m.name,bx,by+vh*ps+12,bz?'#ffd0a0':'#c0d0f0',14,'left',null);}

// ---------- crash recovery ----------
let lastRecover=0;
function recoverFromError(e,where){console.error('Shardfall recovered from',where,e);const msg=String(e&&e.message||e).slice(0,60);
  if(TICK-lastRecover<5)return;lastRecover=TICK;
  BT=null;UI.length=0;timers.length=0;G.busy=false;G.mv=null;G.fade=0;G.inWarp=false;for(const n of G.npcs){if(n.mv){n.x=n.mv.tx;n.y=n.mv.ty;n.mv=null;}}
  for(const b of G.party)if(b.hp<0)b.hp=0;
  if(G.started&&!G.party.some(b=>b.hp>0))healAll();
  try{Snd.music(curMap().music,true);}catch(_){}
  G.errToast={t:420,msg:'Glitch recovered ['+where+']: '+msg};}
addEventListener('unhandledrejection',ev=>{ev.preventDefault&&ev.preventDefault();recoverFromError(ev.reason,'script');});
addEventListener('error',ev=>{if(G.started)recoverFromError(ev.error||ev.message,'loop');});
// ---------- main loop ----------
function update(){if(FS.need&&!FS.ok){clearPressed();return;}TICK++;tickInput();tickTimers();if(G.started&&!UI.some(u=>u.isTitle))G.time++;if(typeof tideTick==='function')tideTick();if(typeof escapeTick==='function')escapeTick();
  if(BT)battleTick();
  if(G.banner>0)G.banner--;if(G.fade>0&&!G.inWarp)G.fade=Math.max(0,G.fade-0.05);if(G.flashOW>0)G.flashOW--;
  if(UI.length){UI[UI.length-1].update();}
  else if(G.started&&!BT){updateMovers();updateFerals();
    if(!G.mv&&!G.busy&&!UI.length&&T(G.px,G.py)==='V'&&ventActive(G.px,G.py))scald();
    if(!G.busy&&!G.mv&&!G.stepLock){if(press('start')){Snd.sfx('ok');startMenu();}
      else if(press('map')){G.busy=true;openWorldMap().then(t=>{if(t)warpTown(t);else G.busy=false;});}
      else if(press('a'))interact();
      else{for(const d of ['up','down','left','right'])if(held[d]||pressed[d]){if(G.pdir!==d&&!G.turnT){G.pdir=d;G.turnT=5;break;}if(G.turnT>0)break;tryMove(d);break;}}}
    if(G.turnT>0&&!['up','down','left','right'].some(d=>held[d]))G.turnT=0;if(G.turnT>0)G.turnT--;}
  if(UI.length&&G.started&&!BT)updateMovers();
  clearPressed();}
function draw(){ctx.setTransform(RS,0,0,RS,0,0);ctx.imageSmoothingEnabled=false;if(BT)drawBattle();else if(G.started)drawOverworld();else{ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);}
  if(G.started&&!BT&&typeof drawEscape==='function')drawEscape();
  for(const u of UI)u.draw();
  if(G.fade>0){if(G.inWarp&&!BT&&G.started){const c=camera();const px=c.px-c.cx+16,py=c.py-c.cy+12;const R_=Math.hypot(W,H)*(1-G.fade);ctx.fillStyle='#000';ctx.beginPath();ctx.rect(0,0,W,H);ctx.moveTo(px+Math.max(0,R_),py);ctx.arc(px,py,Math.max(0,R_),0,Math.PI*2,true);ctx.fill('evenodd');}else{ctx.fillStyle='rgba(0,0,0,'+G.fade+')';ctx.fillRect(0,0,W,H);}}
  if(G.flashOW>0){ctx.fillStyle='rgba(255,255,255,'+(G.flashOW/8)+')';ctx.fillRect(0,0,W,H);}
  if(G.errToast&&G.errToast.t>0){G.errToast.t--;darkPanel(8,H-40,W-16,32);wtxt(G.errToast.msg,16,H-18,'#ffb0a0',16);}}
let last=performance.now(),acc=0;
function loopFrame(now){requestAnimationFrame(loopFrame);acc+=Math.min(100,now-last);last=now;try{const t0=performance.now();let n=0;while(acc>=1000/60&&n<3){update();acc-=1000/60;n++;}if(n>=3)acc=0;draw();drawToast();perfSample(performance.now()-t0);}catch(e){acc=0;recoverFromError(e,'loop');}}

// ---------- fullscreen gate (phones, top-level page only) ----------
const FS={need:false,ok:true};
function isFull(){return !!(document.fullscreenElement||document.webkitFullscreenElement||navigator.standalone||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches);}
function setupFS(){let top=true;try{top=window.top===window;}catch(e){top=false;}
  FS.need=top&&matchMedia('(pointer:coarse)').matches;if(!FS.need)return;
  const gate=document.getElementById('fsgate'),btn=document.getElementById('fsbtn');
  const el=document.documentElement;const canFS=!!(el.requestFullscreen||el.webkitRequestFullscreen);
  const isIOS=/iPhone|iPod/.test(navigator.userAgent)&&!canFS;
  if(isIOS){btn.style.display='none';document.getElementById('iosmsg').style.display='block';document.getElementById('fsmsg').textContent='This game plays fullscreen on phones.';}
  const refresh=()=>{FS.ok=isFull();gate.style.display=FS.ok?'none':'flex';if(!FS.ok){for(const k in held)held[k]=0;}};
  btn.onclick=async()=>{Snd.unlock();try{await (el.requestFullscreen?el.requestFullscreen({navigationUI:'hide'}):el.webkitRequestFullscreen());}catch(e){}
    try{await screen.orientation.lock('landscape');}catch(e){}refresh();};
  document.addEventListener('fullscreenchange',refresh);document.addEventListener('webkitfullscreenchange',refresh);refresh();}
async function boot(){loadPrefs();setupTouch();setupFS();try{await Promise.race([document.fonts.load('22px VT323'),new Promise(r=>setTimeout(r,1500))]);}catch(e){}
  requestAnimationFrame(loopFrame);
  while(true){Snd.music('title');const t=titleW();t.isTitle=1;const r=await pushUI(t);
    if(r==='Continue'){let auto=null;try{auto=JSON.parse(lsGet('shardfall_auto')||'null');}catch(e){}
      const slots=[];if(auto)slots.push(['Autosave: '+slotLabel(auto),auto]);
      [0,1,2].forEach(i=>{const s=slotInfo(i);slots.push(['Slot '+(i+1)+': '+(s?slotLabel(s):'— empty —'),s]);});
      const i=await choose(slots.map(x=>x[0]).concat(['Back']),{x:30,y:50});const s=i>=0&&i<slots.length?slots[i][1]:null;if(!s)continue;G.started=true;loadSave(s);G.fade=1;break;}
    else{await pushUI(storyW(['Calderra. A peninsula of ash and ice, built on the bones of the Makers.','The Makers vanished. Their machines did not: shardbots, robots that run on elemental crystals called shards.','Every shardbot drinks from one source, the HEARTFORGE, buried under Mt. Cinder.','Lately it stutters. Bots go feral. Winter forgets to end.','You are a salvager. You fix what the Makers left behind.','What is your name?']));
      G.name=await nameEntry();
      await pushUI(storyW(['Ashgrove Crater. The night the lights went out.']));
      G.started=true;setFlag('workshop');loadMap('workshop',9,7,'up');G.fade=1;
      await openingScene();
      G.busy=false;break;}}}
window.G=G;
boot();
