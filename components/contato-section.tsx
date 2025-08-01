"use client";

import { FormEvent, useState } from "react";
import ScrollIndicator from "./scroll-indicator";
import { Send, Check } from "lucide-react";

interface ContatoSectionProps {
  scrollToSection: (id: string) => void;
}

export default function ContatoSection({ scrollToSection }: ContatoSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Validação básica
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      setFormError("Por favor, preencha todos os campos.");
      return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError("Por favor, informe um email válido.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulação de envio de formulário
    try {
      // Aqui você pode adicionar a lógica real de envio do formulário
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setFormError("Erro ao enviar mensagem. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
		<div className="container mx-auto px-4 sm:px-6 py-8 max-h-screen flex flex-col justify-center">
			<div className="text-center mb-6">
				<h2 className="text-3xl md:text-4xl font-semibold text-center uppercase italic text-[#181818]">
					Fala Connosco
				</h2>
				<p className="text-gray-600 mt-2 max-w-lg mx-auto">
					Tem uma pergunta ou sugestão? Estamos aqui para ajudar.
				</p>
			</div>

			<div className="max-w-[650px] mx-auto w-full">
				{submitSuccess ? (
					<div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 animate-fadeIn shadow-sm">
						<div className="flex items-center mb-2">
							<div className="bg-green-100 p-2 rounded-full mr-3">
								<Check className="text-green-600 h-5 w-5" />
							</div>
							<p className="text-green-700 text-lg font-medium">
								Mensagem enviada com sucesso!
							</p>
						</div>
						<p className="text-gray-600 ml-10">
							Agradecemos o seu contato, responderemos em breve.
						</p>
					</div>
				) : (
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-3 bg-white rounded-xl p-4 md:p-6 shadow-sm"
					>
						<div className="flex flex-col md:flex-row gap-3">
							<div className="flex-1">
								<label
									htmlFor="name"
									className="block text-sm text-gray-700 mb-1 font-medium"
								>
									Nome
								</label>
								<input
									id="name"
									className="w-full bg-white p-3 text text-gray-800 border border-solid border-gray-300 rounded-lg focus:border-[#F42254] focus:ring-2 focus:ring-pink-100 focus:outline-none transition-colors"
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Seu nome"
									required
								/>
							</div>
							<div className="flex-1">
								<label
									htmlFor="email"
									className="block text-sm text-gray-700 mb-1 font-medium"
								>
									Email
								</label>
								<input
									id="email"
									className="w-full bg-white p-3 text text-gray-800 border border-solid border-gray-300 rounded-lg focus:border-[#F42254] focus:ring-2 focus:ring-pink-100 focus:outline-none transition-colors"
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="seu.email@exemplo.com"
									required
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="message"
								className="block text-sm text-gray-700 mb-1 font-medium"
							>
								Mensagem
							</label>
							<textarea
								id="message"
								rows={3}
								name="message"
								value={formData.message}
								onChange={handleChange}
								className="w-full bg-white p-3 text text-gray-800 border border-solid border-gray-300 rounded-lg focus:border-[#F42254] focus:ring-2 focus:ring-pink-100 focus:outline-none transition-colors"
								placeholder="Deseja se tornar um revendedor, tem uma sugestão ou dúvida? Conte-nos."
								required
							/>
						</div>

						{formError && (
							<p className="text-[#F42254] text-sm mt-1">{formError}</p>
						)}

						<button
							type="submit"
							disabled={isSubmitting}
							className={`flex items-center justify-center bg-black text-white hover:bg-gray-800 px-6 py-3 text-base font-medium rounded-full transition-all mt-2 ${
								isSubmitting ? "opacity-70 cursor-not-allowed" : ""
							}`}
						>
							{isSubmitting ? (
								<>
									<svg
										className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
									Enviando...
								</>
							) : (
								<>
									Enviar mensagem
									<Send className="ml-2 h-4 w-4" />
								</>
							)}
						</button>

						<p className="text-gray-500 text-center text-xs mt-3">
							Suas informações serão processadas de acordo com nossos
							<a href="/termos" className="text-[#F42254] hover:underline ml-1">
								termos de serviço
							</a>{" "}
							e
							<a
								href="/privacidade"
								className="text-[#F42254] hover:underline ml-1"
							>
								política de privacidade
							</a>
							.
						</p>
					</form>
				)}
			</div>

			{/* Scroll Indicator */}
			<div className="mt-auto pt-4">
				<ScrollIndicator onClick={() => scrollToSection("faq")} section="faq" />
			</div>
		</div>
	);
}
