// ===================== EXT2: unique bot frames, attack trails, evolution, portraits, map icons, QoL =====================
// ---------- 1: every bot gets its own parts (shard armour + per-frame variation) ----------
const BOTX=new Map();
function partsFor(id){const d=BOTS[id];const sh=d.types[1]||(d.stage?d.types[0]:null);let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;return{sh,h,stage:!!d.stage,col:d.col||'#8a96a8'};}
function decorate(base,id,sil){const W_=base.width,Hh=base.height,u=W_/40;const c=mkCanvas(W_,Hh);const g=c.getContext('2d');let bb;
 try{const d=base.getContext('2d').getImageData(0,0,W_,Hh).data;let x0=W_,y0=Hh,x1=0,y1=0;for(let y=0;y<Hh;y+=u)for(let x=0;x<W_;x+=u){if(d[(y*W_+x)*4+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}bb={x0:x0/u,y0:y0/u,x1:x1/u,y1:y1/u};}catch(e){return base;}
 if(bb.x1<=bb.x0)return base;const P=partsFor(id);const OL=sil?'#05070c':'#0c1018';const cx=(bb.x0+bb.x1)/2,wd=bb.x1-bb.x0,top=bb.y0,mid=(bb.y0+bb.y1)/2;
 const K=(x,y,w,h,col)=>{g.fillStyle=OL;g.fillRect((x-1)*u,(y-1)*u,(w+2)*u,(h+2)*u);g.fillStyle=sil?'#10141c':col;g.fillRect(x*u,y*u,w*u,h*u);};
 const KF=(x,y,w,h,col)=>{g.fillStyle=sil?'#10141c':col;g.fillRect(x*u,y*u,w*u,h*u);};
 const back=[],front=[];const S=P.sh,v=P.h%4;
 const SH={Flame:'#ff7a3a',Tide:'#3aa8ff',Volt:'#f0d030',Stone:'#9a8a70',Gale:'#c8e0f0',Frost:'#9be0ff',Shade:'#6a4a9a',Spirit:'#d0b8ff',Iron:'#8a96a6',Bloom:'#5ad06a',Brawl:'#c04a3a',Core:'#c8ccd4'};
 if(S==='Tide'){back.push(()=>{K(bb.x0-3,mid-2,3,5,SH.Tide);K(bb.x1+1,mid-2,3,5,SH.Tide);KF(bb.x0-2,mid-1,1,3,'#a0e0ff');KF(bb.x1+2,mid-1,1,3,'#a0e0ff');});}
 if(S==='Gale'){back.push(()=>{K(bb.x0-5,mid-4,5,2,SH.Gale);K(bb.x0-4,mid-2,4,2,SH.Gale);K(bb.x1+1,mid-4,5,2,SH.Gale);K(bb.x1+1,mid-2,4,2,SH.Gale);});}
 if(S==='Stone'){back.push(()=>{K(bb.x0-2,mid-3,3,4,SH.Stone);K(bb.x1,mid-3,3,4,SH.Stone);KF(bb.x0-1,mid-2,1,1,'#c8b898');KF(bb.x1+1,mid-2,1,1,'#c8b898');});}
 if(S==='Iron'){back.push(()=>{K(bb.x0-2,mid-1,2,5,SH.Iron);K(bb.x1+1,mid-1,2,5,SH.Iron);KF(bb.x0-1,mid,1,1,'#e0e8f0');KF(bb.x1+1,mid+2,1,1,'#e0e8f0');});}
 if(S==='Bloom'){back.push(()=>{K(bb.x0-3,mid,3,2,SH.Bloom);K(bb.x1+1,mid,3,2,SH.Bloom);K(cx-1,top-3,2,3,SH.Bloom);});}
 if(S==='Brawl'){back.push(()=>{K(bb.x0-4,mid+1,4,4,SH.Brawl);K(bb.x1+1,mid+1,4,4,SH.Brawl);KF(bb.x0-3,mid+2,2,1,'#ff8a6a');KF(bb.x1+2,mid+2,2,1,'#ff8a6a');});}
 if(S==='Frost'){back.push(()=>{for(const [dx,hh] of [[-3,4],[0,6],[3,4]]){K(cx+dx-0.5,top-hh+1,1,hh,SH.Frost);}});}
 if(S==='Flame'){front.push(()=>{for(const [dx,hh] of [[-2,3],[0,5],[2,3]]){K(cx+dx-0.5,top-hh+1,1,hh,SH.Flame);KF(cx+dx-0.5,top-hh+1,1,1,'#ffe080');}});}
 if(S==='Volt'){front.push(()=>{K(cx-0.5,top-5,1,5,'#5a6676');K(cx-1,top-6,2,2,SH.Volt);K(cx+1,top-3,2,1,SH.Volt);});}
 if(S==='Shade'){front.push(()=>{K(bb.x0+1,top-3,1,3,SH.Shade);K(bb.x0,top-4,1,1,SH.Shade);K(bb.x1-1,top-3,1,3,SH.Shade);K(bb.x1,top-4,1,1,SH.Shade);});}
 if(S==='Spirit'){front.push(()=>{g.fillStyle=sil?'#10141c':'rgba(220,200,255,.85)';g.fillRect((cx-3)*u,(top-4)*u,6*u,u);g.fillRect((cx-4)*u,(top-3)*u,u,u);g.fillRect((cx+3)*u,(top-3)*u,u,u);});}
 if(S==='Core'){front.push(()=>{K(cx-0.5,top-3,1,3,'#5a6676');K(cx-2,top-5,4,2,SH.Core);});}
 if(!P.stage){// base frames: one small signature part each
  const pc=P.col;if(v===0)front.push(()=>{K(bb.x1-2,top-3,1,3,'#5a6676');K(bb.x1-2.5,top-4,2,1,pc);});
  else if(v===1)back.push(()=>{K(bb.x1,bb.y1-3,4,1,'#3a4250');K(bb.x1+3,bb.y1-4,2,2,pc);});
  else if(v===2)back.push(()=>{K(bb.x0-1,mid,1,3,'#3a4250');K(bb.x1,mid,1,3,'#3a4250');});
  else front.push(()=>{K(cx-3,top-1,6,1,pc);});}
 for(const f of back)f();g.drawImage(base,0,0);for(const f of front)f();if(base.core)c.core=base.core;return c;}
{const _bs=botSprite;botSprite=function(id,opt){const base=_bs(id,opt);let c=BOTX.get(base);if(c)return c;const O=opt===true?{sil:1}:(opt||{});c=decorate(base,id,!!O.sil);BOTX.set(base,c);return c;};}
// ---------- 2: attack trails by type ----------
{const _mf=moveFx;moveFx=async function(t,side,tside,...r){if(!G.skipFx&&BT){const [ax,ay]=BPOS[side],[bx,by]=BPOS[tside];const col=TCOL[t]||'#fff';
  if(t==='Flame')bfxAdd({max:26,draw(k){for(let i=0;i<12;i++){const q=Math.min(1,k*1.3)-i*0.05;if(q<0||q>1)continue;const x=ax+(bx-ax)*q,y=ay+(by-ay)*q-Math.sin(q*Math.PI)*30;ctx.fillStyle='rgba(255,'+(120+i*8)+',40,'+(0.7-i*0.05)+')';ctx.beginPath();ctx.arc(x,y,9-i*0.6,0,7);ctx.fill();}}});
  else if(t==='Volt')bfxAdd({max:24,draw(k){if(Math.floor(k*12)%3===2)return;ctx.strokeStyle='#fff6a0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ax,ay);for(let i=1;i<=8;i++){const q=i/8;ctx.lineTo(ax+(bx-ax)*q+(i<8?(Math.random()-0.5)*26:0),ay+(by-ay)*q+(i<8?(Math.random()-0.5)*26:0));}ctx.stroke();ctx.strokeStyle='rgba(240,208,48,.5)';ctx.lineWidth=7;ctx.stroke();}});
  else if(t==='Tide')bfxAdd({max:30,draw(k){if(k<0.4)return;const q=(k-0.4)/0.6;for(let i=0;i<14;i++){const a=i/14*6.28;ctx.fillStyle='rgba(120,200,255,'+(1-q)+')';ctx.beginPath();ctx.arc(bx+Math.cos(a)*q*44,by+Math.sin(a)*q*30-q*(1-q)*30,4,0,7);ctx.fill();}}});
  else if(t==='Gale')bfxAdd({max:24,draw(k){for(let i=0;i<3;i++){const q=k*1.5-i*0.2;if(q<0||q>1)continue;ctx.strokeStyle='rgba(230,245,255,'+(1-q)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(bx-40+q*80,by-10+i*12,26,-0.9,0.9);ctx.stroke();}}});
  else if(t==='Shade')bfxAdd({max:30,draw(k){const a=Math.sin(k*Math.PI)*0.55;ctx.fillStyle='rgba(20,8,40,'+a+')';ctx.fillRect(0,0,W,232);ctx.strokeStyle='rgba(160,90,255,'+a+')';ctx.lineWidth=4;ctx.strokeRect(2,2,W-4,228);}});
  else if(t==='Frost')bfxAdd({max:24,draw(k){for(let i=0;i<6;i++){const q=Math.min(1,k*1.4-i*0.07);if(q<0)continue;const x=ax+(bx-ax)*q+(i-3)*6,y=ay+(by-ay)*q+(i%2?8:-8);ptri(ctx,[x,y-6,x+5,y+4,x-5,y+4],'rgba(180,235,255,'+(1-q*0.6)+')');}}});
  else if(t==='Stone')bfxAdd({max:28,draw(k){for(let i=0;i<5;i++){const q=Math.min(1,k*1.3-i*0.08);if(q<0)continue;const x=bx+(i-2)*14,y=by-90+q*90;ctx.fillStyle='#7a6a58';ctx.fillRect(x-6,y-6,12,12);ctx.fillStyle='#a8987e';ctx.fillRect(x-6,y-6,12,4);}}});
  else if(t==='Spirit')bfxAdd({max:30,draw(k){for(let i=0;i<3;i++){const q=(k*1.4-i*0.15);if(q<0||q>1)continue;ctx.strokeStyle='rgba(208,184,255,'+(1-q)+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(bx,by,10+q*50,6+q*30,0,0,7);ctx.stroke();}}});
  else if(t==='Iron'||t==='Brawl')bfxAdd({max:16,draw(k){const s=1-k;ctx.strokeStyle=col;ctx.lineWidth=4*s+1;for(let i=0;i<8;i++){const a=i/8*6.28;ctx.beginPath();ctx.moveTo(bx+Math.cos(a)*10,by+Math.sin(a)*10);ctx.lineTo(bx+Math.cos(a)*(20+k*30),by+Math.sin(a)*(20+k*30));ctx.stroke();}}});}
 return _mf(t,side,tside,...r);};}
// ---------- 3: evolution scene ----------
evoScene=function(from,to,gl){Snd.music('evo',true);const col=TCOL[BOTS[to].types[BOTS[to].types.length-1]]||'#ffd060';const A=botSprite(from),Bs=botSprite(to);
 const frag=[];for(let i=0;i<16;i++)frag.push({sx:(i%4)/4,sy:Math.floor(i/4)/4,vx:(Math.random()-0.5)*9,vy:(Math.random()-0.9)*8,r:(Math.random()-0.5)*0.3});
 return{t:0,update(){this.t++;if(this.t>230&&(press('a')||press('start')))popUI(this);if(this.t>420)popUI(this);},draw(){const t=this.t;ctx.fillStyle='#070a14';ctx.fillRect(0,0,W,H);const cx=W/2,cy=130,S=150;
  for(let i=0;i<24;i++){const a=i/24*6.28+t/90;ctx.strokeStyle=hexA(col,0.08+0.06*Math.sin(t/10+i));ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*400,cy+Math.sin(a)*400);ctx.stroke();}
  if(t<70){const sh=t>40?(Math.random()-0.5)*(t-40)*0.4:0;ctx.drawImage(A,cx-S/2+sh,cy-S/2,S,S);ctx.globalAlpha=Math.min(0.8,t/80);ctx.drawImage(rimSil(A,'#ffffff'),cx-S/2+sh,cy-S/2,S,S);ctx.globalAlpha=1;}
  else if(t<120){const q=(t-70);for(const f of frag){ctx.save();ctx.translate(cx-S/2+f.sx*S+S/8+f.vx*q,cy-S/2+f.sy*S+S/8+f.vy*q+0.15*q*q);ctx.rotate(f.r*q);ctx.drawImage(A,f.sx*A.width,f.sy*A.height,A.width/4,A.height/4,-S/8,-S/8,S/4,S/4);ctx.restore();}}
  else if(t<175){const q=1-(t-120)/55;for(const f of frag){ctx.save();ctx.translate(cx-S/2+f.sx*S+S/8-f.vx*q*40,cy-S/2+f.sy*S+S/8-f.vy*q*30);ctx.rotate(-f.r*q*20);ctx.drawImage(Bs,f.sx*Bs.width,f.sy*Bs.height,Bs.width/4,Bs.height/4,-S/8,-S/8,S/4,S/4);ctx.restore();}}
  else{ctx.drawImage(Bs,cx-S/2,cy-S/2,S,S);const k=Math.min(1,(t-175)/20);ctx.globalAlpha=k;wtxt(BOTS[to].name.toUpperCase(),cx,250,col,48,'center');wtxt('evolved from '+BOTS[from].name,cx,280,'#c8d0e0',20,'center');ctx.globalAlpha=1;if(t>230&&TICK%60<40)wtxt('Press A',cx,306,'#7a8aa8',16,'center');}
  if(t>=116&&t<128){ctx.fillStyle='rgba(255,255,255,'+(1-(t-116)/12)+')';ctx.fillRect(0,0,W,H);}if(t===116)Snd.sfx('crit');}};};
// ---------- 5: Overdrive portrait ----------
{const _od=odCinematic;odCinematic=async function(side,type){if(!G.skipFx){const b=cur(side);const col=TCOL[type]||'#fff';const sp=bspr(b);
  await pushUI({t:0,update(){this.t++;if(this.t>48)popUI(this);},draw(){const t=this.t,s=Math.min(1,t/10);ctx.fillStyle='rgba(4,6,12,'+(0.7*s)+')';ctx.fillRect(0,0,W,H);const y=70;
   ctx.save();ctx.beginPath();ctx.moveTo(0,y+20);ctx.lineTo(W,y);ctx.lineTo(W,y+120);ctx.lineTo(0,y+140);ctx.closePath();ctx.clip();ctx.fillStyle=hexA(col,0.85);ctx.fillRect(0,0,W,H);
   for(let i=0;i<12;i++){ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(((i*67+t*30)%(W+100))-100,y+10+i*10,60,2);}
   const off=(1-s)*(side==='p'?-300:300);ctx.drawImage(sp,0,0,sp.width,sp.height*0.55,W/2-150+off,y-20,300,165);ctx.restore();wtxt('OVERDRIVE',W/2,y+170,'#ffffff',36,'center');}});}
 return _od(side,type);};}
// ---------- 7 + 6 + 8: underwater shadows, monitor scanlines, interior windows ----------
let FISH={map:null,list:[]};
{const _sf2=drawSurfaceFX;drawSurfaceFX=function(cx,cy){_sf2(cx,cy);const m=curMap();
  if(hq()){if(FISH.map!==G.map){FISH.map=G.map;FISH.list=[];const wt=[];m.grid.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(r[x]==='~')wt.push([x,y]);});for(let i=0;i<Math.min(4,Math.floor(wt.length/12));i++){const [x,y]=pick(wt);FISH.list.push({x:x*TS+16,y:y*TS+16,a:Math.random()*6.28,s:0.3+Math.random()*0.4});}}
   for(const f of FISH.list){f.a+=(Math.random()-0.5)*0.15;const nx=f.x+Math.cos(f.a)*f.s,ny=f.y+Math.sin(f.a)*f.s;if(T(Math.floor(nx/TS),Math.floor(ny/TS))==='~'){f.x=nx;f.y=ny;}else f.a+=Math.PI;
    const sx=f.x-cx,sy=f.y-cy;if(sx<-30||sy<-30||sx>W+30||sy>H+30)continue;ctx.save();ctx.translate(sx,sy);ctx.rotate(f.a);ctx.fillStyle='rgba(8,20,40,.35)';ctx.beginPath();ctx.ellipse(0,0,11,5,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(-16,-5+Math.sin(TICK/5)*2);ctx.lineTo(-16,5+Math.sin(TICK/5)*2);ctx.fill();ctx.restore();}}
  const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);for(let y=y0;y<=y0+Math.ceil(H/TS)+1;y++)for(let x=x0;x<=x0+Math.ceil(W/TS)+1;x++){const ch=T(x,y);const sx=x*TS-cx,sy=y*TS-cy;
   if(ch==='M'){const k=(TICK*0.6+x*13)%22;ctx.fillStyle='rgba(180,255,240,.22)';ctx.fillRect(sx+5,sy+3+k*0.5,22,1);if((TICK+x*7)%90<3){ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(sx+4,sy+2,24,14);}}
   if(!m.outdoor&&ch==='X'&&y===0&&x%3===1&&T(x,1)&&!SOLID.has(T(x,1))){const dp=dayPhase();const night=dp.night>0.5;ctx.fillStyle=night?'#0c1430':'#7aa0c8';ctx.fillRect(sx+7,sy+8,18,14);ctx.fillStyle='rgba(240,248,255,.9)';
    for(let i=0;i<3;i++){const fy=(TICK*0.4+i*5+x*3)%14;ctx.fillRect(sx+9+((i*6+x)%14),sy+8+fy,1.5,1.5);}ctx.strokeStyle='#5a4838';ctx.lineWidth=2;ctx.strokeRect(sx+7,sy+8,18,14);ctx.beginPath();ctx.moveTo(sx+16,sy+8);ctx.lineTo(sx+16,sy+22);ctx.stroke();}}};}
{const _bk=bakeMapFX;bakeMapFX=function(){_bk();const m=curMap();if(m.outdoor)return;const o=MFX.over.getContext('2d');const th=m.theme;
  m.grid.forEach((r,y)=>{for(let x=0;x<r.length;x++){const ch=T(x,y);if(!'9M&@7'.includes(ch))continue;const up=T(x,y-1);if(up&&SOLID.has(up))continue;const src=tileArt(ch,th,0,0);o.drawImage(src,0,0,32,12,x*16,y*16-5,16,6);}});};}
// ---------- 9: portraits with expressions ----------
const SPEAKLOOK={Vesna:'vesna',Kael:'kael','Deacon Kael':'kael',Brakka:'brakka',Ione:'ione',Hask:'hask',Sora:'sora',Maren:'maren','Pell-Ashe':'pellashe',Yoru:'yoru',Ilian:'cantor','The Cantor':'cantor','Spirit Warden':'spiritw',Juno:'nurse',Tobin:'tobin','Grandmother Ilsa':'ilsa','Field Tech Pim':'pim','Gate Warden Odo':'odo','Deacon Mirelle':'mirelle','Deacon Ostrel':'ostrel','Choir Grunt':'grunt','Choir Medic':'grunt',Teo:'grunt',"Teo's mother":'woman','Market Seller':'woman',Guard:'guard',Lineman:'lineman',Engineer:'engineer',Kid:'kid',Mom:'mom'};
function moodOf(t){if(/\.\.\.|sorry|miss|alone|scared|lied/i.test(t))return 'sad';if(/!.*!|HEY|Back off|Move\b|Turn around|lose|won't let/i.test(t)||/[A-Z]{4,}/.test(t))return 'angry';if(/Ha!|thank|good|great|deal|together|Yes\b|well sung|happy/i.test(t))return 'happy';return 'calm';}
function drawPortrait(sp,text){if(!sp)return;const nm=sp.replace(/\s*\(.*\)/,'').replace(/^\?\?\?\s*/,'');const lk=SPEAKLOOK[nm]||(LOOKS[nm.toLowerCase()]?nm.toLowerCase():null);if(!lk||!LOOKS[lk])return;
 const s=charSprite(lk,'down',0);panel(8,150,62,62,'#283048');ctx.save();ctx.beginPath();ctx.rect(13,155,52,52);ctx.clip();ctx.drawImage(s,0,0,s.width,s.height*0.62,9,150,60,70);ctx.restore();
 const md=moodOf(text||'');const bx=56,by=156;if(md==='angry'){ctx.strokeStyle='#e03030';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+8,by+8);ctx.moveTo(bx+8,by);ctx.lineTo(bx,by+8);ctx.stroke();}
 else if(md==='sad'){ctx.fillStyle='#60b0ff';ctx.beginPath();ctx.moveTo(bx+4,by);ctx.lineTo(bx+8,by+7);ctx.arc(bx+4,by+7,4,0,Math.PI);ctx.fill();}
 else if(md==='happy'){wtxt('♪',bx+4,by+10,'#ffd040',16,'center');}}
// ---------- 10: world map icons ----------
function drawMapIcons(sc,ox,oy){for(const id in MAPS){const m=MAPS[id];if(!m.world||!exploredAny(id))continue;for(const w of m.warps||[]){const t=MAPS[w.to];if(!t)continue;const X=ox+(m.world.x+w.x)*sc,Y=oy+(m.world.y+w.y)*sc;
   if(/^gym\d/.test(w.to)){const n=+w.to.slice(3);const done=flag('badge'+n);ctx.fillStyle=done?'#ffd040':'#30384a';ctx.strokeStyle='#ffd040';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?2.5:6;ctx.lineTo(X+Math.cos(a)*r,Y+Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();}
   else if(/^repair_/.test(w.to)){ctx.fillStyle='#40e0a0';ctx.fillRect(X-3,Y-2,7,4);ctx.fillStyle='#0c1018';ctx.fillRect(X-2,Y+2,2,2);ctx.fillRect(X+2,Y+2,2,2);}
   else if(/^sec_/.test(w.to)&&(G.visited&&G.visited[w.to]||flag('open_'+id+'_'+w.x+'_'+w.y))){wtxt('?',X,Y+5,'#c8a0ff',14,'center');}}}
 const g=typeof questGoal==='function'?questGoal():null;if(g){let mid=g.map;if(!MAPS[mid].world){for(const id in MAPS){if(MAPS[id].world&&(MAPS[id].warps||[]).some(w=>w.to===mid)){const w=MAPS[id].warps.find(w=>w.to===mid);const X=ox+(MAPS[id].world.x+w.x)*sc,Y=oy+(MAPS[id].world.y+w.y)*sc;
     ctx.fillStyle='#ff5050';ctx.fillRect(X-1,Y-12,2,12);ptri(ctx,[X+1,Y-12,X+9,Y-9,X+1,Y-6],'#ff5050');break;}}}}}
function exploredAny(id){const a=exploredArr(id);for(let i=0;i<a.length;i+=7)if(a[i])return true;return false;}
// ---------- 11: checkpoints before Wardens and bosses ----------
{const _rb2=runBattle;runBattle=async function(o){const big=o&&((o.trainer&&o.trainer.warden)||o.boss);let cp=null;if(big&&!G.vault){autosave();cp=serialize();}
  if(o&&o.trainer&&!o.trainer.noPreview&&!G.skipFx)await partyPreview(o.trainer);
  const r=await _rb2(o);if(r==='lose'&&cp){const c=await ask('Retry from the checkpoint just before this battle?',['Retry','No thanks']);if(c===0){loadSave(JSON.parse(cp));G.fade=1;await say('Back at the checkpoint. Good luck.');}}return r;};}
// ---------- 13: party preview ----------
function partyPreview(tr){return pushUI({t:0,update(){this.t++;if(this.t>20&&(press('a')||press('b'))||this.t>110)popUI(this);},draw(){const k=Math.min(1,this.t/12);ctx.fillStyle='rgba(4,6,14,'+(0.75*k)+')';ctx.fillRect(0,0,W,H);
  panel(60,70,360,150);wtxt((tr.title&&tr.title!=='The'?tr.title+' ':'')+tr.name,240,104,'#303840',26,'center');const n=tr.team.length;
  tr.team.forEach(([id],i)=>{const x=240-(n*56)/2+i*56+28,y=150;const tp=BOTS[id].types;ctx.fillStyle='#1a2030';ctx.beginPath();ctx.arc(x,y,20,0,7);ctx.fill();ctx.globalAlpha=0.9;ctx.drawImage(botSprite(id,{sil:1}),x-18,y-20,36,36);ctx.globalAlpha=1;
   tp.forEach((t,j)=>{ctx.fillStyle=TCOL[t];ctx.fillRect(x-14+j*15,y+26,13,8);});});wtxt(n+' bot'+(n>1?'s':''),240,206,'#606870',18,'center');}});}
// ---------- 12: quick item ----------
async function quickItem(){const meds=Object.keys(G.bag).filter(k=>ITEMS[k]&&ITEMS[k].cat==='med'&&G.bag[k]>0);
 if(!G.quick||!G.bag[G.quick]){if(!meds.length){await say('No usable items to register.');return;}const i=await ask('Register a quick item (Q / ITEM button):',meds.map(k=>ITEMS[k].n+' ×'+G.bag[k]).concat(['Cancel']));if(i<0||i>=meds.length)return;G.quick=meds[i];await say(ITEMS[G.quick].n+' registered. Press ITEM again to use it.');return;}
 const it=G.quick;const t=await openParty({mode:'item',item:it});if(t==null||t<0)return;const b=G.party[t];if(!canUse(it,b)){await say('It won\'t have any effect.');return;}useItemOn(it,b);Snd.sfx('item');await say(BOTS[b.id].name+' was patched up. ('+(G.bag[it]||0)+' left)');}
// ---------- 16 + 12 + 22: update hooks (double-tap B, quick item, step counter) ----------
{const _up2=update;update=function(){_up2();if(!G.started||BT||UI.length||G.busy)return;
  if(press('b')){if(TICK-(G.lastB||-99)<16){G.alwaysRun=!G.alwaysRun;G.errToast={t:90,msg:G.alwaysRun?'Running: always on (double-tap B to turn off)':'Running: hold B'};savePrefs();}G.lastB=TICK;}
  if(press('item')){G.busy=true;quickItem().finally(()=>{G.busy=false;});}};}
{const _os2=onStepInner;onStepInner=async function(){G.steps=(G.steps||0)+1;return _os2();};}
function slotLabel(s){if(!s)return '— empty —';const b=Object.keys(s.flags||{}).filter(f=>/^badge\d$/.test(f)).length;const linked=Object.keys(s.caught||{}).length;
 return s.name+' · '+(MAPS[s.map]?MAPS[s.map].name:'?')+' · '+fmtTime(s.time)+' · '+b+'★ · '+linked+' bots'+(s.steps?' · '+Math.round(s.steps/10)/100+'k steps':'');}
// ---------- 18: recent Bestiary ----------
{const _sn=seen;seen=function(id,c){G.recent=G.recent||[];G.recent=[id].concat(G.recent.filter(x=>x!==id)).slice(0,10);return _sn(id,c);};}
{const _od2=openDex;openDex=async function(){if(!(G.recent&&G.recent.length))return _od2();const i=await ask('BESTIARY',['Full list','Recently met','Back']);if(i===0)return _od2();if(i!==1)return;
  while(true){const j=await choose(G.recent.map(id=>BOTS[id].name+(G.caught[id]?' ✓':'')).concat(['Back']),{x:30,y:20});if(j<0||j>=G.recent.length)return;const id=G.recent[j];
   await pushUI({t:0,update(){this.t++;if(this.t>10&&(press('a')||press('b')))popUI(this);},draw(){ctx.fillStyle='rgba(4,6,14,.8)';ctx.fillRect(0,0,W,H);panel(30,20,420,280);ctx.drawImage(botSprite(id,G.caught[id]?{}:{sil:1}),50,50,130,130);
     wtxt(BOTS[id].name,200,70,'#303840',28);BOTS[id].types.forEach((t,k)=>{ctx.fillStyle=TCOL[t];ctx.fillRect(200+k*70,82,64,18);txt(t,232+k*70,96,'#fff',16,'center');});
     wrap(G.caught[id]?BOTS[id].desc:'Not linked yet. Link with one to learn more.',230).slice(0,8).forEach((l,k)=>txt(l,200,124+k*20,'#404850',16));}});}};}
// ---------- 20: reset puzzle rooms ----------
function isPuzzleRoom(){const m=curMap();return !!(m.crates||m.leverFlip||m.conduits||m.tide&&!m.world||['gym6','gym7','gym8','cathedral','hf1'].includes(G.map)||m.grid.some(r=>r.includes('S')));}
async function resetRoom(){if((await ask('Reset this room\'s puzzle and go back to the entrance?'))!==0)return false;if(G.beltFlip)delete G.beltFlip[G.map];G.sw=0;G.cond=null;
 const w=curMap().warps[0];let x=w.x,y=w.y;for(const [dx,dy] of [[0,-1],[0,1],[1,0],[-1,0]]){const c=T(w.x+dx,w.y+dy);if(c&&!tileSolid(c)&&!warpAt(w.x+dx,w.y+dy)){x=w.x+dx;y=w.y+dy;break;}}
 G.fade=1;loadMap(G.map,x,y,'up');Snd.sfx('switch');await say('The room resets.');return true;}
