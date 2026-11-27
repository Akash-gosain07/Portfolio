import * as THREE from "three";

// Original procedural expedition avatar. All geometry is built locally; no external asset requests.
export function createExplorer() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const mat = (color: number, roughness = .8) => new THREE.MeshStandardMaterial({ color, roughness });
  const jacket = mat(0xf2a33e), trim = mat(0x214858), trousers = mat(0x415d68);
  const skin = mat(0xc58b60), hair = mat(0x292b30), boots = mat(0x423b36);
  const cream = mat(0xffebc5), bag = mat(0x326d70), black = mat(0x172e36);
  const mesh = (parent: THREE.Object3D, geo: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x,y,z); m.castShadow = true; parent.add(m); return m;
  };
  const sphere = (p: THREE.Object3D, m: THREE.Material, x:number,y:number,z:number,sx:number,sy:number,sz:number) => {
    const a = mesh(p,new THREE.SphereGeometry(1,16,12),m,x,y,z);
    a.scale.set(sx,sy,sz); return a;
  };
  const capsule = (p: THREE.Object3D,m: THREE.Material,x:number,y:number,z:number,r:number,len:number) =>
    mesh(p,new THREE.CapsuleGeometry(r,len,5,12),m,x,y,z);
  // Head, sculpted hair, ears, eyebrows, eyes and a small nose.
  const head = new THREE.Group(); head.position.set(0,2.44,0); body.add(head);
  sphere(head,skin,0,0,0,.42,.48,.39);
  sphere(head,hair,0,.23,-.06,.45,.29,.41);
  sphere(head,hair,-.17,.29,.13,.27,.19,.32);
  sphere(head,hair,.22,.26,.04,.23,.23,.32);
  for (const side of [-1,1]) {
    sphere(head,skin,side*.41,-.04,0,.085,.13,.10);
    sphere(head,cream,side*.145,.02,.355,.086,.055,.035);
    sphere(head,black,side*.145,.02,.385,.035,.043,.017);
    const brow=mesh(head,new THREE.BoxGeometry(.15,.035,.03),hair,side*.145,.125,.352);brow.rotation.z=side*.12;
  }
  sphere(head,skin,0,-.075,.38,.067,.09,.075);
  sphere(head,mat(0x824e40),0,-.19,.35,.095,.021,.016);
  capsule(body,skin,0,1.99,0,.13,.10);
  const torso = capsule(body,jacket,0,1.63,0,.39,.51); torso.scale.set(1.16,1,.82);
  const seam=mesh(body,new THREE.BoxGeometry(.037,.68,.025),cream,0,1.64,.33);seam.rotation.z=.02;
  sphere(body,trim,0,1.98,0,.29,.14,.30);
  mesh(body,new THREE.BoxGeometry(.65,.12,.49),trim,0,1.21,0);
  // Daypack with straps, pocket, rolled map and small brass fasteners.
  const pack=capsule(body,bag,0,1.60,-.43,.36,.43);pack.scale.set(1.02,1,.55);
  const pocket=capsule(body,trim,0,1.42,-.64,.23,.16);pocket.scale.z=.40;
  const roll=mesh(body,new THREE.CylinderGeometry(.10,.10,.78,12),cream,0,2.02,-.47);roll.rotation.z=Math.PI/2;
  for(const side of [-1,1]) {
    mesh(body,new THREE.BoxGeometry(.085,.61,.047),trim,side*.25,1.65,.33);
    mesh(body,new THREE.BoxGeometry(.10,.09,.045),cream,side*.25,1.43,.36);
  }
  const arms: THREE.Group[] = [], legs: THREE.Group[] = [], knees: THREE.Group[] = [];
  for(const side of [-1,1]) {
    const arm=new THREE.Group();arm.position.set(side*.47,1.93,0);body.add(arm);
    capsule(arm,jacket,0,-.23,0,.14,.31);
    const elbow=new THREE.Group();elbow.position.y=-.45;arm.add(elbow);
    capsule(elbow,jacket,0,-.16,0,.112,.22);
    sphere(elbow,skin,0,-.34,0,.12,.14,.11);elbow.rotation.x=-.16;
    arms.push(arm);
    const hip=new THREE.Group();hip.position.set(side*.22,1.23,0);body.add(hip);
    capsule(hip,trousers,0,-.27,0,.165,.37);
    const knee=new THREE.Group();knee.position.y=-.53;hip.add(knee);
    capsule(knee,trousers,0,-.22,0,.13,.32);
    sphere(knee,boots,0,-.49,.10,.16,.16,.25);
    mesh(knee,new THREE.BoxGeometry(.31,.07,.41),trim,0,-.59,.09);
    legs.push(hip);knees.push(knee);
  }
  const shadow=mesh(root,new THREE.CircleGeometry(.64,32),new THREE.MeshBasicMaterial({color:0x24494a,transparent:true,opacity:.18,depthWrite:false}),0,.012,0);
  shadow.rotation.x=-Math.PI/2;
  return {root,body,head,leftArm:arms[0],rightArm:arms[1],leftLeg:legs[0],rightLeg:legs[1],knees};
}

export function populateLandscape(world: THREE.Group, pathX: (z:number)=>number) {
  const group=new THREE.Group();world.add(group);
  const material=(color:number)=>new THREE.MeshStandardMaterial({color,roughness:.92});
  const rockM=material(0x8a9c91), sandM=material(0xe8c894), grassM=material(0x69ad65);
  const leafM=material(0x4f9567), barkM=material(0x86664c), snowM=material(0xfff5df);
  const flowerM=[material(0xffc667),material(0xe77967),material(0xf9e6bb)];
  const geo=new THREE.IcosahedronGeometry(1,0), dummy=new THREE.Object3D();
  // Seeded random layout: reproducible, handcrafted-feeling landscape.
  let seed=5731;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const inst=(geometry:THREE.BufferGeometry,mat:THREE.Material,count:number,make:(i:number)=>void)=>{
    const m=new THREE.InstancedMesh(geometry,mat,count);
    for(let i=0;i<count;i++){dummy.position.set(0,0,0);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);make(i);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);}
    m.instanceMatrix.needsUpdate=true;group.add(m);return m;
  };
  inst(geo,rockM,95,()=>{const z=rnd()*300;dummy.position.set(pathX(z)+(rnd()>.5?1:-1)*(9+rnd()*17),.3,-z);dummy.rotation.set(rnd(),rnd()*6,rnd());dummy.scale.set(.5+rnd()*1.8,.4+rnd()*1.3,.5+rnd()*1.8);});
  inst(new THREE.ConeGeometry(.23,1.1,3),grassM,650,()=>{const z=rnd()*300;dummy.position.set(pathX(z)+(rnd()>.5?1:-1)*(3.5+rnd()*20),.32,-z);dummy.rotation.y=rnd()*6;dummy.scale.setScalar(.3+rnd()*.7);});
  for(const m of flowerM)inst(geo,m,85,()=>{const z=rnd()*300;dummy.position.set(pathX(z)+(rnd()>.5?1:-1)*(4+rnd()*14),.65,-z);dummy.scale.setScalar(.10+rnd()*.11);});
  const trees:THREE.Group[]=[];
  for(let i=0;i<28;i++){
    const z=rnd()*300,x=pathX(z)+(i%2?1:-1)*(16+rnd()*9);
    const tree=new THREE.Group();tree.position.set(x,.1,-z);
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.30,2.6,7),barkM);trunk.position.y=1.3;tree.add(trunk);
    for(let j=0;j<3;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry(1.55-j*.3,2.1,7),leafM);crown.position.y=2.1+j*.8;tree.add(crown);}
    group.add(tree);trees.push(tree);
  }
  // Continuous curved road, replaces the disconnected neon tiles.
  const points:THREE.Vector3[]=[];
  for(let z=0;z<=300;z+=2)points.push(new THREE.Vector3(pathX(z),.48,-z));
  const curve=new THREE.CatmullRomCurve3(points);
  const road=new THREE.Mesh(new THREE.TubeGeometry(curve,180,2.25,8,false),sandM);
  road.scale.y=.13;road.position.y=.22;group.add(road);
  // Distant mountains framing the trail.
  for(let i=0;i<20;i++){
    const z=-i*17,side=i%2?1:-1,x=side*(36+rnd()*24),h=10+rnd()*20;
    const mountain=new THREE.Mesh(new THREE.ConeGeometry(12+rnd()*9,h,5),rockM);mountain.position.set(x,h*.31,z);mountain.rotation.y=rnd()*6;group.add(mountain);
    const peak=new THREE.Mesh(new THREE.ConeGeometry(3.9,h*.25,5),snowM);peak.position.set(x,h*.69,z);peak.rotation.y=mountain.rotation.y;group.add(peak);
  }
  const cloudMaterial=new THREE.MeshStandardMaterial({color:0xfff7eb,roughness:1,flatShading:true});
  const clouds:THREE.Group[]=[];
  for(let i=0;i<12;i++){const cloud=new THREE.Group();cloud.position.set((rnd()-.5)*95,20+rnd()*14,-i*28);for(let j=0;j<4;j++){const p=new THREE.Mesh(geo,cloudMaterial);p.position.set(j*2.4,Math.sin(j)*.8,0);p.scale.set(3.8,1.7+j%2*.6,2.8);cloud.add(p);}group.add(cloud);clouds.push(cloud);}
  return {trees,clouds};
}
