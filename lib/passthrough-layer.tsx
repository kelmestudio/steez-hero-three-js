"use client";

import * as THREE from "three";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Este componente aplica uma camada invisível em frente à câmera
 * que intercepta todos os eventos de mouse/touch antes que eles possam atingir
 * qualquer objeto 3D dentro da cena, permitindo assim que os elementos HTML
 * por trás do canvas sejam clicáveis.
 */
export function PassthroughLayer() {
  const { camera, scene } = useThree();
  
  useEffect(() => {
    // Criar um material completamente transparente mas que ainda intercepta raycasting
    const material = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 0,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false
    });
    
    // Criar um plano grande o suficiente para cobrir todo o campo de visão
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const plane = new THREE.Mesh(geometry, material);
    
    // Posicionar o plano ligeiramente na frente da câmera, acompanhando seus movimentos
    plane.position.z = -5;
    plane.renderOrder = -1; // Garantir que renderize por último
    
    // Adicionar o plano como filho da câmera, assim ele sempre estará na frente
    camera.add(plane);
    
    // Adicionar a câmera à cena se ainda não estiver
    if (!scene.children.includes(camera)) {
      scene.add(camera);
    }
    
    // Substituir o método de raycasting do plano para ignorar completamente
    // Assim os cliques passam direto para elementos HTML por trás do canvas
    plane.raycast = () => null;
    
    return () => {
      // Limpeza
      camera.remove(plane);
      geometry.dispose();
      material.dispose();
    };
  }, [camera, scene]);
  
  return null;
}
