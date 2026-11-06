// ===================== BATTLE =====================
let BT=null;
const stageM=s=>s>=0?(2+s)/2:2/(2-s);
function cur(side){return side==='p'?G.party[BT.pi]:BT.ep[BT.ei];}
function bname(side){const b=cur(side);return (side==='e'?(BT.wild?'The feral ':'Foe '):'')+BOTS[b.id].name;}
function typeBadges(types,x,y,small){let cx=x;for(const t of types){ctx.font=(small?16:19)+'px '+FONT;const w=Math.max(small?44:58,ctx.measureText(t.toUpperCase()).width+12);ctx.fillStyle=TCOL[t];rr(cx,y,w,small?16:20,4);ctx.fill();ctx.fillStyle='rgba(0,0,0,.25)';rr(cx,y+(small?11:14),w,small?5:6,3);ctx.fill();txt(t.toUpperCase(),cx+w/2,y+(small?13:16),'#fff',small?16:19,'center','rgba(0,0,0,.5)');cx+=w+4;}}
function hpBar(x,y,w,cur_,max){const r=clamp(cur_/max,0,1);R(ctx,x,y,w,8,'#30343c');R(ctx,x+1,y+1,w-2,6,'#585c64');ctx.fillStyle=r>0.5?'#48d058':r>0.2?'#f0c030':'#e84040';ctx.fillRect(x+1,y+1,Math.round((w-2)*r),6);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x+1,y+1,Math.round((w-2)*r),2);}

function drawBattle(){const B=BT;const th=B.bg;
  const sky=th==='cave'?['#141a24','#2c3442']:th==='gym1'?['#3e4048','#6e7078']:th==='gym2'?['#161c2a','#2e3a52']:['#4e6680','#aebccc'];
  const gr=ctx.createLinearGradient(0,0,0,232);gr.addColorStop(0,sky[0]);gr.addColorStop(1,sky[1]);ctx.fillStyle=gr;ctx.fillRect(0,0,W,232);
  const ground=th==='cave'?'#4e5664':th==='gym1'?'#7e7c80':th==='gym2'?'#3e4858':'#c6d6e0';
  if(th!=='cave'&&th!=='gym1'&&th!=='gym2'){ctx.fillStyle='#8a9cb0';ctx.beginPath();ctx.moveTo(0,150);ctx.lineTo(70,110);ctx.lineTo(150,140);ctx.lineTo(240,90);ctx.lineTo(330,135);ctx.lineTo(420,105);ctx.lineTo(480,130);ctx.lineTo(480,232);ctx.lineTo(0,232);ctx.fill();ctx.fillStyle='#e8eef4';ctx.beginPath();ctx.moveTo(225,99);ctx.lineTo(240,90);ctx.lineTo(256,98);ctx.lineTo(246,102);ctx.lineTo(236,97);ctx.fill();ctx.fillStyle='#b4c4d2';ctx.fillRect(0,180,W,52);}
  ctx.fillStyle=shade(ground,0.15);ctx.beginPath();ctx.ellipse(360,124,100,22,0,0,7);ctx.fill();ctx.fillStyle=shade(ground,-0.1);ctx.beginPath();ctx.ellipse(360,128,90,16,0,0,7);ctx.fill();
  ctx.fillStyle=shade(ground,0.15);ctx.beginPath();ctx.ellipse(130,226,130,28,0,0,7);ctx.fill();ctx.fillStyle=shade(ground,-0.1);ctx.beginPath();ctx.ellipse(130,230,118,20,0,0,7);ctx.fill();
  if(th==='gym2'||th==='cave'){for(let i=0;i<6;i++){ctx.fillStyle=th==='gym2'?'rgba(255,220,60,.07)':'rgba(255,255,255,.03)';ctx.fillRect(i*90+((TICK/2)%90),0,30,232);}}
  const sl=B.slide;
  // enemy
  const e=cur('e');if(e){const a=B.anim;let ex=300+sl*-260,ey=12;
    if(B.trainerShow&&B.tr){const s=charSprite(B.tr.look,'down',0);ctx.drawImage(s,328+sl*-260,30,64,72);}
    else if(!a.eHide){let vis=true;if(a.hitE>0&&Math.floor(a.hitE/3)%2)vis=false;
      if(vis){const sp=botSprite(e.id);const f=a.eFaint||0;const sc=a.eIn!=null?a.eIn:1;
        ctx.save();ctx.globalAlpha=clamp(1-f,0,1);const sz=120*sc;ctx.drawImage(sp,ex+(120-sz)/2+(a.lungeE||0)*-12,ey+f*60+(120-sz),sz,sz*(1-f*0.5));ctx.restore();}}
    if(a.spike){const s=a.spike;const t=s.t;const sx=150+(360-150)*t,sy=180-(180-90)*t-Math.sin(t*Math.PI)*80;drawSpike(sx,sy,s.wob||0);}
    if(!B.trainerShow&&!a.eHide||a.spike){if(!B.hideInfo)drawInfo('e');}}
  const p=cur('p');if(p&&!B.pHide){const a=B.anim;let vis=!(a.hitP>0&&Math.floor(a.hitP/3)%2);const f=a.pFaint||0;
    if(vis){ctx.save();ctx.globalAlpha=1-f;ctx.translate(70+sl*260+(a.lungeP||0)*12+120,112+f*60);ctx.scale(-1,1);ctx.drawImage(botSprite(p.id),0,0,120,120*(1-f*0.5));ctx.restore();}
    if(!B.hideInfo)drawInfo('p');}
  if(th!=='gym1'&&th!=='gym2')drawSnow(0,0,th==='cave'?0.25:1);
  ctx.fillStyle='#161c28';ctx.fillRect(0,232,W,88);panel(4,232,472,84);
  if(B.flash>0){ctx.fillStyle=B.flashCol||'rgba(255,255,255,.8)';ctx.globalAlpha=B.flash/20;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
  if(B.odFx>0){const t=B.odFx;ctx.save();ctx.globalAlpha=Math.min(1,t/20)*0.6;ctx.fillStyle=B.odCol;for(let i=0;i<12;i++){const ang=i/12*Math.PI*2+TICK/10;ctx.beginPath();ctx.moveTo(W/2,110);ctx.lineTo(W/2+Math.cos(ang)*400,110+Math.sin(ang)*400);ctx.lineTo(W/2+Math.cos(ang+0.15)*400,110+Math.sin(ang+0.15)*400);ctx.fill();}ctx.restore();}
  if(B.intro>0){ctx.fillStyle='#000';const h=B.intro*8;ctx.fillRect(0,0,W,h);ctx.fillRect(0,H-h,W,h);}
}
function drawSpike(x,y,wob){ctx.save();ctx.translate(x,y);ctx.rotate(wob);R(ctx,-3,-14,6,22,'#506070');R(ctx,-2,-13,4,20,'#8aa0b8');ptri(ctx,[-5,8,5,8,0,18],'#40e0ff');R(ctx,-6,-16,12,4,'#ffd040');ctx.restore();}
function drawInfo(side){const B=BT;const b=cur(side);const st=stats(b);const d=BOTS[b.id];
  if(side==='e'){const x=16,y=14;panel(x,y,226,70);txt(d.name,x+14,y+28,'#303840',22);txt('Lv'+b.lv,x+210,y+28,'#303840',20,'right');
    typeBadges(d.types,x+14,y+34,1);if(b.st)statusTag(b.st.k,x+170,y+34);
    if(G.caught[b.id]&&BT.wild){ctx.fillStyle='#e04040';ctx.beginPath();ctx.arc(x+196,y+43,4,0,7);ctx.fill();}
    txt('HP',x+14,y+62,'#e08020',16);hpBar(x+34,y+54,176,B.disp.e,st.hp);
    odBar(x+34,y+64,176,B.od.e,B.odUsed.e);}
  else{const x=244,y=136;panel(x,y,226,92);txt(d.name,x+14,y+28,'#303840',22);txt('Lv'+b.lv,x+210,y+28,'#303840',20,'right');
    if(b.st)statusTag(b.st.k,x+150,y+12);
    txt('HP',x+14,y+46,'#e08020',16);hpBar(x+34,y+38,176,B.disp.p,st.hp);txt(Math.ceil(B.disp.p)+'/'+st.hp,x+210,y+64,'#303840',20,'right');
    const nx=xpFor(b.lv+1),px=xpFor(b.lv);R(ctx,x+34,y+70,176,4,'#30343c');R(ctx,x+35,y+71,Math.round(174*clamp((b.xp-px)/(nx-px),0,1)),2,'#40b0f0');
    odBar(x+34,y+78,176,B.od.p,B.odUsed.p);txt('OD',x+14,y+84,'#a040e0',14);}}
function odBar(x,y,w,v,used){R(ctx,x,y,w,5,'#30343c');const r=v/100;const full=v>=100&&!used;ctx.fillStyle=used?'#707080':full?(TICK%20<10?'#ff60ff':'#ffd040'):'#b060f0';ctx.fillRect(x+1,y+1,Math.round((w-2)*r),3);}
function statusTag(k,x,y){const s=STATUS[k];ctx.fillStyle=s.c;rr(x,y,40,16,3);ctx.fill();txt(s.n,x+20,y+13,'#fff',16,'center','rgba(0,0,0,.4)');}

async function bsay(t){await say(t,{auto:70});}
async function animWait(cond){while(!cond())await wait(1);}
async function syncHP(){const B=BT;B.tgt=true;await animWait(()=>Math.abs(B.disp.p-cur('p').hp)<0.5&&Math.abs(B.disp.e-cur('e').hp)<0.5);B.disp.p=cur('p').hp;B.disp.e=cur('e').hp;}
function battleTick(){const B=BT;if(!B)return;const a=B.anim;
  for(const s of ['p','e']){const b=cur(s);if(!b)continue;const mx=stats(b).hp;const sp=Math.max(0.5,mx/45);if(B.disp[s]>b.hp)B.disp[s]=Math.max(b.hp,B.disp[s]-sp);else if(B.disp[s]<b.hp)B.disp[s]=Math.min(b.hp,B.disp[s]+sp);}
  if(a.hitE>0)a.hitE--;if(a.hitP>0)a.hitP--;if(B.flash>0)B.flash--;if(B.odFx>0)B.odFx--;
  if(a.lungeE>0)a.lungeE=Math.max(0,a.lungeE-0.1);if(a.lungeP>0)a.lungeP=Math.max(0,a.lungeP-0.1);}

async function runBattle(o){
  const B={wild:o.wild||null,tr:o.trainer||null,ep:[],ei:0,pi:0,st:{p:{atk:0,def:0,spd:0},e:{atk:0,def:0,spd:0}},od:{p:0,e:0},odUsed:{p:false,e:false},
    part:new Set(),anim:{},runs:0,bg:curMap().theme,eItems:o.trainer&&o.trainer.items?1:0,disp:{p:0,e:0},slide:1,intro:20,flash:0,odFx:0,trainerShow:!!o.trainer,hideInfo:true};
  B.ep=B.wild?[B.wild]:B.tr.team.map(([id,lv])=>makeBot(id,lv));
  B.pi=G.party.findIndex(b=>b.hp>0);if(B.pi<0){await healAll();B.pi=0;}
  // transition
  const wasBusy=G.busy;G.busy=true;Snd.music(B.tr&&B.tr.warden?'boss':'battle',true);
  for(let i=0;i<3;i++){G.flashOW=8;await wait(10);}
  BT=B;B.disp.p=cur('p').hp;B.disp.e=cur('e').hp;
  while(B.intro>0){B.intro--;await wait(1);}
  while(B.slide>0){B.slide=Math.max(0,B.slide-0.05);await wait(1);}
  if(B.wild){seen(B.wild.id);B.hideInfo=false;await bsay('A feral '+BOTS[B.wild.id].name+' appeared!');}
  else{await bsay(B.tr.title+' '+B.tr.name+' wants to battle!');B.trainerShow=false;await deployE(true);}
  B.hideInfo=false;B.part.add(cur('p').uid);await bsay('Go, '+BOTS[cur('p').id].name+'!');
  let result=null;
  while(!result){result=await battleTurn();}
  // end
  if(result==='win'&&B.tr){Snd.jingle('victory',curMap().music);await bsay(B.tr.title+' '+B.tr.name+' was defeated!');
    G.money+=B.tr.money;await bsay(N()+' got '+B.tr.money+' Cr for winning!');}
  if(result==='lose'){await bsay(N()+' has no working bots left!');
    if(!(B.tr&&B.tr.noBlackout)){const lost=Math.floor(G.money/2);G.money-=lost;await bsay(N()+' dropped '+lost+' Cr and blacked out...');
      BT=null;G.fade=1;await healAll();loadMap(G.lastHeal.map,G.lastHeal.x,G.lastHeal.y,'down');await say('You were towed back to safety. Your bots have been repaired.');G.busy=false;return 'lose';}}
  for(const b of G.party){b.st=b.st&&['sleep','freeze','glitch'].includes(b.st.k)?null:b.st;}
  BT=null;G.fade=1;Snd.music(curMap().music,true);
  await processSockets();
  G.busy=wasBusy;return result;}

async function deployE(first){const B=BT;const e=cur('e');seen(e.id);B.st.e={atk:0,def:0,spd:0};B.anim.eIn=0;B.disp.e=e.hp;
  for(let i=0;i<=10;i++){B.anim.eIn=i/10;await wait(1);}B.anim.eIn=null;B.anim.eFaint=0;B.anim.eHide=false;
  await bsay(B.tr.name+' deployed '+BOTS[e.id].name+'!');}

async function playerMenu(){const B=BT;const p=cur('p');
  while(true){const r=await pushUI(battleMenuW(BOTS[p.id].name));
    if(r===0){if(p.moves.every(m=>m.pp<=0)){await bsay(BOTS[p.id].name+' has no PP left!');return{type:'move',mi:-1};}const m=await pushUI(moveMenuW(p));if(m===-1)continue;if(m==='od')return{type:'od'};return{type:'move',mi:m};}
    if(r===1){const it=await openBag(true);if(!it)continue;
      if(ITEMS[it].spike){if(!B.wild){await bsay('You can\'t reboot another trainer\'s bot!');continue;}return{type:'spike',item:it};}
      if(ITEMS[it].cat==='med'){const t=await openParty({mode:'item',item:it});if(t==null||t<0)continue;if(!canUse(it,G.party[t])){await bsay('It won\'t have any effect.');continue;}return{type:'item',item:it,target:t};}
      await bsay('That can\'t be used here.');continue;}
    if(r===2){const t=await openParty({mode:'switch'});if(t==null||t<0)continue;return{type:'switch',to:t};}
    if(r===3){if(B.tr){await bsay('There\'s no running from a trainer battle!');continue;}return{type:'run'};}}}
function battleMenuW(nm){return{i:0,update(){if(rep('left')||rep('right')){this.i^=1;Snd.sfx('blip');}if(rep('up')||rep('down')){this.i^=2;Snd.sfx('blip');}if(press('a')){Snd.sfx('ok');popUI(this,this.i);}},
  draw(){panel(4,232,472,84);txt('What will',22,264);txt(nm+' do?',22,290);panel(250,232,226,84,'#fff');
    ['FIGHT','BAG','BOTS','RUN'].forEach((s,i)=>{const x=280+(i%2)*100,y=266+Math.floor(i/2)*30;txt(s,x,y,'#303840',24);if(i===this.i)ptri(ctx,[x-16,y-14,x-8,y-8,x-16,y-2],'#303840');});}};}
function moveMenuW(p){const B=BT;const opts=p.moves.map((m,i)=>i);const odReady=B.od.p>=100&&!B.odUsed.p;if(odReady)opts.push('od');
  return{i:0,opts,update(){const n=this.opts.length;if(rep('up')){this.i=(this.i+n-1)%n;Snd.sfx('blip');}if(rep('down')){this.i=(this.i+1)%n;Snd.sfx('blip');}
    if(press('b')){popUI(this,-1);return;}
    if(press('a')){const o=this.opts[this.i];if(o!=='od'&&p.moves[o].pp<=0){Snd.sfx('wrong');return;}Snd.sfx('ok');popUI(this,o);}},
   draw(){panel(4,196,472,120);const e=cur('e');
    this.opts.forEach((o,i)=>{const y=222+i*22;let name,col='#303840';if(o==='od'){name='★ OVERDRIVE';col=TICK%20<10?'#c020c0':'#e07000';}else{name=MOVES[p.moves[o].id].n;if(p.moves[o].pp<=0)col='#a0a0a0';}
      txt(name,40,y,col,22);if(i===this.i)ptri(ctx,[22,y-14,30,y-8,22,y-2],'#303840');});
    const o=this.opts[this.i];ctx.fillStyle='#d8d4c8';ctx.fillRect(250,206,1,100);
    if(o==='od'){const t=odType(p,e);txt(OD_NAMES[t],264,226,'#a020a0',22);typeBadges([t],264,236,1);txt('POW 110  ACC —',264,276,'#303840',20);txt('Once per battle!',264,298,'#606870',20);}
    else{const m=MOVES[p.moves[o].id];const mv=p.moves[o];txt('PP '+mv.pp+'/'+m.pp,264,226,mv.pp<5?'#e04040':'#303840',22);typeBadges([m.t],264,236,1);
      txt(m.p?'POW '+m.p+'  ACC '+m.a:(m.d||'Status move'),264,276,'#303840',20);
      if(m.p&&e){const ef=typeEff(m.t,BOTS[e.id].types);if(G.seen[e.id])txt(ef>1?'Super effective':ef<1?'Not very effective':'Normal damage',264,298,ef>1?'#20a040':ef<1?'#c04030':'#606870',20);}}}};}
function odType(b,target){const ts=BOTS[b.id].types;let best=ts[0],bv=-1;for(const t of ts){const v=typeEff(t,BOTS[target.id].types);if(v>bv){bv=v;best=t;}}return best;}

function enemyChoose(){const B=BT;const e=cur('e'),p=cur('p');
  if(B.od.e>=100&&!B.odUsed.e&&(B.tr&&B.tr.warden||Math.random()<0.6))return{type:'od'};
  if(B.eItems>0&&e.hp<stats(e).hp*0.3){B.eItems--;return{type:'eheal'};}
  let best=0,bs=-1;e.moves.forEach((m,i)=>{if(m.pp<=0)return;const mv=MOVES[m.id];let s;
    if(mv.p){s=mv.p*typeEff(mv.t,BOTS[p.id].types)*(BOTS[e.id].types.includes(mv.t)?1.5:1)*(mv.a/100);}
    else if(mv.e&&mv.e.st){s=p.st?0:45;}else if(mv.e&&mv.e.self){s=B.st.e[mv.e.stat]<2?35:0;}else s=B.st.p[mv.e.stat]>-2?30:0;
    s*=0.7+Math.random()*0.6;if(s>bs){bs=s;best=i;}});
  return{type:'move',mi:best};}

function spd(side){const b=cur(side);let s=stats(b).spd*stageM(BT.st[side].spd);if(b.st&&b.st.k==='shock')s*=0.5;return s;}
async function battleTurn(){const B=BT;
  const pa=await playerMenu();const ea=enemyChoose();
  const puid=cur('p').uid,euid=cur('e').uid;
  if(pa.type==='run'){B.runs++;const ch=0.35+0.5*spd('p')/Math.max(1,spd('e'))+B.runs*0.12;
    if(Math.random()<ch){Snd.sfx('door');await bsay('Got away safely!');return 'run';}await bsay('Couldn\'t get away!');}
  else if(pa.type==='switch'){await bsay(BOTS[cur('p').id].name+', come back!');B.pHide=true;await wait(10);B.pi=pa.to;B.st.p={atk:0,def:0,spd:0};B.disp.p=cur('p').hp;B.part.add(cur('p').uid);B.pHide=false;await bsay('Go, '+BOTS[cur('p').id].name+'!');}
  else if(pa.type==='item'){const it=ITEMS[pa.item];const t=G.party[pa.target];useItemOn(pa.item,t);if(pa.target===B.pi)B.disp.p=B.disp.p;await bsay(N()+' used a '+it.n+'.');await syncHP();}
  else if(pa.type==='spike'){const r=await throwSpike(pa.item);if(r)return 'caught';}
  // order
  const order=[];
  if(pa.type==='move'||pa.type==='od'){const pf=pa.type==='od'?false:(pa.type==='move'&&ea.type==='move'?null:null);
    let pFirst=spd('p')>=spd('e');if(spd('p')===spd('e'))pFirst=Math.random()<0.5;if(ea.type==='eheal')pFirst=false;
    if(pFirst){order.push(['p',pa,puid],['e',ea,euid]);}else order.push(['e',ea,euid],['p',pa,puid]);}
  else order.push(['e',ea,euid]);
  for(const [side,a,uid] of order){if(cur(side).uid!==uid||cur(side).hp<=0)continue;
    await doAction(side,a);
    const r=await resolveFaints();if(r)return r;if(r===false)break;}
  // residual
  for(const side of ['p','e']){const b=cur(side);if(!b||b.hp<=0||!b.st)continue;
    if(b.st.k==='burn'||b.st.k==='corrode'){const dmg=Math.max(1,Math.floor(stats(b).hp/(b.st.k==='burn'?16:10)));b.hp=Math.max(0,b.hp-dmg);
      await bsay(bname(side)+(b.st.k==='burn'?' is hurt by its burn!':' is corroding!'));await syncHP();
      const r=await resolveFaints();if(r)return r;}}
  return null;}

async function doAction(side,a){const B=BT;const u=cur(side);
  if(a.type==='eheal'){u.hp=Math.min(stats(u).hp,u.hp+60);await bsay(B.tr.name+' used a Patch Kit+!');await syncHP();return;}
  // status check
  if(u.st){const k=u.st.k;
    if(k==='sleep'){u.st.t--;if(u.st.t<=0){u.st=null;await bsay(bname(side)+' rebooted from sleep mode!');}else{await bsay(bname(side)+' is in sleep mode.');return;}}
    else if(k==='freeze'){if(Math.random()<0.25){u.st=null;await bsay(bname(side)+' thawed out!');}else{await bsay(bname(side)+' is frozen solid!');return;}}
    else if(k==='shock'){if(Math.random()<0.25){await bsay(bname(side)+' is shocked! It can\'t move!');return;}}
    else if(k==='glitch'){u.st.t--;if(u.st.t<=0){u.st=null;await bsay(bname(side)+'\'s systems stabilized!');}
      else{await bsay(bname(side)+' is glitching!');if(Math.random()<0.33){const dmg=Math.max(1,Math.floor(((2*u.lv/5+2)*40*stats(u).atk/stats(u).def)/50+2));u.hp=Math.max(0,u.hp-dmg);B.anim[side==='p'?'hitP':'hitE']=18;Snd.sfx('hit');await bsay('It hit itself in the confusion!');await syncHP();return;}}}}
  const tside=side==='p'?'e':'p';const t=cur(tside);
  let mv,name;
  if(a.type==='od'){B.odUsed[side]=true;B.od[side]=0;const ty=odType(u,t);mv={n:OD_NAMES[ty],t:ty,p:110,a:0};name=mv.n;
    await bsay(bname(side)+' is in OVERDRIVE!');B.odCol=TCOL[ty];B.odFx=50;Snd.sfx('od');await wait(40);}
  else if(a.mi<0||!u.moves[a.mi]||u.moves[a.mi].pp<=0&&side==='e'&&u.moves.every(m=>m.pp<=0)){mv={n:'Struggle',t:'Core',p:50,a:0};name=mv.n;}
  else{const m=u.moves[a.mi];m.pp=Math.max(0,m.pp-1);mv=MOVES[m.id];name=mv.n;}
  await bsay(bname(side)+' used '+name+'!');
  B.anim[side==='p'?'lungeP':'lungeE']=1;await wait(8);
  if(mv.a&&Math.random()*100>=mv.a){await bsay('But it missed!');return;}
  const e=mv.e||{};
  if(mv.p){const A=stats(u),D=stats(t);let at=A.atk*stageM(B.st[side].atk);if(u.st&&u.st.k==='burn')at*=0.5;const df=D.def*stageM(B.st[tside].def);
    const ef=typeEff(mv.t,BOTS[t.id].types);const stab=BOTS[u.id].types.includes(mv.t)?1.5:1;const crit=Math.random()<1/16;
    let dmg=Math.max(1,Math.floor((((2*u.lv/5+2)*mv.p*at/df)/50+2)*stab*ef*(crit?1.5:1)*(0.85+Math.random()*0.15)));
    dmg=Math.min(dmg,t.hp);t.hp-=dmg;B.anim[tside==='p'?'hitP':'hitE']=18;Snd.sfx(crit?'crit':ef>1?'super':'hit');
    if(a.type==='od'){B.flash=20;B.flashCol=TCOL[mv.t];}
    B.od[side]=Math.min(100,B.od[side]+dmg/stats(t).hp*55);if(!B.odUsed[tside])B.od[tside]=Math.min(100,B.od[tside]+dmg/stats(t).hp*75);
    await syncHP();
    if(crit)await bsay('A critical hit!');if(ef>1)await bsay('It\'s super effective!');else if(ef<1)await bsay('It\'s not very effective...');
    if(e.drain&&u.hp>0){const h=Math.max(1,Math.floor(dmg*e.drain));u.hp=Math.min(stats(u).hp,u.hp+h);await syncHP();await bsay(bname(side)+' drained energy!');}
    if(t.hp<=0)return;}
  if(e.st){if(e.c<100&&Math.random()*100>=e.c){}else if(t.st){if(!mv.p)await bsay('But it failed!');}
    else if((e.st==='burn'&&BOTS[t.id].types.includes('Flame'))||(e.st==='freeze'&&BOTS[t.id].types.includes('Frost'))||(e.st==='shock'&&BOTS[t.id].types.includes('Volt'))){if(!mv.p)await bsay('It doesn\'t affect '+bname(tside)+'...');}
    else{t.st={k:e.st,t:e.st==='sleep'?2+rnd(3):e.st==='glitch'?2+rnd(3):0};
      const msg={burn:' was burned!',freeze:' was frozen solid!',shock:' was shocked! It may be unable to move!',corrode:' started corroding!',sleep:' went into sleep mode!',glitch:' started glitching!'}[e.st];await bsay(bname(tside)+msg);}}
  if(e.stat&&!(e.c&&Math.random()*100>=e.c)){const sd=e.self?side:tside;const stg=B.st[sd];const list=[e.stat];if(e.stat2)list.push(e.stat2);
    for(const s of list){const before=stg[s];stg[s]=clamp(stg[s]+e.s,-6,6);const nm={atk:'ATK',def:'DEF',spd:'SPD'}[s];
      if(before===stg[s])await bsay(bname(sd)+'\'s '+nm+' won\'t go any '+(e.s>0?'higher':'lower')+'!');
      else await bsay(bname(sd)+'\'s '+nm+(Math.abs(e.s)>1?' sharply':'')+(e.s>0?' rose!':' fell!'));}}}

async function resolveFaints(){const B=BT;
  const e=cur('e'),p=cur('p');
  if(e.hp<=0){Snd.sfx('faint');for(let i=0;i<=15;i++){B.anim.eFaint=i/15;await wait(1);}B.anim.eHide=true;
    await bsay(bname('e')+' shut down!');await giveXP(e);
    if(B.wild){const ty=BOTS[e.id].types[0];if(ty!=='Core'&&Math.random()<0.1){addItem('shard_'+ty,1);Snd.sfx('item');await bsay(BOTS[e.id].name+' dropped a '+ty+' Shard!');}return 'win';}
    if(B.ei<B.ep.length-1){B.ei++;B.od.e=Math.min(B.od.e,60);B.odUsed.e=B.odUsed.e;B.anim.eFaint=0;await deployE();B.part=new Set([cur('p').uid]);
      if(cur('p').hp<=0)return await resolveFaints();return false;}
    return 'win';}
  if(p.hp<=0){Snd.sfx('faint');for(let i=0;i<=15;i++){B.anim.pFaint=i/15;await wait(1);}
    await bsay(BOTS[p.id].name+' shut down!');B.anim.pFaint=0;
    if(!G.party.some(b=>b.hp>0))return 'lose';
    let t=-1;B.pHide=true;while(t<0){t=await openParty({mode:'switch',forced:1});}
    B.pi=t;B.st.p={atk:0,def:0,spd:0};B.disp.p=cur('p').hp;B.part.add(cur('p').uid);B.pHide=false;await bsay('Go, '+BOTS[cur('p').id].name+'!');return false;}
  return null;}

async function giveXP(e){const B=BT;const gain=Math.floor(BOTS[e.id].exp*e.lv/6*(B.tr?1.5:1));
  const parts=G.party.filter(b=>b.hp>0&&B.part.has(b.uid));const share=Math.max(1,Math.floor(gain/Math.max(1,parts.length)));
  for(const b of parts){await bsay(BOTS[b.id].name+' gained '+share+' XP!');await addXP(b,share,true);}
  const rest=G.party.filter(b=>b.hp>0&&!B.part.has(b.uid));if(rest.length){const s=Math.max(1,Math.floor(gain*0.3));for(const b of rest)await addXP(b,s,false);await bsay('The rest of the team got '+s+' XP via Link Share.');}}
async function addXP(b,n,loud){b.xp+=n;
  while(b.lv<100&&b.xp>=xpFor(b.lv+1)){const before=stats(b);b.lv++;const after=stats(b);b.hp+=after.hp-before.hp;
    if(BT&&b===cur('p'))BT.disp.p=b.hp;Snd.jingle('level',Snd.want);await bsay(BOTS[b.id].name+' grew to Lv '+b.lv+'!');
    for(const [l,m] of BOTS[b.id].learn)if(l===b.lv)await learnMove(b,m);
    if(b.lv>=16&&BOTS[b.id].stage===0&&b.shards.length===1&&BOTS[b.id].branches){if(!G.pendSock.includes(b.uid))G.pendSock.push(b.uid);}}}
async function learnMove(b,m){if(b.moves.some(x=>x.id===m))return;const nm=BOTS[b.id].name;
  if(b.moves.length<4){b.moves.push({id:m,pp:MOVES[m].pp});Snd.sfx('item');await say(nm+' learned '+MOVES[m].n+'!');return;}
  const r=await ask(nm+' wants to learn '+MOVES[m].n+', but already knows 4 moves. Forget one?');
  if(r===0){const i=await ask('Which move should be forgotten?',b.moves.map(x=>MOVES[x.id].n).concat(['Cancel']));
    if(i>=0&&i<4){const old=MOVES[b.moves[i].id].n;b.moves[i]={id:m,pp:MOVES[m].pp};await say('1, 2, and... Poof! '+nm+' forgot '+old+' and learned '+MOVES[m].n+'!');return;}}
  await say(nm+' did not learn '+MOVES[m].n+'.');}

async function throwSpike(item){const B=BT;const e=cur('e');G.bag[item]--;if(G.bag[item]<=0)delete G.bag[item];
  await bsay(N()+' threw a '+ITEMS[item].n+'!');Snd.sfx('spike');
  B.anim.spike={t:0,wob:0};for(let i=0;i<=24;i++){B.anim.spike.t=i/24;await wait(1);}
  B.flash=10;B.flashCol='rgba(80,230,255,.8)';B.anim.eHide=true;await wait(20);
  const d=BOTS[e.id];const hr=e.hp/stats(e).hp;let sm=1;if(e.st)sm=['sleep','freeze'].includes(e.st.k)?2:1.5;
  const chance=clamp((d.cr*(1-0.66*hr)*ITEMS[item].spike*sm)/255+0.03,0.02,0.98);
  const ok=Math.random()<chance;const shakes=ok?3:(chance>0.5?rnd(3)+1:rnd(3));
  for(let i=0;i<shakes;i++){Snd.sfx('shake');for(let k=0;k<16;k++){B.anim.spike.wob=Math.sin(k/16*Math.PI*2)*0.5;await wait(1);}B.anim.spike.wob=0;await wait(18);}
  if(ok){Snd.jingle('victory',curMap().music);await bsay('Reboot complete! '+d.name+' is now linked to you!');B.anim.spike=null;
    G.caught[e.id]=1;seen(e.id);e.st=null;if(G.party.length<6){G.party.push(e);}else{G.storage.push(e);await bsay(d.name+' was sent to the storage terminal.');}
    return true;}
  B.anim.spike=null;B.anim.eHide=false;B.flash=8;await bsay(['Oh no! It broke free!','Argh! Almost had it!','Gah! So close!'][Math.min(2,shakes)]);return false;}

// ---------- sockets / evolution ----------
async function processSockets(){while(G.pendSock.length){const uid=G.pendSock.shift();const b=G.party.find(x=>x.uid===uid)||G.storage.find(x=>x.uid===uid);if(!b)continue;
  await say(BOTS[b.id].name+'\'s SOCKET 2 has opened!');await socketMenu(b,true);}}
function branchList(b){const fr=BOTS[BOTS[b.id].frame];return Object.entries(fr.branches||{});}
async function socketMenu(b,fromLevel){const d=BOTS[b.id];
  if(d.legend){await say('This bot\'s sockets are sealed.');return;}
  if(d.stage===0&&b.lv<16){const br=branchList(b);await say('Socket 2 opens at Lv 16. Compatible shards: '+br.map(([s])=>s).join(', ')+'.');return;}
  if(d.stage===0){const br=branchList(b);
    const opts=br.map(([s,f])=>s+' Shard ('+(G.bag['shard_'+s]||0)+')  → '+(G.seen[f]?BOTS[f].name:'???'));opts.push('Not now');
    const have=br.filter(([s])=>G.bag['shard_'+s]>0);
    if(!have.length){await say('No compatible shard in your bag. '+d.name+' accepts: '+br.map(([s])=>s).join(', ')+'. Fit one later from the BOTS menu.');return;}
    const i=await ask('Fit which shard into '+d.name+'\'s Socket 2?',opts,{cancel:true});if(i<0||i>=br.length)return;
    const [s,f]=br[i];if(!G.bag['shard_'+s]){await say('You don\'t have a '+s+' Shard.');return;}
    const c=await ask('Fit the '+s+' Shard? '+d.name+' will evolve. (You can swap it once later.)');if(c!==0)return;
    G.bag['shard_'+s]--;if(!G.bag['shard_'+s])delete G.bag['shard_'+s];await evolve(b,f,s);return;}
  if(d.stage===1){const others=branchList(b).filter(([s])=>s!==d.shard);
    if(b.swaps<=0){await say(d.name+'\'s Socket 2 is locked with a '+d.shard+' Shard. Socket 3 opens at Lv 36 (coming in a later chapter).');return;}
    const opts=others.map(([s,f])=>'Swap to '+s+' ('+(G.bag['shard_'+s]||0)+') → '+(G.seen[f]?BOTS[f].name:'???'));opts.push('Keep current');
    const i=await ask(d.name+' has a '+d.shard+' Shard. Swaps left: '+b.swaps+'. Swap it?',opts);if(i<0||i>=others.length)return;
    const [s,f]=others[i];if(!G.bag['shard_'+s]){await say('You don\'t have a '+s+' Shard.');return;}
    const c=await ask('Swap to the '+s+' Shard? This uses your only swap and locks the socket.');if(c!==0)return;
    G.bag['shard_'+s]--;if(!G.bag['shard_'+s])delete G.bag['shard_'+s];addItem('shard_'+d.shard,1);b.swaps=0;
    b.shards.pop();await evolve(b,f,s);}}
async function evolve(b,to,shard){const from=b.id;const hpR=b.hp/stats(b).hp;
  await pushUI(evoScene(from,to));
  b.id=to;if(b.shards.length<2)b.shards.push(shard);else b.shards[1]=shard;b.hp=Math.max(1,Math.round(stats(b).hp*hpR));seen(to);G.caught[to]=1;
  Snd.jingle('victory',curMap().music);await say('Socket fitted! '+BOTS[from].name+' evolved into '+BOTS[to].name+'!');
  for(const [l,m] of BOTS[to].learn)if(l===0)await learnMove(b,m);}
function evoScene(from,to){Snd.music('evo',true);return{t:0,update(){this.t++;if(this.t>260){popUI(this);}},
  draw(){ctx.fillStyle='#0a0c18';ctx.fillRect(0,0,W,H);const t=this.t;
    for(let i=0;i<30;i++){const a=i/30*7+t/40;const r=80+Math.sin(t/20+i)*30;ctx.fillStyle=TCOL[BOTS[to].shard]||'#fff';ctx.globalAlpha=0.5;ctx.fillRect(W/2+Math.cos(a)*r,140+Math.sin(a)*r*0.6,3,3);}ctx.globalAlpha=1;
    const period=Math.max(4,40-t/6);const showTo=t>220||(t>60&&Math.floor(t/period)%2);
    const sp=botSprite(showTo?to:from,t>60&&t<220);ctx.drawImage(sp,W/2-80,60,160,160);
    if(t>215&&t<235){ctx.fillStyle='rgba(255,255,255,'+(1-(t-215)/20)+')';ctx.fillRect(0,0,W,H);}
    panel(4,252,472,64);txt(t<220?'The shard is resonating...':'Evolution complete!',22,290);}};}
