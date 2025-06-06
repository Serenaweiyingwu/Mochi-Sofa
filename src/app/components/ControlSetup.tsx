// components/three/setupControls.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export default function ControlSetup(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.mouseButtons = {
        LEFT: null,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.update();


    return { controls };
}