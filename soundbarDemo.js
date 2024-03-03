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
    // map: carbonFiberTexture, // Comment this out if you don't want a carbon fiber texture
    transparent: true,
    opacity: 0.7
});

const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, // White wireframe color
    wireframe: true // Enable wireframe mode
});

const soundbar = new THREE.Group();
const objectMesh = new THREE.Mesh(geometry, material);
const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
soundbar.add(objectMesh, wireframeMesh);
scene.add(soundbar);

const initialX = 0.5;
soundbar.rotation.x = initialX;

camera.position.set(0, 4, 0);
camera.lookAt(soundbar.position);


const fadeDivs = document.querySelectorAll('.fade-div');
const fadeIntervalHeight = 1 / (fadeDivs.length + 1);

// Function to create circles
function createCircle(radius, color) {
    const geometry = new THREE.CircleGeometry(radius, 32);
    const material = new THREE.MeshBasicMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

// Create circles
const circle1 = createCircle(0.5, 0xff0000); // Red circle
const circle2 = createCircle(0.5, 0x0000ff); // Blue circle
const circle3 = createCircle(0.5, 0x00ff00); // Green circle
const circle4 = createCircle(0.5, 0xffff00); // Yellow circle

// Position circles at the bottom of the rectangle
circle1.position.set(-1, -0.75, 0);
circle2.position.set(-0.5, -0.75, 0);
circle3.position.set(0.5, -0.75, 0);
circle4.position.set(1, -0.75, 0);
scene.add(circle1);
scene.add(circle2);
scene.add(circle3);
scene.add(circle4);


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();


window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollY / maxScroll;

    const rotationAngle = scrollPercentage * Math.PI / 2;
    soundbar.rotation.x = initialX - rotationAngle;

    camera.position.set(0, 4 - scrollPercentage, 0);

    const panDistance = scrollPercentage * 2;
    camera.position.x = panDistance;

    const lookAtPosition = new THREE.Vector3(panDistance, soundbar.position.y, soundbar.position.z);
    camera.lookAt(lookAtPosition);

    animate();

    fadeDivs.forEach((div, index) => {
        const startRange = index * fadeIntervalHeight;
        const endRange = (index + 1) * fadeIntervalHeight;
        const opacity = scrollPercentage >= startRange && scrollPercentage <= endRange ? 1 : 0;
        div.style.opacity = opacity;
    });

    if (scrollPercentage === 1) {
        scene.add(circle1);
        scene.add(circle2);
        scene.add(circle3);
        scene.add(circle4);
    } 
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
});
