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
  const [pullTabTextures, setPullTabTextures] = useState<{
    baseColor: THREE.Texture | null;
    metallicRoughness: THREE.Texture | null;
    normal: THREE.Texture | null;
  }>({
    baseColor: null,
    metallicRoughness: null,
    normal: null
  });
  const [materialLoaded, setMaterialLoaded] = useState(false);
  
  // Carregar as texturas com otimizações
  useEffect(() => {
    let isMounted = true;
    const textureLoader = new TextureLoader();
    
    const loadTextures = async () => {
      try {
        // Carregar textura base para o corpo da lata
        const baseTexture = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            '/models/textures/material_baseColor.jpeg',
            resolve,
            undefined,
            reject
          );
        });
        
        // Carregar texturas do pull tab (material_1_*)
        const pullTabBaseColor = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            '/models/textures/material_1_baseColor.jpeg',
            resolve,
            undefined,
            reject
          );
        });
        
        const pullTabMetallicRoughness = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            '/models/textures/material_1_metallicRoughness.png',
            resolve,
            undefined,
            reject
          );
        });
        
        const pullTabNormal = await new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            '/models/textures/material_1_normal.png',
            resolve,
            undefined,
            reject
          );
        });
        
        if (isMounted) {
          // Configurar textura base
          baseTexture.flipY = false;
          baseTexture.generateMipmaps = true;
          baseTexture.minFilter = THREE.LinearMipmapLinearFilter;
          baseTexture.magFilter = THREE.LinearFilter;
          
          // Configurar texturas do pull tab
          [pullTabBaseColor, pullTabMetallicRoughness, pullTabNormal].forEach(texture => {
            texture.flipY = false;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
          });
          
          setBaseColorTexture(baseTexture);
          setPullTabTextures({
            baseColor: pullTabBaseColor,
            metallicRoughness: pullTabMetallicRoughness,
            normal: pullTabNormal
          });
          setMaterialLoaded(true);
        }
      } catch (error) {
        console.warn('Erro ao carregar texturas:', error);
        if (isMounted) {
          setMaterialLoaded(true); // Continuar mesmo com erro
        }
      }
    };
    
    loadTextures();
    
    return () => {
      isMounted = false;
      if (baseColorTexture) {
        baseColorTexture.dispose();
      }
      Object.values(pullTabTextures).forEach(texture => {
        if (texture) texture.dispose();
      });
    };
  }, []);
  
  // Materiais personalizados otimizados
  const customMaterials = useMemo(() => {
    // Material principal com a textura base color para o corpo da lata
    const baseMaterial = new MeshStandardMaterial({
      color: new Color(0xffffff),
      roughness,
      metalness,
      envMapIntensity
    });
    
    // Material cinza claro metálico para o pull tab - SEM texturas para evitar problemas
    const pullTabMaterial = new MeshPhysicalMaterial({
			color: new Color("#C7C7C7"), // Gerencie a cor do pulltab (anel da lata) aqui, #F42254 é o pink
			roughness: 0.05,
			metalness: 0.95,
			reflectivity: 1.0,
			clearcoat: 0.8,
			clearcoatRoughness: 0.02,
			envMapIntensity: 3.5,
			// Garantir que não use nenhuma textura
			map: null,
			normalMap: null,
			roughnessMap: null,
			metalnessMap: null,
			transparent: false,
			opacity: 1.0,
		});
    
    // Aplicar a textura ao material base se estiver disponível
    if (baseColorTexture) {
      baseMaterial.map = baseColorTexture;
      baseMaterial.needsUpdate = true;
    }
    
    // Pull tab material NÃO recebe texturas - apenas cor sólida cinza metálica
    // Forçar atualização dos materiais
    pullTabMaterial.needsUpdate = true;
    
    return { baseMaterial, pullTabMaterial };
  }, [baseColorTexture, pullTabTextures, roughness, metalness, envMapIntensity]);
  
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
    console.log('=== DEBUG: Analisando todos os nós do modelo ===');
    console.log('Todos os nós disponíveis:', Object.keys(nodes));
    
    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      console.log(`Nó "${key}":`, {
        isMesh: node.isMesh,
        position: node.position,
        parent: node.parent?.name
      });
      
      if (nodes[key].isMesh) {
        // Identificar pull tab baseado na hierarquia do GLTF
        // canPullTab -> defaultMaterial (mesh 0) -> material_1
        // canBody -> defaultMaterial (mesh 1) -> material
        
        const isUnderPullTabNode = node.parent?.name === 'canPullTab' ||
                                  key.toLowerCase().includes('canpulltab') ||
                                  key.toLowerCase().includes('pull');
        
        console.log(`Mesh ${key}: isUnderPullTabNode = ${isUnderPullTabNode}, parent = ${node.parent?.name}`);
        
        // Aplicar material específico
        if (isUnderPullTabNode) {
          console.log(`✓ Aplicando pullTabMaterial CINZA para: ${key}`);
          console.log('Material pull tab:', {
            color: customMaterials.pullTabMaterial.color.getHexString(),
            metalness: customMaterials.pullTabMaterial.metalness,
            roughness: customMaterials.pullTabMaterial.roughness,
            map: customMaterials.pullTabMaterial.map
          });
          nodes[key].material = customMaterials.pullTabMaterial;
        } else {
          console.log(`✓ Aplicando baseMaterial para: ${key}`);
          nodes[key].material = customMaterials.baseMaterial;
        }
        
        // Forçar atualização
        if (nodes[key].material) {
          nodes[key].material.needsUpdate = true;
        }
      }
    });
    
    console.log('=== FIM DEBUG ===');
  }, [nodes, customMaterials]);

  // Meshes memoizados e otimizados
  const meshes = useMemo(() => {
    console.log('=== RENDERIZANDO MESHES ===');
    
    return Object.keys(nodes)
      .filter(key => nodes[key].isMesh)
      .map(key => {
        const node = nodes[key];
        
        // Identificar pull tab baseado na hierarquia
        const isUnderPullTabNode = node.parent?.name === 'canPullTab' ||
                                  key.toLowerCase().includes('canpulltab') ||
                                  key.toLowerCase().includes('pull');
        
        console.log(`Renderizando mesh: ${key}, isUnderPullTabNode: ${isUnderPullTabNode}, parent: ${node.parent?.name}`);
        
        // Selecionar material apropriado
        const meshMaterial = isUnderPullTabNode ? 
          customMaterials.pullTabMaterial : 
          customMaterials.baseMaterial;
        
        return (
          <mesh
            key={key}
            castShadow
            receiveShadow
            geometry={nodes[key].geometry}
            material={meshMaterial}
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
  }, [nodes, customMaterials, centerPoint]);
  
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
