// ===================== GFX 2: reflections, rain + lens drops, ripples, haze, day/night, rim light, battle skies =====================
const REFL=ch=>ch==='~'||ch==='-';
const SHINY=['lab','gym1','gym2','factory','kiln'];
// ---------- world reflections: mirror what stands above the shoreline ----------
function drawWorldReflections(cx,cy){if(!hq())return;const m=curMap();const shiny=!m.outdoor&&(SHINY.includes(m.theme)||m.vaultMap);if(!m.outdoor&&!shiny)return;
  const can=ctx.canvas;const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS),nx=Math.ceil(W/TS)+1,ny=Math.ceil(H/TS)+1;
  const isR=shiny?(ch=>ch==='x'||ch==='E'||ch==='O'):REFL;const wx=curWeather();
  for(let x=x0;x<=x0+nx;x++){let y=y0;while(y<=y0+ny){const ch=T(x,y);if(ch==null||!isR(ch)){y++;continue;}
      let s=y;while(s>0&&isR(T(x,s-1)))s--;let e=y;while(isR(T(x,e+1)))e++;
      for(let r=Math.max(s,y0);r<=Math.min(e,y0+ny);r++){const d=r-s;const src=s-1-d;const base=shiny?0.14:(T(x,r)==='-'?0.3:0.34);const a=base*(1-d/(shiny?2:5));if(a<=0.02)continue;
        const sx=x*TS-cx,sy=src*TS-cy;if(sy<0||sy+TS>H||sx<-TS||sx>W)continue;const wob=T(x,r)==='~'?Math.sin(TICK/22+r*1.7+x*0.4)*1.5:0;
        const dx=Math.max(0,sx),cut=dx-sx,w=Math.min(TS-cut,W-dx);if(w<=0)continue;
        ctx.save();ctx.globalAlpha=a;ctx.translate(dx+wob,r*TS-cy+TS);ctx.scale(1,-1);ctx.drawImage(can,dx*RS,sy*RS,w*RS,TS*RS,0,0,w,TS);ctx.restore();}
      y=e+1;}}
  if(m.outdoor){// sky in the water: night stars, storm tint, lightning flash
    const dark=wx.dark||0;for(let y=y0;y<=y0+ny;y++)for(let x=x0;x<=x0+nx;x++){const ch=T(x,y);if(!REFL(ch))continue;const sx=x*TS-cx,sy=y*TS-cy;
      if(wx.static){ctx.fillStyle='rgba(120,90,210,.10)';ctx.fillRect(sx,sy,TS,TS);}
      if(dark>0.35&&ch==='~'){const hv=hh(x,y,11);if((TICK/8+hv)%9<6){ctx.fillStyle='rgba(230,240,255,'+(0.35+0.3*Math.sin(TICK/20+hv))+')';ctx.fillRect(sx+(hv%28),sy+((hv>>6)%28),1.5,1.5);}}
      if(G.bolt>0){ctx.fillStyle='rgba(220,230,255,'+(G.bolt/14*0.5)+')';ctx.fillRect(sx,sy,TS,TS);}}}}
// mirror a sprite below its feet if it stands on (or just above) water/ice or a shiny floor
function reflectSprite(img,sx,sy,w,h,wx,wy,alpha){if(!hq())return;const m=curMap();const shiny=!m.outdoor&&(SHINY.includes(m.theme)||m.vaultMap);
  const tx=Math.round(wx/TS),ty=Math.round(wy/TS);const yf=sy+h;let Ys=null,a=alpha||0.3;
  if(shiny){Ys=yf;a=0.13;}else if(REFL(T(tx,ty))){Ys=yf;a=T(tx,ty)==='-'?0.3:0.24;}else{for(let k=1;k<=2;k++)if(REFL(T(tx,ty+k))&&!REFL(T(tx,ty+k-1))){Ys=(ty+k)*TS-(G._camY||0);a=0.26/k;break;}}
  if(Ys==null)return;const wob=REFL(T(tx,ty+1))&&T(tx,ty+1)==='~'?Math.sin(TICK/14)*1:0;
  ctx.save();ctx.globalAlpha=a;ctx.beginPath();ctx.rect(sx-8,Ys,w+16,h*1.2);ctx.clip();ctx.translate(sx+wob,2*Ys-yf+h);ctx.scale(1,-1);ctx.drawImage(img,0,0,w,h);ctx.restore();}
// follower + ferals get reflections too
{const _df=drawFollower;drawFollower=function(cx,cy){const b=G.folShow||lead();if(b&&!G.surf&&G.fol){const p=followerPos();if(p){const bob=Math.sin(TICK/10)*2;reflectSprite(bspr(b),p[0]-cx-2,p[1]-cy-6+bob,36,36,p[0],p[1]);}}return _df(cx,cy);};}
{const _dfe=drawFeral;drawFeral=function(f,cx,cy){const wx=(f.mv?f.mv.fx+(f.mv.tx-f.mv.fx)*f.mv.p:f.x)*TS,wy=(f.mv?f.mv.fy+(f.mv.ty-f.mv.fy)*f.mv.p:f.y)*TS;const sz=f.alpha?46:32;reflectSprite(botSprite(f.id),wx-cx+(32-sz)/2,wy-cy+(32-sz)-2,sz,sz,wx,wy,0.25);return _dfe(f,cx,cy);};}

// ---------- rain: parallax streaks, splashes, ripples, drops on the screen glass ----------
WEATHER.clear.rain=0.6;WEATHER.clearnight.rain=0.5;WEATHER.clearstatic.rain=0.8;WEATHER.static.rain=0.35;WEATHER.static.sleet=1;
WEATHER.clear.snow=0.02;WEATHER.clearnight.snow=0.02;WEATHER.clearstatic.snow=0;
function rainNow(){const wx=curWeather();const m=curMap();if(!wx.rain||!m||!m.outdoor||m.theme==='cave'||m.dungeon)return 0;const k=0.55+0.45*Math.sin(G.time/(3600*1.3))+0.25*Math.sin(G.time/1700);return Math.max(0,Math.min(1,wx.rain*Math.max(0.15,k)));}
const RAIN=[],LENS=[];
function rainFrame(intensity,wind,ground){const target=Math.floor((hq()?170:70)*intensity);while(RAIN.length<target){const z=Math.random();RAIN.push({x:Math.random()*(W+80)-40,y:Math.random()*-H,z,gy:ground?ground(z):H*(0.3+Math.random()*0.7)});}
  if(RAIN.length>target)RAIN.length=target;const ang=0.18+wind*0.12;
  for(const d of RAIN){const sp=7+d.z*11;d.y+=sp;d.x+=sp*ang;const len=6+d.z*16;
    if(d.y>d.gy){if(d.z<0.85&&Math.random()<0.6)OWS.push({x:d.x,y:d.gy,t:0,max:10+d.z*6,z:d.z});d.y=-Math.random()*60;d.x=Math.random()*(W+80)-60;d.gy=ground?ground(d.z):H*(0.3+Math.random()*0.7);continue;}
    ctx.strokeStyle='rgba(200,220,240,'+(0.18+d.z*0.32)+')';ctx.lineWidth=0.6+d.z*1.2;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-len*ang,d.y-len);ctx.stroke();}
  for(let i=OWS.length-1;i>=0;i--){const s=OWS[i];s.t++;if(s.t>s.max){OWS.splice(i,1);continue;}const k=s.t/s.max;ctx.strokeStyle='rgba(210,230,250,'+(0.5*(1-k))+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(s.x,s.y,1+k*(3+s.z*4),0.5+k*(1+s.z*1.5),0,0,7);ctx.stroke();}
  // drops hitting the "camera"
  if(hq()&&Math.random()<intensity*0.07&&LENS.length<16)LENS.push({x:20+Math.random()*(W-40),y:10+Math.random()*(H-60),r:4+Math.random()*9,t:0,life:90+Math.random()*160,vy:0,slide:Math.random()<0.45,trail:[]});
  drawLens();}
const OWS=[];
function drawLens(){const can=ctx.canvas;for(let i=LENS.length-1;i>=0;i--){const L=LENS[i];L.t++;if(L.t>L.life){LENS.splice(i,1);continue;}
    if(L.slide&&L.t>30){L.vy=Math.min(2.2,L.vy+0.04);L.y+=L.vy;L.x+=Math.sin(L.t/9)*0.25;if(L.t%5===0)L.trail.push({x:L.x,y:L.y-L.r*0.6,r:L.r*0.32,t:0});}
    if(L.y>H+20){LENS.splice(i,1);continue;}
    const pop=Math.min(1,L.t/5),fade=Math.min(1,(L.life-L.t)/30);const r=L.r*(pop<1?0.6+0.6*pop:1);
    for(let j=L.trail.length-1;j>=0;j--){const tr=L.trail[j];tr.t++;if(tr.t>70){L.trail.splice(j,1);continue;}ctx.fillStyle='rgba(220,235,250,'+(0.22*(1-tr.t/70)*fade)+')';ctx.beginPath();ctx.arc(tr.x,tr.y,tr.r,0,7);ctx.fill();}
    ctx.save();ctx.globalAlpha=0.92*fade;ctx.beginPath();ctx.ellipse(L.x,L.y,r,r*1.08,0,0,7);ctx.clip();
    // refraction: a shrunken, upside-down view of what's behind the drop
    const sr=r*2.6;const sx=Math.max(0,L.x-sr),sy=Math.max(0,L.y-sr),sw=Math.min(W-sx,sr*2),sh=Math.min(H-sy,sr*2);
    if(sw>1&&sh>1){ctx.translate(L.x,L.y);ctx.scale(-1,-1);ctx.drawImage(can,sx*RS,sy*RS,sw*RS,sh*RS,-r,-r,r*2,r*2);ctx.setTransform(RS,0,0,RS,0,0);}
    ctx.restore();ctx.save();ctx.globalAlpha=fade;
    const g=ctx.createRadialGradient(L.x,L.y,r*0.55,L.x,L.y,r*1.05);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,20,40,.45)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(L.x,L.y,r,r*1.08,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.ellipse(L.x-r*0.35,L.y-r*0.4,r*0.22,r*0.14,-0.6,0,7);ctx.fill();
    if(L.t<6){ctx.strokeStyle='rgba(230,240,255,'+(0.6*(1-L.t/6))+')';ctx.lineWidth=1;ctx.beginPath();ctx.arc(L.x,L.y,r*(1+L.t*0.25),0,7);ctx.stroke();}
    ctx.restore();}}
function drawRainOW(cx,cy){const k=rainNow();if(k<=0.02){if(LENS.length)drawLens();return;}const wx=curWeather();
  rainFrame(k,wx.wind||0,z=>H*(0.15+0.85*Math.random()));
  // ripples on water + puddles
  if(Math.random()<k*0.8){const x=Math.floor((cx+Math.random()*W)/TS),y=Math.floor((cy+Math.random()*H)/TS);if(T(x,y)==='~'||isPuddle(x,y))ripple(x*TS+4+Math.random()*24,y*TS+6+Math.random()*20,0.6);}
  ctx.fillStyle='rgba(20,30,50,'+(0.06*k)+')';ctx.fillRect(0,0,W,H);}
function ripple(x,y,s){OWP.push({x,y,vx:0,vy:0,t:0,max:40,k:'ring',s:s||1});}
function isPuddle(x,y){return MFX.puddles&&MFX.puddles.has(x+','+y);}
// ring particles
{const _owp=owParticles;owParticles=function(cx,cy,px,py){for(const p of OWP)if(p.k==='ring'){const k=p.t/p.max;ctx.strokeStyle='rgba(220,236,252,'+(0.55*(1-k))+')';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(p.x-cx,p.y-cy,2+k*10*p.s,1+k*4*p.s,0,0,7);ctx.stroke();}
  for(const p of OWP)if(p.k==='ring'){p.max_=p.max;}return _owp(cx,cy,px,py);};}
// ripples when walking beside water, and when snow lands on it
{const _ap=addPrint;addPrint=function(){_ap();for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){if(T(G.px+dx,G.py+dy)==='~'){ripple((G.px+dx)*TS+16-dx*10,(G.py+dy)*TS+14-dy*8,1);break;}}};}

// ---------- moving shore foam + puddles (baked positions) ----------
{const _bake=bakeMapFX;bakeMapFX=function(){_bake();const m=curMap();const Wt=m.grid[0].length,Ht=m.grid.length;MFX.shore=[];MFX.puddles=new Set();
  for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){const ch=T(x,y);if(ch==='~'){for(const [dx,dy,s] of [[0,-1,'u'],[0,1,'d'],[-1,0,'l'],[1,0,'r']]){const b=T(x+dx,y+dy);if(b!=null&&b!=='~'&&b!=='b')MFX.shore.push([x,y,s]);}}
    else if(m.outdoor&&m.theme==='out'&&thawed(G.map)&&(ch==='='||ch==='.')&&hh(x,y,21)%19===0)MFX.puddles.add(x+','+y);}
  if(MFX.puddles.size){const e=MFX.edge.getContext('2d');for(const k of MFX.puddles){const [x,y]=k.split(',').map(Number);const hv=hh(x,y,5);const px=x*16+3+(hv%4),py=y*16+5+((hv>>3)%5);
    e.fillStyle='#3e5466';e.fillRect(px+1,py,8,1);e.fillRect(px,py+1,10,3);e.fillRect(px+1,py+4,8,1);e.fillStyle='#5a7890';e.fillRect(px+2,py+1,5,1);e.fillStyle='#8ab0c8';e.fillRect(px+2,py+1,2,1);}}};}
function drawShoreFoam(cx,cy){if(!MFX.shore||!hq())return;for(const [x,y,s] of MFX.shore){const sx=x*TS-cx,sy=y*TS-cy;if(sx<-TS||sy<-TS||sx>W||sy>H)continue;const w=2+1.6*Math.sin(TICK/24+x*0.9+y*0.7);const a=0.25+0.2*Math.sin(TICK/24+x*0.9+y*0.7+1);
  ctx.fillStyle='rgba(236,246,255,'+a+')';if(s==='u')ctx.fillRect(sx,sy+2,TS,w);else if(s==='d')ctx.fillRect(sx,sy+TS-2-w,TS,w);else if(s==='l')ctx.fillRect(sx+2,sy,w,TS);else ctx.fillRect(sx+TS-2-w,sy,w,TS);}}

// ---------- heat haze over active vents / furnaces ----------
function drawHeatHaze(cx,cy){if(!hq())return;const can=ctx.canvas;const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);
  for(let y=y0;y<=y0+Math.ceil(H/TS)+1;y++)for(let x=x0;x<=x0+Math.ceil(W/TS)+1;x++){const ch=T(x,y);const hot=(ch==='V'&&ventActive(x,y))||ch==='*'||(ch==='J'&&curMap().outdoor);if(!hot)continue;
    const sx=x*TS-cx,sy=y*TS-cy-40;for(let i=0;i<8;i++){const yy=sy+i*6;if(yy<0||yy+6>H||sx<0||sx+TS>W)continue;const off=Math.sin(TICK/4+i*1.3+x)*(1.6-i*0.15);ctx.drawImage(can,sx*RS,yy*RS,TS*RS,6*RS,sx+off,yy,TS,6);}}}

// ---------- day / night cycle on outdoor daytime maps ----------
const DAYLEN=3600*24;
function dayPhase(){const p=(G.time%DAYLEN)/DAYLEN;// 0..1
  if(p<0.55)return{add:0,dusk:0,night:0};if(p<0.65){const k=(p-0.55)/0.1;return{add:0.42*k,dusk:Math.sin(k*Math.PI),night:k};}
  if(p<0.88)return{add:0.42,dusk:0,night:1};const k=(p-0.88)/0.12;return{add:0.42*(1-k),dusk:Math.sin(k*Math.PI)*0.7,night:1-k};}
{const _cw=curWeather;let cache={t:-1};curWeather=function(){const w=_cw();const m=curMap();if(!m||!m.outdoor||m.theme!=='out'||(w.dark||0)>=0.3)return w;
  if(cache.t===TICK&&cache.w===w)return cache.r;const dp=dayPhase();const r=dp.add?Object.assign({},w,{dark:(w.dark||0)+dp.add,dusk:dp.dusk}):w;cache={t:TICK,w,r};return r;};}
function drawDusk(){const wx=curWeather();if(!wx.dusk)return;ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle='rgba(255,120,60,'+(0.35*wx.dusk)+')';ctx.fillRect(0,0,W,H);ctx.restore();ctx.fillStyle='rgba(255,140,80,'+(0.06*wx.dusk)+')';ctx.fillRect(0,0,W,H);}

// ---------- light shafts through fog / blizzard (daytime) ----------
function drawShafts(cx,cy){if(!hq())return;const m=curMap();const wx=curWeather();if(!m.outdoor||m.theme==='cave'||(wx.dark||0)>0.35)return;
  const fogT=(wx.fog||0)>0.05||/w/.test((m.grid[Math.max(0,Math.min(m.grid.length-1,G.py))]||''));if(!fogT)return;
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const x=((i*157+TICK*0.15-cx*0.3)%(W+200))-100;const g=ctx.createLinearGradient(x,0,x+60,0);g.addColorStop(0,'rgba(255,250,230,0)');g.addColorStop(0.5,'rgba(255,250,230,'+(0.05+0.03*Math.sin(TICK/50+i))+')');g.addColorStop(1,'rgba(255,250,230,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+60,0);ctx.lineTo(x+160,H);ctx.lineTo(x+100,H);ctx.fill();}ctx.restore();}

// ---------- dynamic lights: follower core + feral eyes in the dark ----------
function dynLights(){const L=[];const wx=curWeather();if((wx.dark||0)<0.3)return L;const b=lead();
  if(b&&G.fol&&!G.surf){const p=followerPos();if(p)L.push({x:p[0]+16,y:p[1]+10,r:52,col:TCOL[BOTS[b.id].types[0]],fl:1});}
  for(const f of G.ferals||[])L.push({x:f.x*TS+16,y:f.y*TS+12,r:f.alpha?34:20,col:'#ff3a3a',fl:1});return L;}

// ---------- rim light on characters near lamps at night ----------
const RIMC=new Map();
function rimSil(img,col){let m=RIMC.get(img);if(!m){m={};RIMC.set(img,m);}if(m[col])return m[col];const c=mkCanvas(img.width,img.height);const g=c.getContext('2d');g.drawImage(img,0,0);g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,c.width,c.height);m[col]=c;return c;}
function rimLight(img,sx,sy,w,h,wx,wy){if(!hq())return;const d=curWeather().dark||0;if(d<0.25)return;let best=null,bd=1e9;for(const l of G.lights||[]){const dx=l.x-(wx+16),dy=l.y-(wy+10);const q=dx*dx+dy*dy;if(q<bd&&q<120*120){bd=q;best=l;}}if(!best)return;
  const dist=Math.sqrt(bd)||1;const k=1-dist/120;const ux=(best.x-(wx+16))/dist,uy=(best.y-(wy+10))/dist;ctx.save();ctx.globalAlpha=Math.min(1,0.4+k);ctx.drawImage(rimSil(img,best.col),sx+ux*1.6,sy+uy*1.6,w,h);ctx.restore();}

// ---------- snow collecting on you in snowfall ----------
const SNOWPTS={down:[[10,4],[14,2],[19,3],[22,5],[8,13],[24,13],[12,1],[17,1],[6,15],[26,15]],up:[[10,4],[14,2],[19,3],[22,5],[8,13],[24,13],[12,1],[17,1],[6,15],[26,15]],left:[[9,4],[13,2],[18,3],[11,1],[16,1],[10,13],[20,13],[8,15],[14,5],[22,14]],right:[[23,4],[19,2],[14,3],[21,1],[16,1],[22,13],[12,13],[24,15],[18,5],[10,14]]};
function snowOnPlayer(sx,sy){const m=curMap();const wx=curWeather();if(m.outdoor&&m.theme!=='cave'&&(wx.snow||0)>0.25&&!G.surf){G.snowAcc=Math.min(1,(G.snowAcc||0)+0.0006*wx.snow*(1+(wx.wind||0)));}
  else if(!m.outdoor&&(G.snowAcc||0)>0.25){for(let i=0;i<12;i++)OWP.push({x:G.px*TS+16+(Math.random()-0.5)*16,y:G.py*TS+4,vx:(Math.random()-0.5)*2,vy:Math.random()*1.5,t:0,max:24,k:'spark',col:'#f2f8ff'});G.snowAcc=0;}
  else if(m.outdoor&&(wx.snow||0)<0.1)G.snowAcc=Math.max(0,(G.snowAcc||0)-0.002);
  const n=Math.floor((G.snowAcc||0)*10);if(!n)return;const pts=SNOWPTS[G.pdir]||SNOWPTS.down;ctx.fillStyle='#f4f9ff';for(let i=0;i<n;i++){const [x,y]=pts[i];ctx.fillRect(sx+x,sy+y,2.5,2);}}

// ---------- battle: skies, hit light flashes, rain ----------
function drawBattleSky(B){const id=B.mapId||'';const th=B.bg;const t=TICK;
  if(['ashgrove','route1','brasston','workshop'].includes(id)||B.wx==='night'){for(let b=0;b<3;b++){ctx.beginPath();for(let x=0;x<=W;x+=8){const y=26+b*18+Math.sin(x/60+t/70+b)*12;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}for(let x=W;x>=0;x-=8)ctx.lineTo(x,44+b*18+Math.sin(x/60+t/70+b)*12);ctx.closePath();ctx.fillStyle=['rgba(64,224,200,.13)','rgba(140,110,255,.10)','rgba(64,180,255,.08)'][b];ctx.fill();}}
  if(th==='factory'||id==='rustworks'||id==='ferrow'||id==='gym3'){for(let i=0;i<6;i++){const x=40+i*80+Math.sin(t/90+i)*10,y=150-((t*0.4+i*40)%170);const r=18+((t*0.4+i*40)%170)*0.25;ctx.fillStyle='rgba(40,36,40,'+(0.35*(y/150))+')';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}}
  if(th==='kiln'||['kilnhaven','route4','gym4'].includes(id)){const g=ctx.createLinearGradient(0,0,0,232);g.addColorStop(0,'rgba(255,90,40,.0)');g.addColorStop(1,'rgba(255,110,50,.28)');ctx.fillStyle=g;ctx.fillRect(0,0,W,232);
    for(let i=0;i<18;i++){const x=(i*61+t*0.6)%W,y=232-((t*0.9+i*37)%232);ctx.fillStyle='rgba(255,'+(150+(i%3)*30)+',60,'+(0.5+0.5*Math.sin(t/7+i))+')';ctx.fillRect(x,y,2,2);}}}
{const _mf=moveFx;moveFx=async function(t,side,tside,...rest){if(BT)BT.glow={col:TCOL[t]||'#ffffff',t:26,side:tside};return _mf(t,side,tside,...rest);};}
function drawBattleGlow(B){if(!B.glow||B.glow.t<=0||!hq())return;const g0=B.glow;g0.t--;const k=g0.t/26;const [x,y]=g0.side==='e'?[360,80]:[130,180];ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,10,x,y,300);g.addColorStop(0,hexA(g0.col,0.32*k));g.addColorStop(1,hexA(g0.col,0));ctx.fillStyle=g;ctx.fillRect(0,0,W,232);ctx.restore();}
function drawBattleRain(B){if(!B.rain||B.rain<0.02||!hq())return;ctx.save();ctx.beginPath();ctx.rect(0,0,W,232);ctx.clip();rainFrame(B.rain,0.4,z=>150+z*80);ctx.restore();}
