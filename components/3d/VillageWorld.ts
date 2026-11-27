import * as THREE from "three";
import { createExplorer } from "./ExpeditionWorld";

export const places = [
  {id:"home",name:"Home",x:0,z:13,color:0xb87955,instruction:"Walk to the front door of my home. Press E or tap Explore to meet me."},
  {id:"experience",name:"Career lodge",x:-15,z:0,color:0x728b79,instruction:"Follow the path west to the career lodge. Discover my internships and professional experience."},
  {id:"projects",name:"Project workshop",x:15,z:0,color:0x8b7861,instruction:"Cross the square to the workshop. Explore the products and research I have built."},
  {id:"skills",name:"Engineering lab",x:-15,z:-19,color:0x6d8791,instruction:"Visit the engineering lab to discover my technical toolkit."},
  {id:"education",name:"Library",x:15,z:-19,color:0xa28a65,instruction:"Walk to the library to learn about my education and certifications."},
  {id:"achievements",name:"Hall of milestones",x:0,z:-34,color:0xa77457,instruction:"Head north to the hall of milestones and discover my achievements."},
  {id:"contact",name:"Post office",x:0,z:34,color:0x967b69,instruction:"Visit the post office to get in touch or download my résumé."}
] as const;
export type PlaceId = typeof places[number]["id"];
export type Place = typeof places[number];
export type Position = {x:number;z:number};
export const doorway = (p:Place):Position => ({x:p.x,z:p.z+5.2});
export const groundHeight = (x:number,z:number) => {
  const edge=Math.max(0,Math.abs(x)-28,Math.abs(z)-42);
  return (1-Math.exp(-edge*.065))*(3.8+2.4*Math.sin(x*.11)*Math.cos(z*.09));
};
export function canWalk(x:number,z:number){
  return Math.abs(x)<26 && Math.abs(z)<43 && !places.some(p=>Math.abs(x-p.x)<4.7 && Math.abs(z-p.z)<4.3);
}
export function buildVillage(scene:THREE.Scene){
  const root=new THREE.Group();scene.add(root);
  let seed=7291;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const mat=(color:number)=>new THREE.MeshStandardMaterial({color,roughness:.96});
  const grass=mat(0x89906a),dirt=mat(0xb8a084),stone=mat(0xa49a83),wood=mat(0x55483c),plaster=mat(0xd6c4a4),glass=mat(0x57727a),leaf=mat(0x52684c),darkLeaf=mat(0x3c5342);
  const box=(parent:THREE.Object3D,w:number,h:number,d:number,m:THREE.Material,x:number,y:number,z:number)=>{
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  };
  const terrainGeometry=new THREE.PlaneGeometry(240,240,100,100);terrainGeometry.rotateX(-Math.PI/2);
  const vertices=terrainGeometry.attributes.position;
  const colors:number[]=[];const tint=new THREE.Color();
  for(let i=0;i<vertices.count;i++){
    const x=vertices.getX(i),z=vertices.getZ(i);vertices.setY(i,groundHeight(x,z));
    tint.setHex(0x89906a).lerp(new THREE.Color(0xb3a084),Math.min(1,Math.max(0,Math.abs(x)-30,Math.abs(z)-46)/65)).multiplyScalar(.88+random()*.22);colors.push(tint.r,tint.g,tint.b);
  }
  terrainGeometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));terrainGeometry.computeVertexNormals();
  const terrain=new THREE.Mesh(terrainGeometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));terrain.receiveShadow=true;root.add(terrain);
  const road=(x:number,z:number,w:number,d:number)=>{const r=box(root,w,.06,d,dirt,x,.035,z);r.castShadow=false;};
  road(0,1,4.5,83);road(0,5.2,36,3.7);road(0,-13.8,36,3.7);
  road(0,19,10,5);road(0,-27,11,5);
  const plaza=new THREE.Mesh(new THREE.CylinderGeometry(6.2,6.2,.065,36),stone);plaza.position.set(0,.045,-5);plaza.receiveShadow=true;root.add(plaza);
  // Roofs are triangular prisms, with timber trim, recessed windows and porch details.
  const roofGeometry=()=>{
    const shape=new THREE.Shape();shape.moveTo(-4.4,0);shape.lineTo(0,2.4);shape.lineTo(4.4,0);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:7.5,bevelEnabled:false});geo.translate(0,0,-3.75);return geo;
  };
  const label=(name:string)=>{
    const canvas=document.createElement("canvas");canvas.width=512;canvas.height=96;
    const ctx=canvas.getContext("2d")!;ctx.fillStyle="#40382d";ctx.fillRect(0,0,512,96);ctx.strokeStyle="#dbc59e";ctx.lineWidth=5;ctx.strokeRect(5,5,502,86);ctx.fillStyle="#f6e9cf";ctx.font="bold 32px Georgia";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(name,256,48,470);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false}));sprite.scale.set(6.5,1.2,1);return sprite;
  };
  for(const p of places){
    const g=new THREE.Group();g.position.set(p.x,0,p.z);root.add(g);
    const wall=mat(p.id==="home"?0xd2b99b:0xc5b99c),roof=mat(p.color);
    box(g,8.3,.3,7.3,stone,0,.15,0);
    box(g,7.8,3.65,6.7,wall,0,2.05,0);
    const r=new THREE.Mesh(roofGeometry(),roof);r.position.y=3.88;r.castShadow=true;r.receiveShadow=true;g.add(r);
    box(g,8.85,.16,.21,wood,0,3.92,3.8);
    box(g,8.85,.16,.21,wood,0,3.92,-3.8);
    box(g,.85,2.25,.85,stone,2.5,4.9,-1.2);
    box(g,1.08,.19,1.08,wood,2.5,6.05,-1.2);
    box(g,1.55,2.7,.22,wood,0,1.64,3.45);
    box(g,1.18,2.38,.25,mat(0x98734e),0,1.49,3.59);
    box(g,.095,.11,.09,mat(0xd2ac5d),.4,1.4,3.75);
    for(const side of [-1,1]){
      box(g,1.65,1.5,.22,wood,side*2.55,2.05,3.4);
      box(g,1.42,1.26,.23,glass,side*2.55,2.05,3.53);
      box(g,.075,1.3,.1,plaster,side*2.55,2.05,3.69);
      box(g,1.45,.075,.1,plaster,side*2.55,2.05,3.69);
      box(g,1.8,.16,.45,wood,side*2.55,1.25,3.55);
      box(g,.17,3.5,.2,wood,side*3.78,2.03,3.42);
      box(g,.18,2.55,.18,wood,side*1.42,1.55,4.3);
    }
    box(g,3.4,.22,1.65,roof,0,2.92,4.0);
    box(g,3.1,.16,1.4,stone,0,.1,4.2);
    const sign=label(p.name);sign.position.set(0,6.65,3.7);g.add(sign);
    const marker=new THREE.Mesh(new THREE.RingGeometry(.62,.83,32),new THREE.MeshBasicMaterial({color:0xffd59a,side:THREE.DoubleSide,transparent:true,opacity:.85}));marker.rotation.x=-Math.PI/2;marker.position.set(0,.09,5.2);g.add(marker);
    const pathLength=Math.max(1,Math.abs(p.x)-4);if(p.x!==0)road(p.x*.5,p.z+5.2,pathLength+4,2.1);
  }
  // Instanced natural scenery outside the playable village.
  const cone=new THREE.ConeGeometry(1,2,7),trunkGeo=new THREE.CylinderGeometry(.13,.24,1,7);
  const trees=210, crowns=new THREE.InstancedMesh(cone,leaf,trees*2), trunks=new THREE.InstancedMesh(trunkGeo,wood,trees);
  const dummy=new THREE.Object3D();
  for(let i=0;i<trees;i++){
    const angle=random()*Math.PI*2,rx=34+random()*65,rz=50+random()*55;
    const x=Math.cos(angle)*rx,z=Math.sin(angle)*rz,y=groundHeight(x,z),h=1.5+random()*3.0;
    dummy.position.set(x,y+h*.33,z);dummy.rotation.set(0,random()*6.28,0);dummy.scale.set(1,h*.66,1);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);
    for(let j=0;j<2;j++){dummy.position.set(x,y+h*(.78+j*.33),z);dummy.scale.set(h*(.42-j*.12),h*.65,h*(.42-j*.12));dummy.updateMatrix();crowns.setMatrixAt(i*2+j,dummy.matrix);}
  }
  root.add(crowns,trunks);
  const rockGeo=new THREE.IcosahedronGeometry(1,0),rocks=new THREE.InstancedMesh(rockGeo,stone,95);
  for(let i=0;i<95;i++){const x=(random()-.5)*170,z=(random()-.5)*170;if(Math.abs(x)<29&&Math.abs(z)<44){dummy.scale.setScalar(0);}else{dummy.scale.set(.4+random()*2,.35+random()*1.4,.5+random()*2);}dummy.position.set(x,groundHeight(x,z)+.2,z);dummy.rotation.set(.2,random()*6,.1);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);}root.add(rocks);
  // Alpine silhouettes and layered foothills.
  for(let i=0;i<27;i++){
    const theta=i/27*Math.PI*2,dist=97+random()*18,h=22+random()*32;
    const mountain=new THREE.Mesh(new THREE.ConeGeometry(15+random()*15,h,5),mat(i%2?0x98948b:0xa7a096));mountain.position.set(Math.cos(theta)*dist,h*.38,Math.sin(theta)*dist);mountain.rotation.y=random()*6;root.add(mountain);
  }
  for(const p of [{x:-8,z:23},{x:8,z:23},{x:-8,z:-26},{x:8,z:-26}]){
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.15,.25,2.2,8),wood);trunk.position.set(p.x,1.1,p.z);root.add(trunk);
    const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.65,1),darkLeaf);crown.scale.y=1.3;crown.position.set(p.x,3.0,p.z);root.add(crown);
  }
  const well=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.4,.75,16),stone);well.position.set(0,.4,-5);root.add(well);
  const water=new THREE.Mesh(new THREE.CircleGeometry(1.05,32),glass);water.rotation.x=-Math.PI/2;water.position.set(0,.79,-5);root.add(water);
  const avatar=createExplorer();avatar.root.scale.setScalar(.82);root.add(avatar.root);
  return {root,avatar};
}
