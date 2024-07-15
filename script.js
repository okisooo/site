// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background color to black

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Shader Material for Gradient
const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vWorldPosition;
  void main() {
    float mixValue = (vWorldPosition.y + 1.0) / 2.0;
    gl_FragColor = vec4(vec3(mixValue), 1.0); // Black and white gradient
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader
});

// Cube
const geometry = new THREE.BoxGeometry(2, 2, 2); // Increase the size of the cube
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Wireframe
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White wireframe
const wireframe = new THREE.LineSegments(edges, lineMaterial);
cube.add(wireframe);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// Ground
const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50); // Add segments for more lines
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }); // Black color

const groundMeshes = [];
const groundWireframes = [];
const numGroundSegments = 3;
const groundSegmentLength = 100;
const overlap = 1; // Increase overlap to ensure no gaps

for (let i = 0; i < numGroundSegments; i++) {
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -2;
  groundMesh.position.z = -groundSegmentLength * i + overlap * i;
  scene.add(groundMesh);
  groundMeshes.push(groundMesh);

  const groundWireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White wireframe
  const groundWireframe = new THREE.LineSegments(new THREE.WireframeGeometry(groundGeometry), groundWireframeMaterial);
  groundWireframe.rotation.x = -Math.PI / 2;
  groundWireframe.position.y = -2;
  groundWireframe.position.z = -groundSegmentLength * i + overlap * i;
  scene.add(groundWireframe);
  groundWireframes.push(groundWireframe);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Move the ground segments forward
  groundMeshes.forEach((groundMesh, index) => {
    groundMesh.position.z += 0.1;
    groundWireframes[index].position.z += 0.1;

    // Reset ground position to create a looping effect
    if (groundMesh.position.z > groundSegmentLength - overlap) {
      groundMesh.position.z = -groundSegmentLength * (numGroundSegments - 1) + overlap * (numGroundSegments - 1);
      groundWireframes[index].position.z = -groundSegmentLength * (numGroundSegments - 1) + overlap * (numGroundSegments - 1);
    }
  });

  renderer.render(scene, camera);
};

animate();