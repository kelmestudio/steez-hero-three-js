import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Tipo para configurações da lata
interface SectionConfig {
  position: number[];
  rotation: number[];
  scale: number;
}

// Tipos de props para o componente AnimatedCan
interface AnimatedCanProps {
  scrollY: number;
  activeSection: string;
  sectionConfigs: Record<string, SectionConfig>;
}

export function AnimatedCan({ 
  scrollY, 
  activeSection, 
  sectionConfigs
}: AnimatedCanProps) {
  // Referência para o modelo 3D
  const modelRef = useRef<THREE.Group>(null);
  
  // Carregar o modelo 3D (substitua pelo caminho do seu modelo)
  const { scene } = useGLTF('/models/can.glb');
  
  // Estados para animação
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 10));
  const [targetRotation, setTargetRotation] = useState<THREE.Euler>(new THREE.Euler(0, 0, 0));
  const [targetScale, setTargetScale] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  // Guarda a última seção processada para evitar atualizações desnecessárias
  const lastSectionRef = useRef<string>(activeSection);
  
  // Efeito que reage à mudança de seção ativa
  useEffect(() => {
    if (activeSection && sectionConfigs && sectionConfigs[activeSection]) {
      const config = sectionConfigs[activeSection];
      
      // Atualiza os alvos de animação
      setTargetPosition(new THREE.Vector3(...config.position));
      setTargetRotation(new THREE.Euler(...config.rotation));
      setTargetScale(config.scale);
      
      lastSectionRef.current = activeSection;
    }
  }, [activeSection, sectionConfigs]);
  
  // Efeito específico para ouvir o evento de transição entre seções
  useEffect(() => {
    const handleSectionTransitioning = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { section, configs } = customEvent.detail;
      
      if (section && configs && configs[section]) {
        const config = configs[section];
        
        // Aplica as configurações de transição imediatamente
        setTargetPosition(new THREE.Vector3(...config.position));
        setTargetRotation(new THREE.Euler(...config.rotation));
        setTargetScale(config.scale);
        
        // Flag para animação mais rápida durante transições
        setIsTransitioning(true);
        
        // Resetar a flag após um tempo
        setTimeout(() => setIsTransitioning(false), 700);
      }
    };
    
    // Adiciona listener para o evento personalizado de transição
    window.addEventListener('sectionTransitioning', handleSectionTransitioning as EventListener);
    
    // Limpeza ao desmontar
    return () => {
      window.removeEventListener('sectionTransitioning', handleSectionTransitioning as EventListener);
    };
  }, []);
  
  // Frame loop para animar o modelo suavemente
  useFrame(() => {
    if (!modelRef.current) return;
    
    const model = modelRef.current;
    
    // Define a velocidade de interpolação - mais rápida durante transições
    const lerpSpeed = isTransitioning ? 0.1 : 0.05;
    
    // Interpola posição
    model.position.lerp(targetPosition, lerpSpeed);
    
    // Interpola rotação (mais complexo porque Euler não tem lerp)
    const currentRotation = new THREE.Euler().copy(model.rotation);
    model.rotation.set(
      THREE.MathUtils.lerp(currentRotation.x, targetRotation.x, lerpSpeed),
      THREE.MathUtils.lerp(currentRotation.y, targetRotation.y, lerpSpeed),
      THREE.MathUtils.lerp(currentRotation.z, targetRotation.z, lerpSpeed)
    );
    
    // Interpola escala
    const targetScaleVector = new THREE.Vector3(targetScale, targetScale, targetScale);
    model.scale.lerp(targetScaleVector, lerpSpeed);
  });
  
  // Clone do modelo
  const modelClone = scene.clone();
  
  return (
    <primitive 
      ref={modelRef} 
      object={modelClone} 
      position={[0, 0, 0]}
    />
  );
}