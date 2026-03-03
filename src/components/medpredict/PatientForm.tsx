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

interface HealthAssessment {
  OverallHealth: string;
  RiskLevel: string;
  Recommendations: string[];
  DiseaseRisks: {
    HeartAttack: number;
    LungDisease: number;
    KidneyDisease: number;
    LiverDisease: number;
    Stroke: number;
    Diabetes: number;
    CancerRisk: number;
    Osteoporosis: number;
    Arthritis: number;
    Alzheimer: number;
    Depression: number;
  };
  DiseaseDescriptions: {
    [key: string]: {
      description: string;
      symptoms: string[];
      prevention: string[];
      treatment: string[];
    };
  };
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

  const [assessment, setAssessment] = useState<HealthAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return Object.values(patientData).every(value => value !== "");
  };

  const calculateHealthScore = () => {
    const age = parseInt(patientData.Age);
    const gender = parseInt(patientData.Gender);
    const bmi = parseFloat(patientData.BMI);
    const bloodPressure = parseInt(patientData.BloodPressure);
    const cholesterol = parseInt(patientData.Cholesterol);
    const glucose = parseInt(patientData.Glucose);
    const smoking = parseInt(patientData.Smoking);
    const alcohol = parseInt(patientData.AlcoholIntake);
    const activity = parseInt(patientData.PhysicalActivity);
    const familyHistory = parseInt(patientData.FamilyHistory);

    let score = 100;
    let recommendations: string[] = [];

    // Disease descriptions database
    const diseaseDescriptions: { [key: string]: { description: string; symptoms: string[]; prevention: string[]; treatment: string[]; } } = {
      HeartAttack: {
        description: "Heart attack occurs when blood flow to the heart is blocked, usually by a blood clot. It's a leading cause of death worldwide.",
        symptoms: ["Chest pain or discomfort", "Shortness of breath", "Pain in arms, back, neck, jaw", "Cold sweat", "Nausea", "Lightheadedness"],
        prevention: ["Control blood pressure", "Maintain healthy cholesterol levels", "Quit smoking", "Regular exercise", "Healthy diet", "Manage stress"],
        treatment: ["Emergency medical care", "Medications (blood thinners, clot busters)", "Angioplasty", "Bypass surgery", "Cardiac rehabilitation"]
      },
      LungDisease: {
        description: "Lung disease includes conditions like COPD, asthma, and lung cancer that affect breathing and lung function.",
        symptoms: ["Persistent cough", "Shortness of breath", "Wheezing", "Chest tightness", "Frequent respiratory infections"],
        prevention: ["Avoid smoking", "Avoid air pollution", "Use protective equipment", "Regular exercise", "Vaccinations"],
        treatment: ["Bronchodilators", "Inhaled steroids", "Oxygen therapy", "Pulmonary rehabilitation", "Lung surgery"]
      },
      KidneyDisease: {
        description: "Kidney disease occurs when kidneys are damaged and can't filter blood properly. This can lead to kidney failure.",
        symptoms: ["Fatigue", "Swelling in ankles/feet", "Changes in urination", "Nausea", "Muscle cramps", "Loss of appetite"],
        prevention: ["Control blood pressure", "Manage diabetes", "Avoid NSAIDs", "Stay hydrated", "Regular kidney function tests"],
        treatment: ["Blood pressure medications", "Diabetes management", "Dialysis", "Kidney transplant", "Dietary changes"]
      },
      LiverDisease: {
        description: "Liver disease includes conditions like hepatitis, cirrhosis, and liver cancer that affect liver function.",
        symptoms: ["Fatigue", "Yellow skin/eyes", "Abdominal pain", "Swelling in legs/ankles", "Dark urine", "Loss of appetite"],
        prevention: ["Limit alcohol", "Vaccinations", "Healthy weight", "Avoid toxins", "Regular liver checkups"],
        treatment: ["Antiviral medications", "Lifestyle changes", "Liver transplant", "Medications for symptoms", "Nutritional support"]
      },
      Stroke: {
        description: "Stroke occurs when blood flow to the brain is interrupted, causing brain cells to die. Medical emergency.",
        symptoms: ["Sudden numbness/weakness", "Confusion", "Trouble speaking", "Vision problems", "Dizziness", "Severe headache"],
        prevention: ["Control blood pressure", "Manage diabetes", "Quit smoking", "Treat atrial fibrillation", "Healthy diet"],
        treatment: ["Emergency care within 3-4.5 hours", "Clot-busting drugs", "Blood thinners", "Rehabilitation", "Surgery"]
      },
      Diabetes: {
        description: "Diabetes is a chronic condition where the body can't regulate blood sugar levels properly.",
        symptoms: ["Increased thirst", "Frequent urination", "Extreme hunger", "Unexplained weight loss", "Fatigue", "Blurred vision"],
        prevention: ["Maintain healthy weight", "Regular exercise", "Balanced diet", "Regular checkups", "Manage stress"],
        treatment: ["Insulin therapy", "Oral medications", "Blood sugar monitoring", "Dietary management", "Regular exercise"]
      },
      CancerRisk: {
        description: "Cancer is uncontrolled cell growth that can spread to other parts of the body. Early detection is crucial.",
        symptoms: ["Unexplained weight loss", "Fatigue", "Pain that doesn't go away", "Skin changes", "Changes in bowel/bladder habits"],
        prevention: ["Avoid tobacco", "Limit alcohol", "Healthy diet", "Regular exercise", "Sun protection", "Vaccinations"],
        treatment: ["Surgery", "Radiation therapy", "Chemotherapy", "Immunotherapy", "Targeted therapy", "Hormone therapy"]
      },
      Osteoporosis: {
        description: "Osteoporosis causes bones to become weak and brittle, increasing fracture risk.",
        symptoms: ["Back pain", "Loss of height", "Stooped posture", "Fractures from minor falls", "Bone pain"],
        prevention: ["Calcium and vitamin D", "Weight-bearing exercise", "Avoid smoking", "Limit alcohol", "Bone density tests"],
        treatment: ["Bisphosphonates", "Hormone therapy", "Calcium supplements", "Vitamin D", "Exercise programs"]
      },
      Arthritis: {
        description: "Arthritis is inflammation of joints causing pain, stiffness, and reduced mobility.",
        symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced range of motion", "Redness", "Warmth in joints"],
        prevention: ["Maintain healthy weight", "Regular exercise", "Protect joints", "Avoid repetitive stress", "Proper posture"],
        treatment: ["Anti-inflammatory drugs", "Pain relievers", "Physical therapy", "Joint replacement surgery", "Exercise programs"]
      },
      Alzheimer: {
        description: "Alzheimer's is a progressive brain disease affecting memory, thinking, and behavior.",
        symptoms: ["Memory loss", "Difficulty with familiar tasks", "Language problems", "Poor judgment", "Mood changes", "Confusion"],
        prevention: ["Regular exercise", "Healthy diet", "Mental stimulation", "Social engagement", "Manage cardiovascular health"],
        treatment: ["Cholinesterase inhibitors", "Memantine", "Behavioral therapy", "Cognitive training", "Supportive care"]
      },
      Depression: {
        description: "Depression is a mood disorder causing persistent sadness and loss of interest.",
        symptoms: ["Persistent sadness", "Loss of interest", "Sleep changes", "Appetite changes", "Difficulty concentrating", "Thoughts of death"],
        prevention: ["Regular exercise", "Healthy diet", "Adequate sleep", "Stress management", "Social connections"],
        treatment: ["Antidepressants", "Psychotherapy", "Lifestyle changes", "Support groups", "Electroconvulsive therapy"]
      }
    };

    // Calculate disease risks
    const diseaseRisks = {
      HeartAttack: 0,
      LungDisease: 0,
      KidneyDisease: 0,
      LiverDisease: 0,
      Stroke: 0,
      Diabetes: 0,
      CancerRisk: 0,
      Osteoporosis: 0,
      Arthritis: 0,
      Alzheimer: 0,
      Depression: 0
    };

    // Heart Attack Risk
    if (age > 55) diseaseRisks.HeartAttack += 25;
    if (bloodPressure > 140) diseaseRisks.HeartAttack += 30;
    if (cholesterol > 240) diseaseRisks.HeartAttack += 25;
    if (smoking === 1) diseaseRisks.HeartAttack += 35;
    if (familyHistory === 1) diseaseRisks.HeartAttack += 20;
    if (bmi > 30) diseaseRisks.HeartAttack += 15;

    // Lung Disease Risk
    if (smoking === 1) diseaseRisks.LungDisease += 40;
    if (age > 60) diseaseRisks.LungDisease += 20;
    if (alcohol === 1) diseaseRisks.LungDisease += 15;
    if (activity === 0) diseaseRisks.LungDisease += 10;

    // Kidney Disease Risk
    if (bloodPressure > 130) diseaseRisks.KidneyDisease += 25;
    if (glucose > 130) diseaseRisks.KidneyDisease += 20;
    if (age > 60) diseaseRisks.KidneyDisease += 20;
    if (familyHistory === 1) diseaseRisks.KidneyDisease += 15;
    if (alcohol === 1) diseaseRisks.KidneyDisease += 10;

    // Liver Disease Risk
    if (alcohol === 1) diseaseRisks.LiverDisease += 35;
    if (age > 50) diseaseRisks.LiverDisease += 15;
    if (bmi > 30) diseaseRisks.LiverDisease += 20;

    // Stroke Risk
    if (bloodPressure > 140) diseaseRisks.Stroke += 30;
    if (age > 65) diseaseRisks.Stroke += 25;
    if (smoking === 1) diseaseRisks.Stroke += 20;
    if (cholesterol > 240) diseaseRisks.Stroke += 15;

    // Diabetes Risk
    if (glucose > 125) diseaseRisks.Diabetes += 35;
    if (bmi > 25) diseaseRisks.Diabetes += 25;
    if (age > 45) diseaseRisks.Diabetes += 20;
    if (familyHistory === 1) diseaseRisks.Diabetes += 15;
    if (activity === 0) diseaseRisks.Diabetes += 15;

    // Cancer Risk
    if (age > 50) diseaseRisks.CancerRisk += 25;
    if (smoking === 1) diseaseRisks.CancerRisk += 30;
    if (alcohol === 1) diseaseRisks.CancerRisk += 20;
    if (familyHistory === 1) diseaseRisks.CancerRisk += 25;
    if (bmi > 30) diseaseRisks.CancerRisk += 15;

    // Osteoporosis Risk
    if (age > 50) diseaseRisks.Osteoporosis += 30;
    if (gender === 0) diseaseRisks.Osteoporosis += 20; // Higher risk for women
    if (activity === 0) diseaseRisks.Osteoporosis += 15;
    if (bmi < 18.5) diseaseRisks.Osteoporosis += 10;

    // Arthritis Risk
    if (age > 50) diseaseRisks.Arthritis += 25;
    if (bmi > 30) diseaseRisks.Arthritis += 20;
    if (familyHistory === 1) diseaseRisks.Arthritis += 15;
    if (activity === 0) diseaseRisks.Arthritis += 10;

    // Alzheimer Risk
    if (age > 65) diseaseRisks.Alzheimer += 35;
    if (familyHistory === 1) diseaseRisks.Alzheimer += 25;
    if (activity === 0) diseaseRisks.Alzheimer += 15;
    if (bmi > 30) diseaseRisks.Alzheimer += 10;

    // Depression Risk
    if (age > 50) diseaseRisks.Depression += 20;
    if (alcohol === 1) diseaseRisks.Depression += 15;
    if (activity === 0) diseaseRisks.Depression += 20;
    if (familyHistory === 1) diseaseRisks.Depression += 10;

    // Normalize all risks to 0-100 scale
    Object.keys(diseaseRisks).forEach(key => {
      diseaseRisks[key as keyof typeof diseaseRisks] = Math.min(100, Math.max(0, diseaseRisks[key as keyof typeof diseaseRisks]));
    });

    // Calculate overall health score
    const avgRisk = Object.values(diseaseRisks).reduce((a, b) => a + b, 0) / Object.keys(diseaseRisks).length;
    score = Math.max(0, 100 - avgRisk);

    // Generate recommendations based on highest risks
    const sortedRisks = Object.entries(diseaseRisks).sort(([, a], [, b]) => b - a);
    const topRisks = sortedRisks.slice(0, 3);

    if (topRisks[0][1] > 50) {
      const diseaseName = topRisks[0][0].replace(/([A-Z])/g, ' $1');
      recommendations.push(`High ${diseaseName} risk detected. Consult healthcare provider for screening.`);
    }

    if (smoking === 1) {
      recommendations.push("Quit smoking immediately - major risk factor for multiple diseases");
    }

    if (alcohol === 1) {
      recommendations.push("Limit alcohol consumption to reduce liver and cancer risks");
    }

    if (activity === 0) {
      recommendations.push("Increase physical activity - essential for disease prevention");
    }

    if (bmi > 30) {
      recommendations.push("Weight management needed - obesity increases multiple disease risks");
    }

    if (bloodPressure > 140) {
      recommendations.push("Control blood pressure - critical for heart and stroke prevention");
    }

    if (recommendations.length === 0) {
      recommendations.push("Continue maintaining your healthy lifestyle!");
    }

    let riskLevel = "Low";
    let overallHealth = "Excellent";
    
    if (score >= 80) {
      overallHealth = "Excellent";
      riskLevel = "Low";
    } else if (score >= 60) {
      overallHealth = "Good";
      riskLevel = "Moderate";
    } else if (score >= 40) {
      overallHealth = "Fair";
      riskLevel = "Moderate-High";
    } else {
      overallHealth = "Needs Attention";
      riskLevel = "High";
    }

    return {
      OverallHealth: overallHealth,
      RiskLevel: riskLevel,
      Recommendations: recommendations,
      DiseaseRisks: diseaseRisks,
      DiseaseDescriptions: diseaseDescriptions
    };
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
      // Calculate health assessment locally
      const result = calculateHealthScore();
      setAssessment(result);

      // Save to Firebase
      const user = getCurrentUser();
      if (user) {
        await savePatientData({
          ...patientData,
          userId: user.uid,
          assessment: result,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      setError("Failed to save assessment. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          Health Assessment Form
        </CardTitle>
        <CardDescription>
          Complete this health assessment to receive personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div>
                <Label htmlFor="Age">Age</Label>
                <Input
                  id="Age"
                  type="number"
                  value={patientData.Age}
                  onChange={(e) => handleInputChange("Age", e.target.value)}
                  placeholder="Enter your age"
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
                  value={patientData.BMI}
                  onChange={(e) => handleInputChange("BMI", e.target.value)}
                  placeholder="Enter your BMI"
                  min="10"
                  max="50"
                />
              </div>
            </div>

            {/* Health Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Metrics</h3>
              
              <div>
                <Label htmlFor="BloodPressure">Blood Pressure (mmHg)</Label>
                <Input
                  id="BloodPressure"
                  type="number"
                  value={patientData.BloodPressure}
                  onChange={(e) => handleInputChange("BloodPressure", e.target.value)}
                  placeholder="e.g., 120"
                  min="80"
                  max="200"
                />
              </div>

              <div>
                <Label htmlFor="Cholesterol">Cholesterol (mg/dL)</Label>
                <Input
                  id="Cholesterol"
                  type="number"
                  value={patientData.Cholesterol}
                  onChange={(e) => handleInputChange("Cholesterol", e.target.value)}
                  placeholder="e.g., 200"
                  min="100"
                  max="400"
                />
              </div>

              <div>
                <Label htmlFor="Glucose">Glucose (mg/dL)</Label>
                <Input
                  id="Glucose"
                  type="number"
                  value={patientData.Glucose}
                  onChange={(e) => handleInputChange("Glucose", e.target.value)}
                  placeholder="e.g., 95"
                  min="50"
                  max="300"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lifestyle Factors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="Smoking">Do you smoke?</Label>
                <Select value={patientData.Smoking} onValueChange={(value) => handleInputChange("Smoking", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="AlcoholIntake">Do you consume alcohol?</Label>
                <Select value={patientData.AlcoholIntake} onValueChange={(value) => handleInputChange("AlcoholIntake", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="PhysicalActivity">Physical Activity Level</Label>
                <Select value={patientData.PhysicalActivity} onValueChange={(value) => handleInputChange("PhysicalActivity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Low (Rarely exercise)</SelectItem>
                    <SelectItem value="1">Moderate (1-3 times/week)</SelectItem>
                    <SelectItem value="2">High (4+ times/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="FamilyHistory">Family History of Chronic Diseases</Label>
                <Select value={patientData.FamilyHistory} onValueChange={(value) => handleInputChange("FamilyHistory", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assessing...
              </>
            ) : (
              "Get Health Assessment"
            )}
          </Button>
        </form>

        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {assessment && (
          <div className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-600" />
                  Your Health Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {assessment.OverallHealth}
                    </div>
                    <div className="text-sm text-gray-600">Overall Health</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {assessment.RiskLevel}
                    </div>
                    <div className="text-sm text-gray-600">Risk Level</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {assessment.Recommendations.length}
                    </div>
                    <div className="text-sm text-gray-600">Recommendations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Disease Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">
                      {assessment.DiseaseRisks.HeartAttack}%
                    </div>
                    <div className="text-sm text-gray-600">Heart Attack</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {assessment.DiseaseRisks.LungDisease}%
                    </div>
                    <div className="text-sm text-gray-600">Lung Disease</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {assessment.DiseaseRisks.KidneyDisease}%
                    </div>
                    <div className="text-sm text-gray-600">Kidney Disease</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600">
                      {assessment.DiseaseRisks.LiverDisease}%
                    </div>
                    <div className="text-sm text-gray-600">Liver Disease</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {assessment.DiseaseRisks.Stroke}%
                    </div>
                    <div className="text-sm text-gray-600">Stroke</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">
                      {assessment.DiseaseRisks.Diabetes}%
                    </div>
                    <div className="text-sm text-gray-600">Diabetes</div>
                  </div>
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-xl font-bold text-pink-600">
                      {assessment.DiseaseRisks.CancerRisk}%
                    </div>
                    <div className="text-sm text-gray-600">Cancer Risk</div>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600">
                      {assessment.DiseaseRisks.Osteoporosis}%
                    </div>
                    <div className="text-sm text-gray-600">Osteoporosis</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-xl font-bold text-teal-600">
                      {assessment.DiseaseRisks.Arthritis}%
                    </div>
                    <div className="text-sm text-gray-600">Arthritis</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-600">
                      {assessment.DiseaseRisks.Alzheimer}%
                    </div>
                    <div className="text-sm text-gray-600">Alzheimer</div>
                  </div>
                  <div className="text-center p-4 bg-cyan-50 rounded-lg">
                    <div className="text-xl font-bold text-cyan-600">
                      {assessment.DiseaseRisks.Depression}%
                    </div>
                    <div className="text-sm text-gray-600">Depression</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disease Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Disease Information & Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(assessment.DiseaseRisks)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 4)
                    .map(([disease, risk]) => {
                      const diseaseInfo = assessment.DiseaseDescriptions[disease];
                      const riskLevel = risk > 70 ? 'High' : risk > 40 ? 'Moderate' : 'Low';
                      const riskColor = risk > 70 ? 'text-red-600' : risk > 40 ? 'text-yellow-600' : 'text-green-600';
                      
                      return (
                        <div key={disease} className="border border-border rounded-xl p-6 bg-gradient-to-br from-white to-gray-50">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800">{disease.replace(/([A-Z])/g, ' $1')}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-2xl font-bold ${riskColor}`}>{risk}%</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                  riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {riskLevel} Risk
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">About This Condition</h5>
                              <p className="text-sm text-gray-600 leading-relaxed">{diseaseInfo.description}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Common Symptoms</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {diseaseInfo.symptoms.slice(0, 3).map((symptom, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>{symptom}</span>
                                  </li>
                                ))}
                                {diseaseInfo.symptoms.length > 3 && (
                                  <li className="text-sm text-blue-600 font-medium">
                                    +{diseaseInfo.symptoms.length - 3} more symptoms
                                  </li>
                                )}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Prevention Strategies</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {diseaseInfo.prevention.slice(0, 3).map((prevention, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>{prevention}</span>
                                  </li>
                                ))}
                                {diseaseInfo.prevention.length > 3 && (
                                  <li className="text-sm text-green-600 font-medium">
                                    +{diseaseInfo.prevention.length - 3} more prevention methods
                                  </li>
                                )}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-700 mb-2">Treatment Options</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {diseaseInfo.treatment.slice(0, 3).map((treatment, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    <span>{treatment}</span>
                                  </li>
                                ))}
                                {diseaseInfo.treatment.length > 3 && (
                                  <li className="text-sm text-purple-600 font-medium">
                                    +{diseaseInfo.treatment.length - 3} more treatment options
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.Recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Droplets className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
