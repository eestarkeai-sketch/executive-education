const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* reveals: once, never re-animated */
const io = new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}),{threshold:.22});
$$('.rv').forEach(el=>io.observe(el));

/* the luminance spine */
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
const groundEl=$('#ground'), emark=$('#emark'), emSec=$('#s-emergence'), reqSec=$('#s-request');
let ticking=false;
function frame(){
  ticking=false;
  groundEl.style.background = groundAt(scrollY);
  const r = emSec.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight)));
  const op = p<0.55 ? (p/0.55)*0.12 : Math.max(0,(1-p)/0.45)*0.12;
  emark.style.opacity = op.toFixed(3);
  document.body.classList.toggle('day', reqSec.getBoundingClientRect().top < innerHeight*0.35);
}
function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(frame); } }
addEventListener('scroll', onScroll, {passive:true});
addEventListener('resize', ()=>{ buildStops(); onScroll(); });
addEventListener('load', ()=>{ buildStops(); frame(); });
buildStops(); frame();

/* navigation and CTA presses */
function wireGo(el){
  el.addEventListener('click', ev=>{
    ev.preventDefault();
    if(el.dataset.path) inquiry.pathway=el.dataset.path;
    if(el.dataset.note){ const n=document.getElementById('r8'); if(n && !n.value) n.value=el.dataset.note; }
    const go=()=>document.querySelector(el.dataset.go).scrollIntoView({behavior:reduced?'auto':'smooth'});
    if(el.classList.contains('btn-dom')){ el.classList.add('pressed'); setTimeout(()=>{el.classList.remove('pressed'); go();},220); }
    else go();
  });
}
$$('[data-go]').forEach(wireGo);

/* each territory can open the rest of its canonical sessions */
$$('button.more').forEach(b=>b.addEventListener('click',()=>{
  const t=document.getElementById(b.getAttribute('aria-controls')); if(!t) return;
  const open=t.hidden;
  if(open){ t.hidden=false; requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('open'))); }
  else { t.classList.remove('open'); t.hidden=true; }
  b.setAttribute('aria-expanded',String(open));
  b.textContent=open ? b.dataset.open : b.dataset.closed;
}));

/* ============================================================
   THE SCREENING: four-answer routing engine
   Derived from the sealed Executive Topics Library (territories
   and sessions) and the Commercial Architecture format ladder.
   The full mapping is documented in
   Gateway_Selector_Routing_Matrix_v1.md; this table is that
   document, executable.
   ============================================================ */
const LBL={
  d1:'Pressure and decision quality', d2:'Identity and authority', d3:'Alignment and culture',
  d4:'Teams, trust and accountability', d5:'Founders in transition', d6:'Change and stewardship',
  custom:'Your own words',
  a_exec:'Executive team or C-suite', a_senior:'Senior leaders or partners', a_new:'Newly elevated leaders',
  a_founders:'Founders', a_members:'Association or chamber members', a_orgall:'The whole organization', a_conf:'A conference audience',
  c_think:'A new way of thinking', c_decide:'A decision to align on', c_capability:'Capability over months',
  c_team:'How the team decides together', c_org:'The organization itself', c_unsure:'A read first',
  t_slot:'30 to 60 minutes', t_session:'90 to 120 minutes', t_half:'A half day',
  t_full:'A full day or offsite', t_series:'A series', t_ongoing:'Ongoing'
};
const TERR={
  d1:'Leadership Under Pressure and Decision Quality',
  d2:'Executive Identity and Authority',
  d3:'Organizational Alignment and Culture',
  d4:'Executive Teams, Trust and Accountability',
  d5:'Leaders and Founders in Transition',
  d6:'Change, Resilience and Institutional Leadership'
};
/* canonical sessions, one line each, straight from the Library */
const S={
  DUU:{t:'Decisions Under Uncertainty',sub:'Presented as "Leading Under Pressure: The Decisions No One Sees You Make"',line:'Responsible commitment without complete information, and the difference between prudent delay and avoidance.'},
  EJ:{t:'Executive Judgment',line:'Experience creates confidence; it does not automatically produce judgment. This session works on the difference.'},
  SC:{t:'Strategic Clarity',line:'For organizations with plans, goals and initiatives, but no shared answer to what matters most.'},
  EA:{t:'Executive Attention',line:'What senior leaders repeatedly attend to becomes what the organization treats as important.'},
  IOS:{t:'Identity Is the Operating System',line:'Leadership behavior emerges from identity. Work on the operating system, not just the behavior.'},
  LS:{t:'Leadership Shadows',sub:'Presented as "If a Leader Falls, Who Notices?"',line:'The unexamined patterns of a leader become the tolerated patterns of the organization.'},
  RWC:{t:'Responsibility Without Collapse',line:'Carrying responsibility is the job. Carrying everything is the failure mode.'},
  EM:{t:'The Executive Mirror',line:'Executives evaluate the organization more rigorously than their own contribution to its problems.'},
  EE:{t:'Executive Energy and Sustainable Performance',line:'Depletion normalized as commitment is an organizational cost, not a badge.'},
  AM:{t:'The Alignment Myth',line:'Alignment is not agreement or harmony. It is coherence you can operate on.'},
  AoM:{t:'Anatomy of Misalignment',line:'Misalignment is rarely a communication problem. This session diagnoses what it actually is.'},
  EAO:{t:'Execution Is an Alignment Outcome',line:'Execution problems answered with pressure come back. Answered with diagnosis, they close.'},
  AR:{t:'Alignment Rhythms',line:'Alignment is maintained through rhythm, not declared at the annual retreat.'},
  BAO:{t:'Becoming an Aligned Organization',line:'One integrated operating picture instead of fragmented improvement initiatives.'},
  ETE:{t:'Executive Team Effectiveness',line:'Shared purpose, role clarity, decision discipline and collective responsibility, worked as a system.'},
  TaI:{t:'Trust as Infrastructure',line:'Low trust taxes speed, candor and execution. Trust is infrastructure, not sentiment.'},
  ATBA:{t:'Accountability That Builds Adults',line:'Accountability that increases ownership instead of fear, dependency or compliance.'},
  PS:{t:'Psychological Safety Without Lowering Standards',line:'Candor and dignity on one side, demanding standards on the other. Both.'},
  SY:{t:'Scaling Yourself Before Scaling the Company',fsub:'Presented in founder rooms as "Clarity Before Scale"',line:'Organizational scale requires leadership evolution before it requires more complexity.'},
  OtA:{t:'From Operator to Architect',line:'From solving the work personally to designing the system that accomplishes it.'},
  RWLY:{t:'Reinvention Without Losing Yourself',line:'Necessary reinvention without the feeling of betraying what built the success.'},
  FP:{t:'Founder Psychology',line:'The company often becomes an external expression of the founder’s internal architecture.'},
  FB:{t:'The Founder Bottleneck',line:'When the capabilities that created the company begin to limit its scale.'},
  LTC:{t:'Leading Through Change',line:'Leadership through uncertainty, transition and disruption, beyond the project plan.'},
  OR:{t:'Organizational Resilience',line:'Resilience built from relationships, systems, reserves and learning, not from endurance.'},
  BAA:{t:'Building Adaptive Organizations',line:'Learning and adjusting without losing coherence, neither rigid nor reactive.'},
  TLG:{t:'The Long Game',line:'Stewardship of decisions whose full consequences arrive after the leader’s tenure.'},
  IS:{t:'Institutional Stewardship',line:'Leading the organization as an institution entrusted to you, not an asset belonging to you.'},
  LC:{t:'Legacy and Continuity',line:'Legacy is the capacity that remains when the leader is no longer central.'}
};
/* topic grid: territory x desired change -> session */
const TOPIC={
  d1:{c_think:'EJ', c_decide:'SC', c_capability:'DUU', c_team:'EA',  c_org:'SC',  c_unsure:'DUU'},
  d2:{c_think:'IOS',c_decide:'EM', c_capability:'EE',  c_team:'LS',  c_org:'LS',  c_unsure:'IOS'},
  d3:{c_think:'AM', c_decide:'AoM',c_capability:'AR',  c_team:'EAO', c_org:'BAO', c_unsure:'AM'},
  d4:{c_think:'TaI',c_decide:'ETE',c_capability:'ATBA',c_team:'ETE', c_org:'PS',  c_unsure:'ETE'},
  d5:{c_think:'FP', c_decide:'SY', c_capability:'OtA', c_team:'FB',  c_org:'SY',  c_unsure:'SY'},
  d6:{c_think:'TLG',c_decide:'LTC',c_capability:'OR',  c_team:'BAA', c_org:'IS',  c_unsure:'LTC'}
};
const POOL={
  d1:['DUU','EJ','SC','EA'], d2:['IOS','LS','EM','EE','RWC'], d3:['AM','AoM','AR','BAO','EAO'],
  d4:['ETE','TaI','ATBA','PS'], d5:['SY','OtA','FP','FB','RWLY'], d6:['LTC','OR','TLG','IS','BAA','LC']
};
/* format engine v1.1: time x audience with framing and the large-audience guard.
   LARGE audiences never receive a 12-to-40-seat working format; where the
   audience does not change the canonical format, it changes the buyer-facing
   framing instead. No formats are invented. */
const LARGE=['a_orgall','a_conf'];
const FRAME={
  a_exec:'Framed for the executive team: the decisions worked are your own.',
  a_senior:'Framed for senior leaders and partners: peer-level, candid, off the record.',
  a_new:'Framed for newly elevated leaders: judgment built early, not learned expensively.',
  a_founders:'Presented in founder rooms, with founder cases and founder language.',
  a_members:'Hosted or sponsored through the chamber or association, for your members.',
  a_orgall:'Delivered to land in one room, for the whole organization at once.',
  a_conf:'Built for a conference program: one strong hour that stands alone.'
};
const GUARD_NOTE='Working formats hold 12 to 40 seats; for a room of this size the keynote carries the method.';
function routeFormat(a){
  const aud=a.audience, chg=a.change, t=a.time;
  let f, note='', refined=false, guard=false;
  const KEYNOTE={n:'Executive Keynote', facts:'30 or 60 minutes · theater or ballroom · any size'};
  if(t==='t_slot'){
    if(aud==='a_exec'||aud==='a_senior'||aud==='a_new'){
      f={n:'Executive Conversation', facts:'30 to 60 minutes · moderated or fireside · conferences, dinners, boards'}; refined=true;
    } else { f=KEYNOTE; }
  } else if(t==='t_session'){
    if(LARGE.includes(aud)){ f=KEYNOTE; guard=true; }
    else if(aud==='a_senior' && chg==='c_think'){
      f={n:'Executive Roundtable', facts:'60 to 90 minutes · senior and off the record · 8 to 25 seats'}; refined=true;
    } else { f={n:'Executive Working Session', facts:'90 to 120 minutes · boardroom, cabaret or U-shape · 12 to 40 seats'}; }
  } else if(t==='t_half'){
    if(LARGE.includes(aud)){ f=KEYNOTE; guard=true; }
    else { f={n:'Leadership Laboratory', facts:'a half day · applied learning cycles, practice over theory · 12 to 40'}; }
  } else if(t==='t_full'){
    f={n:'Executive Intensive or Offsite', facts:'one or two days · one organizational challenge · prepared before anyone enters the room'};
  } else if(t==='t_series'){
    if(aud==='a_members'||aud==='a_conf'){
      f={n:'The Executive Leadership Series', facts:'three working sessions · hosted or sponsored by a chamber or company'}; refined=true;
    } else if(aud==='a_new'){
      f={n:'Leadership Series', facts:'a six-week cohort of 20 to 40 · in-person kickoff and capstone'}; refined=true;
    } else { f={n:'Leadership Series', facts:'three working sessions over weeks or months · application between sessions'}; }
  } else {
    f={n:'Organizational Advisory', facts:'ongoing · begins with a conversation, not a date'};
  }
  if(guard) note=GUARD_NOTE;
  else if(chg==='c_unsure' && t!=='t_ongoing') note='Or begin with a read: the Organizational Pulse Check opens ongoing advisory work.';
  else if(chg==='c_capability' && (t==='t_slot'||t==='t_session')) note='For capability that holds over months, the Leadership Series is the stronger vehicle.';
  const frame=(!refined && !guard && FRAME[aud]) ? FRAME[aud] : '';
  return {f, note, frame};
}
function route(a){
  if(a.territory==='custom') return {custom:true, ...routeFormat(a)};
  const key=TOPIC[a.territory][a.change];
  const prim=S[key];
  const sub = prim.sub ? prim.sub : (prim.fsub && a.audience==='a_founders' ? prim.fsub : '');
  const also=POOL[a.territory].filter(k=>k!==key).slice(0,2).map(k=>S[k]);
  return {primary:prim, sub, terr:TERR[a.territory], also, ...routeFormat(a)};
}

/* stepper */
const WORDS=['One','Two','Three','Four'];
let step=0;
const sel={territory:null,audience:null,change:null,time:null};
/* structured inquiry context: preserved into the record, not merely prefilled text */
const inquiry={pathway:'direct', answers:null, recommendation:null};
function showStep(i){
  $$('#selsteps .step').forEach((s,idx)=>s.classList.toggle('on', idx===i));
  $('#selprog').style.width=(Math.min(i,4)/4*100)+'%';
  $('#selglow').style.opacity=(Math.min(i,4)*0.085).toFixed(3);
  $('#selcount').textContent=WORDS[Math.min(i,3)];
  if(i===4) $('#seleyebrow').textContent='Find the right executive session';
}
function echoLine(a){
  return [LBL[a.territory],LBL[a.audience],LBL[a.change],LBL[a.time]].join(' · ');
}
function populateReveal(){
  const r=route(sel), pr=$('#revprimary'), al=$('#revalso');
  if(r.custom){
    pr.innerHTML='<div class="lab">Your situation, in your words</div>'
      +'<h3>Some situations do not fit a menu.</h3>'
      +'<p>Describe what is happening in the request, and the engagement is designed around it.</p>'
      +'<div class="fmt"><span class="fn">The natural way in: '+r.f.n+'</span><span class="ff">'+r.f.facts+'</span>'+(r.note?'<span class="fnote">'+r.note+'</span>':'')+(r.frame?'<span class="fnote">'+r.frame+'</span>':'')+'</div>'
      +'<div class="echo">Routed from your answers: '+echoLine(sel)+'</div>'
      +'<button type="button" class="go" data-fill="1">Specify the engagement</button>';
    al.innerHTML='';
  } else {
    pr.innerHTML='<div class="lab">Primary recommendation</div>'
      +'<h3>'+r.primary.t+'</h3>'
      +(r.sub?'<div class="rsub">'+r.sub+'</div>':'')
      +'<div class="terr">'+r.terr+'</div>'
      +'<p>'+r.primary.line+'</p>'
      +'<div class="fmt"><span class="fn">As an engagement: '+r.f.n+'</span><span class="ff">'+r.f.facts+'</span>'+(r.note?'<span class="fnote">'+r.note+'</span>':'')+(r.frame?'<span class="fnote">'+r.frame+'</span>':'')+'</div>'
      +'<div class="echo">Routed from your answers: '+echoLine(sel)+'</div>'
      +'<button type="button" class="go" data-fill="1">Check availability for this</button>';
    al.innerHTML='<div class="lab">Also worth considering</div>'
      +r.also.map(e=>'<div class="e"><h4>'+e.t+'</h4><div class="terr">'+r.terr+'</div><a href="#s-request" class="alink" data-alt="'+e.t.replace(/"/g,'&quot;')+'">Check availability</a></div>').join('');
  }
  const currentRoute=r;
  inquiry.answers={...sel};
  inquiry.recommendation={
    topic: r.custom? null : r.primary.t,
    subtitle: r.sub||null,
    territory: r.custom? null : r.terr,
    format: r.f.n, format_facts: r.f.facts,
    note: r.note||null, frame: r.frame||null,
    secondary: r.also? r.also.map(e=>e.t) : []
  };
  $$('#revgrid .go, #revgrid .alink').forEach(el=>el.addEventListener('click',ev=>{
    ev.preventDefault();
    inquiry.pathway = el.dataset.alt ? 'selector-secondary' : (currentRoute.custom ? 'selector-custom' : 'selector-primary');
    if(el.dataset.alt) inquiry.recommendation.secondary_chosen = el.dataset.alt;
    prefillRequest(currentRoute, el.dataset.alt||null);
    document.querySelector('#s-request').scrollIntoView({behavior:reduced?'auto':'smooth'});
  }));
}
/* the selector state passes into the request */
function prefillRequest(r, altTopic){
  const q=id=>document.getElementById(id);
  if(sel.audience) q('r3').value=LBL[sel.audience];
  if(sel.territory) q('r4').value = sel.territory==='custom' ? '' : LBL[sel.territory]+': '+LBL[sel.change].toLowerCase();
  q('r5').value=r.f.n;
  const topic = altTopic || (r.primary ? r.primary.t : '');
  q('r8').value = topic ? 'From the selector: '+topic+' · '+r.f.n : 'From the selector: '+r.f.n;
}
$$('#q1 .ans').forEach(b=>b.addEventListener('click',()=>{ sel.territory=b.dataset.k; step=1; showStep(1); }));
$$('#q2 .ans').forEach(b=>b.addEventListener('click',()=>{ sel.audience=b.dataset.k; step=2; showStep(2); }));
$$('#q3 .ans').forEach(b=>b.addEventListener('click',()=>{ sel.change=b.dataset.k; step=3; showStep(3); }));
$$('#q4 .ans').forEach(b=>b.addEventListener('click',()=>{ sel.time=b.dataset.k; step=4; populateReveal(); showStep(4); }));

/* the formats strip */
const strip=$('#strip');
const panels=$$('.panel').length;
$('#fprev').addEventListener('click',()=>strip.scrollBy({left:-strip.clientWidth,behavior:reduced?'auto':'smooth'}));
$('#fnext').addEventListener('click',()=>strip.scrollBy({left:strip.clientWidth,behavior:reduced?'auto':'smooth'}));
strip.addEventListener('scroll',()=>{
  const i=Math.round(strip.scrollLeft/strip.clientWidth);
  $('#fcount').textContent=String(i+1).padStart(2,'0')+' / '+String(panels).padStart(2,'0');
},{passive:true});
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
$('#reqform').addEventListener('submit',async e=>{
  e.preventDefault();
  const ref=makeRef();
  const v=id=>document.getElementById(id).value;
  const payload={
    ref, ts:new Date().toISOString(),
    when:v('r1'), organization:v('r2'), room:v('r3'), happening:v('r4'),
    format:v('r5'), name:v('r6'), email:v('r7'), notes:v('r8'),
    pathway:inquiry.pathway,
    selector:inquiry.answers ? {
      answers:Object.fromEntries(Object.entries(inquiry.answers).map(([k,val])=>[k,{key:val,label:LBL[val]||val}])),
      recommendation:inquiry.recommendation
    } : null
  };
  const url=(typeof window!=='undefined' && window.EEG_ENDPOINT) || ENDPOINT_FALLBACK;
  if(url){
    try{ await fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)}); }
    catch(err){ console.error('inquiry submit failed', err); }
  }
  $('#refval').textContent=ref;
  $('#reqview').hidden=true;
  const c=$('#confview'); c.hidden=false;
  requestAnimationFrame(()=>c.classList.add('in'));
  c.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
});

/* the two daylight lines: an introduction and a subscription, through the same pipeline */
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
