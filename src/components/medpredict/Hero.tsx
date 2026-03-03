import { ArrowRight, Shield, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg-light.jpg";

const stats = [
  { value: "94.7%", label: "Prediction Accuracy" },
  { value: "2.3M+", label: "Patients Analyzed" },
  { value: "18", label: "Disease Models" },
  { value: "< 2s", label: "Risk Analysis Time" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="AI Healthcare background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 hero-gradient opacity-70" />
        <div className="absolute inset-0 grid-pattern" />
        {/* Soft glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-secondary/8 blur-3xl" />
      </div>

      {/* Green top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-teal" />

      {/* Content */}
      <div className="relative flex-1 flex items-center pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/8 text-primary text-sm font-medium mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered Clinical Intelligence Platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-display font-bold text-navy leading-[1.05] mb-6 tracking-tight">
              Predict Diseases{" "}
              <span className="gradient-text block md:inline">
                Before They Progress
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              MedPredict harnesses advanced machine learning models to analyze patient data,
              enabling early disease risk detection and empowering smarter, faster clinical decisions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="#contact"
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold bg-gradient-teal text-white shadow-glow-teal hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span>Check Your Risk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#features"
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold border-2 border-primary/25 text-primary bg-white/70 hover:bg-white hover:border-primary/40 transition-all duration-300"
              >
                Explore Features
              </a>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-16">
              <Shield className="w-4 h-4 text-primary/60" />
              HIPAA Compliant · FDA 510(k) · ISO 27001 Certified
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card-glass rounded-2xl px-6 py-5 text-center hover:shadow-glow-teal hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative flex justify-center pb-8">
        <a href="#how-it-works" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <span className="text-xs font-medium">Discover More</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
