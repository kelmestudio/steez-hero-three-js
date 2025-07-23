"use client";

import { Button } from "@/components/ui/button";
import ScrollIndicator from "@/components/scroll-indicator";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

interface CompraSectionProps {
  scrollToSection: (id: string) => void;
  initialQuantity?: number;
  initialPrice?: number;
}

export default function CompraSection({ 
  scrollToSection, 
  initialQuantity = 6, 
  initialPrice = 12 
}: CompraSectionProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [totalPrice, setTotalPrice] = useState(initialPrice);
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
        {/* Cabeçalho do Produto */}
        <div className="w-full md:w-1/2 space-y-6 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-left">
            <h3 className="text-4xl font-bold text-[#F42254] mb-2">PINK</h3>
            <div className="flex items-center mb-3">
              <span className="text-base mr-1 text">4.9</span>
              <div className="flex">
                <span className="text-yellow-400">★★★★★</span>
              </div>
              <span className="text-sm text-gray-400 ml-1 text">
                (237 avaliações)
              </span>
            </div>
            <p className="text-base text-gray-600 mb-8">
              Ideal para quem procura uma opção mais leve, sem abdicar do
              sabor nem do estilo.
            </p>
          </div>

          {/* Seção de compra */}
          <div className="flex flex-col space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text">Pacote</span>
              <span className="text-lg font-bold">Total</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                {[
                  { value: 6, label: "06 latas", price: 12 },
                  { value: 12, label: "12 latas", price: 24 },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`${
                      quantity === option.value
                        ? "bg-pink-100 border-pink-500"
                        : "bg-gray-100"
                    } 
                      hover:bg-gray-200 rounded-full py-2 px-6 text-center text-base font-medium 
                      transition-colors ring-2 ring-transparent focus:outline-none focus:ring-pink-500`}
                    onClick={() => {
                      setQuantity(option.value);
                      setTotalPrice(option.price);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <span className="font-bold text-2xl italic">
                {totalPrice}€
              </span>
            </div>

            <Button
              size="lg"
              className="w-full bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-full mt-4"
              onClick={() => {
                // Adicionar o item ao carrinho
                const newItem = {
                  id: "steez-pink-" + quantity,
                  name: "STEEZ PINK",
                  price: totalPrice,
                  image: "/images/steez-pink-can.png",
                  quantity: 1,
                  packSize: quantity
                };
                addItem(newItem);
                router.push('/carrinho');
              }}
            >
              ADICIONAR AO CARRINHO
            </Button>
          </div>
        </div>
      </div>
      <div className="flex bottom-8 py-4">
        <ScrollIndicator
          onClick={() => scrollToSection("ingredientes")}
          section="ingredientes"
        />
      </div>
    </div>
  );
}
