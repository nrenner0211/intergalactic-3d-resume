import '/style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(10);
camera.position.setX(10);

renderer.render(scene, camera);

// torus

const geometry = new THREE.TorusGeometry( 15, 2, 20, 50 )
const material = new THREE.MeshStandardMaterial({ color: 0x5CC8FF }); 
const torus = new THREE.Mesh( geometry, material );

scene.add(torus)
torus.position.x = -10;
torus.position.z = -30;
torus.position.setY(15);

// lighting

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20, 20, 20)

const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight)

// helpers

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

// add stars

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 20, 20);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh( geometry, material );

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(100).fill().forEach(addStar)

// background

const spaceTexture = new THREE.TextureLoader().load('/space.jpg');
scene.background = spaceTexture;

// avatar

const nikTexture = new THREE.TextureLoader().load('/nik.jpg');
const niki = new THREE.Mesh(
  new THREE.BoxGeometry(7,8,8),
  new THREE.MeshBasicMaterial({ map: nikTexture })
);

scene.add(niki);

niki.position.x = -10;
niki.position.z = -30;
niki.position.setY(15);

// moon

const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
)

scene.add(moon);
moon.position.z = 30;
moon.position.setX(25);

// planet

const planetTexture = new THREE.TextureLoader().load('/planet.jpg');

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(4,32,32),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
    normalMap: normalTexture
  })
)

scene.add(planet);
planet.position.x = -10;
planet.position.z = 30;
planet.position.setY(5);

// animate & view

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.y += 0.03;
  moon.rotation.z += 0.04;

  planet.rotation.x += 0.04;
  planet.rotation.y += 0.03;
  
  camera.position.z = t * -0.001;
  camera.position.x = t * -0.01;
  camera.position.y = t * -0.01;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame( animate );

  torus.rotation.y += -0.01;

  niki.rotation.y += 0.005;

  controls.update();

  renderer.render( scene, camera );
}

animate();