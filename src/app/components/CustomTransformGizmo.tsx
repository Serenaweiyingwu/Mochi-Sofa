import * as THREE from "three";

function createFlatArrow(
    color: number,
    axis: "x" | "y" | "z",
    distanceFromCenter: number
): THREE.Group {
    const group = new THREE.Group();
    group.name = `gizmoGroup_${axis}`;

    const shaftLength = 0.4;
    const shaftWidth = 0.15;
    const headLength = 0.15;
    const headWidth = 0.3;

    const shaftGeometry = new THREE.PlaneGeometry(shaftLength, shaftWidth);
    const headGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        -headLength / 2,  headWidth / 2, 0,
        headLength / 2,  0,             0,
        -headLength / 2, -headWidth / 2, 0
    ]);
    headGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 1.0,
    });

    const shaft = new THREE.Mesh(shaftGeometry, material);
    shaft.position.x = shaftLength / 2;

    const head = new THREE.Mesh(headGeometry, material);
    head.position.x = shaftLength + headLength / 2;

    const arrowGroup = new THREE.Group();
    arrowGroup.add(shaft, head);
    arrowGroup.name = `arrow_${axis}`;
    arrowGroup.userData.axis = axis;
    shaft.userData.axis = axis;
    head.userData.axis = axis;

    // Align arrow orientation
    switch (axis) {
        case "x":
            arrowGroup.rotation.x = -Math.PI / 2;
            arrowGroup.position.set(distanceFromCenter, 0.1, 0);
            break;
        case "z":
            arrowGroup.rotation.x = -Math.PI / 2;
            arrowGroup.rotation.z = -Math.PI / 2;
            arrowGroup.position.set(0, 0.1, distanceFromCenter);
            break;
        case "y":
            arrowGroup.rotation.set(0, 0, Math.PI / 2);
            arrowGroup.position.set(0, 3 * distanceFromCenter / 5, 0);
            break;
    }

    group.add(arrowGroup);
    group.userData.axis = axis;

    return group;
}

export function createCustomGizmo(target: THREE.Object3D): THREE.Group {
    const group = new THREE.Group();
    group.name = "customGizmo";

    const xArrow = createFlatArrow(0xff4f4f, "x", 1.3);
    const yArrow = createFlatArrow(0x4fc3f7, "y", 1.3);
    const zArrow = createFlatArrow(0x81c784, "z", 1.3);

    const ringGeometry = new THREE.RingGeometry(1.20, 1.30, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.6,
    });
    const yRing = new THREE.Mesh(ringGeometry, ringMaterial);
    yRing.name = "rotateY";
    yRing.position.y = 0.1;
    yRing.rotation.x = -Math.PI / 2;
    yRing.userData.axis = "rotateY";

    group.add(xArrow, yArrow, zArrow, yRing);
    group.userData.yArrow = yArrow;
    group.position.copy(target.position);

    group.renderOrder = 999;
    group.traverse(obj => {
        obj.renderOrder = 999;
        if ((obj as THREE.Mesh).material) {
            const mat = (obj as THREE.Mesh).material as THREE.Material;
            mat.depthTest = false;
            mat.depthWrite = false;
            mat.transparent = true;
            mat.opacity = 1.0;
        }
    });

    return group;
}
