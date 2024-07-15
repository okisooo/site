import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/shaders/VignetteShader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Post-processing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const vignettePass = new ShaderPass(VignetteShader);
vignettePass.uniforms['darkness'].value = 1.5; // Adjust darkness as needed
vignettePass.uniforms['offset'].value = 1.0; // Adjust offset as needed
composer.addPass(vignettePass);

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

// Cube setup
const geometry = new THREE.BoxGeometry(2, 2, 2);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Wireframe setup
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const wireframe = new THREE.LineSegments(edges, lineMaterial);
cube.add(wireframe);

// Lighting setup
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Ground setup
const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const groundMeshes = [];
const groundWireframes = [];
const numGroundSegments = 3;
const groundSegmentLength = 100;
const overlap = 1;

for (let i = 0; i < numGroundSegments; i++) {
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -2;
  groundMesh.position.z = -groundSegmentLength * i + overlap * i;
  scene.add(groundMesh);
  groundMeshes.push(groundMesh);

  const groundWireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
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
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  groundMeshes.forEach((groundMesh, index) => {
    groundMesh.position.z += 0.1;
    groundWireframes[index].position.z += 0.1;

    if (groundMesh.position.z > groundSegmentLength - overlap) {
      groundMesh.position.z = -groundSegmentLength * (numGroundSegments - 1) + overlap * (numGroundSegments - 1);
      groundWireframes[index].position.z = -groundSegmentLength * (numGroundSegments - 1) + overlap * (numGroundSegments - 1);
    }
  });

  composer.render();
};

animate();