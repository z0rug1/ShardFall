// ===================== PERF 2: cached tile grid, cached tracker, one-pass surface FX, fish that stay in water =====================
// ---- T(): resolve every tile once per map state, then plain array lookups ----
let TG=null;const _Tslow=T;
function rebuildTG(){const m=curMap();if(!m)return;const h=m.grid.length,w=m.grid[0].length;const g=new Array(h);TG=null;for(let y=0;y<h;y++){const row=new Array(w);for(let x=0;x<w;x++)row[x]=_Tslow(x,y);g[y]=row;}TG={map:G.map,m,g,w,h};}
function invalidateTG(){TG=null;}
T=function(x,y){const t=TG;if(!t||t.map!==G.map||t.m!==curMap()){rebuildTG();if(!TG)return _Tslow(x,y);}if(y<0||x<0||y>=TG.h||x>=TG.w)return null;return TG.g[y][x];};
{const _lm=loadMap;loadMap=function(...a){invalidateTG();const r=_lm(...a);invalidateTG();return r;};}
{const _sf=setFlag;setFlag=function(f,...a){const r=_sf(f,...a);if(/^(open_|mod_|got_)/.test(f)||/^badge/.test(f))invalidateTG();return r;};}
if(typeof buildTileOv==='function'){const _bt=buildTileOv;buildTileOv=function(...a){const r=_bt(...a);invalidateTG();return r;};}
if(typeof thawRegions==='function'){const _tr=thawRegions;thawRegions=async function(...a){const r=await _tr(...a);invalidateTG();MFX.key='';return r;};}
// tile overrides change during play (melted ice, broken rocks): watch the override count
{const _uf=update;update=function(){_uf();const n=G.tileOv?Object.keys(G.tileOv).length:0;if(n!==G._tovN){G._tovN=n;invalidateTG();}};}
// ---- tracker: recompute at most twice a second ----
{const _tt=trackerTarget;let cache=null,at=-99,key='';trackerTarget=function(){const k=G.map+'|'+Object.keys(G.flags).length;if(k!==key||TICK-at>30){key=k;at=TICK;cache=_tt();}return cache;};}
// ---- fish: keep the whole body inside water ----
function deepWater(px,py){for(const [dx,dy] of [[-14,-7],[14,-7],[-14,7],[14,7],[0,0]]){if(T(Math.floor((px+dx)/TS),Math.floor((py+dy)/TS))!=='~')return false;}return true;}
// ---- snapshots are the biggest cost (reading the canvas back). Take them rarely, at quarter resolution ----
{let last=-99,lastMap=null;snapFrame=function(maxAge){maxAge=maxAge==null?6:maxAge;const w=Math.ceil(cv.width/4),h=Math.ceil(cv.height/4);
  if(SNAP&&SNAP.width===w&&SNAP.height===h&&TICK-last<maxAge&&lastMap===G.map&&!BT===!SNAP._bt)return SNAP;
  if(!SNAP||SNAP.width!==w||SNAP.height!==h){SNAP=mkCanvas(w,h);sgx=SNAP.getContext('2d');}sgx.imageSmoothingEnabled=true;sgx.drawImage(cv,0,0,w,h);last=TICK;lastMap=G.map;SNAP._bt=!BT;return SNAP;};}
SK=()=>RS/4;
// ---- reflections drawn from cached tile art instead of a canvas snapshot ----
drawWorldReflections=function(cx,cy){if(!hq())return;const m=curMap();const shiny=!m.outdoor&&(SHINY.includes(m.theme)||m.vaultMap);if(!m.outdoor&&!shiny)return;
  const th=m.theme==='out'&&thawed(G.map)?'outw':m.theme;const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS),nx=Math.ceil(W/TS)+1,ny=Math.ceil(H/TS)+1;const isR=shiny?(ch=>ch==='x'||ch==='E'||ch==='O'):REFL;const maxD=shiny?2:4;
  for(let x=x0;x<=x0+nx;x++){let y=y0;while(y<=y0+ny){const ch=T(x,y);if(ch==null||!isR(ch)){y++;continue;}let s=y;while(s>0&&isR(T(x,s-1)))s--;let e=y;while(isR(T(x,e+1)))e++;
    for(let r=Math.max(s,y0);r<=Math.min(e,y0+ny,s+maxD-1);r++){const d=r-s,src=s-1-d;const sc=T(x,src);if(sc==null||isR(sc))continue;const k=tileKey(sc,x,src);if(k.length===2)continue;
      const base=shiny?0.14:(T(x,r)==='-'?0.3:0.34);const a=base*(1-d/(shiny?2:maxD+0.5));if(a<=0.02)continue;const v=(x*7+src*3)%4===0?0:(x+src)%2+1;const art=tileArt(k,th,v,0);
      const wob=T(x,r)==='~'?Math.sin(TICK/22+r*1.7+x*0.4)*1.5:0;ctx.globalAlpha=a;ctx.save();ctx.translate(x*TS-cx+wob,r*TS-cy+TS);ctx.scale(1,-1);ctx.drawImage(art,0,0,TS,TS);ctx.restore();}
    y=e+1;}}ctx.globalAlpha=1;
  if(m.outdoor){const wx=curWeather();const dark=wx.dark||0;if(!wx.static&&dark<=0.35&&!(G.bolt>0))return;for(let y=y0;y<=y0+ny;y++)for(let x=x0;x<=x0+nx;x++){const ch=T(x,y);if(!REFL(ch))continue;const sx=x*TS-cx,sy=y*TS-cy;
     if(wx.static){ctx.fillStyle='rgba(120,90,210,.10)';ctx.fillRect(sx,sy,TS,TS);}if(dark>0.35&&ch==='~'){const hv=hh(x,y,11);if((TICK/8+hv)%9<6){ctx.fillStyle='rgba(230,240,255,.5)';ctx.fillRect(sx+(hv%28),sy+((hv>>6)%28),1.5,1.5);}}
     if(G.bolt>0){ctx.fillStyle='rgba(220,230,255,'+(G.bolt/14*0.5)+')';ctx.fillRect(sx,sy,TS,TS);}}}};
// ---- no more canvas read-backs: lens drops and heat haze are built from cached tile art ----
function worldPatch(wx,wy,rad){const c=mkCanvas(32,32);const g=c.getContext('2d');const m=curMap();if(!m)return c;const th=m.theme==='out'&&thawed(G.map)?'outw':m.theme;const sc=32/(rad*2);
 const x0=Math.floor((wx-rad)/TS),x1=Math.floor((wx+rad)/TS),y0=Math.floor((wy-rad)/TS),y1=Math.floor((wy+rad)/TS);
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const ch=T(x,y);if(ch==null)continue;const k=tileKey(ch,x,y);if(k.length===2)continue;const v=(x*7+y*3)%4===0?0:(x+y)%2+1;g.drawImage(tileArt(k,th,v,0),(x*TS-(wx-rad))*sc,(y*TS-(wy-rad))*sc,TS*sc+0.5,TS*sc+0.5);}
 const wk=curWeather();if(wk.dark){g.fillStyle='rgba(4,8,22,'+wk.dark*0.8+')';g.fillRect(0,0,32,32);}return c;}
drawLens=function(){if(!LENS.length)return;const rd=rimDrop();const cam=BT?null:camera();
 for(let i=LENS.length-1;i>=0;i--){const L=LENS[i];L.t++;if(L.t>L.life||L.y>H+20){LENS.splice(i,1);continue;}
  if(L.slide&&L.t>30){L.vy=Math.min(2.2,L.vy+0.04);L.y+=L.vy;L.x+=Math.sin(L.t/9)*0.25;if(L.t%6===0&&L.trail.length<8)L.trail.push({x:L.x,y:L.y-L.r*0.6,r:L.r*0.32,t:0});}
  const pop=Math.min(1,L.t/5),fade=Math.min(1,(L.life-L.t)/30);const r=L.r*(pop<1?0.6+0.6*pop:1);
  ctx.fillStyle='rgba(220,235,250,.18)';for(let j=L.trail.length-1;j>=0;j--){const tr=L.trail[j];tr.t++;if(tr.t>70){L.trail.splice(j,1);continue;}ctx.fillRect(tr.x-tr.r,tr.y-tr.r,tr.r*2,tr.r*2);}
  if(!L.patch||(L.slide&&L.t%20===0))L.patch=cam?worldPatch(cam.cx+L.x,cam.cy+L.y,L.r*2.6):null;
  ctx.save();ctx.globalAlpha=0.9*fade;ctx.beginPath();ctx.arc(L.x,L.y,r,0,7);ctx.clip();if(L.patch){ctx.translate(L.x,L.y);ctx.scale(-1,-1);ctx.drawImage(L.patch,-r,-r,r*2,r*2);}else{ctx.fillStyle='rgba(180,200,220,.25)';ctx.fillRect(L.x-r,L.y-r,r*2,r*2);}ctx.restore();
  ctx.globalAlpha=fade;ctx.drawImage(rd,L.x-r,L.y-r*1.04,r*2,r*2.08);if(L.t<6){ctx.globalAlpha=0.6*(1-L.t/6);ctx.strokeStyle='#e8f0ff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(L.x,L.y,r*(1+L.t*0.25),0,7);ctx.stroke();}ctx.globalAlpha=1;}};
drawHeatHaze=function(cx,cy){if(!hq())return;const m=curMap();const th=m.theme==='out'&&thawed(G.map)?'outw':m.theme;const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);
 for(let y=y0;y<=y0+Math.ceil(H/TS)+1;y++)for(let x=x0;x<=x0+Math.ceil(W/TS)+1;x++){const ch=T(x,y);if(!((ch==='V'&&ventActive(x,y))||ch==='*'||(ch==='J'&&m.outdoor)))continue;
  for(let ty=y-1;ty>=y-2;ty--){const sc=T(x,ty);if(sc==null)continue;const k=tileKey(sc,x,ty);if(k.length===2)continue;const v=(x*7+ty*3)%4===0?0:(x+ty)%2+1;const art=tileArt(k,th,v,0);const sx=x*TS-cx,sy=ty*TS-cy;
   for(let i=0;i<8;i++){const off=Math.sin(TICK/4+i*1.3+x+ty)*(1.4-(y-ty)*0.4);ctx.drawImage(art,0,i*4,32,4,sx+off,sy+i*4,TS,4);}}}};
// ---- ground cache: tiles + soft edges rendered into a big offscreen canvas, rebuilt only when needed ----
let GC=null;const GM=3;
function drawGround(cx,cy,th,fr){if(G.cam&&G.cam.z!==1)return false;const m=curMap();const fr40=Math.floor(TICK/40);
 const vx0=Math.floor(cx/TS),vy0=Math.floor(cy/TS),vw=Math.ceil(W/TS)+1,vh=Math.ceil(H/TS)+1;
 const ok=GC&&GC.map===G.map&&GC.m===m&&GC.tg===TG&&GC.th===th&&GC.fr===fr40&&GC.rs===RS&&GC.mfx===MFX.key&&GC.sw===G.sw&&GC.bf===(G.beltFlip&&G.beltFlip[G.map])&&vx0>=GC.x0&&vy0>=GC.y0&&vx0+vw<=GC.x0+GC.w&&vy0+vh<=GC.y0+GC.h;
 if(!ok){T(0,0);const w=vw+GM*2,h=vh+GM*2;const pw=w*TS*RS,ph=h*TS*RS;if(!GC||!GC.c||GC.c.width!==pw||GC.c.height!==ph){GC={c:mkCanvas(pw,ph)};GC.g=GC.c.getContext('2d');}
  const g=GC.g;GC.x0=vx0-GM;GC.y0=vy0-GM;GC.w=w;GC.h=h;GC.map=G.map;GC.m=m;GC.tg=TG;GC.th=th;GC.fr=fr40;GC.rs=RS;GC.sw=G.sw;GC.bf=(G.beltFlip&&G.beltFlip[G.map]);
  g.setTransform(RS,0,0,RS,0,0);g.imageSmoothingEnabled=false;g.fillStyle='#000';g.fillRect(0,0,w*TS,h*TS);GC.dyn=[];
  for(let y=GC.y0;y<GC.y0+h;y++)for(let x=GC.x0;x<GC.x0+w;x++){const ch=T(x,y);if(ch==null)continue;const k=tileKey(ch,x,y);const px=(x-GC.x0)*TS,py=(y-GC.y0)*TS;
   if(k.length===2||BELT[ch]||ch==='L'){GC.dyn.push([x,y]);g.drawImage(tileArt(m.theme==='cave'?'^':'x',th,(x+y)%2,0),px,py,TS,TS);continue;}
   let tf=0;if(ch==='~'||ch==='M'||ch==='≈'||ch==='<'||ch==='>'||ch==='!')tf=fr;else if(ch==='T')tf=Math.floor(fr40*0.83+x*0.37+y*0.21)%2;else if('ziEOao'.includes(ch))tf=(fr40+x)%2;
   g.drawImage(tileArt(k,th,(x*7+y*3)%4===0?0:(x+y)%2+1,tf),px,py,TS,TS);}
  ensureMapFX();GC.mfx=MFX.key;if(MFX.edge){g.imageSmoothingEnabled=false;g.drawImage(MFX.edge,GC.x0*16,GC.y0*16,w*16,h*16,0,0,w*TS,h*TS);}}
 const ox=(GC.x0*TS-cx),oy=(GC.y0*TS-cy);ctx.drawImage(GC.c,ox,oy,GC.w*TS,GC.h*TS);
 for(const [x,y] of GC.dyn){if(x<vx0-1||y<vy0-1||x>vx0+vw||y>vy0+vh)continue;const ch=T(x,y);const k=tileKey(ch,x,y);const sx=x*TS-cx,sy=y*TS-cy;
  if(k.length===2)drawSpecial(k,sx,sy);else{let tf=0;if(BELT[ch])tf=Math.floor(TICK/6)%2;else if(ch==='L')tf=beltFlipped()?1:0;ctx.drawImage(tileArt(k,th,(x*7+y*3)%4===0?0:(x+y)%2+1,tf),sx,sy,TS,TS);}}
 G._groundCached=true;return true;}
{const _du=drawUnderFX;drawUnderFX=function(cx,cy){if(G._groundCached){G._groundCached=false;G._camY=cy;ensureMapFX();return;}return _du(cx,cy);};}
// ---- lighting in ONE full-screen blit: darkness, light cut-outs and coloured glow all live in the half-res light map ----
drawLighting=function(cx,cy,px,py){const wx=curWeather();if(!wx.dark)return;if(!LMAP){LMAP=mkCanvas(240,160);lmg=LMAP.getContext('2d');}const g=lmg;
 g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.clearRect(0,0,240,160);g.fillStyle='rgba(4,8,22,'+wx.dark+')';g.fillRect(0,0,240,160);
 const lead_=G.party.find(b=>b.hp>0);const pcol=lead_?TCOL[BOTS[lead_.id].types[0]]:'#a0c0ff';
 const all=[{x:px+16,y:py+14,r:wx.dark>0.5?110:80,col:pcol,fl:0,player:1}];for(const l of dynLights())all.push(l);
 for(const l of G.lights||[]){const sx=l.x-cx,sy=l.y-cy;if(sx<-120||sy<-120||sx>W+120||sy>H+120)continue;all.push(l);}
 g.globalCompositeOperation='destination-out';const cut=lightCut();
 for(const l of all){const r=l.r*(l.fl?(0.92+0.08*Math.sin(TICK/6+l.x)):1)/2;g.drawImage(cut,(l.x-cx)/2-r,(l.y-cy)/2-r,r*2,r*2);}
 g.globalCompositeOperation='source-over';const str=hq()?0.16+0.2*Math.min(1,wx.dark/0.6):0.14;
 for(const l of all){if(!hq()&&!l.player)continue;const r=l.r*0.8/2;g.globalAlpha=l.player?0.14:str;g.drawImage(glowSpr(l.col),(l.x-cx)/2-r,(l.y-cy)/2-r,r*2,r*2);
  if(hq()&&!l.player){const tx=Math.floor(l.x/TS),ty=Math.floor(l.y/TS);for(let k=1;k<=3;k++){const ch=T(tx,ty+k);if(ch==='~'||ch==='-'){g.globalAlpha=0.3;g.drawImage(glowSpr(l.col),(l.x-cx)/2-5+Math.sin(TICK/10+k)*1.5,((ty+k)*TS-cy)/2-6,10,28);break;}}}}
 g.globalAlpha=1;ctx.drawImage(LMAP,0,0,W,H);};
