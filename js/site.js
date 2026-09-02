/* Executive Engagements: shared page behaviour. Split from gateway.js on the phase-1-public-shell branch, 2 September 2026. Every DOM dependency is optional so any page can load it. */

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* reveals: once, never re-animated */
const io = new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}),{threshold:.22});
$$('.rv').forEach(el=>io.observe(el));


let stops=[];
function buildStops(){
  stops=[];
  $$('[data-g]').forEach(s=>{
    const top = s.getBoundingClientRect().top + scrollY;
    stops.push([top, s.dataset.g]);
    if(s.dataset.g2) stops.push([top + s.offsetHeight, s.dataset.g2]);
  });
  stops.sort((a,b)=>a[0]-b[0]);
}
const hex=c=>[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];
function groundAt(y){
  if(!stops.length) return null;
  y += innerHeight*0.5;
  if(y<=stops[0][0]) return stops[0][1];
  if(y>=stops[stops.length-1][0]) return stops[stops.length-1][1];
  for(let i=0;i<stops.length-1;i++){
    if(y>=stops[i][0] && y<stops[i+1][0]){
      const t=(y-stops[i][0])/(stops[i+1][0]-stops[i][0]);
      const a=hex(stops[i][1]), b=hex(stops[i+1][1]);
      return 'rgb('+a.map((v,k)=>Math.round(v+(b[k]-v)*t)).join(',')+')';
    }
  }
  return stops[0][1];
}

const groundEl=$('#ground'), emark=$('#emark'), emSec=$('#s-emergence'), totop=$('#totop');
/* daylight follows the ground itself: when the ground is light, the nav turns to ink. Replaces the single-page rule that watched the request section. */
function lum(c){ let r,g,b; if(c[0]==='#'){ [r,g,b]=hex(c); } else { const m=c.match(/\d+/g); if(!m) return 0; [r,g,b]=m.slice(0,3).map(Number); } return (0.2126*r+0.7152*g+0.0722*b)/255; }
if(totop) totop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
let ticking=false;
function frame(){
  ticking=false;
  const g=groundAt(scrollY); if(groundEl && g) groundEl.style.background = g;
  if(emark && emSec){
    const r = emSec.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight)));
    const op = p<0.55 ? (p/0.55)*0.12 : Math.max(0,(1-p)/0.45)*0.12;
    emark.style.opacity = op.toFixed(3);
  }
  if(document.body.dataset.day==='always') document.body.classList.add('day');
  else if(g) document.body.classList.toggle('day', lum(g) > 0.4);
  const past=scrollY>innerHeight*0.9; if(totop){ totop.hidden=!past; totop.classList.toggle('show',past); }
}
function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }
addEventListener('scroll', onScroll, {passive:true});
addEventListener('resize', ()=>{ buildStops(); onScroll(); });
addEventListener('load', ()=>{ buildStops(); frame(); });
buildStops(); frame();


function wireGo(el){
  el.addEventListener('click', ev=>{
    ev.preventDefault();
    if(el.dataset.path && typeof inquiry!=='undefined') inquiry.pathway=el.dataset.path;
    if(el.dataset.note){ const n=document.getElementById('r8')||document.getElementById('sp4'); if(n && !n.value) n.value=el.dataset.note; }
    const t=document.querySelector(el.dataset.go); if(!t) return;
    const go=()=>t.scrollIntoView({behavior:reduced?'auto':'smooth'});
    if(el.classList.contains('btn-dom')){ el.classList.add('pressed'); setTimeout(()=>{el.classList.remove('pressed'); go();},220); }
    else go();
  });
}
$$('[data-go]').forEach(wireGo);

/* nav: the More menu opens on hover, and on tap where there is no hover */
$$('.more-toggle').forEach(t=>{
  const w=t.parentElement;
  t.addEventListener('click',ev=>{
    ev.preventDefault();
    const open=!w.classList.contains('open');
    w.classList.toggle('open',open); t.setAttribute('aria-expanded',String(open));
  });
});
addEventListener('click',ev=>{
  $$('.more-wrap.open').forEach(w=>{
    if(w.contains(ev.target)) return;
    w.classList.remove('open'); const t=w.querySelector('.more-toggle'); if(t) t.setAttribute('aria-expanded','false');
  });
});

/* nav: the phone menu */
const mtoggle=$('.menu-toggle'), mmenu=$('#mobile-menu');
if(mtoggle && mmenu){
  const set=open=>{ mmenu.hidden=!open; mtoggle.setAttribute('aria-expanded',String(open)); mtoggle.textContent=open?'Close':'Menu'; };
  mtoggle.addEventListener('click',()=>set(mmenu.hidden));
  mmenu.addEventListener('click',ev=>{ if(ev.target.closest('a')) set(false); });
  addEventListener('keydown',ev=>{ if(ev.key==='Escape' && !mmenu.hidden) set(false); });
  addEventListener('resize',()=>{ if(innerWidth>880 && !mmenu.hidden) set(false); });
}

/* each territory can open the rest of its canonical sessions */
$$('button.more').forEach(b=>b.addEventListener('click',()=>{
  const t=document.getElementById(b.getAttribute('aria-controls')); if(!t) return;
  const open=t.hidden;
  if(open){ t.hidden=false; requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('open'))); }
  else { t.classList.remove('open'); t.hidden=true; }
  b.setAttribute('aria-expanded',String(open));
  b.textContent=open ? b.dataset.open : b.dataset.closed;
}));

function initStrip(stripSel,countSel,prevSel,nextSel){
  const strip=$(stripSel); if(!strip) return;
  const n=strip.querySelectorAll('.panel').length;
  const count=()=>{ const i=Math.round(strip.scrollLeft/strip.clientWidth); $(countSel).textContent=String(i+1).padStart(2,'0')+' / '+String(n).padStart(2,'0'); };
  $(prevSel).addEventListener('click',()=>strip.scrollBy({left:-strip.clientWidth,behavior:reduced?'auto':'smooth'}));
  $(nextSel).addEventListener('click',()=>strip.scrollBy({left:strip.clientWidth,behavior:reduced?'auto':'smooth'}));
  strip.addEventListener('scroll',count,{passive:true});
  addEventListener('resize',count);
}
initStrip('#tstrip','#tcount','#tprev','#tnext');
initStrip('#strip','#fcount','#fprev','#fnext');
const dio=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('draw'); dio.unobserve(e.target); }
}),{threshold:.45});
$$('.roomsvg').forEach(s=>dio.observe(s));

/* the request completes in daylight, with a real reference */
function makeRef(){
  const d=new Date();
  const ymd=d.getFullYear().toString()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  const rand=Array.from(crypto.getRandomValues(new Uint8Array(3))).map(b=>'ABCDEFGHJKMNPQRSTVWXYZ23456789'[b%30]).join('');
  return 'EEG-'+ymd+'-'+rand;
}
/* Submission pipeline: the Apps Script endpoint (endpoint/Code.gs). The URL is set
   at deployment via window.EEG_ENDPOINT or the constant below; until then the form
   completes locally so the experience can be walked end to end. */

const ENDPOINT_FALLBACK='https://script.google.com/macros/s/AKfycbzMDkV2vm9i9Vdvc8FJ1s8PiXoISmtbs_taeGSBEOgQlx1Hs5SUqOxFG9nJJ4C3cflAuw/exec';

function miniForm(id, pathway, fields){
  const f=$(id); if(!f) return;
  f.addEventListener('submit', async e=>{
    e.preventDefault();
    const payload={ref:makeRef(), ts:new Date().toISOString(), pathway};
    fields.forEach(([k,sel])=>{ payload[k]=$(sel).value.trim(); });
    const bad=fields.find(([k,sel])=>$(sel).type==='email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload[k]));
    if(bad){ $(bad[1]).focus(); return; }
    const url=(typeof window!=='undefined' && window.EEG_ENDPOINT) || ENDPOINT_FALLBACK;
    if(url){
      try{ await fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); }
      catch(err){ console.error(pathway+' submit failed', err); }
    }
    f.hidden=true;
    const d=f.parentElement.querySelector('.mini-done'); if(d) d.hidden=false;
  });
}
miniForm('#introform','introduce',[['name','#i1'],['email','#i2'],['organization','#i3'],['why','#i4']]);
miniForm('#subform','subscribe',[['email','#s1']]);


/* Speak With Someone: the lightweight route on every page. Same pipeline, introduce pathway. */
miniForm('#speakform','introduce',[['name','#sp1'],['email','#sp2'],['organization','#sp3'],['why','#sp4']]);
