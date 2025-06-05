declare module 'three/examples/jsm/renderers/CSS2DRenderer' {
    import { Object3D, Camera, Scene } from 'three';

    export class CSS2DRenderer {
        domElement: HTMLElement;
        setSize(width: number, height: number): void;
        render(scene: Scene, camera: Camera): void;
    }

    export class CSS2DObject extends Object3D {
        constructor(element: HTMLElement);
    }
}