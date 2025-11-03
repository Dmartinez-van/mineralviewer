import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { useEffect, useRef } from "react";

type MyThreeProps = {
  mineralName?: string;
  filePath?: string;
};
const modelMap = {
  Quartz: new URL("/models/quartz/scene.gltf", import.meta.url).href,
  Feldspar: new URL("/models/feldspar/scene.gltf", import.meta.url).href,
  // ...other imports
};

function MyThree({ mineralName }: MyThreeProps) {
  const refContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
    const width = rect && rect.width > 0 ? rect.width : window.innerWidth - 200;
    const height =
      rect && rect.height > 0 ? rect.height : window.innerHeight - 200;
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

    //"./assets/model/" + (mineralName ?? "biotite") + "/scene.gltf",
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const root = gltf.scene;
        root.scale.set(4, 4, 4);

        // Called when the resource is loaded
        // gltf.scene contains the loaded 3D scene
        // Add it to your Three.js scene
        scene.add(root);
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
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup to prevent duplicate canvases/animations (React StrictMode double mount in dev)
    return () => {
      try {
        renderer.dispose();
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
    </div>
  );
}

export default MyThree;
