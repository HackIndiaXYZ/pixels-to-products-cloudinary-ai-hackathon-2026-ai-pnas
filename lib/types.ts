// Core types for AI-PNAS application

export type Sex = 'M' | 'F';
export type NutritionStatus = 'SAM' | 'MAM' | 'Underweight' | 'Normal' | 'Overweight' | 'Obesity';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type TrafficLight = 'Red' | 'Yellow' | 'Green' | 'Unavailable';

export interface ChildData {
  id?: string;
  patientId?: string;
  name: string;
  imageUrl?: string;
  dateOfBirth?: string;
  age: number;
  sex: Sex;
  measurementType?: 'length' | 'height';
  assessmentSetting?: string;
  religion?: string;
  continent?: string;
  country?: string;
  region?: string;
  zone?: string;
  woreda?: string;
  kebele?: string;
  pmh?: string;
  fatherAge?: number;
  fatherHealthStatus?: string;
  fatherCauseOfDeath?: string;
  motherAge?: number;
  motherHealthStatus?: string;
  motherCauseOfDeath?: string;
  siblingsHistory?: string;
  familialDiseases?: string;
  earlyDevelopment?: string;
  educationalBackground?: string;
  socialActivities?: string;
  workRecordIncome?: string;
  dietHabits?: string;
  alcoholUse?: string;
  tobaccoUse?: string;
  drugUse?: string;
  herbUse?: string;
  addictions?: string;
  bpSystolic?: number;
  bpDiastolic?: number;
  bpArterySite?: string;
  bpPosition?: string;
  bpGrade?: string;
  pulseRate?: number;
  pulseSite?: string;
  pulseRhythm?: string;
  pulseVolume?: string;
  rrRate?: number;
  rrPattern?: string;
  temperature?: number;
  temperatureSite?: string;
  temperatureTime?: string;
  spo2?: number;
  oxygenSupport?: string;
  height: number;
  weight: number;
  muac: number;
  heightSource?: string;
  weightSource?: string;
  headCircumference?: number;
  chestCircumference?: number;
  edema?: boolean;
  edemaDetails?: string;
  skinChanges?: string;
  hairChanges?: string;
  eyeSigns?: string;
  oralSigns?: string;
  hearingLossDevelopmentalDelay?: string;
  generalAppearance?: string;
}

export interface ZScoreEntry {
  value: number | null;
  label: TrafficLight;
  interpretation: string;
}

export interface ClassificationDetails {
  muacStatus: string;
  bmiStatus: string;
  wasting: boolean;
  stunting: boolean;
  underweight: boolean;
  riskFactors: string[];
  physicalSignAlerts: string[];
  vitalSignAlerts: string[];
  zScores: {
    weightForAge: ZScoreEntry;
    heightForAge: ZScoreEntry;
    weightForHeight: ZScoreEntry;
    bmiForAge: ZScoreEntry;
    muac: ZScoreEntry;
  };
}

export interface NutritionAnalysisResult {
  childId: string;
  name: string;
  imageUrl?: string | null;
  age: number;
  sex: Sex;
  weight: number;
  height: number;
  muac: number;
  bmi: number;
  nutritionStatus: NutritionStatus;
  riskLevel: RiskLevel;
  classification: string;
  recommendation: string;
  referralSuggestion: string;
  reportSummary: string;
  physicalSignAlerts: string[];
  vitalSignAlerts: string[];
  zScores: ClassificationDetails['zScores'];
  timestamp: Date;
}

export interface MedicalRecommendation {
  nutrition: string;
  followUp: string;
  referral: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}
