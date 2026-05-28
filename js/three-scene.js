import * as THREE from "../libs/threejs/three.module.js";

export function initThreeScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, .1, 100);
  camera.position.z = 6;

  const shapes = ["+", "7", "=", "3", "×", "9"].map((symbol, index) => {
    const mesh = new THREE.Mesh(new THREE.TextGeometry(symbol), new THREE.MeshBasicMaterial({ color: ["#55c7ff", "#b69cff", "#ffd84d", "#62e6b2", "#ffad68", "#2442a7"][index] }));
    mesh.position.x = (index % 3 - 1) * 1.8;
    mesh.position.y = index < 3 ? .9 : -1;
    scene.add(mesh);
    return mesh;
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(1, rect.height);
    camera.updateProjectionMatrix();
  }

  function animate(time) {
    resize();
    shapes.forEach((shape, index) => {
      shape.rotation.x = time * .0004 + index;
      shape.rotation.y = time * .0007 + index;
      shape.position.z = Math.sin(time * .001 + index) * .35;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
