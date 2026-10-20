/**
 * ==========================================================================
 * background-3d.js
 * Three.js Interactive Background Simulation
 * Simulates an interconnected railway/logistics network of nodes and tracks
 * ==========================================================================
 */

let scene, camera, renderer, particles, linesMesh;
let particlePositions, particleVelocities;
const particleCount = 70;
let mouseX = 0, mouseY = 0;

/**
 * Initialize Three.js scene, camera, renderer and geometry
 */
function initThree() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create Particle Constellation (Nodes representing Rail Terminals/Nodes)
  const geometry = new THREE.BufferGeometry();
  particlePositions = new Float32Array(particleCount * 3);
  particleVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 800;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 400;

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.2
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  // Particle Material (Soft blue slate nodes)
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 5,
    transparent: true,
    opacity: 0.6
  });

  particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // Lines Material (Tracks connecting nodes)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.25
  });

  linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
  scene.add(linesMesh);

  // Mouse movement interaction
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
  });

  // Responsive resize handler
  window.addEventListener('resize', onWindowResize);
}

/**
 * Perturb particles slightly on slide changes
 */
function triggerSlideParticlePulse() {
  if (!particleVelocities) return;
  for (let i = 0; i < particleVelocities.length; i++) {
    particleVelocities[i].x += (Math.random() - 0.5) * 1.5;
    particleVelocities[i].y += (Math.random() - 0.5) * 1.5;
  }
}

/**
 * Handle window resize adjustments
 */
function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Continuous animation loop
 */
function animateThree() {
  requestAnimationFrame(animateThree);
  if (!scene || !camera || !renderer || !particles) return;

  // Smooth camera reaction to mouse
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  // Update particle positions and detect boundaries
  const positions = particles.geometry.attributes.position.array;
  const linePositions = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] += particleVelocities[i].x;
    positions[i * 3 + 1] += particleVelocities[i].y;
    positions[i * 3 + 2] += particleVelocities[i].z;

    // Bounce off boundary box
    if (Math.abs(positions[i * 3]) > 400) particleVelocities[i].x *= -1;
    if (Math.abs(positions[i * 3 + 1]) > 300) particleVelocities[i].y *= -1;
    if (Math.abs(positions[i * 3 + 2]) > 200) particleVelocities[i].z *= -1;

    // Connect nearby nodes with railway-like lines
    for (let j = i + 1; j < particleCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 110) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
        );
      }
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;

  // Update dynamic line geometry
  linesMesh.geometry.dispose();
  linesMesh.geometry = new THREE.BufferGeometry();
  linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  // Slow ambient rotation
  scene.rotation.y += 0.0008;

  renderer.render(scene, camera);
}
