import { useEffect, useCallback, useRef } from 'react';
import { type UseEmblaCarouselType } from 'embla-carousel-react';

interface AutoplayOptions {
  delay?: number;
  stopOnInteraction?: boolean;
  stopOnMouseEnter?: boolean;
}

export const useCarouselAutoplay = (
  emblaApi: UseEmblaCarouselType[1] | undefined,
  options?: AutoplayOptions
) => {
  const { delay = 3000, stopOnInteraction = true, stopOnMouseEnter = true } = options || {};
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayContainerRef = useRef<HTMLElement | null>(null);
  const isMouseEntered = useRef(false);

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!emblaApi || isMouseEntered.current) return;
    clearAutoplayTimer();
    autoplayTimerRef.current = setTimeout(() => {
      if (emblaApi && emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else if (emblaApi) {
        emblaApi.scrollTo(0); // Loop back to start
      }
      startAutoplay();
    }, delay);
  }, [emblaApi, delay, clearAutoplayTimer]);

  const stopAutoplay = useCallback(() => {
    clearAutoplayTimer();
  }, [clearAutoplayTimer]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('init', startAutoplay);
    emblaApi.on('reInit', startAutoplay);
    emblaApi.on('destroy', stopAutoplay);

    if (stopOnInteraction) {
      emblaApi.on('pointerDown', stopAutoplay);
      emblaApi.on('pointerUp', startAutoplay);
    }

    // Find container element
    if (typeof document !== 'undefined') {
      autoplayContainerRef.current = document.querySelector('[data-embla-autoplay]') as HTMLElement;
    
      if (autoplayContainerRef.current && stopOnMouseEnter) {
        const handleMouseEnter = () => {
          isMouseEntered.current = true;
          stopAutoplay();
        };
        const handleMouseLeave = () => {
          isMouseEntered.current = false;
          startAutoplay();
        };
        
        autoplayContainerRef.current.addEventListener('mouseenter', handleMouseEnter);
        autoplayContainerRef.current.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          if (autoplayContainerRef.current) {
            autoplayContainerRef.current.removeEventListener('mouseenter', handleMouseEnter);
            autoplayContainerRef.current.removeEventListener('mouseleave', handleMouseLeave);
          }
        };
      }
    }

    return () => {
      stopAutoplay();
      if (!emblaApi) return;
      emblaApi.off('init', startAutoplay);
      emblaApi.off('reInit', startAutoplay);
      emblaApi.off('destroy', stopAutoplay);
      
      if (stopOnInteraction) {
        emblaApi.off('pointerDown', stopAutoplay);
        emblaApi.off('pointerUp', startAutoplay);
      }
    };
  }, [emblaApi, startAutoplay, stopAutoplay, stopOnInteraction, stopOnMouseEnter]);

  return {
    startAutoplay,
    stopAutoplay
  };
};
