import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "MedPredict flagged my patient's diabetes risk 8 months before standard screening would have caught it. That early intervention changed the trajectory of her care completely.",
    name: "Dr. Sarah Mitchell",
    role: "Endocrinologist, Cleveland Clinic",
    initials: "SM",
    stars: 5,
  },
  {
    quote:
      "We integrated MedPredict across 12 clinics and saw a 34% reduction in preventable hospitalizations within the first year. The ROI speaks for itself.",
    name: "James Hartwell",
    role: "Chief Medical Officer, Horizon Health Systems",
    initials: "JH",
    stars: 5,
  },
  {
    quote:
      "As someone with a family history of heart disease, having a real-time risk score and personalized prevention plan has been genuinely life-changing. I feel in control.",
    name: "Maria Torres",
    role: "Patient, Age 47",
    initials: "MT",
    stars: 5,
  },
  {
    quote:
      "The EHR integration was seamless. Our care team now has risk stratification built into every workflow — it's like having an AI colleague who never misses a flag.",
    name: "Dr. Priya Nair",
    role: "Internal Medicine, Mass General Hospital",
    initials: "PN",
    stars: 5,
  },
  {
    quote:
      "We piloted MedPredict with 500 patients in our oncology department. The precision of risk scoring for cancer recurrence exceeded any tool we've evaluated.",
    name: "Dr. Robert Chen",
    role: "Oncologist, MD Anderson Cancer Center",
    initials: "RC",
    stars: 5,
  },
  {
    quote:
      "The security and compliance features gave us confidence to deploy at scale. HIPAA, SOC 2, and full audit trails — everything our legal team required was already there.",
    name: "Linda Park",
    role: "Health IT Director, Kaiser Permanente",
    initials: "LP",
    stars: 5,
  },
];

const logos = ["Cleveland Clinic", "Mass General", "Kaiser Permanente", "Mayo Clinic", "Johns Hopkins", "MD Anderson"];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-green-section relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            Trusted by Leaders
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-5">
            Outcomes That Speak
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Clinicians, patients, and health systems across the country have transformed care delivery with MedPredict.
          </p>
        </div>

        {/* Partner logos */}
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-14">
          {logos.map((logo) => (
            <span key={logo} className="text-muted-foreground/60 font-semibold text-sm tracking-wider uppercase hover:text-primary/60 transition-colors">
              {logo}
            </span>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-glass-light rounded-2xl p-6 flex flex-col gap-4 border border-primary/10 hover:border-primary/25 hover:shadow-glow-teal transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative flex-1">
                <Quote className="absolute -top-1 -left-1 w-5 h-5 text-primary/20" />
                <p className="text-sm text-muted-foreground leading-relaxed pl-4">{t.quote}</p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-teal flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-navy">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
