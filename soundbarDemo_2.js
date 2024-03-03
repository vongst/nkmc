import * as THREE from 'https://cdn.jsdelivr.net/npm/three/build/three.module.js';

// Constants for easy adjustments
const initialCameraPosition = { x: 0, y: 4, z: 0 };
const sceneBackgroundColor = 0xe0e0e0;
const soundbarRotationInitialX = 0.5;

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
let soundwave; // Declare soundwave here for global access

setupScene();
const { soundbar, fadeDivs } = createObjects();
requestAnimationFrame(animate); // Start the animation loop

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
    
    const soundbar = createSoundbar();
    scene.add(soundbar);
    
    const colors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00];
    colors.forEach((color, index) => {
        const circle = createCircle(0.5, color);
        circle.position.set(index - 1.5, -0.75, 0);
        scene.add(circle);
    });

    const fadeDivs = document.querySelectorAll('.fade-div');
    soundwave = createSoundwave(); // Initialize soundwave
    return { soundbar, fadeDivs };
}

function createSoundbar() {
    const geometry = new THREE.BoxGeometry(5, 1, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x010101, transparent: true, opacity: 0.7 });
    const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    const soundbar = new THREE.Group();
    soundbar.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, wireframeMaterial));
    soundbar.rotation.x = soundbarRotationInitialX;
    return soundbar;
}

function createCircle(radius, color) {
    const geometry = new THREE.CircleGeometry(radius, 32);
    const material = new THREE.MeshBasicMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

function createSoundwave() {
    const soundwaveGeometry = new THREE.PlaneGeometry(5, 1, 100, 1);
    const soundwaveMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
    const soundwave = new THREE.Mesh(soundwaveGeometry, soundwaveMaterial);
    soundwave.position.set(0, -2, 0);
    scene.add(soundwave);
    return soundwave;
}

window.addEventListener('scroll', () => handleScroll(soundbar, fadeDivs));
window.addEventListener('resize', handleResize);

function handleScroll(soundbar, fadeDivs) {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollY / maxScroll;
    updateSceneBasedOnScroll(soundbar, scrollPercentage);
    updateFadeDivs(fadeDivs, scrollPercentage);
}

function updateSceneBasedOnScroll(soundbar, scrollPercentage) {
    if (scrollPercentage <= 0.6) {
        const rotationAngle = scrollPercentage * Math.PI / 2;
        soundbar.rotation.x = soundbarRotationInitialX - rotationAngle;
        
        const panDistance = scrollPercentage * 2;
        camera.position.set(panDistance, 4 - scrollPercentage, camera.position.z);
        camera.lookAt(panDistance, soundbar.position.y, soundbar.position.z);
    } else {
        // Start or continue soundwave animation based on scroll position
        animateSoundwave();
    }
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
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function animateSoundwave() {
    const time = Date.now() * 0.001; // Current time for dynamic animation
    soundwave.geometry.vertices.forEach((vertex, i) => {
        vertex.z = Math.sin(i / 5 + (time * 5)) * 0.5;
    });
    soundwave.geometry.verticesNeedUpdate = true;
}
