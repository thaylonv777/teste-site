/* ============================================================
   LUMIÈRE — interações
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ---------- Lenis smooth scroll ---------- */
let lenis;
function initLenis(){
  lenis = new Lenis({ duration:1.15, easing:(t)=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time)=>lenis.raf(time*1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Preloader ---------- */
function preloader(){
  const pl = document.getElementById('preloader');
  const tl = gsap.timeline();
  tl.to('.preloader__brand',{opacity:1,y:0,duration:.9,ease:'power3.out'},.2)
    .to('.preloader__line',{width:220,duration:1,ease:'power2.inOut'},'-=.5')
    .to('.preloader__sub',{opacity:1,duration:.7,ease:'power2.out'},'-=.6')
    .to('.preloader__inner',{opacity:0,y:-14,duration:.6,ease:'power2.in',delay:.35})
    .to(pl,{yPercent:-100,duration:.9,ease:'power4.inOut',onComplete:()=>pl.remove()},'-=.2')
    .add(heroIntro,'-=.5');
}

/* ---------- Hero intro ---------- */
function heroIntro(){
  gsap.to('.hero__title .line>span',{y:0,duration:1.1,stagger:.12,ease:'power4.out'});
  gsap.to('.hero .reveal',{opacity:1,y:0,duration:1,stagger:.12,ease:'power3.out'},);
  gsap.fromTo('.hero__media',{opacity:0,scale:.94},{opacity:1,scale:1,duration:1.3,ease:'power3.out'});
}

/* ---------- animated light canvas ---------- */
function lightCanvas(id){
  const c = document.getElementById(id); if(!c) return;
  const ctx = c.getContext('2d'); let w,h,dpr;
  const orbs = [
    {x:.7,y:.25,r:.5,col:'228,195,152',a:.22,sx:.00006,sy:.00004,p:0},
    {x:.25,y:.7,r:.55,col:'224,169,138',a:.16,sx:-.00005,sy:.00006,p:2},
    {x:.5,y:.4,r:.4,col:'199,154,99',a:.14,sx:.00004,sy:-.00005,p:4},
  ];
  function resize(){dpr=Math.min(window.devicePixelRatio||1,2);w=c.width=c.offsetWidth*dpr;h=c.height=c.offsetHeight*dpr;}
  resize(); window.addEventListener('resize',resize);
  function draw(t){
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
    orbs.forEach(o=>{
      const ox=(o.x+Math.sin(t*o.sx+o.p)*.12)*w;
      const oy=(o.y+Math.cos(t*o.sy+o.p)*.12)*h;
      const rad=o.r*Math.min(w,h);
      const g=ctx.createRadialGradient(ox,oy,0,ox,oy,rad);
      g.addColorStop(0,`rgba(${o.col},${o.a})`);
      g.addColorStop(1,`rgba(${o.col},0)`);
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(ox,oy,rad,0,Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ---------- cursor glow ---------- */
function cursorGlow(){
  const g = document.getElementById('cursorGlow'); if(!g) return;
  if(window.matchMedia('(hover:none)').matches) return;
  let tx=0,ty=0,cx=0,cy=0;
  window.addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;g.style.opacity=1;});
  (function loop(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;g.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop);})();
}

/* ---------- nav scrolled ---------- */
function navScroll(){
  const nav=document.getElementById('nav');
  ScrollTrigger.create({start:'top -60',end:99999,onUpdate:self=>{nav.classList.toggle('scrolled',self.scroll()>60);}});
}

/* ---------- reveals ---------- */
function reveals(){
  gsap.utils.toArray('.reveal').forEach(el=>{
    if(el.closest('.hero')) return; // hero handled in intro
    gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 86%'}});
  });
}

/* ---------- counters ---------- */
function counters(){
  gsap.utils.toArray('[data-count]').forEach(el=>{
    const end=parseFloat(el.dataset.count);
    const dec=el.dataset.decimal==='true';
    const pre=el.dataset.prefix||''; const suf=el.dataset.suffix||'';
    const obj={v:0};
    ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>{
      gsap.to(obj,{v:end,duration:2,ease:'power2.out',onUpdate:()=>{
        let val = dec ? (obj.v/10).toFixed(1) : Math.round(obj.v).toLocaleString('pt-BR');
        el.textContent = pre+val+suf;
      }});
    }});
  });
}

/* ---------- marquee ---------- */
function marquee(){
  const track=document.getElementById('marqueeTrack'); if(!track) return;
  const loop=gsap.to(track,{xPercent:-50,repeat:-1,duration:24,ease:'none'});
  let dir=1;
  ScrollTrigger.create({start:0,end:99999,onUpdate:self=>{
    const v=self.getVelocity();
    if(v!==0){ dir=v<0?-1:1; gsap.to(loop,{timeScale:dir*(1+Math.min(Math.abs(v)/400,4)),overwrite:true});
      clearTimeout(track._t); track._t=setTimeout(()=>gsap.to(loop,{timeScale:dir*1,overwrite:true}),180);
    }
  }});
}

/* ---------- parallax ---------- */
function parallax(){
  gsap.utils.toArray('[data-parallax]').forEach(el=>{
    const d=parseFloat(el.dataset.parallax);
    gsap.to(el,{yPercent:-d*100,ease:'none',
      scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}});
  });
}

/* ---------- scroll-scrub frame sequence (canvas) ---------- */
function scrubSequence(){
  const canvas=document.getElementById('scrubCanvas');
  const sec=document.getElementById('experiencia');
  const prog=document.getElementById('showProg');
  if(!canvas||!sec) return;
  const ctx=canvas.getContext('2d');
  const COUNT=76;
  const pad=n=>String(n).padStart(3,'0');
  const frames=[]; let loaded=0; let current=-1;
  for(let i=1;i<=COUNT;i++){const img=new Image();img.src=`assets/seq/f_${pad(i)}.jpg`;img.onload=()=>{loaded++;if(i===1)drawCover(img);};frames.push(img);}

  let w,h,dpr;
  function resize(){dpr=Math.min(window.devicePixelRatio||1,2);w=canvas.width=canvas.offsetWidth*dpr;h=canvas.height=canvas.offsetHeight*dpr;if(current>=0&&frames[current])drawCover(frames[current]);}
  function drawCover(img){
    if(!img||!img.naturalWidth) return;
    const ir=img.naturalWidth/img.naturalHeight, cr=w/h;
    let dw,dh,dx,dy;
    if(ir>cr){dh=h;dw=h*ir;dx=(w-dw)/2;dy=0;} else {dw=w;dh=w/ir;dx=0;dy=(h-dh)/2;}
    ctx.clearRect(0,0,w,h); ctx.drawImage(img,dx,dy,dw,dh);
  }
  window.addEventListener('resize',resize); resize();

  const caps=gsap.utils.toArray('.cap');
  gsap.set('.cap--1',{opacity:1,y:0});
  ScrollTrigger.create({
    trigger:sec,start:'top top',end:'bottom bottom',scrub:.35,
    onUpdate:self=>{
      const p=self.progress;
      const idx=Math.min(COUNT-1,Math.round(p*(COUNT-1)));
      if(idx!==current&&frames[idx]&&frames[idx].naturalWidth){current=idx;drawCover(frames[idx]);}
      if(prog) prog.style.width=(p*100)+'%';
      const ci = p<.33?0 : p<.66?1 : 2;
      caps.forEach((c,i)=>gsap.to(c,{opacity:i===ci?1:0,y:i===ci?0:20,duration:.5,overwrite:true}));
    }
  });
}

/* ---------- before/after compare ---------- */
function compare(){
  const wrap=document.getElementById('compare');
  const before=document.getElementById('compareBefore');
  const handle=document.getElementById('compareHandle');
  if(!wrap) return;
  let active=false;
  const set=(x)=>{const r=wrap.getBoundingClientRect();let p=((x-r.left)/r.width)*100;p=Math.max(2,Math.min(98,p));before.style.width=p+'%';handle.style.left=p+'%';};
  const start=()=>active=true; const end=()=>active=false;
  wrap.addEventListener('mousedown',e=>{start();set(e.clientX);});
  window.addEventListener('mousemove',e=>{if(active)set(e.clientX);});
  window.addEventListener('mouseup',end);
  wrap.addEventListener('touchstart',e=>{start();set(e.touches[0].clientX);},{passive:true});
  wrap.addEventListener('touchmove',e=>{if(active)set(e.touches[0].clientX);},{passive:true});
  wrap.addEventListener('touchend',end);
  // gentle auto demo on first reveal
  ScrollTrigger.create({trigger:wrap,start:'top 70%',once:true,onEnter:()=>{
    gsap.fromTo({p:50},{p:50},{p:78,duration:1.1,yoyo:true,repeat:1,ease:'power1.inOut',
      onUpdate(){const v=this.targets()[0].p;before.style.width=v+'%';handle.style.left=v+'%';}});
  }});
}

/* ---------- init ---------- */
window.addEventListener('DOMContentLoaded',()=>{
  initLenis();
  lightCanvas('heroCanvas');
  lightCanvas('ctaCanvas');
  cursorGlow();
  navScroll();
  reveals();
  counters();
  marquee();
  parallax();
  scrubSequence();
  compare();
  preloader();
  ScrollTrigger.refresh();
});
