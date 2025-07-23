"use client";

import { BanIcon, CandyOff, WheatOff } from "lucide-react";
import ScrollIndicator from "@/components/scroll-indicator";

interface BeneficiosSectionProps {
  scrollToSection: (id: string) => void;
}

export default function BeneficiosSection({ scrollToSection }: BeneficiosSectionProps) {
  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-4 md:gap-16">
        {/* Coluna de texto com os benefícios */}
        <div className="w-full md:w-1/2 space-y-8 z-10">
          <div className="text-left">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-[#F42254] tracking-wide text">
                BENEFÍCIOS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
              STEEZ PINK É{" "}
              <span className="relative inline-block">
                ZERO
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-[#F42254]"></span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Desfrute sem culpa. Criado para quem quer curtir com estilo e
              manter o equilíbrio.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {/* Benefício 1 - Zero açúcares */}
            <div className="flex flex-col items-center text-center group bg-white rounded-2xl shadow-xl p-6 w-full md:w-1/3">
              <div className="bg-[#F42254] p-4 rounded-full text-white shadow-lg mb-4 transform transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                <CandyOff className="h-8 w-8" />
              </div>
              <p className="text-xl font-bold">Zero açúcares</p>
            </div>

            {/* Benefício 2 - Zero glúten */}
            <div className="flex flex-col items-center text-center group bg-white rounded-2xl shadow-xl p-6 w-full md:w-1/3">
              <div className="bg-[#F42254] p-4 rounded-full text-white shadow-lg mb-4 transform transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                <WheatOff className="h-8 w-8" />
              </div>
              <p className="text-xl font-bold">Zero glúten</p>
            </div>

            {/* Benefício 3 - Zero culpa */}
            <div className="flex flex-col items-center text-center group bg-white rounded-2xl shadow-xl p-6 w-full md:w-1/3">
              <div className="bg-[#F42254] p-4 rounded-full text-white shadow-lg mb-4 transform transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                <BanIcon className="h-8 w-8" />
              </div>
              <p className="text-xl font-bold">Zero culpa</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex pt-10">
        <ScrollIndicator
          onClick={() => scrollToSection("compra")}
          section="compra"
        />
      </div>
    </div>
  );
}
