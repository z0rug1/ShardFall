// ---------- bot sprites (robots) ----------
const BOTCACHE={};
function botSprite(id,silhouette){const key=id+(silhouette?'_s':'');if(BOTCACHE[key])return BOTCACHE[key];
  const d=BOTS[id];const c=mkCanvas(40,40);const g=c.getContext('2d');
  const s=d.stage>=1?1.12:0.92;const ox=20-16*s,oy=d.stage>=1?40-34*s:40-33*s;
  const X=x=>ox+x*s,Y=y=>oy+y*s,S=v=>v*s;
  const shardType=d.shard;const sc=shardType?TCOL[shardType]:null;
  let paint=d.col;if(shardType)paint=mix(paint,TCOL[shardType],0.35);
  const metal=mix(d.col,'#8c9aae',0.62),md=shade(metal,-0.38),ml=shade(metal,0.38),jt='#363e4c',eye=TCOL[d.types[0]],vis='#0e141e';
  const E=(cx,cy,rx,ry,col)=>pell(g,X(cx),Y(cy),S(rx),S(ry),col);
  const B=(x,y,w,h,col)=>R(g,Math.round(X(x)),Math.round(Y(y)),Math.max(1,Math.round(S(w))),Math.max(1,Math.round(S(h))),col);
  const Tr=(pts,col)=>ptri(g,pts.map((v,i)=>i%2?Y(v):X(v)),col);
  const P=(x,y,w,h,col=metal)=>{B(x,y,w,h,col);B(x,y,w,1,shade(col,0.35));B(x,y+h-1,w,1,shade(col,-0.35));B(x,y,1,h,shade(col,0.15));};
  const riv=(x,y)=>B(x,y,1,1,'#e6eef6');
  const J=(x,y,r=1.6)=>{E(x,y,r,r,jt);B(x-0.5,y-0.5,1,1,'#7a8698');};
  const glow=(x,y,w,h)=>{B(x,y,w,h,eye);B(x,y,Math.max(1,w/2),1,'#ffffff');};
  const core=(x,y)=>{E(x,y,3.2,3.2,'#1a2230');Tr([x,y-2.2,x+2.2,y,x,y+2.2,x-2.2,y],TCOL[d.types[0]]);B(x-0.6,y-1,1,1,'#ffffff');
    if(d.stage>=1&&sc){E(x+6,y,2.6,2.6,'#1a2230');Tr([x+6,y-1.8,x+7.8,y,x+6,y+1.8,x+4.2,y],sc);}};
  const addon=(A)=>{if(!shardType)return;const a=sc,ad=shade(sc,-0.35);
    if(shardType==='Volt'){B(A.x-2,A.y-7,1,7,jt);B(A.x+7,A.y-7,1,7,jt);Tr([A.x-4,A.y-6,A.x-1,A.y-11,A.x-2,A.y-7,A.x+1,A.y-7,A.x-2,A.y-2],a);Tr([A.x+5,A.y-6,A.x+8,A.y-11,A.x+7,A.y-7,A.x+10,A.y-7,A.x+7,A.y-2],a);}
    if(shardType==='Gale'){P(A.wx-7,A.wy,7,2,shade(a,-0.1));P(A.wx-9,A.wy+3,8,2,a);P(A.wx+A.ww,A.wy,7,2,shade(a,-0.1));P(A.wx+A.ww+1,A.wy+3,8,2,a);}
    if(shardType==='Iron'){P(A.ax,A.ay,A.aw,3,'#c4ccd8');for(let i=1;i<A.aw;i+=4)riv(A.ax+i,A.ay+1);}
    if(shardType==='Stone'){for(let i=0;i<3;i++)Tr([A.x-4+i*5,A.y,A.x-2+i*5,A.y-6,A.x+i*5,A.y],i%2?ad:a);B(A.x-4,A.y,14,1,jt);}
    if(shardType==='Flame'){B(A.x-1,A.y-3,6,3,jt);Tr([A.x-2,A.y-3,A.x+1,A.y-10,A.x+3,A.y-3],a);Tr([A.x+1,A.y-3,A.x+4,A.y-8,A.x+6,A.y-3],'#ffd040');}
    if(shardType==='Tide'){Tr([A.x-2,A.y,A.x+2,A.y-7,A.x+5,A.y],a);Tr([A.x+5,A.y,A.x+8,A.y-5,A.x+10,A.y],ad);B(A.x-2,A.y,12,1,jt);}
    if(shardType==='Frost'){Tr([A.x-3,A.y,A.x-2,A.y-8,A.x,A.y],a);Tr([A.x+1,A.y,A.x+3,A.y-10,A.x+5,A.y],'#ffffff');Tr([A.x+6,A.y,A.x+7,A.y-6,A.x+9,A.y],a);}
    if(shardType==='Bloom'){E(A.x-2,A.y-3,4,2,a);E(A.x+6,A.y-4,4,2,shade(a,-0.2));B(A.x+2,A.y-5,1,5,jt);}
    if(shardType==='Shade'){Tr([A.x-3,A.y,A.x-6,A.y-8,A.x,A.y-1],a);Tr([A.x+6,A.y,A.x+9,A.y-8,A.x+3,A.y-1],a);}
    if(shardType==='Spirit'){E(A.x+2,A.y-6,6,2,a);E(A.x+2,A.y-6,4,1,'#00000000');g.clearRect(Math.round(X(A.x-1)),Math.round(Y(A.y-6)),Math.round(S(6)),1);}
    if(shardType==='Brawl'){P(A.fx1-3,A.fy-3,6,6,a);P(A.fx2-3,A.fy-3,6,6,a);riv(A.fx1-1,A.fy-1);riv(A.fx2-1,A.fy-1);}};
  const shp=d.shape;let A={x:16,y:4,wx:8,wy:18,ww:16,ax:8,ay:14,aw:16,fx1:4,fx2:28,fy:22};
  if(shp==='fox'){ // flare sentinel
    B(14,24,4,2,jt);Tr([12,26,20,26,16,32],eye);Tr([14,26,18,26,16,30],'#ffffff');
    Tr([24,12,34,3,27,18],paint);Tr([8,12,-2,3,5,18],paint);Tr([25,13,31,7,27,17],shade(paint,-0.3));Tr([7,13,1,7,5,17],shade(paint,-0.3));
    Tr([16,5,27,17,16,27,5,17],metal);Tr([5,17,27,17,16,27],md);Tr([16,8,23,15,9,15],ml);
    B(9,14,14,3,vis);glow(11,15,10,1);core(16,21);
    A={x:13,y:5,wx:4,wy:16,ww:24,ax:8,ay:10,aw:16,fx1:2,fx2:30,fy:22};}
  else if(shp==='newt'){ // hydro orb
    for(let i=0;i<3;i++){const x=11+i*5,len=6+(i%2)*3;B(x,22,1,len,jt);E(x+0.5,22+len,1.3,1.3,eye);}
    E(16,15,9.5,9.5,metal);E(16,20,7,4,md);E(12,10,4,3,ml);
    B(9,12,14,3,vis);glow(12,13,8,1);
    B(-1,16,34,2,paint);B(-1,16,34,1,shade(paint,0.35));B(-2,16,2,2,jt);B(32,16,2,2,jt);core(16,21);
    A={x:13,y:5,wx:6,wy:10,ww:20,ax:7,ay:7,aw:18,fx1:1,fx2:31,fy:12};}
  else if(shp==='tortoise'){ // tripod spire
    Tr([10,17,13,17,5,30],md);Tr([19,17,22,17,27,30],md);B(15,19,2,11,jt);B(3,29,5,2,jt);B(24,29,5,2,jt);B(13,29,6,2,jt);
    Tr([9,12,10,2,13,11],paint);Tr([14,10,16,0,18,10],mix(paint,eye,0.4));Tr([19,11,22,2,23,12],paint);
    E(16,13,10,6,metal);E(13,10,4,2,ml);B(6,14,20,4,md);B(6,15,20,1,paint);
    B(8,16,16,2,vis);glow(10,16,1,1);glow(15,16,2,1);glow(21,16,1,1);core(16,11);
    A={x:13,y:6,wx:6,wy:13,ww:20,ax:6,ay:12,aw:20,fx1:2,fx2:30,fy:22};}
  else if(shp==='bird'){ // halo drone
    B(7,4,18,1,eye);B(7,7,18,1,eye);B(5,5,2,2,eye);B(25,5,2,2,eye);B(7,4,6,1,'#ffffff');
    Tr([4,10,28,10,16,28],metal);Tr([4,10,28,10,16,14],ml);Tr([10,19,22,19,16,28],md);
    P(0,11,5,3,paint);P(27,11,5,3,paint);
    E(16,15,3.4,3.4,vis);E(16,15,2.2,2.2,eye);B(15,14,1,1,'#fff');core(16,21);
    A={x:13,y:2,wx:4,wy:11,ww:24,ax:7,ay:9,aw:18,fx1:2,fx2:30,fy:18};}
  else if(shp==='rabbit'){ // spire walker
    B(10,1,1,9,md);B(21,1,1,9,md);B(9,0,3,2,eye);B(20,0,3,2,eye);
    Tr([11,8,21,8,24,12,21,17,11,17,8,12],metal);Tr([11,8,21,8,24,12,8,12],ml);B(10,11,12,2,vis);glow(12,11,8,1);
    B(15,17,2,2,jt);Tr([9,19,23,19,20,26,12,26],metal);B(12,21,8,2,paint);
    P(5,19,2,9,md);P(25,19,2,9,md);J(6,19);J(26,19);B(4,28,4,2,eye);B(24,28,4,2,eye);
    B(13,26,2,5,jt);B(17,26,2,5,jt);B(11,30,4,1,md);B(17,30,4,1,md);core(16,23);
    A={x:13,y:0,wx:5,wy:19,ww:22,ax:9,ay:17,aw:14,fx1:5,fx2:27,fy:26};}
  else if(shp==='beetle'){ // hex crawler
    for(let i=0;i<3;i++){const y=15+i*4;B(1+i,y,8-i,1,md);B(1+i,y,1,8,jt);B(23,y,8-i,1,md);B(30-i,y,1,8,jt);}
    Tr([9,12,23,12,28,19,23,26,9,26,4,19],metal);Tr([9,12,23,12,28,19,4,19],ml);B(5,19,22,1,md);B(9,23,14,1,paint);
    B(15,6,1,6,jt);E(15.5,6,1.4,1.4,eye);
    B(9,14,14,3,vis);glow(10,15,1,1);glow(13,14,1,1);glow(18,14,1,1);glow(21,15,1,1);core(16,21);
    A={x:13,y:5,wx:3,wy:14,ww:26,ax:7,ay:10,aw:18,fx1:2,fx2:30,fy:26};}
  else if(shp==='spore'){ // bloom pod
    Tr([16,16,3,7,8,20],paint);Tr([16,16,29,7,24,20],paint);Tr([16,17,5,25,11,29],shade(paint,-0.3));Tr([16,17,27,25,21,29],shade(paint,-0.3));
    E(16,15,5.5,10,metal);E(14,10,2,3,ml);B(12,13,8,2,vis);glow(13,13,6,1);
    E(4,4,1.6,1.6,eye);E(28,3,1.6,1.6,eye);E(30,13,1.2,1.2,eye);E(2,14,1.2,1.2,eye);core(16,20);
    A={x:13,y:4,wx:3,wy:11,ww:26,ax:11,ay:6,aw:10,fx1:3,fx2:29,fy:27};}
  else if(shp==='golem'){ // monolith
    P(9,8,14,18);B(9,14,14,1,paint);B(9,20,14,1,paint);B(15,8,1,18,md);riv(10,9);riv(21,9);riv(10,24);riv(21,24);
    P(11,1,10,5,md);B(12,3,8,1,eye);
    P(2,11,5,7,md);P(25,11,5,7,md);B(3,13,3,1,eye);B(26,13,3,1,eye);
    B(10,27,12,2,jt);B(12,29,8,1,eye);core(16,17);
    A={x:13,y:0,wx:8,wy:9,ww:16,ax:9,ay:6,aw:14,fx1:4,fx2:28,fy:21};}
  else if(shp==='dog'){ // brawler hover-frame
    B(13,24,6,2,jt);Tr([12,26,20,26,16,32],eye);
    Tr([7,10,25,10,20,25,12,25],metal);Tr([7,10,25,10,22,15,10,15],ml);B(10,16,12,2,paint);
    P(12,3,8,7,md);Tr([14,3,16,-1,18,3],paint);B(13,5,6,2,vis);glow(14,5,4,1);
    P(1,8,5,7,md);P(26,8,5,7,md);P(0,15,7,7,metal);P(25,15,7,7,metal);B(1,17,5,1,eye);B(26,17,5,1,eye);core(16,20);
    A={x:13,y:1,wx:6,wy:10,ww:20,ax:8,ay:8,aw:16,fx1:3,fx2:29,fy:19};}
  else if(shp==='jelly'){ // saucer
    for(let i=0;i<4;i++){const x=8+i*5,len=6+(i%2)*4;B(x,19,1,len,jt);E(x+0.5,19+len,1.3,1.3,eye);}
    E(16,12,7,5.5,mix(eye,'#ffffff',0.5));E(14,10,2,1.5,'#ffffff');E(16,13,2.2,2.2,vis);B(16,12,1,1,eye);
    E(16,16.5,15,3.6,metal);B(1,17,30,1,md);B(3,15,26,1,ml);for(let x=4;x<29;x+=4)B(x,16,1,1,eye);core(16,19);
    A={x:13,y:5,wx:1,wy:15,ww:30,ax:5,ay:13,aw:22,fx1:2,fx2:30,fy:22};}
  else if(shp==='lantern'){ // obelisk
    Tr([4,10,6,5,8,10],paint);Tr([4,10,6,15,8,10],shade(paint,-0.35));Tr([24,10,26,5,28,10],paint);Tr([24,10,26,15,28,10],shade(paint,-0.35));
    Tr([3,22,5,19,7,22],paint);Tr([3,22,5,25,7,22],shade(paint,-0.35));Tr([25,22,27,19,29,22],paint);Tr([25,22,27,25,29,22],shade(paint,-0.35));
    Tr([16,0,23,8,16,31,9,8],md);Tr([16,3,21,9,16,27,11,9],metal);Tr([16,3,21,9,11,9],ml);
    E(16,12,2.6,3.2,vis);E(16,12,1.8,2.4,eye);B(16,11,1,1,'#fff');B(13,17,7,1,paint);core(16,21);
    A={x:13,y:0,wx:9,wy:12,ww:14,ax:11,ay:7,aw:10,fx1:3,fx2:29,fy:28};}
  if(d.stage>=1)addon(A);
  if(silhouette){g.globalCompositeOperation='source-in';R(g,0,0,40,40,'#3a4252');g.globalCompositeOperation='source-over';}
  crisp(c,silhouette?'#1a1e28':'#11151e');
  BOTCACHE[key]=c;return c;}

// ---------- tiles (cold palette) ----------
const TCACHE={};
function seedSpeck(g,col,n,seed){let s=seed*7919+13;for(let i=0;i<n;i++){s=(s*9301+49297)%233280;const x=s%16;s=(s*9301+49297)%233280;const y=s%16;R(g,x,y,1,1,col);}}
const THEMES={out:{floor:'#c4a888',wall:'#8a7060'},house:{floor:'#c8aa8a',fl2:'#b0927a',wall:'#7e6a62',wl2:'#5e4e4a'},lab:{floor:'#dfe4ee',fl2:'#c2c9d8',wall:'#a8b6cc',wl2:'#7a88a2'},
 repair:{floor:'#e6e2ec',fl2:'#cec6d6',wall:'#b896a8',wl2:'#8a6e80'},gym1:{floor:'#a8a6a6',fl2:'#8e8c8e',wall:'#5a5a62',wl2:'#3e3e46'},gym2:{floor:'#7e8898',fl2:'#687282',wall:'#323a4a',wl2:'#d8c040'},cave:{floor:'#6e7682',wall:'#3c4450'}};
function grass(g,v){R(g,0,0,16,16,'#8fb0a2');seedSpeck(g,'#7a9c8e',9,v+1);seedSpeck(g,'#b4cec4',4,v+7);seedSpeck(g,'#eef4f8',v===0?4:2,v+11);}
function snowCap(g,col){R(g,0,0,16,3,'#eef4f8');for(let x=0;x<16;x+=3)R(g,x,3,2,1,'#eef4f8');R(g,0,3,16,1,'rgba(0,0,0,0)');}
function floorT(g,th){const t=THEMES[th]||THEMES.house;R(g,0,0,16,16,t.floor);
  if(th==='house'){R(g,0,7,16,1,t.fl2);R(g,0,15,16,1,t.fl2);R(g,5,0,1,7,t.fl2);R(g,11,8,1,7,t.fl2);}
  else if(th==='gym2'){R(g,0,0,16,1,t.fl2);R(g,0,0,1,16,t.fl2);R(g,2,2,1,1,'#a8b2c4');R(g,13,2,1,1,'#a8b2c4');R(g,2,13,1,1,'#a8b2c4');R(g,13,13,1,1,'#a8b2c4');}
  else if(th==='gym1'){R(g,0,0,16,1,t.fl2);R(g,0,8,16,1,t.fl2);R(g,0,0,1,8,t.fl2);R(g,8,8,1,8,t.fl2);seedSpeck(g,'#bcbaba',4,3);}
  else {R(g,0,0,16,1,t.fl2);R(g,0,0,1,16,t.fl2);}}
function tileArt(ch,th,v,fr){const key=ch+th+v+fr;let c=TCACHE[key];if(c)return c;c=mkCanvas(16,16);const g=c.getContext('2d');
 const t=THEMES[th]||THEMES.house;
 switch(ch){
 case '.':grass(g,v);break;
 case ',':R(g,0,0,16,16,'#6c9282');for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x=i*4+(j%2)*2,y=j*4+1;R(g,x,y+1,1,2,'#4e7264');R(g,x+2,y+1,1,2,'#4e7264');R(g,x+1,y,1,3,'#3e6054');R(g,x+1,y,1,1,'#dceaf0');}break;
 case 'T':grass(g,v);R(g,7,13,2,3,'#4e4038');ptri(g,[8,0,14,7,2,7],'#2c5250');ptri(g,[8,3,15,12,1,12],'#244646');ptri(g,[8,6,16,15,0,15],'#1c3a3c');
   ptri(g,[8,0,11,4,5,4],'#eef4f8');ptri(g,[3,11,6,9,7,12],'#d8e6ee');ptri(g,[10,7,13,10,9,10],'#d8e6ee');R(g,7,2,1,1,'#ffffff');break;
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
 case 'k':floorT(g,th);R(g,0,0,16,16,'#4a5a8a');R(g,1,1,14,14,'#5a6aa0');break;
 default:R(g,0,0,16,16,'#ff00ff');}
 TCACHE[key]=c;return c;}

// ---------- weather ----------
const SNOW=Array.from({length:70},(_,i)=>({x:Math.random()*480,y:Math.random()*320,s:0.4+Math.random()*0.9,z:Math.random()<0.3?2:1,w:Math.random()*6.28}));
function drawSnow(dx,dy,amt=1){ctx.fillStyle='rgba(240,246,252,.85)';const n=Math.floor(SNOW.length*amt);
  for(let i=0;i<n;i++){const p=SNOW[i];const x=((p.x-dx*0.6*p.z+Math.sin(TICK/50+p.w)*8)%480+480)%480,y=((p.y+TICK*p.s*0.6-dy*0.6*p.z)%320+320)%320;ctx.fillRect(Math.round(x),Math.round(y),p.z,p.z);}}
function coldGrade(a=0.1){ctx.fillStyle='rgba(90,130,190,'+a+')';ctx.fillRect(0,0,W,H);}
