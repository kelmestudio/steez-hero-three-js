"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * Este componente desativa o raycaster do Three.js para permitir
 * que elementos HTML por trás do canvas sejam clicáveis.
 */
export function DisableRaycast() {
  const { raycaster } = useThree();

  useEffect(() => {
    // Guarda a configuração original da máscara de camadas
    const originalMask = raycaster.layers.mask;
    
    // Desativa todas as camadas no raycaster
    raycaster.layers.disableAll();
    
    // Restaura as configurações originais quando o componente é desmontado
    return () => {
      raycaster.layers.mask = originalMask;
    };
  }, [raycaster]);

  return null; // Este componente não renderiza nada visível
}
