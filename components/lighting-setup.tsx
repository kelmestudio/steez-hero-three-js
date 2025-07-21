"use client"

import { ReactNode } from "react"

interface LightingSetupProps {
  ambientIntensity?: number;
  directionalIntensity?: number;
  pointIntensity?: number;
  directionalPosition?: [number, number, number];
  pointPosition?: [number, number, number];
}

/**
 * Componente reutilizável para configuração de iluminação consistente
 * Valores padrão: ambiente 3.5, direcional 10, pontual 0.5
 */
export function LightingSetup({
  ambientIntensity = 3.5,
  directionalIntensity = 10,
  pointIntensity = 0.5,
  directionalPosition = [10, 10, 5],
  pointPosition = [-10, -10, -5]
}: LightingSetupProps) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={directionalPosition} intensity={directionalIntensity} />
      <pointLight position={pointPosition} intensity={pointIntensity} />
    </>
  )
}