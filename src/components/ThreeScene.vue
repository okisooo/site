<template>
  <div id="container" ref="container">
    <SocialIcons />
  </div>
</template>

<script>
import * as THREE from 'three';
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
    camera.position.z = 8; // Increase from 5 to 8

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
    canvas: document.createElement('canvas'),
    antialias: false,
    powerPreference: "low-power",
    precision: "lowp",
    depth: false,
    stencil: false,
    alpha: false // Disable alpha channel
});

    mount.appendChild(renderer.domElement);
    renderer.setSize(mount.clientWidth, mount.clientHeight);

    // Shader Material for Gradient
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vWorldPosition;
      
      void main() {
        float t = smoothstep(-1.5, 1.5, vWorldPosition.y);
        gl_FragColor = vec4(mix(color1, color2, t), 1.0);
      }
    `;

    const uniforms = {
      color1: { value: new THREE.Color(0x000000) },
      color2: { value: new THREE.Color(0xffffff) }
    };

    const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: true,
    depthTest: true
});

    // Create "X" shape geometry
const boxGeometry = new THREE.BoxGeometry(1, 3, 1); // Increased from (1, 3, 1)
const box1 = new THREE.Mesh(boxGeometry, material);
const box2 = new THREE.Mesh(boxGeometry, material);
box1.rotation.z = Math.PI / 4;
box2.rotation.z = -Math.PI / 4;
const xGroup = new THREE.Group();
xGroup.add(box1);
xGroup.add(box2);
xGroup.position.z = 3; // Move further forward (increased from 2)
xGroup.position.y = 0; // Adjust Y position if needed
xGroup.scale.set(1, 1, 1); // Make it slightly larger

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 15, 15);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const groundMeshes = [];
const groundWireframes = [];
const numGroundSegments = 1; 
const groundSegmentLength = 100;
const groundSpacing = groundSegmentLength; 


    // Create a single wireframe material that we'll update
    const groundWireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < numGroundSegments; i++) {
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    const groundWireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(groundGeometry), 
        groundWireframeMaterial
    );
    
    // Set initial positions with proper spacing
    groundMesh.rotation.x = -Math.PI / 2;
    groundWireframe.rotation.x = -Math.PI / 2;
    
    groundMesh.position.y = -4;
    groundWireframe.position.y = -4;
    
    // Position segments one after another
    groundMesh.position.z = i * groundSpacing;
    groundWireframe.position.z = i * groundSpacing;
    
    groundMeshes.push(groundMesh);
    groundWireframes.push(groundWireframe);
    scene.add(groundMesh);
    scene.add(groundWireframe);
}

    // Add components to the scene gradually
    setTimeout(() => {
      scene.add(xGroup);
    }, 500); // Add "X" shape after 500ms

    setTimeout(() => {
      groundMeshes.forEach(mesh => scene.add(mesh));
      groundWireframes.forEach(wireframe => scene.add(wireframe));
    }, 1000); // Add ground after 1000ms

    function getRandomColor() {
      return new THREE.Color(Math.random(), Math.random(), Math.random());
    }

    const colors = Array.from({ length: 7 }, () => ({
      color1: getRandomColor(),
      color2: getRandomColor()
    }));

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

        // Update wireframe color
        const wireframeColor = new THREE.Color().lerpColors(nextColors.color1, nextColors.color2, 0.5);
        groundWireframeMaterial.color.copy(wireframeColor);

        if (t < 1) {
          requestAnimationFrame(animateTransition);
        }
      }
      animateTransition();
    }

    setInterval(updateGradientColors, 8000); // Change from 4000 to 8000ms

    // Wireframe for X shape
    const edges1 = new THREE.EdgesGeometry(boxGeometry);
    const edges2 = new THREE.EdgesGeometry(boxGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White wireframe
    const wireframe1 = new THREE.LineSegments(edges1, lineMaterial);
    const wireframe2 = new THREE.LineSegments(edges2, lineMaterial);
    box1.add(wireframe1);
    box2.add(wireframe2);


    // Handle window resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the correct size

    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = 0;

    // Animation
    const animate = function (currentTime) {
    requestAnimationFrame(animate);
    
    const deltaTime = currentTime - lastFrameTime;
    if (deltaTime < frameInterval) return;
    
    lastFrameTime = currentTime - (deltaTime % frameInterval);

    // Reduce rotation calculations
    xGroup.rotation.x = (xGroup.rotation.x + 0.008) % (Math.PI * 2);
    xGroup.rotation.y = (xGroup.rotation.y + 0.008) % (Math.PI * 2);
    
    // Single ground segment movement
    const groundMesh = groundMeshes[0];
    const wireframe = groundWireframes[0];
    
    groundMesh.position.z += 0.05;
    wireframe.position.z += 0.05;
    
    if (groundMesh.position.z >= groundSpacing) {
        groundMesh.position.z = 0;
        wireframe.position.z = 0;
    }
    
    renderer.render(scene, camera);
};

animate(performance.now());

}

};
  
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