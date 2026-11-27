"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { createExplorer, populateLandscape } from "./ExpeditionWorld";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type Stat = { label: string; value: string };

type PortfolioConfig = {
  personal: {
    name: string;
    title: string;
    avatar: string;
    bio: string[];
    stats: Stat[];
  };
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    emoji: string;
    tags: string[];
    gradient: string;
    url?: string;
  }>;
  skills: Array<{
    category: string;
    items: Array<{ name: string; level: string }>;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    description: string;
    icon: string;
  }>;
  achievements?: Array<{ title: string; detail: string }>;
  certifications: Array<{ title: string; issuer: string }>;
  contact: {
    greeting: string;
    message: string;
    links: Array<{ icon: string; text: string; url: string }>;
  };
};

type Zone = {
  id: string;
  label: string;
  start: number;
  end: number;
  accent: string;
  blurb: string;
};

const WORLD_LENGTH = 300;
const ZONE_NAV_EVENT = "portfolio:navigate";
const CAMERA_DISTANCE = 12;
const CAMERA_HEIGHT = 4.8;

const zones: Zone[] = [
  { id: "intro", label: "The Spawn", start: 0, end: -25, accent: "#63dffc", blurb: "Your starting point. Meet the developer behind the world." },
  { id: "about", label: "Origin Grove", start: -25, end: -65, accent: "#82ffb0", blurb: "A calm grove with personal story cards and nature particles." },
  { id: "experience", label: "Career City", start: -65, end: -115, accent: "#d3e1ea", blurb: "A skyline of shipped work, production impact, and team collaboration." },
  { id: "projects", label: "Project Arena", start: -115, end: -175, accent: "#68f5ff", blurb: "Holographic pillars spotlight flagship builds and product thinking." },
  { id: "skills", label: "Skill Galaxy", start: -175, end: -225, accent: "#ff5fe6", blurb: "Orbiting nodes map the stack across frontend, backend, and AI." },
  { id: "education", label: "Knowledge Keep", start: -225, end: -265, accent: "#ffd76f", blurb: "A gold campus memorial with academics, school history, and certifications." },
  { id: "contact", label: "The Portal", start: -265, end: -300, accent: "#65b8ff", blurb: "The final portal sends visitors to GitHub, LinkedIn, and email." },
];

const getPathX = (z: number) => Math.sin(z * 0.05) * 12 + Math.sin(z * 0.02) * 5;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const getZoneMidpoint = (zone: Zone) => (zone.start + zone.end) / 2;

function createGradientMap() {
  const data = new Uint8Array([48, 48, 48, 132, 132, 132, 255, 255, 255]);
  const texture = new THREE.DataTexture(data, 3, 1, THREE.RGBFormat);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

function createAnimeMaterial(color: THREE.ColorRepresentation) {
  return new THREE.MeshToonMaterial({ color, gradientMap: createGradientMap() });
}

function addOutline(mesh: THREE.Mesh, thickness: number) {
  const outline = new THREE.Mesh(
    mesh.geometry,
    new THREE.MeshBasicMaterial({ color: 0x050505, side: THREE.BackSide }),
  );
  outline.scale.multiplyScalar(1 + thickness);
  mesh.add(outline);
  return outline;
}

function createPanelContent(config: PortfolioConfig, zoneId: string) {
  if (zoneId === "intro") {
    return (
      <>
        <span className="eyebrow">Profile Overview</span>
        <h2>{config.personal.name}</h2>
        <p>{config.personal.title}</p>
        <div className="stat-grid">
          {config.personal.stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span className="entry-meta">{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="panel-actions">
          <a className="primary" href="/resume.pdf" rel="noreferrer" target="_blank">Download Resume</a>
          <a href={config.contact.links[1]?.url} rel="noreferrer" target="_blank">View GitHub</a>
        </div>
      </>
    );
  }

  if (zoneId === "about") {
    return (
      <>
        <span className="eyebrow">About</span>
        <h2>Professional Summary</h2>
        <div className="card-list">
          {config.personal.bio.map((item) => (
            <div className="entry-card" key={item}>
              <p>{item}</p>
            </div>
          ))}
        </div>
        {config.achievements?.length ? (
          <div className="achievement-board">
            <span className="eyebrow">Milestones unlocked</span>
            {config.achievements.map((achievement) => (
              <div className="achievement-item" key={achievement.title}>
                <span aria-hidden="true">✦</span>
                <div><strong>{achievement.title}</strong><p>{achievement.detail}</p></div>
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
  }

  if (zoneId === "experience") {
    return (
      <>
        <span className="eyebrow">Experience</span>
        <h2>Work Experience</h2>
        <div className="card-list">
          {config.experience.map((item) => (
            <div className="entry-card" key={`${item.company}-${item.title}`}>
              <strong>{item.title}</strong>
              <span className="entry-meta">{item.company} | {item.period}</span>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (zoneId === "projects") {
    return (
      <>
        <span className="eyebrow">Projects</span>
        <h2>Selected Projects</h2>
        <div className="card-list">
          {config.projects.map((project) => (
            <div className="entry-card" key={project.name} style={{ background: `${project.gradient}, rgba(255,255,255,0.04)` }}>
              <strong>{project.emoji} {project.name}</strong>
              <p>{project.description}</p>
              <div className="pill-row">
                {project.tags.map((tag) => <span className="pill" key={tag}>{tag}</span>)}
              </div>
              {project.url ? <a className="project-source" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} on GitHub`}>Explore source ↗</a> : null}
            </div>
          ))}
        </div>
      </>
    );
  }

  if (zoneId === "skills") {
    return (
      <>
        <span className="eyebrow">Skills</span>
        <h2>Technical Stack</h2>
        <div className="skill-groups">
          {config.skills.map((skill) => (
            <div className="skill-card" key={skill.category}>
              <strong>{skill.category}</strong>
              <div className="pill-row">
                {skill.items.map((item) => <span className="pill" key={item.name}>{item.name} <span className="skill-level">{item.level}</span></span>)}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (zoneId === "education") {
    return (
      <>
        <span className="eyebrow">Education</span>
        <h2>Education & Certifications</h2>
        <div className="card-list">
          {config.education.map((item) => (
            <div className="entry-card" key={`${item.institution}-${item.degree}`}>
              <strong>{item.icon} {item.degree}</strong>
              <span className="entry-meta">{item.institution} | {item.period}</span>
              <p>{item.description}</p>
            </div>
          ))}
          <div className="entry-card">
            <strong>Certifications</strong>
            <div className="pill-row">
              {config.certifications.map((item) => <span className="pill" key={`${item.issuer}-${item.title}`}>{item.title} | {item.issuer}</span>)}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="eyebrow">Contact</span>
      <h2>{config.contact.greeting}</h2>
      <p>{config.contact.message}</p>
      <div className="contact-links">
        {config.contact.links.map((link) => (
          <a className="contact-card" href={link.url} key={link.url} rel="noreferrer" target="_blank">
            <strong>{link.icon} {link.text}</strong>
            <span>{link.url.replace(/^https?:\/\//, "")}</span>
          </a>
        ))}
      </div>
    </>
  );
}

export function PortfolioExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayedTravelRef = useRef(0);
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [loadProgress, setLoadProgress] = useState(5);
  const [isReady, setIsReady] = useState(false);
  const [flatMode, setFlatMode] = useState(false);
  const [sceneUnavailable, setSceneUnavailable] = useState(false);
  const introRef = useRef(true);
  const [introOpen, setIntroOpen] = useState(true);
  const [travel, setTravel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const progress = useMemo(() => clamp(travel, 0, 1), [travel]);
  const activeZone = useMemo(() => {
    const currentZ = -progress * WORLD_LENGTH;
    return (
      zones.find((zone) => currentZ <= zone.start && currentZ >= zone.end) ??
      zones[zones.length - 1]
    );
  }, [progress]);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        setLoadProgress(18);
        const response = await fetch("./config.json");
        if (!response.ok) throw new Error(`Unable to load config.json (${response.status})`);
        const data = (await response.json()) as PortfolioConfig;
        if (!cancelled) {
          setConfig(data);
          setLoadProgress(42);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load portfolio data.");
        }
      }
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!config || !canvasRef.current || flatMode) return;

    const canvas = canvasRef.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" }); }
    catch { setSceneUnavailable(true); setFlatMode(true); setIsReady(true); setIntroOpen(false); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x88d8f5);
    scene.fog = new THREE.FogExp2(0xc9e8ec, 0.006);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 700);
    camera.position.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.35, 0.3, 0.45));

    scene.add(new THREE.HemisphereLight(0xeaf8ff, 0x698554, 2.0));
    const mainLight = new THREE.DirectionalLight(0xfff3d2, 2.5);
    mainLight.position.set(14, 28, 18);
    scene.add(mainLight);
    const rimLight = new THREE.DirectionalLight(0x87a8ff, .65);
    rimLight.position.set(-18, 10, -12);
    scene.add(rimLight);

    const world = new THREE.Group();
    scene.add(world);

    const groundGeometry = new THREE.PlaneGeometry(56, WORLD_LENGTH + 36, 24, 260);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundPosition = groundGeometry.attributes.position;
    const groundVertex = new THREE.Vector3();
    for (let i = 0; i < groundPosition.count; i += 1) {
      groundVertex.fromBufferAttribute(groundPosition, i);
      const worldZ = WORLD_LENGTH / 2 - groundVertex.z;
      const centerX = getPathX(worldZ);
      const edgeFalloff = Math.abs(groundVertex.x) / 28;
      groundPosition.setXYZ(
        i,
        groundVertex.x + centerX + Math.sin(worldZ * 0.04 + edgeFalloff) * 0.35,
        Math.cos(worldZ * 0.06 + edgeFalloff * 2.4) * 0.45 - edgeFalloff * 0.35,
        groundVertex.z,
      );
    }
    groundGeometry.computeVertexNormals();
    const ground = new THREE.Mesh(groundGeometry, createAnimeMaterial(0x9ccb79));
    ground.position.z = -WORLD_LENGTH / 2;
    world.add(ground);
    addOutline(ground, 0.008);

    const landscape = populateLandscape(world, getPathX);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 420;
      starPositions[i * 3 + 1] = 30 + Math.random() * 120;
      starPositions[i * 3 + 2] = -Math.random() * 380;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xe7f6ff, size: 0.7, transparent: true, opacity: 0.95 })));

    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(1000 * 3);
    const dustSpeeds = new Float32Array(1000);
    for (let i = 0; i < 1000; i += 1) {
      const z = -Math.random() * WORLD_LENGTH;
      dustPositions[i * 3] = getPathX(Math.abs(z)) + (Math.random() - 0.5) * 42;
      dustPositions[i * 3 + 1] = Math.random() * 8;
      dustPositions[i * 3 + 2] = z;
      dustSpeeds[i] = 0.015 + Math.random() * 0.025;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.42 }));
    scene.add(dust);

    const streamerGeometry = new THREE.BufferGeometry();
    const streamerPositions = new Float32Array(600 * 3);
    const streamerSpeeds = new Float32Array(600);
    for (let i = 0; i < 600; i += 1) {
      const z = -Math.random() * WORLD_LENGTH;
      streamerPositions[i * 3] = getPathX(Math.abs(z)) + (Math.random() - 0.5) * 38;
      streamerPositions[i * 3 + 1] = 6 + Math.random() * 24;
      streamerPositions[i * 3 + 2] = z;
      streamerSpeeds[i] = 0.1 + Math.random() * 0.22;
    }
    streamerGeometry.setAttribute("position", new THREE.BufferAttribute(streamerPositions, 3));
    const streamers = new THREE.Points(streamerGeometry, new THREE.PointsMaterial({ color: 0x68f5ff, size: 0.26, transparent: true, opacity: 0.78 }));
    scene.add(streamers);

    const zoneObjects = new THREE.Group();
    world.add(zoneObjects);

    const checkpointGroup = new THREE.Group();
    zones.forEach((zone, index) => {
      const markerZ = getZoneMidpoint(zone);
      const markerX = getPathX(Math.abs(markerZ)) + (index % 2 === 0 ? 7.5 : -7.5);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.4, 0.5, 18),
        createAnimeMaterial(zone.accent),
      );
      base.position.set(markerX, 0.5, markerZ);
      checkpointGroup.add(base);
      addOutline(base, 0.02);

      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.34, 4.6, 12),
        createAnimeMaterial(0xdfe8ff),
      );
      pillar.position.set(markerX, 2.8, markerZ);
      checkpointGroup.add(pillar);
      addOutline(pillar, 0.02);

      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 14, 14),
        createAnimeMaterial(zone.accent),
      );
      beacon.position.set(markerX, 5.3, markerZ);
      beacon.userData = { baseY: 5.3, floatOffset: index * 0.4 };
      checkpointGroup.add(beacon);
      addOutline(beacon, 0.02);

      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.12, 12, 30),
        createAnimeMaterial(zone.accent),
      );
      halo.position.set(markerX, 5.3, markerZ);
      halo.rotation.x = Math.PI / 2;
      halo.userData = { baseY: 5.3, floatOffset: index * 0.5 };
      checkpointGroup.add(halo);
      addOutline(halo, 0.02);
    });
    world.add(checkpointGroup);

    const introGroup = new THREE.Group();
    const introPlatform = new THREE.Mesh(new THREE.CylinderGeometry(8, 9.2, 1.8, 24), createAnimeMaterial(0x5676e7));
    introPlatform.position.set(getPathX(12), 0.9, -12);
    introGroup.add(introPlatform);
    addOutline(introPlatform, 0.02);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.35, 16, 60), createAnimeMaterial(0x68f5ff));
    ring.position.set(getPathX(12), 5.4, -12);
    ring.rotation.x = Math.PI / 2;
    introGroup.add(ring);
    addOutline(ring, 0.02);
    zoneObjects.add(introGroup);

    const aboutGroup = new THREE.Group();
    for (let i = 0; i < 12; i += 1) {
      const z = -30 - i * 2.9;
      const side = i % 2 === 0 ? -1 : 1;
      const distance = 8 + (i % 3) * 2.5;
      const baseX = getPathX(Math.abs(z)) + side * distance;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 3.8, 8), createAnimeMaterial(0x6b4f32));
      trunk.position.set(baseX, 1.9, z);
      aboutGroup.add(trunk);
      addOutline(trunk, 0.02);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(2.1, 12, 12), createAnimeMaterial(0x44b773));
      crown.position.set(baseX, 4.5, z);
      aboutGroup.add(crown);
      addOutline(crown, 0.02);
    }
    for (let i = 0; i < 25; i += 1) {
      const z = -28 - Math.random() * 34;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), createAnimeMaterial(0x97ff9b));
      orb.position.set(getPathX(Math.abs(z)) + (Math.random() - 0.5) * 26, 1.5 + Math.random() * 5, z);
      aboutGroup.add(orb);
    }
    zoneObjects.add(aboutGroup);

    const experienceGroup = new THREE.Group();
    for (let i = 0; i < 20; i += 1) {
      const z = -70 - (i % 10) * 4.2 - Math.floor(i / 10) * 20;
      const side = i % 2 === 0 ? -1 : 1;
      const distance = 8 + Math.random() * 7;
      const height = 4 + Math.random() * 7;
      const building = new THREE.Mesh(new THREE.BoxGeometry(4.8, height * 1.5, 4.8), createAnimeMaterial(0x7f8c8d));
      building.position.set(getPathX(Math.abs(z)) + side * distance, (height * 1.5) / 2, z);
      experienceGroup.add(building);
      addOutline(building, 0.03);
    }
    zoneObjects.add(experienceGroup);

    const projectGroup = new THREE.Group();
    const holoFloor = new THREE.Mesh(new THREE.CylinderGeometry(10, 10.5, 0.4, 40), createAnimeMaterial(0x2fe0ff));
    holoFloor.position.set(getPathX(145), 0.4, -145);
    projectGroup.add(holoFloor);
    addOutline(holoFloor, 0.02);
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.3, 7 + (i % 3), 12), createAnimeMaterial(i % 2 === 0 ? 0x68f5ff : 0x7e8dff));
      pillar.position.set(getPathX(145) + Math.cos(angle) * 8.5, 4.2, -145 + Math.sin(angle) * 8.5);
      projectGroup.add(pillar);
      addOutline(pillar, 0.02);
    }
    zoneObjects.add(projectGroup);

    const skillGroup = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(3.6, 0), new THREE.MeshBasicMaterial({ color: 0xff5fe6, wireframe: true }));
    core.position.set(getPathX(200), 5.5, -200);
    skillGroup.add(core);
    const orbitingOrbs: THREE.Mesh[] = [];
    for (let i = 0; i < 10; i += 1) {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), createAnimeMaterial(i % 2 === 0 ? 0xff7cf0 : 0x68f5ff));
      orb.userData = { radius: 7 + (i % 3), speed: 0.4 + i * 0.06, offset: i };
      orbitingOrbs.push(orb);
      skillGroup.add(orb);
    }
    zoneObjects.add(skillGroup);

    const educationGroup = new THREE.Group();
    const monumentBase = new THREE.Mesh(new THREE.CylinderGeometry(8, 9.4, 1.6, 28), createAnimeMaterial(0x9b8142));
    monumentBase.position.set(getPathX(245), 0.8, -245);
    educationGroup.add(monumentBase);
    addOutline(monumentBase, 0.02);
    const monument = new THREE.Mesh(new THREE.BoxGeometry(8, 7, 5), createAnimeMaterial(0xffd76f));
    monument.position.set(getPathX(245), 4.6, -245);
    educationGroup.add(monument);
    addOutline(monument, 0.02);
    for (let i = 0; i < 4; i += 1) {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 6.8, 10), createAnimeMaterial(0xe8c35d));
      const offsetX = i < 2 ? -3 : 3;
      const offsetZ = i % 2 === 0 ? -2.2 : 2.2;
      column.position.set(getPathX(245) + offsetX, 3.8, -245 + offsetZ);
      educationGroup.add(column);
      addOutline(column, 0.02);
    }
    zoneObjects.add(educationGroup);

    const contactGroup = new THREE.Group();
    const portal = new THREE.Mesh(new THREE.TorusGeometry(5.6, 1.1, 18, 44), createAnimeMaterial(0x65b8ff));
    portal.position.set(getPathX(283), 7, -283);
    portal.rotation.y = Math.PI / 2;
    contactGroup.add(portal);
    addOutline(portal, 0.02);
    const portalParticles = new THREE.Group();
    for (let i = 0; i < 120; i += 1) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), createAnimeMaterial(0x8ee8ff));
      p.userData = { angle: Math.random() * Math.PI * 2, radius: 2 + Math.random() * 3.5, speed: 0.6 + Math.random() };
      portalParticles.add(p);
    }
    contactGroup.add(portalParticles);
    zoneObjects.add(contactGroup);

    const explorer = createExplorer();
    const {root: character, body: characterBody, head, leftArm, rightArm, leftLeg, rightLeg, knees} = explorer;
    character.scale.setScalar(2.0);
    character.position.set(getPathX(0), .48, 0);
    world.add(character);

    let targetTravel = displayedTravelRef.current;
    const handleNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ progress: number }>).detail;
      if (detail && Number.isFinite(detail.progress)) targetTravel = clamp(detail.progress, 0, 1);
    };
    window.addEventListener(ZONE_NAV_EVENT, handleNavigate);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (introRef.current || event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") {event.preventDefault();targetTravel = clamp(targetTravel + 0.045, 0, 1);}
      if (event.key === "ArrowUp" || event.key === "PageUp") {event.preventDefault();targetTravel = clamp(targetTravel - 0.045, 0, 1);}
      if (event.key === "Home") {event.preventDefault();targetTravel = 0;}
      if (event.key === "End") {event.preventDefault();targetTravel = 1;}
    };
    window.addEventListener("keydown", handleKeyDown);
    let isDragging = false;
    let pointerX = 0;
    let pointerY = 0;
    let yaw = 0;
    let pitch = 0.18;
    let touchY = 0;

    const handleWheel = (event: WheelEvent) => {
      if (introRef.current || (event.target instanceof Element && event.target.closest(".panel, .checkpoint-rail, .intro-screen"))) return;
      targetTravel = clamp(targetTravel + event.deltaY * 0.00028, 0, 1);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof HTMLCanvasElement)) return;
      isDragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = event.clientX - pointerX;
      const deltaY = event.clientY - pointerY;
      pointerX = event.clientX;
      pointerY = event.clientY;
      yaw = clamp(yaw - deltaX * 0.004, -1.25, 1.25);
      pitch = clamp(pitch - deltaY * 0.0025, -0.25, 0.65);
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (introRef.current || (event.target instanceof Element && event.target.closest(".panel, .checkpoint-rail, .intro-screen"))) return;
      const nextY = event.touches[0]?.clientY ?? touchY;
      targetTravel = clamp(targetTravel + (touchY - nextY) * 0.0022, 0, 1);
      touchY = nextY;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerleave", handlePointerUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let animationId = 0;
    let sceneProgress = displayedTravelRef.current;
    let stride = 0;
    let lastFrame = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLoadProgress(76);

    const animate = () => {
      animationId = window.requestAnimationFrame(animate);
      const now = clock.getElapsedTime();
      const dt = Math.min(.05, Math.max(0, now - lastFrame)); lastFrame = now;
      const elapsed = reducedMotion ? 0 : now;
      const before = sceneProgress;
      sceneProgress += (targetTravel - sceneProgress) * (reducedMotion ? 1 : 1-Math.exp(-dt*4.8));
      if (Math.abs(sceneProgress - targetTravel) < .0002) sceneProgress = targetTravel;
      if (Math.abs(sceneProgress - displayedTravelRef.current) > .001 || (sceneProgress === targetTravel && displayedTravelRef.current !== sceneProgress)) {
        displayedTravelRef.current = sceneProgress; setTravel(sceneProgress);
      }
      const characterZ = -sceneProgress * WORLD_LENGTH;
      const characterX = getPathX(Math.abs(characterZ));
      const distance = (sceneProgress-before)*WORLD_LENGTH;
      const speed = Math.abs(distance)/Math.max(dt,.001);
      const moving = reducedMotion ? 0 : Math.min(speed/5,1);
      stride += Math.abs(distance)*1.65;
      character.position.set(characterX,.48,characterZ);
      const nextZ = Math.max(characterZ-2,-WORLD_LENGTH);
      const nextX = getPathX(Math.abs(nextZ));
      const facing = Math.atan2(nextX-characterX,-2)+(distance<-.0001?Math.PI:0);
      const difference = Math.atan2(Math.sin(facing-character.rotation.y),Math.cos(facing-character.rotation.y));
      character.rotation.y += difference*(reducedMotion?1:1-Math.exp(-dt*9));
      characterBody.position.y = Math.abs(Math.sin(stride))*.08*moving + Math.sin(elapsed*2)*.013;
      characterBody.rotation.z = Math.sin(stride)*.035*moving;
      const swing = Math.sin(stride)*.60*moving;
      leftArm.rotation.x=swing;rightArm.rotation.x=-swing;
      leftLeg.rotation.x=-swing;rightLeg.rotation.x=swing;
      knees[0].rotation.x=Math.max(0,Math.sin(stride))*.65*moving;
      knees[1].rotation.x=Math.max(0,-Math.sin(stride))*.65*moving;
      head.rotation.y=Math.sin(elapsed*.9)*.07*(1-moving);
      landscape.trees.forEach((tree,i)=>{tree.rotation.z=Math.sin(elapsed*1.2+i)*.016;});
      landscape.clouds.forEach((cloud,i)=>{cloud.position.x+=Math.sin(i+1)*dt*.12*(reducedMotion?0:1);});
      ring.rotation.z = elapsed * 0.7;
      ring.position.y = 5.4 + Math.sin(elapsed * 2) * 0.5;
      core.rotation.x = elapsed * 0.55;
      core.rotation.y = elapsed * 0.8;
      portal.rotation.z = elapsed * 1.2;
      checkpointGroup.children.forEach((child, index) => {
        if (!(child instanceof THREE.Mesh)) {
          return;
        }

        if (child.geometry instanceof THREE.TorusGeometry) {
          child.rotation.z = elapsed * 0.8 + index * 0.1;
          child.position.y =
            (child.userData.baseY as number) +
            Math.sin(elapsed * 2 + (child.userData.floatOffset as number)) * 0.18;
        }
        if (child.geometry instanceof THREE.SphereGeometry && index % 4 === 2) {
          child.position.y =
            (child.userData.baseY as number) +
            Math.sin(elapsed * 2 + (child.userData.floatOffset as number)) * 0.24;
        }
      });

      orbitingOrbs.forEach((orb) => {
        const data = orb.userData as { radius: number; speed: number; offset: number };
        orb.position.set(
          getPathX(200) + Math.cos(elapsed * data.speed + data.offset) * data.radius,
          5.5 + Math.sin(elapsed * data.speed * 1.4 + data.offset) * 2,
          -200 + Math.sin(elapsed * data.speed + data.offset) * data.radius,
        );
      });

      portalParticles.children.forEach((child, index) => {
        const particle = child as THREE.Mesh;
        const data = particle.userData as { angle: number; radius: number; speed: number };
        const t = elapsed * data.speed + index * 0.08;
        particle.position.set(getPathX(283) + Math.cos(data.angle + t) * data.radius, 7 + Math.sin(t * 1.5) * 2.6, -283 + Math.sin(data.angle + t) * data.radius);
      });

      const dustAttr = dustGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 1000; i += 1) {
        let y = dustAttr.getY(i) + dustSpeeds[i] * (reducedMotion ? 0 : dt * 60);
        if (y > 10) y = 0;
        dustAttr.setY(i, y);
      }
      dustAttr.needsUpdate = !reducedMotion;

      const streamerAttr = streamerGeometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 600; i += 1) {
        let y = streamerAttr.getY(i) - streamerSpeeds[i] * (reducedMotion ? 0 : dt * 60);
        if (y < -1) y = 14 + Math.random() * 16;
        streamerAttr.setY(i, y);
      }
      streamerAttr.needsUpdate = !reducedMotion;

      const cameraOffset = new THREE.Vector3(Math.sin(yaw) * CAMERA_DISTANCE, CAMERA_HEIGHT + pitch * 10, Math.cos(yaw) * CAMERA_DISTANCE);
      const desiredCamera = new THREE.Vector3(character.position.x, character.position.y, character.position.z).add(cameraOffset);
      camera.position.lerp(desiredCamera, reducedMotion ? 1 : 1-Math.exp(-dt*3.5));
      camera.lookAt(new THREE.Vector3(character.position.x, character.position.y + 2.5, character.position.z - 4));

      composer.render();
    };

    setLoadProgress(100);
    const readyTimer = window.setTimeout(() => setIsReady(true), 550);
    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      window.clearTimeout(readyTimer);
      window.removeEventListener(ZONE_NAV_EVENT, handleNavigate);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      composer.dispose();
      renderer.dispose();
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          const list = Array.isArray(object.material) ? object.material : [object.material];
          list.forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => {
        if (material instanceof THREE.MeshToonMaterial) material.gradientMap?.dispose();
        material.dispose();
      });
    };
  }, [config, flatMode]);

  useEffect(() => { introRef.current = introOpen; }, [introOpen]);

  if (error) {
    return (
      <main className="error-state">
        <div className="loading-card">
          <span className="eyebrow">Portfolio Error</span>
          <h1>Config could not be loaded</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!config) {
    return (
      <main className="portfolio-page">
        <div className="loading-screen">
          <div className="loading-card">
            <span className="eyebrow">Loading Data</span>
            <strong>Building Akash&apos;s anime world</strong>
            <div className="loading-bar"><span style={{ width: `${loadProgress}%` }} /></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`portfolio-page ${flatMode ? "atlas-flat" : ""}`}>
      {!flatMode && <canvas className="portfolio-canvas" ref={canvasRef} aria-hidden="true" />}
      <button className="atlas-view-switch" type="button" onClick={() => { setIntroOpen(false); setIsReady(true); setFlatMode(v => !v); }} disabled={sceneUnavailable}>{flatMode ? (sceneUnavailable ? "Standard view" : "Return to 3D") : "Quick portfolio"}</button>
      {!isReady && !flatMode ? (
        <div className="loading-screen">
          <div className="loading-card">
            <span className="eyebrow">Loading Scene</span>
            <strong>Preparing the expedition</strong>
            <p>Loading the terrain, landmarks and explorer.</p>
            <div className="loading-bar"><span style={{ width: `${loadProgress}%` }} /></div>
          </div>
        </div>
      ) : null}
      {introOpen && isReady ? (
        <div className="intro-screen">
          <div className="intro-card">
            <span className="eyebrow">ATLAS / A developer expedition</span>
            <h1>{config.personal.name}</h1>
            <p>
              Seven worlds, one story. Explore my work, discover the skills behind it, and see how ideas become real products. Scroll to travel, drag the scene to look around, or jump directly to a destination.
            </p>
            <div className="intro-actions">
              <button className="primary" onClick={() => setIntroOpen(false)} type="button">Enter the World</button>
              <button type="button" onClick={() => { setIntroOpen(false); setFlatMode(true); }}>Quick portfolio</button>
              <a href="/resume.pdf" rel="noreferrer" target="_blank">Open Resume</a>
            </div>
            <div className="mini-note">No quests required to reach projects, experience, résumé or contact.</div>
          </div>
        </div>
      ) : null}

      <div className="portfolio-overlay">
        <div className="hud-top">
          <div className="brand-chip">
            <span className="eyebrow">Creative developer / 2027</span>
            <h1>{config.personal.name}</h1>
            <p>{config.personal.title}</p>
            <div className="brand-links">
              {config.contact.links.map((link, index) => (
                <a className={index === 0 ? "primary" : undefined} href={link.url} key={link.url} rel="noreferrer" target="_blank">
                  <span>{link.icon}</span>
                  <span>{link.text}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="guide-card">
            <span className="eyebrow">Explorer controls</span>
            <strong>Scroll • drag • jump</strong>
            <p>Scroll or use arrow keys to travel. Drag the world to look around. Choose any destination on the map.</p>
          </div>
        </div>

        <div className="panel-shell">
          <div className="panel" key={activeZone.id}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Current Section</span>
                <h3>{activeZone.label}</h3>
              </div>
              <p>{activeZone.blurb}</p>
            </div>
            {createPanelContent(config, activeZone.id)}
          </div>
        </div>

        <div className="checkpoint-rail">
          <div className="rail-card">
            <span className="eyebrow">World map · choose destination</span>
            <div className="checkpoint-list">
              {zones.map((zone) => {
                const isActive = zone.id === activeZone.id;
                const isVisited = progress >= Math.abs(zone.end) / WORLD_LENGTH;
                return (
                  <button type="button" aria-current={isActive ? "step" : undefined} aria-label={`Visit ${zone.label}`} onClick={() => { setIntroOpen(false); const next = clamp(Math.abs(getZoneMidpoint(zone)) / WORLD_LENGTH, 0, 1); if (flatMode) { displayedTravelRef.current = next; setTravel(next); } else { window.dispatchEvent(new CustomEvent(ZONE_NAV_EVENT, { detail: { progress: next } })); } }} className={`checkpoint-item ${isActive ? "active" : ""} ${isVisited ? "visited" : ""}`} key={zone.id}>
                    <span className="checkpoint-dot" style={{ background: zone.accent }} />
                    <div>
                      <strong>{zone.label}</strong>
                      <p>{zone.id}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hud-bottom">
          <div className="progress-card">
            <span className="eyebrow">Adventure progress</span>
            <p>{Math.round(progress * 100)}% explored</p>
            <div className="progress-line">
              <div className="progress-fill" style={{ width: `${Math.max(progress, 0.02) * 100}%` }} />
            </div>
            <div className="dot-row">
              {zones.map((zone) => {
                const zoneProgress = Math.abs(zone.end) / WORLD_LENGTH;
                return <div className={`dot ${progress >= zoneProgress ? "active" : ""}`} key={zone.id} />;
              })}
            </div>
          </div>

          <div className="summary-card">
            <span className="eyebrow">Quick Snapshot</span>
            <p>Full-stack developer and applied AI researcher. Building better experiences, one meaningful interaction at a time.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
