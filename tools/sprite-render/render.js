// Renders /model.glb (served by scripts/render-sprites.mjs) as isometric frames: an orthographic camera 30° above
// the ground (a ground square then looks like the game's 2:1 diamond), 8 facings, the model's first animation
// sampled at regular steps over one cycle. Each frame goes back to the server as a PNG.
// Query: ?frames=8&light=1&front=0 (front: rotation that turns this model's face toward the camera, in degrees).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const params = new URLSearchParams(location.search);
const FRAMES = Number(params.get('frames') ?? 8);
const LIT = params.get('light') !== '0';
const FRONT = Number(params.get('front') ?? 0);
const WIDTH = 256;
const HEIGHT = 384;
/** Screen facing → rotation of the model about the vertical axis, from facing the camera (plus FRONT). */
const FACINGS = { s: 0, se: 45, e: 90, ne: 135, n: 180, nw: 225, w: 270, sw: 315 };

const status = document.getElementById('status');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
if (LIT) {
  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x3e4a2c, 2.2));
  const sun = new THREE.DirectionalLight(0xffe6c0, 1.6);
  sun.position.set(-3, 5, 2); // upper left, as in docs/STYLE.md
  scene.add(sun);
}

const gltf = await new GLTFLoader().loadAsync('/model.glb');
const model = gltf.scene;
if (!LIT) {
  model.traverse((o) => {
    if (o.isMesh) o.material = new THREE.MeshBasicMaterial({ map: o.material.map, color: o.material.color });
  });
}
// Feet on the ground at the origin, height 1.
const box = new THREE.Box3().setFromObject(model);
const size = box.getSize(new THREE.Vector3());
model.scale.setScalar(1 / size.y);
const scaled = new THREE.Box3().setFromObject(model);
model.position.set(-(scaled.min.x + scaled.max.x) / 2, -scaled.min.y, -(scaled.min.z + scaled.max.z) / 2);
const pivot = new THREE.Group();
pivot.add(model);
scene.add(pivot);

// Orthographic view from 30° above; the frame is 1.5 model heights tall, feet near the bottom.
const viewHeight = 1.5;
const camera = new THREE.OrthographicCamera(
  (-viewHeight * WIDTH) / HEIGHT / 2,
  (viewHeight * WIDTH) / HEIGHT / 2,
  viewHeight * 0.8,
  -viewHeight * 0.2,
  0.1,
  20,
);
const elevation = THREE.MathUtils.degToRad(30);
camera.position.set(0, Math.sin(elevation) * 5, Math.cos(elevation) * 5);
camera.lookAt(0, 0, 0);
// lookAt tilts the frustum around the origin; keep the feet near the bottom of the frame.
camera.updateProjectionMatrix();

const mixer = new THREE.AnimationMixer(model);
const clip = gltf.animations[0];
if (clip) mixer.clipAction(clip).play();
const duration = clip?.duration ?? 1;

/**
 * One steady walk cycle [start, end): a clip may hold several cycles, the first one often slower. Times where every
 * bone is back (nearly) in its starting rotation mark cycle ends; the cycle between the first two is kept.
 */
function findCycle() {
  if (!clip) return { start: 0, end: duration };
  const bones = [];
  model.traverse((o) => o.isBone && bones.push(o));
  const pose = () => bones.map((b) => b.quaternion.clone());
  mixer.setTime(0);
  const start = pose();
  const curve = [];
  for (let t = 0.4; t <= duration; t += 0.01) {
    mixer.setTime(t);
    curve.push({ t, d: pose().reduce((sum, q, i) => sum + (1 - Math.abs(q.dot(start[i]))), 0) });
  }
  const repeats = curve
    .filter((p, i) => i > 0 && i < curve.length - 1 && p.d <= curve[i - 1].d && p.d <= curve[i + 1].d && p.d < 0.1)
    .map((p) => p.t);
  if (repeats.length >= 2) return { start: repeats[0], end: repeats[1] };
  return { start: 0, end: repeats[0] ?? duration };
}
const { start, end } = findCycle();
const cycle = end - start;

let sent = 0;
for (const [facing, degrees] of Object.entries(FACINGS)) {
  pivot.rotation.y = THREE.MathUtils.degToRad(degrees + FRONT);
  for (let i = 0; i < FRAMES; i++) {
    mixer.setTime(start + (cycle * i) / FRAMES);
    renderer.render(scene, camera);
    const blob = await new Promise((r) => renderer.domElement.toBlob(r, 'image/png'));
    await fetch(`/save?name=${facing}-${i}.png`, { method: 'POST', body: blob });
    status.textContent = `${++sent} images envoyées (${facing} ${i + 1}/${FRAMES})`;
  }
}
status.textContent = `Terminé : ${sent} images, animation « ${clip?.name ?? 'aucune'} » de ${duration.toFixed(2)} s, cycle de ${cycle.toFixed(2)} s.`;
document.title = 'Terminé';
