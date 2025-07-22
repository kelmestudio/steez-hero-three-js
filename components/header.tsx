"use client";

import { ShoppingCart } from "lucide-react";
import Steez from "@/components/svg/steez";

interface HeaderProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

export default function Header({ activeSection, scrollToSection }: HeaderProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Steez />
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => scrollToSection("inicio")}
            className={`text-sm font-medium transition-colors border-b-2 ${
              activeSection === "inicio"
                ? "text-black border-red-500"
                : "text-gray-600 border-transparent hover:text-red-500"
            }`}
          >
            INÍCIO
          </button>
          <button
            onClick={() => scrollToSection("loja")}
            className={`text-sm font-medium transition-colors border-b-2 ${
              activeSection === "loja"
                ? "text-black border-red-500"
                : "text-gray-600 border-transparent hover:text-red-500"
            }`}
          >
            LOJA
          </button>
          <button
            onClick={() => scrollToSection("sobre")}
            className={`text-sm font-medium transition-colors border-b-2 ${
              activeSection === "sobre"
                ? "text-black border-red-500"
                : "text-gray-600 border-transparent hover:text-red-500"
            }`}
          >
            SOBRE NÓS
          </button>
          <button
            onClick={() => scrollToSection("contato")}
            className={`text-sm font-medium transition-colors border-b-2 ${
              activeSection === "contato"
                ? "text-black border-red-500"
                : "text-gray-600 border-transparent hover:text-red-500"
            }`}
          >
            CONTATO
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">CARRINHO</span>
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}