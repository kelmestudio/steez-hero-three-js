"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { TextureLoader, Mesh, MeshStandardMaterial } from "three"
import type { Group, Material } from "three"

interface AnimatedCanProps {
  scrollY: number
}

// 3D Coca-Cola Can Component using GLTF model
function SodaCanModel() {
  // Load the Coca-Cola Can GLTF model with proper texture handling
  const modelPath = '/models/coca-cola_can.gltf'
  // Define texture path for loading textures correctly
  const texturePath = '/models/textures/'
  // Load the model with all its assets (textures, materials)
  const { scene, nodes, materials } = useGLTF(modelPath, true) as any
  
  // Log model info for debugging
  useEffect(() => {
    console.log('Loaded Coca-Cola Can model:', { scene, nodes, materials })
  }, [scene, nodes, materials])
  
  // We'll use the original texture (material base color.jpeg) from the model
  // No need to load the STEEZ label texture
  
  // State to track when materials are ready to be modified
  const [materialsReady, setMaterialsReady] = useState(false)
  
  // Check and verify texture paths, keep original material base color.jpeg
  useEffect(() => {
    // Verify that textures are available in the specified path
    console.log(`Verifying textures in path: ${texturePath}`)
    
    if (materials && Object.keys(materials).length > 0) {
      console.log('Available materials:', Object.keys(materials))
      console.log('Material textures:', Object.keys(materials).map(key => ({
        material: key,
        hasTexture: Boolean(materials[key].map),
        textureInfo: materials[key].map ? {
          uuid: materials[key].map.uuid,
          name: materials[key].map.name,
          image: materials[key].map.image ? 'Image loaded' : 'No image',
          path: materials[key].map.image && materials[key].map.image.src ? materials[key].map.image.src : 'Path unknown'
        } : 'No texture'
      })))
      
      // Enhance materials but keep original textures
      try {
        Object.keys(materials).forEach(key => {
          const material = materials[key] as MeshStandardMaterial
          
          // Keep original textures but enhance material properties
          if (material.map) {
            console.log(`Enhancing material: ${key}`)
            // Enhance material metalness and roughness to highlight textures
            material.metalness = 0.8
            material.roughness = 0.2
            material.envMapIntensity = 1.5 // Increase reflection intensity
            material.needsUpdate = true
          }
        })
        
        console.log('Material enhancement completed successfully')
        setMaterialsReady(true)
      } catch (error) {
        console.error('Error enhancing materials:', error)
        // Still mark as ready
        setMaterialsReady(true)
      }
    }
  }, [materials, texturePath])

  return (
    <group dispose={null}>
      {/* Render the complete scene with all its objects */}
      {scene && materialsReady ? (
        <primitive object={scene} />
      ) : (
        /* Fallback rendering when using direct nodes */
        nodes && Object.keys(nodes).map(key => {
          // Skip non-mesh nodes
          if (!nodes[key].isMesh) return null
          
          const node = nodes[key] as Mesh
          
          return (
            <mesh 
              key={key}
              geometry={node.geometry}
              material={node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            />
          )
        })
      )}
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
    <group ref={groupRef} position={[6, 10, 10]}>
      {/* Ultra bright environment lighting */}
      <ambientLight intensity={9.2} color="#ffffff" />
      
      {/* Main directional light (simulates sun) */}
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={3.0} 
        color="#ffffff"
        castShadow
      />
      
      {/* Fill light from top */}
      <pointLight 
        position={[0, 15, 0]} 
        intensity={2.5} 
        color="#ffffff" 
        distance={20}
        decay={1}
      />
      
      {/* Rim light from right */}
      <pointLight 
        position={[8, 5, 5]} 
        intensity={2.0} 
        color="#f0f8ff" 
        distance={15}
        decay={1}
      />
      
      {/* Highlight light from left - increased power */}
      <pointLight 
        position={[-5, 2, 2]} 
        intensity={8.0} 
        color="#ffffff" 
        distance={10}
        decay={0}
      />
      
      {/* Front fill light for label visibility */}
      <pointLight 
        position={[0, 0, 8]} 
        intensity={3.0} 
        color="#ffffff" 
        distance={12}
        decay={1}
      />
      
      {/* Soft backlight for depth */}
      <pointLight 
        position={[-2, 3, -6]} 
        intensity={2.0} 
        color="#e6f0ff" 
        distance={15}
        decay={1}
      />

      {/* 3D Soda Can Model */}
      <SodaCanModel />
    </group>
  )
}
