"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection({ faq }: { faq: FAQ[] }) {
  // Função mais robusta para impedir qualquer navegação por teclado nos accordions
  const preventKeyboardNavigation = (e: React.KeyboardEvent) => {
    // Impede qualquer tipo de navegação ou ativação por teclado
    e.stopPropagation();
    // Para teclas que poderiam interagir com o accordion
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
        e.key === 'Space' || e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
    }
  };

  // Impede que o mouse ative o foco nos elementos
  const preventFocus = (e: React.MouseEvent) => {
    e.currentTarget.blur();
  };

  return (
    <div 
      className="w-full" 
      onKeyDown={preventKeyboardNavigation}
      onClick={preventFocus}
    >
      <Accordion 
        type="single" 
        collapsible 
        className="space-y-4 [&>[data-state=closed]]:pb-0"
        onKeyDown={preventKeyboardNavigation}
      >
        {faq.map((item, index) => (
            <AccordionItem 
              key={`faq-${index}`} 
              value={`faq-${index}`} 
              className="border rounded-xl overflow-hidden bg-white shadow-sm [&[data-state=closed]]:pb-0"
              data-keyboard-focusable="false"
              aria-disabled="true"
              onFocus={(e) => e.target.blur()}
            >
              <AccordionTrigger 
                className="px-6 py-4 hover:no-underline hover:bg-gray-50 text-left outline-none focus:outline-none" 
                tabIndex={-1}
                onKeyDown={(e) => e.preventDefault()}
                onFocus={(e) => e.target.blur()}
              >
                <h3 className="text-base md:text-lg font-medium m-0">{item.question}</h3>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-0">
                <p className="text-xl text-gray-600">
                  {item.answer}
                </p>
              </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
}

// Estilos globais para sobrescrever o comportamento padrão do Radix UI
// Isso garante que o accordion não responda a eventos de teclado
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
      [data-keyboard-focusable="false"] {
        pointer-events: auto !important;
      }
      [data-keyboard-focusable="false"] * {
        outline: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);
  });
}