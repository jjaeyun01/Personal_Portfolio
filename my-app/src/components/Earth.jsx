import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Earth() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Texture loader
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/textures/earth.jpg');

    // Earth
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,      // ★ 텍스처 적용
      shininess: 10,
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Wireframe
    const wireframeGeometry = new THREE.SphereGeometry(1.01, 16, 16);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x6c63ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.002;
      wireframe.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="earthCanvas" />;
}

export default Earth;
