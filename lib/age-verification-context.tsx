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
  const [isVerified, setIsVerified] = useState(false); // Inicialmente falso para mostrar o modal
  const [isLoading, setIsLoading] = useState(true);
  
  // Constante para a chave de armazenamento, para evitar erros de digitação
  const AGE_VERIFICATION_KEY = 'steez-age-verified';

  // Verifica localStorage quando o componente é montado (apenas no cliente)
  useEffect(() => {
    // Assegurar que o código só roda no cliente
    if (typeof window === 'undefined') return;
    
    try {
      // Verificar se a idade já foi confirmada anteriormente
      const ageVerified = localStorage.getItem(AGE_VERIFICATION_KEY) === 'true';
      setIsVerified(ageVerified);
    } catch (error) {
      // Em caso de erro com localStorage, presumir não verificado
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para marcar como verificado com tratamento de erros
  const handleVerified = () => {
    setIsVerified(true);
    
    // Tentar salvar no localStorage (já tratado no componente AgeVerification)
    try {
      localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
    } catch (error) {
      // Falhar silenciosamente em produção
    }
  };

  // Não renderiza nada durante o carregamento inicial para evitar flash
  if (isLoading) {
    return null;
  }

  return (
    <AgeVerificationContext.Provider value={{ isVerified, setVerified: setIsVerified }}>
      {!isVerified && <AgeVerification onVerified={handleVerified} />}
      <div 
        className={!isVerified ? 'blur-sm pointer-events-none transition-all duration-300' : ''}
        aria-hidden={!isVerified}
      >
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
