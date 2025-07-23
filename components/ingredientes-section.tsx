"use client";

import { Info } from "lucide-react";
import ScrollIndicator from "@/components/scroll-indicator";
import { Button } from "@/components/ui/button";

interface IngredientesSectionProps {
  scrollToSection: (id: string) => void;
}

export default function IngredientesSection({ scrollToSection }: IngredientesSectionProps) {
  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16">
        {/* Coluna de texto com os ingredientes */}
        <div className="w-full md:w-1/2 space-y-8 z-10">
          <div className="text-left">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-[#F42254] tracking-wide text">
                INGREDIENTES
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-black">
              NATURAL ATÉ O ÚLTIMO GOLE
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Feita com Gin Cítrico com aromas e extratos naturais, adoçado
              com Stevia. Sabor autêntico.
            </p>
          </div>

          <div className="flex flex-col space-y-5">
            <div className="flex-row flex items-center gap-3 bg-white rounded-lg p-4 shadow-md max-w-80">
              <div className="bg-gray-100 rounded-full p-3">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-gray-700">
                Tamanhos disponíveis:{" "}
                <span className="bg-gray-100 py-1 px-3 rounded-full text-sm">
                  250ml
                </span>
              </p>
            </div>

            <Button
              size="lg"
              className="bg-[#181818] text-white hover:opacity-0.5 px-8 py-4 text-lg font-medium rounded-full w-64"
            >
              VER INGREDIENTES
            </Button>
          </div>
        </div>
      </div>

      <div className="flex bottom-8 py-4">
        <ScrollIndicator
          onClick={() => scrollToSection("sobre")}
          section="sobre"
        />
      </div>
    </div>
  );
}
