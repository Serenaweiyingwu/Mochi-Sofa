"use client";

import {useEffect, useRef} from "react";
import * as THREE from "three";
import {OBB} from "three/examples/jsm/math/OBB.js";
import initialize from "@/app/components/Initialization";
import ControlSetup from "@/app/components/ControlSetup";
import {checkCollision, updateOBBs} from "@/app/components/Collision";
import {createBackrest, loadGLB} from "@/app/components/CreateObjects";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { createCustomGizmo } from "@/app/components/CustomTransformGizmo";

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

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(container.clientWidth, container.clientHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0";
        labelRenderer.domElement.style.pointerEvents = "none";
        container.appendChild(labelRenderer.domElement);

        const {controls} = ControlSetup(camera, renderer, scene);

        const selectableObjects: THREE.Object3D[] = [];
        const obbs: { obb: OBB; helper: THREE.LineSegments; target: THREE.Object3D }[] = [];
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        let draggingAxis: "x" | "y" | "z" | null = null;
        let dragStartPoint = new THREE.Vector3();
        let dragStartObjectPosition = new THREE.Vector3();
        let isDragging = false;

        let currentSelectedObject: THREE.Object3D | null = null;

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);

            // Update gizmo position without rotation
            if (currentSelectedObject?.userData.customGizmo) {
                const gizmo = currentSelectedObject.userData.customGizmo;

                const bbox = new THREE.Box3().setFromObject(currentSelectedObject);
                const objectWorldPos = new THREE.Vector3();
                currentSelectedObject.getWorldPosition(objectWorldPos);

                gizmo.position.set(
                    objectWorldPos.x,
                    bbox.min.y, // align to object's bottom
                    objectWorldPos.z
                );


                gizmo.rotation.set(0, 0, 0); // do not inherit rotation

                const yArrow = gizmo.userData.yArrow as THREE.Object3D;
                if (yArrow) {
                    const gizmoWorldPos = new THREE.Vector3();
                    gizmo.getWorldPosition(gizmoWorldPos);

                    const cameraDir = new THREE.Vector3();
                    camera.getWorldPosition(cameraDir);
                    cameraDir.sub(gizmoWorldPos);
                    cameraDir.y = 0;
                    cameraDir.normalize();

                    const angle = Math.atan2(cameraDir.x, cameraDir.z);
                    yArrow.rotation.set(0, angle, 0);
                }
            }

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
        function addDeleteButton(target: THREE.Object3D) {
            const button = document.createElement("div");
            button.textContent = "✕";
            button.style.fontSize = "18px";
            button.style.color = "white";
            button.style.background = "rgba(255, 0, 0, 0.8)";
            button.style.borderRadius = "50%";
            button.style.width = "24px";
            button.style.height = "24px";
            button.style.textAlign = "center";
            button.style.lineHeight = "24px";
            button.style.cursor = "pointer";
            button.style.pointerEvents = "auto";
            button.style.userSelect = "none";

            const label = new CSS2DObject(button);
            label.position.set(0, 1.2, 0);
            target.add(label);

            if (!target.userData) target.userData = {};
            target.userData.deleteLabel = label;

            button.onclick = () => {

                if (target.userData.customGizmo) {
                    scene.remove(target.userData.customGizmo);
                    target.userData.customGizmo = null;
                }

                target.remove(label);
                target.userData.deleteLabel = null;
                target.userData.hasDeleteButton = false;

                scene.remove(target);

                const idx = selectableObjects.indexOf(target);
                if (idx > -1) selectableObjects.splice(idx, 1);

                target.traverse((child) => {
                    for (let i = obbs.length - 1; i >= 0; i--) {
                        if (obbs[i].target === child) {
                            scene.remove(obbs[i].helper);
                            obbs.splice(i, 1);
                        }
                    }
                });
            };
        }

        const onPointerDown = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            if (currentSelectedObject?.userData.customGizmo) {
                const gizmoHit = raycaster.intersectObject(currentSelectedObject.userData.customGizmo, true);

                if (gizmoHit.length > 0) {
                    const hit = gizmoHit[0];
                    const axis = hit.object?.userData?.axis;
                    if (axis === "x" || axis === "y" || axis === "z") {
                        controls.enabled = false;
                        draggingAxis = axis;
                        dragStartObjectPosition.copy(currentSelectedObject.position);
                        dragStartPoint.copy(hit.point);
                        isDragging = true;
                        return;
                    } else if (axis === "rotateY") {
                        controls.enabled = false;
                        draggingAxis = axis;
                        isDragging = true;
                        dragStartObjectPosition.copy(currentSelectedObject.position);
                        dragStartPoint.set(event.clientX, event.clientY, 0);
                        currentSelectedObject.userData.startRotationY = currentSelectedObject.rotation.y;
                        return;
                    }
                }
            }


            const intersects = raycaster.intersectObjects(selectableObjects, true);
            if (intersects.length > 0) {
                let root: THREE.Object3D = intersects[0].object;
                while (root.parent && !selectableObjects.includes(root)) {
                    root = root.parent;
                }

                if (selectableObjects.includes(root)) {

                    if (currentSelectedObject === root) return;

                    if (currentSelectedObject && currentSelectedObject !== root) {
                        const oldGizmo = currentSelectedObject.userData.customGizmo;
                        if (oldGizmo) scene.remove(oldGizmo);
                        currentSelectedObject.userData.customGizmo = null;

                        if (currentSelectedObject.userData.deleteLabel) {
                            currentSelectedObject.remove(currentSelectedObject.userData.deleteLabel);
                            currentSelectedObject.userData.deleteLabel = null;
                            currentSelectedObject.userData.hasDeleteButton = false;
                        }
                    }

                    currentSelectedObject = root;
                    if (!root.userData) root.userData = {};

                    if (!root.userData.hasDeleteButton) {
                        addDeleteButton(root);
                        root.userData.hasDeleteButton = true;
                    }

                    const existingGizmo = root.userData.customGizmo;
                    if (existingGizmo) scene.remove(existingGizmo);

                    const customGizmo = createCustomGizmo(root);
                    customGizmo.name = "customGizmo";
                    scene.add(customGizmo);
                    root.userData.customGizmo = customGizmo;

                    return;
                }
            }

            // translateControls.detach();
            // rotateControls.detach();

            if (currentSelectedObject) {
                const label = currentSelectedObject.children.find(child => child instanceof CSS2DObject);
                if (label) {
                    currentSelectedObject.remove(label);
                    currentSelectedObject.userData.hasDeleteButton = false;
                }

                const gizmo = currentSelectedObject.userData.customGizmo;
                if (gizmo) {
                    scene.remove(gizmo);
                    currentSelectedObject.userData.customGizmo = null;
                }

                currentSelectedObject = null;
            }
        };

        const onDragMove = (event: MouseEvent) => {
            if (!draggingAxis || !currentSelectedObject) return;

            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const plane = new THREE.Plane();
            const axisVector = new THREE.Vector3();

            if (draggingAxis === "rotateY") {
                const deltaX = event.clientX - dragStartPoint.x;
                const rotationSpeed = 0.01;
                const rawAngle = currentSelectedObject.userData.startRotationY + deltaX * rotationSpeed;

                const snapIncrement = THREE.MathUtils.degToRad(15);
                const snappedAngle = Math.round(rawAngle / snapIncrement) * snapIncrement;

                const prevRotationY = currentSelectedObject.rotation.y;
                currentSelectedObject.rotation.y = snappedAngle;
                currentSelectedObject.updateMatrixWorld(true);

                if (checkCollision(currentSelectedObject, obbs)) {
                    currentSelectedObject.rotation.y = prevRotationY;
                } else {
                    updateOBBs(obbs);
                }

                return;
            }

            switch (draggingAxis) {
                case "x":
                    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), currentSelectedObject.position);
                    axisVector.set(1, 0, 0);
                    break;
                case "y":
                    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), currentSelectedObject.position);
                    axisVector.set(0, 1, 0);
                    break;
                case "z":
                    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(1, 0, 0), currentSelectedObject.position);
                    axisVector.set(0, 0, 1);
                    break;
                default:
                    return;
            }

            const intersectPoint = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, intersectPoint);

            const delta = new THREE.Vector3().subVectors(intersectPoint, dragStartPoint);
            const snapUnit = 0.01;
            const snappedDelta = Math.round(delta.dot(axisVector) / snapUnit) * snapUnit;

            const newPosition = dragStartObjectPosition.clone().addScaledVector(axisVector, snappedDelta);

            if (!newPosition.equals(currentSelectedObject.position)) {
                const prevPosition = currentSelectedObject.position.clone();
                currentSelectedObject.position.copy(newPosition);
                currentSelectedObject.updateMatrixWorld(true);

                if (checkCollision(currentSelectedObject, obbs)) {
                    currentSelectedObject.position.copy(prevPosition);
                } else {
                    updateOBBs(obbs);
                }
            }
        };

        const onPointerUp = () => {
            draggingAxis = null;
            controls.enabled = true;
            delete currentSelectedObject?.userData.startRotationY;
        };


        renderer.domElement.addEventListener("click", onClick);
        renderer.domElement.addEventListener("pointerdown", onPointerDown);
        renderer.domElement.addEventListener("pointerup", onPointerUp);
        renderer.domElement.addEventListener("pointermove", (e) => {
            if (draggingAxis) {
                onDragMove(e);
            } else {
                onPointerMove(e);
            }
        });


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
            renderer.domElement.removeEventListener("pointermove", onDragMove);
            renderer.domElement.removeEventListener("pointerup", onPointerUp);
        };
    }, [onSceneReady]);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
