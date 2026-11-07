// ===================== BATTLE =====================
let BT=null;
const stageM=s=>s>=0?(2+s)/2:2/(2-s);
const WMULT={blizzard:{Frost:1.3,Flame:0.7},static:{Volt:1.3},night:{Shade:1.3}};
const WMSG={blizzard:'A blizzard is raging! Frost moves are stronger and Flame moves weaker.',static:'A static storm crackles overhead! Volt moves are stronger.',night:'It\'s a freezing night. Shade moves are stronger in the dark.'};
function cur(side){return side==='p'?G.party[BT.pi]:BT.ep[BT.ei];}
function partnerOf(side){const B=BT;if(!B||!B.link)return null;if(side==='p'){return G.party.find((b,i)=>i!==B.pi&&b.hp>0)||null;}for(let j=B.ei+1;j<B.ep.length;j++)if(B.ep[j].hp>0)return B.ep[j];return null;}
function gear(b,stat){return modMult(b,stat)*partMult(b,stat);}
function allTypes(b){return [...new Set(BOTS[b.id].types.concat(b.shards||[]))];}
function linkType(a,c){if(!a||!c)return null;const s=allTypes(a).filter(t=>allTypes(c).includes(t)&&t!=='Core');return s[0]||null;}
const HEATW={blizzard:0.75,static:1.1,night:0.9,clear:1,clearnight:0.9,clearstatic:1.1};
function heatCost(b,mid){const m=MOVES[mid];const t=moveType(b,mid);if(t==='Frost')return 0;let h=m.p?Math.round(m.p/4)+4:8;if(t==='Flame')h*=1.4;if(t==='Tide')h*=0.8;h*=(HEATW[BT&&BT.wx]||1)*partHeat(b);return Math.round(h);}
function knownMoves(b){return b.moves.map(m=>m.id).concat(partMoves(b));}
function researched(id){return (G.scan&&G.scan[id]||0)>=1||G.caught[id];}
function bname(side){const b=cur(side);return (side==='e'?(BT.wild?'The feral ':'Foe '):'')+BOTS[b.id].name;}
function typeBadges(types,x,y,small){let cx=x;for(const t of types){ctx.font=(small?16:19)+'px '+FONT;const w=Math.max(small?44:58,ctx.measureText(t.toUpperCase()).width+12);ctx.fillStyle=TCOL[t];rr(cx,y,w,small?16:20,4);ctx.fill();ctx.fillStyle='rgba(0,0,0,.25)';rr(cx,y+(small?11:14),w,small?5:6,3);ctx.fill();txt(t.toUpperCase(),cx+w/2,y+(small?13:16),'#fff',small?16:19,'center','rgba(0,0,0,.5)');cx+=w+4;}}
function hpBar(x,y,w,cur_,max){const r=clamp(cur_/max,0,1);R(ctx,x,y,w,8,'#30343c');R(ctx,x+1,y+1,w-2,6,'#585c64');ctx.fillStyle=r>0.5?'#48d058':r>0.2?'#f0c030':'#e84040';ctx.fillRect(x+1,y+1,Math.round((w-2)*r),6);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(x+1,y+1,Math.round((w-2)*r),2);}

function drawBotIdle(b,x,y,sz,flip,alpha,phase){const blink=(TICK+phase)%210<7;const sp=bspr(b,{blink});const bob=Math.sin((TICK+phase)/18)*3;
  ctx.save();ctx.globalAlpha=alpha;if(flip){ctx.translate(x+sz,y+bob);ctx.scale(-1,1);ctx.drawImage(sp,0,0,sz,sz);}else ctx.drawImage(sp,x,y+bob,sz,sz);ctx.restore();
  const base=bspr(b);if(base.core&&alpha>0.5){const cx=flip?x+sz-base.core[0]*sz:x+base.core[0]*sz,cy=y+bob+base.core[1]*sz;const pulse=0.35+0.3*Math.sin((TICK+phase)/12);const col=TCOL[BOTS[b.id].types[0]];
    ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(cx,cy,0,cx,cy,sz*0.16);g.addColorStop(0,col+Math.floor(pulse*255).toString(16).padStart(2,'0'));g.addColorStop(1,col+'00');ctx.fillStyle=g;ctx.fillRect(cx-sz*0.2,cy-sz*0.2,sz*0.4,sz*0.4);ctx.restore();}
  if(alpha>0.5)drawParts(b,x,y+bob,sz,flip);
  if(b.alpha&&alpha>0.5){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,70,50,'+(0.4+0.3*Math.sin(TICK/6))+')';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x+sz/2,y+sz*0.9,sz*0.45,sz*0.12,0,0,7);ctx.stroke();ctx.restore();}}
function drawBattle(){const B=BT;const th=B.bg;const wx=B.wx;
  ctx.save();if(B.shake>0){ctx.translate((Math.random()-0.5)*B.shake,(Math.random()-0.5)*B.shake);}
  let sky=th==='cave'?['#141a24','#2c3442']:th==='gym1'?['#3e4048','#6e7078']:th==='gym2'?['#161c2a','#2e3a52']:['#4e6680','#aebccc'];
  if(wx==='night')sky=['#060a16','#22304a'];if(wx==='static')sky=['#14122a','#3c3c62'];if(wx==='blizzard')sky=['#8a9cb0','#d0dce6'];
  const gr=ctx.createLinearGradient(0,0,0,232);gr.addColorStop(0,sky[0]);gr.addColorStop(1,sky[1]);ctx.fillStyle=gr;ctx.fillRect(-10,-10,W+20,252);
  if(wx==='night'){for(let i=0;i<40;i++){ctx.fillStyle='rgba(255,255,255,'+(0.3+0.5*((i*37+TICK)%90<45))+')';ctx.fillRect((i*53)%W,(i*29)%110,1.2,1.2);}}
  const ground=th==='cave'?'#4e5664':th==='gym1'?'#7e7c80':th==='gym2'?'#3e4858':wx==='night'?'#7a8aa0':'#c6d6e0';
  if(th!=='cave'&&th!=='gym1'&&th!=='gym2'){ctx.fillStyle=wx==='night'?'#2e3a52':wx==='static'?'#3a3a58':'#8a9cb0';ctx.beginPath();ctx.moveTo(0,150);ctx.lineTo(70,110);ctx.lineTo(150,140);ctx.lineTo(240,90);ctx.lineTo(330,135);ctx.lineTo(420,105);ctx.lineTo(480,130);ctx.lineTo(480,232);ctx.lineTo(0,232);ctx.fill();ctx.fillStyle='#e8eef4';ctx.beginPath();ctx.moveTo(225,99);ctx.lineTo(240,90);ctx.lineTo(256,98);ctx.lineTo(246,102);ctx.lineTo(236,97);ctx.fill();ctx.fillStyle=wx==='night'?'#5a6a84':'#b4c4d2';ctx.fillRect(0,180,W,52);}
  ctx.fillStyle=shade(ground,0.15);ctx.beginPath();ctx.ellipse(360,124,100,22,0,0,7);ctx.fill();ctx.fillStyle=shade(ground,-0.1);ctx.beginPath();ctx.ellipse(360,128,90,16,0,0,7);ctx.fill();
  ctx.fillStyle=shade(ground,0.15);ctx.beginPath();ctx.ellipse(130,226,130,28,0,0,7);ctx.fill();ctx.fillStyle=shade(ground,-0.1);ctx.beginPath();ctx.ellipse(130,230,118,20,0,0,7);ctx.fill();
  if(th==='gym2'||th==='cave'){for(let i=0;i<6;i++){ctx.fillStyle=th==='gym2'?'rgba(255,220,60,.07)':'rgba(255,255,255,.03)';ctx.fillRect(i*90+((TICK/2)%90),0,30,232);}}
  const sl=B.slide;
  const e=cur('e');const a=B.anim;
  if(B.link&&!B.hideInfo){const ep=partnerOf('e');if(ep&&!B.trainerShow)drawBotIdle(ep,404+sl*-260,8,80,false,0.92,90);const pp=partnerOf('p');if(pp&&!B.pHide)drawBotIdle(pp,4+sl*260,140,84,true,0.92,50);}
  if(e){let ex=300+sl*-260,ey=12;
    if(B.trainerShow&&B.tr){const s=charSprite(B.tr.look,'down',0);ctx.drawImage(s,328+sl*-260,30,64,72);}
    else if(!a.eHide){let vis=!(a.hitE>0&&Math.floor(a.hitE/3)%2);
      if(vis){const f=a.eFaint||0;const sc=a.eIn!=null?a.eIn:1;const sz=120*sc;drawBotIdle(e,ex+(120-sz)/2+(a.lungeE||0)*-12,ey+f*60+(120-sz),sz,false,clamp(1-f,0,1),37);}}
    if(a.spike){const s=a.spike;const t=s.t;const sx=150+(360-150)*t,sy=180-(180-90)*t-Math.sin(t*Math.PI)*80;drawSpike(sx,sy,s.wob||0);}}
  const p=cur('p');if(p&&!B.pHide){let vis=!(a.hitP>0&&Math.floor(a.hitP/3)%2);const f=a.pFaint||0;
    if(vis)drawBotIdle(p,70+sl*260+(a.lungeP||0)*12,112+f*60,120,true,clamp(1-f,0,1),0);}
  bfxDraw();
  if(e&&(!B.trainerShow&&!a.eHide||a.spike)&&!B.hideInfo)drawInfo('e');
  if(p&&!B.pHide&&!B.hideInfo)drawInfo('p');
  if(th!=='gym1'&&th!=='gym2'){const W_=WEATHER[wx]||WEATHER.snow;drawSnow(0,0,th==='cave'?0.08:W_.snow,W_.wind);if(W_.fog){ctx.fillStyle='rgba(220,232,244,'+W_.fog*0.8+')';ctx.fillRect(0,0,W,232);}}
  if(wx==='static'&&B.bolt>0){ctx.fillStyle='rgba(190,200,255,'+(B.bolt/12*0.4)+')';ctx.fillRect(0,0,W,232);}
  ctx.restore();
  ctx.fillStyle='#161c28';ctx.fillRect(0,232,W,88);panel(4,232,472,84);
  if(B.flash>0){ctx.fillStyle=B.flashCol||'rgba(255,255,255,.8)';ctx.globalAlpha=Math.min(1,B.flash/20);ctx.fillRect(0,0,W,232);ctx.globalAlpha=1;}
  if(B.intro>0){ctx.fillStyle='#000';const h=B.intro*8;ctx.fillRect(0,0,W,h);ctx.fillRect(0,H-h,W,h);}
}
function drawSpike(x,y,wob){ctx.save();ctx.translate(x,y);ctx.rotate(wob);R(ctx,-3,-14,6,22,'#506070');R(ctx,-2,-13,4,20,'#8aa0b8');ptri(ctx,[-5,8,5,8,0,18],'#40e0ff');R(ctx,-6,-16,12,4,'#ffd040');ctx.restore();}
function drawInfo(side){const B=BT;const b=cur(side);const st=stats(b);const d=BOTS[b.id];const nm=(b.glitch?'✦':'')+d.name;
  if(side==='e'){const x=16,y=14;panel(x,y,226,70);txt(nm,x+14,y+28,b.glitch?'#a020c0':'#303840',22);txt('Lv'+b.lv,x+210,y+28,'#303840',20,'right');
    typeBadges(d.types,x+14,y+34,1);if(b.st)statusTag(b.st.k,x+170,y+34);
    if(G.caught[b.id]&&BT.wild){ctx.fillStyle='#e04040';ctx.beginPath();ctx.arc(x+196,y+43,4,0,7);ctx.fill();}
    txt('HP',x+14,y+62,'#e08020',16);hpBar(x+34,y+54,176,B.disp.e,st.hp);
    odBar(x+34,y+64,176,B.od.e,B.odUsed.e);heatBar(x+150,y+12,60,B.heat.e,B.over.e);}
  else{const x=244,y=136;panel(x,y,226,92);txt(nm,x+14,y+28,b.glitch?'#a020c0':'#303840',22);txt('Lv'+b.lv,x+210,y+28,'#303840',20,'right');
    if(b.st)statusTag(b.st.k,x+150,y+12);
    txt('HP',x+14,y+46,'#e08020',16);hpBar(x+34,y+38,176,B.disp.p,st.hp);txt(Math.ceil(B.disp.p)+'/'+st.hp,x+210,y+64,'#303840',20,'right');
    const nx=xpFor(b.lv+1),px=xpFor(b.lv);R(ctx,x+34,y+70,176,4,'#30343c');R(ctx,x+35,y+71,Math.round(174*clamp((b.xp-px)/(nx-px),0,1)),2,'#40b0f0');
    odBar(x+34,y+78,176,B.od.p,B.odUsed.p);txt(resonant(b)?'OD+':'OD',x+14,y+84,'#a040e0',14);heatBar(x+120,y+8,70,B.heat.p,B.over.p);}}
function heatBar(x,y,w,v,over){R(ctx,x,y,w,6,'#30343c');const r=clamp(v/100,0,1);ctx.fillStyle=over?(TICK%10<5?'#ff2020':'#ffffff'):v>75?'#ff5030':v>45?'#ffa030':'#ffd060';ctx.fillRect(x+1,y+1,Math.round((w-2)*r),4);txt(over?'HOT!':'HEAT',x-4,y+7,over?'#e02020':'#c06020',12,'right',null);}
function odBar(x,y,w,v,used){R(ctx,x,y,w,5,'#30343c');const r=v/100;const full=v>=100&&!used;ctx.fillStyle=used?'#707080':full?(TICK%20<10?'#ff60ff':'#ffd040'):'#b060f0';ctx.fillRect(x+1,y+1,Math.round((w-2)*r),3);}
function statusTag(k,x,y){const s=STATUS[k];ctx.fillStyle=s.c;rr(x,y,40,16,3);ctx.fill();txt(s.n,x+20,y+13,'#fff',16,'center','rgba(0,0,0,.4)');}

async function bsay(t){await say(t,{auto:Math.ceil(70/bspd())});}
async function animWait(cond){let n=0;while(!cond()&&n++<600)await wait(1);}
async function syncHP(){const B=BT;await animWait(()=>Math.abs(B.disp.p-cur('p').hp)<0.5&&Math.abs(B.disp.e-cur('e').hp)<0.5);B.disp.p=cur('p').hp;B.disp.e=cur('e').hp;}
function battleTick(){const B=BT;if(!B)return;const a=B.anim;
  for(const s of ['p','e']){const b=cur(s);if(!b)continue;const mx=stats(b).hp;const sp=Math.max(0.5,mx/45)*bspd();if(B.disp[s]>b.hp)B.disp[s]=Math.max(b.hp,B.disp[s]-sp);else if(B.disp[s]<b.hp)B.disp[s]=Math.min(b.hp,B.disp[s]+sp);}
  if(a.hitE>0)a.hitE--;if(a.hitP>0)a.hitP--;if(B.flash>0)B.flash--;if(B.shake>0)B.shake=Math.max(0,B.shake-0.8);
  if(B.wx==='static'){if(B.bolt>0)B.bolt--;else if(Math.random()<0.006){B.bolt=12;Snd.sfx('thunder');}}
  if(a.lungeE>0)a.lungeE=Math.max(0,a.lungeE-0.1);if(a.lungeP>0)a.lungeP=Math.max(0,a.lungeP-0.1);bfxTick();}

async function runBattle(o){if(BT)return 'run';try{return await runBattleInner(o);}catch(e){recoverFromError(e,'battle');return 'run';}}
function battleSong(tr){if(!tr)return 'battle';if(tr.warden)return tr.title==='Deacon'?'choir':'boss';if(tr.title==='Hollow')return 'choir';return 'trainer';}
async function runBattleInner(o){
  const wk=weatherKey();
  const B={wild:o.wild||null,tr:o.trainer||null,ep:[],ei:0,pi:0,st:{p:{atk:0,def:0,spd:0},e:{atk:0,def:0,spd:0}},od:{p:0,e:0},odUsed:{p:false,e:false},
    part:new Set(),anim:{},runs:0,bg:curMap().theme,wx:wk==='clearnight'?'night':wk==='clearstatic'?'static':(WMULT[wk]||wk==='night')?wk:(curMap().theme==='cave'?'cave':'snow'),eItems:o.trainer&&o.trainer.items?1:0,disp:{p:0,e:0},slide:1,intro:20,flash:0,shake:0,bolt:0,trainerShow:!!o.trainer,hideInfo:true,rally:{},eSwitched:{},heat:{p:0,e:0},over:{p:false,e:false},link:!!(o.trainer&&o.trainer.link),linkUsed:{p:false,e:false},scanned:false,sneak:o.sneak,ambush:o.ambush,first:o.sneak?'p':o.ambush?'e':null};
  if(!curMap().outdoor)B.wx='indoor';
  B.ep=B.wild?[B.wild]:B.tr.team.map(([id,lv])=>makeBot(id,lv));
  B.pi=G.party.findIndex(b=>b.hp>0);if(B.pi<0){await healAll();B.pi=0;}
  BFX.length=0;
  const wasBusy=G.busy;G.busy=true;Snd.music(battleSong(B.tr),true);
  for(let i=0;i<3;i++){G.flashOW=8;await wait(10);}
  BT=B;B.disp.p=cur('p').hp;B.disp.e=cur('e').hp;
  while(B.intro>0){B.intro--;await wait(1);}
  while(B.slide>0){B.slide=Math.max(0,B.slide-0.05*bspd());await wait(1);}
  if(B.wild){seen(B.wild.id);B.hideInfo=false;Snd.chirp(BOTS[B.wild.id].frame);await bsay('A feral '+BOTS[B.wild.id].name+' appeared!');
    if(B.wild.glitch){Snd.sfx('glitch');B.flash=12;B.flashCol='rgba(255,0,200,.5)';await bsay('...Wait. Its signal is corrupted. This one is GLITCHED!');}}
  else{await bsay(B.tr.title+' '+B.tr.name+' wants to battle!');B.trainerShow=false;await deployE(true);}
  if(B.wild&&B.wild.alpha)await bsay('This is an ALPHA. It\'s tougher than the rest.');
  if(WMSG[B.wx])await bsay(WMSG[B.wx]);
  B.hideInfo=false;B.part.add(cur('p').uid);Snd.chirp(BOTS[cur('p').id].frame);await bsay('Go, '+BOTS[cur('p').id].name+'!');
  if(B.link){const pp=partnerOf('p'),ep=partnerOf('e');if(pp){B.part.add(pp.uid);await bsay(BOTS[pp.id].name+' links up as your partner!');}if(ep)await bsay(B.tr.name+'\'s partner is '+BOTS[ep.id].name+'. It\'s a LINK BATTLE!');}
  if(B.sneak){const e=cur('e');const d=Math.max(1,Math.floor(stats(e).hp*0.2));e.hp=Math.max(1,e.hp-d);B.anim.hitE=18;dmgNumber('e','-'+d,'#ffe060',true);Snd.sfx('crit');await bsay('SNEAK ATTACK! You caught it from behind!');await syncHP();}
  if(B.ambush)await bsay('It ambushed you! It gets the first move.');
  await onEnter('p');if(B.wild)await onEnter('e');
  let result=null;
  while(!result){result=await battleTurn();}
  if(result==='win'&&B.tr){Snd.jingle('victory',curMap().music);await bsay(B.tr.title+' '+B.tr.name+' was defeated!');
    G.money+=B.tr.money;await bsay(N()+' got '+B.tr.money+' Cr for winning!');}
  if(result==='lose'){await bsay(N()+' has no working bots left!');
    if(!(B.tr&&B.tr.noBlackout)){const lost=Math.floor(G.money/2);G.money-=lost;await bsay(N()+' dropped '+lost+' Cr and blacked out...');
      BT=null;BFX.length=0;G.fade=1;await healAll();if(G.vault){await vaultFail();G.busy=false;return 'lose';}loadMap(G.lastHeal.map,G.lastHeal.x,G.lastHeal.y,'down');await say('You were towed back to safety. Your bots have been repaired.');G.busy=false;return 'lose';}}
  for(const b of G.party){b.st=b.st&&['sleep','freeze','glitch'].includes(b.st.k)?null:b.st;}
  BT=null;BFX.length=0;G.fade=1;Snd.music(curMap().music,true);
  await processSockets();await checkDexRewards();
  G.busy=wasBusy;autosave();return result;}

async function onEnter(side){const B=BT;const b=cur(side);const tr=traitId(b);const os=side==='p'?'e':'p';
  if(tr==='pipsprock'&&B.st[side].spd<6){B.st[side].spd++;arrows(side,'#7fe6d4',true);await bsay(bname(side)+'\'s Quick Launch raised its SPD!');}
  if(tr==='cogwyrm'&&B.st[side].def<6){B.st[side].def++;arrows(side,'#a0aec0',true);await bsay(bname(side)+'\'s Rail Lock raised its DEF!');}
  if(tr==='gloomlamp'&&B.st[os].atk>-6){B.st[os].atk--;arrows(os,'#9a6ae6',false);await bsay(bname(side)+'\'s Dread Aura lowered '+bname(os)+'\'s ATK!');}}
async function deployE(first){const B=BT;const e=cur('e');seen(e.id);B.st.e={atk:0,def:0,spd:0};B.heat.e=0;B.over.e=false;B.anim.eIn=0;B.disp.e=e.hp;
  for(let i=0;i<=10;i++){B.anim.eIn=i/10;await wait(1);}B.anim.eIn=null;B.anim.eFaint=0;B.anim.eHide=false;Snd.chirp(BOTS[e.id].frame);
  await bsay(B.tr.name+' deployed '+BOTS[e.id].name+'!');await onEnter('e');}

async function playerMenu(){const B=BT;const p=cur('p');
  if(B.over.p)return{type:'vent',forced:1};
  while(true){const r=await pushUI(battleMenuW(BOTS[p.id].name));
    if(r===0){const m=await pushUI(moveMenuW(p));if(m===-1)continue;return m;}
    if(r===1){const it=await openBag(true);if(!it)continue;
      if(ITEMS[it].spike){if(!B.wild){await bsay('You can\'t reboot another trainer\'s bot!');continue;}return{type:'spike',item:it};}
      if(ITEMS[it].cat==='med'){const t=await openParty({mode:'item',item:it});if(t==null||t<0)continue;if(!canUse(it,G.party[t])){await bsay('It won\'t have any effect.');continue;}return{type:'item',item:it,target:t};}
      await bsay('That can\'t be used here.');continue;}
    if(r===2){const t=await openParty({mode:'switch'});if(t==null||t<0)continue;return{type:'switch',to:t};}
    if(r===3){if(B.scanned){await bsay('You already scanned this turn\'s target this battle.');continue;}await doScan();continue;}
    if(r===4){if(B.tr){await bsay('There\'s no running from a trainer battle!');continue;}return{type:'run'};}}}
async function doScan(){const B=BT;const e=cur('e');B.scanned=true;G.scan=G.scan||{};const before=G.scan[e.id]||0;
  bfxAdd({max:40,draw(t){const [x,y]=BPOS.e;ctx.strokeStyle='rgba(80,230,255,'+(1-t)+')';ctx.lineWidth=2;for(let i=0;i<6;i++){const yy=y-50+((t*100+i*18)%100);ctx.beginPath();ctx.moveTo(x-55,yy);ctx.lineTo(x+55,yy);ctx.stroke();}ctx.strokeRect(x-58,y-56,116,112);}});
  Snd.sfx('switch');await bwait(30);
  if(before>=3){await bsay('Scan: '+BOTS[e.id].name+' is already fully researched.');return;}
  G.scan[e.id]=before+1;await bsay('Scanned '+BOTS[e.id].name+'! Research '+G.scan[e.id]+'/3.');
  if(G.scan[e.id]===1)await bsay('Its type data is logged. Move effectiveness is now shown against it.');
  if(G.scan[e.id]===3){const weak=TYPES.filter(t=>typeEff(t,BOTS[e.id].types)>1);G.money+=150;Snd.sfx('item');
    await bsay('Research complete! Weak to: '+(weak.join(', ')||'nothing')+'. Trait: '+trait(e).n+'.');await bsay('Vesna sent 150 Cr for the data.');}}
const BOPTS=['FIGHT','BAG','BOTS','SCAN','RUN','—'];
function battleMenuW(nm){return{i:0,update(){const c=this.i%3,r=Math.floor(this.i/3);if(rep('left')){this.i=r*3+(c+2)%3;Snd.sfx('blip');}if(rep('right')){this.i=r*3+(c+1)%3;Snd.sfx('blip');}if(rep('up')||rep('down')){this.i=(this.i+3)%6;Snd.sfx('blip');}
    if(this.i===5)this.i=4;if(press('a')){Snd.sfx('ok');popUI(this,this.i);}},
  draw(){panel(4,232,472,84);txt('What will',22,264);txt(nm+' do?',22,290);panel(196,232,280,84,'#fff');
    BOPTS.slice(0,5).forEach((s,i)=>{const x=222+(i%3)*84,y=266+Math.floor(i/3)*30;const dim=(s==='RUN'&&BT.tr)||(s==='SCAN'&&BT.scanned);txt(s,x,y,dim?'#a0a4ac':'#303840',22);if(i===this.i)ptri(ctx,[x-14,y-14,x-6,y-8,x-14,y-2],'#303840');});}};}
function moveMenuW(p){const B=BT;const opts=knownMoves(p).map(id=>({k:'move',id}));
  if(B.od.p>=100&&!B.odUsed.p)opts.push({k:'od'});const lt=B.link&&!B.linkUsed.p?linkType(p,partnerOf('p')):null;if(lt)opts.push({k:'link',t:lt});opts.push({k:'vent'});
  return{i:0,opts,update(){const n=this.opts.length;if(rep('up')){this.i=(this.i+n-1)%n;Snd.sfx('blip');}if(rep('down')){this.i=(this.i+1)%n;Snd.sfx('blip');}
    if(press('b')){popUI(this,-1);return;}
    if(press('a')){const o=this.opts[this.i];Snd.sfx('ok');popUI(this,o.k==='move'?{type:'move',mid:o.id}:o.k==='od'?{type:'od'}:o.k==='link'?{type:'link'}:{type:'vent'});}},
   draw(){const n=this.opts.length;const top=Math.max(96,316-n*21-34);panel(4,top,472,316-top);const e=cur('e');
    this.opts.forEach((o,i)=>{const y=top+26+i*21;let name,col='#303840';
      if(o.k==='od'){name='★ OVERDRIVE';col=TICK%20<10?'#c020c0':'#e07000';}else if(o.k==='link'){name='✦ LINK STRIKE';col=TICK%20<10?'#2080e0':'#20a0a0';}else if(o.k==='vent'){name='❄ VENT (cool down)';col='#3070a0';}
      else{name=MOVES[o.id].n;if(partMoves(p).includes(o.id))name='◆ '+name;if(B.heat.p+heatCost(p,o.id)>=100)col='#c04030';}
      txt(name,40,y,col,21);if(i===this.i)ptri(ctx,[22,y-14,30,y-8,22,y-2],'#303840');});
    const o=this.opts[this.i];ctx.fillStyle='#d8d4c8';ctx.fillRect(250,top+10,1,316-top-20);const X=264,Y=top+28;
    if(o.k==='od'){const t=odType(p,e);txt(OD_NAMES[t],X,Y,'#a020a0',22);typeBadges([t],X,Y+10,1);txt('POW 110 · no heat',X,Y+48,'#303840',19);txt('Once per battle!',X,Y+70,'#606870',19);}
    else if(o.k==='link'){txt('Link Strike: '+o.t,X,Y,'#2070c0',21);typeBadges([o.t],X,Y+10,1);txt('POW 130 · with '+BOTS[partnerOf('p').id].name,X,Y+48,'#303840',18);txt('Once per battle!',X,Y+70,'#606870',19);}
    else if(o.k==='vent'){txt('Vent heat',X,Y,'#3070a0',22);txt('Heat '+Math.round(B.heat.p)+' → '+Math.max(0,Math.round(B.heat.p-55)),X,Y+26,'#303840',19);txt('Uses your turn.',X,Y+48,'#606870',19);}
    else{const m=MOVES[o.id];const t=moveType(p,o.id);const hc=heatCost(p,o.id);const nh=B.heat.p+hc;typeBadges([t],X,Y-14,1);
      txt((m.p?'POW '+m.p+'  ACC '+m.a:(m.d||'Status move')),X,Y+20,'#303840',18);
      txt(t==='Frost'?'HEAT −12 (cools you)':'HEAT +'+hc+' → '+Math.round(nh),X,Y+40,nh>=100?'#e02020':'#c06020',18);if(nh>=100&&t!=='Frost')txt('Will OVERHEAT!',X+130,Y+40,'#e02020',16);
      const wm=(WMULT[B.wx]||{})[t];if(wm)txt(wm>1?'▲ weather':'▼ weather',X+140,Y-2,wm>1?'#20a040':'#c04030',15);
      if(m.p&&e){if(researched(e.id)){const ef=typeEff(t,BOTS[e.id].types);txt(ef>1?'Super effective':ef<1?'Not very effective':'Normal damage',X,Y+60,ef>1?'#20a040':ef<1?'#c04030':'#606870',18);}else txt('Effect unknown — SCAN it',X,Y+60,'#909498',17);}}}};}
function odType(b,target){const ts=BOTS[b.id].types;let best=ts[0],bv=-1;for(const t of ts){const v=typeEff(t,BOTS[target.id].types);if(v>bv){bv=v;best=t;}}return best;}

function estDamage(u,t,type,pow,side){const B=BT;const at=stats(u).atk*stageM(B.st[side].atk)*gear(u,'atk'),df=stats(t).def*stageM(B.st[side==='p'?'e':'p'].def)*gear(t,'def');
  return (((2*u.lv/5+2)*pow*at/df)/50+2)*(BOTS[u.id].types.includes(type)?1.5:1)*typeEff(type,BOTS[t.id].types)*0.92;}
function enemyChoose(){const B=BT;const e=cur('e'),p=cur('p');
  if(B.over.e)return{type:'vent',forced:1};
  const elt=B.link&&!B.linkUsed.e?linkType(e,partnerOf('e')):null;if(elt&&(Math.random()<0.45||estDamage(e,p,elt,130,'e')>=p.hp))return{type:'link'};
  if(B.heat.e>=78&&Math.random()<0.6&&!(e.moves.some(m=>MOVES[m.id].p&&estDamage(e,p,MOVES[m.id].t,MOVES[m.id].p,'e')>=p.hp)))return{type:'vent'};
  if(B.od.e>=100&&!B.odUsed.e){const t=odType(e,p);const est=estDamage(e,p,t,110,'e');if(est>=p.hp||p.hp<stats(p).hp*0.45||(!B.wild&&Math.random()<0.25)||(B.wild&&Math.random()<0.5))return{type:'od'};}
  if(B.eItems>0&&e.hp<stats(e).hp*0.3){B.eItems--;return{type:'eheal'};}
  if(B.tr&&!B.eSwitched[e.uid]&&B.ei<B.ep.length-1){const threat=Math.max(...BOTS[p.id].types.map(t=>typeEff(t,BOTS[e.id].types)));
    if(threat>=2){let best=-1,bv=9;for(let j=B.ei+1;j<B.ep.length;j++){const v=Math.max(...BOTS[p.id].types.map(t=>typeEff(t,BOTS[B.ep[j].id].types)));if(v<bv){bv=v;best=j;}}
      if(best>=0&&bv<=1&&Math.random()<0.45){B.eSwitched[e.uid]=1;return{type:'eswitch',to:best};}}}
  let best=0,bs=-1;e.moves.forEach((m,i)=>{const mv=MOVES[m.id];let s;
    if(mv.p){s=mv.p*typeEff(mv.t,BOTS[p.id].types)*(BOTS[e.id].types.includes(mv.t)?1.5:1)*(mv.a/100)*((WMULT[B.wx]||{})[mv.t]||1);if(traitId(p)==='dripcell'&&mv.t==='Volt')s=1;if(estDamage(e,p,mv.t,mv.p,'e')>=p.hp)s*=1.6;}
    else if(mv.e&&mv.e.st){s=p.st?0:45;}else if(mv.e&&mv.e.self){s=B.st.e[mv.e.stat]<2&&e.hp>stats(e).hp*0.5?35:0;}else s=B.st.p[mv.e.stat]>-2?30:0;
    if(B.heat.e+heatCost(e,m.id)>=100&&mv.t!=='Frost')s*=0.35;s*=0.75+Math.random()*0.5;if(s>bs){bs=s;best=i;}});
  return{type:'move',mid:e.moves[best].id};}

function spd(side){const b=cur(side);let s=stats(b).spd*stageM(BT.st[side].spd)*gear(b,'spd');if(b.st&&b.st.k==='shock')s*=0.5;return s;}
async function battleTurn(){const B=BT;
  const pa=await playerMenu();const ea=enemyChoose();
  const puid=cur('p').uid,euid=cur('e').uid;
  if(pa.type==='run'){B.runs++;const ch=0.35+0.5*spd('p')/Math.max(1,spd('e'))+B.runs*0.12;
    if(Math.random()<ch){Snd.sfx('door');await bsay('Got away safely!');return 'run';}await bsay('Couldn\'t get away!');}
  else if(pa.type==='switch'){await bsay(BOTS[cur('p').id].name+', come back!');B.pHide=true;await wait(10);B.pi=pa.to;B.st.p={atk:0,def:0,spd:0};B.heat.p=0;B.over.p=false;B.disp.p=cur('p').hp;B.part.add(cur('p').uid);B.pHide=false;Snd.chirp(BOTS[cur('p').id].frame);await bsay('Go, '+BOTS[cur('p').id].name+'!');await onEnter('p');}
  else if(pa.type==='item'){const it=ITEMS[pa.item];const t=G.party[pa.target];useItemOn(pa.item,t);ring(BPOS.p[0],BPOS.p[1],'#80ffa0',22,10,60);await bsay(N()+' used a '+it.n+'.');await syncHP();}
  else if(pa.type==='spike'){const r=await throwSpike(pa.item);if(r)return 'caught';}
  const order=[];const pri=a=>a.type==='eswitch'||a.type==='eheal'?1:0;
  if(['move','od','link','vent'].includes(pa.type)){let pFirst=spd('p')>=spd('e');if(spd('p')===spd('e'))pFirst=Math.random()<0.5;if(pri(ea))pFirst=false;if(B.first){pFirst=B.first==='p';B.first=null;}
    if(pFirst){order.push(['p',pa,puid],['e',ea,euid]);}else order.push(['e',ea,euid],['p',pa,puid]);}
  else order.push(['e',ea,euid]);
  for(const [side,a,uid] of order){if(cur(side).uid!==uid||cur(side).hp<=0)continue;
    await doAction(side,a);
    const r=await resolveFaints();if(r)return r;if(r===false)break;}
  // end of turn
  if(B.link){for(const side of ['p','e']){const pt=partnerOf(side),ac=cur(side),tg=cur(side==='p'?'e':'p');if(!pt||!ac||ac.hp<=0||!tg||tg.hp<=0)continue;
      const t=BOTS[pt.id].types[0];const at=stats(pt).atk,df=stats(tg).def*gear(tg,'def');const dmg=Math.max(1,Math.floor((((2*pt.lv/5+2)*28*at/df)/50+2)*typeEff(t,BOTS[tg.id].types)*(0.9+Math.random()*0.1)));
      await bsay((side==='e'?'Foe partner ':'Partner ')+BOTS[pt.id].name+' assists!');await moveFx(t,side,side==='p'?'e':'p');tg.hp=Math.max(0,tg.hp-dmg);dmgNumber(side==='p'?'e':'p','-'+dmg,'#c0e0ff');Snd.sfx('hit');await syncHP();
      const r=await resolveFaints();if(r)return r;if(r===false)break;}}
  for(const side of ['p','e']){if(cur(side)&&!B.over[side])B.heat[side]=Math.max(0,B.heat[side]-6);}
  for(const side of ['p','e']){const b=cur(side);if(!b||b.hp<=0)continue;const mx=stats(b).hp;
    if(b.st&&(b.st.k==='burn'||b.st.k==='corrode')){const dmg=Math.max(1,Math.floor(mx/(b.st.k==='burn'?16:10)));b.hp=Math.max(0,b.hp-dmg);
      dmgNumber(side,'-'+dmg,b.st.k==='burn'?'#ff8040':'#c070e0');await bsay(bname(side)+(b.st.k==='burn'?' is hurt by its burn!':' is corroding!'));await syncHP();
      const r=await resolveFaints();if(r)return r;if(r===false)continue;}
    if(b.hp>0&&b.hp<mx&&(traitId(b)==='drizzlet'||b.mod==='nanites')){const h=Math.max(1,Math.floor(mx/16));b.hp=Math.min(mx,b.hp+h);dmgNumber(side,'+'+h,'#60f090');
      await bsay(bname(side)+(traitId(b)==='drizzlet'?'\'s Coolant Loop':'\'s Repair Nanites')+' restored some HP.');await syncHP();}}
  return null;}

async function doAction(side,a){const B=BT;const u=cur(side);
  if(a.type==='eheal'){u.hp=Math.min(stats(u).hp,u.hp+60);ring(BPOS.e[0],BPOS.e[1],'#80ffa0',22,10,60);await bsay(B.tr.name+' used a Patch Kit+!');await syncHP();return;}
  if(a.type==='eswitch'){const old=BOTS[u.id].name;await bsay(B.tr.name+' withdrew '+old+'!');B.anim.eHide=true;await bwait(10);const t=B.ep[B.ei];B.ep[B.ei]=B.ep[a.to];B.ep[a.to]=t;B.anim.eHide=false;await deployE();return;}
  if(u.st){const k=u.st.k;
    if(k==='sleep'){u.st.t--;if(u.st.t<=0){u.st=null;await bsay(bname(side)+' rebooted from sleep mode!');}else{await bsay(bname(side)+' is in sleep mode.');return;}}
    else if(k==='freeze'){if(Math.random()<0.25){u.st=null;await bsay(bname(side)+' thawed out!');}else{await bsay(bname(side)+' is frozen solid!');return;}}
    else if(k==='shock'){if(Math.random()<0.25){burst(BPOS[side][0],BPOS[side][1],'#fff6a0',10,2,2);await bsay(bname(side)+' is shocked! It can\'t move!');return;}}
    else if(k==='glitch'){u.st.t--;if(u.st.t<=0){u.st=null;await bsay(bname(side)+'\'s systems stabilized!');}
      else{await bsay(bname(side)+' is glitching!');if(Math.random()<0.33){const dmg=Math.max(1,Math.floor(((2*u.lv/5+2)*40*stats(u).atk/stats(u).def)/50+2));u.hp=Math.max(0,u.hp-dmg);B.anim[side==='p'?'hitP':'hitE']=18;dmgNumber(side,'-'+dmg);Snd.sfx('hit');await bsay('It hit itself in the confusion!');await syncHP();return;}}}}
  const tside=side==='p'?'e':'p';const t=cur(tside);
  if(a.type==='vent'){B.heat[side]=traitId(u)==='frostling'?0:a.forced?25:Math.max(0,B.heat[side]-55);B.over[side]=false;bfxAdd({max:30,draw(tt){const [x,y]=BPOS[side];ctx.fillStyle='rgba(220,240,255,'+(1-tt)+')';for(let i=0;i<8;i++){ctx.beginPath();ctx.arc(x-40+i*12,y-tt*50-i%3*8,6+tt*6,0,7);ctx.fill();}}});Snd.sfx('push');
    await bsay(bname(side)+(a.forced?' is overheated and has to vent!':' vents its heat.'));return;}
  let mv,name,mid=null;
  if(a.type==='link'){const pt=partnerOf(side);const lt=linkType(u,pt);if(!pt||!lt){await bsay('The link failed!');return;}B.linkUsed[side]=true;mv={n:'Link Strike',t:lt,p:130,a:0};name=mv.n;
    await bsay(bname(side)+' and '+BOTS[pt.id].name+' sync their '+lt+' shards!');B.anim[side==='p'?'lungeP':'lungeE']=1;await moveFx(lt,side,tside);}
  else if(a.type==='od'){B.odUsed[side]=true;B.od[side]=0;const ty=odType(u,t);mv={n:OD_NAMES[ty],t:ty,p:110,a:0};name=mv.n;
    await bsay(bname(side)+' is in OVERDRIVE!');await odCinematic(side,ty);}
  else{mid=a.mid||(u.moves[a.mi]||u.moves[0]).id;const base=MOVES[mid];mv=Object.assign({},base,{t:moveType(u,mid)});name=mv.n;}
  if(a.type==='move')await bsay(bname(side)+' used '+name+'!');
  if(mid){const hc=heatCost(u,mid);if(mv.t==='Frost')B.heat[side]=Math.max(0,B.heat[side]-12);else B.heat[side]+=hc;}
  B.anim[side==='p'?'lungeP':'lungeE']=1;await bwait(6);
  if(mv.a&&Math.random()*100>=mv.a){await bsay('But it missed!');if(B.heat[side]>=100){B.over[side]=true;B.heat[side]=100;await bsay(bname(side)+' OVERHEATED!');}return;}
  const e=mv.e||{};
  if(mv.p){if(a.type!=='link')await moveFx(mv.t,side,tside,false);
    if(traitId(t)==='dripcell'&&mv.t==='Volt'){const mx=stats(t).hp;const h=Math.max(1,Math.floor(mx/4));t.hp=Math.min(mx,t.hp+h);dmgNumber(tside,'+'+h,'#60f090');await syncHP();await bsay(bname(tside)+'\'s Volt Sink absorbed the charge!');return;}
    const A=stats(u),D=stats(t);let at=A.atk*stageM(B.st[side].atk)*gear(u,'atk');if(a.type==='link'){const pt=partnerOf(side);if(pt)at=(at+stats(pt).atk)/2;}if(u.st&&u.st.k==='burn')at*=0.5;const df=D.def*stageM(B.st[tside].def)*gear(t,'def');
    const ef=typeEff(mv.t,BOTS[t.id].types);const stab=BOTS[u.id].types.includes(mv.t)?1.5:1;const crit=Math.random()<1/16;
    let m=stab*ef*(crit?1.5:1)*(0.85+Math.random()*0.15)*((WMULT[B.wx]||{})[mv.t]||1);
    if(traitId(u)==='flicker'&&mv.t==='Flame'&&u.hp<stats(u).hp/3)m*=1.5;
    if((u.refined||[]).includes(mv.t))m*=1.1;
    if(traitId(u)==='kilnfly'&&mv.t==='Gale')m*=1.3;
    if(traitId(t)==='thornbit'&&ef>1)m*=0.75;
    const fullHP=t.hp>=stats(t).hp;if(traitId(t)==='pebblit'&&fullHP)m*=0.5;
    let dmg=Math.max(1,Math.floor((((2*u.lv/5+2)*mv.p*at/df)/50+2)*m));
    const before=t.hp;dmg=Math.min(dmg,t.hp);t.hp-=dmg;B.anim[tside==='p'?'hitP':'hitE']=18;Snd.sfx(crit?'crit':ef>1?'super':'hit');
    B.flash=a.type==='od'?20:6;B.flashCol=TCOL[mv.t]+(a.type==='od'?'':'55');if(crit||a.type==='od')B.shake=a.type==='od'?18:12;else if(ef>1)B.shake=6;
    dmgNumber(tside,'-'+dmg,crit?'#ffe060':ef>1?'#ff6060':'#ffffff',crit||a.type==='od');if(crit)dmgNumber(tside,'CRIT!','#ffe060',true);
    const gainU=(resonant(u)?1.25:1)*partOD(u),gainT=(resonant(t)?1.25:1)*partOD(t);
    B.od[side]=Math.min(100,B.od[side]+dmg/stats(t).hp*55*gainU);if(!B.odUsed[tside])B.od[tside]=Math.min(100,B.od[tside]+dmg/stats(t).hp*75*gainT);
    await syncHP();
    if(crit)await bsay('A critical hit!');if(ef>1)await bsay('It\'s super effective!');else if(ef<1)await bsay('It\'s not very effective...');
    if(traitId(t)==='pebblit'&&fullHP)await bsay(bname(tside)+'\'s Bulwark softened the blow!');
    if(e.drain&&u.hp>0){const h=Math.max(1,Math.floor(dmg*e.drain));u.hp=Math.min(stats(u).hp,u.hp+h);dmgNumber(side,'+'+h,'#60f090');await syncHP();await bsay(bname(side)+' drained energy!');}
    if(u.mod==='overclock'&&u.hp>0){const rc=Math.max(1,Math.floor(dmg*0.1));u.hp=Math.max(0,u.hp-rc);dmgNumber(side,'-'+rc,'#ffa040');await syncHP();await bsay(bname(side)+' took recoil from its Overclock Chip!');}
    if(t.hp>0){const tt=traitId(t);
      if(tt==='boltbun'&&!u.st&&!BOTS[u.id].types.includes('Volt')&&Math.random()<0.3){u.st={k:'shock',t:0};burst(BPOS[side][0],BPOS[side][1],'#fff6a0',12,2.4,2);await bsay(bname(tside)+'\'s Static Skin shocked '+bname(side)+'!');}
      if(tt==='sporelet'&&!u.st&&Math.random()<0.2){u.st={k:'sleep',t:2+rnd(2)};await bsay(bname(tside)+'\'s Spore Cloud put '+bname(side)+' into sleep mode!');}
      if(tt==='gearpup'&&!B.rally[t.uid]&&before>=stats(t).hp/2&&t.hp<stats(t).hp/2){B.rally[t.uid]=1;B.st[tside].atk=Math.min(6,B.st[tside].atk+1);arrows(tside,'#e8504a',true);await bsay(bname(tside)+'\'s Rally Protocol raised its ATK!');}}
    if(t.hp<=0)return;}
  if(B.heat[side]>=100&&!B.over[side]&&u.hp>0){B.over[side]=true;B.heat[side]=100;Snd.sfx('wrong');burst(BPOS[side][0],BPOS[side][1],'#ff5030',16,2.4,3);await bsay(bname(side)+' OVERHEATED! It must vent next turn.');}
  if(e.st){if(e.c<100&&Math.random()*100>=e.c){}else if(t.st){if(!mv.p)await bsay('But it failed!');}
    else if((e.st==='burn'&&BOTS[t.id].types.includes('Flame'))||(e.st==='freeze'&&BOTS[t.id].types.includes('Frost'))||(e.st==='shock'&&BOTS[t.id].types.includes('Volt'))){if(!mv.p)await bsay('It doesn\'t affect '+bname(tside)+'...');}
    else{if(!mv.p)await moveFx(mv.t,side,tside,false);t.st={k:e.st,t:e.st==='sleep'?2+rnd(3):e.st==='glitch'?2+rnd(3):0};
      const msg={burn:' was burned!',freeze:' was frozen solid!',shock:' was shocked! It may be unable to move!',corrode:' started corroding!',sleep:' went into sleep mode!',glitch:' started glitching!'}[e.st];await bsay(bname(tside)+msg);}}
  if(e.stat&&!(e.c&&Math.random()*100>=e.c)){const sd=e.self?side:tside;const stg=B.st[sd];const list=[e.stat];if(e.stat2)list.push(e.stat2);
    arrows(sd,e.s>0?'#60e0ff':'#ff6080',e.s>0);await bwait(14);
    for(const s of list){const bf=stg[s];stg[s]=clamp(stg[s]+e.s,-6,6);const nm={atk:'ATK',def:'DEF',spd:'SPD'}[s];
      if(bf===stg[s])await bsay(bname(sd)+'\'s '+nm+' won\'t go any '+(e.s>0?'higher':'lower')+'!');
      else await bsay(bname(sd)+'\'s '+nm+(Math.abs(e.s)>1?' sharply':'')+(e.s>0?' rose!':' fell!'));}}}

async function resolveFaints(){const B=BT;
  const e=cur('e'),p=cur('p');
  if(e.hp<=0){Snd.sfx('faint');burst(BPOS.e[0],BPOS.e[1],'#ffd0a0',20,3,3,30);for(let i=0;i<=15;i++){B.anim.eFaint=i/15;await wait(1);}B.anim.eHide=true;
    await bsay(bname('e')+' shut down!');
    if(p.hp>0&&traitId(p)==='scrapmite'&&p.hp<stats(p).hp){const h=Math.max(1,Math.floor(stats(p).hp/8));p.hp=Math.min(stats(p).hp,p.hp+h);dmgNumber('p','+'+h,'#60f090');await bsay(bname('p')+'\'s Salvager recovered some HP!');await syncHP();}
    await giveXP(e);
    if(B.wild){const ty=BOTS[e.id].types[0];
      if(Math.random()<0.35){addItem('scrap',1);await bsay('Recovered 1 Scrap from the wreck.');}
      if(ty!=='Core'&&Math.random()<0.12){addItem('shard_'+ty,1);Snd.sfx('item');await bsay(BOTS[e.id].name+' dropped a '+ty+' Shard!');}
      if(Math.random()<0.06){const pt=pick(Object.keys(PARTS));addItem(pt,1);Snd.sfx('item');await bsay('You salvaged a '+PARTS[pt].n+' from the wreck!');}
      if(G.vault){G.vault.kills=(G.vault.kills||0)+1;}return 'win';}
    if(B.ei<B.ep.length-1){B.ei++;B.od.e=Math.min(B.od.e,60);B.anim.eFaint=0;await deployE();B.part=new Set([cur('p').uid]);
      if(cur('p').hp<=0)return await resolveFaints();return false;}
    return 'win';}
  if(p.hp<=0){Snd.sfx('faint');for(let i=0;i<=15;i++){B.anim.pFaint=i/15;await wait(1);}
    await bsay(BOTS[p.id].name+' shut down!');B.anim.pFaint=0;
    if(!G.party.some(b=>b.hp>0))return 'lose';
    let t=-1;B.pHide=true;while(t<0){t=await openParty({mode:'switch',forced:1});}
    B.pi=t;B.st.p={atk:0,def:0,spd:0};B.heat.p=0;B.over.p=false;B.disp.p=cur('p').hp;B.part.add(cur('p').uid);B.pHide=false;Snd.chirp(BOTS[cur('p').id].frame);await bsay('Go, '+BOTS[cur('p').id].name+'!');await onEnter('p');return false;}
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
  B.flash=10;B.flashCol='rgba(80,230,255,.8)';B.anim.eHide=true;ring(360,90,'#40e0ff',20,4,50);await wait(20);
  const d=BOTS[e.id];const hr=e.hp/stats(e).hp;let sm=1;if(e.st)sm=['sleep','freeze'].includes(e.st.k)?2:1.5;
  const chance=clamp((d.cr*(1-0.66*hr)*ITEMS[item].spike*sm)/255+0.03,0.02,0.98);
  const ok=Math.random()<chance;const shakes=ok?3:(chance>0.5?rnd(3)+1:rnd(3));
  for(let i=0;i<shakes;i++){Snd.sfx('shake');for(let k=0;k<16;k++){B.anim.spike.wob=Math.sin(k/16*Math.PI*2)*0.5;await wait(1);}B.anim.spike.wob=0;await wait(18);}
  if(ok){Snd.jingle('victory',curMap().music);burst(360,90,'#ffe080',20,3,3,30);await bsay('Reboot complete! '+(e.glitch?'✦ ':'')+d.name+' is now linked to you!');B.anim.spike=null;
    G.caught[e.id]=1;if(e.glitch)G.glitchCaught=(G.glitchCaught||0)+1;seen(e.id);e.st=null;if(G.party.length<6){G.party.push(e);}else{G.storage.push(e);await bsay(d.name+' was sent to the storage terminal.');}
    return true;}
  B.anim.spike=null;B.anim.eHide=false;B.flash=8;await bsay(['Oh no! It broke free!','Argh! Almost had it!','Gah! So close!'][Math.min(2,shakes)]);return false;}

// ---------- sockets / evolution ----------
async function processSockets(){while(G.pendSock.length){const uid=G.pendSock.shift();const b=G.party.find(x=>x.uid===uid)||G.storage.find(x=>x.uid===uid);if(!b)continue;
  await say(BOTS[b.id].name+'\'s SOCKET 2 has opened!');await socketMenu(b,true);}}
function branchList(b){const fr=BOTS[BOTS[b.id].frame];return Object.entries(fr.branches||{});}
const ownShard=s=>(G.bag['shard_'+s]||0)+(G.bag['rshard_'+s]||0);
function takeShard(s,preferRefined){const k=preferRefined&&G.bag['rshard_'+s]?'rshard_'+s:G.bag['shard_'+s]?'shard_'+s:'rshard_'+s;G.bag[k]--;if(!G.bag[k])delete G.bag[k];return k.startsWith('rshard');}
function previewW(b,to,s){const nb=Object.assign({},b,{id:to});const s1=stats(b),s2=stats(nb);const newMoves=BOTS[to].learn.filter(([l])=>l===0).map(([,m])=>MOVES[m].n);
  return{update(){},draw(){ctx.fillStyle='rgba(6,10,18,.9)';ctx.fillRect(0,0,W,H);panel(8,8,464,218);
    ctx.drawImage(bspr(b),24,24,110,110);ctx.drawImage(bspr(nb),250,16,130,130);ptri(ctx,[170,70,190,80,170,90],'#606870');txt('+ '+s,152,110,shade(TCOL[s],-0.3),20);
    txt(BOTS[b.id].name,30,154,'#303840',20);txt(BOTS[to].name,252,154,'#303840',22);typeBadges(BOTS[to].types,252,160,1);
    [['HP','hp'],['ATK','atk'],['DEF','def'],['SPD','spd']].forEach(([l,k],i)=>{const y=196+Math.floor(i/2)*22,x=30+(i%2)*110;const d=s2[k]-s1[k];txt(l+' '+s1[k]+'→'+s2[k],x,y,'#303840',18);txt((d>=0?'+':'')+d,x+96,y,d>0?'#20a040':'#c04030',16,'right');});
    txt('New: '+(newMoves.join(', ')||'—'),252,196,'#606870',17);txt('Trait: '+trait(b).n,252,216,'#606870',17);}};}
async function socketMenu(b,fromLevel){const d=BOTS[b.id];
  if(d.legend){await say('This bot\'s sockets are sealed.');return;}
  if(d.stage===0&&b.lv<16){const br=branchList(b);await say('Socket 2 opens at Lv 16. Compatible shards: '+br.map(([s])=>s).join(', ')+'.');return;}
  if(d.stage===0){const br=branchList(b);
    const have=br.filter(([s])=>ownShard(s)>0);
    if(!have.length){await say('No compatible shard in your bag. '+d.name+' accepts: '+br.map(([s])=>s).join(', ')+'. Fit one later from the BOTS menu.');return;}
    const opts=have.map(([s,f])=>s+' (x'+ownShard(s)+(G.bag['rshard_'+s]?', refined':'')+') → '+(G.seen[f]?BOTS[f].name:'???'));opts.push('Not now');
    const i=await ask('Fit which shard into '+d.name+'\'s Socket 2?',opts,{cancel:true});if(i<0||i>=have.length)return;
    const [s,f]=have[i];const pv=previewW(b,f,s);UI.push(pv);
    const c=await ask('Fit the '+s+' Shard? '+d.name+' evolves into '+BOTS[f].name+'. (One swap allowed later.)',['Fit it','Cancel'],{y:236-80});UI.splice(UI.indexOf(pv),1);if(c!==0)return;
    let ref=false;if(G.bag['rshard_'+s]&&G.bag['shard_'+s]){ref=(await ask('Use the Refined '+s+' (moves +10%) or a normal shard?',['Normal','Refined']))===1;}else ref=!G.bag['shard_'+s];
    takeShard(s,ref);if(ref)b.refined=[s];await evolve(b,f,s);return;}
  if(d.stage===1){const others=branchList(b).filter(([s])=>s!==d.shard);
    if(b.swaps<=0){await say(d.name+'\'s Socket 2 is locked with a '+(b.refined&&b.refined.includes(d.shard)?'Refined ':'')+d.shard+' Shard. Socket 3 opens at Lv 36 (coming in a later chapter).');return;}
    const opts=others.map(([s,f])=>'Swap to '+s+' (x'+ownShard(s)+') → '+(G.seen[f]?BOTS[f].name:'???'));opts.push('Keep current');
    const i=await ask(d.name+' has a '+d.shard+' Shard. Swaps left: '+b.swaps+'. Swap it?',opts);if(i<0||i>=others.length)return;
    const [s,f]=others[i];if(!ownShard(s)){await say('You don\'t have a '+s+' Shard.');return;}
    const base=Object.assign({},b,{id:BOTS[b.id].frame});const pv=previewW(base,f,s);UI.push(pv);
    const c=await ask('Swap to the '+s+' Shard? This uses your only swap and locks the socket.',['Swap','Cancel'],{y:236-80});UI.splice(UI.indexOf(pv),1);if(c!==0)return;
    const wasRef=(b.refined||[]).includes(d.shard);addItem((wasRef?'rshard_':'shard_')+d.shard,1);const ref=takeShard(s,false);b.refined=ref?[s]:[];b.swaps=0;
    b.shards.pop();await evolve(b,f,s);}}
async function evolve(b,to,shard){const from=b.id;const hpR=b.hp/stats(b).hp;
  await pushUI(evoScene(from,to,b.glitch));
  b.id=to;if(b.shards.length<2)b.shards.push(shard);else b.shards[1]=shard;b.hp=Math.max(1,Math.round(stats(b).hp*hpR));seen(to);G.caught[to]=1;
  Snd.jingle('victory',curMap().music);await say('Socket fitted! '+BOTS[from].name+' evolved into '+BOTS[to].name+'!');
  for(const [l,m] of BOTS[to].learn)if(l===0)await learnMove(b,m);
  await checkDexRewards();}
function evoScene(from,to,gl){Snd.music('evo',true);return{t:0,update(){this.t++;if(this.t>260||(press('b')&&this.t>40)){popUI(this);}},
  draw(){ctx.fillStyle='#0a0c18';ctx.fillRect(0,0,W,H);const t=this.t;const col=TCOL[BOTS[to].shard]||'#fff';
    for(let i=0;i<40;i++){const a=i/40*7+t/40;const r=80+Math.sin(t/20+i)*30;ctx.fillStyle=col;ctx.globalAlpha=0.5;ctx.fillRect(W/2+Math.cos(a)*r,140+Math.sin(a)*r*0.6,3,3);}ctx.globalAlpha=1;
    const period=Math.max(4,40-t/6);const showTo=t>220||(t>60&&Math.floor(t/period)%2);
    const sp=botSprite(showTo?to:from,{sil:t>60&&t<220,glitch:gl});ctx.drawImage(sp,W/2-80,60,160,160);
    if(t>215&&t<235){ctx.fillStyle='rgba(255,255,255,'+(1-(t-215)/20)+')';ctx.fillRect(0,0,W,H);}
    panel(4,252,472,64);txt(t<220?'The shard is resonating...':'Evolution complete!',22,290);}};}
