"use client"

import React, { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from "react";

// Tipos
type SectionConfig = {
  position: number[];
  rotation: number[];
  scale: number;
};

type CanConfigs = {
  [key: string]: SectionConfig;
};

interface CanConfigPanelProps {
  configs: CanConfigs;
  onConfigChange: React.Dispatch<React.SetStateAction<CanConfigs>>;
  activeSection: string;
}

/**
 * Componente CanConfigPanel - Controle de configurações da lata 3D
 * Corrigido para evitar chamadas de setState durante a renderização
 */
export function CanConfigPanel({ configs, onConfigChange, activeSection }: CanConfigPanelProps) {
  // Estado local para edições
  const [localConfigs, setLocalConfigs] = useState<CanConfigs>(configs);
  
  // UseEffect para controlar mudanças de configuração
  useEffect(() => {
    // Chamamos o callback com a configuração atual
    onConfigChange(localConfigs);
    
    // Esta é a forma correta de atualizar o componente pai (HeroSection)
    // em vez de chamar o setState diretamente durante a renderização
  }, [localConfigs, onConfigChange]);

  // Handler para atualizar configurações
  const handleConfigChange = useCallback((
    section: string, 
    property: 'position' | 'rotation' | 'scale', 
    value: number,
    index?: number
  ) => {
    setLocalConfigs(prevConfigs => {
      const newConfigs = { ...prevConfigs };
      
      if (property === 'scale') {
        newConfigs[section] = {
          ...newConfigs[section],
          scale: value
        };
      } else if (index !== undefined) {
        const newArray = [...newConfigs[section][property]];
        newArray[index] = value;
        newConfigs[section] = {
          ...newConfigs[section],
          [property]: newArray
        };
      }
      
      return newConfigs;
    });
  }, []);
  
  // Resetar para configurações originais
  const handleReset = useCallback(() => {
    setLocalConfigs(configs);
    onConfigChange(configs);
  }, [configs, onConfigChange]);
  
  // Se a seção ativa não estiver nas configurações
  if (!configs[activeSection]) return null;

  const config = localConfigs[activeSection];
  
  return (
    <div className="fixed bottom-5 left-5 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-lg z-50 w-80">
      <h3 className="font-bold text-lg mb-3">Configurações - {activeSection.toUpperCase()}</h3>
      
      {/* Posição */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2">Posição</h4>
        <div className="grid grid-cols-3 gap-2">
          {['X', 'Y', 'Z'].map((axis, i) => (
            <div key={`pos-${axis}`} className="flex flex-col">
              <label className="text-xs mb-1">{axis}</label>
              <input
                type="range"
                min="-20"
                max="20"
                step="0.1"
                value={config.position[i]}
                onChange={(e) => handleConfigChange(
                  activeSection, 'position', parseFloat(e.target.value), i
                )}
                className="w-full"
              />
              <span className="text-xs mt-1">{config.position[i].toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Rotação */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2">Rotação</h4>
        <div className="grid grid-cols-3 gap-2">
          {['X', 'Y', 'Z'].map((axis, i) => (
            <div key={`rot-${axis}`} className="flex flex-col">
              <label className="text-xs mb-1">{axis}</label>
              <input
                type="range"
                min="0"
                max={`${Math.PI * 2}`}
                step="0.1"
                value={config.rotation[i]}
                onChange={(e) => handleConfigChange(
                  activeSection, 'rotation', parseFloat(e.target.value), i
                )}
                className="w-full"
              />
              <span className="text-xs mt-1">{(config.rotation[i] / Math.PI).toFixed(2)}π</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Escala */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2">Escala</h4>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={config.scale}
            onChange={(e) => handleConfigChange(
              activeSection, 'scale', parseFloat(e.target.value)
            )}
            className="flex-1"
          />
          <span className="text-sm w-12">{config.scale.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="flex justify-end gap-2 mt-4">
        <button 
          onClick={handleReset}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
        >
          Resetar
        </button>
      </div>
    </div>
  );
}