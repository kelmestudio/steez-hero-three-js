"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { AnimatedCan } from "@/components/animated-can";
import { CanConfigPanel } from "@/components/can-config-panel";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import Header from "@/components/header";


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
		inicio: { position: [2.5, 1, 10], rotation: [1, 0, Math.PI * 0.5], scale: 0.42 },
		loja: { position: [-8, -4, 0], rotation: [0, Math.PI * 0.5, 0], scale: 0.6 },
		sobre: { position: [-6, -4, 10], rotation: [0, Math.PI, 0], scale: 0.7 },
		contato: { position: [0, 1, 10], rotation: [0, Math.PI * 1.5, 0], scale: 0.25 }
	}), []);
	
	const [canConfigs, setCanConfigs] = useState(defaultCanConfigs);

	// Referência para controlar a direção do scroll (com verificação para SSR)
	const scrollDirection = useRef({ lastY: 0, direction: 0 });
	
	// Define a função scrollToSection antes de usá-la nos hooks
	const scrollToSection = useCallback((id: string) => {
		if (typeof document === 'undefined') return; // Verificação para SSR
		
		const element = document.getElementById(id);
		if (element) {
			// Comportamento suave para melhor experiência do usuário
			element.scrollIntoView({ behavior: "smooth" });
			
			// Atualiza a seção ativa após o scroll
			setTimeout(() => {
				setActiveSection(id);
			}, 250); // Tempo suficiente para o scroll terminar
		}
	}, []);
	
	// Helper otimizado para encontrar a seção que está entrando no viewport (antecipando a detecção)
	const getCurrentSection = useCallback(() => {
		// Verificar se estamos no navegador
		if (typeof window === 'undefined') return "inicio";
		
		// Busca a seção que está se aproximando do viewport, não apenas a que já está visível
		let bestSection = "inicio";
		let bestScore = -Infinity;
		const viewportHeight = window.innerHeight;
		
		// Determina a direção do scroll
		const currentY = window.scrollY;
		const currentDirection = scrollDirection.current;
		
		if (currentY > currentDirection.lastY) {
			currentDirection.direction = 1; // Scroll para baixo
		} else if (currentY < currentDirection.lastY) {
			currentDirection.direction = -1; // Scroll para cima
		}
		currentDirection.lastY = currentY;
		
		for (const id of SECTIONS) {
			const element = document.getElementById(id);
			if (!element) continue;
			
			const rect = element.getBoundingClientRect();
			const topDistance = rect.top;
			
			// Seção já está no topo (visível)
			if (Math.abs(topDistance) < 10) {
				return id;
			}
			
			// Seção está entrando no viewport de cima (scroll para baixo)
			if (currentDirection.direction > 0 && rect.top > 0 && rect.top < viewportHeight * 0.6) {
				// Favorece a seção que está entrando de cima quando rolamos para baixo
				const score = (viewportHeight - rect.top) * 2;
				if (score > bestScore) {
					bestScore = score;
					bestSection = id;
				}
			}
			// Seção está entrando no viewport de baixo (scroll para cima)
			else if (currentDirection.direction < 0 && rect.bottom < viewportHeight && rect.bottom > viewportHeight * 0.4) {
				// Favorece a seção que está entrando de baixo quando rolamos para cima
				const score = (viewportHeight - (viewportHeight - rect.bottom)) * 2;
				if (score > bestScore) {
					bestScore = score;
					bestSection = id;
				}
			} 
			// Seção está visível (com prioridade mais baixa que as seções em transição)
			else if (rect.top < viewportHeight && rect.bottom > 0) {
				const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
				const score = visibleHeight / viewportHeight;
				if (score > bestScore) {
					bestScore = score;
					bestSection = id;
				}
			}
		}
		
		return bestSection;
	}, [SECTIONS]);
	
	// Monitoramento de scroll otimizado para detecção antecipada
	useEffect(() => {
		// Verificação de segurança para SSR
		if (typeof window === 'undefined') return;
		
		let lastSection = activeSection;
		let animationFrameId: number;
		
		// Função que verifica continuamente se a seção está mudando
		const checkSectionChange = () => {
			// Atualiza a posição Y para animações
			setScrollY(window.scrollY);
			
			// Obtém a seção que está entrando no viewport (detecta antecipadamente)
			const currentSection = getCurrentSection();
			
			// Se a seção mudou, atualizamos imediatamente
			if (currentSection !== lastSection) {
				lastSection = currentSection;
				setActiveSection(currentSection);
				
				// Dispara evento para atualização imediata da lata
				const event = new CustomEvent('sectionTransitioning', { 
					detail: { section: currentSection, configs: canConfigs, scrollY: window.scrollY } 
				});
				window.dispatchEvent(event);
			}
			
			// Continua verificando durante a animação de scroll
			animationFrameId = requestAnimationFrame(checkSectionChange);
		};
		
		// Inicia monitoramento contínuo
		checkSectionChange();
		
		// Eventos para reiniciar o monitoramento se necessário
		const handleScrollStart = () => {
			cancelAnimationFrame(animationFrameId);
			checkSectionChange();
		};
		
		window.addEventListener("scroll", handleScrollStart, { passive: true });
		window.addEventListener("resize", handleScrollStart, { passive: true });
		
		// Limpa o monitoramento quando o componente é desmontado
		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("scroll", handleScrollStart);
			window.removeEventListener("resize", handleScrollStart);
		};
	}, [getCurrentSection, activeSection, canConfigs]);

	// Observa mudanças na seção ativa para atualizar a animação da lata imediatamente
	useEffect(() => {
		// Verificação de segurança para SSR
		if (typeof window === 'undefined') return;
		
		// Força atualização imediata da animação 3D quando a seção muda
		const event = new CustomEvent('sectionChanged', { 
			detail: { section: activeSection, configs: canConfigs } 
		});
		window.dispatchEvent(event);
	}, [activeSection, canConfigs]);
	
	// Gerencia navegação por teclado (teclas de seta)
	useEffect(() => {
		// Verificação de segurança para SSR
		if (typeof window === 'undefined') return;
		
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
	}, [getCurrentSection, SECTIONS, scrollToSection]);

	// Gerencia navegação por scroll com otimização de desempenho
	useEffect(() => {
		const container = mainContainerRef.current;
		if (!container) return;

		// Variáveis para controle de throttle
		let isScrolling = false;
		let scrollTimeout: NodeJS.Timeout;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			
			// Se já estiver rolando, ignore o evento
			if (isScrolling) return;
			isScrolling = true;
			
			// Determina a direção do scroll
			const direction = e.deltaY > 0 ? 1 : -1;
			const currentSection = getCurrentSection();
			
			// Calcula a próxima seção
			const currentIndex = SECTIONS.indexOf(currentSection);
			const targetIndex = Math.max(0, Math.min(SECTIONS.length - 1, currentIndex + direction));
			
			// Se houver mudança, navega para a nova seção
			if (currentIndex !== targetIndex) {
				scrollToSection(SECTIONS[targetIndex]);
			}
			
			// Reset do throttle após 500ms
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				isScrolling = false;
			}, 500);
		};

		container.addEventListener("wheel", handleWheel, { passive: false });
		
		return () => {
			container.removeEventListener("wheel", handleWheel);
			clearTimeout(scrollTimeout);
		};
	}, [getCurrentSection, SECTIONS, scrollToSection]);

	return (
		<div 
			ref={mainContainerRef} 
			className="h-screen overflow-y-auto scroll-smooth snap-y snap-always snap-mandatory overflow-x-hidden overscroll-y-contain scroll-pt-16"
		>
			{/* Header com navegação */}
			<Header activeSection={activeSection} scrollToSection={scrollToSection} />

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
				
				{/* Indicador de seção ativa */}
				<div 
					key={activeSection}
					className="fixed hidden top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-6 rounded-full text-sm font-medium z-50 transition-all duration-500 animate-pulse"
					style={{ 
						opacity: 0.9,
						pointerEvents: 'none',
						boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
					}}
				>
					{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
				</div>
				
				<div className="fixed inset-0 w-full h-full pointer-events-none z-20">
					<Canvas
						camera={{ position: [0, 1, 50], fov: 16 }}
						style={{ width: "100%", height: "100%" }}
						gl={{ preserveDrawingBuffer: true }}
					>
						<ambientLight intensity={3} />
						<directionalLight position={[5, 15, 5]} intensity={9} />
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
							<span className="inline-block title-home px-10">PINK</span>
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
