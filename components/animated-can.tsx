"use client"

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, TextureLoader, Color } from "three";
import { GLTF } from "three-stdlib";
import { LightingSetup } from "./lighting-setup";

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: Mesh;
  };
  materials: {
    [key: string]: MeshStandardMaterial;
  };
};

type SectionConfig = {
  position: number[];
  rotation: number[];
  scale: number;
};

type CanConfigs = {
  [key: string]: SectionConfig;
};

interface AnimatedCanProps {
  scrollY: number;
  activeSection: string;
  sectionConfigs?: CanConfigs;
  lightingConfig?: {
    ambientIntensity?: number;
    directionalIntensity?: number;
    pointIntensity?: number;
  };
}

/**
 * Componente AnimatedCan - Renderiza uma lata 3D animada que responde às mudanças de seção
 */
export function AnimatedCan({ scrollY, activeSection, sectionConfigs }: AnimatedCanProps) {
  // Referência para o grupo principal
  const canRef = useRef<Group>(null);
  
  // Carregar o modelo GLTF
  const { nodes, materials: gltfMaterials } = useGLTF("/models/can.gltf", true) as unknown as GLTFResult;
  
  // Configurações default por seção
  const defaultConfigs: CanConfigs = {
    inicio: { position: [0, 0, 10], rotation: [0, 0, 0], scale: 0.42 },
    loja: { position: [0, 0, 10], rotation: [0, Math.PI * 0.5, 0], scale: 0.7 },
    sobre: { position: [2, 0, 10], rotation: [0, Math.PI, 0], scale: 0.4 },
    contato: { position: [0, 2, 10], rotation: [0, Math.PI * 1.5, 0], scale: 0.6 }
  };
  
  // Usar configurações externas ou defaults
  const configs = sectionConfigs || defaultConfigs;
  
  // Estados para animação
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);
  const [targetScale, setTargetScale] = useState(0.42);
  
  // Estados para textura e material
  const [baseColorTexture, setBaseColorTexture] = useState<THREE.Texture | null>(null);
  const [materialLoaded, setMaterialLoaded] = useState(false);
  
  // Carregar a textura explicitamente
  useEffect(() => {
    const textureLoader = new TextureLoader();
    textureLoader.load(
      '/models/textures/material_baseColor.jpeg',
      (texture) => {
        console.log("Textura base color carregada com sucesso");
        texture.flipY = false; // Importante para GLTF
        setBaseColorTexture(texture);
        setMaterialLoaded(true);
      },
      // Progress callback
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% da textura carregada');
      },
      // Error callback
      (error) => {
        console.error("Erro ao carregar textura:", error);
        setMaterialLoaded(true); // Continuar mesmo com erro
      }
    );
    
    // Cleanup
    return () => {
      if (baseColorTexture) {
        baseColorTexture.dispose();
      }
    };
  }, []);
  
  // Materiais personalizados - um para o corpo da lata e um para o anel
  const customMaterials = useMemo(() => {
    // Material principal com a textura base color
    const baseMaterial = new MeshStandardMaterial({
      color: new Color(0xffffff),
      roughness: 0.3,
      metalness: 0.7
    });
    
    // Material metálico rosa para o anel (#F42153) - Versão mais brilhante
    const pinkMaterial = new MeshPhysicalMaterial({
      color: new Color("#F42153"),
      roughness: 0.05,
      metalness: 1.0,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.0,
      emissive: new Color("#F42153").multiplyScalar(0.3),
      emissiveIntensity: 0.8
    });
    
    // Aplicar a textura ao material base se estiver disponível
    if (baseColorTexture) {
      baseMaterial.map = baseColorTexture;
      baseMaterial.needsUpdate = true;
    }
    
    return { baseMaterial, pinkMaterial };
  }, [baseColorTexture]);
  
  // Atualizar alvos quando a seção muda
  useEffect(() => {
    if (configs[activeSection]) {
      setTargetPosition(configs[activeSection].position);
      setTargetRotation(configs[activeSection].rotation);
      setTargetScale(configs[activeSection].scale);
    }
  }, [activeSection, configs]);
  
  // Calcular centro geométrico
  const centerPoint = useMemo(() => {
    const meshKeys = Object.keys(nodes).filter(key => nodes[key].isMesh);
    if (meshKeys.length === 0) return [0, 0, 0];
    
    let xSum = 0, ySum = 0, zSum = 0;
    let count = 0;
    
    meshKeys.forEach(key => {
      if (nodes[key].position) {
        xSum += nodes[key].position.x;
        ySum += nodes[key].position.y;
        zSum += nodes[key].position.z;
        count++;
      }
    });
    
    return count > 0 ? [xSum / count, ySum / count, zSum / count] : [0, 0, 0];
  }, [nodes]);
  
  // Animar o modelo a cada frame
  useFrame((state, delta) => {
    if (!canRef.current) return;
    
    const speed = 0.05;
    
    // Posição ajustada pelo centro
    const adjustedPosition = [
      targetPosition[0] + centerPoint[0], 
      targetPosition[1] + centerPoint[1], 
      targetPosition[2] + centerPoint[2]
    ];
    
    // Animar posição
    canRef.current.position.x += (adjustedPosition[0] - canRef.current.position.x) * speed;
    canRef.current.position.y += (adjustedPosition[1] - canRef.current.position.y) * speed;
    canRef.current.position.z += (adjustedPosition[2] - canRef.current.position.z) * speed;
    
    // Animar rotação (com efeito de scroll)
    const yRotationWithScroll = targetRotation[1] + scrollY * 0.001;
    canRef.current.rotation.x += (targetRotation[0] - canRef.current.rotation.x) * speed;
    canRef.current.rotation.y += (yRotationWithScroll - canRef.current.rotation.y) * speed;
    canRef.current.rotation.z += (targetRotation[2] - canRef.current.rotation.z) * speed;
    
    // Animar escala
    const currentScale = canRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * speed;
    canRef.current.scale.set(newScale, newScale, newScale);
  });
  
  // Aplicar materiais aos meshes com abordagem forçada
  useEffect(() => {
    // Inspecionar todas as partes do modelo
    Object.keys(nodes).forEach(key => {
      if (nodes[key].isMesh) {
        // Verificar pela posição Y para identificar o anel superior
        const isTopPart = nodes[key].position && nodes[key].position.y > 0.5;
        
        console.log(`Mesh "${key}" - Posição Y: ${nodes[key].position?.y} - É parte superior: ${isTopPart}`);
        
        // Para qualquer parte que esteja na metade superior da lata, aplicar material rosa
        if (isTopPart) {
          console.log(`Aplicando material rosa ao mesh "${key}"`);
          nodes[key].material = customMaterials.pinkMaterial;
        } else {
          nodes[key].material = customMaterials.baseMaterial;
        }
      }
    });
  }, [nodes, customMaterials]);

  // Meshes memoizados centrados
  const meshes = useMemo(() => {
    // Log para ajudar na depuração
    console.log("Meshes disponíveis:", Object.keys(nodes).filter(key => nodes[key].isMesh));
    
    return Object.keys(nodes)
      .filter(key => nodes[key].isMesh)
      .map(key => {
        // Verificar qual material usar com base no nome do mesh e posição
        // Estratégia completa para identificar o anel da lata
        const isRing = key.toLowerCase().includes('ring') || 
                       key.toLowerCase().includes('top') || 
                       key.toLowerCase().includes('lid') ||
                       key.toLowerCase().includes('cap') ||
                       key.toLowerCase().includes('anel') ||
                       key.toLowerCase().includes('borda');
        
        // Lista muito abrangente de nomes possíveis para o anel
        const forceRing = [
          'pull_tab', 'ring_top', 'can_lid', 'can_top', 
          'tab', 'lid', 'anel_superior', 'top', 'upper',
          'circle', 'ring', 'opening', 'opener', 'pull',
          'Cylinder', 'Cylinder001', 'Cylinder002'
        ].some(name => key.includes(name));
        
        // Usar material pink para o anel, base material para o resto
        const meshMaterial = isRing || forceRing ? customMaterials.pinkMaterial : customMaterials.baseMaterial;
        
        return (
          <mesh
            key={key}
            castShadow
            receiveShadow
            geometry={nodes[key].geometry}
            material={meshMaterial || nodes[key].material || gltfMaterials[key]}
            position={[
              nodes[key].position.x - centerPoint[0],
              nodes[key].position.y - centerPoint[1],
              nodes[key].position.z - centerPoint[2]
            ]}
            rotation={nodes[key].rotation}
            scale={nodes[key].scale}
          />
        );
      });
  }, [nodes, customMaterials, centerPoint]);
  
  // Criar um anel rosa manualmente como fallback
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(0.5, 0.1, 16, 100), []);
  
  console.log("Debug return structure");
  return (
    <group ref={canRef} dispose={null}>
 
      {/* Meshes do modelo */}
      {meshes}
      
      
    </group>
  );
}

// Pré-carregar o modelo
useGLTF.preload("/models/can.gltf");
