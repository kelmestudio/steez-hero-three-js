import Header from "@/components/header";
import Footer from "@/components/footer";

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header activeSection="" scrollToSection={() => {}} />
      
      {/* Main Content */}
      <main className="flex-1 pt-20">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#181818] text-white">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
