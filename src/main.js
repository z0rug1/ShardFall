// ===================== GAME =====================
const G={name:'Rook',map:'home',px:2,py:2,pdir:'down',busy:false,party:[],storage:[],bag:{},money:500,flags:{},seen:{},caught:{},explored:{},time:0,
  lastHeal:{map:'home',x:4,y:4},visited:{},npcs:[],objs:[],crates:[],cond:null,minimap:true,fade:0,mv:null,stepN:0,banner:0,pendSock:[],sw:0,flashOW:0,lastOut:null,started:false};
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};const OPP={up:'down',down:'up',left:'right',right:'left'};
function flag(k){return !!G.flags[k];}function setFlag(k,v=1){G.flags[k]=v;}
function seen(id,c){G.seen[id]=1;if(c)G.caught[id]=1;}
function curMap(){return MAPS[G.map];}
async function healAll(){for(const b of G.party){b.hp=stats(b).hp;b.st=null;b.moves.forEach(m=>m.pp=MOVES[m.id].pp);}}
function setLastHeal(){G.lastHeal={map:G.map,x:5,y:4};}

function loadMap(id,x,y,dir){const m=MAPS[id];G.map=id;G.px=x;G.py=y;if(dir)G.pdir=dir;G.mv=null;
  G.npcs=(m.npcs||[]).map(n=>Object.assign({},n,{hx:n.x,hy:n.y,mv:null,hidden:false,bubble:0,wt:60+rnd(120)}));
  G.objs=(m.objs||[]).map(o=>Object.assign({},o));
  for(const o of G.objs){if(o.type==='pod'&&flag('starter')&&(o.bot===G.starter||o.bot===G.rival))o.taken=1;}
  G.crates=[];if(m.crates){const solved=flag(m.gate);const plates=[];m.grid.forEach((r,yy)=>[...r].forEach((c,xx)=>{if(c==='P')plates.push([xx,yy]);}));
    G.crates=(solved?plates:m.crates).map(([cx,cy])=>({x:cx,y:cy,ox:cx,oy:cy,p:1}));}
  G.cond=null;if(m.conduits){const c=m.conduits;G.cond={cells:c.cells.map(([cx,cy,t])=>({x:cx,y:cy,t,r:rnd(4)})),lit:new Set()};
    if(flag(m.gate)){applyCondSolution();}else{let tries=0;while(condTrace().ok&&tries++<20)G.cond.cells.forEach(cc=>cc.r=rnd(4));}condTrace();}
  if(id==='cave')G.sw=0;
  if(m.town)G.visited[id]=1;if(m.world)G.lastOut={map:id,x,y};
  G.banner=m.name!==G.lastBanner?150:0;G.lastBanner=m.name;
  Snd.music(m.music);markExplored();}
function T(x,y){const m=curMap();if(y<0||y>=m.grid.length||x<0||x>=m.grid[0].length)return null;return m.grid[y][x];}
function tileSolid(ch){if(ch==null)return true;if(SOLID.has(ch))return true;const m=curMap();
  if(ch==='g')return !flag(m.gate);if(ch==='r')return G.sw===0;if(ch==='u')return G.sw===1;return false;}
function npcAt(x,y){return G.npcs.find(n=>npcVisible(n)&&((n.x===x&&n.y===y)||(n.mv&&n.mv.tx===x&&n.mv.ty===y)));}
function npcVisible(n){return !n.hidden&&(!n.cond||n.cond());}
function objAt(x,y){return G.objs.find(o=>o.x===x&&o.y===y&&objVisible(o));}
function objVisible(o){if(o.type==='item')return !flag('got_'+o.id);if(o.type==='pod')return true;return true;}
function crateAt(x,y){return G.crates.find(c=>c.x===x&&c.y===y);}
function isBlocked(x,y,ignorePlayer){const ch=T(x,y);if(tileSolid(ch))return true;if(npcAt(x,y))return true;const o=objAt(x,y);if(o&&o.type!=='cond')return true;if(crateAt(x,y))return true;if(!ignorePlayer&&G.px===x&&G.py===y)return true;return false;}
function warpAt(x,y){return (curMap().warps||[]).find(w=>w.x===x&&w.y===y);}

// ---------- movement ----------
function tryMove(dir,forced){const [dx,dy]=DIRS[dir];G.pdir=dir;const nx=G.px+dx,ny=G.py+dy;
  const w=warpAt(nx,ny);
  const c=crateAt(nx,ny);if(c&&!forced){const bx=nx+dx,by=ny+dy;if(!isBlocked(bx,by)&&!warpAt(bx,by)&&T(bx,by)!=='e'){c.x=bx;c.y=by;c.p=0;Snd.sfx('push');startMove(nx,ny,forced);checkPlates();return true;}Snd.sfx('bump');return false;}
  if(isBlocked(nx,ny,true)&&!(w&&!tileSolid(T(nx,ny)))){if(TICK%20===0)Snd.sfx('bump');return false;}
  startMove(nx,ny,forced);return true;}
function startMove(nx,ny,forced){G.mv={fx:G.px,fy:G.py,tx:nx,ty:ny,p:0,forced};G.px=nx;G.py=ny;G.stepN++;}
function stepPlayer(dir){return new Promise(res=>{if(!tryMove(dir,true)){res();return;}G.mv.res=res;});}
function walkNPC(n,dir,steps){return new Promise(async res=>{for(let i=0;i<steps;i++){n.dir=dir;const [dx,dy]=DIRS[dir];const nx=n.x+dx,ny=n.y+dy;
    if(tileSolid(T(nx,ny))||(G.px===nx&&G.py===ny))break;await new Promise(r=>{n.mv={fx:n.x,fy:n.y,tx:nx,ty:ny,p:0,res:r};});}res();});}
function updateMovers(){const spd=held.b&&!G.busy?1/8:1/16;
  if(G.mv){G.mv.p+=G.mv.forced?1/14:spd;if(G.mv.p>=1){const r=G.mv.res,f=G.mv.forced;G.mv=null;if(r)r();if(!f)onStep();}}
  for(const n of G.npcs){if(n.mv){n.mv.p+=1/14;if(n.mv.p>=1){n.x=n.mv.tx;n.y=n.mv.ty;const r=n.mv.res;n.mv=null;if(r)r();}}
    else if(n.wander&&!G.busy&&!UI.length&&npcVisible(n)){if(--n.wt<=0){n.wt=90+rnd(150);const d=pick(Object.keys(DIRS));const [dx,dy]=DIRS[d];const nx=n.x+dx,ny=n.y+dy;n.dir=d;
      if(Math.abs(nx-n.hx)<=1&&Math.abs(ny-n.hy)<=1&&!isBlocked(nx,ny)&&!warpAt(nx,ny)&&!(G.mv&&G.mv.tx===nx&&G.mv.ty===ny))n.mv={fx:n.x,fy:n.y,tx:nx,ty:ny,p:0};}}
    if(n.bubble>0)n.bubble--;}}
function markExplored(){const m=curMap();const e=exploredArr(G.map);const w=m.grid[0].length,h=m.grid.length;const r=m.world?5:20;
  for(let y=G.py-r;y<=G.py+r;y++)for(let x=G.px-r-1;x<=G.px+r+1;x++)if(x>=0&&y>=0&&x<w&&y<h)e[y*w+x]=1;}

async function onStep(){markExplored();const m=curMap();if(m.world)G.lastOut={map:G.map,x:G.px,y:G.py};
  const w=warpAt(G.px,G.py);if(w){await doWarp(w);return;}
  const tr=(m.triggers||[]).find(t=>t.x===G.px&&t.y===G.py);if(tr){await tr.run();if(G.busy)return;}
  if(T(G.px,G.py)==='S'){G.sw^=1;Snd.sfx('switch');}
  if(await checkLOS())return;
  if(m.enc&&T(G.px,G.py)===m.enc.tile&&G.party.length&&G.stepN>2&&rnd(100)<m.enc.rate){const l=m.enc.list;let tot=l.reduce((a,b)=>a+b[3],0),r=rnd(tot);let pickE=l[0];for(const e of l){if((r-=e[3])<0){pickE=e;break;}}
    const lv=pickE[1]+rnd(pickE[2]-pickE[1]+1);await runBattle({wild:makeBot(pickE[0],lv)});}}
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
  let n=npcAt(fx,fy);if(!n&&T(fx,fy)==='c'){n=npcAt(fx+dx,fy+dy);}
  if(n&&!n.mv){G.busy=true;n.dir=OPP[G.pdir];
    if(n.trainer)await trainerTalk(n);else if(n.script)await n.script(n);else if(n.text)await say(n.text);
    G.busy=false;return;}
  const o=objAt(fx,fy);if(o){G.busy=true;
    if(o.type==='item'){setFlag('got_'+o.id);const q=o.qty||1;addItem(o.item,q);Snd.sfx('item');await say(N()+' found '+(q>1?q+'× ':'a ')+ITEMS[o.item].n+'!');}
    else if(o.type==='pod'){if(o.taken)await say('An empty restoration pod.');else await choosePod(o);}
    else if(o.type==='cache'){if(flag('got_'+o.id))await say('The cache is empty.');else if(!flag(m.terminalPuzzle.flag))await say('A sealed Maker cache. The lock is wired to a terminal somewhere nearby.');
      else{setFlag('got_'+o.id);addItem(o.item,1);Snd.sfx('item');await say('The cache opens with a hiss. '+N()+' found a '+ITEMS[o.item].n+'!');}}
    G.busy=false;return;}
  const key=fx+','+fy;if(m.signs&&m.signs[key]){G.busy=true;await say(m.signs[key]);G.busy=false;return;}
  if(m.terminalPuzzle&&m.terminalPuzzle.x===fx&&m.terminalPuzzle.y===fy){await memoryTerminal(m.terminalPuzzle);return;}
  if(m.terminal&&m.terminal.x===fx&&m.terminal.y===fy){await openStorage();return;}
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
  let cx=px-W/2+TS/2,cy=py-H/2+TS/2;cx=mw<=W?(mw-W)/2:clamp(cx,0,mw-W);cy=mh<=H?(mh-H)/2:clamp(cy,0,mh-H);return{cx:Math.round(cx),cy:Math.round(cy),px,py};}
function tileKey(ch,x,y){const m=curMap();
  if(ch==='g')return flag(m.gate)?'x':'gC';if(ch==='r')return G.sw===0?'rU':'rD';if(ch==='u')return G.sw===1?'uU':'uD';if(ch==='S')return 'S'+G.sw;return ch;}
function drawOverworld(){const m=curMap();const th=m.theme;const {cx,cy,px,py}=camera();ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);const fr=Math.floor(TICK/40)%2;
  for(let y=y0;y<=y0+H/TS+1;y++)for(let x=x0;x<=x0+W/TS+1;x++){const ch=T(x,y);if(ch==null)continue;const sx=x*TS-cx,sy=y*TS-cy;const k=tileKey(ch,x,y);
    if(k.length===2){ctx.drawImage(tileArt(th==='cave'?'^':'x',th,(x+y)%2,0),sx,sy,TS,TS);drawSpecial(k,sx,sy);}
    else ctx.drawImage(tileArt(k,th,(x*7+y*3)%4===0?0:(x+y)%2+1,ch==='~'||ch==='M'?fr:0),sx,sy,TS,TS);}
  // conduits
  if(G.cond){const mc=m.conduits;for(const c of G.cond.cells){const sx=c.x*TS-cx,sy=c.y*TS-cy;const lit=G.cond.lit.has(c);ctx.fillStyle='#2a3240';ctx.fillRect(sx+2,sy+2,TS-4,TS-4);
      const col=lit?(TICK%10<5?'#ffe040':'#fff080'):'#6a7080';for(const d of condConn(c)){const [dx,dy]=DV[d];ctx.fillStyle=col;ctx.fillRect(sx+12+dx*8-(dx?4:0),sy+12+dy*8-(dy?4:0),dx?16:8,dy?16:8);}ctx.fillStyle=col;ctx.fillRect(sx+12,sy+12,8,8);}
    if(G.cond.ok){const [dx,dy]=mc.dst;ctx.fillStyle='rgba(255,230,60,.4)';ctx.fillRect(dx*TS-cx,dy*TS-cy,TS,TS);}}
  // objects
  for(const o of G.objs){if(!objVisible(o))continue;const sx=o.x*TS-cx,sy=o.y*TS-cy;
    if(o.type==='item'){const c=ITEMS[o.item].shard?TCOL[ITEMS[o.item].shard]:'#e04040';const bob=Math.sin(TICK/12)*2;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(sx+16,sy+26,8,3,0,0,7);ctx.fill();
      if(ITEMS[o.item].shard){ptri(ctx,[sx+16,sy+6+bob,sx+24,sy+15+bob,sx+16,sy+24+bob,sx+8,sy+15+bob],c);R(ctx,sx+13,sy+11+bob,3,3,'#fff');}
      else{ctx.fillStyle='#202028';ctx.beginPath();ctx.arc(sx+16,sy+16+bob,8,0,7);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.arc(sx+16,sy+16+bob,7,Math.PI,0);ctx.fill();ctx.fillStyle='#f0f0f0';ctx.beginPath();ctx.arc(sx+16,sy+16+bob,7,0,Math.PI);ctx.fill();R(ctx,sx+9,sy+15+bob,14,2,'#202028');}}
    if(o.type==='pod'){ctx.fillStyle='rgba(160,220,255,.6)';rr(sx+6,sy-6,20,30,8);ctx.fill();ctx.strokeStyle='#e0f4ff';ctx.lineWidth=2;rr(sx+6,sy-6,20,30,8);ctx.stroke();if(!o.taken)ctx.drawImage(botSprite(o.bot),sx+4,sy-6,24,24);}
    if(o.type==='cache'){const open=flag('got_'+o.id);R(ctx,sx+3,sy+8,26,20,'#506070');R(ctx,sx+3,sy+8,26,4,open?'#304050':'#7890a8');R(ctx,sx+13,sy+14,6,6,flag(curMap().terminalPuzzle.flag)?'#40e080':'#e04040');}}
  for(const c of G.crates){let x=c.x,y=c.y;const sx=x*TS-cx,sy=y*TS-cy;const on=T(c.x,c.y)==='P';R(ctx,sx+2,sy+2,28,28,'#6a4020');R(ctx,sx+4,sy+4,24,24,on?'#d0a050':'#b07838');R(ctx,sx+4,sy+15,24,2,'#6a4020');R(ctx,sx+15,sy+4,2,24,'#6a4020');}
  // entities
  const ents=[];for(const n of G.npcs)if(npcVisible(n))ents.push(n);ents.push({player:1});
  const pos=e=>{if(e.player)return[px,py];if(e.mv)return[(e.mv.fx+(e.mv.tx-e.mv.fx)*e.mv.p)*TS,(e.mv.fy+(e.mv.ty-e.mv.fy)*e.mv.p)*TS];return[e.x*TS,e.y*TS];};
  ents.sort((a,b)=>pos(a)[1]-pos(b)[1]);
  for(const e of ents){const [ex,ey]=pos(e);const sx=ex-cx,sy=ey-cy;let fr2=0;
    if(e.player){if(G.mv)fr2=G.mv.p>0.25&&G.mv.p<0.75?(G.stepN%2?1:2):0;}else if(e.mv)fr2=e.mv.p>0.25&&e.mv.p<0.75?1:0;
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(sx+16,sy+29,10,4,0,0,7);ctx.fill();
    ctx.drawImage(charSprite(e.player?'player':e.look,e.player?G.pdir:e.dir,fr2),sx,sy-6,32,36);
    if(e.bubble>0){panel(sx+4,sy-34,24,26,'#fff');txt('!',sx+16,sy-14,'#e02020',24,'center',null);}
    if(e.trainer&&!flag('t_'+e.id)&&!e.player&&TICK%60<6){}}
  if(m.theme==='cave'){const g=ctx.createRadialGradient(px-cx+16,py-cy+16,40,px-cx+16,py-cy+16,260);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.75)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  if(m.outdoor&&!m.dungeon){drawSnow(cx,cy,1);coldGrade(0.08);}else if(m.theme==='cave')drawSnow(cx,cy,0.15);
  if(G.minimap&&m.world)drawMinimap();
  if(G.banner>0){const a=Math.min(1,G.banner/20);ctx.globalAlpha=a;panel(8,8,Math.max(150,measure(m.name,24)+40),40,'#f8f0d8');txt(m.name,24,36,'#403020',24);ctx.globalAlpha=1;}}
function drawSpecial(k,sx,sy){const s=TS;
  if(k==='gC'){for(let i=0;i<4;i++)R(ctx,sx+3+i*8,sy,4,s,'#505860');R(ctx,sx,sy+4,s,4,'#404850');R(ctx,sx,sy+s-8,s,4,'#404850');}
  else if(k[0]==='r'||k[0]==='u'){const col=k[0]==='r'?'#d03838':'#3858e0';if(k[1]==='U'){ctx.fillStyle=col;ctx.fillRect(sx+2,sy+2,s-4,s-4);ctx.fillStyle=shade(col,0.35);for(let i=0;i<3;i++)ctx.fillRect(sx+4,sy+6+i*9+(TICK/4%9),s-8,2);ctx.strokeStyle=shade(col,0.5);ctx.strokeRect(sx+2,sy+2,s-4,s-4);}
    else{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.strokeRect(sx+4,sy+4,s-8,s-8);ctx.setLineDash([]);}}
  else if(k[0]==='S'){ctx.fillStyle='#303038';ctx.beginPath();ctx.ellipse(sx+16,sy+18,11,8,0,0,7);ctx.fill();ctx.fillStyle=G.sw===0?'#3858e0':'#d03838';ctx.beginPath();ctx.ellipse(sx+16,sy+15,9,6,0,0,7);ctx.fill();}}
function drawMinimap(){const m=curMap();const e=exploredArr(G.map);const w=m.grid[0].length,h=m.grid.length;const ps=3;
  const vw=Math.min(w,40),vh=Math.min(h,26);const x0=clamp(G.px-Math.floor(vw/2),0,w-vw),y0=clamp(G.py-Math.floor(vh/2),0,h-vh);
  const bx=W-vw*ps-12,by=8;ctx.fillStyle='rgba(10,14,24,.8)';rr(bx-4,by-4,Math.max(vw*ps,84)+8,vh*ps+20,4);ctx.fill();
  for(let y=0;y<vh;y++)for(let x=0;x<vw;x++){const gx=x0+x,gy=y0+y;const seen=e[gy*w+gx];ctx.fillStyle=seen?(MMCOL[m.grid[gy][gx]]||'#555'):'#0b0e16';ctx.fillRect(bx+x*ps,by+y*ps,ps,ps);}
  for(const wp of m.warps||[]){if(e[wp.y*w+wp.x]&&wp.x>=x0&&wp.x<x0+vw&&wp.y>=y0&&wp.y<y0+vh){ctx.fillStyle='#ffe040';ctx.fillRect(bx+(wp.x-x0)*ps,by+(wp.y-y0)*ps,ps,ps);}}
  for(const n of G.npcs){if(!npcVisible(n)||!e[n.y*w+n.x])continue;if(n.x<x0||n.x>=x0+vw||n.y<y0||n.y>=y0+vh)continue;ctx.fillStyle=n.trainer&&!flag('t_'+n.id)?'#ff4040':'#80c0ff';ctx.fillRect(bx+(n.x-x0)*ps,by+(n.y-y0)*ps,ps,ps);}
  if(TICK%30<22){ctx.fillStyle='#fff';ctx.fillRect(bx+(G.px-x0)*ps-1,by+(G.py-y0)*ps-1,ps+2,ps+2);}
  txt(m.name,bx,by+vh*ps+12,'#c0d0f0',14,'left',null);}

// ---------- main loop ----------
function update(){if(FS.need&&!FS.ok){clearPressed();return;}TICK++;tickInput();tickTimers();if(G.started&&!UI.some(u=>u.isTitle))G.time++;
  if(BT)battleTick();
  if(G.banner>0)G.banner--;if(G.fade>0&&!G.inWarp)G.fade=Math.max(0,G.fade-0.05);if(G.flashOW>0)G.flashOW--;
  if(UI.length){UI[UI.length-1].update();}
  else if(G.started){updateMovers();
    if(!G.busy&&!G.mv){if(press('start')){Snd.sfx('ok');startMenu();}
      else if(press('map')){G.busy=true;openWorldMap().then(t=>{if(t)warpTown(t);else G.busy=false;});}
      else if(press('a'))interact();
      else{for(const d of ['up','down','left','right'])if(held[d]||pressed[d]){if(G.pdir!==d&&!G.turnT){G.pdir=d;G.turnT=5;break;}if(G.turnT>0)break;tryMove(d);break;}}}
    if(G.turnT>0&&!['up','down','left','right'].some(d=>held[d]))G.turnT=0;if(G.turnT>0)G.turnT--;}
  if(UI.length&&G.started&&!BT)updateMovers();
  clearPressed();}
function draw(){ctx.setTransform(RS,0,0,RS,0,0);ctx.imageSmoothingEnabled=false;if(BT)drawBattle();else if(G.started)drawOverworld();else{ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);}
  for(const u of UI)u.draw();
  if(G.fade>0){ctx.fillStyle='rgba(0,0,0,'+G.fade+')';ctx.fillRect(0,0,W,H);}
  if(G.flashOW>0){ctx.fillStyle='rgba(255,255,255,'+(G.flashOW/8)+')';ctx.fillRect(0,0,W,H);}}
let last=performance.now(),acc=0;
function loopFrame(now){acc+=Math.min(100,now-last);last=now;while(acc>=1000/60){update();acc-=1000/60;}draw();requestAnimationFrame(loopFrame);}

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
async function boot(){setupTouch();setupFS();try{await Promise.race([document.fonts.load('22px VT323'),new Promise(r=>setTimeout(r,1500))]);}catch(e){}
  requestAnimationFrame(loopFrame);
  while(true){Snd.music('title');const t=titleW();t.isTitle=1;const r=await pushUI(t);
    if(r==='Continue'){const opts=[0,1,2].map(i=>{const s=slotInfo(i);return 'Slot '+(i+1)+': '+(s?s.name+' · '+(MAPS[s.map]?MAPS[s.map].name:'?')+' · '+fmtTime(s.time):'— empty —');});opts.push('Back');
      const i=await choose(opts,{x:40,y:60});const s=i>=0&&i<3?slotInfo(i):null;if(!s)continue;G.started=true;loadSave(s);G.fade=1;break;}
    else{await pushUI(storyW(['Calderra. A volcanic peninsula covered in the ruins of the Makers.','The Makers vanished long ago. Their machines did not.','Shardbots: robots that run on elemental crystals called shards.','For a thousand years, every bot has drawn power from the HEARTFORGE, deep beneath Mt. Cinder.','Now the Heartforge is failing. Bots are going feral. The winters are getting longer.','What is your name?']));
      G.name=await nameEntry();
      await pushUI(storyW(['In the village of Ashgrove, '+G.name+' is about to wake up...']));
      G.started=true;loadMap('home',2,2,'down');G.fade=1;G.busy=true;await wait(30);
      await say(G.name+'! Are you awake? Dr. Vesna was here this morning. She wants to see you at the lab, the big building on the east side of town.',{speaker:'Mom'});
      await say('Controls: Arrow keys / D-pad to move, Z or A to talk, X or B to go back (hold to run), Enter or START for the menu, M for the map.');
      G.busy=false;break;}}}
window.G=G;
boot();
