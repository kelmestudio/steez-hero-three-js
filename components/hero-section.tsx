"use client"

import { useState, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { AnimatedCan } from "./animated-can"
import { CanConfigPanel } from "./can-config-panel"

interface HeroSectionProps {
  scrollY: number;
}

export function HeroSection({ scrollY }: HeroSectionProps) {
  // Manipulador de mudança de configuração - usando useCallback para evitar recriações desnecessárias
  const handleConfigChange = useCallback((newConfig: any) => {
    setCanConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
  }, []);

  return (
    <section className="relative h-screen w-full">
      {/* Canvas 3D */}
      <Canvas 
        className="bg-black" 
        camera={{ position: [0, 0, 15], fov: 50 }}
        shadows
      >
        <AnimatedCan
          scrollY={scrollY}
          activeSection="inicio"
          lightingConfig={canConfig} // Passando configurações para o componente 3D
        />
      </Canvas>
      
      {/* Painel de configuração */}
      <div className="absolute bottom-4 right-4 z-10">
        <CanConfigPanel 
          initialConfig={canConfig}
          onConfigChange={handleConfigChange}
        />
      </div>
      
      {/* Conteúdo da seção */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="max-w-4xl text-center text-white p-4 pointer-events-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Steez Hero</h1>
          <p className="text-xl mb-8">Energia que transforma seu dia</p>
        </div>
      </div>
    </section>
  );
}