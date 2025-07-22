"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";

/**
 * Componente NoInteraction - Desativa todas as interações com objetos 3D na cena
 * Permite que elementos HTML por trás do canvas sejam clicáveis
 */
export function NoInteraction() {
  const { gl } = useThree();
  
  useLayoutEffect(() => {
    // Abordagem simples: define o estilo do canvas para ignorar eventos de ponteiro
    if (gl.domElement) {
      gl.domElement.style.pointerEvents = 'none';
    }
    
    // Limpa as alterações ao desmontar
    return () => {
      if (gl.domElement) {
        gl.domElement.style.pointerEvents = '';
      }
    };
  }, [gl]);
  
  return null;
}
