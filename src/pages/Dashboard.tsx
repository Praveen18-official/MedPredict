import PatientForm from "@/components/medpredict/PatientForm";
import Navbar from "@/components/medpredict/Navbar";
import Footer from "@/components/medpredict/Footer";

const DashboardPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="py-24 bg-green-section relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
              Health Assessment
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-5">
              Disease Risk Prediction
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter patient health data to receive AI-powered disease risk predictions for heart disease, diabetes, kidney disease, and cancer.
            </p>
          </div>
          <PatientForm />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default DashboardPage;
