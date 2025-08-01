import SloganSteez from "@/components/svg/slogan-steez";
import ScrollIndicator from "@/components/scroll-indicator";

interface MottoSectionProps {
  scrollToSection: (id: string) => void;
}

export default function MottoSection({ scrollToSection }: MottoSectionProps) {
  return (
    <div className="container mx-auto px-6 flex align-center flex-col items-center justify-center text-center">
      <h2 className="text-5xl md:text-6xl text-[#181818] font-bold pt-32 mb-4">
        Better Than Gin.
      </h2>
      <SloganSteez className="mx-auto mb-8" />

      <ScrollIndicator
        onClick={() => scrollToSection("beneficios")}
        section="beneficios"
      />
    </div>
  );
}
