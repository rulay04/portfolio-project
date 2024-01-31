import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// container
const scene = new THREE.Scene();
// camera to mimic human vision
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// renderer to do graphics
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
  gammaOutput: true,
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// set camera along z axis
camera.position.setZ(30);
// draw
renderer.render(scene, camera);

// set x,y,z vectors to define ring object
const geometry = new THREE.TorusGeometry(10, 2, 16, 100);
// set material for object
const material = new THREE.MeshStandardMaterial({ color: 0xC6B684 });
// combine geometry shape and material
const torus = new THREE.Mesh(geometry, material);

// add to scene
scene.add(torus);

// create light source
const amLight = new THREE.AmbientLight(0xffffff, 3);

/*const pointLight = new THREE.PointLight(0xffffff, 40);
pointLight.position.set(-4, 10, 5);*/
scene.add(amLight);

const pointLight = new THREE.PointLight(0xffffff, 600);
scene.add(pointLight);

const cursor = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
  // Convert mouse coordinates to normalized device coordinates (NDC)
  cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
  cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const controls = new OrbitControls(camera, renderer.domElement);

/*const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);*/


function addBubble() {
  const geometry = new THREE.OctahedronGeometry(0.5, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0xFEFAE1 });
  const bubble = new THREE.Mesh(geometry, material);

  // randomize position for each bubble
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));

  bubble.position.set(x, y, z);
  scene.add(bubble);
}

// determine number of bubbles to show up
Array(400).fill().forEach(addBubble);

// load in water background
const oceanTexture = new THREE.TextureLoader().load('./images/darkcloud.avif');
scene.background = oceanTexture;

const pearlTexture = new THREE.TextureLoader().load('./images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('./images/normal.jpg');
const pearl = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshStandardMaterial({
    map: pearlTexture,
    normalMap: normalTexture
  })
);


const rusTexture = new THREE.TextureLoader().load('./images/cropped resume.jpg');
const rus = new THREE.Mesh(
  new THREE.BoxGeometry(6, 6, 6),
  new THREE.MeshStandardMaterial({ map: rusTexture })
);
scene.add(rus);

torus.position.x = 10;
rus.position.x = 10;

pearl.position.z = 30;
pearl.position.setX(-6);
pearl.position.setY(-3);
scene.add(pearl);

camera.position.z = 27;

let prevScrollPos = window.scrollY;

function moveCamera() {
  const currentScrollPos = window.scrollY;
  const scrollDelta = currentScrollPos - prevScrollPos;

  // Adjust rotation for the pearl and rus
  pearl.rotation.x += 0.005;
  pearl.rotation.y += 0.0075;
  pearl.rotation.z += 0.005;

  rus.rotation.x += 0.01;
  rus.rotation.y += 0.01;

  // Reverse the direction of camera movement based on scroll direction
  camera.position.z += scrollDelta * 0.003;
  camera.position.x += scrollDelta * 0.00009;
  camera.position.y += scrollDelta * 0.00009;

  // Limit how far the camera can move back (adjust as needed)
  if (camera.position.z < 2) {
    camera.position.z = 2;
  }

  // Update the previous scroll position
  prevScrollPos = currentScrollPos;
}

document.body.onscroll = moveCamera;


function animate() {
  requestAnimationFrame(animate);
  // update for every animation frame
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  pointLight.position.x = cursor.x * 20;
  pointLight.position.y = cursor.y * 20;

  controls.update();

  renderer.render(scene, camera);
}

animate();

