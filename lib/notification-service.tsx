"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';

// Tipos para as notificações
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Interface para o contexto de notificações
interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    message: string, 
    type?: 'success' | 'error' | 'info' | 'warning',
    duration?: number
  ) => void;
  hideNotification: (id: string) => void;
}

// Criar o contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider do contexto
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Função para mostrar uma notificação
  const showNotification = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    
    // Adicionar notificação à lista
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    // Remover a notificação após o tempo especificado
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, duration);
    
    return id;
  }, []);

  // Função para esconder uma notificação específica
  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
      <NotificationContainer notifications={notifications} onHide={hideNotification} />
    </NotificationContext.Provider>
  );
}

// Hook para usar o contexto de notificações
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Componente para renderizar as notificações
function NotificationContainer({ 
  notifications, 
  onHide 
}: { 
  notifications: Notification[], 
  onHide: (id: string) => void 
}) {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`rounded-lg shadow-lg p-4 text-white min-w-80 max-w-md flex justify-between items-center animate-fade-in ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' :
            notification.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
          }`}
        >
          <p>{notification.message}</p>
          <button 
            onClick={() => onHide(notification.id)}
            className="ml-2 text-white hover:text-gray-200"
            aria-label="Fechar notificação"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// Keyframes para animação de fade-in
const styles = `
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;

// Inject estilo para a animação
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
