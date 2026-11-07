// ===================== FX: weather, lighting, particles, battle animations =====================
const WEATHER={
 snow:{name:'Light snow',dark:0.06,snow:0.32,wind:0.1,fog:0},
 night:{name:'Freezing night',dark:0.58,snow:0.2,wind:0,fog:0},
 blizzard:{name:'Blizzard',dark:0.18,snow:1,wind:2.2,fog:0.22},
 static:{name:'Static storm',dark:0.4,snow:0.18,wind:0.5,fog:0,static:1},
 cave:{name:'Underground',dark:0.86,snow:0.05,wind:0,fog:0},
 indoor:{name:'Indoors',dark:0,snow:0,wind:0,fog:0},
 clear:{name:'Thawed',dark:0,snow:0,wind:0.3,fog:0,petals:1},
 vault:{name:'Maker Vault',dark:0.7,snow:0,wind:0,fog:0},
};
function weatherKey(){const m=curMap();if(m.vaultMap)return 'vault';if(m.outdoor&&m.theme==='out'&&thawed(G.map))return 'clear';return m.weather||(m.theme==='cave'?'cave':m.outdoor?'snow':'indoor');}
function curWeather(){return WEATHER[weatherKey()];}

// ---- lighting ----
let LIGHT=null,lgx=null;
function ensureLight(){if(!LIGHT){LIGHT=mkCanvas(480*RS,320*RS);lgx=LIGHT.getContext('2d');}}
function collectLights(){const m=curMap();const L=[];const w=m.grid[0].length;
  m.grid.forEach((row,y)=>{for(let x=0;x<w;x++){const ch=row[x];const v=(x*7+y*3)%4===0?0:(x+y)%2+1;
    if(ch==='l')L.push({x:x*TS+16,y:y*TS+6,r:90,col:'#ffcf80',fl:1});
    else if(ch==='W'&&v===0)L.push({x:x*TS+16,y:y*TS+14,r:46,col:'#ffd890',fl:0});
    else if(ch==='M')L.push({x:x*TS+16,y:y*TS+10,r:52,col:'#60e0d0',fl:0});
    else if(ch==='m')L.push({x:x*TS+16,y:y*TS+10,r:50,col:'#60c0ff',fl:0});
    else if(ch==='z')L.push({x:x*TS+16,y:y*TS+14,r:30,col:'#ff9a5a',fl:1});
    else if(ch==='i')L.push({x:x*TS+16,y:y*TS+14,r:28,col:'#ffe080',fl:1});}});
  G.lights=L;}
function drawLighting(cx,cy,px,py){const wx=curWeather();if(!wx.dark)return;ensureLight();const g=lgx;
  g.setTransform(RS,0,0,RS,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle='rgba(4,8,22,'+wx.dark+')';g.fillRect(0,0,W,H);
  g.globalCompositeOperation='destination-out';
  const lead=G.party.find(b=>b.hp>0);const pcol=lead?TCOL[BOTS[lead.id].types[0]]:'#a0c0ff';
  const all=[{x:px+16,y:py+14,r:wx.dark>0.5?110:80,col:pcol,fl:0,player:1}];
  for(const l of G.lights||[]){const sx=l.x-cx,sy=l.y-cy;if(sx<-120||sy<-120||sx>W+120||sy>H+120)continue;all.push(Object.assign({},l,{x:l.x,y:l.y}));}
  for(const l of all){const sx=l.x-cx,sy=l.y-cy;const r=l.r*(l.fl?(0.92+0.08*Math.sin(TICK/6+l.x)):1);const gr=g.createRadialGradient(sx,sy,0,sx,sy,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(0.55,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(sx-r,sy-r,r*2,r*2);}
  ctx.drawImage(LIGHT,0,0,W,H);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const l of all){const sx=l.x-cx,sy=l.y-cy;const r=l.r*0.7;const gr=ctx.createRadialGradient(sx,sy,0,sx,sy,r);gr.addColorStop(0,l.col+(l.player?'30':'44'));gr.addColorStop(1,l.col+'00');ctx.fillStyle=gr;ctx.fillRect(sx-r,sy-r,r*2,r*2);}
  ctx.restore();}
function drawWeatherOverlay(cx,cy){const wx=curWeather();if(wx.snow)drawSnow(cx,cy,wx.snow,wx.wind);if(wx.petals)drawPetals(cx,cy);if(G.thawFx>0){G.thawFx--;const t=G.thawFx/180;ctx.fillStyle='rgba(255,210,140,'+(t*0.45)+')';ctx.fillRect(0,0,W,H);}
  if(wx.fog){const g=ctx.createRadialGradient(W/2,H/2,60,W/2,H/2,300);g.addColorStop(0,'rgba(220,232,244,'+(wx.fog*0.4)+')');g.addColorStop(1,'rgba(220,232,244,'+(wx.fog*2.6)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  if(wx.static){if(G.bolt>0){ctx.fillStyle='rgba(180,200,255,'+(G.bolt/14*0.45)+')';ctx.fillRect(0,0,W,H);G.bolt--;}
    else if(Math.random()<0.004){G.bolt=14;Snd.sfx('thunder');}}}

// ---- overworld particles (breath, sparks) ----
const OWP=[];
function owParticles(cx,cy,px,py){const wx=curWeather();const m=curMap();
  if(m.outdoor&&!m.dungeon&&TICK%80===0){const [dx,dy]=DIRS[G.pdir];OWP.push({x:px+16+dx*8,y:py+8+(dy>0?4:0),vx:dx*0.3+(Math.random()-0.5)*0.2,vy:-0.25,t:0,max:60,k:'breath'});}
  if(wx.static&&Math.random()<0.05){for(const l of (G.lights||[])){if(Math.random()<0.02)OWP.push({x:l.x+(Math.random()-0.5)*20,y:l.y,vx:(Math.random()-0.5)*1.4,vy:-Math.random()*1.4,t:0,max:20,k:'spark'});}}
  for(let i=OWP.length-1;i>=0;i--){const p=OWP[i];p.t++;p.x+=p.vx;p.y+=p.vy;if(p.t>=p.max){OWP.splice(i,1);continue;}
    const a=1-p.t/p.max;if(p.k==='breath'){ctx.fillStyle='rgba(235,242,250,'+(a*0.55)+')';ctx.beginPath();ctx.arc(p.x-cx,p.y-cy,2+p.t*0.08,0,7);ctx.fill();}
    else{ctx.globalAlpha=a;ctx.fillStyle=p.col||'#a0c8ff';ctx.fillRect(p.x-cx,p.y-cy,p.col?3:1.5,p.col?3:1.5);ctx.globalAlpha=1;}}}

// ---- battle FX ----
const BFX=[];
const BPOS={p:[130,172],e:[360,72]};
function bfxAdd(o){o.t=0;BFX.push(o);return o;}
function bfxTick(){for(let i=BFX.length-1;i>=0;i--){BFX[i].t++;if(BFX[i].t>=BFX[i].max)BFX.splice(i,1);}}
function bfxDraw(){for(const f of BFX)f.draw(f.t/f.max,f.t);}
function bspd(){return G.bspeed||1;}
function bwait(n){return wait(Math.max(1,Math.ceil(n/bspd())));}
const lerp=(a,b,t)=>a+(b-a)*t;
function burst(x,y,col,n=14,spd=3,size=3,max=24){const ps=Array.from({length:n},()=>({a:Math.random()*6.28,s:spd*(0.4+Math.random()*0.8)}));
  bfxAdd({max,draw(t){ctx.fillStyle=col;for(const p of ps){const d=p.s*t*max*0.6;ctx.globalAlpha=1-t;ctx.fillRect(x+Math.cos(p.a)*d,y+Math.sin(p.a)*d,size*(1-t*0.5),size*(1-t*0.5));}ctx.globalAlpha=1;}});}
function ring(x,y,col,max=20,r0=6,r1=50){bfxAdd({max,draw(t){ctx.strokeStyle=col;ctx.globalAlpha=1-t;ctx.lineWidth=3*(1-t)+1;ctx.beginPath();ctx.arc(x,y,lerp(r0,r1,t),0,7);ctx.stroke();ctx.globalAlpha=1;}});}
function dmgNumber(side,txt_,col='#ff5050',big){const [x,y]=BPOS[side];const ox=(Math.random()-0.5)*30;
  bfxAdd({max:50,draw(t){ctx.globalAlpha=t>0.7?(1-t)/0.3:1;wtxt(txt_,x+ox,y-20-t*30,col,big?30:24,'center');ctx.globalAlpha=1;}});}
function arrows(side,col,up){const [x,y]=BPOS[side];bfxAdd({max:36,draw(t){ctx.fillStyle=col;ctx.globalAlpha=t<0.8?1:(1-t)/0.2;for(let i=0;i<5;i++){const ax=x-40+i*20,ph=((t*2+i*0.2)%1);const ay=up?y+30-ph*60:y-30+ph*60;
  ptri(ctx,up?[ax,ay-8,ax+7,ay,ax-7,ay]:[ax,ay+8,ax+7,ay,ax-7,ay],col);ctx.fillRect(ax-2,up?ay:ay-8,4,8);}ctx.globalAlpha=1;}});}
async function moveFx(type,from,to,status){if(G.skipFx)return;const [fx,fy]=BPOS[from],[tx,ty]=BPOS[to];const col=TCOL[type];const D=Math.max(8,Math.ceil(30/bspd()));
  if(status){return;}
  const proj=(drawP,n=1,stagger=5,arc=0)=>{stagger=Math.ceil(stagger/bspd());for(let k=0;k<n;k++){bfxAdd({max:D+k*stagger,delay:k*stagger,draw(t,f){const tt=clamp((f-this.delay)/D,0,1);if(f<this.delay)return;const x=lerp(fx,tx,tt),y=lerp(fy,ty,tt)-Math.sin(tt*Math.PI)*arc;drawP(x,y,tt,k);}});}};
  if(type==='Flame'){proj((x,y,t)=>{ctx.fillStyle='#ffd040';ctx.beginPath();ctx.arc(x,y,7,0,7);ctx.fill();ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-3,y+2,5,0,7);ctx.fill();},3,5,20);await bwait(D+10);burst(tx,ty,'#ff8030',18,3.4,4);burst(tx,ty,'#ffe060',10,2,3);}
  else if(type==='Tide'){proj((x,y)=>{ctx.fillStyle='#8ad0ff';ctx.beginPath();ctx.ellipse(x,y,4,6,0,0,7);ctx.fill();},6,3,40);await bwait(D);ring(tx,ty,'#8ad0ff');burst(tx,ty,'#c0e8ff',12,2.4,3);}
  else if(type==='Bloom'){proj((x,y,t,k)=>{ctx.save();ctx.translate(x,y);ctx.rotate(t*12+k);ptri(ctx,[0,-7,4,0,0,7,-4,0],k%2?col:'#a0f0a0');ctx.restore();},5,4,30);await bwait(D);burst(tx,ty,col,10,2.4,3);}
  else if(type==='Volt'){bfxAdd({max:D,draw(t){ctx.strokeStyle=t<0.5||TICK%4<2?'#fff6a0':col;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(fx,fy);for(let i=1;i<=8;i++){ctx.lineTo(lerp(fx,tx,i/8)+(i<8?(Math.random()-0.5)*26:0),lerp(fy,ty,i/8)+(i<8?(Math.random()-0.5)*26:0));}ctx.stroke();}});await bwait(D*0.8);burst(tx,ty,'#fff6a0',16,3,2);}
  else if(type==='Stone'){for(let k=0;k<5;k++)bfxAdd({max:D,draw(t){const x=tx-40+k*20,y=lerp(ty-150,ty+10,Math.min(1,t*1.2+k*0.05));ctx.fillStyle=k%2?'#9a8a70':'#b8a888';ctx.fillRect(x-6,y-6,12,12);ctx.fillStyle='#5a4a38';ctx.fillRect(x-6,y+4,12,2);}});await bwait(D);burst(tx,ty+20,'#c8b898',14,2.6,3);}
  else if(type==='Gale'){for(let k=0;k<3;k++)bfxAdd({max:D,draw(t){const tt=clamp(t*1.4-k*0.2,0,1);if(!tt||tt>=1)return;ctx.strokeStyle='rgba(220,255,250,'+(1-tt)+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(tx-60+tt*120,ty+(k-1)*18,26,-1.2,1.2);ctx.stroke();}});await bwait(D);}
  else if(type==='Frost'){proj((x,y,t,k)=>{ptri(ctx,[x+8,y,x-6,y-4,x-6,y+4],k%2?'#ffffff':col);},4,4,10);await bwait(D);for(let i=0;i<8;i++){const a=i/8*6.28;bfxAdd({max:24,draw(t){ctx.strokeStyle='rgba(200,240,255,'+(1-t)+')';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(a)*40*t,ty+Math.sin(a)*40*t);ctx.stroke();}});}}
  else if(type==='Shade'){bfxAdd({max:D,draw(t){for(let i=0;i<10;i++){ctx.fillStyle=Math.random()<0.5?'rgba(40,10,60,.85)':'rgba(160,90,230,.7)';ctx.fillRect(tx-50+Math.random()*100,ty-50+Math.random()*100,10+Math.random()*30,3+Math.random()*6);}}});await bwait(D);}
  else if(type==='Spirit'){for(let k=0;k<3;k++){ring(tx,ty,col,22,4,60);await bwait(6);}}
  else if(type==='Iron'){bfxAdd({max:D,draw(t){const s=Math.min(1,t*2);ctx.strokeStyle='#e8eef6';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(tx-40,ty-40);ctx.lineTo(tx-40+80*s,ty-40+80*s);ctx.stroke();if(t>0.4){const s2=Math.min(1,(t-0.4)*2);ctx.beginPath();ctx.moveTo(tx+40,ty-40);ctx.lineTo(tx+40-80*s2,ty-40+80*s2);ctx.stroke();}}});await bwait(D*0.8);burst(tx,ty,'#fff0a0',12,3,2);}
  else if(type==='Brawl'){proj((x,y)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,10,0,7);ctx.fill();ctx.fillStyle='#ffd0c0';ctx.fillRect(x-6,y-3,12,2);},1,0,0);await bwait(D);bfxAdd({max:16,draw(t){ctx.fillStyle='rgba(255,240,200,'+(1-t)+')';const r=20+t*30;ctx.beginPath();for(let i=0;i<16;i++){const a=i/16*6.28,rr2=i%2?r:r*0.45;ctx.lineTo(tx+Math.cos(a)*rr2,ty+Math.sin(a)*rr2);}ctx.fill();}});}
  else{bfxAdd({max:D,draw(t){ctx.strokeStyle='rgba(255,255,255,'+(1-t)+')';ctx.lineWidth=6*(1-t)+2;ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(lerp(fx,tx,Math.min(1,t*2)),lerp(fy,ty,Math.min(1,t*2)));ctx.stroke();}});await bwait(D*0.7);ring(tx,ty,'#ffffff',16,4,40);}
}
async function odCinematic(side,type){const B=BT;const b=cur(side);const col=TCOL[type];const sp=bspr(b);const max=G.skipFx?30:90;
  Snd.sfx('od');await pushUI({t:0,update(){this.t++;if(this.t>=max)popUI(this);},draw(){const t=this.t;
    ctx.fillStyle='rgba(6,8,16,.88)';ctx.fillRect(0,0,W,H);
    for(let i=0;i<26;i++){const y=(i*37+t*23)%H;ctx.fillStyle=col+'aa';ctx.fillRect(((i*91+t*31)%W)-60,y,90+(i%3)*40,2);}
    const z=Math.min(1,t/25);const s=lerp(120,210,z);ctx.save();if(side==='p'){ctx.translate(W/2+s/2,H/2-s/2-10);ctx.scale(-1,1);ctx.drawImage(sp,0,0,s,s);}else ctx.drawImage(sp,W/2-s/2,H/2-s/2-10,s,s);ctx.restore();
    if(t>12){const k=Math.min(1,(t-12)/8);ctx.save();ctx.translate(W/2,262);ctx.scale(lerp(2.2,1,k),lerp(2.2,1,k));wtxt('OVERDRIVE',0,0,col,44,'center');ctx.restore();wtxt(OD_NAMES[type],W/2,292,'#ffffff',22,'center');}
    if(t>max-28&&t<max-6){const k=(t-(max-28))/22;ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-0.45);ctx.fillStyle='#ffffff';ctx.fillRect(-W,-6-30*(1-Math.abs(k-0.5)*2),W*2*Math.min(1,k*2),12+60*(1-Math.abs(k-0.5)*2));ctx.fillStyle=col;ctx.fillRect(-W,-3,W*2*Math.min(1,k*2),6);ctx.restore();}
    if(t>max-8){ctx.fillStyle='rgba(255,255,255,'+((t-(max-8))/8)+')';ctx.fillRect(0,0,W,H);}}});}
function bspr(b,o){return botSprite(b.id,Object.assign({glitch:b.glitch},o||{}));}

const PETALS=Array.from({length:40},(_,i)=>({x:Math.random()*480,y:Math.random()*320,s:0.3+Math.random()*0.6,w:Math.random()*6.28,c:['#f0a0c0','#ffe080','#a0e080','#ffffff'][i%4]}));
function drawPetals(dx,dy){for(const p of PETALS){const x=((p.x-dx*0.6+TICK*p.s*0.8+Math.sin(TICK/40+p.w)*10)%480+480)%480,y=((p.y+TICK*p.s*0.4-dy*0.6)%320+320)%320;ctx.fillStyle=p.c;ctx.globalAlpha=0.8;ctx.fillRect(x,y,2,1.5);}ctx.globalAlpha=1;}
