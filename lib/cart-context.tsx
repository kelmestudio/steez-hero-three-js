"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  packSize: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updatePackSize: (id: string, packSize: number, newPrice: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CART_STORAGE_KEY = "steezCart";
const CartContext = createContext<CartContextType | undefined>(undefined);

// Função para verificar se estamos no navegador (não SSR)
const isBrowser = typeof window !== 'undefined';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Função para carregar dados do carrinho com segurança
  const loadCart = useCallback(() => {
    if (!isBrowser) return;
    
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validar que é um array antes de usar
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setIsInitialized(true);
    }
  }, []);
  
  // Carregar dados do carrinho ao iniciar
  useEffect(() => {
    loadCart();
  }, [loadCart]);
  
  // Salvar dados do carrinho quando mudar
  useEffect(() => {
    if (!isBrowser || !isInitialized) return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  }, [items, isInitialized]);

  // Função para calcular o preço base de um pacote
  const calculateBasePrice = useCallback((packSize: number): number => {
    return packSize === 6 ? 12 : 24;
  }, []);

  // Função otimizada para adicionar itens ao carrinho
  const addItem = useCallback((item: CartItem) => {
    // Validar entrada
    if (!item || typeof item !== 'object' || !item.packSize) {
      console.error("Item inválido adicionado ao carrinho");
      return;
    }
    
    // Garantir que o preço está correto baseado no tamanho do pacote
    const basePrice = calculateBasePrice(item.packSize);
    const calculatedPrice = basePrice * Math.max(1, item.quantity); // Garantir quantidade mínima de 1
    
    // Criar um item com o preço calculado corretamente
    const itemWithCalculatedPrice = {
      ...item,
      price: calculatedPrice,
      quantity: Math.max(1, item.quantity) // Garantir quantidade mínima de 1
    };
    
    setItems(prevItems => {
      // Verifica se o item já existe no carrinho
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Atualiza a quantidade se o item já existe e recalcula o preço
        return prevItems.map(i => {
          if (i.id === item.id) {
            const newQuantity = i.quantity + item.quantity;
            const newPrice = calculateBasePrice(i.packSize) * newQuantity;
            return { 
              ...i, 
              quantity: newQuantity,
              price: newPrice
            };
          }
          return i;
        });
      } else {
        // Adiciona novo item se não existe
        return [...prevItems, itemWithCalculatedPrice];
      }
    });
  }, [calculateBasePrice]);

  const removeItem = useCallback((id: string) => {
    if (!id) return;
    
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!id || quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          // Calcula o preço unitário baseado no tamanho do pacote
          const unitPrice = calculateBasePrice(item.packSize);
          return { 
            ...item, 
            quantity,
            // Atualiza o preço total baseado na nova quantidade
            price: unitPrice * quantity
          };
        }
        return item;
      })
    );
  }, [calculateBasePrice]);

  const clearCart = useCallback(() => {
    setItems([]);
    // Também limpar o localStorage para garantir consistência
    if (isBrowser) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  // Função para atualizar o tamanho do pacote (6 ou 12 latas)
  const updatePackSize = useCallback((id: string, packSize: number, newPrice: number) => {
    if (!id || ![6, 12].includes(packSize) || newPrice <= 0) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { 
          ...item, 
          packSize, 
          price: newPrice * item.quantity, // Atualiza o preço baseado na quantidade atual
          id: item.id.replace(/\d+$/, packSize.toString()) // Atualiza o ID para refletir o novo tamanho do pacote
        } : item
      )
    );
  }, []);

  // Calcular o número total de itens no carrinho
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Calcular o valor total do carrinho
  const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updatePackSize,
    clearCart,
    itemCount,
    total
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
