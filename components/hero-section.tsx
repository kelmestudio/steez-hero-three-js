import { Button } from "@/components/ui/button";
import ScrollIndicator from "@/components/scroll-indicator";

interface HeroSectionProps {
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
		<>
			{/* Main Content */}
			<div className="relative z-4 text-center max-w-6xl mx-auto px-6 mb-64 lg:mb-0">
				{/* Large Title with 3D Can */}
				<div className="relative mb-4 lg:mb-12">
					<p className="text-lg font-medium text-gray-700 tracking-wide">
						ÁLCOOL SEM CULPA
					</p>
					<div className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-[#F42254] leading-none select-none">
						<span className="inline-block title-home px-10">PINK</span>
					</div>
				</div>

				{/* Call to Action Buttons */}
				<div className="flex flex-row items-center justify-center gap-4 ,mb-8 lg:mb-12">
					<Button
						size="lg"
						className="bg-black text-white hover:bg-gray-800 px-4 md:px-8 py-2 md:py-4 text-lg font-medium rounded-full"
						onClick={() => scrollToSection("pink")}
					>
						COMPRAR AGORA
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 px-4 md:px-8  py-2 md:py-4 text-lg font-medium rounded-full bg-transparent"
						onClick={() => scrollToSection("ingredientes")}
					>
						VER INGREDIENTES
					</Button>
				</div>
				{/* Subtitle */}
				<p className="text-lg text-gray-600 mt-2 mb-20">
					Vais surpreender-te com o frescor
				</p>
				{/* Scroll Indicator */}
				<ScrollIndicator
					onClick={() => scrollToSection("beneficios")}
					section="beneficios"
				/>
			</div>
		</>
	);
}
