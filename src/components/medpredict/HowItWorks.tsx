import { Database, Cpu, BarChart3, Stethoscope, Activity } from "lucide-react";

const steps = [
  {
    icon: Database,
    number: "01",
    title: "Data Input",
    description:
      "Patients and clinicians securely submit health data including vitals, lab results, medical history, and lifestyle factors through our encrypted interface.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Cpu,
    number: "02",
    title: "AI Preprocessing",
    description:
      "Our intelligent pipeline cleanses, normalizes, and transforms raw data — handling missing values, outlier detection, and feature engineering automatically.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "ML Risk Analysis",
    description:
      "Ensemble models including Random Forest, XGBoost, and Deep Neural Networks analyze patterns to generate personalized, disease-specific risk scores.",
    gradient: "from-accent to-teal",
  },
  {
    icon: Stethoscope,
    number: "04",
    title: "Clinical Decision Support",
    description:
      "Evidence-based recommendations and risk stratification are delivered to healthcare providers, integrated seamlessly with existing EHR systems.",
    gradient: "from-teal to-primary",
  },
  {
    icon: Activity,
    number: "05",
    title: "Continuous Monitoring",
    description:
      "The system tracks patient health trajectories over time, updating risk profiles dynamically and triggering alerts when intervention thresholds are reached.",
    gradient: "from-primary to-accent",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-green-section relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-primary/30" />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            The Process
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-5">
            How MedPredict Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A seamless five-step pipeline from raw health data to actionable clinical intelligence.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative group">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 z-10">
                    <div className="w-2 h-2 rounded-full bg-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                )}

                <div className="card-glass-light rounded-2xl p-6 h-full text-center border border-primary/10 hover:border-primary/25 hover:shadow-glow-teal transition-all duration-300 group-hover:-translate-y-1">
                  <div className="text-5xl font-bold text-primary/8 mb-3 font-display">{step.number}</div>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mx-auto mb-4 shadow-md-med`}>
                    <step.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>

                  <h3 className="text-base font-bold text-navy mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
