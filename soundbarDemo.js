import * as THREE from 'https://cdn.jsdelivr.net/npm/three/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

// Basic setup for the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0); // Light gray background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const carbonFiberTexture = textureLoader.load('carbon_fibre.jpg');

const geometry = new THREE.BoxGeometry(5, 1, 0.5);
const material = new THREE.MeshBasicMaterial({
    color: 0x010101, // Dark gray material
    map: carbonFiberTexture, // Comment this out if you don't want a carbon fiber texture
    transparent: true,
    opacity: 0.8
});

// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.autoRotate = false; // Set to true if you want the object to rotate automatically


const soundbar = new THREE.Mesh(geometry, material);

// Add the mesh to the scene
scene.add(soundbar);

// Position the camera
camera.position.set(0, 5, 0);
camera.lookAt(soundbar.position);

// Animation loop to rotate the soundbar for better visualization
function animate() {
    requestAnimationFrame(animate);
    // controls.update();
    renderer.render(scene, camera);
}

// Start the animation loop
animate();

window.addEventListener('scroll', () => {
    // Calculate the scroll percentage
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollY / maxScroll;


    // // Map scroll percentage to rotation angle (from 0 to Math.PI / 2)
    const rotationAngle = scrollPercentage * Math.PI / 2;

    console.log(rotationAngle)

    // // Rotate the rectangle along the x-axis
    soundbar.rotation.x = rotationAngle;

    // Render the scene again with the new rectangle rotation
    animate();
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
});