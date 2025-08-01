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
              className="max-w-[1000px] min-w-full max-h-[60vh] object-contain z-10"
              width={1000}
              height={600}
            />
            <SteezAboutUs className="absolute bottom-4 right-3" />
          </CarouselItem>
          <CarouselItem className="pl-1 md:basis-auto self-center relative">
            <Image
              src="/images/slider-02.png"
              alt="Slider 02"
              className="max-w-[436px] min-w-full max-h-[50vh] object-contain z-10"
              width={436}
              height={366}
            />
            <div className="max-w-[324px] flex justify-between mt-3">
              <p className="text-[12px] font-medium text-[#2E2E2E] text-nowrap">
                [janeiro-2025]
              </p>

              <p className="text-[12px] max-w-[194px] font-medium text-[#2E2E2E]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Quisque tempus faucibus tellus, eu aliquet augue volutpat
                ultrices.
              </p>
            </div>
            <HeartAboutUs className="absolute bottom-4 right-4" />
          </CarouselItem>
          <CarouselItem className="pl-1 md:basis-auto self-end relative">
            <div className="flex items-center justify-center mb-3">
              <p className="text-[12px] font-medium text-[#2E2E2E] text-nowrap">
                [2025]
              </p>
            </div>
            <Image
              src="/images/slider-03.png"
              alt="Slider 03"
              className="max-w-[261px] min-w-full max-h-[50vh] object-contain"
              width={261}
              height={356}
            />
            <StarAboutUs className="absolute bottom-3 right-1" />
          </CarouselItem>
          <CarouselItem className="pl-1 md:basis-auto relative">
            <Image
              src="/images/slider-04.png"
              alt="Slider 04"
              className="max-w-[338px] min-w-full max-h-[50vh] object-contain"
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
