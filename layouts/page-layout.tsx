"use client";

import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

/**
 * Layout padrão para páginas de conteúdo como Termos de Uso e Política de Privacidade
 * 
 * @param title - O título da página
 * @param children - O conteúdo da página (pode ser HTML ou markdown processado)
 * @param description - Descrição opcional para SEO
 */
export default function PageLayout({ title, children, description }: PageLayoutProps) {
  // Função para simular o comportamento de navegação do header sem scroll
  const scrollToSection = (id: string) => {
    // Redireciona para a home com a âncora correspondente
    window.location.href = `/#${id}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (reaproveitando componente existente) */}
      <Header activeSection="" scrollToSection={scrollToSection} />
      
      {/* Conteúdo principal */}
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Cabeçalho da página */}
          <div className="py-12 mb-8 border-b border-gray-200">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
            {description && (
              <p className="text-lg text-gray-600">{description}</p>
            )}
          </div>
          
          {/* Conteúdo da página - pode ser HTML ou markdown renderizado */}
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
          
          {/* Data de atualização */}
          <div className="mt-16 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <div className="bg-[#181818]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}
