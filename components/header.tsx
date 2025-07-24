"use client";

import { ShoppingCart, Menu, X } from "lucide-react";
import Steez from "@/components/svg/steez";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

interface HeaderProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

interface NavItemProps {
  section: string;
  label: string;
  activeSection: string;
  onClick: () => void;
}

// Componente de item de navegação para garantir consistência
const NavItem = ({ section, label, activeSection, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`text-sm font-medium transition-colors border-b-2 py-1 px-1 ${
      activeSection === section
        ? "text-black border-red-500"
        : "text-gray-600 border-transparent hover:text-[#F42254]"
    }`}
    aria-current={activeSection === section ? "page" : undefined}
  >
    {label}
  </button>
);

export default function Header({ activeSection, scrollToSection }: HeaderProps) {
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mapeamento organizado das seções de navegação
  const navigationItems = [
    { section: "inicio", label: "INÍCIO" },
    { section: "beneficios", label: "BENEFÍCIOS" },
    { section: "pink", label: "PINK" },
    { section: "sobre", label: "SOBRE NÓS" },
    { section: "contato", label: "CONTACTO" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo como link para a página inicial */}
        <div className="flex items-center">
          <button 
            onClick={() => scrollToSection("inicio")} 
            className="flex items-center cursor-pointer transition-opacity hover:opacity-80"
            aria-label="Ir para página inicial"
          >
            <Steez />
          </button>
        </div>
        
        {/* Navegação desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <NavItem
              key={item.section}
              section={item.section}
              label={item.label}
              activeSection={activeSection}
              onClick={() => scrollToSection(item.section)}
            />
          ))}
        </nav>

        {/* Botão do carrinho */}
        <Link 
          href="/carrinho" 
          className="flex items-center space-x-2 group hover:text-[#F42254] transition-colors"
          aria-label={`Ver carrinho com ${itemCount} itens`}
        >
          <span className="text-md font-medium text">CARRINHO</span>
          <div className="relative">
            <ShoppingCart className="w-6 h-6 group-hover:text-[#F42254] transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
        </Link>

        {/* Botão do menu mobile */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Menu de navegação"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <button
                key={item.section}
                onClick={() => {
                  scrollToSection(item.section);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 ${
                  activeSection === item.section
                    ? "text-[#F42254] font-medium"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}