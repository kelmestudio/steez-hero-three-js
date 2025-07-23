"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Carregar dados do carrinho ao iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("steezCart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
    }
  }, []);
  
  // Salvar dados do carrinho quando mudar
  useEffect(() => {
    try {
      localStorage.setItem("steezCart", JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    // Garantir que o preço está correto baseado no tamanho do pacote
    const basePrice = item.packSize === 6 ? 12 : 24;
    const calculatedPrice = basePrice * item.quantity;
    
    // Criar um item com o preço calculado corretamente
    const itemWithCalculatedPrice = {
      ...item,
      price: calculatedPrice
    };
    
    setItems(prevItems => {
      // Verifica se o item já existe no carrinho
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Atualiza a quantidade se o item já existe e recalcula o preço
        return prevItems.map(i => {
          if (i.id === item.id) {
            const newQuantity = i.quantity + item.quantity;
            const newPrice = (i.packSize === 6 ? 12 : 24) * newQuantity;
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
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          // Calcula o preço unitário baseado no tamanho do pacote
          const unitPrice = item.packSize === 6 ? 12 : 24;
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
  };

  const clearCart = () => {
    setItems([]);
  };

  // Função para atualizar o tamanho do pacote (6 ou 12 latas)
  const updatePackSize = (id: string, packSize: number, newPrice: number) => {
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
  };

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
