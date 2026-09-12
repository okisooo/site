"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { OrbitGallery } from "./OrbitGallery"
import type { Release } from "@/data/releases"

export default function ReleaseOrbit({ onHoverRelease, onClickRelease }: {
  onHoverRelease: (release: Release | null) => void
  onClickRelease: (release: Release) => void
}) {
  return (
    <Canvas camera={{ position: [-8, 2, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitGallery onHoverRelease={onHoverRelease} onClickRelease={onClickRelease} />
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  )
}
