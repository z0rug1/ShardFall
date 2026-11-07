// ---------- hi-res human sprites (winter gear, 4x detail) ----------
const CHARCACHE={};const CQ=4;
// fr: 0 stand, 1 left foot forward, 2 right foot forward, 3 passing (slight bob)
function charSprite(lk,dir,fr){const L=typeof lk==='string'?LOOKS[lk]:lk;const key=(typeof lk==='string'?lk:JSON.stringify(lk))+dir+fr;let c=CHARCACHE[key];if(c)return c;
  const Q=CQ;c=mkCanvas(16*Q,18*Q);const g=c.getContext('2d');
  const X=v=>v*Q;const B=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(X(x)),Math.round(X(y)),Math.max(1,Math.round(X(w))),Math.max(1,Math.round(X(h))));};
  const E=(cx,cy,rx,ry,col)=>pell(g,X(cx),X(cy),X(rx),X(ry),col);
  const Tr=(pts,col)=>ptri(g,pts.map(v=>X(v)),col);
  const sk=L.skin,hr=L.hair,tp=L.top,bt=L.bot;const tpD=shade(tp,-0.28),tpL=shade(tp,0.22),btD=shade(bt,-0.3);
  const scarf=L.robe?null:(L.acc||shade(tp,0.35));const boot='#2a2630',bootL='#4a4450';
  const bob=(fr===1||fr===2)?0.4:0;const side=dir==='left'||dir==='right';const flip=dir==='left';
  const L1=fr===1?-0.9:fr===2?0.6:0,L2=fr===2?-0.9:fr===1?0.6:0; // leg lift
  const A1=fr===1?0.7:fr===2?-0.7:0; // arm swing
  g.save();if(flip){g.translate(16*Q,0);g.scale(-1,1);}
  // ---- legs / robe ----
  if(L.robe){Tr([4,8,12,8,13.2,17,2.8,17],tp);Tr([4,8,8,8,6,17,2.8,17],tpL);B(2.8,16.4,10.4,0.6,shade(tp,-0.35));
    if(fr===1)B(4,16.6,2.4,0.8,boot);if(fr===2)B(9.6,16.6,2.4,0.8,boot);}
  else if(side){B(6.6+L2*0.6,12.4,2.2,3.6+bob,btD);B(6.2+L2*0.6,15.6+bob,3.2,1.6,boot);
    B(7.2-L1*0.6,12.4,2.2,3.6+bob,bt);B(7-L1*0.6,15.6+bob,3.4,1.6,boot);B(7-L1*0.6,15.6+bob,3.4,0.4,bootL);}
  else{B(5.2,12.4,2.4,3.4+L1,bt);B(8.4,12.4,2.4,3.4+L2,bt);B(5,15.4+L1,2.8,1.8,boot);B(8.2,15.4+L2,2.8,1.8,boot);B(5,15.4+L1,2.8,0.4,bootL);B(8.2,15.4+L2,2.8,0.4,bootL);
    B(5.2,12.4,0.5,3.2,btD);}
  // ---- coat / body ----
  const by=bob*0.5;
  if(L.dress){Tr([4.2,7.6+by,11.8,7.6+by,13,14+by,3,14+by],tp);B(3,13.4+by,10,0.6,tpD);}
  else if(!L.robe){B(4,7.6+by,8,5.6,tp);B(4,7.6+by,1,5.6,tpL);B(11,7.6+by,1,5.6,tpD);B(3.8,12.4+by,8.4,1,tpD);if(!side){B(7.8,8.4+by,0.4,4.4,tpD);B(6.6,10+by,0.6,0.6,'#d8d8e0');B(6.6,11.4+by,0.6,0.6,'#d8d8e0');}}
  if(L.coat){B(4,7.6+by,8,6.4,tp);B(7.6,7.6+by,0.8,6.4,'#c8d4e0');B(4,13.4+by,8,0.6,'#c8d0d8');}
  // ---- arms ----
  if(side){B(7.4,8.2+by+A1*0.4,2,4.2,tpD);B(7.6,12.2+by+A1*0.4,1.8,1.2,'#3a3440');}
  else{B(2.8,8.2+by-A1*0.3,1.4,4.4,tpD);B(11.8,8.2+by+A1*0.3,1.4,4.4,tpD);B(2.8,12.4+by-A1*0.3,1.4,1,'#3a3440');B(11.8,12.4+by+A1*0.3,1.4,1,'#3a3440');}
  if(L.robe&&L.acc){B(7.4,8+by,1.2,8.6,L.acc);}
  // ---- scarf ----
  if(scarf){B(4.4,7+by,7.2,1.4,scarf);B(4.4,7.9+by,7.2,0.5,shade(scarf,-0.3));for(let i=0;i<3;i++)B(5+i*2.4,7.2+by,0.8,1,shade(scarf,0.3));
    if(dir==='down')B(9.4,8+by,1.4,2.8,scarf);if(side)B(4,8+by,1.4,3+Math.abs(A1)*0.5,scarf);if(dir==='up')B(5.2,8+by,1.4,2.4,scarf);}
  // ---- head ----
  const hy=by;E(8,4.4+hy,3.7,3.6,sk);
  if(dir==='up'){E(8,4+hy,3.9,3.7,hr);B(4.4,4+hy,7.2,2.6,hr);}
  else if(side){E(7.4,3.2+hy,3.9,2.6,hr);B(3.8,2.8+hy,3,4.4,hr);B(10.6,4.4+hy,0.6,0.8,shade(sk,-0.15));
    if(!L.mask){B(9.2,4.2+hy,0.9,1.2,'#1a1a24');B(9.5,4.3+hy,0.35,0.35,'#ffffff');B(9.6,6+hy,0.8,0.3,shade(sk,-0.3));B(8.4,5.4+hy,0.9,0.5,'rgba(240,120,120,.5)');}}
  else{E(8,3+hy,3.9,2.4,hr);B(4.2,2.6+hy,1,3,hr);B(10.8,2.6+hy,1,3,hr);B(6.6,1.4+hy,2.6,1,shade(hr,0.25));
    if(!L.mask){B(6,4.4+hy,0.9,1.3,'#1a1a24');B(9.1,4.4+hy,0.9,1.3,'#1a1a24');B(6.2,4.5+hy,0.35,0.35,'#ffffff');B(9.3,4.5+hy,0.35,0.35,'#ffffff');
      B(5.2,5.8+hy,1,0.5,'rgba(240,120,120,.55)');B(9.8,5.8+hy,1,0.5,'rgba(240,120,120,.55)');B(7.5,6.4+hy,1,0.3,shade(sk,-0.35));}}
  if(L.mask&&dir!=='up'){E(side?8.6:8,4.6+hy,side?2.4:3,3,'#eef0f6');E(side?8.6:8,5.6+hy,side?2:2.6,1.6,'#d8dae2');
    if(side){Tr([8.4,4+hy,10.6,4.6+hy,8.4,5+hy],'#0a0a12');}else{Tr([5.4,4+hy,7.6,4.8+hy,5.4,5.2+hy],'#0a0a12');Tr([10.6,4+hy,8.4,4.8+hy,10.6,5.2+hy],'#0a0a12');}
    B(side?8:6.4,7.2+hy,side?2:3.2,0.4,'#a8aab4');}
  if(L.robe){E(8,3.6+hy,4.6,4.4,shade(tp,-0.08));if(dir!=='up'){E(side?8.8:8,4.6+hy,side?2.6:3.2,3.2,L.mask?'#eef0f6':sk);}
    if(L.mask&&dir!=='up'){if(side){Tr([8.6,4+hy,10.8,4.6+hy,8.6,5.1+hy],'#0a0a12');}else{Tr([5.4,4+hy,7.6,4.8+hy,5.4,5.2+hy],'#0a0a12');Tr([10.6,4+hy,8.4,4.8+hy,10.6,5.2+hy],'#0a0a12');}}}
  // ---- hat / beanie ----
  const hat=L.hat||(L.robe?null:(L.beanie||null));
  if(hat){E(8,2.2+hy,4.2,2.2,hat);B(3.8,2.4+hy,8.4,1.2,shade(hat,-0.25));B(3.8,2.4+hy,8.4,0.4,shade(hat,0.25));if(L.pom)E(8,0.2+hy,1.1,1.1,L.pom);}
  g.restore();
  crisp(c,'#0e1018',2);
  CHARCACHE[key]=c;return c;}
