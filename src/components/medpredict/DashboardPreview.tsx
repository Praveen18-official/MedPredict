import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";

const riskData = [
  { disease: "Type 2 Diabetes", score: 73, trend: "up", level: "High", barColor: "bg-red-400" },
  { disease: "Cardiovascular Disease", score: 45, trend: "down", level: "Moderate", barColor: "bg-amber-400" },
  { disease: "Hypertension", score: 61, trend: "up", level: "Moderate", barColor: "bg-orange-400" },
  { disease: "CKD (Stage 1-2)", score: 22, trend: "stable", level: "Low", barColor: "bg-primary" },
  { disease: "NAFLD", score: 54, trend: "down", level: "Moderate", barColor: "bg-amber-400" },
];

const alerts = [
  { icon: AlertTriangle, text: "High DM risk — HbA1c trending above 6.5%", time: "2 min ago", color: "text-red-500" },
  { icon: CheckCircle, text: "CVD risk decreased after lifestyle intervention", time: "1 hr ago", color: "text-primary" },
  { icon: Clock, text: "Scheduled: Renal function panel due", time: "Tomorrow", color: "text-secondary" },
];

const barHeights = [40, 55, 70, 62, 80, 74, 90, 68, 75, 88, 72, 60];

function RiskBar({ score, barColor }: { score: number; barColor: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">{score}%</span>
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 bg-green-section-deep relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            Live Dashboard
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-navy mb-5">
            Intelligent Risk Analytics
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A real-time clinical intelligence hub that transforms complex patient data into clear, actionable insights.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl overflow-hidden border border-primary/15 shadow-lg-med">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-green-section/60">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-primary/70" />
                </div>
                <span className="text-muted-foreground text-xs ml-2">MedPredict Clinical Dashboard — Patient #MP-4829</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground text-xs font-medium">Live</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-0">
              {/* Left: Risk scores */}
              <div className="lg:col-span-2 p-6 border-r border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-navy font-bold text-sm">Disease Risk Profile</h3>
                  <span className="text-xs text-muted-foreground">Updated 2 min ago</span>
                </div>
                <div className="space-y-4">
                  {riskData.map((item) => (
                    <div key={item.disease}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">{item.disease}</span>
                          {item.trend === "up" && <TrendingUp className="w-3 h-3 text-red-500" />}
                          {item.trend === "down" && <TrendingDown className="w-3 h-3 text-primary" />}
                          {item.trend === "stable" && <Minus className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.level === "High" ? "bg-red-100 text-red-600" :
                          item.level === "Moderate" ? "bg-amber-100 text-amber-700" :
                          "bg-primary/10 text-primary"
                        }`}>
                          {item.level}
                        </span>
                      </div>
                      <RiskBar score={item.score} barColor={item.barColor} />
                    </div>
                  ))}
                </div>

                {/* Mini chart */}
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Activity className="w-3 h-3 text-primary" />
                      Health Score Trend (12 months)
                    </span>
                    <span className="text-xs text-primary font-bold">72 / 100</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {barHeights.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-primary to-primary/20"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                  </div>
                </div>
              </div>

              {/* Right: Alerts & summary */}
              <div className="p-6 flex flex-col gap-5 bg-green-section/30">
                {/* Overall risk score */}
                <div className="text-center p-4 rounded-2xl bg-white border border-primary/12 shadow-sm-med">
                  <div className="text-xs text-muted-foreground mb-2">Overall Risk Score</div>
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(142 55% 35% / 0.12)" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke="url(#riskGradLight)" strokeWidth="3"
                        strokeDasharray="68 32" strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="riskGradLight" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="hsl(142 55% 35%)" />
                          <stop offset="100%" stopColor="hsl(158 52% 42%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-navy">68</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-amber-600">Elevated Risk</div>
                </div>

                {/* Alerts */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Clinical Alerts</h4>
                  <div className="space-y-3">
                    {alerts.map((alert, i) => (
                      <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-white border border-border">
                        <alert.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${alert.color}`} />
                        <div>
                          <p className="text-xs text-foreground leading-relaxed">{alert.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
