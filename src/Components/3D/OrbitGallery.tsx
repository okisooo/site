"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { Release, staticReleases } from "@/data/releases"

export function OrbitGallery({
  onHoverRelease,
  onClickRelease,
}: {
  onHoverRelease: (release: Release | null) => void
  onClickRelease: (release: Release) => void
}) {
  const PARTICLE_COUNT = 1500
  const PARTICLE_SIZE_MIN = 0.005
  const PARTICLE_SIZE_MAX = 0.015
  const SPHERE_RADIUS = 9
  const POSITION_RANDOMNESS = 4
  const ROTATION_SPEED_X = 0.0
  const ROTATION_SPEED_Y = 0.001
  const PARTICLE_OPACITY = 0.8

  const IMAGE_SIZE = 2 // Increased size since there are fewer images

  const groupRef = useRef<THREE.Group>(null)

  // Use all releases
  const releases = staticReleases

  // Preload textures
  const textureUrls = useMemo(() => releases.map((r) => r.img), [releases])
  const textures = useTexture(textureUrls)

  useMemo(() => {
    textures.forEach((texture) => {
      if (texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
      }
    })
  }, [textures])

  const particles = useMemo(() => {
    const particles = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi

      const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS
      const x = radiusVariation * Math.cos(theta) * Math.sin(phi)
      const y = radiusVariation * Math.cos(phi)
      const z = radiusVariation * Math.sin(theta) * Math.sin(phi)

      particles.push({
        position: [x, y, z],
        scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
        color: new THREE.Color().setHSL(
          Math.random() * 0.1 + 0.9,
          0.1,
          0.8 + Math.random() * 0.2,
        ),
      })
    }

    return particles
  }, [PARTICLE_COUNT, SPHERE_RADIUS, POSITION_RANDOMNESS, PARTICLE_SIZE_MIN, PARTICLE_SIZE_MAX])

  const orbitingImages = useMemo(() => {
    const images = []
    const imageCount = releases.length

    for (let i = 0; i < imageCount; i++) {
      // Golden ratio spiral for even distribution
      const phi = Math.acos(-1 + (2 * i) / imageCount)
      const theta = Math.sqrt(imageCount * Math.PI) * phi

      const radius = SPHERE_RADIUS - 1 // Inside the particle sphere slightly
      let x = radius * Math.cos(theta) * Math.sin(phi)
      let y = radius * Math.cos(phi)
      let z = radius * Math.sin(theta) * Math.sin(phi)

      if (isNaN(x) || isNaN(y) || isNaN(z)) {
          x = 0; y = 0; z = radius;
      }

      const position = new THREE.Vector3(x, y, z)
      const center = new THREE.Vector3(0, 0, 0)
      const outwardDirection = position.clone().sub(center).normalize()

      const euler = new THREE.Euler()
      const matrix = new THREE.Matrix4()
      matrix.lookAt(position, position.clone().add(outwardDirection), new THREE.Vector3(0, 1, 0))
      euler.setFromRotationMatrix(matrix)

      // Make image face outward 
      euler.z += Math.PI

      images.push({
        position: [x, y, z],
        rotation: [euler.x, euler.y, euler.z],
        textureIndex: i,
        release: releases[i]
      })
    }

    return images
  }, [SPHERE_RADIUS, releases])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += ROTATION_SPEED_Y
      groupRef.current.rotation.x += ROTATION_SPEED_X
    }
  })

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh key={`particle-${index}`} position={particle.position as [number,number,number]} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color={particle.color} transparent opacity={PARTICLE_OPACITY} />
        </mesh>
      ))}

      {orbitingImages.map((image, index) => (
        <mesh
          key={`image-${index}`}
          position={image.position as [number,number,number]}
          rotation={image.rotation as [number,number,number]}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredIndex(index)
            onHoverRelease(image.release)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredIndex(null)
            onHoverRelease(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClickRelease(image.release)
          }}
          scale={hoveredIndex === index ? 1.2 : 1}
        >
          <planeGeometry args={[IMAGE_SIZE, IMAGE_SIZE]} />
          <meshBasicMaterial map={textures[image.textureIndex]} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}
