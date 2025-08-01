"use client";

import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  onClick: () => void;
  section: string;
  size?: "small" | "default";
}

export default function ScrollIndicator({ onClick, section, size = "default" }: ScrollIndicatorProps) {
  return (
    <div className="hidden lg:flex justify-center w-full mt-4 sm:mt-6">
      <button 
        className="flex justify-center items-center border-none bg-transparent cursor-pointer transition-opacity hover:opacity-50"
        onClick={onClick}
        aria-label={`Ir para ${section}`}
      >
        <ChevronDown 
          className={`
            text-red-500 transition-all animate-bounce
            ${size === "small" ? "w-6 h-6 sm:w-7 sm:h-7" : "w-8 h-8"}
          `} 
        />
      </button>
    </div>
  );
}
