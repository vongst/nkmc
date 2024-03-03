import * as THREE from 'https://cdn.jsdelivr.net/npm/three/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

// Constants
const initialCameraYZoom = 3.2
const initialCameraPosition = { x: 0, y: initialCameraYZoom, z: 0 };
const sceneBackgroundColor = 0x111111;
const soundbarRotationInitialX = 0.5;

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

setupScene();
const { soundbar, fadeDivs } = createObjects();
animate();

window.addEventListener('scroll', handleScroll.bind(null, soundbar, fadeDivs));
window.addEventListener('resize', handleResize);

function setupScene() {
    scene.background = new THREE.Color(sceneBackgroundColor);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.set(...Object.values(initialCameraPosition));
    camera.lookAt(0, 0, 0);
}

function createObjects() {
    const textureLoader = new THREE.TextureLoader();
    const carbonFiberTexture = textureLoader.load('carbon_fibre.jpg');
    
    // Soundbar creation
    const soundbar = createSoundbar(carbonFiberTexture);
    scene.add(soundbar);
    
    // Circle creation
    const colors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00]; // Red, Blue, Green, Yellow
    colors.forEach((color, index) => {
        const circle = createCircle(0.5, color);
        circle.position.set(index - 1.5, -0.75, 0); // Adjust position based on index
        scene.add(circle);
    });

    const fadeDivs = document.querySelectorAll('.fade-div');
    
    return { soundbar, fadeDivs };
}

function createSoundbar(texture) {
    const geometry = new THREE.BoxGeometry(5, 1, 0.5);
    const material = new THREE.MeshBasicMaterial({
        color: 0x010101,
        transparent: true,
        opacity: 0.7,
        // map: texture, // Uncomment to use texture
    });
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
    });
    const soundbar = new THREE.Group();
    soundbar.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, wireframeMaterial));
    soundbar.rotation.x = soundbarRotationInitialX;
    return soundbar;
}

function createCircle(radius, color) {
    const geometry = new THREE.CircleGeometry(radius, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
}

function handleScroll(soundbar, fadeDivs) {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollY / maxScroll;
    updateSceneBasedOnScroll(soundbar, scrollPercentage);
    updateFadeDivs(fadeDivs, scrollPercentage);
}

function updateSceneBasedOnScroll(soundbar, scrollPercentage) {
    const rotationAngle = scrollPercentage * Math.PI / 2;
    soundbar.rotation.x = soundbarRotationInitialX - rotationAngle;
    
    const panDistance = Math.min(scrollPercentage * 3, 2.5);
    camera.position.set(panDistance, initialCameraYZoom - scrollPercentage, camera.position.z);
    camera.lookAt(panDistance, soundbar.position.y, soundbar.position.z);
    
    animate();
}

function updateFadeDivs(fadeDivs, scrollPercentage) {
    const fadeIntervalHeight = 1 / fadeDivs.length;
    fadeDivs.forEach((div, index) => {
        const startRange = index * fadeIntervalHeight;
        const endRange = (index + 1) * fadeIntervalHeight;
        div.style.opacity = scrollPercentage >= startRange && scrollPercentage <= endRange ? 1 : 0;
    });
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
