// ===================== PERF: cached light sprites, single-frame snapshots, batched rain, adaptive quality =====================
// Visual effects mode: G.fxq 2/undefined = Auto, 1 = High, 0 = Low. Auto drops to Low (and a lower render scale) if frames run slow.
hq=function(){if(G.fxq===1)return true;if(G.fxq===0)return false;return !G.autoLow;};
// ---- cached sprites ----
const SPR={};
function lightCut(){if(SPR.cut)return SPR.cut;const c=mkCanvas(128,128);const g=c.getContext('2d');const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(0.55,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return SPR.cut=c;}
function glowSpr(col){const k='g'+col;if(SPR[k])return SPR[k];const c=mkCanvas(64,64);const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,hexA(col,1));gr.addColorStop(1,hexA(col,0));g.fillStyle=gr;g.fillRect(0,0,64,64);return SPR[k]=c;}
function softSpr(){if(SPR.soft)return SPR.soft;const c=mkCanvas(64,64);const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(10,20,40,1)');gr.addColorStop(1,'rgba(10,20,40,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return SPR.soft=c;}
function rimDrop(){if(SPR.drop)return SPR.drop;const c=mkCanvas(64,64);const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,17,32,32,33);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,20,40,.5)');g.fillStyle=gr;g.beginPath();g.arc(32,32,32,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(21,19,7,4.5,-0.6,0,7);g.fill();return SPR.drop=c;}
function shaftSpr(){if(SPR.shaft)return SPR.shaft;const c=mkCanvas(64,8);const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,64,0);gr.addColorStop(0,'rgba(255,250,230,0)');gr.addColorStop(0.5,'rgba(255,250,230,1)');gr.addColorStop(1,'rgba(255,250,230,0)');g.fillStyle=gr;g.fillRect(0,0,64,8);return SPR.shaft=c;}
// ---- one snapshot of the frame so far (half resolution) instead of drawing the canvas onto itself many times ----
let SNAP=null,sgx=null;
function snapFrame(){const w=Math.ceil(cv.width/2),h=Math.ceil(cv.height/2);if(!SNAP||SNAP.width!==w||SNAP.height!==h){SNAP=mkCanvas(w,h);sgx=SNAP.getContext('2d');}sgx.imageSmoothingEnabled=false;sgx.drawImage(cv,0,0,w,h);return SNAP;}
let SK=()=>RS/2;// logical -> snapshot pixels
// ---- lighting: half-res light map + sprite stamps (no per-frame gradients) ----
let LMAP=null,lmg=null;
drawLighting=function(cx,cy,px,py){const wx=curWeather();if(!wx.dark)return;if(!LMAP){LMAP=mkCanvas(240,160);lmg=LMAP.getContext('2d');}const g=lmg;
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,240,160);g.fillStyle='rgba(4,8,22,'+wx.dark+')';g.fillRect(0,0,240,160);g.globalCompositeOperation='destination-out';
  const lead_=G.party.find(b=>b.hp>0);const pcol=lead_?TCOL[BOTS[lead_.id].types[0]]:'#a0c0ff';
  const all=[{x:px+16,y:py+14,r:wx.dark>0.5?110:80,col:pcol,fl:0,player:1}];for(const l of dynLights())all.push(l);
  for(const l of G.lights||[]){const sx=l.x-cx,sy=l.y-cy;if(sx<-120||sy<-120||sx>W+120||sy>H+120)continue;all.push(l);}
  const cut=lightCut();for(const l of all){const r=l.r*(l.fl?(0.92+0.08*Math.sin(TICK/6+l.x)):1);const sx=(l.x-cx)/2,sy=(l.y-cy)/2,rr=r/2;g.drawImage(cut,sx-rr,sy-rr,rr*2,rr*2);}
  const prev=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=true;ctx.drawImage(LMAP,0,0,W,H);ctx.imageSmoothingEnabled=prev;
  // coloured glow (replaces the separate light-bleed pass)
  const str=hq()?0.12+0.22*Math.min(1,wx.dark/0.6):0.18;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const l of all){const sx=l.x-cx,sy=l.y-cy;if(!hq()&&!l.player)continue;if(sx<-l.r||sy<-l.r||sx>W+l.r||sy>H+l.r)continue;const r=l.r*(hq()?0.8:0.7);ctx.globalAlpha=l.player?0.19:Math.min(0.5,str+0.12);ctx.drawImage(glowSpr(l.col),sx-r,sy-r,r*2,r*2);
    if(hq()&&!l.player){const tx=Math.floor(l.x/TS),ty=Math.floor(l.y/TS);for(let k=1;k<=3;k++){const ch=T(tx,ty+k);if(ch==='~'||ch==='-'){const ry=(ty+k)*TS-cy+16,wob=Math.sin(TICK/10+k)*3;ctx.globalAlpha=ch==='~'?0.35:0.25;ctx.drawImage(glowSpr(l.col),sx+wob-10,ry-28,20,56);break;}}}}
  ctx.restore();};
drawLightBleed=function(){};
// ---- cloud shadows + vignette via sprites ----
drawSkyFX=function(cx,cy){const m=curMap();const wx=curWeather();
  if(m.outdoor&&m.theme!=='cave'&&!m.dungeon&&(wx.dark||0)<0.3&&hq()){const mw=m.grid[0].length*TS,mh=m.grid.length*TS;ctx.globalAlpha=0.1;
    for(let i=0;i<3;i++){const x=((TICK*0.18+i*523)%(mw+600))-300-cx,y=((i*311+137)%Math.max(1,mh))-cy;ctx.drawImage(softSpr(),x-270,y-135,540,270);}ctx.globalAlpha=1;}
  if(!m.outdoor){if(!drawSkyFX.v){const c=mkCanvas(240,160);const g=c.getContext('2d');const gr=g.createRadialGradient(120,80,56,120,80,170);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(6,8,18,.42)');g.fillStyle=gr;g.fillRect(0,0,240,160);drawSkyFX.v=c;}
    ctx.imageSmoothingEnabled=true;ctx.drawImage(drawSkyFX.v,0,0,W,H);ctx.imageSmoothingEnabled=false;if(m.theme==='house'||m.theme==='repair'){ctx.fillStyle='rgba(255,170,90,.05)';ctx.fillRect(0,0,W,H);}}};
drawDusk=function(){const wx=curWeather();if(!wx.dusk)return;ctx.fillStyle='rgba(255,130,70,'+(0.13*wx.dusk)+')';ctx.fillRect(0,0,W,H);};
drawShafts=function(cx,cy){if(!hq())return;const m=curMap();const wx=curWeather();if(!m.outdoor||m.theme==='cave'||(wx.dark||0)>0.35)return;
  const fogT=(wx.fog||0)>0.05||/w/.test((m.grid[Math.max(0,Math.min(m.grid.length-1,G.py))]||''));if(!fogT)return;
  ctx.save();ctx.globalCompositeOperation='lighter';const sp=shaftSpr();for(let i=0;i<4;i++){const x=((i*157+TICK*0.15-cx*0.3)%(W+200))-100;ctx.globalAlpha=0.06+0.03*Math.sin(TICK/50+i);
    ctx.setTransform(RS,0,0,RS,0,0);ctx.transform(1,0,0.33,1,x,0);ctx.drawImage(sp,0,0,64,H);}ctx.restore();};
// ---- reflections from one snapshot, max 4 rows deep ----
drawWorldReflections=function(cx,cy){if(!hq())return;const m=curMap();const shiny=!m.outdoor&&(SHINY.includes(m.theme)||m.vaultMap);if(!m.outdoor&&!shiny)return;
  const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS),nx=Math.ceil(W/TS)+1,ny=Math.ceil(H/TS)+1;const isR=shiny?(ch=>ch==='x'||ch==='E'||ch==='O'):REFL;
  const runs=[];for(let x=x0;x<=x0+nx;x++){let y=y0;while(y<=y0+ny){const ch=T(x,y);if(ch==null||!isR(ch)){y++;continue;}let s=y;while(s>0&&isR(T(x,s-1)))s--;let e=y;while(isR(T(x,e+1)))e++;runs.push([x,s,e]);y=e+1;}}
  if(!runs.length)return;const S=snapFrame(),k=SK();const maxD=shiny?2:4;
  for(const [x,s,e] of runs)for(let r=Math.max(s,y0);r<=Math.min(e,y0+ny,s+maxD-1);r++){const d=r-s,src=s-1-d;const base=shiny?0.14:(T(x,r)==='-'?0.3:0.34);const a=base*(1-d/(shiny?2:maxD+0.5));if(a<=0.02)continue;
    const sx=x*TS-cx,sy=src*TS-cy;if(sy<0||sy+TS>H)continue;const dx=Math.max(0,sx),cut=dx-sx,w=Math.min(TS-cut,W-dx);if(w<=0)continue;const wob=T(x,r)==='~'?Math.sin(TICK/22+r*1.7+x*0.4)*1.5:0;
    ctx.save();ctx.globalAlpha=a;ctx.translate(dx+wob,r*TS-cy+TS);ctx.scale(1,-1);ctx.drawImage(S,dx*k,sy*k,w*k,TS*k,0,0,w,TS);ctx.restore();}
  if(m.outdoor){const wx=curWeather();const dark=wx.dark||0;if(!wx.static&&dark<=0.35&&!(G.bolt>0))return;for(const [x,s,e] of runs)for(let y=Math.max(s,y0);y<=Math.min(e,y0+ny);y++){const ch=T(x,y);const sx=x*TS-cx,sy=y*TS-cy;
      if(wx.static){ctx.fillStyle='rgba(120,90,210,.10)';ctx.fillRect(sx,sy,TS,TS);}
      if(dark>0.35&&ch==='~'){const hv=hh(x,y,11);if((TICK/8+hv)%9<6){ctx.fillStyle='rgba(230,240,255,.5)';ctx.fillRect(sx+(hv%28),sy+((hv>>6)%28),1.5,1.5);}}
      if(G.bolt>0){ctx.fillStyle='rgba(220,230,255,'+(G.bolt/14*0.5)+')';ctx.fillRect(sx,sy,TS,TS);}}}};
// ---- heat haze from a snapshot ----
drawHeatHaze=function(cx,cy){if(!hq())return;const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);const hot=[];
  for(let y=y0;y<=y0+Math.ceil(H/TS)+1;y++)for(let x=x0;x<=x0+Math.ceil(W/TS)+1;x++){const ch=T(x,y);if((ch==='V'&&ventActive(x,y))||ch==='*'||(ch==='J'&&curMap().outdoor))hot.push([x,y]);}
  if(!hot.length)return;const S=snapFrame(3),k=SK();for(const [x,y] of hot){const sx=x*TS-cx,sy=y*TS-cy-40;for(let i=0;i<8;i++){const yy=sy+i*6;if(yy<0||yy+6>H||sx<0||sx+TS>W)continue;const off=Math.sin(TICK/4+i*1.3+x)*(1.6-i*0.15);ctx.drawImage(S,sx*k,yy*k,TS*k,6*k,sx+off,yy,TS,6);}}};
// ---- rain: batched strokes, sprite drops, snapshot refraction ----
rainFrame=function(intensity,wind,ground){const target=Math.floor((hq()?150:60)*intensity);while(RAIN.length<target){const z=Math.random();RAIN.push({x:Math.random()*(W+80)-40,y:Math.random()*-H,z,gy:ground(z)});}
  if(RAIN.length>target)RAIN.length=target;const ang=0.18+wind*0.12;const P=[new Path2D(),new Path2D(),new Path2D()];
  for(const d of RAIN){const sp=7+d.z*11;d.y+=sp;d.x+=sp*ang;const len=6+d.z*16;
    if(d.y>d.gy){if(d.z<0.85&&OWS.length<60&&Math.random()<0.5)OWS.push({x:d.x,y:d.gy,t:0,max:10+d.z*6,z:d.z});d.y=-Math.random()*60;d.x=Math.random()*(W+80)-60;d.gy=ground(d.z);continue;}
    const p=P[d.z<0.4?0:d.z<0.75?1:2];p.moveTo(d.x,d.y);p.lineTo(d.x-len*ang,d.y-len);}
  ctx.strokeStyle='rgba(200,220,240,.22)';ctx.lineWidth=0.8;ctx.stroke(P[0]);ctx.strokeStyle='rgba(205,224,244,.34)';ctx.lineWidth=1.2;ctx.stroke(P[1]);ctx.strokeStyle='rgba(215,230,248,.46)';ctx.lineWidth=1.8;ctx.stroke(P[2]);
  const sp=new Path2D();for(let i=OWS.length-1;i>=0;i--){const s=OWS[i];s.t++;if(s.t>s.max){OWS.splice(i,1);continue;}const k=s.t/s.max;sp.moveTo(s.x+1+k*(3+s.z*4),s.y);sp.ellipse(s.x,s.y,1+k*(3+s.z*4),0.5+k*(1+s.z*1.5),0,0,7);}
  ctx.strokeStyle='rgba(210,230,250,.3)';ctx.lineWidth=1;ctx.stroke(sp);
  if(hq()&&Math.random()<intensity*0.06&&LENS.length<12)LENS.push({x:20+Math.random()*(W-40),y:10+Math.random()*(H-60),r:4+Math.random()*9,t:0,life:90+Math.random()*160,vy:0,slide:Math.random()<0.45,trail:[]});
  drawLens();};
drawLens=function(){if(!LENS.length)return;const S=snapFrame(10),k=SK();const rd=rimDrop();
  for(let i=LENS.length-1;i>=0;i--){const L=LENS[i];L.t++;if(L.t>L.life||L.y>H+20){LENS.splice(i,1);continue;}
    if(L.slide&&L.t>30){L.vy=Math.min(2.2,L.vy+0.04);L.y+=L.vy;L.x+=Math.sin(L.t/9)*0.25;if(L.t%6===0&&L.trail.length<8)L.trail.push({x:L.x,y:L.y-L.r*0.6,r:L.r*0.32,t:0});}
    const pop=Math.min(1,L.t/5),fade=Math.min(1,(L.life-L.t)/30);const r=L.r*(pop<1?0.6+0.6*pop:1);
    ctx.fillStyle='rgba(220,235,250,.18)';for(let j=L.trail.length-1;j>=0;j--){const tr=L.trail[j];tr.t++;if(tr.t>70){L.trail.splice(j,1);continue;}ctx.fillRect(tr.x-tr.r,tr.y-tr.r,tr.r*2,tr.r*2);}
    ctx.save();ctx.globalAlpha=0.92*fade;ctx.beginPath();ctx.arc(L.x,L.y,r,0,7);ctx.clip();const sr=r*2.6;const sx=Math.max(0,L.x-sr),sy=Math.max(0,L.y-sr),sw=Math.min(W-sx,sr*2),sh=Math.min(H-sy,sr*2);
    if(sw>1&&sh>1){ctx.translate(L.x,L.y);ctx.scale(-1,-1);ctx.drawImage(S,sx*k,sy*k,sw*k,sh*k,-r,-r,r*2,r*2);}ctx.restore();
    ctx.globalAlpha=fade;ctx.drawImage(rd,L.x-r,L.y-r*1.04,r*2,r*2.08);if(L.t<6){ctx.globalAlpha=0.6*(1-L.t/6);ctx.strokeStyle='#e8f0ff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(L.x,L.y,r*(1+L.t*0.25),0,7);ctx.stroke();}ctx.globalAlpha=1;}};
// ---- adaptive quality governor ----
const PERF={ema:12,n:0,bad:0,last:0};
function perfSample(ms){PERF.ema=PERF.ema*0.95+ms*0.05;PERF.n++;if(PERF.n<120)return;
  if(PERF.ema>19){PERF.bad++;}else PERF.bad=Math.max(0,PERF.bad-1);
  if(PERF.bad>90&&G.fxq!==1&&G.fxq!==0){PERF.bad=0;PERF.n=0;if(RS>2){setRS(2);toast('Lowered resolution to keep things smooth');}else if(!G.autoLow){G.autoLow=1;toast('Visual effects set to Low for speed (Options to change)');}}}
function toast(msg){G.toast={msg,t:200};}
function drawToast(){if(!G.toast||G.toast.t<=0)return;G.toast.t--;ctx.globalAlpha=Math.min(1,G.toast.t/30);panel(8,H-44,Math.min(W-16,measure(G.toast.msg,18)+28),34);txt(G.toast.msg,22,H-21,'#303840',18);ctx.globalAlpha=1;}
botGround=function(b,x,y,sz,flip){if(!b)return;const fx=x+sz/2,fy=y+sz*0.94;ctx.globalAlpha=0.55;ctx.drawImage(softSpr(),fx-sz*0.32,fy-sz*0.07,sz*0.64,sz*0.14);ctx.globalAlpha=1;
  if(hq()){const col=TCOL[BOTS[b.id].types[0]];ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=0.24+0.08*Math.sin(TICK/12);ctx.drawImage(glowSpr(col),fx-sz*0.42,fy-sz*0.13,sz*0.84,sz*0.26);ctx.restore();}};
// entity shadows from a sprite (no per-entity path fills or rotations)
entShadow=function(sx,sy,wx,wy){const sp=softSpr();ctx.globalAlpha=0.42;ctx.drawImage(sp,sx+4,sy+25,24,9);
  if(hq()&&(curWeather().dark||0)>0.2){let best=null,bd=22500;for(const l of G.lights||[]){const dx=wx+16-l.x,dy=wy+28-l.y;const d=dx*dx+dy*dy;if(d<bd){bd=d;best=[dx,dy];}}
    if(best){const d=Math.sqrt(bd)||1;const k=1-d/150;const ux=best[0]/d,uy=best[1]/d;const len=10+k*18;ctx.globalAlpha=0.18+0.22*k;
      if(Math.abs(ux)>Math.abs(uy))ctx.drawImage(sp,sx+16+ux*len*0.5-len,sy+26+uy*4,len*2,8);else ctx.drawImage(sp,sx+8+ux*6,sy+26+uy*len*0.4-len*0.3,16,len*0.9);}}
  ctx.globalAlpha=1;};
// cached UI panels (three rounded rects each, rebuilt only when size/skin changes)
{const PC=new Map();const rrg=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();};
  panel=function(x,y,w,h,fill){const sk=(typeof SKINS!=='undefined'&&SKINS[G.skin])||['#2a3242','#8aa0c0','#f8f6ec'];if(!fill)fill=sk[2];const key=w+'|'+h+'|'+fill+'|'+sk[0]+sk[1]+'|'+RS;
    let c=PC.get(key);if(!c){if(PC.size>160)PC.clear();c=mkCanvas(Math.max(1,Math.ceil(w*RS)),Math.max(1,Math.ceil(h*RS)));const g=c.getContext('2d');g.setTransform(RS,0,0,RS,0,0);
      g.fillStyle=sk[0];rrg(g,0,0,w,h,8);g.fill();g.fillStyle=sk[1];rrg(g,3,3,w-6,h-6,6);g.fill();g.fillStyle=fill;rrg(g,5,5,w-10,h-10,5);g.fill();PC.set(key,c);}
    ctx.drawImage(c,x,y,c.width/RS,c.height/RS);};}
