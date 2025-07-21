"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { AnimatedCan } from "@/components/animated-can";
import { CanConfigPanel } from "@/components/can-config-panel";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronDown, Settings } from "lucide-react";

export default function HeroSection() {
	const [scrollY, setScrollY] = useState(0);
	const [activeSection, setActiveSection] = useState("inicio");
	const mainContainerRef = useRef<HTMLDivElement>(null);
	
	// Estado para controlar a visibilidade do painel de configuração
	const [showConfigPanel, setShowConfigPanel] = useState(false);
	
	// Seções disponíveis no site - centralizado para evitar duplicação
	const SECTIONS = ["inicio", "loja", "sobre", "contato"];
	
	// Configurações padrão para o modelo 3D em cada seção
	const defaultCanConfigs = useMemo(() => ({
		inicio: { position: [2, 1, 10], rotation: [1, 0, Math.PI * 0.5], scale: 0.42 },
		loja: { position: [-8, -4, 0], rotation: [0, Math.PI * 0.5, 0], scale: 0.6 },
		sobre: { position: [-8, -4, 10], rotation: [0, Math.PI, 0], scale: 0.7 },
		contato: { position: [0, 1, 10], rotation: [0, Math.PI * 1.5, 0], scale: 0.25 }
	}), []);
	
	const [canConfigs, setCanConfigs] = useState(defaultCanConfigs);

	// Helper simples para encontrar a seção visível atual
	const getCurrentSection = useCallback(() => {
		// Simplificação máxima: vamos apenas verificar qual seção tem o topo mais próximo de 0
		// Isso funciona bem com scroll snap, que alinha o topo das seções
		let bestSection = "inicio";
		let smallestTopDistance = Infinity;
		
		SECTIONS.forEach((id) => {
			const element = document.getElementById(id);
			if (!element) return;
			
			const rect = element.getBoundingClientRect();
			
			// Distância absoluta do topo da seção até o topo da viewport
			const topDistance = Math.abs(rect.top);
			
			// A seção com topo mais próximo de 0 é provavelmente a que está em foco
			if (topDistance < smallestTopDistance) {
				smallestTopDistance = topDistance;
				bestSection = id;
			}
		});
		
		return bestSection;
	}, [SECTIONS]);

	// Simplificação total do monitoramento de scroll
	useEffect(() => {
		// Função básica para verificar qual seção está ativa
		const checkSectionChange = () => {
			// Atualiza o valor de scrollY para animações
			setScrollY(window.scrollY);
			
			// Obtém a seção visível atual
			const currentSection = getCurrentSection();
			
			// Só atualiza se realmente mudou
			if (currentSection !== activeSection) {
				console.log(`Seção alterada para: ${currentSection}`);
				setActiveSection(currentSection);
			}
		};
		
		// Usa debounce simples para não sobrecarregar
		let timeoutId: NodeJS.Timeout | null = null;
		
		const handleScroll = () => {
			// Cancela qualquer timeout pendente
			if (timeoutId) clearTimeout(timeoutId);
			
			// Define novo timeout para verificar após o scroll parar
			timeoutId = setTimeout(checkSectionChange, 50);
		};
		
		// Verificação inicial
		checkSectionChange();
		
		// Adiciona listener para o evento de scroll
		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", checkSectionChange, { passive: true });
		
		// Limpeza
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", checkSectionChange);
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [getCurrentSection, activeSection]);

	// Observa mudanças na seção ativa para atualizar a animação da lata
	useEffect(() => {
		console.log(`Aplicando configuração para seção: ${activeSection}`);
		// Se necessário, podemos adicionar aqui qualquer lógica adicional
		// para garantir que a configuração da lata seja corretamente aplicada
		// quando a seção ativa muda
	}, [activeSection]);
	
	// Gerencia navegação por teclado (teclas de seta)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Arrow Up ou Arrow Down
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				
				// Define a direção com base na tecla pressionada
				const direction = e.key === 'ArrowDown' ? 1 : -1;
				
				// Obtém a seção atual usando a função auxiliar
				const currentSection = getCurrentSection();
				
				// Calcula a próxima seção
				const currentIndex = SECTIONS.indexOf(currentSection);
				const targetIndex = Math.max(0, Math.min(SECTIONS.length - 1, currentIndex + direction));
				
				// Se houver mudança, navega para a nova seção
				if (currentIndex !== targetIndex) {
					scrollToSection(SECTIONS[targetIndex]);
				}
			}
		};
		
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [getCurrentSection, SECTIONS]);	// Gerencia navegação por scroll
	useEffect(() => {
		const container = mainContainerRef.current;

		const handleWheel = (e: WheelEvent) => {
			if (!container) return;
			e.preventDefault();
			
			const direction = e.deltaY > 0 ? 1 : -1;
			const currentSection = getCurrentSection();
			
			const currentIndex = SECTIONS.indexOf(currentSection);
			const targetIndex = Math.max(0, Math.min(SECTIONS.length - 1, currentIndex + direction));
			
			if (currentIndex !== targetIndex) {
				scrollToSection(SECTIONS[targetIndex]);
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
	}, [getCurrentSection, SECTIONS]);

	// Memoizado para evitar recriação desnecessária
	const scrollToSection = useCallback((id: string) => {
		const element = document.getElementById(id);
		if (element) {
			// Comportamento suave para não quebrar o scroll snap
			element.scrollIntoView({ behavior: "smooth" });
			
			// Atualiza a seção ativa após o scroll
			setTimeout(() => {
				setActiveSection(id);
			}, 500); // Tempo suficiente para o scroll terminar
		}
	}, []);

	return (
		<div 
			ref={mainContainerRef} 
			className="h-screen overflow-y-auto scroll-smooth snap-y snap-always snap-mandatory overflow-x-hidden overscroll-y-contain scroll-pt-16"
			style={{ scrollSnapType: 'y mandatory' }}
		>
			{/* Navigation */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
				<div className="container mx-auto px-6 py-4 flex items-center justify-between">
					<div className="text-2xl font-bold text-black">STEEZ</div>
					<div className="hidden md:flex items-center space-x-8">
						<button
							onClick={() => scrollToSection("inicio")}
							className={`text-sm font-medium transition-colors border-b-2 ${
								activeSection === "inicio"
									? "text-black border-red-500"
									: "text-gray-600 border-transparent hover:text-red-500"
							}`}
						>
							INÍCIO
						</button>
						<button
							onClick={() => scrollToSection("loja")}
							className={`text-sm font-medium transition-colors border-b-2 ${
								activeSection === "loja"
									? "text-black border-red-500"
									: "text-gray-600 border-transparent hover:text-red-500"
							}`}
						>
							LOJA
						</button>
						<button
							onClick={() => scrollToSection("sobre")}
							className={`text-sm font-medium transition-colors border-b-2 ${
								activeSection === "sobre"
									? "text-black border-red-500"
									: "text-gray-600 border-transparent hover:text-red-500"
							}`}
						>
							SOBRE NÓS
						</button>
						<button
							onClick={() => scrollToSection("contato")}
							className={`text-sm font-medium transition-colors border-b-2 ${
								activeSection === "contato"
									? "text-black border-red-500"
									: "text-gray-600 border-transparent hover:text-red-500"
							}`}
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

				{/* Botão de configuração */}
				<button 
					className="fixed right-5 bottom-5 bg-gray-800 text-white p-3 rounded-full z-50 shadow-lg hover:bg-gray-700 transition-colors"
					onClick={() => setShowConfigPanel(!showConfigPanel)}
				>
					<Settings className="w-5 h-5" />
				</button>
				
				{/* Painel de configuração */}
				{showConfigPanel && (
					<CanConfigPanel 
						configs={canConfigs} 
						onConfigChange={(newConfigs: any) => setCanConfigs(newConfigs)}
						activeSection={activeSection} 
					/>
				)}
				
				{/* Indicador de mudança de seção (mais visível e com efeito de piscar) */}
				<div 
					key={activeSection} // Força recriação para efeito de animação
					className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-6 rounded-full text-sm font-medium z-50 transition-all duration-500 animate-pulse"
					style={{ 
						opacity: 1, 
						transition: 'opacity 0.5s ease, transform 0.5s ease, background-color 0.5s ease', 
						pointerEvents: 'none',
						boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
						animation: 'pulse 2s infinite',
					}}
				>
					Seção ativa: {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
				</div>
				
				<div className="fixed inset-0 w-full h-full pointer-events-none z-20">
					<Canvas
						camera={{ position: [0, 1, 50], fov: 16 }}
						style={{ width: "100%", height: "100%" }}
						gl={{ preserveDrawingBuffer: true }}
					>
						<ambientLight intensity={5} />
						<directionalLight position={[5, 5, 5]} intensity={5} />
						<Suspense fallback={null}>
							<AnimatedCan 
								scrollY={scrollY} 
								activeSection={activeSection}
								sectionConfigs={canConfigs}
							/>
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
