"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Carousel, 
  CarouselContent,
  CarouselItem,
  type CarouselApi 
} from '@/components/ui/carousel';

// Re-exportar o CarouselItem para facilitar o uso
export { CarouselItem };

interface AutoplayCarouselProps {
  className?: string;
  children: React.ReactNode;
  autoplayDelay?: number;
  loop?: boolean;
  align?: "start" | "center" | "end";
}

export function AutoplayCarousel({
  className,
  children,
  autoplayDelay = 3000,
  loop = true,
  align = "start"
}: AutoplayCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  
  // Implementar autoplay manual usando useEffect
  useEffect(() => {
    if (!api) return;
    
    // Função para avançar ao próximo slide
    const autoplayNext = () => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else if (loop) {
        api.scrollTo(0); // Voltar ao início quando chegar ao último slide
      }
    };
    
    // Iniciar o intervalo de autoplay
    intervalRef.current = setInterval(autoplayNext, autoplayDelay);
    
    // Limpar intervalo quando o componente for desmontado
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [api, autoplayDelay, loop]);
  
  // Adicionar eventos de mouse para pausar/retomar o autoplay quando o mouse estiver sobre o carousel
  useEffect(() => {
    if (!api || !carouselRef.current) return;
    
    // Pausar quando o mouse estiver sobre o carousel
    const handleMouseEnter = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    
    // Retomar quando o mouse sair do carousel
    const handleMouseLeave = () => {
      if (!intervalRef.current) {
        // Função para avançar ao próximo slide
        const autoplayNext = () => {
          if (api.canScrollNext()) {
            api.scrollNext();
          } else if (loop) {
            api.scrollTo(0);
          }
        };
        
        intervalRef.current = setInterval(autoplayNext, autoplayDelay);
      }
    };
    
    // Adicionar event listeners
    const element = carouselRef.current;
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Limpar event listeners quando o componente for desmontado
    return () => {
      if (element) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [api, autoplayDelay, loop]);

  return (
    <div className={className} ref={carouselRef}>
      <Carousel
        setApi={setApi}
        opts={{
          align: align,
          loop: loop,
        }}
        className="w-full"
      >
        <CarouselContent>
          {children}
        </CarouselContent>
        {/* Sem elementos de navegação para ocultar as setas */}
      </Carousel>
    </div>
  );
}
