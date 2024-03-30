import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// images

const nikUrl = new URL('/public/logo.png', import.meta.url).href
const spaceUrl = new URL('/public/space.jpg', import.meta.url).href
const moonUrl = new URL('/public/moon.jpg', import.meta.url).href
const normalUrl = new URL('/public/normal.jpg', import.meta.url).href
const planetUrl = new URL('/public/planet.jpg', import.meta.url).href

// reload when window is resized

window.onresize = () => {
  location.reload();
};

// SPACE NEWS API

const url = 'https://spacenews.p.rapidapi.com/news';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b86080d624msh7e6ba0418b9cd81p1c6393jsnd9da0c5f71b8',
		'X-RapidAPI-Host': 'spacenews.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}

// setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.setY(1);

renderer.render(scene, camera);

// torus

const geometry = new THREE.TorusGeometry( 24, 2, 20, 50 )
const material = new THREE.MeshStandardMaterial({ color: 0x5CC8FF }); 
const torus = new THREE.Mesh( geometry, material );

scene.add(torus)
torus.position.x = -10;
torus.position.y = 10;
torus.position.z = -30;

// lighting

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20, 20, 20)

const ambientLight = new THREE.AmbientLight(0xffffff)

scene.add(pointLight, ambientLight)

// helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(lightHelper, gridHelper)

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

const spaceTexture = new THREE.TextureLoader().load(spaceUrl);
scene.background = spaceTexture;

// avatar

const nikTexture = new THREE.TextureLoader().load(nikUrl);
const niki = new THREE.Mesh(
  new THREE.BoxGeometry(25,25,25),
  new THREE.MeshBasicMaterial({ map: nikTexture })
);

scene.add(niki);

niki.position.x = -10;
niki.position.y = 10;
niki.position.z = -30;

// moon

const moonTexture = new THREE.TextureLoader().load(moonUrl);
const normalTexture = new THREE.TextureLoader().load(normalUrl);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
)

scene.add(moon);
moon.position.x = -30;
moon.position.z = 30;
moon.position.setY(10);

// planet

const planetTexture = new THREE.TextureLoader().load(planetUrl);

const planet = new THREE.Mesh(
  new THREE.SphereGeometry(8,36,36),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
    normalMap: normalTexture
  })
)

scene.add(planet);
planet.position.x = 25;
planet.position.y = -5;
planet.position.z = 10;

// animate & view

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.y += 0.06;
  moon.rotation.z += 0.004;

  planet.rotation.y += 0.04;
  planet.rotation.z += 0.001;
  
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