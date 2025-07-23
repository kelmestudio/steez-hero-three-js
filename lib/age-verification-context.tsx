"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AgeVerification from '@/components/age-verification';

interface AgeVerificationContextType {
  isVerified: boolean;
  setVerified: (value: boolean) => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export function AgeVerificationProvider({ children }: { children: ReactNode }) {
  // Estado para verificar se a idade foi verificada
  const [isVerified, setIsVerified] = useState(true); // Inicialmente true para prevenir flash do conteúdo
  const [isLoading, setIsLoading] = useState(true);

  // Verifica localStorage quando o componente é montado
  useEffect(() => {
    // Verificar se a idade já foi confirmada anteriormente
    const ageVerified = localStorage.getItem('steez-age-verified') === 'true';
    
    setIsVerified(ageVerified);
    setIsLoading(false);
  }, []);

  // Função para marcar como verificado
  const handleVerified = () => {
    setIsVerified(true);
  };

  // Não renderiza nada durante o carregamento inicial
  if (isLoading) {
    return null;
  }

  return (
    <AgeVerificationContext.Provider value={{ isVerified, setVerified: setIsVerified }}>
      {!isVerified && <AgeVerification onVerified={handleVerified} />}
      <div className={!isVerified ? 'blur-sm pointer-events-none' : ''}>
        {children}
      </div>
    </AgeVerificationContext.Provider>
  );
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
}
