// components/three/setupControls.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export default function ControlSetup(
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene
) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.mouseButtons = {
        LEFT: null as any,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.update();

    const translateControls = new TransformControls(camera, renderer.domElement);
    translateControls.setMode("translate");
    translateControls.setTranslationSnap(0.001);
    translateControls.space = "world";
    scene.add(translateControls.getHelper());

    const rotateControls = new TransformControls(camera, renderer.domElement);
    rotateControls.setMode("rotate");
    rotateControls.setRotationSnap(THREE.MathUtils.degToRad(15));
    rotateControls.showX = false;
    rotateControls.showY = true;
    rotateControls.showZ = false;
    rotateControls.space = "local";
    scene.add(rotateControls.getHelper());

    // Mutual locking
    translateControls.addEventListener("dragging-changed", (e) => {
        controls.enabled = !e.value;
        rotateControls.enabled = !e.value;
    });
    rotateControls.addEventListener("dragging-changed", (e) => {
        controls.enabled = !e.value;
        translateControls.enabled = !e.value;
    });

    return { controls, translateControls, rotateControls };
}