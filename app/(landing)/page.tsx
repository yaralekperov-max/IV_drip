import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { MarqueeStrip } from "@/components/landing/MarqueeStrip";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { ProductsSection } from "@/components/landing/ProductsSection";
import { WhyVisitSection } from "@/components/landing/WhyVisitSection";
import { CalculatorSection } from "@/components/landing/CalculatorSection";
import { SafetySection } from "@/components/landing/SafetySection";
import { B2BSection } from "@/components/landing/B2BSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="ambient">
      <div className="relative z-[1]">
        <Header />
        <main>
          <Hero />
          <div className="mt-10">
            <MarqueeStrip />
          </div>
          <ProcessSection />
          <ProductsSection />
          <WhyVisitSection />
          <CalculatorSection />
          <SafetySection />
          <B2BSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
