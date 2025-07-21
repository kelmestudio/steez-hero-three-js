"use client"

import { ReactNode } from "react"

interface LightingSetupProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
  pointIntensity?: number;
}

/**
 * Componente reutilizável para configuração de iluminação consistente
 */
export function LightingSetup({
  ambientIntensity = 9.5,
  directionalIntensity = 1,
  pointIntensity = 0.5
}: LightingSetupProps) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[10, 10, 5]} intensity={directionalIntensity} />
      <pointLight position={[-10, -10, -5]} intensity={pointIntensity} />
    </>
  )
}