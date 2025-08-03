import { useState, useEffect } from "react";
import Image from "next/image";
import { CarouselItem } from "@/components/ui/carousel";
import { AutoplayCarousel } from "@/components/autoplay-carousel";
import ScrollIndicator from "@/components/scroll-indicator";
import HeartAboutUs from "@/components/svg/heart-about-us";
import StarAboutUs from "@/components/svg/star-about-us";
import SteezAboutUs from "@/components/svg/steez-about-us";
import { ImageUp } from "lucide-react";
import { Button } from "./ui/button";
import PhotoModal from "./photo-modal";

interface AboutSectionProps {
  scrollToSection: (id: string) => void;
}

export default function AboutSection({ scrollToSection }: AboutSectionProps) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [carouselKey, setCarouselKey] = useState(0);

  // Hook para resetar o carrossel quando a seção for ativada
  useEffect(() => {
    const handleSectionChanged = (event: CustomEvent) => {
      if (event.detail.section === 'sobre-nos' || event.detail.section === 'sobre') {
        // Força re-renderização do carrossel quando a seção é ativada
        setCarouselKey(prev => prev + 1);
      }
    };

    // Força inicialização do carrossel após mount
    const timer = setTimeout(() => {
      setCarouselKey(prev => prev + 1);
    }, 100);

    if (typeof window !== 'undefined') {
      window.addEventListener('sectionChanged', handleSectionChanged as EventListener);
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('sectionChanged', handleSectionChanged as EventListener);
      }
    };
  }, []);

  return (
		<div className="container mx-auto px-4 flex flex-col items-center min-h-[70vh] max-h-screen overflow-hidden pt-0 pb-12">
	
				<h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center uppercase italic mb-4 lg:mb-6 text-[#181818] flex-shrink-0">
					SOBRE NÓS
				</h2>
			

			<div className="relative w-full flex-1 flex items-center justify-center max-h-[55vh] mb-4 lg:mb-6">
				<AutoplayCarousel
					key={carouselKey}
					className="w-full h-full"
					autoplayDelay={2000}
					loop={true}
					align="center"
				>
					<CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3 relative flex items-center justify-center">
						<Image
							src="/images/slider-01.png"
							alt="Slider 01"
							className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg max-h-[50vh] object-contain z-10"
							width={1000}
							height={500}
						/>
						<SteezAboutUs className="absolute bottom-2 right-2 lg:bottom-4 lg:right-3" />
					</CarouselItem>
					<CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3 relative flex items-center justify-center">
						<div className="flex flex-col items-center">
							<Image
								src="/images/slider-02.png"
								alt="Slider 02"
								className="w-full max-w-xs sm:max-w-sm max-h-[40vh] object-contain z-10"
								width={436}
								height={366}
							/>
							<div className="w-full max-w-xs sm:max-w-sm flex justify-between mt-2 relative">
								<p className="text-xs font-medium text-[#2E2E2E] text-nowrap">
									[janeiro-2025]
								</p>

								<p className="text-xs max-w-[60%] font-medium text-[#2E2E2E]">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									tempus faucibus tellus, eu aliquet augue volutpat ultrices.
								</p>
								<HeartAboutUs className="absolute -bottom-2 -right-2" />
							</div>
						</div>
					</CarouselItem>
					<CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3 relative flex items-center justify-center">
						<div className="flex flex-col items-center">
							<div className="flex items-center justify-center mb-2">
								<p className="text-xs font-medium text-[#2E2E2E] text-nowrap">
									[2025]
								</p>
							</div>
							<div className="relative">
								<Image
									src="/images/slider-03.png"
									alt="Slider 03"
									className="w-full max-w-xs sm:max-w-sm max-h-[45vh] object-contain"
									width={261}
									height={356}
								/>
								<StarAboutUs className="absolute bottom-1 right-0 w-12 h-12 lg:w-16 lg:h-16" />
							</div>
						</div>
					</CarouselItem>
					
				</AutoplayCarousel>
			</div>
			
			<div className="flex-shrink-0 w-full flex justify-center">
				<Button
					size="lg"
					className="bg-[#181818] text-white hover:opacity-50 !px-6 lg:!px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-medium rounded-full"
					onClick={() => setShowPhotoModal(true)}
				>
					ENVIAR MEU RETRATO <ImageUp />
				</Button>
			</div>

			{/* Modal de Foto */}
			<PhotoModal
				isOpen={showPhotoModal}
				onClose={() => setShowPhotoModal(false)}
			/>
		</div>
	);
}
