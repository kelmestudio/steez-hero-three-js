"use client";

import { Info } from "lucide-react";
import ScrollIndicator from "@/components/scroll-indicator";
import { Button } from "@/components/ui/button";

interface IngredientesSectionProps {
  scrollToSection: (id: string) => void;
  onOpenModal?: () => void;
}

export default function IngredientesSection({ scrollToSection, onOpenModal }: IngredientesSectionProps) {
  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between gap-4 md:gap-8 text-center lg:text-left">
        {/* Coluna de texto com os ingredientes */}
        <div className="w-full lg:w-1/2 gap-4 z-10 flex flex-col items-center lg:items-start">
          <div className="text-center lg:text-left max-w-md lg:max-w-none">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <span className="text-sm font-medium text-[#F42254] tracking-wide text">
                INGREDIENTES
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-black">
              NATURAL ATÉ O ÚLTIMO GOLE
            </h2>
            <p className="text-lg text-gray-600 ">
              Feita com Gin Cítrico com aromas e extratos naturais, adoçado
              com Stevia. Sabor autêntico.
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-start gap-5 w-full">
            <div className="flex-row flex items-center gap-3 bg-white rounded-lg p-4 shadow-md w-full max-w-sm">
              <div className="bg-gray-100 rounded-full p-3 flex-shrink-0">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                Tamanhos disponíveis:{" "}
                <span className="bg-gray-100 py-1 px-3 rounded-full text-sm">
                  250ml
                </span>
              </p>
            </div>

            <Button
              size="lg"
              className="bg-[#181818] text-white hover:opacity-0.5 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-full w-full max-w-xs"
              onClick={onOpenModal}
            >
              VER INGREDIENTES
            </Button>
          </div>
        </div>
      </div>

      
    </div>
  );
}
