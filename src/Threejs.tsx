import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useEffect, useRef, useState } from "react";

type MyThreeProps = {
  mineralName?: string;
  filePath?: string;
};

// A helper type describing a material that may contain texture map properties
// keyed by strings. This lets us index the material safely for disposal.
type MaterialWithMaps = THREE.Material & {
  [key: string]: THREE.Texture | undefined;
};

function disposeMaterial(mat: THREE.Material | THREE.Material[] | null) {
  if (!mat) return;
  if (Array.isArray(mat)) return mat.forEach((m) => disposeMaterial(m));
  // Treat material as a loose record with possible texture properties.
  const m = mat as MaterialWithMaps;
  const texKeys = [
    "map",
    "alphaMap",
    "aoMap",
    "emissiveMap",
    "bumpMap",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "displacementMap",
    "envMap",
  ];
  texKeys.forEach((k) => {
    const tex = m[k] as THREE.Texture | undefined;
    if (tex && typeof tex.dispose === "function") tex.dispose();
  });
  mat.dispose();
}

function disposeNode(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh) {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) disposeMaterial(mesh.material as THREE.Material);
    }
  });
}

function normalizeModelScale(
  object: THREE.Object3D<THREE.Object3DEventMap>,
  targetSize = 1
) {
  // 1. Compute the model's bounding box
  const box = new THREE.Box3().setFromObject(object);

  // 2. Calculate the dimensions (size) of the bounding box
  const size = new THREE.Vector3();
  box.getSize(size); // stores the dimensions in the 'size' vector

  // 3. Determine the maximum dimension
  const maxDimension = Math.max(size.x, size.y, size.z);

  // 4. Calculate the scale factor
  if (maxDimension === 0) return; // Avoid division by zero
  const scaleFactor = targetSize / maxDimension;

  // 5. Apply the uniform scale factor to the object
  object.scale.set(scaleFactor, scaleFactor, scaleFactor);

  // Optional: Recenter the model to the origin (0,0,0) after scaling
  const center = new THREE.Vector3();
  box.getCenter(center);
  object.position.sub(center.multiplyScalar(scaleFactor));
}

function MyThree({ mineralName }: MyThreeProps) {
  const refContainer = useRef<HTMLDivElement | null>(null);
  const currentModelRef = useRef<THREE.Object3D | null>(null);
  const mountedRef = useRef(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const initialCameraRef = useRef<THREE.Vector3 | null>(null);
  const initialTargetRef = useRef<THREE.Vector3 | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);

  // UI handlers that operate on the controls ref
  const toggleAutoRotate = () => {
    const c = controlsRef.current;
    if (!c) return;
    c.autoRotate = !c.autoRotate;
    setAutoRotate(c.autoRotate);
  };

  const resetView = () => {
    const cam = cameraRef.current;
    const c = controlsRef.current;
    if (!cam || !c) return;
    if (initialCameraRef.current) cam.position.copy(initialCameraRef.current);
    if (initialTargetRef.current) c.target.copy(initialTargetRef.current);
    c.update();
  };

  const zoom = (delta: number) => {
    const cam = cameraRef.current;
    const c = controlsRef.current;
    if (!cam || !c) return;
    const dir = c.target.clone().sub(cam.position).normalize();
    cam.position.add(dir.multiplyScalar(delta));
    c.update();
  };

  useEffect(() => {
    mountedRef.current = true;
    const modelUrl = `${
      import.meta.env.BASE_URL
    }models/${mineralName?.toLowerCase()}/scene.gltf`;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    const container = refContainer.current as HTMLDivElement | null;

    const controls = new OrbitControls(camera, renderer.domElement);

    // Try to size to the container; if it's not laid out yet or has 0 size,
    // fall back to a window-based size so the canvas remains visible.
    const rect = container?.getBoundingClientRect();
    const width = rect && rect.width > 0 ? rect.width : window.innerWidth;
    const height = rect && rect.height > 0 ? rect.height : window.innerHeight;
    renderer.setSize(width, height);

    if (container) {
      container.appendChild(renderer.domElement);
    }

    // Ensure camera aspect matches initial size
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Resize handler to keep canvas visible if window or container changes
    const handleResize = () => {
      const r = container?.getBoundingClientRect();
      const w = r && r.width > 0 ? r.width : window.innerWidth;
      const h = r && r.height > 0 ? r.height : window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // store refs so UI handlers can access them
    controlsRef.current = controls;
    cameraRef.current = camera;
    initialCameraRef.current = camera.position.clone();
    initialTargetRef.current = controls.target.clone();

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (!mountedRef.current) {
          // Component unmounted before model loaded
          disposeNode(gltf.scene);
          return;
        }

        // Dispose and remove previous model immediately BEFORE adding the new one
        if (currentModelRef.current) {
          scene.remove(currentModelRef.current);
          disposeNode(currentModelRef.current);
          currentModelRef.current = null;
        }

        currentModelRef.current = gltf.scene;
        normalizeModelScale(currentModelRef.current, 5);

        scene.add(gltf.scene);
      },
      (xhr) => {
        // Called while loading is progressing
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        // Called when loading has errors
        console.error("Error loading glTF model:", error);
      }
    );

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5).normalize();
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      // update controls for damping and auto-rotate
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup to prevent duplicate canvases/animations (React StrictMode double mount in dev)
    return () => {
      try {
        renderer.dispose();

        // mark unmounted so late loader callbacks don't add models
        mountedRef.current = false;

        // remove and dispose current model if any
        if (currentModelRef.current) {
          scene.remove(currentModelRef.current);
          disposeNode(currentModelRef.current);
          currentModelRef.current = null;
        }
        if (controlsRef.current) {
          try {
            controlsRef.current.dispose();
          } catch {
            // ignore
          }
          controlsRef.current = null;
        }
      } catch {
        // ignore dispose errors
      }
      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [mineralName]);

  return (
    <div ref={refContainer} className="three-container">
      <div className="three-overlay">Viewing {mineralName ?? "<Nothing>"}</div>
      <div className="three-controls">
        <button onClick={toggleAutoRotate}>
          {autoRotate ? "Stop Auto-rotate" : "Auto-rotate"}
        </button>
        <button onClick={() => zoom(-0.6)}>Zoom Out</button>
        <button onClick={() => zoom(0.6)}>Zoom In</button>
        <button onClick={resetView}>Reset View</button>
      </div>
    </div>
  );
}

export default MyThree;
