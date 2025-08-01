"use client";

import SimpleLayout from "@/layouts/simple-layout";
import AboutSection from "@/components/about-section";

export default function SobreNosPage() {
  const scrollToSection = (id: string) => {
    // Para páginas simples, podemos implementar navegação ou deixar vazio
    console.log(`Navegação para: ${id}`);
  };

  return (
    <SimpleLayout>
      <div className="min-h-screen flex items-center justify-center">
        <AboutSection scrollToSection={scrollToSection} />
      </div>
    </SimpleLayout>
  );
}
