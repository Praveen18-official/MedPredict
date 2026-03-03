import Navbar from "@/components/medpredict/Navbar";
import Hero from "@/components/medpredict/Hero";
import HowItWorks from "@/components/medpredict/HowItWorks";
import Features from "@/components/medpredict/Features";
import DashboardPreview from "@/components/medpredict/DashboardPreview";
import Benefits from "@/components/medpredict/Benefits";
import Testimonials from "@/components/medpredict/Testimonials";
import Contact from "@/components/medpredict/Contact";
import Footer from "@/components/medpredict/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <DashboardPreview />
      <Benefits />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
