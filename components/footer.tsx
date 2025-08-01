import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-6 md:py-12 rounded-t-[50px] text-white overflow-hidden min-h-[200px] flex items-center">
            <div className="container px-4 md:px-6 w-full">
                <div className="flex items-center justify-center pb-6 md:pb-12 border-b border-white/20">
                    {/* Layout responsivo para redes sociais e contacto */}
                    <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between w-full">
                        {/* Redes sociais - agrupadas em flexbox */}
                        <div className="flex items-center gap-4 md:gap-6">
                            <Link href="https://tiktok.com/@steezdrink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-3 text-[12px] sm:text-[13px] md:text-[16px] font-bold text-white hover:text-[#F42254] transition-colors">
                                <svg width="16" height="18" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[18px] sm:h-[20px] md:w-[22px] md:h-[24px] flex-shrink-0">
                                    <path d="M21.5356 6.06742C20.2302 6.06987 18.9598 5.6457 17.9177 4.85948C17.1821 4.30574 16.5837 3.59017 16.1689 2.76815C15.7542 1.94613 15.534 1.03969 15.5257 0.118988H11.645V10.7206L11.641 16.5292C11.6408 17.0075 11.5428 17.4807 11.3531 17.9198C11.1635 18.3589 10.8861 18.7546 10.5381 19.0827C10.19 19.4108 9.77865 19.6643 9.32914 19.8277C8.87963 19.9911 8.40147 20.061 7.924 20.033C7.35636 20.0017 6.80491 19.8326 6.31739 19.5401C5.80286 19.234 5.37514 18.8015 5.07485 18.2835C4.77456 17.7655 4.61168 17.1794 4.60168 16.5808C4.59343 16.0195 4.71974 15.4644 4.97003 14.962C5.22032 14.4595 5.58732 14.0244 6.04031 13.6928C6.4933 13.3613 7.01911 13.1431 7.57372 13.0565C8.12834 12.9699 8.69563 13.0174 9.22813 13.195V9.25585C8.85778 9.20069 8.48388 9.17285 8.10945 9.17254C5.96135 9.17254 3.95408 10.0651 2.51805 11.6737C1.4312 12.89 0.784382 14.4362 0.681352 16.0641C0.613409 17.1084 0.771757 18.1551 1.14557 19.1326C1.51939 20.1101 2.09986 20.9954 2.8473 21.7279C4.24704 23.1142 6.13941 23.8889 8.10945 23.882C8.48631 23.882 8.86119 23.8542 9.22813 23.7997C10.7947 23.569 12.2464 22.843 13.3706 21.7279C14.0585 21.0537 14.6055 20.2494 14.9797 19.3619C15.3539 18.4743 15.5479 17.5212 15.5504 16.558L15.5306 7.88527C17.2537 9.21577 19.3705 9.9352 21.5475 9.93023V6.06643L21.5356 6.06742Z" fill="white" />
                                </svg>
                                <span className="hidden sm:inline">
                                    @steezdrink
                                </span>
                            </Link>

                            <Link href="https://instagram.com/steezdrink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-3 text-[12px] sm:text-[13px] md:text-[16px] font-bold text-white hover:text-[#F42254] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[18px] sm:h-[18px] md:w-[22px] md:h-[22px] flex-shrink-0">
                                    <path d="M6.70252 0.669098H15.3802C16.9691 0.670149 18.4926 1.30179 19.6161 2.42529C20.7396 3.5488 21.3712 5.07229 21.3723 6.66116V15.3389C21.3723 16.1257 21.2173 16.9049 20.9162 17.6319C20.615 18.3589 20.1736 19.0195 19.6172 19.5759C19.0608 20.1323 18.4003 20.5737 17.6733 20.8748C16.9463 21.1759 16.1671 21.3309 15.3802 21.3309H6.70252C5.11364 21.3299 3.59015 20.6982 2.46665 19.5747C1.34314 18.4512 0.7115 16.9277 0.710449 15.3389V6.66116C0.710449 5.07197 1.34175 3.54786 2.46549 2.42413C3.58922 1.3004 5.11332 0.669098 6.70252 0.669098ZM6.49623 2.73587C5.50989 2.73587 4.56395 3.1277 3.8665 3.82515C3.16905 4.5226 2.77723 5.46854 2.77723 6.45488V15.5451C2.77697 16.0336 2.87298 16.5173 3.05979 16.9686C3.24659 17.42 3.52052 17.8301 3.86592 18.1755C4.21131 18.5208 4.6214 18.7948 5.07272 18.9816C5.52405 19.1684 6.00777 19.2644 6.49623 19.2641H15.5865C16.5728 19.2641 17.5188 18.8723 18.2162 18.1749C18.9137 17.4774 19.3055 16.5315 19.3055 15.5451V6.45488C19.3058 5.96642 19.2097 5.4827 19.0229 5.03137C18.8361 4.58004 18.5622 4.16996 18.2168 3.82457C17.8714 3.47917 17.4613 3.20524 17.01 3.01844C16.5587 2.83163 16.0749 2.73561 15.5865 2.73587H6.49623ZM16.4652 4.28497C16.8076 4.28497 17.1361 4.42101 17.3782 4.66316C17.6204 4.90532 17.7564 5.23375 17.7564 5.57621C17.7564 5.91866 17.6204 6.2471 17.3782 6.48925C17.1361 6.7314 16.8076 6.86745 16.4652 6.86745C16.1227 6.86745 15.7943 6.7314 15.5521 6.48925C15.31 6.2471 15.1739 5.91866 15.1739 5.57621C15.1739 5.23375 15.31 4.90532 15.5521 4.66316C15.7943 4.42101 16.1227 4.28497 16.4652 4.28497ZM11.0414 5.83505C11.7196 5.83505 12.3913 5.96864 13.0179 6.22821C13.6445 6.48777 14.2139 6.86822 14.6935 7.34783C15.1731 7.82744 15.5536 8.39682 15.8132 9.02346C16.0727 9.65011 16.2063 10.3217 16.2063 11C16.2063 11.6783 16.0727 12.3499 15.8132 12.9766C15.5536 13.6032 15.1731 14.1726 14.6935 14.6522C14.2139 15.1318 13.6445 15.5122 13.0179 15.7718C12.3913 16.0314 11.7196 16.165 11.0414 16.165C9.67153 16.165 8.3578 15.6208 7.38918 14.6522C6.42056 13.6836 5.8764 12.3698 5.8764 11C5.8764 9.63018 6.42056 8.31645 7.38918 7.34783C8.3578 6.37921 9.67153 5.83505 11.0414 5.83505ZM11.0414 7.90083C10.2194 7.90083 9.43112 8.22735 8.84991 8.80856C8.2687 9.38977 7.94219 10.1781 7.94219 11C7.94219 11.822 8.2687 12.6102 8.84991 13.1915C9.43112 13.7727 10.2194 14.0992 11.0414 14.0992C11.8633 14.0992 12.6516 13.7727 13.2328 13.1915C13.814 12.6102 14.1405 11.822 14.1405 11C14.1405 10.1781 13.814 9.38977 13.2328 8.80856C12.6516 8.22735 11.8633 7.90083 11.0414 7.90083Z" fill="white" />
                                </svg>
                                <span className="hidden sm:inline">
                                    @steezdrink
                                </span>
                            </Link>

                            <Link href="https://facebook.com/steezdrink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 md:gap-3 text-[12px] sm:text-[13px] md:text-[16px] font-bold text-white hover:text-[#F42254] transition-colors">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px] flex-shrink-0">
                                    <g clipPath="url(#clip0_344_1067)">
                                        <path d="M23.8759 12C23.8759 5.42736 18.5477 0.0991821 11.975 0.0991821C5.4024 0.0991821 0.0742188 5.42736 0.0742188 12C0.0742188 17.94 4.42616 22.8635 10.1155 23.7563V15.4401H7.09385V12H10.1155V9.37811C10.1155 6.39546 11.8923 4.74794 14.6107 4.74794C15.9123 4.74794 17.2746 4.98038 17.2746 4.98038V7.9091H15.774C14.2957 7.9091 13.8346 8.82653 13.8346 9.7686V12H17.1352L16.6075 15.4401H13.8346V23.7563C19.5239 22.8635 23.8759 17.94 23.8759 12Z" fill="white" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_344_1067">
                                            <rect width="23.8017" height="23.8017" fill="white" transform="translate(0.0742188 0.0991821)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span className="hidden sm:inline">
                                    /steezdrink
                                </span>
                            </Link>
                        </div>

                        {/* Botão contacto - separado das redes sociais */}
                        <Link href="/contacto" className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-[12px] sm:text-[13px] md:text-[16px] hover:bg-[#F42254] hover:text-white transition-colors flex items-center justify-center gap-2 md:gap-3">
                            <svg width="16" height="13" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[18px] sm:h-[15px] md:w-[21px] md:h-[18px] flex-shrink-0">
                                <path d="M18.7606 0.73587H2.23229C1.68589 0.737709 1.16253 0.95626 0.777097 1.34356C0.39166 1.73085 0.17563 2.25525 0.176421 2.80166L0.166504 15.1983C0.168334 15.7457 0.386566 16.27 0.77358 16.6571C1.16059 17.0441 1.68497 17.2623 2.23229 17.2641H18.7606C19.308 17.2626 19.8327 17.0444 20.2199 16.6574C20.6071 16.2704 20.8255 15.7458 20.8273 15.1983V2.80166C20.8255 2.25417 20.6071 1.72964 20.2199 1.3426C19.8327 0.955556 19.308 0.737439 18.7606 0.73587ZM18.7606 4.86744L10.4964 10.0334L2.23229 4.86744V2.80166L10.4964 7.96661L18.7606 2.80166V4.86744Z" fill="currentColor" />
                            </svg>
                            <span>
                                CONTACTO
                            </span>
                        </Link>
                    </div>
                </div>

                <div className="py-6 md:py-12 flex items-center justify-center">
                    <svg width="1730" viewBox="0 0 1730 343" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md md:max-w-full h-auto">
                        <path d="M170.602 342.49C51.989 342.49 1.97688 292.328 0.206543 226.325H96.69C97.5752 254.486 114.836 273.847 171.044 273.847C217.516 273.847 235.219 261.527 235.219 241.286C235.219 218.845 224.154 211.804 153.783 200.364C37.3837 184.083 10.8286 150.202 10.8286 96.0792C10.8286 43.717 52.4316 0.595032 164.406 0.595032C276.822 0.595032 323.293 48.5572 327.277 115H234.777C232.121 90.359 217.958 69.2381 167.504 69.2381C125.458 69.2381 109.968 80.6786 109.968 97.3993C109.968 115 119.262 125.121 172.372 132.601C312.229 151.522 334.801 189.363 334.801 239.086C334.801 307.729 276.822 342.49 170.602 342.49Z" fill="white" />
                        <path d="M568.192 334.57H467.725V80.6786H351.325V7.63536H684.591V80.6786H568.192V334.57Z" fill="white" />
                        <path d="M1023.88 334.57H723.362V7.63536H1020.34V80.2386H823.387V135.241H1003.08V200.364H823.387V261.967H1023.88V334.57Z" fill="white" />
                        <path d="M1374.4 334.57H1073.89V7.63536H1370.86V80.2386H1173.91V135.241H1353.6V200.364H1173.91V261.967H1374.4V334.57Z" fill="white" />
                        <path d="M1729.79 334.57H1400.07V268.567L1601.44 79.7985H1410.69V7.63536H1722.27V72.7582L1523.55 262.407H1729.79V334.57Z" fill="white" />
                    </svg>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between pt-6 md:pt-12 gap-4 border-t border-white/20">
                    <p className="text-[13px] md:text-[16px] font-medium text-center md:text-left">
                        COPYRIGHT © 2025 STEEZ. Todos os direitos reservados.
                    </p>

                    <ul className="flex flex-col xs:flex-row items-center gap-2 xs:gap-4">
                        <li>
                            <Link className="text-[14px] md:text-[16px] font-medium underline hover:text-gray-300 transition-colors" href="/termos">Termos de uso</Link>
                        </li>

                        <li>
                            <Link className="text-[14px] md:text-[16px] font-medium underline hover:text-gray-300 transition-colors" href="/privacidade">Política de privacidade</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}