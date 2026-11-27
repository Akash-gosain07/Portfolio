import * as THREE from "three";

// Soft, layered cloud billboards, generated locally without external asset requests.
export function createAtmosphere(scene:THREE.Scene){
 const canvas=document.createElement("canvas");canvas.width=256;canvas.height=128;
 const ctx=canvas.getContext("2d")!;
 let seed=8191;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<38;i++){
  const x=35+random()*186,y=31+random()*66,r=18+random()*32;
  const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(220,225,224,.38)");g.addColorStop(.45,"rgba(215,220,220,.24)");g.addColorStop(1,"rgba(210,217,218,0)");
  ctx.fillStyle=g;ctx.fillRect(0,0,256,128);
 }
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const clouds=new THREE.Group();scene.add(clouds);
 const sprites:THREE.Sprite[]=[];
 for(let i=0;i<45;i++){
  const material=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,opacity:.48+random()*.28,fog:false,toneMapped:false});
  const sprite=new THREE.Sprite(material);
  sprite.position.set((random()-.5)*190,24+random()*56,(random()-.5)*190);
  sprite.scale.set(28+random()*38,12+random()*16,1);material.rotation=(random()-.5)*.22;
  clouds.add(sprite);sprites.push(sprite);
 }
 // A denser cloud bank across the flight corridor.
 for(let i=0;i<18;i++){
  const material=new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,opacity:.78,fog:false,toneMapped:false});
  const sprite=new THREE.Sprite(material);sprite.position.set(-16+random()*48,35+random()*20,18+random()*65);sprite.scale.set(30+random()*30,12+random()*15,1);clouds.add(sprite);sprites.push(sprite);
 }
 return {update:(dt:number)=>{for(let i=0;i<sprites.length;i++){const s=sprites[i];s.position.x+=dt*(.36+i%3*.12);if(s.position.x>120)s.position.x=-120;}},dispose:()=>{sprites.forEach(s=>s.material.dispose());texture.dispose();scene.remove(clouds);}};
}

export const INTRO_SECONDS=10;
export function createArrivalPath(start:{x:number;z:number}){
 const position=new THREE.CatmullRomCurve3([
  new THREE.Vector3(-40,105,100),new THREE.Vector3(-14,65,72),
  new THREE.Vector3(14,39,43),new THREE.Vector3(26,22,24),
  new THREE.Vector3(start.x+12,12,start.z+16),new THREE.Vector3(start.x+6,9,start.z+12)
 ]);
 const aim=new THREE.CatmullRomCurve3([
  new THREE.Vector3(-8,25,5),new THREE.Vector3(0,9,0),new THREE.Vector3(0,2,0),
  new THREE.Vector3(start.x,1.5,start.z-2.5)
 ]);
 return {sample:(camera:THREE.PerspectiveCamera,t:number)=>{
  const p=THREE.MathUtils.clamp(t,0,1);
  const eased=p*p*(3-2*p);
  camera.position.copy(position.getPoint(eased));
  camera.lookAt(aim.getPoint(eased));
  camera.fov=58-10*eased;camera.updateProjectionMatrix();
 }};
}
