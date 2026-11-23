// ============================================================================
//  ROSA — STUDIO INDEX
//  Editorial 3D gallery. Paintings laid out on a studio floor, grouped by series.
//  Heavily optimized for fast first paint (see PERF notes throughout).
// ============================================================================
import * as THREE from 'three';

// ---- 1. DATA ---------------------------------------------------------------
const paintingsData = [
  {"fileName": "IMG_5308.webp", "title": "But after hearing the gunshots, many people yelled, get down, get down, which caused her to start twerking.Do you believe? Get down. She’s the only one that really understood what that meant.", "size": "70cm x 100cm x 1.8cm", "medium": "canvas", "description": "oil on canvas", "category": "hands", "status": "available", "orientation": "portrait"},
  {"fileName": "IMG_5309.webp", "title": "Untitled", "size": "80cm x 60cm x1.8cm", "medium": "canvas", "description": "oil on canvas", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "IMG_5310.webp", "title": "When in doubt act like God", "size": "70cm x 100cm x 1.8cm", "medium": "canvas", "description": "oil on canvas", "category": "hands", "status": "available", "orientation": "portrait"},
  {"fileName": "IMG_5311.webp", "title": "I didn't know that was happening", "size": "80cm x 60cm x1.8cm", "medium": "canvas", "description": "oil on canvas", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "IMG_5312.webp", "title": "Love is an amazing feeling", "size": "100cm x 100cm x 1.8cm", "medium": "canvas", "description": "oil on canvas", "category": "hands", "status": "available", "orientation": "square"},
  {"fileName": "IMG_5325.webp", "title": "Untitled", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "ai", "status": "available", "orientation": "portrait"},
  {"fileName": "IMG_5327.webp", "title": "Untitled", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "hands", "status": "available", "orientation": "portrait"},
  {"fileName": "IMG_5328.webp", "title": "Untitled", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "IMG_5635.webp", "title": "Untitled", "size": "A4", "medium": "paper", "description": "oil on paper", "category": "misc", "status": "available", "orientation": "landscape"},
  {"fileName": "IMG_5636.webp", "title": "Untitled", "size": "A4", "medium": "paper", "description": "oil on paper", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "IMG_5644.webp", "title": "Untitled", "size": "A5", "medium": "paper", "description": "graphite on paper", "category": "hands", "status": "available", "orientation": "portrait"},
  {"fileName": "IMG_5649.webp", "title": "Untitled", "size": "A5", "medium": "paper", "description": "graphite on paper", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "IMG_5650.webp", "title": "In Vermont we know a thing or two about the cold", "size": "25.3cm x 20.2cm x 2cm", "medium": "canvas", "description": "oil on canvas", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "IMG_5651.webp", "title": "Untitled", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "bb09.webp", "title": "head", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "available", "orientation": "portrait"},
  {"fileName": "bb01.webp", "title": "leg", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "available", "orientation": "portrait"},
  {"fileName": "bb07.webp", "title": "nipple", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "sold", "orientation": "landscape"},
  {"fileName": "bb03.webp", "title": "half", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "available", "orientation": "portrait"},
  {"fileName": "bb04.webp", "title": "fist", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "available", "orientation": "portrait"},
  {"fileName": "bb05.webp", "title": "v", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "sold", "orientation": "portrait"},
  {"fileName": "bb02.webp", "title": "thigh", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "sold", "orientation": "portrait"},
  {"fileName": "bb06.webp", "title": "chest", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "available", "orientation": "portrait"},
  {"fileName": "bb08.webp", "title": "armpit", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "available", "orientation": "landscape"},
  {"fileName": "bb10.webp", "title": "upper body", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "body builder", "status": "available", "orientation": "landscape"},
  {"fileName": "CAKE.webp", "title": "Aging backwards", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "misc", "status": "sold", "orientation": "portrait"},
  {"fileName": "victor.webp", "title": "I sport new balance to avoid a narrow path", "size": "40cm x 50cm", "medium": "canvas", "description": "oil on canvas", "category": "misc", "status": "available", "orientation": "portrait"},
  {"fileName": "MAKEUP.webp", "title": "All dolled up with nowhere to be", "size": "A4", "medium": "paper", "description": "oil on paper", "category": "misc", "status": "available", "orientation": "portrait"},
  {"fileName": "charles.webp", "title": "i have meddled... if that is the word", "size": "A2", "medium": "paper", "description": "oil on paper", "category": "hands", "status": "available", "orientation": "landscape"},
  {"fileName": "tilda.webp", "title": "Tilda do us part", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "hands", "status": "available", "orientation": "portrait"},
  {"fileName": "franca.webp", "title": "OH NO! Franca lost her drink", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "misc", "status": "sold", "orientation": "portrait"},
  {"fileName": "tow.webp", "title": "Turkish Oil Wrestling", "size": "A5", "medium": "paper", "description": "oil on paper", "category": "misc", "status": "available", "orientation": "landscape"}
];

function getDimensions(sizeStr, medium, orientation) {
  let w = 4.0, h = 5.0;
  const s = sizeStr.toLowerCase().replace(/\s/g, '');
  const cm = s.match(/[\d.]+(?=cm)/g) || [];
  if (s.includes("a5")) { w = 1.48; h = 2.1; }
  else if (s.includes("a4")) { w = 2.1; h = 2.97; }
  else if (s.includes("a2")) { w = 5.94; h = 4.2; }
  else if (cm.length >= 2) { w = parseFloat(cm[0]) / 10; h = parseFloat(cm[1]) / 10; }
  if (orientation === "landscape" && h > w) { [w, h] = [h, w]; }

  // Every work is shown to scale: 1 floor unit = 10cm.

  // Works whose size has a depth (e.g. "40cm x 50cm x 1.8cm") are built as a
  // block; everything else lies flat like a sheet of paper.
  const thickness = cm.length >= 3 ? 0.35 : 0.02;
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
// If the screen is portrait (aspect < 1), we increase 'd' to maintain the same horizontal framing.
let d = aspect < 1 ? 7 / aspect : 7; 
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(12, 28, 18);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.domElement.style.touchAction = 'none';

const cameraTarget = {
  x: camera.position.x,
  z: camera.position.z,
  zoom: camera.zoom
};
const cameraSmoothFactor = 0.16;
document.body.appendChild(renderer.domElement);

// Lighting — warm, even, and reaching the whole studio.
scene.add(new THREE.AmbientLight(0xfaf5ec, 0.95)); // brighter base so nothing ever goes dark

const keyLight = new THREE.DirectionalLight(0xfff2dc, 0.85);
keyLight.position.set(18, 35, 12);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
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

// ---- 5. PLACEMENT (hands in the middle, everything else around, no overlaps)
// The hands series is packed into the middle and the other series are mixed
// together around it. Works are
// tested as real rotated rectangles (not circles), so there are no big gaps,
// and nothing is ever placed without an overlap check.
// The layout is seeded, so it looks the same on every visit.
function seededRandom(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = seededRandom(20261122);

const FOCUS_GAP = 0.25; // space between hands works (kept close in the middle)
const ITEM_GAP  = 0.45; // space around every other work (a looser scatter)
const FOCUS_SERIES = 'hands'; // this series sits in the middle of the floor
const MAX_TILT  = 0.36; // radians of random turn per work

// Work out which floor directions show up as screen-right and screen-up for
// this camera, so clusters grow in the shape of the screen (wide on desktop,
// tall on phones).
const screenToFloor = (() => {
  camera.updateMatrixWorld();
  const px = window.innerWidth / 2, py = window.innerHeight / 2; // NDC → pixels
  const o = new THREE.Vector3(0, 0, 0).project(camera);
  const ex = new THREE.Vector3(1, 0, 0).project(camera);
  const ez = new THREE.Vector3(0, 0, 1).project(camera);
  // Screen pixels moved per floor unit along x and along z.
  const a = (ex.x - o.x) * px, b = (ez.x - o.x) * px;
  const c = (ex.y - o.y) * py, d2 = (ez.y - o.y) * py;
  const det = a * d2 - b * c;
  // Inverse: screen offset (sx, sy) → floor offset (x, z).
  return (sx, sy) => [(d2 * sx - b * sy) / det, (-c * sx + a * sy) / det];
})();
// Usable area: the logo and links take some height, and on wider screens the
// filter menu takes a strip on the left (mirrored on the right to stay centred).
const usableWidth = window.innerWidth > 720 ? 1 - (2 * 230) / window.innerWidth : 0.94;
const screenAspect = Math.sqrt((usableWidth * window.innerWidth) / (0.72 * window.innerHeight));
const floorPerPixel = Math.hypot(...screenToFloor(1, 0)); // floor units per screen pixel, horizontally

function rectCorners(x, z, w, h, rot) {
  const c = Math.cos(rot), s = Math.sin(rot), hw = w / 2, hh = h / 2;
  return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]
    .map(([u, v]) => [x + u * c + v * s, z - u * s + v * c]);
}
function bounds(poly) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const [x, z] of poly) {
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
  return { minX, maxX, minZ, maxZ };
}
// Separating-axis test for two rotated rectangles, with a minimum gap.
function rectsTooClose(A, B, gap) {
  const ba = A.box, bb = B.box;
  if (ba.maxX + gap <= bb.minX || bb.maxX + gap <= ba.minX ||
      ba.maxZ + gap <= bb.minZ || bb.maxZ + gap <= ba.minZ) return false;
  for (const P of [A.poly, B.poly]) {
    for (let i = 0; i < 2; i++) {
      let ax = -(P[i + 1][1] - P[i][1]), az = P[i + 1][0] - P[i][0];
      const len = Math.hypot(ax, az); ax /= len; az /= len;
      let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity;
      for (const [x, z] of A.poly) { const p = x * ax + z * az; if (p < aMin) aMin = p; if (p > aMax) aMax = p; }
      for (const [x, z] of B.poly) { const p = x * ax + z * az; if (p < bMin) bMin = p; if (p > bMax) bMax = p; }
      if (aMax + gap <= bMin || bMax + gap <= aMin) return false;
    }
  }
  return true;
}
function shape(poly) { return { poly, box: bounds(poly) }; }
function moved(s, dx, dz) { return shape(s.poly.map(([x, z]) => [x + dx, z + dz])); }

// Candidate offsets on growing rings, shaped like the screen. Closest first.
function* ringOffsets(step, aspect) {
  yield [0, 0];
  for (let r = step; r < 80; r += step) {
    const n = Math.ceil((2 * Math.PI * r) / step);
    const start = rand() * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const a = start + (i * 2 * Math.PI) / n;
      // r is roughly in floor units; scale so the ring is that size on screen.
      const [x, z] = screenToFloor(Math.cos(a) * aspect, Math.sin(a) / aspect);
      const k = r / floorPerPixel;
      yield [x * k, z * k];
    }
  }
}
// Find the closest offset where every shape in `group` clears every shape in `placed`.
function placeGroup(group, placed, gap, step, aspect) {
  for (const [dx, dz] of ringOffsets(step, aspect)) {
    const movedGroup = group.map(s => moved(s, dx, dz));
    const clash = movedGroup.some(g => placed.some(p => rectsTooClose(g, p, gap)));
    if (!clash) return { dx, dz, shapes: movedGroup };
  }
  throw new Error('Could not place group');
}

function layoutPaintings(items) {
  // One blended scatter: the focus series (hands) is packed first so it takes
  // the middle, then every other work, mixed together, is placed around it.
  const area = it => it.dims.w * it.dims.h;
  const focus = items.filter(it => it.category === FOCUS_SERIES).sort((a, b) => area(b) - area(a));
  const rest = items.filter(it => it.category !== FOCUS_SERIES);
  for (let i = rest.length - 1; i > 0; i--) { // seeded shuffle so the series blend
    const j = Math.floor(rand() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  const placed = [];
  for (const [list, gap] of [[focus, FOCUS_GAP], [rest, ITEM_GAP]]) {
    for (const it of list) {
      it.rot = (rand() - 0.5) * MAX_TILT;
      const s = shape(rectCorners(0, 0, it.dims.w, it.dims.h, it.rot));
      // Every work is checked against every work already placed: no overlaps.
      const spot = placeGroup([s], placed, gap, 0.12, screenAspect);
      it.x = spot.dx; it.z = spot.dz;
      placed.push(spot.shapes[0]);
    }
  }

  // Centre everything on the floor origin.
  const all = bounds(placed.flatMap(s => s.poly));
  const cx = (all.minX + all.maxX) / 2, cz = (all.minZ + all.maxZ) / 2;
  for (const it of items) { it.x -= cx; it.z -= cz; }
  return placed.flatMap(s => s.poly).map(([x, z]) => [x - cx, z - cz]);
}

// ---- 5b. CANVAS SHADOWS ----------------------------------------------------
// Stretched canvases get a crisp, dark shadow on the floor so they read as solid
// objects next to the flat paper works. PERF: one tiny texture drawn in code (no
// download), one flat quad per canvas, attached to the canvas so it follows its
// visibility.
let canvasShadowTex = null;
function makeCanvasShadowTexture() {
  const S = 128, pad = 26;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const ctx = c.getContext('2d');
  // Draw the box off-canvas and let only its blurred shadow land in view
  // (works in every browser, unlike ctx.filter).
  ctx.shadowColor = 'rgba(30, 22, 14, 1)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = S;
  ctx.fillRect(pad - S, pad, S - 2 * pad, S - 2 * pad);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return { tex: t, margin: pad / (S - 2 * pad) }; // margin as a fraction of the box size
}
const CANVAS_SHADOW = { opacity: 0.32, offset: 0.28 }; // offset in floor units (10cm each)
function addCanvasShadow(mesh, dims, rot) {
  if (!canvasShadowTex) canvasShadowTex = makeCanvasShadowTexture();
  const { tex, margin } = canvasShadowTex;
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, opacity: CANVAS_SHADOW.opacity, depthWrite: false, fog: false
  });
  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(dims.w * (1 + 2 * margin), dims.h * (1 + 2 * margin)), mat
  );
  quad.rotation.x = -Math.PI / 2;
  // Cast away from the key light (which sits up and to the +x/+z side), then turn
  // that world-space offset into the canvas's own rotated frame.
  const L = keyLight.position, len = Math.hypot(L.x, L.z) || 1;
  const wx = -L.x / len * CANVAS_SHADOW.offset, wz = -L.z / len * CANVAS_SHADOW.offset;
  const c = Math.cos(-rot), s = Math.sin(-rot);
  quad.position.set(wx * c + wz * s, -dims.thickness / 2 + 0.001, -wx * s + wz * c);
  quad.renderOrder = -1;
  quad.raycast = () => {}; // clicks and hovers go to the painting, not its shadow
  mesh.add(quad);
}

// ---- 6. PAINTINGS (geometry immediately, textures streamed in) ------------
// The edges remain Standard so they catch light and show physical depth
const sharedEdgeMaterial = new THREE.MeshStandardMaterial({ color: 0xd2c7b5, roughness: 0.9 });
const paintingMeshes = [];
const interactableObjects = [];

const layoutItems = paintingsData.map(data => ({
  data, category: data.category,
  dims: getDimensions(data.size, data.medium, data.orientation)
}));
const layoutCorners = layoutPaintings(layoutItems);

// Local testing only: warn if any two works ever touch.
if (import.meta.env && import.meta.env.DEV) {
  const rects = [];
  for (let i = 0; i < layoutCorners.length; i += 4) rects.push(shape(layoutCorners.slice(i, i + 4)));
  let clashes = 0;
  for (let i = 0; i < rects.length; i++)
    for (let j = i + 1; j < rects.length; j++) if (rectsTooClose(rects[i], rects[j], 0)) clashes++;
  console.info(`[layout] ${rects.length} works, ${clashes} overlapping pairs`);
}

layoutItems.forEach(({ data, dims, x, z, rot }, idx) => {
  const geometry = new THREE.BoxGeometry(dims.w, dims.thickness, dims.h);

  // The front face goes back to Basic so the artwork's colors are purely neutral
  const faceMat = new THREE.MeshBasicMaterial({ map: placeholderTex });

  // We mix the materials: Basic for the top (the art), Standard for the sides (the canvas edge)
  const mats = [
    sharedEdgeMaterial, // right
    sharedEdgeMaterial, // left
    faceMat,            // top (the front face in our floor-scatter layout)
    sharedEdgeMaterial, // bottom
    sharedEdgeMaterial, // back
    sharedEdgeMaterial  // front
  ];

  const mesh = new THREE.Mesh(geometry, mats);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  data.floorY = dims.thickness / 2 + 0.001;
  mesh.position.set(x, data.floorY, z);
  mesh.rotation.y = rot;

  data.imagePath = `/images/${data.medium}/${data.fileName}`;
  // Small version for the floor; falls back to the normal image if it's missing.
  data.thumbPath = `/images/thumb/${data.medium}/${data.fileName}`;
  data.canEnquire = data.status === 'available';
  if (data.canEnquire) {
    data.enquiryPath = `/contact.html?subject=${encodeURIComponent(`Artwork enquiry: ${data.title} - original`)}`;
  }
  data.index = idx + 1;
  data.faceMat = faceMat;
  data.loaded = false;
  mesh.userData = data;

  if (dims.thickness > 0.1) addCanvasShadow(mesh, dims, rot);

  mesh.visible = false;
  scene.add(mesh);
  paintingMeshes.push(mesh);
  interactableObjects.push(mesh);
});

// Fit the shadow area to the layout (smaller area = sharper, cheaper shadows).
{
  const b = bounds(layoutCorners);
  const half = Math.max(b.maxX - b.minX, b.maxZ - b.minZ) / 2 + 6;
  Object.assign(keyLight.shadow.camera, { left: -half, right: half, top: half, bottom: -half });
  keyLight.shadow.camera.updateProjectionMatrix();
}

// Start zoomed so the whole collection fills the screen (leaving room for the
// logo at the top and the links at the bottom).
let minZoom = 0.4;
const HERO_WIDTH  = 0.85; // starting view: centre hands work fills this much of the screen width…
const HERO_HEIGHT = 0.55; // …or this much of the height, whichever is reached first
function fitCameraToLayout() {
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  let maxX = 0, maxY = 0;
  const v = new THREE.Vector3();
  for (const [x, z] of layoutCorners) {
    v.set(x, 0, z).project(camera);
    maxX = Math.max(maxX, Math.abs(v.x));
    maxY = Math.max(maxY, Math.abs(v.y));
  }
  const fitZoom = Math.max(0.15, Math.min(usableWidth / maxX, 0.68 / maxY, 5.0));
  minZoom = Math.min(0.4, fitZoom); // people can always zoom out to see everything

  // Start close in, centred on the biggest hands work, which fills most of the
  // screen width on a phone (or a bit over half the height on wide screens).
  const area = it => it.dims.w * it.dims.h;
  const hero = layoutItems
    .filter(it => it.category === FOCUS_SERIES)
    .reduce((best, it) => (!best || area(it) > area(best) ? it : best), null);
  if (!hero) { camera.zoom = cameraTarget.zoom = fitZoom; camera.updateProjectionMatrix(); return; }
  camera.position.x = cameraTarget.x = camera.position.x + hero.x;
  camera.position.z = cameraTarget.z = camera.position.z + hero.z;
  camera.updateMatrixWorld();
  let minX = Infinity, maxX2 = -Infinity, minY = Infinity, maxY2 = -Infinity;
  for (const [x, z] of rectCorners(hero.x, hero.z, hero.dims.w, hero.dims.h, hero.rot)) {
    v.set(x, 0, z).project(camera);
    minX = Math.min(minX, v.x); maxX2 = Math.max(maxX2, v.x);
    minY = Math.min(minY, v.y); maxY2 = Math.max(maxY2, v.y);
  }
  // NDC runs -1..1, so a span of 2 is the full screen.
  const zoom = Math.max(minZoom, Math.min(
    (HERO_WIDTH * 2) / (maxX2 - minX), (HERO_HEIGHT * 2) / (maxY2 - minY), 5.0));
  camera.zoom = cameraTarget.zoom = zoom;
  camera.updateProjectionMatrix();
}
fitCameraToLayout();

// ---- 8. TEXTURE LOADER -----------------------------------------------------
let paintingTexturesLoaded = 0;
let loadingDismissed = false;

function updateLoadingProgress() {
  if (!bar || !pct || !paintingMeshes.length) return;
  const p = Math.round((paintingTexturesLoaded / paintingMeshes.length) * 100);
  bar.style.width = p + '%';
  pct.innerText = String(p).padStart(3, '0') + '%';
}

function finishPaintingTexture(mesh) {
  const d = mesh.userData;
  d.loaded = true;
  d.loading = false;
  paintingTexturesLoaded++;
  updateLoadingProgress();
  applyFilters(); // each work appears as soon as its image arrives

  if (paintingTexturesLoaded === paintingMeshes.length) {
    setTimeout(dismissLoadingScreen, 150);
  }
}

function applyTexture(d, tex) {
  tex.encoding = THREE.sRGBEncoding;
  tex.anisotropy = 4;
  d.faceMat.map = tex;
  d.faceMat.needsUpdate = true;
}

function loadAllPaintingTextures() {
  updateLoadingProgress();

  paintingMeshes.forEach((mesh) => {
    const d = mesh.userData;
    if (d.loading || d.loaded) return;
    d.loading = true;

    textureLoader.load(
      d.thumbPath,
      (tex) => { applyTexture(d, tex); finishPaintingTexture(mesh); },
      undefined,
      () => textureLoader.load(
        d.imagePath,
        (tex) => { applyTexture(d, tex); finishPaintingTexture(mesh); },
        undefined,
        () => {
          console.error(`Failed to load texture: ${d.imagePath}`);
          finishPaintingTexture(mesh);
        }
      )
    );
  });
}

// ---- 9. CAMERA: SMART ZOOM + DRAG PAN --------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const planeY = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersectionPoint = new THREE.Vector3();

window.addEventListener('wheel', (e) => {
  e.preventDefault();
  hideScrollHint();

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(planeY, intersectionPoint);
  const before = intersectionPoint.clone();

  const newZoom = Math.max(minZoom, Math.min(cameraTarget.zoom - e.deltaY * 0.0012, 5.0));
  cameraTarget.zoom = newZoom;
  camera.zoom = newZoom;
  camera.updateProjectionMatrix();

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(planeY, intersectionPoint);
  cameraTarget.x += before.x - intersectionPoint.x;
  cameraTarget.z += before.z - intersectionPoint.z;

}, { passive: false });

// ---- Touch Pinch-to-Zoom ----
let initialPinchDistance = null;
let initialZoom = null;

renderer.domElement.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    dragging = false; // Cancel panning if they are trying to zoom
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    initialPinchDistance = Math.hypot(dx, dy);
    initialZoom = camera.zoom;
  }
}, { passive: false });

renderer.domElement.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2 && initialPinchDistance) {
    e.preventDefault(); // Stop the whole page from zooming/scrolling natively
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.hypot(dx, dy);
    
    // Calculate how much the fingers have moved apart/together
    const scale = dist / initialPinchDistance;

    camera.zoom = Math.max(minZoom, Math.min(initialZoom * scale, 5.0));
    cameraTarget.zoom = camera.zoom;
    camera.updateProjectionMatrix();
    
  }
}, { passive: false });

renderer.domElement.addEventListener('touchend', () => {
  initialPinchDistance = null;
});

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

  const prevMouse = {
    x: (lastPointer.x / window.innerWidth) * 2 - 1,
    y: -(lastPointer.y / window.innerHeight) * 2 + 1
  };
  const currMouse = {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -(e.clientY / window.innerHeight) * 2 + 1
  };

  raycaster.setFromCamera(prevMouse, camera);
  raycaster.ray.intersectPlane(planeY, intersectionPoint);
  const prevWorld = intersectionPoint.clone();

  raycaster.setFromCamera(currMouse, camera);
  raycaster.ray.intersectPlane(planeY, intersectionPoint);
  const currWorld = intersectionPoint.clone();

  const delta = prevWorld.sub(currWorld);
  cameraTarget.x += delta.x;
  cameraTarget.z += delta.z;

  camera.position.x = cameraTarget.x;
  camera.position.z = cameraTarget.z;
  lastPointer = { x: e.clientX, y: e.clientY };
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
  document.getElementById('info-medium').innerText = (d.description || d.medium || '').toUpperCase();
  document.getElementById('info-title').innerText = d.title;
  document.getElementById('info-size').innerText = d.size;
  document.getElementById('info-category').innerText = d.category;
  const statusEl = document.getElementById('info-status');
  statusEl.className = 'status-tag ' + (d.status || '').replace(' ', '-');
  statusEl.innerText = d.status;
  const hint = document.getElementById('info-hint');
  hint.innerText = 'Click again — enlarge →';
  const enquireLink = document.getElementById('info-enquire-link');
  if (d.imagePath && d.canEnquire && d.enquiryPath) {
    enquireLink.href = d.enquiryPath;
    enquireLink.innerText = 'Enquire about this work';
    enquireLink.classList.add('show');
  } else {
    enquireLink.classList.remove('show');
  }
}
function closeInfo() {
  info.classList.remove('show');
  document.getElementById('info-enquire-link').classList.remove('show');
  selectedUserData = null;
}

// The gallery uses small, fast images. The enlarge view opens on that same image
// (already loaded, so it appears instantly), then swaps in the sharper large
// version from /images/large/ as soon as it has downloaded.
let modalToken = 0;
function largePath(p) { return p.replace(/^\/images\//, '/images/large/'); }
function openModal(d) {
  const token = ++modalToken;
  modalImg.src = d.imagePath;
  document.getElementById('modal-title').innerText = d.title;
  document.getElementById('modal-size').innerText = d.size + ' · ' + (d.description || d.medium);
  modal.classList.add('show');
  const hi = new Image();
  hi.onload = () => { if (token === modalToken) modalImg.src = hi.src; };
  hi.src = largePath(d.imagePath);
}
function closeModal() { modalToken++; modal.classList.remove('show'); modalImg.src = ''; }

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
    // Only check filter conditions to increment the counter
    const matchesFilter = (activeFilters.medium   === 'all' || d.medium   === activeFilters.medium)
               && (activeFilters.category === 'all' || d.category === activeFilters.category)
               && (activeFilters.status   === 'all' || d.status   === activeFilters.status);
    
    // Only make visible if it matches the filter AND has finished loading
    mesh.visible = matchesFilter && d.loaded;
    if (matchesFilter) visibleCount++;
  });

  document.getElementById('count-visible').innerText = String(visibleCount).padStart(2, '0');
}

document.querySelectorAll('#rail button').forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Check if the clicked button is ALREADY active, and if it's the "All" button
    const isActive = btn.classList.contains('active');
    const isAllButton = btn.dataset.value === 'all';

    // 2. Reset the data logic: force all categories back to 'all'
    activeFilters.medium = 'all';
    activeFilters.category = 'all';
    activeFilters.status = 'all';

    // 3. Remove the 'active' class from EVERY button visually
    document.querySelectorAll('#rail button').forEach(b => b.classList.remove('active'));

    // 4. Toggle logic
    if (isActive && !isAllButton) {
      // If they clicked an active specific filter, turn it off and revert to "All"
      const allButton = document.querySelector('#rail button[data-value="all"]');
      if (allButton) allButton.classList.add('active');
      
    } else {
      // Otherwise, act normally: apply the specific filter and make it active
      const f = btn.dataset.filter;
      const v = btn.dataset.value;
      activeFilters[f] = v;
      btn.classList.add('active');
    }

    // 5. Update the 3D scene
    applyFilters();
  });
});

// ---- 12. UI: loading screen, counts, clock, ticker ------------------------
const totalCount = paintingsData.length;
document.getElementById('count-total').innerText = String(totalCount).padStart(2, '0');
document.getElementById('count-visible').innerText = String(totalCount).padStart(2, '0');

// PERF: fake a smooth-feeling loading bar tied to geometry readiness, not networks.
// Scene is already ready — just animate progress quickly, then dismiss.
// PERF: True loading screen tracking actual Three.js loaders
const bar = document.getElementById('loading-bar');
const pct = document.getElementById('loading-pct');
const screen = document.getElementById('loading-screen');

function dismissLoadingScreen() {
  screen.style.opacity = '0';
  setTimeout(() => {
    screen.style.display = 'none';
    document.body.classList.remove('loading');
  }, 700);
}

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
  // Recalculate 'd' on resize so rotating a phone updates the framing correctly
  const currentD = a < 1 ? 7 / a : 7;
  
  camera.left = -currentD * a; 
  camera.right = currentD * a;
  camera.top = currentD;
  camera.bottom = -currentD;
  camera.updateProjectionMatrix();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Load all paintings before revealing the gallery.
loadAllPaintingTextures();

function animate() {
  requestAnimationFrame(animate);

  camera.position.x += (cameraTarget.x - camera.position.x) * cameraSmoothFactor;
  camera.position.z += (cameraTarget.z - camera.position.z) * cameraSmoothFactor;
  camera.zoom += (cameraTarget.zoom - camera.zoom) * cameraSmoothFactor;
  camera.updateProjectionMatrix();

  renderer.render(scene, camera);
}
animate();
