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
import { AnimatedCan } from "@/components/animated-can";
import { CanConfigPanel } from "@/components/can-config-panel";
import { Settings } from "lucide-react";
import Header from "@/components/header";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import ScrollIndicator from "@/components/scroll-indicator";
import { NoInteraction } from "@/lib/no-interaction";
import HeroSection from "@/components/hero-section";
import MottoSection from "@/components/motto-section";
import BeneficiosSection from "@/components/beneficios-section";
import IngredientesSection from "@/components/ingredientes-section";
import PinkSection from "@/components/pink-section";
import AboutSection from "@/components/about-section";
import ContatoSection from "@/components/contato-section";
import IngredientesModal from "@/components/ingredientes-modal";

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

export default function HomePage() {
	const [scrollY, setScrollY] = useState(0);
	const [activeSection, setActiveSection] = useState("inicio");
	const mainContainerRef = useRef<HTMLDivElement>(null);
	const [quantity, setQuantity] = useState(6);
	const [totalPrice, setTotalPrice] = useState(12);
	const [showIngredientesModal, setShowIngredientesModal] = useState(false);

	// Estado para controlar a visibilidade do painel de configuração
	const [showConfigPanel, setShowConfigPanel] = useState(false);

	// Seções disponíveis no site
	const SECTIONS = ["inicio", "beneficios", "sobre", "contato", "faq"];

	// Seções na ordem exata de navegação
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

	// Configurações do modelo 3D para cada seção
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
				rotation: [0, Math.PI * 0.92, Math.PI* 0.10],
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

	// Referência para controlar a direção do scroll
	const scrollDirection = useRef({ lastY: 0, direction: 0 });

	// Navegação entre seções
	const scrollToSection = useCallback(
		(id: string) => {
			if (typeof document === "undefined") return;

			const element = document.getElementById(id);
			if (!element || activeSection === id) return;

			setActiveSection(id);
			element.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		},
		[activeSection]
	);

	// Detecção da seção ativa baseada no viewport
	const getCurrentSection = useCallback(() => {
		if (typeof window === "undefined") return "inicio";

		let bestSection = "inicio";
		let bestScore = -Infinity;
		const viewportHeight = window.innerHeight;
		const scrollThreshold = 50;

		const currentY = window.scrollY;
		const currentDirection = scrollDirection.current;
		currentDirection.direction =
			currentY > currentDirection.lastY
				? 1
				: currentY < currentDirection.lastY
				? -1
				: currentDirection.direction;
		currentDirection.lastY = currentY;

		for (const id of ORDERED_SECTIONS) {
			const element = document.getElementById(id);
			if (!element) continue;

			const rect = element.getBoundingClientRect();

			if (Math.abs(rect.top) < scrollThreshold) {
				return id;
			}

			let score = -Infinity;

			if (rect.top > 0 && rect.top < viewportHeight) {
				score = viewportHeight - rect.top;
			} else if (rect.bottom > 0 && rect.top < 0) {
				const visibleHeight = Math.min(rect.bottom, viewportHeight);
				score = visibleHeight * 1.5;

				if (visibleHeight > viewportHeight / 2) {
					score *= 1.5;
				}
			}

			if (id === "footer" && rect.top < viewportHeight) {
				score += 100;
			}

			if (score > bestScore) {
				bestScore = score;
				bestSection = id;
			}
		}

		return bestSection;
	}, [ORDERED_SECTIONS]);

	// Monitoramento de mudanças de seção
	useEffect(() => {
		if (typeof window === "undefined") return;

		let lastSection = activeSection;
		let animationFrameId: number;

		const checkSectionChange = () => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);
			const currentSection = getCurrentSection();

			if (currentSection !== lastSection) {
				lastSection = currentSection;
				setActiveSection(currentSection);

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
			}

			animationFrameId = requestAnimationFrame(checkSectionChange);
		};

		checkSectionChange();

		const handleScrollStart = () => {
			cancelAnimationFrame(animationFrameId);
			checkSectionChange();
		};

		window.addEventListener("scroll", handleScrollStart, { passive: true });
		window.addEventListener("resize", handleScrollStart, { passive: true });

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("scroll", handleScrollStart);
			window.removeEventListener("resize", handleScrollStart);
		};
	}, [getCurrentSection, activeSection, canConfigs]);

	// Atualização da animação 3D quando a seção muda
	useEffect(() => {
		if (
			typeof window === "undefined" ||
			activeSection === "faq" ||
			!canConfigs[activeSection as keyof SectionConfigs]?.visible
		) {
			return;
		}

		const event = new CustomEvent("sectionChanged", {
			detail: { section: activeSection, configs: canConfigs },
		});
		window.dispatchEvent(event);
	}, [activeSection, canConfigs]);

	// Mapa de navegação entre seções
	const getNextSection = useCallback((currentSection: string, direction: number): string => {
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

		const directionKey = direction < 0 ? "up" : "down";
		return navigationMap[currentSection]?.[directionKey] || currentSection;
	}, []);

	// Navegação por teclado
	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

			e.preventDefault();
			const currentSection = getCurrentSection();
			const direction = e.key === "ArrowDown" ? 1 : -1;
			const nextSection = getNextSection(currentSection, direction);
			
			if (nextSection !== currentSection) {
				scrollToSection(nextSection);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [getCurrentSection, getNextSection, scrollToSection]);

	// Navegação por scroll e touch
	useEffect(() => {
		const container = mainContainerRef.current;
		if (!container) return;

		let touchStartY = 0;
        const TOUCH_THRESHOLD = 30;

        const handleNavigation = (direction: number, currentSection: string, preventDefault?: () => void) => {            
            if (preventDefault) preventDefault();
            
            const nextSection = getNextSection(currentSection, direction);
            if (nextSection !== currentSection) {
                scrollToSection(nextSection);
            }
        };

		const handleWheel = (e: WheelEvent) => {
			const currentSection = getCurrentSection();
            e.preventDefault();
            const direction = e.deltaY > 0 ? 1 : -1;
            handleNavigation(direction, currentSection);
		};

		const handleTouchStart = (e: TouchEvent) => {
			touchStartY = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			const currentSection = getCurrentSection();
            const touchEndY = e.touches[0].clientY;
            const touchDiff = touchStartY - touchEndY;
            
            if (Math.abs(touchDiff) < TOUCH_THRESHOLD) return;
            
            e.preventDefault();
            const direction = touchDiff > 0 ? 1 : -1;
            handleNavigation(direction, currentSection);
            
            touchStartY = touchEndY;
		};

		container.addEventListener("wheel", handleWheel, { passive: false });
		container.addEventListener("touchstart", handleTouchStart, { passive: true });
		container.addEventListener("touchmove", handleTouchMove, { passive: false });

		return () => {
			container.removeEventListener("wheel", handleWheel);
			container.removeEventListener("touchstart", handleTouchStart);
			container.removeEventListener("touchmove", handleTouchMove);
		};
	}, [getCurrentSection, getNextSection, scrollToSection]);

	return (
		<div
			ref={mainContainerRef}
			className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory overflow-x-hidden overscroll-y-contain scroll-pt-16"
		>
			{/* Header com navegação */}
			<Header activeSection={activeSection} scrollToSection={scrollToSection} />

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

			{/* Canvas 3D - Renderizado apenas quando a seção atual tem visible: true */}
			{activeSection === "faq" ||
			!canConfigs[activeSection as keyof SectionConfigs]?.visible ? null : (
				<div className="fixed inset-0 w-full h-full pointer-events-none z-20">
					<Canvas
						camera={{ position: [0, 1, 50], fov: 16 }}
						style={{
							width: "100%",
							height: "100%",
							pointerEvents: "none",
						}}
						gl={{
							antialias: true,
							alpha: true,
							powerPreference: "high-performance",
							precision: "highp" 
						}}
						dpr={[1, 2]} // Limita o DPR para melhor performance
						performance={{ min: 0.5 }} // Permite degradação suave em dispositivos lentos
					>
						{/* Sistema de iluminação ultra-otimizado - menos luzes para melhor performance */}
						<ambientLight intensity={10} />
						
						{/* Luz direcional principal unificada - combina a função das duas luzes anteriores */}
						<directionalLight
							position={[5, 6, 5]}
							intensity={1.2}
							color="#ffffff"
						/>

						<Suspense fallback={null}>
							<NoInteraction />
							<AnimatedCan
								scrollY={scrollY}
								activeSection={activeSection}
								sectionConfigs={canConfigs}
								metalness={0.95}
								roughness={0.15}
								envMapIntensity={2.0}
							/>
						</Suspense>
					</Canvas>
				</div>
			)}

			{/* Hero Section */}
			<div
				id="inicio"
				className="relative h-screen flex items-center justify-center pt-20 snap-start snap-always"
			>
				<HeroSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção Motto (Slogan) */}
			<div
				id="motto"
				className="h-screen flex items-center justify-center snap-start snap-always overflow-hidden"
			>
				<MottoSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de Benefícios */}
			<div
				id="beneficios"
				className="h-screen flex items-center justify-center snap-start snap-always overflow-hidden"
			>
				<BeneficiosSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de Ingredientes */}
			<div
				id="ingredientes"
				className="h-screen flex items-center justify-center snap-start snap-always overflow-hidden"
			>
				<IngredientesSection
					scrollToSection={scrollToSection}
					onOpenModal={() => setShowIngredientesModal(true)}
				/>
			</div>

			{/* Seção Pink */}
			<div
				id="pink"
				className="h-screen flex items-center justify-center snap-start snap-always overflow-hidden"
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
				className="h-screen flex flex-col items-center justify-center snap-start snap-always"
			>
				<AboutSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de Contato */}
			<div
				id="contato"
				className="h-screen flex items-center justify-center snap-start snap-always"
			>
				<ContatoSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de FAQ */}
			<div
				id="faq"
				className="h-screen snap-start snap-always flex flex-col"
			>
				<div className="flex-1 flex flex-col justify-center items-center py-16 px-4 sm:px-6 overflow-hidden">
					<div className="w-full max-w-4xl mx-auto">
						<h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
							Perguntas Frequentes
						</h2>
						<div className="overflow-y-auto hide-scrollbar pr-2 max-h-[calc(100vh-260px)]">
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
