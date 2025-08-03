"use client";

import { Canvas } from "@react-three/fiber";
import {
	Suspense,
	useEffect,
	useState,
	useMemo,
	useCallback,
	useRef,
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
import ContatoSection from "@/components/contato-section";
import IngredientesModal from "@/components/ingredientes-modal";
import HomeLayout from "./layout.client";

// Tipagem para melhorar segurança e autocompletar
interface CanConfig {
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
	visible: boolean;
}

// Estrutura para configurações responsivas - mobile e desktop
interface DeviceConfigs {
	mobile: { [key: string]: CanConfig };
	desktop: { [key: string]: CanConfig };
}

// Configurações da seção ativa (usado pelo AnimatedCan)
interface SectionConfigs {
	[key: string]: CanConfig;
}

// Mapa de navegação entre seções - movido para fora do componente para otimização
const NAVIGATION_MAP: { [key: string]: { up: string; down: string } } = {
	inicio: { up: "inicio", down: "motto" },
	motto: { up: "inicio", down: "beneficios" },
	beneficios: { up: "motto", down: "ingredientes" },
	ingredientes: { up: "beneficios", down: "pink" },
	pink: { up: "ingredientes", down: "contato" },
	contato: { up: "pink", down: "faq" },
	faq: { up: "contato", down: "footer" },
	footer: { up: "faq", down: "footer" },
};

// Configurações padrão da lata 3D - movidas para fora do componente para evitar re-criação
const DEFAULT_CAN_CONFIGS: DeviceConfigs = {
	mobile: {
		inicio: {
			position: [0, -6.0, 10],
			rotation: [0, Math.PI * 1, 0],
			scale: 0.5,
			visible: true,
		},
		motto: {
			position: [1.4, -2.5, 10],
			rotation: [Math.PI * 0.16, 0, Math.PI * 0.32],
			scale: 0.35,
			visible: true,
		},
		beneficios: {
			position: [1.5, -3, 10],
			rotation: [Math.PI * 0.32, 0, Math.PI * 0.32],
			scale: 0.35,
			visible: true,
		},
		ingredientes: {
			position: [-1.8, -4.5, 10],
			rotation: [0, Math.PI * 1, Math.PI * 0.32],
			scale: 0.38,
			visible: true,
		},
		pink: {
			position: [2, 1.6, 10],
			rotation: [Math.PI * 1.08, 0, Math.PI * 0.7],
			scale: 0.38,
			visible: true,
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
	},
	desktop: {
		inicio: {
			position: [2.3, 1.6, 10],
			rotation: [1, 0, Math.PI * 0.5],
			scale: 0.42,
			visible: true,
		},
		motto: {
			position: [2.0, 1.6, 10.0],
			rotation: [Math.PI * 1.62, 0.06, Math.PI * 0.48],
			scale: 0.35,
			visible: true,
		},
		beneficios: {
			position: [-6, -4, 10],
			rotation: [0, Math.PI * 0.92, Math.PI * 0.1],
			scale: 0.7,
			visible: true,
		},
		ingredientes: {
			position: [-6, -4, 10],
			rotation: [Math.PI * 0.06, Math.PI * 1.75, 0],
			scale: 0.7,
			visible: true,
		},
		pink: {
			position: [-6, -4, 10],
			rotation: [0, Math.PI * 1.75, Math.PI * 0.1],
			scale: 0.7,
			visible: true,
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
	},
};

export default function HomePage() {
	const [scrollY, setScrollY] = useState(0);
	const [activeSection, setActiveSection] = useState("inicio");
	const [slideDirection, setSlideDirection] = useState<"up" | "down" | "none">(
		"none"
	);
	const mainContainerRef = useRef<HTMLDivElement>(null);
	const [quantity, setQuantity] = useState(6);
	const [totalPrice, setTotalPrice] = useState(12);
	const [showIngredientesModal, setShowIngredientesModal] = useState(false);

	// Estado para controlar a visibilidade do painel de configuração
	const [showConfigPanel, setShowConfigPanel] = useState(false);

	// Hook para ler âncora da URL na inicialização
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const hash = window.location.hash.replace('#', '');
			const validSections = ['inicio', 'beneficios', 'ingredientes', 'pink', 'contato', 'faq'];
			if (hash && validSections.includes(hash)) {
				setActiveSection(hash);
				
				// Pequeno delay para garantir que a página carregou antes de fazer scroll
				setTimeout(() => {
					const element = document.getElementById(hash);
					if (element) {
						setActiveSection(hash);
					}
				}, 100);
			}
		}
	}, []);

	// Hook para escutar mudanças na URL (botão voltar/avançar do navegador)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const handlePopState = () => {
				const hash = window.location.hash.replace('#', '');
				const validSections = ['inicio', 'beneficios', 'ingredientes', 'pink', 'contato', 'faq'];
				if (hash && validSections.includes(hash)) {
					setActiveSection(hash);
				} else if (!hash) {
					setActiveSection('inicio');
				}
			};

			window.addEventListener('popstate', handlePopState);
			return () => window.removeEventListener('popstate', handlePopState);
		}
	}, []);

	// Hook para detectar se é desktop (lg breakpoint = 1024px)
	// Implementa detecção responsiva otimizada com SSR support
	const [isDesktop, setIsDesktop] = useState(() => {
		// Verificação inicial apenas se estiver no cliente
		if (typeof window !== 'undefined') {
			return window.innerWidth >= 1024;
		}
		return false; // Default para servidor (SSR)
	});

	useEffect(() => {
		const checkScreenSize = () => {
			const newIsDesktop = window.innerWidth >= 1024;
			// Só atualiza se realmente houve mudança (otimização de re-renders)
			setIsDesktop(prev => prev !== newIsDesktop ? newIsDesktop : prev);
		};

		// Listener otimizado para mudanças de tamanho da tela
		let timeoutId: NodeJS.Timeout;
		const debouncedCheckScreenSize = () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(checkScreenSize, 100); // Debounce de 100ms
		};

		window.addEventListener("resize", debouncedCheckScreenSize);

		return () => {
			window.removeEventListener("resize", debouncedCheckScreenSize);
			clearTimeout(timeoutId);
		};
	}, []);

	// Hook para prevenir pull-to-refresh no mobile mantendo scroll mínimo
	useEffect(() => {
		if (typeof window === 'undefined' || isDesktop) return;

		// Função para manter sempre um scroll mínimo no mobile
		const maintainMinimalScroll = () => {
			// Se o scroll está no topo (0), força um scroll mínimo de 1px
			if (window.scrollY === 0) {
				window.scrollTo(0, 1);
			}
		};

		// Cria um elemento invisível para forçar scroll disponível
		const createScrollSpacer = () => {
			const spacer = document.createElement('div');
			spacer.id = 'mobile-scroll-spacer';
			spacer.style.cssText = `
				position: fixed;
				top: -10px;
				left: 0;
				width: 1px;
				height: 10px;
				opacity: 0;
				pointer-events: none;
				z-index: -1;
			`;
			document.body.appendChild(spacer);
			return spacer;
		};

		// Remove spacer existente se houver
		const existingSpacer = document.getElementById('mobile-scroll-spacer');
		if (existingSpacer) {
			existingSpacer.remove();
		}

		// Cria novo spacer
		const spacer = createScrollSpacer();

		// Força body ter altura mínima para permitir scroll
		const originalBodyHeight = document.body.style.height;
		document.body.style.minHeight = 'calc(100vh + 2px)';

		// Mantém scroll mínimo na inicialização
		setTimeout(maintainMinimalScroll, 100);

		// Listener para manter scroll mínimo
		const handleScroll = () => {
			maintainMinimalScroll();
		};

		// Listener para touch start - previne pull-to-refresh
		const handleTouchStart = (e: TouchEvent) => {
			maintainMinimalScroll();
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('touchstart', handleTouchStart, { passive: true });

		return () => {
			// Cleanup
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('touchstart', handleTouchStart);
			
			// Remove spacer
			if (spacer && spacer.parentNode) {
				spacer.parentNode.removeChild(spacer);
			}
			
			// Restaura altura original do body
			document.body.style.height = originalBodyHeight;
		};
	}, [isDesktop]);

	// Seções disponíveis no site
	const SECTIONS = ["inicio", "beneficios", "ingredientes", "contato", "faq"];

	// Seções na ordem exata de navegação
	const ORDERED_SECTIONS = [
		"inicio",
		"motto",
		"beneficios",
		"ingredientes",
		"pink",
		"contato",
		"faq",
		"footer",
	];

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
				"Boa! Entra em contacto connosco através do e-mail comercial@steez.com.",
		},
	];

	// Configurações responsivas das latas para mobile e desktop
	const [canConfigs, setCanConfigs] = useState<DeviceConfigs>(() => DEFAULT_CAN_CONFIGS);

	// Função estável para atualizar configurações
	const updateCanConfigs = useCallback((newConfigs: SectionConfigs, deviceType: 'mobile' | 'desktop') => {
		setCanConfigs(prev => ({
			...prev,
			[deviceType]: newConfigs
		}));
	}, []);

	// Configurações ativas baseadas no tamanho da tela
	// Automatically switches between mobile/desktop configs based on screen size
	const activeCanConfigs = useMemo<SectionConfigs>(() => {
		return isDesktop ? canConfigs.desktop : canConfigs.mobile;
	}, [isDesktop, canConfigs]);

	// Referência estável para evitar re-renders desnecessários
	const activeCanConfigsRef = useRef<SectionConfigs>(activeCanConfigs);
	
	useEffect(() => {
		activeCanConfigsRef.current = activeCanConfigs;
	}, [activeCanConfigs]);

	// Referência para controlar a direção do scroll
	const scrollDirection = useRef({ lastY: 0, direction: 0 });

	// Navegação entre seções
	const scrollToSection = useCallback(
		(id: string, direction?: number) => {
			if (typeof document === "undefined") return;

			const element = document.getElementById(id);
			if (!element || activeSection === id) return;

			// Determina a direção do slide baseada na navegação
			if (direction !== undefined) {
				setSlideDirection(direction > 0 ? "down" : "up");
			} else {
				setSlideDirection("none");
			}

			// Como removemos o scroll do browser, apenas mudamos a seção ativa
			// A navegação visual será gerenciada pela lógica da aplicação
			setActiveSection(id);

			// Reset da direção após a transição
			setTimeout(() => {
				setSlideDirection("none");
			}, 500);
		},
		[activeSection]
	);

	// Detecção da seção ativa baseada no activeSection atual
	const getCurrentSection = useCallback(() => {
		// Como não temos mais scroll nativo, retornamos a seção ativa atual
		return activeSection;
	}, [activeSection]);

	// Atualização da animação 3D quando a seção muda
	// Otimizado para evitar loops infinitos usando useRef para configurações
	useEffect(() => {
		if (
			typeof window === "undefined" ||
			activeSection === "faq" ||
			!activeCanConfigsRef.current[activeSection as keyof SectionConfigs]?.visible
		) {
			return;
		}

		const event = new CustomEvent("sectionChanged", {
			detail: { section: activeSection, configs: activeCanConfigsRef.current },
		});
		window.dispatchEvent(event);
	}, [activeSection]); // Removemos activeCanConfigs das dependências para evitar loops

	// Mapa de navegação entre seções
	const getNextSection = useCallback(
		(currentSection: string, direction: number): string => {
			const directionKey = direction < 0 ? "up" : "down";
			return NAVIGATION_MAP[currentSection]?.[directionKey] || currentSection;
		},
		[]
	);

	// Navegação por teclado
	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

			e.preventDefault();

			// Para as setas, navegação imediata sem MIN_SCROLL_DURATION
			const currentSection = getCurrentSection();
			const direction = e.key === "ArrowDown" ? 1 : -1;
			const nextSection = getNextSection(currentSection, direction);

			if (nextSection !== currentSection) {
				scrollToSection(nextSection, direction);
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
		let touchStartTime = 0;
		let isScrolling = false;
		let scrollStartTime = 0;
		let lastScrollTime = 0;
		let isBlocked = false; // Estado de bloqueio global

		const TOUCH_THRESHOLD = 50; // Aumentado para evitar triggers acidentais
		const MIN_SCROLL_DURATION = 500; // 500ms mínimo para scroll wheel
		const MIN_TOUCH_DURATION = 50; // 50ms mínimo para touch - mais responsivo
		const SCROLL_DEBOUNCE = 500; // Debounce entre scrolls
		const GLOBAL_BLOCK_DURATION = 500; // Bloqueio global de 500ms

		// Função para manter scroll mínimo no mobile
		const maintainMinimalScroll = () => {
			if (!isDesktop && typeof window !== 'undefined' && window.scrollY === 0) {
				window.scrollTo(0, 1);
			}
		};

		const handleNavigation = (direction: number) => {
			const currentTime = Date.now();

			// Verifica se está bloqueado globalmente
			if (isBlocked) {
				return;
			}

			// Evita múltiplas navegações muito próximas
			if (currentTime - lastScrollTime < SCROLL_DEBOUNCE) {
				return;
			}

			const currentSection = getCurrentSection();
			const nextSection = getNextSection(currentSection, direction);

			if (nextSection !== currentSection) {
				lastScrollTime = currentTime;
				scrollToSection(nextSection, direction);

				// Bloqueia todas as interações por 500ms
				isBlocked = true;
				setTimeout(() => {
					isBlocked = false;
					// Mantém scroll mínimo após navegação no mobile
					maintainMinimalScroll();
				}, GLOBAL_BLOCK_DURATION);
			}
		};

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();

			// Se estiver bloqueado, ignora completamente
			if (isBlocked) {
				return;
			}

			// Mantém scroll mínimo antes de processar wheel
			maintainMinimalScroll();

			const currentTime = Date.now();

			// Inicia o scroll
			if (!isScrolling) {
				isScrolling = true;
				scrollStartTime = currentTime;
			}

			// Verifica se já passou tempo suficiente desde o início
			const scrollDuration = currentTime - scrollStartTime;
			if (scrollDuration >= MIN_SCROLL_DURATION) {
				const direction = e.deltaY > 0 ? 1 : -1;
				handleNavigation(direction);
				isScrolling = false; // Reset para próxima interação
			}
		};

		const handleTouchStart = (e: TouchEvent) => {
			// Se estiver bloqueado, ignora completamente
			if (isBlocked) {
				return;
			}

			// Mantém scroll mínimo no touch start
			maintainMinimalScroll();

			touchStartY = e.touches[0].clientY;
			touchStartTime = Date.now();
			isScrolling = false;
		};

		const handleTouchMove = (e: TouchEvent) => {
			// Se estiver bloqueado, ignora completamente
			if (isBlocked || !touchStartY || !touchStartTime) {
				return;
			}

			const currentTouch = e.touches[0];
			const currentTime = Date.now();
			const touchDiff = touchStartY - currentTouch.clientY;
			const touchDuration = currentTime - touchStartTime;

			// Verifica se o movimento é significativo
			if (Math.abs(touchDiff) < TOUCH_THRESHOLD) return;

			// Verifica se o touch durou tempo suficiente (menor que scroll wheel)
			if (touchDuration < MIN_TOUCH_DURATION) return;

			e.preventDefault();

			// Determina direção: positivo = para baixo, negativo = para cima
			const direction = touchDiff > 0 ? 1 : -1;

			handleNavigation(direction);

			// Reset para evitar múltiplos triggers
			touchStartY = 0;
			touchStartTime = 0;
		};

		const handleTouchEnd = () => {
			// Reset das variáveis de touch
			touchStartY = 0;
			touchStartTime = 0;
			isScrolling = false;
			
			// Mantém scroll mínimo após touch end
			setTimeout(maintainMinimalScroll, 50);
		};

		// Event listeners
		container.addEventListener("wheel", handleWheel, { passive: false });
		container.addEventListener("touchstart", handleTouchStart, {
			passive: true,
		});
		container.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});
		container.addEventListener("touchend", handleTouchEnd, { passive: true });

		return () => {
			container.removeEventListener("wheel", handleWheel);
			container.removeEventListener("touchstart", handleTouchStart);
			container.removeEventListener("touchmove", handleTouchMove);
			container.removeEventListener("touchend", handleTouchEnd);
		};
	}, [getCurrentSection, getNextSection, scrollToSection, isDesktop]);

	// Função para gerar classes CSS de animação
	const getSlideClasses = useCallback(
		(sectionId: string) => {
			const isActive = activeSection === sectionId;
			const baseClasses =
				"absolute inset-0 h-screen w-screen transition-all duration-500 ease-in-out overflow-hidden";

			if (isActive) {
				return `${baseClasses} opacity-100 z-10 transform translate-y-0`;
			} else {
				// Invertido: scroll up = animação descendo, scroll down = animação subindo
				const translateClass =
					slideDirection === "up"
						? "transform translate-y-full"
						: slideDirection === "down"
						? "transform -translate-y-full"
						: "transform translate-y-0";

				return `${baseClasses} opacity-0 z-0 pointer-events-none ${translateClass}`;
			}
		},
		[activeSection, slideDirection]
	);

	return (
		<HomeLayout>
			<div
				ref={mainContainerRef}
				className="h-full w-full"
			>
			{/* Header com navegação */}
			<Header activeSection={activeSection} scrollToSection={scrollToSection} />

			{/* Botão de configuração */}
			<button
				className="fixed hidden right-5 bottom-5 bg-gray-800 text-white p-3 rounded-full z-50 shadow-lg hover:bg-gray-700 transition-colors"
				onClick={() => setShowConfigPanel(!showConfigPanel)}
			>
				<Settings className="w-5 h-5" />
			</button>

			{/* Painel de configuração - agora responsivo */}
			{showConfigPanel && (
				<CanConfigPanel
					configs={activeCanConfigs}
					onConfigChange={(newConfigs: SectionConfigs) => {
						// Atualiza apenas as configurações do dispositivo ativo usando função estável
						updateCanConfigs(newConfigs, isDesktop ? "desktop" : "mobile");
					}}
					activeSection={activeSection}
				/>
			)}

			{/* Canvas 3D - Renderizado apenas quando a seção atual tem visible: true */}
			{activeSection === "faq" ||
			!activeCanConfigs[activeSection as keyof SectionConfigs]
				?.visible ? null : (
				<div className="fixed inset-0 w-screen h-screen pointer-events-none z-20 overflow-hidden">
					<Canvas
						camera={{ position: [0, 1, 50], fov: 16 }}
						style={{
							width: "100vw",
							height: "100vh",
							pointerEvents: "none",
						}}
						gl={{
							antialias: true,
							alpha: true,
							powerPreference: "high-performance",
							precision: "highp",
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
								sectionConfigs={activeCanConfigs}
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
				className={`${getSlideClasses(
					"inicio"
				)} flex items-center justify-center pt-20`}
			>
				<HeroSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção Motto (Slogan) */}
			<div
				id="motto"
				className={`${getSlideClasses(
					"motto"
				)} flex items-center justify-center lg:pt-32 pb-64 lg:pb-0`}
			>
				<MottoSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de Benefícios */}
			<div
				id="beneficios"
				className={`${getSlideClasses(
					"beneficios"
				)} flex items-center justify-center pt-0 lg:pt-20 pb-64 lg:pb-0 `}
			>
				<BeneficiosSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de Ingredientes */}
			<div
				id="ingredientes"
				className={`${getSlideClasses(
					"ingredientes"
				)} flex items-center justify-center pt-0 lg:pt-16 pb-48 lg:pb-0`}
			>
				<IngredientesSection
					scrollToSection={scrollToSection}
					onOpenModal={() => setShowIngredientesModal(true)}
				/>
			</div>

			{/* Seção Pink */}
			<div
				id="pink"
				className={`${getSlideClasses(
					"pink"
				)} flex items-center justify-end pt-64 lg:pt-0 pb-0 lg:pb-0`}
			>
				<PinkSection
					scrollToSection={scrollToSection}
					initialQuantity={quantity}
					initialPrice={totalPrice}
				/>
			</div>

			{/* Seção de Contato */}
			<div
				id="contato"
				className={`${getSlideClasses(
					"contato"
				)} flex items-center justify-center pt-6 lg:pt-8`}
			>
				<ContatoSection scrollToSection={scrollToSection} />
			</div>

			{/* Seção de FAQ */}
			<div id="faq" className={`${getSlideClasses("faq")} flex flex-col`}>
				<div className="flex-1 flex flex-col justify-center items-center py-16 px-4 sm:px-6 overflow-hidden">
					<div className="w-full max-w-4xl mx-auto">
						<h2 className="text-3xl md:text-4xl font-semibold text-center uppercase italic mb-8 text-[#181818]">
							Perguntas Frequentes
						</h2>
						<div className="overflow-y-auto hide-scrollbar pr-2 max-h-[calc(100vh-260px)]">
							<FAQSection faq={faqData} />
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div
				id="footer"
				className={`${getSlideClasses(
					"footer"
				)} bg-[#181818] flex items-center justify-center px-4 sm:px-6`}
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
		</HomeLayout>
	);
}
