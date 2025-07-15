"use client"

import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import type { Group } from "three"

interface AnimatedCanProps {
  scrollY: number
}

// Simple 3D Soda Can Component with STEEZ Label Texture
function SodaCanModel() {
  // Load the STEEZ label texture
  const labelTexture = useLoader(TextureLoader, "/images/steez-label.png")

  return (
    <group>
      {/* Main Can Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 2.5, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Label Area with STEEZ Texture */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.81, 0.81, 2.2, 32]} />
        <meshStandardMaterial map={labelTexture} />
      </mesh>

      {/* Can Top */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Can Bottom */}
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Top Ring */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.05, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Bottom Ring */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.05, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

export function AnimatedCan({ scrollY }: AnimatedCanProps) {
  const groupRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Calculate scroll progress through the hero section (0 to 1)
      const heroHeight = window.innerHeight
      const scrollProgress = Math.min(scrollY / heroHeight, 1)

      // Z-axis rotation: Start horizontally and rotate 180 degrees based on scroll
      const initialZRotation = Math.PI / 2 // 90 degrees (horizontal)
      const zRotationRange = Math.PI // 180 degrees rotation
      groupRef.current.rotation.z = initialZRotation + scrollProgress * zRotationRange

      // X-axis rotation: 360 degrees based on scroll
      const xRotationRange = Math.PI * 1 // 360 degrees
      groupRef.current.rotation.x = scrollProgress * xRotationRange + 90

      // Subtle Y-axis rotation for depth
      groupRef.current.rotation.y = scrollProgress * 0.5

      // Floating animation (reduced intensity)
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05

      // Scale based on scroll progress
      const scale = 1 + scrollProgress * 0.2
      groupRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Enhanced Lighting for better texture visibility */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.3} />
      <pointLight position={[-10, -10, -5]} intensity={0.7} />
      <pointLight position={[5, 0, 5]} intensity={0.5} color="#ffffff" />

      {/* 3D Soda Can Model */}
      <SodaCanModel />
    </group>
  )
}
