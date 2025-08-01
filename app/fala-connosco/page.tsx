"use client";

import SimpleLayout from "@/layouts/simple-layout";
import ContatoSection from "@/components/contato-section";

export default function FalaConnoscoPage() {
  const scrollToSection = (id: string) => {
    // Para páginas simples, podemos implementar navegação ou deixar vazio
    console.log(`Navegação para: ${id}`);
  };

  return (
    <SimpleLayout>
      <div className="min-h-screen flex items-center justify-center">
        <ContatoSection scrollToSection={scrollToSection} />
      </div>
    </SimpleLayout>
  );
}
