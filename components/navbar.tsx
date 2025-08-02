"use client";

import Link from "next/link";

export default function Navbar({ tab = 'home', scrollToSection }: { tab?: string; scrollToSection?: (id: string) => void }) {
    const navItems = [
        { section: "inicio", label: "INÍCIO", href: "/#inicio" },
        { section: "beneficios", label: "BENEFÍCIOS", href: "/#beneficios" },
        { section: "pink", label: "PINK", href: "/#pink" },
        { section: "sobre", label: "SOBRE", href: "/#sobre" },
        { section: "contato", label: "CONTACTO", href: "/#contato" }
    ];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
        e.preventDefault();
        scrollToSection?.(section);
        // Atualiza a URL sem recarregar a página
        window.history.pushState(null, '', `/#${section}`);
    };

    return (
        <nav>
            <ul className="flex items-center gap-2">
                {navItems.map((item) => (
                    <li key={item.section} className="relative">
                        <Link 
                            href={item.href}
                            onClick={(e) => handleClick(e, item.section)}
                            className={`p-2 transition-all duration-300 block font-medium text-[16px] ${tab === item.section ? 'text-[#F42254]' : 'text-[#868686]'}`}
                        >
                            {item.label}
                        </Link>

                        {
                            tab == item.section && (
                                <svg width="63" height="10" viewBox="0 0 63 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                    <g style={{ mixBlendMode: "multiply" }}>
                                        <path d="M1.5 8C4.09301 6.54791 7.96261 5.7098 11.0753 4.99099C14.5113 4.19752 18.0987 3.66286 21.6287 3.11712C23.0708 2.89416 23.0137 3.07443 23.5077 4C23.8599 4.65979 24.1544 5.21499 25.0779 5.56757C27.099 6.33927 30.1231 6.07483 32.2851 5.94595C39.2592 5.53018 46.2245 4.2024 53.0315 3.11712C56.0621 2.63394 58.4328 2 61.5 2" stroke="#F42254" strokeWidth="3" strokeLinecap="round" />
                                    </g>
                                </svg>
                            )
                        }
                    </li>
                ))}
            </ul>
        </nav>
    )
}
