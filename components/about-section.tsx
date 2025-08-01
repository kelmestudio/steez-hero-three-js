import Image from "next/image";
import { CarouselItem } from "@/components/ui/carousel";
import { AutoplayCarousel } from "@/components/autoplay-carousel";
import ScrollIndicator from "@/components/scroll-indicator";
import HeartAboutUs from "@/components/svg/heart-about-us";
import StarAboutUs from "@/components/svg/star-about-us";
import SteezAboutUs from "@/components/svg/steez-about-us";

interface AboutSectionProps {
  scrollToSection: (id: string) => void;
}

export default function AboutSection({ scrollToSection }: AboutSectionProps) {
  return (
    <div className="container mx-auto px-0 flex flex-col items-center justify-center">
      <div className="relative w-full max-h-[70vh]">
        <AutoplayCarousel
          className="w-full"
          autoplayDelay={2000}
          loop={true}
          align="start"
        >
          <CarouselItem className="pl-1 md:basis-auto relative">
            <Image
              src="/images/slider-01.png"
              alt="Slider 01"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl max-h-[60vh] object-contain z-10"
              width={1000}
              height={600}
            />
            <SteezAboutUs className="absolute bottom-4 right-3" />
          </CarouselItem>
          <CarouselItem className="pl-1 md:basis-auto self-center relative">
            <Image
              src="/images/slider-02.png"
              alt="Slider 02"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[50vh] object-contain z-10"
              width={436}
              height={366}
            />
            <div className="w-full max-w-xs sm:max-w-sm flex justify-between mt-3">
              <p className="text-xs font-medium text-[#2E2E2E] text-nowrap">
                [janeiro-2025]
              </p>

              <p className="text-xs max-w-[60%] font-medium text-[#2E2E2E]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Quisque tempus faucibus tellus, eu aliquet augue volutpat
                ultrices.
              </p>
            </div>
            <HeartAboutUs className="absolute bottom-4 right-4" />
          </CarouselItem>
          <CarouselItem className="pl-1 md:basis-auto self-end relative">
            <div className="flex items-center justify-center mb-3">
              <p className="text-xs font-medium text-[#2E2E2E] text-nowrap">
                [2025]
              </p>
            </div>
            <Image
              src="/images/slider-03.png"
              alt="Slider 03"
              className="w-full max-w-xs sm:max-w-sm max-h-[50vh] object-contain"
              width={261}
              height={356}
            />
            <StarAboutUs className="absolute bottom-3 right-1" />
          </CarouselItem>
          <CarouselItem className="pl-1 md:basis-auto relative">
            <Image
              src="/images/slider-04.png"
              alt="Slider 04"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[50vh] object-contain"
              width={338}
              height={597}
            />
          </CarouselItem>
        </AutoplayCarousel>
      </div>

      {/* Scroll Indicator */}
      <div className="mt-4">
        <ScrollIndicator
          onClick={() => scrollToSection("contato")}
          section="contato"
        />
      </div>
    </div>
  );
}
