"use client";

import { Canvas } from "@react-three/fiber";
import {
	Suspense,
	useEffect,
	useState,
	useMemo,
	useCallback,
	useRef
} from "react";
import SloganSteez from "@/components/svg/slogan-steez";
import { AnimatedCan } from "@/components/animated-can";
import { CanConfigPanel } from "@/components/can-config-panel";
import { Button } from "@/components/ui/button";
import { Settings, Info } from "lucide-react";
import Header from "@/components/header";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import ScrollIndicator from "@/components/scroll-indicator";
import { NoInteraction } from "@/lib/no-interaction";
import BeneficiosSection from "@/components/beneficios-section";
import IngredientesSection from "@/components/ingredientes-section";
import PinkSection from "@/components/pink-section";
import ContatoSection from "@/components/contato-section";
import IngredientesModal from "@/components/ingredientes-modal";

// sobre-nos section
import HeartAboutUs from "@/components/svg/heart-about-us";
import StarAboutUs from "@/components/svg/star-about-us";
import SteezAboutUs from "@/components/svg/steez-about-us";
import SunAboutUs from "@/components/svg/sun-about-us";
import {
	CarouselItem,
} from "@/components/ui/carousel";
import { AutoplayCarousel } from "@/components/autoplay-carousel";
import Image from "next/image";

// Tipagem para melhorar segurança e autocompletar
interface CanConfig {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
	visible: boolean;
}

interface SectionConfigs {
	[key: string]: CanConfig;
}

export default function HeroSection() {
	const [scrollY, setScrollY] = useState(0);
	const [activeSection, setActiveSection] = useState("inicio");
	const mainContainerRef = useRef<HTMLDivElement>(null);
	const [quantity, setQuantity] = useState(6);
	const [totalPrice, setTotalPrice] = useState(12);
	const [showIngredientesModal, setShowIngredientesModal] = useState(false);

	// Estado para controlar a visibilidade do painel de configuração
	const [showConfigPanel, setShowConfigPanel] = useState(false);

	// Seções disponíveis no site - centralizado para evitar duplicação
	const SECTIONS = ["inicio", "beneficios", "sobre", "contato", "faq"];

	// Seções adicionais que existem no scroll mas não aparecem na navegação
	const HIDDEN_SECTIONS = ["motto", "ingredientes", "pink"];

	// Seções na ordem exata de navegação (importante para o scroll funcionar corretamente)
	const ORDERED_SECTIONS = ["inicio", "motto", "beneficios", "ingredientes", "pink", "sobre", "contato", "faq", "footer"];
	

	// Dados para a seção de FAQ
	const faqData = [
		{
			question: "O que é STEEZ?",
			answer:
				"A Steez foi pensada para quem se preocupa com o corpo mas não abdica da diversão. É baixa em calorias, sem açúcares adicionados.",
		},
		{
			question: "A Steez dá ressaca?",
			answer:
				"Claro! Como qualquer bebida alcoólica, tudo depende da quantidade e do teu corpo. Mas como é leve e limpa, ajuda a evitar aquele peso no dia seguinte.",
		},
		{
			question: "Fazem envios para todo o país?",
			answer:
				"Sim, fazemos envios para todo o território continental. Açores e Madeira brevemente.",
		},
		{
			question: "Quero vender Steez no meu espaço. Como faço?",
			answer:
				"Boa! Entra em contacto connosco através e-mail para comercial@steez.com.",
		},
	];

	// Configurações padrão para o modelo 3D em cada seção
	const defaultCanConfigs = useMemo<SectionConfigs>(
		() => ({ 
			inicio: {
				position: [2.3, 1.4, 10],
				rotation: [1, 0, Math.PI * 0.5],
				scale: 0.42,
				visible: true,
			},
			motto: {
				position: [1.4, 1.2, 10],
				rotation: [Math.PI * 1.69, 0.0, Math.PI * 0.51],
				scale: 0.3,
				visible: true,
			},
			ingredientes: {
				position: [-6, -4, 10],
				rotation: [ Math.PI * 0.06, Math.PI * 1.75, 0],
				scale: 0.7,
				visible: true,
			},
			beneficios: {
				position: [-6, -4, 10],
				rotation: [0, Math.PI * 0.40, Math.PI* 0.10],
				scale: 0.7,
				visible: true,
			},
			pink: {
				position: [-6, -4, 10],
				rotation: [0, Math.PI * 1.75, Math.PI * 0.1],
				scale: 0.7,
				visible: true,
			},
			sobre: {
				position: [-6, -4, 10],
				rotation: [0, Math.PI, 0],
				scale: 0.7,
				visible: false,
			},
			contato: {
				position: [0, 1, 10],
				rotation: [0, Math.PI * 1.5, 0],
				scale: 0.25,
				visible: false,
			},
			faq: {
				position: [0, 0, 0],
				rotation: [0, 0, 0],
				scale: 0,
				visible: false,
			},
		}),
		[]
	);

	const [canConfigs, setCanConfigs] =
		useState<SectionConfigs>(defaultCanConfigs);

	// Referência para controlar a direção do scroll (com verificação para SSR)
	const scrollDirection = useRef({ lastY: 0, direction: 0 });

	// Define a função scrollToSection para navegação entre seções
	const scrollToSection = useCallback(
		(id: string) => {
			// Verificação para SSR
			if (typeof document === "undefined") return;

			const element = document.getElementById(id);
			if (!element) return;

			// Evita scroll redundante
			if (activeSection === id) return;

			// Atualiza a seção ativa imediatamente para feedback visual
			setActiveSection(id);

			// Use scrollIntoView nativo para navegação suave
			element.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		},
		[activeSection]
	);

	// Helper otimizado para encontrar a seção que está entrando no viewport
	const getCurrentSection = useCallback(() => {
		if (typeof window === "undefined") return "inicio";

		let bestSection = "inicio";
		let bestScore = -Infinity;
		const viewportHeight = window.innerHeight;
		const scrollThreshold = 50; // Para detecção mais estável

		// Atualiza a direção do scroll
		const currentY = window.scrollY;
		const currentDirection = scrollDirection.current;
		currentDirection.direction =
			currentY > currentDirection.lastY
				? 1
				: currentY < currentDirection.lastY
				? -1
				: currentDirection.direction;
		currentDirection.lastY = currentY;

		// Itera sobre as seções para encontrar a melhor (incluindo footer para scroll)
		for (const id of ORDERED_SECTIONS) {
			const element = document.getElementById(id);
			if (!element) continue;

			const rect = element.getBoundingClientRect();

			// Seção já está no topo ou quase (prioridade máxima)
			// Tornamos isso mais tolerante para melhor snap
			if (Math.abs(rect.top) < scrollThreshold) {
				// Se estiver próximo o suficiente, considere como ativo
				return id;
			}

			let score = -Infinity;

			// Lógica melhorada para calcular a pontuação
			if (rect.top > 0 && rect.top < viewportHeight) {
				// Elemento abaixo da viewport, entrando na tela
				// Quanto mais próximo do topo, maior a pontuação
				score = viewportHeight - rect.top;
			} else if (rect.bottom > 0 && rect.top < 0) {
				// Elemento já parcialmente visível na viewport
				// Quanto mais visível, maior a pontuação
				const visibleHeight = Math.min(rect.bottom, viewportHeight);
				score = visibleHeight * 1.5; // Prioridade aumentada

				// Dê ainda mais prioridade se mais da metade estiver visível
				if (visibleHeight > viewportHeight / 2) {
					score *= 1.5;
				}
			}

			// Ajuste de pontuação para o footer (para melhorar o snap)
			if (id === "footer" && rect.top < viewportHeight) {
				score += 100; // Aumenta a chance do footer ser detectado
			}

			if (score > bestScore) {
				bestScore = score;
				bestSection = id;
			}
		}

		return bestSection;
	}, [ORDERED_SECTIONS]);

	// Monitoramento de scroll otimizado para detecção antecipada
	useEffect(() => {
		// Verificação de segurança para SSR
		if (typeof window === "undefined") return;

		let lastSection = activeSection;
		let animationFrameId: number;
		let lastScrollPosition = window.scrollY;
		let scrollStopTimer = setTimeout(() => {}, 0); // Inicializa com um timeout vazio

		// Função que verifica continuamente se a seção está mudando
		const checkSectionChange = () => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);
			const currentSection = getCurrentSection();

			// Atualiza apenas se a seção mudou
			if (currentSection !== lastSection) {
				lastSection = currentSection;
				setActiveSection(currentSection);

				// Dispara evento apenas se a lata deve ser visível
				if (
					currentSection !== "faq" &&
					currentSection !== "footer" &&
					canConfigs[currentSection as keyof SectionConfigs]?.visible
				) {
					window.dispatchEvent(
						new CustomEvent("sectionTransitioning", {
							detail: {
								section: currentSection,
								configs: canConfigs,
								scrollY: currentScrollY,
							},
						})
					);
				}

				// Deixamos o CSS cuidar do snap
				clearTimeout(scrollStopTimer);
			}

			// Rastreia mudanças de posição para detectar quando o scroll para
			lastScrollPosition = currentScrollY;

			animationFrameId = requestAnimationFrame(checkSectionChange);
		};

		// Inicia monitoramento e configura limpeza
		checkSectionChange();

		const handleScrollStart = () => {
			cancelAnimationFrame(animationFrameId);
			checkSectionChange();
		};

		window.addEventListener("scroll", handleScrollStart, { passive: true });
		window.addEventListener("resize", handleScrollStart, { passive: true });

		return () => {
			cancelAnimationFrame(animationFrameId);
			clearTimeout(scrollStopTimer);
			window.removeEventListener("scroll", handleScrollStart);
			window.removeEventListener("resize", handleScrollStart);
		};
	}, [getCurrentSection, activeSection, canConfigs]);

	// Observa mudanças na seção ativa para atualizar a animação da lata
	useEffect(() => {
		// Verificação de segurança para SSR + visibilidade da lata
		if (
			typeof window === "undefined" ||
			activeSection === "faq" ||
			!canConfigs[activeSection as keyof SectionConfigs]?.visible
		) {
			return;
		}

		// Força atualização imediata da animação 3D quando a seção muda
		const event = new CustomEvent("sectionChanged", {
			detail: { section: activeSection, configs: canConfigs },
		});
		window.dispatchEvent(event);
	}, [activeSection, canConfigs]);

	// Função auxiliar para determinar a próxima seção com base na seção atual e direção
	const getNextSection = useCallback((currentSection: string, direction: number): string => {
		// Mapa de navegação: define para cada seção qual é a próxima seção em cada direção
		const navigationMap: { [key: string]: { up: string; down: string } } = {
			inicio: { up: "inicio", down: "motto" },
			motto: { up: "inicio", down: "beneficios" },
			beneficios: { up: "motto", down: "ingredientes" },
			ingredientes: { up: "beneficios", down: "pink" },
			pink: { up: "ingredientes", down: "sobre" },
			sobre: { up: "pink", down: "contato" },
			contato: { up: "sobre", down: "faq" },
			faq: { up: "contato", down: "footer" },
			footer: { up: "faq", down: "footer" }
		};

		// Determina a direção (para cima ou para baixo)
		const directionKey = direction < 0 ? "up" : "down";
		
		// Retorna a próxima seção com base no mapa de navegação
		return navigationMap[currentSection]?.[directionKey] || currentSection;
	}, []);

	// Gerencia navegação por teclado (teclas de seta)
	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleKeyDown = (e: KeyboardEvent) => {
			// Processa apenas teclas de seta para cima e para baixo
			if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

			e.preventDefault();
			const currentSection = getCurrentSection();
			const direction = e.key === "ArrowDown" ? 1 : -1;
			const nextSection = getNextSection(currentSection, direction);
			
			// Log para debug
			console.log(`Tecla: ${e.key}, Seção atual: ${currentSection}, Próxima: ${nextSection}`);
			
			if (nextSection !== currentSection) {
				scrollToSection(nextSection);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [getCurrentSection, getNextSection, scrollToSection]);

	// Gerencia navegação por scroll com throttling para performance
	useEffect(() => {
		const container = mainContainerRef.current;
		if (!container) return;

		let isScrolling = false;
		let scrollTimeout: NodeJS.Timeout;
		let touchStartY = 0;
        const THROTTLE_DELAY = 500; // ms
        const TOUCH_THRESHOLD = 30; // pixels
        const STRONG_SWIPE_THRESHOLD = 70; // pixels

        // Função para lidar com a navegação com base na direção do scroll
        const handleNavigation = (direction: number, currentSection: string, preventDefault?: () => void) => {
            if (isScrolling) return;
            
            if (preventDefault) preventDefault();
            isScrolling = true;
            
            // Caso especial para FAQ: permitir scroll natural interno
            if (currentSection === "faq" && direction > 0) {
                // Verificar se estamos no final da seção FAQ antes de navegar
                const faqElement = document.getElementById("faq");
                const isAtEnd = faqElement && 
                    isScrollingToEndOfFaq(direction);
                
                if (isAtEnd) {
                    scrollToSection("footer");
                } else {
                    isScrolling = false;
                    return;
                }
            } else if (currentSection !== "faq") {
                // Para outras seções, use o mapa de navegação
                const nextSection = getNextSection(currentSection, direction);
                if (nextSection !== currentSection) {
                    scrollToSection(nextSection);
                    console.log(`Navegando de ${currentSection} para ${nextSection} (direção: ${direction})`);
                }
            }
            
            // Reset do throttle
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => (isScrolling = false), THROTTLE_DELAY);
        };

		const handleWheel = (e: WheelEvent) => {
			const currentSection = getCurrentSection();
            
            // Permitir scroll natural dentro da seção FAQ
            if (currentSection === "faq" && !isScrollingToEndOfFaq(e.deltaY)) {
                return;
            }
            
            e.preventDefault();
            const direction = e.deltaY > 0 ? 1 : -1;
            handleNavigation(direction, currentSection);
		};
        
        // Verifica se o scroll está chegando ao fim da seção FAQ
        const isScrollingToEndOfFaq = (deltaY: number): boolean => {
            if (deltaY <= 0) return false; // Está scrollando para cima
            
            const faqElement = document.getElementById("faq");
            if (!faqElement) return false;
            
            const faqContent = faqElement.querySelector('.overflow-y-auto');
            if (!faqContent) return false;
            
            // Verifica se o scroll está próximo do final
            // Ajustado para 50px para detectar o final um pouco antes e garantir transição suave
            return (faqContent.scrollTop + faqContent.clientHeight) >= 
                   (faqContent.scrollHeight - 50);
        };

		// Manipulador de eventos de toque para suporte mobile
		const handleTouchStart = (e: TouchEvent) => {
			touchStartY = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			const currentSection = getCurrentSection();
            const touchEndY = e.touches[0].clientY;
            const touchDiff = touchStartY - touchEndY;
            
            // Não processa gestos pequenos
            if (Math.abs(touchDiff) < TOUCH_THRESHOLD) return;
            
            // Caso especial para FAQ: só navega para o footer em caso de swipe forte para baixo
            if (currentSection === "faq") {
                if (touchDiff > STRONG_SWIPE_THRESHOLD && isScrollingToEndOfFaq(touchDiff)) {
                    handleNavigation(1, currentSection, () => e.preventDefault());
                }
                return;
            }
            
            // Para outras seções
            e.preventDefault();
            const direction = touchDiff > 0 ? 1 : -1;
            handleNavigation(direction, currentSection);
            
            // Atualiza a posição inicial do toque
            touchStartY = touchEndY;
		};

		// Adiciona event listeners
		container.addEventListener("wheel", handleWheel, { passive: false });
		container.addEventListener("touchstart", handleTouchStart, {
			passive: true,
		});
		container.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});

		return () => {
			container.removeEventListener("wheel", handleWheel);
			container.removeEventListener("touchstart", handleTouchStart);
			container.removeEventListener("touchmove", handleTouchMove);
			clearTimeout(scrollTimeout);
		};
	}, [getCurrentSection, getNextSection, scrollToSection]);

	return (
		<div
			ref={mainContainerRef}
			className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory overflow-x-hidden overscroll-y-contain scroll-pt-16"
		>
			{/* Header com navegação */}
			<Header activeSection={activeSection} scrollToSection={scrollToSection} />

			{/* Hero Section */}
			<div
				id="inicio"
				className="relative h-screen flex items-center justify-center pt-20 snap-start snap-always"
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
					className="fixed hidden top-16 left-1/2 transform -translate-x-1/2 bg-[#F42254] text-white py-2 px-6 rounded-full text-sm font-medium z-50 transition-all duration-500 animate-pulse"
					style={{
						opacity: 0.9,
						pointerEvents: "none",
						boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
					}}
				>
					{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
				</div>

				{/* Canvas 3D - Renderizado apenas quando a seção atual tem visible: true */}
				{activeSection === "faq" ||
				!canConfigs[activeSection as keyof SectionConfigs]?.visible ? null : (
					<div className="fixed inset-0 w-full h-full pointer-events-none z-20">
						<Canvas
							camera={{ position: [0, 1, 50], fov: 16 }}
							style={{
								width: "100%",
								height: "100%",
								pointerEvents: "none", // Defina pointer-events como none diretamente no Canvas
							}}
							gl={{
								preserveDrawingBuffer: true,
								antialias: true,
								alpha: true,
							}}
							shadows
						>
							{/* Luz ambiente suave para iluminação geral mais uniforme */}
							<ambientLight intensity={2.8} />

							{/* Luz direcional principal para definir a direção principal de iluminação */}
							<directionalLight
								position={[5, 15, 5]}
								intensity={1.2}
								color="#ffffff"
								shadow-mapSize={[1024, 1024]}
							/>
							
							{/* Luz direcional frontal suave para iluminar a frente da lata */}
							<directionalLight
								position={[0, 3, -8]}
								intensity={0.4}
								color="#f0f0ff"
							/>
							
							{/* Luz de preenchimento sutil para reduzir sombras muito escuras */}
							<directionalLight
								position={[-5, 2, 3]}
								intensity={0.2}
								color="#fffaf0"
							/>

							{/* Luz especial para realçar a cor vermelha de forma mais sutil */}
							<spotLight
								position={[8, 5, 8]}
								intensity={0.6}
								angle={0.6}
								penumbra={0.8}
								distance={25}
								decay={2}
								color="#ff5555"
							/>

							{/* Luz pontual de destaque para brilho metálico controlado */}
							<pointLight
								position={[2, 8, 5]}
								intensity={0.7}
								distance={20}
								decay={2}
							/>

							<Suspense fallback={null}>
								<NoInteraction />
								<AnimatedCan
									scrollY={scrollY}
									activeSection={activeSection}
									sectionConfigs={canConfigs}
									metalness={0.92}
									roughness={0.2}
									envMapIntensity={2.5}
								/>
							</Suspense>
						</Canvas>
					</div>
				)}
				{/* Main Content */}
				<div className="relative z-4 text-center max-w-6xl mx-auto px-6">
					{/* Tagline */}

					{/* Large Title with 3D Can */}
					<div className="relative mb-12">
						<p className="text-lg font-medium text-gray-700 tracking-wide">
							ÁLCOOL SEM CULPA
						</p>
						<div className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-[#F42254] leading-none select-none">
							<span className="inline-block title-home px-10">PINK</span>
						</div>
					</div>

					{/* Call to Action Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
						<Button
							size="lg"
							className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium rounded-full"
							onClick={() => scrollToSection("pink")}
						>
							COMPRAR AGORA
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="border-2 border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-full bg-transparent"
							onClick={() => scrollToSection("ingredientes")}
						>
							VER INGREDIENTES
						</Button>
					</div>

					{/* Subtitle */}
					<p className="text-lg text-gray-600 mb-16">
						Você vai se surpreender com o frescor
					</p>

					{/* Scroll Indicator */}
					<ScrollIndicator
						onClick={() => scrollToSection("beneficios")}
						section="beneficios"
					/>
				</div>
			</div>

			{/* Seção Motto (Slogan) */}
			<div
				id="motto"
				className="h-screen bg-white flex items-center justify-center snap-start snap-always overflow-hidden"
			>
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
			</div>

			{/* Seção de Benefícios */}
			<div
				id="beneficios"
				className="h-screen bg-gradient-to-b from-white to-pink-50 flex items-center justify-center snap-start snap-always overflow-hidden"
			>
				<BeneficiosSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de Ingredientes */}
			<div
				id="ingredientes"
				className="h-screen bg-white flex items-center justify-center snap-start snap-always overflow-hidden"
			>
				<IngredientesSection
					scrollToSection={scrollToSection}
					onOpenModal={() => setShowIngredientesModal(true)}
				/>
			</div>

			{/* Seção Pink */}
			<div
				id="pink"
				className="h-screen bg-gradient-to-b from-white to-pink-50 flex items-center justify-center snap-start snap-always overflow-hidden"
			>
				<PinkSection
					scrollToSection={scrollToSection}
					initialQuantity={quantity}
					initialPrice={totalPrice}
				/>
			</div>

			{/* Seção Sobre Nós */}
			<div
				id="sobre"
				className="h-screen bg-gray-100 flex flex-col items-center justify-center snap-start snap-always"
			>
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
			</div>

			{/* Seção de Contato */}
			<div
				id="contato"
				className="h-screen bg-white flex items-center justify-center snap-start snap-always"
			>
				<ContatoSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de FAQ */}
			<div
				id="faq"
				className="h-screen bg-gray-50 snap-start snap-always flex flex-col"
				tabIndex={-1} // Impede que a seção receba foco por teclado
				onFocus={(e) => e.currentTarget.blur()} // Garante que o elemento não mantenha o foco
			>
				<div
					className="flex-1 flex flex-col justify-center items-center py-16 px-4 sm:px-6 overflow-hidden"
					onKeyDown={(e) => {
						// Previne completamente que teclas afetem a navegação
						e.preventDefault();
						e.stopPropagation();
					}}
					onClick={(e) => {
						// Remove o foco do elemento que recebeu o clique
						if (document.activeElement instanceof HTMLElement) {
							document.activeElement.blur();
						}
					}}
				>
					<div className="w-full max-w-4xl mx-auto">
						<h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
							Perguntas Frequentes
						</h2>
						<div
							className="overflow-y-auto hide-scrollbar pr-2"
							style={{ maxHeight: "calc(100vh - 260px)" }}
						>
							<FAQSection faq={faqData} />
						</div>

						{/* Scroll Indicator para Footer */}
						<ScrollIndicator
							onClick={() => scrollToSection("footer")}
							section="footer"
							size="small"
						/>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div
				id="footer"
				className="h-screen bg-[#181818] snap-start snap-always flex items-center justify-center px-4 sm:px-6"
			>
				<div className="w-full max-w-6xl mx-auto text-white">
					<Footer />
				</div>
			</div>

			{/* Modal de Ingredientes */}
			<IngredientesModal
				isOpen={showIngredientesModal}
				onClose={() => setShowIngredientesModal(false)}
			/>
		</div>
	);
}
