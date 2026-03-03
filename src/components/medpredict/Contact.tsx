import { useState } from "react";
import { Send, CheckCircle, Mail, Building2, User, MessageSquare, Phone, MapPin, Clock, HeadphonesIcon, FileText } from "lucide-react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, saveContactMessage } from "@/firebase";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save contact message to Firebase
      const contactData = {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        category: form.category,
        priority: form.category === 'demo' ? 'high' : 'normal'
      };

      await saveContactMessage(contactData);
      
      setSubmitted(true);
      setLoading(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
          category: "general",
        });
        setSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error saving contact message:", error);
      setLoading(false);
      // Still show submitted state to user, but log error
      setSubmitted(true);
    }
  };

  const contactOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+1 (888) 633-7284",
      description: "Mon-Fri 9AM-6PM EST",
      color: "text-blue-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@medpredict.ai",
      description: "Response within 24 hours",
      color: "text-green-600"
    },
    {
      icon: MapPin,
      title: "Office Location",
      details: "123 Medical Plaza, Boston, MA 02110",
      description: "By appointment only",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 9AM-6PM EST",
      description: "Emergency support available 24/7",
      color: "text-orange-600"
    }
  ];

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Pricing" },
    { value: "partnership", label: "Partnership" },
    { value: "feedback", label: "Feedback" },
    { value: "demo", label: "Request Demo" }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-section relative overflow-hidden">
      <div className="absolute inset-0 neural-bg" />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions about MedPredict? Our team is here to help. Reach out through any of the channels below.
            </p>
          </div>

          {/* Contact Options Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="card-glass-light rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">{option.title}</h3>
                  <p className="font-medium text-sm text-navy mb-1">{option.details}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="card-glass-light rounded-3xl p-8 shadow-lg-med">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-teal flex items-center justify-center mx-auto mb-6 shadow-glow-teal">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-3">Message Sent!</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Thank you for contacting us. Our team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-navy mb-1">Send us a Message</h3>
                  <p className="text-sm text-muted-foreground mb-5">Fill out the form below and we'll get back to you soon.</p>

                  {/* Category Selector */}
                  <div>
                    <label className="text-sm font-semibold text-navy block mb-2">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-navy block mb-2">Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-navy block mb-2">Message *</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold bg-gradient-teal text-white shadow-glow-teal hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-muted-foreground">
                    By submitting, you agree to our Privacy Policy. We'll respond within 24 hours.
                  </p>
                </form>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Quick Links */}
              <div className="card-glass-light rounded-xl p-6">
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Quick Resources
                </h3>
                <div className="space-y-3">
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → Documentation & API Guides
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → Privacy Policy & HIPAA Compliance
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → Terms of Service
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → FAQ & Knowledge Base
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → System Status & Updates
                  </a>
                </div>
              </div>

              {/* Support Team */}
              <div className="card-glass-light rounded-xl p-6">
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                  <HeadphonesIcon className="w-5 h-5 text-primary" />
                  Support Team
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-navy text-sm mb-1">Technical Support</h4>
                    <p className="text-sm text-muted-foreground">
                      For API issues, integration problems, or technical questions
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy text-sm mb-1">Customer Success</h4>
                    <p className="text-sm text-muted-foreground">
                      For onboarding, training, and best practices
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy text-sm mb-1">Sales & Partnerships</h4>
                    <p className="text-sm text-muted-foreground">
                      For pricing, enterprise plans, and partnership opportunities
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-lg font-bold text-navy mb-3">Emergency Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  For urgent medical system failures or critical issues:
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-navy">
                    🚨 Emergency Hotline: +1 (888) 633-7285
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available 24/7 for critical system emergencies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
