import { Heart, UserCheck, TrendingDown, Clock, Award, Users, DollarSign, BarChart2 } from "lucide-react";

const patientBenefits = [
  {
    icon: Heart,
    title: "Early Detection Saves Lives",
    description: "Catch diseases at stage 0-1 when treatment success rates exceed 90%, dramatically improving survival outcomes.",
  },
  {
    icon: UserCheck,
    title: "Personalized Health Plans",
    description: "AI-generated, evidence-based recommendations tailored to your unique risk profile, genetics, and lifestyle.",
  },
  {
    icon: TrendingDown,
    title: "Reduced Hospital Visits",
    description: "Preventive interventions triggered by risk alerts keep patients healthier and out of emergency departments.",
  },
  {
    icon: Clock,
    title: "Peace of Mind",
    description: "Continuous monitoring and transparent risk scores empower patients to take control of their health journey.",
  },
];

const providerBenefits = [
  {
    icon: Award,
    title: "Evidence-Based Decisions",
    description: "AI-augmented clinical intelligence that enhances diagnostic confidence and treatment planning accuracy.",
  },
  {
    icon: Users,
    title: "Population Health Management",
    description: "Risk-stratify entire patient panels to prioritize high-need individuals and optimize care resource allocation.",
  },
  {
    icon: DollarSign,
    title: "Cost Efficiency",
    description: "Early interventions reduce costly late-stage treatments, with ROI proven across health systems of all sizes.",
  },
  {
    icon: BarChart2,
    title: "Regulatory Reporting",
    description: "Automated quality metrics and compliance reporting aligned with CMS, HEDIS, and value-based care frameworks.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 neural-bg" />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            Why MedPredict
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-5">
            Transforming Outcomes for Everyone
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Whether you're a patient managing your health or a provider delivering care — MedPredict delivers measurable impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Patients */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy">For Patients</h3>
            </div>
            <div className="grid gap-4">
              {patientBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-5 card-glass-light rounded-2xl border border-primary/10 hover:border-primary/25 hover:shadow-glow-teal transition-all duration-300 hover:-translate-x-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-teal flex-shrink-0 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Providers */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md-med">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy">For Healthcare Providers</h3>
            </div>
            <div className="grid gap-4">
              {providerBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-5 card-glass-light rounded-2xl border border-primary/10 hover:border-primary/25 hover:shadow-glow-teal transition-all duration-300 hover:translate-x-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex-shrink-0 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 p-8 rounded-3xl bg-green-section border border-primary/15 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern" />
          {[
            { value: "38%", label: "Reduction in hospitalizations" },
            { value: "3.2x", label: "Faster early diagnoses" },
            { value: "$2,400", label: "Avg. annual savings per patient" },
            { value: "96%", label: "Clinician satisfaction rate" },
          ].map((stat) => (
            <div key={stat.label} className="relative text-center py-2">
              <div className="text-3xl font-bold gradient-text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
