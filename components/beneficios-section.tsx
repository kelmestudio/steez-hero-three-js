"use client";

import { BanIcon, CandyOff, WheatOff } from "lucide-react";
import ScrollIndicator from "@/components/scroll-indicator";

interface BeneficiosSectionProps {
  scrollToSection: (id: string) => void;
}

export default function BeneficiosSection({ scrollToSection }: BeneficiosSectionProps) {
  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:justify-between gap-4 md:gap-16">
        {/* Coluna de texto com os benefícios */}
        <div className="w-full lg:w-1/2 space-y-8 z-10 flex flex-col items-center lg:items-start">
          <div className="text-center lg:text-left max-w-md lg:max-w-none">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <span className="text-sm font-medium text-[#F42254] tracking-wide text">
                BENEFÍCIOS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              STEEZ PINK É{" "}
              <span className="relative inline-block z-2">
                ZERO
                <svg width="106" height="20" viewBox="0 0 63 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-1">
                  <g style={{ mixBlendMode: "multiply" }}>
                    <path d="M1.5 8C4.09301 6.54791 7.96261 5.7098 11.0753 4.99099C14.5113 4.19752 18.0987 3.66286 21.6287 3.11712C23.0708 2.89416 23.0137 3.07443 23.5077 4C23.8599 4.65979 24.1544 5.21499 25.0779 5.56757C27.099 6.33927 30.1231 6.07483 32.2851 5.94595C39.2592 5.53018 46.2245 4.2024 53.0315 3.11712C56.0621 2.63394 58.4328 2 61.5 2" stroke="#F42254" strokeWidth="3" strokeLinecap="round" />
                  </g>
                </svg>
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Desfruta sem culpa. Criado para quem quer curtir com estilo e
              manter o equilíbrio.
            </p>
          </div>

          <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-6 w-full">
            {/* Benefício 1 - Zero açúcares */}
            <div className="flex flex-col items-center text-center group bg-white rounded-xl lg:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 w-full">
              <div className="bg-[#F42254] p-2 sm:p-3 lg:p-4 rounded-full text-white shadow-lg mb-2 lg:mb-4 transform transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                <CandyOff className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
              </div>
              <p className="text-sm sm:text-base lg:text-xl font-bold">Zero açúcares</p>
            </div>

            {/* Benefício 2 - Zero glúten */}
            <div className="flex flex-col items-center text-center group bg-white rounded-xl lg:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 w-full">
              <div className="bg-[#F42254] p-2 sm:p-3 lg:p-4 rounded-full text-white shadow-lg mb-2 lg:mb-4 transform transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                <WheatOff className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
              </div>
              <p className="text-sm sm:text-base lg:text-xl font-bold">Zero glúten</p>
            </div>

            {/* Benefício 3 - Zero culpa */}
            <div className="flex flex-col items-center text-center group bg-white rounded-xl lg:rounded-2xl shadow-xl p-3 sm:p-4 lg:p-6 w-full">
              <div className="bg-[#F42254] p-2 sm:p-3 lg:p-4 rounded-full text-white shadow-lg mb-2 lg:mb-4 transform transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                <BanIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
              </div>
              <p className="text-sm sm:text-base lg:text-xl font-bold">Zero culpa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
