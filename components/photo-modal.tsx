"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, RotateCcw, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import HeartAboutUs from "./svg/heart-about-us";
import StarAboutUs from "./svg/star-about-us";
import SteezAboutUs from "./svg/steez-about-us";
import SunAboutUs from "./svg/sun-about-us";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoModal({ isOpen, onClose }: PhotoModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [showDecorations, setShowDecorations] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioOptions = [
    { label: "16:9", value: "16:9", class: "aspect-video" },
    { label: "9:16", value: "9:16", class: "aspect-[9/16]" },
    { label: "1:1", value: "1:1", class: "aspect-square" },
    { label: "3:4", value: "3:4", class: "aspect-[3/4]" },
    { label: "3:2", value: "3:2", class: "aspect-[3/2]" },
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "auto";
        // Reset modal state when closing
        setSelectedImage(null);
        setIsBlackAndWhite(false);
        setAspectRatio("1:1");
        setShowDecorations(false);
        setIsSubmitted(false);
        setIsSubmitting(false);
      }, 300);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    
    setIsSubmitting(true);
    
    // Simular envio (aqui você adicionaria a lógica real de envio)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Fechar modal após 2 segundos
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const resetImage = () => {
    setSelectedImage(null);
    setIsBlackAndWhite(false);
    setAspectRatio("1:1");
    setShowDecorations(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay com efeito blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {/* Botão fechar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full hover:bg-gray-100 z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#F42254]">
            TEU RETRATO STEEZ
          </h2>

          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-600">Enviado com sucesso!</h3>
              <p className="text-gray-600">
                Obrigado por compartilhar seu retrato Steez conosco. Em breve ele pode aparecer em nossas redes sociais!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upload de imagem */}
              {!selectedImage ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F42254] transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Clique para selecionar uma foto
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG até 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview da imagem */}
                  <div className={`relative bg-gray-100 rounded-lg overflow-hidden w-full max-w-md mx-auto ${
                    aspectRatioOptions.find(option => option.value === aspectRatio)?.class || "aspect-video"
                  }`}>
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isBlackAndWhite ? 'grayscale' : ''
                      }`}
                    />
                    
                    {/* Decorações SVG */}
                    {showDecorations && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="backdrop-invert">
                          <HeartAboutUs className="absolute top-4 right-4" />
                          <StarAboutUs className="absolute bottom-4 left-4 w-16 h-16" />
                          <SteezAboutUs className="absolute top-4 left-4 w-20 h-8" />
                          <SunAboutUs className="absolute bottom-4 right-4 w-16 h-12" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Formato
                      </label>
                      <select
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F42254] focus:border-transparent text"
                      >
                        {aspectRatioOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Preto e Branco
                      </label>
                      <Button
                        variant={isBlackAndWhite ? "default" : "outline"}
                        onClick={() => setIsBlackAndWhite(!isBlackAndWhite)}
                        className="w-full"
                      >
                        {isBlackAndWhite ? "Ativado" : "Desativado"}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Decorações
                      </label>
                      <Button
                        variant={showDecorations ? "default" : "outline"}
                        onClick={() => setShowDecorations(!showDecorations)}
                        className="w-full"
                      >
                        {showDecorations ? "Mostrar" : "Ocultar"}
                      </Button>
                    </div>
                  </div>

                  {/* Botão resetar */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={resetImage}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Selecionar outra foto
                    </Button>
                  </div>
                </div>
              )}

              {/* Botão enviar */}
              <div className="flex justify-center">
                <Button
                  className="bg-[#F42254] hover:bg-[#d41b48] text-white w-full  py-6 text-lg font-medium rounded-full "
                  onClick={selectedImage ? handleSubmit : () => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : selectedImage ? (
                    "ENVIAR RETRATO"
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5" />
                      SELECIONAR FOTO
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
