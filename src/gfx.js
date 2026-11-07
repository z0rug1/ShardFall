// ===================== GFX: baked map layers, shadows, water, soft edges, atmosphere =====================
// Layers are baked once per map state at 16px per tile (the art's native pixel grid) and drawn scaled 2x.
let MFX={key:'',under:null,edge:null,over:null},FXID=0;
const hq=()=>G.fxq!==0;
const CAST_TREE='T',CAST_BLOCK='RYQUWGNJ0#',CAST_SMALL='ZBl';
const ROOFS='RYQU';
const FRANK={'=':6,'H':6,'A':6,'d':5,'.':4,'n':4,',':3,'j':3,'q':3,'y':3,'w':3,'-':2,'~':0,'b':1};
const AVGC={};
function hh(x,y,s){let h=(x*374761393+y*668265263+(s||0)*1442695041)>>>0;h=(h^(h>>>13))*1274126177>>>0;return (h^(h>>>16))>>>0;}
function avgCol(ch,th){const k=ch+th;if(AVGC[k])return AVGC[k];const c=tileArt(ch,th,1,0);let r=0,g=0,b=0,n=0;try{const d=c.getContext('2d').getImageData(4,4,24,24).data;for(let i=0;i<d.length;i+=16){r+=d[i];g+=d[i+1];b+=d[i+2];n++;}}catch(e){return '#8fb0a2';}
  const col='rgb('+(r/n|0)+','+(g/n|0)+','+(b/n|0)+')';AVGC[k]=col;return col;}
function baseCol(ch,th){if(ch==='.'||ch==='n'||ch===','||'jqwTFfsl'.includes(ch))return avgCol('.',th);if(ch==='=')return avgCol('=',th);return avgCol(ch,th);}
function fxKey(){const m=curMap();if(!m._fxid)m._fxid=++FXID;return G.map+'|'+m._fxid+'|'+(thawed(G.map)?1:0)+'|'+Object.keys(G.tileOv||{}).length+'|'+(G.flags&&G.flags.starter?1:0);}
function ensureMapFX(){const k=fxKey();if(MFX.key===k)return;MFX.key=k;bakeMapFX();}
function bakeMapFX(){const m=curMap();const Wt=m.grid[0].length,Ht=m.grid.length;const th=m.theme==='out'&&thawed(G.map)?'outw':m.theme;const out=!!m.outdoor&&m.theme!=='cave';
  const P=16;const mk=()=>{const c=mkCanvas(Wt*P,Ht*P+P);return c;};
  const U=mk(),E=mk(),O=mk();const u=U.getContext('2d'),e=E.getContext('2d'),o=O.getContext('2d');o.translate(0,P);
  const t=(x,y)=>{if(x<0||y<0||x>=Wt||y>=Ht)return null;return T(x,y);};
  const isCast=ch=>ch&&(CAST_TREE.includes(ch)||CAST_BLOCK.includes(ch)||(m.outdoor?false:ch==='X'));
  // ---- cast shadows (soft, light from upper-left) ----
  if(out){u.fillStyle='rgba(8,16,34,1)';
    for(const [ox,oy,a] of [[2,2,0.12],[4,3,0.1],[6,5,0.07]]){u.globalAlpha=a;
      for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){const ch=t(x,y);if(!ch)continue;
        if(ch==='T'){u.beginPath();u.ellipse(x*P+8+ox,y*P+14+oy*0.6,7,3.5,0,0,7);u.fill();}
        else if(CAST_BLOCK.includes(ch)){const below=t(x,y+1),right=t(x+1,y);if(!isCast(below)||!isCast(right))u.fillRect(x*P+ox,y*P+oy,P,P);}
        else if(CAST_SMALL.includes(ch)){u.beginPath();u.ellipse(x*P+9+ox*0.5,y*P+14,5,2.5,0,0,7);u.fill();}}}
    u.globalAlpha=1;u.globalCompositeOperation='destination-out';for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){const ch=t(x,y);if(ch&&CAST_BLOCK.includes(ch))u.fillRect(x*P,y*P,P,P);}u.globalCompositeOperation='source-over';}
  // ---- ambient occlusion under walls / cliffs ----
  for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){const ch=t(x,y);if(!ch||isCast(ch)||SOLID.has(ch))continue;const up=t(x,y-1),lf=t(x-1,y),rt=t(x+1,y);
    const wallish=c=>c&&(c==='X'||c==='G'||c==='W'||c==='#'||c==='N'||c==='%');
    if(wallish(up)){const g=u.createLinearGradient(0,y*P,0,y*P+(m.outdoor?6:8));g.addColorStop(0,'rgba(6,10,24,'+(m.outdoor?0.32:0.38)+')');g.addColorStop(1,'rgba(6,10,24,0)');u.fillStyle=g;u.fillRect(x*P,y*P,P,8);}
    if(!m.outdoor){if(wallish(lf)){const g=u.createLinearGradient(x*P,0,x*P+5,0);g.addColorStop(0,'rgba(6,10,24,.25)');g.addColorStop(1,'rgba(6,10,24,0)');u.fillStyle=g;u.fillRect(x*P,y*P,5,P);}
      if(wallish(rt)){const g=u.createLinearGradient(x*P+P,0,x*P+P-5,0);g.addColorStop(0,'rgba(6,10,24,.25)');g.addColorStop(1,'rgba(6,10,24,0)');u.fillStyle=g;u.fillRect(x*P+P-5,y*P,5,P);}}}
  const land=c=>c!=null&&c!=='~'&&c!=='b';
  // ---- water depth (very low-res, smoothed on upscale for soft gradients) ----
  const Dp=mkCanvas(Wt*4,Ht*4);const dg=Dp.getContext('2d');let anyW=false;
  for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){if(t(x,y)!=='~')continue;anyW=true;let d=9;for(let r=1;r<=3&&d===9;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(Math.max(Math.abs(dx),Math.abs(dy))===r&&land(t(x+dx,y+dy)))d=Math.min(d,r);
    dg.fillStyle=d>=3?'rgba(0,8,30,.32)':d===2?'rgba(0,8,30,.18)':'rgba(170,220,245,.10)';dg.fillRect(x*4,y*4,4,4);}
  if(anyW){u.save();u.imageSmoothingEnabled=true;u.drawImage(Dp,0,0,Wt*P,Ht*P);u.restore();}
  // ---- soft terrain edges (pixel layer) ----
  const D4=[[0,-1,'u'],[0,1,'d'],[-1,0,'l'],[1,0,'r']];
  for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){const a=t(x,y);if(a==null||FRANK[a]==null)continue;
    for(const [dx,dy,side] of D4){const b=t(x+dx,y+dy);if(b==null||b===a)continue;
      if(a==='~'&&land(b)&&!SOLID.has(b)||a==='~'&&b&&'GT#'.includes(b)){// shore foam inside the water tile
        for(let i=0;i<16;i++){const hv=hh(x*16+i,y,side.charCodeAt(0));const w=1+(hv%3);if(hv%5===0)continue;
          const px=side==='u'||side==='d'?i:(side==='l'?0:16-w),py=side==='l'||side==='r'?i:(side==='u'?0:16-w);
          e.fillStyle='#bcdcec';if(side==='u'||side==='d')e.fillRect(x*P+px,y*P+py,1,w);else e.fillRect(x*P+px,y*P+py,w,1);
          if(hv%7===0){e.fillStyle='#eef8ff';e.fillRect(x*P+(side==='r'?15:px),y*P+(side==='d'?15:py),1,1);}}continue;}
      if(FRANK[b]==null||FRANK[b]<=FRANK[a]||a==='~')continue;
      const col=baseCol(b,th);e.fillStyle=col;
      for(let i=0;i<4;i++){const hv=hh(x*4+i,y*4+(dx+2)*7,dy+3);const along=2+i*4+(hv%3)-1,r=1+(hv%3),dep=r;
        for(let q=0;q<dep;q++){const span=Math.max(1,r*2-q*2);const s0=along-(span>>1);
          if(side==='u')e.fillRect(x*P+s0,y*P+q,span,1);else if(side==='d')e.fillRect(x*P+s0,y*P+15-q,span,1);
          else if(side==='l')e.fillRect(x*P+q,y*P+s0,1,span);else e.fillRect(x*P+15-q,y*P+s0,1,span);}}}
    // round outer corners of higher ground (paths)
    if(FRANK[a]>=5){for(const [cx,cy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const h1=t(x+cx,y),h2=t(x,y+cy),h3=t(x+cx,y+cy);
        if(h1!=null&&h2!=null&&FRANK[h1]!=null&&FRANK[h2]!=null&&FRANK[h1]<FRANK[a]&&FRANK[h2]<FRANK[a]&&h1===h2){e.fillStyle=baseCol(h1,th);
          const bx=x*P+(cx<0?0:16),by=y*P+(cy<0?0:16),sx=cx<0?1:-1,sy=cy<0?1:-1;
          for(const [ox,oy] of [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[0,2],[1,2],[0,3]])e.fillRect(bx+sx*ox+(sx<0?-1:0),by+sy*oy+(sy<0?-1:0),1,1);}}}}
  // ---- roof snow caps + tall tile overhangs (over layer, drawn above entities) ----
  const snowy=!thawed(G.map)&&out;
  for(let y=0;y<Ht;y++)for(let x=0;x<Wt;x++){const ch=t(x,y);if(!ch)continue;const up=t(x,y-1);
    if(ROOFS.includes(ch)&&up!==ch&&out){const lim=snowy?3:1;for(let i=0;i<16;i++){const hv=hh(x*16+i,y,9);const hgt=1+(hv%lim)+(snowy&&i%5===2?1:0);
        o.fillStyle='#eef4f8';o.fillRect(x*P+i,y*P-hgt+1,1,hgt+1);o.fillStyle='#b8c6d2';o.fillRect(x*P+i,y*P+2,1,1);}}
    if(ch==='T'&&up!=='T'&&out){const src=tileArt('T',th,(x*7+y*3)%4===0?0:(x+y)%2+1,0);o.drawImage(src,0,0,32,14,x*P,y*P-6,16,7);}
    if(ch==='l'){const src=tileArt('l',th,0,0);o.drawImage(src,0,0,32,10,x*P,y*P-4,16,5);}
    if(ch==='0'&&up!=='0'){o.fillStyle='#2e3644';o.fillRect(x*P+7,y*P-12,2,12);o.fillStyle='#5a6676';o.fillRect(x*P+7,y*P-12,1,12);o.fillStyle='#2e3644';o.fillRect(x*P+4,y*P-6,8,1);}
    if(ch==='B'){o.fillStyle='#d8d0c0';o.fillRect(x*P+3,y*P-4,2,5);o.fillRect(x*P+11,y*P-4,2,5);o.fillStyle='#f2ece2';o.fillRect(x*P+3,y*P-4,1,4);}}
  MFX.under=U;MFX.edge=E;MFX.over=O;}
function drawMapLayer(c,cx,cy,smooth,dy){if(!c)return;const prev=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=!!smooth;const oy=-(dy||0);
  let sx=Math.floor(cx/2)-1,sy=Math.floor(cy/2)+oy-1;let sw=Math.ceil(W/2)+3,sh=Math.ceil(H/2)+3;let dx=sx*2-cx,dyy=(sy-oy)*2-cy;
  if(sx<0){dx-=sx*2;sw+=sx;sx=0;}if(sy<0){dyy-=sy*2;sh+=sy;sy=0;}sw=Math.min(sw,c.width-sx);sh=Math.min(sh,c.height-sy);if(sw>0&&sh>0)ctx.drawImage(c,sx,sy,sw,sh,dx,dyy,sw*2,sh*2);ctx.imageSmoothingEnabled=prev;}
function drawUnderFX(cx,cy){G._camY=cy;ensureMapFX();drawMapLayer(MFX.edge,cx,cy,false);drawMapLayer(MFX.under,cx,cy,true);}
function drawOverFX(cx,cy){drawMapLayer(MFX.over,cx,cy,false,-16);}

// ---- per-frame surface animation: water shimmer, ice glints, fog drift, static arcs, footprints ----
function drawSurfaceFX(cx,cy){const m=curMap();const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);const nx=Math.ceil(W/TS)+1,ny=Math.ceil(H/TS)+1;const hi=hq();
  drawPrints(cx,cy);
  for(let y=y0;y<=y0+ny;y++)for(let x=x0;x<=x0+nx;x++){const ch=T(x,y);if(ch==null)continue;const sx=x*TS-cx,sy=y*TS-cy;const hv=hh(x,y,3);
    if(ch==='~'){const ph=(TICK*0.35+hv%32);ctx.fillStyle='rgba(210,236,255,.30)';ctx.fillRect(sx+(ph%32),sy+4+(hv%6)*4,6,2);ctx.fillRect(sx+((ph*0.7+16)%32),sy+18+(hv%3)*3,4,2);
      if(hi){const w=Math.sin(TICK/30+x*0.8+y*0.5);ctx.fillStyle='rgba(0,20,50,'+(0.06+0.06*w)+')';ctx.fillRect(sx,sy+((TICK/3+hv)%32),32,6);}}
    else if(ch==='-'){if(hi&&(TICK+hv)%220<8){const k=(TICK+hv)%220;const a=k<4?k/4:(8-k)/4;const gx=sx+6+(hv%20),gy=sy+6+((hv>>5)%18);ctx.fillStyle='rgba(255,255,255,'+a+')';ctx.fillRect(gx-3,gy,7,1);ctx.fillRect(gx,gy-3,1,7);}}
    else if(ch==='w'&&hi){const t=TICK/90+hv;ctx.fillStyle='rgba(236,242,248,.18)';ctx.beginPath();ctx.ellipse(sx+16+Math.sin(t)*10,sy+14+Math.cos(t*0.7)*4,20,8,0,0,7);ctx.fill();}
    else if(ch==='y'&&hi&&(TICK+hv)%97<3){ctx.strokeStyle='rgba(190,170,255,.9)';ctx.lineWidth=1.5;ctx.beginPath();let px_=sx+4,py_=sy+16;ctx.moveTo(px_,py_);for(let i=0;i<4;i++){px_+=6;py_+=(Math.random()*12-6);ctx.lineTo(px_,py_);}ctx.stroke();}}}
// footprints
function addPrint(){G.prints=G.prints||[];const m=curMap();if(!m.outdoor||m.theme==='cave'||!hq())return;const ch=T(G.px,G.py);if(!ch||!'.d,n'.includes(ch))return;
  G.prints.push({map:G.map,x:G.px,y:G.py,dir:G.pdir,t:TICK,deep:ch==='d',side:G.stepN%2});if(G.prints.length>48)G.prints.shift();}
function drawPrints(cx,cy){for(const p of G.prints||[]){if(p.map!==G.map)continue;const age=TICK-p.t;if(age>900)continue;const a=(1-age/900)*(p.deep?0.42:0.26);const sx=p.x*TS-cx,sy=p.y*TS-cy;
  const v=p.dir==='up'||p.dir==='down';ctx.fillStyle='rgba(60,84,110,'+a+')';const o=p.side?4:-4;
  if(v){ctx.fillRect(sx+14+o,sy+10,3,5);ctx.fillRect(sx+14-o,sy+20,3,5);}else{ctx.fillRect(sx+10,sy+18+o/2,5,3);ctx.fillRect(sx+20,sy+18-o/2,5,3);}}}
// spray when you stop sliding on ice
function iceSpray(){for(let i=0;i<10;i++){const a=Math.random()*Math.PI*2,s=0.5+Math.random()*1.2;OWP.push({x:G.px*TS+16,y:G.py*TS+26,vx:Math.cos(a)*s,vy:-Math.abs(Math.sin(a))*s,t:0,max:22,k:'spark',col:'#e8f6ff'});}}

// ---- entity shadow: soft, stretched away from nearby lamps ----
function entShadow(sx,sy,wx,wy){let best=null,bd=1e9;if(hq())for(const l of G.lights||[]){if(l.player)continue;const dx=wx+16-l.x,dy=wy+28-l.y;const d=dx*dx+dy*dy;if(d<bd&&d<150*150){bd=d;best=[dx,dy];}}
  ctx.fillStyle='rgba(6,12,28,.28)';ctx.beginPath();ctx.ellipse(sx+16,sy+29,10,4,0,0,7);ctx.fill();
  if(best){const d=Math.sqrt(bd)||1;const k=Math.max(0,1-d/150);const ang=Math.atan2(best[1],best[0]);const len=8+k*16;
    ctx.save();ctx.translate(sx+16+Math.cos(ang)*len*0.6,sy+29+Math.sin(ang)*len*0.35);ctx.rotate(ang);ctx.fillStyle='rgba(6,12,28,'+(0.12+0.18*k)+')';ctx.beginPath();ctx.ellipse(0,0,len,4,0,0,7);ctx.fill();ctx.restore();}}
// reflection of a character standing above water or ice
function entReflect(img,sx,sy,wx,wy){if(!hq())return;const tx=Math.round(wx/TS),ty=Math.round(wy/TS);const b=T(tx,ty+1);if(b!=='~'&&b!=='-')return;
  ctx.save();ctx.globalAlpha=b==='-'?0.22:0.18;ctx.beginPath();ctx.rect(sx-4,(ty+1)*TS-(wy-sy),40,TS);ctx.clip();ctx.translate(sx,sy+59+Math.sin(TICK/14)*(b==='~'?1:0));ctx.scale(1,-0.8);ctx.drawImage(img,0,0,32,36);ctx.restore();}

// ---- coloured light bleed + light reflections in water ----
function drawLightBleed(cx,cy){if(!hq())return;const wx=curWeather();const str=0.10+0.22*Math.min(1,(wx.dark||0)/0.6);if(str<0.12&&!(wx.dark>0))return;
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const l of G.lights||[]){const sx=l.x-cx,sy=l.y-cy;if(sx<-100||sy<-100||sx>W+100||sy>H+100)continue;const r=l.r*0.75*(l.fl?(0.94+0.06*Math.sin(TICK/6+l.x)):1);
    const g=ctx.createRadialGradient(sx,sy,0,sx,sy,r);g.addColorStop(0,hexA(l.col,str));g.addColorStop(1,hexA(l.col,0));ctx.fillStyle=g;ctx.fillRect(sx-r,sy-r,r*2,r*2);
    // reflection streak if water below the light
    const tx=Math.floor(l.x/TS),ty=Math.floor(l.y/TS);for(let k=1;k<=3;k++){const ch=T(tx,ty+k);if(ch==='~'||ch==='-'){const ry=(ty+k)*TS-cy+16,wob=Math.sin(TICK/10+k)*3;
        const g2=ctx.createRadialGradient(sx+wob,ry,0,sx+wob,ry,22);g2.addColorStop(0,hexA(l.col,ch==='~'?0.35:0.25));g2.addColorStop(1,hexA(l.col,0));ctx.fillStyle=g2;ctx.save();ctx.translate(sx+wob,ry);ctx.scale(0.45,1.3);ctx.translate(-(sx+wob),-ry);ctx.fillRect(sx+wob-22,ry-22,44,44);ctx.restore();break;}}}
  ctx.restore();}
function hexA(col,a){if(col[0]!=='#')return col;const n=parseInt(col.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a.toFixed(3)+')';}

// ---- drifting cloud shadows (outdoor daytime) + interior vignette ----
function drawSkyFX(cx,cy){const m=curMap();const wx=curWeather();
  if(m.outdoor&&m.theme!=='cave'&&!m.dungeon&&(wx.dark||0)<0.3&&hq()){const mw=m.grid[0].length*TS,mh=m.grid.length*TS;
    for(let i=0;i<3;i++){const x=((TICK*0.18+i*523)%(mw+600))-300-cx,y=((i*311+137)%Math.max(1,mh))-cy;
      const g=ctx.createRadialGradient(x,y,0,x,y,170);g.addColorStop(0,'rgba(10,20,40,.10)');g.addColorStop(1,'rgba(10,20,40,0)');ctx.fillStyle=g;ctx.save();ctx.translate(x,y);ctx.scale(1.6,0.8);ctx.translate(-x,-y);ctx.fillRect(x-170,y-170,340,340);ctx.restore();}}
  if(!m.outdoor){if(!drawSkyFX.v){const c=mkCanvas(W,H);const g=c.getContext('2d');const gr=g.createRadialGradient(W/2,H/2,H*0.35,W/2,H/2,W*0.7);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(6,8,18,.42)');g.fillStyle=gr;g.fillRect(0,0,W,H);drawSkyFX.v=c;}
    ctx.drawImage(drawSkyFX.v,0,0,W,H);if(m.theme==='house'||m.theme==='repair'){ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(60,30,8,.10)';ctx.fillRect(0,0,W,H);ctx.restore();}}}

// ---- battle arenas ----
function arenaOf(){const m=curMap();if(G.surf)return 'water';if(m.vaultMap)return 'vault';if(['factory','kiln','gym1','gym2','cave','lab','repair','house'].includes(m.theme))return m.theme;
  const ch=T(G.px,G.py);const near=(c)=>{for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(T(G.px+dx,G.py+dy)===c)return true;return false;};
  return ch==='j'?'scrap':ch==='q'?'crystal':ch==='y'?'static':ch==='w'?'fog':ch==='-'?'ice':ch==='^'?'cave':near('~')||near('-')?'shore':'snow';}
function drawArena(B){const a=B.arena;if(!a)return;const t=TICK;
  const plat=(cx,cy,rx,ry,top,side)=>{ctx.fillStyle=side;ctx.beginPath();ctx.ellipse(cx,cy+4,rx,ry,0,0,7);ctx.fill();ctx.fillStyle=top;ctx.beginPath();ctx.ellipse(cx,cy,rx-6,ry-4,0,0,7);ctx.fill();};
  if(a==='scrap'){ctx.fillStyle='rgba(30,36,46,.75)';for(const [x,y,w,h] of [[20,150,60,40],[400,140,70,50],[250,120,40,26]]){ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(60,70,84,.8)';ctx.fillRect(x+6,y-8,w-20,10);ctx.fillStyle='rgba(30,36,46,.75)';}
    plat(360,124,100,22,'#6a6a64','#4a4a46');plat(130,226,130,28,'#6e6c66','#4a4846');for(let i=0;i<14;i++){const hv=hh(i,1,1);ctx.fillStyle=['#8a929e','#8a5a40','#5a626e'][i%3];const px=i<7?280+hv%160:20+hv%220,py=i<7?116+hv%14:212+hv%22;ctx.fillRect(px,py,6+hv%8,3+hv%3);}}
  else if(a==='crystal'){for(let i=0;i<7;i++){const x=40+i*66,h=40+(hh(i,2)%50);const col=i%2?'#58c8e8':'#9a7ae8';ctx.fillStyle=hexA(col,0.55);ctx.beginPath();ctx.moveTo(x-12,170);ctx.lineTo(x,170-h);ctx.lineTo(x+12,170);ctx.fill();}
    plat(360,124,100,22,'#7aa8b8','#4a6a7a');plat(130,226,130,28,'#80aebe','#4a6a7a');ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<6;i++){const p=0.5+0.5*Math.sin(t/20+i);ctx.fillStyle='rgba(120,220,255,'+(0.05+0.08*p)+')';ctx.beginPath();ctx.arc(60+i*80,160,26,0,7);ctx.fill();}ctx.restore();}
  else if(a==='static'){plat(360,124,100,22,'#5a5a7e','#3a3a58');plat(130,226,130,28,'#5e5e84','#3a3a58');if(t%40<3){ctx.strokeStyle='rgba(190,170,255,.9)';ctx.lineWidth=2;ctx.beginPath();let x=Math.random()*W,y=0;ctx.moveTo(x,y);while(y<180){x+=Math.random()*20-10;y+=14;ctx.lineTo(x,y);}ctx.stroke();}}
  else if(a==='fog'){plat(360,124,100,22,'#b8c8cc','#8a9ca2');plat(130,226,130,28,'#bccccf','#8a9ca2');}
  else if(a==='ice'||a==='shore'||a==='water'){const water=a!=='ice';
    if(water){const g=ctx.createLinearGradient(0,150,0,232);g.addColorStop(0,'#3a6890');g.addColorStop(1,'#24486a');ctx.fillStyle=g;ctx.fillRect(0,150,W,82);for(let i=0;i<10;i++){ctx.fillStyle='rgba(210,236,255,.25)';ctx.fillRect(((t*0.5+i*53)%W),158+i*7,18,2);}}
    plat(360,124,100,22,water?'#c6d6e0':'#bcdcee','#8ab0c8');plat(130,226,130,28,water?'#cadae4':'#c4e2f2','#8ab0c8');
    if(!water&&t%160<6){ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillRect(300+(t%60),118,7,1);ctx.fillRect(303+(t%60),115,1,7);}
    B.reflect=1;}
  else if(a==='vault'){plat(360,124,100,22,'#3a4250','#20283a');plat(130,226,130,28,'#3a4250','#20283a');ctx.strokeStyle='rgba(96,255,220,.35)';ctx.lineWidth=1;for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,160+i*9);ctx.lineTo(W,160+i*9);ctx.stroke();}}}
function botGround(b,x,y,sz,flip){if(!b)return;const fx=x+sz/2,fy=y+sz*0.94;ctx.fillStyle='rgba(6,10,24,.34)';ctx.beginPath();ctx.ellipse(fx,fy,sz*0.3,sz*0.065,0,0,7);ctx.fill();
  if(hq()){const col=TCOL[BOTS[b.id].types[0]];ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(fx,fy,0,fx,fy,sz*0.42);g.addColorStop(0,hexA(col,0.22+0.08*Math.sin(TICK/12)));g.addColorStop(1,hexA(col,0));ctx.fillStyle=g;ctx.save();ctx.translate(fx,fy);ctx.scale(1,0.3);ctx.translate(-fx,-fy);ctx.fillRect(fx-sz*0.42,fy-sz*0.42,sz*0.84,sz*0.84);ctx.restore();ctx.restore();}}
function botReflect(sp,x,y,sz,flip,alpha){if(!hq())return;ctx.save();ctx.globalAlpha=0.3*alpha;const fy=y+sz*0.93;ctx.beginPath();ctx.rect(x-10,fy,sz+20,sz*0.5);ctx.clip();ctx.translate(flip?x+sz:x,fy+0.55*sz*0.93+Math.sin(TICK/16)*1.5);ctx.scale(flip?-1:1,-0.55);ctx.drawImage(sp,0,0,sz,sz);ctx.restore();}
