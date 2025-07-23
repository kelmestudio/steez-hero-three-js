"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AgeVerificationProps {
  onVerified: () => void;
}

export default function AgeVerification({ onVerified }: AgeVerificationProps) {
  // Estado para verificação de animação
  const [animate, setAnimate] = useState(false);
  
  // Efeito para animação ao montar o componente
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Função para confirmar a idade
  const handleConfirmAge = () => {
    // Armazena a verificação no localStorage
    localStorage.setItem('steez-age-verified', 'true');
    
    // Anima a saída do modal
    setAnimate(false);
    
    // Delay para a animação completar antes de remover o componente
    setTimeout(() => {
      onVerified();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      {/* Overlay escuro com blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      {/* Conteúdo do modal */}
      <div className={`relative bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-xl transform transition-transform duration-300 ${animate ? 'scale-100' : 'scale-95'}`}>
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-black">STEEZ</h1>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Verificação de Idade</h2>
        
        <p className="text-gray-600 mb-8">
          Para aceder, é necessário ter 18+ anos
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleConfirmAge}
            className="w-full bg-[#F42254] text-white py-3 px-6 rounded-md font-medium hover:bg-[#e01a4b] transition-colors"
          >
            Sim, tenho mais de 18 anos
          </button>
        </div>
      </div>
    </div>
  );
}
