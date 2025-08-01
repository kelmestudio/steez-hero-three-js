"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PinkSection from "@/components/pink-section";
import { AnimatedCan } from "@/components/animated-can";
import { NoInteraction } from "@/lib/no-interaction";

export default function LojaPage() {
  const [quantity] = useState(6);
  const [totalPrice] = useState(12);

  // Configuração específica para a lata na página da loja
  const canConfig = useMemo(() => ({
    pink: {
      position: [-6, -4, 10] as [number, number, number],
      rotation: [0, Math.PI * 1.75, Math.PI * 0.1] as [number, number, number],
      scale: 0.7,
      visible: true,
    },
  }), []);

  const scrollToSection = (id: string) => {
    // Para páginas simples, podemos implementar navegação ou deixar vazio
    console.log(`Navegação para: ${id}`);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <Header activeSection="" scrollToSection={() => {}} />
      
      {/* Canvas 3D - Lata animada */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-20">
        <Canvas
          camera={{ position: [0, 1, 50], fov: 16 }}
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            precision: "highp" 
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          {/* Sistema de iluminação */}
          <ambientLight intensity={10} />
          <directionalLight
            position={[5, 6, 5]}
            intensity={1.2}
            color="#ffffff"
          />

          <Suspense fallback={null}>
            <NoInteraction />
            <AnimatedCan
              scrollY={0}
              activeSection="pink"
              sectionConfigs={canConfig}
              metalness={0.95}
              roughness={0.15}
              envMapIntensity={2.0}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center pt-20">
        <PinkSection
          scrollToSection={scrollToSection}
          initialQuantity={quantity}
          initialPrice={totalPrice}
        />
      </main>
    </div>
  );
}
