// ===================== EXT: field abilities, secrets, jobs, tracker, tips, combos, bosses, arcs, postgame, polish =====================
// ---------- 40: first-time tips ----------
const TIPS={tide:'TIDES: grey flats are only walkable at low tide. Watch the TIDE gauge. The sea sweeps you back if it catches you.',gust:'WIND: gust tiles blow you to the end of the line. Pick where you jump in.',
 heat:'HEAT BAND: drains your bots each step unless your lead is Flame or Tide (or wears a Coolant Fin).',cold:'FROST BAND: cracks your bots each step unless your lead is Flame or Frost (or wears a Plating Kit).',
 belt:'CONVEYORS: belts carry you. Levers reverse every belt on the floor.',vent:'STEAM VENTS: they glow orange right before they blast. Wait on the safe rows.',ice:'ICE: once you slide, you keep going until something stops you.',
 accord:'ACCORD ZONE: near the Heartforge your bots may freeze up for a turn. Bring backups.',door:'SEALED MAKER DOOR: a Volt bot in your party can power it open.',boulder:'BOULDER: a Stone bot in your party can shove it aside.',
 hidden:'Faint marks on the water... A Shade bot in your party might see a path here at night.',heatbattle:'HEAT: every move builds Heat. Past 100 your bot overheats and must vent. Frost moves cost nothing.',rough:'ROUGH SEA: only the Icebreaker Skiff can cross it.'};
function tip(k){if(!TIPS[k]||flag('tip_'+k))return;setFlag('tip_'+k);G.tipShow={text:TIPS[k],t:480};}
function drawTip(){const t=G.tipShow;if(!t||t.t<=0)return;t.t--;const lines=wrap(t.text,400).slice(0,3);const h=lines.length*20+20;ctx.globalAlpha=Math.min(1,t.t/30,(480-t.t)/10+0.2);
 panel(40,BT?6:H-h-60,400,h,'#fffbe8');lines.forEach((l,i)=>txt(l,56,(BT?6:H-h-60)+24+i*20,'#403020',16));ctx.globalAlpha=1;}
// ---------- 9: field abilities (Volt doors, Stone boulders, Shade paths) ----------
const hasType=t=>G.party.some(b=>b.hp>0&&allTypes(b).includes(t));
const opened=(x,y)=>flag('open_'+G.map+'_'+x+'_'+y);
function shadeSees(){return hasType('Shade')&&((curWeather().dark||0)>=0.3||curMap().theme==='cave');}
{const _T=T;T=function(x,y){const c=_T(x,y);if(c==='¤'||c==='§'){if(opened(x,y))return curMap().outdoor?'.':'x';}return c;};}
SOLID.add('¤');SOLID.add('§');
{const _ts=tileSolid;tileSolid=function(ch){if(ch==='·')return !shadeSees();return _ts(ch);};}
{const _ta=tileArt;tileArt=function(ch,th,v,fr){if(!'¤§·'.includes(ch)||th==='outw')return _ta(ch,th,v,fr);const key=ch+th+v+fr;if(TCACHE[key])return TCACHE[key];const c=mkCanvas(32,32);const g=c.getContext('2d');g.scale(2,2);
  if(ch==='¤'){R(g,0,0,16,16,'#3a4250');R(g,1,1,14,15,'#22303e');R(g,2,2,12,13,'#2e3a4a');R(g,7,2,2,13,'#141c28');R(g,5,6,6,4,'#0c1018');R(g,6,7,4,2,fr?'#ffd040':'#806020');R(g,1,0,14,1,'#6a7688');}
  else if(ch==='§'){grass(g,v);pell(g,8,10,7,6,'#5e5a62');pell(g,7,8,5,4,'#7a7680');R(g,5,6,3,1,'#9a96a0');R(g,3,14,10,1,'#3a363e');}
  else{R(g,0,0,16,16,'#3a6890');R(g,(fr?4:2),6,4,3,'rgba(160,120,255,.35)');R(g,(fr?10:9),2,3,2,'rgba(160,120,255,.25)');}
  TCACHE[key]=c;return c;};}
{const _fs=fieldSkill;fieldSkill=async function(ch,x,y){if(ch==='¤'){if(!hasType('Volt')){tip('door');await say('A sealed Maker door. Its lock is dead. Some electricity might wake it.');return true;}
    const b=G.party.find(b=>allTypes(b).includes('Volt'));if((await ask(BOTS[b.id].name+' can feed the lock some current. Try it?'))!==0)return true;Snd.sfx('switch');burstOW(x,y,'#ffe040');setFlag('open_'+G.map+'_'+x+'_'+y);buildTileOv&&buildTileOv();MFX.key='';collectLights();await say('The lock sparks, whirs, and the door slides into the wall.');return true;}
  if(ch==='§'){if(!hasType('Stone')){tip('boulder');await say('A huge boulder. Something heavy and stubborn could move it.');return true;}
    const b=G.party.find(b=>allTypes(b).includes('Stone'));if((await ask(BOTS[b.id].name+' could shove it aside. Go for it?'))!==0)return true;Snd.sfx('push');G.shake=12;setFlag('open_'+G.map+'_'+x+'_'+y);MFX.key='';await say('With a grinding roar, the boulder rolls away.');return true;}
  return _fs(ch,x,y);};}
{const _ip=interact;interact=async function(){const [dx,dy]=DIRS[G.pdir];const ch=T(G.px+dx,G.py+dy);if((ch==='¤'||ch==='§')&&!G.busy){G.busy=true;try{await fieldSkill(ch,G.px+dx,G.py+dy);}finally{G.busy=false;}return;}return _ip();};}
// ---------- 12: secret places ----------
function secretMap(name,theme,grid,ret,extra){return Object.assign({name,theme,music:'cave',dungeon:1,outdoor:theme==='cave'?1:0,grid,warps:[{x:grid[grid.length-1].indexOf('e')>=0?grid[grid.length-1].indexOf('e'):grid[grid.length-1].indexOf('K'),y:grid.length-1,to:ret.map,tx:ret.x,ty:ret.y,dir:'down'}],npcs:[],objs:[]},extra);}
function editGrid(m,edits){m.grid=m.grid.map(r=>r.split(''));for(const [x,y,c] of edits)m.grid[y][x]=c;m.grid=m.grid.map(r=>r.join(''));m._encT=null;}
(function(){
 // Brasston mine -> Maker workshop (Volt door)
 {const m=MAPS.brasston;const [x,y]=C1('brasston','mine');editGrid(m,[[x,y,'¤']]);m.warps.push({x,y,to:'sec_mine',tx:6,ty:7});delete (m.tileScripts||{})[x+','+y];}
 MAPS.sec_mine=secretMap('Sealed Maker Forge','factory',['XXXXXXXXXXXXX','XM7xxxxxx79MX','XxxxxxxxxxxxX','Xxx&xxxxx&xxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XXXXXXeXXXXXX'],{map:'brasston',x:C1('brasston','mine')[0],y:C1('brasston','mine')[1]+1},
  {objs:[{type:'item',id:'sm1',x:6,y:2,item:'rshard_Volt'},{type:'item',id:'sm2',x:2,y:6,item:'arm_cannon'},{type:'log',log:'log9',x:10,y:5,run:readLog}],enc:{tile:'x',count:3,list:[['cogwyrm',14,16,60],['scrapmite',12,14,40]]}});
 // Mirrorlake -> sunken lab behind a boulder (Stone)
 {const m=MAPS.route2;editGrid(m,[[32,16,'K'],[32,17,'§'],[31,16,'T'],[32,15,'T']]);m.warps.push({x:32,y:16,to:'sec_lab',tx:6,ty:7});}
 MAPS.sec_lab=secretMap('Sunken Maker Lab','lab',['XXXXXXXXXXXXX','XMMx@xxx9MMMX','Xxx~~~xxxxxxX','Xxx~~~xx7xxxX','XxxxxxxxxxxxX','Xx&xxxxxxx&xX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XXXXXXeXXXXXX'],{map:'route2',x:32,y:18},
  {objs:[{type:'item',id:'sl1',x:10,y:2,item:'rshard_Tide'},{type:'item',id:'sl2',x:2,y:7,item:'core_amp'},{type:'log',log:'log10',x:7,y:5,run:readLog}]});
 // Galecrest -> sky ruin through a dead cable lift (Volt)
 {const m=MAPS.galecrest;editGrid(m,[[21,5,'¤']]);m.warps.push({x:21,y:5,to:'sec_ruin',tx:6,ty:7});}
 MAPS.sec_ruin=secretMap('Sky Ruin','nave',['XXXXXXXXXXXXX','XxxxxMxMxxxxX','XxxxxxxxxxxxX','XxCCxxxxxCCxX','XxCCxxxxxCCxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XXXXXXeXXXXXX'],{map:'galecrest',x:20,y:5},
  {objs:[{type:'item',id:'sr1',x:6,y:2,item:'rshard_Gale'},{type:'item',id:'sr2',x:11,y:7,item:'leg_thrusters'},{type:'log',log:'log11',x:1,y:2,run:readLog}],enc:{tile:'x',count:3,list:[['squallkite',32,35,60],['tempestwing',33,35,40]]}});
 // Saltwind Shore -> Shade path over the water to a hidden grotto (Shade bot, at night)
 {const m=MAPS.route5;editGrid(m,[[5,13,'·'],[5,14,'·'],[5,15,'K']]);m.warps.push({x:5,y:15,to:'sec_grotto',tx:6,ty:7});}
 MAPS.sec_grotto=secretMap('Moonlit Grotto','cave',['%%%%%%%%%%%%%','%^^^%%%%^^^^%','%^^^^^^^^^^^%','%^^%%^^%%^^^%','%^^^^^^^^^^^%','%%^^^^^^^^^%%','%^^^^^^^^^^^%','%^^^^^^^^^^^%','%%%%%%K%%%%%%'],{map:'route5',x:5,y:12},
  {objs:[{type:'item',id:'sg1',x:2,y:1,item:'rshard_Shade'},{type:'item',id:'sg2',x:11,y:1,item:'nanites'},{type:'log',log:'log12',x:6,y:3,run:readLog}],enc:{tile:'^',count:4,list:[['cinderwisp',26,28,50],['gloomlamp',26,28,30],['nightglider',27,28,20]]}});
})();
if(!ITEMS.rshard_Shade&&ITEMS.rshard_Tide)ITEMS.rshard_Shade=Object.assign({},ITEMS.rshard_Tide,{n:'Refined Shade Shard',shard:'Shade'});
// ---------- 23: Maker logs from the Makers' point of view ----------
Object.assign(LOGS,{log9:'MAKER LOG 12: "Day one in the new forge. Ida built a bot that hums when it\'s happy. We are not supposed to give them moods. I let it keep the hum."',
 log10:'MAKER LOG 58: "The lake keeps freezing over the lab windows. Ilsa says we built too far north. I say the cold keeps the cores honest."',
 log11:'MAKER LOG 144: "From up here you can see the whole peninsula. We made all of it. I wonder if the bots will remember us when we\'re gone."',
 log12:'MAKER LOG 207: "Some bots come here at night and just sit by the water. Nobody programmed that. Nobody can explain it. I hope nobody ever does."',
 log13:'MAKER LOG 260: "The crater ship was ours. It fell carrying the first frames. We built Ashgrove around the wreck so we would never forget."',
 log14:'MAKER LOG 512: "We are leaving. The bots will stay. We wrote the Accord to protect them from the titan, and from us. I hope it is enough. I hope it is not forever."'});
(function(){const add=(id,x,y,log)=>(MAPS[id].objs=MAPS[id].objs||[]).push({type:'log',log,x,y,run:readLog});add('route1',20,15,'log13');add('voltmere',22,6,'log14');})();
{const _rl=readLog;readLog=async function(o){await _rl(o);const tot=Object.keys(LOGS).length;const n=Object.keys(G.logs||{}).length;if(n<tot&&n>=4)G.errToast={t:110,msg:'Maker Logs: '+n+'/'+tot};
  if(n>=tot&&!flag('allLogs')){setFlag('allLogs');addItem('rshard_Spirit',1);await say('Every Maker Log recovered. A hidden compartment in the terminal opens: a Refined Spirit Shard!');}};}
// ---------- 8: refresh Chapter 2 towns ----------
(function(){editGrid(MAPS.ferrow,[[18,1,'N'],[19,1,'N'],[20,1,'N'],[21,1,'N'],[19,2,'N'],[20,2,'J'],[21,2,'N'],[3,1,'Z'],[4,1,'Z'],[3,6,'j'],[4,6,'j'],[5,6,'j'],[6,6,'j'],[3,7,'j'],[4,7,'j'],[5,7,'j'],[21,6,'Z'],[21,14,'Z'],
  ...[2,3,4,5,6,7,8,9].map(x=>[x,16,'G']),...[16,17,18,19,20,21].map(x=>[x,16,'G']),[8,11,'l'],[17,12,'l']]);
 const k=MAPS.kilnhaven;editGrid(k,[[18,15,'*'],[21,15,'*'],[19,16,'j'],[20,16,'j'],[2,2,'Z'],[21,2,'*'],[21,6,'*'],...[3,4,5,6,7,8,9,10,11,12].map(x=>[x,16,'d']),[14,16,'d'],[15,16,'d']]);})();
// ---------- 10: weather that matters ----------
WMULT.rain={Tide:1.25,Flame:0.8,Volt:1.1};WMSG.rain='Rain is pouring! Tide moves are stronger, Flame moves weaker, and Volt moves crackle.';WMULT.static.Gale=1.1;
// ---------- 11: ferals react to the hour, the weather and your team ----------
const NIGHT_BOTS=['gloomlamp','cinderwisp','rotcap','phantide','nightglider'],RAIN_BOTS=['dripcell','brinejaw','drizzlet'];
{const _el=encList;encList=function(ch){const l=_el(ch).map(e=>e.slice());const dark=(curWeather().dark||0)>=0.4,rain=rainNow()>0.2;
  for(const e of l){const fr=BOTS[e[0]].frame;if(NIGHT_BOTS.includes(fr))e[3]=Math.round(e[3]*(dark?3:0.4));if(RAIN_BOTS.includes(fr)&&rain)e[3]*=2;}return l.filter(e=>e[3]>0);};}
{const _so=spawnOne;spawnOne=function(far){const f=_so(far);if(f){const b=lead();if(b&&FERAL_BEH[BOTS[b.id].frame]==='hunt'&&f.beh==='wander'&&!f.alpha)f.beh='flee';}return f;};}
// ---------- 15: balance (catch-up XP) + Hard Mode ----------
const WARDEN_LV=[12,18,25,28,32,35,44,48,55];
function nextWardenLv(){let n=0;for(let i=1;i<=8;i++)if(flag('badge'+i))n=i;return WARDEN_LV[n];}
function xpCatchUp(){if(G.hard)return 1;const parts=G.party.filter(b=>b.hp>0);if(!parts.length)return 1;const avg=parts.reduce((a,b)=>a+b.lv,0)/parts.length;const gap=nextWardenLv()-2-avg;return gap>6?2:gap>2?1.5:1;}
{const _rb=runBattle;runBattle=async function(o){if(o&&o.trainer&&G.hard&&!o.trainer._hard){const t=Object.assign({},o.trainer,{_hard:1});const up=t.warden?4:2;t.team=t.team.map(([id,lv])=>[id,lv+up]);t.items=(t.items||0)+(t.warden?1:0);o=Object.assign({},o,{trainer:t});}
  tip('heatbattle');return _rb(o);};}
function onBattleStart(B){if(G.tuned){B.od.p=25;G.tuned=false;B.tunedMsg=1;}if(B.rain>0.2&&!['night','static','blizzard','indoor'].includes(B.wx))B.wx='rain';if(B.boss)B.plates=3;B.turnN=0;if(B.tr&&WSTYLE[B.tr.name]){B.style=WSTYLE[B.tr.name];if(B.style==='frost')B.wx='blizzard';}}
// ---------- 17: Warden fighting styles ----------
const WSTYLE={Maren:'tide','Pell-Ashe':'switcher',Yoru:'frost','Spirit Warden':'accord',Brakka:'wall',Cantor:'switcher'};
{const _bt=battleTurn;battleTurn=async function(){const B=BT;if(B){B.turnN=(B.turnN||0)+1;if(B.style==='tide'&&B.turnN%3===0)await bsay('HIGH TIDE! Maren\'s Tide moves surge this turn!');}return _bt();};}
{const _ec=enemyChoose;enemyChoose=function(){const B=BT;const e=cur('e'),p=cur('p');
  if(B.style==='switcher'&&!B.wild&&Math.random()<0.35){const bad=p.moves.some(m=>MOVES[m.id].p&&typeEff(moveType(p,m.id),BOTS[e.id].types)>1);if(bad){for(let j=0;j<B.ep.length;j++){if(j===B.ei||B.ep[j].hp<=0)continue;const ok=!p.moves.some(m=>MOVES[m.id].p&&typeEff(moveType(p,m.id),BOTS[B.ep[j].id].types)>1);if(ok)return{type:'eswitch',to:j};}}}
  if(B.style==='wall'&&e.hp<stats(e).hp*0.45&&B.eItems<=0&&!B.wallUsed){B.wallUsed=1;return{type:'eheal'};}
  return _ec();};}
{const _da3=doAction;doAction=async function(side,a){if(side==='p'&&BT&&BT.style==='accord'&&a&&a.type==='move'&&Math.random()<0.12){Snd.sfx('glitch');await bsay('The Spirit Warden hums an old Maker command. '+BOTS[cur('p').id].name+' hesitates!');return;}return _da3(side,a);};}
// ---------- 18: combo moves for specific type pairs ----------
const COMBOS=[[['Flame','Tide'],'Steam Burst','Tide'],[['Volt','Tide'],'Arc Flood','Volt'],[['Frost','Gale'],'Whiteout','Frost'],[['Stone','Iron'],'Landslide Forge','Stone'],[['Shade','Spirit'],'Eclipse','Spirit'],
 [['Flame','Gale'],'Firestorm','Flame'],[['Bloom','Tide'],'Overgrowth','Bloom'],[['Volt','Iron'],'Railgun','Iron'],[['Brawl','Stone'],'Quake Fist','Brawl'],[['Frost','Iron'],'Cryo Lance','Frost']];
function comboOf(a,c){if(!a||!c)return null;const A=allTypes(a),C=allTypes(c);for(const [[x,y],n,t] of COMBOS)if((A.includes(x)&&C.includes(y))||(A.includes(y)&&C.includes(x)))return{n,t};return null;}
{const _lt=linkType;linkType=function(a,c){const s=_lt(a,c);if(s)return s;const k=comboOf(a,c);return k?k.t:null;};}
// ---------- 19: robot status names ----------
Object.assign(STATUS.burn,{n:'MLT'});Object.assign(STATUS.freeze,{n:'JNT'});Object.assign(STATUS.shock,{n:'SHT'});Object.assign(STATUS.sleep,{n:'STB'});Object.assign(STATUS.glitch,{n:'HCK'});
// ---------- 20 + 35: boss plates, lightning shadows, cracking ice ----------
function drawPlates(){const B=BT;if(!B||!B.boss||B.plates==null)return;for(let i=0;i<3;i++){ctx.fillStyle=i<B.plates?'#9ab8d8':'rgba(80,90,110,.5)';ctx.fillRect(300+i*16,6,12,8);ctx.strokeStyle='#1a2030';ctx.strokeRect(300+i*16,6,12,8);}wtxt('ARMOUR',290,14,'#c8d8e8',14,'right');}
{const _es=entShadow;entShadow=function(sx,sy,wx,wy){_es(sx,sy,wx,wy);if(G.bolt>6){ctx.save();ctx.globalAlpha=0.55;ctx.fillStyle='#04060c';ctx.translate(sx+16,sy+29);ctx.transform(1,0,-1.4,0.5,0,0);ctx.fillRect(-7,-30,14,30);ctx.restore();}};}
{const _sf=drawSurfaceFX;drawSurfaceFX=function(cx,cy){_sf(cx,cy);if(!hq())return;const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);ctx.strokeStyle='rgba(240,250,255,.6)';ctx.lineWidth=1;
  for(let y=y0;y<=y0+Math.ceil(H/TS)+1;y++)for(let x=x0;x<=x0+Math.ceil(W/TS)+1;x++){if(T(x,y)!=='-')continue;const edge=[[0,1],[1,0],[-1,0],[0,-1]].some(([dx,dy])=>T(x+dx,y+dy)!=='-');if(!edge)continue;const hv=hh(x,y,31);const ph=(TICK+hv)%600;if(ph>120)continue;
   const a=ph<20?ph/20:ph>90?(120-ph)/30:1;ctx.globalAlpha=a*0.8;const sx=x*TS-cx,sy=y*TS-cy;ctx.beginPath();ctx.moveTo(sx+4+hv%8,sy+6);ctx.lineTo(sx+12+hv%6,sy+14);ctx.lineTo(sx+9+hv%10,sy+22);ctx.moveTo(sx+12+hv%6,sy+14);ctx.lineTo(sx+22,sy+12+hv%8);ctx.stroke();}ctx.globalAlpha=1;};}
// ---------- 7: bot jobs ----------
const JOBS={mine:{n:'Mine scrap',every:3600*3,give:()=>{addItem('scrap',1);return '1 Scrap';}},scout:{n:'Scout the wilds',every:3600*8,give:()=>{const t=pick(TYPES.filter(t=>t!=='Core'));addItem('shard_'+t,1);return 'a '+t+' Shard';}},guard:{n:'Guard the caravan',every:3600*4,give:()=>{G.money+=150;return '150 Cr';}}};
async function jobsMenu(){G.jobs=G.jobs||[];while(true){const opts=[0,1,2].map(i=>{const j=G.jobs[i];if(!j)return 'Slot '+(i+1)+': free';const b=G.storage.find(b=>b.uid===j.uid);return 'Slot '+(i+1)+': '+(b?BOTS[b.id].name:'?')+' — '+JOBS[j.job].n;});opts.push('Collect rewards','Back');
  const i=await ask('BOT JOBS — bots in storage can work while you travel.',opts);if(i<0||i===4)return;
  if(i===3){let got=[];for(const j of G.jobs){if(!j)continue;const n=Math.floor((G.time-j.since)/JOBS[j.job].every);for(let k=0;k<Math.min(n,10);k++)got.push(JOBS[j.job].give());if(n>0)j.since+=n*JOBS[j.job].every;
      const b=G.storage.find(b=>b.uid===j.uid);if(b&&n>0)b.xp=(b.xp||0)+n*40;}await say(got.length?'Your bots brought back: '+got.join(', ')+'.':'Nothing yet. Jobs pay out over time.');continue;}
  if(G.jobs[i]){if((await ask('Recall this bot from its job?'))===0)G.jobs[i]=null;continue;}
  const free=G.storage.filter(b=>!G.jobs.some(j=>j&&j.uid===b.uid));if(!free.length){await say('Put bots in storage first. Only stored bots can take jobs.');continue;}
  const bi=await ask('Which bot?',free.map(b=>BOTS[b.id].name+' Lv'+b.lv).concat(['Cancel']));if(bi<0||bi>=free.length)continue;
  const ji=await ask('Which job?',Object.values(JOBS).map(j=>j.n).concat(['Cancel']));if(ji<0||ji>=3)continue;G.jobs[i]={uid:free[bi].uid,job:Object.keys(JOBS)[ji],since:G.time};Snd.sfx('ok');await say(BOTS[free[bi].id].name+' heads out to work.');}}
// ---------- 26: research unlocks paint jobs + lore ----------
const fullyResearched=id=>(G.scan&&(G.scan[id]||0)>=3)&&G.caught&&G.caught[id];
const ALTC=new Map();
{const _bs=bspr;bspr=function(b,o){const s=_bs(b,o);if(!b||!b.alt)return s;let c=ALTC.get(s);if(c)return c;c=mkCanvas(s.width,s.height);const g=c.getContext('2d');g.drawImage(s,0,0);const d=g.getImageData(0,0,c.width,c.height);
  for(let i=0;i<d.data.length;i+=4){const r=d.data[i],gg=d.data[i+1],bb=d.data[i+2];d.data[i]=bb;d.data[i+1]=r;d.data[i+2]=gg;}g.putImageData(d,0,0);if(s.core)c.core=s.core;ALTC.set(s,c);return c;};}
async function paintBooth(){const ok=G.party.filter(b=>fullyResearched(b.id));if(!ok.length){await say('PAINT BOOTH: fully research a species (Scan it 3 times and link with one) to unlock its alternate finish.');return;}
 const i=await ask('Repaint which bot?',ok.map(b=>BOTS[b.id].name+(b.alt?' (alt)':'')).concat(['Cancel']));if(i<0||i>=ok.length)return;ok[i].alt=!ok[i].alt;Snd.sfx('item');await say(BOTS[ok[i].id].name+(ok[i].alt?' got a fresh alternate finish!':' is back to its factory finish.'));}
for(const id in BOTS){const base=BOTS[id].desc;Object.defineProperty(BOTS[id],'desc',{configurable:true,get(){if(typeof G==='undefined'||!fullyResearched(id))return base;const d=BOTS[id];
  return base+' RESEARCH: '+['Core temperature runs hot under load.','Sleeps with its visor half-lit.','Prefers to travel in pairs.','Hums a two-note Maker tune when idle.','Scavenges shard dust from old wrecks.','Avoids deep water unless shielded.'][(id.length+d.types[0].length)%6]+' Paint booth unlocked.';}});}
// ---------- 27: glitched variants are stronger ----------
{const _st=stats;stats=function(b){const s=_st(b);if(b&&b.glitch){const o={};for(const k in s)o[k]=typeof s[k]==='number'&&k!=='hp'?Math.round(s[k]*1.12):s[k];o.hp=Math.round(s.hp*1.08);return o;}return s;};}
// ---------- 38: cradles tune your bots ----------
{const _ha=healAll;healAll=async function(){const r=await _ha();if(!BT&&(curMap().heal||G.map==='workshop'))G.tuned=true;return r;};}
// ---------- 28: trophy room ----------
{const _dw=drawWorkshopDecor;drawWorkshopDecor=function(cx,cy){_dw(cx,cy);const X=x=>x*TS-cx,Y=y=>y*TS-cy;const cols=['#c8a070','#f0d030','#9aa2ae','#ff7a3a','#3aa8ff','#b8d4e0','#9be0ff','#c8b0ff'];
  R(ctx,X(2),Y(2)-4,TS*9,4,'#5a4838');for(let i=0;i<8;i++){const x=X(2)+8+i*34,y=Y(2)-16;if(G.bag['prime'+(i+1)]){ptri(ctx,[x+6,y,x+12,y+8,x+6,y+14,x,y+8],cols[i]);R(ctx,x+5,y+3,2,2,'#fff');}else{ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(x+2,y+4,8,8);}}
  if(G.caught&&G.caught.glacivore){const s=botSprite('glacivore');ctx.globalAlpha=0.9;ctx.drawImage(s,X(5)-6,Y(4)-10,44,44);ctx.globalAlpha=1;}};}
// ---------- 29: postgame: Warden rematches, deep vault, ninth Prime ----------
const REMATCH={brakka:[['ironcrag',60],['crushbug',60],['avalanche',62]],ione:[['thundrone',60],['ampjelly',61],['shockhound',62]],hask:[['railwyrm',61],['hailguard',61],['ironpaw',62]],sora:[['pyrowing',61],['furnadrone',62],['blastfan',62]],
 maren:[['stormkeel',62],['hullbreaker',62],['mirelurk',63]],pellashe:[['tempestwing',63],['skyrivet',63],['nightglider',63]],yoru:[['rimewyrm',64],['avalanche',64],['frostfist',64]],spiritw:[['pyrewraith',65],['rimeghost',65],['wispire',65],['nightglider',65]]};
for(const id in MAPS)for(const n of MAPS[id].npcs||[])if(REMATCH[n.id]&&n.script){const orig=n.script;n.script=async function(np){if(!flag('gameClear'))return orig(np);
  if(flag('rm_'+n.id)){await say('Come back after you\'ve beaten every Warden again. Then we go again.');if(Object.keys(REMATCH).every(k=>flag('rm_'+k))){for(const k in REMATCH)clearFlag('rm_'+k);}return;}
  if((await ask('REMATCH: full strength, Lv 60+. Ready?'))!==0)return;G.busy=true;const r=await runBattle({trainer:{name:n.look==='spiritw'?'Spirit Warden':n.id[0].toUpperCase()+n.id.slice(1),title:'Warden',look:n.look,warden:1,link:1,team:REMATCH[n.id],money:8000,items:2}});
  if(r==='win'){setFlag('rm_'+n.id);addItem('overclock',1);await say('A real fight. Take an Overclock Chip.');}G.busy=false;};}
ITEMS.prime9={n:'Core Prime',d:'The ninth Prime. The Makers never wrote it down. Your bots gain 10% more XP.',cat:'key'};
{const _ev=enterVaultFloor;enterVaultFloor=async function(){await _ev();if(!flag('gameClear'))return;const f=G.vault&&G.vault.floor;const m=MAPS.vault;
  const free=[];m.grid.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(r[x]==='x'&&!(m.objs||[]).some(o=>o.x===x&&o.y===y)&&Math.abs(x-G.px)+Math.abs(y-G.py)>2)free.push([x,y]);});
  if(f>=25&&free.length){const [x,y]=pick(free);m.objs.push({type:'item',id:'vd'+f+'_'+G.vault.seed,x,y,item:pick(['arm_blade','arm_cannon','leg_thrusters','leg_treads','core_amp']),vault:1});G.objs=m.objs;}
  if(f===50&&!G.bag.prime9&&free.length){const [x,y]=free[0];m.objs.push({type:'item',id:'prime9',x,y,item:'prime9',vault:1});G.objs=m.objs;await say('Floor 50. Something in this room is humming in a key you have never heard...');}};}
// ---------- 13: Calderra after the ending ----------
const EPI={restore:['The Heartforge is warm again. Bots are calmer than I\'ve ever seen them.','Vesna says the Accord has new rules now. Rules for the people holding it.'],silence:['My bot just... decided to make me tea. Nobody told it to. I cried a little.','Long winter. But the bots are helping. Because they want to.'],rewrite:['The bots still listen, but they talk back now. I think I like it.','Glacivore hummed last night. The whole valley heard it.']};
{const _lm2=loadMap;loadMap=function(id,x,y,dir){_lm2(id,x,y,dir);const m=MAPS[id];if(flag('gameClear')&&m.town&&!G.npcs.some(n=>n.id==='epi')){
  for(let r=2;r<8;r++){let done=false;for(const [dx,dy] of [[r,0],[-r,0],[0,r],[0,-r],[r,r],[-r,-r]]){const nx=x+dx,ny=y+dy;const c=T(nx,ny);if(c&&!tileSolid(c)&&!warpAt(nx,ny)&&!npcAt(nx,ny)&&!objAt(nx,ny)&&'.=d'.includes(c)){
     G.npcs.push({id:'epi',x:nx,y:ny,dir:'down',look:pick(['woman','old','mech','kid']),script:async()=>{await say(pick(EPI[G.ending||'restore']));}});done=true;break;}}if(done)break;}}
  if(m.accord)tip('accord');};}
// ---------- 21 + 22: Kael scenes, his old bot, cross-town arcs ----------
MAPS.workshop.objs.push({type:'oldframe',x:3,y:7,cond:()=>(qstate('kaelbot')==='done'||flag('gameClear'))&&!flag('gotRook'),run:async()=>{G.busy=true;
  await say('A battered frame with a red tag sits on your workbench. A note: "Fixed it. Couldn\'t look at it. You take it. - K"');
  const b=makeBot('gearpup',Math.max(20,Math.min(60,(lead()||{lv:20}).lv)));b.nick='Rook';if(G.party.length<6)G.party.push(b);else G.storage.push(b);setFlag('gotRook');seen(b.id,1);if(G.caught)G.caught[b.id]=1;Snd.jingle('level');await say('Kael\'s first bot, ROOK the Gearpup, joined your team!');G.busy=false;}});
MAPS.repair_f&&MAPS.repair_f.npcs.push({id:'kaelF2',x:10,y:4,dir:'left',look:'kael',cond:()=>flag('badge3')&&!flag('kaelFerrow')&&!flag('ch2done'),script:async()=>{setFlag('kaelFerrow');const k=G.kael||0;
  if(flag('kaelChoir'))await say('Don\'t look at me like that. The Choir listens to me. That\'s more than Vesna ever did.',{speaker:'Kael'});
  else if(k>=2)await say('Hask nearly flattened me. Twice. Tell me your trick and I\'ll tell you mine: I talk to my bot before fights. Out loud. Don\'t laugh.',{speaker:'Kael'});
  else{await say('...What. I\'m just charging my bot. You don\'t have to check on me.',{speaker:'Kael'});const c=await ask('Say something?',['Want to train together sometime?','Fine. See you around.']);if(c===0){G.kael=(G.kael||0)+1;await say('...Maybe. Yeah. Maybe.',{speaker:'Kael'});}}}});
MAPS.route8.npcs.push({id:'kaelSum',x:14,y:22,dir:'up',look:'kael',cond:()=>flag('badge8')&&!flag('kaelSummit'),script:async()=>{setFlag('kaelSummit');
  if(flag('kaelJoined'))await say('Eight Primes. You did it. Whatever happens in there, I\'ve got your back. And Rook\'s waiting at home, so we\'re both coming back.',{speaker:'Kael'});
  else if(flag('kaelChoir'))await say('I\'m not here to stop you. I\'m here to see what you choose. Don\'t make me regret it.',{speaker:'Kael'});
  else await say('Hey. I know we never really... Look. Good luck in there.',{speaker:'Kael'});}});
// Tobin & Bit postcards, Juno's caravan story, the Choir son
(function(){const tob=MAPS.ashgrove.npcs.find(n=>n.id==='kid1');const orig=tob.script;tob.script=async function(n){if(qstate('lostbit')==='done'&&flag('ch2done')){await say(flag('gameClear')?'Bit learned to fly properly! He takes postcards to Saltmarrow and back now. He\'s a mail bot!':'Bit keeps trying to follow you. I told him you\'re saving the world. He made a sad beep.',{speaker:'Tobin'});return;}return orig(n);};
 const _nt=nurseTalk;nurseTalk=async function(){const b=[1,2,3,4,5,6,7,8].filter(i=>flag('badge'+i)).length;if(!flag('juno'+b)&&b>0){setFlag('juno'+b);await say(['','Juno wipes grease off her hands. "One Prime! The caravan\'s been waiting for someone like you."','"Two Primes. I used to fix bots for Brakka\'s crew. Ask her about the time I rewired her stone golem."','"Three. You know, my mother drove this caravan. Same cradles, same smell of oil."','"Four Primes. Mom always said the Heartforge hummed louder in summer. I\'ve never heard a summer."','"Five. The coast caravan is my sister\'s. She says you tip badly."','"Six. Can I tell you something? I\'m scared of what happens if the Heartforge stops."','"Seven. Whatever you choose up there... the caravan will keep rolling. Bots still need fixing."','"All eight. Go on. I\'ll keep the cradles warm."'][b],{speaker:'Juno'});}return _nt();};
 Object.assign(QUESTS,{teo:{n:'A Letter for Teo',where:'Saltmarrow → Summit Trail',steps:{active:'A mother in Saltmarrow asked you to find her son Teo, who joined the Choir. He may be at the Choir camp on Mt. Cinder.',found:'Teo gave you a letter for his mother in Saltmarrow.',done:'Teo\'s mother has her letter.'}}});
 const hs=MAPS.house_s2.npcs.find(n=>n.id==='hs2');hs.text=null;hs.script=async()=>{const s=qstate('teo');
  if(!s){await say('My son Teo joined the Choir last winter. If you ever reach Mt. Cinder, would you look for him? Just tell him his mum misses him.',{speaker:'Teo\'s mother'});setQ('teo','active');Snd.sfx('ok');await say('New quest: A LETTER FOR TEO.');}
  else if(s==='found'){setQ('teo','done');Snd.jingle('victory',curMap().music);await say('This is his handwriting. He\'s safe. He\'s... coming home in spring. Thank you. Please, take this.',{speaker:'Teo\'s mother'});addItem('rshard_Spirit',1);await say(N()+' received a Refined Spirit Shard!');}
  else await say(s==='done'?'Teo writes every week now. Every single week.':'Mt. Cinder, past Rimefall. The Choir camp. Please.',{speaker:'Teo\'s mother'});};
 MAPS.route8.npcs.push({id:'teo',x:15,y:15,dir:'left',look:'grunt',cond:()=>qstate('teo')==='active',script:async()=>{await say('My mum sent you? ...I joined because I thought the bots were suffering. Some are. But I miss home.',{speaker:'Teo'});setQ('teo','found');await say('Teo hands you a folded letter. Quest updated: bring it to Saltmarrow.');}});})();
// ---------- 25: your bots talk ----------
const BOTTALK={Flame:['*crackles happily at the warmth*','Cold. Cold cold cold.','*its core glows brighter*'],Tide:['*splashes in a puddle on purpose*','*hums at the sea*','Wet. Good.'],Volt:['*sparks at a lamp post*','*buzzes, impatient*','Charge... full!'],Stone:['*plants its feet, unimpressed*','...','*rumbles*'],Gale:['*rides the wind for a second*','*circles your head*','Fast!'],Frost:['*leaves frost footprints*','Snow. Nice.','*chimes softly*'],Shade:['*hides in your shadow*','*eyes glow in the dark*','Shh.'],Spirit:['*watches something you can\'t see*','*hums an old tune*','...remember?'],Iron:['*clanks proudly*','*polishes itself*','Solid.'],Bloom:['*sniffs a frozen flower*','Grow?','*leaves rustle*'],Brawl:['*shadowboxes*','*flexes*','Fight?'],Core:['*beeps*','*whirs*','*blinks*']};
const PLACETALK={rain:'*shakes off the rain*',night:'*core lights up the path*',blizzard:'*leans into the wind*',heat:'Hot. Too hot.',cold:'*shivers, plates clinking*',heart:'*visor flickers red... then blue*',town:'*waves at the townsfolk bots*'};
G.botTalk=null;
function botTalkTick(){if(!G.started||BT||UI.length||G.busy||!G.fol||G.surf)return;const b=lead();if(!b)return;if(G.botTalk&&G.botTalk.t>0){G.botTalk.t--;return;}
 if(TICK%1500!==0&&!(G.lastTalkMap!==G.map&&TICK%60===0))return;G.lastTalkMap=G.map;const m=curMap();const wk=weatherKey();const ch=T(G.px,G.py);let line=null;
 if(m.accord)line=PLACETALK.heart;else if(ch==='!')line=PLACETALK.heat;else if(ch===';')line=PLACETALK.cold;else if(rainNow()>0.2&&Math.random()<0.5)line=PLACETALK.rain;else if(wk==='blizzard'&&Math.random()<0.5)line=PLACETALK.blizzard;else if((curWeather().dark||0)>0.4&&Math.random()<0.4)line=PLACETALK.night;else if(m.town&&Math.random()<0.3)line=PLACETALK.town;
 if(!line){const t=BOTTALK[BOTS[b.id].types[0]]||BOTTALK.Core;line=pick(t);}G.botTalk={line,t:200};}
function drawBotTalk(cx,cy){if(!G.botTalk||G.botTalk.t<=0||!G.fol||BT)return;const p=followerPos();if(!p)return;const w=Math.min(220,measure(G.botTalk.line,16)+20);const x=Math.max(4,Math.min(W-w-4,p[0]-cx+16-w/2)),y=p[1]-cy-34;
 ctx.globalAlpha=Math.min(1,G.botTalk.t/20);panel(x,y,w,26,'#ffffff');txt(G.botTalk.line,x+w/2,y+18,'#303840',16,'center');ctx.globalAlpha=1;}
// ---------- 31: regional music ----------
Object.assign(SONGS,{coast:{bpm:96,lead:'A4:2 C5 E5:3 - D5 C5 A4:4 G4:2 A4 C5:3 - E5 D5 C5:4 - -',bass:'A2:8 F2:8 C3:8 G2:8',pad:'A3:8 F3:8 C4:8 G3:8'},
 mountain:{bpm:76,lead:'D5:3 - A4 D5 E5:2 F5:4 - E5 D5:2 C5 A4:4 - - D5:2 F5 G5:3 - F5 E5 D5:6 - -',bass:'D2:8 A#1:8 C2:8 D2:8',pad:'D3:8 A#2:8 C3:8 A2:8'},
 heart:{bpm:132,lead:'E5 - G5 - B5 A5 G5 E5 F#5 - A5 - C6 B5 A5 F#5 E5 - G5 - B5 D6 C6 B5 A5:4 G5:4',bass:'E2 E2 E3 E2 E2 E2 E3 E2 D2 D2 D3 D2 C2 C2 C3 C2',pad:'E3:8 D3:8 C3:8 B2:8'}});
for(const id of ['route5','route6','galecrest'])if(MAPS[id])MAPS[id].music='coast';for(const id of ['route7','rimefall','route8'])if(MAPS[id])MAPS[id].music='mountain';for(const id of ['hf1','hf2'])if(MAPS[id])MAPS[id].music='heart';if(MAPS.cathedral&&SONGS.choir)MAPS.cathedral.music='choir';
// ---------- 32: unique looks for named characters ----------
Object.assign(LOOKS,{hask:{skin:'#b07850',hair:'#2a2a2a',top:'#5a6676',bot:'#2a3240',acc:'#c0c8d0',coat:1},sora:{skin:'#f0c8a0',hair:'#ff7a3a',top:'#8a2a1a',bot:'#3a1a10',acc:'#ffb040'},
 mirelle:{skin:'#f0f0f0',hair:'#d0a0e0',top:'#e8d8f0',bot:'#e8d8f0',robe:1,mask:1,acc:'#a050d0'},ostrel:{skin:'#f0f0f0',hair:'#7080a0',top:'#c8d0e0',bot:'#c8d0e0',robe:1,mask:1,acc:'#4060a0'},
 tobin:{skin:'#e8b890',hair:'#c08040',top:'#40a0d0',bot:'#3a4250',beanie:'#e0b030',pom:'#ffffff'},ilsa:{skin:'#e8c8b0',hair:'#e8e8e8',top:'#8a5a7a',bot:'#4a3a4a',dress:1},
 mags:{skin:'#c88a60',hair:'#3a2a20',top:'#6a8a4a',bot:'#3a3a2a',acc:'#e0c040'},pim:{skin:'#f0c8a0',hair:'#5a3a20',top:'#d8e0e8',bot:'#3a4a5a',coat:1},odo:{skin:'#a87050',hair:'#1a1a1a',top:'#3a5a8a',bot:'#2a3a5a',acc:'#ffd040'}});
{const set=(map,id,look)=>{const n=MAPS[map]&&(MAPS[map].npcs||[]).find(n=>n.id===id);if(n)n.look=look;};set('gym3','hask','hask');set('gym4','sora','sora');set('ashgrove','kid1','tobin');set('ashgrove','old1','ilsa');set('ashgrove','aide','pim');set('brasston','bguard','odo');
 for(const id in MAPS)for(const n of MAPS[id].npcs||[])if(n.id==='clerk')n.look='mags';const r=MAPS.rustworks&&MAPS.rustworks.npcs.find(n=>n.id==='ostrel');if(r)r.look='ostrel';const c=MAPS.cathedral.npcs.find(n=>n.id==='cdeacon');if(c)c.look='ostrel';const h2=MAPS.hf2.npcs.find(n=>n.id==='hf2g1');if(h2)h2.trainer.look=h2.look='mirelle';}
// ---------- 33: livelier bots in battle ----------
{const _db=drawBotIdle;drawBotIdle=function(b,x,y,sz,flip,alpha,phase){const B=BT;let rot=0;if(B&&B.anim){const hit=flip?B.anim.hitP:B.anim.hitE;if(hit>0)rot=(flip?-1:1)*0.12*Math.sin(hit);}
  const br=1+0.025*Math.sin((TICK+phase)/22);if(!rot&&br===1)return _db(b,x,y,sz,flip,alpha,phase);ctx.save();const cxp=x+sz/2,cyp=y+sz*0.9;ctx.translate(cxp,cyp);ctx.rotate(rot);ctx.scale(1/br,br);ctx.translate(-cxp,-cyp);_db(b,x,y,sz,flip,alpha,phase);ctx.restore();};}
{const _dn=dmgNumber;dmgNumber=function(side,t_,col,big){_dn(side,t_,col,big);if(typeof t_==='string'&&t_[0]==='-'){const [x,y]=BPOS[side];burst(x,y,'#ffe0a0',big?18:10,big?4:3,2,20);}};}
// ---------- 34: cutscene camera ----------
G.cam=null;
async function camTo(wx,wy,zoom,frames){const c=camera();const from=G.cam?Object.assign({},G.cam):{x:c.px+16,y:c.py+16,z:1};for(let i=1;i<=frames;i++){const k=i/frames,e=k*k*(3-2*k);G.cam={x:from.x+(wx-from.x)*e,y:from.y+(wy-from.y)*e,z:from.z+(zoom-from.z)*e};await wait(1);}}
async function camReset(frames){if(!G.cam)return;const c=G.cam;await camTo(G.px*TS+16,G.py*TS+16,1,frames||20);G.cam=null;}
{const _cam=camera;camera=function(){const r=_cam();if(!G.cam)return r;const m=curMap();const mw=m.grid[0].length*TS,mh=m.grid.length*TS;let cx=G.cam.x-W/2,cy=G.cam.y-H/2;cx=mw<=W?(mw-W)/2:clamp(cx,0,mw-W);cy=mh<=H?(mh-H)/2:clamp(cy,0,mh-H);return Object.assign({},r,{cx:Math.round(cx),cy:Math.round(cy)});};}
{const _do=drawOverworld;drawOverworld=function(){if(!G.cam||G.cam.z===1)return _do();ctx.save();ctx.translate(W/2,H/2);ctx.scale(G.cam.z,G.cam.z);ctx.translate(-W/2,-H/2);_do();ctx.restore();};}
{const wrapScene=(name,getXY,z)=>{const orig=window[name];window[name]=async function(...a){const p=getXY(...a);if(p){await camTo(p[0]*TS+16,p[1]*TS+16,z,40);await wait(20);}try{return await orig(...a);}finally{await camReset(30);}};};
 wrapScene('capsuleScene',o=>flag('starter')?null:[o.x,o.y],1.3);wrapScene('cantorScene',()=>C3('cathedral','cantor'),1.25);wrapScene('finale',()=>flag('gameClear')?null:C3('hfcore','titan'),1.2);}
// ---------- 36: quest tracker ----------
function questGoal(){const F=flag;const npc=(map,id)=>{const n=(MAPS[map].npcs||[]).find(n=>n.id===id);return n?{map,x:n.x,y:n.y}:null;};
 if(!F('starter')){const o=MAPS.ashgrove.objs.find(o=>o.type==='capsule');return Object.assign({label:'The crashed capsule'},{map:'ashgrove',x:o.x,y:o.y});}
 const steps=[['badge1','gym1','brakka','Warden Brakka'],['deacon','cave','deacon','Stop the Choir in the Relay Tunnel'],['badge2','gym2','ione','Warden Ione'],['ch2start','lab','vesna','Report to Vesna'],['ostrel','rustworks','ostrel','The Rustworks archive'],
  ['badge3','gym3','hask','Warden Hask'],['badge4','gym4','sora','Warden Sora'],['badge5','gym5','maren','Warden Maren'],['badge6','gym6','pellashe','Warden Pell-Ashe'],['ch3done','cathedral','cantor','The Drowned Cathedral'],
  ['badge7','gym7','yoru','Warden Yoru'],['badge8','gym8','spiritw','The Spirit Warden']];
 for(const [f,map,id,label] of steps){if(!F(f)){const g=npc(map,id);if(g)return Object.assign(g,{label});}}
 if(!F('gameClear')){const o=MAPS.hfcore.objs[0];return{map:'hfcore',x:o.x,y:o.y,label:'The Heartforge'};}return null;}
let MAPGRAPH=null;
function nextHop(from,to){if(from===to)return null;if(!MAPGRAPH){MAPGRAPH={};for(const id in MAPS){if(MAPS[id].vaultMap)continue;MAPGRAPH[id]=[...new Set((MAPS[id].warps||[]).map(w=>w.to))];}}
 const prev={[from]:null},q=[from];while(q.length){const c=q.shift();if(c===to)break;for(const n of MAPGRAPH[c]||[])if(!(n in prev)){prev[n]=c;q.push(n);}}if(!(to in prev))return null;let c=to;while(prev[c]!==from&&prev[c]!=null)c=prev[c];return c;}
function trackerTarget(){const g=questGoal();if(!g)return null;if(g.map===G.map)return g;const hop=nextHop(G.map,g.map);if(!hop)return null;const ws=(curMap().warps||[]).filter(w=>w.to===hop);if(!ws.length)return null;
 let best=ws[0],bd=1e9;for(const w of ws){const d=Math.abs(w.x-G.px)+Math.abs(w.y-G.py);if(d<bd){bd=d;best=w;}}return{x:best.x,y:best.y,label:g.label,hop:1};}
function drawTracker(){if(!G.minimap||BT||!G.started||G.cam)return;const m=curMap();if(!m.world&&!m.town&&!m.dungeon&&!m.accord)return;const t=trackerTarget();if(!t)return;
 const dx=t.x-G.px,dy=t.y-G.py,ang=Math.atan2(dy,dx),d=Math.abs(dx)+Math.abs(dy);const cx=W-62,cy=m.world?118:30;ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.fillStyle='#ffd040';ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-6,-7);ctx.lineTo(-2,0);ctx.lineTo(-6,7);ctx.closePath();ctx.fill();ctx.strokeStyle='#302010';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
 wtxt(d<=1?(t.hop?'this way':'here'):'Goal',cx,cy+22,'#ffe080',14,'center');}
// ---------- tips from the ground under you ----------
{const _os=onStepInner;onStepInner=async function(){const ch=T(G.px,G.py);const near=c=>[[0,1],[1,0],[-1,0],[0,-1]].some(([dx,dy])=>T(G.px+dx,G.py+dy)===c);
  if(ch==='_'||near('_'))tip('tide');if(ch==='<'||ch==='>')tip('gust');if(ch==='!')tip('heat');if(ch===';')tip('cold');if(BELT[ch]&&!'<>'.includes(ch))tip('belt');if(near('V'))tip('vent');if(ch==='-')tip('ice');if(near('·')&&!shadeSees())tip('hidden');if(near('≈')&&!G.surf)tip('rough');
  return _os();};}
// ---------- 37: fast battle text ----------
{const _bsay=bsay;bsay=function(t){return say(t,{auto:Math.ceil((G.fastText?28:70)/bspd())});};}
// ---------- 39: storage sort + filter ----------
openStorage=async function(){G.busy=true;await say('Booted up the storage terminal.');
 while(true){const r=await ask('Storage: '+G.storage.length+' bots stored.',['Withdraw','Deposit','Sort storage','Log off']);
  if(r===0){if(!G.storage.length){await say('No bots in storage.');continue;}if(G.party.length>=6){await say('Your party is full.');continue;}
   const types=['All types',...TYPES.filter(t=>G.storage.some(b=>BOTS[b.id].types.includes(t)))];const f=await ask('Show which type?',types);if(f<0)continue;
   const list=G.storage.filter(b=>f===0||BOTS[b.id].types.includes(types[f]));const i=await choose(list.map(b=>(G.jobs&&G.jobs.some(j=>j&&j.uid===b.uid)?'[job] ':'')+(b.nick||BOTS[b.id].name)+' Lv'+b.lv+' · '+BOTS[b.id].types.join('/')).concat(['Cancel']),{x:20,y:20});
   if(i>=0&&i<list.length){const b=list[i];if(G.jobs&&G.jobs.some(j=>j&&j.uid===b.uid)){await say('That bot is out on a job. Recall it at the workshop first.');continue;}G.storage.splice(G.storage.indexOf(b),1);G.party.push(b);await say(BOTS[b.id].name+' joined your party.');}}
  else if(r===1){if(G.party.length<=1){await say('You need to keep at least one bot.');continue;}const i=await choose(G.party.map(b=>BOTS[b.id].name+' Lv'+b.lv).concat(['Cancel']),{x:20,y:20});if(i>=0&&i<G.party.length){const b=G.party.splice(i,1)[0];G.storage.push(b);await say(BOTS[b.id].name+' was sent to storage.');}}
  else if(r===2){const s=await ask('Sort by?',['Level','Type','Name','Newest first']);if(s===0)G.storage.sort((a,b)=>b.lv-a.lv);else if(s===1)G.storage.sort((a,b)=>BOTS[a.id].types[0].localeCompare(BOTS[b.id].types[0]));else if(s===2)G.storage.sort((a,b)=>BOTS[a.id].name.localeCompare(BOTS[b.id].name));else if(s===3)G.storage.reverse();await say('Storage sorted.');}
  else break;}G.busy=false;};
// ---------- workshop console gets Jobs + Paint Booth ----------
{const _wc=workshopConsole;workshopConsole=async function(){const i=await ask('WORKSHOP',['Upgrades & decor','Bot jobs','Paint booth','Log off']);if(i===0)return _wc();if(i===1)return jobsMenu();if(i===2)return paintBooth();};MAPS.workshop.tileScripts['1,1']=()=>workshopConsole();}

// ---------- draw/update hooks ----------
{const _dr=draw;draw=function(){_dr();if(BT){drawPlates();}else if(G.started&&!UI.some(u=>u.isTitle)){const c=camera();drawBotTalk(c.cx,c.cy);drawTracker();}drawTip();};}
{const _up=update;update=function(){_up();botTalkTick();};}
