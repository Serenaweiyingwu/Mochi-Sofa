import * as THREE from "three";

export default function initialize(scene: THREE.Scene, renderer: THREE.WebGLRenderer): THREE.Scene {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.08);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;

    directionalLight.intensity = 1.0;
    directionalLight.shadow.bias = -0.001;

    directionalLight.shadow.radius = 1;

    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x8bb7f0, 0.25);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    const envTexture = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTexture;

    const grid = new THREE.GridHelper(5, 20, 0x888888, 0xcccccc);
    grid.material.opacity = 0.4;
    grid.material.transparent = true;
    scene.add(grid);

    return scene;
}