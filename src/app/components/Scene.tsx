"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Group } from "three";
import { OBB } from "three/examples/jsm/math/OBB.js";

export default function Scene({
                                  onSceneReady,
                              }: {
    onSceneReady?: (api: {
        startPlacingBackrest: () => void;
        startPlacingSeat: () => void;
    }) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(1, 1, 2);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor("#fdf8f4");
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(2, 2, 2);
        scene.add(pointLight);

        const grid = new THREE.GridHelper(5, 20, 0x888888, 0xcccccc);
        grid.material.opacity = 0.4;
        grid.material.transparent = true;
        scene.add(grid);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
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

        translateControls.addEventListener("dragging-changed", (e) => {
            controls.enabled = !e.value;
            rotateControls.enabled = !e.value;
        });
        rotateControls.addEventListener("dragging-changed", (e) => {
            controls.enabled = !e.value;
            translateControls.enabled = !e.value;
        });

        const selectableObjects: THREE.Object3D[] = [];
        const obbs: { obb: OBB; helper: THREE.LineSegments; target: THREE.Object3D }[] = [];
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const checkCollision = (moving: THREE.Object3D): boolean => {
            const obbsToCheck: OBB[] = [];
            const selfMeshes = new Set<THREE.Object3D>();

            moving.traverse((child) => {
                if ((child as any).geometry) {
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
                    obbsToCheck.push(obb);

                    selfMeshes.add(mesh);
                }
            });

            for (const testOBB of obbsToCheck) {
                for (const target of obbs) {
                    if (selfMeshes.has(target.target)) continue;
                    if (testOBB.intersectsOBB(target.obb)) {
                        console.log("collision detected");
                        console.log(testOBB);
                        console.log(target.obb);
                        return true;
                    }
                }
            }

            return false;
        };

        const updateOBBs = () => {
            for (const entry of obbs) {
                const object = entry.target;
                const geometry = (object as any).geometry;
                if (!geometry || !geometry.boundingBox) geometry?.computeBoundingBox();
                if (!geometry?.boundingBox) continue;

                const halfSize = new THREE.Vector3();
                geometry.boundingBox.getSize(halfSize).multiplyScalar(0.5);

                const obb = new OBB();
                obb.center.set(0, 0, 0);
                obb.halfSize.copy(halfSize);
                obb.rotation.identity();
                object.updateMatrixWorld(true);
                obb.applyMatrix4(object.matrixWorld);

                entry.obb.copy(obb);
                entry.helper.matrix.copy(object.matrixWorld);
                entry.helper.matrixAutoUpdate = false;
            }
        };

        let lastValidPosition = new THREE.Vector3();
        let lastValidRotation = new THREE.Euler();

        translateControls.addEventListener("mouseDown", () => {
            if (translateControls.object) lastValidPosition.copy(translateControls.object.position);
        });

        translateControls.addEventListener("objectChange", () => {
            const obj = translateControls.object;
            if (obj) {
                if (!checkCollision(obj)) {
                    lastValidPosition.copy(obj.position);
                } else {
                    console.log(obj.position);
                    console.log(lastValidPosition);
                    obj.position.copy(lastValidPosition);

                }
                obj.updateMatrixWorld(true);
            }
            updateOBBs();
        });

        rotateControls.addEventListener("mouseDown", () => {
            if (rotateControls.object) lastValidRotation.copy(rotateControls.object.rotation);
        });

        rotateControls.addEventListener("objectChange", () => {
            const obj = rotateControls.object;
            if (obj) {
                if (!checkCollision(obj)) {
                    lastValidRotation.copy(obj.rotation);
                } else {
                    obj.rotation.copy(lastValidRotation);
                }
                obj.updateMatrixWorld(true);
            }
            updateOBBs();
        });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        let isPlacing = false;
        let placingBox: Group = null;
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
            if (checkCollision(placingBox)) {
                scene.remove(placingBox);
                placingBox = null;
                isPlacing = false;
                return;
            }

            placingBox.traverse((child) => {
                if ((child as any).geometry) {
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
                        new THREE.LineBasicMaterial({ color: 0xff0000 })
                    );
                    helper.matrixAutoUpdate = false;
                    helper.matrix.copy(mesh.matrixWorld);
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
                const target = intersects[0].object;
                const root = target.parent?.type === "Group" ? target.parent : target;
                translateControls.attach(root);
                rotateControls.attach(root);
            } else {
                translateControls.detach();
                rotateControls.detach();
            }
        };

        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("click", onClick);
        renderer.domElement.addEventListener("pointerdown", onPointerDown);

        function createBackrest(): { object: THREE.Group; yOffset: number } {
            const group = new THREE.Group();

            const box = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.1, 0.5),
                new THREE.MeshStandardMaterial({ color: 0xb0c4de })
            );
            box.rotation.x = Math.PI / 4;
            box.position.set(0, 0.21, 0.06);
            group.add(box);

            const radius = 0.085;
            const length = 0.51;
            const cylinder = new THREE.Mesh(
                new THREE.CylinderGeometry(radius, radius, length, 32),
                new THREE.MeshStandardMaterial({ color: 0x8fbc8f })
            );
            cylinder.rotation.z = Math.PI / 2;
            cylinder.position.set(0, radius, 0);
            group.add(cylinder);

            return {
                object: group,
                yOffset: 0.38,
            };
        }

        onSceneReady?.({
            startPlacingSeat: () => {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(0.85, 0.38, 0.85),
                    new THREE.MeshStandardMaterial({ color: 0xffcc99 })
                );
                mesh.position.y = 0.19;
                scene.add(mesh);
                placingBox = mesh;
                placingYOffset = 0.19;
                isPlacing = true;
            },
            startPlacingBackrest: () => {
                const { object, yOffset } = createBackrest();
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
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
