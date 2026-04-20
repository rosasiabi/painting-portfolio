// ============================================================================
//  ROSA — STUDIO INDEX
//  Editorial 3D gallery. Paintings + sculptures scattered on a studio floor.
//  Heavily optimized for fast first paint (see PERF notes throughout).
// ============================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// ... the rest of your paintingsData and code follows ...
// ---- 1. DATA ---------------------------------------------------------------
const paintingsData = [
  { fileName: "charlie.jpg", title: "Charlie", size: "40cm x 50cm x1.8cm", medium: "canvas", category: "portraits", status: "sold", orientation: "portrait" },
  { fileName: "teni.jpg", title: "Teni", size: "40cm x 50cm x1.8cm", medium: "canvas", category: "portraits", status: "sold", orientation: "portrait" },
  { fileName: "milo.jpg", title: "Milo", size: "40cm x 50cm x1.8cm", medium: "canvas", category: "portraits", status: "sold", orientation: "portrait" },
  { fileName: "andrew.jpg", title: "Andrew", size: "40cm x 50cm x1.8cm", medium: "canvas", category: "portraits", status: "sold", orientation: "portrait" },
  { fileName: "victor.jpg", title: "I sport new balance to avoid a narrow path", size: "40cm x 50cm", medium: "canvas", category: "misc", status: "available", orientation: "portrait" },

  { fileName: "bb09.webp", title: "head", size: "A5", medium: "paper", category: "body builder", status: "available", orientation: "portrait" },
  { fileName: "bb01.webp", title: "leg", size: "A5", medium: "paper", category: "body builder", status: "available", orientation: "portrait" },
  { fileName: "bb07.webp", title: "nipple", size: "A5", medium: "paper", category: "body builder", status: "sold", orientation: "portrait" },
  { fileName: "bb03.webp", title: "half", size: "A5", medium: "paper", category: "body builder", status: "available", orientation: "portrait" },
  { fileName: "bb04.webp", title: "fist", size: "A5", medium: "paper", category: "body builder", status: "available", orientation: "portrait" },
  { fileName: "bb05.webp", title: "v", size: "A5", medium: "paper", category: "body builder", status: "sold", orientation: "portrait" },
  { fileName: "bb02.webp", title: "thigh", size: "A5", medium: "paper", category: "body builder", status: "sold", orientation: "portrait" },
  { fileName: "bb06.webp", title: "chest", size: "A5", medium: "paper", category: "body builder", status: "available", orientation: "portrait" },
  { fileName: "bb08.webp", title: "armpit", size: "A5", medium: "paper", category: "body builder", status: "available", orientation: "portrait" },
  { fileName: "bb10.webp", title: "upper body", size: "A5", medium: "paper", category: "body builder", status: "available", orientation: "portrait" },
  { fileName: "CAKE.webp", title: "Aging backwards", size: "A5", medium: "paper", category: "misc", status: "sold", orientation: "portrait" },
  { fileName: "MAKEUP.webp", title: "All dolled up with nowhere to be", size: "a4", medium: "paper", category: "misc", status: "available", orientation: "portrait" },
  { fileName: "CHARLES.webp", title: "i have meddled... if that is the word", size: "A2", medium: "paper", category: "misc", status: "in progress", orientation: "portrait" }
];

// Sculptures — loaded lazily when camera is near.
const sculpturesData = [
  { file: "models/3d_model_for_usb.glb", type: "glb", title: "USB — object study", size: "∼ 6cm", medium: "sculpture", category: "object", status: "available", scale: 6, color: 0xc96a3d },
  { file: "models/WINDCATCHER.stl",      type: "stl", title: "Windcatcher",        size: "∼ 24cm", medium: "sculpture", category: "object", status: "available", scale: 0.14, color: 0x1a1a1a },
  { file: "models/TP.stl",               type: "stl", title: "TP",                 size: "∼ 18cm", medium: "sculpture", category: "object", status: "in progress", scale: 0.12, color: 0xe8e4dc }
];

function getDimensions(sizeStr, medium, orientation) {
  let w = 4.0, h = 5.0, thickness = 0.18;
  const s = sizeStr.toLowerCase().replace(/\s/g, '');
  if (s.includes("a5")) { w = 1.48; h = 2.1; }
  else if (s.includes("a4")) { w = 2.1; h = 2.97; }
  else if (s.includes("a2")) { w = 4.2; h = 5.94; }
  else if (s.includes("40cmx50cm")) { w = 4.0; h = 5.0; }
  if (orientation === "landscape") { [w, h] = [h, w]; }
  thickness = (medium === "paper") ? 0.02 : 0.18;
  return { w, h, thickness };
}

// ---- 2. PALETTE ------------------------------------------------------------
const PAPER = 0xece7de;
const INK   = 0x0a0a0a;
const WARM  = 0x2a2620;

// ---- 3. SCENE --------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAPER);
scene.fog = new THREE.Fog(PAPER, 120, 260);

const aspect = window.innerWidth / window.innerHeight;
const d = 20;
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(12, 28, 18);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Lighting — warm, even, and reaching the whole studio.
scene.add(new THREE.AmbientLight(0xfaf5ec, 0.95)); // brighter base so nothing ever goes dark

const keyLight = new THREE.DirectionalLight(0xfff2dc, 0.85);
keyLight.position.set(18, 35, 12);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
// Wide frustum — covers the full scatter radius so far-flung paintings still receive light + shadow.
keyLight.shadow.camera.left = -80;
keyLight.shadow.camera.right = 80;
keyLight.shadow.camera.top = 80;
keyLight.shadow.camera.bottom = -80;
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 120;
keyLight.shadow.radius = 4;
keyLight.shadow.bias = -0.0005;
scene.add(keyLight);

// Fill light from the opposite side — kills the "dark side of the studio" problem.
const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
fillLight.position.set(-20, 25, -18);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xe77bd5, 0.14); // faint pink rim, on-brand
rimLight.position.set(-20, 10, -15);
scene.add(rimLight);

// Floor — warm plaster.
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 2000),
  new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.95, metalness: 0 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Subtle dark horizon ring — very editorial.
const ring = new THREE.Mesh(
  new THREE.RingGeometry(55, 56, 128),
  new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
);
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.001;
scene.add(ring);

// ---- 4. LOADING MANAGER ----------------------------------------------------
// PERF: we only gate the loading screen on the SCENE BOOT, not every texture.
// Textures stream in lazily afterward (see lazy loader below).
const bootManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();

// Placeholder: a tiny procedural canvas texture. Instant. No network cost.
function makePlaceholderTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 8;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#d6d0c4'; ctx.fillRect(0, 0, 8, 8);
  ctx.fillStyle = '#c4beb2';
  for (let i = 0; i < 8; i += 2) for (let j = 0; j < 8; j += 2) ctx.fillRect(i, j, 1, 1);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  return t;
}
const placeholderTex = makePlaceholderTexture();

// ---- 5. PLACEMENT (golden-angle phyllotaxis — organic, never overlapping) --
const placedItems = [];
function findSpot(radius) {
  // Start from a golden-angle spiral then jitter. Far more organic than random.
  const phi = (1 + Math.sqrt(5)) / 2;
  let attempts = 0;
  while (attempts < 600) {
    const k = placedItems.length + attempts * 0.3;
    const r = 1.6 * Math.sqrt(k) + Math.random() * 0.8;
    const a = k * 2 * Math.PI / (phi * phi) + (Math.random() - 0.5) * 0.3;
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    let ok = true;
    for (const p of placedItems) {
      if ((x - p.x) ** 2 + (z - p.z) ** 2 < (radius + p.radius) ** 2) { ok = false; break; }
    }
    if (ok) { placedItems.push({ x, z, radius }); return { x, z }; }
    attempts++;
  }
  return { x: (Math.random() - .5) * 30, z: (Math.random() - .5) * 30 };
}

// ---- 6. PAINTINGS (geometry immediately, textures lazily) ------------------
const sharedEdgeMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f1e8, roughness: 0.85 });
const paintingMeshes = [];
const interactableObjects = [];

paintingsData.forEach((data, idx) => {
  const dims = getDimensions(data.size, data.medium, data.orientation);
  const radius = Math.hypot(dims.w, dims.h) / 2 + 0.7;
  const { x, z } = findSpot(radius);

  const geometry = new THREE.BoxGeometry(dims.w, dims.thickness, dims.h);

  // Each painting gets its OWN face material (so we can swap the map in lazily).
  const faceMat = new THREE.MeshBasicMaterial({ map: placeholderTex });
  const mats = [sharedEdgeMaterial, sharedEdgeMaterial, faceMat, sharedEdgeMaterial, sharedEdgeMaterial, sharedEdgeMaterial];

  const mesh = new THREE.Mesh(geometry, mats);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.position.set(x, dims.thickness / 2 + 0.001, z);
  mesh.rotation.y = (Math.random() - 0.5) * 0.9;

  data.imagePath = `images/${data.medium}/${data.fileName}`;
  data.index = idx + 1;
  data.faceMat = faceMat;
  data.loaded = false;
  mesh.userData = data;

  scene.add(mesh);
  paintingMeshes.push(mesh);
  interactableObjects.push(mesh);
});

// ---- 7. SCULPTURES (lazy — nothing loads until camera gets near) -----------
const sculptureEntries = [];
sculpturesData.forEach((sdata, i) => {
  const radius = 1.6;
  const { x, z } = findSpot(radius);

  // Black plinth — pure editorial gesture.
  const plinthH = 0.6;
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, plinthH, 1.6),
    new THREE.MeshStandardMaterial({ color: INK, roughness: 0.4, metalness: 0.1 })
  );
  plinth.position.set(x, plinthH / 2, z);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  plinth.userData = { ...sdata, imagePath: null, index: paintingsData.length + i + 1, isSculpture: true };
  scene.add(plinth);
  paintingMeshes.push(plinth);
  interactableObjects.push(plinth);

  sculptureEntries.push({ data: sdata, plinth, x, z, plinthH, loaded: false, loading: false, mesh: null });
});

// ---- 8. LAZY TEXTURE + MODEL LOADER ---------------------------------------
// Only loads what the camera can actually see (within a generous radius).
// This is the single biggest perf win: first paint happens almost instantly.
const LOAD_RADIUS_SQ = 60 * 60; // world units squared

function cameraTargetXZ() {
  // Approximate where the camera is looking at on the ground plane.
  return { x: camera.position.x - 5, z: camera.position.z - 7 };
}

function maybeLoadTextures() {
  const { x: cx, z: cz } = cameraTargetXZ();
  for (const mesh of paintingMeshes) {
    const d = mesh.userData;
    if (d.isSculpture || d.loaded || d.loading) continue;
    const dx = mesh.position.x - cx, dz = mesh.position.z - cz;
    if (dx * dx + dz * dz < LOAD_RADIUS_SQ) {
      d.loading = true;
      textureLoader.load(d.imagePath, (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        tex.anisotropy = 4;
        d.faceMat.map = tex;
        d.faceMat.needsUpdate = true;
        d.loaded = true;
      }, undefined, () => { d.loading = false; /* retry on next tick */ });
    }
  }
  // Sculptures too
  for (const s of sculptureEntries) {
    if (s.loaded || s.loading) continue;
    const dx = s.x - cx, dz = s.z - cz;
    if (dx * dx + dz * dz < LOAD_RADIUS_SQ) {
      s.loading = true;
      loadSculpture(s);
    }
  }
}

function loadSculpture(s) {
  const { data } = s;
  const onMesh = (mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Center & scale neatly atop the plinth.
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 1.1;
    const k = targetSize / maxDim;
    mesh.scale.multiplyScalar(k);
    mesh.position.set(
      s.x - center.x * k,
      s.plinthH + (size.y * k) / 2 - (box.min.y * k) - (center.y * k) + 0.02,
      s.z - center.z * k
    );
    mesh.rotation.y = (Math.random() - 0.5) * Math.PI;

    // Make it interactive too — click on the sculpture opens the info card.
    mesh.userData = { ...data, imagePath: null, index: 900, isSculpture: true };
    mesh.traverse(o => { if (o.isMesh) o.userData = mesh.userData; });

    scene.add(mesh);
    interactableObjects.push(mesh);
    s.mesh = mesh;
    s.loaded = true;
  };

  if (data.type === 'glb') {
    const loader = new GLTFLoader();
    loader.load(data.file, (gltf) => {
      const m = gltf.scene;
      m.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true; o.receiveShadow = true;
          // Tint the GLB subtly to fit our palette
          if (o.material && o.material.color) o.material.color = new THREE.Color(data.color);
          if (o.material) { o.material.roughness = 0.6; o.material.metalness = 0.1; }
        }
      });
      onMesh(m);
    }, undefined, (err) => { console.warn('GLB failed', err); s.loading = false; });
  } else {
    const loader = new STLLoader();
    loader.load(data.file, (geom) => {
      geom.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.55, metalness: 0.05 });
      const mesh = new THREE.Mesh(geom, mat);
      onMesh(mesh);
    }, undefined, (err) => { console.warn('STL failed', err); s.loading = false; });
  }
}

// ---- 9. CAMERA: SMART ZOOM + DRAG PAN --------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersectionPoint = new THREE.Vector3();

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(planeY, intersectionPoint);
  const before = intersectionPoint.clone();

  camera.zoom = Math.max(0.4, Math.min(camera.zoom - e.deltaY * 0.001, 5.0));
  camera.updateProjectionMatrix();

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(planeY, intersectionPoint);
  camera.position.x += before.x - intersectionPoint.x;
  camera.position.z += before.z - intersectionPoint.z;

  hideScrollHint();
  maybeLoadTextures();
}, { passive: false });

// Drag to pan (click + drag anywhere empty)
let dragging = false, lastPointer = null, pointerDownAt = null, didDrag = false;
renderer.domElement.addEventListener('pointerdown', (e) => {
  dragging = true; didDrag = false;
  lastPointer = { x: e.clientX, y: e.clientY };
  pointerDownAt = { x: e.clientX, y: e.clientY, t: Date.now() };
});
window.addEventListener('pointerup', () => { dragging = false; lastPointer = null; });
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastPointer.x;
  const dy = e.clientY - lastPointer.y;
  if (Math.abs(dx) + Math.abs(dy) > 3) didDrag = true;
  // Convert screen delta into world delta
  const worldPerPixelX = (camera.right - camera.left) / window.innerWidth / camera.zoom;
  const worldPerPixelZ = (camera.top - camera.bottom) / window.innerHeight / camera.zoom;
  camera.position.x -= dx * worldPerPixelX;
  camera.position.z -= dy * worldPerPixelZ;
  lastPointer = { x: e.clientX, y: e.clientY };
  maybeLoadTextures();
});

// ---- 10. INTERACTION (click → info card; click again → modal) -------------
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const info = document.getElementById('info-panel');
let selectedUserData = null;

function openInfo(d) {
  selectedUserData = d;
  info.classList.add('show');
  document.getElementById('info-index').innerText = 'Nº ' + String(d.index).padStart(2, '0');
  document.getElementById('info-medium').innerText = (d.medium || '').toUpperCase();
  document.getElementById('info-title').innerText = d.title;
  document.getElementById('info-size').innerText = d.size;
  document.getElementById('info-category').innerText = d.category;
  const statusEl = document.getElementById('info-status');
  statusEl.className = 'status-tag ' + (d.status || '').replace(' ', '-');
  statusEl.innerText = d.status;
  const hint = document.getElementById('info-hint');
  hint.innerText = d.imagePath ? 'Click again — enlarge →' : 'Sculpture — 3D work';
}
function closeInfo() { info.classList.remove('show'); selectedUserData = null; }

function openModal(d) {
  if (!d.imagePath) return; // sculptures don't have a 2D image
  modalImg.src = d.imagePath;
  document.getElementById('modal-title').innerText = d.title;
  document.getElementById('modal-size').innerText = d.size + ' · ' + d.medium;
  modal.classList.add('show');
}
function closeModal() { modal.classList.remove('show'); modalImg.src = ''; }

renderer.domElement.addEventListener('click', (e) => {
  if (didDrag) return; // ignore clicks that were really drags
  if (modal.classList.contains('show')) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(interactableObjects.filter(o => o.visible), true);
  if (hits.length) {
    // walk up to find the object with userData.title
    let o = hits[0].object;
    while (o && !(o.userData && o.userData.title)) o = o.parent;
    if (!o) return;
    const d = o.userData;
    if (selectedUserData && selectedUserData.title === d.title && d.imagePath) {
      openModal(d);
    } else {
      openInfo(d);
    }
  } else {
    closeInfo();
  }
});

// Hover cursor state — browser cursor, just toggled pointer/default on hits.
window.addEventListener('pointermove', (e) => {
  if (modal.classList.contains('show')) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(interactableObjects.filter(o => o.visible), true);
  document.body.style.cursor = hits.length > 0 ? 'pointer' : (dragging ? 'grabbing' : 'default');
});

document.getElementById('close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeInfo(); } });

// ---- 11. FILTERS (buttons, not selects) ------------------------------------
const activeFilters = { medium: 'all', category: 'all', status: 'all' };
function applyFilters() {
  let visibleCount = 0;
  paintingMeshes.forEach(mesh => {
    const d = mesh.userData;
    const v = (activeFilters.medium   === 'all' || d.medium   === activeFilters.medium)
           && (activeFilters.category === 'all' || d.category === activeFilters.category)
           && (activeFilters.status   === 'all' || d.status   === activeFilters.status);
    mesh.visible = v;
    if (v) visibleCount++;
  });
  // Hide/show sculpture meshes too (they're children added separately).
  sculptureEntries.forEach(s => { if (s.mesh) {
    const d = s.data;
    s.mesh.visible = (activeFilters.medium === 'all' || d.medium === activeFilters.medium)
                  && (activeFilters.category === 'all' || d.category === activeFilters.category)
                  && (activeFilters.status === 'all' || d.status === activeFilters.status);
  }});
  document.getElementById('count-visible').innerText = String(visibleCount).padStart(2, '0');
}

document.querySelectorAll('#rail button').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter, v = btn.dataset.value;
    activeFilters[f] = v;
    document.querySelectorAll(`#rail button[data-filter="${f}"]`).forEach(b => b.classList.toggle('active', b === btn));
    applyFilters();
  });
});

// ---- 12. UI: loading screen, counts, clock, ticker ------------------------
const totalCount = paintingsData.length + sculpturesData.length;
document.getElementById('count-total').innerText = String(totalCount).padStart(2, '0');
document.getElementById('count-visible').innerText = String(totalCount).padStart(2, '0');

// PERF: fake a smooth-feeling loading bar tied to geometry readiness, not networks.
// Scene is already ready — just animate progress quickly, then dismiss.
(function runLoader() {
  const bar = document.getElementById('loading-bar');
  const pct = document.getElementById('loading-pct');
  const screen = document.getElementById('loading-screen');
  let p = 0;
  const tick = () => {
    p = Math.min(100, p + (100 - p) * 0.12 + 1.5);
    bar.style.width = p + '%';
    pct.innerText = String(Math.floor(p)).padStart(3, '0') + '%';
    if (p < 99.5) requestAnimationFrame(tick);
    else {
      screen.style.opacity = '0';
      setTimeout(() => { screen.style.display = 'none'; }, 700);
    }
  };
  requestAnimationFrame(tick);
})();

// Clock


// Ticker rotation
const tickerLines = [
    'Commissions open — enquire via rosa@siabi.studio.',
  'Paper works unframed.'
];
let tickerI = 0;
setInterval(() => {
  tickerI = (tickerI + 1) % tickerLines.length;
  const el = document.getElementById('ticker-line');
  el.style.opacity = 0;
  setTimeout(() => { el.innerText = tickerLines[tickerI]; el.style.opacity = 1; }, 400);
}, 5500);

// Scroll hint auto-hide
let hintHidden = false;
function hideScrollHint() {
  if (hintHidden) return;
  hintHidden = true;
  document.getElementById('scroll-hint').classList.add('hidden');
}
setTimeout(hideScrollHint, 6000);

// ---- 13. RESIZE + RENDER --------------------------------------------------
window.addEventListener('resize', () => {
  const a = window.innerWidth / window.innerHeight;
  camera.left = -20 * a; camera.right = 20 * a;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial lazy-load pass (load whatever's already near the camera)
maybeLoadTextures();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();