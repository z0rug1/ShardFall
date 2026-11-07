// ===================== MODULAR BODY PARTS =====================
const PARTS={
 arm_blade:{slot:'arm',n:'Blade Arms',d:'ARM part. +10% ATK and adds the move Blade Arm.',stat:{atk:1.1},move:'bladearm'},
 arm_cannon:{slot:'arm',n:'Shard Cannon',d:'ARM part. Adds the move Shard Cannon (uses your second shard\'s type).',move:'shardcannon'},
 arm_claws:{slot:'arm',n:'Grapple Claws',d:'ARM part. +12% ATK.',stat:{atk:1.12}},
 core_reactor:{slot:'core',n:'Reactor Core',d:'CORE part. +12% max HP.',stat:{hp:1.12}},
 core_cooler:{slot:'core',n:'Cryo Cooler',d:'CORE part. Moves build 25% less heat.',heat:0.75},
 core_amp:{slot:'core',n:'Overdrive Amp',d:'CORE part. Overdrive charges 30% faster.',od:1.3},
 leg_thrusters:{slot:'leg',n:'Thrusters',d:'LEG part. +12% SPD.',stat:{spd:1.12}},
 leg_treads:{slot:'leg',n:'Tank Treads',d:'LEG part. +12% DEF.',stat:{def:1.12}},
 leg_spikes:{slot:'leg',n:'Ice Spikes',d:'LEG part. +6% SPD and DEF.',stat:{spd:1.06,def:1.06}},
};
Object.assign(MOVES,{
 bladearm:{n:'Blade Arm',t:'Iron',p:60,a:100,pp:20,d:'Part move. Slashes with blade arms.'},
 shardcannon:{n:'Shard Cannon',t:'Core',p:70,a:95,pp:15,dyn:1,d:'Part move. Fires your second shard\'s element.'},
});
for(const [k,p] of Object.entries(PARTS))ITEMS[k]={n:p.n,d:p.d,cat:'part',price:1200,part:1};
function partMult(b,stat){let m=1;for(const k of Object.values(b.parts||{})){if(k&&PARTS[k].stat&&PARTS[k].stat[stat])m*=PARTS[k].stat[stat];}return m;}
function partHeat(b){let m=1;for(const k of Object.values(b.parts||{}))if(k&&PARTS[k].heat)m*=PARTS[k].heat;return m;}
function partOD(b){let m=1;for(const k of Object.values(b.parts||{}))if(k&&PARTS[k].od)m*=PARTS[k].od;return m;}
function partMoves(b){const out=[];for(const k of Object.values(b.parts||{}))if(k&&PARTS[k].move)out.push(PARTS[k].move);return out;}
function moveType(b,id){const m=MOVES[id];if(m.dyn)return b.shards[1]||BOTS[b.id].types[0];return m.t;}

// draw parts over a bot sprite box (x,y,size), flip = facing right
function drawParts(b,x,y,sz,flip){const P=b.parts||{};if(!P.arm&&!P.core&&!P.leg)return;const s=sz/40;const col=TCOL[b.shards[1]||BOTS[b.id].types[0]];
  ctx.save();if(flip){ctx.translate(x+sz,y);ctx.scale(-1,1);}else ctx.translate(x,y);ctx.scale(s,s);
  const R_=(a,b_,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(a,b_,w,h);};const O='#0a0c12';
  if(P.leg==='leg_thrusters'){for(const lx of [13,24]){R_(lx-1,33,6,4,O);R_(lx,33,4,3,'#4a5464');ctx.fillStyle=TICK%6<3?'#ffb040':'#ff7020';ctx.beginPath();ctx.moveTo(lx,37);ctx.lineTo(lx+4,37);ctx.lineTo(lx+2,40+Math.random()*2);ctx.fill();}}
  if(P.leg==='leg_treads'){R_(7,34,26,5,O);R_(8,35,24,3,'#2a2f38');for(let i=0;i<6;i++)R_(9+i*4+(TICK>>2)%4*0.5,35,2,3,'#5a6270');}
  if(P.leg==='leg_spikes'){ctx.fillStyle='#bfe6ff';for(const lx of [10,18,26]){ctx.beginPath();ctx.moveTo(lx,35);ctx.lineTo(lx+3,40);ctx.lineTo(lx+6,35);ctx.fill();}}
  if(P.arm==='arm_blade'){for(const [ax,dir] of [[3,-1],[35,1]]){ctx.fillStyle=O;ctx.beginPath();ctx.moveTo(ax,18);ctx.lineTo(ax+dir*5,6);ctx.lineTo(ax+dir*2,20);ctx.fill();ctx.fillStyle='#d8e4f0';ctx.beginPath();ctx.moveTo(ax,18);ctx.lineTo(ax+dir*4.4,7.4);ctx.lineTo(ax+dir*1.6,19);ctx.fill();}}
  if(P.arm==='arm_cannon'){R_(30,17,9,5,O);R_(31,18,8,3,'#4a5464');R_(37,17.5,2.5,4,col);}
  if(P.arm==='arm_claws'){for(const ax of [2,34]){R_(ax,20,4,5,O);R_(ax+0.5,20.5,3,4,'#6a7280');R_(ax,25,1,2,'#d8e4f0');R_(ax+3,25,1,2,'#d8e4f0');}}
  if(P.core==='core_reactor'){ctx.strokeStyle=col;ctx.lineWidth=1;ctx.globalAlpha=0.6+0.4*Math.sin(TICK/8);ctx.beginPath();ctx.arc(20,22,6,0,7);ctx.stroke();ctx.globalAlpha=1;}
  if(P.core==='core_cooler'){for(let i=0;i<3;i++){R_(27+i*2,12,1.2,6,'#bfe6ff');}}
  if(P.core==='core_amp'){ctx.fillStyle='#ff60ff';ctx.globalAlpha=0.5+0.5*Math.sin(TICK/6);ctx.fillRect(18,7,4,2);ctx.globalAlpha=1;}
  ctx.restore();}

async function partsMenu(b){b.parts=b.parts||{};
  while(true){const slots=['arm','core','leg'];const opts=slots.map(s=>s.toUpperCase()+': '+(b.parts[s]?PARTS[b.parts[s]].n:'—'));opts.push('Done');
    const i=await ask(BOTS[b.id].name+' body parts:',opts);if(i<0||i>=3)return;const slot=slots[i];
    const owned=Object.keys(PARTS).filter(k=>PARTS[k].slot===slot&&G.bag[k]>0);
    const o2=owned.map(k=>'Fit '+PARTS[k].n);if(b.parts[slot])o2.push('Remove '+PARTS[b.parts[slot]].n);o2.push('Back');
    if(o2.length===1){await say('You have no '+slot.toUpperCase()+' parts. Salvage them from feral wrecks or forge them from Scrap.');continue;}
    const j=await ask(slot.toUpperCase()+' slot:',o2);if(j<0||j>=o2.length-1)continue;
    if(j<owned.length){if(b.parts[slot])addItem(b.parts[slot],1);const k=owned[j];G.bag[k]--;if(!G.bag[k])delete G.bag[k];b.parts[slot]=k;Snd.sfx('item');await say(BOTS[b.id].name+' fitted '+PARTS[k].n+'! '+PARTS[k].d);}
    else{addItem(b.parts[slot],1);b.parts[slot]=null;await say('Part removed.');}}}
