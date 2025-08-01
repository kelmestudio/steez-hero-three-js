"use client";

import { useState } from 'react';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useNotifications } from "@/lib/notification-service";
import Header from "@/components/header";

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, updatePackSize, total } = useCart();
  const [shippingCost, setShippingCost] = useState(2);
  const [postalCode, setPostalCode] = useState("");
  const [shippingCalculated, setShippingCalculated] = useState(false);
  
  // Função para simular o comportamento de navegação do header sem scroll
  const scrollToSection = (id: string) => {
    // Redireciona para a home com a âncora correspondente
    window.location.href = `/#${id}`;
  };
  
  const { showNotification } = useNotifications();

  const handleDecrement = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  };
  
  const handleIncrement = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    showNotification('Item removido do carrinho', 'error');
  };
  
  // Função para calcular o preço com base no tamanho do pacote
  const calculatePrice = (packSize: number): number => {
    return packSize === 6 ? 12 : 24;
  };
  
  // Função para atualizar o tamanho do pacote
  const handlePackSizeChange = (id: string, packSize: number) => {
    const unitPrice = calculatePrice(packSize);
    updatePackSize(id, packSize, unitPrice);
  };
  
  // Função para formatar e validar o código postal português
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove caracteres não numéricos e hífens
    value = value.replace(/[^\d-]/g, '');
    
    // Formato ####-###
    if (value.length > 0) {
      // Insere o hífen automaticamente após 4 dígitos
      if (value.length > 4 && !value.includes('-')) {
        value = value.substring(0, 4) + '-' + value.substring(4);
      }
      
      // Limita ao tamanho máximo (8 caracteres incluindo hífen)
      if (value.length > 8) {
        value = value.substring(0, 8);
      }
    }
    
    setPostalCode(value);
  };
  
  // Função para validar o código postal completo
  const isValidPostalCode = (code: string): boolean => {
    // Deve corresponder ao formato ####-### (4 dígitos, hífen, 3 dígitos)
    const regex = /^\d{4}-\d{3}$/;
    return regex.test(code);
  };

  return (
    <div className="min-h-screen bg-white pb-10 px-4 sm:px-6">
      {/* Header com navegação */}
      <Header activeSection="" scrollToSection={scrollToSection} />
      
      <div className="max-w-6xl mx-auto pt-20">
        <Link href="/" className="flex items-center text-gray-600 hover:text-black mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Voltar para loja</span>
        </Link>

        <h1 className="text-3xl font-bold mb-10 text-center">CARRINHO</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Produtos no carrinho - coluna principal */}
          <div className="lg:col-span-8">
            <div className="border-b border-gray-200 pb-2 mb-4 grid grid-cols-2">
              <div className="font-medium text-gray-700">Produto</div>
              <div className="font-medium text-gray-700 text-right">Quantidade</div>
            </div>

            {items.length > 0 ? (
              <>
                {items.map(item => (
                  <div key={item.id} className="grid grid-cols-12 items-center py-6 border-b border-gray-200">
                    {/* Imagem do produto */}
                    <div className="col-span-2">
                      <div className="relative h-24 w-16">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill
                          style={{objectFit: 'contain'}}
                        />
                      </div>
                    </div>

                    {/* Detalhes do produto */}
                    <div className="col-span-4">
                      <h3 className="font-bold">{item.name}</h3>
                      
                      {/* Seleção de pacote */}
                      <div className="mt-2 mb-2">
                        <div className="flex space-x-2">
                          <button
                            className={`text-xs py-1 px-3 rounded-full ${
                              item.packSize === 6 
                                ? "bg-pink-100 text-[#F42254] border border-[#F42254]" 
                                : "bg-gray-100 text-gray-600 border border-transparent"
                            }`}
                            onClick={() => handlePackSizeChange(item.id, 6)}
                          >
                            6 latas
                          </button>
                          <button
                            className={`text-xs py-1 px-3 rounded-full ${
                              item.packSize === 12 
                                ? "bg-pink-100 text-[#F42254] border border-[#F42254]" 
                                : "bg-gray-100 text-gray-600 border border-transparent"
                            }`}
                            onClick={() => handlePackSizeChange(item.id, 12)}
                          >
                            12 latas
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col mt-1">
                        <p className="font-bold">{item.packSize === 6 ? 12 : 24}€ por pacote</p>
                        <p className="text-sm text-gray-600">Total: {item.price}€</p>
                      </div>
                    </div>

                    {/* Quantidade */}
                    <div className="col-span-4 flex items-center justify-end">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 mb-1">Quantidade de pacotes</span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            className="p-2" 
                            onClick={() => handleDecrement(item.id, item.quantity)}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button 
                            className="p-2" 
                            onClick={() => handleIncrement(item.id, item.quantity)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="col-span-2 text-right">
                      <button 
                        className="text-sm text-gray-500 hover:text-red-500 underline"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                <Link href="/" className="text-[#F42254] hover:underline">
                  Voltar às compras
                </Link>
              </div>
            )}
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Portes de envio estimado</h2>
              
              {/* Seletor de país */}
              <div className="mb-4">
                <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  <option>Portugal</option>
                </select>
              </div>

              {/* Código postal */}
              <div className="mb-2">
                <label htmlFor="postalCode" className="block text-sm text-gray-600 mb-1">
                  Código postal (####-###)
                </label>
                <div className="relative">
                  <input 
                    id="postalCode"
                    type="text" 
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    placeholder="1000-100" 
                    className={`w-full p-2 border rounded-md ${
                      postalCode && !isValidPostalCode(postalCode) 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  {postalCode && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setPostalCode('');
                        setShippingCalculated(false);
                        setShippingCost(2);
                      }}
                      aria-label="Limpar código postal"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {postalCode && !isValidPostalCode(postalCode) && (
                  <p className="text-red-500 text-xs mt-1">
                    Por favor, insira um código postal válido no formato ####-###
                  </p>
                )}
              </div>

              <div className="text-sm mb-2">
                {shippingCalculated ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Entrega para <span className="font-medium">{postalCode}</span></span>
                    <span className="font-medium text-green-600">{shippingCost}€</span>
                  </div>
                ) : (
                  <span className="text-gray-500">
                    Insira o código postal para calcular o envio
                  </span>
                )}
              </div>

              <button 
                className={`w-full py-2 rounded-md mb-6 ${
                  !postalCode || !isValidPostalCode(postalCode)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                disabled={!postalCode || !isValidPostalCode(postalCode)}
                onClick={() => {
                  if (isValidPostalCode(postalCode)) {
                    // Simulação de cálculo de Portes de envio com base no código postal
                    // Normalmente isto seria uma chamada a uma API de Portes de envio
                    const firstDigit = parseInt(postalCode.charAt(0));
                    let newShippingCost = 2; // valor base
                    
                    // Simula diferentes custos baseados no primeiro dígito do CP
                    if (firstDigit > 5) {
                      newShippingCost = 3; // Sul e ilhas: mais caro
                    } else if (firstDigit < 2) {
                      newShippingCost = 1.5; // Lisboa e arredores: mais barato
                    }
                    
                    setShippingCost(newShippingCost);
                    setShippingCalculated(true);
                    showNotification(`Portes de envio calculado: ${newShippingCost}€`, 'success');
                  }
                }}
              >
                CALCULAR PORTES DE ENVIO
              </button>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-medium">{total}€</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Taxa de entrega</span>
                  <span className="font-medium">{shippingCost}€</span>
                </div>
                
                {/* Resumo dos itens */}
                <div className="mt-4 mb-4 pt-2 border-t border-gray-100">
                  <h3 className="text-sm font-medium mb-2">Detalhes do pedido:</h3>
                  {items.map(item => (
                    <div key={`summary-${item.id}`} className="flex justify-between text-sm mb-1">
                      <span>{item.quantity}x Pacote {item.packSize} latas</span>
                      <span>{item.price}€</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{total + shippingCost}€</span>
                </div>
              </div>

              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md"
                disabled={items.length === 0}
                onClick={() => {
                  if (items.length > 0) {
                    // Aqui você implementaria a finalização do pedido
                    showNotification('Pedido finalizado com sucesso!', 'success');
                    
                    // Em uma implementação real, você enviaria os dados para processamento
                    // e redirecionaria para uma página de confirmação
                    
                    // Para demonstração, simplesmente mostrar uma notificação de sucesso
                    // Sem usar alert (melhor experiência do usuário)
                    setTimeout(() => {
                      // Em produção, você redirecionaria para uma página de confirmação
                      // router.push('/confirmacao-pedido');
                      showNotification('Obrigado pela sua compra!', 'success', 5000);
                    }, 1000);
                  }
                }}
              >
                FINALIZAR PEDIDO
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
