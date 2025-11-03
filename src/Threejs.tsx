import * as THREE from "three";

import { useEffect, useRef } from "react";

function MyThree() {
  const refContainer = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    const container = refContainer.current as HTMLDivElement | null;

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

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.position.z = 5;

    let animationId: number | null = null;
    const animate = function () {
      animationId = requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup to prevent duplicate canvases/animations (React StrictMode double mount in dev)
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
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
  }, []);

  return <div ref={refContainer}></div>;
}

export default MyThree;
