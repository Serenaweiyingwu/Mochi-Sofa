import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
// @ts-expect-error: OrbitControls does not have proper TypeScript definitions
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-expect-error: OrbitControls does not have proper TypeScript definitions
import {mergeVertices} from "three/examples/jsm/utils/BufferGeometryUtils";
export async function createBackrest(color: string): Promise<{ object: THREE.Group; yOffset: number}> {
    const group = new THREE.Group();

    const pillow = await loadGLB(
        "/models/meshes/Pillow.glb",
        `/textures/Pillow/${color}`,   // basePath
        "Pillow"                      // texturePrefix
    );
    pillow.rotation.x = Math.PI * 5/ 12;
    pillow.position.set(0, 0.3, 0.3);
    group.add(pillow);

    const armrest = await loadGLB(
        "/models/meshes/Armrest.glb",
        `/textures/Armrest/${color}`,   // basePath
        "Armrest"                      // texturePrefix
    );
    armrest.position.set(0, 0, 0);
    group.add(armrest);

    return {object: group, yOffset: 0.93};
}

export async function loadGLB(
    glbPath: string,
    textureBasePath: string,
    texturePrefix: string
): Promise<THREE.Group> {
    const textures = await loadTextures(textureBasePath, texturePrefix);
    const material = createPBRMaterial(textures);

    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            glbPath,
            (gltf: GLTF) => {
          const model: THREE.Group = gltf.scene;

          // Apply material and geometry smoothing
          model.traverse((child: THREE.Object3D) => {
              if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;

            // Apply material
            if (mesh.material && (mesh.material as THREE.Material).dispose) {
                (mesh.material as THREE.Material).dispose();
            }
            mesh.material = material;
            mesh.material.needsUpdate = true;

            // Enable shadows
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Geometry smoothing
            const geometry: THREE.BufferGeometry | undefined = mesh.geometry;
            if (geometry) {
                geometry.computeVertexNormals();

                if (geometry.attributes.uv) {
              geometry.computeTangents?.();
                }

                if (!geometry.index && mergeVertices) {
              const indexed: THREE.BufferGeometry = mergeVertices(geometry);
              if (indexed !== geometry) {
                  geometry.dispose();
                  mesh.geometry = indexed;
                  indexed.computeVertexNormals();
              }
                }
            }
              }
          });

          // Center model
          const box: THREE.Box3 = new THREE.Box3().setFromObject(model);
          const center: THREE.Vector3 = box.getCenter(new THREE.Vector3());
          const size: THREE.Vector3 = box.getSize(new THREE.Vector3());
          model.position.sub(center);

          // Scale to fit in view if too large
          const maxDim: number = Math.max(size.x, size.y, size.z);
          if (maxDim > 5) {
              const scale: number = 5 / maxDim;
              model.scale.setScalar(scale);
          }

          resolve(model);
            },
            undefined,
            (error: ErrorEvent) => {
          console.error("Error loading GLB model:", error);
          reject(error);
            }
        );
    });
}


export async function loadTextures(basePath: string, prefix: string): Promise<Record<string, THREE.Texture>> {
    const loader = new THREE.TextureLoader();

    const load = (name: string) =>
        new Promise<THREE.Texture>((resolve, reject) =>
            loader.load(`models/${basePath}/${prefix}_${name}.png`, resolve, undefined, reject)
        );

    const textures: Record<string, THREE.Texture> = {};

    textures.baseColor = await load("BaseColor");
    textures.baseColor.colorSpace = THREE.SRGBColorSpace;
    textures.baseColor.flipY = false;

    textures.normal = await load("Normal");
    textures.normal.flipY = false;

    textures.roughness = await load("Roughness");
    textures.roughness.flipY = false;

    textures.metallic = await load("Metallic");
    textures.metallic.flipY = false;

    textures.alpha = await load("Alpha");
    textures.alpha.flipY = false;

    textures.emission = await load("Emission");
    textures.emission.colorSpace = THREE.SRGBColorSpace;
    textures.emission.flipY = false;

    Object.values(textures).forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
    });

    return textures;
}

export function createPBRMaterial(textures: Record<string, THREE.Texture>): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        map: textures.baseColor,
        normalMap: textures.normal,
        normalScale: new THREE.Vector2(0.5, 0.5),
        roughnessMap: textures.roughness,
        roughness: 0.9,
        metalnessMap: textures.metallic,
        metalness: 0.6,
        alphaMap: textures.alpha,
        transparent: true,
        alphaTest: 0.1,
        emissiveMap: textures.emission,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.3,
        side: THREE.FrontSide,
        shadowSide: THREE.FrontSide,
        wireframe: false,
        flatShading: false,
        polygonOffset: true,
        polygonOffsetFactor: 2,
        polygonOffsetUnits: 2,
        dithering: true,
        premultipliedAlpha: false,
        envMapIntensity: 0.3
    });
}