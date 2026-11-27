"use client";
import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import {buildVillage,places,doorway,canWalk,groundHeight,type PlaceId,type Position} from "./VillageWorld";

type Config = {
 personal:{name:string;title:string;bio:string[];stats:{label:string;value:string}[]};
 experience:{title:string;company:string;period:string;description:string}[];
 projects:{name:string;description:string;tags:string[];url?:string}[];
 skills:{category:string;items:{name:string;level:string}[]}[];
 education:{degree:string;institution:string;period:string;description:string}[];
 certifications:{title:string;issuer:string}[];
 achievements?:{title:string;detail:string}[];
 contact:{greeting:string;message:string;links:{text:string;url:string}[]};
};
const start:Position={x:4,z:16};
const distance=(a:Position,b:Position)=>Math.hypot(a.x-b.x,a.z-b.z);
const byId=(id:PlaceId)=>places.find(p=>p.id===id)!;
function speak(text:string){
 if(!("speechSynthesis" in window))return;
 window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang="en-IN";u.rate=.92;u.pitch=1;
 window.speechSynthesis.speak(u);
}
function Details({id,c}:{id:PlaceId;c:Config}){
 return <div className="village-details">
 {id==="home"&&<><h2>{c.personal.name}</h2><p>{c.personal.title}</p><div className="village-stats">{c.personal.stats.map(s=><div key={s.label}><strong>{s.value}</strong><small>{s.label}</small></div>)}</div>{c.personal.bio.map(b=><p key={b}>{b}</p>)}<a href="/resume.pdf" target="_blank" rel="noreferrer">Read résumé ↗</a></>}
 {id==="experience"&&c.experience.map(e=><article key={e.company}><small>{e.period}</small><h3>{e.company}</h3><strong>{e.title}</strong><p>{e.description}</p></article>)}
 {id==="projects"&&c.projects.map(p=><article key={p.name}><h3>{p.name}</h3><p>{p.description}</p><div className="village-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>{p.url&&<a href={p.url} target="_blank" rel="noreferrer">View source ↗</a>}</article>)}
 {id==="skills"&&c.skills.map(s=><article key={s.category}><h3>{s.category}</h3><div className="village-tags">{s.items.map(i=><span key={i.name}>{i.name}{i.level ? " · "+i.level : ""}</span>)}</div></article>)}
 {id==="education"&&<>{c.education.map(e=><article key={e.degree}><small>{e.period}</small><h3>{e.degree}</h3><strong>{e.institution}</strong><p>{e.description}</p></article>)}<article><h3>Certifications</h3>{c.certifications.map(s=><p key={s.title}>{s.title} — {s.issuer}</p>)}</article></>}
 {id==="achievements"&&c.achievements?.map(a=><article key={a.title}><h3>{a.title}</h3><p>{a.detail}</p></article>)}
 {id==="contact"&&<><h2>{c.contact.greeting}</h2><p>{c.contact.message}</p>{c.contact.links.map(l=><a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.text} ↗</a>)}<a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a></>}
 </div>;
}

export default function Village(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const keys=useRef(new Set<string>()),pos=useRef<Position>({...start}),target=useRef<Position|null>(null);
 const state=useRef({started:false,open:false,quick:false});
 const [config,setConfig]=useState<Config|null>(null),[error,setError]=useState("");
 const [started,setStarted]=useState(false),[quick,setQuick]=useState(false),[voice,setVoice]=useState(false);
 const [unavailable,setUnavailable]=useState(false),[ready,setReady]=useState(false);
 const [current,setCurrent]=useState<PlaceId>("home"),[near,setNear]=useState<PlaceId|null>(null);
 const [opened,setOpened]=useState<PlaceId|null>(null),[visited,setVisited]=useState<PlaceId[]>([]);
 const [location,setLocation]=useState<Position>(start);
 const [mapOpen,setMapOpen]=useState(false);
 const dialogRef=useRef<HTMLElement>(null);
 const active=byId(current);
 useEffect(()=>{let alive=true;fetch("/config.json").then(r=>{if(!r.ok)throw Error("Unable to load portfolio");return r.json()}).then(c=>{if(alive)setConfig(c)}).catch(()=>{if(alive)setError("The portfolio could not load. Please refresh or open the résumé.")});return()=>{alive=false;};},[]);
 useEffect(()=>{state.current={started,open:!!opened,quick};if(opened||quick)keys.current.clear();},[started,opened,quick]);
 useEffect(()=>{if(started&&voice&&!opened&&!quick)speak(active.instruction);return()=>{if("speechSynthesis" in window)window.speechSynthesis.cancel()};},[started,voice,current,opened,quick,active.instruction]);
 const open=(id:PlaceId)=>{target.current=null;keys.current.clear();setOpened(id);setVisited(v=>v.includes(id)?v:[...v,id]);};
 const interact=()=>{if(near)open(near);};
 const choose=(id:PlaceId)=>{setCurrent(id);setMapOpen(false);if(quick||unavailable)open(id);else{const d=doorway(byId(id));target.current=d;}};
 const close=()=>{if(!opened)return;const done=visited.includes(opened)?visited:[...visited,opened];setOpened(null);const next=places.find(p=>!done.includes(p.id));if(next)setCurrent(next.id);};
 useEffect(()=>{
  const node=canvas.current;if(!node)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({canvas:node,antialias:true,powerPreference:"high-performance"});}catch{setUnavailable(true);setQuick(true);setReady(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.76;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x929b9a);scene.fog=new THREE.FogExp2(0x929b9a,.008);
  scene.add(new THREE.HemisphereLight(0xcbd5d7,0x62675d,1.45));
  const sun=new THREE.DirectionalLight(0xffe9ce,1.65);sun.position.set(-32,55,24);sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-48;sun.shadow.camera.right=48;sun.shadow.camera.top=50;sun.shadow.camera.bottom=-50;sun.shadow.camera.far=160;sun.shadow.normalBias=.05;scene.add(sun);
  const {avatar}=buildVillage(scene);
  const camera=new THREE.PerspectiveCamera(48,1,.1,350);
  camera.position.set(start.x+6,9,start.z+12);
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const observer=new ResizeObserver(()=>{const w=node.clientWidth,h=node.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();});observer.observe(node);
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),floor=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();
  const click=(event:PointerEvent)=>{if(!state.current.started||state.current.open||state.current.quick)return;const r=node.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);if(ray.ray.intersectPlane(floor,hit)&&canWalk(hit.x,hit.z))target.current={x:hit.x,z:hit.z};};
  node.addEventListener("pointerdown",click);
  const down=(e:KeyboardEvent)=>{if(!state.current.started||state.current.open||state.current.quick||e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","shift"].includes(k)){e.preventDefault();keys.current.add(k);target.current=null;}};
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());
  const blur=()=>keys.current.clear();
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);window.addEventListener("blur",blur);
  let frame=0,last=performance.now(),stride=0,lastUpdate=0,oldNear:PlaceId|null=null;
  const desired=new THREE.Vector3(),look=new THREE.Vector3();
  function tick(now:number){
   frame=requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;
   if(state.current.quick)return;
   const p=pos.current,k=keys.current;
   let dx=0,dz=0;
   if(state.current.started&&!state.current.open){
    dx=Number(k.has("d")||k.has("arrowright"))-Number(k.has("a")||k.has("arrowleft"));
    dz=Number(k.has("s")||k.has("arrowdown"))-Number(k.has("w")||k.has("arrowup"));
    if(dx||dz)target.current=null;
    if(!dx&&!dz&&target.current){
     const t=target.current;const direct=distance(p,t);
     if(direct<.45)target.current=null;
     else {
      // The central road and outer lanes avoid every building footprint.
      let wx=t.x,wz=t.z;
      const straight=Array.from({length:16},(_,i)=>{const f=(i+1)/16;return canWalk(p.x+(t.x-p.x)*f,p.z+(t.z-p.z)*f);}).every(Boolean);
      if(!straight){
       const nodes:Position[]=[{x:-16,z:p.z},{x:16,z:p.z},{x:-16,z:t.z},{x:16,z:t.z},{x:p.x,z:-27},{x:p.x,z:19},{x:t.x,z:-27},{x:t.x,z:19},...places.map(doorway),{x:-5,z:3.65},{x:5,z:3.65},{x:-5,z:-8.35},{x:5,z:-8.35},t];
       const all=[p,...nodes],n=all.length,dist=Array(n).fill(Infinity) as number[],prev=Array(n).fill(-1) as number[],done=new Set<number>();dist[0]=0;
       const visible=(a:Position,b:Position)=>{const steps=Math.max(2,Math.ceil(distance(a,b)/.7));for(let j=1;j<=steps;j++){const f=j/steps;if(!canWalk(a.x+(b.x-a.x)*f,a.z+(b.z-a.z)*f))return false;}return true;};
       for(let j=0;j<n;j++){let u=-1;for(let i=0;i<n;i++)if(!done.has(i)&&(u<0||dist[i]<dist[u]))u=i;if(u<0||!Number.isFinite(dist[u]))break;done.add(u);if(u===n-1)break;for(let v=1;v<n;v++)if(!done.has(v)&&visible(all[u],all[v])){const d=dist[u]+distance(all[u],all[v]);if(d<dist[v]){dist[v]=d;prev[v]=u;}}}
       let step=n-1;if(prev[step]>=0){while(prev[step]>0)step=prev[step];wx=all[step].x;wz=all[step].z;}else target.current=null;
      }
      if(target.current){dx=wx-p.x;dz=wz-p.z;}
     }
    }
   }
   const magnitude=Math.hypot(dx,dz);let moved=0;
   if(magnitude>.001){const speed=k.has("shift")?8:4.8;const step=Math.min(speed*dt,magnitude);const x=dx/magnitude*step,z=dz/magnitude*step;
    if(canWalk(p.x+x,p.z)){p.x+=x;moved+=Math.abs(x);}
    if(canWalk(p.x,p.z+z)){p.z+=z;moved+=Math.abs(z);}
    if(moved>0){const angle=Math.atan2(dx,dz),delta=Math.atan2(Math.sin(angle-avatar.root.rotation.y),Math.cos(angle-avatar.root.rotation.y));avatar.root.rotation.y+=delta*(reduced?1:1-Math.exp(-dt*13));}
   }
   stride+=moved*3.5;const swing=reduced||moved<.001?0:Math.sin(stride)*.53;
   avatar.leftArm.rotation.x=swing;avatar.rightArm.rotation.x=-swing;avatar.leftLeg.rotation.x=-swing;avatar.rightLeg.rotation.x=swing;
   avatar.knees[0].rotation.x=Math.max(0,swing);avatar.knees[1].rotation.x=Math.max(0,-swing);
   avatar.body.position.y=reduced?0:Math.abs(swing)*.09;avatar.root.position.set(p.x,groundHeight(p.x,p.z)+.04,p.z);
   desired.set(p.x+6,9,p.z+12);camera.position.lerp(desired,reduced?1:1-Math.exp(-dt*5));look.set(p.x,1.5,p.z-2.5);camera.lookAt(look);
   if(now-lastUpdate>100){lastUpdate=now;setLocation({...p});const closest=places.find(place=>distance(p,doorway(place))<1.8)?.id??null;if(closest!==oldNear){oldNear=closest;setNear(closest);}}
   renderer.render(scene,camera);
  }
  frame=requestAnimationFrame(tick);setReady(true);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();node.removeEventListener("pointerdown",click);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.removeEventListener("blur",blur);const gs=new Set<THREE.BufferGeometry>(),ms=new Set<THREE.Material>();scene.traverse(o=>{if(o instanceof THREE.Mesh){gs.add(o.geometry);(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>ms.add(m));}if(o instanceof THREE.Sprite)ms.add(o.material);});gs.forEach(g=>g.dispose());ms.forEach(m=>{if("map" in m&&m.map instanceof THREE.Texture)m.map.dispose();m.dispose();});renderer.dispose();};
 },[]);
 useEffect(()=>{if(!opened)return;const previous=document.activeElement as HTMLElement|null;const el=dialogRef.current;el?.querySelector<HTMLElement>("button")?.focus();const trap=(e:KeyboardEvent)=>{if(e.key!=="Tab"||!el)return;const items=Array.from(el.querySelectorAll<HTMLElement>("button:not([disabled]),a[href]"));const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};document.addEventListener("keydown",trap);return()=>{document.removeEventListener("keydown",trap);previous?.focus();};},[opened]);
 useEffect(()=>{const handler=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpened(null);setMapOpen(false);}if(e.key.toLowerCase()==="e"&&!e.repeat&&state.current.started&&!state.current.open&&!state.current.quick&&near){e.preventDefault();target.current=null;setOpened(near);setVisited(v=>v.includes(near)?v:[...v,near]);}};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);},[near]);
 const moveButton=(key:string,label:string)=><button type="button" aria-label={label} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);target.current=null;keys.current.add(key);}} onPointerUp={()=>keys.current.delete(key)} onPointerCancel={()=>keys.current.delete(key)} onLostPointerCapture={()=>keys.current.delete(key)}>{label}</button>;
 return <main className="village-page">
  <header className="village-header"><a className="village-brand" href="/">AK <span> / FIELD OPS</span></a><nav><button type="button" onClick={()=>{setStarted(true);setQuick(v=>!v);setOpened(null);setMapOpen(false);}} disabled={unavailable}>{quick?"Play game":"Quick portfolio"}</button><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a><button type="button" aria-pressed={voice} onClick={()=>setVoice(v=>!v)}>{voice?"Voice on":"Voice off"}</button></nav></header>
  <div className={`village-stage ${quick?"is-quick":""}`}>
   <canvas ref={canvas} className="village-canvas" aria-label="Interactive mountain village. Use WASD, arrow keys, or tap the ground to move."/>
   {quick&&<section className="village-quick"><h1>{config?.personal.name??"Portfolio"}</h1><p>Software engineering · Research · 2027</p><div className="village-quick-nav">{places.map(p=><button key={p.id} onClick={()=>open(p.id)}>{p.name}</button>)}</div>{config&&<Details id="home" c={config}/>}</section>}
   {!quick&&started&&<><div className="village-hud"><span>MISSION {Math.min(visited.length+1,places.length)} / {places.length}</span><h2>{visited.length===places.length?"All locations discovered":active.name}</h2><p>{visited.length===places.length?"Explore freely or revisit any building.":active.instruction}</p><div><button onClick={()=>choose(current)}>Guide me there</button><button onClick={()=>speak(active.instruction)}>Hear instruction</button></div></div>
   <button className="village-map-toggle" onClick={()=>setMapOpen(v=>!v)} aria-expanded={mapOpen}>Map · {visited.length}/{places.length}</button>
   {mapOpen&&<aside className="village-map"><h3>Operations map</h3><svg viewBox="0 0 120 155" role="img" aria-label="Map showing player and buildings"><rect width="120" height="155" rx="8" fill="#dce1c7"/><path d="M60 5V150M20 86H100M20 56H100" stroke="#b5a58a" strokeWidth="8" fill="none"/>{places.map(p=><rect key={p.id} x={60+p.x*2.3-5} y={76+p.z*2.3-5} width="10" height="10" rx="2" fill={visited.includes(p.id)?"#477553":"#a57851"}/>)}<circle cx={60+location.x*2.3} cy={76+location.z*2.3} r="4" fill="#142f45"/></svg>{places.map(p=><button key={p.id} onClick={()=>choose(p.id)}>{visited.includes(p.id)?"✓ ":""}{p.name}</button>)}</aside>}
   </>}
  </div>
  {!quick&&started&&<footer className="village-controls"><div className="village-dpad">{moveButton("w","↑")}<div>{moveButton("a","←")}{moveButton("s","↓")}{moveButton("d","→")}</div></div><div className="village-help"><strong>{near?`You reached ${byId(near).name}`:"Awaiting objective"}</strong><small>WASD / arrows · tap ground · Shift to run</small></div><button className="village-action" disabled={!near} onClick={interact}>{near?"Explore · E":"Approach a door"}</button></footer>}
  {!started&&!quick&&<div className="village-backdrop"><section className="village-welcome"><span>PERSONNEL FILE / INTERACTIVE PORTFOLIO</span><h1>Field Ops.<br/>Briefing 01.</h1><p>Explore a compact operations compound. Follow the mission briefing, visit seven stations and unlock my professional profile. No combat, just discovery.</p><button disabled={!ready||!config} onClick={()=>{setStarted(true);setVoice(true);}}>Deploy · voice on</button><button disabled={!ready||!config} onClick={()=>setStarted(true)}>Deploy silently</button><button onClick={()=>{setQuick(true);setStarted(true);}}>Skip to portfolio</button>{error&&<p role="alert">{error}</p>}</section></div>}
  {opened&&config&&<div className="village-backdrop" onClick={close}><section ref={dialogRef} role="dialog" aria-modal="true" aria-label={byId(opened).name} className="village-dialog" onClick={e=>e.stopPropagation()}><header><span>{byId(opened).name} · discovered</span><button autoFocus onClick={close} aria-label="Close location">✕</button></header><Details id={opened} c={config}/><button className="village-continue" onClick={close}>Return to {quick?"portfolio":"operations"} →</button></section></div>}
  {error&&started&&<p className="village-error" role="alert">{error} <a href="/resume.pdf">Résumé</a></p>}
 </main>;
}
