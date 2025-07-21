"use client"

import { useRef, Suspense } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, Text, Html } from "@react-three/drei"
import type { Group } from "three"

interface ExternalModelCanProps {
  scrollY: number
}

// Component to load external 3D model
function ExternalBottleModel() {
  // You can replace this with your own bottle/can model URL
  // For now, using the built-in duck as an example
  const { scene } = useGLTF("/assets/3d/duck.glb")

  return <primitive object={scene} scale={[2, 2, 2]} position={[0, -0.5, 0]} rotation={[0, Math.PI, 0]} />
}

// Loading fallback component
function ModelLoader() {
  return (
    <Html center>
      <div className="text-white bg-black/50 px-4 py-2 rounded-lg">Loading 3D Model...</div>
    </Html>
  )
}

export function ExternalModelCan({ scrollY }: ExternalModelCanProps) {
  const groupRef = useRef<Group>(null)
  const labelRef = useRef<Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Rotation based on scroll
      const scrollRotation = scrollY * 0.008
      groupRef.current.rotation.y = scrollRotation

      // Floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15

      // Scale based on scroll
      const scale = 1 + Math.sin(scrollY * 0.003) * 0.08
      groupRef.current.scale.setScalar(scale)
    }

    if (labelRef.current) {
      labelRef.current.rotation.y = -scrollY * 0.008
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* External 3D Model with Suspense for loading */}
      <Suspense fallback={<ModelLoader />}>
        <ExternalBottleModel />
      </Suspense>

     
    </group>
  )
}

// Preload the model for better performance
useGLTF.preload("/assets/3d/duck.glb")
