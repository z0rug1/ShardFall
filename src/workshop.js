// ===================== ASHGROVE WORKSHOP + MAKER VAULT =====================
MAPS.workshop={name:'Your Workshop',theme:'lab',music:'town',decor:1,grid:[
'XXXXXXXXXXXXX','XMxxpxpxpxxMX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XaxxxxxxxxxoX','XxxxxxxxxxxxX','XxxxxxxxxxxxX','XxxxxxxxxxxOX','XXXXXXeXXXXXX'],
warps:[{x:6,y:9,to:'ashgrove',tx:16,ty:10,dir:'down'}],
tileScripts:{'1,1':()=>workshopConsole(),'11,1':()=>vaultBoard(),'4,1':()=>pedestal(0),'6,1':()=>pedestal(1),'8,1':()=>pedestal(2),'1,5':()=>trainingRig(),'11,5':()=>openForge()},
npcs:[],objs:[]};
function WS(){G.ws=G.ws||{rig:1,forge:1,decor:{}};G.ws.decor=G.ws.decor||{};return G.ws;}
const DECOR={rug:{n:'Ember Rug',c:300},plants:{n:'Frost Ferns',c:200},lamps:{n:'Shard Lamps',c:400},banner:{n:'Calderra Banner',c:500},trophy:{n:'Prime Trophy Case',c:0,req:()=>G.bag.prime1&&G.bag.prime2}};
async function workshopConsole(){const ws=WS();
  while(true){const i=await ask('WORKSHOP CONSOLE — Rig Lv '+ws.rig+' · Forge Lv '+ws.forge,['Upgrade Training Rig','Upgrade Forge','Decorations','Log off']);
    if(i===0){if(ws.rig>=3){await say('The Training Rig is fully upgraded.');continue;}const cost=[0,1500,4000][ws.rig],sc=[0,5,10][ws.rig];
      if((await ask('Upgrade the Rig to Lv '+(ws.rig+1)+' for '+cost+' Cr and '+sc+' Scrap? (More XP per session)',['Upgrade','Cancel']))!==0)continue;
      if(G.money<cost||(G.bag.scrap||0)<sc){await say('Not enough Cr or Scrap.');continue;}G.money-=cost;G.bag.scrap-=sc;if(!G.bag.scrap)delete G.bag.scrap;ws.rig++;Snd.sfx('item');await say('Training Rig upgraded to Lv '+ws.rig+'!');}
    else if(i===1){if(ws.forge>=3){await say('The Forge is fully upgraded.');continue;}const cost=[0,2000,5000][ws.forge],sc=[0,8,15][ws.forge];
      if((await ask('Upgrade every Forge to Lv '+(ws.forge+1)+' for '+cost+' Cr and '+sc+' Scrap? ('+(ws.forge===1?'Salvage costs 4 Scrap':'Refining needs only 2 shards')+')',['Upgrade','Cancel']))!==0)continue;
      if(G.money<cost||(G.bag.scrap||0)<sc){await say('Not enough Cr or Scrap.');continue;}G.money-=cost;G.bag.scrap-=sc;if(!G.bag.scrap)delete G.bag.scrap;ws.forge++;Snd.sfx('item');await say('Forge upgraded to Lv '+ws.forge+'! This applies at every Repair Station too.');}
    else if(i===2){const keys=Object.keys(DECOR);const opts=keys.map(k=>(ws.decor[k]?'✓ ':'')+DECOR[k].n+(ws.decor[k]?'':(DECOR[k].c?' — '+DECOR[k].c+' Cr':' — needs both Primes')));opts.push('Back');
      const j=await ask('Decorate your workshop:',opts);if(j<0||j>=keys.length)continue;const k=keys[j];
      if(ws.decor[k]){ws.decor[k]=0;await say('Put the '+DECOR[k].n+' in storage.');continue;}
      if(DECOR[k].req&&!DECOR[k].req()){await say('You need both Prime Shards to fill this case.');continue;}
      if(G.money<DECOR[k].c){await say('Not enough Cr.');continue;}G.money-=DECOR[k].c;ws.decor[k]=1;Snd.sfx('item');await say('Placed the '+DECOR[k].n+'!');}
    else break;}}
async function pedestal(i){G.display=G.display||[null,null,null];const all=G.party.concat(G.storage);const cur_=all.find(b=>b.uid===G.display[i]);
  const opts=all.slice(0,10).map(b=>BOTS[b.id].name+' Lv'+b.lv);if(cur_)opts.push('Clear pedestal');opts.push('Cancel');
  const j=await ask(cur_?'Display pedestal: '+BOTS[cur_.id].name+'. Change it?':'An empty display pedestal. Show off a bot?',opts);
  if(j<0)return;if(j<Math.min(10,all.length)){G.display[i]=all[j].uid;Snd.chirp(BOTS[all[j].id].frame);await say(BOTS[all[j].id].name+' strikes a pose on the pedestal.');}
  else if(cur_&&j===Math.min(10,all.length))G.display[i]=null;}
async function trainingRig(){const ws=WS();const left=(G.rigNext||0)-G.time;
  if(left>0){await say('The Training Rig is cooling down. Ready in about '+Math.ceil(left/3600)+' min of play.');return;}
  const j=await ask('TRAINING RIG Lv '+ws.rig+'. Which bot trains?',G.party.map(b=>BOTS[b.id].name+' Lv'+b.lv).concat(['Cancel']));if(j<0||j>=G.party.length)return;
  const b=G.party[j];const gain=Math.max(20,Math.floor((xpFor(b.lv+1)-xpFor(b.lv))*0.3*ws.rig));
  Snd.sfx('od');await say(BOTS[b.id].name+' runs simulated battles on the rig...');await addXP(b,gain,true);await say(BOTS[b.id].name+' gained '+gain+' XP!');G.rigNext=G.time+60*60*3;await processSockets();}
function drawWorkshopDecor(cx,cy){const ws=WS();const d=ws.decor;const X=x=>x*TS-cx,Y=y=>y*TS-cy;
  if(d.rug){ctx.fillStyle='#7a2a20';ctx.fillRect(X(4)+4,Y(3)+4,5*TS-8,3*TS-8);ctx.strokeStyle='#e0a040';ctx.lineWidth=3;ctx.strokeRect(X(4)+10,Y(3)+10,5*TS-20,3*TS-20);ctx.fillStyle='#ff9a5a';ptri(ctx,[X(6)+16,Y(4)-2,X(6)+30,Y(4)+16,X(6)+16,Y(5)+2,X(6)+2,Y(4)+16],'#ff9a5a');}
  if(d.plants)for(const [x,y] of [[1,7],[10,8]]){ctx.fillStyle='#5a4a40';ctx.fillRect(X(x)+8,Y(y)+18,16,12);pell(ctx,X(x)+16,Y(y)+12,11,10,'#3e8a7a');pell(ctx,X(x)+12,Y(y)+8,4,4,'#bfe6ff');}
  if(d.lamps)for(const x of [3,9]){ctx.fillStyle='#ffd060';ctx.beginPath();ctx.arc(X(x)+16,Y(0)+22,5,0,7);ctx.fill();ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(X(x)+16,Y(0)+22,2,X(x)+16,Y(0)+22,60);g.addColorStop(0,'rgba(255,200,120,.35)');g.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=g;ctx.fillRect(X(x)-50,Y(0)-40,130,130);ctx.restore();}
  if(d.banner){ctx.fillStyle='#b8324a';ctx.fillRect(X(6)+4,Y(0)+2,24,26);ptri(ctx,[X(6)+4,Y(0)+28,X(6)+16,Y(0)+22,X(6)+28,Y(0)+28],'#b8324a');ctx.fillStyle='#ffd060';ctx.fillRect(X(6)+12,Y(0)+8,8,8);}
  if(d.trophy){ctx.fillStyle='#2a3242';ctx.fillRect(X(10)+2,Y(4),28,30);ptri(ctx,[X(10)+10,Y(4)+6,X(10)+14,Y(4)+12,X(10)+10,Y(4)+18,X(10)+6,Y(4)+12],TCOL.Stone);ptri(ctx,[X(10)+22,Y(4)+6,X(10)+26,Y(4)+12,X(10)+22,Y(4)+18,X(10)+18,Y(4)+12],TCOL.Volt);}
  G.display=G.display||[null,null,null];const all=G.party.concat(G.storage);[4,6,8].forEach((x,i)=>{const b=all.find(q=>q.uid===G.display[i]);if(b){const bob=Math.sin((TICK+i*40)/12)*2;ctx.drawImage(bspr(b),X(x)-6,Y(1)-22+bob,44,44);}});}

// ---- Maker Vault ----
function genVault(floor,seed){const r=hrand(seed*977+floor*131+7);const W_=22,H_=16;const g=Array.from({length:H_},()=>Array(W_).fill('%'));
  const rooms=[];const nR=5+Math.floor(r()*3);
  for(let k=0;k<nR*4&&rooms.length<nR;k++){const w=3+Math.floor(r()*4),h=3+Math.floor(r()*3),x=1+Math.floor(r()*(W_-w-2)),y=1+Math.floor(r()*(H_-h-2));
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)g[yy][xx]='^';rooms.push({x,y,w,h,cx:x+Math.floor(w/2),cy:y+Math.floor(h/2)});}
  for(let i=1;i<rooms.length;i++){const a=rooms[i-1],b=rooms[i];let x=a.cx,y=a.cy;while(x!==b.cx){g[y][x]='^';x+=x<b.cx?1:-1;}while(y!==b.cy){g[y][x]='^';y+=y<b.cy?1:-1;}g[y][x]='^';}
  const start=rooms[0];g[start.cy][start.cx]='O';
  // exit alcove
  const last=rooms[rooms.length-1];let placed=false;const puzzle=floor>1&&r()<0.5;
  const tries=[[0,-1],[0,1],[-1,0],[1,0]];
  for(const [dx,dy] of tries){const doorX=dx?(dx>0?last.x+last.w:last.x-1):last.cx,doorY=dy?(dy>0?last.y+last.h:last.y-1):last.cy;
    const ax=doorX+dx*2,ay=doorY+dy*2;let ok=ax>1&&ay>1&&ax<W_-2&&ay<H_-2&&g[doorY]&&g[doorY][doorX]==='%';
    if(ok)for(let yy=ay-1;yy<=ay+1;yy++)for(let xx=ax-1;xx<=ax+1;xx++)if(g[yy][xx]!=='%')ok=false;
    if(ok){const mx=doorX+dx,my=doorY+dy;if(g[my][mx]!=='%')continue;for(let yy=ay-1;yy<=ay+1;yy++)for(let xx=ax-1;xx<=ax+1;xx++)g[yy][xx]='^';g[my][mx]='^';g[doorY][doorX]=puzzle?'r':'^';g[ay][ax]='E';placed=true;break;}}
  if(!placed){g[last.cy][last.cx]='E';}
  else if(puzzle){const sr=rooms[1+Math.floor(r()*(rooms.length-2||1))]||rooms[0];let sx=sr.x,sy=sr.y;if(g[sy][sx]!=='^'){sx=sr.cx;sy=sr.cy+1;}if(g[sy]&&g[sy][sx]==='^')g[sy][sx]='S';else g[start.cy][start.cx+1<W_-1?start.cx+1:start.cx-1]='S';}
  const grid=g.map(row=>row.join(''));
  const floors=[];grid.forEach((row,y)=>{for(let x=0;x<row.length;x++)if(row[x]==='^'&&Math.abs(x-start.cx)+Math.abs(y-start.cy)>2)floors.push([x,y]);});
  const LOOT=[['patch2',30],['patch',20],['scrap',25],['spike2',10],['shard_'+pick(TYPES.slice(1)),12],['rebootcell',6],['debug',8]].concat(floor>=3?[['rshard_'+pick(TYPES.slice(1)),6],[pick(Object.keys(PARTS)),6]]:[]).concat(floor>=6?[['frag_'+pick(TYPES.slice(1)),4]]:[]);
  const objs=[];const nL=2+Math.floor(r()*3);for(let i=0;i<nL&&floors.length;i++){const [x,y]=floors.splice(Math.floor(r()*floors.length),1)[0];let tot=LOOT.reduce((a,b)=>a+b[1],0),q=r()*tot,it=LOOT[0][0];for(const [k,w] of LOOT){if((q-=w)<0){it=k;break;}}
    objs.push({type:'item',id:'v'+seed+'_'+floor+'_'+i,x,y,item:it,qty:it==='scrap'?2:1,vault:1});}
  const bases=['pipsprock','boltbun','scrapmite','sporelet','pebblit','gearpup','dripcell','gloomlamp'];const forms=Object.keys(BOTS).filter(k=>BOTS[k].stage===1);
  const lv=Math.min(60,10+floor*2);const list=bases.map(b=>[b,lv,lv+2,10]).concat(floor>=4?forms.map(f=>[f,lv,lv+2,3]):[]);
  const def={name:'Maker Vault — B'+floor,theme:'cave',music:'cave',outdoor:1,dungeon:1,vaultMap:1,enc:{tile:'^',count:Math.min(8,3+Math.floor(floor/2)),list},grid,warps:[],objs,npcs:[],start:[start.cx,start.cy]};
  if(floor%5===0){const [ax,ay]=floors.length?floors[Math.floor(r()*floors.length)]:[last.cx,last.cy];def.alpha={id:pick(forms),lv:lv+5,at:[ax,ay]};}
  return def;}
function vaultFlagKey(){return 'alpha_vault';}
async function startVault(){if(!flag('ch1done')){await say('The Vault Link pad is dormant. It needs Prime energy from two Wardens to open the way.');return;}
  if(!G.party.some(b=>b.hp>0)){await say('Your bots need repairs first.');return;}
  const r=await ask('Enter the MAKER VAULT? No Repair Stations inside. Step on an amber pad to leave with your loot. Black out and you lose it.',['Enter','Not yet']);if(r!==0)return;
  G.vault={floor:1,seed:1+rnd(99999),loot:{},kills:0};await enterVaultFloor();}
async function enterVaultFloor(){const v=G.vault;MAPS.vault=genVault(v.floor,v.seed);delete G.flags[vaultFlagKey()];
  G.busy=true;G.inWarp=true;for(let i=0;i<=10;i++){G.fade=i/10;await wait(1);}loadMap('vault',MAPS.vault.start[0],MAPS.vault.start[1],'down');for(let i=10;i>=0;i--){G.fade=i/10;await wait(1);}G.inWarp=false;
  await say('MAKER VAULT · Floor B'+v.floor+(v.floor%5===0?' · An Alpha guards this floor.':'')+(MAPS.vault.grid.some(r=>r.includes('S'))?' · A sealed door blocks the way down. Find the switch.':''));G.busy=false;}
function recordVaultRun(kept){const v=G.vault;G.vaultRuns=G.vaultRuns||[];const l=lead();G.vaultRuns.push({floor:v.floor,kept,lead:l?BOTS[l.id].name:'?',kills:v.kills||0,loot:Object.values(v.loot).reduce((a,b)=>a+b,0)});
  G.vaultRuns.sort((a,b)=>b.floor-a.floor||b.kills-a.kills);G.vaultRuns=G.vaultRuns.slice(0,5);G.vaultBest=Math.max(G.vaultBest||0,v.floor);}
async function vaultExit(){recordVaultRun(true);const v=G.vault;const n=Object.values(v.loot).reduce((a,b)=>a+b,0);G.vault=null;
  G.busy=true;G.inWarp=true;for(let i=0;i<=10;i++){G.fade=i/10;await wait(1);}loadMap('workshop',11,7,'up');for(let i=10;i>=0;i--){G.fade=i/10;await wait(1);}G.inWarp=false;
  Snd.jingle('victory',curMap().music);await say('You escaped the Vault from floor B'+v.floor+' with '+n+' item'+(n===1?'':'s')+'! Deepest run: B'+G.vaultBest+'.');G.busy=false;}
async function vaultFail(){const v=G.vault;for(const [k,q] of Object.entries(v.loot)){G.bag[k]=Math.max(0,(G.bag[k]||0)-q);if(!G.bag[k])delete G.bag[k];}
  recordVaultRun(false);G.vault=null;loadMap('workshop',11,7,'up');await say('Your bots were dragged out of the Vault. Everything you found on this run was lost. You reached B'+v.floor+'.');}
async function vaultBoard(){const runs=G.vaultRuns||[];
  await pushUI({update(){if(press('a')||press('b'))popUI(this);},draw(){ctx.fillStyle='rgba(6,10,18,.9)';ctx.fillRect(0,0,W,H);panel(30,20,420,280);txt('MAKER VAULT — DEEPEST RUNS',50,52,'#303840',24);
    if(!runs.length)txt('No runs yet. Step on the amber Vault Link pad.',50,92,'#606870',20);
    runs.forEach((r,i)=>{const y=92+i*34;txt((i+1)+'.  B'+r.floor,50,y,i===0?'#c08000':'#303840',24);txt(r.lead+' · '+r.kills+' KOs · '+r.loot+' items',160,y,'#606870',18);txt(r.kept?'escaped':'lost loot',430,y,r.kept?'#20a040':'#c04030',16,'right');});
    txt('Best: B'+(G.vaultBest||0),50,284,'#a06020',20);}});}
