import * as THREE from "three";
import { OBB } from "three/examples/jsm/math/OBB.js";

export function checkCollision(
    moving: THREE.Object3D,
    obbs: { obb: OBB; target: THREE.Object3D }[]
): boolean {
    const obbsToCheck: OBB[] = [];
    const selfMeshes = new Set<THREE.Object3D>();

    moving.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
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
                console.log('collision detected');
                return true;
            }
        }
    }

    return false;
}

export function updateOBBs(
    obbs: { obb: OBB; helper: THREE.LineSegments; target: THREE.Object3D }[]
) {
    for (const entry of obbs) {
        const object = entry.target;
        const geometry = (object as THREE.Mesh).geometry;
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
}