import { Target, Bell, Lock, Layers, Zap, GitBranch, Cloud, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "High-Accuracy Prediction",
    description: "Multi-model ensemble approach achieves up to 94.7% accuracy across 18 disease categories including diabetes, cardiovascular, and oncological conditions.",
    tag: "Core AI",
  },
  {
    icon: Bell,
    title: "Early Intervention Alerts",
    description: "Proactive risk alerts trigger well before clinical symptoms appear, enabling preventive interventions that reduce hospitalization rates by up to 38%.",
    tag: "Prevention",
  },
  {
    icon: Lock,
    title: "Secure Data Handling",
    description: "End-to-end encryption, role-based access control, and full HIPAA compliance ensure patient data is protected at every stage of processing.",
    tag: "Security",
  },
  {
    icon: Layers,
    title: "Intuitive Interface",
    description: "Clinician-designed dashboards provide instant clarity — risk scores, trend charts, and patient summaries all accessible in a single unified view.",
    tag: "UX",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Sub-2-second risk analysis enables immediate clinical response during consultations, powered by optimized inference pipelines on edge infrastructure.",
    tag: "Performance",
  },
  {
    icon: GitBranch,
    title: "EHR Integration",
    description: "Native HL7 FHIR and DICOM support ensures frictionless integration with Epic, Cerner, and other major electronic health record systems.",
    tag: "Integration",
  },
  {
    icon: Cloud,
    title: "Scalable Cloud Infrastructure",
    description: "Built on auto-scaling cloud architecture that handles clinical loads from solo practices to enterprise hospital networks with consistent performance.",
    tag: "Infrastructure",
  },
  {
    icon: RefreshCw,
    title: "Continuous Model Learning",
    description: "Federated learning architecture enables models to improve from population-level patterns while preserving individual patient privacy.",
    tag: "AI/ML",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-section relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-5">
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-5">
            Built for Clinical Excellence
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Every feature engineered with clinicians, for clinicians — combining AI precision with human-centered design.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="group card-glass-light rounded-2xl p-6 hover:shadow-glow-teal hover:-translate-y-1 transition-all duration-300 cursor-default"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Tag */}
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary mb-4">
                {feature.tag}
              </div>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-md-med group-hover:shadow-glow-teal transition-shadow">
                <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>

              <h3 className="text-base font-bold text-navy mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
