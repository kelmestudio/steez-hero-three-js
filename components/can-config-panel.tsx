"use client"

import React, { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent } from "react";

// Tipos compatíveis com o arquivo principal
type SectionConfig = {
  position: [number, number, number]; // Array tipado com exatamente 3 elementos
  rotation: [number, number, number]; // Array tipado com exatamente 3 elementos
  scale: number;
  visible: boolean;
};

type CanConfigs = {
  [key: string]: SectionConfig;
};

interface CanConfigPanelProps {
  configs: CanConfigs;
  onConfigChange: (newConfigs: CanConfigs) => void; // Mudança: função direta ao invés de Dispatch
  activeSection: string;
}

/**
 * Componente CanConfigPanel - Controle de configurações da lata 3D
 * CORRIGIDO: Removido loop infinito causado por useEffect que chamava onConfigChange
 * nas dependências. Agora onConfigChange é chamado diretamente nos handlers.
 */
export function CanConfigPanel({ configs, onConfigChange, activeSection }: CanConfigPanelProps) {
  // Estado local para edições - inicializado com configs prop
  const [localConfigs, setLocalConfigs] = useState<CanConfigs>(() => ({ ...configs }));
  
  // Sincronizar configs externos com estado local apenas quando configs prop muda
  useEffect(() => {
    setLocalConfigs({ ...configs });
  }, [configs]);

  // Handler para atualizar configurações - agora chama onConfigChange diretamente
  const handleConfigChange = useCallback((
    section: string, 
    property: 'position' | 'rotation' | 'scale' | 'visible', 
    value: number | boolean,
    index?: number
  ) => {
    setLocalConfigs(prevConfigs => {
      const newConfigs = { ...prevConfigs };
      
      if (property === 'scale') {
        newConfigs[section] = {
          ...newConfigs[section],
          scale: value as number
        };
      } else if (property === 'visible') {
        newConfigs[section] = {
          ...newConfigs[section],
          visible: value as boolean
        };
      } else if (index !== undefined) {
        const newArray = [...newConfigs[section][property]];
        newArray[index] = value as number;
        newConfigs[section] = {
          ...newConfigs[section],
          [property]: newArray
        };
      }
      
      // Chamar onConfigChange imediatamente com as novas configurações
      onConfigChange(newConfigs);
      
      return newConfigs;
    });
  }, [onConfigChange]);
  
  // Resetar para configurações originais
  const handleReset = useCallback(() => {
    const resetConfigs = { ...configs };
    setLocalConfigs(resetConfigs);
    onConfigChange(resetConfigs);
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
      
      {/* Visibilidade */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.visible}
            onChange={(e) => handleConfigChange(
              activeSection, 'visible', e.target.checked
            )}
            className="w-4 h-4"
          />
          <label className="text-sm font-semibold">Visível</label>
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