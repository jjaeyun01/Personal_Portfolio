import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js";

const canvas = document.getElementById("earthCanvas");
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 2.2;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 0.8));

const loader = new THREE.TextureLoader();
const day = loader.load("https://raw.githubusercontent.com/pmndrs/drei-assets/main/earth/day.jpg");
const night = loader.load("https://raw.githubusercontent.com/pmndrs/drei-assets/main/earth/night.jpg");
const normal = loader.load("https://raw.githubusercontent.com/pmndrs/drei-assets/main/earth/normal.jpg");

const geo = new THREE.SphereGeometry(0.9, 64, 64);
const mat = new THREE.MeshPhongMaterial({
  map: day,
  normalMap: normal,
  emissiveMap: night,
  emissive: 0xffffff,
  emissiveIntensity: 0.5,
});
const earth = new THREE.Mesh(geo, mat);
scene.add(earth);

const cloudsTex = loader.load("https://raw.githubusercontent.com/pmndrs/drei-assets/main/earth/clouds.png");
const cloudGeo = new THREE.SphereGeometry(0.905, 64, 64);
const cloudMat = new THREE.MeshLambertMaterial({ map: cloudsTex, transparent: true });
const clouds = new THREE.Mesh(cloudGeo, cloudMat);
scene.add(clouds);

const planeGeo = new THREE.ConeGeometry(0.05, 0.15, 8);
const planeMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.0015;
  clouds.rotation.y += 0.0018;
  renderer.render(scene, camera);
}
animate();

window.flyPlane = function flyPlane() {
  const start = new THREE.Vector3(-1.2, 0.2, 0);
  const end = new THREE.Vector3(1.1, 0.4, 0);
  let progress = 0;

  function move() {
    if (progress >= 1) return;
    progress += 0.01;
    plane.position.lerpVectors(start, end, progress);
    plane.lookAt(end);
    renderer.render(scene, camera);
    requestAnimationFrame(move);
  }
  move();
};

window.addEventListener("resize", () => {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
