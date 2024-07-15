<template>
  <div id="container" ref="container">
    <SocialIcons />
  </div>
</template>
<script>
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import SocialIcons from './SocialIcons.vue';
export default {
  name: 'ThreeScene',
  components: {
    SocialIcons
  },
  mounted() {
    const mount = this.$refs.container;
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Set background color to black
    // Camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    // Shader Material for Gradient
    const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vWorldPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec3 vWorldPosition;
  void main() {
    float mixValue = (vWorldPosition.y + 1.0) / 2.0;
    gl_FragColor = vec4(mix(color1, color2, mixValue), 1.0);
  }
`;
const uniforms = {
  color1: { value: new THREE.Color(0x00ff00) }, // Initial color1
  color2: { value: new THREE.Color(0xff0000) }  // Initial color2
};

const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

    // Create "X" shape geometry
    const boxGeometry = new THREE.BoxGeometry(1, 3, 1);
const box1 = new THREE.Mesh(boxGeometry, material);
const box2 = new THREE.Mesh(boxGeometry, material);
box1.rotation.z = Math.PI / 4;
box2.rotation.z = -Math.PI / 4;
const xGroup = new THREE.Group();
xGroup.add(box1);
xGroup.add(box2);
xGroup.scale.set(1, 1, 1);
scene.add(xGroup);

const colors = [
  { color1: new THREE.Color(0x00ff00), color2: new THREE.Color(0xff0000) }, // Green to Red
  { color1: new THREE.Color(0xff00ff), color2: new THREE.Color(0x0000ff) }, // Pink to Blue
  { color1: new THREE.Color(0xffff00), color2: new THREE.Color(0x00ffff) }  // Yellow to Cyan
];

let currentColorIndex = 0;

function updateGradientColors() {
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  const nextColors = colors[currentColorIndex];

  // Animate the transition
  const duration = 4000; // 4 seconds
  const startTime = performance.now();

  function animateTransition() {
    const elapsedTime = performance.now() - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Normalize to [0, 1]

    uniforms.color1.value.lerpColors(uniforms.color1.value, nextColors.color1, t);
    uniforms.color2.value.lerpColors(uniforms.color2.value, nextColors.color2, t);

    if (t < 1) {
      requestAnimationFrame(animateTransition);
    }
  }

  animateTransition();
}
setInterval(updateGradientColors, 4000); // Update every 4 seconds


    // Wireframe
    const edges1 = new THREE.EdgesGeometry(boxGeometry);
    const edges2 = new THREE.EdgesGeometry(boxGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White wireframe
    const wireframe1 = new THREE.LineSegments(edges1, lineMaterial);
    const wireframe2 = new THREE.LineSegments(edges2, lineMaterial);
    box1.add(wireframe1);
    box2.add(wireframe2);
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
    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const vignettePass = new ShaderPass(VignetteShader);
    vignettePass.uniforms['offset'].value = 1.0;
    vignettePass.uniforms['darkness'].value = 3.5;
    composer.addPass(vignettePass);
    // Handle window resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      composer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the correct size
    // Animation
    const animate = function () {
      requestAnimationFrame(animate);
      xGroup.rotation.x += 0.01;
      xGroup.rotation.y += 0.01;
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
      composer.render();
    };
    animate();
  }
}
</script>
<style scoped>
#container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}
</style>