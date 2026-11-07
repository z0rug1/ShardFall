// ---------- bot sprites (robots) ----------
const BOTCACHE={};const BQ=4;
function botSprite(id,opt){const O=opt===true?{sil:1}:(opt||{});const silhouette=!!O.sil;const key=id+(silhouette?'_s':'')+(O.blink?'_b':'')+(O.glitch?'_g':'');if(BOTCACHE[key])return BOTCACHE[key];
  const d=BOTS[id];const Q=BQ;const c=mkCanvas(40*Q,40*Q);const g=c.getContext('2d');
  const s=d.stage>=1?1.12:0.92;const ox=20-16*s,oy=d.stage>=1?40-34*s:40-33*s;
  const X=x=>(ox+x*s)*Q,Y=y=>(oy+y*s)*Q,S=v=>v*s*Q;
  const shardType=d.shard;const sc=shardType?TCOL[shardType]:null;
  let paint=shade(mix(d.col,'#1a1420',0.25),-0.1);if(shardType)paint=mix(paint,TCOL[shardType],0.4);
  const metal=mix(d.col,'#262b36',0.74),md=shade(metal,-0.5),ml=shade(metal,0.28),jt='#14181f',eye=d.legend?TCOL[d.types[0]]:mix(TCOL[d.types[0]],'#ff2a2a',0.35),vis='#05070b';
  const glows=[];
  const E=(cx,cy,rx,ry,col)=>pell(g,X(cx),Y(cy),S(rx),S(ry),col);
  const B=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(X(x)),Math.round(Y(y)),Math.max(1,Math.round(S(w))),Math.max(1,Math.round(S(h))));};
  const Tr=(pts,col)=>ptri(g,pts.map((v,i)=>i%2?Y(v):X(v)),col);
  const P=(x,y,w,h,col=metal)=>{B(x,y,w,h,col);B(x,y,w,0.5,shade(col,0.35));B(x,y+h-0.5,w,0.5,shade(col,-0.45));B(x,y,0.5,h,shade(col,0.15));};
  const riv=(x,y)=>{B(x,y,0.75,0.75,'#9aa6b6');B(x,y,0.4,0.4,'#e6eef6');};
  const J=(x,y,r=1.6)=>{E(x,y,r,r,jt);E(x,y,r*0.45,r*0.45,'#5a6476');};
  const seam=(x,y,w,h)=>B(x,y,w,h,shade(metal,-0.6));
  const glowPt=(x,y,r)=>glows.push([X(x),Y(y),S(r)]);
  const glow=(x,y,w,h)=>{B(x,y,w,h,eye);B(x,y,Math.max(0.5,w/2),0.5,'#ffffff');glowPt(x+w/2,y+h/2,Math.max(w,h)*1.4);};
  // angry visor: dark band, two slanted slit eyes angled toward centre, heavy V brow
  const visor=(x,y,w)=>{B(x,y,w,2.4,vis);const m=x+w/2;
    if(O.blink){B(x+0.8,y+1.2,w/2-1.5,0.5,md);B(m+0.7,y+1.2,w/2-1.5,0.5,md);Tr([x-1,y-1.6,m,y+1.1,x+w+1,y-1.6,x+w+1,y-0.2,m,y+2.0,x-1,y-0.2],md);return;}
    Tr([x+0.8,y+0.5,m-0.7,y+1.4,m-0.7,y+2.0,x+0.8,y+1.4],eye);Tr([x+w-0.8,y+0.5,m+0.7,y+1.4,m+0.7,y+2.0,x+w-0.8,y+1.4],eye);
    B(x+0.9,y+0.6,(w/2-1.6)*0.5,0.4,'#ffffff');
    Tr([x-1,y-1.6,m,y+1.1,x+w+1,y-1.6,x+w+1,y-0.2,m,y+2.0,x-1,y-0.2],md);Tr([x-1,y-1.6,m,y+1.1,x+w+1,y-1.6],shade(md,0.25));
    glowPt(x+w*0.28,y+1.3,2.6);glowPt(x+w*0.72,y+1.3,2.6);};
  // single cyclops eye with angled brow slash
  const cyc=(x,y,r)=>{E(x,y,r+0.6,r+0.6,vis);if(O.blink){E(x,y,r,r*0.25,md);Tr([x-r-1.2,y-r-0.6,x+r+1.2,y-r*0.1,x+r+1.2,y-r-1.6,x-r-1.2,y-r-2.2],md);return;}E(x,y,r,r,eye);E(x,y+0.3,r*0.35,r*0.75,'#ffffff');Tr([x-r-1.2,y-r-0.6,x+r+1.2,y-r*0.1,x+r+1.2,y-r-1.6,x-r-1.2,y-r-2.2],md);glowPt(x,y,r*2.6);};
  const spikes=(x,y,n,step,h,col=md)=>{for(let k=0;k<n;k++)Tr([x+k*step,y,x+k*step+step/2,y-h,x+k*step+step,y],col);};
  const core=(x,y)=>{if(!c.core)c.core=[X(x)/(40*Q),Y(y)/(40*Q)];E(x,y,3.2,3.2,'#0a0e14');E(x,y,2.6,2.6,'#1c2430');Tr([x,y-2.2,x+2.2,y,x,y+2.2,x-2.2,y],TCOL[d.types[0]]);B(x-0.6,y-1,0.8,0.8,'#ffffff');glowPt(x,y,4);
    if(d.stage>=1&&sc){E(x+6,y,2.6,2.6,'#0a0e14');Tr([x+6,y-1.8,x+7.8,y,x+6,y+1.8,x+4.2,y],sc);glowPt(x+6,y,3.4);}};
  const addon=(A)=>{if(!shardType)return;const a=sc,ad=shade(sc,-0.4);
    if(shardType==='Volt'){B(A.x-2,A.y-7,1,7,jt);B(A.x+7,A.y-7,1,7,jt);Tr([A.x-4,A.y-6,A.x-1,A.y-11,A.x-2,A.y-7,A.x+1,A.y-7,A.x-2,A.y-2],a);Tr([A.x+5,A.y-6,A.x+8,A.y-11,A.x+7,A.y-7,A.x+10,A.y-7,A.x+7,A.y-2],a);glowPt(A.x-1,A.y-7,3);glowPt(A.x+8,A.y-7,3);}
    if(shardType==='Gale'){Tr([A.wx,A.wy,A.wx-10,A.wy-3,A.wx-8,A.wy+2],md);Tr([A.wx,A.wy+2,A.wx-9,A.wy+3,A.wx-1,A.wy+5],a);Tr([A.wx+A.ww,A.wy,A.wx+A.ww+10,A.wy-3,A.wx+A.ww+8,A.wy+2],md);Tr([A.wx+A.ww,A.wy+2,A.wx+A.ww+9,A.wy+3,A.wx+A.ww+1,A.wy+5],a);}
    if(shardType==='Iron'){P(A.ax,A.ay,A.aw,3,'#5a6270');for(let i=1;i<A.aw;i+=4)riv(A.ax+i,A.ay+1);spikes(A.ax,A.ay,Math.floor(A.aw/4),4,2,'#3a404c');}
    if(shardType==='Stone'){for(let i=0;i<3;i++)Tr([A.x-4+i*5,A.y,A.x-2+i*5,A.y-7,A.x+i*5,A.y],i%2?ad:a);B(A.x-4,A.y,14,1,jt);}
    if(shardType==='Flame'){B(A.x-1,A.y-3,6,3,jt);Tr([A.x-2,A.y-3,A.x+1,A.y-11,A.x+3,A.y-3],a);Tr([A.x+1,A.y-3,A.x+4,A.y-8,A.x+6,A.y-3],'#ffd040');glowPt(A.x+2,A.y-6,4);}
    if(shardType==='Tide'){Tr([A.x-2,A.y,A.x+2,A.y-8,A.x+5,A.y],a);Tr([A.x+5,A.y,A.x+8,A.y-6,A.x+10,A.y],ad);B(A.x-2,A.y,12,1,jt);}
    if(shardType==='Frost'){Tr([A.x-3,A.y,A.x-2,A.y-8,A.x,A.y],a);Tr([A.x+1,A.y,A.x+3,A.y-11,A.x+5,A.y],'#e8f8ff');Tr([A.x+6,A.y,A.x+7,A.y-6,A.x+9,A.y],a);}
    if(shardType==='Bloom'){Tr([A.x-5,A.y,A.x-1,A.y-6,A.x+1,A.y],a);Tr([A.x+4,A.y,A.x+8,A.y-7,A.x+10,A.y],ad);B(A.x+2,A.y-5,1,5,jt);}
    if(shardType==='Shade'){Tr([A.x-3,A.y,A.x-7,A.y-9,A.x,A.y-1],a);Tr([A.x+6,A.y,A.x+10,A.y-9,A.x+3,A.y-1],a);}
    if(shardType==='Spirit'){for(let k=0;k<10;k++){const an=k/10*Math.PI*2;B(A.x+2+Math.cos(an)*6,A.y-6+Math.sin(an)*1.8,1,0.8,a);}glowPt(A.x+2,A.y-6,5);}
    if(shardType==='Brawl'){P(A.fx1-3,A.fy-3,6,6,a);P(A.fx2-3,A.fy-3,6,6,a);spikes(A.fx1-3,A.fy-3,3,2,1.5,ad);spikes(A.fx2-3,A.fy-3,3,2,1.5,ad);}};
  const shp=d.shape;let A={x:16,y:4,wx:8,wy:18,ww:16,ax:8,ay:14,aw:16,fx1:4,fx2:28,fy:22};
  if(shp==='fox'){ // flare sentinel
    B(14,24,4,2,jt);Tr([12,26,20,26,16,32],eye);Tr([14,26,18,26,16,30],'#ffffff');
    Tr([24,12,34,3,27,18],paint);Tr([8,12,-2,3,5,18],paint);Tr([25,13,31,7,27,17],shade(paint,-0.3));Tr([7,13,1,7,5,17],shade(paint,-0.3));
    Tr([16,5,27,17,16,27,5,17],metal);Tr([5,17,27,17,16,27],md);Tr([16,8,23,15,9,15],ml);
    visor(9,13.5,14);spikes(9,8.5,3,2.4,2);core(16,21);
    A={x:13,y:5,wx:4,wy:16,ww:24,ax:8,ay:10,aw:16,fx1:2,fx2:30,fy:22};}
  else if(shp==='newt'){ // hydro orb
    for(let i=0;i<3;i++){const x=11+i*5,len=6+(i%2)*3;B(x,22,1,len,jt);E(x+0.5,22+len,1.3,1.3,eye);}
    E(16,15,9.5,9.5,metal);E(16,20,7,4,md);E(12,10,4,3,ml);
    visor(9,12,14);
    B(-1,16,34,2,paint);B(-1,16,34,1,shade(paint,0.35));B(-2,16,2,2,jt);B(32,16,2,2,jt);core(16,21);
    A={x:13,y:5,wx:6,wy:10,ww:20,ax:7,ay:7,aw:18,fx1:1,fx2:31,fy:12};}
  else if(shp==='tortoise'){ // tripod spire
    Tr([10,17,13,17,5,30],md);Tr([19,17,22,17,27,30],md);B(15,19,2,11,jt);B(3,29,5,2,jt);B(24,29,5,2,jt);B(13,29,6,2,jt);
    Tr([9,12,10,2,13,11],paint);Tr([14,10,16,0,18,10],mix(paint,eye,0.4));Tr([19,11,22,2,23,12],paint);
    E(16,13,10,6,metal);E(13,10,4,2,ml);B(6,14,20,4,md);B(6,15,20,1,paint);
    visor(8,15.5,16);core(16,11);
    A={x:13,y:6,wx:6,wy:13,ww:20,ax:6,ay:12,aw:20,fx1:2,fx2:30,fy:22};}
  else if(shp==='bird'){ // halo drone
    B(7,4,18,1,eye);B(7,7,18,1,eye);B(5,5,2,2,eye);B(25,5,2,2,eye);B(7,4,6,1,'#ffffff');
    Tr([4,10,28,10,16,28],metal);Tr([4,10,28,10,16,14],ml);Tr([10,19,22,19,16,28],md);
    P(0,11,5,3,paint);P(27,11,5,3,paint);
    cyc(16,15,2.4);spikes(8,11,4,4,1.6,md);core(16,21);
    A={x:13,y:2,wx:4,wy:11,ww:24,ax:7,ay:9,aw:18,fx1:2,fx2:30,fy:18};}
  else if(shp==='rabbit'){ // spire walker
    B(10,1,1,9,md);B(21,1,1,9,md);B(9,0,3,2,eye);B(20,0,3,2,eye);
    Tr([11,8,21,8,24,12,21,17,11,17,8,12],metal);Tr([11,8,21,8,24,12,8,12],ml);visor(10,10.5,12);
    B(15,17,2,2,jt);Tr([9,19,23,19,20,26,12,26],metal);B(12,21,8,2,paint);
    P(5,19,2,9,md);P(25,19,2,9,md);J(6,19);J(26,19);B(4,28,4,2,eye);B(24,28,4,2,eye);
    B(13,26,2,5,jt);B(17,26,2,5,jt);B(11,30,4,1,md);B(17,30,4,1,md);core(16,23);
    A={x:13,y:0,wx:5,wy:19,ww:22,ax:9,ay:17,aw:14,fx1:5,fx2:27,fy:26};}
  else if(shp==='beetle'){ // hex crawler
    for(let i=0;i<3;i++){const y=15+i*4;B(1+i,y,8-i,1,md);B(1+i,y,1,8,jt);B(23,y,8-i,1,md);B(30-i,y,1,8,jt);}
    Tr([9,12,23,12,28,19,23,26,9,26,4,19],metal);Tr([9,12,23,12,28,19,4,19],ml);B(5,19,22,1,md);B(9,23,14,1,paint);
    B(15,6,1,6,jt);E(15.5,6,1.4,1.4,eye);
    visor(9,14,14);spikes(6,12,5,4,1.8);core(16,21);
    A={x:13,y:5,wx:3,wy:14,ww:26,ax:7,ay:10,aw:18,fx1:2,fx2:30,fy:26};}
  else if(shp==='spore'){ // bloom pod
    Tr([16,16,3,7,8,20],paint);Tr([16,16,29,7,24,20],paint);Tr([16,17,5,25,11,29],shade(paint,-0.3));Tr([16,17,27,25,21,29],shade(paint,-0.3));
    E(16,15,5.5,10,metal);E(14,10,2,3,ml);visor(12,12.5,8);
    E(4,4,1.6,1.6,eye);E(28,3,1.6,1.6,eye);E(30,13,1.2,1.2,eye);E(2,14,1.2,1.2,eye);core(16,20);
    A={x:13,y:4,wx:3,wy:11,ww:26,ax:11,ay:6,aw:10,fx1:3,fx2:29,fy:27};}
  else if(shp==='golem'){ // monolith
    P(9,8,14,18);B(9,14,14,1,paint);B(9,20,14,1,paint);B(15,8,1,18,md);riv(10,9);riv(21,9);riv(10,24);riv(21,24);
    P(11,1,10,5,md);visor(12,2.5,8);
    P(2,11,5,7,md);P(25,11,5,7,md);B(3,13,3,1,eye);B(26,13,3,1,eye);
    B(10,27,12,2,jt);B(12,29,8,1,eye);core(16,17);
    A={x:13,y:0,wx:8,wy:9,ww:16,ax:9,ay:6,aw:14,fx1:4,fx2:28,fy:21};}
  else if(shp==='dog'){ // brawler hover-frame
    B(13,24,6,2,jt);Tr([12,26,20,26,16,32],eye);
    Tr([7,10,25,10,20,25,12,25],metal);Tr([7,10,25,10,22,15,10,15],ml);B(10,16,12,2,paint);
    P(12,3,8,7,md);Tr([14,3,16,-1,18,3],paint);visor(13,4.6,6);
    P(1,8,5,7,md);P(26,8,5,7,md);P(0,15,7,7,metal);P(25,15,7,7,metal);B(1,17,5,1,eye);B(26,17,5,1,eye);core(16,20);
    A={x:13,y:1,wx:6,wy:10,ww:20,ax:8,ay:8,aw:16,fx1:3,fx2:29,fy:19};}
  else if(shp==='jelly'){ // saucer
    for(let i=0;i<4;i++){const x=8+i*5,len=6+(i%2)*4;B(x,19,1,len,jt);E(x+0.5,19+len,1.3,1.3,eye);}
    E(16,12,7,5.5,mix(eye,'#ffffff',0.5));E(14,10,2,1.5,'#ffffff');cyc(16,13,1.8);
    E(16,16.5,15,3.6,metal);B(1,17,30,1,md);B(3,15,26,1,ml);for(let x=4;x<29;x+=4)B(x,16,1,1,eye);core(16,19);
    A={x:13,y:5,wx:1,wy:15,ww:30,ax:5,ay:13,aw:22,fx1:2,fx2:30,fy:22};}
  else if(shp==='crystal'){ // floating ice cluster
    Tr([6,22,9,8,12,22],shade(metal,0.15));Tr([20,22,23,6,26,22],shade(metal,0.15));Tr([12,26,16,2,20,26],metal);Tr([12,26,16,2,16,26],ml);
    Tr([4,14,6,10,8,14,6,18],paint);Tr([24,14,26,10,28,14,26,18],paint);Tr([9,22,23,22,16,30],md);
    cyc(16,14,2.4);core(16,22);B(10,30,12,0.8,eye);
    A={x:13,y:1,wx:6,wy:14,ww:20,ax:10,ay:10,aw:12,fx1:3,fx2:29,fy:24};}
  else if(shp==='serpent'){ // segmented rail serpent
    const segs=[[24,24,4.2],[28,18,3.6],[25,12,3.2],[20,9,2.8]];for(const [sx,sy,r] of segs.slice().reverse()){E(sx,sy,r,r,metal);E(sx-r*0.3,sy-r*0.3,r*0.4,r*0.4,ml);B(sx-0.5,sy-r,1,r*2,md);J(sx,sy+r*0.6,0.9);}
    E(16,22,4.6,4.6,metal);B(15.5,17.5,1,9,md);P(4,15,10,8);Tr([4,23,0,26,4,19],md);Tr([7,15,9,10,11,15],paint);Tr([11,15,13,11,14,15],paint);visor(5,17,8);core(16,23);
    A={x:6,y:10,wx:4,wy:16,ww:24,ax:4,ay:13,aw:10,fx1:2,fx2:30,fy:26};}
  else if(shp==='turbine'){ // turbine ring drone
    E(16,17,12,12,md);E(16,17,10,10,'#14181f');for(let k=0;k<6;k++){const an=k/6*Math.PI*2;Tr([16,17,16+Math.cos(an)*9,17+Math.sin(an)*9,16+Math.cos(an+0.5)*9,17+Math.sin(an+0.5)*9],k%2?paint:metal);}
    E(16,17,3,3,metal);P(11,2,10,6,metal);visor(12,3.5,8);B(15,8,2,3,jt);P(3,27,6,3,md);P(23,27,6,3,md);B(5,30,2,1.5,eye);B(25,30,2,1.5,eye);core(16,17);
    A={x:13,y:1,wx:3,wy:15,ww:26,ax:10,ay:0,aw:12,fx1:2,fx2:30,fy:18};}
  else if(shp==='lantern'){ // obelisk
    Tr([4,10,6,5,8,10],paint);Tr([4,10,6,15,8,10],shade(paint,-0.35));Tr([24,10,26,5,28,10],paint);Tr([24,10,26,15,28,10],shade(paint,-0.35));
    Tr([3,22,5,19,7,22],paint);Tr([3,22,5,25,7,22],shade(paint,-0.35));Tr([25,22,27,19,29,22],paint);Tr([25,22,27,25,29,22],shade(paint,-0.35));
    Tr([16,0,23,8,16,31,9,8],md);Tr([16,3,21,9,16,27,11,9],metal);Tr([16,3,21,9,11,9],ml);
    cyc(16,12,2.1);B(13,17,7,1,paint);core(16,21);
    A={x:13,y:0,wx:9,wy:12,ww:14,ax:11,ay:7,aw:10,fx1:3,fx2:29,fy:28};}
  if(d.stage>=1)addon(A);
  if(silhouette){g.globalCompositeOperation='source-in';R(g,0,0,40*Q,40*Q,'#2a303c');g.globalCompositeOperation='source-over';}
  crisp(c,silhouette?'#0e1118':'#040507',3);
  if(!silhouette){g.globalCompositeOperation='lighter';for(const [gx,gy,gr] of glows){const rg=g.createRadialGradient(gx,gy,0,gx,gy,gr);rg.addColorStop(0,eye+'aa');rg.addColorStop(1,eye+'00');g.fillStyle=rg;g.fillRect(gx-gr,gy-gr,gr*2,gr*2);}g.globalCompositeOperation='source-over';}
  if(O.glitch&&!silhouette){const id2=g.getImageData(0,0,c.width,c.height);const p=id2.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const r=p[i],gg=p[i+1],b=p[i+2];p[i]=Math.min(255,b*1.1+30);p[i+1]=Math.min(255,r*0.9+20);p[i+2]=Math.min(255,gg*1.2+40);}
    g.putImageData(id2,0,0);const rr2=hrand(id.length*97+13);for(let k=0;k<5;k++){const y=Math.floor(rr2()*c.height);const h=2+Math.floor(rr2()*6);const dx=Math.round((rr2()-0.5)*14);const strip=g.getImageData(0,y,c.width,h);g.clearRect(0,y,c.width,h);g.putImageData(strip,dx,y);}
    g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,0,200,.12)';for(let y=0;y<c.height;y+=6)g.fillRect(0,y,c.width,2);g.globalCompositeOperation='source-over';}
  BOTCACHE[key]=c;return c;}

// ---------- tiles (cold palette) ----------
const TCACHE={};
function seedSpeck(g,col,n,seed){let s=seed*7919+13;for(let i=0;i<n;i++){s=(s*9301+49297)%233280;const x=s%16;s=(s*9301+49297)%233280;const y=s%16;R(g,x,y,1,1,col);}}
const THEMES={out:{floor:'#c4a888',wall:'#8a7060'},house:{floor:'#c8aa8a',fl2:'#b0927a',wall:'#7e6a62',wl2:'#5e4e4a'},lab:{floor:'#dfe4ee',fl2:'#c2c9d8',wall:'#a8b6cc',wl2:'#7a88a2'},
 repair:{floor:'#9a7e62',fl2:'#866c54',wall:'#4a5260',wl2:'#2e343e'},gym1:{floor:'#a8a6a6',fl2:'#8e8c8e',wall:'#5a5a62',wl2:'#3e3e46'},gym2:{floor:'#7e8898',fl2:'#687282',wall:'#323a4a',wl2:'#d8c040'},cave:{floor:'#6e7682',wall:'#3c4450'},factory:{floor:'#6a6058',fl2:'#564c46',wall:'#3a3230',wl2:'#c07030'},kiln:{floor:'#4e4240',fl2:'#3a302e',wall:'#2a201e',wl2:'#ff7030'}};
function grass(g,v){R(g,0,0,16,16,'#8fb0a2');seedSpeck(g,'#7a9c8e',9,v+1);seedSpeck(g,'#b4cec4',4,v+7);seedSpeck(g,'#eef4f8',v===0?4:2,v+11);}
function snowCap(g,col){R(g,0,0,16,3,'#eef4f8');for(let x=0;x<16;x+=3)R(g,x,3,2,1,'#eef4f8');R(g,0,3,16,1,'rgba(0,0,0,0)');}
function floorT(g,th){const t=THEMES[th]||THEMES.house;R(g,0,0,16,16,t.floor);
  if(th==='house'){R(g,0,7,16,1,t.fl2);R(g,0,15,16,1,t.fl2);R(g,5,0,1,7,t.fl2);R(g,11,8,1,7,t.fl2);}
  else if(th==='gym2'){R(g,0,0,16,1,t.fl2);R(g,0,0,1,16,t.fl2);R(g,2,2,1,1,'#a8b2c4');R(g,13,2,1,1,'#a8b2c4');R(g,2,13,1,1,'#a8b2c4');R(g,13,13,1,1,'#a8b2c4');}
  else if(th==='gym1'){R(g,0,0,16,1,t.fl2);R(g,0,8,16,1,t.fl2);R(g,0,0,1,8,t.fl2);R(g,8,8,1,8,t.fl2);seedSpeck(g,'#bcbaba',4,3);}
  else {R(g,0,0,16,1,t.fl2);R(g,0,0,1,16,t.fl2);}}
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;if(mx!==mn){const d=mx-mn;s=l>0.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];}
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;const f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;return s===0?[l*255,l*255,l*255]:[f(h+1/3)*255,f(h)*255,f(h-1/3)*255];}
function warmTile(src,ch){const c=mkCanvas(src.width,src.height);const g=c.getContext('2d');g.drawImage(src,0,0);const d=g.getImageData(0,0,c.width,c.height);const p=d.data;
  const grassy='.,TFfslm'.includes(ch),path=ch==='=';
  for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;let [h,s,l]=rgb2hsl(p[i],p[i+1],p[i+2]);const chroma=(Math.max(p[i],p[i+1],p[i+2])-Math.min(p[i],p[i+1],p[i+2]))/255;
    const keepSnow=((i>>2)*2654435761>>>0)%100<(ch==='T'?45:22);
    if(l>0.78&&chroma<0.14){if(keepSnow){}else if(grassy){h=92;s=0.2;l=ch==='T'?0.4:0.5;}else if(path){h=30;s=0.14;l=0.58;}else{l=Math.min(l,0.66);s=0.06;}}
    else if(path&&s<0.2){h=30;s=0.13;l=l*0.86;}
    else if(h>120&&h<205&&s>0.04){h=h-28;s=Math.min(1,s*1.25+0.03);l=l*0.97;}
    else if(h>=200&&h<240){s=Math.min(1,s*1.35);l=Math.min(0.8,l*1.06);}
    else if((h<60||h>330)&&s>0.1){s=Math.min(1,s*1.2);}
    const [r,gg,b]=hsl2rgb(h,s,l);p[i]=r;p[i+1]=gg;p[i+2]=b;}
  g.putImageData(d,0,0);return c;}
function tileArt(ch,th,v,fr){const key=ch+th+v+fr;let c=TCACHE[key];if(c)return c;
  if(th==='outw'){c=warmTile(tileArt(ch,'out',v,fr),ch);TCACHE[key]=c;return c;}c=mkCanvas(32,32);const g=c.getContext('2d');g.scale(2,2);
 const t=THEMES[th]||THEMES.house;
 switch(ch){
 case '.':grass(g,v);break;
 case ',':R(g,0,0,16,16,'#6c9282');for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x=i*4+(j%2)*2,y=j*4+1;R(g,x,y+1,1,2,'#4e7264');R(g,x+2,y+1,1,2,'#4e7264');R(g,x+1,y,1,3,'#3e6054');R(g,x+1,y,1,1,'#dceaf0');}break;
 case 'T':{grass(g,v);R(g,7,13,2,3,'#4e4038');const s=fr?0.5:0;ptri(g,[8+s,0,14+s,7,2+s,7],'#2c5250');ptri(g,[8+s*0.6,3,15+s*0.6,12,1+s*0.6,12],'#244646');ptri(g,[8,6,16,15,0,15],'#1c3a3c');
   ptri(g,[8+s,0,11+s,4,5+s,4],'#eef4f8');ptri(g,[3+s*0.6,11,6+s*0.6,9,7+s*0.6,12],'#d8e6ee');ptri(g,[10+s,7,13+s,10,9+s,10],'#d8e6ee');R(g,7+s,2,1,1,'#ffffff');break;}
 case '~':R(g,0,0,16,16,'#3a6890');{const o=fr?3:0;R(g,(1+o)%16,4,5,1,'#6c98bc');R(g,(9+o)%16,4,4,1,'#6c98bc');R(g,(5+o)%16,11,6,1,'#6c98bc');R(g,(0+o)%16,8,2,1,'#2c5478');if(v===0){R(g,10,9,4,2,'#d4e6f2');R(g,10,9,4,1,'#ffffff');}}break;
 case '=':R(g,0,0,16,16,'#c2c6c8');seedSpeck(g,'#a6acb2',8,v+3);seedSpeck(g,'#e2e8ec',6,v+9);break;
 case 'F':grass(g,v);for(const [x,y,c2] of [[3,3,'#a8d8f4'],[10,5,'#ffffff'],[5,11,'#c4b4ec'],[12,12,'#a8d8f4']]){R(g,x,y,3,3,c2);R(g,x+1,y+1,1,1,'#5a8ab0');}break;
 case 'f':grass(g,v);R(g,0,6,16,2,'#8a7a70');R(g,0,10,16,2,'#8a7a70');R(g,2,4,2,10,'#6a5a52');R(g,12,4,2,10,'#6a5a52');R(g,2,3,2,1,'#eef4f8');R(g,12,3,2,1,'#eef4f8');R(g,0,6,16,1,'#e0e8ee');break;
 case 'R':case 'Y':case 'Q':{const base=ch==='R'?'#8a4e50':ch==='Y'?'#b08a48':'#3c8088';R(g,0,0,16,16,base);for(let y=0;y<16;y+=4){R(g,0,y+3,16,1,shade(base,-0.3));for(let x=(y/4)%2*4;x<16;x+=8)R(g,x,y,1,3,shade(base,-0.2));}
   R(g,0,0,16,2,'#eef4f8');seedSpeck(g,'#e6eef4',3,v+5);
   if(ch==='Q'&&v===0){R(g,6,4,4,8,'#fff');R(g,4,6,8,4,'#fff');}if(ch==='Y'&&v===0){R(g,5,5,6,6,'#f4e8b8');R(g,7,3,2,10,'#f4e8b8');}break;}
 case 'W':R(g,0,0,16,16,'#dde2e8');R(g,0,13,16,3,'#b2bac4');if(v===0){R(g,3,3,10,7,'#4a5e7a');R(g,4,4,8,5,'#ffd890');R(g,4,4,3,2,'#fff0c8');R(g,7,4,1,5,'#4a5e7a');}break;
 case 'D':R(g,0,0,16,16,'#dde2e8');R(g,2,1,12,15,'#3e3030');R(g,3,2,10,14,'#6a4c3c');R(g,3,8,10,1,'#4e3830');R(g,10,9,2,2,'#e0c060');break;
 case 's':grass(g,v);R(g,7,9,2,6,'#5a4a40');R(g,2,2,12,8,'#4e4038');R(g,3,3,10,6,'#a89078');R(g,4,5,8,1,'#6e5a4c');R(g,4,7,6,1,'#6e5a4c');R(g,2,2,12,1,'#eef4f8');break;
 case '#':R(g,0,0,16,16,'#848c98');R(g,0,0,16,3,'#e8eef4');R(g,0,3,16,1,'#b0b8c2');R(g,0,12,16,4,'#626a76');R(g,4,5,1,6,'#626a76');R(g,11,4,1,7,'#626a76');R(g,5,9,6,1,'#626a76');break;
 case 'K':R(g,0,0,16,16,'#848c98');R(g,0,0,16,3,'#e8eef4');pell(g,8,10,6,8,'#0c1018');R(g,2,10,12,6,'#0c1018');R(g,3,4,1,2,'#a8d8f0');R(g,12,4,1,2,'#a8d8f0');break;
 case '^':R(g,0,0,16,16,'#6e7682');seedSpeck(g,'#5e6672',10,v+2);seedSpeck(g,'#868e9a',5,v+5);if(v===0){R(g,3,11,1,1,'#a8d8f0');}break;
 case '%':R(g,0,0,16,16,'#38404c');R(g,1,1,6,6,'#4a5462');R(g,9,3,6,5,'#4a5462');R(g,3,9,7,6,'#4a5462');R(g,1,1,6,1,'#5c6878');R(g,9,3,6,1,'#5c6878');R(g,0,15,16,1,'#262c36');
   if(v===0){ptri(g,[11,10,12,4,14,10],'#9fd4f0');ptri(g,[12,10,13,6,15,10],'#d8f0ff');}break;
 case 'x':floorT(g,th);break;
 case 'X':R(g,0,0,16,16,t.wall);R(g,0,12,16,4,t.wl2);R(g,0,0,16,1,shade(t.wall,0.2));if(th==='gym2'){for(let i=0;i<16;i+=4)R(g,i,12,2,4,'#1a202a');}if(th==='lab'&&v===0){R(g,4,3,8,6,'#344460');R(g,5,4,6,4,'#78d8f4');}break;
 case 'c':R(g,0,0,16,16,'#8a7468');R(g,0,0,16,5,'#b8a090');R(g,0,5,16,1,'#5e4c44');R(g,0,15,16,1,'#4e3e38');break;
 case 'M':floorT(g,th);R(g,1,0,14,15,'#3e4a5a');R(g,2,1,12,6,'#141c28');R(g,3,2,10,4,fr?'#60e0d0':'#40c0c0');R(g,3,9,2,2,'#f06060');R(g,7,9,2,2,'#f0d060');R(g,11,9,2,2,'#60a8f0');R(g,1,14,14,1,'#222a36');break;
 case 't':floorT(g,th);R(g,0,2,16,10,'#8a6a54');R(g,0,2,16,2,'#a88a70');R(g,1,12,2,3,'#5e4838');R(g,13,12,2,3,'#5e4838');break;
 case 'h':floorT(g,th);R(g,1,0,14,16,'#5e4838');R(g,2,1,12,4,'#f4f6fa');R(g,2,5,12,10,'#5a78a8');R(g,2,5,12,1,'#7a98c8');break;
 case 'v':floorT(g,th);R(g,4,10,8,6,'#8a6a5a');R(g,4,10,8,1,'#a88a78');pell(g,8,6,5,5,'#3e7a6a');pell(g,7,5,2,2,'#6aa898');break;
 case 'e':floorT(g,th);R(g,2,4,12,10,'#4a5a8a');R(g,3,5,10,8,'#6a7ab0');break;
 case 'l':grass(g,v);R(g,7,4,2,12,'#363e4a');R(g,5,1,6,4,'#2a323e');R(g,6,2,4,2,'#ffd890');R(g,5,0,6,1,'#eef4f8');break;
 case 'P':floorT(g,th);R(g,2,2,12,12,'#6a5a3a');R(g,3,3,10,10,'#c0a050');R(g,5,5,6,6,'#d8bc70');break;
 case 'm':grass(g,v);R(g,3,2,10,14,'#3e4a5a');R(g,4,3,8,6,'#60c0ff');R(g,5,4,3,2,'#c0f0ff');R(g,5,11,6,2,'#262e3a');R(g,3,1,10,1,'#eef4f8');break;
 case 'b':R(g,0,0,16,16,'#3a6890');R(g,0,1,16,14,'#7e6a5a');for(let x=0;x<16;x+=4)R(g,x,1,1,14,'#5e4c40');R(g,0,1,16,1,'#e6eef4');R(g,0,14,16,1,'#4e3e34');break;
 case 'z':R(g,0,0,16,16,'#7c8490');R(g,0,0,16,3,'#e8eef4');R(g,0,12,16,4,'#5a626e');ptri(g,[6,3,9,8,5,10],'#1a1e26');ptri(g,[9,8,12,6,11,11],'#1a1e26');R(g,7,7,2,2,fr?'#ff9a5a':'#c06030');break;
 case 'i':R(g,0,0,16,16,'#9cc8e0');R(g,1,1,14,14,'#b8dcf0');R(g,3,3,6,1,'#ffffff');R(g,9,10,4,1,'#ffffff');R(g,6,7,3,3,fr?'#ffe080':'#e0b040');R(g,0,15,16,1,'#6a98b8');break;
 case 'n':grass(g,v);pell(g,8,10,8,6,'#e6eef4');pell(g,6,8,5,4,'#f6faff');pell(g,11,11,4,3,'#d0dce6');R(g,2,14,12,2,'#b8c8d4');break;
 case 'p':floorT(g,th);R(g,2,8,12,8,'#3a4250');R(g,1,7,14,2,'#5a6676');R(g,3,10,10,1,'#60c0ff');break;
 case 'a':floorT(g,th);R(g,1,1,14,14,'#3a4250');R(g,2,2,12,6,'#22303e');R(g,3,3,10,4,fr?'#ff8040':'#e06030');R(g,3,10,10,2,'#5a6676');R(g,5,12,2,3,'#202830');R(g,9,12,2,3,'#202830');break;
 case 'o':floorT(g,th);R(g,1,3,14,12,'#4a3a34');R(g,2,4,12,5,'#2a1e1a');R(g,3,5,10,3,fr?'#ffb050':'#ff7a30');R(g,4,11,8,3,'#6a5a50');R(g,0,2,16,2,'#6a5a50');break;
 case 'E':R(g,0,0,16,16,'#3a4250');pell(g,8,8,7,7,'#20283a');pell(g,8,8,5,5,fr?'#60ffd0':'#40c0a0');pell(g,8,8,2,2,'#e0fff8');break;
 case 'O':R(g,0,0,16,16,'#3a4250');pell(g,8,8,7,7,'#20283a');pell(g,8,8,5,5,fr?'#ffd060':'#e0a040');pell(g,8,8,2,2,'#fff8e0');break;
 case 'U':R(g,0,0,16,16,'#6a4a3a');for(let y=0;y<16;y+=4){R(g,0,y+3,16,1,'#4a3228');}for(let x=2;x<16;x+=5)R(g,x,0,1,16,'#7e5a46');R(g,0,0,16,2,'#e6eef4');seedSpeck(g,'#a0603a',6,v+3);break;
 case '6':case '4':case '8':case '2':{floorT(g,th);R(g,0,2,16,12,'#2a2a30');R(g,0,3,16,10,'#3e3e46');const o2=fr?4:0;for(let k=-1;k<3;k++){const p=k*6+o2;if(ch==='6')ptri(g,[p+2,5,p+6,8,p+2,11],'#e0b040');if(ch==='4')ptri(g,[14-p,5,10-p,8,14-p,11],'#e0b040');}
   if(ch==='8'||ch==='2'){R(g,2,0,12,16,'#2a2a30');R(g,3,0,10,16,'#3e3e46');for(let k=-1;k<3;k++){const p=k*6+o2;if(ch==='2')ptri(g,[5,p+2,8,p+6,11,p+2],'#e0b040');else ptri(g,[5,14-p,8,10-p,11,14-p],'#e0b040');}}break;}
 case 'L':floorT(g,th);R(g,5,9,6,6,'#3a3a42');R(g,6,10,4,4,'#5a5a64');R(g,7,2,2,9,'#8a8a96');R(g,6,1,4,3,fr?'#ff5040':'#40d060');break;
 case 'V':if(th==='out'||th==='outw')R(g,0,0,16,16,'#7a7468');else floorT(g,th);R(g,2,2,12,12,'#2a2624');R(g,3,3,10,10,'#14100e');for(let i=4;i<12;i+=3)R(g,3,i,10,1,'#4a423e');break;
 case 'k':floorT(g,th);R(g,0,0,16,16,'#4a5a8a');R(g,1,1,14,14,'#5a6aa0');break;

 case 'j':grass(g,v);{const P=[[2,3,5,3,'#6a727e'],[9,2,4,2,'#8a5a40'],[11,9,4,3,'#5a626e'],[3,10,5,2,'#7a4a34'],[7,6,3,2,'#9aa2ae']];for(const [x,y,w,h,c] of P){R(g,x,y+1,w,h,'#4a5a58');R(g,x,y,w,h,c);R(g,x,y,w,1,shade(c,0.3));}
   R(g,6,12,1,3,'#3a424e');R(g,13,5,1,2,'#3a424e');if(fr)R(g,(v*5+4)%14+1,7,1,1,'#ffd860');}break;
 case 'q':grass(g,v);{const C=[[4,12,3,8,'#58c8e8'],[10,13,3,10,'#9a7ae8'],[13,11,2,6,'#58c8e8'],[7,14,2,5,'#c8f0ff']];for(const [x,b,w,h,c] of C){ptri(g,[x-w,b,x,b-h,x+w,b],shade(c,-0.35));ptri(g,[x-w+1,b,x,b-h+1,x,b],c);}
   if(fr){R(g,4,5,1,1,'#ffffff');R(g,10,4,1,1,'#ffffff');}else R(g,13,6,1,1,'#ffffff');}break;
 case 'y':R(g,0,0,16,16,'#6e7e8c');seedSpeck(g,'#5e6e7c',10,v+3);seedSpeck(g,'#9aa8b8',5,v+5);
   {const L=fr?[[1,4,6,1],[6,4,1,5],[6,9,7,1],[12,2,1,7]]:[[2,12,5,1],[7,7,1,5],[7,7,6,1],[3,2,1,5]];for(const [x,y,w,h] of L)R(g,x,y,w,h,'#8a7cff');R(g,fr?12:3,fr?2:2,1,1,'#e8e0ff');}break;
 case 'w':grass(g,v);R(g,3,8,1,6,'#5e786e');R(g,11,6,1,7,'#5e786e');R(g,7,10,1,5,'#6a8478');g.globalAlpha=0.55;pell(g,5+(fr?1:0),6,6,3,'#f2f6fa');pell(g,11-(fr?1:0),11,5,3,'#e6eef4');g.globalAlpha=1;break;
 case 'd':grass(g,v);g.globalAlpha=0.9;pell(g,4+(v%2)*2,6,7,4,'#f2f7fb');pell(g,12,12,6,4,'#eef4f8');g.globalAlpha=1;R(g,1,9,7,1,'#c4d2dc');R(g,8,15,7,1,'#c4d2dc');R(g,3,4,3,1,'#ffffff');R(g,10,9,3,1,'#ffffff');break;
 case '-':R(g,0,0,16,16,'#a8cce0');R(g,0,0,16,1,'#c8e4f2');R(g,2,3,7,1,'#e8f6ff');R(g,8,10,6,1,'#e8f6ff');R(g,3,13,1,1,'#ffffff');R(g,11,5,3,1,'#88b4cc');R(g,13,6,1,3,'#88b4cc');break;
 case 'G':R(g,0,0,16,16,'#5e5a62');R(g,0,6,16,1,'#4a464e');R(g,0,11,16,1,'#4a464e');R(g,3,6,1,5,'#4a464e');R(g,11,11,1,5,'#4a464e');R(g,9,1,1,5,'#4a464e');R(g,0,0,16,3,'#e8eef4');R(g,0,3,16,1,'#b8c2cc');R(g,(v*3)%12,3,3,1,'#e8eef4');R(g,1,15,14,1,'#3a363e');break;
 case 'H':R(g,0,0,16,16,'#8a8690');for(let y=0;y<16;y+=4){R(g,0,y,16,1,'#b4b0ba');R(g,0,y+3,16,1,'#5e5a64');}R(g,0,0,1,16,'#5e5a62');R(g,15,0,1,16,'#5e5a62');seedSpeck(g,'#eef4f8',3,v+2);break;
 case 'C':R(g,0,0,16,16,'#0c1220');R(g,0,0,16,2,'#1e2a3e');seedSpeck(g,'#18223a',6,v+4);if(v===1)R(g,5,8,1,1,'#3a5a8a');break;
 case 'B':grass(g,v);R(g,2,12,12,3,'#9a927e');for(const x of [3,7,11]){R(g,x,2,2,11,'#d8d0c0');R(g,x,2,1,11,'#f2ece2');R(g,x+1,12,1,1,'#8a8272');}R(g,3,1,10,2,'#c8c0b0');R(g,3,1,10,1,'#ece6da');break;
 case 'A':R(g,0,0,16,16,'#0c1220');R(g,0,4,16,8,'#8a8272');R(g,0,5,16,6,'#d4ccbc');R(g,0,5,16,1,'#f2ece2');for(let x=1;x<16;x+=5){R(g,x,3,3,10,'#c8c0b0');R(g,x,3,3,1,'#f2ece2');R(g,x+1,0,1,4,'#b8b0a0');R(g,x+1,12,1,4,'#b8b0a0');}break;
 case 'N':R(g,0,0,16,16,'#2a3240');R(g,0,0,16,1,'#4a5668');R(g,0,7,16,1,'#1a2028');R(g,7,0,1,16,'#1a2028');for(const [x,y] of [[2,2],[12,2],[2,11],[12,11]])R(g,x,y,1,1,'#6a7688');R(g,0,8,16,1,fr?'#2a8a9a':'#1e6a78');R(g,0,0,16,2,'#dfe8f0');break;
 case 'J':R(g,0,0,16,16,'#2a3240');pell(g,8,8,7,7,'#141a24');pell(g,8,8,5,5,fr?'#40e0f0':'#2aa8c0');pell(g,8,8,2,2,'#d8ffff');R(g,0,0,16,2,'#dfe8f0');break;
 case 'Z':grass(g,v);ptri(g,[1,15,7,3,15,15],'#4e5662');ptri(g,[4,15,9,6,14,15],'#6a5244');R(g,5,9,4,2,'#8a929e');R(g,9,11,3,3,'#3a4250');R(g,7,5,1,4,'#2a323e');R(g,1,15,14,1,'#3a423e');break;
 case '0':grass(g,v);R(g,2,0,12,16,'#2e3644');R(g,2,0,2,16,'#5a6676');R(g,12,0,2,16,'#1a202a');for(let y=0;y<16;y+=8){ptri(g,[4,y,12,y+8,11,y+8],'#4a5668');ptri(g,[12,y,4,y+8,5,y+8],'#4a5668');R(g,2,y,12,1,'#6a7688');}R(g,7,7,2,2,fr?'#c03838':'#7a2a2a');break;
 case '7':floorT(g,th);R(g,0,3,16,9,'#6a5440');R(g,0,3,16,2,'#8a7058');R(g,1,12,2,4,'#4a3a2c');R(g,13,12,2,4,'#4a3a2c');R(g,2,1,4,3,'#8a929e');R(g,9,2,5,2,'#c0a050');R(g,7,1,1,3,'#5a6676');R(g,11,6,3,2,'#40c8e0');break;
 case '9':floorT(g,th);R(g,1,0,14,15,'#5a4838');for(const y of [4,9,14])R(g,1,y,14,1,'#3a2c22');R(g,2,1,3,3,'#8a929e');R(g,6,2,2,2,'#c06040');R(g,10,1,4,3,'#58c8e8');R(g,3,6,4,3,'#c0a050');R(g,9,6,2,3,'#6a7688');R(g,4,11,7,3,'#7a8a6a');break;
 case '*':floorT(g,th);R(g,1,1,14,14,'#5a4a46');R(g,2,2,12,4,'#7a6a64');R(g,3,7,10,8,'#1a1210');R(g,4,10,8,5,fr?'#ff9a40':'#ffb850');R(g,6,9,4,3,'#ffe090');break;
 case '@':floorT(g,th);R(g,7,9,2,6,'#3a4250');R(g,4,14,8,1,'#3a4250');ptri(g,[3,3,13,8,12,10],'#8a929e');ptri(g,[3,3,12,10,2,5],'#5a6676');R(g,12,7,2,3,'#c0a050');break;
 case '&':floorT(g,th);R(g,1,6,8,9,'#7a5a3c');R(g,1,6,8,1,'#a07a54');R(g,2,9,6,1,'#5a3e28');R(g,7,1,8,8,'#8a6a48');R(g,7,1,8,1,'#b08a60');R(g,10,4,3,1,'#5a3e28');break;
 case '5':floorT(g,th);R(g,2,8,12,7,'#3a4250');R(g,1,7,14,2,'#5a6676');R(g,3,10,10,3,fr?'#40e0a0':'#30b080');R(g,4,2,2,6,'#5a6676');R(g,10,2,2,6,'#5a6676');R(g,4,1,8,2,'#6a7688');R(g,7,3,2,2,fr?'#a0ffd0':'#60e0a0');break;
 default:R(g,0,0,16,16,'#ff00ff');}
 g.setTransform(1,0,0,1,0,0);tileDetail(g,ch,th,v,fr);
 TCACHE[key]=c;return c;}

function hrand(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function dots(g,r,n,col,x0=0,y0=0,w=32,h=32){g.fillStyle=col;for(let i=0;i<n;i++)g.fillRect(x0+Math.floor(r()*w),y0+Math.floor(r()*h),1,1);}
function tileDetail(g,ch,th,v,fr){let hs=0;for(const k of ch+th)hs=hs*31+k.charCodeAt(0);const r=hrand(hs*7+v*131+fr*17+3);
  const grassy='.TFfslm'.includes(ch);
  if(grassy){dots(g,r,26,'rgba(60,96,84,.55)');dots(g,r,18,'rgba(210,232,226,.55)');dots(g,r,6,'#ffffff');}
  if(ch===','){for(let i=0;i<10;i++){const x=Math.floor(r()*32),y=Math.floor(r()*30);g.fillStyle='rgba(230,244,250,.8)';g.fillRect(x,y,1,1);g.fillStyle='rgba(30,60,52,.6)';g.fillRect(x,y+1,1,2);}}
  if(ch==='T'){g.fillStyle='rgba(10,30,32,.5)';for(let i=0;i<14;i++){const x=6+Math.floor(r()*20),y=6+Math.floor(r()*22);g.fillRect(x,y,2,1);}dots(g,r,8,'rgba(255,255,255,.8)',4,0,24,26);}
  if(ch==='='){for(let i=0;i<8;i++){const x=Math.floor(r()*30),y=Math.floor(r()*30);g.fillStyle='rgba(120,128,136,.7)';g.fillRect(x,y,2,1);g.fillStyle='rgba(240,244,248,.8)';g.fillRect(x,y-1,1,1);}dots(g,r,10,'rgba(255,255,255,.6)');}
  if(ch==='~'){g.fillStyle='rgba(200,230,250,.55)';for(let i=0;i<4;i++){const x=Math.floor(r()*26),y=Math.floor(r()*30);g.fillRect((x+fr*5)%28,y,4,1);}}
  if(ch==='#'||ch==='K'){g.fillStyle='rgba(40,46,56,.5)';for(let i=0;i<5;i++){const x=Math.floor(r()*30),y=8+Math.floor(r()*20);g.fillRect(x,y,1,3);g.fillRect(x,y+3,2,1);}dots(g,r,8,'rgba(230,238,246,.7)',0,0,32,10);}
  if(ch==='^'){dots(g,r,24,'rgba(40,46,56,.5)');dots(g,r,10,'rgba(170,180,194,.6)');if(r()<0.3)dots(g,r,2,'#bfe6ff');}
  if(ch==='%'){dots(g,r,14,'rgba(150,200,230,.5)');g.fillStyle='rgba(20,24,30,.5)';for(let i=0;i<4;i++)g.fillRect(Math.floor(r()*30),Math.floor(r()*30),3,1);}
  if('RYQ'.includes(ch)){dots(g,r,10,'rgba(255,255,255,.35)',0,6,32,26);dots(g,r,8,'rgba(0,0,0,.25)',0,6,32,26);}
  if(ch==='W'||ch==='D'){dots(g,r,10,'rgba(0,0,0,.08)');}
  if(ch==='x'||ch==='X'){dots(g,r,14,'rgba(0,0,0,.08)');dots(g,r,8,'rgba(255,255,255,.12)');}}
// ---------- weather ----------
const SNOW=Array.from({length:220},(_,i)=>({x:Math.random()*480,y:Math.random()*320,s:0.4+Math.random()*0.9,z:Math.random()<0.3?2:1,w:Math.random()*6.28}));
function drawSnow(dx,dy,amt=0.32,wind=0){ctx.fillStyle='rgba(240,246,252,.85)';const n=Math.floor(SNOW.length*Math.min(1,amt));
  for(let i=0;i<n;i++){const p=SNOW[i];const x=((p.x-dx*0.6*p.z+Math.sin(TICK/50+p.w)*8+TICK*wind*p.s)%480+480)%480,y=((p.y+TICK*p.s*(0.6+wind*0.3)-dy*0.6*p.z)%320+320)%320;ctx.fillRect(x,y,p.z*0.75,p.z*0.75);}}
function coldGrade(a=0.1){ctx.fillStyle='rgba(90,130,190,'+a+')';ctx.fillRect(0,0,W,H);}
