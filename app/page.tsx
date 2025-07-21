"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatedCan } from "@/components/animated-can";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronDown } from "lucide-react";

export default function HeroSection() {
	const [scrollY, setScrollY] = useState(0);
	const mainContainerRef = useRef<HTMLDivElement>(null);

	// Unifica o evento de scroll para animação da lata
	useEffect(() => {
		const handleScroll = () => {
			requestAnimationFrame(() => {
				setScrollY(window.scrollY);
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Gerencia navegação por scroll
	useEffect(() => {
		const container = mainContainerRef.current;
		const sections = ["inicio", "loja", "sobre", "contato"];

		const handleWheel = (e: WheelEvent) => {
			if (!container) return;
			e.preventDefault();
			
			const direction = e.deltaY > 0 ? 1 : -1;
			const currentSection = sections.find((id) => {
				const element = document.getElementById(id);
				if (!element) return false;
				const rect = element.getBoundingClientRect();
				return rect.top <= 100 && rect.bottom >= 100;
			});
			
			const currentIndex = sections.indexOf(currentSection || "inicio");
			const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
			
			if (currentIndex !== targetIndex) {
				scrollToSection(sections[targetIndex]);
			}
		};

		if (container) {
			container.addEventListener("wheel", handleWheel, { passive: false });
		}

		return () => {
			if (container) {
				container.removeEventListener("wheel", handleWheel);
			}
		};
	}, []);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "auto" });
		}
	};

	return (
		<div ref={mainContainerRef} className="h-screen overflow-y-auto scroll-smooth snap-y snap-always snap-mandatory overflow-x-hidden overscroll-y-contain scroll-pt-16">
			{/* Navigation */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
				<div className="container mx-auto px-6 py-4 flex items-center justify-between">
					<div className="text-2xl font-bold text-black">STEEZ</div>
					<div className="hidden md:flex items-center space-x-8">
						<button
							onClick={() => scrollToSection("inicio")}
							className="text-sm font-medium text-black hover:text-red-500 transition-colors border-b-2 border-red-500"
						>
							INÍCIO
						</button>
						<button
							onClick={() => scrollToSection("loja")}
							className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
						>
							LOJA
						</button>
						<button
							onClick={() => scrollToSection("sobre")}
							className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
						>
							SOBRE NÓS
						</button>
						<button
							onClick={() => scrollToSection("contato")}
							className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
						>
							CONTATO
						</button>
					</div>
					<div className="flex items-center space-x-4">
						<span className="text-sm font-medium">CARRINHO</span>
						<div className="relative">
							<ShoppingCart className="w-6 h-6" />
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
								0
							</span>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div
				id="inicio"
				className="relative h-screen flex items-center justify-center pt-20 snap-start"
			>
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-5">
					<div className="text-[20rem] font-black text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none">
						STEEZ
					</div>
				</div>

				<div className="fixed inset-0 w-full h-[400px] pointer-events-none z-10">
					<Canvas
						camera={{ position: [0, 1, 50], fov: 16 }}
						style={{ width: "100%", height: "100%" }}
					>
						<Suspense fallback={null}>
							<AnimatedCan scrollY={scrollY} />
						</Suspense>
					</Canvas>
				</div>				{/* Main Content */}
				<div className="relative z-4 text-center max-w-6xl mx-auto px-6">
					{/* Tagline */}
					<div className="mb-8">
						<p className="text-lg font-medium text-gray-700 tracking-wide">
							ZERO BULLSHIT, DÁ-TE STEEZ
						</p>
					</div>

					{/* Large Typography with 3D Can */}
					<div className="relative mb-12">
						<div className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-red-500 leading-none select-none">
							<span className="inline-block">P</span>
							<span className="inline-block">I</span>
							<span className="inline-block relative">
								N{/* 3D Can Container */}
							</span>
							<span className="inline-block">K</span>
						</div>
					</div>

					{/* Call to Action Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
						<Button
							size="lg"
							className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-full"
						>
							COMPRAR AGORA
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-full bg-transparent"
						>
							VER INGREDIENTES
						</Button>
					</div>

					{/* Subtitle */}
					<p className="text-lg text-gray-600 mb-16">
						Você vai se surpreender com o frescor
					</p>

					{/* Scroll Indicator */}
					<div
						className="animate-bounce cursor-pointer"
						onClick={() => scrollToSection("loja")}
					>
						<ChevronDown className="w-8 h-8 text-gray-400 mx-auto hover:text-red-500 transition-colors" />
					</div>
				</div>
			</div>

			{/* Additional Content for Scroll Effect */}
			<div
				id="loja"
				className="h-screen bg-white flex items-center justify-center snap-start"
			>
				<div className="text-center">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Deslize para ver a mágica
					</h2>
					<p className="text-xl text-gray-600 mb-8">
						A lata se anima enquanto você desliza!
					</p>

					{/* Scroll Indicator */}
					<div
						className="animate-bounce cursor-pointer"
						onClick={() => scrollToSection("sobre")}
					>
						<ChevronDown className="w-8 h-8 text-gray-400 mx-auto hover:text-red-500 transition-colors" />
					</div>
				</div>
			</div>

			{/* Terceira Seção */}
			<div
				id="sobre"
				className="h-screen bg-gray-100 flex items-center justify-center snap-start"
			>
				<div className="text-center">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Experimente o sabor
					</h2>
					<p className="text-xl text-gray-600 mb-8">
						Refrescante e energizante, a qualquer momento!
					</p>
					
					{/* Scroll Indicator */}
					<div
						className="animate-bounce cursor-pointer"
						onClick={() => scrollToSection("contato")}
					>
						<ChevronDown className="w-8 h-8 text-gray-400 mx-auto hover:text-red-500 transition-colors" />
					</div>
				</div>
			</div>

			{/* Quarta Seção - Contato */}
			<div
				id="contato"
				className="h-screen bg-white flex items-center justify-center snap-start"
			>
				<div className="text-center">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Entre em contato
					</h2>
					<p className="text-xl text-gray-600">
						Estamos aqui para responder todas as suas dúvidas!
					</p>
				</div>
			</div>
		</div>
	);
}
