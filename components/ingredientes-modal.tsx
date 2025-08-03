"use client";

import { useState, useEffect } from "react";
import { X, Droplet, Wine, Flower2, Flame, Leaf } from "lucide-react";
import { Button } from "./ui/button";

interface IngredientesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IngredientesModal({ isOpen, onClose }: IngredientesModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden"; // Impede rolagem do conteúdo por trás do modal
    } else {
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "auto"; // Restaura rolagem
      }, 300); // Tempo da animação
    }

    // Limpa ao desmontar
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay com efeito blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-hidden transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Botão fechar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-left mb-8 text-[#F42254]">Ingredientes</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-pink-100 p-3 rounded-full">
                <Droplet className="h-6 w-6 text-[#F42254]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg h-1">Água carbonatada</h3>
                <p className="text-gray-600">Base refrescante para a bebida</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-pink-100 p-3 rounded-full">
                <Wine className="h-6 w-6 text-[#F42254]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg h-1">Gin Cítrico 8Colunas</h3>
                <p className="text-gray-600">Base alcoólica especial</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-pink-100 p-3 rounded-full">
                <Flower2 className="h-6 w-6 text-[#F42254]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg h-1">Aromas naturais</h3>
                <p className="text-gray-600">Essências de frutas cítricas</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-pink-100 p-3 rounded-full">
                <Leaf className="h-6 w-6 text-[#F42254]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-lg h-1">Adoçante natural: Stevia</h3>
                <p className="text-gray-600">Adoçante de baixa caloria</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center">
            <Button 
              className="bg-[#F42254] hover:bg-[#d41b48] text-white px-8 py-6 text-lg font-medium rounded-full w-full"
              onClick={onClose}
            >
              FECHAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
