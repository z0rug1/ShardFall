// ===================== WORLD 2: Thaw, ferals, follower, field skills =====================
// ---- THE THAW ----
function thawed(id){return !!(G.thaw&&G.thaw[id]);}
async function thawRegions(ids,why){G.thaw=G.thaw||{};const fresh=ids.filter(i=>!G.thaw[i]);if(!fresh.length)return;for(const i of fresh)G.thaw[i]=1;
  G.thawFx=180;Snd.jingle('evo',curMap().music);
  await say(why||'Warm air rolls across the land...');
  await say('THAW: '+fresh.map(i=>MAPS[i].name).join(', ')+(fresh.length>1?' have':' has')+' thawed! The snow melts, new paths open and new bots appear.');
  collectLights();if(MAPS[G.map].enc)spawnFerals();}
function thawCount(){return Object.keys(G.thaw||{}).length;}

// ---- tile overrides (melted ice, broken rock) ----
function buildTileOv(){G.tileOv={};const pre='mod_'+G.map+'_';for(const k in G.flags){if(k.startsWith(pre)){const [x,y]=k.slice(pre.length).split('_');G.tileOv[x+','+y]=G.flags[k];}}}
function setTileOv(x,y,ch){setFlag('mod_'+G.map+'_'+x+'_'+y,ch);G.tileOv[x+','+y]=ch;}

// ---- party type helpers ----
function botWithType(t){return G.party.find(b=>b.hp>0&&(BOTS[b.id].types.includes(t)||b.shards.includes(t)));}
function lead(){return G.party.find(b=>b.hp>0);}

// ---- FOLLOWER ----
function resetFollower(){const order=[OPP[G.pdir],'left','right','down','up'];let fx=G.px,fy=G.py;for(const d of order){const [dx,dy]=DIRS[d];const x=G.px+dx,y=G.py+dy;const ch=T(x,y);if(ch!=null&&!tileSolid(ch)&&!warpAt(x,y)&&!BELT[ch]&&ch!=='V'&&!npcAt(x,y)&&!objAt(x,y)){fx=x;fy=y;break;}}G.fol={x:fx,y:fy,fx,fy,dir:G.pdir};}
function followerMoved(oldx,oldy){const f=G.fol;if(!f)return resetFollower();f.fx=f.x;f.fy=f.y;f.x=oldx;f.y=oldy;f.dir=oldx<f.fx?'left':oldx>f.fx?'right':oldy<f.fy?'up':'down';}
function followerPos(){const f=G.fol;if(!f)return null;const p=G.mv?G.mv.p:1;return[(f.fx+(f.x-f.fx)*p)*TS,(f.fy+(f.y-f.fy)*p)*TS];}
function drawFollower(cx,cy){const b=G.folShow||lead();if(!b||G.surf||!G.fol)return;const [x,y]=followerPos();if(x===G.px*TS&&y===G.py*TS&&!G.mv)return;
  const bob=Math.sin(TICK/10)*2;ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x-cy*0+16-cx,y+28-cy,9,3,0,0,7);ctx.fill();
  const sp=bspr(b,{blink:TICK%240<6});const flip=G.fol.dir==='right';ctx.save();if(flip){ctx.translate(x-cx+34,y-cy-6+bob);ctx.scale(-1,1);ctx.drawImage(sp,0,0,36,36);}else ctx.drawImage(sp,x-cx-2,y-cy-6+bob,36,36);ctx.restore();}

// ---- FERALS (visible encounters) ----
const FERAL_BEH={pipsprock:'flee',boltbun:'flee',sporelet:'flee',gearpup:'hunt',scrapmite:'hunt',gloomlamp:'hunt',pebblit:'wander',dripcell:'wander',frostling:'wander',cogwyrm:'hunt',kilnfly:'flee'};
function encTiles(){const m=curMap();if(m._encT)return m._encT;const L=[];m.grid.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(r[x]===m.enc.tile)L.push([x,y]);});m._encT=L;return L;}
function feralAt(x,y){return (G.ferals||[]).find(f=>(f.x===x&&f.y===y)||(f.mv&&f.mv.tx===x&&f.mv.ty===y));}
function encList(){const m=curMap();let l=m.enc.list.slice();if(thawed(G.map)&&m.thawEnc)l=l.concat(m.thawEnc);return l;}
function spawnOne(far){const m=curMap();const T_=encTiles();if(!T_.length)return;
  for(let tries=0;tries<40;tries++){const [x,y]=pick(T_);const d=Math.abs(x-G.px)+Math.abs(y-G.py);if(d<(far?7:4)||feralAt(x,y)||npcAt(x,y)||objAt(x,y))continue;
    const l=encList();let tot=l.reduce((a,b)=>a+b[3],0),r=rnd(tot),pk=l[0];for(const e of l){if((r-=e[3])<0){pk=e;break;}}
    const fr=BOTS[pk[0]].frame;const f={id:pk[0],lv:pk[1]+rnd(pk[2]-pk[1]+1),x,y,dir:pick(['up','down','left','right']),beh:FERAL_BEH[fr]||'wander',mv:null,t:30+rnd(60),cool:0,glitch:rnd(200)===0};
    G.ferals.push(f);return f;}}
function spawnFerals(){G.ferals=[];const m=curMap();if(!m.enc)return;const n=m.enc.count||6;for(let i=0;i<n;i++)spawnOne(false);
  if(m.alpha&&!flag('alpha_'+G.map)){const T_=encTiles();const [x,y]=m.alpha.at||pick(T_);G.ferals.push({id:m.alpha.id,lv:m.alpha.lv,x,y,dir:'down',beh:'hunt',mv:null,t:60,cool:0,alpha:1});}}
function feralCanStep(f,x,y){const ch=T(x,y);if(ch!==curMap().enc.tile)return false;if(npcAt(x,y)||objAt(x,y)||crateAt(x,y))return false;if((G.ferals||[]).some(o=>o!==f&&((o.x===x&&o.y===y)||(o.mv&&o.mv.tx===x&&o.mv.ty===y))))return false;return true;}
function updateFerals(){const m=curMap();if(!m.enc||!G.ferals)return;const blocked=G.busy||UI.length||BT;
  for(const f of G.ferals){if(f.mv){f.mv.p+=f.beh==='hunt'&&f.chasing?1/10:1/16;if(f.mv.p>=1){f.x=f.mv.tx;f.y=f.mv.ty;f.mv=null;if(f.x===G.px&&f.y===G.py&&!blocked&&!G.mv){contactFeral(f,false);return;}}continue;}
    if(blocked)continue;if(f.cool>0){f.cool--;}
    if(--f.t>0)continue;
    const dx=G.px-f.x,dy=G.py-f.y,d=Math.abs(dx)+Math.abs(dy);let dir=null;f.chasing=false;
    if(f.beh==='hunt'&&d<=(f.alpha?5:4)&&!f.cool){f.chasing=true;dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
      if(d===1){f.dir=dir;contactFeral(f,false);return;}}
    else if(f.beh==='flee'&&d<=3){dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'left':'right'):(dy>0?'up':'down');}
    else if(Math.random()<0.6)dir=pick(['up','down','left','right']);
    f.t=f.chasing?14:40+rnd(70);if(!dir)continue;f.dir=dir;const [sx,sy]=DIRS[dir];const nx=f.x+sx,ny=f.y+sy;
    if(nx===G.px&&ny===G.py)continue;if(feralCanStep(f,nx,ny))f.mv={fx:f.x,fy:f.y,tx:nx,ty:ny,p:0};}
  if(!blocked&&TICK%420===0&&G.ferals.length<(m.enc.count||6))spawnOne(true);}
async function contactFeral(f,playerInitiated){if(G.busy||BT)return;G.busy=true;
  const sneak=playerInitiated&&f.dir===G.pdir;const ambush=!playerInitiated;
  if(f.alpha){Snd.sfx('thunder');await say('A huge ALPHA '+BOTS[f.id].name+' blocks your path! There\'s a bounty on this one.');}
  const wb=makeBot(f.id,f.lv);if(f.glitch)wb.glitch=1;if(f.alpha){wb.alpha=1;}
  const r=await runBattle({wild:wb,sneak,ambush,alpha:f.alpha});
  const i=G.ferals.indexOf(f);
  if(r==='run'){f.cool=240;f.chasing=false;}else if(i>=0)G.ferals.splice(i,1);
  if(r==='win'&&f.alpha){setFlag('alpha_'+G.map);G.money+=600;const p=pick(Object.keys(PARTS));addItem(p,1);Snd.jingle('victory',curMap().music);await say('Bounty claimed! +600 Cr, and you salvaged a '+ITEMS[p].n+' from the Alpha.');}
  if(r==='caught'&&f.alpha){setFlag('alpha_'+G.map);G.money+=300;await say('Linking an Alpha counts for half the bounty: +300 Cr.');}
  G.busy=false;}
function drawFeral(f,cx,cy){const x=(f.mv?f.mv.fx+(f.mv.tx-f.mv.fx)*f.mv.p:f.x)*TS-cx,y=(f.mv?f.mv.fy+(f.mv.ty-f.mv.fy)*f.mv.p:f.y)*TS-cy;
  if(weatherKey()==='blizzard'&&Math.hypot(x+cx-G.px*TS,y+cy-G.py*TS)>5*TS)return;
  const sz=f.alpha?46:32;const bob=Math.sin((TICK+f.x*13)/9)*2;
  if(f.alpha){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x+16,y+14,4,x+16,y+14,34);g.addColorStop(0,'rgba(255,60,40,'+(0.3+0.15*Math.sin(TICK/8))+')');g.addColorStop(1,'rgba(255,60,40,0)');ctx.fillStyle=g;ctx.fillRect(x-20,y-24,72,72);ctx.restore();}
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x+16,y+27,sz/3,3,0,0,7);ctx.fill();
  const sp=botSprite(f.id,{glitch:f.glitch,blink:(TICK+f.x*31)%230<6});const flip=f.dir==='right';ctx.save();
  if(flip){ctx.translate(x+16+sz/2,y+26-sz+bob);ctx.scale(-1,1);ctx.drawImage(sp,0,0,sz,sz);}else ctx.drawImage(sp,x+16-sz/2,y+26-sz+bob,sz,sz);ctx.restore();
  if(f.chasing&&TICK%20<14)wtxt('!',x+24,y-8,'#ff5040',18);
  if(f.beh==='flee'&&Math.abs(G.px*TS-cx-x)+Math.abs(G.py*TS-cy-y)<4*TS&&TICK%30<15)wtxt('…',x+22,y-6,'#c0e0ff',14);}

// ---- FIELD SKILLS ----
async function fieldSkill(ch,fx,fy){const m=curMap();const key=fx+','+fy;
  if(ch==='i'){const b=botWithType('Flame');if(!b){await say('Thick black ice. Something glints inside... A Flame-type bot could melt it.');return true;}
    if((await ask('Thick black ice. Have '+BOTS[b.id].name+' melt it?'))!==0)return true;
    G.folShow=b;Snd.sfx('od');burstOW(fx,fy,'#ff8040');await wait(30);G.folShow=null;setTileOv(fx,fy,m.theme==='cave'?'^':'.');
    await say(BOTS[b.id].name+' melted the ice!');const loot=(m.iceLoot||{})[key];if(loot&&!flag('ice_'+G.map+key)){setFlag('ice_'+G.map+key);addItem(loot,1);Snd.sfx('item');await say('Frozen inside: a '+ITEMS[loot].n+'!');}return true;}
  if(ch==='z'){const b=botWithType('Brawl');if(!b){await say('Cracked rock. Warm light leaks through... A Brawl-type bot could smash it.');return true;}
    if((await ask('Cracked rock. Have '+BOTS[b.id].name+' smash it?'))!==0)return true;
    G.folShow=b;Snd.sfx('crit');burstOW(fx,fy,'#c0a080');await wait(24);G.folShow=null;setTileOv(fx,fy,(m.breakTo&&m.breakTo[key])||(m.theme==='cave'?'^':'.'));await say(BOTS[b.id].name+' smashed through the rock!');return true;}
  if(ch==='n'){await say(thawed(G.map)?'Slush.':'A wall of packed, frozen snow. It will only melt when this region thaws.');return true;}
  if(ch==='~'&&!G.surf){const g=botWithType('Gale'),t=botWithType('Tide');const [dx,dy]=DIRS[G.pdir];
    let land=null;for(let k=1;k<=3;k++){const x=G.px+dx*(k+0),y=G.py+dy*(k+0);if(k===1)continue;const c2=T(x,y);if(c2!=null&&!tileSolid(c2)&&c2!=='~'&&!npcAt(x,y)&&!objAt(x,y)){land=[x,y];break;}}
    if(g&&land){if((await ask('Glide across with '+BOTS[g.id].name+'?'))!==0)return true;G.folShow=g;Snd.sfx('switch');
      const [lx,ly]=land;const sx=G.px,sy=G.py;for(let i=1;i<=20;i++){G.glide={p:i/20,sx,sy,lx,ly};await wait(1);}G.glide=null;const ox=G.px,oy=G.py;G.px=lx;G.py=ly;followerMoved(ox,oy);resetFollower();G.folShow=null;markExplored();return true;}
    if(t){if((await ask('The water is calm. Ride '+BOTS[t.id].name+' across?'))!==0)return true;G.surf=t;Snd.sfx('door');await stepPlayer(G.pdir);return true;}
    if(g&&!land){await say('Too far to glide from here.');return true;}
    return false;}
  return false;}
function burstOW(x,y,col){for(let i=0;i<16;i++){const a=Math.random()*6.28,s=1+Math.random()*2;OWP.push({x:x*TS+16,y:y*TS+16,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:0,max:26,k:'spark',col});}}

// ---- RELAY PYLONS ----
async function pylonRun(o){const id=o.id;if(flag('pylon_'+id)){await say('The relay pylon hums. Warmth radiates from it.');return;}
  const b=botWithType('Volt');if(!b){await say('A dead relay pylon, crusted in frost. It used to carry Heartforge heat. A Volt-type bot could jump-start it.');return;}
  if((await ask('A dead relay pylon. Have '+BOTS[b.id].name+' jump-start it?'))!==0)return;
  G.folShow=b;Snd.sfx('thunder');burstOW(o.x,o.y,'#fff6a0');await wait(40);G.folShow=null;setFlag('pylon_'+id);
  await say(BOTS[b.id].name+' channels current into the pylon. It sputters... and blazes to life!');
  await thawRegions(o.thaws,'Heat pulses outward from the pylon...');}
function drawPylon(o,sx,sy){const on=flag('pylon_'+o.id);R(ctx,sx+12,sy-14,8,40,'#3a4250');R(ctx,sx+13,sy-14,2,40,'#5a6676');R(ctx,sx+6,sy-16,20,6,'#4a5464');
  ctx.fillStyle=on?(TICK%20<10?'#ffd060':'#ffb040'):'#506070';ctx.beginPath();ctx.arc(sx+16,sy-20,5,0,7);ctx.fill();
  if(!on){R(ctx,sx+10,sy-12,12,3,'#e8f0f6');}else{ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx+16,sy-20,2,sx+16,sy-20,26);g.addColorStop(0,'rgba(255,200,100,.6)');g.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=g;ctx.fillRect(sx-12,sy-48,56,56);ctx.restore();}}
