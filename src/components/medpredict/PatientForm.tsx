import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Heart, Activity, Brain, Droplets } from "lucide-react";
import { savePatientData, getCurrentUser } from "@/firebase";

interface PatientData {
  Age: string;
  Gender: string;
  BMI: string;
  BloodPressure: string;
  Cholesterol: string;
  Glucose: string;
  Smoking: string;
  AlcoholIntake: string;
  PhysicalActivity: string;
  FamilyHistory: string;
}

interface PredictionResult {
  HeartDisease: number;
  Diabetes: number;
  KidneyDisease: number;
  CancerRisk: number;
}

export default function PatientForm() {
  const [patientData, setPatientData] = useState<PatientData>({
    Age: "",
    Gender: "",
    BMI: "",
    BloodPressure: "",
    Cholesterol: "",
    Glucose: "",
    Smoking: "",
    AlcoholIntake: "",
    PhysicalActivity: "",
    FamilyHistory: ""
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    const requiredFields = Object.keys(patientData) as (keyof PatientData)[];
    return requiredFields.every(field => patientData[field] !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://medpredict-ml-13.onrender.com'}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Age: parseInt(patientData.Age),
          Gender: parseInt(patientData.Gender),
          BMI: parseFloat(patientData.BMI),
          BloodPressure: parseInt(patientData.BloodPressure),
          Cholesterol: parseInt(patientData.Cholesterol),
          Glucose: parseInt(patientData.Glucose),
          Smoking: parseInt(patientData.Smoking),
          AlcoholIntake: parseInt(patientData.AlcoholIntake),
          PhysicalActivity: parseInt(patientData.PhysicalActivity),
          FamilyHistory: parseInt(patientData.FamilyHistory)
        })
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
      
      // Save patient data and prediction to Firebase
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const firebaseUser = getCurrentUser();
        
        // Use Firebase user ID if available, otherwise fall back to email
        const userId = firebaseUser?.uid || userData.email;
        
        if (userId) {
          await savePatientData(userId, patientData, result);
          console.log('Patient data saved to Firebase');
        }
      } catch (firebaseError) {
        console.error('Error saving to Firebase:', firebaseError);
        // Don't show error to user as prediction was successful
      }
    } catch (err) {
      setError('Failed to get prediction. Please make sure the ML server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (value: number): { level: string; color: string } => {
    if (value === 0) return { level: "Low Risk", color: "text-green-600" };
    return { level: "High Risk", color: "text-red-600" };
  };

  const getRiskDescription = (disease: string, risk: number): string => {
    if (risk === 0) {
      switch (disease) {
        case "Heart Disease":
          return "Your cardiovascular indicators are within healthy ranges. Continue maintaining a balanced diet, regular exercise, and stress management for optimal heart health.";
        case "Diabetes":
          return "Your glucose levels and metabolic markers suggest low diabetes risk. Keep up with regular physical activity and a balanced diet to maintain healthy blood sugar levels.";
        case "Kidney Disease":
          return "Your kidney function indicators appear normal. Stay hydrated, maintain a healthy blood pressure, and avoid excessive NSAID use to protect your kidney health.";
        case "Cancer Risk":
          return "Your overall risk factors indicate lower cancer probability. Continue with regular health screenings, maintain a healthy lifestyle, and avoid tobacco and excessive alcohol.";
        default:
          return "Your health indicators are within normal ranges. Continue with regular health monitoring and healthy lifestyle choices.";
      }
    } else {
      switch (disease) {
        case "Heart Disease":
          return "Elevated cardiovascular risk detected. Consider consulting a cardiologist, reducing sodium intake, increasing cardiovascular exercise, and managing stress levels. Regular monitoring of blood pressure and cholesterol is recommended.";
        case "Diabetes":
          return "Higher diabetes risk indicated. Focus on blood sugar management through dietary changes, regular exercise, and weight management. Consider consulting an endocrinologist for comprehensive evaluation.";
        case "Kidney Disease":
          return "Increased kidney disease risk detected. Prioritize hydration, maintain healthy blood pressure, limit protein intake if advised, and avoid nephrotoxic medications. Regular kidney function testing is recommended.";
        case "Cancer Risk":
          return "Elevated cancer risk factors present. Increase focus on preventive measures including regular screenings, maintaining healthy weight, avoiding tobacco, limiting alcohol, and consuming a diet rich in fruits and vegetables.";
        default:
          return "Elevated risk factors detected. Consult with healthcare providers for personalized prevention strategies and regular monitoring.";
      }
    }
  };

  const getRecommendations = (disease: string, risk: number): string[] => {
    if (risk === 0) {
      switch (disease) {
        case "Heart Disease":
          return ["Maintain regular cardiovascular exercise (150 min/week)", "Continue heart-healthy diet rich in omega-3s", "Manage stress through meditation or yoga", "Get regular blood pressure checks"];
        case "Diabetes":
          return ["Maintain healthy weight", "Choose complex carbs over simple sugars", "Stay physically active daily", "Get annual A1c testing"];
        case "Kidney Disease":
          return ["Drink 6-8 glasses of water daily", "Limit processed foods high in sodium", "Maintain healthy blood pressure", "Avoid overuse of pain medications"];
        case "Cancer Risk":
          return ["Eat 5+ servings of fruits/vegetables daily", "Maintain healthy body weight", "Limit red meat consumption", "Get age-appropriate cancer screenings"];
        default:
          return ["Continue regular health check-ups", "Maintain balanced nutrition", "Stay physically active", "Get adequate sleep"];
      }
    } else {
      switch (disease) {
        case "Heart Disease":
          return ["Consult cardiologist within 1 month", "Adopt DASH or Mediterranean diet", "Increase to 300 min/week moderate exercise", "Monitor blood pressure daily"];
        case "Diabetes":
          return ["See endocrinologist immediately", "Start blood glucose monitoring", "Reduce carbohydrate intake", "Consider diabetes education program"];
        case "Kidney Disease":
          return ["Consult nephrologist soon", "Restrict sodium to <2g/day", "Monitor fluid intake carefully", "Get comprehensive kidney panel"];
        case "Cancer Risk":
          return ["Schedule comprehensive cancer screening", "Increase antioxidant-rich foods", "Eliminate all tobacco products", "Consider genetic counseling if family history"];
        default:
          return ["Seek specialist consultation", "Increase monitoring frequency", "Intensify lifestyle modifications", "Consider preventive medications"];
      }
    }
  };

  const diseases = [
    { key: "HeartDisease" as keyof PredictionResult, name: "Heart Disease", icon: Heart },
    { key: "Diabetes" as keyof PredictionResult, name: "Diabetes", icon: Activity },
    { key: "KidneyDisease" as keyof PredictionResult, name: "Kidney Disease", icon: Droplets },
    { key: "CancerRisk" as keyof PredictionResult, name: "Cancer Risk", icon: Brain }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Patient Form */}
      <Card className="border-primary/15 shadow-lg-med">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-navy">Patient Health Assessment</CardTitle>
          <CardDescription>
            Enter patient details to analyze disease risk factors using our AI-powered prediction model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-navy text-lg">Basic Information</h3>
                
                <div>
                  <Label htmlFor="Age">Age</Label>
                  <Input
                    id="Age"
                    type="number"
                    placeholder="Enter age"
                    value={patientData.Age}
                    onChange={(e) => handleInputChange("Age", e.target.value)}
                    min="1"
                    max="120"
                  />
                </div>

                <div>
                  <Label htmlFor="Gender">Gender</Label>
                  <Select value={patientData.Gender} onValueChange={(value) => handleInputChange("Gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Female</SelectItem>
                      <SelectItem value="1">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="BMI">BMI</Label>
                  <Input
                    id="BMI"
                    type="number"
                    step="0.1"
                    placeholder="Enter BMI"
                    value={patientData.BMI}
                    onChange={(e) => handleInputChange("BMI", e.target.value)}
                    min="10"
                    max="50"
                  />
                </div>
              </div>

              {/* Health Metrics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-navy text-lg">Health Metrics</h3>
                
                <div>
                  <Label htmlFor="BloodPressure">Blood Pressure (Systolic)</Label>
                  <Input
                    id="BloodPressure"
                    type="number"
                    placeholder="Enter systolic BP"
                    value={patientData.BloodPressure}
                    onChange={(e) => handleInputChange("BloodPressure", e.target.value)}
                    min="80"
                    max="200"
                  />
                </div>

                <div>
                  <Label htmlFor="Cholesterol">Cholesterol (mg/dL)</Label>
                  <Input
                    id="Cholesterol"
                    type="number"
                    placeholder="Enter cholesterol level"
                    value={patientData.Cholesterol}
                    onChange={(e) => handleInputChange("Cholesterol", e.target.value)}
                    min="100"
                    max="400"
                  />
                </div>

                <div>
                  <Label htmlFor="Glucose">Glucose (mg/dL)</Label>
                  <Input
                    id="Glucose"
                    type="number"
                    placeholder="Enter glucose level"
                    value={patientData.Glucose}
                    onChange={(e) => handleInputChange("Glucose", e.target.value)}
                    min="50"
                    max="400"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle Factors */}
            <div className="space-y-4">
              <h3 className="font-semibold text-navy text-lg">Lifestyle Factors</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="Smoking">Smoking</Label>
                  <Select value={patientData.Smoking} onValueChange={(value) => handleInputChange("Smoking", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Non-smoker</SelectItem>
                      <SelectItem value="1">Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="AlcoholIntake">Alcohol Intake</Label>
                  <Select value={patientData.AlcoholIntake} onValueChange={(value) => handleInputChange("AlcoholIntake", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="PhysicalActivity">Physical Activity</Label>
                  <Select value={patientData.PhysicalActivity} onValueChange={(value) => handleInputChange("PhysicalActivity", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Low</SelectItem>
                      <SelectItem value="1">Moderate</SelectItem>
                      <SelectItem value="2">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="FamilyHistory">Family History</Label>
                  <Select value={patientData.FamilyHistory} onValueChange={(value) => handleInputChange("FamilyHistory", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Disease Risk"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && (
        <Card className="border-primary/15 shadow-lg-med">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-navy">Comprehensive Risk Analysis Results</CardTitle>
            <CardDescription>
              AI-powered disease risk assessment with personalized recommendations based on your health data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Risk Overview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {diseases.map((disease) => {
                const Icon = disease.icon;
                const risk = getRiskLevel(prediction[disease.key]);
                
                return (
                  <div key={disease.key} className="text-center p-4 rounded-xl border border-border bg-gradient-to-br from-white to-green-section/20">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-navy mb-2">{disease.name}</h4>
                    <div className={`text-sm font-medium ${risk.color}`}>
                      {risk.level}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-navy">Detailed Analysis & Recommendations</h3>
              
              {diseases.map((disease) => {
                const Icon = disease.icon;
                const risk = getRiskLevel(prediction[disease.key]);
                const description = getRiskDescription(disease.name, prediction[disease.key]);
                const recommendations = getRecommendations(disease.name, prediction[disease.key]);
                
                return (
                  <div key={disease.key} className="border border-border rounded-xl p-6 bg-gradient-to-br from-white to-green-section/10">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        prediction[disease.key] === 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${prediction[disease.key] === 0 ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg text-navy">{disease.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            prediction[disease.key] === 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {risk.level}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {description}
                        </p>
                        
                        <div className="space-y-3">
                          <h5 className="font-medium text-navy">Recommended Actions:</h5>
                          <ul className="space-y-2">
                            {recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                                  prediction[disease.key] === 0 ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <span className="text-sm text-muted-foreground">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Health Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-semibold text-lg text-navy mb-3">Overall Health Summary</h4>
              <p className="text-muted-foreground mb-4">
                Based on your comprehensive health assessment, here's your personalized health outlook:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-navy">Key Strengths:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {diseases.filter(d => prediction[d.key] === 0).map(disease => (
                      <li key={disease.key} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Low {disease.name.toLowerCase()} risk
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-navy">Areas for Attention:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {diseases.filter(d => prediction[d.key] === 1).map(disease => (
                      <li key={disease.key} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Elevated {disease.name.toLowerCase()} risk
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Next Steps:</strong> Schedule a comprehensive health check-up with your primary care physician to discuss these results and create a personalized health plan. Consider sharing this analysis with relevant specialists based on your risk profile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
