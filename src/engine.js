// ===================== ENGINE =====================
const W=480,H=320,TS=32;
const cv=document.getElementById('game');const ctx=cv.getContext('2d');const RS=Math.min(3,Math.max(2,Math.round(window.devicePixelRatio||1)));cv.width=480*RS;cv.height=320*RS;ctx.imageSmoothingEnabled=false;
const FONT='VT323, monospace';
let TICK=0;
function txt(s,x,y,col='#303840',size=22,align='left',shadow='rgba(0,0,0,.15)'){ctx.font=size+'px '+FONT;ctx.textAlign=align;ctx.textBaseline='alphabetic';if(shadow){ctx.fillStyle=shadow;ctx.fillText(s,x+1,y+1);}ctx.fillStyle=col;ctx.fillText(s,x,y);}
function wtxt(s,x,y,col='#fff',size=22,align='left'){txt(s,x,y,col,size,align,'rgba(0,0,0,.6)');}
function panel(x,y,w,h,fill='#f8f6ec'){ctx.fillStyle='#2a3242';rr(x,y,w,h,8);ctx.fill();ctx.fillStyle='#8aa0c0';rr(x+3,y+3,w-6,h-6,6);ctx.fill();ctx.fillStyle=fill;rr(x+5,y+5,w-10,h-10,5);ctx.fill();}
function darkPanel(x,y,w,h){ctx.fillStyle='rgba(16,20,32,.92)';rr(x,y,w,h,6);ctx.fill();ctx.strokeStyle='#6a7fa8';ctx.lineWidth=2;rr(x+1,y+1,w-2,h-2,6);ctx.stroke();}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function measure(s,size=22){ctx.font=size+'px '+FONT;return ctx.measureText(s).width;}
function wrap(s,maxW,size=22){const out=[];for(const para of String(s).split('\n')){let line='';for(const w of para.split(' ')){const t=line?line+' '+w:w;if(measure(t,size)>maxW&&line){out.push(line);line=w;}else line=t;}out.push(line);}return out;}
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function rnd(n){return Math.floor(Math.random()*n);}
function pick(a){return a[rnd(a.length)];}

// ---------- input ----------
const held={},pressed={},repT={};
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',KeyZ:'a',Space:'a',KeyJ:'a',KeyX:'b',Escape:'b',Backspace:'b',KeyK:'b',ShiftLeft:'b',ShiftRight:'b',Enter:'start',KeyM:'map'};
addEventListener('keydown',e=>{if(document.activeElement&&document.activeElement.tagName==='INPUT')return;const k=KEYMAP[e.code];if(!k)return;e.preventDefault();if(!held[k]){pressed[k]=1;repT[k]=0;}held[k]=1;Snd.unlock();});
addEventListener('keyup',e=>{const k=KEYMAP[e.code];if(k)held[k]=0;});
addEventListener('blur',()=>{for(const k in held)held[k]=0;});
function press(k){return !!pressed[k];}
function rep(k){return !!pressed[k]||(held[k]&&repT[k]>16&&repT[k]%5===0);}
function tickInput(){for(const k in held)if(held[k])repT[k]=(repT[k]||0)+1;}
function clearPressed(){for(const k in pressed)pressed[k]=0;}
function setupTouch(){
  document.querySelectorAll('[data-k]').forEach(el=>{const k=el.dataset.k;
    const on=e=>{e.preventDefault();if(!held[k]){pressed[k]=1;repT[k]=0;}held[k]=1;el.classList.add('on');Snd.unlock();};
    const off=e=>{e.preventDefault();held[k]=0;el.classList.remove('on');};
    el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointerleave',off);el.addEventListener('pointercancel',off);});
  const pad=document.getElementById('dpad');if(!pad)return;let active=null;
  const setDir=(e)=>{const r=pad.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
    let d=null;if(Math.hypot(dx,dy)>r.width*0.12){d=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}
    if(d!==active){if(active)held[active]=0;if(d){pressed[d]=1;repT[d]=0;held[d]=1;}active=d;}
    pad.dataset.dir=d||'';};
  pad.addEventListener('pointerdown',e=>{e.preventDefault();pad.setPointerCapture(e.pointerId);setDir(e);Snd.unlock();});
  pad.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')setDir(e);});
  const end=e=>{if(active)held[active]=0;active=null;pad.dataset.dir='';};
  pad.addEventListener('pointerup',end);pad.addEventListener('pointercancel',end);
}

// ---------- sound ----------
const NOTE={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
function nfreq(n){const m=n.match(/^([A-G]#?)(\d)$/);if(!m)return 0;const midi=(+m[2]+1)*12+NOTE[m[1]];return 440*Math.pow(2,(midi-69)/12);}
function parseSeq(s){return s.trim().split(/\s+/).map(t=>{const [n,d]=t.split(':');return{f:n==='-'?0:nfreq(n),d:+(d||1)};});}
const SONGS={
 town:{bpm:108,lead:'E5 G5 A5 G5 E5 D5 C5:2 D5 E5 G5 E5 D5:4 E5 G5 A5 C6 B5 A5 G5:2 A5 G5 E5 D5 C5:4',bass:'C3:4 G2:4 A2:4 F2:4 C3:4 G2:4 F2:4 C3:4'},
 route:{bpm:132,lead:'G4 C5 E5 G5 F5 E5 D5 C5 A4 C5 F5 A5 G5 F5 E5 D5 G4 B4 D5 G5 F5 D5 B4 G4 C5 E5 G5 C6 G5:2 - -',bass:'C3:4 C3:4 F2:4 F2:4 G2:4 G2:4 C3:4 C3:4'},
 cave:{bpm:92,lead:'A4:2 C5:2 E5:4 D5:2 C5:2 B4:4 A4:2 C5:2 E5:2 G5:2 F5:6 - -',bass:'A2:8 G2:8 F2:8 E2:8'},
 gym:{bpm:144,lead:'D5 D5 F5 D5 G5 F5 E5 C5 D5 D5 F5 A5 G5:2 F5 E5 D5 D5 F5 D5 A5 G5 F5 E5 D5 F5 E5 C5 D5:4',bass:'D3:2 A2:2 D3:2 A2:2 C3:2 G2:2 C3:2 G2:2 D3:2 A2:2 D3:2 A2:2 A2:2 E2:2 D3:4'},
 battle:{bpm:168,lead:'A4 A4 C5 A4 D5 A4 E5 D5 C5 C5 E5 C5 F5 E5 D5 C5 B4 B4 D5 B4 E5 D5 C5 B4 A4 C5 E5 A5 G#5 E5 B4 G#4',bass:'A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 F2 F3 F2 F3 G2 G3 G2 G3 G2 G3 G2 G3 E2 E3 E2 E3 E2 E3 E2 E3'},
 boss:{bpm:184,lead:'E5 E5 G5 E5 A5 G5 E5 D5 E5 E5 G5 B5 A5 G5 F#5 D5 C5 C5 E5 C5 F#5 E5 D5 C5 B4 D5 F#5 B5 A5 F#5 D5 B4',bass:'E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 E2 E3 D2 D3 D2 D3 C2 C3 C2 C3 C2 C3 C2 C3 B1 B2 B1 B2 B1 B2 D2 D3'},
 title:{bpm:96,lead:'C5:2 G4:2 C5:2 E5:2 D5:4 G4:4 A4:2 E5:2 D5:2 C5:2 B4:4 G4:4',bass:'C3:8 G2:8 A2:8 G2:8'},
 victory:{bpm:150,once:1,lead:'G5 G5 G5 C6:3 - B5 C6:4 E6:4',bass:'C3:4 G2:4 C3:8'},
 heal:{bpm:160,once:1,lead:'C5 E5 G5 C6:2 G5 C6:4',bass:'C3:4 C3:6'},
 level:{bpm:180,once:1,lead:'C5 E5 G5 C6:3',bass:'-:6'},
 evo:{bpm:120,once:1,lead:'C5 D5 E5 F5 G5 A5 B5 C6:4',bass:'C3:8 C3:4'},
};
const Snd={ac:null,on:true,cur:null,want:null,timer:null,master:null,
 unlock(){if(!this.ac){try{this.ac=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ac.createGain();this.master.gain.value=0.6;this.master.connect(this.ac.destination);}catch(e){return;}}
   if(this.ac.state==='suspended')this.ac.resume();if(this.want&&!this.cur)this.music(this.want,true);},
 tone(f,t,d,type,vol){if(!this.ac||!f)return;const o=this.ac.createOscillator(),g=this.ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0008,t+d*0.95);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+d);},
 music(name,force){if(!force&&this.want===name&&this.cur)return;this.want=name;this.stopMusic();if(!this.ac||!this.on)return;
   const s=SONGS[name];if(!s)return;const lead=parseSeq(s.lead),bass=parseSeq(s.bass);const step=60/s.bpm/2;
   const st={name,s,lead,bass,step,li:0,bi:0,lt:this.ac.currentTime+0.05,bt:this.ac.currentTime+0.05,ended:false};this.cur=st;
   this.timer=setInterval(()=>{if(this.cur!==st)return;const ah=this.ac.currentTime+0.25;
     while(st.lt<ah){if(st.li>=lead.length){if(s.once){st.ended=true;break;}st.li=0;}const n=lead[st.li++];this.tone(n.f,st.lt,n.d*step*0.9,'square',0.045);st.lt+=n.d*step;}
     while(st.bt<ah){if(st.bi>=bass.length){if(s.once)break;st.bi=0;}const n=bass[st.bi++];this.tone(n.f,st.bt,n.d*step*0.95,'triangle',0.09);st.bt+=n.d*step;}
     if(st.ended&&this.ac.currentTime>st.lt+0.1){this.stopMusic();if(this.after){const a=this.after;this.after=null;this.music(a,true);}}
   },60);},
 jingle(name,thenSong){this.after=thenSong||this.want;this.music(name,true);this.want=this.after;},
 stopMusic(){if(this.timer)clearInterval(this.timer);this.timer=null;this.cur=null;},
 sfx(n){if(!this.ac||!this.on)return;const t=this.ac.currentTime;
   if(n==='blip')this.tone(880,t,0.05,'square',0.05);
   else if(n==='ok'){this.tone(660,t,0.05,'square',0.05);this.tone(990,t+0.05,0.07,'square',0.05);}
   else if(n==='bump')this.tone(110,t,0.08,'square',0.06);
   else if(n==='hit'){this.noise(t,0.15,0.25);this.tone(140,t,0.12,'square',0.07);}
   else if(n==='crit'){this.noise(t,0.25,0.3);this.tone(90,t,0.2,'sawtooth',0.07);}
   else if(n==='super'){this.noise(t,0.2,0.3);this.tone(220,t,0.08,'square',0.06);this.tone(330,t+0.08,0.1,'square',0.06);}
   else if(n==='spike'){for(let i=0;i<4;i++)this.tone(400+i*200,t+i*0.04,0.05,'square',0.05);}
   else if(n==='shake')this.tone(200,t,0.06,'triangle',0.1);
   else if(n==='door'){this.tone(300,t,0.06,'square',0.04);this.tone(200,t+0.06,0.08,'square',0.04);}
   else if(n==='push')this.noise(t,0.1,0.15);
   else if(n==='switch'){this.tone(520,t,0.05,'square',0.05);this.tone(780,t+0.05,0.05,'square',0.05);}
   else if(n==='item'){this.tone(784,t,0.08,'square',0.05);this.tone(988,t+0.08,0.08,'square',0.05);this.tone(1175,t+0.16,0.16,'square',0.05);}
   else if(n==='faint'){for(let i=0;i<5;i++)this.tone(400-i*60,t+i*0.06,0.07,'square',0.05);}
   else if(n==='wrong')this.tone(150,t,0.25,'sawtooth',0.05);
   else if(n==='od'){for(let i=0;i<8;i++)this.tone(300+i*120,t+i*0.03,0.05,'sawtooth',0.05);this.noise(t+0.25,0.4,0.3);}
 },
 noise(t,d,v){const len=Math.floor(this.ac.sampleRate*d);const buf=this.ac.createBuffer(1,len,this.ac.sampleRate);const a=buf.getChannelData(0);for(let i=0;i<len;i++)a[i]=(Math.random()*2-1)*(1-i/len);
   const s=this.ac.createBufferSource();s.buffer=buf;const g=this.ac.createGain();g.gain.value=v*0.3;s.connect(g);g.connect(this.master);s.start(t);},
 toggle(){this.on=!this.on;if(!this.on)this.stopMusic();else this.music(this.want,true);}
};

// ---------- pixel helpers ----------
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function R(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function pell(g,cx,cy,rx,ry,c){g.fillStyle=c;for(let y=Math.ceil(cy-ry);y<=Math.floor(cy+ry);y++){const dy=(y+0.5-cy)/ry;if(Math.abs(dy)>1)continue;const hw=rx*Math.sqrt(1-dy*dy);const x0=Math.round(cx-hw),x1=Math.round(cx+hw);if(x1>x0)g.fillRect(x0,y,x1-x0,1);}}
function ptri(g,pts,c){g.fillStyle=c;g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();g.fill();}
function shade(hex,amt){let n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=amt<0?0:255;const p=Math.abs(amt);r=Math.round(r+(f-r)*p);g=Math.round(g+(f-g)*p);b=Math.round(b+(f-b)*p);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function mix(a,b,t){const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const c=[16,8,0].map(s=>Math.round(((A>>s)&255)*(1-t)+((B>>s)&255)*t));return '#'+((1<<24)+(c[0]<<16)+(c[1]<<8)+c[2]).toString(16).slice(1);}
function crisp(c,outlineCol,passes=1){const g=c.getContext('2d');const d=g.getImageData(0,0,c.width,c.height);const a=d.data,w=c.width,h=c.height;
  for(let i=3;i<a.length;i+=4)a[i]=a[i]>110?255:0;
  if(outlineCol)for(let pass=0;pass<passes;pass++){const oc=parseInt(outlineCol.slice(1),16);const mark=[];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(a[i+3])continue;
      if((x>0&&a[i-1])||(x<w-1&&a[i+7])||(y>0&&a[i-w*4+3])||(y<h-1&&a[i+w*4+3]))mark.push(i);}
    for(const i of mark){a[i]=oc>>16;a[i+1]=(oc>>8)&255;a[i+2]=oc&255;a[i+3]=255;}}
  g.putImageData(d,0,0);}

// ---------- character sprites ----------
const LOOKS={
 player:{skin:'#f4c8a0',hair:'#3a2418',top:'#e8642c',bot:'#30384c',acc:'#ffd040'},
 vesna:{skin:'#f0c8a8',hair:'#8a4ab8',top:'#f4f4f4',bot:'#5a6478',coat:1},
 kael:{skin:'#e8b890',hair:'#d0302a',top:'#26262e',bot:'#3a3a48',acc:'#d0302a'},
 mom:{skin:'#f0c8a8',hair:'#7a4a28',top:'#5aa060',bot:'#e0d8c0',dress:1},
 grunt:{skin:'#f0f0f0',hair:'#e8e8f0',top:'#e8e8f0',bot:'#e8e8f0',robe:1,mask:1},
 deacon:{skin:'#f0f0f0',hair:'#a8a0d8',top:'#d8d0f0',bot:'#d8d0f0',robe:1,mask:1,acc:'#7050c0'},
 nurse:{skin:'#f4c8a0',hair:'#e86a8a',top:'#f8f8f8',bot:'#f8f8f8',dress:1,acc:'#e04060'},
 clerk:{skin:'#e0b090',hair:'#304060',top:'#3a70c0',bot:'#2a3040'},
 brakka:{skin:'#c88a5a',hair:'#5a4030',top:'#8a6a40',bot:'#4a3a2a',acc:'#ffb040'},
 ione:{skin:'#f4d0b0',hair:'#f0e040',top:'#2a2a40',bot:'#2a2a40',acc:'#ffe040'},
 tinker:{skin:'#f4c8a0',hair:'#202020',top:'#c8a040',bot:'#5a4a30'},
 scout:{skin:'#e8b890',hair:'#c07030',top:'#5a8a40',bot:'#6a5030'},
 mech:{skin:'#d8a880',hair:'#404040',top:'#4a6a8a',bot:'#4a6a8a'},
 hiker:{skin:'#c89060',hair:'#6a4a2a',top:'#a04030',bot:'#5a4a3a',hat:'#6a5a3a'},
 old:{skin:'#f0d0b0',hair:'#d8d8d8',top:'#8a7aa0',bot:'#4a4a5a'},
 kid:{skin:'#f4d0b0',hair:'#f0a030',top:'#40a0e0',bot:'#e0e0e0'},
 guard:{skin:'#e0b090',hair:'#303030',top:'#3a4a6a',bot:'#2a3042',hat:'#2a3a5a'},
 engineer:{skin:'#d8a070',hair:'#2a2a2a',top:'#e0a020',bot:'#405060',hat:'#f0c020'},
 woman:{skin:'#f0c8a8',hair:'#202028',top:'#c04a6a',bot:'#3a3040',dress:1},
 lineman:{skin:'#e0b090',hair:'#605040',top:'#e0d020',bot:'#303848',hat:'#e0d020'},
 quarry:{skin:'#d09a70',hair:'#3a2a1a',top:'#7a6a50',bot:'#4a3a2a',hat:'#d0a040'},
};
const CHARCACHE={};
function charSprite(lk,dir,fr){const L=typeof lk==='string'?LOOKS[lk]:lk;const key=(typeof lk==='string'?lk:JSON.stringify(lk))+dir+fr;let c=CHARCACHE[key];if(c)return c;
  c=mkCanvas(16,18);const g=c.getContext('2d');const sk=L.skin,hr=L.hair,tp=L.top,bt=L.bot;
  const legY=13;const l1=fr===1?-1:0,l2=fr===2?-1:0;
  if(L.robe){R(g,4,8,8,8,tp);R(g,4,15,8,1,shade(tp,-0.2));if(fr){R(g,fr===1?4:9,15,3,1,'#00000000');}}
  else if(L.dress){R(g,4,8,8,4,tp);R(g,3,11,10,3,tp);R(g,5,14+l1,2,2,sk);R(g,9,14+l2,2,2,sk);}
  else{R(g,5,legY+l1,2,3,bt);R(g,9,legY+l2,2,3,bt);R(g,4,8,8,6,tp);R(g,5,12,6,1,bt);}
  if(L.coat){R(g,4,8,8,7,tp);R(g,7,8,2,5,'#a0d0f0');}
  // arms
  if(dir==='left'||dir==='right'){const ax=dir==='left'?8:6;R(g,ax,9,2,4,shade(tp,-0.15));R(g,ax,13,2,1,sk);}
  else{R(g,3,9,1,4,shade(tp,-0.15));R(g,12,9,1,4,shade(tp,-0.15));R(g,3,13,1,1,sk);R(g,12,13,1,1,sk);}
  if(L.acc&&!L.robe)R(g,4,8,8,1,L.acc);
  if(L.robe&&L.acc)R(g,7,8,2,8,L.acc);
  // head
  R(g,4,2,8,7,sk);R(g,5,1,6,1,sk);
  if(dir==='up'){R(g,4,1,8,7,hr);R(g,5,0,6,1,hr);}
  else{R(g,4,1,8,2,hr);R(g,5,0,6,1,hr);
    if(dir==='down'){R(g,4,3,1,3,hr);R(g,11,3,1,3,hr);}
    if(dir==='left'){R(g,9,3,3,4,hr);}
    if(dir==='right'){R(g,4,3,3,4,hr);}}
  if(L.mask&&dir!=='up'){R(g,4,3,8,5,'#f8f8ff');R(g,dir==='right'?8:dir==='left'?5:5,5,dir==='down'?2:2,1,'#202030');if(dir==='down')R(g,9,5,2,1,'#202030');}
  else if(dir==='down'){R(g,6,5,1,2,'#202030');R(g,9,5,1,2,'#202030');}
  else if(dir==='left'){R(g,5,5,1,2,'#202030');}
  else if(dir==='right'){R(g,10,5,1,2,'#202030');}
  if(L.hat){R(g,3,1,10,2,L.hat);R(g,4,0,8,1,L.hat);}
  crisp(c,'#1c1c28');
  CHARCACHE[key]=c;return c;}

// ---------- UI stack ----------
const UI=[];
function pushUI(w){UI.push(w);return new Promise(r=>w._res=r);}
function popUI(w,v){const i=UI.indexOf(w);if(i>=0)UI.splice(i,1);if(w._res)w._res(v);}
const timers=[];
function wait(f){return new Promise(r=>timers.push({t:f,r}));}
function tickTimers(){for(let i=timers.length-1;i>=0;i--){if(--timers[i].t<=0){const t=timers.splice(i,1)[0];t.r();}}}

// dialog
let TEXTSPEED=2;
function say(text,opt={}){const pages=[];const lines=wrap(text,436);for(let i=0;i<lines.length;i+=2)pages.push(lines.slice(i,i+2));
  const w={pages,pi:0,ch:0,auto:opt.auto,t:0,speaker:opt.speaker,
   update(){const pg=this.pages[this.pi];const total=pg.join('').length;
     if(this.ch<total){this.ch+=TEXTSPEED===3?99:TEXTSPEED;if(press('a')||press('b'))this.ch=total;return;}
     this.t++;
     if(press('a')||press('b')||(this.auto&&this.t>this.auto)){this.t=0;if(this.pi<this.pages.length-1){this.pi++;this.ch=0;Snd.sfx('blip');}else{popUI(this);}}},
   draw(){panel(4,232,472,84);let left=this.ch;const pg=this.pages[this.pi];
     if(this.speaker){ctx.font='18px '+FONT;const sw=measure(this.speaker,18)+16;panel(10,212,sw,28,'#283048');txt(this.speaker,18,232,'#ffe080',18,'left',null);}
     pg.forEach((l,i)=>{const s=l.slice(0,Math.max(0,left));left-=l.length;txt(s,22,264+i*28);});
     if(this.ch>=pg.join('').length&&!this.auto&&TICK%40<26){ctx.fillStyle='#e04040';ptri(ctx,[448,290,460,290,454,298],'#e04040');}}};
  return pushUI(w);}
function choose(opts,o={}){const w={opts,i:o.def||0,x:o.x,y:o.y,cancel:o.cancel!==false,
   update(){if(rep('up')){this.i=(this.i+this.opts.length-1)%this.opts.length;Snd.sfx('blip');}if(rep('down')){this.i=(this.i+1)%this.opts.length;Snd.sfx('blip');}
     if(press('a')){Snd.sfx('ok');popUI(this,this.i);}else if(press('b')&&this.cancel){popUI(this,-1);}},
   draw(){const wd=Math.max(...this.opts.map(s=>measure(s)))+50;const h=this.opts.length*26+18;const x=this.x!=null?this.x:476-wd,y=this.y!=null?this.y:228-h;
     panel(x,y,wd,h);this.opts.forEach((s,i)=>{txt(s,x+30,y+30+i*26);if(i===this.i)ptri(ctx,[x+14,y+18+i*26,x+22,y+24+i*26,x+14,y+30+i*26],'#303840');});}};
  return pushUI(w);}
async function ask(text,opts=['Yes','No'],o={}){const w={pages:[wrap(text,436).slice(0,2)],update(){},draw(){panel(4,232,472,84);this.pages[0].forEach((l,i)=>txt(l,22,264+i*28));}};
  UI.push(w);const r=await choose(opts,o);const i=UI.indexOf(w);if(i>=0)UI.splice(i,1);return r;}
