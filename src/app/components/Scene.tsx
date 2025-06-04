"use client";

import {useEffect, useRef} from "react";
import * as THREE from "three";
import {OBB} from "three/examples/jsm/math/OBB.js";
import initialize from "@/app/components/Initialization";
import ControlSetup from "@/app/components/ControlSetup";
import {checkCollision, updateOBBs} from "@/app/components/Collision";
import {createBackrest, loadGLB} from "@/app/components/CreateObjects";

type SceneProps = {
    onSceneReady?: (api: {
        startPlacingBackrest: (selectedColor: string) => void;
        startPlacingSeat: (selectedColor: string) => void;
    }) => void;
};

export default function Scene({ onSceneReady}: SceneProps){
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let scene = new THREE.Scene();
        // camera setting
        const camera = new THREE.PerspectiveCamera(25, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(1, 1, 2);



        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance"
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor("#f0f0f0");

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.6;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Additional renderer settings to prevent wireframe artifacts
        renderer.sortObjects = true;
        renderer.autoClear = true;
        renderer.autoClearColor = true;
        renderer.autoClearDepth = true;
        renderer.autoClearStencil = true;

        container.appendChild(renderer.domElement);
        scene = initialize(scene, renderer);
        const {controls, translateControls, rotateControls} = ControlSetup(camera, renderer, scene);

        const selectableObjects: THREE.Object3D[] = [];
        const obbs: { obb: OBB; helper: THREE.LineSegments; target: THREE.Object3D }[] = [];
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        let lastPosition = new THREE.Vector3();
        let currentPosition = new THREE.Vector3();
        let lastRotation = new THREE.Euler();
        let currentRotation = new THREE.Euler();

        translateControls.addEventListener("mouseDown", () => {
            if (translateControls.object) {
                lastPosition.copy(translateControls.object.position);
            }
        });

        translateControls.addEventListener("objectChange", () => {
            const obj = translateControls.object;
            if (!obj) return;

            currentPosition.copy(obj.position);

            // 临时更新以计算矩阵
            obj.updateMatrixWorld(true);

            if (checkCollision(obj, obbs)) {
                // 回退到上一次合法位置
                obj.position.copy(lastPosition);
            } else {
                // 合法，更新最后位置
                lastPosition.copy(currentPosition);
            }

            obj.updateMatrixWorld(true);
            updateOBBs(obbs);
        });

        rotateControls.addEventListener("mouseDown", () => {
            if (rotateControls.object) {
                lastRotation.copy(rotateControls.object.rotation);
            }
        });

        rotateControls.addEventListener("objectChange", () => {
            const obj = rotateControls.object;
            if (!obj) return;

            currentRotation.copy(obj.rotation);

            obj.updateMatrixWorld(true);

            if (checkCollision(obj, obbs)) {
                obj.rotation.copy(lastRotation);
            } else {
                lastRotation.copy(currentRotation);
            }

            obj.updateMatrixWorld(true);
            updateOBBs(obbs);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        let isPlacing = false;
        let placingBox: THREE.Object3D | null = null;
        let placingYOffset = 0;

        const interactionPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        interactionPlane.rotation.x = -Math.PI / 2;
        scene.add(interactionPlane);

        const onPointerMove = (event: MouseEvent) => {
            if (!isPlacing || !placingBox) return;
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(interactionPlane);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                const snap = 0.001;
                const snappedX = Math.round(point.x / snap) * snap;
                const snappedZ = Math.round(point.z / snap) * snap;
                placingBox.position.set(snappedX, placingYOffset, snappedZ);
            }
        };

        const onClick = () => {
            if (!isPlacing || !placingBox) return;
            if (checkCollision(placingBox, obbs)) {
                scene.remove(placingBox);
                placingBox = null;
                isPlacing = false;
                return;
            }

            placingBox.traverse((child) => {
                if ((child as THREE.Mesh).geometry) {
                    const mesh = child as THREE.Mesh;
                    const geometry = mesh.geometry;
                    if (!geometry.boundingBox) geometry.computeBoundingBox();
                    if (!geometry.boundingBox) return;

                    const halfSize = new THREE.Vector3();
                    geometry.boundingBox.getSize(halfSize).multiplyScalar(0.5);

                    const obb = new OBB();
                    obb.center.set(0, 0, 0);
                    obb.halfSize.copy(halfSize);
                    obb.rotation.identity();
                    mesh.updateMatrixWorld(true);
                    obb.applyMatrix4(mesh.matrixWorld);

                    const helper = new THREE.LineSegments(
                        new THREE.EdgesGeometry(geometry),
                        new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
                    );
                    helper.matrixAutoUpdate = false;
                    helper.matrix.copy(mesh.matrixWorld);
                    helper.visible = false; //bounding box visualization
                    scene.add(helper);


                    obbs.push({ obb, helper, target: mesh });
                }
            });

            selectableObjects.push(placingBox);
            placingBox = null;
            isPlacing = false;
        };

        const onPointerDown = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(selectableObjects, true);

            if (intersects.length > 0) {
                let root: THREE.Object3D = intersects[0].object;
                while (root.parent && !selectableObjects.includes(root)) {
                    root = root.parent;
                }

                if (selectableObjects.includes(root)) {
                    translateControls.attach(root);
                    rotateControls.attach(root);
                } else {
                    translateControls.detach();
                    rotateControls.detach();
                }
            } else {
                translateControls.detach();
                rotateControls.detach();
            }
        };

        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("click", onClick);
        renderer.domElement.addEventListener("pointerdown", onPointerDown);


        onSceneReady?.({
            startPlacingSeat: async (selectedColor) => {
                const selectedColorName = selectedColor.replace(/\s+/g, "_");
                console.log(`/textures/Cushion/${selectedColorName}`);
                const seat = await loadGLB(
                    "/models/meshes/Cushion.glb",
                    `/textures/Cushion/${selectedColorName}`,   // basePath
                    "Cushion"                      // texturePrefix
                );

                seat.position.y = 0.35;
                scene.add(seat);
                placingBox = seat;
                placingYOffset = 0.35;
                isPlacing = true;
            },
            startPlacingBackrest: async (selectedColor) => {
                const selectedColorName = selectedColor.replace(/\s+/g, "_");
                const {object, yOffset} = await createBackrest(selectedColorName);
                object.position.y = yOffset;
                scene.add(object);
                placingBox = object;
                placingYOffset = yOffset;
                isPlacing = true;
            },
        });

        return () => {
            renderer.dispose();
            container.removeChild(renderer.domElement);
            renderer.domElement.removeEventListener("pointermove", onPointerMove);
            renderer.domElement.removeEventListener("click", onClick);
            renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        };
    }, [onSceneReady]);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
