"use client"

import { useGLTF, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import { Group, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, TextureLoader, Color } from "three";
import { GLTF } from "three-stdlib";

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
  metalness?: number; 
  roughness?: number;
  envMapIntensity?: number;
  lightingConfig?: {
    ambientIntensity?: number;
    directionalIntensity?: number;
    pointIntensity?: number;
  };
}

/**
 * Componente AnimatedCan - Renderiza uma lata 3D animada que responde às mudanças de seção
 */
export function AnimatedCan({ scrollY, activeSection, sectionConfigs, metalness = 0.95, roughness = 0.1, envMapIntensity = 3.0 }: AnimatedCanProps) {
  // Referência para o grupo principal
  const canRef = useRef<Group>(null);
  
  // Carregar o modelo GLTF
  const { nodes, materials: gltfMaterials } = useGLTF("/models/can.gltf", true) as unknown as GLTFResult;
  
  // Configurações default por seção - memoizadas para evitar recriação
  const defaultConfigs: CanConfigs = useMemo(() => ({
    inicio: { position: [0, 0, 10], rotation: [0, 0, 0], scale: 0.42 },
    pink: { position: [0, 0, 10], rotation: [0, Math.PI * 0.5, 0], scale: 0.7 },
    sobre: { position: [2, 0, 10], rotation: [0, Math.PI, 0], scale: 0.4 },
    contato: { position: [0, 2, 10], rotation: [0, Math.PI * 1.5, 0], scale: 0.6 }
  }), []);
  
  // Usar configurações externas ou defaults
  const configs = sectionConfigs || defaultConfigs;
  
  // Estados para animação
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [targetRotation, setTargetRotation] = useState([0, 0, 0]);
  const [targetScale, setTargetScale] = useState(0.42);
  
  // Estados para textura e material
  const [baseColorTexture, setBaseColorTexture] = useState<THREE.Texture | null>(null);
  const [materialLoaded, setMaterialLoaded] = useState(false);
  
  // Carregar a textura com otimizações
  useEffect(() => {
    let isMounted = true;
    const textureLoader = new TextureLoader();
    
    const loadTexture = async () => {
      try {
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            '/models/textures/material_baseColor.jpeg',
            resolve,
            undefined,
            reject
          );
        });
        
        if (isMounted) {
          texture.flipY = false; // Importante para GLTF
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          setBaseColorTexture(texture);
          setMaterialLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          setMaterialLoaded(true); // Continuar mesmo com erro
        }
      }
    };
    
    loadTexture();
    
    return () => {
      isMounted = false;
      if (baseColorTexture) {
        baseColorTexture.dispose();
      }
    };
  }, []);
  
  // Materiais personalizados otimizados
  const customMaterials = useMemo(() => {
    // Material principal com a textura base color
    const baseMaterial = new MeshStandardMaterial({
      color: new Color(0xffffff),
      roughness,
      metalness,
      envMapIntensity
    });
    
    // Material metálico rosa para o anel (#F42153) - Otimizado
    const pinkMaterial = new MeshPhysicalMaterial({
      color: new Color("#F42153"),
      roughness: 0.02,
      metalness: 1.0,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 4.0,
      emissive: new Color("#FF2155").multiplyScalar(0.5),
      emissiveIntensity: 1.2
    });
    
    // Aplicar a textura ao material base se estiver disponível
    if (baseColorTexture) {
      baseMaterial.map = baseColorTexture;
      baseMaterial.needsUpdate = true;
    }
    
    return { baseMaterial, pinkMaterial };
  }, [baseColorTexture, roughness, metalness, envMapIntensity]);
  
  // Atualizar alvos quando a seção muda - otimizado
  useEffect(() => {
    const sectionConfig = configs[activeSection];
    if (sectionConfig) {
      setTargetPosition(sectionConfig.position);
      setTargetRotation(sectionConfig.rotation);
      setTargetScale(sectionConfig.scale);
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
  
  // Usar useFrame para animações suaves com base no tempo em vez do scrollY
  const lastScrollY = useRef(scrollY);
  const lastTimestamp = useRef(Date.now());
  const scrollVelocity = useRef(0);
  
  // Otimização do cálculo de velocidade de scroll
  useEffect(() => {
    const now = performance.now();
    const delta = now - lastTimestamp.current;
    if (delta > 16) { // Throttle para 60fps máximo
      const scrollDelta = scrollY - lastScrollY.current;
      scrollVelocity.current = scrollDelta / delta;
      lastScrollY.current = scrollY;
      lastTimestamp.current = now;
    }
  }, [scrollY]);
  
  // Animar o modelo a cada frame - otimizado
  useFrame(useCallback((state, delta) => {
    if (!canRef.current) return;
    
    const speed = Math.min(delta * 3, 0.1); // Animação baseada em tempo, limitada
    
    // Posição ajustada pelo centro
    const adjustedPosition = [
      targetPosition[0] + centerPoint[0], 
      targetPosition[1] + centerPoint[1], 
      targetPosition[2] + centerPoint[2]
    ];
    
    // Animar posição com interpolação suave
    canRef.current.position.lerp(
      new THREE.Vector3(adjustedPosition[0], adjustedPosition[1], adjustedPosition[2]), 
      speed
    );
    
    // Animar rotação (com efeito de scroll) com interpolação suave
    const yRotationWithScroll = targetRotation[1] + scrollY * 0.001;
    canRef.current.rotation.x += (targetRotation[0] - canRef.current.rotation.x) * speed;
    canRef.current.rotation.y += (yRotationWithScroll - canRef.current.rotation.y) * speed;
    canRef.current.rotation.z += (targetRotation[2] - canRef.current.rotation.z) * speed;
    
    // Animar escala de forma mais eficiente
    const currentScale = canRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, speed);
    canRef.current.scale.setScalar(newScale);
  }, [centerPoint, targetPosition, targetRotation, targetScale, scrollY]));
  
  // Aplicar materiais aos meshes de forma otimizada
  useEffect(() => {
    Object.keys(nodes).forEach(key => {
      if (nodes[key].isMesh) {
        // Verificar pela posição Y para identificar o anel superior
        const isTopPart = nodes[key].position && nodes[key].position.y > 0.5;
        
        // Para qualquer parte que esteja na metade superior da lata, aplicar material rosa
        if (isTopPart) {
          nodes[key].material = customMaterials.pinkMaterial;
        } else {
          nodes[key].material = customMaterials.baseMaterial;
        }
      }
    });
  }, [nodes, customMaterials]);

  // Identificar componentes do anel de forma otimizada
  const getRingPatterns = useCallback(() => [
    'pull_tab', 'ring_top', 'can_lid', 'can_top', 
    'tab', 'lid', 'anel_superior', 'top', 'upper',
    'circle', 'ring', 'opening', 'opener', 'pull',
    'Cylinder', 'Cylinder001', 'Cylinder002'
  ], []);

  // Meshes memoizados e otimizados
  const meshes = useMemo(() => {
    const ringPatterns = getRingPatterns();
    
    return Object.keys(nodes)
      .filter(key => nodes[key].isMesh)
      .map(key => {
        // Estratégia otimizada para identificar o anel da lata
        const keyLower = key.toLowerCase();
        const isRing = keyLower.includes('ring') || 
                       keyLower.includes('top') || 
                       keyLower.includes('lid') ||
                       keyLower.includes('cap') ||
                       keyLower.includes('anel') ||
                       keyLower.includes('borda');
        
        const forceRing = ringPatterns.some(name => key.includes(name));
        
        // Usar material pink para o anel, base material para o resto
        const meshMaterial = (isRing || forceRing) ? 
          customMaterials.pinkMaterial : 
          customMaterials.baseMaterial;
        
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
            raycast={() => null}
          />
        );
      });
  }, [nodes, customMaterials, centerPoint, gltfMaterials, getRingPatterns]);
  
  // Remover geometria não utilizada e otimizar
  const shadowPlaneGeometry = useMemo(() => new THREE.PlaneGeometry(100, 100), []);
  const shadowMaterial = useMemo(() => new THREE.ShadowMaterial({ opacity: 0.4, transparent: true }), []);
  
  // Configuração com suporte a sombras e plano para receber sombras
  return (
    <>
      {/* Environment map otimizado para melhorar reflexões metálicas */}
      <Environment preset="studio" />
      
      <group 
        ref={canRef} 
        dispose={null}
        visible={true}
        castShadow
        receiveShadow
      >
        {/* Meshes do modelo */}
        {meshes}
      </group>
      
      {/* Plano otimizado para receber sombras */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -5, 0]} 
        receiveShadow
        geometry={shadowPlaneGeometry}
        material={shadowMaterial}
      />
    </>
  );
}

// Pré-carregar o modelo
useGLTF.preload("/models/can.gltf");
