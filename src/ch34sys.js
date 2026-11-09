// ===================== CHAPTER 3–4 SYSTEMS: tides, gusts, skiff, heat/cold, Accord interference, new bots =====================
// ---- tiles ----
BELT['>']='right';BELT['<']='left';BFLIP['>']='>';BFLIP['<']='<';
Object.assign(MMCOL,{'_':'#8a8270','<':'#a8c0cc','>':'#a8c0cc','≈':'#1e3a5a','+':'#8a6a4a','!':'#7a4a3a',';':'#b8d8e8'});
{const _ta=tileArt;tileArt=function(ch,th,v,fr){if(!'_<>≈+!;'.includes(ch)||th==='outw')return _ta(ch,th,v,fr);const key=ch+th+v+fr;if(TCACHE[key])return TCACHE[key];
  const c=mkCanvas(32,32);const g=c.getContext('2d');g.scale(2,2);
  if(ch==='_'){R(g,0,0,16,16,'#8a8270');seedSpeck(g,'#7a7262',10,v+2);seedSpeck(g,'#a8a08c',6,v+5);R(g,2,4,5,1,'#6e7a80');R(g,9,11,5,1,'#6e7a80');if(v===1){R(g,11,3,2,2,'#c8c0b0');}}
  else if(ch==='<'||ch==='>'){grass(g,v);const o=fr?4:0;g.fillStyle='rgba(235,245,255,.75)';for(const y of [3,8,13]){const x0=((y*3+o+(ch==='>'?0:8))%16);R(g,x0,y,6,1,'rgba(235,245,255,.8)');R(g,(x0+9)%16,y+1,3,1,'rgba(235,245,255,.5)');}
    const ax=ch==='>'?11:4;ptri(g,ch==='>'?[ax,5,ax+3,8,ax,11]:[ax+3,5,ax,8,ax+3,11],'rgba(255,255,255,.55)');}
  else if(ch==='≈'){R(g,0,0,16,16,'#1e3a5a');const o=fr?3:0;R(g,(1+o)%16,3,6,1,'#3e6a90');R(g,(8+o)%16,8,7,1,'#4a7aa0');R(g,(3+o)%16,12,5,1,'#3e6a90');R(g,(12+o)%16,5,2,1,'#e0f0ff');R(g,(5+o)%16,10,2,1,'#e0f0ff');}
  else if(ch==='+'){R(g,0,0,16,16,'#0c1220');R(g,2,0,12,16,'#6a4e36');for(let y=1;y<16;y+=3)R(g,2,y,12,1,'#4a3424');R(g,1,0,1,16,'#c8b090');R(g,14,0,1,16,'#c8b090');}
  else if(ch==='!'){R(g,0,0,16,16,'#5a3a30');seedSpeck(g,'#7a4a36',10,v+2);seedSpeck(g,'#ff7a3a',fr?4:3,v+7);R(g,3,9,4,1,'#2a1a16');R(g,9,4,5,1,'#2a1a16');}
  else if(ch===';'){R(g,0,0,16,16,'#c8e0ec');seedSpeck(g,'#a8c8dc',10,v+2);seedSpeck(g,'#ffffff',6,v+5);R(g,2,6,6,1,'#9ab8cc');R(g,8,12,6,1,'#9ab8cc');R(g,6,2,1,4,'#9ab8cc');}
  TCACHE[key]=c;return c;};}
{const _ts=tileSolid;tileSolid=function(ch){if(ch==='≈')return !(G.surf&&G.surf.skiff);if(ch==='_')return tideHigh();return _ts(ch);};}
// ---- tides ----
function tideCycle(){const m=curMap();return m&&m.tide?m.tide:0;}
function tidePos(){const p=tideCycle();return p?((G.time%p)/p):0;}
function tideHigh(){const p=tideCycle();if(!p)return false;const t=tidePos();return t>=0.55&&t<0.95;}
function tideWarn(){const p=tideCycle();if(!p)return false;const t=tidePos();return t>=0.45&&t<0.55;}
let tideSafe=null;
async function swept(){if(G.scalding)return;G.scalding=true;G.busy=true;Snd.sfx('door');for(let i=0;i<=8;i++){G.fade=i/8;await wait(1);}
  if(tideSafe&&tideSafe.map===G.map){G.px=tideSafe.x;G.py=tideSafe.y;}G.mv=null;resetFollower();for(let i=8;i>=0;i--){G.fade=i/8;await wait(1);}
  G.errToast={t:120,msg:'The tide swept you back! Cross the flats when the water is out.'};G.busy=false;G.scalding=false;}
function tideTick(){const m=curMap();if(!m||!m.tide||!G.started||BT||G.busy||UI.length)return;const ch=T(G.px,G.py);if(ch!=='_'){if(!G.mv)tideSafe={map:G.map,x:G.px,y:G.py};return;}if(tideHigh()&&!G.mv)swept();}
function drawTideFX(cx,cy){const m=curMap();if(!m.tide)return;const hi=tideHigh(),warn=tideWarn();const t=tidePos();
  const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);let a=0;if(hi){a=Math.min(1,(t-0.55)/0.05)*Math.min(1,(0.95-t)/0.05);}else if(warn)a=(t-0.45)/0.1*0.35;
  if(a>0)for(let y=y0;y<=y0+Math.ceil(H/TS)+1;y++)for(let x=x0;x<=x0+Math.ceil(W/TS)+1;x++){if(T(x,y)!=='_')continue;const sx=x*TS-cx,sy=y*TS-cy;ctx.fillStyle='rgba(46,96,140,'+(0.85*a)+')';ctx.fillRect(sx,sy,TS,TS);
    ctx.fillStyle='rgba(200,230,255,'+(0.3*a)+')';ctx.fillRect(sx+((TICK*0.4+x*7)%28),sy+8+(y%3)*6,6,2);}
  // gauge
  const gx=8,gy=m.world?56:8;panel(gx,gy,92,30);txt('TIDE',gx+12,gy+21,'#303840',16);ctx.fillStyle='#3a4250';ctx.fillRect(gx+48,gy+10,36,10);ctx.fillStyle=hi?'#3a7ab8':warn?'#e0a040':'#8a8270';
  const lvl=hi?1:warn?(t-0.45)/0.1:t<0.45?0:1-(t-0.95)/0.05;ctx.fillRect(gx+48,gy+10,36*Math.max(0.08,Math.min(1,lvl)),10);}
// ---- skiff ----
{const _fs=fieldSkill;fieldSkill=async function(ch,x,y){if((ch==='≈'||ch==='~')&&!G.surf&&G.bag.skiff){if((await ask('Launch the Icebreaker Skiff?'))!==0)return true;const b=lead()||G.party[0];G.surf={skiff:1,id:b.id,lv:b.lv,uid:b.uid};Snd.sfx('door');await stepPlayer(G.pdir);return true;}
  if(ch==='≈'&&!G.surf){await say('The sea is too rough for a bot to swim. You\'d need a proper boat.');return true;}return _fs(ch,x,y);};}
function drawSkiff(sx,sy){const bob=Math.sin(TICK/8)*1.5;ctx.fillStyle='rgba(200,230,255,.5)';ctx.beginPath();ctx.ellipse(sx+16,sy+28,20+Math.sin(TICK/6)*2,6,0,0,7);ctx.fill();
  ctx.fillStyle='#4a3424';ctx.beginPath();ctx.moveTo(sx-2,sy+18+bob);ctx.lineTo(sx+34,sy+18+bob);ctx.lineTo(sx+28,sy+30+bob);ctx.lineTo(sx+4,sy+30+bob);ctx.fill();ctx.fillStyle='#c8b090';ctx.fillRect(sx-1,sy+18+bob,36,3);ctx.fillStyle='#e04a3a';ctx.fillRect(sx+2,sy+24+bob,28,2);}
// ---- heat / cold zones ----
let zoneSteps=0;
function zoneStep(){const ch=T(G.px,G.py);if(ch!=='!'&&ch!==';')return;const b=lead();if(!b)return;const ty=allTypes(b);const heat=ch==='!';
  const immune=heat?(ty.includes('Flame')||ty.includes('Tide')||b.mod==='coolfin'):(ty.includes('Flame')||ty.includes('Frost')||b.mod==='platekit');if(immune)return;
  zoneSteps++;let hit=false;for(const p of G.party){if(p.hp>1){const d=Math.max(1,Math.floor(stats(p).hp/40));p.hp=Math.max(1,p.hp-d);hit=true;}}
  if(hit&&zoneSteps%6===1)G.errToast={t:110,msg:heat?'The heat is wearing your bots down. A Flame or Tide lead (or a Coolant Fin) shrugs it off.':'The cold is cracking your bots\' plating. A Flame or Frost lead (or a Plating Kit) shrugs it off.'};}
// ---- Accord interference (Heartforge maps) ----
{const _da=doAction;doAction=async function(side,a){if(side==='p'&&curMap().accord&&a&&a.type==='move'&&Math.random()<0.15){const u=cur('p');Snd.sfx('glitch');BT.shake=8;
    await bsay('The Accord seizes '+BOTS[u.id].name+'! Its visor flickers red... it won\'t obey this turn.');return;}return _da(side,a);};}
// ---- allies in battle: Kael (or others) fight beside you ----
{const _po=partnerOf;partnerOf=function(side){const B=BT;if(B&&side==='p'&&B.ally&&B.ally.hp>0)return B.ally;return _po(side);};}

THEMES.nave={floor:'#2e2640',fl2:'#262036',wall:'#43305a',wl2:'#2a1c3a'};
